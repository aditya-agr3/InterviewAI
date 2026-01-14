import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Prevent externalization of core-js to avoid commonjs-external query string issues
      external: (id) => {
        // Don't externalize core-js or its internals
        if (id && (id.includes('core-js') || id.includes('internals/'))) {
          return false;
        }
        // Default: don't externalize anything (bundle everything)
        return false;
      },
    },
  },
});
