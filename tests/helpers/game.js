// Helpers for game tests: the expected round is computed with the same engine
// functions and the same seed as the app, so tests know which messages come.

import path from 'node:path';
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
  const section = id.startsWith('email') ? 'email' : 'zpravy';
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

// E-mail: every message starts in the inbox; opens the task message when the inbox is shown.
// Sections without an inbox (Zprávy until milestone 5) show the message right away.
export async function openCurrentMessage(page) {
  await page.locator('[data-scenario-id]').waitFor();
  const task = page.locator('[data-mail="open"]');
  if (await task.count()) await task.click();
  await page.locator('article[data-scenario-id]').waitFor();
}

// Opens the next message in the round ("Další zpráva" + open it from the inbox)
export async function nextMessage(page) {
  await page.getByRole('button', { name: /Další zpráva/ }).click();
  await openCurrentMessage(page);
}

// Starts a round and opens its first message (use open: false to stay in the inbox)
export async function startRound(page, { section = 'email', seed = 123, level = 'základní', open = true } = {}) {
  await page.goto(`/?seed=${seed}#/${section}`);
  await page.getByRole('button', { name: new RegExp(`Začít: ${level}`) }).click();
  if (open) await openCurrentMessage(page);
}

// Shows the hidden sender address in the e-mail detail ("▾ zobrazit adresu")
export async function showAddress(page) {
  await page.locator('[data-mail="address"]').click();
}

// decide(scenario) → 'scam' | 'ok'; returns the list of played scenario IDs.
// Expects the first message to be open already.
export async function playRound(page, decide) {
  const played = [];
  for (let i = 0; i < 5; i += 1) {
    const id = await currentScenarioId(page);
    played.push(id);
    const choice = decide(scenarioById(id));
    await page.getByRole('button', { name: choice === 'scam' ? 'Je to podvod' : 'Je to v pořádku' }).click();
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
    const decision = scenarioById(current).isScam ? 'Je to podvod' : 'Je to v pořádku';
    await page.getByRole('button', { name: decision }).click();
    await nextMessage(page);
  }
  throw new Error(`Scenario ${id} is not in this round`);
}

export const correctly = (scenario) => (scenario.isScam ? 'scam' : 'ok');
export const wrongly = (scenario) => (scenario.isScam ? 'ok' : 'scam');
