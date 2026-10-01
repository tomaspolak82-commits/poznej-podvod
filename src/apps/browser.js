// Simulated mobile browser (plan docs/plany/plan-prohlizec.md, sketch docs/plany/nacrt-prohlizec.html):
// a card "Jak jste se sem dostali", the address bar and the page, or a popup over a dimmed page.
// Neutral look, no logos or colours of real browsers.
//
// Without a secure connection the bar shows only a yellow triangle (both levels, Tomáš 1. 10. 2026);
// the visible text "Nezabezpečeno" appears next to it only in the evaluation.
// The parts of the page follow the shared contract in ./parts.js.

import { createPart, phoneFrame } from './parts.js';
import { bannerPosition } from '../engine/validate.js';
import { BROWSER_APP, LINK_NOTICE } from '../texts.js';
import { escapeHtml } from '../ui/html.js';
import { icon } from '../ui/icons.js';

export const hasInbox = false;

// Notice for a control of the page at the basic level: the same for scams and legitimate pages
export function noticeFor(target) {
  if (target === 'banner') return LINK_NOTICE;
  if (target.startsWith('fields.')) return BROWSER_APP.fieldNotice;
  return BROWSER_APP.buttonNotice;
}

function arrivalCard(m) {
  return `
    <div class="browser__arrival" data-testid="arrival">
      <p class="browser__arrival-title">${BROWSER_APP.arrivalTitle}</p>
      <p>${escapeHtml(m.arrival)}</p>
    </div>`;
}

function addressBar(m, mode, part) {
  const reviewing = mode === 'review';
  let security = '';
  if (m.secure === false) {
    // Visible text only in the evaluation; otherwise the icon with a text for screen readers
    const content = reviewing
      ? `${icon('warning')}<span class="browser__security-text">${BROWSER_APP.insecureText}</span>`
      : `${icon('warning')}<span class="visually-hidden">${BROWSER_APP.insecureLabel}</span>`;
    security = part('security', 'span', 'browser__security', content);
  }
  const address = part(
    'address',
    'span',
    'browser__address',
    `<span class="visually-hidden">${BROWSER_APP.addressLabel}</span>${escapeHtml(m.address)}`,
  );
  return `
    <div class="browser__bar">
      ${security}
      ${address}
      <span class="browser__chrome" aria-hidden="true">${icon('tabs')}${icon('dots')}</span>
    </div>`;
}

function banner(m, part) {
  const { text, style } = m.banner;
  const content = style === 'warning' ? `${icon('warning')}<span>${escapeHtml(text)}</span>` : escapeHtml(text);
  return part('banner', 'span', `browser__banner browser__banner--${style}`, content);
}

function field(label, i, part) {
  // Not a real input: nothing can be typed, a tap only shows a notice (basic level)
  return part(
    `fields.${i}`,
    'span',
    'browser__field',
    `<span class="browser__field-label">${escapeHtml(label)}</span><span class="browser__field-box" aria-hidden="true"></span>`,
  );
}

function page(m, part) {
  const body = m.body ?? [];
  const bannerAt = bannerPosition(m);
  const paragraphs = body.map(
    (text, i) => `${m.banner && i === bannerAt ? banner(m, part) : ''}${part(`body.${i}`, 'p', 'browser__paragraph', escapeHtml(text))}`,
  );
  return `
    <div class="browser__page">
      ${part('heading', 'p', 'browser__heading', escapeHtml(m.heading))}
      ${paragraphs.join('')}
      ${m.banner && bannerAt >= body.length ? banner(m, part) : ''}
      ${(m.fields ?? []).map((label, i) => field(label, i, part)).join('')}
      ${m.button ? part('button', 'span', 'browser__button', escapeHtml(m.button.label)) : ''}
    </div>`;
}

// The page under a popup is dimmed and has no parts: grey lines only, hidden from screen readers
function popup(m, part) {
  const p = m.popup;
  const ghost = '<span class="browser__ghost"></span>';
  return `
    <div class="browser__dimmed">
      <div class="browser__ghosts" aria-hidden="true">${ghost.repeat(3)}</div>
      <div class="browser__popup">
        ${part('popup.title', 'p', 'browser__popup-title', escapeHtml(p.title))}
        ${(p.body ?? []).map((text, i) => part(`popup.body.${i}`, 'p', 'browser__paragraph', escapeHtml(text))).join('')}
        <div class="browser__popup-buttons">
          ${(p.buttons ?? []).map((label, i) => part(`popup.button.${i}`, 'span', 'browser__button', escapeHtml(label))).join('')}
        </div>
      </div>
      <div class="browser__ghosts" aria-hidden="true">${ghost.repeat(2)}</div>
    </div>`;
}

// options: { mode: 'play' | 'mark' | 'review', marks: Set of marked targets (mark mode),
//            result: scoring result (review, advanced) }
export function renderMessage(scenario, { mode, ...options }) {
  const m = scenario.message;
  const part = createPart(scenario, mode, options);
  return phoneFrame(`
    <article class="msg msg--prohlizec msg--${mode} browser" data-scenario-id="${scenario.id}">
      ${arrivalCard(m)}
      ${addressBar(m, mode, part)}
      ${m.popup ? popup(m, part) : page(m, part)}
    </article>`);
}
