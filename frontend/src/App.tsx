import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import QuickActions from './components/QuickActions';
import CurrentCard from './components/CurrentCard';
import ForecastList from './components/ForecastList';
import AiSummary from './components/AiSummary';
import UsageBadge from './components/UsageBadge';
import { CloudIcon } from './components/Icons';
import { fetchGeocodeSuggestions, fetchWeatherByCoords, fetchWeatherByIp } from './api';
import type { GeocodeSuggestion, NormalizedWeather } from './types';
import './App.css';

type LastLookup = { type: 'coords'; lat: number; lon: number; locationName: string } | { type: 'ip' };

export default function App() {
  const [cityInput, setCityInput] = useState('');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [weather, setWeather] = useState<NormalizedWeather | null>(null);
  const [status, setStatus] = useState<{ message: string; error: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastLookup, setLastLookup] = useState<LastLookup | null>(null);

  const loadWeather = async (task: () => Promise<NormalizedWeather>) => {
    setLoading(true);
    setStatus(null);
    try {
      setWeather(await task());
    } catch (err) {
      setStatus({ message: err instanceof Error ? err.message : 'Something went wrong.', error: true });
    } finally {
      setLoading(false);
    }
  };

  // Re-run the last lookup when units changes so results refresh without a manual re-search.
  useEffect(() => {
    if (!lastLookup) return;
    if (lastLookup.type === 'coords') {
      loadWeather(() => fetchWeatherByCoords(lastLookup.lat, lastLookup.lon, units, lastLookup.locationName));
    } else {
      loadWeather(() => fetchWeatherByIp(units));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: 'Searching…', error: false });
    try {
      const results = await fetchGeocodeSuggestions(cityInput);
      if (results.length === 0) {
        setStatus({ message: `No results for "${cityInput}".`, error: true });
        return;
      }
      setSuggestions(results);
      setStatus(null);
    } catch (err) {
      setStatus({ message: err instanceof Error ? err.message : 'Search failed.', error: true });
    }
  };

  const selectSuggestion = (suggestion: GeocodeSuggestion) => {
    setSuggestions([]);
    const locationName = [suggestion.name, suggestion.admin1, suggestion.country].filter(Boolean).join(', ');
    setLastLookup({ type: 'coords', lat: suggestion.lat, lon: suggestion.lon, locationName });
    loadWeather(() => fetchWeatherByCoords(suggestion.lat, suggestion.lon, units, locationName));
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setStatus({ message: 'Geolocation is not supported by this browser.', error: true });
      return;
    }
    setStatus({ message: 'Getting your location…', error: false });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLastLookup({ type: 'coords', lat: pos.coords.latitude, lon: pos.coords.longitude, locationName: 'My location' });
        loadWeather(() =>
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, units, 'My location')
        );
      },
      () => setStatus({ message: 'Location access denied.', error: true })
    );
  };

  const handleDetectIp = () => {
    setStatus({ message: 'Detecting location by IP…', error: false });
    setLastLookup({ type: 'ip' });
    loadWeather(() => fetchWeatherByIp(units));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1><CloudIcon size={26} /> WeatherAI Dashboard</h1>
        <p className="subtitle">
          Real-time conditions, forecasts &amp; AI summaries — powered by{' '}
          <a href="https://weather-ai.co" target="_blank" rel="noopener noreferrer">WeatherAI</a>
        </p>
      </header>

      <SearchBar
        cityInput={cityInput}
        onCityInputChange={setCityInput}
        onSearch={handleSearch}
        suggestions={suggestions}
        onSelectSuggestion={selectSuggestion}
      />

      <div className="layout">
        <aside className="sidebar">
          <QuickActions
            onLocate={handleLocate}
            onDetectIp={handleDetectIp}
            units={units}
            onUnitsChange={setUnits}
          />
          <UsageBadge />
        </aside>

        <main className="main-content">
          {status && <section className={`status ${status.error ? 'error' : ''}`}>{status.message}</section>}
          {loading && <section className="status">Loading…</section>}

          {weather ? (
            <section className="result">
              <CurrentCard weather={weather} />
              <AiSummary summary={weather.aiSummary} />
              <ForecastList forecast={weather.forecast} hourly={weather.hourly} units={weather.units} />
            </section>
          ) : (
            !status && !loading && (
              <section className="empty-state">
                <p>Search a city or use your location to see current conditions.</p>
              </section>
            )
          )}
        </main>
      </div>
    </div>
  );
}
