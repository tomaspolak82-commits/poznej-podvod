# Návrhy scénářů pro Zprávy (k Tomášovu schválení)

Připraveno 24. 9. 2026, upraveno týž den po Tomášových odpovědích. Jsou to **jen návrhy**: nic z toho není v `src/content` ani v kódu. Čísla souborů (`zpravy-04` až `zpravy-08`) jsou předběžná. Dnes je na jejich místě testovací obsah, který by tyto scénáře nahradily.

Vychází z `docs/napady-scenaru.md` a z pravidel sekce 7 v `CLAUDE.md`. Každý text je návrh, ne citace skutečného podvodu.

**Jak jsou ověřené zdroje:**
- **doslova ověřeno:** stáhl jsem stránku (`curl`) a větu jsem našel přímo v jejím textu (po odstranění značek HTML).
- **jen shrnutí pomocného modelu:** větu uvedl nástroj WebFetch, v textu stránky jsem ji sám nenašel.

Všechny citace níže jsou doslova ověřené, pokud u nich není napsáno jinak.

**Pestrost:** k současným zprávám (úřad/pokuta, rodina/peníze, rodina legitimní) přibývá kamarád (kód), policie (strach), bazar (údaje z karty), lékař a obec (legitimní). Všechny podvody jsou v bezchybné češtině.

**Kontrola „co hráč označí podle nápovědy“** (sekce 7) je u každého scénáře v tabulce. Mezera v nápovědě u `zpravy-06` je vyřešená: zúžený bod 1 nápovědy Zpráv je ve hře od milníku 5.

**Stav k 25. 9. 2026:** `zpravy-04` až `zpravy-08` jsou schválené a ve hře. Dokument zůstává jako záznam zdrojů a rozhodnutí.

---

## zpravy-04: Kamarádka prosí o hlas v soutěži (chat, podvod)

Za koho se vydává: kamarádka (převzatý účet). Co chce: zadat kód. Tlak: soucit, zvědavost. Námět Z3.

**Upraveno 24. 9. 2026 podle Tomášových odpovědí c, e, f.** Nad novou zprávou jsou dvě starší bubliny od Jarky v jejím obvyklém tónu (nevinné části, pravidlo A). Nové texty pro hráče (starší bubliny, shrnutí) jsou návrh ke schválení.

```
Odesílatel: Jarka (uložený kontakt)

[štítek] Út 18:05
[bublina 0]
Díky za dnešní kafe, bylo to moc prima. Musíme to zase brzo zopakovat.
[bublina 1]
Ten recept na bábovku ti pošlu, až ho najdu.

[štítek] Dnes 11:40
[bublina 2]
Ahoj, prosím tě, můžeš mi pomoct? Moje vnučka je ve finále soutěže o nejhezčí dětskou kresbu a rozhoduje hlasování.
[bublina 3]
Stačí kliknout sem a hlasovat, zabere to minutu.
[odkaz v bublině 3]
https://soutez-kresba-hlasovani.top/hlas
[bublina 4]
Potom ti přijde SMS s kódem, ten tam jen opiš a klikni na Připojit zařízení. Moc ti děkuju.
```

| Část | Kategorie | Název | Vysvětlení pro hráče |
|---|---|---|---|
| `messages.3.link` + `alsoTargets: ["messages.3"]` | zadost-o-udaje | Odkaz na hlasování | Prosba o hlas v soutěži s odkazem je známý trik. Air Bank ho popisuje takto: podvodník pošle prosbu o pomoc při hlasování a přidá odkaz. |
| `messages.4` | zadost-o-udaje | Kód z SMS | Kód z SMS a tlačítko „Připojit zařízení“ by otevřely váš účet v chatu cizímu člověku. Podle Air Bank pak podvodník začne rozesílat žádosti o peníze. |
| `messages.2` | emocni-natlak | Prosba, které se těžko odmítá | Vnučka a soutěž kresbiček: prosbě o pomoc se špatně říká ne. Právě na to podvodník spoléhá. |

Shrnutí:
```
Zpráva přišla od kamarádky, kterou máte v kontaktech, a přesto je to podvod: její účet v chatu mohl někdo převzít. I zprávu od známého tak může psát někdo jiný. Když se známý chová jinak než obvykle, pospíchá nebo chce kód, ověřte si to zavoláním na číslo, které znáte. Kód z SMS nikomu neposílejte a nikdy ho neopisujte na stránku, kam vás poslal odkaz ze zprávy.
```

**Postaveno 24. 9. 2026 (Tomášova rozhodnutí d, e):**
- **Štítky s datem:** `messages.0.date: "Út 18:05"`, `messages.2.date: "Dnes 11:40"`. Formát den + čas, bez pevného data a bez „minulý týden“.
- **Odesílatel neklikací:** `fromMarkable: false`. Jarka je obyčejný text, nejde označit a nestojí bod.
- **Jen příchozí bubliny.** Aplikace neumí vlastní (odeslané) zprávy hráčky, proto jsou starší bubliny napsané tak, aby dávaly smysl i bez odpovědí.

Zdroje (`sources`): airbank.cz/co-vas-nejvic-zajima/podvody-ktere-zrovna-leti/
- „Pošle mu zprávu s prosbou o pomoc při hlasování v soutěži a přidá odkaz.“
- „vyzve ke kliknutí na tlačítko Připojit zařízení“
- „Tím se podvodník připojí k WhatsApp napadeného.“ (doslova ověřeno 25. 9. 2026, podklad pro „by otevřely váš účet v chatu cizímu člověku“, vysvětlení u kódu proto zůstává)
- „Poté využije seznam kontaktů a začne rozesílat žádosti o peníze — vaším jménem a vašim přátelům.“ (25. 9. 2026 doslova ověřena celá věta; ve vysvětlení zůstává zkrácené znění podle rozhodnutí e)
- „Pokud si nejste jistí, vždy je lepší informaci ověřit, například danému člověku zavolat.“
- Rada ve shrnutí („I zprávu od známého tak může psát někdo jiný…“) je obecná, bez tvrzení za firmu (Tomášovo zadání c3).

Kontrola nápovědy: bublina 2 (citový nátlak, bod 3), bublina 3 a odkaz (bod 4), bublina 4 (kód, bod 5) leží na hrozbách. Starší bubliny 0 a 1 nic nechtějí, nápověda k nim nevede: jsou to nevinné části (pravidlo A). **Odesílatel:** u převzatého účtu je podezření k němu oprávněné, proto nesmí být −1 (Tomášovo rozhodnutí c2). Odesílatel je proto neklikací (`fromMarkable: false`, rozhodnutí e).

Kategorie odkazu změněná z `odkaz-platba` na `zadost-o-udaje` (rozhodnutí f): odkaz vede k hlasování a opsání kódu, ne k platbě.

Žádost o peníze se do tohoto scénáře záměrně nepřidává (rozhodnutí c4), je z ní nový námět Z13 v `docs/napady-scenaru.md`.

Poznámky:
- Doména `soutez-kresba-hlasovani.top`: registr `.top` (RDAP) vrací 404, DNS neexistuje (ověřeno 24. 9. 2026).
- Jméno „Jarka“ je smyšlené.

---

## zpravy-05: Trestní oznámení z čísla 158 (SMS, podvod, těžký)

Za koho se vydává: policie. Co chce: přihlásit se (bankovní identita). Tlak: strach. Námět Z6.

```
Odesílatel: 158 (není v kontaktech)
Datum: Dnes 8:52

[bublina 0]
Policie ČR: Na Vaši osobu bylo podáno trestní oznámení. Podrobnosti a předvolání najdete ve své datové schránce.
[odkaz v bublině 0]
https://datova-schranka-portal.top/prihlaseni
```

| Část | Kategorie | Název | Vysvětlení pro hráče |
|---|---|---|---|
| `from` | odesilatel | Číslo 158 | Číslo 158 zná každý, a proto se hodí podvodníkům. Číslo odesílatele se dá podvrhnout. Policie ve svém varování napsala: „Z linky 158 žádné takové zprávy neposíláme.“ |
| `messages.0` | emocni-natlak | Strach | Trestní oznámení má vyděsit a donutit vás jednat hned, bez rozmyslu. |
| `messages.0.link` | zadost-o-udaje | Falešná datová schránka | Odkaz vede na falešnou stránku, která se jen tváří jako datová schránka. Adresa končí na .top, to s úřadem nesouvisí. |

Shrnutí:
```
Na takovou zprávu nereagujte a na odkaz neklikejte. Když si nejste jistí, přihlaste se do datové schránky sami přes její oficiální stránky. Podezřelou SMS můžete přeposlat na číslo 7726, tím ji nahlásíte operátorovi.
```

**Upraveno 24. 9. 2026 podle rozhodnutí a:** číslo 158 schválené jako výjimka. Zdrojem je přímé varování policie, ne blog Monety. U odkazu jsem vypustil tvrzení o „ověření bankovní identity“, protože ho má jen Moneta, ne policie.

Zdroje: ceskenoviny.cz/zpravy/policie-varuje-pred-podvodnymi-sms-zpravami-vypadaji-jako-odeslane-z-linky-158/2630375 (ČTK, 5. 2. 2025, cituje příspěvek Policie ČR na X: x.com/PolicieCZ/status/1887141569452462279). Doslova ověřeno ve staženém textu stránky (`curl`) 24. 9. 2026:
- „Aktuálně jsme zaznamenali vlnu falešných SMS, které se tváří, jako by je rozesílal někdo z linky 158. Jedná se o zdařilou formu spoofingu a v žádném případě neklikejte na přiložený odkaz. Z linky 158 žádné takové zprávy neposíláme!“ Ve vysvětlení končí věta tečkou místo vykřičníku (tón bez vykřičníků, sekce 7).
- „…trestní oznámení, pro více informací zkontrolujte datovou schránku“ (citace zprávy) a hned za ní: „K tomu je připojený odkaz na falešný web.“
- „…správce nadnárodní domény (.top) a registrátora kontaktovat a doménu zablokovat.“
- 7726: policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy (ověřeno v milníku 3)

Kontrola nápovědy: všechny tři části jsou hrozby. `zpravy-05` spadá pod výjimku z pravidla A (SMS s jednou bublinou a odkazem, sekce 7), stejně jako `zpravy-01`. Nic se nemění.

7726 (25. 9. 2026 doslova ověřeno na policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy): „V případě, že rozpoznáte podezřelou SMS zprávu, reportujte ji svému operátorovi na jednotnou linku 7726 (cestou SMS zprávy). U některých mobilních telefonů existuje funkce nahlášení přímo u SMS zprávy. V opačném případě stačí zprávu přeposlat. Operátor následně může učinit další opatření.“ O zablokování odesílatele stránka nic neříká, proto shrnutí končí „…tím ji nahlásíte operátorovi.“

Poznámky:
- Doména `datova-schranka-portal.top`: registr `.top` 404, DNS neexistuje (24. 9. 2026).
- Číslo 158 je skutečná linka policie. Scénář ji zobrazuje jako podvržené číslo odesílatele. Je to výjimka z pravidla „čísla smyšlená“ (sekce 7), **Tomáš ji schválil 24. 9. 2026.**
- zpravy-01 na policii neodkazuje (cituje Ministerstvo dopravy). Vysvětlení tu má stejnou stavbu („… ve svém varování …“), jen s doslovnou citací.
- „Datová schránka“ je název státní služby (jméno instituce v textu je povolené, loga ne).

---

## zpravy-06: Kupující z bazaru pošle odkaz „k přijetí platby“ (chat, podvod, těžký)

Za koho se vydává: kupující z inzerátu. Co chce: údaje z karty. Tlak: rychlý obchod. Námět Z10.

**Schváleno a zabudováno 25. 9. 2026 (čtvrté kolo).** Číslo schválené (druhé kolo odpovědí), štítek „Dnes 13:05“ s velkým písmenem. „+420 777 000 000“ se nepoužije: předvolba 777 je přidělená (v datech ČTÚ blok 776 000 000 až 777 999 999).

Číslo: **+420 772 145 208** (schváleno). Leží v bloku 772 100 000 až 772 199 999, který v otevřených datech ČTÚ „Přidělená čísla a kódy“ nemá žádného držitele (soubor stažený 24. 9. 2026, metadata aktualizovaná 5. 9. 2026, denní aktualizace). Sousední přidělené bloky: 772 000 000 až 772 009 999 (TT Quality s.r.o., od 11. 2. 2026) a 772 220 000 až 772 229 999 (Telefonzentrale s.r.o.). Riziko: ČTÚ může blok kdykoli přidělit, v roce 2026 se v předvolbě 772 přidělovalo. Data: https://data.ctu.gov.cz/dataset/pridelena-cisla-kody (CSV: https://data.ctu.gov.cz/sites/default/files/imports/import_numbers/pridelena_cisla_a_kody.csv). Vyhledávání na https://ctu.gov.cz/vyhledavaci-databaze/pridelena-cisla-a-kody nemá odkaz na konkrétní výsledek, je potřeba zadat „Hledat podle části čísla“ a 772.

```
Odesílatel: +420 772 145 208 (není v kontaktech, lišta „Toto číslo není ve vašich kontaktech“)
Datum: Dnes 13:05

[bublina 0]
Dobrý den, píšu kvůli vašemu inzerátu na šicí stroj za 1 800 Kč. Je ještě k mání?
[bublina 1]
Beru ho. Zaplatím hned předem a kurýr si ho u vás vyzvedne, o nic se nestaráte.
[bublina 2]
Tady je odkaz, vyplňte tam údaje z karty, ať vám peníze přijdou.
[odkaz v bublině 2]
https://prijeti-platby-bazar.top/platba
```

| Část | Kategorie | Název | Vysvětlení pro hráče |
|---|---|---|---|
| `messages.2.link` + `alsoTargets: ["messages.2"]` | zadost-o-udaje | Údaje z karty „k přijetí peněz“ | K tomu, abyste peníze dostali, údaje z karty nepotřebujete. Air Bank popisuje tento trik takto: kupující pošle odkaz, kam vyplníte údaje z karty, a tak prý přijmete peníze. |
| `messages.1` | neobvykla-zadost | Podivně snadný obchod | Kupující stroj neviděl, nesmlouvá a hned chce platit předem přes kurýra. Tím chystá půdu pro odkaz, který přijde vzápětí. |

Shrnutí:
```
Nevyplňujte žádné údaje na odkazech, které vám někdo pošle, i když důvod zní věrohodně. Peníze za prodanou věc si nechte poslat na číslo svého účtu, nebo si je vezměte při osobním předání.
```

Zdroje: airbank.cz/co-vas-nejvic-zajima/podvody-ktere-zrovna-leti/ (všechny tři věty doslova ověřené ve staženém textu stránky 25. 9. 2026)
- „Zpravidla se ozve přes WhatsApp nebo mail a pošle vám odkaz, kam vyplníte údaje z karty a přijmete tak peníze.“ Podklad pro větu „Air Bank popisuje tento trik takto…“.
- „Nevyplňujte žádné údaje na odkazech, které vám někdo zašle, ani když má protistrana sebevěrohodnější záminku.“ Podklad pro první větu shrnutí. Ve hře je jako obecná rada, bez jména banky.
- „Obecné doporučení od nás je, abyste u obchodu přes inzeráty neplatili předem.“ Ve scénáři se nepoužívá, prodávající tu nic neplatí.

**Kontrola tvrzení (25. 9. 2026):**
- „Air Bank popisuje tento trik takto: kupující pošle odkaz, kam vyplníte údaje z karty, a tak prý přijmete peníze.“ odpovídá první citaci. Slovo „přesně“ jsem vypustil stejně jako u zpravy-04.
- „K tomu, abyste peníze dostali, údaje z karty nepotřebujete.“ je obecné tvrzení bez jména firmy. Air Bank ho doslova neříká, proto není přisouzené bance.
- **Změna ve shrnutí:** původní věta „Kupující zaplatí na číslo vašeho účtu nebo při osobním předání.“ tvrdila, jak se obchod běžně dělá, a zdroj to neuvádí. Přepsal jsem ji na obecnou radu: „Peníze za prodanou věc si nechte poslat na číslo svého účtu, nebo si je vezměte při osobním předání.“
- Vysvětlení u bubliny 1 („Kupující nic neviděl, nesmlouvá…“) popisuje jen text zprávy, žádné tvrzení za firmu.

Kontrola nápovědy: bod 1 nápovědy Zpráv je od milníku 5 zúžený na „číslo, které se vydává za někoho blízkého“, k označení cizího čísla kupujícího tedy nevede. `from` a bublina 0 (běžný dotaz na inzerát) jsou nevinné části (pravidlo A). Bod 4 („Odkaz k platbě nebo přihlášení… k zadání údajů“) vede k odkazu a bublině 2, obojí leží na hrozbě. Rada 7726 sem nepatří (chat, ne SMS).

Poznámky:
- Doména `prijeti-platby-bazar.top`: registr `.top` 404, DNS neexistuje (24. 9. 2026).
- **Číslo:** viz začátek scénáře. Rozsah vyhrazený pro ukázky jsem v ČR nenašel, proto nepřidělený blok podle dat ČTÚ.
- Obecně: výraz „bazar“ je obecný, žádný konkrétní web se nejmenuje.

---

## zpravy-07: Připomínka termínu u zubařky (SMS, legitimní)

```
Odesílatel: Zubařka Veselá (uložený kontakt)
Datum: Včera 17:30

[bublina 0]
Dobrý den, připomínáme Vám preventivní prohlídku u MUDr. Veselé v pátek v 9:30. Pokud nemůžete přijít, dejte nám prosím vědět telefonicky.
```

Hrozby: žádné.

Shrnutí:
```
Zpráva jen připomíná termín a nic nechce: žádný odkaz, platbu ani údaje. Právě to rozhoduje, samotné uložené číslo nestačí, protože číslo odesílatele se dá podvrhnout. Kdyby vás ordinace přes zprávu žádala o platbu nebo o údaje, raději jí zavolejte na číslo, které znáte.
```

Zdroje: žádné tvrzení za firmu ani úřad (`sources: []`). Kontrola 25. 9. 2026: shrnutí popisuje jen samotnou zprávu a dává obecnou radu, nic za ordinaci ani pojišťovnu netvrdí.

Kontrola nápovědy: nápověda k žádné části nevede (uložený kontakt, žádný odkaz, spěch, kód ani peníze).

Poznámky: bez data, jen „v pátek“ (rozhodnutí g, zpráva nezestárne). Jméno MUDr. Veselá je smyšlené; skutečné zubařky toho jména v ČR nejspíš existují, ale žádnou konkrétní scénář nemyslí.

---

## zpravy-08: Obec hlásí odstávku vody (SMS, legitimní)

```
Odesílatel: Obec Javorná Lhota (není v kontaktech, textové jméno odesílatele)
Datum: Dnes 7:15

[bublina 0]
Obec Javorná Lhota informuje: v pátek od 8 do 14 hodin nepoteče voda kvůli opravě vodovodu v ulici Polní. Cisterna s pitnou vodou bude stát u obecního úřadu.
```

Hrozby: žádné.

Shrnutí:
```
Zpráva jen informuje a nic nechce: žádný odkaz, peníze ani údaje. To, že odesílatel není ve vašich kontaktech, samo o sobě nevadí. Když si nejste jistí, podívejte se na stránky obce nebo zavolejte na obecní úřad.
```

Zdroje: žádné tvrzení za firmu ani úřad (`sources: []`). Scénář netvrdí nic o tom, jak obce zprávy posílají. Kontrola 25. 9. 2026: shrnutí je jen obecná rada.

Kontrola nápovědy: odesílatel je textové jméno, ne číslo. Zúžený bod 1 nápovědy („číslo, které se vydává za někoho blízkého“, ve hře od milníku 5) se na něj nevztahuje.

Poznámky:
- Bez data, jen „v pátek“ (rozhodnutí g).
- **Vymyšlený název „Javorná Lhota“ (rozhodnutí d).** Ověřeno 24. 9. 2026:
  - číselník obcí ČSÚ (CISOB, kód 43, 6 257 obcí): 0 shod,
  - číselník základních sídelních jednotek ČSÚ (kód 47, 23 604 položek, nejmenší pojmenované části obcí): 0 shod,
  - číselník městských částí ČSÚ (kód 44): 0 shod,
  - vyhledávání na webu `"Javorná Lhota"`: žádné místo toho jména, jen podobná (Velká Lhota, Javorná).
  Stahováno z https://apl2.czso.cz/iSMS/do_cis_export (parametr `kodcis`). Samostatný číselník „částí obcí“ jsem nestahoval. ZSJ jsou menší jednotky a jejich názvy části obcí obvykle obsahují, jistota to ale není.
- Obec v adrese Jany Novákové hra nikde neuvádí. Ve hře je jen „odběrné místo Lipová 12“ (`email-03`) a výdejní místo „Lipová 3“ (`email-07`), obojí je ulice bez názvu obce. S „Javornou Lhotou“ to nekoliduje, ulice Lipová v ní klidně může být. `email-03` se nemění.
- Lekce: zpráva od neznámého odesílatele může být v pořádku, rozhoduje, co chce.

---

## Rozhodnutí z 24. 9. 2026 (Tomáš)

- a. 158 ano, zdroj policie přes ČTK, doslovná věta ve vysvětlení. **Zapracováno.**
- b. Číslo kupujícího: 777 nepoužívat, najít nepřidělený blok. **Schváleno +420 772 145 208 (druhé kolo), zabudováno v zpravy-06.**
- c. zpravy-04: starší bubliny, odesílatel bez −1, obecná rada, žádost o peníze jako nový námět Z13. **Štítky s datem a neklikací odesílatel postavené, zpravy-04 zabudovaná a nasazená (třetí kolo).**
- d. Vymyšlená obec. **Schválena „Javorná Lhota“ (druhé kolo), zabudováno v zpravy-08.**
- e. Zkrácené znění podle Air Bank. **Zapracováno.**
- f. Kategorie `zadost-o-udaje` u odkazu zpravy-04. **Zapracováno.**
- g. Bez dat. **Zapracováno.**

Druhé kolo odpovědí (24. 9. 2026): číslo +420 772 145 208 schváleno, „Javorná Lhota“ schválena, štítky s datem a neklikací odesílatel postavené.

Třetí kolo (25. 9. 2026): texty zpravy-04 a zpravy-05 schválené s úpravami, **zabudované a nasazené** (commit `ce6fda8`). Platné znění je od té chvíle v `src/content/zpravy/`.

Čtvrté kolo (25. 9. 2026): texty zpravy-06 až zpravy-08 schválené s úpravami. U zpravy-06 je nové vysvětlení u `messages.1` („Kupující stroj neviděl, nesmlouvá a hned chce platit předem přes kurýra. Tím chystá půdu pro odkaz, který přijde vzápětí.“), u zpravy-07 nové shrnutí (rozhoduje, co zpráva chce, samotné uložené číslo nestačí), zpravy-08 zůstala beze změny. **Zabudováno:** zpravy-06 a 07 nahradily testovací zprávy, přibyla zpravy-08. Platné znění je od té chvíle v `src/content/zpravy/`.

## Otevřené otázky

Žádné.

Vyřešeno 24. 9. 2026: štítky ve Zprávách začínají velkým písmenem („Dnes“, „Včera“, „Út“), i ve `zpravy-01` až `zpravy-03`. E-mail zůstává s malým písmenem.

---

# Legitimní Zprávy pro nový cíl milníku 6 (návrh 25. 9. 2026, k Tomášově kontrole)

Cíl: 3 nové legitimní Zprávy, pak 11 Zpráv (5 podvodů, 6 legitimních). Každá vyvrací jedno falešné pravidlo. Pravidla, která už vyvracejí dnešní legitimní Zprávy, se neopakují:
- `zpravy-03` (syn Petr): odkaz v SMS,
- `zpravy-07` (zubařka): uložené číslo samo nestačí, rozhoduje, co zpráva chce,
- `zpravy-08` (obec): odesílatel, který není v kontaktech.

| Návrh | Falešné pravidlo, které vyvrací | Námět |
|---|---|---|
| zpravy-09 | „Když SMS píše o balíku, je to podvod.“ | L3 (kurýr oznamuje čas doručení, bez platby) |
| zpravy-10 | „Když mě známý přes zprávu o něco prosí, je to podvod.“ | nový, protiváha k `zpravy-02` a `zpravy-04` |
| zpravy-11 | „Když zpráva nemá háčky a čárky nebo má chyby, je to podvod.“ | nový, navazuje na `email-08` (Honza) |

**Proč ne L1 (SMS kód od banky):** Peníze.cz a Měšec.cz v titulcích článků (25. 9. 2026) píšou, že banky s potvrzovacími SMS končí a přecházejí na aplikace. Scénář by brzy nebyl věrohodný. Obsah článků jsem doslova neověřoval, tahle poznámka je jen důvod, proč námět nepoužít. „Zpráva od banky“ zatím chybí i v e-mailu, viz `docs/navrhy-scenaru-email.md`.

Všechna tři shrnutí jsou obecná rada, nic netvrdí za firmu ani úřad (`sources: []`). E-shop „Kniha pro radost“ je smyšlený a už ve hře (`email-07`, ARES 0 výsledků, doména volná, ověřeno 24. 9. 2026). Věra a Honza jsou smyšlená jména. Honza je vnuk z `email-08`.

## zpravy-09: E-shop hlásí čas doručení kurýrem (SMS, legitimní)

Vyvrací: „Když SMS píše o balíku, je to podvod.“ Rozhoduje, že zpráva nechce platbu, údaje ani kliknutí.

```
Odesílatel: Kniha pro radost (není v kontaktech, textové jméno odesílatele)
Datum: Dnes 9:30

[bublina 0]
Kniha pro radost: Vaši objednávku č. 58213 dnes doručí kurýr mezi 13. a 15. hodinou. Zásilka je zaplacená, kurýrovi nic neplatíte.
```

Hrozby: žádné.

Shrnutí:
```
Zpráva je o balíku, a přesto je v pořádku: nechce žádnou platbu ani údaje a nemá odkaz. Jen oznamuje, kdy přijede kurýr s věcí, kterou jste si objednali. Kdyby zpráva chtěla doplatit poplatek nebo kliknout na odkaz, ověřte si zásilku sami přímo u e-shopu.
```

Kontrola nápovědy:
- bod 1: textové jméno, ne číslo, které se vydává za blízkého, nevede,
- bod 2: „nic neplatíte“ není žádost o peníze,
- body 3 až 6: nevedou (žádný spěch, odkaz, kód ani aplikace).

## zpravy-10: Kamarádka prosí o zalití kytek (chat, legitimní)

Vyvrací: „Když mě známý přes zprávu o něco prosí, je to podvod.“ Prosba sama o sobě podvod není, rozhoduje, o co prosí. Protiváha k `zpravy-02` („Ahoj mami“, peníze) a `zpravy-04` (Jarka, kód).

```
Odesílatel: Věra (uložený kontakt)
Datum: Dnes 17:20

[bublina 0]
Ahoj Jani, prosím tě, mohla bys mi od pátku do neděle zalévat kytky? Jedu za dcerou do Brna.
[bublina 1]
Klíč ti nechám ve schránce jako minule. Až se vrátím, přinesu ti buchty.
```

Hrozby: žádné.

Shrnutí:
```
I známý vás může o něco poprosit, prosba sama o sobě podvod není. Rozhoduje, o co prosí: Věra nechce peníze, kód ani kliknutí na odkaz, jen pomoc se zaléváním, a píše, jak je u ní obvyklé. Kdyby vás známý přes zprávu nečekaně žádal o peníze nebo o kód, raději mu zavolejte.
```

Kontrola nápovědy:
- bod 1: uložený kontakt, nevede,
- bod 2: žádost o peníze tu není,
- bod 3: žádný spěch ani „nikomu to neříkej“,
- body 4 až 6: nevedou.

Poznámka: „jako minule“ a „přinesu ti buchty“ jsou tu záměrně. Ukazují známý, obvyklý tón (stejná myšlenka jako starší bubliny u `zpravy-04`).

## zpravy-11: Vnuk píše bez háčků a čárek (chat, legitimní)

Vyvrací: „Když zpráva nemá háčky a čárky nebo má chyby, je to podvod.“ Chyby v jazyce samy o sobě nic neznamenají (v sekci 7 nejsou u podvodů nikdy jedinou stopou).

```
Odesílatel: Honza (uložený kontakt)
Datum: Dnes 18:45

[bublina 0]
ahoj babi, diky moc za ten darek k narozkam, uz jsem ho vyzkousel a je super
[bublina 1]
v nedeli prijedem s mamkou, udelas ty tvoje livance? :)
```

Hrozby: žádné.

Shrnutí:
```
Zpráva je bez háčků a čárek, a přesto je v pořádku. Takhle na mobilu píše spousta lidí, chyby samy o sobě nic neznamenají. Rozhoduje, že Honza píše z čísla, které máte uložené, na nic nespěchá a nic nechce: žádné peníze, kód ani odkaz.
```

Kontrola nápovědy: nápověda Zpráv o jazyku nic neříká (jen poznámka, že i zpráva v bezchybné češtině může být podvod), k chybám tedy nevede. Bod 1: uložený kontakt. Body 2 až 6 nevedou.

Poznámky:
- Text bublin je záměrně bez diakritiky a hovorový. Kontrola textů v `src/engine/validate.js` pravopis nehlídá, nic se nerozbije.
- Emotikon „:)“ je obyčejný text, žádný obrázek.

## Otevřené otázky k legitimním Zprávám

Žádné vlastní. Společné otázky (banka, bod 3 nápovědy, počet legitimních zpráv v kole) jsou ve STAV PRO CHAT.
