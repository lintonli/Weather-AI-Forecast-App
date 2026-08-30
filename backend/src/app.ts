import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/weather.routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

const app = express();

// This API is deployed separately from the frontend, so CORS is required, not optional.
// CORS_ORIGIN must list the frontend's exact origin(s), comma-separated.
const corsOrigins = (process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: corsOrigins }));

app.use(express.json());
app.use('/api', apiLimiter, apiRoutes);
app.use(errorHandler);

export default app;
