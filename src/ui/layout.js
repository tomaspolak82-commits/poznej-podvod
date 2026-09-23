import { icon } from './icons.js';

const MAIN_SITE_URL = 'https://menestarosti.cz/hry-pro-senior/';
const FACEBOOK_URL = 'https://www.facebook.com/menestarosti';
const PRIVACY_URL = 'https://menestarosti.cz/ochrana-osobnich-udaju/';

// Renders the static page frame and returns the element screens render into.
export function renderLayout(root) {
  const logoUrl = `${import.meta.env.BASE_URL}logo.png`;
  const year = new Date().getFullYear();

  root.innerHTML = `
    <header class="site-header">
      <div class="container site-header__inner">
        <div class="site-header__brand">
          <img class="site-header__logo" src="${logoUrl}" alt="Méně Starostí" width="72" height="72" />
          <div>
            <p class="site-header__title">Poznej podvod</p>
            <p class="site-header__subtitle">Trénink pro seniory: jak poznat podvod v telefonu a na internetu</p>
          </div>
        </div>
        <a class="site-header__back" href="${MAIN_SITE_URL}">
          ${icon('arrowLeft')}
          <span>Zpět na Méně Starostí</span>
        </a>
      </div>
    </header>

    <main class="site-main" id="main">
      <div class="container" data-screen-root></div>
    </main>

    <footer class="site-footer">
      <div class="container site-footer__inner">
        <p class="site-footer__copy">© ${year} Méně Starostí</p>
        <ul class="site-footer__links">
          <li><a class="site-footer__link" href="${FACEBOOK_URL}">Facebook</a></li>
          <li><a class="site-footer__link" href="${PRIVACY_URL}">Zásady ochrany osobních údajů</a></li>
        </ul>
      </div>
    </footer>
  `;

  return root.querySelector('[data-screen-root]');
}
