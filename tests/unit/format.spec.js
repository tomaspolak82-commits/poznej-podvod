import { test, expect } from '@playwright/test';
import { messagesWord, points, pointsWord, pointsWordAfterOf, roundsWord, scoreOf } from '../../src/ui/format.js';

test.describe('Czech plurals', () => {
  for (const [count, expected] of [
    [0, 'bodů'],
    [1, 'bod'],
    [2, 'body'],
    [3, 'body'],
    [4, 'body'],
    [5, 'bodů'],
    [10, 'bodů'],
    [11, 'bodů'],
    [21, 'bodů'],
    [22, 'bodů'],
    [100, 'bodů'],
  ]) {
    test(`${count} ${expected}`, () => {
      expect(pointsWord(count)).toBe(expected);
    });
  }

  for (const [count, expected] of [
    [0, 'kol'],
    [1, 'kolo'],
    [2, 'kola'],
    [4, 'kola'],
    [5, 'kol'],
    [12, 'kol'],
  ]) {
    test(`${count} ${expected}`, () => {
      expect(roundsWord(count)).toBe(expected);
    });
  }

  for (const [count, expected] of [
    [1, 'zpráva'],
    [3, 'zprávy'],
    [5, 'zpráv'],
  ]) {
    test(`${count} ${expected}`, () => {
      expect(messagesWord(count)).toBe(expected);
    });
  }

  test('"z" takes genitive: z 1 bodu, z 2 bodů, z 19 bodů', () => {
    expect(pointsWordAfterOf(1)).toBe('bodu');
    expect(pointsWordAfterOf(2)).toBe('bodů');
    expect(pointsWordAfterOf(19)).toBe('bodů');
  });

  test('full phrases', () => {
    expect(points(0)).toBe('0 bodů');
    expect(points(1)).toBe('1 bod');
    expect(points(4)).toBe('4 body');
    expect(points(5)).toBe('5 bodů');
    expect(scoreOf(16, 19)).toBe('16 z 19 bodů');
    expect(scoreOf(0, 10)).toBe('0 z 10 bodů');
  });
});
