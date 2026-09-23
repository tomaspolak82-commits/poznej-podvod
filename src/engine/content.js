// Scenario bank. Vite bundles every src/content/<section>/*.json at build time;
// the files are validated during the build (see vite.config.js).

const modules = import.meta.glob('../content/*/*.json', { eager: true, import: 'default' });

const bySection = {};
for (const [path, scenario] of Object.entries(modules)) {
  const section = path.split('/').at(-2);
  (bySection[section] ??= []).push(scenario);
}
for (const list of Object.values(bySection)) list.sort((a, b) => a.id.localeCompare(b.id));

export function getScenarios(section) {
  return bySection[section] ?? [];
}
