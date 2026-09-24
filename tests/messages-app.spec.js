// Simulated messages app, SMS and chat (milestone 5, CLAUDE.md sections 6 and 12).
import { test, expect } from '@playwright/test';
import { currentScenarioId, expectedRounds, goToScenario, nextMessage, scenarioById, startRound } from './helpers/game.js';

// Seed 5: zpravy-01 (SMS, unknown number) first, then zpravy-03 (SMS, saved contact)
// and zpravy-02 (chat, unknown number). Seed 2: zpravy-02 first.
const SEED_ALL = 5;
const SEED_CHAT_FIRST = 2;

test.beforeAll(() => {
  // Guard: the tests below rely on these rounds
  const all = expectedRounds('zpravy', SEED_ALL, 1)[0].map((s) => s.id);
  expect(all[0]).toBe('zpravy-01');
  expect(all).toEqual(expect.arrayContaining(['zpravy-02', 'zpravy-03']));
  expect(expectedRounds('zpravy', SEED_CHAT_FIRST, 1)[0][0].id).toBe('zpravy-02');
});

const start = (page, { seed = SEED_ALL, level = 'základní' } = {}) =>
  startRound(page, { section: 'zpravy', seed, level });
const mark = (page, target) => page.locator(`[data-mark="${target}"]`).click();
const decide = (page, scam) => page.getByRole('button', { name: scam ? 'Je to podvod' : 'Je to v pořádku' }).click();
const statusOf = (page, target) => page.locator(`.review-part[data-target="${target}"] [data-status]`);
const noScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test.describe('conversation view', () => {
  test('opens right away, no list of conversations and no inbox instruction', async ({ page }) => {
    await start(page);
    await expect(page.locator('article[data-scenario-id="zpravy-01"]')).toBeVisible();
    await expect(page.locator('[data-mail]')).toHaveCount(0);
    await expect(page.getByTestId('inbox-instruction')).toHaveCount(0);
    await expect(page.getByTestId('training-label')).toBeVisible();
  });

  test('SMS from an unknown number: number, "SMS", date, underlined link; no bar, nothing to reveal', async ({ page }) => {
    await start(page);
    const message = page.locator('article[data-scenario-id]');
    await expect(message.locator('[data-target="from"]')).toHaveText('+44 7700 900318');
    await expect(message.locator('.chat__app')).toHaveText('SMS');
    await expect(message.locator('.chat__date')).toHaveText('dnes 10:24');
    await expect(message.locator('.chat__avatar svg')).toHaveCount(1);
    await expect(page.getByTestId('not-in-contacts')).toHaveCount(0);
    await expect(page.getByText('zobrazit adresu')).toHaveCount(0);
    const link = message.locator('[data-target="messages.0.link"]');
    await expect(link).toHaveText('https://portal-dopravy-pokuty.top/uhrada');
    expect(await link.evaluate((el) => getComputedStyle(el).textDecorationLine)).toContain('underline');
  });

  test('SMS from a saved contact: name and its first letter, no bar', async ({ page }) => {
    await start(page);
    await goToScenario(page, 'zpravy-03');
    const message = page.locator('article[data-scenario-id]');
    await expect(message.locator('[data-target="from"]')).toHaveText('Petr');
    await expect(message.locator('.chat__avatar')).toHaveText('P');
    await expect(page.getByTestId('not-in-contacts')).toHaveCount(0);
  });

  test('the message is never a real link: no <a>, href, tel: or sms:', async ({ page }) => {
    await start(page);
    for (let i = 0; i < 5; i += 1) {
      const message = page.locator('article[data-scenario-id]');
      await expect(message.locator('a, [href]')).toHaveCount(0);
      await expect(page.locator('[href^="tel:"], [href^="sms:"]')).toHaveCount(0);
      const scenario = scenarioById(await currentScenarioId(page));
      await decide(page, scenario.isScam);
      await expect(message.locator('a, [href]')).toHaveCount(0);
      if (i < 4) await nextMessage(page);
    }
  });

  test('the message field at the bottom is only decoration (hidden from screen readers, not focusable)', async ({ page }) => {
    await start(page);
    const input = page.locator('.chat__input');
    await expect(input).toHaveText('Zpráva');
    await expect(input).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('.chat__input input, .chat__input button, .chat__input [tabindex]')).toHaveCount(0);
  });
});

test.describe('chat: number not saved in contacts', () => {
  for (const level of ['základní', 'pokročilá']) {
    test(`${level}: the bar is shown, its buttons show the same notice and cannot be marked`, async ({ page }) => {
      await start(page, { seed: SEED_CHAT_FIRST, level });
      const bar = page.getByTestId('not-in-contacts');
      await expect(bar).toContainText('Toto číslo není ve vašich kontaktech');
      await expect(bar.locator('[data-mark]')).toHaveCount(0);
      const texts = [];
      for (const name of ['Přidat', 'Nahlásit a zablokovat']) {
        await bar.getByRole('button', { name, exact: true }).click();
        const dialog = page.getByRole('dialog');
        texts.push(await dialog.locator('.dialog__body').textContent());
        await dialog.getByRole('button', { name: 'Zavřít a pokračovat' }).click();
        await expect(dialog).toHaveCount(0);
      }
      expect(texts[0]).toBe(texts[1]);
      expect(texts[0]).toContain('Tohle je jen trénink, tlačítko nic nedělá.');
      // Nothing got marked by the bar
      await expect(page.locator('[data-mark][aria-pressed="true"]')).toHaveCount(0);
    });
  }

  test('after the decision the bar stays as text, without buttons', async ({ page }) => {
    await start(page, { seed: SEED_CHAT_FIRST });
    await decide(page, true);
    await expect(page.getByTestId('not-in-contacts')).toContainText('Toto číslo není ve vašich kontaktech');
    await expect(page.getByTestId('not-in-contacts').getByRole('button')).toHaveCount(0);
  });
});

test.describe('basic level', () => {
  test('a link shows the same notice in a scam (zpravy-01) and a legitimate message (zpravy-03)', async ({ page }) => {
    await start(page);
    const notices = [];
    for (const id of ['zpravy-01', 'zpravy-03']) {
      await goToScenario(page, id);
      await page.locator('[data-action="notice"]').first().click();
      const dialog = page.getByRole('dialog');
      notices.push(await dialog.locator('.dialog__body').textContent());
      await dialog.getByRole('button', { name: 'Zavřít a pokračovat' }).click();
    }
    expect(notices[0]).toBe(notices[1]);
    expect(notices[0]).toContain('Tohle je jen trénink, odkaz nikam nevede');
  });
});

test.describe('advanced level: marking', () => {
  test('sender, bubble and link are three separate marks; a second click removes a mark', async ({ page }) => {
    await start(page, { level: 'pokročilá' });
    const from = page.locator('[data-mark="from"]');
    const bubble = page.locator('[data-mark="messages.0"]');
    const link = page.locator('[data-mark="messages.0.link"]');

    await bubble.click();
    await expect(bubble).toHaveAttribute('aria-pressed', 'true');
    await expect(link).toHaveAttribute('aria-pressed', 'false');
    await expect(from).toHaveAttribute('aria-pressed', 'false');

    await link.click();
    await expect(link).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await bubble.click();
    await expect(bubble).toHaveAttribute('aria-pressed', 'false');
    await expect(link).toHaveAttribute('aria-pressed', 'true');

    // The link is not nested in the bubble button (a button may not contain a button)
    await expect(page.locator('button button')).toHaveCount(0);
  });

  test('zpravy-01: all three parts = 2 + 3', async ({ page }) => {
    await start(page, { level: 'pokročilá' });
    for (const target of ['from', 'messages.0', 'messages.0.link']) await mark(page, target);
    await decide(page, true);
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 3');
    await expect(page.locator('[data-status="missed"]')).toHaveCount(0);
  });

  const senderMarks = [['from'], ['messages.0'], ['from', 'messages.0']];
  for (const marks of senderMarks) {
    test(`zpravy-02: marking ${marks.join(' + ')} = one hit (alsoTargets), nothing unnecessary`, async ({ page }) => {
      await start(page, { seed: SEED_CHAT_FIRST, level: 'pokročilá' });
      for (const target of marks) await mark(page, target);
      await decide(page, true);
      await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 1');
      await expect(page.locator('[data-status="extra"]')).toHaveCount(0);
      await expect(page.locator('[data-status="found"]')).toHaveCount(marks.length);
    });
  }

  test('zpravy-02: every threat marked = 2 + 4 = 6, nothing missed', async ({ page }) => {
    await start(page, { seed: SEED_CHAT_FIRST, level: 'pokročilá' });
    for (const target of ['from', 'messages.0', 'messages.2', 'messages.3', 'messages.4']) await mark(page, target);
    await decide(page, true);
    await expect(page.getByTestId('gained')).toHaveText('Získali jste 6 bodů.');
    await expect(page.locator('[data-status="missed"]')).toHaveCount(0);
  });

  test('zpravy-02: marking everything costs a point on the innocent bubble = 2 + 3', async ({ page }) => {
    await start(page, { seed: SEED_CHAT_FIRST, level: 'pokročilá' });
    for (const target of ['from', 'messages.0', 'messages.1', 'messages.2', 'messages.3', 'messages.4']) await mark(page, target);
    await decide(page, true);
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 3');
    await expect(statusOf(page, 'messages.1')).toHaveText('Označeno zbytečně, tady je vše v pořádku');
  });

  test('zpravy-03 (legitimate) with the link marked = 2 + 0, the link is "Označeno zbytečně"', async ({ page }) => {
    await start(page, { level: 'pokročilá' });
    await goToScenario(page, 'zpravy-03');
    await mark(page, 'messages.0.link');
    await decide(page, false);
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 0');
    await expect(statusOf(page, 'messages.0.link')).toHaveText('Označeno zbytečně, tady je vše v pořádku');
  });

  test('zpravy-03 (legitimate) with nothing marked = 2 + 2', async ({ page }) => {
    await start(page, { level: 'pokročilá' });
    await goToScenario(page, 'zpravy-03');
    await decide(page, false);
    await expect(page.getByTestId('gained')).toHaveText('Získali jste 4 body.');
  });
});

test.describe('evaluation', () => {
  test('zpravy-02: 4 bulbs, the sender bulb is at the number; an explanation opens and closes', async ({ page }) => {
    await start(page, { seed: SEED_CHAT_FIRST });
    await decide(page, true);
    await expect(page.getByRole('button', { name: /^Proč je to podezřelé/ })).toHaveCount(4);
    await expect(page.locator('.review-part[data-target="from"] [data-threat]')).toHaveCount(1);
    await expect(page.locator('.review-part[data-target="messages.0"] [data-threat]')).toHaveCount(0);

    await page.getByRole('button', { name: 'Proč je to podezřelé: Neznámé „nové“ číslo' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('začíná +33, to je Francie');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('zpravy-01: the summary gives the 7726 advice', async ({ page }) => {
    await start(page);
    await decide(page, true);
    await expect(page.locator('.evaluation-summary')).toContainText(
      'Podezřelou SMS můžete přeposlat na číslo 7726, operátor pak odesílatele zablokuje.',
    );
  });
});

test.describe('layout', () => {
  test('phone frame only from tablet width; on a phone the app fills the width', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await start(page);
    const frame = () => page.locator('.phone').evaluate((el) => getComputedStyle(el).paddingTop);
    expect(await frame()).toBe('0px');
    await page.setViewportSize({ width: 1024, height: 900 });
    expect(parseFloat(await frame())).toBeGreaterThan(0);
  });

  test('touch targets at least 48 × 48 px in the chat (bar, link, marks)', async ({ page }) => {
    for (const level of ['základní', 'pokročilá']) {
      await start(page, { seed: SEED_ALL, level });
      await goToScenario(page, 'zpravy-02');
      const small = await page.evaluate(() =>
        [...document.querySelectorAll('article button, [data-testid="not-in-contacts"] button')]
          .map((el) => ({ text: el.textContent.trim().slice(0, 30), box: el.getBoundingClientRect() }))
          .filter(({ box }) => box.width < 47.5 || box.height < 47.5)
          .map(({ text, box }) => `${text} (${Math.round(box.width)}×${Math.round(box.height)})`),
      );
      expect(small).toEqual([]);
    }
  });

  for (const width of [320, 360]) {
    test(`200 % text at ${width} px: no horizontal scroll in play, marking and evaluation`, async ({ page }) => {
      await page.setViewportSize({ width, height: 740 });
      for (const level of ['základní', 'pokročilá']) {
        await start(page, { level });
        await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
        // zpravy-01: long number and link
        expect(await noScroll(page)).toBe(true);
        await decide(page, true);
        expect(await noScroll(page)).toBe(true);
        await nextMessage(page);
        await goToScenario(page, 'zpravy-02');
        // zpravy-02: the chat bar and four bubbles
        expect(await noScroll(page)).toBe(true);
        await decide(page, true);
        expect(await noScroll(page)).toBe(true);
      }
    });
  }
});
