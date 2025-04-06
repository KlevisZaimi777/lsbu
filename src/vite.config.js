import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: 'dist', // Ensure that the output directory is 'dist'
    rollupOptions: {
      input: 'index.html', // Ensure the build input is correct
    },
  },
});

