// Neutral message view for the Zprávy section until milestone 5 replaces it with
// the realistic messages app. The contract of the parts is in ./parts.js.

import { createPart } from './parts.js';
import { escapeHtml } from '../ui/html.js';

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
  return `<article class="msg msg--${scenario.section} msg--${mode}" data-scenario-id="${scenario.id}"
    aria-label="Zpráva">${renderChat(scenario, part)}</article>`;
}
