// Custom inline SVG icons (24×24 grid, stroke style, colour from currentColor).
// Decorative only: always aria-hidden, the meaning is carried by visible text.

const paths = {
  email: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  messages:
    '<path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.3-4.6A7.5 7.5 0 1 1 20 11.5Z"/>' +
    '<path d="M8.5 11.5h.01M12.5 11.5h.01M16.5 11.5h.01" stroke-width="2.6"/>',
  browser:
    '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18"/>' +
    '<path d="M6.5 6.5h.01M9.5 6.5h.01" stroke-width="2.4"/>',
  qr:
    '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/>' +
    '<rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2.5v2.5M20 14v.01M14 20h.01M17 20h3v-3"/>',
  phone:
    '<path d="M6.5 3.5h2.8l1.5 4-2 1.6a11.5 11.5 0 0 0 6.1 6.1l1.6-2 4 1.5v2.8a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z"/>',
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  bulb:
    '<path d="M9.5 18h5M10.5 21h3"/>' +
    '<path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.1v.1h5v-.1c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3Z"/>',
  decide: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6.5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/>',
};

export function icon(name) {
  const body = paths[name];
  if (!body) throw new Error(`Unknown icon: ${name}`);
  return (
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    body +
    '</svg>'
  );
}
