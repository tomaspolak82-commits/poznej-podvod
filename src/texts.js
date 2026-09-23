// All player-facing game texts in one place (approved by Tomáš, milestone 3).
// Changing a wording = editing this file only.

import { points, roundsWord, scoreOf } from './ui/format.js';

export const TRAINING_LABEL = 'TRÉNINK: cvičná ukázka, nic se neodesílá';

export const LINK_NOTICE =
  'Tohle je jen trénink, odkaz nikam nevede a nic se nestalo. Ve skutečnosti by vás podobný odkaz mohl zavést na nebezpečnou stránku, která se snaží získat vaše údaje.';

export const CLOSE_AND_CONTINUE = 'Zavřít a pokračovat';

export const HINTS = {
  email: {
    title: 'Na co si dát pozor v e-mailu',
    items: [
      ['Adresa odesílatele.', 'Jméno si může napsat kdokoli. Podívejte se na adresu pod ním: patří opravdu té firmě nebo úřadu?'],
      ['Spěch a strach.', '„Do 24 hodin“, „jinak zablokujeme účet“, „hrozí exekuce“. Tlak má zabránit tomu, abyste si věc v klidu ověřili.'],
      ['Odkazy, tlačítka a žádost o údaje.', 'Banka, pošta ani úřad vás e-mailem nepošlou zadávat údaje z karty, PIN, heslo ani kód z SMS.'],
      ['Přílohy, které nečekáte.', 'Faktura, výměr nebo „smlouva“ od neznámého odesílatele může v počítači spustit škodlivý program.'],
      ['Nabídka, která je moc dobrá.', 'Výhra v soutěži, do které jste se nepřihlásili, nebo peníze „zpět“ bez důvodu.'],
    ],
    note: 'Pozor: i zpráva v bezchybné češtině může být podvod. Podvodníci dnes píšou s pomocí umělé inteligence.',
    advice: 'Když si nejste jistí, nic neotevírejte. Otevřete si stránky firmy sami nebo zavolejte na číslo z jejich oficiálního webu.',
  },
  zpravy: {
    title: 'Na co si dát pozor ve zprávách',
    items: [
      ['Neznámé nebo „nové“ číslo.', '„Mami, tohle je moje nové číslo“ je častý trik. Zavolejte na staré číslo, které znáte.'],
      ['Odkaz nebo výzva k instalaci aplikace.', 'Pokuta, clo za balík, přeplatek: odkaz ve zprávě často vede na falešnou stránku. Aplikace instalujte jen z obchodu v telefonu.'],
      ['Spěch a citový nátlak.', '„Rychle, potřebuju pomoct“, „máte tři dny“. Čím víc zpráva tlačí, tím víc si ji ověřte.'],
      ['Žádost o kód.', 'Kód z SMS je jako klíč od vašeho účtu. Nikomu ho nepřeposílejte, ani „kamarádovi“.'],
      ['Žádost o peníze.', 'Když vás někdo blízký žádá o peníze přes zprávu, zavolejte mu dřív, než cokoli pošlete.'],
    ],
    note: 'Pozor: i zpráva v bezchybné češtině může být podvod. Podvodníci dnes píšou s pomocí umělé inteligence.',
    advice: 'Podezřelou SMS můžete přeposlat na číslo 7726, operátor pak odesílatele zablokuje.',
  },
};

export const ROUND = {
  hintButton: 'Na co si dát pozor?',
  progress: (index, total) => `Zpráva ${index} z ${total}`,
  score: (score, max) => `Body: ${score} z ${max}`,
  decideScam: 'Je to podvod',
  decideOk: 'Je to v pořádku',
  advancedInstruction:
    'Klepněte na všechno, co vám na zprávě přijde podezřelé. Druhým klepnutím označení zrušíte. Pak rozhodněte.',
  marked: 'Označeno',
  backToLevels: 'Zpět na výběr úrovně',
};

export const EVALUATION = {
  scamCorrect: { title: 'Správně, je to podvod.', text: 'Podívejte se, podle čeho se dal poznat.' },
  okCorrect: { title: 'Správně, zpráva je v pořádku.', text: 'Podívejte se, podle čeho se dá poznat, že je pravá.' },
  scamMissed: { title: 'Tahle zpráva je podvod.', text: 'Nevadí, proto trénujeme. Podívejte se, podle čeho se dal poznat.' },
  okWrong: {
    title: 'Tahle zpráva je ve skutečnosti v pořádku.',
    text: 'Opatrnost je dobrá. Podívejte se, podle čeho se dá poznat, že je pravá.',
  },
  gained: (count) => `Získali jste ${points(count)}.`,
  breakdown: (decision, marking) => `Za rozhodnutí: ${decision} · Za označená místa: ${marking}`,
  bulbIntro: 'Klepněte na žárovku u podezřelého místa a přečtěte si proč.',
  statusFound: 'Našli jste',
  statusMissed: 'Tohle místo stojí za druhý pohled',
  statusExtra: 'Označeno zbytečně, tady je vše v pořádku',
  legitClean: 'Nic jste neoznačili, správně: na zprávě nebylo nic podezřelého.',
  legitMarked: 'Na zprávě nebylo nic podezřelého. Označená místa jsou v pořádku.',
  summaryTitle: 'Co si z toho vzít',
  next: 'Další zpráva',
  showResult: 'Zobrazit výsledek',
};

export const ROUND_END = {
  title: 'Hotovo, máte za sebou 5 zpráv.',
  score: (score, max) => `Získali jste ${scoreOf(score, max)}.`,
  newBest: 'To je váš nejlepší výsledek v této úrovni.',
  previousBest: (score, max) => `Váš nejlepší výsledek je ${scoreOf(score, max)}.`,
  missed: (labels) => `V tomto kole vám unikalo: ${labels.join(', ')}.`,
  nothingMissed: 'V tomto kole vám nic neuniklo.',
  playAgain: 'Hrát dalších 5',
  home: 'Zpět na hlavní stránku',
};

export const CATEGORY_LABELS = {
  odesilatel: 'adresa nebo jméno odesílatele',
  'odkaz-platba': 'odkaz nebo tlačítko k platbě',
  'casovy-tlak': 'spěch ve zprávě',
  'zadost-o-udaje': 'žádost o údaje nebo kódy',
  'vyhra-nabidka': 'výhra nebo nečekaná nabídka',
  priloha: 'nečekaná příloha',
  'jazyk-chyby': 'chyby v češtině',
  'nezname-cislo': 'neznámé číslo',
  'emocni-natlak': 'citový nátlak',
  'neobvykla-zadost': 'neobvyklá žádost',
  'qr-kod': 'QR kód',
  'instalace-aplikace': 'výzva k instalaci aplikace',
};

export const WELCOME = {
  title: 'Vítejte zpět',
  intro: 'Jsme rádi, že jste zase tady.',
  bestTitle: 'Nejlepší výsledky:',
  best: (sectionTitle, levelTitle, score, max) => `${sectionTitle} (${levelTitle.toLowerCase()}): ${scoreOf(score, max)}`,
  missed: (labels) => `Nejčastěji vám unikalo: ${labels.join(', ')}.`,
  rounds: (count) => `Odehráli jste zatím ${count} ${roundsWord(count)}.`,
};

export const DELETE_HISTORY = {
  link: 'Smazat moji historii',
  title: 'Smazat historii?',
  text: 'Smažou se vaše nejlepší výsledky, statistika chyb a seznam posledních zpráv. Nejde to vrátit.',
  confirm: 'Smazat historii',
  cancel: 'Ponechat historii',
  done: 'Historie je smazaná.',
};

export const LEAVE_ROUND = {
  title: 'Opravdu chcete kolo ukončit?',
  text: 'Body z tohoto kola se neuloží.',
  confirm: 'Ukončit kolo',
  cancel: 'Hrát dál',
};
