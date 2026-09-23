import { test, expect } from '@playwright/test';

// Czech letters (lower and upper case) and common typographic characters (CLAUDE.md, section 9)
const CHARACTERS = 'ěščřžýáíéúůťďňóĚŠČŘŽÝÁÍÉÚŮŤĎŇÓ„“–…€Kč';

const FACES = [
  ['Lato', 400],
  ['Lato', 700],
  ['Montserrat', 400],
  ['Montserrat', 700],
  ['Montserrat', 800],
];

test('local fonts load and contain every Czech character (no fallback font)', async ({ page }) => {
  await page.goto('/');

  const result = await page.evaluate(
    async ({ characters, faces }) => {
      await Promise.all(faces.map(([family, weight]) => document.fonts.load(`${weight} 40px "${family}"`, characters)));

      // If the font has the glyph, the fallback font does not matter and both widths are equal.
      // If the glyph is missing, the browser falls back and monospace vs serif give different widths.
      const ctx = document.createElement('canvas').getContext('2d');
      const missing = [];
      for (const [family, weight] of faces) {
        for (const char of characters) {
          ctx.font = `${weight} 40px "${family}", monospace`;
          const withMono = ctx.measureText(char).width;
          ctx.font = `${weight} 40px "${family}", serif`;
          const withSerif = ctx.measureText(char).width;
          if (Math.abs(withMono - withSerif) > 0.01) missing.push(`${family} ${weight}: ${char}`);
        }
      }

      const loaded = [...document.fonts].filter((face) => face.status === 'loaded').map((face) => face.family);
      return { missing, loaded };
    },
    { characters: CHARACTERS, faces: FACES },
  );

  expect(result.missing).toEqual([]);
  // Montserrat: latin + latin-ext (variable), Lato: 400 + 700
  expect(result.loaded.filter((family) => family.includes('Montserrat'))).toHaveLength(2);
  expect(result.loaded.filter((family) => family.includes('Lato'))).toHaveLength(2);
});
