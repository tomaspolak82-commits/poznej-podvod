// Drawing a round and computing its maximum (CLAUDE.md, sections 7 and 8).

import { shuffle } from './random.js';

export const ROUND_SIZE = 5;
export const MAX_LEGIT_PER_ROUND = 2;
export const DECISION_POINTS = 2;
export const CLEAN_LEGIT_MARKING_POINTS = 2;

// Picks `count` items, preferring ones not played in the previous round.
function pickPreferFresh(pool, count, previousIds, random) {
  const fresh = shuffle(pool.filter((s) => !previousIds.has(s.id)), random);
  const repeated = shuffle(pool.filter((s) => previousIds.has(s.id)), random);
  return [...fresh, ...repeated].slice(0, count);
}

// Draws a round: 5 scenarios, 1–2 of them legitimate, avoiding the previous round
// of the same section when the bank allows it. Order is random.
export function drawRound(scenarios, random, previousIds = []) {
  const previous = new Set(previousIds);
  const legitPool = scenarios.filter((s) => !s.isScam);
  const scamPool = scenarios.filter((s) => s.isScam);

  // 1 or 2 legitimate, limited by what the bank has
  let legitCount = random() < 0.5 ? 1 : 2;
  legitCount = Math.min(legitCount, legitPool.length);
  // Not enough scams → use more legitimate ones, still at most 2
  if (ROUND_SIZE - legitCount > scamPool.length) legitCount = ROUND_SIZE - scamPool.length;

  if (legitCount < 1 || legitCount > MAX_LEGIT_PER_ROUND || legitCount > legitPool.length) {
    throw new Error(`Nelze vylosovat kolo: ${scamPool.length} podvodů a ${legitPool.length} legitimních zpráv.`);
  }

  const picked = [
    ...pickPreferFresh(legitPool, legitCount, previous, random),
    ...pickPreferFresh(scamPool, ROUND_SIZE - legitCount, previous, random),
  ];
  return shuffle(picked, random);
}

// Maximum points one scenario can give at a level
export function maxPointsForScenario(scenario, level) {
  if (level === 'zakladni') return DECISION_POINTS;
  return DECISION_POINTS + (scenario.isScam ? scenario.threats.length : CLEAN_LEGIT_MARKING_POINTS);
}

export function maxPointsForRound(round, level) {
  return round.reduce((sum, scenario) => sum + maxPointsForScenario(scenario, level), 0);
}
