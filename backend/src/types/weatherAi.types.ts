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

// Mirrors WeatherAI's documented SMS API request bodies (Scale plan only).
export interface SmsSendPayload {
  to: string;
  message: string;
  type?: string;
  pilotTag?: string;
}

export type SmsAlertType = 'rain' | 'frost' | 'extreme_wind' | 'drought';

export interface SmsAlertPayload {
  to: string;
  alertType: SmsAlertType;
  data?: Record<string, unknown>;
}

export interface BometRegisterPayload {
  phone: string;
  name: string;
  location?: string;
  cropType?: string;
}
