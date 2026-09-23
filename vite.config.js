import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { validateContent } from './scripts/content-files.mjs';

const CONTENT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/content');

// Stops the build (and the dev server start) when a scenario is invalid (CLAUDE.md, section 12)
function validateContentPlugin() {
  return {
    name: 'poznej-podvod:validate-content',
    buildStart() {
      const problems = validateContent(CONTENT_DIR);
      if (problems.length > 0) {
        this.error(`Chyby ve scénářích:\n  - ${problems.join('\n  - ')}`);
      }
    },
  };
}

export default defineConfig({
  // Relative paths so dist/ works regardless of the folder it is uploaded to
  base: './',
  plugins: [validateContentPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
