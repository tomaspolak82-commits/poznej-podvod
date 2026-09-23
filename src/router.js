import { findActiveSection } from './sections.js';
import { renderHome } from './screens/home.js';
import { renderLevelSelect } from './screens/level-select.js';
import { renderRoundPlaceholder } from './screens/round-placeholder.js';

// Hash routes: #/            → home
//              #/<section>   → level select
//              #/<section>/kolo → round
function parseHash(hash) {
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean);
}

function resolve(container) {
  const [sectionId, sub, ...rest] = parseHash(window.location.hash);

  if (!sectionId) return renderHome(container);

  const section = findActiveSection(sectionId);
  if (!section || rest.length > 0) return null;

  if (!sub) return renderLevelSelect(container, section);
  if (sub === 'kolo') return renderRoundPlaceholder(container, section);
  return null;
}

export function startRouter(container) {
  let firstRender = true;

  const render = () => {
    const result = resolve(container);

    // Unknown or inactive route → go home without adding a history entry
    if (!result) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/`);
      renderHome(container);
      document.title = 'Poznej podvod | Méně Starostí';
    } else {
      document.title = result.title;
    }

    if (!firstRender) {
      window.scrollTo(0, 0);
      // Move focus to the new heading so keyboard and screen reader users start at the top
      container.querySelector('h1')?.focus({ preventScroll: true });
    }
    firstRender = false;
  };

  window.addEventListener('hashchange', render);
  render();
}
