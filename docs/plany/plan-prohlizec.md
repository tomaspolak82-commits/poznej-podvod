# Milník 8: sekce Prohlížeč (plán 1. 10. 2026, aktualizováno týž den)

Diagram: `docs/plany/plan-prohlizec.html` (15 fází). Texty pro hráče (schválené): `docs/navrhy-scenaru-prohlizec.md`. Náčrt vzhledu: `docs/plany/nacrt-prohlizec.html`. Vydání (odstranění `noindex`) je milník 9.

Stav: nasazeno 1. 10. 2026 (spojení `4b25c70`). Zbývá fáze 14 (úprava úvodu a scénáře `prohlizec-03` ve větvi `uprava-prohlizec`) a fáze 15, Tomášova kontrola na telefonu na živém webu.

## 1. Rozhraní simulovaného prohlížeče

**Stejné jako u E-mailu a Zpráv:** dvě úrovně, losování 5 stránek s 2–3 legitimními, bodování (sekce 8 CLAUDE.md), rozhodnutí „Je to podvod“ / „Je to v pořádku“, okno nesouladu v pokročilé úrovni, vyhodnocení se žárovkami a stavy částí, nápověda „Na co si dát pozor?“, historie, štítek TRÉNINK, rám telefonu (na počítači a tabletu) a celá obrazovka na mobilu. Engine, bodování a historie se nemění. Prohlížeč je `src/apps/browser.js` se třemi režimy `play` / `mark` / `review`.

**Jak prohlížeč vypadá** (neutrální, žádné logo ani barvy skutečných prohlížečů):

- **Karta „Jak jste se sem dostali“** nad adresním řádkem: jedna věta o příchodu na stránku. Modrošedá (`#e8eef8`, tmavomodrý proužek a nadpis), **ne žlutá**: žlutá je barva varování a světle žlutý podklad má označená část. Kontrast textu i nadpisu hlídá `tests/evaluation-colors.spec.js`. Kartu nejde označit. Aby neprozradila odpověď, mají podvody 02 a 04 nevinný příchod a legitimní 06 příchod přes odkaz.
- **Adresní řádek:** adresa, celá a zalomitelná. U nezabezpečeného připojení vlevo **jen žlutý trojúhelník s vykřičníkem**, v obou úrovních bez nápisu. Čtečka obrazovky čte „Varování: připojení není zabezpečené“, klepací plocha aspoň 48 px. Ve vyhodnocení trojúhelník s nápisem „Nezabezpečeno“ a žárovkou. U zabezpečeného připojení žádné varování. **Zámek se nepoužívá.**
- **Obsah stránky:** nadpis, odstavce, reklama nebo „varování“ nakreslené stránkou (pruh), formulářová pole, tlačítko.
- **Vyskakovací okno** (02, 06): stránka pod ním je ztmavená (šedé čáry bez textu) a nejde označit, okno je obsah. Okno nemá křížek.
- **Dekorace** (ikona karet, menu ⋮) jsou skryté pro čtečku a nic nedělají.

**Co jde označit:** `security` (trojúhelník, jen u nezabezpečeného připojení), `address`, `heading`, `body.N`, `banner`, `fields.N`, `button`, `popup.title`, `popup.body.N`, `popup.button.N`.

**Základní úroveň:** reklama ukáže upozornění na odkaz, tlačítka stránky i okna upozornění „tlačítko nic nedělá“, formulářová pole upozornění „do pole se psát nedá“. Vše stejné u podvodu i legitimní stránky. Pole nejsou skutečná, nedá se do nich psát.

**Úvod o adresním řádku:** samostatná obrazovka jen při prvním vstupu do sekce, s tlačítkem „Rozumím, vybrat úroveň“. Tlačítko uloží záznam (`poznej-podvod:browser-intro:v1`, `src/engine/intro.js`) a vede na výběr úrovně. Při dalších vstupech se jde rovnou na výběr úrovně. Když paměť prohlížeče nejde přečíst nebo zapsat, úvod se ukáže vždy. Historie se nemění. Od fáze 14 (větev `uprava-prohlizec`, texty schválené Tomášem 1. 10. 2026): nahoře obrázek malého okna prohlížeče (adresní řádek se žlutým trojúhelníkem a adresou `prihlaseni-ucet-online.cz`, pod ním stránka „Přihlášení“ s poli „Jméno“ a „Heslo“), v něm čísla 1–3 v kroužku u adresy, trojúhelníku a stránky. Obrázek je jen obrázek (`aria-hidden`), nic nejde vyplnit ani označit, obsah nese text pod ním: tři odstavce s čísly, druhý adresní řádek bez trojúhelníku s popiskem „Bez varování“ a dva odstavce na konec. Čísla jsou kroužky z CSS, ne znak „①“ (ten v hostovaných písmech není).

**Hlavní myšlenka sekce:** když připojení není zabezpečené, do stránky nic nezadávat. Pravidlo zní „nezadávejte údaje“, ne „je to podvod“. Vždy v páru: to, že prohlížeč nevaruje, neznamená, že stránka je poctivá.

**Texty podle sekce:** v Prohlížeči „Stránka 2 z 5“, „Další stránka“, „5 stránek“ a „Vyberte si úroveň. V obou uvidíte 5 stránek.“. E-mail a Zprávy beze změny (hlídají testy). Nová kategorie hrozby `adresa-stranky` („adresa stránky nebo varování u ní“).

## 2. Scénáře (8: 4 podvody, 4 legitimní)

| # | Podvod | Legitimní protějšek | Falešné pravidlo, které vyvrací |
|---|---|---|---|
| 1 | `prohlizec-01` výhra telefonu za poštovné, nezabezpečené připojení | `prohlizec-05` zpravodajská stránka s reklamou | „Když je na stránce reklama nebo sleva, je to podvod.“ |
| 2 | `prohlizec-02` „telefon je zablokovaný, volejte podporu“ (okno) | `prohlizec-06` souhlas s cookies (okno) | „Když na stránce vyskočí okno, je to podvod.“ |
| 3 | `prohlizec-03` ověření účtu ve smyšlené Lipové bance (odkaz ze SMS; karta uvádí pravou adresu lipova-banka.cz, stránka je na lipova-banka-overeni.cz) | `prohlizec-07` přihlášení do e-shopu otevřeného sami | „Když stránka chce heslo, je to podvod.“ |
| 4 | `prohlizec-04` „varování“ nakreslené stránkou a instalace aplikace | `prohlizec-08` placení kartou v e-shopu | „Když stránka chce číslo karty, je to podvod.“ |

Později doplnit: falešný e-shop, investiční reklama se „známou osobností“ (bez skutečných jmen a fotek). Legitimní stránka s nezabezpečeným připojením do první verze nepatří (důvody v `docs/navrhy-scenaru-prohlizec.md`, část D).

## 3. Vysvětlení a zdroje

Zrychlený režim: vysvětlení a nápověda jsou obecné rady vlastními slovy, bez tvrzení za úřady a firmy. Banka, obchody a stránky jsou smyšlené. Zdroj k typu podvodu se nevyžaduje (Tomáš, 1. 10. 2026).

## 4. Povinné kontroly (hotovo 1. 10. 2026)

- **Adresy stránek** (i legitimních): všech 8 volných, registr CZ.NIC vrací 404, DNS neexistuje. Znovu v den zveřejnění (sekce 17 A3 CLAUDE.md). Adresa v obrázku úvodu `prihlaseni-ucet-online.cz` také volná (1. 10. 2026, registr 404, DNS neexistuje; kontrola metody: `menestarosti.cz` vrací 200).
- **Telefonní číslo** +420 772 163 940 (`prohlizec-02`): blok 772 100 000 až 772 199 999 bez držitele podle dat ČTÚ z 1. 10. 2026. Znovu v den zveřejnění (sekce 17 A2).
- **Názvy** „Kniha pro radost“ a „Domácí pomocník“: Tomáš ověřil v ARES, že nepatří žádnému subjektu. Názvy zůstávají. „Banka Javor“ nahradila ve fázi 14 „Lipová banka“, Tomáš ji ověřil v ARES 1. 10. 2026. Adresy `lipova-banka.cz`, `lipovabanka.cz` a `lipova-banka-overeni.cz` volné (1. 10. 2026, registr 404, DNS neexistuje).

## 5. Spojení, pojistka a návrat

Postup spojení, podmínky „hotovo“, vrácení spojení (`git revert -m 1 4b25c70`) a nové spojení po opravě: sekce 17 E CLAUDE.md. Termíny se do plánu ani do CLAUDE.md nezapisují, řídí je Tomáš.

## 6. Fáze milníku 8 (Prohlížeč)

15 fází podle diagramu, z toho 6 „čeká na tebe“. Stav k 1. 10. 2026:

1. **Rozhodnutí k plánu** · čeká na tebe · hotovo.
2. **Zdroje k typům podvodů** · hotovo. Zrychlený režim zdroj nevyžaduje.
3. **Čísla a adresy** · hotovo.
4. **Náčrt prohlížeče** · hotovo.
5. **Schválení vzhledu** · čeká na tebe · hotovo, spolu s fází 7 v jedné dávce.
6. **Návrh všech textů** · hotovo.
7. **Schválení textů** · čeká na tebe · hotovo, včetně oprav a doplňků.
8. **Stavba prohlížeče** · hotovo.
9. **Scénáře do hry** · hotovo, přehled scénářů vygenerovaný.
10. **Testy** · hotovo, celá sada prošla ve větvi i na `main`.
11. **Kontrola na snímcích** · **vynechaná, nahrazena fází 15.** Neprovedla se, ověřil se jen označený trojúhelník v pokročilé úrovni (na 360 px dobře vidět).
12. **Zpřístupnění sekce** · hotovo. Spojení do `main` (`4b25c70`) a push na Tomášův pokyn.
13. **Ověření na živé stránce** · hotovo.
14. **Úprava úvodu a scénáře `prohlizec-03`** · čeká na tebe (schválení dávky a snímků). Ve větvi `uprava-prohlizec`, z ní se nenasazuje. Úvod jako malé okno prohlížeče s čísly ①②③ a řádkem „Bez varování“, nový název banky v `prohlizec-03`. Pak spojení do `main` a nasazení.
15. **Kontrola na telefonu** · čeká na tebe. Tomáš projde Prohlížeč na živém webu, nahrazuje i fázi 11.

Proti původnímu plánu: fáze 5 a 7 proběhly najednou, fáze 11 je vynechaná. Fáze 14 přibyla 1. 10. 2026 (Tomáš), kontrola na telefonu zůstává poslední.

## Rozhodnutí (Tomáš, 1. 10. 2026)

1. Banka 8 scénářů (4 + 4), falešný e-shop až při doplnění. Falešné přihlášení jen u smyšlené služby.
2. Karta „Jak jste se sem dostali“, nejde označit a nesmí prozradit výsledek.
3. Pokladna e-shopu vyvrací „Když stránka chce číslo karty, je to podvod.“. Její vysvětlení i vysvětlení podvodů bez varování říkají, že to, že prohlížeč nevaruje, samo nerozhoduje.
4. Nová kategorie `adresa-stranky`, „Stránka 2 z 5“ jen v Prohlížeči.
5. Práce ve větvi `sekce-prohlizec`, nasazuje se jen z `main`.
6. Varování u adresy jen žlutý trojúhelník v obou úrovních, zámek se nepoužívá.
7. Úvod o adresním řádku jen při prvním vstupu, jako samostatná obrazovka. Nový první bod nápovědy „Adresní řádek.“.
8. Na 360 × 740 je první tlačítko úrovně vidět bez posouvání, druhé po jednom posunutí o obrazovku. Karty úrovní se nezmenšují.
9. Číslování: Prohlížeč je milník 8, Vydání milník 9.
