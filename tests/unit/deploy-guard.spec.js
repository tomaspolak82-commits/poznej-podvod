import { test, expect } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { checkRemoteDir } from '../../scripts/deploy-guard.mjs';

test.describe('deploy guard: FTP_REMOTE_DIR', () => {
  for (const allowed of [
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
    '/',
    '/menestarosti.cz',
    '/poznej-podvod.menestarosti.cz/../menestarosti.cz',
    '/poznej-podvod.menestarosti.cz/..',
    '/poznej-podvod.menestarosti.cz..',
    '/poznej-podvod.menestarosti.czX',
    '/poznej-podvod.menestarosti.cz-old',
    'poznej-podvod.menestarosti.cz',
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
