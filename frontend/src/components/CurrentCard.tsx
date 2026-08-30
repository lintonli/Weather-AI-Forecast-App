import type { NormalizedWeather } from '../types';
import WeatherIcon from './WeatherIcon';
import { getWeatherCodeInfo, degreesToCompass } from '../weatherCodes';

const unitSymbol = (units: 'metric' | 'imperial') => (units === 'metric' ? '°C' : '°F');

export default function CurrentCard({ weather }: { weather: NormalizedWeather }) {
  const { current, locationName, units, forecast } = weather;
  const symbol = unitSymbol(units);
  const { label } = getWeatherCodeInfo(current.weatherCode);
  const todayPrecipitation = forecast[0]?.precipitation ?? null;

  return (
    <div className="current-card">
      <div className="current-main">
        <h2>{locationName}</h2>
        {current.time && <p className="muted">{current.time.replace('T', ' ')}</p>}
        <div className="temp-row">
          <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={48} />
          <span className="temp">{current.temperature !== null ? `${Math.round(current.temperature)}°` : '--°'}</span>
          <span className="condition">{label}</span>
        </div>
      </div>
      <div className="current-details">
        <div><span className="label">Wind</span>{current.windSpeed !== null ? `${current.windSpeed} ${units === 'metric' ? 'km/h' : 'mph'} ${degreesToCompass(current.windDirection)}` : '--'}</div>
        <div><span className="label">Daylight</span>{current.isDay ? 'Day' : 'Night'}</div>
        <div><span className="label">Precipitation today</span>{todayPrecipitation !== null ? `${todayPrecipitation} mm` : '--'}</div>
        <div><span className="label">Units</span>{symbol}</div>
      </div>
    </div>
  );
}
