import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';

// Redirect http → https (Tomáš, 29. 9. 2026): 301, except the certificate renewal path.
// public/.htaccess is copied by Vite into dist/, the deploy uploads it to the subdomain root.
// Tests run after the build (webServer in playwright.config.js), so dist/ is fresh.
const EXPECTED = [
  'RewriteEngine On',
  'RewriteCond %{HTTPS} off',
  'RewriteCond %{REQUEST_URI} !^/\\.well-known/acme-challenge/',
  'RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
  '',
].join('\n');

// Git on Windows may check the file out with CRLF; Apache reads both, the text must match
const normalise = (text) => text.replace(/\r\n/g, '\n');

test('public/.htaccess has exactly the approved redirect rule', () => {
  expect(normalise(readFileSync('public/.htaccess', 'utf8'))).toBe(EXPECTED);
});

test('dist/ after the build contains .htaccess with the same rule', () => {
  expect(existsSync('dist/.htaccess')).toBe(true);
  expect(normalise(readFileSync('dist/.htaccess', 'utf8'))).toBe(EXPECTED);
});
