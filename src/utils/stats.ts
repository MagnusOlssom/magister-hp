import { CATEGORIES } from '../data/categories';
import type { CategoryId, SessionRecord } from '../types';

export interface OverallStats {
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number | null;
  sessionCount: number;
  totalTimeSec: number;
}

export function getOverallStats(sessions: SessionRecord[]): OverallStats {
  let totalAnswered = 0;
  let totalCorrect = 0;
  let totalTimeSec = 0;
  for (const s of sessions) {
    totalAnswered += s.answered.length;
    totalCorrect += s.correctCount;
    totalTimeSec += s.totalTimeSec;
  }
  return {
    totalAnswered,
    totalCorrect,
    accuracy: totalAnswered > 0 ? totalCorrect / totalAnswered : null,
    sessionCount: sessions.length,
    totalTimeSec,
  };
}

export interface CategoryStat {
  category: CategoryId;
  answered: number;
  correct: number;
  accuracy: number | null;
  avgTimeSec: number | null;
  sessions: number;
}

/** Statistik per kategori, i samma ordning som CATEGORIES (alla 8 ingår alltid). */
export function getCategoryStats(sessions: SessionRecord[]): CategoryStat[] {
  const byCategory = new Map<CategoryId, { answered: number; correct: number; time: number; sessions: number }>();

  for (const s of sessions) {
    const entry =
      byCategory.get(s.category) ?? { answered: 0, correct: 0, time: 0, sessions: 0 };
    entry.sessions += 1;
    for (const a of s.answered) {
      entry.answered += 1;
      if (a.correct) entry.correct += 1;
      entry.time += a.timeSpentSec;
    }
    byCategory.set(s.category, entry);
  }

  return CATEGORIES.map((meta) => {
    const entry = byCategory.get(meta.id);
    return {
      category: meta.id,
      answered: entry?.answered ?? 0,
      correct: entry?.correct ?? 0,
      accuracy: entry && entry.answered > 0 ? entry.correct / entry.answered : null,
      avgTimeSec: entry && entry.answered > 0 ? entry.time / entry.answered : null,
      sessions: entry?.sessions ?? 0,
    };
  });
}

/** Bästa och svagaste kategori bland dem med tillräckligt underlag. */
export function getBestAndWeakest(
  stats: CategoryStat[],
  minAnswered = 5,
): { best: CategoryStat | null; weakest: CategoryStat | null } {
  const qualified = stats
    .filter((s) => s.answered >= minAnswered && s.accuracy !== null)
    .sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0));

  return {
    best: qualified[0] ?? null,
    weakest: qualified.length >= 2 ? qualified[qualified.length - 1] : null,
  };
}
