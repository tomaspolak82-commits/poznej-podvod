// Seeded random numbers, so tests can fix the draw with ?seed=123 (CLAUDE.md, section 7).

// mulberry32: small, fast PRNG; the same seed always gives the same sequence.
// Returns a function producing numbers in [0, 1).
export function createRandom(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Reads ?seed= from a query string ("?seed=123"). Returns an integer, or null if absent or invalid.
export function seedFromSearch(search) {
  const value = new URLSearchParams(search).get('seed');
  if (value === null || !/^\d{1,10}$/.test(value)) return null;
  return Number(value) >>> 0;
}

export function randomSeed() {
  const buffer = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buffer);
  return buffer[0];
}

// Fisher–Yates shuffle; returns a new array, the input stays unchanged.
export function shuffle(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
