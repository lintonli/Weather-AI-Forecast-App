import { useState } from 'react';
import type { ForecastDay, HourlyPoint } from '../types';
import WeatherIcon from './WeatherIcon';
import { getWeatherCodeInfo } from '../weatherCodes';

interface Props {
  forecast: ForecastDay[];
  hourly: HourlyPoint[];
  units: 'metric' | 'imperial';
}

function formatDayLabel(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatHourLabel(time: string): string {
  const parsed = new Date(time);
  if (Number.isNaN(parsed.getTime())) return time;
  return parsed.toLocaleTimeString(undefined, { hour: 'numeric' });
}

export default function ForecastList({ forecast, hourly, units }: Props) {
  const [view, setView] = useState<'daily' | 'hourly'>('daily');

  if (forecast.length === 0 && hourly.length === 0) return null;

  return (
    <div className="forecast-section">
      <div className="forecast-header">
        <h3>Forecast</h3>
        <div className="forecast-tabs">
          <button
            type="button"
            className={view === 'daily' ? 'active' : ''}
            onClick={() => setView('daily')}
          >
            Daily
          </button>
          <button
            type="button"
            className={view === 'hourly' ? 'active' : ''}
            onClick={() => setView('hourly')}
          >
            Hourly
          </button>
        </div>
      </div>

      {view === 'daily' ? (
        <div className="forecast-list">
          {forecast.map((day, i) => {
            const { label } = getWeatherCodeInfo(day.weatherCode);
            return (
              <div className="forecast-day" key={`${day.date}-${i}`}>
                <div className="day-name">{day.date ? formatDayLabel(day.date) : `Day ${i + 1}`}</div>
                <WeatherIcon code={day.weatherCode} size={28} />
                <div className="day-condition">{label}</div>
                <div className="day-temp">
                  {day.tempMax !== null ? Math.round(day.tempMax) : '--'}° / {day.tempMin !== null ? Math.round(day.tempMin) : '--'}°
                </div>
                {day.precipitation !== null && day.precipitation > 0 && (
                  <div className="day-precip">{day.precipitation} mm</div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="forecast-list">
          {hourly.slice(0, 48).map((hour, i) => (
            <div className="forecast-hour" key={`${hour.time}-${i}`}>
              <div className="day-name">{hour.time ? formatHourLabel(hour.time) : `+${i}h`}</div>
              <WeatherIcon code={hour.weatherCode} size={24} />
              <div className="day-temp">
                {hour.temperature !== null ? Math.round(hour.temperature) : '--'}°{units === 'metric' ? 'C' : 'F'}
              </div>
              {hour.precipitation !== null && hour.precipitation > 0 && (
                <div className="day-precip">{hour.precipitation} mm</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
