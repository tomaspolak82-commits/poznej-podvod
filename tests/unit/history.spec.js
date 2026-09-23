import { test, expect } from '@playwright/test';
import {
  STORAGE_KEY,
  clearHistory,
  emptyHistory,
  hasHistory,
  isBetterResult,
  loadHistory,
  recordRound,
  saveHistory,
  topMissedCategories,
} from '../../src/engine/history.js';

// In-memory stand-in for window.localStorage
function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

// Storage that fails on every call (e.g. blocked site data)
const brokenStorage = {
  getItem() {
    throw new Error('blocked');
  },
  setItem() {
    throw new Error('blocked');
  },
  removeItem() {
    throw new Error('blocked');
  },
};

const round = (overrides = {}) => ({
  section: 'email',
  level: 'pokrocila',
  score: 15,
  max: 20,
  missedCategories: ['odesilatel', 'casovy-tlak'],
  ids: ['email-01', 'email-02', 'email-03', 'email-04', 'email-06'],
  ...overrides,
});

test.describe('history: storage', () => {
  test('empty storage gives empty history', () => {
    expect(loadHistory(memoryStorage())).toEqual(emptyHistory());
  });

  test('save and load round-trip', () => {
    const storage = memoryStorage();
    const { history } = recordRound(emptyHistory(), round());
    expect(saveHistory(storage, history)).toBe(true);
    expect(loadHistory(storage)).toEqual(history);
  });

  test('no storage (private window) → empty history, save reports false, no crash', () => {
    expect(loadHistory(null)).toEqual(emptyHistory());
    expect(saveHistory(null, emptyHistory())).toBe(false);
    expect(clearHistory(null)).toBe(false);
  });

  test('storage that throws → empty history, save reports false, no crash', () => {
    expect(loadHistory(brokenStorage)).toEqual(emptyHistory());
    expect(saveHistory(brokenStorage, emptyHistory())).toBe(false);
    expect(clearHistory(brokenStorage)).toBe(false);
  });

  test('corrupted JSON → empty history', () => {
    expect(loadHistory(memoryStorage({ [STORAGE_KEY]: '{not json' }))).toEqual(emptyHistory());
  });

  test('unknown data shape or version → empty history', () => {
    expect(loadHistory(memoryStorage({ [STORAGE_KEY]: '{"version":2}' }))).toEqual(emptyHistory());
    expect(loadHistory(memoryStorage({ [STORAGE_KEY]: '[1,2,3]' }))).toEqual(emptyHistory());
  });

  test('clear removes everything', () => {
    const storage = memoryStorage();
    saveHistory(storage, recordRound(emptyHistory(), round()).history);
    expect(clearHistory(storage)).toBe(true);
    expect(loadHistory(storage)).toEqual(emptyHistory());
  });
});

test.describe('history: recording a round', () => {
  test('first round is always the best and counts rounds, categories and IDs', () => {
    const { history, isNewBest, previousBest } = recordRound(emptyHistory(), round());
    expect(isNewBest).toBe(true);
    expect(previousBest).toBeNull();
    expect(history.best['email:pokrocila']).toEqual({ score: 15, max: 20 });
    expect(history.roundsPlayed).toBe(1);
    expect(history.missedByCategory).toEqual({ odesilatel: 1, 'casovy-tlak': 1 });
    expect(history.lastRoundIds.email).toEqual(round().ids);
  });

  test('categories add up across rounds', () => {
    let history = recordRound(emptyHistory(), round()).history;
    history = recordRound(history, round({ missedCategories: ['odesilatel'] })).history;
    expect(history.missedByCategory).toEqual({ odesilatel: 2, 'casovy-tlak': 1 });
    expect(history.roundsPlayed).toBe(2);
  });

  test('worse result keeps the previous best', () => {
    const first = recordRound(emptyHistory(), round({ score: 15, max: 16 })).history;
    const { history, isNewBest, previousBest } = recordRound(first, round({ score: 16, max: 20 }));
    expect(isNewBest).toBe(false);
    expect(previousBest).toEqual({ score: 15, max: 16 });
    expect(history.best['email:pokrocila']).toEqual({ score: 15, max: 16 });
  });

  test('sections and levels have separate bests', () => {
    let history = recordRound(emptyHistory(), round()).history;
    history = recordRound(history, round({ level: 'zakladni', score: 6, max: 10 })).history;
    history = recordRound(history, round({ section: 'zpravy', score: 1, max: 20 })).history;
    expect(Object.keys(history.best).sort()).toEqual(['email:pokrocila', 'email:zakladni', 'zpravy:pokrocila']);
  });

  test('last round IDs are stored per section', () => {
    let history = recordRound(emptyHistory(), round()).history;
    history = recordRound(history, round({ section: 'zpravy', ids: ['zpravy-01'] })).history;
    expect(history.lastRoundIds).toEqual({ email: round().ids, zpravy: ['zpravy-01'] });
  });

  test('input history is not changed (pure function)', () => {
    const before = emptyHistory();
    recordRound(before, round());
    expect(before).toEqual(emptyHistory());
  });

  test('hasHistory is false for empty and true after a round', () => {
    expect(hasHistory(emptyHistory())).toBe(false);
    expect(hasHistory(recordRound(emptyHistory(), round()).history)).toBe(true);
  });
});

test.describe('history: which result is better (percentage, then higher maximum)', () => {
  test('15 of 16 beats 16 of 20 (94 % vs 80 %)', () => {
    expect(isBetterResult({ score: 15, max: 16 }, { score: 16, max: 20 })).toBe(true);
    expect(isBetterResult({ score: 16, max: 20 }, { score: 15, max: 16 })).toBe(false);
  });

  test('same percentage: higher maximum wins (10 of 20 beats 5 of 10)', () => {
    expect(isBetterResult({ score: 10, max: 20 }, { score: 5, max: 10 })).toBe(true);
    expect(isBetterResult({ score: 5, max: 10 }, { score: 10, max: 20 })).toBe(false);
  });

  test('exactly the same result is not a new best', () => {
    expect(isBetterResult({ score: 8, max: 10 }, { score: 8, max: 10 })).toBe(false);
  });

  test('0 points is still the first best', () => {
    expect(isBetterResult({ score: 0, max: 10 }, null)).toBe(true);
  });

  test('0 of 10 does not beat 1 of 20', () => {
    expect(isBetterResult({ score: 0, max: 10 }, { score: 1, max: 20 })).toBe(false);
  });
});

test.describe('history: most often missed categories', () => {
  test('sorted by count, limited to 2', () => {
    const history = { ...emptyHistory(), missedByCategory: { priloha: 1, odesilatel: 5, 'casovy-tlak': 3 } };
    expect(topMissedCategories(history)).toEqual(['odesilatel', 'casovy-tlak']);
  });

  test('ties are in stable alphabetical order', () => {
    const history = { ...emptyHistory(), missedByCategory: { priloha: 2, odesilatel: 2 } };
    expect(topMissedCategories(history)).toEqual(['odesilatel', 'priloha']);
  });

  test('nothing missed → empty list', () => {
    expect(topMissedCategories(emptyHistory())).toEqual([]);
  });
});
