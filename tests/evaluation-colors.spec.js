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

// Contrast of a colour property against the backgrounds around the element: for a frame its
// own (inside) and its parent's (outside) background, for a circle its parent's and grandparent's
// (the circle sits on the edge of a frame). Returns the lowest ratio.
function contrastAround(locator, property, { skipOwn = false } = {}) {
  return locator.evaluate(
    (el, { prop, skipOwn }) => {
      const parse = (c) => c.match(/[\d.]+/g).map(Number);
      const alpha = (c) => parse(c)[3] ?? 1;
      const lum = ([r, g, b]) =>
        [r, g, b]
          .map((v) => v / 255)
          .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
          .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
      const background = (start) => {
        for (let node = start; node; node = node.parentElement) {
          const bg = getComputedStyle(node).backgroundColor;
          if (alpha(bg) !== 0) return bg;
        }
        return 'rgb(255, 255, 255)';
      };
      const first = skipOwn ? el.parentElement : el;
      const colour = lum(parse(getComputedStyle(el)[prop]));
      return Math.min(
        ...[background(first), background(first.parentElement)].map((bg) => {
          const b = lum(parse(bg));
          return (Math.max(colour, b) + 0.05) / (Math.min(colour, b) + 0.05);
        }),
      );
    },
    { prop: property, skipOwn },
  );
}

// Browser intro (Tomáš, 1. 10. 2026): numbers 1–3 each in their own colour, the same in the
// picture and in the text; dashed frame and circle 3:1 against what is around, white digit 4.5:1;
// never the yellow, green or red of the game
test('browser intro: numbered frames and circles have their own colours and enough contrast', async ({ page }) => {
  await page.goto('/?seed=1#/prohlizec');
  const shot = page.getByTestId('browser-intro-shot');
  const colours = [];
  for (const n of ['1', '2', '3']) {
    const frame = shot.locator(`.browser-intro__frame--${n}`);
    const inPicture = frame.locator(`> .browser-intro__num--${n}`);
    const inText = page.locator(`.browser-intro__part .browser-intro__num--${n}`);
    const colour = await frame.evaluate((el) => getComputedStyle(el).borderTopColor);
    colours.push(colour);
    await expect(inPicture).toHaveCSS('background-color', colour);
    await expect(inText).toHaveCSS('background-color', colour);
    expect(await contrastAround(frame, 'borderTopColor'), `frame ${n}`).toBeGreaterThanOrEqual(3);
    for (const circle of [inPicture, inText]) {
      expect(await contrastAround(circle, 'backgroundColor', { skipOwn: true }), `circle ${n}`).toBeGreaterThanOrEqual(3);
      expect(await contrastOf(circle), `digit ${n}`).toBeGreaterThanOrEqual(4.5);
      await expect(circle).toHaveText(n);
    }
  }
  expect(new Set(colours).size).toBe(3);
  for (const forbidden of [GREEN, RED, 'rgb(255, 179, 2)', 'rgb(255, 77, 77)']) expect(colours).not.toContain(forbidden);
  // Not any red, yellow or green either: hue outside 0–15° and 345–360° (red), 45–65° (yellow),
  // 75–165° (green)
  for (const colour of colours) {
    const [r, g, b] = colour.match(/\d+/g).map((v) => Number(v) / 255);
    const max = Math.max(r, g, b);
    const d = max - Math.min(r, g, b);
    const hue = (((max === r ? (g - b) / d : max === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60) + 360) % 360;
    const forbiddenHue = hue < 15 || hue > 345 || (hue >= 45 && hue <= 65) || (hue >= 75 && hue <= 165);
    expect(forbiddenHue, `${colour} has hue ${Math.round(hue)}°`).toBe(false);
  }
});

// Browser: card "Jak jste se sem dostali" (Tomáš, 1. 10. 2026): blue-grey, never yellow,
// title and text at least AA (4.5:1), measured in play and in the evaluation
test('browser: card "Jak jste se sem dostali" has AA contrast and is not yellow', async ({ page }) => {
  await startRound(page, { section: 'prohlizec', seed: 1 });
  for (const phase of ['play', 'evaluation']) {
    const card = page.getByTestId('arrival');
    await expect(card).toHaveCSS('background-color', 'rgb(232, 238, 248)');
    expect(await contrastOf(card.locator('.browser__arrival-title'))).toBeGreaterThanOrEqual(4.5);
    expect(await contrastOf(card.locator('p').nth(1))).toBeGreaterThanOrEqual(4.5);
    if (phase === 'play') await page.getByRole('button', { name: 'Je to podvod' }).click();
  }
});

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
