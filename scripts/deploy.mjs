// Deploys dist/ to Subreg hosting over FTPS (CLAUDE.md, section 14).
//
//   npm run deploy -- --dry-run   build, connect read-only, compare with the server and list
//                                 what would be uploaded and deleted; changes nothing
//   npm run deploy -- --check     connect, run the safety checks, list the remote folder, change nothing
//   npm run deploy                build, connect, safety checks, upload, remove stale files in assets/ and fonts/

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { Client } from 'basic-ftp';
import { OWNED_DIRS, checkForWordPress, checkRemoteDir, planDeploy, readOnlyClient } from './deploy-guard.mjs';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
// HTTPS works since 24. 9. 2026 (http still works too, the redirect is a separate task)
const PUBLIC_URL = 'https://poznej-podvod.menestarosti.cz/';
const UPLOAD_STATUS = { new: 'nový          ', changed: 'jiná velikost ', 'same-size': 'stejná velikost' };

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

// Files of dist/ with their sizes, paths with "/"
function localFilesWithSize(files) {
  return files.map((file) => ({ path: file, size: statSync(path.join(DIST_DIR, file)).size }));
}

// Files on the server that a deploy may touch: the target folder itself and OWNED_DIRS
// (only reading: list). Paths relative to the target folder, the client must be inside it.
async function listRemoteFiles(client, rootEntries) {
  const remote = new Map();
  for (const entry of rootEntries) if (entry.isFile) remote.set(entry.name, entry.size);
  for (const dir of OWNED_DIRS) {
    let entries;
    try {
      entries = await client.list(dir);
    } catch {
      continue; // folder does not exist on the server yet
    }
    for (const entry of entries) if (entry.isFile) remote.set(`${dir}/${entry.name}`, entry.size);
  }
  return remote;
}

function printPlan({ upload, remove }) {
  console.log(`  Nahrálo by se (${upload.length}, nahrávají se vždy všechny soubory z dist/):`);
  for (const { path: file, status } of upload) console.log(`    ${UPLOAD_STATUS[status]}  ${file}`);
  console.log(`  Smazalo by se (${remove.length}, jen ve složkách ${OWNED_DIRS.join(', ')}):`);
  for (const file of remove) console.log(`    − ${file}`);
  if (remove.length === 0) console.log('    (nic)');
}

async function main() {
  dotenv.config({ path: path.join(PROJECT_ROOT, '.env'), quiet: true });
  const env = process.env;
  const remoteDir = env.FTP_REMOTE_DIR;

  // Path check first: nothing is built, connected, uploaded or deleted before it passes
  const guardError = checkRemoteDir(remoteDir);
  if (guardError) fail(`${guardError}\n  Nic se nenahrálo ani nesmazalo.`);

  // The dry run connects too (read-only), so it needs the same credentials
  const missing = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'].filter((key) => !env[key]);
  if (missing.length) fail(`V souboru .env chybí: ${missing.join(', ')}.`);

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

  const localFiles = localFilesWithSize(files);

  if (dryRun) {
    console.log(`\n▶ Zkouška nasazení (--dry-run): připojení jen ke čtení, na serveru se nic nemění.`);
    console.log(`  Server: ${env.FTP_HOST}`);
    // Every write method of this client throws before anything is sent (readOnlyClient)
    const client = readOnlyClient(await connect(env));
    try {
      const rootEntries = await openTarget(client, remoteDir);
      printPlan(planDeploy(localFiles, await listRemoteFiles(client, rootEntries)));
      console.log('\nZkouška: nic se nenahrálo ani nesmazalo.');
    } catch (error) {
      fail(`Zkouška nasazení selhala: ${error.message}`);
    } finally {
      client.close();
    }
    return;
  }

  const client = await connect(env);
  try {
    const rootEntries = await openTarget(client, remoteDir);
    // Same plan as the dry run, computed before the upload
    const plan = planDeploy(localFiles, await listRemoteFiles(client, rootEntries));
    console.log(`▶ Nahrávám ${files.length} souborů do ${remoteDir}…`);
    await client.uploadFromDir(DIST_DIR);
    // Stale-file cleanup is relative to the target folder
    await client.cd(remoteDir);
    for (const file of plan.remove) await client.remove(file);
    console.log(`✔ Nahráno. Smazáno starých souborů: ${plan.remove.length}`);
    for (const file of plan.remove) console.log(`    − ${file}`);
    console.log(`\nVýsledek si ověřte na ${PUBLIC_URL}\n`);
  } catch (error) {
    fail(`Nahrávání selhalo: ${error.message}`);
  } finally {
    client.close();
  }
}

main();
