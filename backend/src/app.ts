import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/weather.routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: corsOrigins }));

app.use(express.json());
app.use('/api', apiLimiter, apiRoutes);
app.use(errorHandler);

export default app;
