import type { WeatherAIResponse } from '../types/weatherAi.types';

const WEATHER_AI_BASE_URL = 'https://api.weather-ai.co/v1';
const WEATHER_AI_API_KEY = process.env.WEATHER_AI_API_KEY;

if (!WEATHER_AI_API_KEY) {
  console.warn('[warn] WEATHER_AI_API_KEY is not set. Requests to WeatherAI will fail with 401.');
}

type QueryParams = Record<string, string | number | boolean | undefined>;

export async function fetchWeatherAI(endpoint: string, params: QueryParams): Promise<WeatherAIResponse> {
  const url = new URL(`${WEATHER_AI_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${WEATHER_AI_API_KEY}` },
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  } finally {
    clearTimeout(timeout);
  }
}
