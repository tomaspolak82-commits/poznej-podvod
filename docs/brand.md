# Méně Starostí — brief pro tvorbu her a aplikací

Tento dokument popisuje značku, cílovou skupinu a tón Méně Starostí. Slouží jako reference pro AI agenty a vývojáře, kteří tvoří interaktivní hry a výukové aplikace pro menestarosti.cz.

**Pro projekt „Poznej podvod“:** technické řešení, herní mechanika, bodování, vzhled simulací a obsah scénářů jsou závazně popsané v `CLAUDE.md`. Tento dokument doplňuje obecný kontext značky. Pokud by se s `CLAUDE.md` v něčem rozcházel, platí `CLAUDE.md`.

---

## 1. Web a kontext

- **Hlavní web:** [menestarosti.cz](https://menestarosti.cz), WordPress
- **Sekce Hry:** https://menestarosti.cz/hry-pro-senior/, rozcestník na interaktivní obsah
- Aplikace „Poznej podvod“ běží samostatně na subdoméně poznej-podvod.menestarosti.cz, mimo WordPress. S hlavním webem ji spojuje odkaz.

## 2. Kdo jsme

**Méně Starostí** pomáhá rodinám nastavit řád, bezpečí a klid v péči o seniory. Ne teoretici, praktici.

- **Káťa:** sociální systém, úřady, papírování, plné moci, emoční stránka péče
- **Tomáš:** technologie, kyberbezpečnost, požární ochrana, technická bezpečnost domova

Web běží od května 2026, Facebook od ledna 2026. Obsahové pilíře: bezpečnost domova, technologie pro seniory, kyberbezpečnost a podvody, úřady a finance.

## 3. Cílová skupina

- **Primární:** senioři 60+
- **Sekundární:** jejich dospělé děti (40–55 let), které rodičům s technologiemi pomáhají nebo jim aplikaci posílají

### Co to znamená pro design a UX

- **Velké písmo:** nikdy nespoléhat na drobný text, žádné tenké řezy písma
- **Vysoký kontrast:** text musí být čitelný i s běžnou zrakovou vadou ve stáří
- **Jednoduchost:** jeden úkol na obrazovku, žádné skryté ovládání, žádná gesta (swipe, pinch) jako jediná cesta k akci
- **Velké klikací plochy:** kvůli méně přesné motorice (třes rukou, dotykový displej)
- **Žádný časový tlak:** nic se neměří na čas
- **Jasná zpětná vazba:** po každé akci je jasné, co se stalo a proč. Ne jen číslo, vždy i vysvětlení.
- **Žádný žargon:** technické pojmy vysvětlit lidsky (např. „router“ → „krabička s internetem“)
- **Bezpečné prostředí na chybu:** aplikace viditelně sděluje, že jde o TRÉNINK, aby si ji senior nespletl se skutečným telefonem nebo e-mailem
- **Nápověda dostupná od začátku**, ne až jako trest za chybu

## 4. Tón a hlas (i uvnitř aplikace)

- Mluvíme jako „my, Méně Starostí“, ne jako firma
- Vykání
- Atmosféra „soused u plotu“: věcně, klidně, bez emočně přepálených formulací a bez strašení
- Zakázané fráze: revoluční, unikátní, komplexní, neváhejte, v dnešní uspěchané době, řešení na míru. Ani jiné obraty typické pro texty psané AI.
- Zpětná vazba zní jako rada od někoho, kdo to myslí dobře, ne jako suché SPRÁVNĚ/ŠPATNĚ

## 5. Vizuální identita

Barvy značky (Kadence Global Colors na webu):

| Účel | Barva | Hex |
|---|---|---|
| Logo, značky chyb | červená | `#ff4d4d` |
| Tmavé plochy | tmavě šedá | `#2a2f35` |
| Zvýraznění, žárovky nápovědy | žlutá | `#ffb302` |
| Hlavní barva ovládání | tyrkysová | `#008080` |
| Sekundární plochy | světle šedá | `#f7fafc` |
| Základní text | šedá | `#4a5568` |
| Nadpisy | tmavá | `#1a202c` |

Hlavní pozadí aplikací je bílé. Přesné použití barev pro „Poznej podvod“ je v `CLAUDE.md`.

**Typografie:** nadpisy **Montserrat**, běžný text **Lato**.

Čitelnost má přednost před přesnými odstíny. Kontrast minimálně WCAG AA, ideálně AAA, i kdyby to znamenalo mírně upravit odstín.

## 6. Co se vyvarovat

- Nedávat seniorům víc než jeden úkol najednou
- Žádní hraví maskoti ani dětský tón. Cílovka jsou dospělí lidé, jen s jinými potřebami na čitelnost a ovládání.
- Žádná registrace, instalace ani účet. Aplikace musí jít spustit hned v prohlížeči.
- Nezaměňovat „jednoduché“ za „primitivní“. Obsah může být věcně bohatý, jen přehledně podaný.
- Nevypadat zastarale. Moderní, svěží vzhled, pokud nejde proti čitelnosti.

## 7. Účel a vzdělávací cíle

Smyslem není zábava sama o sobě, ale naučit bezpečné chování na internetu tak, aby se senior dokázal sám rozhodnout a nenechal se napálit.

- **Bezpečné chování:** rozpoznat podvodné situace (podvodné SMS, e-maily a zprávy, podvodné weby a vyskakovací okna, tlak na rychlé rozhodnutí, falešné hovory) a vědět, jak reagovat: nekliknout, ověřit si to jinou cestou, zeptat se rodiny, nahlásit.
- **Základní pojmy:** srozumitelně vysvětlit, s čím se senior setká (adresa odesílatele, odkaz, zámeček v prohlížeči, dvoufázové ověření), vždy lidsky, ne slovníkovou definicí.
- **Důvěra ve vlastní úsudek:** aplikace má seniora ujistit, že podezřelou situaci pozná sám, ne ho strašit.
- **Body a skóre ano, ale jako motivace, ne zkouška.** Hráč vidí svůj výsledek i maximum, kterého může dosáhnout. Formulace jsou vždy povzbudivé. Vysvětlení je důležitější než číslo.
- **Reálné scénáře z ČR, ne abstraktní kvízy.** Vycházet ze situací, které se v Česku skutečně dějí (podvodné SMS o zásilce, falešný bankéř, „vnuk v nouzi“, investiční reklamy) a doplňovat témata, o kterých píše web.
