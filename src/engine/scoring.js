// Scoring of one message (CLAUDE.md, section 8).
//
// decision: 'scam' ("Je to podvod") or 'ok' ("Je to v pořádku")
// marks: targets the player marked (advanced level only; ignored at basic level)

import { CLEAN_LEGIT_MARKING_POINTS, DECISION_POINTS } from './round.js';

export function scoreMessage(scenario, level, decision, marks = []) {
  const correct = (decision === 'scam') === scenario.isScam;
  const decisionPoints = correct ? DECISION_POINTS : 0;

  if (level === 'zakladni') {
    return {
      correct,
      decisionPoints,
      markingPoints: 0,
      total: decisionPoints,
      found: [],
      missed: [],
      extra: [],
      // Statistics: a scam judged as "ok" counts all its threats as missed
      missedCategories: scenario.isScam && !correct ? scenario.threats.map((t) => t.category) : [],
    };
  }

  const marked = new Set(marks);
  const threatTargets = new Set(scenario.threats.map((t) => t.target));
  const found = scenario.threats.filter((t) => marked.has(t.target));
  const missed = scenario.threats.filter((t) => !marked.has(t.target));
  const extra = [...marked].filter((target) => !threatTargets.has(target));

  let markingPoints;
  if (scenario.isScam) {
    // +1 per found threat, −1 per unnecessary mark, never below 0; counts even after a wrong decision
    markingPoints = Math.max(0, found.length - extra.length);
  } else {
    // Legitimate: 2 points only when nothing is marked, otherwise 0 (never negative)
    markingPoints = marked.size === 0 ? CLEAN_LEGIT_MARKING_POINTS : 0;
  }

  return {
    correct,
    decisionPoints,
    markingPoints,
    total: decisionPoints + markingPoints,
    found,
    missed,
    extra,
    missedCategories: missed.map((t) => t.category),
  };
}
