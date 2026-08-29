import type { Request, Response } from 'express';
import { fetchWeatherAI, postWeatherAI } from '../utils/weatherAiClient';
import type { BometRegisterPayload, SmsAlertPayload, SmsAlertType, SmsSendPayload } from '../types/weatherAi.types';

// SMS routes require the Scale plan + admin compliance approval; WeatherAI returns
// 403 SMS_NOT_ENABLED until then, which is passed through as-is for the frontend to display.

const ALERT_TYPES: SmsAlertType[] = ['rain', 'frost', 'extreme_wind', 'drought'];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

// POST /api/sms/send
export async function sendSms(req: Request, res: Response): Promise<void> {
  const body = req.body as SmsSendPayload;
  if (!isNonEmptyString(body?.to) || !isNonEmptyString(body?.message)) {
    res.status(400).json({ error: 'to and message are required.' });
    return;
  }

  try {
    const { status, data } = await postWeatherAI('/sms/send', body);
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach WeatherAI SMS service.' });
  }
}

// POST /api/sms/alert
export async function sendSmsAlert(req: Request, res: Response): Promise<void> {
  const body = req.body as SmsAlertPayload;
  if (!isNonEmptyString(body?.to) || !ALERT_TYPES.includes(body?.alertType)) {
    res.status(400).json({ error: `to is required and alertType must be one of: ${ALERT_TYPES.join(', ')}.` });
    return;
  }

  try {
    const { status, data } = await postWeatherAI('/sms/alert', body);
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach WeatherAI SMS service.' });
  }
}

// POST /api/sms/bomet/register
export async function registerBometFarmer(req: Request, res: Response): Promise<void> {
  const body = req.body as BometRegisterPayload;
  if (!isNonEmptyString(body?.phone) || !isNonEmptyString(body?.name)) {
    res.status(400).json({ error: 'phone and name are required.' });
    return;
  }

  try {
    const { status, data } = await postWeatherAI('/sms/bomet/register', body);
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach WeatherAI SMS service.' });
  }
}

// GET /api/sms/stats
export async function getSmsStats(_req: Request, res: Response): Promise<void> {
  try {
    const { status, data } = await fetchWeatherAI('/sms/stats', {});
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach WeatherAI SMS service.' });
  }
}

// GET /api/sms/health
export async function getSmsHealth(_req: Request, res: Response): Promise<void> {
  try {
    const { status, data } = await fetchWeatherAI('/sms/health', {});
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach WeatherAI SMS service.' });
  }
}
