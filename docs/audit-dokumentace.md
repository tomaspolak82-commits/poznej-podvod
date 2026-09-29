# Audit podle aktuální dokumentace (29. 9. 2026)

Audit jen ke čtení: v projektu se nic neopravovalo. Dokumentace byla načtená přes Context7. U každého nálezu je uvedeno, jestli je **ověřeno v dokumentaci**, nebo jde o **domněnku**.

## 1. Knihovny a verze

Všechny čtyři knihovny jsou v `devDependencies` (`package.json`), jiné závislosti projekt nemá.

| Knihovna | V package.json | Nainstalováno (`npm ls`) | Nejnovější (`npm outdated`) |
|---|---|---|---|
| `@playwright/test` | `^1.63.0` | 1.63.0 | aktuální (npm outdated ji nevypsal) |
| `basic-ftp` | `^6.2.1` | 6.2.1 | aktuální (npm outdated ji nevypsal) |
| `dotenv` | `^18.0.3` | 18.0.3 | 18.0.4 (wanted 18.0.4) |
| `vite` | `^8.3.0` | 8.3.0 | 8.3.1 (wanted 8.3.1) |

`npm outdated` skončil kódem 1, to je jeho běžné chování, když najde novější verze. Obě novější verze jsou jen opravné (poslední číslo verze) a spadají do rozsahu `^` v `package.json`.

## 2. Co Context7 má

| Knihovna | ID v Context7 | Verze použitá v auditu | Poznámka |
|---|---|---|---|
| Playwright | `/microsoft/playwright` | **v1.63.0** | Přesně nainstalovaná verze. Novější v Context7 není. |
| Vite | `/vitejs/vite` | **v8.0.10** | Context7 nemá 8.3.0 ani 8.3.1, nejnovější je 8.0.10. Rozdíly mezi 8.0.10 a 8.3.x se nedají ověřit. |
| dotenv | `/motdotla/dotenv` | větev `master`, bez čísla verze | Context7 u dotenv verze neuvádí. Není ověřené, že `master` odpovídá 18.0.3 nebo 18.0.4. |
| basic-ftp | **nenalezeno** | – | Dvě hledání („basic-ftp“, „patrickjuchli/basic-ftp“) vrátila jen jiné knihovny. Použití `basic-ftp` v `scripts/deploy.mjs` proto podle dokumentace neposuzuji. |

Co se v opravných verzích Vite 8.3.1 a dotenv 18.0.4 změnilo, Context7 neukazuje, a proto to neposuzuji.

## 3. Nálezy

Závažnost: **chyba** = něco nefunguje, jak má. **Zastaralé** = dokumentace to nedoporučuje nebo to má jako překonané. **Doporučení** = funguje to, ale dokumentace radí jiný postup.

| # | Nález | Soubor a řádek | Co říká dokumentace (knihovna, verze, zdroj z Context7) | Závažnost | Může se to projevit hráči? | Ověření |
|---|---|---|---|---|---|---|
| 1 | Test soukromí čeká na `waitForLoadState('networkidle')`. | `tests/home.spec.js:115`, `:117` | Playwright v1.63.0, `docs/src/api/params.md` (wait-for-load-state-state): `'networkidle'` je **DISCOURAGED**, „Don't use this method for testing, rely on web assertions to assess readiness instead.“ | zastaralé | Ne, týká se jen testu. | Ověřeno v dokumentaci. Že je tady `networkidle` vhodný (test hlídá síťové požadavky, ne stav stránky), je moje domněnka. |
| 2 | `locator.count()` rozhoduje, jestli na prvek klepnout. Okno pro potvrzení se tak klepne jen tehdy, když už je otevřené. | `tests/helpers/game.js:60`, `:88` | Playwright v1.63.0, zdroj `packages/playwright-core/src/client/frame.ts`: `count()` volá `queryCount` s `kNoTimeout` a vrací výsledek hned, bez čekání. `best-practices-js.md`: ruční kontroly „check immediately“, kontroly přes `expect` čekají a zkoušejí znovu. | doporučení | Ne, týká se jen testů. | Že `count()` nečeká: ověřeno ve zdroji. Že to dnes funguje: domněnka podle kódu aplikace. Okno se otevírá synchronně v obsluze klepnutí (`src/screens/round.js:298` → `confirmDecision` → `showModal()` v `src/ui/dialog.js:61`), takže po `click()` už je otevřené. Když by se okno otevíralo až po nějakém `await`, test by ho mohl přeskočit a hodnotit špatnou odpověď. |
| 3 | Texty oken se čtou přes `textContent()` a porovnávají až potom. | `tests/round-basic.spec.js:123`, `:148`; `tests/messages-app.spec.js:107`, `:134`; `tests/level-select.spec.js:14` | Playwright v1.63.0, `best-practices-js.md`, „web first assertions vs manual assertions“: doporučuje `await expect(locator).toHaveText(…)`, které čeká a zkouší znovu. | doporučení | Ne. | Doporučení ověřeno v dokumentaci. Že tady hrozí nestabilita, ověřené není. Před čtením se u `round-basic.spec.js:122` čeká na `toBeVisible()`, u ostatních řádků jsem to nekontroloval. |
| 4 | Část lokátorů je přes CSS třídu (33 výskytů v 6 souborech, např. `.dialog__body`) nebo přes vlastní atributy `data-…` (59 výskytů v 9 souborech). Role, popisek, text a test-id se používají 245×. | `tests/messages-app.spec.js` (13× třída), `tests/email-app.spec.js` (9×), `tests/evaluation-colors.spec.js` (6×), `tests/round-basic.spec.js` (2×), `tests/journeys.spec.js` (2×), `tests/round-advanced.spec.js` (1×) | Playwright v1.63.0, `locators.md` („Locate by CSS or XPath“): „CSS and XPath are not recommended as the DOM can often change“. Doporučuje role nebo test-id. `best-practices-js.md`: „Prefer user-facing attributes to XPath or CSS selectors“. | doporučení | Ne. | Ověřeno v dokumentaci. Atributy `data-target`, `data-mark` a `data-threat` jsou dané rozhraním simulované aplikace (CLAUDE.md, sekce 6), nejsou náhodné. Že by jejich výměna za test-id něco zlepšila, je domněnka. U tříd typu `.dialog__body` riziko rozbití při změně CSS platí. |
| 5 | Záznam průběhu (`trace: 'on-first-retry'`) se lokálně nikdy nepořídí, protože lokálně je `retries: 0`. | `playwright.config.js:10`, `:14` | Playwright v1.63.0, `trace-viewer.md`: `'on-first-retry'` pořizuje záznam jen při prvním opakování. „You can also use `trace: 'retain-on-failure'` if you do not enable retries but still want traces for failed tests.“ | doporučení | Ne. | Ověřeno v dokumentaci. Že se testy lokálně spouštějí bez `CI`, a proto tu záznam nevzniká, plyne z konfigurace. |
| 6 | Kontrola scénářů (`buildStart`) běží ve vývojovém serveru jen jednou, při jeho spuštění. Když se během `npm run dev` upraví JSON scénáře, znovu se nezkontroluje. | `vite.config.js:12` | Vite v8.0.10, `docs/guide/api-plugin.md` (Hook Lifecycle): „The 'options' and 'buildStart' hooks are called once on server start.“ | doporučení | Ne. `npm run build` i nasazení kontrolu spustí vždy. | Ověřeno v dokumentaci pro 8.0.10, pro nainstalovanou 8.3.0 ne (Context7 ji nemá). CLAUDE.md, sekce 7 píše „běží při každém `npm run build` i `npm run dev`“. To platí jen pro start `npm run dev`. |
| 7 | `base: './'`, `build.outDir: 'dist'`, `build.emptyOutDir: true` | `vite.config.js:23`, `:26`, `:27` | Vite v8.0.10, `docs/guide/build.md`: relativní `base: './'` je doporučený, když cílová cesta předem není známá. `docs/config/build-options.md`: `outDir` má výchozí hodnotu `'dist'`. | bez nálezu | Ne. | Ověřeno v dokumentaci (8.0.10). `outDir: 'dist'` je stejné jako výchozí hodnota, takže je nadbytečné, ale neškodí. |
| 8 | `dotenv.config({ path, quiet: true })`, výsledek (`error`) se nekontroluje. | `scripts/deploy.mjs:123` | dotenv (`master`, verze neuvedena), `_autodocs/api-reference/dotenv.md`: když soubor chybí, `config()` nevyhodí chybu, jen ji vrátí v `result.error`. `quiet` potlačí hlášku „injected env“. `override` je ve výchozím stavu `false`: proměnné, které už jsou nastavené v prostředí, mají přednost před `.env`. | doporučení | Ne. | Chování `config()` ověřeno v dokumentaci pro `master`, ne pro 18.0.3. Chybějící `.env` skript stejně zachytí na řádcích 128–133 (chybí `FTP_REMOTE_DIR` / `FTP_HOST`…), jen s méně přesnou hláškou. Že by mohla vadit přednost proměnných z prostředí, je domněnka. Pojistka cesty (`checkRemoteDir`) proběhne s jakoukoli hodnotou. |
| 9 | Použití `basic-ftp` (`new Client(30_000)`, `access({ secure: true })`, `uploadFromDir`, `cd`, `list`, `remove`) | `scripts/deploy.mjs:49`, `:52`, `:176`, `:178`, `:179` | Context7 knihovnu **nemá**. | neposouzeno | – | Nic neodhaduji. Podle komentáře v `scripts/deploy-guard.mjs:34–35` se seznam zapisovacích metod 28. 9. 2026 ověřoval proti `Client.d.ts` z nainstalovaného balíčku. To není dokumentace z Context7. |

## 4. Co se nenašlo

V testech nejsou `waitForTimeout`, `waitForSelector`, `waitForNavigation`, `page.$`, `$eval`, `elementHandle`, `page.type`, ani `click({ force })`. Hledal jsem je v `tests/` a žádný výskyt nebyl. Ve `playwright.config.js` jsem nenašel nic, co by dokumentace v1.63.0 označovala jako zastaralé. Mimo nálezy 1 a 5 jsem konfiguraci ale proti dokumentaci jednotlivě neprocházel.

## 5. Shrnutí

- Žádný nález se nemůže projevit hráči. Všechny se týkají testů, vývojového serveru nebo nasazovacího skriptu.
- Nic nemá závažnost „chyba“. Jeden nález je „zastaralé“ (č. 1, `networkidle`), ostatní jsou doporučení.
- Nejvíc na pozornost stojí nález 2. Test dnes funguje jen proto, že se okno otevírá hned po klepnutí. Když by se to v aplikaci změnilo, testy by mohly potichu projít se špatnou odpovědí.
- Nález 6 znamená nepřesnost v CLAUDE.md, sekce 7 (kontrola při `npm run dev` běží jen při startu).
- `basic-ftp` a přesné verze Vite 8.3.x a dotenv 18.x Context7 nepokrývá.
