// Czech plural forms: 1 → one, 2–4 → few, 0 and 5+ → many.
// (Enough for our counts; Czech decimals are not used anywhere.)
export function plural(count, one, few, many) {
  const n = Math.abs(count);
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}

// "1 bod", "2 body", "5 bodů", "0 bodů"
export const pointsWord = (count) => plural(count, 'bod', 'body', 'bodů');

// After "z": "z 1 bodu", "z 2 bodů", "z 19 bodů" (genitive)
export const pointsWordAfterOf = (count) => (Math.abs(count) === 1 ? 'bodu' : 'bodů');

// "1 kolo", "2 kola", "5 kol"
export const roundsWord = (count) => plural(count, 'kolo', 'kola', 'kol');

// "1 zpráva", "2 zprávy", "5 zpráv"
export const messagesWord = (count) => plural(count, 'zpráva', 'zprávy', 'zpráv');

// "16 z 19 bodů", "1 z 1 bodu"
export const scoreOf = (score, max) => `${score} z ${max} ${pointsWordAfterOf(max)}`;

// "4 body", "1 bod", "0 bodů"
export const points = (count) => `${count} ${pointsWord(count)}`;
