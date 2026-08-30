import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No dev proxy — the frontend always talks directly to the backend via API_BASE_URL,
// so the backend's CORS_ORIGIN must allow this dev server's origin (http://localhost:5173).
// envPrefix widens Vite's default VITE_-only client env exposure to also include API_*.
export default defineConfig({
  plugins: [react()],
  envPrefix: 'API_',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
});

