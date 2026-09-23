import { sections } from '../sections.js';
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

export function renderHome(container) {
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
    </div>
  `;

  return { title: 'Poznej podvod | Méně Starostí', isHome: true };
}
