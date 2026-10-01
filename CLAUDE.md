# CLAUDE.md — Poznej podvod (poznej-podvod.menestarosti.cz)

## 1. O projektu

„Poznej podvod“ je webová aplikace pro seniory, na které si nacvičí rozpoznávání podvodů. Simuluje prostředí, které znají ze svého telefonu: e-mailovou schránku, SMS, WhatsApp, později i prohlížeč, QR platbu a telefonní hovor. Senior dostane zprávu a rozhodne, jestli je podvod. V pokročilé úrovni navíc označí konkrétní podezřelá místa. Pak dostane body a srozumitelné vysvětlení.

Projekt patří k dobrovolnické iniciativě Méně Starostí (menestarosti.cz), kterou vede Tomáš s manželkou Káťou. Hlavní web běží na WordPressu, ale tato aplikace je na něm úplně nezávislá. Je to samostatná stránka na vlastní subdoméně, s hlavním webem ji spojuje jen odkaz.

Cílová skupina:
- senioři 60+ (hlavně mobil a tablet, často velké systémové písmo, horší zrak a jemná motorika)
- jejich dospělé děti (40–55), které jim aplikaci pošlou nebo ji hrají s nimi

Smysl: ne zábava sama o sobě, ale bezpečné chování a důvěra ve vlastní úsudek. Když senior podobnou zprávu uvidí ve skutečném telefonu, má si vzpomenout: „Tohle jsem viděl v tréninku.“

Podklady ve složce `docs/`:
- `docs/brand.md`: značka, tón, cílová skupina. Pokud se v něčem rozchází s tímto souborem, platí CLAUDE.md.
- `docs/hloubkovy_vyzkum_podvody_senior.md`: výzkum podvodů na seniory v ČR, podklad pro obsah scénářů. **Soubor je jen lokální:** je v `.gitignore`, v repozitáři není (repozitář může být veřejný) a existuje jen na Tomášově disku. Kdo pracuje z čistého klonu, nemá ho. Je to výstup z AI vyhledávače a jeho zdroje nebyly ověřené. Obsahuje jména skutečných osobností, ta se do aplikace **nepřebírají** (sekce 7). Z tohoto souboru nic necituj do souborů, které jdou do repozitáře.
- `docs/napady-scenaru.md`: náměty na scénáře pro milníky 4–6, u každého odkaz na zdroj (sekce 7). Je v repozitáři.
- `docs/loga/`: tři varianty loga Méně Starostí (`logo.png`, `logo-white-background.png`, `cerveno_bile.png`), z nich se v milníku 2 vybere jedno (sekce 9).

Název značky se píše vždy **„Méně Starostí“** (velké „S“, stejně jako na webu), v aplikaci, v dokumentaci i v testech.

## 2. Jak se mnou pracovat (pro Claude Code)

Tomáš nepíše kód sám. Zadává, kontroluje a učí se pracovat v terminálu, Gitu a GitHubu. Proto:

1. **Komunikuj česky.** Česky jsou texty v aplikaci a commit zprávy. Kód, názvy souborů a proměnných a komentáře v kódu anglicky. Texty v aplikaci pěknou jednoduchou češtinou, které rozumí senior.
2. **Pracuj po milnících** (sekce 13), vždy jen na jednom. Před začátkem napiš ve 3–5 větách, co uděláš. Na konci napiš, jak si výsledek Tomáš ověří: konkrétní příkaz, adresu nebo co přesně má vidět.
3. **Příkazy vysvětluj.** U každého příkazu, který má Tomáš spustit sám, napiš jednou větou, co dělá. U Gitu a GitHubu ho veď krok za krokem, dělá to poprvé.
4. **Commity** mají českou zprávu („Milník 3: e-mailová aplikace a 3 vzorové scénáře“). Kdy commitovat, pushovat a nasazovat, určuje sekce 2a.
5. **Nepřidávej závislosti** mimo sekci 3 bez Tomášova souhlasu.
6. **Nikdy necommituj `.env`** ani nic s hesly. Jméno FTP účtu a jiné přihlašovací údaje nepiš do žádného souboru v repozitáři (repozitář může být veřejný), patří jen do `.env`.
7. **Obsah scénářů piš nejdřív jako vzorek 3 kusů.** Rozepisuj dál až po Tomášově schválení.
8. **Když si něčím nejsi jistý** (chování hostingu, reálné znění podvodu, právní otázka), řekni to. Nehádej.
9. **Příkazy spouštěj po jednom**, bez `cd` na začátku (pracovní složka je projekt) a bez spojování přes `;` nebo `&&`. Tomášova pojistka na čtení mimo projekt by jinak u každého příkazu chtěla potvrzení.
10. **Texty hry** (vše, co hráč čte mimo scénáře) jsou v jednom souboru `src/texts.js` a Tomáš je schválil. Změna znění = úprava tohoto souboru. Nové a změněné texty posílej Tomášovi ke schválení najednou v jedné dávce (sekce 2a), dřív než je zabuduješ. Čísla v textech vždy správně skloňuj pomocí `src/ui/format.js` (1 bod, 2 body, 5 bodů; 1 kolo, 2 kola, 5 kol; „z 19 bodů“).
11. **Soubory v projektu upravuj a vytvářej nástroji Edit a Write**, ne přes `sed`, `python`, `cat >` ani jiné zápisy v Bash. Bash jen pro `npm`, `git` a spouštění testů. Tomášova pojistka na čtení mimo projekt by jinak hlásila každou úpravu.
12. **Na server se nasazují jen texty a scénáře, které Tomáš schválil.** Kontrolu ve hře dělá Tomáš až po nasazení, přes internet na živé stránce.

## 2a. Samostatnost a kdy čekat na Tomáše (platí od 24. 9. 2026)

Cíl: pracuj co nejvíc samostatně. Zastav se jen v případech níže.

### Názvosloví (Tomáš, 1. 10. 2026, platí pro celý projekt)
- **Milník:** velký celek s vlastním plánem a diagramem v `docs/plany/`. Čísla v řadě podle sekce 13 a `docs/historie.md`.
- **Fáze:** číslované políčko v diagramu milníku. Fáze, kde se čeká na Tomáše, se jen označí „čeká na tebe“ a nečíslují se zvlášť. Slovo „zastávka“ se nepoužívá.
- **Krok:** jen číslovaný postup, který provádí Tomáš (návod, kontrolní seznam). V plánech se nepoužívá.

### Dělej bez ptaní
- Opravy chyb v kódu, CSS a testech, pokud nemění texty pro hráče ani pravidla hry.
- Lokální commity po každém uceleném kroku.
- Během práce spouštěj jen dotčené testy, celou sadu jednou před push.
- Push do GitHubu, pokud projde celá sada a automatická kontrola tajných údajů: v přidávaných souborech nesmí být .env, hesla, jméno FTP účtu ani přístupové údaje. Když kontrola něco najde, nepushuj a zastav se.
- Nasazení do veřejného vydání (viz níže).
- HTML diagram plánu v docs/plany/ dělej jen u plánu nového milníku nebo nové sekce hry, ne u drobných úkolů.
- Po dokončeném úkolu, před /clear, zapiš aktuální stav do sekce 16.

### Nasazení do veřejného vydání
- Po každém push nasaď sám. Vždy nejdřív --dry-run.
- **Nasazuje se jen z větve `main`** (Tomáš, 1. 10. 2026). Z větve `sekce-prohlizec` (a z žádné jiné větve) se nikdy nenasazuje. Push větve na GitHub kvůli záloze je povolený. Do `main` se větev spojuje jen po splnění podmínek v sekci 17 E (spojeno 1. 10. 2026, `4b25c70`).
- **Pozor na starší výpisy:** do 28. 9. 2026 se `--dry-run` k serveru nepřipojoval a mazání nevypisoval (jen obecnou větu „smazaly by se staré soubory ve složkách assets, fonts“). Konkrétní mazané soubory ukázalo až skutečné nasazení. Od opravy (sekce 14) se zkouška připojí jen ke čtení a vypíše přesně, co by nahrála a co by smazala.
- Po každém nasazení ověř, že `http://poznej-podvod.menestarosti.cz` vrací 301 s `Location` na `https://` (od 29. 9. 2026).
- **`.htaccess` a nasazení:** soubor je v `public/`, takže ho každé nasazení nahraje (přepíše ten na serveru). Skript ho **nikdy nesmaže**, ani kdyby v `dist/` chyběl: maže jen soubory přímo ve složkách `assets/` a `fonts/`, soubory v kořeni ne. Když se `.htaccess` na serveru změní ručně, přepíše ho další nasazení. Zkouška to ukáže jako „jiná velikost .htaccess“, a to je důvod zastavit se a zeptat se Tomáše.
- Když výpis obsahuje cokoli jiného než nahrání souborů a mazání starých souborů ve složkách assets a fonts, nebo skript ohlásí WordPress či jinou chybu, NENASAZUJ a pošli mi celý výpis.
- Do vydání musí stránka mít <meta name="robots" content="noindex">. Odstranit až na můj pokyn. Žádný robots.txt se zákazem: vyhledávač by pak stránku nepřečetl, `noindex` by neviděl a adresa by se mohla ve výsledcích objevit bez popisu (Tomášovo rozhodnutí 24. 9. 2026).
- Před veřejným vydáním (zveřejnění odkazu) toto pravidlo končí a nasazuje se jen na můj výslovný pokyn.

### Zastav se a čekej na mě jen když
1. Máš nové nebo změněné texty pro hráče. Sbírej je a pošli najednou v jedné dávce, ne po jednom. Návrhy scénářů dál chodí přes docs/navrhy-scenaru-*.md.
2. Narazíš na rozpor se schváleným rozhodnutím nebo se zásadami pro scénáře (sekce 7).
3. Rozhodnutí má víc rozumných variant a volba změní, co hráč uvidí nebo jak se hraje. Technické volby rozhoduj sám a napiš, co jsi zvolil.
4. Dry-run nebo kontrola tajných údajů ukáže něco nečekaného.

### Formát zprávy, když čekáš na mě
Každou zprávu, kde ode mě chceš rozhodnutí, začni tímto blokem. Stručně, dohromady nejvýš 8 řádků:

STAV PRO CHAT
- Kde jsme: milník N – [název], fáze X z Y – [název fáze] (případně „čeká na tebe“); hotovo: …; zbývá: … (fáze z diagramu milníku; když se plán změní a počet fází s ním, napiš to)
- Hotovo od minula: (commity, nasazeno ano/ne)
- Teď řeším: (jednou větou)
- Rozhodni: (očíslované otázky; texty pro hráče vždy doslovně, kde se zobrazí, zda platí pro podvod i legitimní zprávu)
- Moje doporučení: (u každé otázky jedna věta)

Pod blokem už nic dalšího nepiš, pokud se na to neptám. Implementaci, výpisy testů ani git status neposílej, pokud v nich není problém.

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
- Subdoména `poznej-podvod.menestarosti.cz`, vlastní složka `/poznej-podvod.menestarosti.cz`.
- Hlavní WordPress web ve složce `/menestarosti.cz`. **Na ten se nikdy nesahá.**
- **Samostatný FTP účet subdomény** (`FTP_HOST=hosting.subreg.cz`, jméno účtu je jen v `.env`, do repozitáře se nepíše). Jeho kořen `/` je přímo složka subdomény, bez WordPressu. Proto `FTP_REMOTE_DIR=/`. Tomáš ve FileZille ověřil, že složka je prázdná a že z ní web načítá soubory.
- Šifrované FTP (FTPS/TLS) funguje (Tomáš ověřil ve FileZille). Na nešifrované FTP nikdy nepřecházej bez souhlasu.
- **HTTPS funguje od 24. 9. 2026** (certifikát Let's Encrypt, platný do 23. 12. 2026). Web je na https://poznej-podvod.menestarosti.cz a zatím i na `http://`. Přesměrování http → https se řeší jako samostatný úkol (sekce 16).

## 5. Obrazovky a průběh

### Hlavní stránka („Poznej podvod“)
- Hlavička na všech obrazovkách: logo Méně Starostí, **vedle něj** (i na mobilu) název „Poznej podvod“ a pod názvem podtitul „Trénink pro seniory: jak poznat podvod v telefonu a na internetu“. Na mobilu je logo malé (40 px), aby hlavička zabírala co nejméně místa. Jen při velmi velkém písmu se logo přesune nad název.
- **Výrazné tlačítko „← Zpět na Méně Starostí“** (https://menestarosti.cz/hry-pro-senior/) je v hlavičce **jen na hlavní stránce**. Na ostatních obrazovkách (výběr úrovně, hra, vyhodnocení, konec kola) v hlavičce není; tam je vždy tlačítko pro krok zpět v aplikaci („Zpět na výběr tréninku“, „Zpět na výběr úrovně“ apod.).
- **Patička na všech obrazovkách** má nenápadný textový odkaz „menestarosti.cz“ (https://menestarosti.cz/), vedle odkazů na Facebook a Zásady ochrany osobních údajů.
- **Během hry (kolo, vyhodnocení, konec kola) je hlavička zmenšená**, aby zpráva měla na mobilu víc místa: menší logo a název, podtitul se nezobrazuje. Tlačítko pro krok zpět a štítek TRÉNINK musí zůstat vždy vidět (Tomáš schválil).
- Pokud hráč už dřív hrál: panel **„Vítejte zpět“**. Nejvyšší skóre v každé sekci a úrovni a nejčastější chyby (sekce 8).
- Dlaždice sekcí: **E-mail**, **Zprávy (SMS a WhatsApp)**. Budoucí sekce (Prohlížeč, QR platba, Telefonát) jako neaktivní dlaždice „Připravujeme“.
- Úplně dole na hlavní stránce (nad patičkou) nenápadný odkaz s ikonou **„Smazat moji historii“** s potvrzením (sekce 8). Zobrazí se, jen když nějaká historie existuje.
- Tlačítko „← Zpět na Méně Starostí“ vede na https://menestarosti.cz/hry-pro-senior/ (Tomáš ověřil, že existuje), odkaz v patičce na https://menestarosti.cz/. Jinak aplikace na obsah hlavního webu nenavazuje, žádné odkazy na články.

### Výběr úrovně
Po klepnutí na sekci:
- **Základní:** hráč jen rozhodne „Je to podvod“ / „Je to v pořádku“.
- **Pokročilá:** hráč nejdřív označí podezřelá místa, pak rozhodne.
Každá úroveň má krátký popis a **maximální počet bodů pro toto kolo**. Proto se zprávy kola vylosují už při otevření výběru úrovně.

### Kolo
- Kolo = **5 zpráv** náhodně vybraných z banky sekce (sekce 7).
- Hra začne hned. Nahoře je stále viditelné tlačítko **„Na co si dát pozor?“**. Otevře modal s nejčastějšími znaky podvodu v dané sekci. Modal se zavře tlačítkem „Zavřít a pokračovat“, klávesou Esc nebo klepnutím mimo. Hra pak pokračuje, kde byla.
- Nahoře je průběh („Zpráva 2 z 5“) a body („Body: 7 z 18“).
- Lišta s průběhem, body a nápovědou je nahoře přilepená jen tam, kde je dost místa. Na nízké obrazovce nebo s velkým písmem se nepřilepuje a odjede s obsahem (Tomáš schválil). Technicky: `@media (min-height: 40em)`, tj. od výšky okna asi 640 px při běžném písmu. Jestli to reaguje i na velké systémové písmo telefonu, není ověřené (sekce 13, milník 4).
- Odchod z rozehraného kola tlačítkem v aplikaci („Zpět na výběr úrovně“) se potvrzuje oknem: „Opravdu chcete kolo ukončit? Body se neuloží.“ Tlačítko Zpět v prohlížeči potvrzení nemá (nejde spolehlivě zachytit).
- Trvale viditelný štítek nad simulací: **„TRÉNINK: cvičná ukázka, nic se neodesílá“**. Nejde zavřít.
- Obnovení stránky uprostřed kola: hráč se vrátí na výběr úrovně, rozehrané kolo se neuloží do historie.
- Adresy: `#/` hlavní stránka, `#/<sekce>` výběr úrovně (vylosuje nové kolo), `#/<sekce>/kolo` kolo. Kolo je jen v paměti: adresa `#/…/kolo` bez rozehraného kola přesměruje na výběr úrovně. Odchod z kola jakoukoli cestou (i tlačítkem Zpět v prohlížeči) kolo zahodí, tlačítko Vpřed ho neobnoví.
- **Kontrola nesouladu v pokročilé úrovni** (Tomáš, 28. 9. 2026, texty v `DECISION_CHECK` v `src/texts.js`): „Je to podvod“ bez označeného místa, nebo „Je to v pořádku“ s označeným místem, otevře potvrzovací okno. Nadpis okna je samotný nesoulad („Nemáte označené žádné podezřelé místo“ / „Máte označená podezřelá místa“), štítek TRÉNINK se v okně neopakuje (je trvale v pruhu nahoře; Tomáš, 28. 9. 2026). První tlačítko je bezpečná cesta zpět ke zprávě („Označit místa“ / „Zpět ke zprávě“) a má fokus. Esc a klepnutí mimo okno znamenají také návrat. Druhé tlačítko („Ano, je to podvod“ / „Ano, je v pořádku“) pokračuje jako dřív. Text okna čtečka přečte jako popis okna (`aria-describedby`). Při souladu ani v základní úrovni se okno neobjeví. Bodování se nemění. Testy: `tests/decision-check.spec.js`, ostatní testy rozhodují přes `decide()` v `tests/helpers/game.js`, která okno potvrdí.
- Okna (nápověda, vysvětlení u žárovky, upozornění na odkaz, potvrzení) používají `src/ui/dialog.js` (prvek `<dialog>`): zavírají se tlačítkem, Esc i klepnutím mimo a fokus se vrátí na prvek, který okno otevřel. Potvrzovací okna mají fokus na bezpečné volbě („Hrát dál“, „Ponechat historii“). Dlouhé okno nápovědy začíná nahoře (fokus na nadpisu).
- Nápověda „Na co si dát pozor?“ je v liště kola i ve vyhodnocení. U e-mailu má 6 bodů (bod 2 „Oslovení“ přibyl v milníku 4; body 4 a 5 upravené v milníku 6: „Odkaz sám o sobě podvod není“, příloha, o které nic nevíte, je riziko i od známého odesílatele), u Zpráv také 6 (upravené v milníku 5: bod o odkazech říká „Odkaz sám o sobě podvod není“, instalace aplikace má vlastní bod), pod nimi poznámku o bezchybné češtině a radu (u Zpráv s číslem 7726 a radou zablokovat účet v chatu, u e-mailu bez nich).

### Vyhodnocení zprávy (po každé zprávě)
- Jestli rozhodl správně, kolik bodů získal a proč.
- Zpráva znovu zobrazená se **žárovkami** u všech podezřelých míst. Klepnutí na žárovku otevře vysvětlení (vždy zavíratelné).
- V pokročilé úrovni: co našel, co přehlédl, co označil zbytečně.
- U legitimní zprávy vysvětlení, podle čeho se dá poznat, že je v pořádku.
- Tlačítko „Další zpráva“.

### Konec kola
- Celkové body z maxima, porovnání s nejlepším výsledkem.
- Stručné shrnutí chyb v tomto kole.
- Tlačítka: „Hrát dalších 5“ (nových 5 náhodných zpráv), „Zpět na hlavní stránku“.

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
- Detail zprávy: jméno odesílatele nahoře, **adresa odesílatele je skrytá** jako v mobilu (Tomášovo rozhodnutí v milníku 4). Vedle jména je vždy viditelný prvek **„▾ zobrazit adresu“** (cílová plocha aspoň 48 × 48 px), který adresu ukáže. Chová se **stejně v základní i pokročilé úrovni** a platí pro **všechny** e-maily (kdyby se adresa skrývala jen u některých, prozradilo by to odpověď). Klepnutí na jméno adresu nezobrazí nikdy; v pokročilé úrovni jméno označí. Adresa je prostý text, **nikdy odkaz** (žádné `mailto:`). Ve vyhodnocení je adresa vidět vždy. Dále předmět, datum, text, případně příloha a tlačítko nebo odkaz. V pokročilé úrovni jde zobrazenou adresu označit stejně jako kteroukoli jinou část zprávy.
- V seznamu zpráv je u odesílatele vidět jen jméno.

### Zprávy (SMS a WhatsApp)
Jedna sekce, každý scénář má `app: "sms"` nebo `app: "chat"`:
- **SMS:** konverzace s číslem nebo textovým jménem odesílatele, bubliny, podtržený odkaz.
- **Chat (WhatsApp-like):** hlavička s profilovou fotkou (neutrální avatar, žádné fotky skutečných lidí), jméno nebo číslo, u neznámého čísla lišta „Toto číslo není ve vašich kontaktech: Přidat / Nahlásit a zablokovat“. Bubliny, případně hlasová zpráva jako neaktivní prvek.
- Rozhodnutí z milníku 5 (`src/apps/messages.js`):
  - **Bez seznamu konverzací:** hráč vidí rovnou otevřenou konverzaci.
  - **Odesílatel** je jen číslo, nebo jméno uloženého kontaktu (`inContacts: true`, v avataru jeho první písmeno). Nic se neodkrývá, žádné „zobrazit adresu“. Označit jde jako `from`. Výjimka: `fromMarkable: false` (milník 6, převzatý účet uloženého kontaktu). Odesílatel je pak obyčejný text, nejde označit a nestojí bod. Podezření k němu je tam oprávněné, ale není to hrozba.
  - **Štítek s datem** (milník 6): malý šedý štítek uprostřed chatu, formát den + čas („Út 18:05“, „Dnes 11:40“, „Včera 17:30“), vždy s velkým písmenem na začátku, žádné pevné datum. E-mail má datum dál s malým písmenem („dnes 10:03“). Buď jeden nad všemi bublinami (`message.date`), nebo před konkrétní bublinou (`messages.N.date`), třeba nad staršími bublinami a nad novou zprávou. Obojí najednou u první bubliny kontrola obsahu odmítne. Štítek není část zprávy, nejde označit a čtečka obrazovky ho čte jako text.
  - **Bublina je nejmenší část, kterou jde označit.** Odkaz v bublině je samostatná část vedle textu, nikdy vnořené tlačítko. SMS s jednou bublinou a odkazem má tedy nejvýš 3 hrozby.
  - **Lišta „není ve vašich kontaktech“** (jen chat) není část zprávy a nejde označit. Její tlačítka v obou úrovních ukážou stejné upozornění „Tohle je jen trénink, tlačítko nic nedělá…“. Ve vyhodnocení zůstane jen text bez tlačítek.
  - Dole je neaktivní pole „Zpráva“, jen jako dekorace (`aria-hidden`).
  - Rám telefonu `.phone` je společný pro obě aplikace (`phoneFrame` v `src/apps/parts.js`, styl v `game.css`).

**Rozhraní simulované aplikace** (dodržují ho `src/apps/email.js` a `src/apps/messages.js`, společné části jsou v `src/apps/parts.js`):
- funkce vrátí HTML zprávy ve třech režimech: `play` (základní úroveň), `mark` (pokročilá úroveň, označování), `review` (vyhodnocení)
- každá část zprávy má `data-target` se stejnou hodnotou jako `target` ve scénáři
- `play`: odkazy, tlačítka a přílohy jsou `<button data-action="notice">`
- `mark`: každá část je `<button data-mark="…" aria-pressed>` se štítkem „Označeno“ (ikona + text)
- `review`: u každé části s hrozbou žárovka `<button data-threat="index">`, v pokročilé úrovni stav části (Našli jste / Tohle místo stojí za druhý pohled / Označeno zbytečně)
- zpráva jako celek má `data-scenario-id` (používají ho testy)

Odkazy, tlačítka a přílohy nikam nevedou.
- **Základní úroveň:** klepnutí na ně ukáže u **všech** zpráv (podvodných i legitimních) stejné krátké upozornění, aby neprozradilo odpověď dřív, než hráč rozhodne: „Tohle je jen trénink, odkaz nikam nevede a nic se nestalo. Ve skutečnosti by vás podobný odkaz mohl zavést na nebezpečnou stránku, která se snaží získat vaše údaje.“ Příloha má vlastní text (`ATTACHMENT_NOTICE`, milník 6), opět stejný u všech zpráv a nesoucí pravidlo bodu 5 nápovědy: „Tohle je jen trénink, příloha se neotevřela a nic se nestalo. Ve skutečnosti by příloha, kterou nečekáte, mohla obsahovat škodlivý program. Platí to i u známého odesílatele.“ Tlačítka zůstávají u textu o odkazu.
- **Pokročilá úroveň:** označování je klepnutí na část zprávy (odesílatel, adresa, předmět, odstavec, odkaz, tlačítko, příloha, bublina). Označená část je viditelně zvýrazněná, druhé klepnutí označení zruší. Odkaz nebo tlačítko se tím jen označí, upozornění se nezobrazí.

## 7. Obsah scénářů

**Hlavní zásada hry:** hra nemá seniory vystrašit, ale naučit rozhodovat podle kontextu. Hráč se u každé zprávy ptá, co zpráva chce a jestli ji čekal, ne jestli „vypadá podezřele“. Proto:
- banka každé sekce má přibližně polovinu legitimních zpráv,
- každé kolo obsahuje aspoň jeden podvod a aspoň jednu legitimní zprávu,
- legitimní zprávy vyvracejí konkrétní falešná pravidla (odkaz, příloha, neznámé číslo, spěch nebo banka samy o sobě podvod nejsou),
- vysvětlení a shrnutí mají klidný tón, bez strašení.

Platí pro všechny současné i budoucí sekce hry.

Další zásady pro legitimní zprávy a všechny scénáře (Tomáš, 25. 9. 2026):
- **Uložené číslo nebo známé jméno odesílatele nikdy není ve vysvětlení legitimní zprávy důvodem důvěry.** Číslo jde podvrhnout, účet převzít. Důvodem je vždy to, co zpráva chce.
- **Legitimní zpráva nesmí jako důvod důvěry uvádět, že nemá odkaz nebo přílohu.**
- **Scénáře nesmí obsahovat rady nebo chování, které jsou samy nebezpečné** (klíč ve schránce, sdělování, kdy je byt prázdný, apod.).
- **Oslovení:** obecné oslovení („Vážený kliente“) u zprávy od firmy, jejímž jste klientem, je varovný signál a nápověda k němu smí vést. Oslovení jménem ale není důkaz, že zpráva je pravá (jméno se dá zjistit, viz `email-06`). Vysvětlení legitimních zpráv proto jméno nikdy neuvádějí jako důvod důvěry.
- **Gramatické chyby** (Tomáš, 28. 9. 2026) smí být stopou podvodu jen u zpráv, které se vydávají za instituci (úřad, banka, firma). U zpráv od soukromých osob chyby nic neznamenají (člověku nemusí jít čeština, píše rychle na mobilu) a vysvětlení je nikdy neuvádí jako důvod podezření. Ani u institucí nesmí být chyby jedinou stopou a bezchybný text nezaručuje, že zpráva je pravá.

### Banka zpráv
- Zásoba (změněno 28. 9. 2026): **E-mail 12 scénářů (6 podvodů, 6 legitimních)**, 12. je `email-12` (falešná ČSSZ s chybami v češtině). **Zprávy 11 scénářů** (5 podvodů, 6 legitimních, aspoň 5 legitimních). Náměty jsou v `docs/napady-scenaru.md`.
- Kolo vybere náhodně 5 zpráv. **V každém kole jsou 2–3 legitimní**, tedy vždy aspoň 2 podvody a 2 legitimní (Tomášovo rozhodnutí 25. 9. 2026, hlavní zásada výše). Počet se záměrně mění, 2 nebo 3 náhodně: hráč nesmí jít odpočítávat („už byly dva podvody, tak zbytek je v pořádku“), musí posoudit každou zprávu. Pro losování je v sekci potřeba aspoň 3 podvody a 2 legitimní (`DRAW_MINIMUM`). Zprávy z předchozího kola stejné sekce se v dalším kole neopakují, pokud to banka dovolí. Platí i mezi návštěvami (ID posledního kola se ukládá do `localStorage`, zvlášť pro každou sekci).
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

Pro sekci Zprávy se `message` liší: `app` („sms“ / „chat“), `from` (číslo nebo jméno), `inContacts` (true/false), `messages` (pole bublin, každá s `text`, případně `link` a `date` = štítek před bublinou) a nepovinně `date` („Dnes 10:24“, štítek nad bublinami) a `fromMarkable` (`false` = odesílatel nejde označit, sekce 6).

`target` odkazuje na část zprávy (`fromName`, `fromAddress`, `subject`, `body.N`, `button`, `link`, `attachment`, `from`, `messages.N`, `messages.N.link` = odkaz uvnitř bubliny). Klikání je vázané na prvky, ne na souřadnice. Volitelné pole `alsoTargets` (pole dalších částí) naváže jednu hrozbu na víc částí zprávy, např. `"target": "fromAddress", "alsoTargets": ["fromName"]`: označení kterékoli z nich je jeden zásah, žárovka a „Tohle místo stojí za druhý pohled“ jsou u hlavního `target`.

Kontrola obsahu (`src/engine/validate.js`) běží při každém `npm run build` a chybný scénář build zastaví s českým popisem chyby. Při `npm run dev` běží jen jednou, při startu serveru (Vite volá `buildStart` jen při startu, `docs/audit-dokumentace.md`, nález 6): scénář upravený za běhu `npm run dev` se zkontroluje až při dalším startu nebo buildu. Kromě povinných polí hlídá:
- `id` = název souboru bez `.json`, `section` = název složky, ID jsou jedinečná napříč sekcemi
- podvod má 1–4 hrozby, **legitimní zpráva nemá žádnou hrozbu** (`threats: []`)
- žádný `target` se nesmí opakovat a musí odpovídat existující části zprávy (volitelné části jako `button` jen, když ve zprávě jsou)
- v sekci je dost zpráv na losování (aspoň 3 podvody a 2 legitimní). Cíl zásoby pro každou sekci (`CONTENT_GOAL` v `src/engine/validate.js`) hlídá test v `tests/unit/content.spec.js`.
Losování se `seed`: jedna řada náhodných čísel na jedno načtení stránky. Kolo se losuje při otevření výběru úrovně, další kolo („Hrát dalších 5“) pokračuje ve stejné řadě. Bez `?seed=` je losování náhodné.

Kategorie hrozeb (pro statistiku nejčastějších chyb):
`odesilatel`, `odkaz-platba`, `casovy-tlak`, `zadost-o-udaje`, `vyhra-nabidka`, `priloha`, `jazyk-chyby`, `nezname-cislo`, `emocni-natlak`, `neobvykla-zadost`, `qr-kod`, `instalace-aplikace`, `obecne-osloveni` (obecné oslovení bez jména, zdroj NÚKIB; přibyla v milníku 4).

Pole `relatedArticle` ani jiné odkazy na články menestarosti.cz scénáře nemají.

`sources` je interní poznámka pro ověřování, v aplikaci se nezobrazuje.

### Pravidla pro obsah
- **Jen reálné situace z ČR.** Primární zdroje jsou oficiální varování: policie.gov.cz, nukib.gov.cz, cnb.cz, ceskaposta.cz a weby bank. `docs/hloubkovy_vyzkum_podvody_senior.md` (jen lokální, sekce 1) slouží jen jako přehled a vodítko, ne jako ověřený zdroj. Nevymýšlej typy podvodů, které se v ČR nedějí.
- **Skutečné osobnosti nejmenuj** (ani u investičních podvodů, kde výzkum jména uvádí).
- **Pestrost:** scénáře v sekci střídají tři věci, aby se kombinace neopakovaly:
  - **za koho se podvodník vydává:** pošta, úřad, banka, energie, pojišťovna, rodina, kamarád, e-shop, bazar;
  - **co chce:** kliknout, zaplatit, zadat kód, otevřít přílohu, naskenovat QR, nainstalovat aplikaci, odpovědět;
  - **jaký tlak používá:** strach, spěch, zvědavost, soucit, výhra.
- **Čeština:** aspoň polovina podvodů v každé sekci je psaná **bezchybnou češtinou**. Podvodníci dnes píšou s pomocí AI a pravopis už nic neprozradí. Chyby v jazyce (`jazyk-chyby`) jsou jen u menšiny podvodů a nikdy nejsou jedinou stopou.
- **Obtížnost:** část podvodů je zjevná (divná adresa, chyby, výhra), část těžká: věrohodný odesílatel i adresa, slušný tón, a prozradí je teprve to, co chtějí (kód, celé číslo karty, přílohu, platbu jinou cestou než obvykle).
- **Počet hrozeb** se mezi scénáři liší (1–4).
- **Skutečné osobnosti** se nejmenují dál, i když je zdroj uvádí.
- **Legitimní zprávy** musí být skutečně věrohodné (potvrzení objednávky, připomínka lékaře, zpráva od rodiny ze známého čísla…), ne triviálně nudné.
- **Názvy institucí v textu ano, loga a firemní grafika ne.**
- **Podvržená adresa skutečného úřadu nebo firmy ne.** Rozhodnutí k námětu E4 (milník 4): doména fs.gov.cz má DMARC s politikou quarantine (ověřeno 23. 9. 2026: `p=quarantine; pct=100`), takže podvržená adresa `epodpora@fs.gov.cz` by skončila ve spamu, ne v doručené poště. Scénář s podvrženou skutečnou adresou proto neodpovídá realitě. E4 je místo toho podvod přes **zobrazované jméno**: jméno „Finanční správa“, skutečná adresa cizí a nesouvisející (smyšlená soukromá adresa na gmail.com, znění schvaluje Tomáš). Vyhodnocení začíná „Jméno odesílatele si může napsat kdokoli. Skutečná adresa byla …“. Netvrď nic typu „Finanční správa nikdy nežádá…“, pokud to není ve zdroji; místo toho „Když si nejste jistí, otevřete daňový portál sami, ne přes odkaz ve zprávě.“
- **Jedna hrozba může ležet na dvou částech zprávy** (u E4 jméno i adresa odesílatele): označení kterékoli z nich nebo obou je jeden zásah, žádné dvojité body a žádné „označeno zbytečně“. Zapisuje se polem `alsoTargets` (Tomáš schválil v milníku 4).
- **Domény a telefonní čísla v podvodných zprávách smyšlené.** Výjimku (podvržený odesílatel se skutečnou adresou úřadu, např. náměty z `docs/napady-scenaru.md`) použij jen po Tomášově výslovném schválení u konkrétního scénáře. Tomáši u každé nové domény připomeň, ať ověří, že nepatří reálnému webu. Ověřování, jestli je smyšlená doména volná, je jen kontrola pro nás jako autory a do textů pro hráče (vysvětlení, shrnutí, nápověda) nepatří: hra seniorům neradí zjišťovat, jestli doména existuje nebo komu patří, rada zůstává „adresu webu napište sami, nechoďte přes odkaz ve zprávě“. Telefonní čísla používej zjevně neplatná nebo z rozsahu, který se nepřiděluje, a upozorni, že to má Tomáš ověřit.
- **Číslo 7726** je ověřené pro ČR: Policie ČR na policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy uvádí „reportujte ji svému operátorovi na jednotnou linku 7726 (cestou SMS zprávy)“. Ve vysvětleních u **podvodných SMS** ho uváděj jako radu, touto větou: „Podezřelou SMS můžete přeposlat na číslo 7726, tím ji nahlásíte operátorovi.“ (od `zpravy-05`, 25. 9. 2026). Stránka o zablokování odesílatele nic neříká, doslova jen „Operátor následně může učinit další opatření.“ Starší věta „…operátor pak odesílatele zablokuje.“ se 25. 9. 2026 nahradila i ve `zpravy-01` a v radě nápovědy Zpráv (`HINTS.zpravy.advice`), Tomášovo rozhodnutí. Jen u SMS, ne u e-mailu ani chatu (WhatsApp), tam to nefunguje. Jiné postupy, které nejsou ověřené pro ČR, neuváděj.
- **Každý nový text je návrh k Tomášovu ověření.** Nevydávej ho za citaci skutečného podvodu.
- **Každé tvrzení za firmu nebo úřad musí mít zdroj** („Finanční správa podle svého varování neposílá…“, „ČEZ posílá e-maily z @cez.cz“). Bez zdroje žádné takové tvrzení, jen obecná rada („Když si nejste jistí, otevřete jejich stránky sami, ne přes odkaz ve zprávě.“). Zdroj patří do `sources` scénáře.
- **Nápověda nesmí být v rozporu se scénáři.** Hráč, který radu z nápovědy „Na co si dát pozor?“ poslechne, nesmí být potrestán (např. bodem dolů za označení místa, na které nápověda upozorňuje). Když nový scénář s nápovědou nesedí, uprav scénář, nebo navrhni Tomášovi změnu nápovědy.
- **Povinná kontrola každého nového scénáře (od milníku 5): každá část, kterou by hráč podle nápovědy označil, musí ležet na hrozbě** (`target` nebo `alsoTargets`). Týká se to i částí, které vypadají podezřele kvůli zápisu (divný formát částky, pravopis), předmětu se spěchem, výzvy ke klepnutí na odkaz nebo podpisu s falešným jménem. Automaticky to hlídat nejde, proto projdi části zprávy jednu po druhé proti bodům nápovědy. Hlídané případy u skutečných scénářů jsou v `tests/unit/scoring.spec.js` („parts the hint leads to are hits“). U legitimní zprávy nápověda k označení nic vést nesmí.
- **Každý podvod má aspoň jednu nevinnou část, ke které nápověda nevede** (neutrální pozdrav, dotaz, poděkování, oslovení jménem, uložený kontakt…). Označení takové části je „zbytečné“ (−1), takže strategie „označit všechno“ nedostane plný počet bodů (Tomášovo rozhodnutí po milníku 5, varianta A). Nevinná část nesmí být nic, k čemu vede nápověda (pravidlo výše má přednost). **Výjimka:** SMS s jednou bublinou a odkazem (má jen 3 části: odesílatel, bublina, odkaz).
- **Legitimní zprávy nesmí učit falešná pravidla** jako „každý odkaz = podvod“ nebo „bez oslovení jménem = vždy podvod“. Vyhodnocení legitimní zprávy vysvětlí, podle čeho se pozná, že je pravá, a že jeden znak sám o sobě nestačí.
- **Texty pro seniory bez odborných slov** (ne „phishing“, „doména“, „malware“, „DMARC“; místo toho „adresa za zavináčem“, „škodlivý program“).
- Tón vysvětlení: vykání, krátké věty, klidně, „soused u plotu“. Bez strašení, bez vykřičníků a bez frází revoluční, unikátní, komplexní, neváhejte, v dnešní uspěchané době, řešení na míru.
- `npm run prehled` vygeneruje `docs/prehled-scenaru.md`, čitelný přehled všech scénářů (text zprávy, hrozby, vysvětlení) pro Tomášovu kontrolu. Generuje se jen ze souborů v `src/content/` (`scripts/prehled.mjs`), ručně se neupravuje. Po každé změně scénáře ho vygeneruj znovu.
- **Legitimní zpráva má pole `refutes`**: falešné pravidlo, které vyvrací, ve tvaru „Když …, je to podvod.“ (bez uvozovek). Ve hře se nezobrazuje, jen v přehledu. Kontrola obsahu ho u legitimních zpráv vyžaduje a u podvodů zakazuje.

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
- nejvyšší skóre pro každou sekci a úroveň (včetně maxima, ze kterého bylo dosaženo). **Lepší je vyšší procento** (body / maximum); při shodě procenta vyhrává kolo s vyšším maximem. Zobrazuje se „15 z 16 bodů“, ne procenta.
- počitadlo přehlédnutých hrozeb podle kategorie → „Nejčastěji vám unikalo: adresa odesílatele, spěch ve zprávě“
  - pokročilá úroveň: každá neoznačená hrozba podvodné zprávy (bez ohledu na rozhodnutí)
  - základní úroveň: když hráč podvod označí za „v pořádku“, započítají se všechny hrozby té zprávy
  - legitimní zpráva označená za podvod se do počitadla nepočítá (nemá kategorii)
- počet odehraných kol
- ID zpráv z posledního kola v každé sekci (kvůli neopakování)
- Panel „Vítejte zpět“ na hlavní stránce: „Jsme rádi, že jste zase tady. Nejlepší výsledky: E-mail (pokročilá) 16 z 19 bodů… Nejčastěji vám unikalo: …“
- „Smazat moji historii“ s potvrzením: nenápadně úplně dole na hlavní stránce (ikona + text, sekce 5). Smaže skóre, chyby, počet kol i ID posledních kol.
- Veškerý přístup k `localStorage` obal do try/catch. Aplikace musí fungovat i bez něj (anonymní okno).
- Klíč v `localStorage`: `poznej-podvod:history:v1`. Poškozená nebo neznámá data se berou jako prázdná historie.
- Známé chování: bez `localStorage` (anonymní okno) si hra nic nepamatuje, takže každé kolo hlásí „To je váš nejlepší výsledek“. Je to v pořádku.
- V panelu „Vítejte zpět“ se sekce píšou krátce: „E-mail“, „Zprávy“ (pole `shortTitle` v `src/sections.js`).

## 9. Vzhled (v duchu menestarosti.cz)

Vzhled vychází z hlavního webu menestarosti.cz: bílá hlavička, světle šedá stránka, bílé karty se stínem, červené nadpisy sekcí a červená tlačítka. Aplikace musí být na první pohled rozpoznatelná jako Méně Starostí: logo v hlavičce, název „Poznej podvod“. Simulované aplikace uvnitř jsou neutrální, aby bylo jasné, co je trénink a co naše stránka.

```css
:root {
  --color-white: #ffffff;       /* hlavička, karty, patička */
  --color-bg: #f7fafc;          /* pozadí stránky */
  --color-red: #ff4d4d;         /* logo a dekorativní značky; nikdy jako text ani pod textem */
  --color-red-dark: #c93030;    /* tlačítka, nadpisy sekcí, název v hlavičce, odkazy */
  --color-red-hover: #a82626;   /* stisknuté / najeté červené tlačítko */
  --color-red-tint: #fbeaea;    /* podklad červených ikon, najeté obrysové tlačítko */
  --color-green: #1e7b34;       /* vyhodnocení: hráč odpověděl správně (ikona, rámeček); jako text na bílé 5,3:1 */
  --color-green-tint: #e8f5eb;  /* světlý podklad správné odpovědi */
  --color-yellow-tint: #fff6dc; /* žlutý rámeček shrnutí „Co si z toho vzít“ */
  --color-dark: #2a2f35;        /* tmavé drobnosti (štítek „Připravujeme“) */
  --color-yellow: #ffb302;      /* žárovky nápovědy; vždy s tmavým textem */
  --color-text: #4a5568;        /* běžný text */
  --color-heading: #1a202c;     /* nadpisy karet, podtitul v hlavičce */
  --font-heading: "Montserrat", system-ui, sans-serif;
  --font-body: "Lato", system-ui, sans-serif;
}
```

- **Hlavička** je bílá (žádná tmavá ani červená plocha): logo, vedle něj název „Poznej podvod“ červeně (`--color-red-dark`), pod ním podtitul tmavým textem. Tlačítko „← Zpět na Méně Starostí“ (jen na hlavní stránce, sekce 5) je výrazné, ale ve stejném stylu: červený obrys a červený tučný text na bílé, po najetí nebo stisku plné červené s bílým textem.
- **Stránka** má světle šedé pozadí (`--color-bg`), obsah je v bílých kartách se stínem. Patička je bílá.
- **Nadpisy sekcí** (např. „Vyberte, co chcete trénovat“, „Brzy přibude“, „Jak trénink probíhá“, název sekce na výběru úrovně) jsou červené (`--color-red-dark`, třída `.section-title`). **Nadpisy karet** jsou tmavé (`--color-heading`).
- **Tlačítka** jsou plná červená `--color-red-dark` s bílým tučným textem (kontrast 5,3:1). Vedlejší tlačítka mají červený obrys a červený text na bílé. Světlá `--color-red` (#ff4d4d) má s bílým textem jen 3,3:1, proto se na tlačítka ani text nepoužívá.
- **Tlačítka rozhodnutí ve hře** („Je to podvod“ / „Je to v pořádku“) mají **stejný neutrální vzhled**, ne červený. Červená se čte jako „nebezpečí“ a nesmí napovídat odpověď.
- **Ikony v aktivních kartách** (dlaždice sekcí, výběr úrovně) jsou červené `--color-red-dark` na světle červeném podkladu (`--color-red-tint`). Ikony neaktivních dlaždic „Připravujeme“ jsou šedé, aby bylo vidět, že jsou teprve v plánu.
- **Barvy ve vyhodnocení** (Tomáš, 28. 9. 2026; nahradily tyrkysovou fajfku): barva ukazuje, **jak hráč odpověděl**, ne jestli zpráva byla podvod. Správně = zelená (`--color-green`: rámeček výsledku se světle zeleným podkladem, u části proužek, podklad a ikona), špatně = červená (`--color-red-dark`) jen mírně: rámeček nebo proužek a ikona, nikdy červený blok. U části je „Našli jste“ zelené, „Tohle místo stojí za druhý pohled“ a „Označeno zbytečně“ červené. Vždy s ikonou a textem. Kontrast hlídá `tests/evaluation-colors.spec.js`. Zelená ne na tlačítka ani odkazy.
- **Shrnutí „Co si z toho vzít“** je ve žlutém rámečku: okraj `--color-yellow`, podklad `--color-yellow-tint`, tmavý text.
- **Chybové značky ve hře nikdy nespoléhají jen na barvu.** Každý chybový nebo varovný stav má vždy ikonu s výrazným tvarem (např. křížek v kroužku, vykřičník v trojúhelníku) a srozumitelný text. Správná odpověď stejně: fajfka + text, ne jen zelená. Červená sama o sobě nesmí nést význam, protože ji část seniorů špatně rozliší a v aplikaci je zároveň barvou tlačítek. (Platí i pro sekci 10.)
- Žlutá nikdy jako barva textu na světlém pozadí (nedostatečný kontrast). Chybový stav = ikona + tmavý text.
- Písma hostuj lokálně ve `public/fonts/` (woff2), žádné Google Fonts CDN. Tomáš souhlasil se stažením Montserrat a Lato (řezy 400 a vyšší) **včetně sady latin-ext**. K nim patří licenční soubor OFL (`public/fonts/OFL.txt`). Nejsou to npm závislosti. Po stažení ověř, že se správně vykreslí všechny české znaky, malé i velké (ěščřžýáíéúůťďňó), i běžné speciální znaky („“ – … € Kč). Žádné náhradní písmo u diakritiky. Ověřuje to test `tests/fonts.spec.js`.
  - Montserrat jsou **statické řezy 700 a 800** z oficiálního repozitáře https://github.com/JulietaUla/Montserrat (`fonts/webfonts`, poslední změna 7. 11. 2024), soubory `public/fonts/montserrat-700.woff2` a `montserrat-800.woff2`, licence projektu `public/fonts/OFL-Montserrat.txt`. Web jiné tloušťky Montserratu nepoužívá (změřeno na vykreslených obrazovkách 28. 9. 2026). Dřívější proměnný řez z Google Fonts (400–800) kreslil WebKit na Windows tence, i když šířky měl tučné, proto se 28. 9. 2026 nahradil. Staré soubory `montserrat-var-*.woff2` jsou smazané (Tomášovo OK, 28. 9. 2026). Že jsou nadpisy vizuálně tučné, hlídá test „Montserrat headings are really drawn bold“ v `tests/fonts.spec.js` (podíl tmavých bodů oproti Lato 400).
  - **Lato je verze 2.015 „LatoLatin“ z oficiálního webu latofonts.com**, ne z Google Fonts. Google Fonts nabízí jen Lato 1.0, kterému chybí ě č ř ů ť ď ň.
- Logo: `public/logo.png` (kopie `docs/loga/logo.png`, červené srdce a šedá ruka na průhledném pozadí). Varianta `cerveno_bile.png` má bílou ruku a na bílé hlavičce by nebyla vidět.
- Jen světlý režim, žádný tmavý režim podle systému.
- Patička: © Méně Starostí, nenápadný odkaz „menestarosti.cz“ (https://menestarosti.cz/), odkaz na Facebook (https://www.facebook.com/menestarosti), Zásady ochrany osobních údajů (https://menestarosti.cz/ochrana-osobnich-udaju/).
- Žádní maskoti, žádný dětský styl.

### Moderní styl

Aplikace má působit moderně, svěže a lákavě, jako současná kvalitní aplikace, ne jako web z devadesátých let. Zároveň musí zůstat čitelná pro seniory. Když se moderní trend a čitelnost střetnou, vyhrává čitelnost.

Ano:
- hodně volného prostoru, čisté rozvržení, jasná hierarchie (velké výrazné nadpisy Montserrat, klidný text Lato)
- zaoblené rohy (karty 16 px, tlačítka 12 px), jemné měkké stíny, karty a dlaždice
- dlaždice sekcí jako výrazné karty s velkou vlastní ikonou (inline SVG, jednotný styl, v barvách palety) a krátkým popisem; neaktivní dlaždice „Připravujeme“ bez bílé plochy a stínu, s čárkovaným okrajem
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
- Dotykové prvky minimálně 48 × 48 px, s mezerami. Klepací plocha aspoň 48 px platí i u prvků, které vizuálně vypadají menší (např. „zobrazit adresu“): řeší se neviditelnou plochou kolem, ne zmenšením klepací plochy.
- **Přístupné jméno ovládacího prvku musí obsahovat jeho viditelný text** (WCAG 2.5.3), aby ho našel i člověk, který ovládá telefon hlasem. Např. tlačítko s textem „Doručená pošta“ má přístupné jméno „Zpět do schránky Doručená pošta“, ne „Zpět do Doručené pošty“.
- Kontrast min. 4,5:1 (AA), kde to jde 7:1 (AAA).
- Význam nikdy jen barvou (WCAG 1.4.1): chyba, správná odpověď, označené místo i přehlédnutá hrozba mají vždy ikonu s výrazným tvarem a text (sekce 9).
- Ovládání klávesnicí, viditelný focus, sémantické HTML, `aria-label` tam, kde text nestačí.
- Žádná akce jen přes swipe nebo pinch. Vždy i tlačítko.
- Žádný časový limit.
- `prefers-reduced-motion`, animace krátké a nepovinné.
- Funguje od šířky 320 px.
- Automatický test 200% písma je jen přiblížení (zvětšení základního písma přes CSS). Skutečné systémové písmo telefonu nasimulovat nejde, proto je povinná Tomášova ruční kontrola na telefonu s velkým systémovým písmem (milníky 7 a 9).

## 11. Soukromí

- Žádné cookies, analytika, externí skripty, fonty ani obrázky z cizích serverů.
- `localStorage` jen pro funkce, které hráč vidí (historie, skóre).
- Nic se neodesílá na server.

## 12. Testy (Playwright)

Projekty (zařízení): `Pixel 7`, `iPhone 13`, `Galaxy Tab S4` (nebo `iPad (gen 7)`), `Desktop Chrome` + mobil s viewportem 320 px.

Minimální sada:
- hlavní stránka: tlačítko Zpět na Méně Starostí, logo vedle názvu, dlaždice sekcí, neaktivní dlaždice „Připravujeme“
- ostatní obrazovky: tlačítko Zpět na Méně Starostí v hlavičce není (ani po návratu z hlavní stránky a zpět), je tam tlačítko pro krok zpět; v patičce je odkaz „menestarosti.cz“
- kolo vybere 5 zpráv, obsahuje 2–3 legitimní (a v testu losování se musí objevit obojí), se stejným `seed` vždy stejné pořadí
- základní úroveň: správné i špatné rozhodnutí → správné body a vyhodnocení
- pokročilá úroveň: označení všech hrozeb, přehlédnutá hrozba, zbytečné označení, legitimní zpráva bez označení i s označením, zrušení označení druhým klepnutím → body přesně podle sekce 8
- pokročilá úroveň: špatné rozhodnutí + správně označené hrozby → body za hrozby se připíšou; víc zbytečných označení než nalezených hrozeb → body za rozhodnutí zůstanou, za označování 0
- základní úroveň: upozornění po klepnutí na odkaz je stejné u podvodné i legitimní zprávy
- zobrazené maximum bodů odpovídá součtu
- modal „Na co si dát pozor?“ se otevře a **zavře** tlačítkem i Esc, hra pokračuje na stejném místě
- žárovka ve vyhodnocení otevře vysvětlení a to jde zavřít
- adresa odesílatele je v detailu e-mailu skrytá, ukáže ji prvek „▾ zobrazit adresu“, stejně v základní i pokročilé úrovni; klepnutí na jméno ji nezobrazí; v pokročilé úrovni jde zobrazenou adresu označit; ve vyhodnocení je vidět vždy
- adresa odesílatele není odkaz (žádný `<a>`, žádné `mailto:`)
- historie: po kole se uloží skóre a chyby, po obnovení stránky se zobrazí „Vítejte zpět“, smazání historie funguje
- obnovení stránky uprostřed kola → výběr úrovně, rozehrané kolo se neuloží
- neopakování: se stejnou historií nevybere další kolo zprávy z předchozího kola, pokud to banka dovolí
- stránka obsahuje `noindex` (do milníku 9, Vydání), po milníku 9 už ne
- štítek TRÉNINK je viditelný na všech obrazovkách simulace
- 200% zvětšení textu: žádné vodorovné posouvání na 360 px
- validace obsahu: každý JSON má povinná pole, každý `target` odpovídá existující části zprávy, každá `category` je z povoleného seznamu, v každé sekci je zásoba podle cíle (E-mail 12 scénářů: 6 podvodů a 6 legitimních, Zprávy 11 scénářů, z nich aspoň 5 legitimních) (v milníku 3 s testovacími zprávami se kontroluje jen minimum pro losování), žádný scénář nemá pole `relatedArticle`
- pojistky deploye (sekce 14): cesty s `..` nebo mimo povolené hodnoty skončí chybou; cílová složka s WordPressem (`wp-config.php`, `wp-admin`, `wp-content`, `wp-includes`) skončí chybou

Po testech Tomáš projde aplikaci ručně na svém telefonu s velkým systémovým písmem.

Jak jsou testy postavené:
- Testy běží proti sestavené verzi (`npm run build` + `vite preview` na portu 4173), ne proti vývojovému serveru.
- Projekt `unit` v `playwright.config.js` spouští testy ve `tests/unit/` jednou v Node.js bez prohlížeče (logika, obsah, pojistky nasazení, texty). Ostatní testy běží na všech pěti zařízeních.
- `tests/helpers/game.js` spočítá očekávané kolo stejnými funkcemi a stejným `seed` jako aplikace, takže testy vědí, které zprávy přijdou, a nepotřebují pevně zapsaná ID.
- Test, který potřebuje konkrétní zprávy, si `seed` najde sám funkcí `seedWith(sekce, [ID…])` (první `seed`, jehož kolo ty zprávy obsahuje) a uvede ho v názvu testu. Nové scénáře v bance tak testy nerozbijí (Tomášovo rozhodnutí v milníku 6). Pevný `seed` 123 zůstává jen u testů, kterým na složení kola nezáleží.
- Test průchodu jen klávesnicí běží jen na počítači (na mobilních zařízeních je přeskočený).
- Nainstalované prohlížeče Playwrightu: Chromium a WebKit (Firefox ne, žádné zařízení ho nepoužívá).
- iPhone 13 má v playwright.config.js limit 60 s místo 30 s, protože WebKit na Windows je pomalejší a pod zátěží testy přesahovaly 30 s (podrobnosti v docs/historie.md). Limit nesnižuj.
- Při velkém písmu se testuje i obrazovka kola, vyhodnocení, označování a hlavní stránka s historií. Dlouhé adresy a odkazy se musí dát zalomit kdekoli (`overflow-wrap: anywhere`).

## 13. Milníky

Hotové milníky 1–5 jsou v docs/historie.md.

6. **Doplnění obsahu** (cíl změněný 25. 9. 2026): 3 nové legitimní e-maily a 3 nové legitimní Zprávy, pak obě sekce po 11 scénářích (5 podvodů, 6 legitimních, pravidla v sekci 7) + `npm run prehled` → Tomáš ověří texty. Zapnout kontrolu cíle: `ENFORCE_CONTENT_GOALS = true` v `tests/unit/content.spec.js`.
7. **Testy a kontrola** podle sekce 12, oprava nalezených chyb. Tomáš projde aplikaci ručně na telefonu s velkým systémovým písmem.
8. **Prohlížeč** (od 1. 10. 2026): plán `docs/plany/plan-prohlizec.md`, diagram `docs/plany/plan-prohlizec.html` (14 fází). Nasazeno 1. 10. 2026, fáze 11 vynechaná (nahrazena fází 14), zbývá fáze 14 (Tomášova kontrola na telefonu na živém webu). Doplnění banky později: falešný e-shop, investiční reklama se „známou osobností“ (bez skutečných jmen a fotek).
9. **Vydání:** **odstraň `noindex`** z `index.html` (a uprav test), nasazení, ruční kontrola na telefonu (s velkým systémovým písmem) a tabletu. (Do 1. 10. 2026 to byl milník 8, Tomáš ho přečísloval.)

### Pozdější milníky (teď nedělat, jen počítat s nimi v architektuře)
- **QR platba:** kontrola příjemce a částky v simulované bankovní aplikaci před odesláním.
- **Telefonát:** psaný (textový) rozhovor s větvenými volbami odpovědí, **bez zvuku** (zvuk se dělat nebude). Falešný bankéř nebo policista, „bezpečný účet“, falešná technická podpora s instalací vzdáleného přístupu. Útočník silně tlačí (spěch, „nezavěšujte“, stupňování), bezpečná cesta je vždy zavěsit a ověřit si to jinak. Předem napsané repliky, žádná generativní AI.
- **Statistiky:** GA4 jen s cookie lištou se souhlasem, nebo vlastní anonymní počítadlo bez cookies (PHP + MySQL na hostingu).

Architektura musí umožnit přidat sekci tak, že přibude obrazovka simulované aplikace a složka se scénáři. Engine, bodování, historie, nápověda a vyhodnocení jsou společné.

## 14. Nasazení (`scripts/deploy.mjs`)

- Načte `.env` (`FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_REMOTE_DIR`).
- **Pojistka 1 (cesta, před připojením):** `FTP_REMOTE_DIR` nesmí obsahovat `..` ani `\` a musí být `/` (kořen samostatného FTP účtu subdomény), přesně `/poznej-podvod.menestarosti.cz`, nebo začínat `/poznej-podvod.menestarosti.cz/`. Jinak skript skončí srozumitelnou chybou dřív, než cokoli sestaví nebo se připojí.
- **Pojistka 2 (hlavní, obsah cílové složky, po připojení):** před jakýmkoli nahráním nebo mazáním skript vypíše obsah cílové složky. Pokud v ní najde cokoli z WordPressu (`wp-config.php`, `wp-admin`, `wp-content`, `wp-includes`, bez ohledu na velikost písmen), skončí chybou a nic nenahraje ani nesmaže. Totéž platí v režimu `--check`.
- Obě pojistky jsou v `scripts/deploy-guard.mjs` a pokrývají je testy v `tests/unit/deploy-guard.spec.js`.
- `--dry-run` sestaví aplikaci a připojí se **jen ke čtení** (od 28. 9. 2026). Projde pojistku 2, porovná `dist/` se serverem a vypíše, co by nahrál (u každého souboru „nový“, „jiná velikost“ nebo „stejná velikost“, nahrávají se vždy všechny) a které soubory by smazal. Na serveru nic nezmění: klient je obalený `readOnlyClient` (`deploy-guard.mjs`) a každá zapisovací metoda `basic-ftp` skončí chybou dřív, než se cokoli odešle. Zkouška i skutečné nasazení počítají plán stejnou funkcí `planDeploy`, takže nasazení smaže přesně to, co zkouška vypsala. Hlídají to testy v `tests/unit/deploy-guard.spec.js` (i to, že nová metoda v budoucí verzi `basic-ftp` neprojde bez zařazení).
- `--check` se připojí přes FTPS, provede pojistku 2, vypíše obsah cílové složky a nic nezmění.
- Před nahráním spustí build. Když selže, nenahrává.
- Nahraje obsah `dist/` do `FTP_REMOTE_DIR`. Staré soubory maže až po úspěšném připojení a pojistce 2, a jen ve složkách `assets/` a `fonts/`, které patří našemu buildu.
- Na konci vypíše adresu, kde si má Tomáš výsledek ověřit: https://poznej-podvod.menestarosti.cz/ (sekce 4).
- `--check` se připojuje k serveru, proto ho spouštěj jen na Tomášův pokyn (kdy smíš nasazovat, určuje sekce 2a). `--dry-run` se připojuje jen ke čtení a spouštět ho smíš (před každým nasazením).
- Soubor `.env` nikdy nečti ani nevypisuj (obsahuje heslo). Když je potřeba něco ověřit, vypiš jen ano/ne (např. „FTP_USER je vyplněný“).
- Když v Git Bash zadáváš `FTP_REMOTE_DIR` přímo v příkazu (ne v `.env`), Git Bash přepíše hodnotu začínající `/` na cestu `C:/Program Files/Git/…` a pojistka ji odmítne. Předřaď `MSYS_NO_PATHCONV=1`. V PowerShellu ani v `.env` se to neděje.
- Po nasazení ověř živou stránku: typy souborů (JS musí být `text/javascript`, jinak zůstane stránka prázdná) a vykreslení v prohlížeči přes Playwright.

## 15. Skripty

- `npm run dev`: lokální vývojový server
- `npm run build`: sestavení do `dist/`
- `npm run preview`: náhled sestavené verze
- `npm test`: Playwright testy
- `npm run prehled`: přehled scénářů do `docs/prehled-scenaru.md` (od milníku 6)
- `npm run deploy` / `npm run deploy -- --dry-run` / `npm run deploy -- --check`: nasazení / zkouška s připojením jen ke čtení (co by nahrál a smazal) / kontrola serveru bez změn
- `npx playwright test --project=unit`: jen rychlé testy logiky bez prohlížeče

## 16. Stav projektu (k 29. 9. 2026)

Historie hotové práce je v docs/historie.md, sem piš jen aktuální stav.

- **Stav k 29. 9. 2026:** milník 6 je hotový. E-mail má 12 scénářů (6 podvodů, 6 legitimních), Zprávy 11 (5 podvodů, 6 legitimních), v bance není žádná testovací zpráva. Probíhá milník 7 (testy a kontrola). Před zveřejněním zbývá Tomášova ruční kontrola na telefonu (sekce 17 B) a zkouška s 1–2 seniory (17 D1). Web se naposledy změnil commitem `e55996c` (28. 9. 2026), pozdější commity mění jen dokumentaci, nasazovací skript a `public/.htaccess` (přesměrování http → https, nasazeno 29. 9. 2026). Starší záznamy stavu milníku 6 (24. a 25. 9. 2026) jsou v `docs/historie.md`.

- **28. 9. 2026:** `email-12` (falešná ČSSZ, doplatek důchodu, chyby v češtině, 4 hrozby) je schválený a zabudovaný. E-mail má 12 scénářů (6 podvodů, 6 legitimních), Zprávy 11. `EMAIL_12_BUILT = true`. Zásada o gramatických chybách je v sekci 7. Záznam zdrojů a rozhodnutí je v `docs/navrhy-scenaru-email.md`. **Pushnuto a nasazeno** (commit `e720878`), ověřeno na živé stránce: JS `text/javascript`, `noindex`, texty `email-12` v JS, kolo se vykreslí bez chyb.
- **28. 9. 2026:** barvy ve vyhodnocení (zelená/červená podle odpovědi hráče, shrnutí ve žlutém rámečku, sekce 9) a okno nesouladu v pokročilé úrovni (sekce 5). **Pushnuto a nasazeno** (commit `ea81f1f`), ověřeno na živé stránce: JS `text/javascript`, `noindex`, nové barvy v CSS, okno „Zprávu hodnotíte jako podvod…“ se v pokročilé úrovni ukáže, bez chyb v konzoli. Nadpisy oken nesouladu („Nemáte označené žádné podezřelé místo“ / „Máte označená podezřelá místa“) **pushnuté a nasazené** (commit `f04a319`), ověřeno na živé stránce v prohlížeči.
- **28. 9. 2026:** úkoly před zveřejněním (logo vedle názvu během kola, test `alsoTargets` přes skutečné scénáře, `test.fail` u lišty při 200% písmu, ČTÚ, Montserrat, sekce 17 s kontrolními seznamy). **Pushnuto a nasazeno** (commit `ff13002`), ověřeno na živé stránce: JS `text/javascript`, `noindex`, během kola logo vedle názvu, bez chyb v konzoli.
- **28. 9. 2026:** Montserrat jako statické řezy 700 a 800 (sekce 9). **Pushnuto a nasazeno** (commit `4a3c5b8`), ověřeno na živé stránce: JS `text/javascript`, `noindex`, `montserrat-800.woff2` jako `font/woff2`, v Chromiu se načtou jen `montserrat-700` a `montserrat-800` (stav loaded), proměnné soubory ne.
- **28. 9. 2026:** proměnné řezy `montserrat-var-*.woff2` smazané z repozitáře i ze serveru (commit `e55996c`, nasazení smazalo přesně tyto 2 soubory, na serveru vracejí 404). Ověřeno na živé stránce: `noindex`, JS `text/javascript`, `montserrat-700.woff2` jako `font/woff2`, nadpis v Montserratu 800, bez chyb v konzoli.
- **28. 9. 2026:** `--dry-run` se připojuje jen ke čtení a vypisuje, co by nahrál a smazal (sekce 14). **Pushnuto a nasazeno** (commit `7b65fb0`). Zkouška proti serveru: 10 souborů „stejná velikost“, smazat 0. Skutečné nasazení pak nahrálo 10 a smazalo 0, shodně se zkouškou. Web se nezměnil (JS `text/javascript`, `noindex`).

- **29. 9. 2026:** `public/.htaccess` v repozitáři, test a velikosti ve zkoušce nasazení (commity `1732a29`, `66eea93`). Celá sada před push prošla (982 testů, 4 přeskočené). **Pushnuto a nasazeno.** Zkouška: 10 souborů „stejná velikost“, `.htaccess` „jiná velikost“ (server 176 B, dist 165 B, rozdíl jen v bílých znacích, nasazení Tomáš schválil), smazat 0. Nasazení nahrálo 11 a smazalo 0. Nová zkouška po nasazení: všech 11 „stejná velikost“. Ověřeno na živé stránce: `http://` vrací 301 s `Location: https://poznej-podvod.menestarosti.cz/`, `https://` vrací 200, `http://…/.well-known/acme-challenge/test` vrací 404 bez přesměrování, `noindex` platí, JS `text/javascript`.

- **1. 10. 2026: sekce Prohlížeč** se dělá ve větvi `sekce-prohlizec` (plán a rozhodnutí v `docs/plany/plan-prohlizec.md`). Z větve se nenasazuje (sekce 2a). **Hlavní myšlenka sekce:** když připojení není zabezpečené, nezadávat do stránky žádné údaje. Pojmy: vždy „zabezpečené připojení“ / „připojení není zabezpečené“, ne „stránka je zabezpečená“. Pravidlo zní „nezadávejte údaje“, ne „je to podvod“. Hráč se neučí jeden symbol (prohlížeče se liší: Chrome na telefonu varuje přes celou obrazovku, Edge žlutým trojúhelníkem, jinde nápisem „Nezabezpečeno“, Chrome u zabezpečených stránek místo zámku ukazuje ikonu nastavení; Tomáš ověřil na skutečných prohlížečích), ale kde se dívat (vlevo od adresy) a co dělat. Vždy v páru: chybějící varování neznamená poctivou stránku. Adresní řádek: u nezabezpečeného připojení v obou úrovních jen žlutý trojúhelník s vykřičníkem bez nápisu (úrovně se liší jen označováním), ve vyhodnocení trojúhelník s nápisem „Nezabezpečeno“ a žárovkou. Zabezpečené připojení bez varování (zámek není hlavní znak). Ikona má v obou úrovních popis pro čtečku „Varování: připojení není zabezpečené“ a klepací plochu aspoň 48 px (Tomáš, 1. 10. 2026).
- **1. 10. 2026: Prohlížeč je hotový** (podmínky v sekci 17 E): texty schválené (`docs/navrhy-scenaru-prohlizec.md`), 8 adres volných (registr CZ.NIC 404, DNS neexistuje), číslo +420 772 163 940 z bloku bez držitele (data ČTÚ z 1. 10. 2026), celá sada ve větvi prošla (1203 testů, 4 přeskočené). Tomáš ověřil v ARES, že názvy „Banka Javor“, „Kniha pro radost“ a „Domácí pomocník“ nepatří žádnému subjektu, názvy zůstávají. Termíny zkoušky se seniory řídí Tomáš, do CLAUDE.md se nezapisují.
- **1. 10. 2026: Prohlížeč spojený do `main` (commit `4b25c70`), pushnutý a nasazený.** Celá sada na `main` před push prošla (1203 testů, 4 přeskočené, `--workers=2`). Zkouška: nahrát 11, smazat 2 staré soubory v assets; nasazení smazalo přesně je. Ověřeno na živé stránce: `http://` vrací 301 na `https://`, `noindex` platí, JS `text/javascript`, dlaždice Prohlížeče je aktivní, úvod při prvním vstupu, kolo „Stránka 1 z 5“, v Chromiu i WebKitu bez chyb v konzoli. Návrat: sekce 17 E.
- **Milník 8 (Prohlížeč), fáze 11 „Kontrola na snímcích“ je vynechaná** (Tomáš, 1. 10. 2026): neprovedla se, ověřil se jen označený trojúhelník v pokročilé úrovni. Nahrazuje ji fáze 14, Tomášova kontrola na telefonu na živém webu. Prohlížeč je milník 8, Vydání milník 9 (přečíslováno 1. 10. 2026).

**Otevřené úkoly:**
- **Přilepená lišta kola při velkém písmu (nález 28. 9. 2026):** v testu s 200% písmem na 360 × 740 px zabírá lišta 472 px z 740, protože zvětšené písmo v testu podmínku `min-height: 40em` nevypne. Zpráva ve schránce pak může být středem pod lištou. Test `200 % text at 360 px` (`tests/email-app.spec.js`) je proto označený `test.fail` (očekávané selhání): „přilepená lišta při 200% písmu na malém displeji (360×740) zakrývá zprávu; na Tomášově telefonu při 200% bez problému“. **Nízká priorita, ověřeno na jednom zařízení** (Tomáš, 28. 9. 2026). Až se to opraví, Playwright ohlásí, že test „nečekaně prošel“, a `test.fail` se odstraní.
- ~~Před zveřejněním odkazu na hru: testovací zprávy.~~ **Hotovo 25. 9. 2026:** všechny testovací zprávy (`email-04` až `email-07`, `zpravy-04` až `zpravy-07`) nahradily skutečné scénáře, v bance žádná testovací zpráva nezůstala.
- **Před zveřejněním odkazu na hru: číslo kupujícího v `zpravy-06`.** Znovu ověřit v otevřených datech ČTÚ „Přidělená čísla a kódy“ (https://data.ctu.gov.cz/dataset/pridelena-cisla-kody), že blok 772 100 000 až 772 199 999 (číslo +420 772 145 208) nemá držitele. Ověřeno 24. 9. a znovu 28. 9. 2026: CSV https://data.ctu.gov.cz/sites/default/files/imports/import_numbers/pridelena_cisla_a_kody.csv, 13 206 řádků, žádný rozsah blok nepřekrývá (kontrola výpočtem, stejný výpočet najde přidělený rozsah 772 720 000–772 729 999). ČTÚ ale může blok kdykoli přidělit, proto znovu v den zveřejnění (sekce 17, A2).
- ~~Před zveřejněním odkazu na hru: zdroje Finanční správy.~~ **Hotovo 28. 9. 2026:** oba zdroje ke scénáři `email-02` znovu ověřeno Claudem v chatu 28. 9. 2026, tvrzení sedí. Tomáš rozhodl, že je číst nebude a stačí toto ověření (sekce 17 C).
- ~~Logo nad názvem během kola na počítači.~~ **Opraveno 28. 9. 2026:** bez podtitulu byl samotný název užší než základ šířky textu (12rem), a tak se na širokém displeji zalomil pod logo. Během kola se šířka textu řídí názvem (`.is-in-round .site-header__text` v `game.css`). Hlídá test „in a round the logo still sits next to the title“ v `tests/home.spec.js`.
- ~~Tenký Montserrat ve WebKitu.~~ **Vyřešeno 28. 9. 2026:** proměnný řez kreslil WebKit na Windows tence (šířky tučné, tahy vlasové). Tmavé body textu „Poznej podvod“: proměnný řez 627, Lato 400 2141. Nahrazen statickými řezy 700 a 800 (sekce 9): ve WebKitu 3970 / 4579, v Chromiu 3929 / 4550, na snímku vizuálně tučné. Hlídá test v `tests/fonts.spec.js`. Na skutečném iPhonu neověřeno (Tomáš ho nemá). Nevyužité soubory `public/fonts/montserrat-var-*.woff2` jsou po Tomášově OK smazané. Předtím prošla kontrola, že Montserrat se kreslí jen v tloušťce 700 a 800 (CSS i výchozí hodnoty nadpisů a `<strong>`).
- ~~Přesměrování http → https.~~ **Běží od 29. 9. 2026:** Tomáš nahrál `.htaccess` do kořene subdomény ručně přes FTP. Pravidlo: `http://` → `https://` kódem 301 (trvalé), výjimka pro `/.well-known/acme-challenge/` (obnova certifikátu Let's Encrypt). V repozitáři je jako `public/.htaccess`, Vite ho kopíruje do `dist/`, obsah hlídá `tests/unit/htaccess.spec.js`.
  - **Ověření:** `curl.exe -I http://poznej-podvod.menestarosti.cz` vrací `301` a `Location: https://poznej-podvod.menestarosti.cz/`. Ověřeno 29. 9. 2026: 301 s Location na https, `https://` vrací 200, `/.well-known/acme-challenge/…` se nepřesměrovává.
  - **Návrat:** na hostingu (FileZilla) přejmenovat `.htaccess` na `htaccess-vypnuto.txt`. `curl.exe -I http://…` pak vrací 200. Pozor: další nasazení by `.htaccess` z `dist/` nahrálo znovu, proto ho při vypnutí smazat i z `public/`.
  - **Od 29. 9. 2026 je na serveru `.htaccess` z repozitáře** (nasazení přepsalo ručně nahranou verzi, která se lišila jen bílými znaky). Zkouška nasazení ho teď hlásí jako „stejná velikost“.
- **Obnova certifikátu:** certifikát Let's Encrypt platí do 23. 12. 2026. Kolem 10. 12. 2026 zkontrolovat, jestli ho Subreg obnovil (datum platnosti na https://poznej-podvod.menestarosti.cz).

**Pravidla, repozitář a hosting:**
- Commity, pushe a nasazení se od 24. 9. 2026 řídí sekcí 2a (samostatně, čekání na Tomáše jen v uvedených případech).
- **Repozitář** https://github.com/tomaspolak82-commits/poznej-podvod je **veřejný** (ukázka do portfolia), je v něm `README.md`. E-mail autora v commitech zůstává (Tomášovo rozhodnutí). V historii (commit `4f52284`) je jméno starého FTP účtu; ten účet je už zrušený, historie se nepřepisuje.
- **Kvůli veřejnému repozitáři před každým commitem ověř**, že připravené soubory neobsahují hesla, jméno FTP účtu ani obsah `.env`: projdi `git status` (`.env` v něm nesmí být) a prohledej připravené soubory (`git grep --cached`) na přihlašovací údaje. Když si nejsi jistý, necommituj a zeptej se.
- **Hosting:** nasazuje se přes samostatný FTP účet subdomény, šifrované spojení funguje (ověřeno `--check`).

## 17. Před zveřejněním odkazu (kontrolní seznamy, připraveno 28. 9. 2026)

Odkaz se zveřejní až po Tomášově výslovném pokynu (sekce 2a). Do té doby musí být hotové body B, C a D1–D2. Body D3 (přesměrování http → https) a D4 (přilepená lišta) zveřejnění neblokují. Pak proběhne A.

### A. Vydání (dělá Claude po Tomášově pokynu ke zveřejnění)
1. Body B, C a D1–D2 jsou odškrtnuté. Poznáte to tak, že v sekci 17 u nich je „hotovo“.
2. Týž den znovu ověřit blok 772 100 000 až 772 199 999 v datech ČTÚ (`zpravy-06`, od 1. 10. 2026 i `prohlizec-02` s číslem +420 772 163 940). Poznáte to tak, že blok nemá držitele. **Poslední ověření:** 28. 9. 2026 na datech ČTÚ z 28. 9. 2026 (CSV https://data.ctu.gov.cz/sites/default/files/imports/import_numbers/pridelena_cisla_a_kody.csv, server hlásí poslední změnu 28. 9. 2026 02:35 GMT), 13 206 řádků, žádný rozsah blok nepřekrývá. Kontrola metody: stejný výpočet najde přidělený rozsah 772 720 000 až 772 729 999 (držitel IPEX TELCO a.s.).
3. Znovu ověřit smyšlené domény v podvodných scénářích (registr vrací 404, DNS neexistuje). Poznáte to tak, že všechny jsou dál volné.
4. Odstranit `<meta name="robots" content="noindex">` z `index.html` a upravit test na „noindex už není“. Poznáte to tak, že test to hlídá.
5. Spustit celou sadu testů. Poznáte to tak, že všechny projdou (očekávané selhání `test.fail` se počítá jako v pořádku).
6. Commit, push, `npm run deploy -- --dry-run`, nasazení. Poznáte to tak, že výpis obsahuje jen nahrání souborů a mazání ve složkách assets a fonts.
7. Živá stránka: JS `text/javascript`, `noindex` pryč, kolo se vykreslí v Chromiu i WebKitu bez chyb, `http://` vrací 301 s `Location` na `https://`. Poznáte to tak, že je to zapsané v sekci 16.
8. Konec pravidla „po každém push nasaď sám“: od teď se nasazuje jen na Tomášův pokyn (sekce 2a).

### B. Ruční kontrola na telefonu (Tomáš, asi 20 minut)
Podrobný postup s tím, na co se dívat, je v `docs/kontrola-na-telefonu.md`. Stručně:
1. V telefonu nastavte největší systémové písmo.
2. Otevřete https://poznej-podvod.menestarosti.cz (ne v anonymním okně).
3. Hlavní stránka a výběr úrovně jsou celé čitelné, nic nepřetéká do strany.
4. E-mail, základní úroveň: zprávu jde otevřít, „▾ zobrazit adresu“ jde trefit, nápověda se otevře i zavře.
5. Vyhodnocení: správná odpověď má světle zelený podklad, špatná červený rámeček na bílé. U obou je ikona a text. Shrnutí je ve žlutém rámečku.
6. Odkaz, tlačítko nebo příloha ukážou okno „Tohle je jen trénink…“.
7. Dohrajte kolo. Konec kola je čitelný.
8. Zprávy, pokročilá úroveň: označte a odznačte část zprávy.
9. Klepněte na „Je to podvod“ bez označení. Ukáže se okno „Nemáte označené žádné podezřelé místo“, „Označit místa“ vrátí ke zprávě.
10. Označte část a klepněte na „Je to v pořádku“. Ukáže se okno „Máte označená podezřelá místa“.
11. Ve vyhodnocení jsou u částí texty „Našli jste“ (zeleně), „Tohle místo stojí za druhý pohled“ nebo „Označeno zbytečně…“ (červeně).
12. Hlavní stránka: panel „Vítejte zpět“ a odkaz „Smazat moji historii“.
13. Otočte telefon na šířku a zpět. Nic se nerozbije.
14. Nadpisy a tlačítka jsou tučné (na každém zařízení, které máte po ruce). Tomáš iPhone ani iPad nemá. Safari proto pokrývá jen automatický test ve WebKitu (`tests/fonts.spec.js`, statické řezy od 28. 9. 2026). Když se k iPhonu nebo iPadu někdo dostane (třeba senior při zkoušce D1), stačí jeden pohled na hlavní stránku.
15. Na počítači během kola: logo v hlavičce je vedle názvu „Poznej podvod“, ne nad ním.
16. Vraťte velikost písma v telefonu zpět.

### C. Zdroje, které si Tomáš před zveřejněním přečte sám — **hotovo 28. 9. 2026**
Znovu ověřeno Claudem v chatu 28. 9. 2026 proti zdrojům, všechna tvrzení sedí. Stránky policie.gov.cz jen přes výtah vyhledávače (web nepovoluje automatické čtení). Tomáš je nečetl, rozhodl, že stačí toto ověření.
- **`email-02` (Finanční správa):** hra tvrdí, že Finanční správa „e-mailem nežádá přihlašovací ani bankovní údaje“ a „neposílá e-mailem odkazy pro platby ani pro přihlášení“.
  - https://financnisprava.gov.cz/cs/financni-sprava/media-a-verejnost/tiskove-zpravy-gfr/tiskove-zpravy-2025/dalsi-intenzivni-vlna-podvodnych-emailu-a-sms (30. 10. 2025)
  - https://financnisprava.gov.cz/cs/financni-sprava/novinky/novinky-2025/financni-sprava-varuje-pred-dalsi-vlnou-podvodnych-mailu (17. 12. 2025)
- **`zpravy-01` (Ministerstvo dopravy, 7726):** hra tvrdí, že skutečná zpráva o přestupku vždy obsahuje konkrétní popis (místo, čas, vozidlo), že se informace o přestupcích takto nerozesílají, a radí na odkazy neklikat. Dále rada „Podezřelou SMS můžete přeposlat na číslo 7726“.
  - https://md.gov.cz/Media/Media-a-tiskove-zpravy/Pozor-na-falesne-SMS-o-pokutach (12. 6. 2026)
  - https://policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy (věta o lince 7726)
- **`zpravy-02` (policie, „Ahoj mami, nové číslo“):** hra tvrdí, že podvodníci často používají zahraniční předvolby a začínají větou o novém čísle, že tlak na rychlé jednání je podezřelý a že prosba o rychlé peníze se slibem vrácení je typický znak.
  - https://archiv.policie.gov.cz/clanek/pozor-na-podvodne-zpravy-na-whatsappu-mami-mam-nove-cislo.aspx (25. 9. 2025)
  - https://archiv.policie.gov.cz/clanek/ahoj-mami-mam-nove-cislo-napis-mi-na-whatsapp-tohle-neni-vase-dite-ale-podvodnik.aspx (17. 9. 2025)
  - https://bezpecnejsi.ostrava.cz/ahoj-tati-rozbil-se-mi-telefon-nehoda-nebo-podvod/ (20. 10. 2025)

### D. Další úkoly před zveřejněním
1. **Zkouška s 1–2 seniory** (doplněno 28. 9. 2026): senior hraje sám na svém telefonu, Tomáš jen pozoruje a nenapovídá. Postřehy se zapisují podle `docs/plany/plan-milnik-7.md` (sekce 2, testeři jen jako T1, T2). Poznáte to tak, že je zapsaná aspoň jedna celá hra od začátku do konce kola.
2. ~~Tučný Montserrat.~~ **Hotovo 28. 9. 2026:** statické řezy 700 a 800, ve WebKitu i Chromiu vizuálně tučné (test v `tests/fonts.spec.js`). Skutečný iPhone neověřen, Tomáš ho nemá (krok B14).
3. ~~Přesměrování http → https.~~ **Hotovo 29. 9. 2026** (sekce 16: pravidlo, ověření a návrat).
4. Přilepená lišta při 200% písmu: nízká priorita, zveřejnění neblokuje (sekce 16).
5. **Po zkoušce se seniory (D1): aktualizace Vite a dotenv** (audit 29. 9. 2026, `docs/audit-dokumentace.md`). `npm outdated` hlásí vite 8.3.0 → 8.3.1 a dotenv 18.0.3 → 18.0.4, obě jen opravné verze v rozsahu `^`. Co se v nich změnilo, Context7 neukazuje (má Vite jen do 8.0.10, dotenv bez čísla verze), proto před aktualizací přečíst jejich seznam změn. Pak `npm update vite dotenv`, celá sada, zkouška nasazení. Zveřejnění neblokuje.

### E. Sekce Prohlížeč: spojení do `main`, vrácení a nové spojení (Tomáš, 1. 10. 2026)

**Termíny:** řídí Tomáš sám, do tohoto souboru se nezapisují (Tomáš, 1. 10. 2026).

**Sekce je hotová, když:**
1. Tomáš schválil všechny texty pro hráče. Poznáte to tak, že v `docs/navrhy-scenaru-prohlizec.md` je u dávky „schváleno“ s datem.
2. Telefonní čísla jsou podle dat ČTÚ nepřidělená (metoda jako v kroku A2). Poznáte to tak, že je výsledek s datem zapsaný v sekci 16.
3. Domény jsou volné (registr vrací 404, DNS neexistuje), a to i u legitimních scénářů. Poznáte to tak, že je výsledek s datem zapsaný v sekci 16.
4. Prošla celá sada včetně nových testů Prohlížeče a testů, že E-mail a Zprávy se nezměnily (mimo jiné „Zpráva 2 z 5“). Poznáte to tak, že výsledek je zapsaný v sekci 16.

**Spojení** (jen po splnění podmínek, pak nasazení podle sekce 2a):
1. `git switch main` (přepne na hlavní větev). Poznáte to tak, že `git status` hlásí „On branch main“.
2. `git merge --no-ff sekce-prohlizec` (spojí větev a vždy vytvoří samostatný commit spojení, který jde vrátit jedním příkazem). Poznáte to tak, že `git log --oneline -1` ukazuje commit „Merge branch 'sekce-prohlizec'“.
3. Celá sada, push, `--dry-run`, nasazení, ověření živé stránky (sekce 2a). Hash commitu spojení zapsat do sekce 16.

**Spojeno 1. 10. 2026: commit spojení `4b25c70`** (pushnuto a nasazeno, sekce 16).

**Vrácení po chybě** (když Tomáš po nasazení najde chybu):
1. `git revert -m 1 4b25c70` (vytvoří nový commit, který změny ze spojení zruší; `-m 1` říká, že se zachová stav hlavní větve). Historie se nemaže. Poznáte to tak, že vznikne commit „Revert "Merge branch 'sekce-prohlizec'"“.
2. Celá sada, push, `--dry-run` (jako vždy), nasazení `main` bez Prohlížeče.
3. Ověřit živou stránku: na hlavní stránce je Prohlížeč jako „Připravujeme“ a `http://` vrací 301 s `Location` na `https://`. Poznáte to tak, že je to zapsané v sekci 16.

**Nové spojení po opravě:** po vrácení spojení si Git pamatuje, že commity z větve už v `main` jsou. Obyčejné nové spojení by proto přineslo jen nové opravy, ne původní práci. Ověřeno 1. 10. 2026 na zkušebním repozitáři: po vrácení a novém spojení chyběl původní soubor a přibyla jen oprava. Postup:
1. Opravit chybu ve větvi `sekce-prohlizec` a commitnout.
2. `git switch main`.
3. `git revert <hash commitu „Revert …“>` (vrátí vrácení, takže se původní práce do `main` znovu objeví). Poznáte to tak, že v `main` jsou zase soubory Prohlížeče.
4. `git merge --no-ff sekce-prohlizec` (přidá opravy). Na zkušebním repozitáři byly po tomto postupu v `main` původní soubor i oprava.
5. Zase podmínky „Sekce je hotová“, celá sada, push, `--dry-run`, nasazení, ověření.
