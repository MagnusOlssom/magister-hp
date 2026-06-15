import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Profile, SessionRecord, Theme } from '../types';
import { resetSocial } from '../utils/socialStore';
import { loadFromStorage, removeFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const DEFAULT_PROFILE: Profile = {
  name: '',
  goalScore: 1.5,
};

interface AppContextValue {
  profile: Profile;
  sessions: SessionRecord[];
  theme: Theme;
  updateProfile: (changes: Partial<Profile>) => void;
  addSession: (session: SessionRecord) => void;
  clearHistory: () => void;
  resetAll: () => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function getInitialTheme(): Theme {
  const stored = loadFromStorage<Theme | null>(STORAGE_KEYS.theme, null);
  if (stored === 'light' || stored === 'dark') return stored;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => ({
    ...DEFAULT_PROFILE,
    ...loadFromStorage<Partial<Profile>>(STORAGE_KEYS.profile, {}),
  }));
  const [sessions, setSessions] = useState<SessionRecord[]>(() =>
    loadFromStorage<SessionRecord[]>(STORAGE_KEYS.sessions, []),
  );
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.profile, profile);
  }, [profile]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.sessions, sessions);
  }, [sessions]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveToStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const updateProfile = useCallback((changes: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...changes }));
  }, []);

  const addSession = useCallback((session: SessionRecord) => {
    setSessions((prev) => [session, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setSessions([]);
    removeFromStorage(STORAGE_KEYS.sessions);
  }, []);

  const resetAll = useCallback(() => {
    setSessions([]);
    setProfile(DEFAULT_PROFILE);
    removeFromStorage(STORAGE_KEYS.sessions);
    removeFromStorage(STORAGE_KEYS.profile);
    removeFromStorage(STORAGE_KEYS.schedule);
    resetSocial();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      profile,
      sessions,
      theme,
      updateProfile,
      addSession,
      clearHistory,
      resetAll,
      toggleTheme,
    }),
    [profile, sessions, theme, updateProfile, addSession, clearHistory, resetAll, toggleTheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp måste användas inom <AppProvider>');
  return ctx;
}
