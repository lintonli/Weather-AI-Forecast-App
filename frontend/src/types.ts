export interface GeocodeSuggestion {
  name: string;
  country?: string;
  admin1?: string;
  lat: number;
  lon: number;
}

export interface CurrentConditions {
  temperature: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  isDay: boolean;
  weatherCode: number | null;
  time: string | null;
}

export interface ForecastDay {
  date: string;
  weatherCode: number | null;
  tempMin: number | null;
  tempMax: number | null;
  precipitation: number | null;
}

export interface HourlyPoint {
  time: string;
  temperature: number | null;
  precipitation: number | null;
  weatherCode: number | null;
}

export interface NormalizedWeather {
  locationName: string;
  units: 'metric' | 'imperial';
  current: CurrentConditions;
  forecast: ForecastDay[];
  hourly: HourlyPoint[];
  aiSummary: string | null;
  raw: unknown;
}

export interface UsageStats {
  plan?: string;
  used?: number;
  limit?: number;
  remaining?: number;
  unlimited?: boolean;
  [key: string]: unknown;
}

// Raw shapes as returned by WeatherAI's /v1/weather and /v1/weather-geo, before normalization.
export interface RawDaily {
  date?: string;
  weathercode?: number;
  temp_min?: number;
  temp_max?: number;
  precipitation?: number;
}

export interface RawHourly {
  time?: string;
  temp?: number;
  precipitation?: number;
  weathercode?: number;
}

export interface RawWeatherResponse {
  current?: {
    time?: string;
    temperature?: number;
    windspeed?: number;
    winddirection?: number;
    is_day?: number;
    weathercode?: number;
  };
  daily?: RawDaily[];
  hourly?: RawHourly[];
  geo?: { city?: string; region?: string; country?: string };
  ai_summary?: string | null;
}
