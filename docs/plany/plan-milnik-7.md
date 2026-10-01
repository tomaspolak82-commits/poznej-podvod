# Plán milníku 7: testy a kontrola (návrh 25. 9. 2026)

Diagram: `docs/plany/plan-milnik-7.html`. Pořadí podle Tomášových priorit. Nic z toho se nestaví bez jeho OK.

## 1. Tvoje ruční kontrola na telefonu (priorita 1)

- Kontrolní seznam: `docs/kontrola-na-telefonu.md`, 18 kroků, asi 15 minut.
- Ty: projdeš ho na telefonu s největším systémovým písmem a pošleš čísla kroků s nálezy a snímky.
- Já: nálezy seřadím (chyba / drobnost), opravy navrhnu v jedné dávce. Když oprava mění vzhled nebo texty, počkám na OK. Technické opravy udělám rovnou (sekce 2a).

## 2. Zpětná vazba od seniorů (priorita 2)

Testeři dostali odkaz 25. 9. 2026.

**Jak zapíšeme:** jeden soubor, jeden řádek na jeden postřeh:

| Datum | Tester | Zařízení | Kde ve hře | Co se stalo (jeho slovy) | Druh |
|---|---|---|---|---|---|
| 26. 9. | T1 | Android, velké písmo | e-mail 04, vyhodnocení | „nevěděla jsem, kam klepnout“ | ovládání |

- **Tester** jen jako T1, T2… Žádná jména, telefonní čísla ani e-maily (repozitář je veřejný).
- **Druh:** ovládání / čitelnost / srozumitelnost textu / obtížnost / chyba / chvála / nápad.
- Postřehy mi posíláš ty, jak přijdou (i hromadně). Zapisuju je já a nic nevynechávám ani nepřepisuju.

**Jak vyhodnotíme:**
- Opravovat, co se **opakuje aspoň u 2 testerů**.
- Hned, i když to řekne jen jeden: chyba, kvůli které nejde hrát; věcná chyba v obsahu (nepravdivé tvrzení); problém s přístupností (nejde přečíst, nejde trefit).
- Ostatní („nápad“, jednotlivé přání) jen zapsat a nechat na později.
- Jednou za čas (návrh: po každých ~5 postřezích, nebo když mi napíšeš) pošlu souhrn: co se opakuje, co navrhuji opravit, co nechat.

## 3. Úkoly „před zveřejněním odkazu“ (priorita 3), seřazené

| # | Úkol | Co udělám já | Co uděláš ty |
|---|---|---|---|
| 1 | **Logo nad názvem** na počítači během kola (sekce 5) | zjistím, odkdy to tak je a proč, navrhnu opravu se snímkem před a po | schválíš vzhled |
| 2 | **Tenký Montserrat** ve WebKitu | nic, dokud nemám tvůj výsledek; pak případně navrhnu opravu písma | krok 17 kontrolního seznamu (Safari na iPhonu nebo iPadu) |
| 3 | **Zdroje Finanční správy** (`email-02`) | připravím obě citace s odkazy na jedno místo | přečteš si oba zdroje sám |
| 4 | **Ostatní zdroje dnes znovu neověřené**: Česká pošta (`email-01`), Ministerstvo dopravy (`zpravy-01`), policie (`zpravy-02`) | stáhnu stránky a citace ověřím doslova, výsledek pošlu | nic, jen OK, když by bylo potřeba text změnit |
| 5 | **Přesměrování http → https** | zjistím z dokumentace Subregu, jestli jde nastavit v administraci, nebo souborem na serveru; bez ověření nic nenahraju | nastavení v administraci Subregu, případně dotaz na podporu |
| 6 | **Znovu ověřit blok 772 1xx xxx** (`zpravy-06`) a smyšlené domény | těsně před zveřejněním: data ČTÚ a registr domén, výsledek pošlu | nic |
| 7 | **Odstranit `noindex`** a zveřejnit (milník 9, do 1. 10. 2026 číslo 8) | po tvém pokynu | pokyn ke zveřejnění |
| – | Obnova certifikátu (kolem 10. 12. 2026) | připomenu | zkontroluješ datum platnosti |

Pořadí: nejdřív věci, které potřebují tvůj čas nebo odpověď Subregu (běží souběžně), poslední je kontrola čísla a domén, aby byla co nejčerstvější.

## 4. Audit testů podle sekce 12 (priorita 4, až nakonec)

- Výstup: dokument `docs/audit-testu.md`.
  - Tabulka „bod sekce 12 → který test ho pokrývá“.
  - Co chybí.
  - Zdvojené nebo zbytečné testy (např. stejné ověření na 5 zařízeních tam, kde na zařízení nezáleží).
  - Doba běhu celé sady (dnes asi 9–11 minut).
- Opravy testů až po tvém OK.

## Konec milníku

Celá sada, push, nasazení podle 2a, zápis do sekce 16 a `docs/historie.md`, `npm run prehled`, pokud se měnil obsah.
