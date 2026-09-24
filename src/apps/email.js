// Simulated mail app (CLAUDE.md, section 6): inbox with the task message and
// older inactive messages, message detail with the sender address hidden behind
// "▾ zobrazit adresu". Neutral look, no logos of real mail apps.
//
// The parts of the message follow the shared contract in ./parts.js.

import { createPart, phoneFrame as frame } from './parts.js';
import { EMAIL_APP, RECIPIENT } from '../texts.js';
import { escapeHtml } from '../ui/html.js';
import { icon } from '../ui/icons.js';

export const hasInbox = true;

function inboxBar(foldersOpen) {
  return `
    <div class="mail__bar">
      <button type="button" class="mail__icon-button" data-mail="menu" aria-expanded="${foldersOpen}"
        aria-controls="mail-folders" aria-label="${EMAIL_APP.foldersLabel}">${icon('menu')}</button>
      <h2 class="mail__title">${EMAIL_APP.folders[0]}</h2>
    </div>
    <ul class="mail__folders" id="mail-folders" ${foldersOpen ? '' : 'hidden'}>
      ${EMAIL_APP.folders
        .map((name, i) =>
          i === 0
            ? `<li><span class="mail__folder mail__folder--current" aria-current="true">${name}</span></li>`
            : `<li><button type="button" class="mail__folder" data-mail="folder">${name}</button></li>`,
        )
        .join('')}
    </ul>`;
}

function inboxItem({ from, subject, preview, time }, attributes, unread) {
  return `
    <li>
      <button type="button" class="mail-item${unread ? ' mail-item--unread' : ''}" ${attributes}>
        <span class="mail-item__head">
          <span class="mail-item__from">${unread ? `<span class="mail-item__dot" aria-hidden="true"></span>` : ''}${escapeHtml(from)}</span>
          <span class="mail-item__time">${escapeHtml(time)}</span>
        </span>
        <span class="mail-item__subject">${escapeHtml(subject)}</span>
        <span class="mail-item__preview">${escapeHtml(preview)}</span>
      </button>
    </li>`;
}

function renderInbox(scenario, { foldersOpen = false }) {
  const m = scenario.message;
  const task = { from: m.fromName, subject: m.subject, preview: m.body.join(' '), time: m.date };
  return frame(`
    <section class="mail mail--inbox" aria-label="${EMAIL_APP.folders[0]}">
      ${inboxBar(foldersOpen)}
      <ul class="mail__list">
        ${inboxItem(task, `data-mail="open" data-scenario-id="${scenario.id}"`, true)}
        ${EMAIL_APP.olderMessages.map((older) => inboxItem(older, 'data-mail="older"', false)).join('')}
      </ul>
    </section>`);
}

function renderDetail(scenario, { mode, addressShown = false, ...options }) {
  const m = scenario.message;
  const part = createPart(scenario, mode, options);
  const playing = mode !== 'review';
  // In the evaluation the address is always visible
  const showAddress = !playing || addressShown;

  return frame(`
    <article class="msg msg--email msg--${mode} mail mail--detail" data-scenario-id="${scenario.id}" aria-label="Zpráva">
      ${
        playing
          ? `<div class="mail__bar">
              <button type="button" class="mail__back" data-mail="back" aria-label="${EMAIL_APP.backToInbox}">
                ${icon('arrowLeft')}<span>${EMAIL_APP.folders[0]}</span></button>
            </div>`
          : ''
      }
      <header class="msg__head">
        <div class="mail__sender">
          ${part('fromName', 'p', 'msg__from-name', escapeHtml(m.fromName))}
          ${
            playing
              ? `<button type="button" class="mail__reveal" data-mail="address" aria-expanded="${addressShown}">
                  <span class="mail__reveal-label">${icon(addressShown ? 'chevronUp' : 'chevronDown')}<span>${
                    addressShown ? EMAIL_APP.hideAddress : EMAIL_APP.showAddress
                  }</span></span></button>`
              : ''
          }
        </div>
        ${showAddress ? part('fromAddress', 'p', 'msg__from-address', escapeHtml(m.fromAddress)) : ''}
        <p class="mail__to">${EMAIL_APP.to(RECIPIENT)}</p>
        <p class="msg__date">${escapeHtml(m.date)}</p>
      </header>
      ${part('subject', 'p', 'msg__subject', escapeHtml(m.subject))}
      <div class="msg__body">
        ${m.body.map((text, i) => part(`body.${i}`, 'p', 'msg__paragraph', escapeHtml(text))).join('')}
      </div>
      ${m.attachment ? part('attachment', 'span', 'msg__attachment', `${icon('attachment')}${escapeHtml(m.attachment.name)}`) : ''}
      ${m.link ? part('link', 'span', 'msg__link', escapeHtml(m.link.label)) : ''}
      ${m.button ? part('button', 'span', 'msg__button', escapeHtml(m.button.label)) : ''}
    </article>`);
}

// options: { view: 'inbox' | 'detail', foldersOpen, addressShown,
//            marks: Set of marked targets (mark mode), result: scoring result (review, advanced) }
export function renderMessage(scenario, { view = 'detail', ...options }) {
  return view === 'inbox' && options.mode !== 'review' ? renderInbox(scenario, options) : renderDetail(scenario, options);
}
