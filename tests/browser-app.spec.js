// Simulated browser, section Prohlížeč (plan docs/plany/plan-prohlizec.md, approved texts
// docs/navrhy-scenaru-prohlizec.md, 1. 10. 2026).
import { test, expect } from '@playwright/test';
import { BROWSER_APP, HINTS, LINK_NOTICE } from '../src/texts.js';
import { decide, goToScenario, nextMessage, seedWith, skipBrowserIntro, startRound } from './helpers/game.js';

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

// First visit (Tomáš, 1. 10. 2026): the intro is a screen of its own until its button is pressed
test.describe('intro about the address bar', () => {
  const intro = (page) => page.getByTestId('browser-intro');
  const levelButtons = (page) => page.getByRole('button', { name: /^Začít:/ });

  test('empty storage: the intro is shown with all its texts, no level buttons yet', async ({ page }) => {
    await page.goto('/?seed=1#/prohlizec');
    await expect(intro(page).getByRole('heading', { level: 1, name: BROWSER_APP.intro.title })).toBeVisible();
    const { parts, noWarningLabel, noWarningText, closing } = BROWSER_APP.intro;
    for (const part of parts) await expect(intro(page)).toContainText(`${part.label} ${part.text}`);
    for (const text of [noWarningLabel, noWarningText, closing]) await expect(intro(page)).toContainText(text);
    await expect(levelButtons(page)).toHaveCount(0);
  });

  // The picture is only a picture (Tomáš, 1. 10. 2026): hidden from screen readers, nothing to
  // fill in, press or mark; the text carries the content
  test('the picture of the browser is aria-hidden and has nothing to fill in or press', async ({ page }) => {
    await page.goto('/?seed=1#/prohlizec');
    const shot = page.getByTestId('browser-intro-shot');
    await expect(shot).toBeVisible();
    await expect(shot).toHaveAttribute('aria-hidden', 'true');
    await expect(shot).toContainText(BROWSER_APP.intro.address);
    await expect(shot).toContainText(BROWSER_APP.intro.pageHeading);
    await expect(shot.locator('input, textarea, button, a, [tabindex], [data-mark]')).toHaveCount(0);
    await expect(shot.locator('.browser-intro__num')).toHaveText(['2', '1', '3']);
    // The second bar "Bez varování": the same address, no warning
    const plain = page.locator('.browser-intro__plain');
    await expect(plain.locator('[aria-hidden="true"]')).toContainText(BROWSER_APP.intro.address);
    await expect(plain.locator('.browser-intro__icon')).toHaveCount(0);
  });

  test('the button opens the level select; on the next visit the intro is not shown', async ({ page }) => {
    await page.goto('/?seed=1#/prohlizec');
    await page.getByRole('button', { name: BROWSER_APP.intro.button }).click();
    await expect(intro(page)).toHaveCount(0);
    await expect(levelButtons(page)).toHaveCount(2);
    await expect(page.getByRole('heading', { level: 1, name: 'Prohlížeč' })).toBeFocused();

    // New visit: back home, then the section again, and a fresh page load
    await page.getByRole('link', { name: /Zpět na výběr tréninku/ }).click();
    await page.getByRole('link', { name: /^Prohlížeč/ }).click();
    await expect(levelButtons(page)).toHaveCount(2);
    await expect(intro(page)).toHaveCount(0);
    await page.goto('about:blank');
    await page.goto('/?seed=1#/prohlizec');
    await expect(levelButtons(page)).toHaveCount(2);
    await expect(intro(page)).toHaveCount(0);
  });

  test('storage that cannot be read or written: the intro is shown every time, the button still works', async ({ page }) => {
    await page.addInitScript(() => {
      const fail = () => {
        throw new Error('storage blocked');
      };
      Object.defineProperty(window, 'localStorage', { get: fail, configurable: true });
    });
    for (let visit = 0; visit < 2; visit += 1) {
      await page.goto('about:blank');
      await page.goto('/?seed=1#/prohlizec');
      await expect(intro(page)).toBeVisible();
      await page.getByRole('button', { name: BROWSER_APP.intro.button }).click();
      await expect(levelButtons(page)).toHaveCount(2);
    }
  });

  test('the same seed draws the same round with or without the intro', async ({ page }) => {
    await page.goto('/?seed=1#/prohlizec');
    await page.getByRole('button', { name: BROWSER_APP.intro.button }).click();
    const withIntro = await page.getByTestId('max-points-pokrocila').innerText();
    await page.goto('about:blank');
    await page.goto('/?seed=1#/prohlizec');
    expect(await page.getByTestId('max-points-pokrocila').innerText()).toBe(withIntro);
  });

  test('200 % text at 320 px: the intro screen does not scroll sideways', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('/?seed=1#/prohlizec');
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await expect(intro(page)).toBeVisible();
    expect(await noScroll(page)).toBe(true);
  });
});

test.describe('level select', () => {
  test.beforeEach(({ page }) => skipBrowserIntro(page));

  test('the browser speaks about pages; e-mail and Zprávy keep their texts', async ({ page }) => {
    await page.goto('/?seed=1#/prohlizec');
    await expect(page.locator('.level__intro')).toHaveText('Vyberte si úroveň. V obou uvidíte 5 stránek.');
    await expect(page.getByTestId('level-zakladni')).toContainText('Prohlédnete si stránku a rozhodnete');
    await expect(page.getByTestId('level-pokrocila')).toContainText('co vám na stránce přijde podezřelé');
    for (const section of ['email', 'zpravy']) {
      await page.goto(`/?seed=1#/${section}`);
      await expect(page.locator('.level__intro')).toHaveText('Vyberte si úroveň. V obou uvidíte 5 zpráv.');
      await expect(page.getByTestId('level-zakladni')).toContainText('Přečtete si zprávu');
      await expect(page.getByTestId('browser-intro')).toHaveCount(0);
    }
  });

  // Tomáš, 1. 10. 2026: the level cards keep their size (same as E-mail and Zprávy)
  test('360 × 740: the first level button without scrolling, the second after scrolling one screen', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/?seed=1#/prohlizec');
    const first = page.getByRole('button', { name: /Začít: základní/ });
    const second = page.getByRole('button', { name: /Začít: pokročilá/ });
    await expect(first).toBeInViewport({ ratio: 1 });
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await expect(second).toBeInViewport({ ratio: 1 });
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
    await expect(dialog.locator('.hint-list li')).toHaveCount(7);
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
          await skipBrowserIntro(page);
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

// Tomáš, 1. 10. 2026: a web address wraps only as a whole, never at a hyphen or a dot. Only an
// address longer than the whole line may break anywhere, and the page never scrolls sideways.
test.describe('web addresses wrap only as a whole', () => {
  const SEED_BANK = seedWith('prohlizec', ['prohlizec-03']);
  test.beforeEach(({ page }) => skipBrowserIntro(page));

  // For every address on the screen: its text, the number of lines it takes and whether it would
  // fit on one line of its parent (natural width measured on a hidden copy without wrapping)
  const addresses = (page) =>
    page.evaluate(() =>
      [...document.querySelectorAll('.addr')].map((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const lines = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
        const copy = el.cloneNode(true);
        copy.style.cssText = 'position: absolute; visibility: hidden; white-space: nowrap; max-width: none;';
        el.parentElement.append(copy);
        const natural = copy.getBoundingClientRect().width;
        copy.remove();
        const style = getComputedStyle(el.parentElement);
        const line = el.parentElement.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        return { text: el.textContent, lines, fits: natural <= line };
      }),
    );
  const openExplanation = async (page) => {
    await decide(page, 'scam');
    await page.locator('[data-target="address"] [data-threat]').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
  };

  test(`360 px, seed ${SEED_BANK}: the bank addresses stay on one line on the card, in the address bar and in the explanation`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await open(page, 'prohlizec-03', { seed: SEED_BANK });
    expect(await addresses(page)).toEqual([
      { text: 'lipova-banka.cz', lines: 1, fits: true },
      { text: 'lipova-banka-overeni.cz', lines: 1, fits: true },
    ]);
    await openExplanation(page);
    const inDialog = (await addresses(page)).slice(2);
    expect(inDialog).toEqual([
      { text: 'lipova-banka.cz', lines: 1, fits: true },
      { text: 'lipova-banka-overeni.cz', lines: 1, fits: true },
    ]);
  });

  test(`200 % text at 320 px, seed ${SEED_BANK}: no sideways scroll, an address that fits its line is on one line`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await open(page, 'prohlizec-03', { seed: SEED_BANK });
    await page.addStyleTag({ content: 'html { font-size: 200% !important; } .round-bar { position: static !important; }' });
    const check = async () => {
      expect(await noScroll(page)).toBe(true);
      const list = await addresses(page);
      expect(list.length).toBeGreaterThan(0);
      for (const address of list.filter((a) => a.fits)) expect(address, address.text).toMatchObject({ lines: 1 });
    };
    await check();
    await openExplanation(page);
    await check();
  });
});
