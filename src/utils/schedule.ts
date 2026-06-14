import { CATEGORY_MAP } from '../data/categories';
import { poolSize } from '../data/questions';
import type { CategoryId, Profile, SessionRecord } from '../types';
import {
  buildCoachAnalysis,
  buildWeeklyMenu,
  getUnlockProgress,
  hrefFor,
  type CoachAnalysis,
  type RecKind,
  type Recommendation,
} from './coach';
import { clamp } from './helpers';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from './storage';

/**
 * Veckans schema. Genereras ur exakt samma rankade lista som "Coach
 * rekommenderar" (coach.ts), men fryses per vecka i localStorage så att planen
 * inte ändrar sig mitt i veckan när man tränar. Avbockning sker automatiskt
 * genom att matcha veckans pass mot uppgifterna.
 */

/** Dagsetiketter, index 0 = måndag … 6 = söndag. */
export const DAY_LABELS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
export const DAY_LABELS_LONG = [
  'Måndag',
  'Tisdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Lördag',
  'Söndag',
];

/** Nästa vecka förhandsvisas från söndag kl 17. */
export const PREVIEW_HOUR = 17;

const MIN_WEEKLY_MINUTES = 60;
const MAX_WEEKLY_MINUTES = 900;
const STEP = 30;

export interface ScheduledTask {
  id: string;
  day: number; // 0 = måndag … 6 = söndag
  category: CategoryId;
  kind: RecKind;
  questionCount: number;
  estMinutes: number;
  label: string;
  href: string;
  /** Tillagd i efterhand från en live-rekommendation (visas som "Ny"). */
  isNew?: boolean;
}

export interface WeekSchedule {
  weekKey: string; // måndagens datum, yyyy-mm-dd
  weekStartMs: number;
  generatedAt: number;
  signature: string;
  recommendedMinutes: number;
  tasks: ScheduledTask[];
}

export interface WeekView {
  current: WeekSchedule;
  /** Endast söndag kväll från kl 17 – annars null. */
  next: WeekSchedule | null;
  /** Live-rekommendationer som inte fanns i den frysta planen (markerade "Ny"). */
  newTasks: ScheduledTask[];
  effectiveMinutes: number;
  autoMinutes: number;
  isOverride: boolean;
}

type ScheduleStore = Record<string, WeekSchedule>;

// ---------------------------------------------------------------- Datumhjälp

/** Måndagen (00:00 lokal tid) i veckan som innehåller `ts`. */
function startOfWeekMs(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  const mondayIdx = (d.getDay() + 6) % 7; // 0 = måndag
  d.setDate(d.getDate() - mondayIdx);
  return d.getTime();
}

/** Lägg till en vecka, DST-säkert (behåller lokal midnatt). */
function addWeek(weekStartMs: number): number {
  const d = new Date(weekStartMs);
  d.setDate(d.getDate() + 7);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function weekKeyOf(weekStartMs: number): string {
  const d = new Date(weekStartMs);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function formatHours(minutes: number): string {
  const h = minutes / 60;
  const s = Number.isInteger(h) ? String(h) : h.toFixed(1).replace('.', ',');
  return `${s} tim`;
}

// ---------------------------------------------------------------- Pluggtid

function roundMinutes(m: number): number {
  return clamp(Math.round(m / STEP) * STEP, MIN_WEEKLY_MINUTES, MAX_WEEKLY_MINUTES);
}

/**
 * Rekommenderad pluggtid: utgår från gapet mål − prognos (mål vs nuläge) och
 * justeras för förbättringshastighet (ingen tydlig uppgång → lite mer tid).
 */
function minutesFromAnalysis(analysis: CoachAnalysis, goalScore: number): number {
  if (!analysis.prognosis) return 150;
  const gap = clamp(goalScore - analysis.prognosis.score, 0, 2);
  let minutes = 120 + gap * 240;
  const improving = analysis.observations.some(
    (o) => o.tone === 'positive' && /uppåt|förbättr/i.test(o.text),
  );
  if (!improving) minutes += 60;
  return roundMinutes(minutes);
}

// ---------------------------------------------------------------- Uppgifter

function taskSize(category: CategoryId, kind: RecKind): { count: number; est: number } {
  const count = Math.min(10, poolSize(category)) || 10;
  const sec = CATEGORY_MAP[category].secondsPerQuestion * count * (kind === 'timed' ? 1 : 1.3);
  return { count, est: Math.max(1, Math.round(sec / 60)) };
}

function labelFor(category: CategoryId, kind: RecKind, count: number): string {
  return `${category} · ${count} frågor ${kind === 'timed' ? 'på tid' : 'utan tid'}`;
}

/** Meny för låst läge: fyll på de delprov som ännu saknar underlag. */
function lockedMenu(sessions: SessionRecord[]): Recommendation[] {
  return getUnlockProgress(sessions)
    .subtests.filter((s) => !s.done)
    .sort((a, b) => a.remaining - b.remaining)
    .map((s) => ({
      id: `${s.category}-untimed`,
      category: s.category,
      kind: 'untimed' as RecKind,
      title: `Gör ett ${s.category}-delprov utan tid`,
      reason: `Du behöver ${s.remaining} övningar till i ${CATEGORY_MAP[s.category].name} för att låsa upp analysen.`,
      href: hrefFor(s.category, 'untimed'),
    }));
}

function buildTasks(
  menu: Recommendation[],
  recommendedMinutes: number,
  restDays: number[],
  weekKey: string,
): ScheduledTask[] {
  const allDays = [0, 1, 2, 3, 4, 5, 6];
  const active = allDays.filter((d) => !restDays.includes(d));
  const days = active.length > 0 ? active : allDays;
  if (menu.length === 0) return [];

  const maxTasks = Math.min(14, days.length * 2);
  const chosen: Array<{ rec: Recommendation; count: number; est: number }> = [];
  let total = 0;
  let i = 0;
  let guard = 0;
  while (chosen.length < maxTasks && guard < 500) {
    guard++;
    const rec = menu[i % menu.length];
    const { count, est } = taskSize(rec.category, rec.kind);
    if (chosen.length >= 1 && total + est > recommendedMinutes) break;
    chosen.push({ rec, count, est });
    total += est;
    i++;
  }

  const tasks: ScheduledTask[] = chosen.map((c, idx) => ({
    id: `${weekKey}-${idx}`,
    day: days[idx % days.length],
    category: c.rec.category,
    kind: c.rec.kind,
    questionCount: c.count,
    estMinutes: c.est,
    label: labelFor(c.rec.category, c.rec.kind, c.count),
    href: c.rec.href,
  }));
  // Stabil sortering på dag (V8 bevarar inbördes ordning = skapandeordning).
  return tasks.sort((a, b) => a.day - b.day);
}

// ---------------------------------------------------------------- Publikt API

/**
 * Säkerställer att aktuell vecka (och söndag kväll även nästa vecka) finns
 * genererad och fryst, beskär gamla veckor och returnerar vyn att rendera.
 */
export function ensureSchedule(
  sessions: SessionRecord[],
  profile: Profile,
  now: number,
): WeekView {
  const store = loadFromStorage<ScheduleStore>(STORAGE_KEYS.schedule, {});

  const curStart = startOfWeekMs(now);
  const curKey = weekKeyOf(curStart);
  const restDays = profile.restDays ?? [];
  const override = profile.weeklyStudyMinutes;
  // Signaturen speglar användarens inställningar, inte de uträknade signalerna,
  // så att veckan inte regenereras passivt när man tränar (men väl när man
  // ändrar pluggtid eller vilodagar).
  const signature = `${override ?? 'auto'}|${[...restDays].sort((a, b) => a - b).join(',')}`;

  const analysis = buildCoachAnalysis(sessions, profile, now);
  const unlocked = getUnlockProgress(sessions).unlocked;
  const menu = unlocked ? buildWeeklyMenu(analysis, sessions) : lockedMenu(sessions);
  const autoMinutes = minutesFromAnalysis(analysis, profile.goalScore);
  const effectiveMinutes = override ?? autoMinutes;

  const generate = (weekStartMs: number): WeekSchedule => {
    const weekKey = weekKeyOf(weekStartMs);
    return {
      weekKey,
      weekStartMs,
      generatedAt: now,
      signature,
      recommendedMinutes: effectiveMinutes,
      tasks: buildTasks(menu, effectiveMinutes, restDays, weekKey),
    };
  };

  let changed = false;
  if (!store[curKey] || store[curKey].signature !== signature) {
    store[curKey] = generate(curStart);
    changed = true;
  }

  const d = new Date(now);
  const showNext = d.getDay() === 0 && d.getHours() >= PREVIEW_HOUR; // söndag kväll
  let next: WeekSchedule | null = null;
  if (showNext) {
    const nextStart = addWeek(curStart);
    const nextKey = weekKeyOf(nextStart);
    if (!store[nextKey] || store[nextKey].signature !== signature) {
      store[nextKey] = generate(nextStart);
      changed = true;
    }
    next = store[nextKey];
  }

  // Beskär förflutna veckor (försvinner vid midnatt sön→mån).
  for (const key of Object.keys(store)) {
    if (store[key].weekStartMs < curStart) {
      delete store[key];
      changed = true;
    }
  }

  if (changed) saveToStorage(STORAGE_KEYS.schedule, store);

  // Live-rekommendationer som inte redan finns i den frysta planen läggs till
  // som nytillagda uppgifter, så schemat alltid speglar analysens råd.
  const current = store[curKey];
  let newTasks: ScheduledTask[] = [];
  if (unlocked) {
    const existing = new Set(current.tasks.map((t) => `${t.category}|${t.kind}`));
    const allDays = [0, 1, 2, 3, 4, 5, 6];
    const activeDays = allDays.filter((day) => !restDays.includes(day));
    const days = activeDays.length > 0 ? activeDays : allDays;
    const todayIdx = (new Date(now).getDay() + 6) % 7;
    const startAt = days.findIndex((day) => day >= todayIdx);
    const base = startAt >= 0 ? startAt : 0;
    newTasks = analysis.recommendations
      .filter((r) => !existing.has(`${r.category}|${r.kind}`))
      .map((r, i) => {
        const { count, est } = taskSize(r.category, r.kind);
        return {
          id: `${current.weekKey}-new-${r.category}-${r.kind}`,
          day: days[(base + i) % days.length],
          category: r.category,
          kind: r.kind,
          questionCount: count,
          estMinutes: est,
          label: labelFor(r.category, r.kind, count),
          href: r.href,
          isNew: true,
        };
      });
  }

  return {
    current,
    next,
    newTasks,
    effectiveMinutes,
    autoMinutes,
    isOverride: override !== undefined,
  };
}

/**
 * Avbockning (endast automatisk): en uppgift är klar om det finns ett matchande
 * pass under veckan (rätt delprov + tidsläge). Varje pass räknas för en uppgift.
 */
export function computeDoneTaskIds(
  tasks: ScheduledTask[],
  weekStartMs: number,
  sessions: SessionRecord[],
): Set<string> {
  const start = weekStartMs;
  const end = addWeek(start);
  const inWeek = sessions.filter((s) => {
    const t = new Date(s.startedAt).getTime();
    return t >= start && t < end && s.answered.length > 0;
  });
  const used = new Set<string>();
  const done = new Set<string>();
  for (const task of tasks) {
    const match = inWeek.find(
      (s) => !used.has(s.id) && s.category === task.category && s.timed === (task.kind === 'timed'),
    );
    if (match) {
      used.add(match.id);
      done.add(task.id);
    }
  }
  return done;
}
