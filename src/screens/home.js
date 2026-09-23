import { bestKey, hasHistory, topMissedCategories } from '../engine/history.js';
import { deleteHistory, getHistory } from '../engine/session.js';
import { levels, sections } from '../sections.js';
import { CATEGORY_LABELS, DELETE_HISTORY, WELCOME } from '../texts.js';
import { openDialog } from '../ui/dialog.js';
import { icon } from '../ui/icons.js';

function activeTile(section) {
  return `
    <li>
      <a class="tile" href="#/${section.id}" data-testid="tile-${section.id}">
        <span class="tile__head">
          <span class="icon-bubble">${icon(section.icon)}</span>
          <h3 class="tile__title">${section.title}</h3>
        </span>
        <span class="tile__text">${section.description}</span>
        <span class="tile__cta">Začít trénink ${icon('arrowRight')}</span>
      </a>
    </li>
  `;
}

function soonTile(section) {
  return `
    <li>
      <div class="tile tile--soon" data-testid="tile-${section.id}">
        <span class="tile__head">
          <span class="icon-bubble icon-bubble--muted">${icon(section.icon)}</span>
          <h3 class="tile__title">${section.title}</h3>
        </span>
        <span class="badge tile__badge">Připravujeme</span>
        <span class="tile__text">${section.description}</span>
      </div>
    </li>
  `;
}

function welcomePanel(history) {
  if (!hasHistory(history)) return '';

  const bestLines = sections
    .filter((section) => section.active)
    .flatMap((section) =>
      levels
        .map((level) => ({ section, level, best: history.best[bestKey(section.id, level.id)] }))
        .filter(({ best }) => best),
    )
    .map(({ section, level, best }) => `<li>${WELCOME.best(section.shortTitle, level.title, best.score, best.max)}</li>`);

  const missed = topMissedCategories(history).map((category) => CATEGORY_LABELS[category] ?? category);

  return `
    <section class="welcome" aria-labelledby="welcome-title" data-testid="welcome">
      <h2 id="welcome-title" class="section-title">${WELCOME.title}</h2>
      <p>${WELCOME.intro}</p>
      ${
        bestLines.length
          ? `<p class="welcome__label">${WELCOME.bestTitle}</p><ul class="welcome__list">${bestLines.join('')}</ul>`
          : ''
      }
      ${missed.length ? `<p data-testid="welcome-missed">${WELCOME.missed(missed)}</p>` : ''}
      <p data-testid="welcome-rounds">${WELCOME.rounds(history.roundsPlayed)}</p>
    </section>
  `;
}

export function renderHome(container, { deletedMessage = '' } = {}) {
  const history = getHistory();
  const active = sections.filter((section) => section.active);
  const soon = sections.filter((section) => !section.active);

  container.innerHTML = `
    <div class="screen home">
      <div class="home__intro">
        <h1 class="section-title" tabindex="-1">Vyberte, co chcete trénovat</h1>
        <p class="home__lead">
          Ukážeme vám zprávy, jaké dnes chodí do telefonu a do e-mailu. Vy posoudíte, jestli jde o podvod.
          Nic se neodesílá a nic nemůžete pokazit.
        </p>
      </div>

      ${welcomePanel(history)}

      <section class="home__section" aria-labelledby="home-sections">
        <h2 id="home-sections" class="visually-hidden">Oblasti tréninku</h2>
        <ul class="tiles">${active.map(activeTile).join('')}</ul>
      </section>

      <section class="home__section" aria-labelledby="home-soon">
        <h2 id="home-soon" class="section-title">Brzy přibude</h2>
        <ul class="tiles tiles--soon">${soon.map(soonTile).join('')}</ul>
      </section>

      <section class="home__section" aria-labelledby="home-how">
        <h2 id="home-how" class="section-title">Jak trénink probíhá</h2>
        <ol class="steps">
          <li class="steps__item">
            <p><span class="steps__title">Přečtete si zprávu</span>Vypadá podobně jako ve vašem telefonu.</p>
          </li>
          <li class="steps__item">
            <p><span class="steps__title">Rozhodnete</span>Je to podvod, nebo je zpráva v pořádku?</p>
          </li>
          <li class="steps__item">
            <p><span class="steps__title">Dozvíte se proč</span>Ukážeme vám, podle čeho se to dá poznat.</p>
          </li>
        </ol>
      </section>

      <div class="home__history-actions">
        ${
          hasHistory(history)
            ? `<button type="button" class="text-button" data-action="delete-history">${icon('trash')}${DELETE_HISTORY.link}</button>`
            : ''
        }
        ${deletedMessage ? `<p class="home__status" role="status" data-testid="history-status">${deletedMessage}</p>` : ''}
      </div>
    </div>
  `;

  container.onclick = async (event) => {
    if (!event.target.closest('[data-action="delete-history"]')) return;
    const choice = await openDialog({
      title: DELETE_HISTORY.title,
      body: `<p>${DELETE_HISTORY.text}</p>`,
      actions: [
        { label: DELETE_HISTORY.cancel, value: 'keep', primary: true, autofocus: true },
        { label: DELETE_HISTORY.confirm, value: 'delete' },
      ],
    });
    if (choice !== 'delete') return;
    deleteHistory();
    renderHome(container, { deletedMessage: DELETE_HISTORY.done });
    // The link is gone; keep keyboard focus on the confirmation message
    container.querySelector('[data-testid="history-status"]')?.setAttribute('tabindex', '-1');
    container.querySelector('[data-testid="history-status"]')?.focus();
  };

  return { title: 'Poznej podvod | Méně Starostí', isHome: true };
}
