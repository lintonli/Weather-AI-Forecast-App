import React from 'react';

interface Suggestion {
  name: string;
  country?: string;
  admin1?: string;
  lat: number;
  lon: number;
}

interface Props {
  cityInput: string;
  onCityInputChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  suggestions: Suggestion[];
  onSelectSuggestion: (suggestion: Suggestion) => void;
}

export default function SearchBar({
  cityInput,
  onCityInputChange,
  onSearch,
  suggestions,
  onSelectSuggestion,
}: Props) {
  return (
    <section className="search-bar">
      <form className="search-form" onSubmit={onSearch} autoComplete="off">
        <input
          type="text"
          placeholder="Search a city, e.g. Nairobi"
          value={cityInput}
          onChange={(e) => onCityInputChange(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li key={`${s.name}-${i}`} onClick={() => onSelectSuggestion(s)}>
              {s.name}{s.admin1 ? `, ${s.admin1}` : ''}{s.country ? `, ${s.country}` : ''}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
