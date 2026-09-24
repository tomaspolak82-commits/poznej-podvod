import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/screens.css';
import './styles/game.css';
import './styles/email.css';
import './styles/messages.css';

import { renderLayout } from './ui/layout.js';
import { startRouter } from './router.js';

// Remember whether the player last used a pointer (mouse, finger) or the keyboard.
// After a redraw the app moves focus by script and browsers then show the focus
// ring even after a tap; CSS hides it for pointer input, the keyboard keeps it.
const root = document.documentElement;
document.addEventListener('pointerdown', () => (root.dataset.input = 'pointer'), true);
document.addEventListener('keydown', () => (root.dataset.input = 'keyboard'), true);

const screenRoot = renderLayout(document.querySelector('#app'));
startRouter(screenRoot);
