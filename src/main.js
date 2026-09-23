import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/screens.css';
import './styles/game.css';

import { renderLayout } from './ui/layout.js';
import { startRouter } from './router.js';

const screenRoot = renderLayout(document.querySelector('#app'));
startRouter(screenRoot);
