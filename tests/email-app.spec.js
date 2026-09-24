// Simulated mail app (milestone 4, CLAUDE.md sections 6 and 12).
import { test, expect } from '@playwright/test';
import {
  currentScenarioId,
  goToScenario,
  openCurrentMessage,
  scenarioById,
  seedWith,
  showAddress,
  startRound,
} from './helpers/game.js';

const LEVELS = [
  ['základní', 'zakladni'],
  ['pokročilá', 'pokrocila'],
];

test.describe('inbox', () => {
  test('shows the task message on top in bold and 3 older messages; no decision yet', async ({ page }) => {
    await startRound(page, { open: false });
    await expect(page.getByTestId('inbox-instruction')).toHaveText(
      'Toto je schránka Jany Novákové. Klepněte na nejnovější zprávu nahoře a přečtěte si ji.',
    );
    const items = page.locator('.mail-item');
    await expect(items).toHaveCount(4);
    const task = items.first();
    await expect(task).toHaveAttribute('data-mail', 'open');
    const scenario = scenarioById(await currentScenarioId(page));
    await expect(task).toContainText(scenario.message.fromName);
    await expect(task).toContainText(scenario.message.subject);
    // Only the name of the sender, never the address in the list
    await expect(task).not.toContainText(scenario.message.fromAddress);
    const weight = await task.locator('.mail-item__subject').evaluate((el) => Number(getComputedStyle(el).fontWeight));
    expect(weight).toBeGreaterThanOrEqual(700);
    await expect(page.getByRole('button', { name: 'Je to podvod' })).toHaveCount(0);
    await expect(page.getByTestId('training-label')).toBeVisible();
  });

  test('an older message shows "not part of the task" and the window closes', async ({ page }) => {
    await startRound(page, { open: false });
    await page.locator('[data-mail="older"]').first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Tahle zpráva není součástí úkolu. Otevřete nejnovější zprávu nahoře.');
    await dialog.getByRole('button', { name: 'Zavřít a pokračovat' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('.mail-item')).toHaveCount(4);
  });

  test('the ☰ menu shows folders; another folder shows a notice', async ({ page }) => {
    await startRound(page, { open: false });
    const menu = page.getByRole('button', { name: 'Složky' });
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('button', { name: 'Spam' })).toBeHidden();
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeFocused();
    await page.getByRole('button', { name: 'Spam' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Tahle složka není součástí úkolu. Zpráva k tréninku je v Doručené poště.');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('back arrow returns to the inbox and the message opens again with its marks', async ({ page }) => {
    await startRound(page, { level: 'pokročilá' });
    await page.locator('[data-mark="subject"]').click();
    await page.getByRole('button', { name: 'Zpět do schránky Doručená pošta' }).click();
    await expect(page.locator('.mail-item')).toHaveCount(4);
    await openCurrentMessage(page);
    await expect(page.locator('[data-mark="subject"]')).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('sender address in the detail', () => {
  for (const [levelName, level] of LEVELS) {
    test(`${level}: hidden, "▾ zobrazit adresu" shows and hides it, a click on the name does not`, async ({ page }) => {
      await startRound(page, { level: levelName });
      const scenario = scenarioById(await currentScenarioId(page));
      const address = page.locator('[data-target="fromAddress"]');
      const reveal = page.locator('[data-mail="address"]');

      await expect(address).toHaveCount(0);
      await expect(reveal).toHaveText('zobrazit adresu');
      await expect(reveal.locator('svg')).toHaveCount(1);
      await expect(reveal).toHaveAttribute('aria-expanded', 'false');
      const box = await reveal.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(47.5);
      expect(box.height).toBeGreaterThanOrEqual(47.5);

      // The name never shows the address (at the advanced level it only gets marked)
      await page.locator('[data-target="fromName"]').click();
      await expect(address).toHaveCount(0);

      await showAddress(page);
      await expect(address).toBeVisible();
      await expect(address).toContainText(scenario.message.fromAddress);
      await expect(reveal).toHaveAttribute('aria-expanded', 'true');
      await expect(reveal).toHaveText('skrýt adresu');
      await expect(reveal).toBeFocused();

      await reveal.click();
      await expect(address).toHaveCount(0);
    });
  }

  test('the address is plain text, never a link (no mailto)', async ({ page }) => {
    for (const [levelName] of LEVELS) {
      await startRound(page, { level: levelName });
      await showAddress(page);
      const message = page.locator('article[data-scenario-id]');
      await expect(message.locator('a')).toHaveCount(0);
      await expect(page.locator('[href^="mailto:"]')).toHaveCount(0);
      await page.getByRole('button', { name: 'Je to podvod' }).click();
      await expect(message.locator('a')).toHaveCount(0);
      await expect(page.locator('[href^="mailto:"]')).toHaveCount(0);
    }
  });

  test('the visible pill is smaller than the 48 px tap area around it', async ({ page }) => {
    await startRound(page);
    const button = await page.locator('[data-mail="address"]').boundingBox();
    const pill = await page.locator('.mail__reveal-label').boundingBox();
    expect(button.height).toBeGreaterThanOrEqual(47.5);
    expect(pill.height).toBeLessThan(button.height);
  });

  test('back arrow shows "Doručená pošta"; its accessible name contains the visible text (WCAG 2.5.3)', async ({ page }) => {
    await startRound(page);
    const back = page.getByRole('button', { name: 'Zpět do schránky Doručená pošta', exact: true });
    await expect(back).toBeVisible();
    await expect(back).toHaveText('Doručená pošta');
    // Voice control: saying the visible text finds the button
    await expect(page.getByRole('button', { name: 'Doručená pošta' })).toHaveCount(1);
  });

  test('focus ring: hidden after a click or tap, shown with the keyboard', async ({ page }) => {
    await startRound(page);
    const reveal = page.locator('[data-mail="address"]');
    const outline = () => reveal.evaluate((el) => getComputedStyle(el).outlineStyle);
    await reveal.click();
    await expect(reveal).toBeFocused();
    expect(await outline()).toBe('none');
    // The keyboard brings the ring back
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(reveal).toBeFocused();
    expect(await outline()).toBe('solid');
  });

  test('"Komu: Jana Nováková" is shown in the detail', async ({ page }) => {
    await startRound(page);
    await expect(page.locator('.mail__to')).toHaveText('Komu: Jana Nováková');
  });

  test('in the evaluation the address is always visible', async ({ page }) => {
    await startRound(page);
    const scenario = scenarioById(await currentScenarioId(page));
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    await expect(page.locator('[data-target="fromAddress"]')).toContainText(scenario.message.fromAddress);
    await expect(page.locator('[data-mail="address"]')).toHaveCount(0);
  });
});

const EMAIL_02_SEED = seedWith('email', ['email-02']);

test.describe(`one threat on name and address (email-02, seed ${EMAIL_02_SEED})`, () => {
  test('marking only the name = one hit; the bulb is at the address', async ({ page }) => {
    await startRound(page, { seed: EMAIL_02_SEED, level: 'pokročilá' });
    await goToScenario(page, 'email-02');
    await page.locator('[data-mark="fromName"]').click();
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 1');
    await expect(page.locator('.review-part[data-target="fromName"] [data-status="found"]')).toHaveCount(1);
    await expect(page.locator('[data-status="extra"]')).toHaveCount(0);
    await expect(page.locator('.review-part[data-target="fromAddress"] [data-threat]')).toHaveCount(1);
    await expect(page.locator('.review-part[data-target="fromName"] [data-threat]')).toHaveCount(0);
  });

  test('marking name and address = still one hit, both shown as found', async ({ page }) => {
    await startRound(page, { seed: EMAIL_02_SEED, level: 'pokročilá' });
    await goToScenario(page, 'email-02');
    await page.locator('[data-mark="fromName"]').click();
    await showAddress(page);
    await page.locator('[data-mark="fromAddress"]').click();
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 1');
    await expect(page.locator('[data-status="found"]')).toHaveCount(2);
  });

  test('the sender explanation names the real address', async ({ page }) => {
    await startRound(page, { seed: EMAIL_02_SEED });
    await goToScenario(page, 'email-02');
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    await page.getByRole('button', { name: 'Proč je to podezřelé: Falešné jméno odesílatele' }).click();
    await expect(page.getByRole('dialog')).toContainText(
      'Jméno bylo falešné. Důkaz najdete v adrese: skutečná adresa byla financni.sprava.cz47@gmail.com.',
    );
  });
});

test.describe('round bar and layout on a phone', () => {
  test('360 px: "Zpět" and "Na co si dát pozor?" side by side, at least 48 px high', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await startRound(page);
    const back = page.getByRole('button', { name: 'Zpět na výběr úrovně' });
    await expect(page.getByRole('button', { name: 'Na co si dát pozor?' })).toBeVisible();
    await expect(back).toHaveText('Zpět na výběr úrovně'); // accessible text stays whole
    // Measure both buttons in the same moment (the screen slides in by a few px) and with the real fonts
    await page.evaluate(() => document.fonts.ready);
    const [b, h] = await page.evaluate(() =>
      ['.round-bar__back', '.round-bar__hint'].map((selector) => {
        const { y, width, height } = document.querySelector(selector).getBoundingClientRect();
        return { y, width, height };
      }),
    );
    expect(Math.abs(b.y - h.y)).toBeLessThan(2);
    expect(b.height).toBeGreaterThanOrEqual(47.5);
    expect(h.height).toBeGreaterThanOrEqual(47.5);
    // Only "Zpět" is visible on a phone
    expect(b.width).toBeLessThan(140);
  });

  test('200 % text at 360 px: no horizontal scroll in the inbox and the detail', async ({ page }) => {
    const noScroll = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    await page.setViewportSize({ width: 360, height: 740 });
    await startRound(page, { open: false });
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await page.getByRole('button', { name: 'Složky' }).click();
    expect(await noScroll()).toBe(true);
    await openCurrentMessage(page);
    await showAddress(page);
    expect(await noScroll()).toBe(true);
  });
});
