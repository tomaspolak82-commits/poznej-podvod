// Czech plural of "bod": 1 bod, 2–4 body, 0 and 5+ bodů
export function pointsWord(count) {
  if (count === 1) return 'bod';
  if (count >= 2 && count <= 4) return 'body';
  return 'bodů';
}
