import type {
  GeocodeSuggestion,
  HourlyPoint,
  ForecastDay,
  NormalizedWeather,
  RawWeatherResponse,
  UsageStats,
} from './types';

// Backend and frontend always run/deploy separately, so this must point at the backend's URL.
const API_BASE_URL = import.meta.env.API_BASE_URL?.replace(/\/$/, '') ?? '';

function asNumber(value: unknown): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

// WeatherAI's /v1/weather response has no location name, so callers supply one
// (from a geocode suggestion, "My location", or the IP-based geo.city fallback below).
export function normalizeWeather(
  raw: unknown,
  units: 'metric' | 'imperial',
  locationName = 'Selected location'
): NormalizedWeather {
  const data = (raw ?? {}) as RawWeatherResponse;
  const current = data.current ?? {};

  const forecast: ForecastDay[] = (data.daily ?? []).map((day) => ({
    date: day.date ?? '',
    weatherCode: asNumber(day.weathercode),
    tempMin: asNumber(day.temp_min),
    tempMax: asNumber(day.temp_max),
    precipitation: asNumber(day.precipitation),
  }));

  const hourly: HourlyPoint[] = (data.hourly ?? []).map((hour) => ({
    time: hour.time ?? '',
    temperature: asNumber(hour.temp),
    precipitation: asNumber(hour.precipitation),
    weatherCode: asNumber(hour.weathercode),
  }));

  const geoName = data.geo?.city
    ? [data.geo.city, data.geo.region, data.geo.country].filter(Boolean).join(', ')
    : null;

  return {
    locationName: geoName ?? locationName,
    units,
    current: {
      temperature: asNumber(current.temperature),
      windSpeed: asNumber(current.windspeed),
      windDirection: asNumber(current.winddirection),
      isDay: current.is_day !== 0,
      weatherCode: asNumber(current.weathercode),
      time: current.time ?? null,
    },
    forecast,
    hourly,
    aiSummary: data.ai_summary ?? null,
    raw: data,
  };
}

async function handleJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as { error?: string }).error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial',
  locationName?: string
): Promise<NormalizedWeather> {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), units, days: '7' });
  const res = await fetch(`${API_BASE_URL}/api/weather?${params}`);
  const data = await handleJson<unknown>(res);
  return normalizeWeather(data, units, locationName);
}

export async function fetchWeatherByIp(units: 'metric' | 'imperial'): Promise<NormalizedWeather> {
  const res = await fetch(`${API_BASE_URL}/api/weather-geo`);
  const data = await handleJson<unknown>(res);
  return normalizeWeather(data, units);
}

export async function fetchGeocodeSuggestions(city: string): Promise<GeocodeSuggestion[]> {
  const params = new URLSearchParams({ city });
  const res = await fetch(`${API_BASE_URL}/api/geocode?${params}`);
  const data = await handleJson<{ results: GeocodeSuggestion[] }>(res);
  return data.results;
}

export async function fetchUsage(): Promise<UsageStats> {
  const res = await fetch(`${API_BASE_URL}/api/usage`);
  return handleJson<UsageStats>(res);
}
