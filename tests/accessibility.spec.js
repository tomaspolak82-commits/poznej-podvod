import { test, expect } from '@playwright/test';

const PAGES = [
  ['home', '/'],
  ['level select', '/#/email'],
];

async function hasHorizontalScroll(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
}

for (const [name, url] of PAGES) {
  test(`${name}: no horizontal scroll at the device width`, async ({ page }) => {
    await page.goto(url);
    expect(await hasHorizontalScroll(page)).toBe(false);
  });

  test(`${name}: no horizontal scroll with 200 % text at 360 px`, async ({ page }) => {
    // Approximation of large system font: doubles the root font size (CLAUDE.md, section 10)
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(url);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(await hasHorizontalScroll(page)).toBe(false);
  });

  test(`${name}: every link and button is at least 48 × 48 px`, async ({ page }) => {
    await page.goto(url);
    const tooSmall = await page.evaluate(() =>
      [...document.querySelectorAll('a, button')]
        .map((el) => ({ text: el.textContent.trim().slice(0, 40), box: el.getBoundingClientRect() }))
        .filter(({ box }) => box.width < 47.5 || box.height < 47.5)
        .map(({ text, box }) => `${text} (${Math.round(box.width)}×${Math.round(box.height)})`),
    );
    expect(tooSmall).toEqual([]);
  });

  test(`${name}: body text is at least 18 px`, async ({ page }) => {
    await page.goto(url);
    const size = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
    expect(size).toBeGreaterThanOrEqual(18);
  });
}

test('viewport allows zoom (no maximum-scale or user-scalable=no)', async ({ page }) => {
  await page.goto('/');
  const content = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(content).not.toMatch(/maximum-scale|user-scalable\s*=\s*no/);
});
