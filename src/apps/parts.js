// Shared building block of the simulated apps (CLAUDE.md, section 6). Every app
// renders the parts of a message through createPart, so they all keep the contract:
//   - every markable part carries data-target="<target from the scenario>"
//   - play (basic level): links, buttons and attachments are <button data-action="notice">
//   - mark (advanced level): every part is <button data-mark="<target>" aria-pressed>
//   - review: the main part of every threat gets a bulb <button data-threat="<index>">;
//     with a result (advanced level) every relevant part shows its status

import { threatParts } from '../engine/scoring.js';
import { EVALUATION, ROUND } from '../texts.js';
import { icon } from '../ui/icons.js';
import { escapeHtml } from '../ui/html.js';

const INTERACTIVE = /^(button|link|attachment|messages\.\d+\.link)$/;

// Phone frame on tablet and desktop; on a phone the app fills the width (CSS)
export const phoneFrame = (content) => `<div class="phone">${content}</div>`;

// Status of a part after an advanced-level answer: icon + text, never colour alone
function statusHtml(kind) {
  const variants = {
    found: ['decide', EVALUATION.statusFound],
    missed: ['alert', EVALUATION.statusMissed],
    extra: ['close', EVALUATION.statusExtra],
  };
  const [iconName, text] = variants[kind];
  return `<p class="part-status part-status--${kind}" data-status="${kind}">${icon(iconName)}<span>${text}</span></p>`;
}

// mode: 'play' | 'mark' | 'review'
// options: { marks: Set of marked targets (mark mode), result: scoring result (review, advanced) }
export function createPart(scenario, mode, { marks = new Set(), result = null } = {}) {
  // The bulb and "missed" belong to the main target of a threat
  const threatIndex = new Map(scenario.threats.map((threat, i) => [threat.target, i]));
  const onThreat = new Set(scenario.threats.flatMap(threatParts));
  const marked = new Set(result?.marks ?? []);
  // "Found" is shown on every marked part of a found threat (one threat may lie on several parts)
  const found = new Set(result?.found.flatMap((t) => threatParts(t).filter((target) => marked.has(target))) ?? []);
  const missed = new Set(result?.missed.map((t) => t.target) ?? []);
  const extra = new Set(result?.extra ?? []);

  return function part(target, tag, className, contentHtml) {
    if (mode === 'play') {
      if (INTERACTIVE.test(target)) {
        return `<button type="button" class="${className} msg-action" data-target="${target}" data-action="notice">${contentHtml}</button>`;
      }
      return `<${tag} class="${className}" data-target="${target}">${contentHtml}</${tag}>`;
    }

    if (mode === 'mark') {
      // A button may only contain inline content, so the part is a span styled like the original
      const pressed = marks.has(target);
      return `
        <button type="button" class="msg-mark${pressed ? ' is-marked' : ''}" data-target="${target}" data-mark="${target}"
          aria-pressed="${pressed}">
          <span class="${className}">${contentHtml}</span>
          <span class="mark-badge" aria-hidden="true">${icon('decide')}${ROUND.marked}</span>
        </button>`;
    }

    // review: the part itself is static; a bulb explains the threat
    const index = threatIndex.get(target);
    const threat = scenario.threats[index];
    const bulb =
      index === undefined
        ? ''
        : `<button type="button" class="bulb" data-threat="${index}"
             aria-label="Proč je to podezřelé: ${escapeHtml(threat.title)}">${icon('bulb')}</button>`;
    let status = '';
    if (result) {
      if (found.has(target)) status = statusHtml('found');
      else if (missed.has(target)) status = statusHtml('missed');
      else if (extra.has(target)) status = statusHtml('extra');
    }
    const isThreat = index !== undefined || onThreat.has(target);
    return `
      <div class="review-part${isThreat ? ' review-part--threat' : ''}" data-target="${target}">
        <${tag} class="${className}">${contentHtml}</${tag}>${bulb}${status}
      </div>`;
  };
}
