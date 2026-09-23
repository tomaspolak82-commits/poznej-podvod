import { prepareRound, startRound } from '../engine/session.js';
import { maxPointsForRound, ROUND_SIZE } from '../engine/round.js';
import { levels } from '../sections.js';
import { icon } from '../ui/icons.js';
import { pointsWord } from '../ui/format.js';

function levelCard(level, max) {
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
      <button type="button" class="button button--primary button--block" data-level="${level.id}">
        Začít: ${level.title.toLowerCase()} úroveň ${icon('arrowRight')}
      </button>
    </li>
  `;
}

export function renderLevelSelect(container, section) {
  // The round is drawn now, so the real maximum can be shown before the start (CLAUDE.md, section 5)
  const round = prepareRound(section.id);

  container.innerHTML = `
    <div class="screen level">
      <a class="button button--secondary level__back" href="#/">
        ${icon('arrowLeft')} Zpět na výběr tréninku
      </a>

      <div class="level__head">
        <span class="icon-bubble">${icon(section.icon)}</span>
        <div>
          <h1 class="section-title" tabindex="-1">${section.title}</h1>
          <p class="level__intro">Vyberte si úroveň. V obou uvidíte ${ROUND_SIZE} zpráv.</p>
        </div>
      </div>

      <ul class="level-list">
        ${levels.map((level) => levelCard(level, maxPointsForRound(round, level.id))).join('')}
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

  container.onclick = (event) => {
    const button = event.target.closest('[data-level]');
    if (!button) return;
    startRound(section.id, button.dataset.level);
    window.location.hash = `#/${section.id}/kolo`;
  };

  return { title: `${section.title}: výběr úrovně | Poznej podvod` };
}
