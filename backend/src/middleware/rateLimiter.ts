import rateLimit from 'express-rate-limit';

// Guards our own proxy from abuse independent of WeatherAI's upstream quota (OWASP API4: unrestricted resource consumption).
export const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// SMS sends real messages and burns a limited Scale-plan quota, so it gets a tighter cap.
export const smsLimiter = rateLimit({
  windowMs: Number(process.env.SMS_RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 min
  max: Number(process.env.SMS_RATE_LIMIT_MAX) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many SMS requests, please slow down.' },
});
