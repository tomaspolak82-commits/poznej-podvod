// Neutral message view for milestone 3. Milestones 4 and 5 replace it with the
// realistic mail and messages apps; they must keep the same contract:
//   - every markable part carries data-target="<target from the scenario>"
//   - play (basic level): links, buttons and attachments are <button data-action="notice">
//   - mark (advanced level): every part is <button data-mark="<target>" aria-pressed>
//   - review: every part with a threat gets a bulb <button data-threat="<index>">;
//     with a result (advanced level) every relevant part shows its status

import { EVALUATION, ROUND } from '../texts.js';
import { icon } from '../ui/icons.js';
import { escapeHtml } from '../ui/html.js';

const INTERACTIVE = /^(button|link|attachment|messages\.\d+\.link)$/;

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
function createPart(scenario, mode, { marks = new Set(), result = null } = {}) {
  const threatIndex = new Map(scenario.threats.map((threat, i) => [threat.target, i]));
  const found = new Set(result?.found.map((t) => t.target) ?? []);
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
    return `
      <div class="review-part${index === undefined ? '' : ' review-part--threat'}" data-target="${target}">
        <${tag} class="${className}">${contentHtml}</${tag}>${bulb}${status}
      </div>`;
  };
}

function renderEmail(scenario, part) {
  const m = scenario.message;
  return `
    <header class="msg__head">
      ${part('fromName', 'p', 'msg__from-name', escapeHtml(m.fromName))}
      ${part('fromAddress', 'p', 'msg__from-address', escapeHtml(m.fromAddress))}
      <p class="msg__date">${escapeHtml(m.date)}</p>
    </header>
    ${part('subject', 'p', 'msg__subject', escapeHtml(m.subject))}
    <div class="msg__body">
      ${m.body.map((text, i) => part(`body.${i}`, 'p', 'msg__paragraph', escapeHtml(text))).join('')}
    </div>
    ${m.attachment ? part('attachment', 'span', 'msg__attachment', `${icon('attachment')}${escapeHtml(m.attachment.name)}`) : ''}
    ${m.link ? part('link', 'span', 'msg__link', escapeHtml(m.link.label)) : ''}
    ${m.button ? part('button', 'span', 'msg__button', escapeHtml(m.button.label)) : ''}
  `;
}

function renderChat(scenario, part) {
  const m = scenario.message;
  return `
    <header class="msg__head">
      ${part('from', 'p', 'msg__from-name', escapeHtml(m.from))}
      <p class="msg__date">${m.app === 'sms' ? 'SMS' : 'Chat'}</p>
    </header>
    <div class="msg__bubbles">
      ${m.messages
        .map(
          (bubble, i) => `
          <div class="msg__bubble">
            ${part(`messages.${i}`, 'p', 'msg__bubble-text', escapeHtml(bubble.text))}
            ${bubble.link ? part(`messages.${i}.link`, 'span', 'msg__link', escapeHtml(bubble.link)) : ''}
          </div>`,
        )
        .join('')}
    </div>
  `;
}

// options: { marks: Set of marked targets (mark mode), result: scoring result (review, advanced) }
export function renderMessage(scenario, { mode, ...options }) {
  const part = createPart(scenario, mode, options);
  const content = scenario.section === 'email' ? renderEmail(scenario, part) : renderChat(scenario, part);
  return `<article class="msg msg--${scenario.section} msg--${mode}" data-scenario-id="${scenario.id}"
    aria-label="Zpráva">${content}</article>`;
}
