import { test, expect } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import {
  FTP_WRITE_METHODS,
  checkForWordPress,
  checkRemoteDir,
  planDeploy,
  readOnlyClient,
} from '../../scripts/deploy-guard.mjs';

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

test.describe('deploy plan: what would be uploaded and deleted', () => {
  const local = [
    { path: 'index.html', size: 610 },
    { path: 'assets/index-NEW.js', size: 72870 },
    { path: 'fonts/montserrat-700.woff2', size: 130012 },
  ];
  const remote = new Map([
    ['index.html', 610],
    ['logo.png', 5000], // root file not in dist: never deleted
    ['assets/index-OLD.js', 72850],
    ['fonts/montserrat-700.woff2', 130000],
    ['fonts/montserrat-var-latin.woff2', 37956],
    ['fonts/sub/deeper.woff2', 1], // not directly in fonts/: never deleted
    ['other/file.txt', 1], // folder not owned by the build: never deleted
  ]);

  test('every local file is uploaded, marked new / other size / same size', () => {
    expect(planDeploy(local, remote).upload).toEqual([
      { path: 'index.html', status: 'same-size', localSize: 610, remoteSize: 610 },
      { path: 'assets/index-NEW.js', status: 'new', localSize: 72870, remoteSize: undefined },
      { path: 'fonts/montserrat-700.woff2', status: 'changed', localSize: 130012, remoteSize: 130000 },
    ]);
  });

  test('only files directly in assets/ and fonts/ that are not in dist/ are deleted', () => {
    expect(planDeploy(local, remote).remove).toEqual(['assets/index-OLD.js', 'fonts/montserrat-var-latin.woff2']);
  });

  test('empty server: everything new, nothing deleted', () => {
    const plan = planDeploy(local, new Map());
    expect(plan.upload.every((file) => file.status === 'new')).toBe(true);
    expect(plan.remove).toEqual([]);
  });

  test('a file that is in dist/ is never deleted, even in an owned folder', () => {
    expect(planDeploy(local, remote).remove).not.toContain('fonts/montserrat-700.woff2');
  });
});

test.describe('deploy dry run: read-only FTP client', () => {
  // A fake client that records every call, so nothing touches the network
  const fake = () => {
    const calls = [];
    const client = { name: 'fake' };
    for (const method of ['cd', 'list', 'size', 'close', ...FTP_WRITE_METHODS]) {
      client[method] = function (...args) {
        calls.push(method);
        return this.name; // proves the method runs on the real client
      };
    }
    return { client, calls };
  };

  test('reading works and reaches the real client', () => {
    const { client, calls } = fake();
    const readOnly = readOnlyClient(client);
    expect(readOnly.cd('/')).toBe('fake');
    expect(readOnly.list('fonts')).toBe('fake');
    readOnly.close();
    expect(calls).toEqual(['cd', 'list', 'close']);
  });

  for (const method of FTP_WRITE_METHODS) {
    test(`"${method}" throws and is never sent to the server`, () => {
      const { client, calls } = fake();
      expect(() => readOnlyClient(client)[method]('x')).toThrow(/jen ke čtení/);
      expect(calls).toEqual([]);
    });
  }

  test('the list of blocked methods covers every basic-ftp method that changes the server', () => {
    // Every method of the installed basic-ftp Client, sorted into reading and writing;
    // a new method in a future version fails here until it is sorted
    const declared = [...readFileSync('node_modules/basic-ftp/dist/Client.d.ts', 'utf8').matchAll(/^ {4}(?:async )?(\w+)\(/gm)].map(
      (match) => match[1],
    );
    const reading = [
      'access', 'cd', 'cdup', 'close', 'connect', 'connectImplicitTLS', 'constructor', 'download', 'downloadDir',
      'downloadTo', 'downloadToDir', 'features', 'lastMod', 'list', 'login', 'protectWhitespace', 'pwd', 'size',
      'trackProgress', 'useDefaultSettings', 'useTLS',
    ];
    for (const method of new Set(declared)) {
      expect(reading.includes(method) || FTP_WRITE_METHODS.includes(method), `basic-ftp method "${method}"`).toBe(true);
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
    const cleanupAt = source.indexOf('await client.remove(');
    expect(connectAt).toBeGreaterThan(-1);
    expect(uploadAt).toBeGreaterThan(connectAt);
    expect(cleanupAt).toBeGreaterThan(uploadAt);
    expect(source.slice(connectAt, uploadAt)).toContain('await openTarget(client, remoteDir)');
  });

  test('dry run connects only through the read-only client and returns before any upload', () => {
    const start = source.indexOf('if (dryRun) {');
    const end = source.indexOf('return;', start);
    const body = source.slice(start, end);
    expect(start).toBeGreaterThan(-1);
    expect(body).toContain('readOnlyClient(await connect(env))');
    expect(body).toContain('await openTarget(client, remoteDir)');
    expect(body).toContain('planDeploy(');
    for (const write of ['uploadFrom', 'remove(', 'ensureDir', 'rename']) expect(body).not.toContain(write);
    // The dry run ends before the real upload
    expect(end).toBeLessThan(source.indexOf('client.uploadFromDir('));
  });

  test('real deploy deletes exactly the files of the plan (same computation as the dry run)', () => {
    expect(source).toContain('for (const file of plan.remove) await client.remove(file);');
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
