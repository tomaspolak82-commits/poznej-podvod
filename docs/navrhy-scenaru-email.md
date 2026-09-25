# Návrhy scénářů pro E-mail (k Tomášovu schválení)

Připraveno 24. 9. 2026. Tomáš návrhy schválil a 24. 9. 2026 jsou zabudované ve hře jako `email-04` až `email-08` (nahradily testovací obsah `email-04` až `email-07`). Platné znění je od té chvíle v `src/content/email/` a `src/texts.js`, tento dokument zůstává jako záznam zdrojů a rozhodnutí.

Vychází z `docs/napady-scenaru.md` (E14, E11 + E9, E16, L9, L5) a z pravidel sekce 7 v `CLAUDE.md`. Každý text je návrh, ne citace skutečného podvodu.

**Jak jsou ověřené zdroje:**
- **doslova ověřeno:** stáhl jsem stránku (`curl`), odstranil značky HTML a větu jsem našel přímo v jejím textu.
- **jen shrnutí pomocného modelu:** větu uvedl vyhledávač nebo WebFetch, v textu stránky jsem ji sám nenašel.

Všechny citace níže jsou **doslova ověřené**. Shrnutí pomocného modelu jsem k žádnému tvrzení ve scénářích nepoužil. Vyhledávač mi jen ukázal, kde hledat (Zásilkovna).

**Pestrost** (k současným `email-01` pošta/kliknout/výhra a `email-02` úřad/údaje/spěch):

| Scénář | Za koho se vydává | Co chce | Tlak | Obtížnost |
|---|---|---|---|---|
| email-04 | firma (dodavatel) | otevřít přílohu | strach z dluhu, spěch | těžký |
| email-05 | energie (ČEZ) | zadat údaje z karty | peníze zpět, spěch | střední |
| email-06 | vyděrač (ne instituce) | zaplatit bitcoiny | strach | snadný až střední |
| email-07 | legitimní: Zásilkovna s odkazem | nic | nic | |
| email-08 | legitimní: vnučka s fotkou v příloze | nic | nic | |

Všechny tři podvody jsou v bezchybné češtině. V sekci by tak bylo 5 podvodů, z toho 1 s chybou v zápisu (`email-01`).

**Kontrola „co hráč označí podle nápovědy“** (sekce 7) je u každého scénáře zvlášť. Kontrola je proti **navrženému** znění bodů 4 a 5 nápovědy. S dnešním zněním by `email-07` a `email-08` pravidlo porušily. Znění i souhrnná tabulka jsou na konci dokumentu.

**Pravidlo A (aspoň jedna nevinná část):** splňují všechny tři podvody, nevinná část je u každého vyznačená.

---

## email-04: Upomínka neuhrazené faktury s přílohou (podvod, těžký)

Za koho se vydává: neznámá firma. Co chce: otevřít přílohu. Tlak: strach z dluhu, spěch. Námět E14.

```
Od: Kalvora velkoobchod
Adresa (po „▾ zobrazit adresu“): fakturace@kalvora-velkoobchod.cz
Datum: dnes 10:03
Předmět: Upomínka: neuhrazená faktura č. 2026-0917

[body.0] Dobrý den,
[body.1] při kontrole účetnictví jsme zjistili, že dosud nebyla uhrazena faktura č. 2026-0917 na částku 4 368 Kč.
[body.2] Fakturu i údaje k platbě najdete v příloze.
[body.3] Prosíme o úhradu do 3 pracovních dnů. Jinak budeme nuceni předat pohledávku k vymáhání.
[body.4] Pokud jste fakturu mezitím uhradili, považujte prosím tuto zprávu za bezpředmětnou.
[body.5] S pozdravem, účtárna Kalvora velkoobchod s.r.o.
[attachment] Faktura_2026-0917.doc
```

| Část | Kategorie | Název | Vysvětlení pro hráče |
|---|---|---|---|
| `attachment` + `alsoTargets: ["body.2"]` | priloha | Číslo účtu jen v příloze | Číslo účtu v textu chybí, abyste museli otevřít přílohu. Podle iROZHLASu byl právě v takových přílohách škodlivý program. |
| `body.1` + `alsoTargets: ["subject", "body.0"]` | neobvykla-zadost | Faktura, o které nic nevíte | Upomínka nepíše, za co faktura je, a neosloví vás jménem. Když si nevzpomínáte, že byste u této firmy něco objednali, je to důvod zpozornět. |
| `body.3` | casovy-tlak | Spěch a hrozba vymáháním | Krátká lhůta a hrozba vymáháním mají zabránit tomu, abyste si věc v klidu ověřili. |

**Změna podle vašeho rozhodnutí:** jméno, adresa a podpis firmy už **nejsou hrozba**. Adresa odpovídá jménu firmy, faktury posílají i řemeslníci a samotná faktura od firmy podezřelá není. Kdo označí adresu jen proto, že firmu nezná, dostane −1.

Nevinné části: `fromName`, `fromAddress`, `body.4` („Pokud jste fakturu mezitím uhradili…“) a `body.5` (podpis). Nápověda k nim nevede.

Shrnutí:
```
Faktura od firmy sama o sobě podvod není, posílají je i řemeslníci. Tahle ale nepíše, za co je, a číslo účtu schovává do přílohy. Když si nevzpomínáte, že byste něco objednali, přílohu neotevírejte. Ověřte si to u firmy na čísle, které si sami najdete, ne na čísle ze zprávy.
```

Zdroje (`sources`): irozhlas.cz/veda-technologie/technologie/malware-podvodny-e-mail-virus_2002180914_sot (18. 2. 2020)
- „Text e-mailu je na rozdíl od jiných podvodných zpráv napsaný slušnou češtinou“ (doslova)
- „Některé upozorňují na nezaplacené faktury, většina pak předkládá výzvu k zaplacení, ale v textu třeba chybí číslo účtu. Příjemce je tak nucen si rozkliknout přílohu, která je zavirovaná.“ (doslova)
- „obsahuje ale přílohu, která na první podle vypadá jako textový soubor s příponou .doc“ (doslova, včetně překlepu „podle“ v originále)

Kontrola nápovědy (proti novému znění bodů 4 a 5, viz konec dokumentu):
- bod 1 (adresa) → adresa odpovídá jménu firmy, k označení nevede. Nápověda říká adresu zkontrolovat, ne označit každou neznámou.
- bod 2 (oslovení) → obecné „Dobrý den,“ (`body.0`) ✓ v `alsoTargets`
- bod 3 (spěch, strach, „hrozí exekuce“) → `body.3` ✓, předmět „Upomínka“ ✓ v `alsoTargets`
- bod 4 (odkaz nebo tlačítko) → zpráva žádné nemá
- bod 5 (příloha, o které nic nevíte) → `attachment`, `body.2` ✓
- bod 6 → nevede

Poznámky:
- Doména `kalvora-velkoobchod.cz`: registr `.cz` (RDAP) vrací 404, DNS neexistuje (24. 9. 2026). Kontrola: `nic.cz` vrací 200.
- Název „Kalvora“: v obchodním rejstříku (ARES) 0 výsledků (24. 9. 2026). Původně jsem zkoušel „Vasko“, ale to je běžné příjmení (ARES 202 výsledků), proto jsem ho zahodil.
- Věta ze zdroje „Po prozkoumání dokumentů…“ a jméno podepsaného člověka se záměrně nepřebírají, text je vlastní.
- **Stopa „nic jste neobjednali“** plyne z textu: `body.1` záměrně neříká, za co faktura je. Hráč si tak nemá co vybavit.

---

## email-05: Falešný ČEZ vrací přeplatek, chce údaje z karty (podvod)

Za koho se vydává: energie (ČEZ). Co chce: zadat údaje z karty. Tlak: peníze zpět, spěch. Námět E11 + E9.

Je to záměrná dvojice k legitimnímu `email-03` (pravý ČEZ, přeplatek, nic nechce): stejná situace, rozdíl je v tom, co zpráva chce.

```
Od: ČEZ Prodej
Adresa (po „▾ zobrazit adresu“): preplatky@cez-vyuctovani.cz
Datum: dnes 16:22
Předmět: Vrácení přeplatku za elektřinu

[body.0] Dobrý den, paní Nováková,
[body.1] při vyúčtování elektřiny za uplynulý rok Vám vznikl přeplatek 2 180 Kč.
[body.2] Abychom Vám ho mohli vrátit, potvrďte prosím údaje své platební karty: číslo karty, datum platnosti a trojmístný kód z její zadní strany.
[body.3] Údaje prosím potvrďte do 5 dnů. Jinak nárok na vrácení přeplatku zanikne.
[body.4] S pozdravem, ČEZ Prodej
[button] Potvrdit údaje karty
```

| Část | Kategorie | Název | Vysvětlení pro hráče |
|---|---|---|---|
| `fromAddress` + `alsoTargets: ["fromName", "body.4"]` | odesilatel | Adresa odesílatele | Jméno ČEZ Prodej si může napsat kdokoli. ČEZ uvádí, že e-maily k platbám posílá z adres, které mají za zavináčem cez.cz. Tahle adresa končí na cez-vyuctovani.cz. |
| `body.2` + `alsoTargets: ["body.1", "subject"]` | zadost-o-udaje | Údaje z karty kvůli vrácení peněz | Když vám někdo vrací peníze, stačí mu číslo účtu. Česká spořitelna upozorňuje, že kvůli vrácení peněz po vás žádná skutečná instituce nebude chtít všechna čísla z karty. |
| `body.3` | casovy-tlak | Spěch | Krátká lhůta a hrozba, že o peníze přijdete, mají zabránit tomu, abyste si to v klidu ověřili. |
| `button` | odkaz-platba | Tlačítko k zadání karty | Tlačítko vede na stránku, kde byste údaje z karty dali podvodníkům. ČEZ radí údaje z platební karty nezadávat, pokud si nejste jistí, že e-mail přišel opravdu od něj. |

Nevinná část: `body.0` (oslovení jménem). Bod 2 nápovědy říká, že firma obvykle osloví jménem, takže k označení nevede. Shrnutí připomene, že jméno samo nic nezaručuje (stejně jako u `email-02`).

Shrnutí:
```
Oslovení jménem i částka vypadají věrohodně, ale kvůli vrácení peněz nikdo nepotřebuje číslo karty ani kód z její zadní strany. Stačí číslo účtu. Když si nejste jistí, přihlaste se do MŮJ ČEZ sami, ne přes tlačítko v e-mailu.
```

Zdroje:
- cez.cz/cs/podvodne-maily (datum na stránce není)
  - „E-maily k platbám vždy posíláme z adres, které mají za zavináčem uvedeno “cez.cz” (např. cez@cez.cz)“ (doslova)
  - „Údaje z platební karty a jiné citlivé údaje nezadávejte, pokud si nejste jistí, že e-mail přišel opravdu od nás.“ (doslova)
  - „Stav plateb a výsledek vyúčtování si bezpečně ověříte ve svém účtu v MŮJ ČEZ.“ (doslova)
- csas.cz/cs/zpravy-z-banky/2024/11/26/podvodnou-sms-nebo-e-mail-muzete-dostat-i-vy-jak-je-poznat-a-neprijit-o-penize (26. 11. 2024 podle adresy)
  - „Žádná ze skutečných institucí po vás kvůli vrácení peněz nikdy nebude požadovat všechna čísla z karty nebo přístupové údaje do George. Pokud vám vrací peníze, stačí jim číslo účtu.“ (doslova)
  - „Často se vydávají za známé společnosti nebo státní instituce (např. ČEZ , Česká pošta , portál MOJE daně atd.).“ (doslova)

Kontrola nápovědy:
- bod 1 → `fromName`, `fromAddress` ✓; podpis „ČEZ Prodej“ (`body.4`) ✓ v `alsoTargets`
- bod 2 → oslovení jménem k označení nevede (nevinná část)
- bod 3 → `body.3` ✓
- bod 4 (tlačítko, údaje z karty) → `button`, `body.2` ✓
- bod 6 (peníze „zpět“) → `body.1` a předmět „Vrácení přeplatku“ ✓ v `alsoTargets`

Poznámky:
- Doména `cez-vyuctovani.cz`: registr `.cz` (RDAP) 404, DNS neexistuje (24. 9. 2026).
- Je to **třetí scénář s ČEZ** (po `email-03` a tomto), ale jen druhý v bance, kde se ČEZ objevuje. Pokud chcete větší pestrost, šel by stejný scénář jako „dodavatel plynu“ bez jména, ale pak by nešlo použít zdroj ČEZ o adresách @cez.cz.
- Linku ČEZ 800 810 820 (je ve zdroji doslova) jsem do shrnutí nedal, aby ve hře nebylo skutečné telefonní číslo.

---

## email-06: Vyděračský e-mail „mám přístup k tvé kameře“ (podvod)

Za koho se vydává: vyděrač, žádná instituce. Co chce: zaplatit v bitcoinech. Tlak: strach. Námět E16, **bez erotického obsahu**.

```
Od: Jana Nováková   (vlastní jméno hráčky, stejné jako „Komu: Jana Nováková“)
Adresa (po „▾ zobrazit adresu“): k7m2q9x@post-schranka.top
Datum: dnes 3:17
Předmět: Poslední varování

[body.0] Mám přístup k tvému počítači i telefonu. Přes kameru jsem tě natáčel a mám kopii všech tvých kontaktů a zpráv.
[body.1] Možná se v počítačích moc nevyznáš, tak to řeknu jednoduše.
[body.2] Jestli nechceš, aby se videa a tvoje soukromé zprávy dostaly ke všem tvým známým, pošli mi 1 200 eur v bitcoinech.
[body.3] Máš 48 hodin. Když zprávu někomu ukážeš, video hned zveřejním.
```

| Část | Kategorie | Název | Vysvětlení pro hráče |
|---|---|---|---|
| `fromAddress` + `alsoTargets: ["fromName"]` | odesilatel | Vaše jméno jako odesílatel | Jako odesílatel je tu napsané vaše jméno. To si může napsat kdokoli. Adresa za ním je cizí. |
| `body.0` + `alsoTargets: ["subject"]` | emocni-natlak | Nic nemá | Pisatel nic nemá. Národní úřad pro kybernetickou bezpečnost uvádí, že autoři takových zpráv přístup k počítači nezískali a nic natočené nemají. Chtějí vás jen vyděsit. |
| `body.2` | neobvykla-zadost | Žádost o peníze | Neplaťte. Národní úřad pro kybernetickou bezpečnost radí peníze v žádném případě neposílat. |
| `body.3` | casovy-tlak | Lhůta a zákaz o tom mluvit | Lhůta a zákaz zprávu ukázat mají zabránit tomu, abyste se s někým poradili. Klidně to řekněte někomu blízkému. Není se za co stydět. |

Nevinná část: `body.1` („Možná se v počítačích moc nevyznáš…“). Nápověda k ní nevede.

Shrnutí:
```
Pisatel nic nemá, chce vás jen vyděsit. Neplaťte a neodpovídejte, zprávu stačí smazat. Nemusíte se stydět říct o ní někomu blízkému. Národní úřad pro kybernetickou bezpečnost před takovými vlnami e-mailů varuje.
```

Poslední věta shrnutí se opírá o zdroj: „Upozorňujeme na další vlnu podvodných vyděračských e-mailů, která míří na české uživatele.“ (doslova)

Zdroje: nukib.gov.cz/cs/infoservis/hrozby/1670-upozorneni-na-novou-vlnu-podvodnych-vyderacskych-emailu/ (4. leden 2021)
- „Předměty emailů typicky obsahují adresu příjemce a jsou nazvané "oznámení", "poslední varování", "poslední upozornění", či podobné.“ (doslova)
- „Podvodné zprávy se vyznačují relativně kvalitní češtinou“ a „časem výpalného - typicky 24 nebo 48 hodin“ (doslova, dva úseky jedné věty)
- „Ve všech evidovaných případech se jedná o podvod, útočník nezískal přístup k vašemu účtu, ani nemá nic natočené, jedná se pouze o snahu vyděsit příjemce a přinutit ho k platbě.“ (doslova)
- „Zprávu doporučujeme ignorovat a smazat. V žádném případě na uvedenou bitcoin adresu peníze neposílejte.“ (doslova)
- „Upozorňujeme na další vlnu podvodných vyděračských e-mailů, která míří na české uživatele.“ (doslova, pro poslední větu shrnutí)

Kontrola nápovědy:
- bod 1 → `fromName` (vaše jméno), `fromAddress` ✓
- bod 2 → zpráva oslovení nemá, není co označit
- bod 3 (spěch a strach) → `body.3`, `body.0`, předmět „Poslední varování“ ✓
- bod 4 (odkaz nebo tlačítko) → zpráva žádné nemá. Žádost o peníze (`body.2`) je hrozba i bez toho.
- body 5 a 6 nevedou k ničemu

Poznámky:
- Doména `post-schranka.top`: registr `.top` (RDAP) 404, DNS neexistuje (24. 9. 2026). Kontrola: `nic.top` vrací 200.
- **Proč vlastní jméno a cizí adresa:** podle NÚKIB byly skutečné zprávy „odeslány z podvržené adresy, že na první pohled vypadá, že adresát je shodný s odesílatelem“ (doslova). Podvrženou adresu jsme u E4 odmítli (ochrana proti podvržení adresy by ji poslala do spamu), proto návrh podvrhuje jen **jméno**. To jde vždy a odpovídá bodu 1 nápovědy. Skutečná vlna se tím trochu zjednodušuje.
- Jméno „Jana Nováková“ je pevná postava hry (`RECIPIENT` v `src/texts.js`, v detailu e-mailu „Komu: Jana Nováková“). Scénář stojí na tom, že je to její vlastní jméno, při změně postavy se musí změnit i tady.
- Bitcoinová adresa ve zprávě záměrně není (aby omylem nepatřila skutečné peněžence). Návod, jak bitcoiny koupit, taky ne: senior by to mohl opravdu udělat (Tomášovo rozhodnutí).
- Vyděrač tyká. Nápověda o tykání nic neříká, proto na tom žádná hrozba nestojí.
- Téma je pro seniory citlivé. Erotický obsah z ukázky NÚKIB jsem nahradil obecným „natáčel přes kameru“. Posuďte, jestli je i to v pořádku.

---

## email-07: Zásilkovna: zásilka je připravená k vyzvednutí (legitimní, s odkazem)

Námět L9 (úkol pro milník 6): legitimní e-mail s odkazem na pravou adresu firmy. Lekce: odkaz sám o sobě podvod není, rozhoduje, od koho zpráva je a co chce.

```
Od: Zásilkovna
Adresa (po „▾ zobrazit adresu“): noreply@zasilkovna.cz
Datum: dnes 13:48
Předmět: Zásilka je připravena k vyzvednutí

[body.0] Dobrý den, paní Nováková,
[body.1] Vaše zásilka z e-shopu Kniha pro radost je připravena k vyzvednutí na výdejním místě Trafika U Nádraží, Lipová 3.
[body.2] Zásilka je zaplacená, při vyzvednutí nic neplatíte.
[body.3] Kde výdejní místo najdete a kdy má otevřeno, uvidíte na odkazu níže.
[body.4] Děkujeme, tým Zásilkovny
[link] Sledovat zásilku na www.zasilkovna.cz
```

Hrozby: žádné.

Shrnutí:
```
Zpráva přišla z adresy noreply@zasilkovna.cz. Zásilkovna na svém webu uvádí, že upozornění na zásilky posílá právě z ní. Zpráva po vás nic nechce: žádnou platbu, žádné údaje. Odkaz sám o sobě podvod není. Jistější je ale otevřít si aplikaci nebo stránky Zásilkovny sami, ne přes odkaz ve zprávě.
```

Zdroje:
- zasilkovna.cz/blog/upozornujeme-na-novy-podvodny-e-mail (25. 6. 2024)
  - „notifikace o vašich zásilkách vám vždy posíláme z adresy noreply@zasilkovna.cz“ (doslova)
  - „naše doména je VŽDY https://www.zasilkovna.cz/“ (doslova)
- zasilkovna.cz/bezpecnost-ochrana-dat/emaily
  - „Pamatujte, že e-maily od nás chodí vždy z mailové adresy s koncovkou @zasilkovna.cz, @packeta.com nebo derivátu příslušné zahraniční pobočky jako například @packeta.de .“ (doslova)

Kontrola nápovědy:
- bod 1 → adresa je ta, kterou Zásilkovna uvádí, k označení nevede
- bod 2 → oslovení jménem, nevede
- bod 3 → žádná lhůta ani hrozba (lhůtu pro vyzvednutí jsem záměrně vynechal, viz poznámky)
- bod 4 → s novým zněním (konec dokumentu) nevede: odkaz jen ukazuje, kde zásilka je, nevede k platbě, přihlášení ani zadání údajů. Se současným zněním („Odkazy, tlačítka a žádost o údaje.“) by k němu vedl, proto je úprava nutná.
- bod 5, 6 → nevede

Poznámky:
- **Ochrana adresy proti podvržení:** doména zasilkovna.cz má DMARC `p=reject; pct=100` (ověřeno 24. 9. 2026). Podvržená zpráva „od noreply@zasilkovna.cz“ by se tedy do schránky nejspíš vůbec nedostala. Je to stejná úvaha jako u E4 s fs.gov.cz, tady ale ve prospěch pravé zprávy. Do textu pro hráče to nepatří.
- **Čeho se bojím:** ve hře je vidět jen text odkazu („Sledovat zásilku na www.zasilkovna.cz“). Ve skutečném e-mailu může text odkazu ukazovat jinou adresu, než kam odkaz vede. Proto shrnutí **netvrdí**, že odkaz je bezpečný, protože v něm je správná adresa. Opírá se o odesílatele a o to, že zpráva nic nechce, a doporučuje otevřít stránky sami.
- Nevím, jestli Zásilkovna v upozorněních oslovuje jménem. Oslovení jménem je tu kvůli nápovědě (bod 2). Kdyby byl zdroj, že ne, musel by se změnit bod 2 nápovědy.
- Pravé upozornění Zásilkovny nejspíš obsahuje lhůtu k vyzvednutí. Vynechal jsem ji, protože bod 3 nápovědy („Spěch a strach“) by k ní mohl vést. Byla by to ale dobrá lekce, že lhůta sama o sobě podvod není.
- E-shop „Kniha pro radost“: v ARES 0 výsledků, doména `knihaproradost.cz` volná (RDAP 404, 24. 9. 2026). Ve zprávě se doména nezobrazuje.
- Lipová: stejná (skutečně existující) obec jako v `email-03` a návrhu `zpravy-08`, viz otázka tam.

---

## email-08: Vnučka posílá fotku z výletu (legitimní, s přílohou)

Námět L5 převedený do e-mailu. Lekce: příloha sama o sobě podvod není, rozhoduje, jestli ji čekáte a od koho je. Protiváha k `email-04`.

```
Od: Anička
Adresa (po „▾ zobrazit adresu“): anicka.novakova@seznam.cz
Datum: včera 20:15
Předmět: Fotka z výletu

[body.0] Ahoj babi,
[body.1] jak jsem ti v neděli slíbila, posílám fotku z našeho výletu na hrad. Nejvíc se mi líbí, jak Honza mává z věže.
[body.2] V sobotu se u vás zastavíme, upeču štrůdl.
[body.3] Pa, Anička
[attachment] vylet_hrad.jpg
```

Verze schválená 24. 9. 2026. Původní „Fotka z oslavy“ se kryla s ozdobnou starší zprávou ve schránce („Jana Dvořáková: Fotky z oslavy“, `EMAIL_APP.olderMessages` v `src/texts.js`).

Hrozby: žádné.

Shrnutí:
```
Příloha sama o sobě podvod není. Tuhle fotku jste čekali: vnučka vám ji slíbila a zpráva na ten slib přesně navazuje. Nic po vás nechce, žádné peníze ani údaje. Kdyby vám přišla příloha, o které nic nevíte, neotevírejte ji, i když je od někoho známého. Nejdřív se zeptejte, třeba telefonem.
```

Zdroje: žádné tvrzení za firmu ani úřad (`sources: []`).

Kontrola nápovědy:
- bod 1 → adresa odpovídá jménu, k označení nevede
- bod 2 → „Ahoj babi“ je rodinné oslovení, nevede
- bod 5 → se současným zněním („…od neznámého odesílatele“) by lekce stála na tom, že je příloha od známé osoby, a to nechcete. S novým zněním (konec dokumentu) rozhoduje, jestli přílohu čekáte. Tady ji hráčka čeká, protože byla slíbená a text na slib navazuje, takže **nápověda k označení nevede**.

Poznámky:
- **Adresa `anicka.novakova@seznam.cz` je smyšlená, ale na skutečné službě.** Jestli taková schránka existuje, ověřit nejde. Stejné riziko má `email-02` (gmail.com). Alternativa by byla smyšlená doména, jenže soukromé adresy na smyšlených doménách nejsou věrohodné.
- Hráčka je tu „babi“. Pokud hraje muž, je to drobná nesrovnalost. Stejně tak „paní Nováková“ v jiných scénářích.
- Anička, Honza: smyšlená jména.

---

## Úprava nápovědy e-mailu (body 4 a 5, k vašemu schválení)

Změní se jen body 4 a 5 v `HINTS.email` v `src/texts.js`, ostatní body, poznámka a rada zůstávají. Obě znění Tomáš schválil 24. 9. 2026, do kódu se zatím nezabudovala. Testy hlídají jen počet bodů (6) a nadpis bodu 2, úprava je nerozbije.

**Bod 4, dnes:**
```
Odkazy, tlačítka a žádost o údaje.
Banka, pošta ani úřad vás e-mailem nepošlou zadávat údaje z karty, PIN, heslo ani kód z SMS.
```

**Bod 4, schválené znění (24. 9. 2026):**
```
Odkaz nebo tlačítko k penězům, přihlášení či údajům.
Odkaz sám o sobě podvod není. Zpozorněte, když vás vede k placení nebo „vyzvednutí“ peněz, k přihlášení nebo k zadání údajů. Údaje z karty, PIN, heslo ani kód z SMS nikdy nezadávejte na stránce, kam vás poslal e-mail.
```
Poslední věta je rada bez tvrzení za firmy a úřady (Tomášova změna). „Vyzvednutí peněz“ je v textu kvůli `email-01` a `email-02`: jejich odkazy nevedou k platbě, ale k „výběru“ a „vyzvednutí“ peněz. Bez toho by nápověda k jejich hlavní hrozbě nevedla.

**Bod 5, dnes:**
```
Přílohy, které nečekáte.
Faktura, výměr nebo „smlouva“ od neznámého odesílatele může v počítači spustit škodlivý program.
```
Nadpis o nečekaných přílohách mluví, text ale stojí na „neznámém odesílateli“. Podle něj by `email-08` učil „od známých je příloha v pořádku“ a `email-04` „od neznámé firmy je podezřelá“. Obojí jste odmítl.

**Bod 5, schválené znění (24. 9. 2026):**
```
Přílohy, které nečekáte.
Faktura, výměr nebo „smlouva“, o kterých nic nevíte, může obsahovat škodlivý program. Platí to i u známého odesílatele. Když si nejste jistí, přílohu neotevírejte a nejdřív se zeptejte, třeba telefonem.
```

### Kontrola všech e-mailů proti schválenému znění (24. 9. 2026)

„Vede“ znamená, že hráč, který poslechne bod 4 nebo 5, by tu část označil. U podvodu musí každá taková část ležet na hrozbě, u legitimní zprávy nesmí nápověda vést k ničemu.

| E-mail | Bod 4 (odkaz, tlačítko, údaje) | Bod 5 (příloha) | Výsledek |
|---|---|---|---|
| email-01 (Balíkovna, podvod) | odkaz „Vybrat prostředky“ a `body.2` („vyberte kliknutím na odkaz“) vedou k „vyzvednutí“ peněz → vede. Obojí je na hrozbě (`link` + `alsoTargets: body.2`). | bez přílohy | ✓ beze změny scénáře |
| email-02 (Finanční správa, podvod) | odkaz „Přihlásit se a vyzvednout přeplatek“ → vede (`link`). `body.3` „přihlaste se přes odkaz… potvrďte své údaje“ → vede (hrozba). `body.1` „chybí potvrzení bankovního spojení“ → na hrozbě (`alsoTargets`). | bez přílohy | ✓ beze změny |
| email-03 (ČEZ, legitimní) | žádný odkaz ani tlačítko. `body.3` zmiňuje přihlášení do MŮJ ČEZ, ale bez odkazu. Nová poslední věta mluví o „stránce, kam vás poslal e-mail“, a na žádnou stránku tahle zpráva neposílá. | bez přílohy | ✓ (malé riziko jako dosud: velmi opatrný hráč může označit větu o přihlášení) |
| email-04 (faktura, podvod) | žádný odkaz ani tlačítko | příloha, o které nic nevíte → vede (`attachment` + `alsoTargets: body.2`, hrozba) | ✓ |
| email-05 (falešný ČEZ, podvod) | tlačítko „Potvrdit údaje karty“ → vede (`button`). `body.2` chce číslo karty a kód → vede (hrozba). | bez přílohy | ✓ |
| email-06 (vydírání, podvod) | žádný odkaz ani tlačítko. Žádost o peníze (`body.2`) je hrozba i bez toho. | bez přílohy | ✓ |
| email-07 (Zásilkovna, legitimní) | odkaz „Sledovat zásilku“ ukazuje výdejní místo, nevede k penězům, přihlášení ani údajům → **nevede** | bez přílohy | ✓ |
| email-08 (vnučka, legitimní) | žádný odkaz ani tlačítko | fotka byla slíbená a zpráva na slib navazuje → **nevede** | ✓ |

Změna z „může v počítači spustit“ na „může obsahovat“ výsledek kontroly nemění. Body 1, 2, 3 a 6 se nemění, jejich kontrola je u jednotlivých scénářů výše.

## Rozhodnutí z 24. 9. 2026 (Tomáš)

- email-04: zůstává, hlavní stopa je „nic jste neobjednali a číslo účtu je jen v příloze“. Firma sama podezřelá není. **Zapracováno.**
- email-05: druhý ČEZ ano.
- email-06: ano, vysvětlení a shrnutí klidně a jednoduše. **Zapracováno**, celé znění je výše.
- email-07: bez lhůty, jak je.
- email-08: příloha zůstává, vysvětlení stojí na tom, že fotka byla slíbená. **Zapracováno** (i v `body.1`: „jak jsem ti v neděli slíbila“).
- Bod 4 nápovědy schválený s radou „Údaje z karty, PIN, heslo ani kód z SMS nikdy nezadávejte na stránce, kam vás poslal e-mail.“ místo věty o bance, poště a úřadu. **Zapracováno.**
- Bod 5 schválený se změnou na „může obsahovat škodlivý program“. **Zapracováno.**
- email-06: jméno Jana Nováková (pevná postava hry), bez návodu „koupit bitcoiny“, poslední věta shrnutí o varování NÚKIB. **Zapracováno.**

- email-08: nová verze „Fotka z výletu“ schválená. **Zapracováno.**
- email-06, `body.2`: kategorie `neobvykla-zadost` místo `odkaz-platba` (zpráva nemá odkaz ani tlačítko, v panelu „Nejčastěji vám unikalo“ by stálo „odkaz nebo tlačítko k platbě“). **Zapracováno.**
- Všech pět scénářů a body 4 a 5 nápovědy jsou zabudované ve hře (`src/content/email/email-04.json` až `email-08.json`, `src/texts.js`).

## Vyřešená otázka

1. **email-08 se krylo s ozdobnou zprávou ve schránce (vyřešeno novou verzí výše).** Pod úkolovou zprávou je vždy starší neaktivní zpráva „Jana Dvořáková: Fotky z oslavy, Ahoj, posílám slíbené fotky z babiččiných narozenin…“ (`EMAIL_APP.olderMessages` v `src/texts.js`). Nad ní by stál email-08 „Anička: Fotka z oslavy… slíbila, posílám fotku z dědovy oslavy“. Dvě skoro stejné zprávy pod sebou působí jako chyba a hráčka by mohla zaváhat, která je úkol. Navrhuju změnit příležitost v email-08 (ozdobné zprávy jsou schválené texty, na ty bych nesahal):
   ```
   Předmět: Fotka z výletu
   [body.1] jak jsem ti v neděli slíbila, posílám fotku z našeho výletu na hrad. Nejvíc se mi líbí, jak Honza mává z věže.
   [body.2] V sobotu se u vás zastavíme, upeču štrůdl.
   [attachment] vylet_hrad.jpg
   ```
   Lekce (slíbená, čekaná příloha) zůstává stejná. `body.2` se mění, protože Honza už je na fotce.

---

# Legitimní e-maily pro nový cíl milníku 6 (návrh 25. 9. 2026, k Tomášově kontrole)

Cíl: 3 nové legitimní e-maily, pak 11 e-mailů (5 podvodů, 6 legitimních). Každý vyvrací jedno falešné pravidlo, které si hráč může odnést z podvodů. Pravidla, která už vyvracejí dnešní legitimní e-maily, se neopakují:
- `email-03` (ČEZ): zpráva o penězích od známé firmy, která nic nechce,
- `email-07` (Zásilkovna): odkaz sám o sobě,
- `email-08` (vnučka): příloha sama o sobě.

| Návrh | Falešné pravidlo, které vyvrací | Námět |
|---|---|---|
| email-09 | „Když úřad píše o placení, je to podvod.“ | nový (obec), navazuje na zpravy-08 |
| email-10 | „Když e-mail chce odpověď, je to podvod.“ | nový (klub seniorů) |
| email-11 | „Když zpráva připomíná lhůtu, je to podvod.“ | nový (knihovna), **potřebuje úpravu bodu 3 nápovědy** |

**Zpráva od banky** je odložená (Tomášovo rozhodnutí 25. 9. 2026, námět L10 v `docs/napady-scenaru.md`). Na stránkách Air Bank, Monety ani ČSOB jsem doslova nenašel, z jaké adresy banka e-maily posílá. Potřebný zdroj je stránka banky, kde doslova píše, jaké e-maily nebo SMS klientům posílá a jaké nikdy.

Všechna tři shrnutí jsou obecná rada, nic netvrdí za firmu ani úřad (`sources: []`). Domény: `javornalhota.cz` je v registru `.cz` volná (RDAP 404, kontrolní `nic.cz` 200, 25. 9. 2026). Obec je smyšlená a schválená („Javorná Lhota“, zpravy-08). Adresa u `email-10` je na smyšlené doméně `lhotanet.cz` (RDAP 404, 25. 9. 2026). Skutečné freemailové adresy s běžným jménem se nepoužívají, mohou někomu patřit (Tomášovo rozhodnutí).

**Schváleno 25. 9. 2026 (Tomáš) s úpravami:** email-10 `body.3` („Odpověz mi prosím na tento e-mail…“), nová adresa a poslední věta shrnutí. Bod 3 nápovědy ve znění z návrhu u email-11 schválen.

## email-09: Obec připomíná poplatek za odpad (legitimní)

Vyvrací: „Když úřad píše o placení, je to podvod.“ Rozhoduje, že zpráva nikam neposílá a nechce údaje, zaplatit jde obvyklou cestou.

```
Od: Obec Javorná Lhota
Adresa (po „▾ zobrazit adresu“): podatelna@javornalhota.cz
Datum: dnes 9:12
Předmět: Poplatek za odpad na příští rok

[body.0] Dobrý den, paní Nováková,
[body.1] připomínáme, že poplatek za odpad na příští rok je 850 Kč na osobu.
[body.2] Zaplatit ho můžete v hotovosti na obecním úřadě v úředních hodinách, nebo převodem na účet obce, který najdete na úřední desce a na webu obce.
[body.3] S pozdravem, Obecní úřad Javorná Lhota
```

Hrozby: žádné.

Shrnutí:
```
Zpráva mluví o placení, a přesto je v pořádku: nikam vás neposílá a nechce žádné údaje. Zaplatit můžete na úřadě, nebo na účet, který si sami najdete na webu obce. Kdyby vás e-mail posílal platit přes odkaz, raději zavolejte na obecní úřad.
```

Kontrola nápovědy:
- bod 1: adresa odpovídá jménu obce, nevede,
- bod 2: oslovení jménem, nevede,
- bod 3: žádná lhůta ani výhrůžka,
- bod 4: žádný odkaz ani tlačítko,
- body 5 a 6: nevedou.

## email-10: Pozvánka na výlet klubu seniorů, odpovězte (legitimní)

Vyvrací: „Když e-mail chce odpověď, je to podvod.“ Odpověď sama o sobě nic neprozradí, rozhoduje, na co se ptá.

```
Od: Marie Kopecká
Adresa (po „▾ zobrazit adresu“): marie.kopecka@lhotanet.cz
Datum: včera 16:40
Předmět: Výlet klubu na zámek

[body.0] Milá Jano,
[body.1] jak jsme se v klubu domluvily, pojedeme za dva týdny ve čtvrtek na výlet na zámek.
[body.2] Autobus odjíždí v 8 hodin od obecního úřadu, jízdné vybírám až v autobuse.
[body.3] Odpověz mi prosím na tento e-mail, jestli pojedeš, ať vím, kolik objednat míst.
[body.4] Měj se hezky, Marie
```

Hrozby: žádné.

Shrnutí:
```
Zpráva chce jen odpověď, jestli pojedete, a to je v pořádku. Nechce peníze předem, údaje ani kliknutí na odkaz. Marie píše o tom, na čem jste se v klubu domluvily, zprávu jste tedy čekali. Kdyby vás někdo e-mailem nečekaně žádal o údaje nebo o peníze předem, raději se ho zeptejte osobně.
```

Kontrola nápovědy:
- bod 1: adresa odpovídá jménu, nevede,
- bod 2: oslovení jménem, nevede,
- bod 3: žádný spěch,
- bod 4: žádný odkaz,
- bod 6: nic výhodného.

Jízdné „až v autobuse“ je záměr: peníze se zmíní, ale platí se osobně, ne předem přes zprávu.

Poznámka: ozdobná starší zpráva ve schránce „Spolek zahrádkářů: Zápis ze schůze“ je jiná věc. Nekryje se.

## email-11: Knihovna připomíná konec výpůjčky (legitimní)

Vyvrací: „Když zpráva připomíná lhůtu, je to podvod.“ Lhůta sama o sobě podvod není, podezřelá je, když ji doprovází výhrůžka, platba nebo žádost o údaje.

```
Od: Obecní knihovna Javorná Lhota
Adresa (po „▾ zobrazit adresu“): knihovna@javornalhota.cz
Datum: dnes 8:05
Předmět: Zítra končí výpůjční lhůta

[body.0] Dobrý den, paní Nováková,
[body.1] zítra Vám končí výpůjční lhůta u knihy Babiččiny recepty na každý den.
[body.2] Knihu můžete vrátit v knihovně, nebo si výpůjčku prodloužit u nás na pultu či telefonicky v otevíracích hodinách.
[body.3] Hezký den přeje Vaše knihovna
```

Hrozby: žádné.

Shrnutí:
```
Zpráva připomíná lhůtu, a přesto je v pořádku. Lhůta sama o sobě podvod není: knihovna jen připomíná, kdy knihu vrátit, nic nechce a nabízí obvyklé cesty, jak knihu vrátit nebo výpůjčku prodloužit. Kdyby vás zpráva kvůli lhůtě tlačila k platbě přes odkaz nebo ke sdělení údajů, raději zavolejte do knihovny.
```

**Rozpor s nápovědou, potřebuje rozhodnutí:** bod 3 nápovědy e-mailu („Spěch a strach.“) dnes vede k označení `body.1` („zítra končí lhůta“). U legitimní zprávy by za to hráč přišel o 2 body (sekce 7). Návrh nového textu bodu 3, nadpis zůstává:

```
„Do 24 hodin“, „jinak zablokujeme účet“, „hrozí exekuce“. Tlak má zabránit tomu, abyste si věc v klidu ověřili. Obyčejná lhůta sama o sobě podvod není. Zpozorněte, když se spěch pojí s výhrůžkou, platbou nebo žádostí o údaje.
```

Kontrola podvodů s novým zněním: spěch v `email-02` (`body.2`, lhůta a propadnutí peněz), `email-04` (`body.3`, vymáhání), `email-05` (`body.3`, zánik nároku) a `email-06` (`body.3`, výhrůžka) se pojí s výhrůžkou nebo penězi. Nápověda k nim dál vede a všechny leží na hrozbách.

**Kontrola proti předběžně schválenému znění bodu 3 (25. 9. 2026)**, tedy kde by se lhůta pojila s platbou, výhrůžkou nebo žádostí o údaje:

| Návrh | Lhůta | Platba | Výhrůžka | Žádost o údaje | Výsledek |
|---|---|---|---|---|---|
| email-09 (obec) | ne („poplatek na příští rok“ je období, ne termín) | ano (`body.1`, `body.2`) | ne | ne | platba bez lhůty, **bez kolize** |
| email-11 (knihovna) | ano (předmět, `body.1`: „zítra končí“) | ne | ne | ne | lhůta bez platby, výhrůžky i údajů, **bez kolize** |
| email-10 (klub), navíc | ne („za dva týdny ve čtvrtek“ je datum výletu, ne lhůta pro hráče) | jen „jízdné vybírám až v autobuse“, osobně | ne | ne | **bez kolize** |

Nápověda tedy s novým zněním bodu 3 k žádné části těchto legitimních zpráv nevede. Úprava scénářů není potřeba.

Poznámky:
- Věta o poplatku za pozdní vrácení je záměrně vynechaná: spěch s platbou by k označení vedl i podle nového znění.
- Název knihy „Babiččiny recepty na každý den“ je smyšlený. Nebyla ověřená, jestli taková kniha existuje. Kdyby ano, nevadí to, kniha se jen zmiňuje.
