// Whole journeys across screens (milestone 3, part 5).
import { test, expect } from '@playwright/test';
import { createRandom } from '../src/engine/random.js';
import { drawRound } from '../src/engine/round.js';
import {
  correctly,
  currentScenarioId,
  expectedRounds,
  openCurrentMessage,
  playRound,
  scenarioById,
  scenarios,
  startRound,
} from './helpers/game.js';

const ids = (round) => round.map((s) => s.id);

// Presses Tab until the focused element has the given accessible text (max 60 presses)
async function tabTo(page, name) {
  for (let i = 0; i < 60; i += 1) {
    await page.keyboard.press('Tab');
    const text = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '');
    if (typeof name === 'string' ? text === name : name.test(text)) return;
  }
  throw new Error(`Could not reach "${name}" with the Tab key`);
}

test('whole basic round with the keyboard only', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard journey is checked on desktop');
  await page.goto('/?seed=123');
  await tabTo(page, /^E-mail/);
  await page.keyboard.press('Enter');
  await tabTo(page, /Začít: základní úroveň/);
  await page.keyboard.press('Enter');

  for (let i = 0; i < 5; i += 1) {
    const scenario = scenarioById(await currentScenarioId(page));
    // Open the task message in the inbox; the sender address is shown with the keyboard too
    await tabTo(page, new RegExp(`^${scenario.message.fromName}`));
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-mail="back"]')).toBeFocused();
    await tabTo(page, 'zobrazit adresu');
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-mail="address"]')).toBeFocused();
    await expect(page.getByText(scenario.message.fromAddress)).toBeVisible();
    await tabTo(page, correctly(scenario) === 'scam' ? 'Je to podvod' : 'Je to v pořádku');
    await page.keyboard.press('Enter');
    // Focus moved to the evaluation heading, so Tab continues from the top of the new screen
    await expect(page.getByTestId('evaluation').getByRole('heading', { level: 1 })).toBeFocused();
    await tabTo(page, i < 4 ? /Další zpráva/ : /Zobrazit výsledek/);
    await page.keyboard.press('Enter');
  }
  await expect(page.getByTestId('final-score')).toHaveText('Získali jste 10 z 10 bodů.');
});

test('closing a window returns focus to the element that opened it', async ({ page }) => {
  await startRound(page);
  const hint = page.getByRole('button', { name: 'Na co si dát pozor?' });
  await hint.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(hint).toBeFocused();
});

test('no repeat across visits: after a reload the next round avoids the previous one', async ({ page }) => {
  const [first] = expectedRounds('email', 123);
  await startRound(page);
  await playRound(page, correctly);

  // New visit: the page loads again with the same seed, the history remembers the last round
  await page.goto('/?seed=123#/email');
  await page.reload();
  const expectedSecond = drawRound(scenarios('email'), createRandom(123), ids(first));
  await page.getByRole('button', { name: /Začít: základní/ }).click();
  await openCurrentMessage(page);
  expect(await playRound(page, correctly)).toEqual(ids(expectedSecond));
});

test('whole advanced round in the messages section, including links inside bubbles', async ({ page }) => {
  await startRound(page, { section: 'zpravy', seed: 11, level: 'pokročilá' });
  let marked = 0;
  for (let i = 0; i < 5; i += 1) {
    const scenario = scenarioById(await currentScenarioId(page));
    for (const threat of scenario.threats) {
      await page.locator(`[data-mark="${threat.target}"]`).click();
      marked += 1;
    }
    await page.getByRole('button', { name: scenario.isScam ? 'Je to podvod' : 'Je to v pořádku' }).click();
    await expect(page.locator('[data-status="missed"]')).toHaveCount(0);
    await page.getByRole('button', { name: i < 4 ? /Další zpráva/ : /Zobrazit výsledek/ }).click();
  }
  expect(marked).toBeGreaterThan(0);
  await expect(page.getByTestId('missed')).toHaveText('V tomto kole vám nic neuniklo.');
});

test('round bar sticks to the top on a normal screen, not on a very low one', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 800 });
  await startRound(page);
  const position = () => page.locator('.round-bar').evaluate((el) => getComputedStyle(el).position);
  expect(await position()).toBe('sticky');

  await page.setViewportSize({ width: 412, height: 500 });
  expect(await position()).toBe('static');
});

test('with reduced motion the animations are switched off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startRound(page);
  await page.getByRole('button', { name: 'Je to podvod' }).click();
  const duration = await page
    .locator('.evaluation-result')
    .evaluate((el) => parseFloat(getComputedStyle(el).animationDuration));
  expect(duration).toBeLessThan(0.001);
});
