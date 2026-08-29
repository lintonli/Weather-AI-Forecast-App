import { useState } from 'react';
import SearchBar from './components/SearchBar';
import QuickActions from './components/QuickActions';
import CurrentCard from './components/CurrentCard';
import ForecastList from './components/ForecastList';
import AiSummary from './components/AiSummary';
import UsageBadge from './components/UsageBadge';
import SmsPanel from './components/SmsPanel';
import { CloudIcon } from './components/Icons';
import { fetchGeocodeSuggestions, fetchWeatherByCoords, fetchWeatherByIp } from './api';
import type { GeocodeSuggestion, NormalizedWeather } from './types';
import './App.css';

export default function App() {
  const [cityInput, setCityInput] = useState('');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [weather, setWeather] = useState<NormalizedWeather | null>(null);
  const [status, setStatus] = useState<{ message: string; error: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

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

  const selectSuggestion = (lat: number, lon: number) => {
    setSuggestions([]);
    loadWeather(() => fetchWeatherByCoords(lat, lon, units));
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setStatus({ message: 'Geolocation is not supported by this browser.', error: true });
      return;
    }
    setStatus({ message: 'Getting your location…', error: false });
    navigator.geolocation.getCurrentPosition(
      (pos) => loadWeather(() => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, units)),
      () => setStatus({ message: 'Location access denied.', error: true })
    );
  };

  const handleDetectIp = () => {
    setStatus({ message: 'Detecting location by IP…', error: false });
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
          <SmsPanel />
        </aside>

        <main className="main-content">
          {status && <section className={`status ${status.error ? 'error' : ''}`}>{status.message}</section>}
          {loading && <section className="status">Loading…</section>}

          {weather ? (
            <section className="result">
              <CurrentCard weather={weather} />
              <AiSummary summary={weather.aiSummary} />
              <ForecastList forecast={weather.forecast} />
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
