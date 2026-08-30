/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Required: the backend's absolute URL, e.g. http://localhost:3000 in dev.
  readonly API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
