// Simulated browser, section Prohlížeč (plan docs/plany/plan-prohlizec.md, approved texts
// docs/navrhy-scenaru-prohlizec.md, 1. 10. 2026).
import { test, expect } from '@playwright/test';
import { BROWSER_APP, HINTS, LINK_NOTICE } from '../src/texts.js';
import { decide, goToScenario, nextMessage, seedWith, startRound } from './helpers/game.js';

// Rounds chosen by their pages (seedWith): SEED_INSECURE has the page without a secure connection
// (01), the warning drawn by the page (04) and the ad (05); SEED_POPUP has the popups (02, 06),
// the login (07) and the card payment (08).
const SEED_INSECURE = seedWith('prohlizec', ['prohlizec-01', 'prohlizec-04', 'prohlizec-05']);
const SEED_POPUP = seedWith('prohlizec', ['prohlizec-02', 'prohlizec-06', 'prohlizec-07', 'prohlizec-08']);
const SEEDS = `seeds ${SEED_INSECURE} and ${SEED_POPUP}`;

const start = (page, { seed = SEED_INSECURE, level = 'základní' } = {}) =>
  startRound(page, { section: 'prohlizec', seed, level });
const open = async (page, id, options) => {
  await start(page, options);
  await goToScenario(page, id);
};
const mark = (page, target) => page.locator(`[data-mark="${target}"]`).click();
const article = (page) => page.locator('article[data-scenario-id]');
const noticeText = async (page, locator) => {
  await locator.click();
  const dialog = page.getByRole('dialog');
  const text = await dialog.locator('.dialog__body').innerText();
  await dialog.getByRole('button', { name: 'Zavřít a pokračovat' }).click();
  await expect(dialog).toHaveCount(0);
  return text.trim();
};
const noScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test.describe('level select', () => {
  test('the intro about the address bar is shown every time, the levels speak about pages', async ({ page }) => {
    for (let visit = 0; visit < 2; visit += 1) {
      await page.goto('about:blank');
      await page.goto('/?seed=1#/prohlizec');
      const intro = page.getByTestId('browser-intro');
      await expect(intro.getByRole('heading', { name: BROWSER_APP.intro.title })).toBeVisible();
      await expect(intro).toContainText(BROWSER_APP.intro.caption);
      for (const paragraph of BROWSER_APP.intro.paragraphs) await expect(intro).toContainText(paragraph);
    }
    await expect(page.getByTestId('level-zakladni')).toContainText('Prohlédnete si stránku a rozhodnete');
    await expect(page.getByTestId('level-pokrocila')).toContainText('co vám na stránce přijde podezřelé');
  });

  test('e-mail and Zprávy have no browser intro and keep their level texts', async ({ page }) => {
    for (const section of ['email', 'zpravy']) {
      await page.goto(`/?seed=1#/${section}`);
      await expect(page.getByTestId('level-zakladni')).toContainText('Přečtete si zprávu');
      await expect(page.getByTestId('browser-intro')).toHaveCount(0);
    }
  });
});

test.describe(`round texts (${SEEDS})`, () => {
  test('the browser says "Stránka 1 z 5", "Další stránka" and "5 stránek"', async ({ page }) => {
    await start(page);
    await expect(page.getByTestId('progress')).toHaveText('Stránka 1 z 5');
    for (let i = 0; i < 5; i += 1) {
      await decide(page, 'scam');
      if (i < 4) {
        await expect(page.getByRole('button', { name: /Další stránka/ })).toBeVisible();
        await nextMessage(page);
      }
    }
    await page.getByRole('button', { name: /Zobrazit výsledek/ }).click();
    await expect(page.getByTestId('round-end')).toContainText('Hotovo, máte za sebou 5 stránek.');
  });

  for (const section of ['email', 'zpravy']) {
    test(`${section} keeps "Zpráva 1 z 5" and "Další zpráva"`, async ({ page }) => {
      await startRound(page, { section, seed: 123 });
      await expect(page.getByTestId('progress')).toHaveText('Zpráva 1 z 5');
      await decide(page, 'scam');
      await expect(page.getByRole('button', { name: /Další zpráva/ })).toBeVisible();
    });
  }

  test('the hint is the browser one', async ({ page }) => {
    await start(page);
    await page.getByRole('button', { name: 'Na co si dát pozor?' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText(HINTS.prohlizec.title);
    await expect(dialog.locator('.hint-list li')).toHaveCount(6);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('advanced level: the mismatch window speaks about the page', async ({ page }) => {
    await start(page, { level: 'pokročilá' });
    await page.getByRole('button', { name: 'Je to podvod' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Stránku ale hodnotíte jako podvod.');
    await dialog.getByRole('button', { name: 'Označit místa' }).click();
    await mark(page, 'address');
    await page.getByRole('button', { name: 'Je to v pořádku' }).click();
    await expect(dialog).toContainText('Stránku ale hodnotíte jako v pořádku. Je to tak?');
    await expect(dialog.getByRole('button', { name: 'Zpět ke stránce' })).toBeVisible();
  });
});

test.describe(`page and address bar (${SEEDS})`, () => {
  test('card "Jak jste se sem dostali" is shown in play and evaluation and cannot be marked', async ({ page }) => {
    await open(page, 'prohlizec-01', { level: 'pokročilá' });
    const card = page.getByTestId('arrival');
    await expect(card).toContainText(BROWSER_APP.arrivalTitle);
    await expect(card).toContainText('Hledali jste recept na švestkový koláč.');
    await expect(card.locator('[data-mark]')).toHaveCount(0);
    await mark(page, 'security');
    await decide(page, 'scam');
    await expect(page.getByTestId('arrival')).toContainText('Hledali jste recept na švestkový koláč.');
  });

  for (const level of ['základní', 'pokročilá']) {
    test(`${level}: without a secure connection only the triangle, read as "${BROWSER_APP.insecureLabel}"`, async ({ page }) => {
      await open(page, 'prohlizec-01', { level });
      const security = article(page).locator('.browser__security');
      await expect(security.locator('svg')).toBeVisible();
      await expect(security).toContainText(BROWSER_APP.insecureLabel);
      // No visible "Nezabezpečeno" during play
      await expect(article(page).getByText(BROWSER_APP.insecureText, { exact: true })).toHaveCount(0);
      const box = await (level === 'pokročilá' ? page.locator('[data-mark="security"]') : security).boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(47.5);
      expect(box.height).toBeGreaterThanOrEqual(47.5);
      if (level === 'pokročilá') {
        await expect(page.getByRole('button', { name: new RegExp(BROWSER_APP.insecureLabel) })).toHaveCount(1);
      }
    });
  }

  test('evaluation: triangle with "Nezabezpečeno" and a bulb', async ({ page }) => {
    await open(page, 'prohlizec-01');
    await decide(page, 'scam');
    const part = page.locator('.review-part[data-target="security"]');
    await expect(part.getByText(BROWSER_APP.insecureText, { exact: true })).toBeVisible();
    await part.getByRole('button', { name: 'Proč je to podezřelé: Varování u adresy' }).click();
    await expect(page.getByRole('dialog')).toContainText('připojení není zabezpečené');
  });

  test('a page with a secure connection has no warning at all', async ({ page }) => {
    await open(page, 'prohlizec-08', { seed: SEED_POPUP });
    await expect(article(page).locator('.browser__security')).toHaveCount(0);
    await expect(article(page).locator('.browser__address')).toContainText('domaci-pomocnik-obchod.cz');
  });

  test('the page is never a real link or form: no <a>, href, tel:, input or textarea', async ({ page }) => {
    await start(page, { seed: SEED_POPUP });
    for (let i = 0; i < 5; i += 1) {
      await expect(article(page).locator('a, [href], input, textarea, select')).toHaveCount(0);
      await decide(page, 'scam');
      await expect(article(page).locator('a, [href], input, textarea, select')).toHaveCount(0);
      if (i < 4) await nextMessage(page);
    }
  });
});

test.describe(`basic level: notices are the same for scams and legitimate pages (${SEEDS})`, () => {
  test('form field and button: prohlizec-01 (scam) and prohlizec-08 (legitimate)', async ({ page }) => {
    await start(page);
    await goToScenario(page, 'prohlizec-01');
    const scam = [
      await noticeText(page, page.locator('[data-target="fields.2"]')),
      await noticeText(page, page.locator('[data-target="button"]')),
    ];
    await page.goto('about:blank');
    await open(page, 'prohlizec-08', { seed: SEED_POPUP });
    const legit = [
      await noticeText(page, page.locator('[data-target="fields.0"]')),
      await noticeText(page, page.locator('[data-target="button"]')),
    ];
    expect(scam).toEqual([BROWSER_APP.fieldNotice, BROWSER_APP.buttonNotice]);
    expect(legit).toEqual(scam);
  });

  test('popup buttons: prohlizec-02 (scam) and prohlizec-06 (legitimate); the ad shows the link notice', async ({ page }) => {
    await open(page, 'prohlizec-02', { seed: SEED_POPUP });
    expect(await noticeText(page, page.locator('[data-target="popup.button.0"]'))).toBe(BROWSER_APP.buttonNotice);
    await page.goto('about:blank');
    await open(page, 'prohlizec-06', { seed: SEED_POPUP });
    expect(await noticeText(page, page.locator('[data-target="popup.button.1"]'))).toBe(BROWSER_APP.buttonNotice);
    await page.goto('about:blank');
    await open(page, 'prohlizec-05');
    expect(await noticeText(page, page.locator('[data-target="banner"]'))).toBe(LINK_NOTICE);
  });
});

test.describe(`advanced level: scoring (${SEEDS})`, () => {
  test('prohlizec-01: one threat on four parts = one hit; every threat = 2 + 4', async ({ page }) => {
    await open(page, 'prohlizec-01', { level: 'pokročilá' });
    for (const target of ['security', 'address', 'fields.0', 'heading', 'body.1', 'fields.2']) await mark(page, target);
    await decide(page, 'scam');
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 4');
    await expect(page.locator('[data-status="extra"]')).toHaveCount(0);
    await expect(page.locator('[data-status="missed"]')).toHaveCount(0);
  });

  test('prohlizec-01: "Odeslat" is the innocent part and costs a point', async ({ page }) => {
    await open(page, 'prohlizec-01', { level: 'pokročilá' });
    for (const target of ['security', 'button']) await mark(page, target);
    await decide(page, 'scam');
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 0');
    await expect(page.locator('.review-part[data-target="button"] [data-status]')).toHaveText(
      'Označeno zbytečně, tady je vše v pořádku',
    );
  });

  test('prohlizec-02: the dimmed page cannot be marked; both popup threats = 2 + 2', async ({ page }) => {
    await open(page, 'prohlizec-02', { seed: SEED_POPUP, level: 'pokročilá' });
    await expect(page.locator('.browser__ghosts [data-mark]')).toHaveCount(0);
    await expect(page.locator('[data-mark]')).toHaveCount(5);
    await mark(page, 'popup.title');
    await mark(page, 'popup.button.0');
    await decide(page, 'scam');
    await expect(page.getByTestId('gained')).toHaveText('Získali jste 4 body.');
  });

  test('prohlizec-06 (legitimate popup) with nothing marked = 2 + 2', async ({ page }) => {
    await open(page, 'prohlizec-06', { seed: SEED_POPUP, level: 'pokročilá' });
    await decide(page, 'ok');
    await expect(page.getByTestId('gained')).toHaveText('Získali jste 4 body.');
    await expect(page.getByTestId('legit-marking')).toHaveText('Nic jste neoznačili, správně: na stránce nebylo nic podezřelého.');
  });

  test('prohlizec-08 (legitimate) with the card field marked = 2 + 0', async ({ page }) => {
    await open(page, 'prohlizec-08', { seed: SEED_POPUP, level: 'pokročilá' });
    await mark(page, 'fields.0');
    await decide(page, 'ok');
    await expect(page.getByTestId('breakdown')).toHaveText('Za rozhodnutí: 2 · Za označená místa: 0');
  });
});

test.describe(`layout (${SEEDS})`, () => {
  // Every page of both rounds, i.e. all 8 scenarios; one test per round and level (time limit)
  for (const seed of [SEED_INSECURE, SEED_POPUP]) {
    for (const level of ['základní', 'pokročilá']) {
      test(`touch targets at least 48 × 48 px, seed ${seed}, ${level}`, async ({ page }) => {
        await start(page, { seed, level });
        for (let i = 0; i < 5; i += 1) {
          const small = await page.evaluate(() =>
            [...document.querySelectorAll('article button')]
              .map((el) => ({ text: el.textContent.trim().slice(0, 30), box: el.getBoundingClientRect() }))
              .filter(({ box }) => box.width < 47.5 || box.height < 47.5)
              .map(({ text, box }) => `${text} (${Math.round(box.width)}×${Math.round(box.height)})`),
          );
          expect(small).toEqual([]);
          await decide(page, 'scam');
          if (i < 4) await nextMessage(page);
        }
      });
    }
  }

  // Every page of both rounds, i.e. all 8 scenarios; one test per width, round and level (time limit)
  for (const width of [320, 360]) {
    for (const seed of [SEED_INSECURE, SEED_POPUP]) {
      for (const level of ['základní', 'pokročilá']) {
        test(`200 % text at ${width} px, seed ${seed}, ${level}: no horizontal scroll on the level select, in play, marking and evaluation`, async ({ page }) => {
          await page.setViewportSize({ width, height: 740 });
          await page.goto(`/?seed=${seed}#/prohlizec`);
          await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
          expect(await noScroll(page)).toBe(true);
          await page.getByRole('button', { name: new RegExp(`Začít: ${level}`) }).click();
          // The bar of the round stays sticky with text enlarged by CSS (known, CLAUDE.md section 16,
          // test.fail in email-app.spec.js) and would cover the buttons; this test is about sideways scroll
          await page.addStyleTag({ content: 'html { font-size: 200% !important; } .round-bar { position: static !important; }' });
          for (let i = 0; i < 5; i += 1) {
            // Advanced: mark the first part (on page 01 the warning icon with its badge)
            if (level === 'pokročilá') await page.locator('[data-mark]').first().click();
            expect(await noScroll(page)).toBe(true);
            await decide(page, 'scam');
            expect(await noScroll(page)).toBe(true);
            if (i < 4) await nextMessage(page);
          }
        });
      }
    }
  }
});
