// Safety check for the FTP target folder (CLAUDE.md, section 14).
// Kept separate from deploy.mjs so it can be unit-tested without touching the network.

export const ALLOWED_ROOT = '/poznej-podvod.menestarosti.cz';

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
  if (dir !== ALLOWED_ROOT && !dir.startsWith(`${ALLOWED_ROOT}/`)) {
    return `FTP_REMOTE_DIR musí být přesně ${ALLOWED_ROOT} nebo začínat ${ALLOWED_ROOT}/ – teď je "${dir}".`;
  }
  return null;
}
