// Has the player already seen the browser intro (Tomáš, 1. 10. 2026)? A separate record,
// the history is not touched. Every access is wrapped in try/catch: when the storage cannot be
// read or written, the intro is shown, an error must never hide it.

export const INTRO_KEY = 'poznej-podvod:browser-intro:v1';

export function introSeen() {
  try {
    return globalThis.localStorage.getItem(INTRO_KEY) === 'seen';
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    globalThis.localStorage.setItem(INTRO_KEY, 'seen');
  } catch {
    // Without storage the intro simply shows again next time
  }
}
