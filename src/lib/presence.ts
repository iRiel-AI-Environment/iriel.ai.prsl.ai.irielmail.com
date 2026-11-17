import { useSyncExternalStore } from "react";

interface PresenceStore {
  listening: boolean;
  level: number;
  busy: boolean;
}

let state: PresenceStore = { listening: false, level: 0, busy: false };
const listeners = new Set<() => void>();
const INITIAL = state;

export function setPresence(patch: Partial<PresenceStore>) {
  const next = { ...state, ...patch };
  if (next.listening === state.listening && next.level === state.level && next.busy === state.busy)
    return;
  state = next;
  listeners.forEach((l) => l());
}

export function usePresence<T>(sel: (s: PresenceStore) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => sel(state),
    () => sel(INITIAL),
  );
}
