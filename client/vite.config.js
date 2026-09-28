import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://doubt-solver-platform-3.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
