import { test, expect } from '@playwright/test';
import { correctly, nextMessage, playRound, startRound, wrongly } from './helpers/game.js';

const HISTORY_KEY = 'poznej-podvod:history:v1';

test.describe('hint "Na co si dát pozor?"', () => {
  test('opens in the round and closes with the button, Esc and a click outside', async ({ page }) => {
    await startRound(page);
    const openHints = () => page.getByRole('button', { name: 'Na co si dát pozor?' }).click();
    const dialog = page.getByRole('dialog', { name: 'Na co si dát pozor v e-mailu' });

    await openHints();
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('li')).toHaveCount(6);
    await expect(dialog).toContainText('Vždy si klepnutím zobrazte i adresu, která se za ním skrývá.');
    await expect(dialog).toContainText('Firma, u které máte účet, vás obvykle osloví jménem.');
    // Long window starts at the top: the title is on screen, not scrolled away
    await expect(dialog.getByRole('heading', { name: 'Na co si dát pozor v e-mailu' })).toBeInViewport();
    await dialog.getByRole('button', { name: 'Zavřít a pokračovat' }).click();
    await expect(dialog).toHaveCount(0);

    await openHints();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);

    await openHints();
    await page.mouse.click(5, 5);
    await expect(dialog).toHaveCount(0);
  });

  test('the game continues exactly where it was, marks included', async ({ page }) => {
    await startRound(page, { level: 'pokročilá' });
    await page.getByRole('button', { name: 'Je to v pořádku' }).click();
    await nextMessage(page);
    await page.locator('[data-mark="subject"]').click();

    await page.getByRole('button', { name: 'Na co si dát pozor?' }).click();
    await page.keyboard.press('Escape');

    await expect(page.getByTestId('progress')).toHaveText('Zpráva 2 z 5');
    await expect(page.locator('[data-mark="subject"]')).toHaveAttribute('aria-pressed', 'true');
  });

  test('is available in the evaluation too', async ({ page }) => {
    await startRound(page);
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    await page.getByRole('button', { name: 'Na co si dát pozor?' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('e-mail hint has no 7726; messages hint gives the 7726 advice', async ({ page }) => {
    await startRound(page);
    await page.getByRole('button', { name: 'Na co si dát pozor?' }).click();
    await expect(page.getByRole('dialog')).toContainText('i zpráva v bezchybné češtině může být podvod');
    await expect(page.getByRole('dialog')).not.toContainText('7726');
    await page.keyboard.press('Escape');

    await startRound(page, { section: 'zpravy' });
    await page.getByRole('button', { name: 'Na co si dát pozor?' }).click();
    const dialog = page.getByRole('dialog', { name: 'Na co si dát pozor ve zprávách' });
    await expect(dialog).toContainText('Podezřelou SMS můžete přeposlat na číslo 7726, operátor pak odesílatele zablokuje.');
    await expect(dialog.locator('li')).toHaveCount(6);
    await expect(dialog).toContainText('Odkaz sám o sobě podvod není.');
  });
});

test.describe('"Vítejte zpět" and deleting history', () => {
  test('first visit: no panel and no delete link', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('welcome')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Smazat moji historii' })).toHaveCount(0);
  });

  test('after a round the home page welcomes back, also after a reload', async ({ page }) => {
    await startRound(page);
    await playRound(page, correctly);
    await page.getByRole('link', { name: 'Zpět na hlavní stránku' }).click();

    const panel = page.getByTestId('welcome');
    await expect(panel).toContainText('Jsme rádi, že jste zase tady.');
    await expect(panel).toContainText('E-mail (základní): 10 z 10 bodů');
    await expect(page.getByTestId('welcome-rounds')).toHaveText('Odehráli jste zatím 1 kolo.');
    // All correct at basic level → nothing missed → no "unikalo" line
    await expect(page.getByTestId('welcome-missed')).toHaveCount(0);

    await page.reload();
    await expect(page.getByTestId('welcome')).toContainText('E-mail (základní): 10 z 10 bodů');
  });

  test('panel shows the two most often missed categories and plural of rounds', async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          best: { 'email:pokrocila': { score: 16, max: 19 }, 'zpravy:zakladni': { score: 8, max: 10 } },
          missedByCategory: { odesilatel: 5, 'casovy-tlak': 3, priloha: 1 },
          roundsPlayed: 5,
          lastRoundIds: {},
        }),
      );
    }, HISTORY_KEY);
    await page.goto('/');
    const panel = page.getByTestId('welcome');
    await expect(panel).toContainText('E-mail (pokročilá): 16 z 19 bodů');
    await expect(panel).toContainText('Zprávy (základní): 8 z 10 bodů');
    await expect(page.getByTestId('welcome-missed')).toHaveText(
      'Nejčastěji vám unikalo: adresa nebo jméno odesílatele, spěch ve zprávě.',
    );
    await expect(page.getByTestId('welcome-rounds')).toHaveText('Odehráli jste zatím 5 kol.');
  });

  test('"Ponechat historii" keeps everything', async ({ page }) => {
    await startRound(page);
    await playRound(page, wrongly);
    await page.getByRole('link', { name: 'Zpět na hlavní stránku' }).click();

    await page.getByRole('button', { name: 'Smazat moji historii' }).click();
    const dialog = page.getByRole('dialog', { name: 'Smazat historii?' });
    await expect(dialog).toContainText('Nejde to vrátit.');
    await dialog.getByRole('button', { name: 'Ponechat historii' }).click();

    await expect(page.getByTestId('welcome')).toBeVisible();
    expect(await page.evaluate((key) => localStorage.getItem(key), HISTORY_KEY)).not.toBeNull();
  });

  test('"Smazat historii" removes scores, statistics, rounds and last round IDs', async ({ page }) => {
    await startRound(page);
    await playRound(page, wrongly);
    await page.getByRole('link', { name: 'Zpět na hlavní stránku' }).click();

    await page.getByRole('button', { name: 'Smazat moji historii' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Smazat historii' }).click();

    await expect(page.getByTestId('history-status')).toHaveText('Historie je smazaná.');
    await expect(page.getByTestId('welcome')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Smazat moji historii' })).toHaveCount(0);
    expect(await page.evaluate((key) => localStorage.getItem(key), HISTORY_KEY)).toBeNull();

    await page.reload();
    await expect(page.getByTestId('welcome')).toHaveCount(0);
  });

  test('without localStorage the home page works and shows no panel', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('localStorage is disabled');
        },
      });
    });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Vyberte, co chcete trénovat' })).toBeVisible();
    await expect(page.getByTestId('welcome')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('home with history: no horizontal scroll with 200 % text at 360 px', async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          best: { 'zpravy:pokrocila': { score: 16, max: 19 } },
          missedByCategory: { 'instalace-aplikace': 2, 'zadost-o-udaje': 1 },
          roundsPlayed: 2,
          lastRoundIds: {},
        }),
      );
    }, HISTORY_KEY);
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
