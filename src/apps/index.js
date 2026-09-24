// Simulated app of each section. A new section adds its app here (CLAUDE.md, section 13).

import * as email from './email.js';
import * as messages from './messages.js';

const apps = { email, zpravy: messages };

export function appFor(section) {
  const app = apps[section];
  if (!app) throw new Error(`No simulated app for section: ${section}`);
  return app;
}
