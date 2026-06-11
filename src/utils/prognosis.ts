import { KVANT_CATEGORIES, VERBAL_CATEGORIES } from '../data/categories';
import type { CategoryId, SessionRecord } from '../types';
import { clamp } from './helpers';

export interface PrognosisResult {
  /** Uppskattat normerat resultat 0,00–2,00 (i steg om 0,05). */
  score: number;
  verbalAccuracy: number | null;
  kvantAccuracy: number | null;
  totalAnswered: number;
  /** True när prognosen bygger på tillräckligt många frågor. */
  reliable: boolean;
}

/** Minsta antal besvarade frågor innan prognosen markeras som pålitlig. */
export const MIN_QUESTIONS_FOR_RELIABLE = 10;

/** Hur snabbt äldre sessioner tappar vikt (per session bakåt i tiden). */
const RECENCY_DECAY = 0.88;

/** Otajmade pass väger mindre än tajmade – provet skrivs ju på tid. */
const UNTIMED_WEIGHT = 0.6;

/**
 * Ankarpunkter (andel rätt -> normerad poäng) som efterliknar provets
 * normering: ca 50 % rätt ger runt 0,9 och 90 % rätt runt 1,8.
 */
const SCORE_ANCHORS: Array<[number, number]> = [
  [0, 0],
  [0.3, 0.4],
  [0.5, 0.9],
  [0.7, 1.3],
  [0.85, 1.65],
  [1, 2],
];

export function accuracyToScore(accuracy: number): number {
  const a = clamp(accuracy, 0, 1);
  for (let i = 1; i < SCORE_ANCHORS.length; i++) {
    const [x1, y1] = SCORE_ANCHORS[i - 1];
    const [x2, y2] = SCORE_ANCHORS[i];
    if (a <= x2) {
      const t = (a - x1) / (x2 - x1);
      return y1 + t * (y2 - y1);
    }
  }
  return 2;
}

interface WeightedTally {
  weightedCorrect: number;
  weightedAnswered: number;
}

/**
 * Beräknar en prognos av högskoleprovsresultatet (0,0–2,0) utifrån
 * användarens sessionshistorik. Nyare sessioner väger tyngre, tajmade
 * sessioner väger tyngre än otajmade, och verbal/kvantitativ del vägs
 * samman precis som på det riktiga provet.
 */
export function calculatePrognosis(sessions: SessionRecord[]): PrognosisResult | null {
  const withAnswers = sessions.filter((s) => s.answered.length > 0);
  if (withAnswers.length === 0) return null;

  // Nyast först, så att index = avstånd i tiden.
  const sorted = [...withAnswers].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );

  const tally = new Map<CategoryId, WeightedTally>();
  let totalAnswered = 0;

  sorted.forEach((session, ageRank) => {
    const weight = Math.pow(RECENCY_DECAY, ageRank) * (session.timed ? 1 : UNTIMED_WEIGHT);
    const entry = tally.get(session.category) ?? { weightedCorrect: 0, weightedAnswered: 0 };
    entry.weightedCorrect += session.correctCount * weight;
    entry.weightedAnswered += session.answered.length * weight;
    tally.set(session.category, entry);
    totalAnswered += session.answered.length;
  });

  const partAccuracy = (categories: CategoryId[]): number | null => {
    let correct = 0;
    let answered = 0;
    for (const cat of categories) {
      const entry = tally.get(cat);
      if (entry) {
        correct += entry.weightedCorrect;
        answered += entry.weightedAnswered;
      }
    }
    return answered > 0 ? correct / answered : null;
  };

  const verbalAccuracy = partAccuracy(VERBAL_CATEGORIES);
  const kvantAccuracy = partAccuracy(KVANT_CATEGORIES);

  let overall: number;
  if (verbalAccuracy !== null && kvantAccuracy !== null) {
    overall = (verbalAccuracy + kvantAccuracy) / 2;
  } else {
    overall = verbalAccuracy ?? kvantAccuracy ?? 0;
  }

  // Avrunda till närmaste 0,05 – som den riktiga normeringen.
  const score = clamp(Math.round(accuracyToScore(overall) / 0.05) * 0.05, 0, 2);

  return {
    score,
    verbalAccuracy,
    kvantAccuracy,
    totalAnswered,
    reliable: totalAnswered >= MIN_QUESTIONS_FOR_RELIABLE,
  };
}
