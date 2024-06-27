import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Load environment variables based on the mode (development, production, test)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      'process.env.VITE_STRIPE_PUBLIC_KEY': JSON.stringify(env.VITE_STRIPE_PUBLIC_KEY),
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      'process.env.VITE_MAPS_API': JSON.stringify(env.VITE_MAPS_API),
    },
    build: {
      outDir: 'dist',
    },
  };
});

