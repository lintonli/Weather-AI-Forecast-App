import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRoutes from './routes/weather.routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

const app = express();

// Only needed when the frontend is deployed on a different origin than this API
// (same-origin deployments, e.g. this repo's default build, don't require CORS at all).
const corsOrigins = (process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean);
if (corsOrigins.length > 0) {
  app.use(cors({ origin: corsOrigins }));
}

app.use(express.json());

const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.use('/api', apiLimiter, apiRoutes);
app.use(errorHandler);

export default app;
