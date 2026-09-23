import { icon } from '../ui/icons.js';

// Temporary screen until the game engine exists (milestone 3).
export function renderRoundPlaceholder(container, section) {
  container.innerHTML = `
    <div class="screen placeholder">
      <h1 tabindex="-1">Trénink se připravuje</h1>
      <p>Tady brzy začne kolo s pěti zprávami. Zatím stavíme vzhled aplikace.</p>
      <a class="button button--secondary" href="#/${section.id}">
        ${icon('arrowLeft')} Zpět na výběr úrovně
      </a>
    </div>
  `;

  return { title: `${section.title} | Poznej podvod` };
}
