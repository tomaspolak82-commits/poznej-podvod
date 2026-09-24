// Messages app rendering (milestone 6): date labels between bubbles and a sender
// that is not a part of the message (fromMarkable: false). Pure HTML strings, no browser.
import { test, expect } from '@playwright/test';
import { renderMessage } from '../../src/apps/messages.js';

const scenario = (message = {}) => ({
  id: 'zpravy-50',
  section: 'zpravy',
  isScam: true,
  message: {
    app: 'chat',
    from: 'Jarka',
    inContacts: true,
    messages: [
      { text: 'Starší bublina', date: 'Út 18:05' },
      { text: 'Nová bublina', date: 'Dnes 11:40', link: 'https://x.test.invalid' },
    ],
    ...message,
  },
  threats: [{ target: 'messages.1.link', category: 'zadost-o-udaje', title: 'T', explanation: 'E' }],
});

// Text of every date label in order
const labels = (html) => [...html.matchAll(/<p class="chat__date">([^<]*)<\/p>/g)].map((m) => m[1]);

test.describe('messages app: date labels between bubbles', () => {
  for (const mode of ['play', 'mark', 'review']) {
    test(`${mode}: each label stands before its bubble and is plain text, never a part`, () => {
      const html = renderMessage(scenario(), { mode });
      expect(labels(html)).toEqual(['Út 18:05', 'Dnes 11:40']);
      expect(html.indexOf('Út 18:05')).toBeLessThan(html.indexOf('Starší bublina'));
      expect(html.indexOf('Starší bublina')).toBeLessThan(html.indexOf('Dnes 11:40'));
      expect(html.indexOf('Dnes 11:40')).toBeLessThan(html.indexOf('Nová bublina'));
      // Not hidden from screen readers, not a button, no target
      expect(html).not.toMatch(/chat__date[^>]*aria-hidden/);
      expect(html).not.toMatch(/data-target="[^"]*date/);
    });
  }

  test('without dates there is no label; the date above the thread still works', () => {
    const plain = scenario({ messages: [{ text: 'Bublina' }] });
    expect(labels(renderMessage(plain, { mode: 'play' }))).toEqual([]);
    expect(labels(renderMessage(scenario({ date: 'Dnes 10:24', messages: [{ text: 'Bublina' }] }), { mode: 'play' }))).toEqual([
      'Dnes 10:24',
    ]);
  });
});

test.describe('messages app: sender that cannot be marked (fromMarkable: false)', () => {
  test('mark mode: the sender is plain text, the bubbles can still be marked', () => {
    const html = renderMessage(scenario({ fromMarkable: false }), { mode: 'mark' });
    expect(html).toContain('<p class="msg__from-name chat__from">Jarka</p>');
    expect(html).not.toContain('data-mark="from"');
    expect(html).toContain('data-mark="messages.0"');
  });

  test('play and review: the sender has no target either', () => {
    for (const mode of ['play', 'review']) {
      expect(renderMessage(scenario({ fromMarkable: false }), { mode })).not.toContain('data-target="from"');
    }
  });

  test('by default the sender can be marked as before', () => {
    expect(renderMessage(scenario(), { mode: 'mark' })).toContain('data-mark="from"');
  });
});
