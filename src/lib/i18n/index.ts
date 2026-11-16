import { useCallback } from "react";
import { en, type MessageKey } from "./en";
import { pt } from "./pt";
import { es } from "./es";
import { fr } from "./fr";
import { de } from "./de";
import { it } from "./it";
import { ja } from "./ja";
import { zh } from "./zh";
import { useSettings } from "@/lib/store/settings";

export type { MessageKey };

export const LANGUAGES = [
  { code: "en", label: "English", model: "English" },
  { code: "pt", label: "Português", model: "European Portuguese" },
  { code: "es", label: "Español", model: "Spanish" },
  { code: "fr", label: "Français", model: "French" },
  { code: "de", label: "Deutsch", model: "German" },
  { code: "it", label: "Italiano", model: "Italian" },
  { code: "ja", label: "日本語", model: "Japanese" },
  { code: "zh", label: "中文", model: "Simplified Chinese" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

const dictionaries: Record<LanguageCode, Partial<Record<MessageKey, string>>> = {
  en,
  pt,
  es,
  fr,
  de,
  it,
  ja,
  zh,
};

export function translate(
  lang: LanguageCode,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  let out = dictionaries[lang]?.[key] ?? en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
  }
  return out;
}

export function useT() {
  const lang = useSettings((s) => s.profile.language);
  return useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang],
  );
}

export function languageLabel(code: LanguageCode) {
  return LANGUAGES.find((l) => l.code === code)?.label ?? code;
}
