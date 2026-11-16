import { type SearchEngine } from '../schemas/search-engine';

export type RouteAction =
  | { type: 'LOCAL_AI'; prompt: string }
  | { type: 'EXTERNAL_SEARCH'; engine: SearchEngine; url: string; query: string };

export function routeUserInput(
  rawInput: string,
  engines: readonly SearchEngine[]
): RouteAction {
  const trimmed = rawInput.trim();
  const [firstToken, ...rest] = trimmed.split(/\s+/);

  // Atalhos explícitos (ex: !gh react, gh react) direcionam para motores externos
  if (firstToken && rest.length > 0) {
    const normalizedPrefix = firstToken.replace(/^!/, '').toLowerCase();
    const matchedEngine = engines.find((engine) =>
      engine.shortcuts.includes(normalizedPrefix)
    );

    if (matchedEngine) {
      const cleanQuery = rest.join(' ');
      return {
        type: 'EXTERNAL_SEARCH',
        engine: matchedEngine,
        query: cleanQuery,
        url: matchedEngine.mobile.replace('%s', encodeURIComponent(cleanQuery)),
      };
    }
  }

  // Comportamento padrão ("Ask or Search with iRiel"): IA Local On-Device
  return {
    type: 'LOCAL_AI',
    prompt: trimmed,
  };
}
