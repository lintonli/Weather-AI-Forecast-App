import type { NextFunction, Request, Response } from 'express';

// Centralized fallback so route handlers can just throw/reject instead of formatting responses.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err);
  res.status(502).json({ error: 'Unexpected server error.' });
}
