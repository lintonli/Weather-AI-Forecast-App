import type { Request, Response } from 'express';
import type { GeocodeResult } from '../types/weatherAi.types';

// Proxies Open-Meteo's free geocoding API since WeatherAI itself only accepts lat/lon.
export async function getGeocodeSuggestions(req: Request, res: Response): Promise<void> {
  const city = String(req.query.city || '').trim();
  if (!city) {
    res.status(400).json({ error: 'city query parameter is required.' });
    return;
  }

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', city);
  url.searchParams.set('count', '5');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const geoRes = await fetch(url, { signal: controller.signal });
    const geoData = (await geoRes.json().catch(() => ({}))) as { results?: GeocodeResult[] };
    const results = (geoData.results || []).map((r) => ({
      name: r.name,
      country: r.country,
      admin1: r.admin1,
      lat: r.latitude,
      lon: r.longitude,
    }));
    res.json({ results });
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach geocoding service.' });
  } finally {
    clearTimeout(timeout);
  }
}
