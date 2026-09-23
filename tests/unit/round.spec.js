import { test, expect } from '@playwright/test';
import { createRandom, seedFromSearch, shuffle } from '../../src/engine/random.js';
import { drawRound, maxPointsForRound, maxPointsForScenario } from '../../src/engine/round.js';

function bank(scams, legits) {
  return [
    ...Array.from({ length: scams }, (_, i) => ({ id: `s${i + 1}`, isScam: true, threats: Array(1 + (i % 4)).fill({}) })),
    ...Array.from({ length: legits }, (_, i) => ({ id: `l${i + 1}`, isScam: false, threats: [] })),
  ];
}
const ids = (round) => round.map((s) => s.id);

test.describe('seeded random', () => {
  test('same seed gives the same sequence', () => {
    const a = createRandom(123);
    const b = createRandom(123);
    expect(Array.from({ length: 5 }, a)).toEqual(Array.from({ length: 5 }, b));
  });

  test('different seeds give different sequences', () => {
    expect(createRandom(1)()).not.toBe(createRandom(2)());
  });

  test('numbers are in [0, 1)', () => {
    const random = createRandom(7);
    for (let i = 0; i < 1000; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  test('shuffle keeps all items and does not change the input', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input, createRandom(5));
    expect([...result].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  for (const [search, expected] of [
    ['?seed=123', 123],
    ['?seed=0', 0],
    ['', null],
    ['?seed=', null],
    ['?seed=abc', null],
    ['?seed=-5', null],
    ['?seed=1.5', null],
    ['?other=1&seed=42', 42],
  ]) {
    test(`seed from "${search}" = ${expected}`, () => {
      expect(seedFromSearch(search)).toBe(expected);
    });
  }
});

test.describe('drawing a round', () => {
  test('round has 5 messages, no duplicates', () => {
    const round = drawRound(bank(5, 2), createRandom(1));
    expect(round).toHaveLength(5);
    expect(new Set(ids(round)).size).toBe(5);
  });

  test('every round has 1–2 legitimate messages (500 seeds)', () => {
    const counts = new Set();
    for (let seed = 0; seed < 500; seed += 1) {
      const legit = drawRound(bank(20, 6), createRandom(seed)).filter((s) => !s.isScam).length;
      expect(legit).toBeGreaterThanOrEqual(1);
      expect(legit).toBeLessThanOrEqual(2);
      counts.add(legit);
    }
    // Both 1 and 2 actually occur
    expect([...counts].sort()).toEqual([1, 2]);
  });

  test('same seed always gives the same messages in the same order', () => {
    expect(ids(drawRound(bank(20, 6), createRandom(123)))).toEqual(ids(drawRound(bank(20, 6), createRandom(123))));
  });

  test('previous round is not repeated when the bank allows it', () => {
    const scenarios = bank(20, 6);
    for (let seed = 0; seed < 100; seed += 1) {
      const random = createRandom(seed);
      const first = drawRound(scenarios, random);
      const second = drawRound(scenarios, random, ids(first));
      expect(ids(second).filter((id) => ids(first).includes(id))).toEqual([]);
    }
  });

  test('small bank: repeats only as many as necessary', () => {
    // 5 scams + 2 legit (milestone 3 test content): the next round must reuse some messages
    const scenarios = bank(5, 2);
    const previous = ['s1', 's2', 's3', 's4', 'l1'];
    const round = drawRound(scenarios, createRandom(3), previous);
    expect(ids(round)).toContain('s5');
    expect(ids(round)).toContain('l2');
  });

  test('bank with only 1 legitimate message → every round has exactly 1', () => {
    for (let seed = 0; seed < 50; seed += 1) {
      expect(drawRound(bank(6, 1), createRandom(seed)).filter((s) => !s.isScam)).toHaveLength(1);
    }
  });

  test('bank with only 3 scams → 2 legitimate fill the round', () => {
    expect(drawRound(bank(3, 4), createRandom(1)).filter((s) => !s.isScam)).toHaveLength(2);
  });

  test('too small bank throws a clear error', () => {
    expect(() => drawRound(bank(2, 2), createRandom(1))).toThrow(/Nelze vylosovat kolo/);
    expect(() => drawRound(bank(6, 0), createRandom(1))).toThrow(/Nelze vylosovat kolo/);
  });
});

test.describe('maximum points', () => {
  const scam3 = { isScam: true, threats: [{}, {}, {}] };
  const legit = { isScam: false, threats: [] };

  test('basic: every message = 2, round of 5 = 10', () => {
    expect(maxPointsForScenario(scam3, 'zakladni')).toBe(2);
    expect(maxPointsForRound([scam3, scam3, scam3, legit, legit], 'zakladni')).toBe(10);
  });

  test('advanced: scam = 2 + number of threats, legitimate = 4', () => {
    expect(maxPointsForScenario(scam3, 'pokrocila')).toBe(5);
    expect(maxPointsForScenario(legit, 'pokrocila')).toBe(4);
    expect(maxPointsForRound([scam3, scam3, scam3, legit, legit], 'pokrocila')).toBe(23);
  });
});
