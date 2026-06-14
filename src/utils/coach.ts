import { CATEGORIES, CATEGORY_MAP, KVANT_CATEGORIES, VERBAL_CATEGORIES } from '../data/categories';
import type { CategoryId, Profile, SessionRecord } from '../types';
import { calculatePrognosis, type PrognosisResult } from './prognosis';
import { getCategoryStats } from './stats';

/**
 * Coach Jens v1 – regelbaserad analysmotor.
 *
 * All "AI-text" genereras lokalt ur strukturerade signaler. Jens hittar
 * aldrig på något: varje mening bygger på en uträknad signal med tillräckligt
 * underlag. Lägg en riktig modell bakom genereringen senare genom att byta ut
 * texterna nedan mot ett API-anrop som matas med samma signaler.
 */

export const COACH_NAME = 'Jens';

/** Antal övningar per delprov som krävs för att låsa upp första analysen. */
export const UNLOCK_PER_SUBTEST = 10;

const pct = (v: number) => `${Math.round(v * 100)} %`;

// ---------------------------------------------------------------- Upplåsning

export interface SubtestProgress {
  category: CategoryId;
  answered: number;
  remaining: number;
  done: boolean;
  accuracy: number | null;
}

export interface UnlockProgress {
  unlocked: boolean;
  completed: number;
  total: number;
  subtests: SubtestProgress[];
}

// ---------------------------------------------------------------- Aggregering

type Confidence = 'none' | 'low' | 'normal';

function confidenceOf(answered: number): Confidence {
  if (answered < UNLOCK_PER_SUBTEST) return 'none';
  if (answered < 20) return 'low';
  return 'normal';
}

interface SubAgg {
  category: CategoryId;
  answered: number;
  correct: number;
  timedAnswered: number;
  timedCorrect: number;
  timedTimeSec: number;
  untimedAnswered: number;
  untimedCorrect: number;
  /** Pass i kronologisk ordning (äldst först) för trendanalys. */
  sessions: Array<{ at: number; answered: number; correct: number }>;
  /** Antal fel i det senaste passet i delprovet (för repetitionssignal). */
  lastSessionMistakes: number;
}

function emptyAgg(category: CategoryId): SubAgg {
  return {
    category,
    answered: 0,
    correct: 0,
    timedAnswered: 0,
    timedCorrect: 0,
    timedTimeSec: 0,
    untimedAnswered: 0,
    untimedCorrect: 0,
    sessions: [],
    lastSessionMistakes: 0,
  };
}

function aggregate(sessions: SessionRecord[]): Record<CategoryId, SubAgg> {
  const map = {} as Record<CategoryId, SubAgg>;
  for (const meta of CATEGORIES) map[meta.id] = emptyAgg(meta.id);

  const asc = [...sessions].sort(
    (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
  );
  const latestAt: Partial<Record<CategoryId, number>> = {};

  for (const s of asc) {
    const agg = map[s.category];
    if (!agg) continue;
    const ans = s.answered.length;
    const cor = s.correctCount;
    agg.answered += ans;
    agg.correct += cor;
    if (s.timed) {
      agg.timedAnswered += ans;
      agg.timedCorrect += cor;
      agg.timedTimeSec += s.totalTimeSec;
    } else {
      agg.untimedAnswered += ans;
      agg.untimedCorrect += cor;
    }
    const at = new Date(s.startedAt).getTime();
    agg.sessions.push({ at, answered: ans, correct: cor });
    if (latestAt[s.category] === undefined || at >= latestAt[s.category]!) {
      latestAt[s.category] = at;
      agg.lastSessionMistakes = ans - cor;
    }
  }
  return map;
}

const acc = (correct: number, answered: number): number | null =>
  answered > 0 ? correct / answered : null;

type Trend = 'improving' | 'plateau' | 'declining' | 'unknown';

function trendOf(agg: SubAgg): Trend {
  if (agg.answered < UNLOCK_PER_SUBTEST || agg.sessions.length < 2) return 'unknown';
  const half = Math.floor(agg.sessions.length / 2);
  const older = agg.sessions.slice(0, half);
  const recent = agg.sessions.slice(half);
  const sum = (arr: typeof agg.sessions, key: 'answered' | 'correct') =>
    arr.reduce((s, x) => s + x[key], 0);
  const o = acc(sum(older, 'correct'), sum(older, 'answered'));
  const r = acc(sum(recent, 'correct'), sum(recent, 'answered'));
  if (o === null || r === null) return 'unknown';
  if (r - o >= 0.1) return 'improving';
  if (r - o <= -0.1) return 'declining';
  return 'plateau';
}

// ---------------------------------------------------------------- Publikt API

export function getUnlockProgress(sessions: SessionRecord[]): UnlockProgress {
  const agg = aggregate(sessions);
  const subtests: SubtestProgress[] = CATEGORIES.map((m) => {
    const a = agg[m.id];
    return {
      category: m.id,
      answered: a.answered,
      remaining: Math.max(0, UNLOCK_PER_SUBTEST - a.answered),
      done: a.answered >= UNLOCK_PER_SUBTEST,
      accuracy: acc(a.correct, a.answered),
    };
  });
  const completed = subtests.filter((s) => s.done).length;
  return { unlocked: completed === CATEGORIES.length, completed, total: CATEGORIES.length, subtests };
}

export type RecKind = 'timed' | 'untimed';

export interface Recommendation {
  id: string;
  category: CategoryId;
  kind: RecKind;
  title: string;
  reason: string;
  href: string;
}

export interface Observation {
  text: string;
  tone: 'positive' | 'warning' | 'neutral';
}

export interface CoachAnalysis {
  prognosis: PrognosisResult | null;
  headline: string;
  observations: Observation[];
  /** Topp 3 till panelen "Coach rekommenderar". */
  recommendations: Recommendation[];
  /** Hela den rankade listan – veckoschemat bygger på denna (samma källa). */
  allRecommendations: Recommendation[];
  strongest: CategoryId | null;
  weakest: CategoryId | null;
  examDaysLeft: number | null;
}

export function hrefFor(category: CategoryId, kind: RecKind): string {
  return `/trana?kategori=${encodeURIComponent(category)}&start=1${kind === 'untimed' ? '&tid=0' : ''}`;
}

function titleFor(category: CategoryId, kind: RecKind): string {
  return kind === 'timed'
    ? `Gör ett ${category}-delprov med tid`
    : `Gör ett ${category}-delprov utan tid`;
}

function daysUntil(examDate: string | undefined, now: number): number | null {
  if (!examDate) return null;
  const t = new Date(examDate + 'T00:00:00').getTime();
  if (Number.isNaN(t)) return null;
  return Math.round((t - now) / 86_400_000);
}

/**
 * Bygger Jens fullständiga analys. `now` injiceras för testbarhet och för att
 * hålla funktionen ren (kalla med Date.now() från komponenten).
 */
export function buildCoachAnalysis(
  sessions: SessionRecord[],
  profile: Profile,
  now: number,
): CoachAnalysis {
  const prognosis = calculatePrognosis(sessions);
  const agg = aggregate(sessions);

  // Delprov med tillräckligt underlag, sorterade på träffsäkerhet.
  const qualified = CATEGORIES.map((m) => agg[m.id])
    .filter((a) => a.answered >= UNLOCK_PER_SUBTEST && acc(a.correct, a.answered) !== null)
    .sort((a, b) => acc(b.correct, b.answered)! - acc(a.correct, a.answered)!);

  const strongest = qualified.length > 0 ? qualified[0].category : null;
  const weakest = qualified.length >= 2 ? qualified[qualified.length - 1].category : null;

  // Tajmat vs otajmat på helheten.
  let tA = 0,
    tC = 0,
    uA = 0,
    uC = 0;
  for (const m of CATEGORIES) {
    tA += agg[m.id].timedAnswered;
    tC += agg[m.id].timedCorrect;
    uA += agg[m.id].untimedAnswered;
    uC += agg[m.id].untimedCorrect;
  }
  const timedAcc = tA >= 5 ? tC / tA : null;
  const untimedAcc = uA >= 5 ? uC / uA : null;
  const speedGap = timedAcc !== null && untimedAcc !== null ? untimedAcc - timedAcc : null;
  const speedIssue = speedGap !== null && speedGap >= 0.12;

  const examDaysLeft = daysUntil(profile.examDate, now);
  const examNear = examDaysLeft !== null && examDaysLeft >= 0 && examDaysLeft <= 30;

  // Träningsbalans.
  const verbalAnswered = VERBAL_CATEGORIES.reduce((s, c) => s + agg[c].answered, 0);
  const kvantAnswered = KVANT_CATEGORIES.reduce((s, c) => s + agg[c].answered, 0);
  const totalAnswered = verbalAnswered + kvantAnswered;

  const subtestKind = (category: CategoryId): RecKind => {
    const a = agg[category];
    const tAcc = a.timedAnswered >= 5 ? a.timedCorrect / a.timedAnswered : null;
    const uAcc = a.untimedAnswered >= 5 ? a.untimedCorrect / a.untimedAnswered : null;
    if (tAcc !== null && uAcc !== null && uAcc - tAcc >= 0.12) return 'timed';
    if (examNear) return 'timed';
    return 'untimed';
  };

  const paceSlow = (category: CategoryId): boolean => {
    const a = agg[category];
    if (a.timedAnswered < 8) return false;
    const avg = a.timedTimeSec / a.timedAnswered;
    return avg > CATEGORY_MAP[category].secondsPerQuestion * 1.25;
  };

  // -------------------------------------------------------------- Rekommendationer
  type Candidate = Recommendation & { priority: number };
  const cands: Candidate[] = [];
  const mk = (
    category: CategoryId,
    kind: RecKind,
    reason: string,
    priority: number,
  ): Candidate => ({
    id: `${category}-${kind}`,
    category,
    kind,
    title: titleFor(category, kind),
    reason,
    href: hrefFor(category, kind),
    priority,
  });

  // 1. Svagaste delprovet med underlag.
  if (weakest) {
    const a = agg[weakest];
    const name = CATEGORY_MAP[weakest].name;
    const accuracy = acc(a.correct, a.answered)!;
    const kind = subtestKind(weakest);
    const reason =
      kind === 'timed'
        ? `${name} är din svagaste del med tillräckligt underlag (${pct(accuracy)} rätt) och du tappar mest under tidspress. Träna med tid för att vänja dig vid tempot.`
        : `${name} är din svagaste del med tillräckligt underlag (${pct(accuracy)} rätt). Träna i lugn takt och läs förklaringarna – fokusera på att förstå, inte på klockan.`;
    cands.push(mk(weakest, kind, reason, 100));
  }

  // 2. Delprov som förbättras snabbt och har kvar att ge.
  for (const a of qualified) {
    if (trendOf(a) === 'improving' && acc(a.correct, a.answered)! < 0.85) {
      const name = CATEGORY_MAP[a.category].name;
      const kind = subtestKind(a.category);
      cands.push(
        mk(
          a.category,
          kind,
          `Din ${name} förbättras snabbare än dina andra delar just nu. Passa på att fortsätta där medan utvecklingen är stark.`,
          80,
        ),
      );
      break;
    }
  }

  // 3. Delprov där du är för långsam under tid.
  for (const m of CATEGORIES) {
    if (paceSlow(m.id)) {
      const a = agg[m.id];
      const avg = Math.round(a.timedTimeSec / a.timedAnswered);
      const name = CATEGORY_MAP[m.id].name;
      cands.push(
        mk(
          m.id,
          'timed',
          `Du lägger i snitt ${avg} s per fråga på ${name} mot rekommenderade ${CATEGORY_MAP[m.id].secondsPerQuestion} s. Ett tajmat delprov hjälper dig hitta tempot.`,
          70,
        ),
      );
      break;
    }
  }

  // 4. Generellt fart-problem → tajma ett delprov du redan behärskar.
  if (speedIssue && strongest) {
    const name = CATEGORY_MAP[strongest].name;
    cands.push(
      mk(
        strongest,
        'timed',
        `Du presterar tydligt bättre utan tid än med (${pct(untimedAcc!)} mot ${pct(timedAcc!)}). Träna ${name} under tidspress för att stänga gapet.`,
        65,
      ),
    );
  }

  // 5. Försummat delprov – fyll datagapet.
  const neglected = CATEGORIES.map((m) => agg[m.id])
    .filter((a) => a.answered > 0 && a.answered < UNLOCK_PER_SUBTEST)
    .sort((a, b) => a.answered - b.answered)[0];
  if (neglected) {
    const name = CATEGORY_MAP[neglected.category].name;
    cands.push(
      mk(
        neglected.category,
        examNear ? 'timed' : 'untimed',
        `Du har tränat lite på ${name} jämfört med dina andra delar. Fyll luckan så får ${COACH_NAME} bättre underlag att analysera.`,
        50,
      ),
    );
  }

  // 6. Fallback så det alltid finns minst en rekommendation.
  if (cands.length === 0 && qualified.length > 0) {
    const a = qualified[qualified.length - 1];
    cands.push(
      mk(
        a.category,
        examNear ? 'timed' : 'untimed',
        `Fortsätt bygga underlag i ${CATEGORY_MAP[a.category].name} så blir analysen ännu vassare.`,
        10,
      ),
    );
  }

  // Dedupa per delprov och prioritetsordna. allRecommendations = hela rankade
  // listan (delas med veckoschemat så att schema och topp-3 aldrig kan säga emot
  // varandra), recommendations = topp 3 till panelen "Coach rekommenderar".
  const seen = new Set<CategoryId>();
  const allRecommendations = cands
    .sort((a, b) => b.priority - a.priority)
    .filter((c) => (seen.has(c.category) ? false : (seen.add(c.category), true)))
    .map(({ priority: _priority, ...rec }) => rec);
  const recommendations = allRecommendations.slice(0, 3);

  // -------------------------------------------------------------- Observationer
  const observations: Observation[] = [];

  if (strongest) {
    const a = agg[strongest];
    const conf = confidenceOf(a.answered);
    observations.push({
      tone: 'positive',
      text: `Du är starkast i ${CATEGORY_MAP[strongest].name} (${pct(acc(a.correct, a.answered)!)} rätt)${
        conf === 'low' ? ', men på relativt få frågor än så länge' : ''
      }.`,
    });
  }
  if (weakest) {
    const a = agg[weakest];
    observations.push({
      tone: 'warning',
      text: `${CATEGORY_MAP[weakest].name} är din svagaste del (${pct(acc(a.correct, a.answered)!)} rätt) – det är här mest poäng finns att hämta.`,
    });
  }
  if (speedIssue) {
    observations.push({
      tone: 'warning',
      text: `Du tappar runt ${Math.round(speedGap! * 100)} procentenheter när du tränar med tid jämfört med utan. Tidspressen är en tydlig faktor för dig.`,
    });
  }
  // Trender på svaga delar.
  for (const a of qualified) {
    const t = trendOf(a);
    if (t === 'improving') {
      observations.push({
        tone: 'positive',
        text: `${CATEGORY_MAP[a.category].name} pekar uppåt – du har förbättrats i dina senaste pass.`,
      });
      break;
    }
  }
  // Balans.
  if (totalAnswered >= 30) {
    const verbalShare = verbalAnswered / totalAnswered;
    if (verbalShare >= 0.7) {
      observations.push({
        tone: 'warning',
        text: 'Du tränar mest på den verbala delen. Väg upp med mer kvantitativ träning för en jämnare prognos.',
      });
    } else if (verbalShare <= 0.3) {
      observations.push({
        tone: 'warning',
        text: 'Du tränar mest på den kvantitativa delen. Lägg in mer verbal träning för en jämnare prognos.',
      });
    }
  }
  // Försiktig om underlaget är tunt.
  const thin = CATEGORIES.map((m) => agg[m.id]).filter(
    (a) => a.answered >= UNLOCK_PER_SUBTEST && a.answered < 20,
  );
  if (thin.length >= 3) {
    observations.push({
      tone: 'neutral',
      text: `${COACH_NAME} har relativt få frågor i flera delprov ännu – fler övningar gör analysen säkrare.`,
    });
  }

  // -------------------------------------------------------------- Rubriktext
  let headline: string;
  if (prognosis) {
    const scoreStr = prognosis.score.toFixed(2).replace('.', ',');
    const weakName = weakest ? CATEGORY_MAP[weakest].name : null;
    headline = weakName
      ? `Din prognos ligger runt ${scoreStr}. Det som mest håller dig tillbaka just nu är ${weakName} – fixar du den lyfter hela resultatet.`
      : `Din prognos ligger runt ${scoreStr}. Fortsätt träna jämnt så fortsätter den uppåt.`;
    if (examNear) {
      headline += ` Provet är bara ${examDaysLeft} dagar bort, så nu växlar vi in på tajmad träning.`;
    }
  } else {
    headline = `${COACH_NAME} behöver mer data innan han kan ge en träffsäker analys.`;
  }

  return {
    prognosis,
    headline,
    observations,
    recommendations,
    allRecommendations,
    strongest,
    weakest,
    examDaysLeft,
  };
}

/**
 * Bredare backlog för veckoschemat: de högt prioriterade rekommendationerna
 * först (samma källa som "Coach rekommenderar"), därefter ett pass per
 * kvalificerat delprov, svagast först – så att en hel vecka får variation och
 * täcker fler delar utan att säga emot rekommendationerna.
 */
export function buildWeeklyMenu(
  analysis: CoachAnalysis,
  sessions: SessionRecord[],
): Recommendation[] {
  const menu = analysis.allRecommendations.slice();
  const seen = new Set<CategoryId>(menu.map((r) => r.category));
  const examNear =
    analysis.examDaysLeft !== null && analysis.examDaysLeft >= 0 && analysis.examDaysLeft <= 30;
  const kind: RecKind = examNear ? 'timed' : 'untimed';

  const weakestFirst = getCategoryStats(sessions)
    .filter((s) => s.answered >= UNLOCK_PER_SUBTEST && s.accuracy !== null)
    .sort((a, b) => a.accuracy! - b.accuracy!);

  for (const s of weakestFirst) {
    if (seen.has(s.category)) continue;
    seen.add(s.category);
    menu.push({
      id: `${s.category}-${kind}`,
      category: s.category,
      kind,
      title: titleFor(s.category, kind),
      reason: '',
      href: hrefFor(s.category, kind),
    });
  }
  return menu;
}
