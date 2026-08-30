# WeatherAI Dashboard

A weather dashboard that consumes the [WeatherAI API](https://weather-ai.co) — real-time
conditions, daily/hourly forecasts, and AI-generated summaries — through a small Express proxy
that keeps the API key server-side, with a React + TypeScript frontend.

## Features

- Search any city (geocoded via Open-Meteo) or use your browser location / IP-based lookup
- Current conditions: temperature, wind speed + direction, day/night, today's precipitation
- Daily and hourly forecast tabs, both driven by WMO weather codes with matching icons
- AI-generated weather summary (when available on your WeatherAI plan)
- Live API usage/quota widget
- Metric/imperial unit toggle

## Tech stack

| | |
|---|---|
| Frontend | React + TypeScript, Vite |
| Backend | Express + TypeScript |
| Data source | [WeatherAI API](https://weather-ai.co/docs) (weather, geocoding proxy, usage) |

## Project structure

```
Weather-AI/
├── backend/     # Express + TypeScript API proxy
│   └── src/
│       ├── app.ts               # Express app (CORS, rate limiting, routes)
│       ├── server.ts            # Dev/production entrypoint (app.listen)
│       ├── controllers/         # weather.controller.ts, geocode.controller.ts
│       ├── routes/              # weather.routes.ts
│       ├── middleware/          # rateLimiter.ts, errorHandler.ts
│       ├── types/               # weatherAi.types.ts
│       └── utils/               # weatherAiClient.ts, validation.ts
└── frontend/    # React + TypeScript (Vite) dashboard
    └── src/
        ├── App.tsx, api.ts, types.ts, weatherCodes.ts
        └── components/          # SearchBar, QuickActions, CurrentCard, ForecastList, ...
```

Backend and frontend are two **independent** projects — no shared root `package.json`, no dev
proxy between them. The frontend always talks to the backend over HTTP using an absolute URL,
even in local development.

## Prerequisites

- Node.js 18+
- A WeatherAI API key — sign up at [weather-ai.co](https://weather-ai.co), then generate a key
  from **Dashboard → API Keys** (shown only once, copy it immediately)

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Weather-AI

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

**`backend/.env`** (copy from `backend/.env.example`):

```dotenv
WEATHER_AI_API_KEY=wai_your_key_here
PORT=3000

# The frontend's exact origin(s), comma-separated. Required — CORS rejects everything
# else by default.
CORS_ORIGIN=http://localhost:5173

# General API rate limiting (applies to all /api routes)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

**`frontend/.env`** (copy from `frontend/.env.example`):

```dotenv
# The backend's URL. Required — the frontend has no same-origin fallback.
API_BASE_URL=http://localhost:3000
```

### 3. Run locally

In two separate terminals:

```bash
# Terminal 1
cd backend
npm run dev      # http://localhost:3000

# Terminal 2
cd frontend
npm run dev      # http://localhost:5173
```

Open http://localhost:5173.

## Environment variables reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `WEATHER_AI_API_KEY` | Yes | Your WeatherAI API key (`wai_...`) |
| `PORT` | No (default `3000`) | Port the Express server listens on |
| `CORS_ORIGIN` | Yes | Comma-separated list of allowed frontend origin(s), no trailing slash |
| `RATE_LIMIT_WINDOW_MS` | No (default `900000`) | Rate limit window, in ms, for `/api/*` |
| `RATE_LIMIT_MAX` | No (default `100`) | Max requests per window per IP |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `API_BASE_URL` | Yes | Absolute URL of the deployed/running backend |

The `API_` prefix is exposed to client code via a custom `envPrefix` in `vite.config.ts` (Vite
only exposes `VITE_`-prefixed vars by default).

## API endpoints (backend)

All routes are prefixed with `/api` and proxy to WeatherAI, injecting the API key server-side.

| Method | Path | Description |
|---|---|---|
| GET | `/api/weather?lat=&lon=&units=&days=` | Current conditions + daily/hourly forecast |
| GET | `/api/weather-geo` | Same, resolved from the caller's IP |
| GET | `/api/usage` | Current billing-period usage/quota |
| GET | `/api/geocode?city=` | City name → lat/lon suggestions (via Open-Meteo, free) |


## License

MIT
