import { test, expect } from '@playwright/test';
import { THREAT_CATEGORIES } from '../../src/engine/categories.js';
import { CATEGORY_LABELS, EVALUATION, HINTS, MESSAGES_APP, ROUND_END, WELCOME } from '../../src/texts.js';

test('every allowed category has a Czech label, and no label is left over', () => {
  expect(Object.keys(CATEGORY_LABELS).sort()).toEqual([...THREAT_CATEGORIES].sort());
});

test('hints: 6 items for e-mail (incl. "Oslovení", milestone 4), 6 for messages (milestone 5)', () => {
  expect(HINTS.email.items).toHaveLength(6);
  expect(HINTS.email.items[1][0]).toBe('Oslovení.');
  expect(HINTS.zpravy.items).toHaveLength(6);
});

test('messages hint does not teach "a link = a scam" (legitimate zpravy-03 has a link)', () => {
  const links = HINTS.zpravy.items.find(([title]) => title.startsWith('Odkaz'));
  expect(links[1]).toContain('Odkaz sám o sobě podvod není.');
});

test('e-mail hint does not teach "a link = a scam" (legitimate email-07 has a link)', () => {
  expect(HINTS.email.items[3][0]).toBe('Odkaz nebo tlačítko k penězům, přihlášení či údajům.');
  expect(HINTS.email.items[3][1]).toContain('Odkaz sám o sobě podvod není.');
});

test('e-mail hint: an unexpected attachment is risky even from a known sender (email-08)', () => {
  expect(HINTS.email.items[4][0]).toBe('Přílohy, které nečekáte.');
  expect(HINTS.email.items[4][1]).toContain('Platí to i u známého odesílatele.');
});

test('7726 advice is only in the messages hint, not in e-mail', () => {
  expect(HINTS.zpravy.advice).toContain('7726');
  expect(JSON.stringify(HINTS.email)).not.toContain('7726');
});

test('texts with numbers use correct Czech plurals', () => {
  expect(EVALUATION.gained(0)).toBe('Získali jste 0 bodů.');
  expect(EVALUATION.gained(1)).toBe('Získali jste 1 bod.');
  expect(EVALUATION.gained(2)).toBe('Získali jste 2 body.');
  expect(EVALUATION.gained(5)).toBe('Získali jste 5 bodů.');
  expect(ROUND_END.score(16, 19)).toBe('Získali jste 16 z 19 bodů.');
  expect(ROUND_END.previousBest(17, 19)).toBe('Váš nejlepší výsledek je 17 z 19 bodů.');
  expect(WELCOME.rounds(1)).toBe('Odehráli jste zatím 1 kolo.');
  expect(WELCOME.rounds(2)).toBe('Odehráli jste zatím 2 kola.');
  expect(WELCOME.rounds(5)).toBe('Odehráli jste zatím 5 kol.');
  expect(WELCOME.best('E-mail', 'Pokročilá', 16, 19)).toBe('E-mail (pokročilá): 16 z 19 bodů');
});

test('no exclamation marks in player texts (calm tone, CLAUDE.md section 7)', () => {
  const all = JSON.stringify({ CATEGORY_LABELS, EVALUATION: { ...EVALUATION }, HINTS, MESSAGES_APP, ROUND_END: { ...ROUND_END } });
  expect(all).not.toContain('!');
});
