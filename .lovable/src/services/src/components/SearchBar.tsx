import React, { useState } from 'react';
import { type SearchEngine } from '../schemas/search-engine';
import { useEngineAutocomplete } from '../hooks/use-engine-autocomplete';
import { resolveSearchUrl } from '../services/search-resolver';

interface SearchBarProps {
  engines: readonly SearchEngine[];
  defaultEngine: SearchEngine;
  onNavigate: (url: string) => void;
}

export function SearchBar({
  engines,
  defaultEngine,
  onNavigate,
}: SearchBarProps): React.JSX.Element {
  const [query, setQuery] = useState('');
  const suggestions = useEngineAutocomplete(query, engines);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!query.trim()) return;

    const resolved = resolveSearchUrl(query, engines, defaultEngine);
    onNavigate(resolved.url);
  };

  const handleSelectSuggestion = (shortcut: string): void => {
    setQuery(`!${shortcut} `);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search or type !gh, !mdn, !claude..."
          aria-label="Search input"
        />
        <button type="submit">Search</button>
      </form>

      {suggestions.length > 0 && (
        <ul role="listbox" aria-label="Search engine shortcuts">
          {suggestions.map(({ engine, matchedShortcut }) => (
            <li key={engine.title}>
              <button
                type="button"
                onClick={() => handleSelectSuggestion(matchedShortcut)}
              >
                <strong>!{matchedShortcut}</strong> — {engine.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
