// Safety checks for deployment (CLAUDE.md, section 14).
// Kept separate from deploy.mjs so they can be unit-tested without touching the network.

// The app has its own FTP account whose root (/) is the subdomain folder.
// The old full path is still accepted in case the main hosting account is ever used.
export const ALLOWED_ROOT = '/poznej-podvod.menestarosti.cz';

// Names that mean the folder contains WordPress (the main menestarosti.cz site)
export const WORDPRESS_MARKERS = ['wp-config.php', 'wp-admin', 'wp-content', 'wp-includes'];

// Folders fully owned by our build: stale files inside them may be deleted
export const OWNED_DIRS = ['assets', 'fonts'];

// What a deploy would do, used by both --dry-run and the real deploy, so the dry run shows
// exactly what the deploy then does.
//   localFiles:  [{ path: 'fonts/x.woff2', size: 123 }, …] from dist/
//   remoteFiles: Map 'fonts/x.woff2' → size, files found on the server (root and OWNED_DIRS)
// Every local file is uploaded (status: 'new' | 'changed' = other size | 'same-size').
// Removed: files directly in OWNED_DIRS that are not in dist/ (nothing else is ever deleted).
export function planDeploy(localFiles, remoteFiles, ownedDirs = OWNED_DIRS) {
  const local = new Set(localFiles.map((file) => file.path));
  const upload = localFiles.map(({ path, size }) => ({
    path,
    status: !remoteFiles.has(path) ? 'new' : remoteFiles.get(path) === size ? 'same-size' : 'changed',
  }));
  const inOwnedDir = (path) =>
    ownedDirs.some((dir) => path.startsWith(`${dir}/`) && !path.slice(dir.length + 1).includes('/'));
  const remove = [...remoteFiles.keys()].filter((path) => inOwnedDir(path) && !local.has(path)).sort();
  return { upload, remove };
}

// basic-ftp methods that change something on the server (checked against basic-ftp's
// Client.d.ts on 28. 9. 2026, incl. the older names upload, append, uploadDir)
export const FTP_WRITE_METHODS = [
  'uploadFrom',
  'upload',
  'appendFrom',
  'append',
  'uploadFromDir',
  'uploadDir',
  'remove',
  'removeDir',
  'removeEmptyDir',
  'clearWorkingDir',
  'ensureDir',
  'rename',
  'send',
  'sendIgnoringError',
];

// Read-only view of an FTP client for --dry-run: reading (cd, list, size…) works, every
// method that could change the server throws before anything is sent.
export function readOnlyClient(client) {
  return new Proxy(client, {
    get(target, property) {
      if (FTP_WRITE_METHODS.includes(property)) {
        return () => {
          throw new Error(`Zkouška nasazení je jen ke čtení: „${String(property)}“ je zakázané.`);
        };
      }
      const value = Reflect.get(target, property, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}

// Returns an error message in Czech, or null when the path is allowed.
export function checkRemoteDir(dir) {
  if (typeof dir !== 'string' || dir.trim() === '') {
    return 'V souboru .env chybí FTP_REMOTE_DIR (cílová složka na serveru).';
  }
  if (dir !== dir.trim()) {
    return `FTP_REMOTE_DIR nesmí začínat ani končit mezerou: "${dir}".`;
  }
  if (dir.includes('..')) {
    return `FTP_REMOTE_DIR nesmí obsahovat „..“: "${dir}".`;
  }
  if (dir.includes('\\')) {
    return `FTP_REMOTE_DIR musí používat lomítko „/“, ne „\\“: "${dir}".`;
  }
  if (dir !== '/' && dir !== ALLOWED_ROOT && !dir.startsWith(`${ALLOWED_ROOT}/`)) {
    return `FTP_REMOTE_DIR musí být „/“ (samostatný FTP účet subdomény), přesně ${ALLOWED_ROOT} nebo začínat ${ALLOWED_ROOT}/ – teď je "${dir}".`;
  }
  return null;
}

// Takes the names found in the target folder. Returns an error message in Czech
// when any of them belongs to WordPress, otherwise null.
export function checkForWordPress(names) {
  const found = names.filter((name) => WORDPRESS_MARKERS.includes(name.toLowerCase()));
  if (found.length === 0) return null;
  return (
    `Cílová složka obsahuje WordPress (${found.join(', ')}). ` +
    'Nejspíš je to hlavní web menestarosti.cz, na který se nesmí sahat. Nic se nenahrálo ani nesmazalo.'
  );
}
