import tailwindcss from '@tailwindcss/vite'; // TailwindCSS plugin for Vite
import { defineConfig } from 'vite'; // Vite config function
import tsconfigPaths from 'vite-tsconfig-paths'; // Plugin to resolve TypeScript paths automatically

export default defineConfig({
  plugins: [
    tailwindcss(), // TailwindCSS plugin
    tsconfigPaths(), // Resolves paths based on tsconfig.json
  ],
});
