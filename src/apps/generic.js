// Neutral message view for milestone 3. Milestones 4 and 5 replace it with the
// realistic mail and messages apps; they must keep the same contract:
//   - every markable part carries data-target="<target from the scenario>"
//   - links, buttons and attachments are <button data-action="notice"> in play mode
//   - in review mode every part with a threat gets a bulb <button data-threat="<index>">

import { icon } from '../ui/icons.js';
import { escapeHtml } from '../ui/html.js';

const INTERACTIVE = /^(button|link|attachment|messages\.\d+\.link)$/;

// mode: 'play' | 'review'
function createPart(scenario, mode) {
  const threatIndex = new Map(scenario.threats.map((threat, i) => [threat.target, i]));

  return function part(target, tag, className, contentHtml) {
    if (mode === 'play') {
      if (INTERACTIVE.test(target)) {
        return `<button type="button" class="${className} msg-action" data-target="${target}" data-action="notice">${contentHtml}</button>`;
      }
      return `<${tag} class="${className}" data-target="${target}">${contentHtml}</${tag}>`;
    }

    // review: the part itself is static; a bulb explains the threat
    const index = threatIndex.get(target);
    const threat = scenario.threats[index];
    const bulb =
      index === undefined
        ? ''
        : `<button type="button" class="bulb" data-threat="${index}"
             aria-label="Proč je to podezřelé: ${escapeHtml(threat.title)}">${icon('bulb')}</button>`;
    return `
      <div class="review-part${index === undefined ? '' : ' review-part--threat'}" data-target="${target}">
        <${tag} class="${className}">${contentHtml}</${tag}>${bulb}
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

export function renderMessage(scenario, { mode }) {
  const part = createPart(scenario, mode);
  const content = scenario.section === 'email' ? renderEmail(scenario, part) : renderChat(scenario, part);
  return `<article class="msg msg--${scenario.section} msg--${mode}" data-scenario-id="${scenario.id}"
    aria-label="Zpráva">${content}</article>`;
}
