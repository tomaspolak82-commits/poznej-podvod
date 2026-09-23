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

export async function currentScenarioId(page) {
  return page.locator('[data-scenario-id]').getAttribute('data-scenario-id');
}

export async function startRound(page, { section = 'email', seed = 123, level = 'základní' } = {}) {
  await page.goto(`/?seed=${seed}#/${section}`);
  await page.getByRole('button', { name: new RegExp(`Začít: ${level}`) }).click();
}

// decide(scenario) → 'scam' | 'ok'; returns the list of played scenario IDs
export async function playRound(page, decide) {
  const played = [];
  for (let i = 0; i < 5; i += 1) {
    const id = await currentScenarioId(page);
    played.push(id);
    const choice = decide(scenarioById(id));
    await page.getByRole('button', { name: choice === 'scam' ? 'Je to podvod' : 'Je to v pořádku' }).click();
    await page.getByRole('button', { name: i < 4 ? /Další zpráva/ : /Zobrazit výsledek/ }).click();
  }
  return played;
}

// Answers messages correctly (without marking) until the one with the given ID is shown
export async function goToScenario(page, id) {
  for (let i = 0; i < 5; i += 1) {
    const current = await currentScenarioId(page);
    if (current === id) return;
    const decision = scenarioById(current).isScam ? 'Je to podvod' : 'Je to v pořádku';
    await page.getByRole('button', { name: decision }).click();
    await page.getByRole('button', { name: /Další zpráva/ }).click();
  }
  throw new Error(`Scenario ${id} is not in this round`);
}

export const correctly = (scenario) => (scenario.isScam ? 'scam' : 'ok');
export const wrongly = (scenario) => (scenario.isScam ? 'ok' : 'scam');
