const PREFIX = 'hpfokus:';

export const STORAGE_KEYS = {
  sessions: `${PREFIX}sessions`,
  profile: `${PREFIX}profile`,
  theme: `${PREFIX}theme`,
  schedule: `${PREFIX}schedule`,
} as const;

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage kan vara fullt eller blockerat (t.ex. privat läge) – ignorera tyst.
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignorera
  }
}
