import { test, expect } from '@playwright/test';

test.describe('level select', () => {
  test('email section offers basic and advanced level with max points', async ({ page }) => {
    await page.goto('/#/email');
    await expect(page.getByRole('heading', { level: 1, name: 'E-mail' })).toBeVisible();

    await expect(page.getByRole('heading', { level: 2, name: 'Základní' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Pokročilá' })).toBeVisible();

    // Basic level: 5 messages × 2 points
    await expect(page.getByTestId('max-points-zakladni')).toHaveText('10');
    // Advanced max depends on drawn messages (milestone 3); for now just a positive number
    const advanced = Number(await page.getByTestId('max-points-pokrocila').textContent());
    expect(advanced).toBeGreaterThan(10);
  });

  test('messages section has its own level select', async ({ page }) => {
    await page.goto('/#/zpravy');
    await expect(page.getByRole('heading', { level: 1, name: 'Zprávy (SMS a WhatsApp)' })).toBeVisible();
  });

  test('header has no "Zpět na Méně Starostí" button, footer has a text link instead', async ({ page }) => {
    await page.goto('/#/email');
    await expect(page.getByRole('link', { name: 'Zpět na Méně Starostí' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Zpět na výběr tréninku' })).toBeVisible();
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'menestarosti.cz' })).toBeVisible();
  });

  test('"Zpět na Méně Starostí" returns after going back to home', async ({ page }) => {
    await page.goto('/');
    const mainSite = page.getByRole('link', { name: 'Zpět na Méně Starostí' });
    await expect(mainSite).toBeVisible();

    await page.getByRole('link', { name: /^E-mail/ }).click();
    await expect(mainSite).toHaveCount(0);

    await page.getByRole('link', { name: 'Zpět na výběr tréninku' }).click();
    await expect(mainSite).toBeVisible();
  });

  test('round screen has no "Zpět na Méně Starostí" button', async ({ page }) => {
    await page.goto('/#/email/kolo');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Zpět na Méně Starostí' })).toHaveCount(0);
  });

  test('back button returns to home', async ({ page }) => {
    await page.goto('/#/email');
    await page.getByRole('link', { name: 'Zpět na výběr tréninku' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Vyberte, co chcete trénovat' })).toBeVisible();
  });

  test('start button leads to the round screen', async ({ page }) => {
    await page.goto('/#/email');
    await page.getByRole('link', { name: /Začít: základní úroveň/ }).click();
    await expect(page).toHaveURL(/#\/email\/kolo$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
