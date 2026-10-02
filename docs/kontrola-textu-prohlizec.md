# Kontrola textů Prohlížeče proti schválenému znění (2. 10. 2026)

Jen výpis ke kontrole, nic se neopravovalo. Porovnání dělal skript (mimo repozitář) na `main` po spojení `65e5b9e`, oběma směry, slovo od slova (rozdíly jen v mezerách a zalomení řádků se nepočítají):

- **Hra → dávka:** každý text pro hráče v Prohlížeči musí být doslova v `docs/navrhy-scenaru-prohlizec.md`. Prověřeno 57 textů sekce (`BROWSER_APP` včetně úvodu, nápověda `HINTS.prohlizec`, texty kola, vyhodnocení, konce kola a oken nesouladu, kterými se Prohlížeč liší od E-mailu, štítek kategorie `adresa-stranky`, popis dlaždice v `src/sections.js`) a u všech 8 scénářů název, karta „Jak jste se sem dostali“, adresa, všechny části stránky a okna, názvy a vysvětlení hrozeb, shrnutí a `refutes`. U scénářů se hledá jen v části dávky daného scénáře.
- **Dávka → hra:** každý řádek `[část] text` a každý řádek „Jak jste se sem dostali: …“ v dávce musí přesně odpovídat hře.
- **Kontrola skriptu:** po změně dvou slov v kopii dávky (jen v paměti: „49 Kč“ na „59 Kč“, „Další stránka“ na „Další strana“) skript nahlásil obě změny, a to oběma směry.

## Výsledek: 1 rozdíl

### prohlizec-04, reklamní pruh (`banner`)

Ve hře:
> Vaše připojení není zabezpečené!

Schválené znění v dávce:
> ⚠ Vaše připojení není zabezpečené!

Poznámka: znak „⚠“ v dávce zapisuje ikonu. Hra u tohoto pruhu (styl `warning`) kreslí ikonu žlutého trojúhelníku vedle textu (vidět na `docs/plany/snimky/prohlizec-04-vyhodnoceni.png`). Znění textu se tedy neliší, jen způsob zápisu ikony. Nic se neopravovalo.

Jiné rozdíly skript nenašel: všechny ostatní texty Prohlížeče ve hře se schváleným zněním shodují doslova, včetně nového úvodu a „Lipové banky“ v `prohlizec-03`.
