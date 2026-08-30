/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Absolute backend URL — leave unset when served from the same origin/deployment.
  readonly API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
