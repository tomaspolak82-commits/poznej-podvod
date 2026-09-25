// Scenario overview (npm run prehled): generated from src/content only.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { buildOverview } from '../../scripts/prehled.mjs';
import { CONTENT_SECTIONS, readSection } from '../../scripts/content-files.mjs';

const CONTENT_DIR = path.resolve('src/content');
const overview = buildOverview(CONTENT_DIR);
const all = CONTENT_SECTIONS.flatMap((section) => readSection(CONTENT_DIR, section).map((f) => f.data));

test('every scenario has its own heading, summary and every threat explanation', () => {
  for (const scenario of all) {
    expect(overview).toContain(`### ${scenario.id}: ${scenario.title}`);
    expect(overview).toContain(scenario.summary);
    for (const threat of scenario.threats) expect(overview).toContain(threat.explanation);
  }
});

test('every legitimate message lists the false rule it disproves, also in the summary on top', () => {
  const top = overview.split('\n## E-mail')[0];
  for (const scenario of all.filter((s) => !s.isScam)) {
    expect(top).toContain(`\`${scenario.id}\`: „${scenario.refutes}“`);
  }
});

test('the counts on top match the content', () => {
  for (const section of CONTENT_SECTIONS) {
    const scenarios = all.filter((s) => s.section === section);
    const scams = scenarios.filter((s) => s.isScam).length;
    expect(overview).toMatch(new RegExp(`\\| ${scenarios.length} \\| ${scams} \\| ${scenarios.length - scams} \\|`));
  }
});

test('sources become links', () => {
  expect(overview).toContain('[cez.cz/cs/podvodne-maily](https://cez.cz/cs/podvodne-maily)');
});
