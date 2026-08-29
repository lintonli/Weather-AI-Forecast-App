import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server proxies /api to the Express backend so the browser never needs the API key.
// Target is configurable via DEV_API_PROXY_TARGET in case the backend runs on a non-default port.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': env.DEV_API_PROXY_TARGET || 'http://localhost:3000',
      },
    },
    build: {
      outDir: 'dist',
    },
  };
});
