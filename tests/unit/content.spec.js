import { test, expect } from '@playwright/test';
import path from 'node:path';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { CONTENT_SECTIONS, readSection, validateContent } from '../../scripts/content-files.mjs';
import { checkSectionGoals, listTargets, validateScenario } from '../../src/engine/validate.js';

const CONTENT_DIR = path.resolve('src/content');
// Switch on in milestone 6, when the full bank of scenarios exists (CLAUDE.md, section 7)
const ENFORCE_CONTENT_GOALS = false;

const validEmail = () => ({
  id: 'email-50',
  section: 'email',
  title: 'Test',
  isScam: true,
  message: {
    fromName: 'Odesílatel',
    fromAddress: 'a@test.invalid',
    date: 'dnes 8:00',
    subject: 'Předmět',
    body: ['Odstavec 1', 'Odstavec 2'],
    button: { label: 'Zaplatit' },
  },
  threats: [{ target: 'button', category: 'odkaz-platba', title: 'T', explanation: 'E' }],
  summary: 'Shrnutí',
  sources: [],
});

const validChat = () => ({
  id: 'zpravy-50',
  section: 'zpravy',
  title: 'Test',
  isScam: true,
  message: {
    app: 'sms',
    from: '+420 000 000 000',
    inContacts: false,
    messages: [{ text: 'Bublina', link: 'https://x.test.invalid' }],
  },
  threats: [{ target: 'messages.0.link', category: 'odkaz-platba', title: 'T', explanation: 'E' }],
  summary: 'Shrnutí',
  sources: [],
});

test.describe('content: real scenario files', () => {
  test('every scenario in src/content is valid and every section can draw a round', () => {
    expect(validateContent(CONTENT_DIR)).toEqual([]);
  });

  test('scenario IDs are unique across all sections', () => {
    const all = CONTENT_SECTIONS.flatMap((section) => readSection(CONTENT_DIR, section).map((f) => f.data.id));
    expect(new Set(all).size).toBe(all.length);
  });

  test('content goal: at least 20 scenarios and 5 legitimate per section (milestone 6)', () => {
    test.skip(!ENFORCE_CONTENT_GOALS, 'Zapne se v milníku 6, teď jsou jen testovací zprávy.');
    for (const section of CONTENT_SECTIONS) {
      const scenarios = readSection(CONTENT_DIR, section).map((f) => f.data);
      expect(checkSectionGoals(scenarios, section)).toEqual([]);
    }
  });
});

test.describe('content: validation rules', () => {
  test('valid e-mail and SMS scenarios pass', () => {
    expect(validateScenario(validEmail(), { fileId: 'email-50', section: 'email' })).toEqual([]);
    expect(validateScenario(validChat(), { fileId: 'zpravy-50', section: 'zpravy' })).toEqual([]);
  });

  test('targets of an e-mail include optional parts only when present', () => {
    expect(listTargets('email', validEmail().message)).toEqual([
      'fromName',
      'fromAddress',
      'subject',
      'body.0',
      'body.1',
      'button',
    ]);
  });

  test('targets of an SMS include the link inside a bubble', () => {
    expect(listTargets('zpravy', validChat().message)).toEqual(['from', 'messages.0', 'messages.0.link']);
  });

  const broken = [
    ['missing summary', (s) => delete s.summary, /summary/],
    ['id different from file name', (s) => (s.id = 'email-51'), /neodpovídá názvu souboru/],
    ['wrong section folder', (s) => (s.section = 'zpravy'), /section|message/],
    ['isScam is not boolean', (s) => (s.isScam = 'ano'), /isScam/],
    ['target that does not exist', (s) => (s.threats[0].target = 'body.7'), /neodpovídá žádné části/],
    ['link target without a link', (s) => (s.threats[0].target = 'link'), /neodpovídá žádné části/],
    ['category not allowed', (s) => (s.threats[0].category = 'strach'), /není povolená/],
    ['relatedArticle field', (s) => (s.relatedArticle = 'x'), /relatedArticle/],
    ['relatedArticle hidden deeper', (s) => (s.message.relatedArticle = 'x'), /relatedArticle/],
    ['scam without threats', (s) => (s.threats = []), /1 až 4 hrozby/],
    [
      'scam with 5 threats',
      (s) =>
        (s.threats = ['fromName', 'fromAddress', 'subject', 'body.0', 'body.1'].map((target) => ({
          target,
          category: 'odesilatel',
          title: 'T',
          explanation: 'E',
        }))),
      /1 až 4 hrozby/,
    ],
    ['legitimate message with a threat', (s) => (s.isScam = false), /nesmí mít hrozby/],
    ['same target twice', (s) => s.threats.push({ ...s.threats[0] }), /dvakrát/],
    ['empty body', (s) => (s.message.body = []), /body/],
    ['missing sender address', (s) => delete s.message.fromAddress, /fromAddress/],
    ['button without label', (s) => (s.message.button = {}), /button/],
    ['alsoTargets that does not exist', (s) => (s.threats[0].alsoTargets = ['link']), /alsoTargets\.0 "link" neodpovídá/],
    ['alsoTargets not an array', (s) => (s.threats[0].alsoTargets = 'fromName'), /alsoTargets musí být/],
    ['alsoTargets empty', (s) => (s.threats[0].alsoTargets = []), /alsoTargets musí být/],
    [
      'alsoTargets repeats a target of another threat',
      (s) => {
        s.threats[0].alsoTargets = ['subject'];
        s.threats.push({ target: 'subject', category: 'odesilatel', title: 'T', explanation: 'E' });
      },
      /"subject" je ve hrozbách dvakrát/,
    ],
  ];

  test('e-mail: one threat on two parts (alsoTargets) is valid', () => {
    const scenario = validEmail();
    scenario.threats = [
      { target: 'fromAddress', alsoTargets: ['fromName'], category: 'odesilatel', title: 'T', explanation: 'E' },
    ];
    expect(validateScenario(scenario, { fileId: 'email-50', section: 'email' })).toEqual([]);
  });
  for (const [name, breakIt, expected] of broken) {
    test(`e-mail: ${name} is reported`, () => {
      const scenario = validEmail();
      breakIt(scenario);
      const errors = validateScenario(scenario, { fileId: 'email-50', section: 'email' });
      expect(errors.join('\n')).toMatch(expected);
    });
  }

  test('SMS: app other than sms/chat is reported', () => {
    const scenario = validChat();
    scenario.message.app = 'whatsapp';
    expect(validateScenario(scenario, { fileId: 'zpravy-50', section: 'zpravy' }).join('\n')).toMatch(/app/);
  });

  test('SMS: optional date is valid when filled, empty date is reported', () => {
    const scenario = validChat();
    scenario.message.date = 'dnes 10:24';
    expect(validateScenario(scenario, { fileId: 'zpravy-50', section: 'zpravy' })).toEqual([]);
    scenario.message.date = ' ';
    expect(validateScenario(scenario, { fileId: 'zpravy-50', section: 'zpravy' }).join('\n')).toMatch(/message\.date/);
  });

  test('SMS: inContacts must be true or false', () => {
    const scenario = validChat();
    delete scenario.message.inContacts;
    expect(validateScenario(scenario, { fileId: 'zpravy-50', section: 'zpravy' }).join('\n')).toMatch(/inContacts/);
  });

  test('not an object at all is reported, not a crash', () => {
    expect(validateScenario(null)).toEqual(['scénář není objekt']);
    expect(validateScenario([1, 2])).toEqual(['scénář není objekt']);
  });
});

test.describe('content: whole folder check', () => {
  let dir;
  test.beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'poznej-podvod-content-'));
    mkdirSync(path.join(dir, 'email'));
    mkdirSync(path.join(dir, 'zpravy'));
  });
  test.afterEach(() => rmSync(dir, { recursive: true, force: true }));

  test('invalid JSON file is reported with its name', () => {
    writeFileSync(path.join(dir, 'email', 'email-01.json'), '{ broken');
    expect(validateContent(dir).join('\n')).toMatch(/email\/email-01\.json: neplatný JSON/);
  });

  test('section with too few scenarios to draw a round is reported', () => {
    const scenario = validEmail();
    scenario.id = 'email-01';
    writeFileSync(path.join(dir, 'email', 'email-01.json'), JSON.stringify(scenario));
    const problems = validateContent(dir).join('\n');
    expect(problems).toMatch(/sekce email: jen 1 podvodů/);
    expect(problems).toMatch(/sekce zpravy: jen 0 podvodů/);
  });
});
