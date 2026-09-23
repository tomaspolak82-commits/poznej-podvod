// Reads and validates scenario files from disk. Used by the build (vite.config.js)
// and by unit tests; the app itself gets the files bundled by Vite.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { checkSectionForDraw, validateScenario } from '../src/engine/validate.js';

export const CONTENT_SECTIONS = ['email', 'zpravy'];

export function readSection(contentDir, section) {
  const dir = path.join(contentDir, section);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => {
      const fileId = name.slice(0, -'.json'.length);
      try {
        return { fileId, data: JSON.parse(readFileSync(path.join(dir, name), 'utf8')) };
      } catch (error) {
        return { fileId, data: null, parseError: error.message };
      }
    });
}

// Returns every problem found in the content, as readable Czech lines
export function validateContent(contentDir) {
  const problems = [];
  for (const section of CONTENT_SECTIONS) {
    const files = readSection(contentDir, section);
    const valid = [];
    for (const { fileId, data, parseError } of files) {
      if (parseError) {
        problems.push(`${section}/${fileId}.json: neplatný JSON (${parseError})`);
        continue;
      }
      const errors = validateScenario(data, { fileId, section });
      for (const error of errors) problems.push(`${section}/${fileId}.json: ${error}`);
      if (errors.length === 0) valid.push(data);
    }
    problems.push(...checkSectionForDraw(valid, section));
  }
  return problems;
}
