import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',  // Your Flask backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
