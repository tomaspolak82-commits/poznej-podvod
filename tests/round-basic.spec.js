import { test, expect } from '@playwright/test';
import { maxPointsForRound } from '../src/engine/round.js';
import {
  correctly,
  currentScenarioId,
  expectedRounds,
  playRound,
  scenarioById,
  startRound,
  wrongly,
} from './helpers/game.js';

const ids = (round) => round.map((s) => s.id);

test.describe('level select with a drawn round', () => {
  test('shows the real maximum of the drawn round for both levels', async ({ page }) => {
    const [round] = expectedRounds('email', 123);
    await page.goto('/?seed=123#/email');
    await expect(page.getByTestId('max-points-zakladni')).toHaveText('10');
    await expect(page.getByTestId('max-points-pokrocila')).toHaveText(String(maxPointsForRound(round, 'pokrocila')));
  });
});

test.describe('basic level: round', () => {
  test('same seed gives the same messages in the same order, with 1–2 legitimate', async ({ page }) => {
    const [round] = expectedRounds('email', 123);
    await startRound(page);
    const played = await playRound(page, correctly);
    expect(played).toEqual(ids(round));
    const legit = played.filter((id) => !scenarioById(id).isScam).length;
    expect(legit).toBeGreaterThanOrEqual(1);
    expect(legit).toBeLessThanOrEqual(2);
  });

  test('the messages section works the same way', async ({ page }) => {
    const [round] = expectedRounds('zpravy', 7);
    await startRound(page, { section: 'zpravy', seed: 7 });
    expect(await playRound(page, correctly)).toEqual(ids(round));
    await expect(page.getByTestId('final-score')).toHaveText('Získali jste 10 z 10 bodů.');
  });

  test('progress and points in the bar update after each answer', async ({ page }) => {
    await startRound(page);
    await expect(page.getByTestId('progress')).toHaveText('Zpráva 1 z 5');
    await expect(page.getByTestId('score')).toHaveText('Body: 0 z 10');

    const first = scenarioById(await currentScenarioId(page));
    await page.getByRole('button', { name: correctly(first) === 'scam' ? 'Je to podvod' : 'Je to v pořádku' }).click();
    await expect(page.getByTestId('score')).toHaveText('Body: 2 z 10');

    await page.getByRole('button', { name: /Další zpráva/ }).click();
    await expect(page.getByTestId('progress')).toHaveText('Zpráva 2 z 5');
  });

  test('all correct: 2 points each, 10 of 10, nothing missed', async ({ page }) => {
    await startRound(page);
    await playRound(page, correctly);
    await expect(page.getByTestId('final-score')).toHaveText('Získali jste 10 z 10 bodů.');
    await expect(page.getByTestId('missed')).toHaveText('V tomto kole vám nic neuniklo.');
  });

  test('all wrong: 0 points, missed threats of the scams are listed', async ({ page }) => {
    await startRound(page);
    await playRound(page, wrongly);
    await expect(page.getByTestId('final-score')).toHaveText('Získali jste 0 z 10 bodů.');
    await expect(page.getByTestId('missed')).toContainText('V tomto kole vám unikalo:');
  });

  test('evaluation texts for all four situations', async ({ page }) => {
    const [round] = expectedRounds('email', 123);
    const scam = round.find((s) => s.isScam);
    const legit = round.find((s) => !s.isScam);
    const expected = {
      'scam-scam': 'Správně, je to podvod.',
      'scam-ok': 'Tahle zpráva je podvod.',
      'ok-ok': 'Správně, zpráva je v pořádku.',
      'ok-scam': 'Tahle zpráva je ve skutečnosti v pořádku.',
    };

    for (const [scenario, decision] of [
      [scam, 'scam'],
      [scam, 'ok'],
      [legit, 'ok'],
      [legit, 'scam'],
    ]) {
      await startRound(page);
      // Answer until the wanted scenario comes, then check its evaluation
      for (let i = 0; i < 5; i += 1) {
        const id = await currentScenarioId(page);
        const isTarget = id === scenario.id;
        const choice = isTarget ? decision : correctly(scenarioById(id));
        await page.getByRole('button', { name: choice === 'scam' ? 'Je to podvod' : 'Je to v pořádku' }).click();
        if (isTarget) break;
        await page.getByRole('button', { name: /Další zpráva/ }).click();
      }
      const key = `${scenario.isScam ? 'scam' : 'ok'}-${decision}`;
      await expect(page.getByTestId('evaluation').getByRole('heading', { level: 1 })).toHaveText(expected[key]);
      const correct = (decision === 'scam') === scenario.isScam;
      await expect(page.getByTestId('gained')).toHaveText(correct ? 'Získali jste 2 body.' : 'Získali jste 0 bodů.');
    }
  });

  test('clicking a link, button or attachment shows the same notice for scams and legitimate messages', async ({ page }) => {
    await startRound(page);
    const notices = new Map();
    for (let i = 0; i < 5; i += 1) {
      const scenario = scenarioById(await currentScenarioId(page));
      const actions = page.locator('[data-action="notice"]');
      if ((await actions.count()) > 0) {
        await actions.first().click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        notices.set(scenario.isScam ? 'scam' : 'legit', await dialog.locator('.dialog__body').textContent());
        await dialog.getByRole('button', { name: 'Zavřít a pokračovat' }).click();
        await expect(dialog).toHaveCount(0);
      }
      await page.getByRole('button', { name: correctly(scenario) === 'scam' ? 'Je to podvod' : 'Je to v pořádku' }).click();
      await page.getByRole('button', { name: i < 4 ? /Další zpráva/ : /Zobrazit výsledek/ }).click();
    }
    // Seed 123 has actions in both kinds of messages
    expect([...notices.keys()].sort()).toEqual(['legit', 'scam']);
    expect(notices.get('scam')).toBe(notices.get('legit'));
    expect(notices.get('scam')).toContain('Tohle je jen trénink, odkaz nikam nevede');
  });

  test('bulb opens the explanation; it closes with the button, Esc and a click outside', async ({ page }) => {
    const [round] = expectedRounds('email', 123);
    await startRound(page);
    // Move to the first scam
    while (!scenarioById(await currentScenarioId(page)).isScam) {
      await page.getByRole('button', { name: 'Je to v pořádku' }).click();
      await page.getByRole('button', { name: /Další zpráva/ }).click();
    }
    const scam = scenarioById(await currentScenarioId(page));
    expect(round.map((s) => s.id)).toContain(scam.id);
    await page.getByRole('button', { name: 'Je to podvod' }).click();

    const bulbs = page.getByRole('button', { name: /^Proč je to podezřelé/ });
    await expect(bulbs).toHaveCount(scam.threats.length);

    const dialog = page.getByRole('dialog');
    await bulbs.first().click();
    await expect(dialog).toContainText(scam.threats[0].explanation);
    await dialog.getByRole('button', { name: 'Zavřít a pokračovat' }).click();
    await expect(dialog).toHaveCount(0);

    await bulbs.first().click();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);

    await bulbs.first().click();
    await page.mouse.click(5, 5); // backdrop, outside the window
    await expect(dialog).toHaveCount(0);

    // The game continues where it was
    await expect(page.getByTestId('evaluation')).toBeVisible();
  });

  test('TRÉNINK label is visible on question, evaluation and round end', async ({ page }) => {
    await startRound(page);
    await expect(page.getByTestId('training-label')).toHaveText('TRÉNINK: cvičná ukázka, nic se neodesílá');
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    await expect(page.getByTestId('training-label')).toBeVisible();
    await page.getByRole('button', { name: /Další zpráva/ }).click();
    for (let i = 1; i < 5; i += 1) {
      await page.getByRole('button', { name: 'Je to podvod' }).click();
      await page.getByRole('button', { name: i < 4 ? /Další zpráva/ : /Zobrazit výsledek/ }).click();
    }
    await expect(page.getByTestId('round-end')).toBeVisible();
    await expect(page.getByTestId('training-label')).toBeVisible();
  });

  test('decision buttons look the same (neither is highlighted)', async ({ page }) => {
    await startRound(page);
    const style = (name) =>
      page.getByRole('button', { name }).evaluate((el) => {
        const s = getComputedStyle(el);
        return [s.backgroundColor, s.color, s.borderColor].join('|');
      });
    expect(await style('Je to podvod')).toBe(await style('Je to v pořádku'));
  });
});

test.describe('round end and history', () => {
  test('finished round is saved; "Hrát dalších 5" draws new messages without repeating', async ({ page }) => {
    const [first, second] = expectedRounds('email', 123);
    await startRound(page);
    await playRound(page, correctly);
    await expect(page.getByTestId('best')).toHaveText('To je váš nejlepší výsledek v této úrovni.');

    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('poznej-podvod:history:v1')));
    expect(stored.roundsPlayed).toBe(1);
    expect(stored.best['email:zakladni']).toEqual({ score: 10, max: 10 });
    expect(stored.lastRoundIds.email).toEqual(ids(first));

    await page.getByRole('button', { name: /Hrát dalších 5/ }).click();
    await expect(page.getByTestId('progress')).toHaveText('Zpráva 1 z 5');
    const played = await playRound(page, wrongly);
    expect(played).toEqual(ids(second));
    // 7 test messages: at least the 2 not played before must be in the new round
    const fresh = ['email-01', 'email-02', 'email-03', 'email-04', 'email-05', 'email-06', 'email-07'].filter(
      (id) => !ids(first).includes(id),
    );
    for (const id of fresh) expect(played).toContain(id);

    // Worse result keeps the best
    await expect(page.getByTestId('best')).toHaveText('Váš nejlepší výsledek je 10 z 10 bodů.');
  });

  test('page reload in the middle of a round → level select, nothing is saved', async ({ page }) => {
    await startRound(page);
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    await page.reload();
    await expect(page).toHaveURL(/#\/email$/);
    await expect(page.getByRole('heading', { level: 1, name: 'E-mail' })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('poznej-podvod:history:v1'))).toBeNull();
  });

  test('typing the round address without a round → level select', async ({ page }) => {
    await page.goto('/#/email/kolo');
    await expect(page).toHaveURL(/#\/email$/);
  });

  test('leaving asks for confirmation; "Hrát dál" keeps the round', async ({ page }) => {
    await startRound(page);
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    await page.getByRole('button', { name: /Další zpráva/ }).click();

    await page.getByRole('button', { name: 'Zpět na výběr úrovně' }).click();
    const dialog = page.getByRole('dialog', { name: 'Opravdu chcete kolo ukončit?' });
    await expect(dialog).toContainText('Body z tohoto kola se neuloží.');
    await dialog.getByRole('button', { name: 'Hrát dál' }).click();
    await expect(page.getByTestId('progress')).toHaveText('Zpráva 2 z 5');
  });

  test('Esc on the leave dialog also keeps the round', async ({ page }) => {
    await startRound(page);
    await page.getByRole('button', { name: 'Zpět na výběr úrovně' }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByTestId('progress')).toHaveText('Zpráva 1 z 5');
  });

  test('"Ukončit kolo" goes to level select and saves nothing', async ({ page }) => {
    await startRound(page);
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    await page.getByRole('button', { name: 'Zpět na výběr úrovně' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Ukončit kolo' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'E-mail' })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('poznej-podvod:history:v1'))).toBeNull();
  });

  test('browser back during a round drops it; forward does not resume it', async ({ page }) => {
    await startRound(page);
    await page.goBack();
    await expect(page.getByRole('heading', { level: 1, name: 'E-mail' })).toBeVisible();
    await page.goForward();
    await expect(page).toHaveURL(/#\/email$/);
  });

  test('the game works without localStorage (private window)', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('localStorage is disabled');
        },
      });
    });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await startRound(page);
    await playRound(page, correctly);
    await expect(page.getByTestId('final-score')).toHaveText('Získali jste 10 z 10 bodů.');
    expect(errors).toEqual([]);
  });
});

test.describe('round screens: accessibility', () => {
  async function tooSmallTargets(page) {
    return page.evaluate(() =>
      [...document.querySelectorAll('a, button')]
        .filter((el) => el.getClientRects().length > 0)
        .map((el) => ({ text: el.textContent.trim().slice(0, 30), box: el.getBoundingClientRect() }))
        .filter(({ box }) => box.width < 47.5 || box.height < 47.5)
        .map(({ text, box }) => `${text} (${Math.round(box.width)}×${Math.round(box.height)})`),
    );
  }
  const noHorizontalScroll = (page) =>
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

  test('question, evaluation and end: touch targets at least 48 × 48 px', async ({ page }) => {
    await startRound(page);
    expect(await tooSmallTargets(page)).toEqual([]);
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    expect(await tooSmallTargets(page)).toEqual([]);
    await page.getByRole('button', { name: /Další zpráva/ }).click();
    for (let i = 1; i < 5; i += 1) {
      await page.getByRole('button', { name: 'Je to podvod' }).click();
      await page.getByRole('button', { name: i < 4 ? /Další zpráva/ : /Zobrazit výsledek/ }).click();
    }
    expect(await tooSmallTargets(page)).toEqual([]);
  });

  test('question and evaluation: no horizontal scroll with 200 % text at 360 px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await startRound(page);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(await noHorizontalScroll(page)).toBe(true);
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    expect(await noHorizontalScroll(page)).toBe(true);
  });
});
