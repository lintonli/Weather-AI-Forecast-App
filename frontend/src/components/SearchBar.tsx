import React from 'react';

interface Props {
  cityInput: string;
  onCityInputChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onLocate: () => void;
  onDetectIp: () => void;
  units: 'metric' | 'imperial';
  onUnitsChange: (units: 'metric' | 'imperial') => void;
  suggestions: { name: string; country?: string; admin1?: string; lat: number; lon: number }[];
  onSelectSuggestion: (lat: number, lon: number) => void;
}

export default function SearchBar({
  cityInput,
  onCityInputChange,
  onSearch,
  onLocate,
  onDetectIp,
  units,
  onUnitsChange,
  suggestions,
  onSelectSuggestion,
}: Props) {
  return (
    <section className="controls">
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

      <div className="quick-actions">
        <button type="button" onClick={onLocate}>📍 Use my location</button>
        <button type="button" onClick={onDetectIp}>🌐 Detect by IP</button>
        <select value={units} onChange={(e) => onUnitsChange(e.target.value as 'metric' | 'imperial')}>
          <option value="metric">°C (metric)</option>
          <option value="imperial">°F (imperial)</option>
        </select>
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li key={`${s.name}-${i}`} onClick={() => onSelectSuggestion(s.lat, s.lon)}>
              {s.name}{s.admin1 ? `, ${s.admin1}` : ''}{s.country ? `, ${s.country}` : ''}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
