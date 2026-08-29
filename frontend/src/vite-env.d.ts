/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Absolute backend URL, e.g. https://weather-ai-backend.onrender.com — leave unset
  // when frontend and backend are served from the same origin/deployment.
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
