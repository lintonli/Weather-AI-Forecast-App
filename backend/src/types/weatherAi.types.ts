export type Units = 'metric' | 'imperial';

export interface WeatherQuery {
  lat: number;
  lon: number;
  days: number;
  units: Units;
  ai: 'true' | 'false';
  lang: string;
}

export interface WeatherAIResponse {
  status: number;
  data: unknown;
}

export interface GeocodeResult {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
