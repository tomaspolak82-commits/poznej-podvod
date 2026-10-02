import { test, expect } from '@playwright/test';

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the header with back button, logo, title and subtitle', async ({ page }) => {
    const back = page.getByRole('link', { name: 'Zpět na Méně Starostí' });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', 'https://menestarosti.cz/hry-pro-senior/');

    const logo = page.getByRole('img', { name: 'Méně Starostí' });
    await expect(logo).toBeVisible();
    // naturalWidth > 0 means the image file really loaded, not just the <img> tag exists
    expect(await logo.evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);

    await expect(page.getByText('Poznej podvod', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Trénink pro seniory: jak poznat podvod v telefonu a na internetu'),
    ).toBeVisible();
  });

  // Wording approved by Tomáš on 2. 10. 2026 (all three sections, pages as well as messages)
  test('the lead and "Jak trénink probíhá" speak about messages and pages', async ({ page }) => {
    await expect(page.locator('.home__lead')).toHaveText(
      'Ukážeme vám, na co dnes můžete narazit v telefonu, v e-mailu a v prohlížeči. Vy posoudíte, jestli jde o podvod. Nic se neodesílá, takže nemůžete nic pokazit.',
    );
    await expect(page.locator('.steps__title')).toHaveText([
      'Přečtete si zprávu nebo si prohlédnete stránku',
      'Rozhodnete',
      'Dozvíte se proč',
    ]);
  });

  test('shows active section tiles as links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /^E-mail/ })).toHaveAttribute('href', '#/email');
    await expect(page.getByRole('link', { name: /^Zprávy \(SMS a WhatsApp\)/ })).toHaveAttribute(
      'href',
      '#/zpravy',
    );
    await expect(page.getByRole('link', { name: /^Prohlížeč/ })).toHaveAttribute('href', '#/prohlizec');
  });

  test('shows upcoming sections as inactive tiles', async ({ page }) => {
    // Prohlížeč is active in the branch sekce-prohlizec (1. 10. 2026)
    for (const [id, title] of [
      ['qr-platba', 'QR platba'],
      ['telefonat', 'Telefonát'],
    ]) {
      const tile = page.getByTestId(`tile-${id}`);
      await expect(tile).toBeVisible();
      await expect(tile).toContainText('Připravujeme');
      // Negative check: an upcoming section must not be clickable
      await expect(page.getByRole('link', { name: new RegExp(title) })).toHaveCount(0);
    }
  });

  test('logo sits next to the title, not above it', async ({ page }) => {
    const logo = await page.getByRole('img', { name: 'Méně Starostí' }).boundingBox();
    const title = await page.getByText('Poznej podvod', { exact: true }).boundingBox();
    expect(logo.x + logo.width).toBeLessThanOrEqual(title.x);
    // Vertical overlap = same row
    expect(logo.y).toBeLessThan(title.y + title.height);
    expect(title.y).toBeLessThan(logo.y + logo.height);
  });

  // During a round the header is compact (no subtitle); the logo must stay next to the title
  // on every device, the desktop included (bug fixed on 28. 9. 2026)
  test('in a round the logo still sits next to the title', async ({ page }) => {
    await page.goto('/?seed=123#/email');
    await page.getByRole('button', { name: /Začít: základní/ }).click();
    await expect(page.getByTestId('training-label')).toBeVisible();
    const logo = await page.getByRole('img', { name: 'Méně Starostí' }).boundingBox();
    const title = await page.getByText('Poznej podvod', { exact: true }).boundingBox();
    expect(logo.x + logo.width).toBeLessThanOrEqual(title.x);
    expect(logo.y).toBeLessThan(title.y + title.height);
    expect(title.y).toBeLessThan(logo.y + logo.height);
  });

  test('footer has main site, Facebook and privacy policy links', async ({ page }) => {
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'menestarosti.cz' })).toHaveAttribute(
      'href',
      'https://menestarosti.cz/',
    );
    await expect(page.getByRole('contentinfo')).toContainText('© ');
    await expect(page.getByRole('contentinfo')).toContainText('Méně Starostí');
    await expect(page.getByRole('link', { name: 'Facebook' })).toHaveAttribute(
      'href',
      'https://www.facebook.com/menestarosti',
    );
    await expect(page.getByRole('link', { name: 'Zásady ochrany osobních údajů' })).toHaveAttribute(
      'href',
      'https://menestarosti.cz/ochrana-osobnich-udaju/',
    );
  });

  test('page is not indexable before release (milestone 9)', async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });

  test('clicking a tile opens level select', async ({ page }) => {
    await page.getByRole('link', { name: /^E-mail/ }).click();
    await expect(page).toHaveURL(/#\/email$/);
    await expect(page.getByRole('heading', { level: 1, name: 'E-mail' })).toBeVisible();
  });
});

test.describe('routing', () => {
  test('unknown route falls back to home', async ({ page }) => {
    await page.goto('/#/neexistuje');
    await expect(page.getByRole('heading', { level: 1, name: 'Vyberte, co chcete trénovat' })).toBeVisible();
    await expect(page).toHaveURL(/#\/$/);
  });

  test('upcoming section cannot be opened by typing its address', async ({ page }) => {
    await page.goto('/#/qr-platba');
    await expect(page.getByRole('heading', { level: 1, name: 'Vyberte, co chcete trénovat' })).toBeVisible();
  });
});

test('page loads nothing from other servers (privacy)', async ({ page, baseURL }) => {
  const foreign = [];
  page.on('request', (request) => {
    if (!request.url().startsWith(baseURL)) foreign.push(request.url());
  });
  await page.goto('/');
  // networkidle is discouraged for waiting on the page (Playwright docs), but here the test is
  // about the network itself: it waits until nothing more is requested, so late requests
  // (fonts, images) to other servers are caught too. No page element marks "all requests done".
  await page.waitForLoadState('networkidle');
  await page.goto('/#/email');
  // Same reason as above: collect every request of the level select screen
  await page.waitForLoadState('networkidle');
  expect(foreign).toEqual([]);
});
