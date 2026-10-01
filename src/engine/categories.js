// Allowed threat categories (CLAUDE.md, section 7). Used for validation and
// for the "Nejčastěji vám unikalo" statistics.
export const THREAT_CATEGORIES = [
  'odesilatel',
  'odkaz-platba',
  'casovy-tlak',
  'zadost-o-udaje',
  'vyhra-nabidka',
  'priloha',
  'jazyk-chyby',
  'nezname-cislo',
  'emocni-natlak',
  'neobvykla-zadost',
  'qr-kod',
  'instalace-aplikace',
  'obecne-osloveni',
  // Browser section: the page address or the warning next to it (1. 10. 2026)
  'adresa-stranky',
];
