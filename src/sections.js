// Registry of training sections. Adding a section = new entry here,
// a simulated app in src/apps/ and a scenario folder in src/content/.

export const sections = [
  {
    id: 'email',
    title: 'E-mail',
    description: 'E-maily, které se tváří jako zpráva od banky, pošty nebo úřadu. Poznáte, které jsou pravé?',
    icon: 'email',
    active: true,
  },
  {
    id: 'zpravy',
    title: 'Zprávy (SMS a WhatsApp)',
    description: 'Textové zprávy od neznámých čísel i od „rodiny“, která najednou potřebuje peníze.',
    icon: 'messages',
    active: true,
  },
  {
    id: 'prohlizec',
    title: 'Prohlížeč',
    description: 'Falešné reklamy, výhry a vyskakovací okna.',
    icon: 'browser',
    active: false,
  },
  {
    id: 'qr-platba',
    title: 'QR platba',
    description: 'Kontrola příjemce a částky před zaplacením.',
    icon: 'qr',
    active: false,
  },
  {
    id: 'telefonat',
    title: 'Telefonát',
    description: 'Falešný bankéř nebo policista na telefonu. Psaný rozhovor, bez zvuku.',
    icon: 'phone',
    active: false,
  },
];

export const levels = [
  {
    id: 'zakladni',
    title: 'Základní',
    icon: 'decide',
    description: 'Přečtete si zprávu a rozhodnete: je to podvod, nebo je v pořádku?',
  },
  {
    id: 'pokrocila',
    title: 'Pokročilá',
    icon: 'search',
    description:
      'Nejdřív klepnutím označíte všechno, co vám na zprávě přijde podezřelé. Pak rozhodnete. Za každé správně nalezené místo získáte bod navíc.',
  },
];

export function findActiveSection(id) {
  return sections.find((section) => section.id === id && section.active) ?? null;
}
