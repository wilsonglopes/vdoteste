import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Garante que o build saia na pasta correta que o Netlify espera (geralmente 'dist')
    outDir: 'dist',
  },
  server: {
    // Configuração opcional para proxy em desenvolvimento local (se não usar netlify dev)
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
  },
});
