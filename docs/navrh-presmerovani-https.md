# Přesměrování http → https (návrh, nenasazeno)

Připraveno 28. 9. 2026. Nasazuje se až po Tomášově OK (sekce 4 a 16 v CLAUDE.md).

## Pravidlo

Soubor `.htaccess` v kořeni webu (u nás složka `/` FTP účtu subdomény). Aby ho nasadil `scripts/deploy.mjs`, patřil by do `public/.htaccess` (Vite ho zkopíruje do `dist/`).

Nejdřív dočasné přesměrování (302), aby si ho prohlížeče natrvalo nezapamatovaly, kdyby něco nefungovalo:

```apache
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=302]
```

Když bude týden bez problémů, změnit `R=302` na `R=301` (trvalé).

## Co je potřeba ověřit (neověřeno)

- Jestli hosting Subreg (tarif Start) čte soubory `.htaccess` a má zapnutý `mod_rewrite`. Výsledek hledání je v sekci „Zjištění“ níže.
- Jestli hosting nastavuje proměnnou `HTTPS`. Když je před webem zařízení, které šifrování ukončuje za nás, `%{HTTPS}` může být vždy „off“ a pravidlo by přesměrovávalo pořád dokola. Poznáme to hned: stránka by v prohlížeči hlásila „příliš mnoho přesměrování“. Pak se pravidlo smaže a hledá se jiné (např. podle hlavičky `X-Forwarded-Proto`), nebo nastavení v administraci Subregu.
- Nejrychlejší zkouška (5 minut): nahrát `.htaccess` jen s pravidlem výše, otevřít `http://poznej-podvod.menestarosti.cz` a zkontrolovat, že adresa skončí na `https://` a stránka se načte. Když ne, soubor hned smazat přes FileZillu.

## Dopad na nasazení

- `--dry-run` pak ukáže navíc `.htaccess` v seznamu souborů k nahrání. Je to jen nahrání souboru, podle sekce 2a tedy v pořádku.
- Soubor začíná tečkou. Na Windows a ve FileZille může být skrytý, ve FileZille je potřeba zapnout zobrazení skrytých souborů.

## Zjištění

(doplní se)
