# Přehled scénářů

Vygenerováno příkazem `npm run prehled` ze souborů v `src/content/`. Neupravovat ručně: změna scénáře = úprava JSON souboru a nové vygenerování.

## Souhrn

| Sekce | Scénářů | Podvodů | Legitimních |
|---|---|---|---|
| E-mail | 11 | 5 | 6 |
| Zprávy | 11 | 5 | 6 |

**Falešná pravidla, která legitimní zprávy vyvracejí:**

- `email-03`: „Když e-mail od firmy píše o penězích, je to podvod.“
- `email-07`: „Když je v e-mailu odkaz, je to podvod.“
- `email-08`: „Když je v e-mailu příloha, je to podvod.“
- `email-09`: „Když úřad píše o placení, je to podvod.“
- `email-10`: „Když e-mail chce odpověď, je to podvod.“
- `email-11`: „Když zpráva připomíná lhůtu, je to podvod.“
- `zpravy-03`: „Když je v SMS odkaz, je to podvod.“
- `zpravy-07`: „Když zpráva přijde z uloženého čísla, je pravá.“
- `zpravy-08`: „Když odesílatel není v kontaktech, je to podvod.“
- `zpravy-09`: „Když SMS píše o balíku, je to podvod.“
- `zpravy-10`: „Když mě známý přes zprávu o něco prosí, je to podvod.“
- `zpravy-11`: „Když zpráva nemá háčky a čárky nebo má chyby, je to podvod.“

## E-mail

### email-01: Balíkovna vrací peníze za dopravu

- **Sekce:** E-mail
- **Druh:** podvod
- **Odesílatel:** Balíkovna <refundace@balikovna-cz.top>

**Zpráva po částech:**

1. **Jméno odesílatele** `fromName`: Balíkovna
   - součást hrozby „Adresa odesílatele“ (hlavní část `fromAddress`)
2. **Adresa odesílatele** `fromAddress`: refundace@balikovna-cz.top
   - **Hrozba** · `odesilatel` (adresa nebo jméno odesílatele) · „Adresa odesílatele“: Jméno Balíkovna si může napsat kdokoli. Adresa za ním končí na balikovna-cz.top – to není adresa České pošty, jen ji napodobuje. Platí i pro: `fromName`.
- _Datum: dnes 9:12_
3. **Předmět** `subject`: Vrácení peněz za dopravu
   - součást hrozby „Peníze, o které jste nežádali“ (hlavní část `body.1`)
4. **Odstavec 1** `body.0`: Vážený zákazníku,
   - **Hrozba** · `obecne-osloveni` (obecné oslovení bez jména) · „Obecné oslovení“: Firma, u které něco máte, vás obvykle osloví jménem. Obecné „Vážený zákazníku“ je varovný signál.
5. **Odstavec 2** `body.1`: vracíme Vám peníze za dopravu ve výši 5,000.00 Kč.
   - **Hrozba** · `vyhra-nabidka` (výhra nebo nečekaná nabídka) · „Peníze, o které jste nežádali“: Proč by vám někdo vracel 5 000 Kč za dopravu? Nečekané peníze jsou návnada. Všimněte si i zápisu 5,000.00 Kč, česky se píše 5 000 Kč. Platí i pro: `subject`.
6. **Odstavec 3** `body.2`: Prostředky si vyberte kliknutím na odkaz níže.
   - součást hrozby „Odkaz k výběru peněz“ (hlavní část `link`)
7. **Odstavec 4** `body.3`: Děkujeme, že využíváte Balíkovnu.
   - nevinná část
8. **Odkaz** `link`: Vybrat prostředky
   - **Hrozba** · `odkaz-platba` (odkaz nebo tlačítko k platbě) · „Odkaz k výběru peněz“: Odkaz vede na stránku podvodníků, kde po vás budou chtít vaše údaje. Platí i pro: `body.2`.

**Shrnutí:** Když vám někdo nečekaně nabízí peníze, zpozorněte. Stav zásilek a plateb si ověřte sami v aplikaci nebo na webu pošty, nikdy přes odkaz ve zprávě.

**Zdroje:**

- [ceskaposta.cz/o-spolecnosti/bezpecnostni-informace/aktualni-informace](https://ceskaposta.cz/o-spolecnosti/bezpecnostni-informace/aktualni-informace) (varování 27. 8. 2026)
- [nukib.gov.cz/cs/infoservis/doporuceni/1494-phishing-stale-aktualni-hrozba/](https://nukib.gov.cz/cs/infoservis/doporuceni/1494-phishing-stale-aktualni-hrozba/) (obecné oslovení)

---

### email-02: Finanční správa: nevyzvednutý přeplatek

- **Sekce:** E-mail
- **Druh:** podvod
- **Odesílatel:** Finanční správa <financni.sprava.cz47@gmail.com>

**Zpráva po částech:**

1. **Jméno odesílatele** `fromName`: Finanční správa
   - součást hrozby „Falešné jméno odesílatele“ (hlavní část `fromAddress`)
2. **Adresa odesílatele** `fromAddress`: financni.sprava.cz47@gmail.com
   - **Hrozba** · `odesilatel` (adresa nebo jméno odesílatele) · „Falešné jméno odesílatele“: Jméno bylo falešné. Důkaz najdete v adrese: skutečná adresa byla financni.sprava.cz47@gmail.com. Platí i pro: `fromName`, `body.4`.
- _Datum: dnes 7:40_
3. **Předmět** `subject`: Poslední upozornění: nevyzvednutý přeplatek na dani
   - součást hrozby „Spěch“ (hlavní část `body.2`)
4. **Odstavec 1** `body.0`: Dobrý den, paní Nováková,
   - nevinná část
5. **Odstavec 2** `body.1`: podle našich záznamů Vám vznikl přeplatek na dani z příjmů ve výši 3 870 Kč. Zatím nebyl vyplacen, protože nám chybí potvrzení Vašeho bankovního spojení.
   - součást hrozby „Žádost o údaje“ (hlavní část `body.3`)
6. **Odstavec 3** `body.2`: Přeplatek je nutné vyzvednout do 3 dnů. Po uplynutí lhůty propadne ve prospěch státu.
   - **Hrozba** · `casovy-tlak` (spěch ve zprávě) · „Spěch“: Krátká lhůta a hrozba, že o peníze přijdete, mají zabránit tomu, abyste si to v klidu ověřili. Platí i pro: `subject`.
7. **Odstavec 4** `body.3`: Pro vyplacení se přihlaste přes odkaz níže a potvrďte své údaje.
   - **Hrozba** · `zadost-o-udaje` (žádost o údaje nebo kódy) · „Žádost o údaje“: Finanční správa ve svém varování uvádí, že e-mailem nežádá přihlašovací ani bankovní údaje. Platí i pro: `body.1`.
8. **Odstavec 5** `body.4`: S pozdravem, Finanční správa České republiky
   - součást hrozby „Falešné jméno odesílatele“ (hlavní část `fromAddress`)
9. **Odkaz** `link`: Přihlásit se a vyzvednout přeplatek
   - **Hrozba** · `odkaz-platba` (odkaz nebo tlačítko k platbě) · „Odkaz k přihlášení“: Finanční správa podle svého varování neposílá e-mailem odkazy pro platby ani pro přihlášení. Přes falešnou stránku by se vaše údaje dostaly k podvodníkům.

**Shrnutí:** Jméno odesílatele si může napsat kdokoli – skutečná adresa byla financni.sprava.cz47@gmail.com. Ani oslovení jménem nic nezaručuje, jméno mohou znát i podvodníci. Když si nejste jistí, napište do prohlížeče sami financnisprava.gov.cz, nikdy nechoďte přes odkaz ve zprávě.

**Zdroje:**

- [financnisprava.gov.cz/cs/financni-sprava/media-a-verejnost/tiskove-zpravy-gfr/tiskove-zpravy-2025/dalsi-intenzivni-vlna-podvodnych-emailu-a-sms](https://financnisprava.gov.cz/cs/financni-sprava/media-a-verejnost/tiskove-zpravy-gfr/tiskove-zpravy-2025/dalsi-intenzivni-vlna-podvodnych-emailu-a-sms) (30. 10. 2025)
- [financnisprava.gov.cz/cs/financni-sprava/novinky/novinky-2025/financni-sprava-varuje-pred-dalsi-vlnou-podvodnych-mailu](https://financnisprava.gov.cz/cs/financni-sprava/novinky/novinky-2025/financni-sprava-varuje-pred-dalsi-vlnou-podvodnych-mailu) (17. 12. 2025)

---

### email-03: ČEZ: vyúčtování elektřiny s přeplatkem

- **Sekce:** E-mail
- **Druh:** legitimní
- **Vyvrací:** „Když e-mail od firmy píše o penězích, je to podvod.“
- **Odesílatel:** ČEZ Prodej <vyuctovani@cez.cz>

**Zpráva po částech:**

1. **Jméno odesílatele** `fromName`: ČEZ Prodej
2. **Adresa odesílatele** `fromAddress`: vyuctovani@cez.cz
- _Datum: včera 14:05_
3. **Předmět** `subject`: Vyúčtování elektřiny za uplynulý rok
4. **Odstavec 1** `body.0`: Dobrý den, paní Nováková,
5. **Odstavec 2** `body.1`: připravili jsme pro Vás vyúčtování elektřiny za uplynulý rok pro odběrné místo Lipová 12.
6. **Odstavec 3** `body.2`: Výsledkem je přeplatek 1 240 Kč. Pošleme ho na bankovní účet, který u nás máte uvedený. Nemusíte nic dělat.
7. **Odstavec 4** `body.3`: Podrobné vyúčtování a stav plateb najdete po přihlášení ve svém účtu MŮJ ČEZ.
8. **Odstavec 5** `body.4`: S pozdravem, ČEZ Prodej

**Shrnutí:** Rozhodující je, že zpráva nic nechce: žádné údaje, platbu ani kliknutí na odkaz. Jen oznamuje výsledek vyúčtování a přeplatek pošle na účet, který u ČEZ už máte. Vyúčtování si můžete prohlédnout, když se do MŮJ ČEZ přihlásíte sami.

**Zdroje:**

- [cez.cz/cs/podvodne-maily](https://cez.cz/cs/podvodne-maily)

---

### email-04: Upomínka neuhrazené faktury s přílohou

- **Sekce:** E-mail
- **Druh:** podvod
- **Odesílatel:** Kalvora velkoobchod <fakturace@kalvora-velkoobchod.cz>

**Zpráva po částech:**

1. **Jméno odesílatele** `fromName`: Kalvora velkoobchod
   - nevinná část
2. **Adresa odesílatele** `fromAddress`: fakturace@kalvora-velkoobchod.cz
   - nevinná část
- _Datum: dnes 10:03_
3. **Předmět** `subject`: Upomínka: neuhrazená faktura č. 2026-0917
   - součást hrozby „Faktura, o které nic nevíte“ (hlavní část `body.1`)
4. **Odstavec 1** `body.0`: Dobrý den,
   - součást hrozby „Faktura, o které nic nevíte“ (hlavní část `body.1`)
5. **Odstavec 2** `body.1`: při kontrole účetnictví jsme zjistili, že dosud nebyla uhrazena faktura č. 2026-0917 na částku 4 368 Kč.
   - **Hrozba** · `neobvykla-zadost` (neobvyklá žádost) · „Faktura, o které nic nevíte“: Upomínka nepíše, za co faktura je, a neosloví vás jménem. Když si nevzpomínáte, že byste u této firmy něco objednali, je to důvod zpozornět. Platí i pro: `subject`, `body.0`.
6. **Odstavec 3** `body.2`: Fakturu i údaje k platbě najdete v příloze.
   - součást hrozby „Číslo účtu jen v příloze“ (hlavní část `attachment`)
7. **Odstavec 4** `body.3`: Prosíme o úhradu do 3 pracovních dnů. Jinak budeme nuceni předat pohledávku k vymáhání.
   - **Hrozba** · `casovy-tlak` (spěch ve zprávě) · „Spěch a hrozba vymáháním“: Krátká lhůta a hrozba vymáháním mají zabránit tomu, abyste si věc v klidu ověřili.
8. **Odstavec 5** `body.4`: Pokud jste fakturu mezitím uhradili, považujte prosím tuto zprávu za bezpředmětnou.
   - nevinná část
9. **Odstavec 6** `body.5`: S pozdravem, účtárna Kalvora velkoobchod s.r.o.
   - nevinná část
10. **Příloha** `attachment`: Faktura_2026-0917.doc
    - **Hrozba** · `priloha` (nečekaná příloha) · „Číslo účtu jen v příloze“: Číslo účtu v textu chybí, abyste museli otevřít přílohu. Podle iROZHLASu byl právě v takových přílohách škodlivý program. Platí i pro: `body.2`.

**Shrnutí:** Faktura od firmy sama o sobě podvod není, posílají je i řemeslníci. Tahle ale nepíše, za co je, a číslo účtu schovává do přílohy. Když si nevzpomínáte, že byste něco objednali, přílohu neotevírejte. Ověřte si to u firmy na čísle, které si sami najdete, ne na čísle ze zprávy.

**Zdroje:**

- [irozhlas.cz/veda-technologie/technologie/malware-podvodny-e-mail-virus_2002180914_sot](https://irozhlas.cz/veda-technologie/technologie/malware-podvodny-e-mail-virus_2002180914_sot) (18. 2. 2020)

---

### email-05: Falešný ČEZ vrací přeplatek, chce údaje z karty

- **Sekce:** E-mail
- **Druh:** podvod
- **Odesílatel:** ČEZ Prodej <preplatky@cez-vyuctovani.cz>

**Zpráva po částech:**

1. **Jméno odesílatele** `fromName`: ČEZ Prodej
   - součást hrozby „Adresa odesílatele“ (hlavní část `fromAddress`)
2. **Adresa odesílatele** `fromAddress`: preplatky@cez-vyuctovani.cz
   - **Hrozba** · `odesilatel` (adresa nebo jméno odesílatele) · „Adresa odesílatele“: Jméno ČEZ Prodej si může napsat kdokoli. ČEZ uvádí, že e-maily k platbám posílá z adres, které mají za zavináčem cez.cz. Tahle adresa končí na cez-vyuctovani.cz. Platí i pro: `fromName`, `body.4`.
- _Datum: dnes 16:22_
3. **Předmět** `subject`: Vrácení přeplatku za elektřinu
   - součást hrozby „Údaje z karty kvůli vrácení peněz“ (hlavní část `body.2`)
4. **Odstavec 1** `body.0`: Dobrý den, paní Nováková,
   - nevinná část
5. **Odstavec 2** `body.1`: při vyúčtování elektřiny za uplynulý rok Vám vznikl přeplatek 2 180 Kč.
   - součást hrozby „Údaje z karty kvůli vrácení peněz“ (hlavní část `body.2`)
6. **Odstavec 3** `body.2`: Abychom Vám ho mohli vrátit, potvrďte prosím údaje své platební karty: číslo karty, datum platnosti a trojmístný kód z její zadní strany.
   - **Hrozba** · `zadost-o-udaje` (žádost o údaje nebo kódy) · „Údaje z karty kvůli vrácení peněz“: Když vám někdo vrací peníze, stačí mu číslo účtu. Česká spořitelna upozorňuje, že kvůli vrácení peněz po vás žádná skutečná instituce nebude chtít všechna čísla z karty. Platí i pro: `body.1`, `subject`.
7. **Odstavec 4** `body.3`: Údaje prosím potvrďte do 5 dnů. Jinak nárok na vrácení přeplatku zanikne.
   - **Hrozba** · `casovy-tlak` (spěch ve zprávě) · „Spěch“: Krátká lhůta a hrozba, že o peníze přijdete, mají zabránit tomu, abyste si to v klidu ověřili.
8. **Odstavec 5** `body.4`: S pozdravem, ČEZ Prodej
   - součást hrozby „Adresa odesílatele“ (hlavní část `fromAddress`)
9. **Tlačítko** `button`: Potvrdit údaje karty
   - **Hrozba** · `odkaz-platba` (odkaz nebo tlačítko k platbě) · „Tlačítko k zadání karty“: Tlačítko vede na stránku, kde byste údaje z karty dali podvodníkům. ČEZ radí údaje z platební karty nezadávat, pokud si nejste jistí, že e-mail přišel opravdu od něj.

**Shrnutí:** Oslovení jménem i částka vypadají věrohodně, ale kvůli vrácení peněz nikdo nepotřebuje číslo karty ani kód z její zadní strany. Stačí číslo účtu. Když si nejste jistí, přihlaste se do MŮJ ČEZ sami, ne přes tlačítko v e-mailu.

**Zdroje:**

- [cez.cz/cs/podvodne-maily](https://cez.cz/cs/podvodne-maily)
- [csas.cz/cs/zpravy-z-banky/2024/11/26/podvodnou-sms-nebo-e-mail-muzete-dostat-i-vy-jak-je-poznat-a-neprijit-o-penize](https://csas.cz/cs/zpravy-z-banky/2024/11/26/podvodnou-sms-nebo-e-mail-muzete-dostat-i-vy-jak-je-poznat-a-neprijit-o-penize) (26. 11. 2024)

---

### email-06: Vyděračský e-mail „mám přístup k tvé kameře“

- **Sekce:** E-mail
- **Druh:** podvod
- **Odesílatel:** Jana Nováková <k7m2q9x@post-schranka.top>

**Zpráva po částech:**

1. **Jméno odesílatele** `fromName`: Jana Nováková
   - součást hrozby „Vaše jméno jako odesílatel“ (hlavní část `fromAddress`)
2. **Adresa odesílatele** `fromAddress`: k7m2q9x@post-schranka.top
   - **Hrozba** · `odesilatel` (adresa nebo jméno odesílatele) · „Vaše jméno jako odesílatel“: Jako odesílatel je tu napsané vaše jméno. To si může napsat kdokoli. Adresa za ním je cizí. Platí i pro: `fromName`.
- _Datum: dnes 3:17_
3. **Předmět** `subject`: Poslední varování
   - součást hrozby „Nic nemá“ (hlavní část `body.0`)
4. **Odstavec 1** `body.0`: Mám přístup k tvému počítači i telefonu. Přes kameru jsem tě natáčel a mám kopii všech tvých kontaktů a zpráv.
   - **Hrozba** · `emocni-natlak` (citový nátlak) · „Nic nemá“: Pisatel nic nemá. Národní úřad pro kybernetickou bezpečnost uvádí, že autoři takových zpráv přístup k počítači nezískali a nic natočené nemají. Chtějí vás jen vyděsit. Platí i pro: `subject`.
5. **Odstavec 2** `body.1`: Možná se v počítačích moc nevyznáš, tak to řeknu jednoduše.
   - nevinná část
6. **Odstavec 3** `body.2`: Jestli nechceš, aby se videa a tvoje soukromé zprávy dostaly ke všem tvým známým, pošli mi 1 200 eur v bitcoinech.
   - **Hrozba** · `neobvykla-zadost` (neobvyklá žádost) · „Žádost o peníze“: Neplaťte. Národní úřad pro kybernetickou bezpečnost radí peníze v žádném případě neposílat.
7. **Odstavec 4** `body.3`: Máš 48 hodin. Když zprávu někomu ukážeš, video hned zveřejním.
   - **Hrozba** · `casovy-tlak` (spěch ve zprávě) · „Lhůta a zákaz o tom mluvit“: Lhůta a zákaz zprávu ukázat mají zabránit tomu, abyste se s někým poradili. Klidně to řekněte někomu blízkému. Není se za co stydět.

**Shrnutí:** Pisatel nic nemá, chce vás jen vyděsit. Neplaťte a neodpovídejte, zprávu stačí smazat. Nemusíte se stydět říct o ní někomu blízkému. Národní úřad pro kybernetickou bezpečnost před takovými vlnami e-mailů varuje.

**Zdroje:**

- [nukib.gov.cz/cs/infoservis/hrozby/1670-upozorneni-na-novou-vlnu-podvodnych-vyderacskych-emailu/](https://nukib.gov.cz/cs/infoservis/hrozby/1670-upozorneni-na-novou-vlnu-podvodnych-vyderacskych-emailu/) (4. 1. 2021)

---

### email-07: Zásilkovna: zásilka je připravená k vyzvednutí

- **Sekce:** E-mail
- **Druh:** legitimní
- **Vyvrací:** „Když je v e-mailu odkaz, je to podvod.“
- **Odesílatel:** Zásilkovna <noreply@zasilkovna.cz>

**Zpráva po částech:**

1. **Jméno odesílatele** `fromName`: Zásilkovna
2. **Adresa odesílatele** `fromAddress`: noreply@zasilkovna.cz
- _Datum: dnes 13:48_
3. **Předmět** `subject`: Zásilka je připravena k vyzvednutí
4. **Odstavec 1** `body.0`: Dobrý den, paní Nováková,
5. **Odstavec 2** `body.1`: Vaše zásilka z e-shopu Kniha pro radost je připravena k vyzvednutí na výdejním místě Trafika U Nádraží, Lipová 3.
6. **Odstavec 3** `body.2`: Zásilka je zaplacená, při vyzvednutí nic neplatíte.
7. **Odstavec 4** `body.3`: Kde výdejní místo najdete a kdy má otevřeno, uvidíte na odkazu níže.
8. **Odstavec 5** `body.4`: Děkujeme, tým Zásilkovny
9. **Odkaz** `link`: Sledovat zásilku na www.zasilkovna.cz

**Shrnutí:** Zpráva po vás nic nechce: žádnou platbu ani údaje, jen oznamuje, kde zásilka čeká. Odkaz sám o sobě podvod není. Jistější je ale otevřít si aplikaci nebo stránky Zásilkovny sami, ne přes odkaz ve zprávě.

**Zdroje:**

- [zasilkovna.cz/blog/upozornujeme-na-novy-podvodny-e-mail](https://zasilkovna.cz/blog/upozornujeme-na-novy-podvodny-e-mail) (25. 6. 2024)
- [zasilkovna.cz/bezpecnost-ochrana-dat/emaily](https://zasilkovna.cz/bezpecnost-ochrana-dat/emaily)

---

### email-08: Vnučka posílá fotku z výletu

- **Sekce:** E-mail
- **Druh:** legitimní
- **Vyvrací:** „Když je v e-mailu příloha, je to podvod.“
- **Odesílatel:** Anička <anicka.novakova@seznam.cz>

**Zpráva po částech:**

1. **Jméno odesílatele** `fromName`: Anička
2. **Adresa odesílatele** `fromAddress`: anicka.novakova@seznam.cz
- _Datum: včera 20:15_
3. **Předmět** `subject`: Fotka z výletu
4. **Odstavec 1** `body.0`: Ahoj babi,
5. **Odstavec 2** `body.1`: jak jsem ti v neděli slíbila, posílám fotku z našeho výletu na hrad. Nejvíc se mi líbí, jak Honza mává z věže.
6. **Odstavec 3** `body.2`: V sobotu se u vás zastavíme, upeču štrůdl.
7. **Odstavec 4** `body.3`: Pa, Anička
8. **Příloha** `attachment`: vylet_hrad.jpg

**Shrnutí:** Příloha sama o sobě podvod není. Tuhle fotku jste čekali: vnučka vám ji slíbila a zpráva na ten slib přesně navazuje. Nic po vás nechce, žádné peníze ani údaje. Kdyby vám přišla příloha, o které nic nevíte, neotevírejte ji, i když je od někoho známého. Nejdřív se zeptejte, třeba telefonem.

**Zdroje:** žádné (bez tvrzení za firmu nebo úřad)

---

### email-09: Obec připomíná poplatek za odpad

- **Sekce:** E-mail
- **Druh:** legitimní
- **Vyvrací:** „Když úřad píše o placení, je to podvod.“
- **Odesílatel:** Obec Javorná Lhota <podatelna@javornalhota.cz>

**Zpráva po částech:**

1. **Jméno odesílatele** `fromName`: Obec Javorná Lhota
2. **Adresa odesílatele** `fromAddress`: podatelna@javornalhota.cz
- _Datum: dnes 9:12_
3. **Předmět** `subject`: Poplatek za odpad na příští rok
4. **Odstavec 1** `body.0`: Dobrý den, paní Nováková,
5. **Odstavec 2** `body.1`: připomínáme, že poplatek za odpad na příští rok je 850 Kč na osobu.
6. **Odstavec 3** `body.2`: Zaplatit ho můžete v hotovosti na obecním úřadě v úředních hodinách, nebo převodem na účet obce, který najdete na úřední desce a na webu obce.
7. **Odstavec 4** `body.3`: S pozdravem, Obecní úřad Javorná Lhota

**Shrnutí:** Zpráva mluví o placení, a přesto je v pořádku: nechce žádné údaje ani platbu přes odkaz. Zaplatit můžete obvyklou cestou, na úřadě nebo na účet, který si sami najdete na webu obce. Kdyby vás e-mail posílal platit přes odkaz, raději zavolejte na obecní úřad.

**Zdroje:** žádné (bez tvrzení za firmu nebo úřad)

---

### email-10: Pozvánka na výlet klubu seniorů

- **Sekce:** E-mail
- **Druh:** legitimní
- **Vyvrací:** „Když e-mail chce odpověď, je to podvod.“
- **Odesílatel:** Marie Kopecká <marie.kopecka@lhotanet.cz>

**Zpráva po částech:**

1. **Jméno odesílatele** `fromName`: Marie Kopecká
2. **Adresa odesílatele** `fromAddress`: marie.kopecka@lhotanet.cz
- _Datum: včera 16:40_
3. **Předmět** `subject`: Výlet klubu na zámek
4. **Odstavec 1** `body.0`: Milá Jano,
5. **Odstavec 2** `body.1`: jak jsme se v klubu domluvily, pojedeme za dva týdny ve čtvrtek na výlet na zámek.
6. **Odstavec 3** `body.2`: Autobus odjíždí v 8 hodin od obecního úřadu, jízdné vybírám až v autobuse.
7. **Odstavec 4** `body.3`: Odpověz mi prosím na tento e-mail, jestli pojedeš, ať vím, kolik objednat míst.
8. **Odstavec 5** `body.4`: Měj se hezky, Marie

**Shrnutí:** Zpráva chce jen odpověď, jestli pojedete, a to je v pořádku. Nechce peníze předem, údaje ani kliknutí na odkaz. Marie píše o tom, na čem jste se v klubu domluvily, zprávu jste tedy čekali. Kdyby vás někdo e-mailem nečekaně žádal o údaje nebo o peníze předem, raději se ho zeptejte osobně.

**Zdroje:** žádné (bez tvrzení za firmu nebo úřad)

---

### email-11: Knihovna připomíná konec výpůjčky

- **Sekce:** E-mail
- **Druh:** legitimní
- **Vyvrací:** „Když zpráva připomíná lhůtu, je to podvod.“
- **Odesílatel:** Obecní knihovna Javorná Lhota <knihovna@javornalhota.cz>

**Zpráva po částech:**

1. **Jméno odesílatele** `fromName`: Obecní knihovna Javorná Lhota
2. **Adresa odesílatele** `fromAddress`: knihovna@javornalhota.cz
- _Datum: dnes 8:05_
3. **Předmět** `subject`: Zítra končí výpůjční lhůta
4. **Odstavec 1** `body.0`: Dobrý den, paní Nováková,
5. **Odstavec 2** `body.1`: zítra Vám končí výpůjční lhůta u knihy Babiččiny recepty na každý den.
6. **Odstavec 3** `body.2`: Knihu můžete vrátit v knihovně, nebo si výpůjčku prodloužit u nás na pultu či telefonicky v otevíracích hodinách.
7. **Odstavec 4** `body.3`: Hezký den přeje Vaše knihovna

**Shrnutí:** Zpráva připomíná lhůtu, a přesto je v pořádku. Lhůta sama o sobě podvod není: knihovna jen připomíná, kdy knihu vrátit, nic nechce a nabízí obvyklé cesty, jak knihu vrátit nebo výpůjčku prodloužit. Kdyby vás zpráva kvůli lhůtě tlačila k platbě přes odkaz nebo ke sdělení údajů, raději zavolejte do knihovny.

**Zdroje:** žádné (bez tvrzení za firmu nebo úřad)

## Zprávy

### zpravy-01: Pokuta za dopravní přestupek

- **Sekce:** Zprávy, SMS
- **Druh:** podvod
- **Odesílatel:** +44 7700 900318 (není v kontaktech)

**Zpráva po částech:**

1. **Odesílatel** `from`: +44 7700 900318
   - **Hrozba** · `nezname-cislo` (neznámé číslo) · „Číslo ze zahraničí“: Zpráva přišla z čísla s předvolbou +44, to je Velká Británie. Pokuta za přestupek v Česku a číslo z ciziny k sobě nesedí.
- _Štítek nad bublinami: Dnes 10:24_
2. **Bublina 1** `messages.0`: Dobrý den, evidujeme u Vás neuhrazenou pokutu za dopravní přestupek ve výši 1 500 Kč. Uhraďte ji do 3 dnů, jinak bude předána k vymáhání a navýšena.
   - **Hrozba** · `casovy-tlak` (spěch ve zprávě) · „Spěch a výhrůžka“: Krátká lhůta a hrozba vymáháním mají zabránit tomu, abyste si to v klidu ověřili. Všimněte si i toho, co ve zprávě chybí: kde, kdy a jakým autem jste měli přestupek spáchat. Ministerstvo dopravy ve svém varování uvádí, že skutečná zpráva o přestupku vždy obsahuje jeho konkrétní popis, například místo, čas a vozidlo, a že informace o dopravních přestupcích se takto nerozesílají.
3. **Odkaz v bublině 1** `messages.0.link`: https://portal-dopravy-pokuty.top/uhrada
   - **Hrozba** · `odkaz-platba` (odkaz nebo tlačítko k platbě) · „Odkaz k platbě“: Odkaz vede na stránku, která jen napodobuje úřad. Ministerstvo dopravy radí na odkazy v podobných SMS neklikat a nereagovat na výzvy k platbě.

**Shrnutí:** Když si nejste jistí, jestli pokutu opravdu máte, ověřte si to sami na oficiálních stránkách, nikdy přes odkaz ve zprávě. Podezřelou SMS můžete přeposlat na číslo 7726, tím ji nahlásíte operátorovi.

**Zdroje:**

- [md.gov.cz/Media/Media-a-tiskove-zpravy/Pozor-na-falesne-SMS-o-pokutach](https://md.gov.cz/Media/Media-a-tiskove-zpravy/Pozor-na-falesne-SMS-o-pokutach) (Ministerstvo dopravy, 12. 6. 2026)
- [policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy](https://policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy) (7726)

---

### zpravy-02: Ahoj mami, rozbil se mi mobil

- **Sekce:** Zprávy, chat
- **Druh:** podvod
- **Odesílatel:** +33 6 39 98 41 27 (není v kontaktech)

**Zpráva po částech:**

1. **Odesílatel** `from`: +33 6 39 98 41 27
   - **Hrozba** · `nezname-cislo` (neznámé číslo) · „Neznámé „nové“ číslo“: Píše vám číslo, které nemáte uložené, a začíná +33, to je Francie. Policie varuje, že podvodníci často používají zahraniční předvolby a začínají právě větou o novém čísle. Platí i pro: `messages.0`.
- _Štítek nad bublinami: Dnes 16:02_
2. **Bublina 1** `messages.0`: Ahoj mami, rozbil se mi mobil, píšu z nového čísla. Ulož si ho.
   - součást hrozby „Neznámé „nové“ číslo“ (hlavní část `from`)
3. **Bublina 2** `messages.1`: Jak se máš? Doma je všechno v pořádku?
   - nevinná část
4. **Bublina 3** `messages.2`: Mám malý problém. Nedostanu se do bankovnictví a ještě dnes musím zaplatit fakturu, jinak mi naběhne penále.
   - **Hrozba** · `casovy-tlak` (spěch ve zprávě) · „Spěch“: „Ještě dnes, jinak penále.“ Policie upozorňuje, že jakýkoli tlak na rychlé jednání je podezřelý.
5. **Bublina 4** `messages.3`: Mohla bys ji zaplatit za mě? Je to 8 450 Kč, zítra ti to hned vrátím. Pošlu ti číslo účtu.
   - **Hrozba** · `neobvykla-zadost` (neobvyklá žádost) · „Prosba o peníze“: Prosba o rychlé peníze se slibem, že se hned vrátí, je podle policie typický znak tohoto podvodu.
6. **Bublina 5** `messages.4`: Prosím, neříkej to tátovi, ať není naštvaný.
   - **Hrozba** · `emocni-natlak` (citový nátlak) · „„Nikomu to neříkej““: Prosba o tajemství má zabránit tomu, abyste si to s někým z rodiny ověřili.

**Shrnutí:** Než cokoli pošlete, zavolejte na původní číslo, které znáte, i když zpráva tvrdí, že je telefon rozbitý. Nebo se zeptejte na něco, co ví jen vaše dítě. Podezřelý účet můžete v aplikaci zablokovat a nahlásit.

**Zdroje:**

- [archiv.policie.gov.cz/clanek/pozor-na-podvodne-zpravy-na-whatsappu-mami-mam-nove-cislo.aspx](https://archiv.policie.gov.cz/clanek/pozor-na-podvodne-zpravy-na-whatsappu-mami-mam-nove-cislo.aspx) (Policie ČR, KŘP Středočeského kraje, 25. 9. 2025)
- [archiv.policie.gov.cz/clanek/ahoj-mami-mam-nove-cislo-napis-mi-na-whatsapp-tohle-neni-vase-dite-ale-podvodnik.aspx](https://archiv.policie.gov.cz/clanek/ahoj-mami-mam-nove-cislo-napis-mi-na-whatsapp-tohle-neni-vase-dite-ale-podvodnik.aspx) (Policie ČR, ÚO Kladno, 17. 9. 2025)
- [bezpecnejsi.ostrava.cz/ahoj-tati-rozbil-se-mi-telefon-nehoda-nebo-podvod/](https://bezpecnejsi.ostrava.cz/ahoj-tati-rozbil-se-mi-telefon-nehoda-nebo-podvod/) (Bezpečnější Ostrava, 20. 10. 2025)

---

### zpravy-03: Fotky od syna

- **Sekce:** Zprávy, SMS
- **Druh:** legitimní
- **Vyvrací:** „Když je v SMS odkaz, je to podvod.“
- **Odesílatel:** Petr (uložený kontakt)

**Zpráva po částech:**

1. **Odesílatel** `from`: Petr
- _Štítek nad bublinami: Dnes 19:15_
2. **Bublina 1** `messages.0`: Ahoj mami, tady jsou ty fotky z Aniččiných narozenin, jak jsem ti včera slíbil do telefonu.
3. **Odkaz v bublině 1** `messages.0.link`: https://photos.google.com/share/AF1QipN7x
4. **Bublina 2** `messages.1`: Ta s dortem je nejlepší. V neděli se stavíme, jak jsme se domluvili.

**Shrnutí:** Rozhodující je, že zpráva nic nechce: žádné peníze, žádný kód, žádné přihlášení ani platbu. Petr navazuje na to, o čem jste spolu včera mluvili, fotky jste tedy čekali. Odkaz sám o sobě podvod není, rozhoduje, jestli zprávu čekáte a co po vás chce. Kdyby vás i známé číslo nečekaně prosilo o peníze nebo o kód, raději zavolejte.

**Zdroje:** žádné (bez tvrzení za firmu nebo úřad)

---

### zpravy-04: Kamarádka prosí o hlas v soutěži

- **Sekce:** Zprávy, chat
- **Druh:** podvod
- **Odesílatel:** Jarka (uložený kontakt)

**Zpráva po částech:**

1. **Odesílatel**: Jarka
   - nejde označit (`fromMarkable: false`)
- _Štítek: Út 18:05_
2. **Bublina 1** `messages.0`: Díky za dnešní kafe, bylo to moc prima. Musíme to zase brzo zopakovat.
   - nevinná část
3. **Bublina 2** `messages.1`: Ten recept na bábovku ti pošlu, až ho najdu.
   - nevinná část
- _Štítek: Dnes 11:40_
4. **Bublina 3** `messages.2`: Ahoj, prosím tě, můžeš mi pomoct? Moje vnučka je ve finále soutěže o nejhezčí dětskou kresbu a rozhoduje hlasování.
   - **Hrozba** · `emocni-natlak` (citový nátlak) · „Prosba, které se těžko odmítá“: Vnučka a soutěž kresbiček: prosbě o pomoc se špatně říká ne. Právě na to podvodník spoléhá.
5. **Bublina 4** `messages.3`: Stačí kliknout sem a hlasovat, zabere to minutu.
   - součást hrozby „Odkaz na hlasování“ (hlavní část `messages.3.link`)
6. **Odkaz v bublině 4** `messages.3.link`: https://soutez-kresba-hlasovani.top/hlas
   - **Hrozba** · `zadost-o-udaje` (žádost o údaje nebo kódy) · „Odkaz na hlasování“: Prosba o hlas v soutěži s odkazem je známý trik. Air Bank ho popisuje takto: podvodník pošle prosbu o pomoc při hlasování a přidá odkaz. Platí i pro: `messages.3`.
7. **Bublina 5** `messages.4`: Potom ti přijde SMS s kódem, ten tam jen opiš a klikni na Připojit zařízení. Moc ti děkuju.
   - **Hrozba** · `zadost-o-udaje` (žádost o údaje nebo kódy) · „Kód z SMS“: Kód z SMS a tlačítko „Připojit zařízení“ by otevřely váš účet v chatu cizímu člověku. Podle Air Bank pak podvodník začne rozesílat žádosti o peníze.

**Shrnutí:** Zpráva přišla od kamarádky, kterou máte v kontaktech, a přesto je to podvod: její účet v chatu mohl někdo převzít. I zprávu od známého tak může psát někdo jiný. Když se známý chová jinak než obvykle, pospíchá nebo chce kód, ověřte si to zavoláním na číslo, které znáte. Kód z SMS nikomu neposílejte a nikdy ho neopisujte na stránku, kam vás poslal odkaz ze zprávy.

**Zdroje:**

- [airbank.cz/co-vas-nejvic-zajima/podvody-ktere-zrovna-leti/](https://airbank.cz/co-vas-nejvic-zajima/podvody-ktere-zrovna-leti/)

---

### zpravy-05: Trestní oznámení z čísla 158

- **Sekce:** Zprávy, SMS
- **Druh:** podvod
- **Odesílatel:** 158 (není v kontaktech)

**Zpráva po částech:**

1. **Odesílatel** `from`: 158
   - **Hrozba** · `odesilatel` (adresa nebo jméno odesílatele) · „Číslo 158“: Číslo 158 zná každý, a proto se hodí podvodníkům. Číslo odesílatele se dá podvrhnout. Policie ve svém varování napsala: „Z linky 158 žádné takové zprávy neposíláme.“
- _Štítek nad bublinami: Dnes 8:52_
2. **Bublina 1** `messages.0`: Policie ČR: Na Vaši osobu bylo podáno trestní oznámení. Podrobnosti a předvolání najdete ve své datové schránce.
   - **Hrozba** · `emocni-natlak` (citový nátlak) · „Strach“: Trestní oznámení má vyděsit a donutit vás jednat hned, bez rozmyslu.
3. **Odkaz v bublině 1** `messages.0.link`: https://datova-schranka-portal.top/prihlaseni
   - **Hrozba** · `zadost-o-udaje` (žádost o údaje nebo kódy) · „Falešná datová schránka“: Odkaz vede na falešnou stránku, která se jen tváří jako datová schránka. Adresa končí na .top, to s úřadem nesouvisí.

**Shrnutí:** Na takovou zprávu nereagujte a na odkaz neklikejte. Když si nejste jistí, přihlaste se do datové schránky sami přes její oficiální stránky. Podezřelou SMS můžete přeposlat na číslo 7726, tím ji nahlásíte operátorovi.

**Zdroje:**

- [ceskenoviny.cz/zpravy/policie-varuje-pred-podvodnymi-sms-zpravami-vypadaji-jako-odeslane-z-linky-158/2630375](https://ceskenoviny.cz/zpravy/policie-varuje-pred-podvodnymi-sms-zpravami-vypadaji-jako-odeslane-z-linky-158/2630375) (ČTK, 5. 2. 2025, cituje Policii ČR)
- [x.com/PolicieCZ/status/1887141569452462279](https://x.com/PolicieCZ/status/1887141569452462279) (Policie ČR, původní příspěvek)
- [policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy](https://policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy) (7726)

---

### zpravy-06: Kupující z bazaru pošle odkaz k přijetí platby

- **Sekce:** Zprávy, chat
- **Druh:** podvod
- **Odesílatel:** +420 772 145 208 (není v kontaktech)

**Zpráva po částech:**

1. **Odesílatel** `from`: +420 772 145 208
   - nevinná část
- _Štítek nad bublinami: Dnes 13:05_
2. **Bublina 1** `messages.0`: Dobrý den, píšu kvůli vašemu inzerátu na šicí stroj za 1 800 Kč. Je ještě k mání?
   - nevinná část
3. **Bublina 2** `messages.1`: Beru ho. Zaplatím hned předem a kurýr si ho u vás vyzvedne, o nic se nestaráte.
   - **Hrozba** · `neobvykla-zadost` (neobvyklá žádost) · „Podivně snadný obchod“: Kupující stroj neviděl, nesmlouvá a hned chce platit předem přes kurýra. Tím chystá půdu pro odkaz, který přijde vzápětí.
4. **Bublina 3** `messages.2`: Tady je odkaz, vyplňte tam údaje z karty, ať vám peníze přijdou.
   - součást hrozby „Údaje z karty „k přijetí peněz““ (hlavní část `messages.2.link`)
5. **Odkaz v bublině 3** `messages.2.link`: https://prijeti-platby-bazar.top/platba
   - **Hrozba** · `zadost-o-udaje` (žádost o údaje nebo kódy) · „Údaje z karty „k přijetí peněz““: K tomu, abyste peníze dostali, údaje z karty nepotřebujete. Air Bank popisuje tento trik takto: kupující pošle odkaz, kam vyplníte údaje z karty, a tak prý přijmete peníze. Platí i pro: `messages.2`.

**Shrnutí:** Nevyplňujte žádné údaje na odkazech, které vám někdo pošle, i když důvod zní věrohodně. Peníze za prodanou věc si nechte poslat na číslo svého účtu, nebo si je vezměte při osobním předání.

**Zdroje:**

- [airbank.cz/co-vas-nejvic-zajima/podvody-ktere-zrovna-leti/](https://airbank.cz/co-vas-nejvic-zajima/podvody-ktere-zrovna-leti/)

---

### zpravy-07: Připomínka termínu u zubařky

- **Sekce:** Zprávy, SMS
- **Druh:** legitimní
- **Vyvrací:** „Když zpráva přijde z uloženého čísla, je pravá.“
- **Odesílatel:** Zubařka Veselá (uložený kontakt)

**Zpráva po částech:**

1. **Odesílatel** `from`: Zubařka Veselá
- _Štítek nad bublinami: Včera 17:30_
2. **Bublina 1** `messages.0`: Dobrý den, připomínáme Vám preventivní prohlídku u MUDr. Veselé v pátek v 9:30. Pokud nemůžete přijít, dejte nám prosím vědět telefonicky.

**Shrnutí:** Zpráva jen připomíná termín a nic nechce: žádnou platbu ani údaje. Právě to rozhoduje, samotné uložené číslo nestačí, protože číslo odesílatele se dá podvrhnout. Kdyby vás ordinace přes zprávu žádala o platbu nebo o údaje, raději jí zavolejte na číslo, které znáte.

**Zdroje:** žádné (bez tvrzení za firmu nebo úřad)

---

### zpravy-08: Obec hlásí odstávku vody

- **Sekce:** Zprávy, SMS
- **Druh:** legitimní
- **Vyvrací:** „Když odesílatel není v kontaktech, je to podvod.“
- **Odesílatel:** Obec Javorná Lhota (není v kontaktech)

**Zpráva po částech:**

1. **Odesílatel** `from`: Obec Javorná Lhota
- _Štítek nad bublinami: Dnes 7:15_
2. **Bublina 1** `messages.0`: Obec Javorná Lhota informuje: v pátek od 8 do 14 hodin nepoteče voda kvůli opravě vodovodu v ulici Polní. Cisterna s pitnou vodou bude stát u obecního úřadu.

**Shrnutí:** Zpráva jen informuje a nic nechce: žádné peníze ani údaje. To, že odesílatel není ve vašich kontaktech, samo o sobě nevadí. Když si nejste jistí, podívejte se na stránky obce nebo zavolejte na obecní úřad.

**Zdroje:** žádné (bez tvrzení za firmu nebo úřad)

---

### zpravy-09: E-shop hlásí čas doručení kurýrem

- **Sekce:** Zprávy, SMS
- **Druh:** legitimní
- **Vyvrací:** „Když SMS píše o balíku, je to podvod.“
- **Odesílatel:** Kniha pro radost (není v kontaktech)

**Zpráva po částech:**

1. **Odesílatel** `from`: Kniha pro radost
- _Štítek nad bublinami: Dnes 9:30_
2. **Bublina 1** `messages.0`: Kniha pro radost: Vaši objednávku č. 58213 dnes doručí kurýr mezi 13. a 15. hodinou. Zásilka je zaplacená, kurýrovi nic neplatíte.

**Shrnutí:** Zpráva je o balíku, a přesto je v pořádku: nechce žádnou platbu ani údaje. Jen oznamuje, kdy přijede kurýr s věcí, kterou jste si objednali. Kdyby zpráva chtěla doplatit poplatek nebo zadat údaje, ověřte si zásilku sami přímo u e-shopu.

**Zdroje:** žádné (bez tvrzení za firmu nebo úřad)

---

### zpravy-10: Kamarádka prosí o zalití kytek

- **Sekce:** Zprávy, chat
- **Druh:** legitimní
- **Vyvrací:** „Když mě známý přes zprávu o něco prosí, je to podvod.“
- **Odesílatel:** Věra (uložený kontakt)

**Zpráva po částech:**

1. **Odesílatel** `from`: Věra
- _Štítek nad bublinami: Dnes 17:20_
2. **Bublina 1** `messages.0`: Ahoj Jani, prosím tě, mohla bys mi od pátku do neděle zalévat kytky? Jedu za dcerou do Brna.
3. **Bublina 2** `messages.1`: Klíč ti přinesu ve čtvrtek večer. Až se vrátím, přinesu ti buchty.

**Shrnutí:** I známý vás může o něco poprosit, prosba sama o sobě podvod není. Rozhoduje, o co prosí: Věra nechce peníze, kód ani kliknutí na odkaz, jen pomoc se zaléváním. Kdyby vás známý přes zprávu nečekaně žádal o peníze nebo o kód, raději mu zavolejte.

**Zdroje:** žádné (bez tvrzení za firmu nebo úřad)

---

### zpravy-11: Vnuk píše bez háčků a čárek

- **Sekce:** Zprávy, chat
- **Druh:** legitimní
- **Vyvrací:** „Když zpráva nemá háčky a čárky nebo má chyby, je to podvod.“
- **Odesílatel:** Honza (uložený kontakt)

**Zpráva po částech:**

1. **Odesílatel** `from`: Honza
- _Štítek nad bublinami: Dnes 18:45_
2. **Bublina 1** `messages.0`: ahoj babi, diky moc za ten darek k narozkam, uz jsem ho vyzkousel a je super
3. **Bublina 2** `messages.1`: v nedeli prijedem s mamkou, udelas ty tvoje livance? :)

**Shrnutí:** Zpráva je bez háčků a čárek, a přesto je v pořádku. Takhle na mobilu píše spousta lidí, chyby samy o sobě nic neznamenají. Rozhoduje, že na nic nespěchá a nic nechce: žádné peníze, kód ani odkaz.

**Zdroje:** žádné (bez tvrzení za firmu nebo úřad)
