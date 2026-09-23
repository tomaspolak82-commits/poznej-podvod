import { test, expect } from '@playwright/test';
import { scoreMessage } from '../../src/engine/scoring.js';

// Scam with 3 threats (like the example in CLAUDE.md, section 7)
const scam = {
  id: 'email-99',
  isScam: true,
  threats: [
    { target: 'fromAddress', category: 'odesilatel' },
    { target: 'body.1', category: 'casovy-tlak' },
    { target: 'button', category: 'odkaz-platba' },
  ],
};
const legit = { id: 'email-98', isScam: false, threats: [] };

test.describe('scoring: basic level (CLAUDE.md, section 8)', () => {
  test('correct decision on a scam = 2 points', () => {
    const result = scoreMessage(scam, 'zakladni', 'scam');
    expect(result).toMatchObject({ correct: true, decisionPoints: 2, markingPoints: 0, total: 2 });
  });

  test('wrong decision on a scam = 0 points', () => {
    expect(scoreMessage(scam, 'zakladni', 'ok').total).toBe(0);
  });

  test('correct decision on a legitimate message = 2 points', () => {
    expect(scoreMessage(legit, 'zakladni', 'ok').total).toBe(2);
  });

  test('wrong decision on a legitimate message = 0 points', () => {
    expect(scoreMessage(legit, 'zakladni', 'scam').total).toBe(0);
  });

  test('marks are ignored at basic level', () => {
    expect(scoreMessage(scam, 'zakladni', 'scam', ['fromAddress', 'subject']).total).toBe(2);
  });

  test('statistics: scam judged "ok" counts all its threats as missed', () => {
    expect(scoreMessage(scam, 'zakladni', 'ok').missedCategories).toEqual([
      'odesilatel',
      'casovy-tlak',
      'odkaz-platba',
    ]);
  });

  test('statistics: correctly recognised scam counts nothing', () => {
    expect(scoreMessage(scam, 'zakladni', 'scam').missedCategories).toEqual([]);
  });

  test('statistics: legitimate message judged as scam counts nothing', () => {
    expect(scoreMessage(legit, 'zakladni', 'scam').missedCategories).toEqual([]);
  });
});

test.describe('scoring: advanced level, scam', () => {
  test('all threats marked, correct decision = 2 + 3', () => {
    const result = scoreMessage(scam, 'pokrocila', 'scam', ['fromAddress', 'body.1', 'button']);
    expect(result).toMatchObject({ decisionPoints: 2, markingPoints: 3, total: 5 });
    expect(result.missed).toEqual([]);
    expect(result.extra).toEqual([]);
  });

  test('one threat missed = 2 + 2, missed threat is reported', () => {
    const result = scoreMessage(scam, 'pokrocila', 'scam', ['fromAddress', 'button']);
    expect(result.total).toBe(4);
    expect(result.missed.map((t) => t.target)).toEqual(['body.1']);
    expect(result.missedCategories).toEqual(['casovy-tlak']);
  });

  test('unnecessary mark = −1 from marking points', () => {
    const result = scoreMessage(scam, 'pokrocila', 'scam', ['fromAddress', 'body.1', 'subject']);
    expect(result).toMatchObject({ markingPoints: 1, total: 3 });
    expect(result.extra).toEqual(['subject']);
  });

  test('example from CLAUDE.md: 1 found, 3 unnecessary → 2 + max(0, 1 − 3) = 2', () => {
    const result = scoreMessage(scam, 'pokrocila', 'scam', ['button', 'subject', 'body.0', 'fromName']);
    expect(result).toMatchObject({ decisionPoints: 2, markingPoints: 0, total: 2 });
  });

  test('wrong decision still gets points for correctly marked threats', () => {
    const result = scoreMessage(scam, 'pokrocila', 'ok', ['fromAddress', 'button']);
    expect(result).toMatchObject({ correct: false, decisionPoints: 0, markingPoints: 2, total: 2 });
  });

  test('more unnecessary than found marks: decision points stay, marking = 0', () => {
    const result = scoreMessage(scam, 'pokrocila', 'scam', ['button', 'subject', 'fromName']);
    expect(result).toMatchObject({ decisionPoints: 2, markingPoints: 0, total: 2 });
  });

  test('nothing marked, wrong decision = 0, all threats missed', () => {
    const result = scoreMessage(scam, 'pokrocila', 'ok', []);
    expect(result.total).toBe(0);
    expect(result.missedCategories).toHaveLength(3);
  });

  test('statistics count missed threats even after a correct decision', () => {
    expect(scoreMessage(scam, 'pokrocila', 'scam', ['button']).missedCategories).toEqual([
      'odesilatel',
      'casovy-tlak',
    ]);
  });

  test('marking the same target twice counts once (unmark then mark again)', () => {
    expect(scoreMessage(scam, 'pokrocila', 'scam', ['button', 'button']).markingPoints).toBe(1);
  });
});

test.describe('scoring: advanced level, legitimate message', () => {
  test('nothing marked, correct decision = 2 + 2', () => {
    expect(scoreMessage(legit, 'pokrocila', 'ok', [])).toMatchObject({ markingPoints: 2, total: 4 });
  });

  test('anything marked = 0 marking points, never negative', () => {
    const result = scoreMessage(legit, 'pokrocila', 'ok', ['subject', 'body.0', 'fromAddress']);
    expect(result).toMatchObject({ markingPoints: 0, total: 2 });
    expect(result.extra).toEqual(['subject', 'body.0', 'fromAddress']);
  });

  test('nothing marked but wrong decision = 0 + 2', () => {
    expect(scoreMessage(legit, 'pokrocila', 'scam', []).total).toBe(2);
  });

  test('statistics: legitimate message never adds missed categories', () => {
    expect(scoreMessage(legit, 'pokrocila', 'scam', ['subject']).missedCategories).toEqual([]);
  });
});

test('points are always whole numbers', () => {
  for (const marks of [[], ['button'], ['button', 'subject'], ['fromAddress', 'body.1', 'button', 'subject']]) {
    for (const decision of ['scam', 'ok']) {
      expect(Number.isInteger(scoreMessage(scam, 'pokrocila', decision, marks).total)).toBe(true);
    }
  }
});
