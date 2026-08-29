import type { NormalizedWeather } from '../types';

const unitSymbol = (units: 'metric' | 'imperial') => (units === 'metric' ? '°C' : '°F');

export default function CurrentCard({ weather }: { weather: NormalizedWeather }) {
  const { current, locationName, units } = weather;
  const symbol = unitSymbol(units);

  return (
    <div className="current-card">
      <div className="current-main">
        <h2>{locationName}</h2>
        {current.time && <p className="muted">{current.time}</p>}
        <div className="temp-row">
          <span className="temp">{current.temperature !== null ? `${Math.round(current.temperature)}°` : '--°'}</span>
          <span className="condition">{current.condition}</span>
        </div>
      </div>
      <div className="current-details">
        <div><span className="label">Feels like</span>{current.feelsLike !== null ? `${Math.round(current.feelsLike)}${symbol}` : '--'}</div>
        <div><span className="label">Humidity</span>{current.humidity !== null ? `${current.humidity}%` : '--'}</div>
        <div><span className="label">Wind</span>{current.windSpeed !== null ? `${current.windSpeed} ${units === 'metric' ? 'km/h' : 'mph'}` : '--'}</div>
        <div><span className="label">Precipitation</span>{current.precipitation !== null ? `${current.precipitation} mm` : '--'}</div>
      </div>
    </div>
  );
}
