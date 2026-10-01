# Plán sekce Prohlížeč (návrh 1. 10. 2026)

Diagram: `docs/plany/plan-prohlizec.html`. Jen plán, nic se nestaví ani nenasazuje bez Tomášova OK. Sekce zůstává na hlavní stránce jako „Připravujeme“ (`active: false` v `src/sections.js`), dokud není celá hotová.

Všechny texty v tomto plánu jsou **pracovní popisy**, ne znění pro hráče. Znění přijde později v jedné dávce (`docs/navrhy-scenaru-prohlizec.md`).

## 1. Rozhraní simulovaného prohlížeče

**Co zůstává stejné jako u E-mailu a Zpráv** (nic nového se nevymýšlí): dvě úrovně, losování 5 zpráv s 2–3 legitimními, bodování (sekce 8), rozhodnutí „Je to podvod“ / „Je to v pořádku“, okno nesouladu v pokročilé úrovni, vyhodnocení se žárovkami a stavy částí, nápověda „Na co si dát pozor?“, historie, štítek TRÉNINK, rám telefonu `phoneFrame` (na počítači a tabletu) a celá obrazovka na mobilu. Engine, bodování a historie se nemění. Přibude jen `src/apps/prohlizec.js` se třemi režimy `play` / `mark` / `review` a sekce v `listTargets` a kontrole obsahu.

**Jak prohlížeč vypadá** (neutrální mobilní prohlížeč, žádné logo ani barvy Chrome, Safari či Samsung):

- **Adresní řádek nahoře:** ikonka (zámek nebo „Nezabezpečeno“) a adresa. Jako v mobilu jen adresa za `https://` bez dalšího textu, celá a zalomitelná (dlouhé adresy typu `banka.cz.overeni-online.com` musí být vidět celé, aby šly přečíst).
- **Obsah stránky:** nadpis, odstavce, banner (reklama), formulářová pole, tlačítko.
- **Vyskakovací okno** (volitelně): okno, které nakreslila stránka (falešné „systémové“ varování, výhra, souhlas s cookies). Když scénář okno má, stránka pod ním je ztmavená a **nejde označit**; okno je obsah. Tím odpadá problém, jak na malém displeji označovat stránku schovanou pod oknem. Odpovídá to realitě: falešná technická podpora bývá jen to okno.
- **Dekorace** (počet karet, menu ⋮, spodní lišta) jsou `aria-hidden` a nic nedělají, stejně jako pole „Zpráva“ v chatu.
- **Karta „Jak jste se sem dostali“** nad prohlížečem (nová, viz otázka 2): jedna věta, např. „Klepli jste na odkaz v SMS o zásilce“ nebo „Adresu jste napsali sami“. U prohlížeče je to hlavní kontext: e-mail má odesílatele, stránka ne. Kartu nejde označit, je to popis situace. Aby karta neprozradila odpověď, musí se střídat: legitimní stránka i přes odkaz z čekaného e-mailu, podvod i přes vyhledávání nebo reklamu.

**Co jde označit** (nejmenší část = jeden blok, stejně jako bublina): `address`, `heading`, `body.N`, `banner`, `fields.N` (každé pole formuláře zvlášť, třeba „Číslo karty“), `button`, a u okna `popup.title`, `popup.body.N`, `popup.button`. Ikonka zámku není samostatná část, patří k adrese.

**Chování v základní úrovni:** tlačítka, banner a tlačítka okna (i křížek) ukážou stávající `LINK_NOTICE`. **Formulářová pole nejsou skutečná pole**, nedá se do nich psát (hráč nesmí mít chuť zkusit vlastní číslo karty, ani když se nic neodesílá). Klepnutí ukáže vlastní upozornění „sem nic nepište“, stejné u podvodu i legitimní stránky (nový text, půjde do dávky).

**Zásada pro vysvětlení u prohlížeče:** adresa v řádku je jediné, co stránka nezfalšuje, ale může být podobná skutečné. Důvodem důvěry u legitimní stránky proto není „adresa vypadá správně“ ani „je tam zámek“, ale to, co stránka chce, a že jste na ni přišli sami (napsali adresu, záložka). Zámek znamená jen šifrované spojení a mají ho i podvodné stránky. To je falešné pravidlo, které vyvracejí podvody (ne legitimní stránky, pole `refutes` mají jen ty).

**Nová kategorie hrozby** `adresa-stranky` (otázka 4). Stávající `odesilatel` má štítek „adresa odesílatele“, u stránky by byl nepravdivý.

## 2. Typy scénářů

| # | Podvod | Co chce, jaký tlak | Legitimní protějšek | Falešné pravidlo, které vyvrací |
|---|---|---|---|---|
| 1 | **Banner „Vyhráli jste“**: jste vybraný návštěvník, vyplňte údaje a zaplaťte poštovné, odpočet | údaje + malá platba; výhra, spěch | zpravodajská stránka s běžnou reklamou na slevu v obchodě | „Když je na stránce reklama nebo sleva, je to podvod.“ |
| 2 | **Falešná technická podpora**: okno „telefon je napadený, nevypínejte ho, volejte podporu“ s číslem | zavolat; strach, spěch | stránka se souhlasem s cookies (okno, které chce jen volbu) | „Když na stránce vyskočí okno, je to podvod.“ |
| 3 | **Falešná přihlašovací stránka** (přes odkaz ze SMS): přihlášení do bankovnictví na cizí adrese, pak PIN a celé číslo karty | údaje; strach o účet | přihlášení na stránku obchodu nebo dopravce, kterou jste si sami otevřeli | „Když stránka chce heslo, je to podvod.“ |
| 4 | **Falešné varování o nezabezpečeném připojení**: stránka napodobí varování a chce instalaci aplikace „pro ochranu“ | nainstalovat aplikaci; strach | **doporučuji:** pokladna e-shopu, který jste si sami vybrali, platba kartou | „Když stránka chce číslo karty, je to podvod.“ |
| – | (alternativa k 4) | | stránka obce s otevírací dobou, u adresy „Nezabezpečeno“, nic nechce | „Když prohlížeč píše Nezabezpečeno, je to podvod.“ |
| později | **Falešný e-shop** (velká sleva, jen platba předem převodem) | zaplatit; výhodná nabídka | – | – |

Poznámky:
- **Proč u 4 nedoporučuji „Nezabezpečeno“:** skutečné varování prohlížeče není podvod ani „v pořádku“, správná reakce je odejít. Do volby podvod / v pořádku nezapadá. Stránka bez zámku navíc dnes bývá vzácná a prohlížeče u ní stále častěji ukazují celostránkové varování (podrobnosti a data u jednotlivých prohlížečů jsem neověřoval). Hrozí, že by scénář neodpovídal tomu, co senior uvidí.
- **Falešná přihlašovací stránka bez jména banky:** stránka napíše „Internetové bankovnictví“, žádná skutečná banka se nejmenuje. Poučení je v adrese a v tom, jak se tam hráč dostal. Proto tu není potřeba zdroj za konkrétní banku.
- **Falešná technická podpora je v obrázcích podvodníků hlavně na počítači.** Rám je ale telefon (stejný jako ostatní sekce, senioři hrají hlavně na mobilu), proto varianta „telefon je napadený“. Pokud ke zdrojům najdu jen počítačovou podobu, scénář navrhnu jinak, nebo ho vyřadím, nebudu podobu domýšlet.
- **Falešný e-shop** odkládám na doplnění banky: falešné přihlášení vede k vybrání účtu, falešný e-shop „jen“ ke ztrátě zaplacené částky. V první verzi má přednost větší škoda.
- **Každý podvod má nevinnou část** (např. obyčejný nadpis stránky), u přihlašovací stránky třeba pole „Přihlašovací jméno“, které samo o sobě v pořádku je. Ověřím u každého scénáře proti nápovědě (sekce 7).

**Nápověda „Na co si dát pozor?“ pro Prohlížeč** (6 bodů, jen témata, znění v dávce): jak jste se na stránku dostali; adresa v řádku nahoře, ne to, co píše stránka; zámek nic nezaručuje; výhra nebo odměna za nic; okno, které straší a chce zavolat nebo instalovat (stačí zavřít kartu); stránka chce víc údajů, než potřebuje (PIN, kód z SMS, celé číslo karty mimo placení). Rada na konec: adresu napište sami. Pozor na bod o adrese: musí znít „adresa, která nesedí“, ne „adresa“, jinak by nápověda vedla k označení adresy i u legitimní stránky.

## 3. Banka pro první verzi

**Doporučuji 8 scénářů: 4 podvody a 4 legitimní** (řádky 1–4 tabulky).

- Splní losování: minimum je 3 podvody a 2 legitimní (`DRAW_MINIMUM`), kolo potřebuje 2–3 legitimní a aspoň 2 podvody, 4 + 4 obojí pokryje.
- Každý typ podvodu má svůj protějšek, takže kolo nikdy nevypadá jako „všechny stránky s oknem jsou podvod“.
- Scénář prohlížeče je pracnější než e-mail (rozvržení stránky, okno, formulář), menší banka zkrátí cestu ke zveřejnění.
- **Nevýhoda:** při 8 scénářích má další kolo jen 3 nové a 2 se zopakují (pravidlo „neopakovat, pokud to banka dovolí“). Úplné neopakování by chtělo 10. Při 6 (3 + 3) by se opakovaly 4 z 5, to nedoporučuji.
- Doplnění později: falešný e-shop a jeho protějšek, pak k cíli 10–12.

## 4. Vysvětlení, nápověda a zdroje

- Vysvětlení a nápověda jsou obecné rady vlastními slovy („Okno na stránce nepozná, jestli máte v telefonu virus. Stačí kartu zavřít.“), bez „policie varuje“ a „banka nikdy“.
- Instituce se jmenuje jen tam, kde bez ní scénář nedává smysl. V návrhu výše takové místo **není**: banka zůstává bezejmenná, obchod a dopravce smyšlené.
- Pole `sources` ale potřebuje každý podvod kvůli pravidlu „jen reálné situace z ČR“ (že se ten typ u nás děje). Návrh, kde hledat (**zatím neověřeno**, adresy konkrétních stránek nevymýšlím):
  - výhra a falešné přihlášení: policie.gov.cz (sekce kyberkriminalita), nukib.gov.cz, weby bank, Česká bankovní asociace (cbaonline.cz);
  - falešná technická podpora: policie.gov.cz, nukib.gov.cz;
  - falešné varování s instalací aplikace: zatím zdroj neznám. Když se pro ČR nenajde, typ nahradím falešným e-shopem (zdroj: seznam rizikových e-shopů České obchodní inspekce, coi.cz).

## 5. Rizika (povinné kontroly)

- **Telefonní číslo** (falešná technická podpora): z bloku, který ČTÚ nepřidělil, stejnou metodou jako u `zpravy-06` (CSV „Přidělená čísla a kódy“, výpočet překryvu, kontrola metody na známém přiděleném rozsahu). Když bude číslo vypadat jako bezplatná linka 800, ověřím i tento rozsah. Číslo přidám do kroku 17 A2 (znovu ověřit v den zveřejnění).
- **Adresy stránek:** všechny smyšlené, **i u legitimních scénářů** (legitimní stránka se skutečnou adresou by hráče posílala na cizí web). Ověření: registr vrací 404, DNS neexistuje. Žádná adresa nesmí obsahovat značku skutečné banky nebo obchodu. Přidám je do kroku 17 A3. Tomáše u každé nové adresy upozorním, ať ověří, že nepatří reálnému webu.
- **Obsah stránek jde do repozitáře a na server ve stejném souboru JS jako hra** (`import.meta.glob` v `src/engine/content.js` přibalí každý JSON ze `src/content/`, i když je sekce vypnutá). Proto scénáře vzniknou až po schválení textů. Viz otázka 5.
- **Společné texty mluví o „zprávě“** („Zpráva 2 z 5“, „Další zpráva“, „Zpět ke zprávě“, popis úrovní „Přečtete si zprávu“). U stránky to nesedí. Návrh: slovo podle sekce („Stránka 2 z 5“). Změna textů půjde do dávky.
- **Kategorie a statistika:** nová kategorie `adresa-stranky` přidá štítek do „Nejčastěji vám unikalo“ (text do dávky).
- **Tvrzení o prohlížečích** (co ukazují bez zámku, jak vypadá adresa) ve vysvětleních jen obecně. Konkrétní chování jednotlivých prohlížečů ověřené nemám.

## 6. Odhad kroků a schvalování

14 fází (diagram), z toho 6 zastávek u Tomáše:

1. **Rozhodnutí k tomuto plánu** (otázky níže).
2. **Vzhled:** náčrt simulovaného prohlížeče jako samostatná stránka v `docs/plany/` (otevře se dvojklikem), před stavbou.
3. **Texty v jedné dávce:** 8 scénářů, karta „Jak jste se sem dostali“ u každého, nápověda, upozornění u formulářového pole, popis dlaždice a úrovní, slovo „stránka“ ve společných textech, štítek kategorie. Spolu s tím seznam adres a čísla k ověření.
4. **Snímky všech 8 scénářů** ve hře (sekce není na webu, kontrola ve hře proto přes snímky).
5. **OK ke zpřístupnění** (dlaždice přestane být „Připravujeme“).
6. **Kontrola na telefonu** po nasazení.

Hrubý odhad práce: 6–9 sezení (bez čekání na schválení).

## Rozhodnutí 1. 10. 2026 (Tomáš)

1. Banka 8 scénářů (4 podvody + 4 legitimní), falešný e-shop až při doplnění. Falešné přihlášení jen u smyšlené služby, žádná skutečná banka ani firma.
2. Karta „Jak jste se sem dostali“ ano, nejde označit. Nesmí sama prozradit výsledek: aspoň jeden podvod má nevinný příchod (např. vyhledávání) a aspoň jedna legitimní stránka má příchod přes odkaz.
3. Legitimní protějšek k falešnému varování je pokladna e-shopu. Má učit, že zámek neznamená bezpečí (zámek mají i podvodné stránky). Jak to sladit s polem `refutes`, viz otevřené otázky.
4. Nová kategorie „adresa stránky“. V Prohlížeči „Stránka 2 z 5“, E-mail a Zprávy dál „Zpráva 2 z 5“, hlídá to nový test.
5. Práce ve větvi `sekce-prohlizec`. Z ní se nikdy nenasazuje, automatické nasazení po push platí jen pro `main`. Push větve na GitHub kvůli záloze je povolený.

**Harmonogram:** zkouška se seniory za 5–6 dní. Sekce musí být spojená do `main` a nasazená nejpozději 2 dny před zkouškou. Den před zkouškou ji Tomáš projde na telefonu a rozhodne. V den zkoušky se nic nenasazuje.

**Sekce je hotová, když:** všechny texty pro hráče jsou schválené; telefonní čísla jsou ověřená v datech ČTÚ jako nepřidělená; domény jsou ověřené jako volné; prošla celá sada testů včetně nových testů Prohlížeče a ověření, že E-mail a Zprávy se nezměnily.

**Pojistka:** když sekce není hotová 2 dny před zkouškou, nespojuje se. Na webu zůstane „Připravujeme“ a senioři zkoušejí jen E-mail a Zprávy. Postup při chybě po spojení a nasazení: pokyn došel neúplný, čeká na doplnění.

**Doplnění 1. 10. 2026 (Tomáš):** pokladna e-shopu vyvrací „Když stránka chce číslo karty, je to podvod.“, její vysvětlení i vysvětlení zabezpečených podvodů říkají, že zabezpečení samo nerozhoduje. Hlavní myšlenka sekce: nezabezpečená stránka = nic nezadávat (ne „je to podvod“). Vzhled varování podle úrovní, vrácení spojení a termíny: CLAUDE.md, sekce 16 a 17 E. Texty: `docs/navrhy-scenaru-prohlizec.md`, náčrt: `docs/plany/nacrt-prohlizec.html`.

## Otázky k rozhodnutí (vyřešené 1. 10. 2026, viz výše)

1. **Banka 8 (4 + 4)** s typy 1–4 z tabulky, falešný e-shop až při doplnění? Doporučuji ano.
2. **Karta „Jak jste se sem dostali“** nad prohlížečem (nejde označit)? Doporučuji ano: bez ní chybí kontext, podle kterého má hráč rozhodovat.
3. **Legitimní protějšek k typu 4:** pokladna e-shopu s platbou kartou, nebo stránka obce s „Nezabezpečeno“? Doporučuji e-shop.
4. **Nová kategorie `adresa-stranky` a slovo podle sekce ve společných textech** („Stránka 2 z 5“)? Doporučuji ano, znění přijde v dávce.
5. **Práce ve zvláštní větvi Gitu `sekce-prohlizec`**, do `main` se spojí až při zpřístupnění? Doporučuji ano: `main` se dál nasazuje podle sekce 2a a na server nic z prohlížeče nedojde, dokud není hotové. Bez větve by na server šel nepoužitý kód a schválené, ale skryté scénáře, a testy vypnuté sekce by potřebovaly zvláštní obchvat.
