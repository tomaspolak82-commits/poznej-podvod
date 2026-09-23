// Safety checks for deployment (CLAUDE.md, section 14).
// Kept separate from deploy.mjs so they can be unit-tested without touching the network.

// The app has its own FTP account whose root (/) is the subdomain folder.
// The old full path is still accepted in case the main hosting account is ever used.
export const ALLOWED_ROOT = '/poznej-podvod.menestarosti.cz';

// Names that mean the folder contains WordPress (the main menestarosti.cz site)
export const WORDPRESS_MARKERS = ['wp-config.php', 'wp-admin', 'wp-content', 'wp-includes'];

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
