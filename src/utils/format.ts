/** 1.35 -> "1,35" (svensk decimalkomma). */
export function formatScore(score: number): string {
  return score.toFixed(2).replace('.', ',');
}

/** 0.78 -> "78 %". */
export function formatPercent(ratio: number | null): string {
  if (ratio === null || Number.isNaN(ratio)) return '–';
  return `${Math.round(ratio * 100)} %`;
}

/** Sekunder -> "1 tim 5 min", "12 min", "45 s". */
export function formatDuration(totalSec: number): string {
  const sec = Math.round(totalSec);
  if (sec < 60) return `${sec} s`;
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;
  if (hours > 0) return minutes > 0 ? `${hours} tim ${minutes} min` : `${hours} tim`;
  return seconds > 0 ? `${minutes} min ${seconds} s` : `${minutes} min`;
}

/** Sekunder -> "07:45" (nedräkningsklocka). */
export function formatClock(totalSec: number): string {
  const sec = Math.max(0, Math.round(totalSec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** ISO-datum -> "11 juni 14:32" (med år om det inte är innevarande år). */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '–';
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat('sv-SE', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
