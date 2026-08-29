import type { GeocodeSuggestion, NormalizedWeather, SmsResult, UsageStats } from './types';

// Empty by default so requests stay same-origin ("/api/..."); set VITE_API_BASE_URL
// only when the frontend and backend are deployed to different origins.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

// The public WeatherAI response schema isn't fully documented, so this picks the first
// matching key among common naming variants (snake_case, camelCase, nested) defensively.
function pick(source: Record<string, unknown> | undefined | null, keys: string[]): unknown {
  if (!source) return undefined;
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) return source[key];
  }
  return undefined;
}

function asNumber(value: unknown): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

export function normalizeWeather(raw: unknown, units: 'metric' | 'imperial'): NormalizedWeather {
  const data = (raw ?? {}) as Record<string, unknown>;
  const location = (data.location ?? data.loc ?? {}) as Record<string, unknown>;
  const current = (data.current ?? data.current_conditions ?? {}) as Record<string, unknown>;
  const forecastRaw = (data.forecast ?? data.daily ?? data.days ?? []) as Record<string, unknown>[];

  const locationName = asString(
    pick(location, ['name', 'city']) as string | undefined,
    asString(pick(data, ['location_name', 'city']) as string | undefined, 'Selected location')
  );

  const forecast = Array.isArray(forecastRaw)
    ? forecastRaw.map((day) => ({
        date: asString(pick(day, ['date', 'day', 'time']) as string | undefined, ''),
        condition: asString(pick(day, ['condition', 'summary', 'description']) as string | undefined, '—'),
        tempMin: asNumber(pick(day, ['temp_min', 'temperature_min', 'min_temp', 'low'])),
        tempMax: asNumber(pick(day, ['temp_max', 'temperature_max', 'max_temp', 'high'])),
      }))
    : [];

  return {
    locationName,
    units,
    current: {
      temperature: asNumber(pick(current, ['temperature', 'temp', 'temp_c', 'temp_f'])),
      feelsLike: asNumber(pick(current, ['feels_like', 'feelslike', 'apparent_temperature'])),
      condition: asString(pick(current, ['condition', 'summary', 'description']) as string | undefined, '—'),
      humidity: asNumber(pick(current, ['humidity', 'relative_humidity'])),
      windSpeed: asNumber(pick(current, ['wind_speed', 'windspeed', 'wind'])),
      precipitation: asNumber(pick(current, ['precipitation', 'precip', 'rain'])),
      time: (pick(current, ['time', 'observation_time', 'updated_at']) as string | undefined) ?? null,
    },
    forecast,
    aiSummary: (pick(data, ['ai_summary', 'summary', 'insight']) as string | undefined) ?? null,
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
  units: 'metric' | 'imperial'
): Promise<NormalizedWeather> {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), units });
  const res = await fetch(`${API_BASE_URL}/api/weather?${params}`);
  const data = await handleJson<unknown>(res);
  return normalizeWeather(data, units);
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

// Doesn't throw on non-2xx — SMS is Scale-plan only, so callers need to see the
// raw status (e.g. 403 SMS_NOT_ENABLED) rather than a generic thrown error.
export async function sendSms(to: string, message: string, type?: string): Promise<SmsResult> {
  const res = await fetch(`${API_BASE_URL}/api/sms/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, message, type }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
