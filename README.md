# Poznej podvod

Webová aplikace, na které si senioři bezpečně nacvičí, jak poznat podvod v telefonu a na internetu.

Aplikace ukazuje zprávy tak, jak by vypadaly v telefonu: e-mailovou schránku, SMS a chat. Hráč rozhodne, jestli jde o podvod. V pokročilé úrovni navíc označí konkrétní podezřelá místa, třeba adresu odesílatele, spěch ve zprávě nebo odkaz na platbu. Po každé zprávě dostane body a srozumitelné vysvětlení, podle čeho se podvod dá poznat. Když pak podobnou zprávu uvidí ve skutečném telefonu, má si vzpomenout: „Tohle jsem viděl v tréninku.“

Projekt patří k dobrovolnické iniciativě [Méně Starostí](https://menestarosti.cz/), která pomáhá rodinám s bezpečím a péčí o seniory.

> **Stav:** ve vývoji. Hotová je hlavní stránka, výběr úrovně a vzhled. Herní engine, e-mailová aplikace a zprávy se připravují.

## Pro koho

- **Senioři 60+.** Hrají hlavně na mobilu a tabletu, často s velkým systémovým písmem, horším zrakem a méně jistou rukou.
- **Jejich dospělé děti**, které aplikaci rodičům pošlou nebo ji hrají s nimi.

Z toho vychází i pravidla návrhu:

- základní písmo nejméně 18 px, aplikace respektuje velikost písma nastavenou v telefonu a vydrží i 200% zvětšení
- dotykové prvky nejméně 48 × 48 px, žádné akce jen přes gesta
- kontrast textu nejméně 4,5 : 1 (WCAG AA), význam se nikdy nesděluje jen barvou
- žádný časový limit, žádná registrace, žádné cookies ani analytika
- nic se neodesílá na server, historie hráče zůstává jen v jeho prohlížeči (`localStorage`)

## Jak je postavená

| Oblast | Řešení |
| --- | --- |
| Sestavení | [Vite](https://vite.dev/), výstupem je statická složka `dist/` |
| Kód | čistý JavaScript (ES moduly), bez frameworku |
| Styly | samostatné CSS soubory, BEM, design tokeny jako CSS proměnné, mobile-first |
| Směrování | přes hash v adrese (`#/email`), server nepotřebuje žádnou konfiguraci |
| Obsah | každý scénář (zpráva) je samostatný JSON soubor oddělený od kódu |
| Písma | Montserrat a Lato hostované lokálně (licence SIL OFL), včetně české diakritiky |
| Testy | [Playwright](https://playwright.dev/) na zařízeních Pixel 7, iPhone 13, Galaxy Tab S4, na počítači a na šířce 320 px |

Testy kromě běžných funkcí hlídají i přístupnost a čitelnost:

- žádné vodorovné posouvání při 200% písmu
- velikost dotykových prvků
- to, že se všechna česká písmena vykreslí správným písmem
- to, že stránka nic nenačítá z cizích serverů

### Struktura

```
src/
  main.js          vstupní bod
  router.js        přepínání obrazovek podle adresy
  sections.js      seznam sekcí (E-mail, Zprávy, připravované)
  screens/         obrazovky (hlavní stránka, výběr úrovně…)
  ui/              hlavička a patička, ikony (vlastní inline SVG)
  styles/          design tokeny, písma, rozvržení, komponenty
  engine/          herní logika (připravuje se)
  apps/            simulované aplikace: pošta, zprávy (připravuje se)
  content/         scénáře jako JSON (připravuje se)
public/            logo a písma
tests/             Playwright testy
docs/              podklady ke značce a obsahu
```

## Spuštění na vlastním počítači

Potřebujete [Node.js](https://nodejs.org/) verze 20.19 nebo 22.12 a novější (požadavek Vite 8).

```powershell
npm install
npx playwright install chromium webkit
npm run dev
```

První příkaz nainstaluje závislosti. Druhý stáhne prohlížeče pro testy. Třetí spustí vývojový server a vypíše adresu (obvykle http://localhost:5173), kterou otevřete v prohlížeči.

Další příkazy:

| Příkaz | Co dělá |
| --- | --- |
| `npm test` | spustí všechny Playwright testy |
| `npm run build` | sestaví aplikaci do složky `dist/` |
| `npm run preview` | zobrazí sestavenou verzi |

## Jak projekt vzniká

Projekt vzniká pod vedením Tomáše Poláka ve spolupráci s AI asistentem [Claude Code](https://claude.com/claude-code) od Anthropicu. Tomáš určuje zadání, cílovou skupinu, obsah a vzhled, kontroluje každý krok a schvaluje ho. Claude Code píše kód a testy podle pravidel v [`CLAUDE.md`](CLAUDE.md). Práce postupuje po milnících, po každém musí projít build i testy.

Texty podvodných zpráv budou vycházet z reálných situací v Česku a z oficiálních varování (Policie ČR, ČNB, NÚKIB, Česká pošta). Domény, čísla a jména v ukázkách budou smyšlené.
