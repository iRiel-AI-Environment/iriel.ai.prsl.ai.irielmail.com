import { searchEngines, type SearchEngine } from "./catalog";

export { searchEngines, type SearchEngine };

const byShortcut = new Map<string, SearchEngine>();
for (const e of searchEngines) for (const s of e.shortcuts) byShortcut.set(s.toLowerCase(), e);

export function findEngine(shortcut: string) {
  return byShortcut.get(shortcut.toLowerCase().replace(/^!/, ""));
}

export function findEngineByTitle(title: string) {
  return searchEngines.find((e) => e.title === title);
}

/** A complete "!shortcut" anywhere in the prompt routes the rest of it to that engine. */
export function parseBang(text: string): { engine: SearchEngine; query: string; shortcut: string } | null {
  const re = /(^|\s)!([a-z0-9]+)(?=\s|$)/i;
  const m = text.match(re);
  if (!m) return null;
  const engine = findEngine(m[2] ?? "");
  if (!engine) return null;
  const query = text.replace(re, " ").replace(/\s+/g, " ").trim();
  return { engine, query, shortcut: (m[2] ?? "").toLowerCase() };
}

/** The "!partial" token being typed at the end of the prompt, for autocomplete. */
export function bangInProgress(text: string): string | null {
  const m = text.match(/(?:^|\s)!([a-z0-9]*)$/i);
  return m ? (m[1] ?? "").toLowerCase() : null;
}

export function suggestEngines(partial: string, limit = 8) {
  const p = partial.toLowerCase();
  const scored: { e: SearchEngine; s: string; score: number }[] = [];
  for (const e of searchEngines) {
    for (const s of e.shortcuts) {
      let score = -1;
      if (s === p) score = 0;
      else if (s.startsWith(p)) score = 1 + s.length / 100;
      else if (p && e.title.toLowerCase().includes(p)) score = 3;
      if (score >= 0) {
        scored.push({ e, s, score });
        break;
      }
    }
  }
  return scored.sort((a, b) => a.score - b.score || a.s.localeCompare(b.s)).slice(0, limit);
}

export function engineUrl(engine: SearchEngine, query: string, preferDesktop = true) {
  const template = (preferDesktop ? engine.desktop : undefined) ?? engine.mobile ?? engine.desktop ?? "";
  return template.replace("%s", encodeURIComponent(query));
}

export function isAppScheme(engine: SearchEngine) {
  const url = engine.desktop ?? engine.mobile;
  return !/^https?:\/\//.test(url);
}

export function engineHost(engine: SearchEngine) {
  const url = engine.desktop ?? engine.mobile;
  try {
    return /^https?:/.test(url) ? new URL(url.replace("%s", "x")).hostname.replace(/^www\./, "") : undefined;
  } catch {
    return undefined;
  }
}

/** Favicons load from the network, so callers skip them in Private. */
export function engineFavicon(engine: SearchEngine) {
  if (engine.favicon?.startsWith("http")) return engine.favicon;
  const domain = engine.favicon ?? engineHost(engine);
  return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64` : undefined;
}

export function openEngine(engine: SearchEngine, query: string) {
  const url = engineUrl(engine, query);
  if (isAppScheme(engine)) window.location.href = url;
  else window.open(url, "_blank", "noopener,noreferrer");
}
