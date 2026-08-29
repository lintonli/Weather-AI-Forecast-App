import type { ForecastDay } from '../types';

export default function ForecastList({ forecast }: { forecast: ForecastDay[] }) {
  if (forecast.length === 0) return null;

  return (
    <div className="forecast-section">
      <h3>Forecast</h3>
      <div className="forecast-list">
        {forecast.map((day, i) => (
          <div className="forecast-day" key={`${day.date}-${i}`}>
            <div className="day-name">{day.date || `Day ${i + 1}`}</div>
            <div>{day.condition}</div>
            <div className="day-temp">
              {day.tempMax !== null ? Math.round(day.tempMax) : '--'}° / {day.tempMin !== null ? Math.round(day.tempMin) : '--'}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
