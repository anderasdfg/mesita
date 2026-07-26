import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true, // Habilitar sourcemaps para debug
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // NO eliminar console.log
        drop_debugger: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    host: true,
    port: 5173
  }
});
