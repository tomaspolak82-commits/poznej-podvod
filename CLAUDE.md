# CLAUDE.md — Poznej podvod (poznej-podvod.menestarosti.cz)

## 1. O projektu

„Poznej podvod“ je webová aplikace pro seniory, na které si nacvičí rozpoznávání podvodů. Simuluje prostředí, které znají ze svého telefonu: e-mailovou schránku, SMS, WhatsApp, později i prohlížeč, QR platbu a telefonní hovor. Senior dostane zprávu a rozhodne, jestli je podvod. V pokročilé úrovni navíc označí konkrétní podezřelá místa. Pak dostane body a srozumitelné vysvětlení.

Projekt patří k dobrovolnické iniciativě Méně starostí (menestarosti.cz), kterou vede Tomáš s manželkou Káťou. Hlavní web běží na WordPressu, ale tato aplikace je na něm úplně nezávislá. Je to samostatná stránka na vlastní subdoméně, s hlavním webem ji spojuje jen odkaz.

Cílová skupina:
- senioři 60+ (hlavně mobil a tablet, často velké systémové písmo, horší zrak a jemná motorika)
- jejich dospělé děti (40–55), které jim aplikaci pošlou nebo ji hrají s nimi

Smysl: ne zábava sama o sobě, ale bezpečné chování a důvěra ve vlastní úsudek. Když senior podobnou zprávu uvidí ve skutečném telefonu, má si vzpomenout: „Tohle jsem viděl v tréninku.“

Podklady ve složce `docs/`:
- `docs/brand.md`: značka, tón, cílová skupina. Pokud se v něčem rozchází s tímto souborem, platí CLAUDE.md.
- `docs/hloubkovy_vyzkum_podvody_senior.md`: výzkum podvodů na seniory v ČR, podklad pro obsah scénářů. Je to výstup z AI vyhledávače a jeho zdroje nebyly ověřené. Obsahuje číslo 7726 a jména skutečných osobností. Obojí se do aplikace **nepřebírá** (sekce 7).
- `docs/loga/`: tři varianty loga Méně starostí (`logo.png`, `logo-white-background.png`, `cerveno_bile.png`), z nich se v milníku 2 vybere jedno (sekce 9).

Název značky se píše vždy **„Méně starostí“** (malé „s“).

## 2. Jak se mnou pracovat (pro Claude Code)

Tomáš nepíše kód sám. Zadává, kontroluje a učí se pracovat v terminálu, Gitu a GitHubu. Proto:

1. **Komunikuj česky.** Česky jsou texty v aplikaci a commit zprávy. Kód, názvy souborů a proměnných a komentáře v kódu anglicky. Texty v aplikaci pěknou jednoduchou češtinou, které rozumí senior.
2. **Pracuj po milnících** (sekce 13), vždy jen na jednom. Před začátkem napiš ve 3–5 větách, co uděláš. Na konci napiš, jak si výsledek Tomáš ověří: konkrétní příkaz, adresu nebo co přesně má vidět.
3. **Příkazy vysvětluj.** U každého příkazu, který má Tomáš spustit sám, napiš jednou větou, co dělá. U Gitu a GitHubu ho veď krok za krokem, dělá to poprvé.
4. **Po každém milníku** spusť `npm run build` a `npm test`. Když projdou, napiš, co a proč commitneš, a **počkej na Tomášovo OK**. Teprve pak udělej commit s českou zprávou („Milník 3: e-mailová aplikace a 3 vzorové scénáře“). Stejně tak push a změna větve jen po OK.
5. **Nepřidávej závislosti** mimo sekci 3 bez Tomášova souhlasu.
6. **Nikdy necommituj `.env`** ani nic s hesly.
7. **Nasazení na server spouštěj jen na výslovný pokyn.**
8. **Obsah scénářů piš nejdřív jako vzorek 3 kusů.** Rozepisuj dál až po Tomášově schválení.
9. **Když si něčím nejsi jistý** (chování hostingu, reálné znění podvodu, právní otázka), řekni to. Nehádej.

## 3. Technologie (rozhodnuto)

- **Vite** (aktuální stabilní) + **čistý JavaScript (ES moduly), bez frameworku.** Rychlé načtení i na starších telefonech, minimum závislostí k údržbě.
- **CSS** v samostatných souborech, design tokeny jako CSS proměnné (sekce 9).
- **Scénáře jako JSON soubory**, jeden soubor = jeden scénář, oddělené od kódu (sekce 7).
- **`localStorage`** pro historii hráče (sekce 8). Žádné účty, žádná registrace.
- **Směrování přes hash** (`#/email`, `#/zpravy/kolo`), server nepotřebuje žádnou konfiguraci.
- **Testy:** Playwright (sekce 12).
- **Nasazení:** `scripts/deploy.mjs` s `basic-ftp`, údaje v `.env`. Alternativa: Tomáš nahraje `dist/` ručně přes FileZillu.
- **Bez PHP, bez databáze, bez backendu, bez cookies, bez analytiky.** Výstup `npm run build` je statická složka `dist/`.

Povolené závislosti: `vite`, `@playwright/test`, `basic-ftp`, `dotenv`.

## 4. Hosting

- Subreg.cz, tarif Start, sdílený hosting.
- Subdoména `poznej-podvod.menestarosti.cz`, vlastní složka `/poznej-podvod.menestarosti.cz`, SSL zapnuté.
- Hlavní WordPress web ve složce `/menestarosti.cz`. **Na ten se nikdy nesahá.**
- Neověřeno: jestli soubory patří přímo do složky subdomény, nebo do podsložky. Cesta je v `.env` (`FTP_REMOTE_DIR`) a Tomáš ji ověří ve FileZille.
- Neověřeno: jestli Subreg podporuje FTPS. Skript zkusí šifrované spojení. Když selže, vypíše srozumitelnou chybu. Na nešifrované FTP bez souhlasu nepřecházej.

## 5. Obrazovky a průběh

### Hlavní stránka („Poznej podvod“)
- Hlavička na všech obrazovkách: **velké tlačítko „← Zpět na Méně starostí“** (https://menestarosti.cz/hry-pro-senior/), logo Méně starostí, název „Poznej podvod“, podtitul „Trénink pro seniory: jak poznat podvod v telefonu a na internetu“.
- Pokud hráč už dřív hrál: panel **„Vítejte zpět“**. Nejvyšší skóre v každé sekci a úrovni a nejčastější chyby (sekce 8).
- Dlaždice sekcí: **E-mail**, **Zprávy (SMS a WhatsApp)**. Budoucí sekce (Prohlížeč, QR platba, Telefonát) jako neaktivní dlaždice „Připravujeme“.
- Úplně dole na hlavní stránce (nad patičkou) nenápadný odkaz s ikonou **„Smazat moji historii“** s potvrzením (sekce 8). Zobrazí se, jen když nějaká historie existuje.
- Odkaz „← Zpět na Méně starostí“ vede na https://menestarosti.cz/hry-pro-senior/ (Tomáš ověřil, že existuje). Jinak aplikace na obsah hlavního webu nenavazuje, žádné odkazy na články.

### Výběr úrovně
Po klepnutí na sekci:
- **Základní:** hráč jen rozhodne „Je to podvod“ / „Je to v pořádku“.
- **Pokročilá:** hráč nejdřív označí podezřelá místa, pak rozhodne.
Každá úroveň má krátký popis a **maximální počet bodů pro toto kolo**. Proto se zprávy kola vylosují už při otevření výběru úrovně.

### Kolo
- Kolo = **5 zpráv** náhodně vybraných z banky sekce (sekce 7).
- Hra začne hned. Nahoře je stále viditelné tlačítko **„Na co si dát pozor?“**. Otevře modal s nejčastějšími znaky podvodu v dané sekci. Modal se zavře tlačítkem „Zavřít a pokračovat“, klávesou Esc nebo klepnutím mimo. Hra pak pokračuje, kde byla.
- Nahoře je průběh („Zpráva 2 z 5“) a body („Body: 7 z 18“).
- Trvale viditelný štítek nad simulací: **„TRÉNINK: cvičná ukázka, nic se neodesílá“**. Nejde zavřít.
- Obnovení stránky uprostřed kola: hráč se vrátí na výběr úrovně, rozehrané kolo se neuloží do historie.

### Vyhodnocení zprávy (po každé zprávě)
- Jestli rozhodl správně, kolik bodů získal a proč.
- Zpráva znovu zobrazená se **žárovkami** u všech podezřelých míst. Klepnutí na žárovku otevře vysvětlení (vždy zavíratelné).
- V pokročilé úrovni: co našel, co přehlédl, co označil zbytečně.
- U legitimní zprávy vysvětlení, podle čeho se dá poznat, že je v pořádku.
- Tlačítko „Další zpráva“.

### Konec kola
- Celkové body z maxima, porovnání s nejlepším výsledkem.
- Stručné shrnutí chyb v tomto kole.
- Tlačítka: „Hrát další kolo“ (nové náhodné zprávy), „Zpět na hlavní stránku“.

## 6. Simulovaná prostředí (realismus)

Senior má prostředí poznat jako to, co zná ze svého telefonu. Nemá to působit jako text v knížce. Platí ale:
- **žádná loga, ikony ani přesné firemní barvy** skutečných aplikací a firem (Gmail, Seznam, WhatsApp, banky, Česká pošta)
- rozložení, prvky a chování odpovídají běžným aplikacím, pojmenování je neutrální („Pošta“, „Zprávy“, „Chat“)

Zobrazení:
- **Mobil:** simulovaná aplikace vyplní celou obrazovku pod hlavičkou a štítkem TRÉNINK. Žádný rám telefonu v telefonu.
- **Tablet a počítač:** velký rám neutrálního Android telefonu uprostřed. Na počítači a tabletu na šířku může mít e-mailová aplikace rozložení jako na tabletu (složky vlevo).

### E-mail
- Seznam zpráv (doručená pošta): odesílatel, předmět, začátek textu, čas, nepřečtené tučně. Složky Doručená pošta, Odeslaná, Spam, Koš (na mobilu v menu ☰, na širší obrazovce vlevo).
- V seznamu je úkolová zpráva jako nejnovější nepřečtená a pod ní 2–3 starší neaktivní zprávy kvůli realismu. Klepnutí na ně ukáže krátké „Tahle zpráva není součástí úkolu“.
- Detail zprávy: jméno odesílatele nahoře, **pod ním vždy viditelná adresa odesílatele** (nic se nerozbaluje). Dále předmět, datum, text, případně příloha a tlačítko nebo odkaz. V pokročilé úrovni jde adresu označit stejně jako kteroukoli jinou část zprávy.

### Zprávy (SMS a WhatsApp)
Jedna sekce, každý scénář má `app: "sms"` nebo `app: "chat"`:
- **SMS:** konverzace s číslem nebo textovým jménem odesílatele, bubliny, podtržený odkaz.
- **Chat (WhatsApp-like):** hlavička s profilovou fotkou (neutrální avatar, žádné fotky skutečných lidí), jméno nebo číslo, u neznámého čísla lišta „Toto číslo není ve vašich kontaktech: Přidat / Nahlásit a zablokovat“. Bubliny, případně hlasová zpráva jako neaktivní prvek.

Odkazy, tlačítka a přílohy nikam nevedou.
- **Základní úroveň:** klepnutí na ně ukáže u **všech** zpráv (podvodných i legitimních) stejné krátké upozornění, aby neprozradilo odpověď dřív, než hráč rozhodne: „Tohle je jen trénink, odkaz nikam nevede a nic se nestalo. Ve skutečnosti by vás podobný odkaz mohl zavést na nebezpečnou stránku, která se snaží získat vaše údaje.“
- **Pokročilá úroveň:** označování je klepnutí na část zprávy (odesílatel, adresa, předmět, odstavec, odkaz, tlačítko, příloha, bublina). Označená část je viditelně zvýrazněná, druhé klepnutí označení zruší. Odkaz nebo tlačítko se tím jen označí, upozornění se nezobrazí.

## 7. Obsah scénářů

### Banka zpráv
- Cíl: **15–20 scénářů na sekci**, z toho **alespoň 4 legitimní** zprávy.
- Kolo vybere náhodně 5 zpráv. **V každém kole je 1–2 legitimní.** Zprávy z předchozího kola stejné sekce se v dalším kole neopakují, pokud to banka dovolí. Platí i mezi návštěvami (ID posledního kola se ukládá do `localStorage`, zvlášť pro každou sekci).
- Pro testy musí jít náhodu zafixovat parametrem `?seed=123`. Parametr stojí v adrese před `#`, např. `/?seed=123#/email`.

### Soubory a číslování
`src/content/email/email-01.json`, `email-02.json`… a `src/content/zpravy/zpravy-01.json`…
Číslo ve jméně souboru je „číslo scénáře“. Tomáš bude zadávat úpravy typu „uprav scénář e-mail 6“.

### Formát

```json
{
  "id": "email-06",
  "section": "email",
  "title": "Zásilka čeká na doplacení",
  "isScam": true,
  "message": {
    "fromName": "Česká pošta",
    "fromAddress": "info@posta-doruceni-cz.top",
    "date": "dnes 8:14",
    "subject": "Vaše zásilka nemohla být doručena",
    "body": [
      "Dobrý den,",
      "vaše zásilka čeká na doplacení poplatku 19 Kč. Pokud platbu neuhradíte do 24 hodin, bude vrácena odesílateli."
    ],
    "button": { "label": "Zaplatit 19 Kč" }
  },
  "threats": [
    {
      "target": "fromAddress",
      "category": "odesilatel",
      "title": "Adresa odesílatele",
      "explanation": "Jméno odesílatele si může napsat kdokoli. Rozhoduje adresa za ním a tahle s poštou nemá nic společného."
    },
    {
      "target": "body.1",
      "category": "casovy-tlak",
      "title": "Spěch",
      "explanation": "Lhůta 24 hodin má zabránit tomu, abyste si to v klidu ověřili."
    },
    {
      "target": "button",
      "category": "odkaz-platba",
      "title": "Tlačítko k platbě",
      "explanation": "Malá částka má uspat pozornost. Na falešné stránce pak chtějí údaje z karty."
    }
  ],
  "summary": "Když si nejste jistí, otevřete si stránky pošty sami nebo zavolejte na číslo z jejich oficiálního webu. Nikdy ne přes odkaz ve zprávě.",
  "sources": ["policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy"]
}
```

Pro sekci Zprávy se `message` liší: `app` („sms“ / „chat“), `from` (číslo nebo jméno), `inContacts` (true/false), `messages` (pole bublin, každá s `text`, případně `link`).

`target` odkazuje na část zprávy (`fromName`, `fromAddress`, `subject`, `body.N`, `button`, `link`, `attachment`, `from`, `messages.N`). Klikání je vázané na prvky, ne na souřadnice.

Kategorie hrozeb (pro statistiku nejčastějších chyb):
`odesilatel`, `odkaz-platba`, `casovy-tlak`, `zadost-o-udaje`, `vyhra-nabidka`, `priloha`, `jazyk-chyby`, `nezname-cislo`, `emocni-natlak`, `neobvykla-zadost`.

Pole `relatedArticle` ani jiné odkazy na články menestarosti.cz scénáře nemají.

`sources` je interní poznámka pro ověřování, v aplikaci se nezobrazuje.

### Pravidla pro obsah
- **Jen reálné situace z ČR.** Primární zdroje jsou oficiální varování: policie.gov.cz, nukib.gov.cz, cnb.cz, ceskaposta.cz a weby bank. `docs/hloubkovy_vyzkum_podvody_senior.md` slouží jen jako přehled a vodítko, ne jako ověřený zdroj. Nevymýšlej typy podvodů, které se v ČR nedějí.
- **Skutečné osobnosti nejmenuj** (ani u investičních podvodů, kde výzkum jména uvádí).
- **Pestrost:** v každé sekci střídej legendy (zásilka, banka, úřad a dávky, pokuta, výhra, exekuce, „vnuk / dítě v nouzi“, nové číslo, investice) i způsoby (odkaz, platba, žádost o kód, příloha, citový nátlak).
- **Počet hrozeb** se mezi scénáři liší (1–4).
- **Legitimní zprávy** musí být skutečně věrohodné (potvrzení objednávky, připomínka lékaře, zpráva od rodiny ze známého čísla…), ne triviálně nudné.
- **Názvy institucí v textu ano, loga a firemní grafika ne.**
- **Domény a telefonní čísla v podvodných zprávách smyšlené.** Tomáši u každé nové domény připomeň, ať ověří, že nepatří reálnému webu. Telefonní čísla používej zjevně neplatná nebo z rozsahu, který se nepřiděluje, a upozorni, že to má Tomáš ověřit.
- **Nezmiňuj číslo 7726** (nikde v aplikaci, i když ho výzkum uvádí) ani jiné postupy, které nejsou ověřené pro ČR.
- **Každý nový text je návrh k Tomášovu ověření.** Nevydávej ho za citaci skutečného podvodu.
- Tón vysvětlení: vykání, krátké věty, klidně, „soused u plotu“. Bez strašení, bez vykřičníků a bez frází revoluční, unikátní, komplexní, neváhejte, v dnešní uspěchané době, řešení na míru.
- `npm run prehled` vygeneruje `docs/prehled-scenaru.md`, čitelný přehled všech scénářů (text zprávy, hrozby, vysvětlení) pro Tomášovu kontrolu.

## 8. Body a historie hráče

### Bodování
- **Základní úroveň:** správné rozhodnutí = 2 body. Kolo 5 zpráv = max 10 bodů.
- **Pokročilá úroveň:** body za zprávu = body za rozhodnutí + body za označování.
  - rozhodnutí: správné = 2 body, špatné = 0. Body za rozhodnutí se nikdy nesnižují.
  - označování u podvodné zprávy: každé správně označené podezřelé místo +1, každé zbytečně označené místo −1. Součet za označování nikdy méně než 0.
  - body za správně označená místa hráč dostane **i při špatném rozhodnutí**
  - legitimní zpráva: rozhodnutí (2 nebo 0) + 2 body za označování, pokud hráč nic neoznačil. Jakékoli označení = 0 bodů za označování (nikdy do minusu).
  - skóre je vždy v celých číslech, žádné půlbody
  - příklad: podvod, správné rozhodnutí, 1 nalezená hrozba, 3 zbytečná označení → 2 + max(0, 1 − 3) = 2 body
- Maximum kola se spočítá z vybraných zpráv. **Hráč ho vidí před začátkem i během kola.**
- Formulace povzbudivé, ne známkovací. Místo „Chyba!“ třeba „Tohle místo stojí za druhý pohled.“

### Historie (`localStorage`, jen v prohlížeči hráče, přetrvává i mezi návštěvami)
- nejvyšší skóre pro každou sekci a úroveň (včetně maxima, ze kterého bylo dosaženo)
- počitadlo přehlédnutých hrozeb podle kategorie → „Nejčastěji vám unikalo: adresa odesílatele, spěch ve zprávě“
- počet odehraných kol
- ID zpráv z posledního kola v každé sekci (kvůli neopakování)
- Panel „Vítejte zpět“ na hlavní stránce: „Jsme rádi, že jste zase tady. Nejlepší výsledky: E-mail (pokročilá) 16 z 19 bodů… Nejčastěji vám unikalo: …“
- „Smazat moji historii“ s potvrzením: nenápadně úplně dole na hlavní stránce (ikona + text, sekce 5). Smaže skóre, chyby, počet kol i ID posledních kol.
- Veškerý přístup k `localStorage` obal do try/catch. Aplikace musí fungovat i bez něj (anonymní okno).

## 9. Vzhled (v duchu menestarosti.cz)

Hlavní barva je bílá, akcenty z palety Méně starostí. Aplikace musí být na první pohled rozpoznatelná jako Méně starostí: logo v hlavičce, název „Poznej podvod“. Simulované aplikace uvnitř jsou neutrální, aby bylo jasné, co je trénink a co naše stránka.

```css
:root {
  --color-white: #ffffff;       /* hlavní pozadí */
  --color-bg: #f7fafc;          /* sekundární plochy */
  --color-teal: #008080;        /* hlavní barva UI: tlačítka, odkazy, aktivní prvky */
  --color-dark: #2a2f35;        /* hlavička, tmavé plochy */
  --color-red: #ff4d4d;         /* JEN logo a značky chyb (kroužky, ikony) */
  --color-yellow: #ffb302;      /* žárovky nápovědy; vždy s tmavým textem */
  --color-text: #4a5568;        /* běžný text */
  --color-heading: #1a202c;     /* nadpisy */
  --font-heading: "Montserrat", system-ui, sans-serif;
  --font-body: "Lato", system-ui, sans-serif;
}
```

- Červená a žlutá nikdy jako barva textu na světlém pozadí (nedostatečný kontrast). Chybový stav = červená ikona + tmavý text.
- Tyrkysová na bílé (cca 4,8:1) je v pořádku pro text i tlačítka. Pro drobnější text zvaž tmavší odstín, aby prošel AAA.
- Písma hostuj lokálně ve `public/fonts/` (woff2), žádné Google Fonts CDN. Tomáš souhlasil se stažením Montserrat a Lato (řezy 400 a vyšší) **včetně sady latin-ext**. K nim patří licenční soubor OFL (`public/fonts/OFL.txt`). Nejsou to npm závislosti. Po stažení ověř, že se správně vykreslí všechny české znaky, malé i velké (ěščřžýáíéúůťďňó), i běžné speciální znaky („“ – … € Kč). Žádné náhradní písmo u diakritiky.
- Logo: v milníku 2 vyber jednu variantu z `docs/loga/` (`logo.png`, `logo-white-background.png`, `cerveno_bile.png`) podle toho, co se hodí ke zvolenému vzhledu. Zkopíruj ji do `public/` a volbu Tomášovi zdůvodni.
- Jen světlý režim, žádný tmavý režim podle systému.
- Patička: © Méně starostí, odkaz na Facebook (https://www.facebook.com/menestarosti), Zásady ochrany osobních údajů (https://menestarosti.cz/ochrana-osobnich-udaju/).
- Žádní maskoti, žádný dětský styl.

### Moderní styl

Aplikace má působit moderně, svěže a lákavě, jako současná kvalitní aplikace, ne jako web z devadesátých let. Zároveň musí zůstat čitelná pro seniory. Když se moderní trend a čitelnost střetnou, vyhrává čitelnost.

Ano:
- hodně volného prostoru, čisté rozvržení, jasná hierarchie (velké výrazné nadpisy Montserrat, klidný text Lato)
- zaoblené rohy (karty 16 px, tlačítka 12 px), jemné měkké stíny, karty a dlaždice
- dlaždice sekcí jako výrazné karty s velkou vlastní ikonou (inline SVG, jednotný styl, v barvách palety) a krátkým popisem
- plné, dobře viditelné tlačítka s výrazným stavem po klepnutí
- krátké plynulé přechody (150–250 ms) mezi obrazovkami a při odhalení vyhodnocení
- příjemná mikro-zpětná vazba: animovaná fajfka u správné odpovědi, jemné „zatřesení“ nebo zvýraznění u přehlédnuté hrozby (vše vypnuté při `prefers-reduced-motion`)
- průběh kola jako vizuální ukazatel (tečky nebo lišta), body jako výrazné číslo
- konzistentní mřížka rozestupů (násobky 8 px)
- ikony vlastní, inline SVG, žádné ikonové knihovny z CDN

Ne:
- tenké řezy písma (pod 400), šedý text na šedém pozadí, malé popisky
- průhlednosti a rozmazaná skla (glassmorphism), paralaxa, automaticky se točící karusely
- akce skryté jen pod najetím myši
- obecný „šablonový“ vzhled: fialové gradienty, generické ilustrace lidí, stock fotky

Než se začne stavět engine, připrav v milníku 2 hlavní stránku a výběr úrovně ve finálním vzhledu, aby ho Tomáš mohl schválit.

## 10. Přístupnost a čitelnost (povinné)

- **Respektuj systémovou velikost písma.** Jednotky `rem`/`em`, žádné pevné výšky boxů s textem, žádné `maximum-scale` ani zákaz zoomu ve viewportu. Rozložení musí vydržet 200% zvětšení textu bez překrývání a bez vodorovného posouvání (WCAG 1.4.4).
- Základní písmo minimálně 18 px při výchozím nastavení.
- Dotykové prvky minimálně 48 × 48 px, s mezerami.
- Kontrast min. 4,5:1 (AA), kde to jde 7:1 (AAA).
- Ovládání klávesnicí, viditelný focus, sémantické HTML, `aria-label` tam, kde text nestačí.
- Žádná akce jen přes swipe nebo pinch. Vždy i tlačítko.
- Žádný časový limit.
- `prefers-reduced-motion`, animace krátké a nepovinné.
- Funguje od šířky 320 px.
- Automatický test 200% písma je jen přiblížení (zvětšení základního písma přes CSS). Skutečné systémové písmo telefonu nasimulovat nejde, proto je povinná Tomášova ruční kontrola na telefonu s velkým systémovým písmem (milníky 7 a 8).

## 11. Soukromí

- Žádné cookies, analytika, externí skripty, fonty ani obrázky z cizích serverů.
- `localStorage` jen pro funkce, které hráč vidí (historie, skóre).
- Nic se neodesílá na server.

## 12. Testy (Playwright)

Projekty (zařízení): `Pixel 7`, `iPhone 13`, `Galaxy Tab S4` (nebo `iPad (gen 7)`), `Desktop Chrome` + mobil s viewportem 320 px.

Minimální sada:
- hlavní stránka: tlačítko Zpět na Méně starostí, logo, dlaždice sekcí, neaktivní dlaždice „Připravujeme“
- kolo vybere 5 zpráv, obsahuje 1–2 legitimní, se stejným `seed` vždy stejné pořadí
- základní úroveň: správné i špatné rozhodnutí → správné body a vyhodnocení
- pokročilá úroveň: označení všech hrozeb, přehlédnutá hrozba, zbytečné označení, legitimní zpráva bez označení i s označením, zrušení označení druhým klepnutím → body přesně podle sekce 8
- pokročilá úroveň: špatné rozhodnutí + správně označené hrozby → body za hrozby se připíšou; víc zbytečných označení než nalezených hrozeb → body za rozhodnutí zůstanou, za označování 0
- základní úroveň: upozornění po klepnutí na odkaz je stejné u podvodné i legitimní zprávy
- zobrazené maximum bodů odpovídá součtu
- modal „Na co si dát pozor?“ se otevře a **zavře** tlačítkem i Esc, hra pokračuje na stejném místě
- žárovka ve vyhodnocení otevře vysvětlení a to jde zavřít
- adresa odesílatele je v detailu e-mailu viditelná bez klepnutí a v pokročilé úrovni jde označit
- historie: po kole se uloží skóre a chyby, po obnovení stránky se zobrazí „Vítejte zpět“, smazání historie funguje
- obnovení stránky uprostřed kola → výběr úrovně, rozehrané kolo se neuloží
- neopakování: se stejnou historií nevybere další kolo zprávy z předchozího kola, pokud to banka dovolí
- stránka obsahuje `noindex` (do milníku 8), po milníku 8 už ne
- štítek TRÉNINK je viditelný na všech obrazovkách simulace
- 200% zvětšení textu: žádné vodorovné posouvání na 360 px
- validace obsahu: každý JSON má povinná pole, každý `target` odpovídá existující části zprávy, každá `category` je z povoleného seznamu, v každé sekci jsou alespoň 4 legitimní zprávy, žádný scénář neobsahuje „7726“ ani pole `relatedArticle`
- pojistka deploye (sekce 14): cesty s `..` nebo mimo `/poznej-podvod.menestarosti.cz` skončí chybou

Po testech Tomáš projde aplikaci ručně na svém telefonu s velkým systémovým písmem.

## 13. Milníky

1. **Příprava:** `git init`, Vite projekt, struktura složek, `.gitignore`, `.env.example`, `docs/`. Propojení s GitHubem přes GitHub CLI (`gh`). Podle Tomáše je nainstalované a přihlášené, ale při kontrole z Claude Code ho terminál nenašel, proto:
   1. `gh auth status`: ověří, že `gh` existuje a je přihlášené. Když ho terminál nezná, Tomáš zavře a znovu otevře terminál (a Claude Code), aby se načetla nová cesta k programům. Když ani pak ne, zeptej se.
   2. Před vytvořením repozitáře napiš název a počkej na OK.
   3. `gh repo create <název> --private --source . --remote origin`: vytvoří na GitHubu soukromý repozitář a propojí ho s místní složkou.
   4. Push až po OK.
   U každého příkazu jednou větou vysvětli, co dělá.
2. **Kostra, vzhled a první nasazení:** hlavička, patička, hlavní stránka s dlaždicemi a obrazovka výběru úrovně ve finálním moderním vzhledu (sekce 9), výběr loga z `docs/loga/`, stažení fontů. Do `index.html` přidej `<meta name="robots" content="noindex">`, aby vyhledávače nezaindexovaly nedodělanou verzi (bez `robots.txt` se zákazem, jinak by vyhledávač meta značku neviděl) → **Tomáš schválí vzhled.** Pak `scripts/deploy.mjs` s `--dry-run` a pojistkou a první nahrání na server, aby se problémy s hostingem ukázaly hned.
3. **Herní engine:** výběr úrovně, náhodný výběr kola se `seed`, bodování, modal nápovědy, vyhodnocení se žárovkami, konec kola, historie a „Vítejte zpět“. Zatím s jednou testovací zprávou.
4. **E-mailová aplikace + 3 vzorové scénáře** (2 podvody, 1 legitimní) → **Tomáš schválí.**
5. **Aplikace Zprávy (SMS + chat) + 3 vzorové scénáře** → **Tomáš schválí.**
6. **Doplnění obsahu** na 15–20 scénářů v každé sekci + `npm run prehled` → Tomáš ověří texty.
7. **Testy a kontrola** podle sekce 12, oprava nalezených chyb. Tomáš projde aplikaci ručně na telefonu s velkým systémovým písmem.
8. **Vydání:** **odstraň `noindex`** z `index.html` (a uprav test), nasazení, ruční kontrola na telefonu (s velkým systémovým písmem) a tabletu.

### Pozdější fáze (teď nedělat, jen počítat s nimi v architektuře)
- **Prohlížeč:** podvodné reklamy a bannery („Vyhráli jste“), investiční reklama se „známou osobností“ (bez skutečných jmen a fotek), falešné vyskakovací okno technické podpory, falešný e-shop.
- **QR platba:** kontrola příjemce a částky v simulované bankovní aplikaci před odesláním.
- **Telefonát:** textový rozhovor s větvenými volbami odpovědí. Falešný bankéř nebo policista, „bezpečný účet“, falešná technická podpora s instalací vzdáleného přístupu. Útočník silně tlačí (spěch, „nezavěšujte“, stupňování), bezpečná cesta je vždy zavěsit a ověřit si to jinak. Předem napsané repliky, žádná generativní AI.
- **Statistiky:** GA4 jen s cookie lištou se souhlasem, nebo vlastní anonymní počítadlo bez cookies (PHP + MySQL na hostingu).
- **Zvuk** u telefonátu.

Architektura musí umožnit přidat sekci tak, že přibude obrazovka simulované aplikace a složka se scénáři. Engine, bodování, historie, nápověda a vyhodnocení jsou společné.

## 14. Nasazení (`scripts/deploy.mjs`)

- Načte `.env` (`FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_REMOTE_DIR`).
- **Pojistka:** `FTP_REMOTE_DIR` nesmí obsahovat `..` a musí být **přesně** `/poznej-podvod.menestarosti.cz`, nebo začínat `/poznej-podvod.menestarosti.cz/` (pro případ, že soubory patří do podsložky, třeba `www`). Jinak skript skončí srozumitelnou chybou dřív, než se připojí, a nic nenahraje ani nesmaže.
- `--dry-run` vypíše, co by nahrál, a nic neodešle.
- Před nahráním spustí build. Když selže, nenahrává.
- Nahraje obsah `dist/` do `FTP_REMOTE_DIR`. Staré soubory maže až po úspěšném připojení a jen v této složce.
- Na konci vypíše adresu, kde si má Tomáš výsledek ověřit.

## 15. Skripty

- `npm run dev`: lokální vývojový server
- `npm run build`: sestavení do `dist/`
- `npm run preview`: náhled sestavené verze
- `npm test`: Playwright testy
- `npm run prehled`: přehled scénářů do `docs/prehled-scenaru.md`
- `npm run deploy` / `npm run deploy -- --dry-run`: nasazení / zkouška nasazení
