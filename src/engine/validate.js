// Scenario validation (CLAUDE.md, sections 7 and 12).
// Pure functions without browser or Vite dependencies: used by the build
// (vite.config.js), by unit tests and by the app.

import { THREAT_CATEGORIES } from './categories.js';

// Minimum a section needs so a round of 5 with 1–2 legitimate messages can be drawn.
// The content goal (20 scenarios, 5 legitimate) is checked separately, see checkSectionGoals.
export const DRAW_MINIMUM = { scam: 4, legit: 1 };
export const CONTENT_GOAL = { total: 20, legit: 5 };

const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';

// Every part of a message the player can mark, i.e. every valid threat target
export function listTargets(section, message) {
  const targets = [];
  if (!message || typeof message !== 'object') return targets;

  if (section === 'email') {
    targets.push('fromName', 'fromAddress', 'subject');
    (Array.isArray(message.body) ? message.body : []).forEach((_, i) => targets.push(`body.${i}`));
    for (const optional of ['button', 'link', 'attachment']) {
      if (message[optional]) targets.push(optional);
    }
  } else if (section === 'zpravy') {
    targets.push('from');
    (Array.isArray(message.messages) ? message.messages : []).forEach((bubble, i) => {
      targets.push(`messages.${i}`);
      if (bubble && bubble.link) targets.push(`messages.${i}.link`);
    });
  }
  return targets;
}

function validateEmailMessage(message, errors) {
  for (const field of ['fromName', 'fromAddress', 'date', 'subject']) {
    if (!isNonEmptyString(message[field])) errors.push(`message.${field} chybí nebo je prázdné`);
  }
  if (!Array.isArray(message.body) || message.body.length === 0 || !message.body.every(isNonEmptyString)) {
    errors.push('message.body musí být neprázdné pole textů');
  }
  if (message.button !== undefined && !isNonEmptyString(message.button?.label)) {
    errors.push('message.button musí mít label');
  }
  if (message.link !== undefined && !isNonEmptyString(message.link?.label)) {
    errors.push('message.link musí mít label');
  }
  if (message.attachment !== undefined && !isNonEmptyString(message.attachment?.name)) {
    errors.push('message.attachment musí mít name');
  }
}

function validateChatMessage(message, errors) {
  if (!['sms', 'chat'].includes(message.app)) errors.push('message.app musí být "sms" nebo "chat"');
  if (!isNonEmptyString(message.from)) errors.push('message.from chybí nebo je prázdné');
  if (typeof message.inContacts !== 'boolean') errors.push('message.inContacts musí být true nebo false');
  // Optional date shown above the bubbles ("dnes 10:24")
  if (message.date !== undefined && !isNonEmptyString(message.date)) errors.push('message.date musí být neprázdný text');
  if (!Array.isArray(message.messages) || message.messages.length === 0) {
    errors.push('message.messages musí být neprázdné pole bublin');
    return;
  }
  message.messages.forEach((bubble, i) => {
    if (!isNonEmptyString(bubble?.text)) errors.push(`message.messages.${i}.text chybí nebo je prázdné`);
    if (bubble?.link !== undefined && !isNonEmptyString(bubble.link)) {
      errors.push(`message.messages.${i}.link musí být text odkazu`);
    }
  });
}

function containsKey(value, key) {
  if (Array.isArray(value)) return value.some((item) => containsKey(item, key));
  if (value && typeof value === 'object') {
    return Object.keys(value).some((k) => k === key || containsKey(value[k], key));
  }
  return false;
}

// Returns a list of problems in Czech; empty list = scenario is valid.
// fileId is the file name without .json (e.g. "email-06"), section is the folder name.
export function validateScenario(scenario, { fileId, section } = {}) {
  const errors = [];
  if (!scenario || typeof scenario !== 'object' || Array.isArray(scenario)) {
    return ['scénář není objekt'];
  }

  if (!isNonEmptyString(scenario.id)) errors.push('id chybí');
  else if (fileId && scenario.id !== fileId) errors.push(`id "${scenario.id}" neodpovídá názvu souboru "${fileId}"`);

  if (!['email', 'zpravy'].includes(scenario.section)) errors.push('section musí být "email" nebo "zpravy"');
  else if (section && scenario.section !== section) errors.push(`section "${scenario.section}" neodpovídá složce "${section}"`);

  if (!isNonEmptyString(scenario.title)) errors.push('title chybí');
  if (typeof scenario.isScam !== 'boolean') errors.push('isScam musí být true nebo false');
  if (!isNonEmptyString(scenario.summary)) errors.push('summary chybí');
  if (!Array.isArray(scenario.sources)) errors.push('sources musí být pole (může být prázdné)');
  if (containsKey(scenario, 'relatedArticle')) errors.push('pole relatedArticle je zakázané');

  if (!scenario.message || typeof scenario.message !== 'object') {
    errors.push('message chybí');
  } else if (scenario.section === 'email') {
    validateEmailMessage(scenario.message, errors);
  } else if (scenario.section === 'zpravy') {
    validateChatMessage(scenario.message, errors);
  }

  if (!Array.isArray(scenario.threats)) {
    errors.push('threats musí být pole');
    return errors;
  }
  if (scenario.isScam === true && (scenario.threats.length < 1 || scenario.threats.length > 4)) {
    errors.push('podvod musí mít 1 až 4 hrozby');
  }
  if (scenario.isScam === false && scenario.threats.length > 0) {
    errors.push('legitimní zpráva nesmí mít hrozby');
  }

  const targets = new Set(listTargets(scenario.section, scenario.message));
  const seen = new Set();
  scenario.threats.forEach((threat, i) => {
    const where = `threats.${i}`;
    // One threat may lie on several parts: target + optional alsoTargets (CLAUDE.md, section 7)
    const also = threat?.alsoTargets;
    if (also !== undefined && (!Array.isArray(also) || also.length === 0 || !also.every(isNonEmptyString))) {
      errors.push(`${where}.alsoTargets musí být neprázdné pole názvů částí zprávy`);
    }
    const parts = [
      [`${where}.target`, threat?.target],
      ...(Array.isArray(also) ? also.map((target, j) => [`${where}.alsoTargets.${j}`, target]) : []),
    ];
    for (const [path, target] of parts) {
      if (!targets.has(target)) errors.push(`${path} "${target}" neodpovídá žádné části zprávy`);
      if (seen.has(target)) errors.push(`${path} "${target}" je ve hrozbách dvakrát`);
      seen.add(target);
    }
    if (!THREAT_CATEGORIES.includes(threat?.category)) errors.push(`${where}.category "${threat?.category}" není povolená`);
    if (!isNonEmptyString(threat?.title)) errors.push(`${where}.title chybí`);
    if (!isNonEmptyString(threat?.explanation)) errors.push(`${where}.explanation chybí`);
  });

  return errors;
}

// Checks that a section has enough scenarios to draw a round. Returns problems in Czech.
export function checkSectionForDraw(scenarios, section) {
  const scam = scenarios.filter((s) => s.isScam).length;
  const legit = scenarios.length - scam;
  const errors = [];
  if (scam < DRAW_MINIMUM.scam) errors.push(`sekce ${section}: jen ${scam} podvodů, pro losování je potřeba aspoň ${DRAW_MINIMUM.scam}`);
  if (legit < DRAW_MINIMUM.legit) errors.push(`sekce ${section}: jen ${legit} legitimních, pro losování je potřeba aspoň ${DRAW_MINIMUM.legit}`);
  return errors;
}

// Content goal from milestone 6 on (CLAUDE.md, section 7). Returns problems in Czech.
export function checkSectionGoals(scenarios, section) {
  const legit = scenarios.filter((s) => !s.isScam).length;
  const errors = [];
  if (scenarios.length < CONTENT_GOAL.total) errors.push(`sekce ${section}: ${scenarios.length} scénářů, cíl je aspoň ${CONTENT_GOAL.total}`);
  if (legit < CONTENT_GOAL.legit) errors.push(`sekce ${section}: ${legit} legitimních, cíl je aspoň ${CONTENT_GOAL.legit}`);
  return errors;
}
