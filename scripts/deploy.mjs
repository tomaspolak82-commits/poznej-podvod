// Deploys dist/ to Subreg hosting over FTPS (CLAUDE.md, section 14).
//
//   npm run deploy -- --dry-run   build and list what would be uploaded, no connection
//   npm run deploy -- --check     connect and list the remote folder, change nothing
//   npm run deploy                build, upload, remove stale files in assets/ and fonts/

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { Client } from 'basic-ftp';
import { checkRemoteDir } from './deploy-guard.mjs';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const PUBLIC_URL = 'https://poznej-podvod.menestarosti.cz/';
// Folders fully owned by our build: stale files inside them may be deleted
const OWNED_DIRS = ['assets', 'fonts'];

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const checkOnly = args.has('--check');

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function listLocalFiles(dir, prefix = '') {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...listLocalFiles(path.join(dir, entry.name), relative));
    else files.push(relative);
  }
  return files;
}

function build() {
  console.log('▶ Sestavuji aplikaci (npm run build)…');
  // Single command string: shell is needed on Windows to find npm
  const result = spawnSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'inherit', shell: true });
  if (result.status !== 0) fail('Sestavení selhalo, nic se nenahrává.');
}

async function connect(env) {
  const client = new Client(30_000);
  try {
    // secure: true = explicit FTPS (encrypted). No fallback to plain FTP without consent.
    await client.access({ host: env.FTP_HOST, user: env.FTP_USER, password: env.FTP_PASSWORD, secure: true });
    return client;
  } catch (error) {
    client.close();
    fail(
      'Nepodařilo se navázat šifrované spojení (FTPS).\n' +
        `  Chyba: ${error.message}\n` +
        '  Zkontrolujte FTP_HOST, FTP_USER a FTP_PASSWORD v .env.\n' +
        '  Pokud hosting FTPS nepodporuje nebo nesedí certifikát, skript na nešifrované FTP sám nepřejde.',
    );
  }
}

async function removeStaleFiles(client, localFiles) {
  const local = new Set(localFiles);
  const removed = [];
  for (const dir of OWNED_DIRS) {
    let entries;
    try {
      entries = await client.list(dir);
    } catch {
      continue; // folder does not exist on the server yet
    }
    for (const entry of entries) {
      const relative = `${dir}/${entry.name}`;
      if (entry.isFile && !local.has(relative)) {
        await client.remove(relative);
        removed.push(relative);
      }
    }
  }
  return removed;
}

async function main() {
  dotenv.config({ path: path.join(PROJECT_ROOT, '.env'), quiet: true });
  const env = process.env;
  const remoteDir = env.FTP_REMOTE_DIR;

  // Safety check first: nothing is built, connected, uploaded or deleted before it passes
  const guardError = checkRemoteDir(remoteDir);
  if (guardError) fail(`${guardError}\n  Nic se nenahrálo ani nesmazalo.`);

  if (!dryRun) {
    const missing = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'].filter((key) => !env[key]);
    if (missing.length) fail(`V souboru .env chybí: ${missing.join(', ')}.`);
  }

  if (checkOnly) {
    const client = await connect(env);
    try {
      await client.cd(remoteDir);
      const entries = await client.list();
      console.log(`✔ Šifrované spojení funguje. Obsah složky ${remoteDir}:`);
      for (const entry of entries) console.log(`  ${entry.isDirectory ? '[složka]' : '        '} ${entry.name}`);
      if (entries.length === 0) console.log('  (prázdná složka)');
    } catch (error) {
      fail(`Složku ${remoteDir} se na serveru nepodařilo otevřít: ${error.message}`);
    } finally {
      client.close();
    }
    return;
  }

  build();
  if (!existsSync(DIST_DIR)) fail('Složka dist/ neexistuje.');
  const files = listLocalFiles(DIST_DIR);

  if (dryRun) {
    console.log(`\n▶ Zkouška nasazení (--dry-run): nic se neodesílá.`);
    console.log(`  Server: ${env.FTP_HOST || '(FTP_HOST není vyplněný)'}`);
    console.log(`  Cílová složka: ${remoteDir}`);
    console.log(`  Soubory k nahrání (${files.length}):`);
    for (const file of files) console.log(`    ${file}`);
    console.log(`  Po nahrání by se smazaly staré soubory jen ve složkách: ${OWNED_DIRS.join(', ')} (zjistí se až po připojení).`);
    return;
  }

  const client = await connect(env);
  try {
    try {
      await client.cd(remoteDir);
    } catch (error) {
      fail(`Složka ${remoteDir} na serveru neexistuje nebo do ní nejde vstoupit: ${error.message}`);
    }
    console.log(`▶ Nahrávám ${files.length} souborů do ${remoteDir}…`);
    await client.uploadFromDir(DIST_DIR);
    // uploadFromDir returns to the working directory, stale-file cleanup is relative to remoteDir
    await client.cd(remoteDir);
    const removed = await removeStaleFiles(client, files);
    console.log(`✔ Nahráno. Smazáno starých souborů: ${removed.length}`);
    for (const file of removed) console.log(`    − ${file}`);
    console.log(`\nVýsledek si ověřte na ${PUBLIC_URL}\n`);
  } catch (error) {
    fail(`Nahrávání selhalo: ${error.message}`);
  } finally {
    client.close();
  }
}

main();
