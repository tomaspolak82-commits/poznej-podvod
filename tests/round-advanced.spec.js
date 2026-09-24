import { test, expect } from '@playwright/test';
import { maxPointsForRound } from '../src/engine/round.js';
import {
  expectedRounds,
  goToScenario,
  nextMessage,
  openCurrentMessage,
  scenarioById,
  seedWith,
  showAddress,
  startRound,
} from './helpers/game.js';

// The round is chosen by its messages, not by a fixed seed (seedWith):
// scams email-02 (4 threats, sender threat on name + address), email-04 (3, attachment),
// email-05 (4, button) and legitimate email-07 (link) and email-08 (attachment).
const ROUND_IDS = ['email-02', 'email-04', 'email-05', 'email-07', 'email-08'];
const SEED = seedWith('email', ROUND_IDS);
const [ROUND] = expectedRounds('email', SEED);

async function startAdvanced(page) {
  await startRound(page, { seed: SEED, level: 'pokročilá' });
}

const mark = (page, target) => page.locator(`[data-mark="${target}"]`).click();
const decide = (page, scam) => page.getByRole('button', { name: scam ? 'Je to podvod' : 'Je to v pořádku' }).click();
const statusOf = (page, target) => page.locator(`.review-part[data-target="${target}"] [data-status]`);

test.beforeAll(() => {
  // Guard: the test data below relies on this exact round
  expect(ROUND.map((s) => s.id).sort()).toEqual(ROUND_IDS);
});

test.describe(`advanced level: marking (seed ${SEED})`, () => {
  test('bar shows the advanced maximum of the round; instruction is visible', async ({ page }) => {
    await startAdvanced(page);
    await expect(page.getByTestId('score')).toHaveText(`Body: 0 z ${maxPointsForRound(ROUND, 'pokrocila')}`);
    await expect(page.getByTestId('instruction')).toContainText('Klepněte na všechno');
  });

  test('sender address is hidden, "▾ zobrazit adresu" shows it and then it can be marked', async ({ page }) => {
    await startAdvanced(page);
    const scenario = scenarioById(ROUND[0].id);
    const address = page.locator('[data-mark="fromAddress"]');
    await expect(address).toHaveCount(0);
    await showAddress(page);
    await expect(address).toBeVisible();
    await expect(address).toContainText(scenario.message.fromAddress);
    await address.click();
    await expect(address).toHaveAttribute('aria-pressed', 'true');
    await expect(address).toContainText('Označeno');
  });

  test('second click removes the mark', async ({ page }) => {
    await startAdvanced(page);
    const subject = page.locator('[data-mark="subject"]');
    await subject.click();
    await expect(subject).toHaveAttribute('aria-pressed', 'true');
    await subject.click();
    await expect(subject).toHaveAttribute('aria-pressed', 'false');
    await expect(subject.locator('.mark-badge')).toBeHidden();
  });

  test('marking works with the keyboard (Space and Enter)', async ({ page }) => {
    await startAdvanced(page);
    const subject = page.locator('[data-mark="subject"]');
    await subject.focus();
    await page.keyboard.press('Space');
    await expect(subject).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Enter');
    await expect(subject).toHaveAttribute('aria-pressed', 'false');
  });

  for (const [id, target] of [
    ['email-05', 'button'],
    ['email-07', 'link'],
    ['email-04', 'attachment'],
  ]) {
    test(`${target} is only marked, no notice window appears (${id})`, async ({ page }) => {
      await startAdvanced(page);
      await goToScenario(page, id);
      await mark(page, target);
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(page.locator(`[data-mark="${target}"]`)).toHaveAttribute('aria-pressed', 'true');
    });
  }
});

test.describe(`advanced level: points, CLAUDE.md section 8 (seed ${SEED})`, () => {
  test('all threats found + correct decision = 2 + 4', async ({ page }) => {
    await startAdvanced(page);
    await goToScenario(page, 'email-02');
    await showAddress(page);
    for (const target of ['fromAddress', 'body.2', 'body.3', 'link']) await mark(page, target);
    await decide(page, true);
    await expect(page.getByTestId('gained')).toHaveText('Získali jste 6 bodů.');
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 4');
    await expect(page.locator('[data-status="found"]')).toHaveCount(4);
    await expect(page.locator('[data-status="missed"]')).toHaveCount(0);
  });

  test('missed threat is shown with "Tohle místo stojí za druhý pohled"', async ({ page }) => {
    await startAdvanced(page);
    await goToScenario(page, 'email-05');
    await mark(page, 'button');
    await decide(page, true);
    await expect(page.getByTestId('gained')).toHaveText('Získali jste 3 body.');
    await expect(statusOf(page, 'button')).toHaveText('Našli jste');
    await expect(statusOf(page, 'body.3')).toHaveText('Tohle místo stojí za druhý pohled');
  });

  test('unnecessary mark costs 1 point and is shown as "Označeno zbytečně"', async ({ page }) => {
    await startAdvanced(page);
    await goToScenario(page, 'email-05');
    await mark(page, 'button');
    await mark(page, 'body.3');
    // The greeting by name is the innocent part of email-05
    await mark(page, 'body.0');
    await decide(page, true);
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 1');
    await expect(statusOf(page, 'body.0')).toHaveText('Označeno zbytečně, tady je vše v pořádku');
  });

  test('unmarked part does not count (mark, unmark, decide)', async ({ page }) => {
    await startAdvanced(page);
    await goToScenario(page, 'email-04');
    await mark(page, 'attachment');
    await mark(page, 'body.4');
    await mark(page, 'body.4');
    await decide(page, true);
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 1');
    await expect(statusOf(page, 'body.4')).toHaveCount(0);
  });

  test('wrong decision still gets points for correctly marked threats', async ({ page }) => {
    await startAdvanced(page);
    await goToScenario(page, 'email-02');
    await mark(page, 'fromName');
    await mark(page, 'body.2');
    await decide(page, false);
    await expect(page.getByTestId('evaluation').getByRole('heading', { level: 1 })).toHaveText('Tahle zpráva je podvod.');
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 0 · Za označená místa: 2');
    await expect(page.getByTestId('gained')).toHaveText('Získali jste 2 body.');
  });

  test('more unnecessary marks than found: decision points stay, marking = 0', async ({ page }) => {
    await startAdvanced(page);
    await goToScenario(page, 'email-04');
    await mark(page, 'attachment');
    // Innocent parts of email-04: the company name and address, "if you have paid…", the signature
    await mark(page, 'fromName');
    await showAddress(page);
    await mark(page, 'fromAddress');
    await mark(page, 'body.5');
    await decide(page, true);
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 0');
    await expect(page.getByTestId('gained')).toHaveText('Získali jste 2 body.');
  });

  test('legitimate message, nothing marked = 2 + 2', async ({ page }) => {
    await startAdvanced(page);
    await goToScenario(page, 'email-08');
    await decide(page, false);
    await expect(page.getByTestId('gained')).toHaveText('Získali jste 4 body.');
    await expect(page.getByTestId('legit-marking')).toHaveText(
      'Nic jste neoznačili, správně: na zprávě nebylo nic podezřelého.',
    );
  });

  test('legitimate message with marks = 2 + 0, never negative', async ({ page }) => {
    await startAdvanced(page);
    await goToScenario(page, 'email-07');
    await mark(page, 'link');
    await mark(page, 'subject');
    await decide(page, false);
    await expect(page.getByTestId('gained')).toHaveText('Získali jste 2 body.');
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 0');
    await expect(page.getByTestId('legit-marking')).toHaveText(
      'Na zprávě nebylo nic podezřelého. Označená místa jsou v pořádku.',
    );
    await expect(statusOf(page, 'link')).toHaveText('Označeno zbytečně, tady je vše v pořádku');
  });

  test('marks do not carry over to the next message', async ({ page }) => {
    await startAdvanced(page);
    await mark(page, 'subject');
    await decide(page, false);
    await nextMessage(page);
    await expect(page.locator('[data-mark][aria-pressed="true"]')).toHaveCount(0);
  });
});

test('marking and evaluation: no horizontal scroll with 200 % text at 360 px', async ({ page }) => {
  const noScroll = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  await page.setViewportSize({ width: 360, height: 740 });
  await startAdvanced(page);
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await showAddress(page);
  await mark(page, 'fromAddress');
  expect(await noScroll()).toBe(true);
  await decide(page, true);
  expect(await noScroll()).toBe(true);
});

test.describe(`advanced level: whole round (seed ${SEED})`, () => {
  test('perfect round = the maximum shown before the start', async ({ page }) => {
    const max = maxPointsForRound(ROUND, 'pokrocila');
    await page.goto(`/?seed=${SEED}#/email`);
    await expect(page.getByTestId('max-points-pokrocila')).toHaveText(String(max));
    await page.getByRole('button', { name: /Začít: pokročilá/ }).click();
    await openCurrentMessage(page);

    for (let i = 0; i < 5; i += 1) {
      const scenario = scenarioById(await page.locator('[data-scenario-id]').getAttribute('data-scenario-id'));
      await showAddress(page);
      for (const threat of scenario.threats) await mark(page, threat.target);
      await decide(page, scenario.isScam);
      if (i < 4) await nextMessage(page);
      else await page.getByRole('button', { name: /Zobrazit výsledek/ }).click();
    }
    await expect(page.getByTestId('final-score')).toHaveText(`Získali jste ${max} z ${max} bodů.`);
    await expect(page.getByTestId('missed')).toHaveText('V tomto kole vám nic neuniklo.');
  });

  test('statistics count every unmarked threat, even after correct decisions', async ({ page }) => {
    await startAdvanced(page);
    for (let i = 0; i < 5; i += 1) {
      const scenario = scenarioById(await page.locator('[data-scenario-id]').getAttribute('data-scenario-id'));
      await decide(page, scenario.isScam);
      if (i < 4) await nextMessage(page);
      else await page.getByRole('button', { name: /Zobrazit výsledek/ }).click();
    }
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('poznej-podvod:history:v1')));
    const expected = {};
    for (const threat of ROUND.flatMap((s) => s.threats)) expected[threat.category] = (expected[threat.category] ?? 0) + 1;
    expect(stored.missedByCategory).toEqual(expected);
  });
});
