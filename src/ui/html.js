// Escapes text for safe use inside HTML templates
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// A web address like lipova-banka-overeni.cz: letters, digits and hyphens, at least one dot,
// ending with letters. Not a part of a longer word or an e-mail address.
const ADDRESS = /(?<![\w@.-])[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}(?![\w-])/gi;

// Wraps one address so it wraps only as a whole (never at a hyphen or a dot); an address longer
// than the line may still break anywhere (class .addr, Tomáš 1. 10. 2026). The text stays the same.
export function wholeAddress(escapedAddress) {
  return `<span class="addr">${escapedAddress}</span>`;
}

// Escapes a text and wraps every web address in it with wholeAddress()
export function escapeWithAddresses(value) {
  return escapeHtml(value).replace(ADDRESS, (address) => wholeAddress(address));
}
