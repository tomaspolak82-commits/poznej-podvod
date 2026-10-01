# Návrhy textů: sekce Prohlížeč (dávka 1. 10. 2026)

**Stav: čeká na schválení.** Všechny texty pro hráče v sekci Prohlížeč v jedné dávce. Plán a rozhodnutí: `docs/plany/plan-prohlizec.md`. Náčrt vzhledu: `docs/plany/nacrt-prohlizec.html`.

Zrychlený režim: vysvětlení jsou obecné rady vlastními slovy, žádné tvrzení za úřady ani firmy. Banka, obchody a stránky jsou smyšlené.

## A. Ověřené adresy a číslo (1. 10. 2026)

| Co | Kde | Výsledek |
|---|---|---|
| telefon-vyhra-dnes.cz | prohlizec-01 | registr CZ.NIC 404, DNS neexistuje |
| rajcata-na-zahrade.cz | prohlizec-02 | 404, DNS neexistuje |
| javor-overeni-uctu.cz | prohlizec-03 | 404, DNS neexistuje |
| autobusy-jizdni-rad.cz | prohlizec-04 | 404, DNS neexistuje |
| regionalni-zpravodaj-dnes.cz | prohlizec-05 | 404, DNS neexistuje |
| vylety-s-vnoucaty.cz | prohlizec-06 | 404, DNS neexistuje |
| kniha-pro-radost-eshop.cz | prohlizec-07 | 404, DNS neexistuje |
| domaci-pomocnik-obchod.cz | prohlizec-08 | 404, DNS neexistuje |
| +420 772 163 940 | prohlizec-02 | blok 772 100 000 až 772 199 999 bez držitele (data ČTÚ z 1. 10. 2026, 13 213 řádků, žádný rozsah blok nepřekrývá; kontrola metody: stejný výpočet najde přidělený rozsah 772 720 000 až 772 729 999, IPEX TELCO a.s.) |

Metoda u adres: dotaz do registru CZ.NIC (rdap.nic.cz) vrátil 404 a jméno se v DNS nenašlo. Kontrola metody: menestarosti.cz registr najde (aktivní), DNS ho najde.

**Prosím ověř:** že názvy „Banka Javor“, „Kniha pro radost“ (už je ve `zpravy-09`) a „Domácí pomocník“ nepatří skutečné bance nebo obchodu, který by si to mohl vztáhnout na sebe. Ověřené to nemám.

## B. Texty sekce (mimo scénáře)

### Dlaždice na hlavní stránce (nahrazuje „Falešné reklamy, výhry a vyskakovací okna.“)
```
Falešné výhry, vyskakovací okna a přihlašovací stránky. Naučíte se, kam se v prohlížeči dívat.
```

### Úvod o adresním řádku (na výběru úrovně Prohlížeče, nad volbou úrovně)

Navrhuji ho ukazovat **pokaždé**, ne jen při prvním vstupu. Je krátký, opakování seniorům pomůže a nepotřebuje paměť prohlížeče, takže funguje i v anonymním okně. Vedle textu bude malý obrázek adresního řádku (viz náčrt).

```
Než začnete: adresní řádek

Nahoře v prohlížeči je adresní řádek. Je v něm adresa stránky, na které právě jste, třeba poznej-podvod.menestarosti.cz. Adresu tam píše prohlížeč, ne stránka.

Vlevo od adresy prohlížeč ukazuje, jestli je stránka zabezpečená. Když je tam varování, například nápis „Nezabezpečeno“, trojúhelník s vykřičníkem nebo přeškrtnutý zámek, nic do stránky nezadávejte. Údaje by šly jako pohlednice: nepřečte je každý, ale kdo chce, cestou je přečte, třeba na veřejné Wi-Fi.

Platí to ale jen jedním směrem. Když varování chybí, stránka tím ještě není poctivá. Zabezpečení mají i podvodné stránky. Vždy se ptejte, jak jste se na stránku dostali a co po vás chce.

Každý prohlížeč to ukazuje trochu jinak. V tréninku uvidíte žlutý trojúhelník s vykřičníkem.

Když prohlížeč ukáže varování přes celou obrazovku, stiskněte Zpět a na stránku nepokračujte.
```

### Úrovně (jen v Prohlížeči, E-mail a Zprávy beze změny)
```
Základní: Prohlédnete si stránku a rozhodnete: je to podvod, nebo je v pořádku?
```
```
Pokročilá: Nejdřív klepnutím označíte všechno, co vám na stránce přijde podezřelé. Pak rozhodnete. Za každé správně nalezené místo získáte bod navíc.
```

### Nápověda „Na co si dát pozor?“
```
Na co si dát pozor v prohlížeči

1. Jak jste se na stránku dostali. Stránka, kterou jste otevřeli sami, je jiná situace než stránka, kam vás poslal odkaz ve zprávě nebo reklama. Na přihlášení a placení choďte adresou, kterou si napíšete sami nebo máte uloženou.

2. Varování vlevo od adresy. Když tam prohlížeč ukazuje varování (nápis „Nezabezpečeno“, trojúhelník s vykřičníkem nebo přeškrtnutý zámek), nic do stránky nezadávejte. Údaje by šly jako pohlednice: nepřečte je každý, ale kdo chce, cestou je přečte, třeba na veřejné Wi-Fi.

3. Bez varování ještě neznamená poctivě. Zabezpečení mají i podvodné stránky. Vždy se ptejte, co po vás stránka chce.

4. Adresa, která nesedí. Věřte adrese v řádku nahoře, ne tomu, co o sobě píše stránka. Pozor na adresy, které jen obsahují známé jméno, třeba jméno vaší banky s dalšími slovy.

5. Stránka nebo okno, které straší nebo slibuje výhru. „Telefon je napadený“, „Vyhráli jste“. Stránka nepozná, co máte v telefonu. Výhra v soutěži, do které jste se nepřihlásili, je důvod zpozornět. Nevolejte, nic neinstalujte a stránku zavřete.

6. Údaje, které stránka nepotřebuje. PIN, kód z SMS nebo číslo karty jinde než při placení za věc, kterou jste si sami vybrali.

Pozor: i stránka v bezchybné češtině může být podvod. Podvodníci dnes píšou s pomocí umělé inteligence.

Když prohlížeč ukáže varování přes celou obrazovku, stiskněte Zpět a na stránku nepokračujte. Když si nejste jistí, stránku zavřete a adresu napište sami.
```

### Kolo, vyhodnocení, konec kola (jen v Prohlížeči)

| Kde | E-mail a Zprávy (beze změny) | Prohlížeč |
|---|---|---|
| průběh | Zpráva 2 z 5 | Stránka 2 z 5 |
| pokyn v pokročilé úrovni | …co vám na zprávě přijde podezřelé… | Klepněte na všechno, co vám na stránce přijde podezřelé. Druhým klepnutím označení zrušíte. Pak rozhodněte. |
| správně, legitimní | Správně, zpráva je v pořádku. / …že je pravá. | Správně, stránka je v pořádku. / Podívejte se, podle čeho se dá poznat, že je v pořádku. |
| přehlédnutý podvod | Tahle zpráva je podvod. | Tahle stránka je podvod. |
| legitimní označená za podvod | Tahle zpráva je ve skutečnosti v pořádku. / …že je pravá. | Tahle stránka je ve skutečnosti v pořádku. / Opatrnost je dobrá. Podívejte se, podle čeho se dá poznat, že je v pořádku. |
| legitimní bez označení | …na zprávě nebylo nic podezřelého. | Nic jste neoznačili, správně: na stránce nebylo nic podezřelého. |
| legitimní s označením | Na zprávě nebylo nic podezřelého… | Na stránce nebylo nic podezřelého. Označená místa jsou v pořádku. |
| tlačítko dál | Další zpráva | Další stránka |
| konec kola | Hotovo, máte za sebou 5 zpráv. | Hotovo, máte za sebou 5 stránek. |
| okno nesouladu, text | Zprávu ale hodnotíte jako podvod… | Stránku ale hodnotíte jako podvod. Chcete ještě označit, co vám přišlo podezřelé? |
| okno nesouladu, text | Zprávu ale hodnotíte jako v pořádku… | Stránku ale hodnotíte jako v pořádku. Je to tak? |
| okno nesouladu, tlačítko | Zpět ke zprávě | Zpět ke stránce |

„Je to podvod“ / „Je to v pořádku“, nadpisy oken nesouladu, „Našli jste“ a ostatní stavy zůstávají stejné.

### Simulovaný prohlížeč

Karta nad prohlížečem, nadpis:
```
Jak jste se sem dostali
```

Varování vlevo od adresy (jen u nezabezpečené stránky):
- základní úroveň, viditelný text: `Nezabezpečeno`
- pokročilá úroveň: jen ikona, bez textu
- popis pro čtečku obrazovky v základní úrovni (obsahuje viditelný text): `Nezabezpečeno: stránka není zabezpečená`
- popis pro čtečku v pokročilé úrovni: `Varování: stránka není zabezpečená`
- ve vyhodnocení vždy ikona i nápis `Nezabezpečeno` (obě úrovně), aby bylo jasné, na co žárovka ukazuje

Popis adresy pro čtečku:
```
Adresa stránky: {adresa}
```

Upozornění po klepnutí na tlačítko stránky nebo okna (i na křížek okna), stejné u podvodu i legitimní stránky:
```
Tohle je jen trénink, tlačítko nic nedělá a nic se neodeslalo. Rozhodněte dole, jestli je stránka podvod, nebo v pořádku.
```

Upozornění po klepnutí na pole formuláře (do pole se psát nedá), stejné u podvodu i legitimní stránky:
```
Tohle je jen trénink, do pole se psát nedá a nic se neodesílá. Rozhodněte dole, jestli je stránka podvod, nebo v pořádku.
```

Reklama (banner) po klepnutí ukáže stávající upozornění na odkaz („Tohle je jen trénink, odkaz nikam nevede…“).

### Štítek kategorie (statistika „Nejčastěji vám unikalo“)
```
adresa stránky nebo varování u ní
```
Kategorie `adresa-stranky`. Varování o nezabezpečené stránce do ní patří taky, aby nevznikala další nová kategorie.

## C. Scénáře

Zápis: `[část]` je označitelná část (stejně jako bubliny ve Zprávách). Karta „Jak jste se sem dostali“, ikony prohlížeče a ztmavená stránka pod oknem se označit nedají.

Rozložení příchodů (rozhodnutí 2): nevinný příchod mají podvody 02 (článek) a 04 (vyhledávání). Přes odkaz přišla legitimní stránka 06 (odkaz od vnučky).

---

### prohlizec-01: Výhra telefonu za poštovné (podvod, nezabezpečená stránka)

```
Jak jste se sem dostali: Hledali jste recept na švestkový koláč. Na stránce s recepty jste klepli na barevný pruh „Vyhrajte nový telefon“.

[security] ⚠ Nezabezpečeno
[address] telefon-vyhra-dnes.cz
[heading] Gratulujeme! Jste dnešní výherce.
[body.0] Nový chytrý telefon je váš. Zaplatíte jen poštovné 49 Kč.
[body.1] Nabídka platí ještě 9 minut 59 sekund.
[fields.0] Jméno a příjmení
[fields.1] Adresa pro doručení
[fields.2] Číslo karty, platnost a kód ze zadní strany
[button] Odeslat
```

Hrozby:
1. `security` + `address`, `fields.0`, `fields.1` · adresa-stranky · **Varování u adresy**
```
Vlevo od adresy prohlížeč ukazuje, že stránka není zabezpečená. Na takové stránce nic nezadávejte, ani jméno a adresu. Údaje by šly jako pohlednice: nepřečte je každý, ale kdo chce, cestou je přečte, třeba na veřejné Wi-Fi.
```
2. `heading` + `body.0` · vyhra-nabidka · **Výhra za poštovné**
```
Výhra v soutěži, do které jste se nepřihlásili, je důvod zpozornět. Malé poštovné má jen získat číslo vaší karty.
```
3. `body.1` · casovy-tlak · **Odpočet**
```
Odpočet má zabránit tomu, abyste se v klidu zamysleli. Poctivá nabídka vám nezmizí za deset minut.
```
4. `fields.2` · zadost-o-udaje · **Číslo karty**
```
Číslo karty i s kódem ze zadní strany stačí k tomu, aby z ní někdo platil. Na stránce, kam vás zavedla reklama, ho nezadávejte.
```
Nevinná část: `button` („Odeslat“).

Shrnutí:
```
Výhra, o kterou jste se nesnažili, a k tomu poštovné kartou: to je častý trik. A když prohlížeč u adresy ukazuje varování, do stránky nic nezadávejte, ať slibuje cokoli.
```

Kontrola nápovědy: bod 1 (příchod přes reklamu) nevede k části stránky; bod 2 vede k varování a polím → hrozba 1; bod 4 vede k adrese → hrozba 1; bod 5 vede k výhře → hrozba 2; bod 6 vede k číslu karty → hrozba 4. „Odeslat“ nevede nikam.

---

### prohlizec-02: Telefon je zablokovaný, volejte podporu (podvod, okno)

```
Jak jste se sem dostali: Četli jste na internetu článek o pěstování rajčat. Najednou se přes stránku objevilo okno.

[address] rajcata-na-zahrade.cz
(stránka s článkem je ztmavená, nejde označit)

Okno:
[popup.title] Váš telefon je zablokovaný
[popup.body.0] Bezpečnostní kontrola našla 3 viry. Vaše fotky, hesla a údaje z banky mohou být ukradeny.
[popup.body.1] Telefon nevypínejte a do 5 minut zavolejte technickou podporu: +420 772 163 940.
[popup.button.0] Zavolat podporu
```

Hrozby:
1. `popup.title` + `popup.body.0` · emocni-natlak · **Strašení viry**
```
Okno na stránce nepozná, co máte v telefonu. Nenakreslil ho váš telefon, ale stránka. Strach z virů a ukradených peněz má zabránit tomu, abyste se v klidu zamysleli. U adresy přitom žádné varování není: zabezpečení samo nerozhoduje, mají ho i podvodné stránky.
```
2. `popup.body.1` + `popup.button.0` · neobvykla-zadost · **Výzva k zavolání**
```
Na druhé straně by vás čekal podvodník, který by chtěl peníze nebo přístup do vašeho telefonu. Spěch „do 5 minut“ k tomu patří.
```
Nevinná část: `address` (stránka s článkem, kterou jste četli).

Shrnutí:
```
Když na vás stránka vybafne, že máte virus, nevolejte a na nic v okně neklepejte. Stránku zavřete. Když nejde zavřít, zavřete celý prohlížeč. Když se bojíte, že je s telefonem něco v nepořádku, zeptejte se někoho, komu věříte.
```

Kontrola nápovědy: bod 5 vede k oknu, které straší, k zavolání i k tlačítku → hrozby 1 a 2. Bod 4: adresa odpovídá článku, který jste četli, nevede.

---

### prohlizec-03: Ověření účtu v Bance Javor (podvod, falešné přihlášení)

```
Jak jste se sem dostali: Máte účet v Bance Javor. Přišla vám SMS, že váš účet bude zablokován, pokud se dnes neověříte. Klepli jste na odkaz v ní.

[address] javor-overeni-uctu.cz
[heading] Banka Javor: ověření účtu
[body.0] Z bezpečnostních důvodů jsme omezili váš účet. Pro obnovení se přihlaste a ověřte svou kartu.
[fields.0] Přihlašovací jméno
[fields.1] Heslo
[fields.2] Číslo karty
[fields.3] Kód z SMS
[button] Přihlásit a ověřit
```

Hrozby:
1. `address` · adresa-stranky · **Adresa stránky**
```
Na přihlášení do banky choďte adresou, kterou si napíšete sami nebo máte uloženou. Tahle stránka se otevřela z odkazu v SMS a adresa jen obsahuje slovo „javor“. U adresy přitom žádné varování není: zabezpečení samo nerozhoduje, mají ho i podvodné stránky.
```
2. `body.0` · emocni-natlak · **Omezený účet**
```
Hrozba zablokováním má vystrašit, abyste jednali hned a nepřemýšleli.
```
3. `fields.0` + `fields.1`, `fields.2`, `fields.3` · zadost-o-udaje · **Přihlášení, karta i kód**
```
Stránka, na kterou vás poslal odkaz ze zprávy, chce přihlašovací údaje, číslo karty i kód z SMS. Kvůli přihlášení není potřeba zadávat číslo karty. Kód z SMS je jako klíč: kdo ho má, může potvrdit platbu z vašeho účtu.
```
Nevinné části: `heading`, `button`.

Shrnutí:
```
Když vám zpráva hrozí zablokováním účtu, neklikejte na odkaz v ní. Otevřete si bankovnictví sami, jako obvykle, nebo zavolejte na číslo, které máte na kartě.
```

Kontrola nápovědy: bod 1 (odkaz ze SMS) a bod 6 vedou k polím → hrozba 3; bod 4 vede k adrese → hrozba 1; bod 5 se strachem vede k body.0 → hrozba 2. Nadpis a tlačítko nevedou.

---

### prohlizec-04: Falešné varování na stránce s jízdními řády (podvod, instalace)

```
Jak jste se sem dostali: Hledali jste jízdní řád autobusu a otevřeli jste jeden z výsledků hledání.

[address] autobusy-jizdni-rad.cz
[heading] Jízdní řády autobusů
[banner] ⚠ Vaše připojení není zabezpečené!
[body.0] Váš prohlížeč je zastaralý a vaše údaje může kdokoli vidět. Nainstalujte si aplikaci Bezpečný surf a chraňte se.
[button] Stáhnout ochranu
```
Žlutý pruh s vykřičníkem nakreslila stránka uprostřed obsahu. Prohlížeč u adresy žádné varování neukazuje.

Hrozby:
1. `banner` + `body.0` · emocni-natlak · **Varování od stránky**
```
Skutečné varování ukazuje prohlížeč vlevo od adresy nebo přes celou obrazovku, ne stránka uprostřed textu. U adresy tu žádné varování není. Tohle „varování“ si nakreslila stránka sama, aby vás vystrašila. A naopak: že u adresy varování chybí, ještě neznamená, že je stránka poctivá.
```
2. `button` · instalace-aplikace · **Stažení aplikace**
```
Aplikace instalujte jen z obchodu s aplikacemi ve svém telefonu, ne přes tlačítko na stránce. Aplikace z neznámé stránky může v telefonu napáchat škody.
```
Nevinné části: `address`, `heading`.

Shrnutí:
```
Varování o bezpečnosti hledejte vlevo od adresy, tam ho ukazuje prohlížeč. Co nakreslí stránka, může být past. Když stránka chce, abyste si kvůli bezpečí něco stáhli, zavřete ji.
```

Kontrola nápovědy: bod 2 (varování vlevo od adresy) k pruhu na stránce nevede, pruh ale straší → bod 5 → hrozba 1; bod 5 „nic neinstalujte“ → hrozba 2. Bod 4: adresa odpovídá hledání, nevede.

Zdroj, že se tento typ v ČR děje: zatím nemám. Když ho nenajdu, navrhnu náhradu (falešnou platební stránku pro prodávající z bazaru, k té zdroje jsou).

---

### prohlizec-05: Zpravodajská stránka s reklamou (legitimní)

Vyvrací: „Když je na stránce reklama nebo sleva, je to podvod.“

```
Jak jste se sem dostali: Otevřeli jste si zpravodajskou stránku, kterou čtete každý den. Máte ji uloženou v záložkách.

[address] regionalni-zpravodaj-dnes.cz
[heading] Obec opraví most přes řeku do konce října
[body.0] Oprava začne v pondělí. Po dobu prací pojede autobus objížďkou přes Horní Lhotu.
[banner] Zimní bundy se slevou 30 % · Obchod U Lípy
[body.1] Starosta prosí řidiče o trpělivost a o dodržování dočasného značení.
```

Hrozby: žádné.

Shrnutí:
```
Reklama je na většině stránek a sama o sobě podvod není. Tahle nabízí slevu na zboží, ale nic po vás nechce: žádné údaje, žádnou platbu za výhru. Kdybyste na reklamu klepli, dívejte se znovu, kam jste se dostali a co stránka chce.
```

Kontrola nápovědy: bod 5 (výhra, strašení) k obyčejné slevě nevede, body 2, 4, 6 nevedou (bez varování, adresa odpovídá, nic nechce).

---

### prohlizec-06: Souhlas s cookies na stránce o výletech (legitimní, okno, příchod přes odkaz)

Vyvrací: „Když na stránce vyskočí okno, je to podvod.“

```
Jak jste se sem dostali: Vnučka vám ve zprávě poslala odkaz na článek o výletech s vnoučaty. Klepli jste na něj.

[address] vylety-s-vnoucaty.cz
(článek pod oknem je ztmavený, nejde označit)

Okno:
[popup.title] Souhlas s cookies
[popup.body.0] Tato stránka si do vašeho prohlížeče ukládá malé soubory (cookies), aby fungovala a aby mohla měřit návštěvnost. Můžete souhlasit, nebo odmítnout.
[popup.button.0] Přijmout vše
[popup.button.1] Jen nezbytné
```

Hrozby: žádné.

Shrnutí:
```
Okno se souhlasem s cookies uvidíte na velké části stránek. Chce jen vaši volbu, ne peníze, údaje ani kód. Klidně zvolte tu možnost, která dovolí méně, třeba „Jen nezbytné“. Ani to, že vás sem poslal odkaz, neznamená samo o sobě podvod. Rozhoduje, co stránka chce.
```

Kontrola nápovědy: bod 1 (odkaz ze zprávy) neznamená, že je co označit; bod 5 (okno, které straší nebo slibuje výhru) nevede, okno nestraší; bod 6 nevede.
Pozor na sekci 7: důvodem důvěry není, že odkaz poslala vnučka (zpráva od blízkého jde podvrhnout), ale to, co stránka chce.

---

### prohlizec-07: Přihlášení do e-shopu, který jste otevřeli sami (legitimní)

Vyvrací: „Když stránka chce heslo, je to podvod.“

```
Jak jste se sem dostali: Chcete si v e-shopu Kniha pro radost, kde občas nakupujete, zkontrolovat objednávku. Adresu jste napsali sami.

[address] kniha-pro-radost-eshop.cz
[heading] Přihlášení
[body.0] Přihlaste se e-mailem a heslem, které jste zadali při registraci.
[fields.0] E-mail
[fields.1] Heslo
[button] Přihlásit se
```

Hrozby: žádné.

Shrnutí:
```
Přihlásit se heslem je běžné, když jste stránku otevřeli sami. Tahle chce jen e-mail a heslo k vašemu účtu v obchodě, nic navíc: žádné číslo karty ani kód z SMS. Kdyby vás na přihlášení poslal odkaz ve zprávě, adresu si raději napište sami.
```

Kontrola nápovědy: bod 1 (otevřeli jste sami) nevede; bod 6 (PIN, kód, karta) nevede, stránka je nechce; bod 4: adresa odpovídá obchodu, nevede.

---

### prohlizec-08: Placení kartou v e-shopu (legitimní, protějšek k falešnému varování)

Vyvrací: „Když stránka chce číslo karty, je to podvod.“

```
Jak jste se sem dostali: V e-shopu Domácí pomocník, kde už jste nakupovali, jste si do košíku dali rychlovarnou konvici a klepli na „Zaplatit“.

[address] domaci-pomocnik-obchod.cz
[heading] Platba kartou
[body.0] Objednávka č. 4417: rychlovarná konvice, 890 Kč.
[fields.0] Číslo karty
[fields.1] Platnost
[fields.2] Kód ze zadní strany karty
[button] Zaplatit 890 Kč
```

Hrozby: žádné.

Shrnutí:
```
Číslo karty se zadává, když za něco platíte. Tady jste si zboží vybrali sami a částka odpovídá objednávce. Že prohlížeč u adresy neukazuje žádné varování, samo nerozhoduje, zabezpečení mají i podvodné stránky. Rozhoduje, že platíte za věc, kterou jste si sami vybrali.
```

Kontrola nápovědy: bod 6 výslovně říká „jinde než při placení za věc, kterou jste si sami vybrali“, k číslu karty tu nevede. Body 1, 4, 5 nevedou.

## D. Co do první verze nepatří a proč (k rozhodnutí)

**Legitimní nezabezpečená stránka** (např. stránka obce s otevírací dobou, „Nezabezpečeno“, nic nechce) by nejlíp ukázala tvoje pravidlo „nezadávejte údaje, ne je to podvod“. Do první verze ji ale nenavrhuji:
- Nápověda (bod 2) k varování vede. U legitimní zprávy podle sekce 7 nesmí nápověda k označení vést nic. Hráč, který varování označí, by přišel o 2 body za označování.
- Vyhodnocení by u varování napsalo „Označeno zbytečně, tady je vše v pořádku“. U varování to není pravda.
- Vyřešit by to šlo jen změnou bodování nebo vyhodnocení ve společném kódu, a na to do zkoušky není čas.

Varování proto v první verzi uvidí hráč jen u podvodu (`prohlizec-01`). Že to není automaticky podvod, říkají úvod, nápověda a vysvětlení („nic do stránky nezadávejte“, ne „je to podvod“).
