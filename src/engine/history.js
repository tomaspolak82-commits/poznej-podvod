// Player history in localStorage (CLAUDE.md, section 8).
// Storage is passed in, so the logic is testable without a browser. Every access is
// wrapped in try/catch: the app must work without localStorage (private window).

export const STORAGE_KEY = 'poznej-podvod:history:v1';

export function emptyHistory() {
  return { version: 1, best: {}, missedByCategory: {}, roundsPlayed: 0, lastRoundIds: {} };
}

// Returns window.localStorage if it really works, otherwise null
export function getBrowserStorage() {
  try {
    const storage = globalThis.localStorage;
    const probe = '__poznej-podvod-probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

function isValidHistory(data) {
  return (
    data &&
    data.version === 1 &&
    typeof data.best === 'object' &&
    typeof data.missedByCategory === 'object' &&
    Number.isInteger(data.roundsPlayed) &&
    typeof data.lastRoundIds === 'object'
  );
}

export function loadHistory(storage) {
  if (!storage) return emptyHistory();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return emptyHistory();
    const data = JSON.parse(raw);
    return isValidHistory(data) ? data : emptyHistory();
  } catch {
    return emptyHistory();
  }
}

// Returns true when saved
export function saveHistory(storage, history) {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}

export function clearHistory(storage) {
  if (!storage) return false;
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function hasHistory(history) {
  return history.roundsPlayed > 0 || Object.keys(history.lastRoundIds).length > 0;
}

// Better = higher percentage; same percentage → higher maximum wins.
// Compared as integers (a.score * b.max vs b.score * a.max) to avoid rounding.
export function isBetterResult(candidate, current) {
  if (!current) return true;
  const left = candidate.score * current.max;
  const right = current.score * candidate.max;
  if (left !== right) return left > right;
  return candidate.max > current.max;
}

export const bestKey = (section, level) => `${section}:${level}`;

// Records a finished round. Pure: returns a new history object and whether it is a new best.
export function recordRound(history, { section, level, score, max, missedCategories, ids }) {
  const key = bestKey(section, level);
  const previousBest = history.best[key] ?? null;
  const isNewBest = isBetterResult({ score, max }, previousBest);

  const missedByCategory = { ...history.missedByCategory };
  for (const category of missedCategories) {
    missedByCategory[category] = (missedByCategory[category] ?? 0) + 1;
  }

  return {
    history: {
      ...history,
      best: isNewBest ? { ...history.best, [key]: { score, max } } : history.best,
      missedByCategory,
      roundsPlayed: history.roundsPlayed + 1,
      lastRoundIds: { ...history.lastRoundIds, [section]: [...ids] },
    },
    isNewBest,
    previousBest,
  };
}

// Most often missed categories, most frequent first; ties keep a stable alphabetical order
export function topMissedCategories(history, limit = 2) {
  return Object.entries(history.missedByCategory)
    .filter(([, count]) => count > 0)
    .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b))
    .slice(0, limit)
    .map(([category]) => category);
}
