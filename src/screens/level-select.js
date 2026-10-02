import { introSeen, markIntroSeen } from '../engine/intro.js';
import { prepareRound, startRound } from '../engine/session.js';
import { maxPointsForRound, ROUND_SIZE } from '../engine/round.js';
import { levels } from '../sections.js';
import { BROWSER_APP, sectionTexts } from '../texts.js';
import { wholeAddress } from '../ui/html.js';
import { icon } from '../ui/icons.js';
import { pointsWord } from '../ui/format.js';

function levelCard(level, max, description) {
  return `
    <li class="level-card" data-testid="level-${level.id}">
      <div class="level-card__head">
        <span class="icon-bubble">${icon(level.icon)}</span>
        <h2>${level.title}</h2>
      </div>
      <p class="level-card__text">${description}</p>
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

// Number in a circle, drawn in CSS (the character ① is missing in the hosted fonts). Each number
// has its own colour (--intro-1 … --intro-3), the same in the picture and in the text below.
const introNumber = (number) =>
  `<span class="browser-intro__num browser-intro__num--${number}" aria-hidden="true">${number}</span>`;

// Small address bar of the intro picture. Numbered (Tomáš, 1. 10. 2026): a dashed frame in the
// colour of its number, the number sits on the frame: 1 around the whole bar, 2 only around the
// triangle. The plain bar under the text has no warning and no numbers, only the small neutral
// sign (two sliders) browsers show there (Tomáš, 2. 10. 2026); the game itself does not draw it.
const introBar = (address, numbered) =>
  numbered
    ? `
  <div class="browser-intro__bar browser-intro__frame browser-intro__frame--1">
    ${introNumber(1)}
    <span class="browser-intro__icon browser-intro__frame browser-intro__frame--2">${introNumber(2)}${icon('warning')}</span>
    <span class="browser-intro__address">${wholeAddress(address)}</span>
  </div>
`
    : `
  <div class="browser-intro__bar">
    <span class="browser-intro__icon browser-intro__sign" data-testid="browser-intro-sign">${icon('sliders')}</span>
    <span class="browser-intro__address">${wholeAddress(address)}</span>
  </div>
`;

// Browser only: a screen of its own on the first visit (Tomáš, 1. 10. 2026). The button stores
// the record and opens the level select; without a record (or without storage) it shows again.
// The pictures are aria-hidden, the text carries the content.
function renderBrowserIntro(container, section) {
  const { intro } = BROWSER_APP;
  container.innerHTML = `
    <div class="screen level">
      <a class="button button--secondary level__back" href="#/">
        ${icon('arrowLeft')} Zpět na výběr tréninku
      </a>
      <section class="browser-intro" data-testid="browser-intro" aria-labelledby="browser-intro-title">
        <h1 class="section-title browser-intro__title" id="browser-intro-title" tabindex="-1">${intro.title}</h1>
        <div class="browser-intro__shot" data-testid="browser-intro-shot" aria-hidden="true">
          ${introBar(intro.address, true)}
          <div class="browser-intro__page browser-intro__frame browser-intro__frame--3">
            ${introNumber(3)}
            <span class="browser-intro__page-heading">${intro.pageHeading}</span>
            ${intro.pageFields
              .map((field) => `<span class="browser-intro__field">${field}<span class="browser-intro__field-box"></span></span>`)
              .join('')}
          </div>
        </div>
        ${intro.parts
          .map((part, index) => `<p class="browser-intro__part">${introNumber(index + 1)}<span><strong>${part.label}</strong> ${part.text}</span></p>`)
          .join('')}
        <div class="browser-intro__plain">
          <p class="browser-intro__plain-label">${intro.noWarningLabel}</p>
          <div aria-hidden="true">${introBar(intro.address, false)}</div>
        </div>
        <p>${intro.noWarningText}</p>
        <p>${intro.noWarningSign}</p>
        <p>${intro.closing}</p>
        <button type="button" class="button button--primary button--block" data-action="intro-done">
          ${intro.button} ${icon('arrowRight')}
        </button>
      </section>
    </div>
  `;

  container.onclick = (event) => {
    if (!event.target.closest('[data-action="intro-done"]')) return;
    markIntroSeen();
    const { title } = renderLevelSelect(container, section, { introDone: true });
    document.title = title;
    window.scrollTo(0, 0);
    container.querySelector('h1')?.focus({ preventScroll: true });
  };

  return { title: `${intro.title} | Poznej podvod` };
}

export function renderLevelSelect(container, section, { introDone = false } = {}) {
  // Checked before the round is drawn, so a seeded round is the same with or without the intro
  if (section.id === 'prohlizec' && !introDone && !introSeen()) return renderBrowserIntro(container, section);

  // The round is drawn now, so the real maximum can be shown before the start (CLAUDE.md, section 5)
  const round = prepareRound(section.id);
  const { levelDescriptions, levelIntro } = sectionTexts(section.id);

  container.innerHTML = `
    <div class="screen level">
      <a class="button button--secondary level__back" href="#/">
        ${icon('arrowLeft')} Zpět na výběr tréninku
      </a>

      <div class="level__head">
        <span class="icon-bubble">${icon(section.icon)}</span>
        <div>
          <h1 class="section-title" tabindex="-1">${section.title}</h1>
          <p class="level__intro">${levelIntro ?? `Vyberte si úroveň. V obou uvidíte ${ROUND_SIZE} zpráv.`}</p>
        </div>
      </div>

      <ul class="level-list">
        ${levels
          .map((level) => levelCard(level, maxPointsForRound(round, level.id), levelDescriptions[level.id] ?? level.description))
          .join('')}
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
