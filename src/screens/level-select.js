import { levels } from '../sections.js';
import { icon } from '../ui/icons.js';
import { pointsWord } from '../ui/format.js';

const MESSAGES_PER_ROUND = 5;

// TODO(milestone 3): the round is drawn when this screen opens and the maximum
// is computed from the drawn messages. Until then these are sample values.
const SAMPLE_MAX_POINTS = { zakladni: 10, pokrocila: 20 };

function levelCard(section, level) {
  const max = SAMPLE_MAX_POINTS[level.id];
  return `
    <li class="level-card" data-testid="level-${level.id}">
      <div class="level-card__head">
        <span class="icon-bubble">${icon(level.icon)}</span>
        <h2>${level.title}</h2>
      </div>
      <p class="level-card__text">${level.description}</p>
      <p class="level-card__points">
        <span>V tomto kole můžete získat až</span>
        <span class="level-card__points-value" data-testid="max-points-${level.id}">${max}</span>
        <span>${pointsWord(max)}</span>
      </p>
      <a class="button button--primary button--block" href="#/${section.id}/kolo" data-level="${level.id}">
        Začít: ${level.title.toLowerCase()} úroveň ${icon('arrowRight')}
      </a>
    </li>
  `;
}

export function renderLevelSelect(container, section) {
  container.innerHTML = `
    <div class="screen level">
      <a class="button button--secondary level__back" href="#/">
        ${icon('arrowLeft')} Zpět na výběr tréninku
      </a>

      <div class="level__head">
        <span class="icon-bubble">${icon(section.icon)}</span>
        <div>
          <h1 class="section-title" tabindex="-1">${section.title}</h1>
          <p class="level__intro">Vyberte si úroveň. V obou uvidíte ${MESSAGES_PER_ROUND} zpráv.</p>
        </div>
      </div>

      <ul class="level-list">
        ${levels.map((level) => levelCard(section, level)).join('')}
      </ul>

      <p class="note">
        <span class="note__icon">${icon('bulb')}</span>
        <span>
          Během hry můžete kdykoli klepnout na <strong>„Na co si dát pozor?“</strong> a podívat se na nápovědu.
          Na nic se nespěchá, čas se neměří.
        </span>
      </p>
    </div>
  `;

  return { title: `${section.title}: výběr úrovně | Poznej podvod` };
}
