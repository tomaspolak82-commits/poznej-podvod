import { test, expect } from '@playwright/test';
import { goToScenario, seedWith, startRound } from './helpers/game.js';

// Evaluation colours (Tomáš, 28. 9. 2026): green = the player answered correctly, red = wrongly,
// always with an icon and a text; the summary sits in a light yellow box. Contrast per WCAG AA:
// text 4.5:1, icons and frames 3:1 (measured from the rendered colours, not assumed).

const SEED = seedWith('email', ['email-05']);
const GREEN = 'rgb(30, 123, 52)'; // --color-green
const RED = 'rgb(201, 48, 48)'; // --color-red-dark

// Contrast of an element's colour (text or a given property) against its effective background
function contrastOf(locator, property = 'color') {
  return locator.evaluate((el, prop) => {
    const parse = (c) => c.match(/[\d.]+/g).map(Number);
    const lum = ([r, g, b]) =>
      [r, g, b]
        .map((v) => v / 255)
        .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    let node = el;
    let bg = 'rgba(0, 0, 0, 0)';
    while (node && parse(bg)[3] === 0) {
      bg = getComputedStyle(node).backgroundColor;
      node = node.parentElement;
    }
    if (parse(bg)[3] === 0) bg = 'rgb(255, 255, 255)';
    const [a, b] = [lum(parse(getComputedStyle(el)[prop])), lum(parse(bg))];
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }, property);
}

test.describe(`evaluation colours (seed ${SEED})`, () => {
  test('advanced, correct decision: green result, part statuses green / red with icon and text, AA contrast', async ({ page }) => {
    await startRound(page, { seed: SEED, level: 'pokročilá' });
    await goToScenario(page, 'email-05');
    await page.locator('[data-mark="button"]').click(); // threat → found
    await page.locator('[data-mark="body.0"]').click(); // innocent part → marked needlessly
    await page.getByRole('button', { name: 'Je to podvod' }).click();

    const result = page.getByTestId('evaluation');
    await expect(result).toHaveCSS('border-left-color', GREEN);
    expect(await contrastOf(result.locator('.evaluation-result__title'))).toBeGreaterThanOrEqual(4.5);
    expect(await contrastOf(result.locator('.evaluation-result__icon'))).toBeGreaterThanOrEqual(3);

    const expected = [
      ['found', GREEN, 'Našli jste'],
      ['missed', RED, 'Tohle místo stojí za druhý pohled'],
      ['extra', RED, 'Označeno zbytečně'],
    ];
    for (const [kind, colour, text] of expected) {
      const status = page.locator(`[data-status="${kind}"]`).first();
      await expect(status).toHaveCSS('border-left-color', colour);
      await expect(status).toContainText(text);
      await expect(status.locator('svg')).toBeVisible();
      expect(await contrastOf(status.locator('span'))).toBeGreaterThanOrEqual(4.5);
      expect(await contrastOf(status.locator('svg'))).toBeGreaterThanOrEqual(3);
    }
  });

  test('basic, wrong decision: red frame (no red block), icon and text; summary in the yellow box', async ({ page }) => {
    await startRound(page, { seed: SEED });
    await goToScenario(page, 'email-05');
    await page.getByRole('button', { name: 'Je to v pořádku' }).click();

    const result = page.getByTestId('evaluation');
    await expect(result).toHaveCSS('border-left-color', RED);
    await expect(result).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(result.locator('.evaluation-result__icon svg')).toBeVisible();
    await expect(result).toContainText('Tahle zpráva je podvod.');
    expect(await contrastOf(result.locator('.evaluation-result__title'))).toBeGreaterThanOrEqual(4.5);
    expect(await contrastOf(result.locator('.evaluation-result__icon'))).toBeGreaterThanOrEqual(3);

    const summary = page.locator('.evaluation-summary');
    await expect(summary).toHaveCSS('border-top-color', 'rgb(255, 179, 2)'); // --color-yellow
    expect(await contrastOf(summary.locator('h2'))).toBeGreaterThanOrEqual(4.5);
    expect(await contrastOf(summary.locator('p'))).toBeGreaterThanOrEqual(4.5);
  });
});
