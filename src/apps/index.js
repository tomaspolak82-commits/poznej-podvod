// Simulated app of each section. A new section adds its app here (CLAUDE.md, section 13).

import * as email from './email.js';
import * as generic from './generic.js';

const apps = { email };

export function appFor(section) {
  return apps[section] ?? generic;
}
