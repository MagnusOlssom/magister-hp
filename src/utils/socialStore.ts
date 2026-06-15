import { useSyncExternalStore } from 'react';
import { buildSeedState, SEED_VERSION } from '../data/socialSeed';
import type { Profile, SocialState, SocialUser } from '../types';
import { uid } from './helpers';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from './storage';

/**
 * Data-lager för den lokala forum-prototypen.
 *
 * Allt går genom det här modulen – komponenterna läser via useSocial() och
 * muterar via funktionerna nedan. localStorage är källan nu; byt ut load/save
 * och mutationerna mot ett API-anrop när en riktig backend kopplas in, så
 * behöver UI:t inte röras.
 */

export const ME_ID = 'me';

function init(): SocialState {
  const stored = loadFromStorage<SocialState | null>(STORAGE_KEYS.social, null);
  if (stored && stored.version === SEED_VERSION) return stored;
  const seeded = buildSeedState(Date.now());
  saveToStorage(STORAGE_KEYS.social, seeded);
  return seeded;
}

let state: SocialState = init();
const listeners = new Set<() => void>();

function setState(next: SocialState) {
  state = next;
  saveToStorage(STORAGE_KEYS.social, next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getState(): SocialState {
  return state;
}

/** React-hook: returnerar aktuellt social-state och uppdateras vid mutationer. */
export function useSocial(): SocialState {
  return useSyncExternalStore(subscribe, getState, getState);
}

/** Slå upp en användare för visning. ME_ID speglar den lokala profilen. */
export function resolveUser(
  s: SocialState,
  id: string,
  profile: Profile,
): SocialUser {
  if (id === ME_ID) {
    return { id: ME_ID, name: profile.name.trim() || 'Du', faculty: profile.faculty, avatar: profile.avatar };
  }
  return s.users[id] ?? { id, name: 'Okänd användare' };
}

const nowIso = () => new Date().toISOString();

// ------------------------------------------------------------ Feed

export function addPost(body: string): void {
  const text = body.trim();
  if (!text) return;
  setState({
    ...state,
    posts: [
      { id: uid(), authorId: ME_ID, body: text, createdAt: nowIso(), likeCount: 0, likedByMe: false, comments: [] },
      ...state.posts,
    ],
  });
}

export function toggleLike(postId: string): void {
  setState({
    ...state,
    posts: state.posts.map((p) =>
      p.id === postId
        ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likeCount + (p.likedByMe ? -1 : 1) }
        : p,
    ),
  });
}

export function addPostComment(postId: string, body: string): void {
  const text = body.trim();
  if (!text) return;
  setState({
    ...state,
    posts: state.posts.map((p) =>
      p.id === postId
        ? { ...p, comments: [...p.comments, { id: uid(), authorId: ME_ID, body: text, createdAt: nowIso() }] }
        : p,
    ),
  });
}

// ------------------------------------------------------------ Diskussioner

export function addThread(areaId: string, title: string, body: string): string {
  const id = uid();
  const ts = nowIso();
  setState({
    ...state,
    threads: [
      { id, areaId, authorId: ME_ID, title: title.trim(), body: body.trim(), createdAt: ts, views: 0, comments: [], lastActivityAt: ts },
      ...state.threads,
    ],
  });
  return id;
}

export function addThreadComment(threadId: string, body: string): void {
  const text = body.trim();
  if (!text) return;
  const ts = nowIso();
  setState({
    ...state,
    threads: state.threads.map((t) =>
      t.id === threadId
        ? {
            ...t,
            comments: [...t.comments, { id: uid(), authorId: ME_ID, body: text, createdAt: ts }],
            lastActivityAt: ts,
          }
        : t,
    ),
  });
}

const viewedThisSession = new Set<string>();

export function markThreadViewed(threadId: string): void {
  if (viewedThisSession.has(threadId)) return;
  viewedThisSession.add(threadId);
  setState({
    ...state,
    threads: state.threads.map((t) => (t.id === threadId ? { ...t, views: t.views + 1 } : t)),
  });
}

// ------------------------------------------------------------ Chatt

export function addChatMessage(roomId: string, body: string): void {
  const text = body.trim();
  if (!text) return;
  setState({
    ...state,
    chatRooms: state.chatRooms.map((r) =>
      r.id === roomId
        ? { ...r, messages: [...r.messages, { id: uid(), authorId: ME_ID, body: text, createdAt: nowIso() }] }
        : r,
    ),
  });
}

// ------------------------------------------------------------ Reset

export function resetSocial(): void {
  viewedThisSession.clear();
  setState(buildSeedState(Date.now()));
}
