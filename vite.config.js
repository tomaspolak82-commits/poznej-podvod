import { defineConfig } from 'vite';

export default defineConfig({
  // Relative paths so dist/ works regardless of the folder it is uploaded to
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
