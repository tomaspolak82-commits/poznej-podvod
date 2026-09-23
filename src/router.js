import { abandonRound } from './engine/session.js';
import { findActiveSection } from './sections.js';
import { renderHome } from './screens/home.js';
import { renderLevelSelect } from './screens/level-select.js';
import { renderRound, roundTitle } from './screens/round.js';
import { setMainSiteButtonVisible } from './ui/layout.js';

// Hash routes: #/                 → home
//              #/<section>        → level select (draws a new round)
//              #/<section>/kolo   → round (only while a round is running)
function parseHash(hash) {
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean);
}

function replaceHash(hash) {
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
}

function resolve(container) {
  const [sectionId, sub, ...rest] = parseHash(window.location.hash);

  if (!sectionId) {
    abandonRound();
    return renderHome(container);
  }

  const section = findActiveSection(sectionId);
  if (!section || rest.length > 0 || (sub && sub !== 'kolo')) return null;

  if (sub === 'kolo') {
    if (renderRound(container, section.id)) return { title: roundTitle(section.id), inRound: true };
    // No running round (page reload, typed address) → back to level select, nothing is saved
    replaceHash(`#/${section.id}`);
  } else {
    // Leaving a round by any route (incl. the browser back button) drops it
    abandonRound();
  }
  return renderLevelSelect(container, section);
}

export function startRouter(container) {
  let firstRender = true;

  const render = () => {
    container.onclick = null;
    let result = resolve(container);

    // Unknown or inactive route → go home without adding a history entry
    if (!result) {
      replaceHash('#/');
      abandonRound();
      result = renderHome(container);
    }
    document.title = result.title;
    setMainSiteButtonVisible(result.isHome === true);
    document.body.classList.toggle('is-in-round', result.inRound === true);

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
