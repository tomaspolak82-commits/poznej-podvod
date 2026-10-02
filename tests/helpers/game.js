// Helpers for game tests: the expected round is computed with the same engine
// functions and the same seed as the app, so tests know which messages come.

import path from 'node:path';
import { expect } from '@playwright/test';
import { readSection } from '../../scripts/content-files.mjs';
import { createRandom } from '../../src/engine/random.js';
import { drawRound } from '../../src/engine/round.js';

const CONTENT_DIR = path.resolve('src/content');

export function scenarios(section) {
  return readSection(CONTENT_DIR, section)
    .map((file) => file.data)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function scenarioById(id) {
  const section = id.split('-')[0];
  return scenarios(section).find((s) => s.id === id);
}

// The app draws the first round when the level select opens, and the next one after "Hrát dalších 5"
export function expectedRounds(section, seed, count = 2) {
  const random = createRandom(seed);
  const rounds = [];
  let previous = [];
  for (let i = 0; i < count; i += 1) {
    const round = drawRound(scenarios(section), random, previous);
    rounds.push(round);
    previous = round.map((s) => s.id);
  }
  return rounds;
}

// Finds the first seed whose first round contains all the given scenarios.
// Tests ask for the messages they need instead of relying on one fixed seed, so adding
// scenarios to the bank does not break them. Put the seed in the test name.
export function seedWith(section, ids) {
  return seedWhere(section, (round) => ids.every((id) => round.some((s) => s.id === id)), ids.join(', '));
}

// Finds the first seed whose first round passes the check (e.g. a given message comes first)
export function seedWhere(section, check, description = 'the wanted messages') {
  for (let seed = 1; seed <= 10000; seed += 1) {
    const [round] = expectedRounds(section, seed, 1);
    if (check(round)) return seed;
  }
  throw new Error(`No seed gives a ${section} round with ${description}`);
}

export async function currentScenarioId(page) {
  return page.locator('[data-scenario-id]').getAttribute('data-scenario-id');
}

// E-mail: every message starts in the inbox, so the task message must be there and is opened.
// Zprávy has no inbox and shows the message right away. The section comes from the address
// (#/email…), not from what happens to be on the page, so a missing inbox fails the test.
export async function openCurrentMessage(page) {
  await page.locator('[data-scenario-id]').waitFor();
  if (new URL(page.url()).hash.startsWith('#/email')) {
    const task = page.locator('[data-mail="open"]');
    await expect(task).toBeVisible();
    await task.click();
  }
  await page.locator('article[data-scenario-id]').waitFor();
}

// Opens the next message in the round ("Další zpráva", in the browser "Další stránka",
// + open it from the inbox)
export async function nextMessage(page) {
  await page.getByRole('button', { name: /Další (zpráva|stránka)/ }).click();
  await openCurrentMessage(page);
}

// Browser: the first-visit intro is a screen of its own; tests that are not about it start
// as a player who has already seen it (the record the app stores, src/engine/intro.js)
export async function skipBrowserIntro(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('poznej-podvod:browser-intro:v1', 'seen');
    } catch {
      // A test that blocks the storage checks the intro itself
    }
  });
}

// Starts a round and opens its first message (use open: false to stay in the inbox)
export async function startRound(page, { section = 'email', seed = 123, level = 'základní', open = true } = {}) {
  if (section === 'prohlizec') await skipBrowserIntro(page);
  await page.goto(`/?seed=${seed}#/${section}`);
  await page.getByRole('button', { name: new RegExp(`Začít: ${level}`) }).click();
  if (open) await openCurrentMessage(page);
}

// Shows the hidden sender address in the e-mail detail ("▾ zobrazit adresu")
export async function showAddress(page) {
  await page.locator('[data-mail="address"]').click();
}

// Clicks a decision ('scam' | 'ok'). At the advanced level a decision that does not match the
// marks ("scam" with nothing marked, "ok" with something marked) must open a confirmation
// window; this confirms it, so the answer counts as before. Without a mismatch the window must
// not appear. Tests of the window itself click the decision button directly.
export async function decide(page, choice) {
  // Level and marks are read from the open message before the click: parts to mark exist only
  // at the advanced level, and aria-pressed is set as soon as a part is clicked.
  const { advanced, marked } = await page.locator('article[data-scenario-id]').evaluate((message) => ({
    advanced: message.querySelector('[data-mark]') !== null,
    marked: message.querySelectorAll('[data-mark][aria-pressed="true"]').length,
  }));
  const mismatch = advanced && (choice === 'scam' ? marked === 0 : marked > 0);

  await page.getByRole('button', { name: choice === 'scam' ? 'Je to podvod' : 'Je to v pořádku' }).click();
  const dialog = page.locator('dialog[open]');
  if (mismatch) {
    await expect(dialog).toBeVisible();
    await dialog.locator('[data-value="confirm"]').click();
  }
  await expect(dialog).toHaveCount(0);
}

// choose(scenario) → 'scam' | 'ok'; returns the list of played scenario IDs.
// Expects the first message to be open already.
export async function playRound(page, choose) {
  const played = [];
  for (let i = 0; i < 5; i += 1) {
    const id = await currentScenarioId(page);
    played.push(id);
    await decide(page, choose(scenarioById(id)));
    if (i < 4) await nextMessage(page);
    else await page.getByRole('button', { name: /Zobrazit výsledek/ }).click();
  }
  return played;
}

// Answers messages correctly (without marking) until the one with the given ID is open
export async function goToScenario(page, id) {
  for (let i = 0; i < 5; i += 1) {
    const current = await currentScenarioId(page);
    if (current === id) return;
    await decide(page, scenarioById(current).isScam ? 'scam' : 'ok');
    await nextMessage(page);
  }
  throw new Error(`Scenario ${id} is not in this round`);
}

// Advanced evaluation: "Získali jste…", "Za rozhodnutí" and "Za označená místa" each on a line
// of its own (Tomáš, 2. 10. 2026), so the line below starts under the one above
export async function expectBreakdown(page, decision, marking) {
  const gained = page.getByTestId('gained');
  const decisionLine = page.getByTestId('breakdown-decision');
  const markingLine = page.getByTestId('breakdown-marking');
  await expect(decisionLine).toHaveText(`Za rozhodnutí: ${decision}`);
  await expect(markingLine).toHaveText(`Za označená místa: ${marking}`);
  const [a, b, c] = await Promise.all([gained.boundingBox(), decisionLine.boundingBox(), markingLine.boundingBox()]);
  expect(b.y).toBeGreaterThanOrEqual(a.y + a.height - 1);
  expect(c.y).toBeGreaterThanOrEqual(b.y + b.height - 1);
}

export const correctly =(scenario) => (scenario.isScam ? 'scam' : 'ok');
export const wrongly = (scenario) => (scenario.isScam ? 'ok' : 'scam');
