import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'info',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - keep them separate for better caching
          if (id.includes('node_modules/@radix-ui')) return 'vendor-radix-ui';
          if (id.includes('node_modules/react')) return 'vendor-react';
          if (id.includes('node_modules/@tanstack')) return 'vendor-query';
          if (id.includes('node_modules/recharts')) return 'vendor-recharts';
          if (id.includes('node_modules/@stripe')) return 'vendor-stripe';
          if (id.includes('node_modules/date-fns')) return 'vendor-date-fns';
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
});