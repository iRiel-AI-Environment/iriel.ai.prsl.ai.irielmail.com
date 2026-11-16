import { useSyncExternalStore } from "react";
import type { LanguageCode } from "@/lib/i18n";
import type { AgentId, CustomSource, ExperienceId } from "./types";

export type PlanId = "free" | "standard" | "plus" | "advanced";

export interface Settings {
  profile: { name: string; email: string; timezone: string; language: LanguageCode };
  experience: ExperienceId;
  plan: PlanId;
  memoryEnabled: boolean;
  federation: boolean;
  webAccess: boolean;
  motion: "full" | "reduced";
  glow: number;
  responseStyle: "concise" | "balanced" | "detailed";
  defaultPrivate: boolean;
  disabledAgents: AgentId[];
  defaultEngine: string; // "iriel" or engine title
  federatedEngines: string[];
  disabledCollections: string[];
  customSources: CustomSource[];
}

export const DEFAULT_SETTINGS: Settings = {
  profile: { name: "Robert", email: "robert@prsl.ai", timezone: "Europe/Lisbon", language: "en" },
  experience: "everyday",
  plan: "free",
  memoryEnabled: true,
  federation: true,
  webAccess: true,
  motion: "full",
  glow: 60,
  responseStyle: "balanced",
  defaultPrivate: false,
  disabledAgents: [],
  defaultEngine: "iriel",
  federatedEngines: ["Google", "DuckDuckGo", "Wikipedia", "Github"],
  disabledCollections: [],
  customSources: [],
};

const KEY = "iriel.settings.v1";
let state: Settings = DEFAULT_SETTINGS;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      state = {
        ...DEFAULT_SETTINGS,
        ...parsed,
        profile: { ...DEFAULT_SETTINGS.profile, ...(parsed.profile ?? {}) },
      };
    }
  } catch {
    state = DEFAULT_SETTINGS;
  }
}

export function getSettings() {
  load();
  return state;
}

export function updateSettings(patch: Partial<Settings> | ((s: Settings) => Partial<Settings>)) {
  load();
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable */
  }
  if (next.profile?.language && typeof document !== "undefined") {
    document.documentElement.lang = next.profile.language;
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

let hydrated = false;
const hydrationListeners = new Set<() => void>();
export function markSettingsHydrated() {
  if (hydrated) return;
  load();
  hydrated = true;
  if (typeof document !== "undefined") document.documentElement.lang = state.profile.language;
  hydrationListeners.forEach((l) => l());
  listeners.forEach((l) => l());
}

/** Server and first client render use defaults; persisted values apply after hydration. */
export function useSettings<T>(selector: (s: Settings) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(hydrated ? getSettings() : DEFAULT_SETTINGS),
    () => selector(DEFAULT_SETTINGS),
  );
}
