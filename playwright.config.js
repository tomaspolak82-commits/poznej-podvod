import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const UNIT_TESTS = '**/unit/**/*.spec.js';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  // Devices from CLAUDE.md, section 12. Browser tests skip tests/unit/,
  // which runs once in the "unit" project (pure Node, no browser needed).
  projects: [
    { name: 'Pixel 7', testIgnore: UNIT_TESTS, use: { ...devices['Pixel 7'] } },
    { name: 'iPhone 13', testIgnore: UNIT_TESTS, use: { ...devices['iPhone 13'] } },
    { name: 'Galaxy Tab S4', testIgnore: UNIT_TESTS, use: { ...devices['Galaxy Tab S4'] } },
    { name: 'Desktop Chrome', testIgnore: UNIT_TESTS, use: { ...devices['Desktop Chrome'] } },
    {
      name: 'Mobile 320px',
      testIgnore: UNIT_TESTS,
      use: { ...devices['Pixel 7'], viewport: { width: 320, height: 640 } },
    },
    { name: 'unit', testMatch: UNIT_TESTS },
  ],
  // Tests run against the production build, not the dev server
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
