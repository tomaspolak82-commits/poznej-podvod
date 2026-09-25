import { test, expect } from '@playwright/test';
import { maxPointsForScenario } from '../../src/engine/round.js';
import { scoreMessage } from '../../src/engine/scoring.js';
import { listTargets } from '../../src/engine/validate.js';
import { scenarioById } from '../helpers/game.js';

// Scam with 3 threats (like the example in CLAUDE.md, section 7)
const scam = {
  id: 'email-99',
  isScam: true,
  threats: [
    { target: 'fromAddress', category: 'odesilatel' },
    { target: 'body.1', category: 'casovy-tlak' },
    { target: 'button', category: 'odkaz-platba' },
  ],
};
const legit = { id: 'email-98', isScam: false, threats: [] };

test.describe('scoring: basic level (CLAUDE.md, section 8)', () => {
  test('correct decision on a scam = 2 points', () => {
    const result = scoreMessage(scam, 'zakladni', 'scam');
    expect(result).toMatchObject({ correct: true, decisionPoints: 2, markingPoints: 0, total: 2 });
  });

  test('wrong decision on a scam = 0 points', () => {
    expect(scoreMessage(scam, 'zakladni', 'ok').total).toBe(0);
  });

  test('correct decision on a legitimate message = 2 points', () => {
    expect(scoreMessage(legit, 'zakladni', 'ok').total).toBe(2);
  });

  test('wrong decision on a legitimate message = 0 points', () => {
    expect(scoreMessage(legit, 'zakladni', 'scam').total).toBe(0);
  });

  test('marks are ignored at basic level', () => {
    expect(scoreMessage(scam, 'zakladni', 'scam', ['fromAddress', 'subject']).total).toBe(2);
  });

  test('statistics: scam judged "ok" counts all its threats as missed', () => {
    expect(scoreMessage(scam, 'zakladni', 'ok').missedCategories).toEqual([
      'odesilatel',
      'casovy-tlak',
      'odkaz-platba',
    ]);
  });

  test('statistics: correctly recognised scam counts nothing', () => {
    expect(scoreMessage(scam, 'zakladni', 'scam').missedCategories).toEqual([]);
  });

  test('statistics: legitimate message judged as scam counts nothing', () => {
    expect(scoreMessage(legit, 'zakladni', 'scam').missedCategories).toEqual([]);
  });
});

test.describe('scoring: advanced level, scam', () => {
  test('all threats marked, correct decision = 2 + 3', () => {
    const result = scoreMessage(scam, 'pokrocila', 'scam', ['fromAddress', 'body.1', 'button']);
    expect(result).toMatchObject({ decisionPoints: 2, markingPoints: 3, total: 5 });
    expect(result.missed).toEqual([]);
    expect(result.extra).toEqual([]);
  });

  test('one threat missed = 2 + 2, missed threat is reported', () => {
    const result = scoreMessage(scam, 'pokrocila', 'scam', ['fromAddress', 'button']);
    expect(result.total).toBe(4);
    expect(result.missed.map((t) => t.target)).toEqual(['body.1']);
    expect(result.missedCategories).toEqual(['casovy-tlak']);
  });

  test('unnecessary mark = −1 from marking points', () => {
    const result = scoreMessage(scam, 'pokrocila', 'scam', ['fromAddress', 'body.1', 'subject']);
    expect(result).toMatchObject({ markingPoints: 1, total: 3 });
    expect(result.extra).toEqual(['subject']);
  });

  test('example from CLAUDE.md: 1 found, 3 unnecessary → 2 + max(0, 1 − 3) = 2', () => {
    const result = scoreMessage(scam, 'pokrocila', 'scam', ['button', 'subject', 'body.0', 'fromName']);
    expect(result).toMatchObject({ decisionPoints: 2, markingPoints: 0, total: 2 });
  });

  test('wrong decision still gets points for correctly marked threats', () => {
    const result = scoreMessage(scam, 'pokrocila', 'ok', ['fromAddress', 'button']);
    expect(result).toMatchObject({ correct: false, decisionPoints: 0, markingPoints: 2, total: 2 });
  });

  test('more unnecessary than found marks: decision points stay, marking = 0', () => {
    const result = scoreMessage(scam, 'pokrocila', 'scam', ['button', 'subject', 'fromName']);
    expect(result).toMatchObject({ decisionPoints: 2, markingPoints: 0, total: 2 });
  });

  test('nothing marked, wrong decision = 0, all threats missed', () => {
    const result = scoreMessage(scam, 'pokrocila', 'ok', []);
    expect(result.total).toBe(0);
    expect(result.missedCategories).toHaveLength(3);
  });

  test('statistics count missed threats even after a correct decision', () => {
    expect(scoreMessage(scam, 'pokrocila', 'scam', ['button']).missedCategories).toEqual([
      'odesilatel',
      'casovy-tlak',
    ]);
  });

  test('marking the same target twice counts once (unmark then mark again)', () => {
    expect(scoreMessage(scam, 'pokrocila', 'scam', ['button', 'button']).markingPoints).toBe(1);
  });
});

test.describe('scoring: advanced level, legitimate message', () => {
  test('nothing marked, correct decision = 2 + 2', () => {
    expect(scoreMessage(legit, 'pokrocila', 'ok', [])).toMatchObject({ markingPoints: 2, total: 4 });
  });

  test('anything marked = 0 marking points, never negative', () => {
    const result = scoreMessage(legit, 'pokrocila', 'ok', ['subject', 'body.0', 'fromAddress']);
    expect(result).toMatchObject({ markingPoints: 0, total: 2 });
    expect(result.extra).toEqual(['subject', 'body.0', 'fromAddress']);
  });

  test('nothing marked but wrong decision = 0 + 2', () => {
    expect(scoreMessage(legit, 'pokrocila', 'scam', []).total).toBe(2);
  });

  test('statistics: legitimate message never adds missed categories', () => {
    expect(scoreMessage(legit, 'pokrocila', 'scam', ['subject']).missedCategories).toEqual([]);
  });
});

test.describe('scoring: one threat on two parts (alsoTargets, CLAUDE.md section 7)', () => {
  // Like email-02: the sender threat lies on the address and the name
  const sender = {
    id: 'email-97',
    isScam: true,
    threats: [
      { target: 'fromAddress', alsoTargets: ['fromName'], category: 'odesilatel' },
      { target: 'link', category: 'odkaz-platba' },
    ],
  };

  for (const marks of [['fromAddress'], ['fromName'], ['fromAddress', 'fromName']]) {
    test(`marking ${marks.join(' + ')} = one hit, nothing unnecessary`, () => {
      const result = scoreMessage(sender, 'pokrocila', 'scam', marks);
      expect(result).toMatchObject({ markingPoints: 1, total: 3 });
      expect(result.found.map((t) => t.target)).toEqual(['fromAddress']);
      expect(result.extra).toEqual([]);
      expect(result.missedCategories).toEqual(['odkaz-platba']);
    });
  }

  test('both parts + the link = 2 (no double points), maximum stays 1 per threat', () => {
    expect(scoreMessage(sender, 'pokrocila', 'scam', ['fromAddress', 'fromName', 'link']).markingPoints).toBe(2);
    expect(maxPointsForScenario(sender, 'pokrocila')).toBe(4);
  });

  test('nothing of the sender marked = missed once', () => {
    const result = scoreMessage(sender, 'pokrocila', 'scam', ['link']);
    expect(result.missed.map((t) => t.target)).toEqual(['fromAddress']);
    expect(result.missedCategories).toEqual(['odesilatel']);
  });
});

// A player who follows the hint must not lose a point (CLAUDE.md, section 7): every part
// the hint leads to lies on a threat. Checked on the real scenario files (milestone 5).
test.describe('scoring: real scenarios, parts the hint leads to are hits', () => {
  const cases = [
    ['email-01', ['fromName'], 'sender name "Balíkovna" = the sender threat'],
    ['email-01', ['subject'], 'subject "Vrácení peněz" = unexpected money'],
    ['email-01', ['body.2'], 'call to click = the link threat'],
    ['email-02', ['subject'], 'subject "Poslední upozornění" = time pressure'],
    ['email-02', ['body.1'], 'missing bank details = request for data'],
    ['email-02', ['body.4'], 'signature "Finanční správa" = the fake sender name'],
    ['email-04', ['subject'], 'subject "Upomínka" = the invoice you know nothing about'],
    ['email-04', ['body.0'], 'general greeting = the invoice you know nothing about'],
    ['email-04', ['body.2'], '"details in the attachment" = the attachment threat'],
    ['email-04', ['attachment'], 'unexpected attachment'],
    ['email-05', ['fromName'], 'sender name "ČEZ Prodej" = the sender threat'],
    ['email-05', ['body.4'], 'signature "ČEZ Prodej" = the sender threat'],
    ['email-05', ['subject'], 'subject "Vrácení přeplatku" = card details for money back'],
    ['email-05', ['body.1'], 'money back = card details for money back'],
    ['email-05', ['body.2'], 'card number and code'],
    ['email-05', ['button'], 'button to enter the card'],
    ['email-06', ['fromName'], 'your own name as the sender = the sender threat'],
    ['email-06', ['subject'], 'subject "Poslední varování" = the fear threat'],
    ['email-06', ['body.0'], '"I recorded you" = the fear threat'],
    ['zpravy-02', ['messages.0'], '"new number" bubble = the unknown number'],
    ['zpravy-04', ['messages.2'], 'plea for help = emotional pressure'],
    ['zpravy-04', ['messages.3'], 'call to click = the link threat'],
    ['zpravy-04', ['messages.4'], 'code from SMS'],
  ];
  for (const [id, marks, why] of cases) {
    test(`${id}: ${why}`, () => {
      const result = scoreMessage(scenarioById(id), 'pokrocila', 'scam', marks);
      expect(result.extra).toEqual([]);
      expect(result.markingPoints).toBe(1);
    });
  }

});

// Every scam has at least one innocent part, so marking everything never gets full points
// (CLAUDE.md, section 7, variant A). Exception: an SMS with one bubble and a link.
test.describe('scoring: marking everything does not pay off (real scenarios)', () => {
  const markAll = (scenario) =>
    scoreMessage(scenario, 'pokrocila', 'scam', listTargets(scenario.section, scenario.message));

  for (const [id, innocent] of [
    ['email-01', ['body.3']],
    ['email-02', ['body.0']],
    ['email-04', ['fromName', 'fromAddress', 'body.4', 'body.5']],
    ['email-05', ['body.0']],
    ['email-06', ['body.1']],
    ['zpravy-02', ['messages.1']],
    // Older bubbles of the usual conversation; the sender cannot be marked (fromMarkable: false)
    ['zpravy-04', ['messages.0', 'messages.1']],
  ]) {
    test(`${id}: marking everything leaves the innocent part as unnecessary`, () => {
      const result = markAll(scenarioById(id));
      expect(result.extra).toEqual(innocent);
      expect(result.missed).toEqual([]);
    });
  }

  for (const id of ['zpravy-01', 'zpravy-05']) {
    test(`${id} is the exception: an SMS with one bubble and a link, every part is a threat`, () => {
      const scenario = scenarioById(id);
      expect(scenario.message.messages).toHaveLength(1);
      expect(markAll(scenario).extra).toEqual([]);
    });
  }
});

test('points are always whole numbers', () => {
  for (const marks of [[], ['button'], ['button', 'subject'], ['fromAddress', 'body.1', 'button', 'subject']]) {
    for (const decision of ['scam', 'ok']) {
      expect(Number.isInteger(scoreMessage(scam, 'pokrocila', decision, marks).total)).toBe(true);
    }
  }
});
