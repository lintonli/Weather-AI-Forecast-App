export interface GeocodeSuggestion {
  name: string;
  country?: string;
  admin1?: string;
  lat: number;
  lon: number;
}

export interface CurrentConditions {
  temperature: number | null;
  feelsLike: number | null;
  condition: string;
  humidity: number | null;
  windSpeed: number | null;
  precipitation: number | null;
  time: string | null;
}

export interface ForecastDay {
  date: string;
  condition: string;
  tempMin: number | null;
  tempMax: number | null;
}

export interface NormalizedWeather {
  locationName: string;
  units: 'metric' | 'imperial';
  current: CurrentConditions;
  forecast: ForecastDay[];
  aiSummary: string | null;
  raw: unknown;
}

export interface UsageStats {
  requests_used?: number;
  requests_limit?: number;
  ai_requests_used?: number;
  ai_requests_limit?: number;
  period_start?: string;
  period_end?: string;
  [key: string]: unknown;
}

export interface SmsResult {
  ok: boolean;
  status: number;
  data: { error?: string; [key: string]: unknown };
}
