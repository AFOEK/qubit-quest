import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  root: 'apps/web',
  build: { outDir: '../../dist', emptyOutDir: true },
  server: { proxy: { '/api': loadEnv(mode, '.', 'QQ_').QQ_API_TARGET || 'http://127.0.0.1:8000' } },
}));
