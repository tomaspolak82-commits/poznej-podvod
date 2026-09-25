// All player-facing game texts in one place (approved by Tomáš, milestone 3).
// Changing a wording = editing this file only.

import { points, roundsWord, scoreOf } from './ui/format.js';

export const TRAINING_LABEL = 'TRÉNINK: cvičná ukázka, nic se neodesílá';

export const LINK_NOTICE =
  'Tohle je jen trénink, odkaz nikam nevede a nic se nestalo. Ve skutečnosti by vás podobný odkaz mohl zavést na nebezpečnou stránku, která se snaží získat vaše údaje.';

// Same text for every attachment (scam or legitimate), so it does not give the answer away;
// it carries the rule of e-mail hint item 5 (approved by Tomáš, milestone 6)
export const ATTACHMENT_NOTICE =
  'Tohle je jen trénink, příloha se neotevřela a nic se nestalo. Ve skutečnosti by příloha, kterou nečekáte, mohla obsahovat škodlivý program. Platí to i u známého odesílatele.';

export const CLOSE_AND_CONTINUE = 'Zavřít a pokračovat';

export const HINTS = {
  email: {
    title: 'Na co si dát pozor v e-mailu',
    // Items 3, 4 and 5 revised in milestone 6 (approved by Tomáš): a plain deadline, a link
    // alone is not a scam; an unexpected attachment is risky even from a known sender
    items: [
      ['Adresa odesílatele.', 'Jméno odesílatele si může napsat kdokoli. Vždy si klepnutím zobrazte i adresu, která se za ním skrývá.'],
      ['Oslovení.', 'Firma, u které máte účet, vás obvykle osloví jménem. Jméno ale samo o sobě nic nezaručuje.'],
      [
        'Spěch a strach.',
        '„Do 24 hodin“, „jinak zablokujeme účet“, „hrozí exekuce“. Tlak má zabránit tomu, abyste si věc v klidu ověřili. Obyčejná lhůta sama o sobě podvod není. Zpozorněte, když se spěch pojí s výhrůžkou, platbou nebo žádostí o údaje.',
      ],
      [
        'Odkaz nebo tlačítko k penězům, přihlášení či údajům.',
        'Odkaz sám o sobě podvod není. Zpozorněte, když vás vede k placení nebo „vyzvednutí“ peněz, k přihlášení nebo k zadání údajů. Údaje z karty, PIN, heslo ani kód z SMS nikdy nezadávejte na stránce, kam vás poslal e-mail.',
      ],
      [
        'Přílohy, které nečekáte.',
        'Faktura, výměr nebo „smlouva“, o kterých nic nevíte, může obsahovat škodlivý program. Platí to i u známého odesílatele. Když si nejste jistí, přílohu neotevírejte a nejdřív se zeptejte, třeba telefonem.',
      ],
      ['Nabídka, která je moc dobrá.', 'Výhra v soutěži, do které jste se nepřihlásili, nebo peníze „zpět“ bez důvodu.'],
    ],
    note: 'Pozor: i zpráva v bezchybné češtině může být podvod. Podvodníci dnes píšou s pomocí umělé inteligence.',
    advice: 'Když si nejste jistí, nic neotevírejte. Otevřete si stránky firmy sami nebo zavolejte na číslo z jejich oficiálního webu.',
  },
  zpravy: {
    title: 'Na co si dát pozor ve zprávách',
    // Revised in milestone 5 (approved by Tomáš): a link alone is not a scam; item 1 only
    // about numbers pretending to be someone close (an unknown number alone means nothing)
    items: [
      [
        'Neznámé nebo „nové“ číslo, které se vydává za někoho blízkého.',
        '„Mami, tohle je moje nové číslo“ je častý trik. Zavolejte na původní číslo, které znáte. Zpozorněte i u předvolby jiné než +420.',
      ],
      [
        'Žádost o peníze.',
        'Když vás někdo blízký žádá o peníze přes zprávu, zavolejte mu dřív, než cokoli pošlete. Pomůže i otázka, na kterou zná odpověď jen on.',
      ],
      ['Spěch a citový nátlak.', '„Rychle“, „ještě dnes“, „nikomu to neříkej“. Čím víc zpráva tlačí, tím víc si ji ověřte.'],
      [
        'Odkaz k platbě nebo přihlášení.',
        'Odkaz sám o sobě podvod není. Zpozorněte, když vás vede k zaplacení pokuty, cla nebo přeplatku, k přihlášení nebo k zadání údajů. Ověřte si to sami na oficiálních stránkách.',
      ],
      ['Žádost o kód.', 'Kód z SMS je jako klíč od vašeho účtu. Nikomu ho nepřeposílejte, ani „kamarádovi“.'],
      ['Výzva k instalaci aplikace.', 'Aplikace instalujte jen z obchodu v telefonu, nikdy přes odkaz ve zprávě.'],
    ],
    note: 'Pozor: i zpráva v bezchybné češtině může být podvod. Podvodníci dnes píšou s pomocí umělé inteligence.',
    advice:
      'Podezřelou SMS můžete přeposlat na číslo 7726, tím ji nahlásíte operátorovi. V chatu můžete podezřelý účet zablokovat a nahlásit přímo v aplikaci.',
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
  'obecne-osloveni': 'obecné oslovení bez jména',
};

// The player's role in the simulated mail app (approved by Tomáš, milestone 4).
// Scenarios greet her by name directly in their text ("Dobrý den, paní Nováková,").
export const RECIPIENT = 'Jana Nováková';

export const EMAIL_APP = {
  inboxInstruction: 'Toto je schránka Jany Novákové. Klepněte na nejnovější zprávu nahoře a přečtěte si ji.',
  folders: ['Doručená pošta', 'Odeslaná', 'Spam', 'Koš'],
  foldersLabel: 'Složky',
  // Contains the visible text "Doručená pošta" exactly (WCAG 2.5.3, label in name)
  backToInbox: 'Zpět do schránky Doručená pošta',
  to: (name) => `Komu: ${name}`,
  // The arrow next to these texts is an SVG icon (Lato has no ▾ ▴)
  showAddress: 'zobrazit adresu',
  hideAddress: 'skrýt adresu',
  notPartOfTask: 'Tahle zpráva není součástí úkolu. Otevřete nejnovější zprávu nahoře.',
  folderNotPartOfTask: 'Tahle složka není součástí úkolu. Zpráva k tréninku je v Doručené poště.',
  // Older inactive messages under the task message, for realism (CLAUDE.md, section 6)
  olderMessages: [
    { from: 'Jana Dvořáková', subject: 'Fotky z oslavy', preview: 'Ahoj, posílám slíbené fotky z babiččiných narozenin…', time: 'včera' },
    { from: 'Spolek zahrádkářů', subject: 'Zápis ze schůze', preview: 'Dobrý den, v příloze posíláme zápis ze zářijové schůze…', time: 'pondělí' },
    { from: 'Petr Novák', subject: 'Chata o víkendu', preview: 'Ahoj, jedeme v sobotu kolem deváté, vezmu…', time: '15. 9.' },
  ],
};

// Simulated messages app, SMS and chat (approved by Tomáš, milestone 5)
export const MESSAGES_APP = {
  appLabel: { sms: 'SMS', chat: 'Chat' },
  notInContacts: 'Toto číslo není ve vašich kontaktech',
  addContact: 'Přidat',
  block: 'Nahlásit a zablokovat',
  // Same for scams and legitimate messages, so it does not give the answer away
  buttonNotice: 'Tohle je jen trénink, tlačítko nic nedělá. Rozhodněte dole, jestli je zpráva podvod, nebo v pořádku.',
  inputPlaceholder: 'Zpráva',
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
