import { test, expect } from '@playwright/test';

// Czech letters (lower and upper case) and common typographic characters (CLAUDE.md, section 9)
const CHARACTERS = 'ěščřžýáíéúůťďňóĚŠČŘŽÝÁÍÉÚŮŤĎŇÓ„“–…€Kč';

const FACES = [
  ['Lato', 400],
  ['Lato', 700],
  // The site uses Montserrat only at 700 and 800 (static cuts, 28. 9. 2026)
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
  // Montserrat: 700 + 800 (static), Lato: 400 + 700
  expect(result.loaded.filter((family) => family.includes('Montserrat'))).toHaveLength(2);
  expect(result.loaded.filter((family) => family.includes('Lato'))).toHaveLength(2);
});

// Headings must look bold, not only be wide: WebKit on Windows drew the former variable
// Montserrat with bold widths but hairline strokes. "Ink" = share of dark pixels of the same text.
// Measured 28. 9. 2026: Montserrat 700 / 800 ≈ 1.85× / 2.1× the ink of Lato 400 (Chromium and
// WebKit alike); the thin variable font in WebKit had 0.3×.
test('Montserrat headings are really drawn bold (ink compared with regular Lato)', async ({ page }) => {
  await page.goto('/');
  const ink = await page.evaluate(async () => {
    await Promise.all(['700 40px Montserrat', '800 40px Montserrat', '400 40px Lato'].map((f) => document.fonts.load(f)));
    const measure = (font) => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 600, 80);
      ctx.fillStyle = '#000';
      ctx.font = font;
      ctx.fillText('Poznej podvod', 10, 55);
      const { data } = ctx.getImageData(0, 0, 600, 80);
      let sum = 0;
      for (let i = 0; i < data.length; i += 4) sum += 255 - data[i];
      return sum / 255;
    };
    return { lato: measure('400 40px Lato'), m700: measure('700 40px Montserrat'), m800: measure('800 40px Montserrat') };
  });
  expect(ink.m700 / ink.lato).toBeGreaterThan(1.5);
  expect(ink.m800 / ink.lato).toBeGreaterThan(1.5);
});
