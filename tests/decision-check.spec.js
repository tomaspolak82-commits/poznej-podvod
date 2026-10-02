import { test, expect } from '@playwright/test';
import { scoreMessage } from '../src/engine/scoring.js';
import { currentScenarioId, expectBreakdown, scenarioById, startRound } from './helpers/game.js';

// Advanced level: a decision that does not match the marks is confirmed in a window
// (Tomáš, 28. 9. 2026). Scoring does not change; the basic level has no window.

const SCAM_TITLE = 'Nemáte označené žádné podezřelé místo';
const SCAM_TEXT = 'Zprávu ale hodnotíte jako podvod. Chcete ještě označit, co vám přišlo podezřelé?';
const OK_TITLE = 'Máte označená podezřelá místa';
const OK_TEXT = 'Zprávu ale hodnotíte jako v pořádku. Je to tak?';

const click = (page, name) => page.getByRole('button', { name, exact: true }).click();
const dialog = (page) => page.getByRole('dialog');
const evaluation = (page) => page.getByTestId('evaluation');

async function expectAccessibleWindow(page, title, text, back, confirm) {
  await expect(dialog(page)).toBeVisible();
  // The screen reader announces the mismatch as the name of the window and the text as its description;
  // TRÉNINK is not repeated in the window (it stays in the bar above)
  await expect(dialog(page)).toHaveAccessibleName(title);
  await expect(dialog(page).getByRole('heading')).toHaveText(title);
  await expect(dialog(page)).toHaveAccessibleDescription(text);
  await expect(dialog(page)).not.toContainText('TRÉNINK');
  // Focus on the first button, the safe way back to the message
  const buttons = dialog(page).getByRole('button');
  await expect(buttons).toHaveText([back, confirm]);
  await expect(buttons.first()).toBeFocused();
  for (const box of [await buttons.nth(0).boundingBox(), await buttons.nth(1).boundingBox()]) {
    expect(box.height).toBeGreaterThanOrEqual(47.5);
  }
}

test.describe('advanced level: "scam" with nothing marked', () => {
  test.beforeEach(async ({ page }) => {
    await startRound(page, { level: 'pokročilá' });
    await click(page, 'Je to podvod');
  });

  test('the window asks, is accessible and has the safe choice first', async ({ page }) => {
    await expectAccessibleWindow(page, SCAM_TITLE, SCAM_TEXT, 'Označit místa', 'Ano, je to podvod');
  });

  test('"Označit místa" returns to the message; after marking the decision goes through', async ({ page }) => {
    await click(page, 'Označit místa');
    await expect(dialog(page)).toHaveCount(0);
    await expect(evaluation(page)).toHaveCount(0);
    await page.locator('[data-mark="subject"]').click();
    await click(page, 'Je to podvod');
    await expect(dialog(page)).toHaveCount(0);
    await expect(evaluation(page)).toBeVisible();
  });

  test('Esc returns to the message too', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expect(dialog(page)).toHaveCount(0);
    await expect(evaluation(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Je to podvod' })).toBeVisible();
  });

  test('"Ano, je to podvod" goes on to the evaluation, scored exactly as without the window', async ({ page }) => {
    const scenario = scenarioById(await currentScenarioId(page));
    await click(page, 'Ano, je to podvod');
    await expect(evaluation(page)).toBeVisible();
    const expected = scoreMessage(scenario, 'pokrocila', 'scam', []);
    await expectBreakdown(page, expected.decisionPoints, expected.markingPoints);
  });
});

test.describe('advanced level: "ok" with a part marked', () => {
  test.beforeEach(async ({ page }) => {
    await startRound(page, { level: 'pokročilá' });
    await page.locator('[data-mark="subject"]').click();
    await click(page, 'Je to v pořádku');
  });

  test('the window asks, is accessible and has the safe choice first', async ({ page }) => {
    await expectAccessibleWindow(page, OK_TITLE, OK_TEXT, 'Zpět ke zprávě', 'Ano, je v pořádku');
  });

  test('"Zpět ke zprávě" returns to the message with the mark kept', async ({ page }) => {
    await click(page, 'Zpět ke zprávě');
    await expect(dialog(page)).toHaveCount(0);
    await expect(evaluation(page)).toHaveCount(0);
    await expect(page.locator('[data-mark="subject"]')).toHaveAttribute('aria-pressed', 'true');
  });

  test('"Ano, je v pořádku" goes on to the evaluation', async ({ page }) => {
    await click(page, 'Ano, je v pořádku');
    await expect(evaluation(page)).toBeVisible();
    await expect(page.locator('[data-status]').first()).toBeVisible();
  });
});

test.describe('no window when the decision matches the marks', () => {
  test('advanced: "scam" with a part marked', async ({ page }) => {
    await startRound(page, { level: 'pokročilá' });
    await page.locator('[data-mark="subject"]').click();
    await click(page, 'Je to podvod');
    await expect(dialog(page)).toHaveCount(0);
    await expect(evaluation(page)).toBeVisible();
  });

  test('advanced: "ok" with nothing marked', async ({ page }) => {
    await startRound(page, { level: 'pokročilá' });
    await click(page, 'Je to v pořádku');
    await expect(dialog(page)).toHaveCount(0);
    await expect(evaluation(page)).toBeVisible();
  });
});

test.describe('basic level: never a window', () => {
  for (const decision of ['Je to podvod', 'Je to v pořádku']) {
    test(`"${decision}" goes straight to the evaluation`, async ({ page }) => {
      await startRound(page);
      await click(page, decision);
      await expect(dialog(page)).toHaveCount(0);
      await expect(evaluation(page)).toBeVisible();
    });
  }
});
