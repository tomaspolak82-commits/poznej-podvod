// Runtime state of the game in the browser: the round drawn on the level select
// screen, the round being played and saving finished rounds to history.
// Kept in memory only, so a page reload drops an unfinished round (CLAUDE.md, section 5).

import { getScenarios } from './content.js';
import { getBrowserStorage, loadHistory, recordRound, saveHistory } from './history.js';
import { createRandom, randomSeed, seedFromSearch } from './random.js';
import { drawRound, maxPointsForRound } from './round.js';
import { scoreMessage } from './scoring.js';

// One random sequence per page load; ?seed=123 makes it repeatable for tests
const random = createRandom(seedFromSearch(window.location.search) ?? randomSeed());
const storage = getBrowserStorage();

let prepared = null;
let active = null;

export function getHistory() {
  return loadHistory(storage);
}

// Draws the next round of a section (called when the level select opens)
export function prepareRound(section) {
  const previousIds = getHistory().lastRoundIds[section] ?? [];
  prepared = { section, scenarios: drawRound(getScenarios(section), random, previousIds) };
  return prepared.scenarios;
}

export function startRound(section, level) {
  if (!prepared || prepared.section !== section) prepareRound(section);
  const { scenarios } = prepared;
  prepared = null;
  active = {
    section,
    level,
    scenarios,
    max: maxPointsForRound(scenarios, level),
    index: 0,
    phase: 'question', // question → evaluation → … → end
    marks: new Set(), // advanced level: targets marked on the current message
    results: [],
    end: null,
  };
  return active;
}

// Marks or unmarks a part of the current message; returns the new state
export function toggleMark(target) {
  if (active.marks.has(target)) active.marks.delete(target);
  else active.marks.add(target);
  return active.marks.has(target);
}

export function getActiveRound(section) {
  return active && active.section === section ? active : null;
}

export function abandonRound() {
  active = null;
}

export function currentScenario() {
  return active.scenarios[active.index];
}

export function currentScore() {
  return active.results.reduce((sum, result) => sum + result.total, 0);
}

export function answer(decision) {
  const marks = [...active.marks];
  const result = scoreMessage(currentScenario(), active.level, decision, marks);
  active.results.push({ ...result, decision, marks });
  active.phase = 'evaluation';
  return result;
}

export function lastResult() {
  return active.results.at(-1);
}

export function isLastMessage() {
  return active.index === active.scenarios.length - 1;
}

// Missed categories of this round, most frequent first, each once
function roundMissedCategories(results) {
  const counts = new Map();
  for (const category of results.flatMap((r) => r.missedCategories)) {
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([category]) => category);
}

export function nextMessage() {
  if (!isLastMessage()) {
    active.index += 1;
    active.phase = 'question';
    active.marks = new Set();
    return;
  }

  const score = currentScore();
  const { history, isNewBest, previousBest } = recordRound(getHistory(), {
    section: active.section,
    level: active.level,
    score,
    max: active.max,
    missedCategories: active.results.flatMap((r) => r.missedCategories),
    ids: active.scenarios.map((s) => s.id),
  });
  saveHistory(storage, history);
  active.phase = 'end';
  active.end = { score, max: active.max, isNewBest, previousBest, missedCategories: roundMissedCategories(active.results) };
}
