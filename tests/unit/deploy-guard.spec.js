import { test, expect } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { checkForWordPress, checkRemoteDir } from '../../scripts/deploy-guard.mjs';

test.describe('deploy guard: FTP_REMOTE_DIR', () => {
  for (const allowed of [
    '/',
    '/poznej-podvod.menestarosti.cz',
    '/poznej-podvod.menestarosti.cz/',
    '/poznej-podvod.menestarosti.cz/www',
  ]) {
    test(`allows "${allowed}"`, () => {
      expect(checkRemoteDir(allowed)).toBeNull();
    });
  }

  for (const rejected of [
    undefined,
    '',
    '   ',
    ' /',
    '/..',
    '/../menestarosti.cz',
    '..',
    '//',
    '/www',
    '/menestarosti.cz',
    '/poznej-podvod.menestarosti.cz/../menestarosti.cz',
    '/poznej-podvod.menestarosti.cz/..',
    '/poznej-podvod.menestarosti.cz..',
    '/poznej-podvod.menestarosti.czX',
    '/poznej-podvod.menestarosti.cz-old',
    'poznej-podvod.menestarosti.cz',
    '\\',
    '\\poznej-podvod.menestarosti.cz',
    '/poznej-podvod.menestarosti.cz\\www',
    ' /poznej-podvod.menestarosti.cz',
    '/POZNEJ-PODVOD.menestarosti.cz',
  ]) {
    test(`rejects ${JSON.stringify(rejected)}`, () => {
      expect(checkRemoteDir(rejected)).toEqual(expect.any(String));
    });
  }

  test('deploy script stops before build when the folder is wrong', () => {
    // --dry-run as a second safety net: even if the guard failed, nothing would be sent
    const run = spawnSync(process.execPath, ['scripts/deploy.mjs', '--dry-run'], {
      env: { ...process.env, FTP_REMOTE_DIR: '/menestarosti.cz' },
      encoding: 'utf8',
    });
    expect(run.status).toBe(1);
    expect(run.stderr).toContain('FTP_REMOTE_DIR');
    expect(run.stdout).not.toContain('Sestavuji');
  });
});

test.describe('deploy guard: WordPress in target folder', () => {
  test('empty folder is fine', () => {
    expect(checkForWordPress([])).toBeNull();
  });

  test('folder with our own build is fine', () => {
    expect(checkForWordPress(['index.html', 'assets', 'fonts', 'logo.png', '.well-known'])).toBeNull();
  });

  for (const marker of ['wp-config.php', 'wp-admin', 'wp-content', 'wp-includes']) {
    test(`stops on "${marker}"`, () => {
      expect(checkForWordPress(['index.html', marker])).toContain(marker);
    });
  }

  test('check ignores letter case (WP-CONTENT)', () => {
    expect(checkForWordPress(['WP-CONTENT'])).toEqual(expect.any(String));
  });

  test('similar but different names are not WordPress', () => {
    // Boundary: only exact names count, so our own files are never blocked by accident
    expect(checkForWordPress(['wp-config.php.bak', 'my-wp-admin', 'wp'])).toBeNull();
  });

  test('lists every WordPress marker found', () => {
    const message = checkForWordPress(['wp-admin', 'wp-content', 'wp-includes', 'wp-config.php', 'index.php']);
    for (const marker of ['wp-admin', 'wp-content', 'wp-includes', 'wp-config.php']) {
      expect(message).toContain(marker);
    }
  });
});

// Coarse source check: the real deploy cannot be run in tests (it needs the server),
// so this only guards against the WordPress check being removed or moved after the upload.
test.describe('deploy guard: wiring in deploy.mjs', () => {
  const source = readFileSync('scripts/deploy.mjs', 'utf8');

  test('real deploy runs openTarget after connecting and before upload and cleanup', () => {
    const connectAt = source.lastIndexOf('await connect(env)');
    const uploadAt = source.indexOf('client.uploadFromDir(');
    const cleanupAt = source.indexOf('await removeStaleFiles(');
    expect(connectAt).toBeGreaterThan(-1);
    expect(uploadAt).toBeGreaterThan(connectAt);
    expect(cleanupAt).toBeGreaterThan(uploadAt);
    expect(source.slice(connectAt, uploadAt)).toContain('await openTarget(client, remoteDir)');
  });

  test('openTarget lists the folder, then checks for WordPress, then confirms', () => {
    const start = source.indexOf('async function openTarget(');
    const end = source.indexOf('\n}\n', start);
    const body = source.slice(start, end);
    const listAt = body.indexOf('await client.list()');
    const printAt = body.indexOf('Obsah složky');
    const checkAt = body.indexOf('checkForWordPress(');
    const failAt = body.indexOf('fail(wordPressError)');
    const okAt = body.indexOf('není WordPress');
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    expect(listAt).toBeGreaterThan(-1);
    expect(printAt).toBeGreaterThan(listAt);
    expect(checkAt).toBeGreaterThan(printAt);
    expect(failAt).toBeGreaterThan(checkAt);
    expect(okAt).toBeGreaterThan(failAt);
  });
});
