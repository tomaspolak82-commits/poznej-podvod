// Simulated messages app (CLAUDE.md, section 6): one conversation, SMS or chat.
// No list of conversations (Tomáš, milestone 5): the task message is open right away.
// The sender is only a number or a contact name, so there is nothing to reveal
// like the e-mail address. Neutral look, no logos or colours of real apps.
//
// The parts of the message follow the shared contract in ./parts.js.

import { createPart, phoneFrame } from './parts.js';
import { MESSAGES_APP } from '../texts.js';
import { escapeHtml } from '../ui/html.js';
import { icon } from '../ui/icons.js';

export const hasInbox = false;

// Saved contact: its first letter; unknown number: a neutral person
function avatar(m) {
  const content = m.inContacts ? escapeHtml([...m.from][0].toUpperCase()) : icon('person');
  return `<span class="chat__avatar" aria-hidden="true">${content}</span>`;
}

// Chat only: bar for a number that is not saved. Not a part of the message, so it cannot
// be marked; its buttons only show a notice. After the decision it is plain text.
function unknownNumberBar(playing) {
  const buttons = playing
    ? `<div class="chat__unknown-actions">
        <button type="button" class="chat__unknown-button" data-chat="contact">${MESSAGES_APP.addContact}</button>
        <button type="button" class="chat__unknown-button" data-chat="contact">${MESSAGES_APP.block}</button>
      </div>`
    : '';
  return `
    <div class="chat__unknown" data-testid="not-in-contacts">
      <p>${MESSAGES_APP.notInContacts}</p>
      ${buttons}
    </div>`;
}

// options: { mode: 'play' | 'mark' | 'review', marks: Set of marked targets (mark mode),
//            result: scoring result (review, advanced) }
export function renderMessage(scenario, { mode, ...options }) {
  const m = scenario.message;
  const part = createPart(scenario, mode, options);

  return phoneFrame(`
    <article class="msg msg--zpravy msg--${mode} chat chat--${m.app}" data-scenario-id="${scenario.id}" aria-label="Zpráva">
      <header class="chat__head">
        ${avatar(m)}
        <div class="chat__who">
          ${part('from', 'p', 'msg__from-name chat__from', escapeHtml(m.from))}
          <p class="chat__app">${MESSAGES_APP.appLabel[m.app]}</p>
        </div>
      </header>
      ${m.app === 'chat' && !m.inContacts ? unknownNumberBar(mode !== 'review') : ''}
      <div class="chat__thread">
        ${m.date ? `<p class="chat__date">${escapeHtml(m.date)}</p>` : ''}
        ${m.messages
          .map(
            (bubble, i) => `
            <div class="chat__bubble">
              ${part(`messages.${i}`, 'p', 'msg__bubble-text', escapeHtml(bubble.text))}
              ${bubble.link ? part(`messages.${i}.link`, 'span', 'msg__link', escapeHtml(bubble.link)) : ''}
            </div>`,
          )
          .join('')}
      </div>
      <div class="chat__input" aria-hidden="true">${MESSAGES_APP.inputPlaceholder}</div>
    </article>`);
}
