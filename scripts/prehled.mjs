// Readable overview of all scenarios for Tomáš's review (CLAUDE.md, sections 7 and 15).
// Generated from src/content only, no hand-written text: `npm run prehled` writes
// docs/prehled-scenaru.md. buildOverview() is exported for the unit test.

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CONTENT_SECTIONS, readSection } from './content-files.mjs';
import { CATEGORY_LABELS } from '../src/texts.js';

const SECTION_TITLES = { email: 'E-mail', zpravy: 'Zprávy' };
const APP_TITLES = { sms: 'SMS', chat: 'chat' };

// Parts of the message in the order the app shows them: { target, label, text } or a date line
function messageParts(section, m) {
  const parts = [];
  if (section === 'email') {
    parts.push({ target: 'fromName', label: 'Jméno odesílatele', text: m.fromName });
    parts.push({ target: 'fromAddress', label: 'Adresa odesílatele', text: m.fromAddress });
    parts.push({ info: `Datum: ${m.date}` });
    parts.push({ target: 'subject', label: 'Předmět', text: m.subject });
    m.body.forEach((text, i) => parts.push({ target: `body.${i}`, label: `Odstavec ${i + 1}`, text }));
    if (m.attachment) parts.push({ target: 'attachment', label: 'Příloha', text: m.attachment.name });
    if (m.link) parts.push({ target: 'link', label: 'Odkaz', text: m.link.label });
    if (m.button) parts.push({ target: 'button', label: 'Tlačítko', text: m.button.label });
  } else {
    parts.push(
      m.fromMarkable === false
        ? { label: 'Odesílatel', text: m.from, note: 'nejde označit (`fromMarkable: false`)' }
        : { target: 'from', label: 'Odesílatel', text: m.from },
    );
    if (m.date) parts.push({ info: `Štítek nad bublinami: ${m.date}` });
    m.messages.forEach((bubble, i) => {
      if (bubble.date) parts.push({ info: `Štítek: ${bubble.date}` });
      parts.push({ target: `messages.${i}`, label: `Bublina ${i + 1}`, text: bubble.text });
      if (bubble.link) parts.push({ target: `messages.${i}.link`, label: `Odkaz v bublině ${i + 1}`, text: bubble.link });
    });
  }
  return parts;
}

const category = (id) => `\`${id}\` (${CATEGORY_LABELS[id] ?? '?'})`;

// What a part is: the main part of a threat, another part of a threat, or innocent
function partRole(scenario, target) {
  const main = scenario.threats.find((t) => t.target === target);
  if (main) {
    const also = main.alsoTargets?.length ? ` Platí i pro: ${main.alsoTargets.map((t) => `\`${t}\``).join(', ')}.` : '';
    return `**Hrozba** · ${category(main.category)} · „${main.title}“: ${main.explanation}${also}`;
  }
  const owner = scenario.threats.find((t) => t.alsoTargets?.includes(target));
  if (owner) return `součást hrozby „${owner.title}“ (hlavní část \`${owner.target}\`)`;
  return scenario.isScam ? 'nevinná část' : null;
}

function sourceLine(source) {
  const [first, ...rest] = source.split(' ');
  const looksLikeUrl = /^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(first) || /^https?:\/\//.test(first);
  if (!looksLikeUrl) return source;
  const href = /^https?:\/\//.test(first) ? first : `https://${first}`;
  return `[${first}](${href})${rest.length ? ` ${rest.join(' ')}` : ''}`;
}

function scenarioBlock(scenario) {
  const m = scenario.message;
  const kind = scenario.isScam ? 'podvod' : 'legitimní';
  const app = scenario.section === 'zpravy' ? `, ${APP_TITLES[m.app]}` : '';
  const lines = [`### ${scenario.id}: ${scenario.title}`, '', `- **Sekce:** ${SECTION_TITLES[scenario.section]}${app}`, `- **Druh:** ${kind}`];
  if (!scenario.isScam) lines.push(`- **Vyvrací:** „${scenario.refutes}“`);
  const sender = scenario.section === 'email' ? `${m.fromName} <${m.fromAddress}>` : m.from;
  const contact = scenario.section === 'zpravy' ? (m.inContacts ? ' (uložený kontakt)' : ' (není v kontaktech)') : '';
  lines.push(`- **Odesílatel:** ${sender}${contact}`, '', '**Zpráva po částech:**', '');

  let n = 0;
  for (const part of messageParts(scenario.section, m)) {
    if (part.info) {
      lines.push(`- _${part.info}_`);
      continue;
    }
    n += 1;
    const target = part.target ? ` \`${part.target}\`` : '';
    lines.push(`${n}. **${part.label}**${target}: ${part.text}`);
    const role = part.note ?? partRole(scenario, part.target);
    // Nested line indented by the width of "N. ", so it stays under item 10 and later too
    if (role) lines.push(`${' '.repeat(String(n).length + 2)}- ${role}`);
  }

  lines.push('', `**Shrnutí:** ${scenario.summary}`, '');
  lines.push(
    scenario.sources.length ? `**Zdroje:**\n\n${scenario.sources.map((s) => `- ${sourceLine(s)}`).join('\n')}` : '**Zdroje:** žádné (bez tvrzení za firmu nebo úřad)',
  );
  return lines.join('\n');
}

export function buildOverview(contentDir) {
  const sections = CONTENT_SECTIONS.map((section) => ({
    section,
    scenarios: readSection(contentDir, section).map((f) => f.data),
  }));

  const out = [
    '# Přehled scénářů',
    '',
    'Vygenerováno příkazem `npm run prehled` ze souborů v `src/content/`. Neupravovat ručně: změna scénáře = úprava JSON souboru a nové vygenerování.',
    '',
    '## Souhrn',
    '',
    '| Sekce | Scénářů | Podvodů | Legitimních |',
    '|---|---|---|---|',
  ];
  for (const { section, scenarios } of sections) {
    const scams = scenarios.filter((s) => s.isScam).length;
    out.push(`| ${SECTION_TITLES[section]} | ${scenarios.length} | ${scams} | ${scenarios.length - scams} |`);
  }
  out.push('', '**Falešná pravidla, která legitimní zprávy vyvracejí:**', '');
  for (const { scenarios } of sections) {
    for (const s of scenarios.filter((x) => !x.isScam)) out.push(`- \`${s.id}\`: „${s.refutes}“`);
  }

  for (const { section, scenarios } of sections) {
    out.push('', `## ${SECTION_TITLES[section]}`, '');
    out.push(scenarios.map(scenarioBlock).join('\n\n---\n\n'));
  }
  return `${out.join('\n')}\n`;
}

// Run as a script: write the overview next to the other docs
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const target = path.resolve('docs/prehled-scenaru.md');
  writeFileSync(target, buildOverview(path.resolve('src/content')));
  console.log(`Přehled scénářů zapsán do ${path.relative(process.cwd(), target)}`);
}
