import type { Request, Response } from 'express';
import { fetchWeatherAI } from '../utils/weatherAiClient';
import { parseCoord } from '../utils/validation';

export async function getWeather(req: Request, res: Response): Promise<void> {
  const lat = parseCoord(req.query.lat, -90, 90);
  const lon = parseCoord(req.query.lon, -180, 180);
  if (lat === null || lon === null) {
    res.status(400).json({ error: 'Valid lat and lon query parameters are required.' });
    return;
  }

  const days = Math.min(Math.max(parseInt(String(req.query.days), 10) || 7, 1), 16);
  const units = req.query.units === 'imperial' ? 'imperial' : 'metric';
  const ai = req.query.ai === 'false' ? 'false' : 'true';
  const lang = /^[a-z]{2}$/i.test(String(req.query.lang || '')) ? String(req.query.lang) : 'en';

  try {
    const { status, data } = await fetchWeatherAI('/weather', { lat, lon, days, units, ai, lang });
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach WeatherAI service.' });
  }
}

export async function getWeatherByIp(_req: Request, res: Response): Promise<void> {
  try {
    const { status, data } = await fetchWeatherAI('/weather-geo', {});
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach WeatherAI service.' });
  }
}

export async function getUsage(_req: Request, res: Response): Promise<void> {
  try {
    const { status, data } = await fetchWeatherAI('/usage', {});
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach WeatherAI service.' });
  }
}
