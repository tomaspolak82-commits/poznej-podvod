// Deploys dist/ to Subreg hosting over FTPS (CLAUDE.md, section 14).
//
//   npm run deploy -- --dry-run   build and list what would be uploaded, no connection
//   npm run deploy -- --check     connect, run the safety checks, list the remote folder, change nothing
//   npm run deploy                build, connect, safety checks, upload, remove stale files in assets/ and fonts/

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { Client } from 'basic-ftp';
import { checkForWordPress, checkRemoteDir } from './deploy-guard.mjs';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
// HTTPS works since 24. 9. 2026 (http still works too, the redirect is a separate task)
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

// Main safety check after connecting: enter the target folder, list it and refuse to continue
// if it looks like WordPress. Runs before any upload or delete, and in --check mode.
// remoteDir has passed checkRemoteDir, so it is "/" or under ALLOWED_ROOT and never contains the account name.
async function openTarget(client, remoteDir) {
  try {
    await client.cd(remoteDir);
  } catch (error) {
    client.close();
    fail(`Složka ${remoteDir} na serveru neexistuje nebo do ní nejde vstoupit: ${error.message}`);
  }
  const entries = await client.list();
  // Listed before the check, so the listing stays visible above a WordPress error
  console.log(`  Obsah složky ${remoteDir}:`);
  for (const entry of entries) console.log(`  ${entry.isDirectory ? '[složka]' : '        '} ${entry.name}`);
  if (entries.length === 0) console.log('  (prázdná složka)');
  const wordPressError = checkForWordPress(entries.map((entry) => entry.name));
  if (wordPressError) {
    client.close();
    fail(wordPressError);
  }
  console.log(`✔ Ve složce ${remoteDir} není WordPress.`);
  return entries;
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

  // Path check first: nothing is built, connected, uploaded or deleted before it passes
  const guardError = checkRemoteDir(remoteDir);
  if (guardError) fail(`${guardError}\n  Nic se nenahrálo ani nesmazalo.`);

  if (!dryRun) {
    const missing = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'].filter((key) => !env[key]);
    if (missing.length) fail(`V souboru .env chybí: ${missing.join(', ')}.`);
  }

  if (checkOnly) {
    const client = await connect(env);
    try {
      console.log('✔ Šifrované spojení (FTPS) funguje.');
      await openTarget(client, remoteDir);
      console.log('\nNic se nenahrálo ani nesmazalo.');
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
    console.log('  Kontrola, že v cílové složce není WordPress, proběhne až po připojení.');
    console.log(`  Po nahrání by se smazaly staré soubory jen ve složkách: ${OWNED_DIRS.join(', ')}.`);
    return;
  }

  const client = await connect(env);
  try {
    await openTarget(client, remoteDir);
    console.log(`▶ Nahrávám ${files.length} souborů do ${remoteDir}…`);
    await client.uploadFromDir(DIST_DIR);
    // Stale-file cleanup is relative to the target folder
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
