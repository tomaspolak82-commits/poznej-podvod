<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Udělej mi hloubkový výzkum na téma podvodů, které se provádí na seniory v České republice.

Zaměř se na podvody skrz SMS, telefony, v internetovém prohlížeči prostřednictvím reklam, odkazy v e-mailech a jiných možnostech.

Kdy celkový soubor praktik, jakým dokáží tímto podvodům, a účelem toho, tato práce bude vytvoření aplikací, které budou simulovat nejčastější způsoby podvodů.

Proto je potřeba i napsat, co musí senioři hlídat, pro to, aby se následně tyto chyby simulovaly do této aplikace.

Senioři jsou v Česku cíleně oslovovaní podvodníky přes SMS, telefon, e‑mail, reklamy v prohlížeči i sociální sítě; cílem je hlavně získat přístup k účtům, autorizační kódy a přimět je k investicím do falešných „výhodných“ nabídek.[^1_1][^1_2][^1_3]
Pro tvoji aplikaci se nejvíc vyplatí simulovat smishing (SMS), vishing (telefonáty), phishing (e‑maily), investiční podvody přes reklamy, „falešného bankéře/policistu“ a podvody s vzdáleným přístupem (AnyDesk, TeamViewer).[^1_2][^1_4][^1_5][^1_3][^1_6]

______________________________________________________________________

## Proč jsou senioři snadný cíl

- Podvodníci kombinují telefonáty, SMS, e‑maily a reklamy tak, aby vše působilo důvěryhodně (banka, policie, ČNB, celebrita, vnuk).[^1_7][^1_8][^1_4][^1_3][^1_9]
- Útočí na emoce – strach („napadený účet, exekuce, pokuta“), časový tlak („musíte hned jednat“), péči o rodinu („vnuk v nouzi“), touhu zajistit úspory („jistý výnos 20% ročně bez rizika“).[^1_10][^1_5][^1_11][^1_3]
- Průzkumy ukazují, že jen malá část seniorů si věří, že falešný hovor či zprávu bezpečně pozná, zároveň se stále častěji setkávají s podvodnými zprávami o doručení balíčku nebo úhradě cla.[^1_12]

______________________________________________________________________

## Přehled hlavních typů podvodů (pro simulace)

| Typ podvodu | Kanál | Typická legenda | Cíl útočníka | Klíčová chyba oběti (simulovat v appce) |
| :-- | :-- | :-- | :-- | :-- |
| Smishing (podvodné SMS) | SMS | Banka, pošta, úřad, policie, operátor, dopravní pokuta, balíček, sociální dávka.[^1_2][^1_13][^1_14][^1_10][^1_15] | Kliknutí na odkaz, zadání přihlašovacích/karetních údajů, instalace škodlivé aplikace, provedení platby.[^1_2][^1_10][^1_15] | Klikne na odkaz v SMS, zadá přihlašovací údaje, pošle autorizační kód, stáhne aplikaci mimo oficiální obchod.[^1_2][^1_10][^1_6] |
| Vishing (podvodné telefonáty) | Telefon | Falešný bankéř, policista, ČNB, Microsoft/„IT technik“; napadený účet, někdo si bere úvěr na jejich jméno.[^1_4][^1_5][^1_3][^1_16][^1_17][^1_6] | Vylákání údajů k bankovnictví, přimění k převodu peněz na „bezpečný účet“, instalace AnyDesk/TeamViewer, poslání peněz kurýrovi nebo do bitcoinového automatu.[^1_4][^1_5][^1_3][^1_17][^1_18][^1_6] | Zůstane na hovoru, věří legendě, sdělí údaje a autorizační kódy, nainstaluje vzdálený přístup, potvrzuje platby, předá hotovost kurýrovi.[^1_4][^1_5][^1_3][^1_17][^1_18][^1_6][^1_19] |
| Phishing e‑mailem / zprávami | E‑mail, Messenger, WhatsApp | Falešná banka, pošta, přepravní služba, sociální síť, „bezpečnostní upozornění“, výhra nebo exekuce.[^1_1][^1_7][^1_20][^1_21][^1_14][^1_10][^1_22] | Přesměrování na falešnou přihlašovací stránku, stažení příloh s malwarem, zadání údajů či platby kartou.[^1_1][^1_7][^1_20][^1_22][^1_15] | Otevře přílohu, klikne na odkaz v mailu, zadá heslo a karetní údaje, ignoruje chybnou adresu odesílatele a gramatické chyby.[^1_1][^1_7][^1_20][^1_10][^1_22] |
| Investiční podvody přes reklamy | Reklamy v prohlížeči, sociální sítě | „Zhodnoťte úspory snadno a rychle“, reklama s fotkou/video známé osobnosti (Babiš, Křetínský, Janeček apod.), „garantovaný výnos bez rizika“.[^1_23][^1_11][^1_3][^1_24][^1_18][^1_25][^1_26][^1_19] | Přimět oběť k založení „investičního účtu“, poslání úspor a půjček, instalaci vzdáleného přístupu; peníze mizí na zahraniční účty.[^1_23][^1_11][^1_3][^1_24][^1_18][^1_25][^1_19] | Klikne na reklamu, vyplní kontaktní údaje, uvěří „poradci“, pošle peníze na neznámé účty, věří falešným výpisům z investic.[^1_11][^1_3][^1_24][^1_18][^1_25][^1_26] |
| Falešná technická podpora | Telefon, e‑mail, popup v prohlížeči | „Jsem z Microsoftu, máte virus“, „váš počítač je napaden“.[^1_16] | Donutit k instalaci vzdáleného přístupu (AnyDesk, TeamViewer, Supremo), získat hesla a přístup k účtům, šifrovat data.[^1_4][^1_27][^1_16][^1_18] | Uvěří cizímu „IT technikovi“, nainstaluje program pro vzdálený přístup, prozradí hesla.[^1_4][^1_27][^1_16][^1_18] |
| QR podvody (quishing) | QR kódy – platby, parkování, faktury | Přelepený nebo podvržený QR kód, falešná platba, „rychlé darování“.[^1_15][^1_6] | Přesměrování na jiný účet nebo podvrženou stránku, podvodná platba.[^1_15][^1_6] | Bez kontroly platby jen naskenuje a odešle, nekontroluje částku ani příjemce.[^1_15][^1_6] |
| Sociální sítě / romance / „vnuk“ | Telefon, zprávy, sociální sítě | „Vnuk v nouzi“, nový partner z internetu, „kamarád“ žádající peníze, podvodné nákupy / prodeje.[^1_1][^1_7][^1_21] | Vylákání peněz, údajů a fotek dokladů, posílání peněz „na pomoc“ nebo „na nákup“.[^1_1][^1_7][^1_21] | Důvěra bez ověření identity, posílání peněz na základě příběhu, posílání fotek karty a dokladů.[^1_28][^1_1][^1_7][^1_21] |


______________________________________________________________________

## SMS podvody (smishing) – typické scénáře

- Policie ČR popisuje smishing jako podvodné SMS, které se tváří jako komunikace od bank, přepravních společností, státních institucí nebo rodinných příslušníků, cílem je vylákat kliknutí na odkaz, zadání údajů, instalaci aplikace nebo provedení transakce.[^1_8][^1_2][^1_10]
- Konkrétně se objevují SMS s údajnou výzvou k zaplacení dopravní pokuty, balíčku (clo, poplatek), sociální dávce nebo upozorněním na „napadený účet“; odkaz vede na falešnou stránku banky či úřadu.[^1_13][^1_14][^1_15][^1_10][^1_12]
- Útočníci používají i spoofing – SMS přijdou jako „Česká pošta“, „MPSV“, „ČSSZ“, „Portál občana“ nebo dokonce zfalšovaná linka 158, přičemž odkaz míří na phishingový web.[^1_6][^1_9][^1_10]

**Co mají senioři u SMS hlídat (body pro simulaci):**

- Neočekávaná zpráva, která tvrdí, že „něco dlužíš“, „musíš hned zaplatit“, nebo „tvoje peníze jsou v ohrožení“.[^1_2][^1_10][^1_12]
- Odkaz v SMS – nikdy na něj neklikat; místo toho otevřít banku/poštu z vlastnoručně napsané adresy nebo oficiální aplikace.[^1_15][^1_10][^1_6][^1_2]
- Žádost o autorizační kódy, PIN, hesla či úplná čísla karty – seriózní banka/úřad to SMS nikdy nechce.[^1_17][^1_10][^1_15][^1_2]
- Cizí předvolba, kostrbatý jazyk, chyby v textu – typický znak automatických překladů.[^1_10]
- Pokud mají podezření, zprávu neposílat dál, ale přeposlat na 7726 (hlášení podvodných SMS operátorům) a kontaktovat svou banku.[^1_12][^1_6][^1_2]

______________________________________________________________________

## Telefonní podvody (vishing, falešný bankéř/policista/ČNB)

- CNB i policie popisují vishing jako telefonáty, kdy se volající vydává za bankéře, policistu, zaměstnance ČNB nebo bezpečnostní oddělení a manipuluje oběť pomocí strachu (napadený účet, někdo si bere úvěr, hrozící blokace účtu).[^1_4][^1_5][^1_3][^1_9][^1_17][^1_6]
- Číslo je často podvržené (spoofing), takže na displeji vidíš jakoby číslo banky/policie nebo běžnou českou předvolbu; někdy se střídá „bankéř“ a „policista“ pro zvýšení důvěryhodnosti.[^1_5][^1_3][^1_16][^1_4][^1_17][^1_6]
- Podvodníci nutí seniory k instalaci programů AnyDesk, TeamViewer, Supremo či Revolut pod legendou „pomoc se zabezpečením účtu“ nebo „nastavení investice“, čímž získají plný vzdálený přístup k počítači/mobilu.[^1_27][^1_16][^1_18][^1_4][^1_17][^1_6]

**Typické kroky ve scénáři (dobré pro simulaci hovoru):**

1. Hovor: „Volám z vaší banky/policie/ČNB, váš účet je napaden, někdo si na vás bere úvěr.“[^1_3][^1_9][^1_4][^1_5][^1_6]
2. Vytvoří stres – „musíme to vyřešit hned, jinak o všechno přijdete“, zakazují ukončit hovor.[^1_5][^1_3][^1_17]
3. Přesvědčují k převodu peněz na „bezpečný účet“, vkládání peněz do bitcoinového automatu, nebo k instalaci vzdáleného přístupu.[^1_18][^1_4][^1_3][^1_17][^1_6][^1_5]
4. Žádají přístupové údaje, autorizační SMS kódy, PIN nebo detaily karty, někdy i fotky dokladů.[^1_28][^1_3][^1_17][^1_5]
5. Peníze mizí, podvodník hovor ukončí, případně vyhrožuje, ať to oběť nehlásí.[^1_4][^1_17]

**Co mají senioři hlídat:**

- Nikdy nesdělovat přístupové údaje, PIN, autorizační SMS kódy ani celý číslo karty po telefonu – banka ani policie je nikdy nechtějí.[^1_9][^1_3][^1_17][^1_5]
- Hovor klidně ukončit, nevolat zpět na stejné číslo, ale zavolat na oficiální infolinku banky/ČNB/policie z jejich webu.[^1_3][^1_9][^1_5]
- Nikomu neumožnit vzdálený přístup do počítače/mobilu, pokud to není ověřený IT specialista, s kterým mají dlouhodobý vztah – zejména ne na základě nevyžádaného hovoru.[^1_16][^1_27][^1_18][^1_6][^1_4]
- Nikdy nepředávat hotovost nebo peníze kurýrovi – žádná banka ani investiční společnost takhle nepracuje.[^1_26][^1_19][^1_18]

______________________________________________________________________

## Podvody přes reklamy v prohlížeči (investice, zhodnocení úspor)

- Bakalářské práce i policejní případy popisují scénář, kdy seniory zaujme investiční reklama v prohlížeči/na sociální síti, často s fotkou známé osobnosti a slibem „vysokého výnosu bez rizika“.[^1_23][^1_11][^1_24][^1_25][^1_19][^1_18][^1_3]
- Kliknutím se dostanou na profesionálně vypadající web s formulářem, kde vyplní kontaktní údaje; následně jim volá „finanční poradce“, který buduje důvěru klidně i několik měsíců.[^1_25][^1_23][^1_18][^1_3]
- Poradce je postupně přesvědčí k posílání stále větších částek na „investiční účet“ nebo k půjčkám, někdy i k předání hotovosti kurýrovi; ve finále přijdou o statisíce až miliony.[^1_11][^1_24][^1_19][^1_18][^1_25]

**Co mají senioři hlídat:**

- Reklama slibující „garantovaný“ nebo neobvykle vysoký výnos (např. 10–20% ročně bez rizika) je znak podvodu – seriózní investice nic negarantuje.[^1_3]
- Ověřit, jestli má daná investiční společnost licenci u ČNB; pokud ne, vůbec neposílat peníze.[^1_23][^1_9][^1_3]
- Neinstalovat programy pro vzdálený přístup na základě toho, že „poradce pomůže s investicí“ – je to typický vstup do účtů.[^1_27][^1_18][^1_6][^1_4]
- Nikdy neposílat peníze na základě samotného telefonátu nebo reklamy; vždy si nezávisle ověřit informace v bance nebo u důvěryhodného poradce.[^1_18][^1_9][^1_3]

______________________________________________________________________

## Podvody přes e‑maily a jiné zprávy (phishing)

- ESET a policie uvádějí, že nejčastější podvodné zprávy míří přes e‑mail, někdy i přes reklamy na sociálních sítích; cílem je získat přihlašovací údaje nebo nainstalovat škodlivý software.[^1_20][^1_22][^1_1][^1_7][^1_15][^1_10]
- Typické jsou podvodné e‑maily „z banky“, „České pošty“, „dopravní služby“ nebo „bezpečnostních institucí“ – informují o napadeném účtu, doručovaném balíčku, exekuci či výhře, obsahují odkaz či přílohu.[^1_14][^1_22][^1_1][^1_7][^1_20][^1_10]
- Falešné e‑maily zneužívají značku České pošty, mají podvržené adresy a mohou po otevření příloh poškodit počítač nebo mobil.[^1_14]

**Co mají senioři hlídat:**

- Zkontrolovat adresu odesílatele (ne jen jméno, ale celý e‑mail), pravopis a kvalitu češtiny – chyby a divné domény jsou časté.[^1_7][^1_20][^1_14][^1_10]
- Nikdy neklikat na odkazy a nestahovat přílohy v nevyžádaných e‑mailech, zvlášť když chtějí loginy nebo platby.[^1_22][^1_1][^1_20][^1_15][^1_7][^1_10]
- Přihlášení do banky nebo služby dělat vždy přes ručně napsanou adresu nebo oficiální aplikaci, ne přes odkaz v e‑mailu.[^1_1][^1_22][^1_15][^1_7]
- V případě podezření kontaktovat instituce přes oficiální kanály, ne odpovídat na e‑mail.[^1_20][^1_15][^1_9][^1_7]

______________________________________________________________________

## Další scénáře: sociální sítě, romance, spam, QR

- Na sociálních sítích běží nejen investiční reklamy, ale i podvodné profily, které se tváří jako Meta/Facebook či jiná platforma; cílem je vylákat přihlašovací údaje nebo ovládnout účet oběti.[^1_1][^1_20]
- Diplomové práce a články zmiňují spam – nevyžádané e‑maily propagující produkty, služby, loterie či „výhry“, které mohou seniory přivést na podvodné weby nebo k nákupu falešných služeb.[^1_21][^1_7]
- CNB a banky upozorňují na podvodné QR kódy (quishing), kdy je přelepený QR u platebních terminálů, parkovacích automatů či faktur; platba pak jde jinam, než oběť čeká.[^1_15][^1_6]

**Co mají senioři hlídat:**

- U sociálních sítí: dvoufaktorové ověření, kontrola oficiálních stránek, nic nezadávat přes podivné odkazované formuláře; blokovat podvodné stránky.[^1_20][^1_1]
- U QR kódů: kontrolovat částku a příjemce před odesláním, přezkoumat, zda QR není přelepený, nepoužívat neznámé skenovací aplikace.[^1_6][^1_15]
- Ignorovat nevyžádané nabídky a výhry, do kterých se nikdy nepřihlásili, a nepředávat osobní údaje za „dárek“.[^1_21][^1_7][^1_10]

______________________________________________________________________

## Co musí senioři obecně hlídat (shrnuté pravidla pro tvou aplikaci)

Pro každý scénář by appka měla senioři „donutit“ dělat typické chyby (kliknout, sdělit kód…), ale zároveň ukazovat pravidla, která je mají chránit:

- **Neočekávaná komunikace**
    - Jakákoli nevyžádaná SMS, e‑mail, hovor nebo reklama, která řeší peníze, pokuty, investice nebo bezpečnost účtu, je automaticky podezřelá.[^1_9][^1_2][^1_10][^1_5][^1_3]
- **Odkazy a přihlašování**
    - Nikdy neklikat na odkazy v SMS/e‑mailech vedoucí do banky nebo k platbě; vždy jít do banky ručně přes oficiální adresu či aplikaci.[^1_22][^1_7][^1_2][^1_10][^1_15][^1_1]
    - U přihlašovací stránky kontrolovat adresu (doménu), nespoléhat jen na „zámeček“ (HTTPS), protože i phishingové weby mívají certifikát.[^1_17][^1_2][^1_15]
- **Údaje a kódy**
    - Nikomu nesdělovat hesla, PIN, autorizační kódy, kompletní čísla karet, bankovní identitu – banka ani policie je nikdy nechtějí.[^1_2][^1_10][^1_5][^1_17][^1_9][^1_3]
    - Nikdy neposílat fotky platebních karet nebo osobních dokladů.[^1_28]
- **Vzdálený přístup a aplikace**
    - Bez ověřené potřeby neinstalovat AnyDesk, TeamViewer, Supremo ani jiné programy na vzdálený přístup.[^1_16][^1_4][^1_27][^1_18][^1_6]
    - Aplikace banky stahovat jen z oficiálního Google Play/App Store, ne z odkazů v SMS či mailu.[^1_6][^1_2]
- **Emoce a časový tlak**
    - Nenechat se vmanipulovat do stavu „hned teď“, počítat do pěti, zavěsit, rozmyslet se a ověřit si situaci u oficiálního zdroje.[^1_5][^1_17][^1_9][^1_3]
- **Ověřování a hlášení**
    - Ověřovat si telefonáty a zprávy přes infolinku banky/úřadu, nikoli přes číslo/odkaz uvedený v podezřelé zprávě.[^1_4][^1_9][^1_5][^1_3]
    - Podezřelé SMS přeposílat na 7726, útoky hlásit bance a Policii ČR (linka 158 nebo nejbližší služebna).[^1_12][^1_17][^1_2][^1_6]

______________________________________________________________________

## Náměty na konkrétní simulace v aplikaci

Pro tvoje edukativní aplikace můžeš vytvořit interaktivní scénáře, kde senior „prochází podvodem“ a na konci vidí, kde udělal chybu:

- **Scénář 1 – SMS o balíčku / dopravní pokutě**
    - Zobrazení SMS, která tvrdí, že je z pošty/policie, obsahuje odkaz na „zaplať clo/pokutu“, požaduje zadání údajů k bankovní kartě.[^1_13][^1_14][^1_10][^1_12]
    - Senior má možnost: kliknout, nekliknout, ověřit; aplikace ukáže, proč je odkaz nebezpečný a jak by měl postupovat správně.
- **Scénář 2 – falešný bankéř/policista po telefonu**
    - Simulovaný hovor s legendou „napadený účet, někdo si bere úvěr, musíme to vyřešit hned“..[^1_17][^1_9][^1_4][^1_5][^1_3][^1_6]
    - Volající navrhuje převod na „bezpečný účet“, chce autorizační kódy, nabízí instalaci AnyDesk; uživatel může odpovídat různými volbami, které vedou k bezpečnému/nebezpečnému výsledku.
- **Scénář 3 – investiční reklama s celebritou**
    - Banner „Zhodnoťte úspory snadno, vyděláte 4000 Kč denně“, obrázek známého Čecha.[^1_24][^1_19][^1_11][^1_25][^1_3]
    - Kliknutí na reklamu vede na „investiční portál“, pak „poradce“ volá; simulace ukáže, jak krok po kroku senior posílá větší částky a jak by měl na podobnou nabídku reagovat.
- **Scénář 4 – phishing e‑mail z banky/pošty**
    - Ukázka e‑mailu „z banky“ s odkazem na přihlášení; v detailu je vidět podivná adresa odesílatele a falešná doména.[^1_7][^1_14][^1_10][^1_22][^1_1][^1_20]
    - Uživateli dáš možnost: kliknout na odkaz, zkontrolovat adresu, smazat mail, ověřit přes infolinku.
- **Scénář 5 – falešná technická podpora (Microsoft)**
    - Popup v prohlížeči „Máte virus, volejte support“, nebo telefonát v angličtině „I am from Microsoft, your PC is infected“.[^1_16]
    - Volající vede uživatele k instalaci vzdáleného přístupu; simulace demonstruje, co všechno útočník vidí a může dělat a jak měl senior reagovat (okamžitě ukončit hovor).
- **Scénář 6 – QR platba na podvodný účet**
    - Senior skenuje QR kód pro „zaplatit fakturu“, ale aplikace mu ukáže, že částka nebo účet nesedí.[^1_15][^1_6]
    - Uživatel se učí kontrolovat detaily platby před odesláním.
- **Scénář 7 – „vnuk v nouzi“ nebo romantický podvod**
    - Zpráva nebo telefonát: „Jsem vnuk, mám problém, potřebuju rychle peníze“ nebo „partner/partnerka z internetu, která prosí o pomoc“.[^1_21][^1_7]
    - Simulace ukáže, jak ověřit identitu (zpětné zavolání na známé číslo, dotaz na něco, co ví jen skutečný vnuk, kontrola profilu), a jaké chyby vedou ke ztrátě peněz.

______________________________________________________________________

Pokud chceš, další krok může být sestavit konkrétní user‑flow diagramy pro každou simulaci (obrazovky, volby, texty), aby se to dalo rovnou předat vývojáři nebo začít prototypovat v Figma / webu.

<span style="display:none">[^1_29][^1_30]</span>

<div align="center">⁂</div>

[^1_1]: https://bezpecnejsi.ostrava.cz/situace/internet/phishing-utoky-pres-zpravy/

[^1_2]: https://policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy

[^1_3]: https://zpravy.tiscali.cz/veta-zhodnotte-uspory-snadno-a-rychle-vas-muze-pripravit-o-vsechno-622736

[^1_4]: https://policie.gov.cz/clanek/or-melnik-zpravodajstvi-pozor-na-podvody-na-internetu.aspx

[^1_5]: https://www.cnb.cz/cs/casto-kladene-dotazy/Podvody-v-platebnim-styku

[^1_6]: https://www.airbank.cz/co-vas-nejvic-zajima/podvody-ktere-zrovna-leti/

[^1_7]: https://www.penize.cz/galerie/476242/476310

[^1_8]: https://policie.gov.cz/kyberkriminalita/druhy-podvodu-2

[^1_9]: https://www.cnb.cz/cs/dohled-financni-trh/ochrana-spotrebitele/upozorneni/Varovani-pred-opakujicimi-se-podvody-00001/

[^1_10]: https://www.denik.cz/krimi/podvodne-sms-phising.html

[^1_11]: https://www.echo24.cz/a/H7nLd/zpravy-domov-podvodnici-obrali-seniorku-z-decina-o-800-tisic

[^1_12]: https://www.novinky.cz/clanek/internet-a-pc-bezpecnost-pred-kyberpodvody-se-citi-jiste-jen-desetina-senioru-problemy-jim-zpusobilo-falesne-video-se-spotakovou-40514109

[^1_13]: https://policie.gov.cz/clanek/seniori-v-bezpeci-361510.aspx

[^1_14]: https://www.ceskaposta.cz/o-ceske-poste/bezpecnostni-informace

[^1_15]: https://www.cnb.cz/cs/dohled-financni-trh/ochrana-spotrebitele/online-podvody-chrante-sve-penize/

[^1_16]: https://zpravy.aktualne.cz/domaci/podvodne-hovory-a-smsky/r~ca2949c8d6b711ecba5b0cc47ab5f122/

[^1_17]: https://www.nmps.cz/content/files/aktuality/VAROVÁNÍ!!!%20PODVODN%C3%8DCI%20VYKR%C3%81DAJ%C3%8D%20BANKOVN%C3%8D%20%C3%9A%C4%8CTY%20(003)%20(003).pdf

[^1_18]: https://policie.gov.cz/clanek/falesny-financni-poradce-pracoval-se-svou-obeti-tri-mesice-trpelivost-mu-vynesla-537-000-korun.aspx

[^1_19]: https://www.hasici.cz/zhave-aktuality/Z-regionu/Jihocesky-kraj/Podvodnici-zneuzili-duveru-seniorky-Kvuli-falesne

[^1_20]: https://www.eset.com/cz/o-nas/pro-novinare/tiskove-zpravy/kyberpodvody-v-cesku-koncem-roku-se-podvody-nejvice-sirily-pres-e-mail-utocnici-chteli-hlavne-nase-prihlasovaci-udaje/

[^1_21]: https://theses.cz/id/bkznug/Diplomova_prace_Janis_Izabela_Rizika_online_prostr_edi\_\_u.pdf

[^1_22]: https://policie.gov.cz/clanek/pomoc-obetem-tc-pocitacova-kriminalita.aspx

[^1_23]: https://bakalarky.vsers.cz/2025/Kombinované/Tomková Veronika/Podvody páchané v kybernetickém prostoru mířené proti seniorům v České republice.pdf

[^1_24]: https://www.novinky.cz/clanek/krimi-seniorka-chtela-investovat-podvodnici-ji-pripravili-o-skoro-pul-milionu-korun-40589728

[^1_25]: https://www.novinky.cz/clanek/internet-a-pc-bezpecnost-nez-ji-ucet-zablokovala-banka-poslala-seniorka-z-prostejova-podvodnikum-skoro-milion-korun-40570209

[^1_26]: https://policie.gov.cz/clanek/podvod-pri-investovani-na-internetu.aspx

[^1_27]: https://policie.gov.cz/clanek/anydesk-je-host-ktery-se-nezouva.aspx

[^1_28]: https://policie.gov.cz/clanek/or-melnik-zpravodajstvi-pomahame-seniorum-chranime-seniory-vylakani-citlivych-udaju-a-pristupovych-hesel.aspx

[^1_29]: https://ctu.gov.cz/sites/default/files/obsah/ctu/monitorovaci-zprava-c.8/2018/obrazky/mz-2018-08.pdf

[^1_30]: https://www.cnb.cz/cs/dohled-financni-trh/ochrana-spotrebitele/upozorneni/Vishing-Upozornujeme-na-telefonaty-zneuzivajici-jmeno-CNB/

