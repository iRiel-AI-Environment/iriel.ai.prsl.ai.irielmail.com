import { type SearchEngine } from '../schemas/search-engine';

export interface ResolvedSearch {
  engine: SearchEngine;
  url: string;
  query: string;
}

export function resolveSearchUrl(
  rawInput: string,
  engines: readonly SearchEngine[],
  defaultEngine: SearchEngine
): ResolvedSearch {
  const trimmed = rawInput.trim();
  const [firstToken, ...rest] = trimmed.split(/\s+/);

  if (firstToken && rest.length > 0) {
    const normalizedPrefix = firstToken.replace(/^!/, '').toLowerCase();
    const matchedEngine = engines.find((engine) =>
      engine.shortcuts.includes(normalizedPrefix)
    );

    if (matchedEngine) {
      const cleanQuery = rest.join(' ');
      return {
        engine: matchedEngine,
        query: cleanQuery,
        url: matchedEngine.mobile.replace('%s', encodeURIComponent(cleanQuery)),
      };
    }
  }

  return {
    engine: defaultEngine,
    query: trimmed,
    url: defaultEngine.mobile.replace('%s', encodeURIComponent(trimmed)),
  };
}
