// Round screen: question → evaluation → … → end (CLAUDE.md, section 5).

import { renderMessage } from '../apps/generic.js';
import {
  abandonRound,
  answer,
  currentScenario,
  currentScore,
  getActiveRound,
  isLastMessage,
  lastResult,
  nextMessage,
  prepareRound,
  startRound,
} from '../engine/session.js';
import { levels } from '../sections.js';
import {
  CATEGORY_LABELS,
  CLOSE_AND_CONTINUE,
  EVALUATION,
  LEAVE_ROUND,
  LINK_NOTICE,
  ROUND,
  ROUND_END,
  TRAINING_LABEL,
} from '../texts.js';
import { openDialog } from '../ui/dialog.js';
import { escapeHtml } from '../ui/html.js';
import { icon } from '../ui/icons.js';

function progressDots(round) {
  return round.scenarios
    .map((_, i) => {
      const state = i < round.index || (i === round.index && round.phase !== 'question') ? 'done' : i === round.index ? 'current' : 'todo';
      return `<span class="progress-dots__dot progress-dots__dot--${state}"></span>`;
    })
    .join('');
}

function roundBar(round) {
  const position = round.phase === 'end' ? round.scenarios.length : round.index + 1;
  return `
    <div class="round-bar">
      <button type="button" class="button button--secondary round-bar__back" data-action="leave">
        ${icon('arrowLeft')} ${ROUND.backToLevels}
      </button>
      <div class="round-bar__status">
        <div class="round-bar__progress">
          <span class="progress-dots" aria-hidden="true">${progressDots(round)}</span>
          <span data-testid="progress">${ROUND.progress(position, round.scenarios.length)}</span>
        </div>
        <p class="round-bar__score" data-testid="score">${ROUND.score(currentScore(), round.max)}</p>
      </div>
    </div>
    <p class="training-label" data-testid="training-label">${TRAINING_LABEL}</p>
  `;
}

function questionView(round) {
  const scenario = currentScenario();
  return `
    ${roundBar(round)}
    <h1 class="visually-hidden" tabindex="-1">${ROUND.progress(round.index + 1, round.scenarios.length)}</h1>
    ${renderMessage(scenario, { mode: 'play', level: round.level })}
    <div class="decision">
      <button type="button" class="button button--neutral decision__button" data-decision="scam">${ROUND.decideScam}</button>
      <button type="button" class="button button--neutral decision__button" data-decision="ok">${ROUND.decideOk}</button>
    </div>
  `;
}

function resultTexts(scenario, result) {
  if (scenario.isScam) return result.correct ? EVALUATION.scamCorrect : EVALUATION.scamMissed;
  return result.correct ? EVALUATION.okCorrect : EVALUATION.okWrong;
}

function evaluationView(round) {
  const scenario = currentScenario();
  const result = lastResult();
  const texts = resultTexts(scenario, result);
  const advanced = round.level === 'pokrocila';

  return `
    ${roundBar(round)}
    <section class="evaluation-result evaluation-result--${result.correct ? 'correct' : 'wrong'}" data-testid="evaluation">
      <span class="evaluation-result__icon">${icon(result.correct ? 'decide' : 'alert')}</span>
      <div>
        <h1 class="evaluation-result__title" tabindex="-1">${texts.title}</h1>
        <p>${texts.text}</p>
        <p class="evaluation-result__points" data-testid="gained">${EVALUATION.gained(result.total)}</p>
        ${advanced ? `<p data-testid="breakdown">${EVALUATION.breakdown(result.decisionPoints, result.markingPoints)}</p>` : ''}
      </div>
    </section>
    ${scenario.isScam ? `<p class="evaluation__bulb-intro">${EVALUATION.bulbIntro}</p>` : ''}
    ${renderMessage(scenario, { mode: 'review', level: round.level })}
    <section class="evaluation-summary">
      <h2>${EVALUATION.summaryTitle}</h2>
      <p>${escapeHtml(scenario.summary)}</p>
    </section>
    <button type="button" class="button button--primary button--block" data-action="next">
      ${isLastMessage() ? EVALUATION.showResult : EVALUATION.next} ${icon('arrowRight')}
    </button>
  `;
}

function endView(round) {
  const { score, max, isNewBest, previousBest, missedCategories } = round.end;
  const labels = missedCategories.map((category) => CATEGORY_LABELS[category] ?? category);
  return `
    ${roundBar(round)}
    <section class="round-end" data-testid="round-end">
      <h1 class="section-title" tabindex="-1">${ROUND_END.title}</h1>
      <p class="round-end__score" data-testid="final-score">${ROUND_END.score(score, max)}</p>
      <p data-testid="best">${isNewBest ? ROUND_END.newBest : ROUND_END.previousBest(previousBest.score, previousBest.max)}</p>
      <p data-testid="missed">${labels.length ? ROUND_END.missed(labels) : ROUND_END.nothingMissed}</p>
      <div class="round-end__actions">
        <button type="button" class="button button--primary" data-action="again">${ROUND_END.playAgain} ${icon('arrowRight')}</button>
        <a class="button button--secondary" href="#/">${ROUND_END.home}</a>
      </div>
    </section>
  `;
}

function showThreat(scenario, index) {
  const threat = scenario.threats[index];
  return openDialog({
    title: escapeHtml(threat.title),
    body: `<p>${escapeHtml(threat.explanation)}</p>`,
    actions: [{ label: CLOSE_AND_CONTINUE, value: 'close', primary: true, autofocus: true }],
  });
}

// Returns false when there is no running round for this section (e.g. after a reload)
export function renderRound(container, section) {
  if (!getActiveRound(section)) return false;

  // Always read the current round: "Hrát dalších 5" replaces it with a new one
  const draw = () => {
    const round = getActiveRound(section);
    const view = round.phase === 'question' ? questionView : round.phase === 'evaluation' ? evaluationView : endView;
    container.innerHTML = `<div class="screen round round--${round.phase}" data-level="${round.level}">${view(round)}</div>`;
  };

  // After a phase change: start from the top and move focus to the new heading
  const redraw = () => {
    draw();
    window.scrollTo(0, 0);
    container.querySelector('h1')?.focus({ preventScroll: true });
  };

  container.onclick = async (event) => {
    const target = event.target;
    const round = getActiveRound(section);
    if (!round) return;

    const decision = target.closest('[data-decision]');
    if (decision && round.phase === 'question') {
      answer(decision.dataset.decision);
      redraw();
      return;
    }

    const notice = target.closest('[data-action="notice"]');
    if (notice && round.phase === 'question') {
      await openDialog({
        title: TRAINING_LABEL,
        body: `<p>${LINK_NOTICE}</p>`,
        actions: [{ label: CLOSE_AND_CONTINUE, value: 'close', primary: true, autofocus: true }],
      });
      return;
    }

    const bulb = target.closest('[data-threat]');
    if (bulb) {
      await showThreat(currentScenario(), Number(bulb.dataset.threat));
      return;
    }

    const action = target.closest('[data-action]')?.dataset.action;
    if (action === 'next' && round.phase === 'evaluation') {
      nextMessage();
      redraw();
    } else if (action === 'again' && round.phase === 'end') {
      prepareRound(section);
      startRound(section, round.level);
      redraw();
    } else if (action === 'leave') {
      if (round.phase === 'end') {
        abandonRound();
        window.location.hash = `#/${section}`;
        return;
      }
      const choice = await openDialog({
        title: LEAVE_ROUND.title,
        body: `<p>${LEAVE_ROUND.text}</p>`,
        actions: [
          { label: LEAVE_ROUND.cancel, value: 'stay', primary: true, autofocus: true },
          { label: LEAVE_ROUND.confirm, value: 'leave' },
        ],
      });
      if (choice === 'leave') {
        abandonRound();
        window.location.hash = `#/${section}`;
      }
    }
  };

  draw();
  return true;
}

export function roundTitle(section) {
  const round = getActiveRound(section);
  const level = levels.find((l) => l.id === round?.level);
  return level ? `${level.title} úroveň | Poznej podvod` : 'Poznej podvod';
}
