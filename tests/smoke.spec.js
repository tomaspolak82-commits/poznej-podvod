import { test, expect } from '@playwright/test';

test('home page loads with app title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Poznej podvod/);
  await expect(page.getByRole('heading', { level: 1, name: 'Poznej podvod' })).toBeVisible();
});

test('page is not indexable before release (milestone 8)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});
