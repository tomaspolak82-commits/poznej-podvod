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

  test('shows active section tiles as links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /^E-mail/ })).toHaveAttribute('href', '#/email');
    await expect(page.getByRole('link', { name: /^Zprávy \(SMS a WhatsApp\)/ })).toHaveAttribute(
      'href',
      '#/zpravy',
    );
  });

  test('shows upcoming sections as inactive tiles', async ({ page }) => {
    for (const [id, title] of [
      ['prohlizec', 'Prohlížeč'],
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

  test('footer has Facebook and privacy policy links', async ({ page }) => {
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

  test('page is not indexable before release (milestone 8)', async ({ page }) => {
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
    await page.goto('/#/prohlizec');
    await expect(page.getByRole('heading', { level: 1, name: 'Vyberte, co chcete trénovat' })).toBeVisible();
  });
});

test('page loads nothing from other servers (privacy)', async ({ page, baseURL }) => {
  const foreign = [];
  page.on('request', (request) => {
    if (!request.url().startsWith(baseURL)) foreign.push(request.url());
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.goto('/#/email');
  await page.waitForLoadState('networkidle');
  expect(foreign).toEqual([]);
});
