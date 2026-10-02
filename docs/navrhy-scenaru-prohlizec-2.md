# Návrhy textů: Prohlížeč, doplnění banky (dávka 2, připraveno 2. 10. 2026)

**Stav: návrh ke schválení.** Nic z toho není ve hře. Zrychlený režim jako u dávky 1: vysvětlení jsou obecné rady vlastními slovy, žádné tvrzení za úřady, firmy ani Českou obchodní inspekci. Obchody a stránky jsou smyšlené, skutečné osobnosti ani značky se nejmenují.

Struktura obou návrhů prošla kontrolou obsahu hry (`validateScenario` v `src/engine/validate.js`, spuštěno v paměti 2. 10. 2026, bez chyb). Po zabudování by banka Prohlížeče měla 10 stránek (5 podvodů, 5 legitimních). Pravidla losování (2–3 legitimní v kole) se nemění.

## A. Ověřené adresy (2. 10. 2026)

| Adresa | Kde | Výsledek |
|---|---|---|
| sekacky-vyprodej-dnes.cz | prohlizec-09 | registr CZ.NIC 404, DNS neexistuje |
| sekackyvyprodejdnes.cz | varianta bez pomlček | 404, DNS neexistuje |
| zimni-bundy-obchod.cz | prohlizec-10 | 404, DNS neexistuje |
| zimnibundyobchod.cz | varianta bez pomlček | 404, DNS neexistuje |

Metoda jako u dávky 1: dotaz do registru CZ.NIC (rdap.nic.cz) a do DNS. Kontrola metody: menestarosti.cz registr najde, DNS ho najde. Názvy obchodů ve scénářích nejsou, jen adresy, proto se ARES neověřuje.

**Prosím ověř:** že adresy nepatří reálnému webu (ověřil jsem jen registr a DNS).

## B. Scénáře

| # | Podvod | Legitimní protějšek | Falešné pravidlo, které vyvrací |
|---|---|---|---|
| 5 | `prohlizec-09` falešný e-shop: velká sleva, platba jen předem převodem | `prohlizec-10` e-shop s výběrem plateb včetně převodu | „Když e-shop nabízí platbu převodem, je to podvod.“ |

---

### prohlizec-09: Sekačka za třetinu ceny (podvod, falešný e-shop)

Připojení zabezpečené (bez varování), aby sekce měla další podvod, kde varování chybí.

```
Jak jste se sem dostali: Na sociální síti jste viděli reklamu na zahradní sekačku s velkou slevou a klepli jste na ni.

[address] sekacky-vyprodej-dnes.cz
[heading] Zahradní sekačka se slevou 70 %
[body.0] Původní cena 12 990 Kč, teď jen 3 890 Kč.
[body.1] Zbývají poslední 3 kusy. Sleva platí jen dnes.
[body.2] Platíte předem převodem na účet. Jiný způsob platby nenabízíme. Zboží odešleme po připsání peněz.
[fields.0] Jméno a příjmení
[fields.1] Adresa pro doručení
[button] Objednat a zobrazit číslo účtu
```

Hrozby:
1. `heading` + `body.0` · vyhra-nabidka · **Sleva, která je až moc dobrá**
```
Sleva 70 % na novou sekačku je nápadně velká. Má vás přimět koupit dřív, než si obchod prověříte.
```
2. `body.1` · casovy-tlak · **Spěch**
```
Poslední kusy a sleva jen dnes mají zabránit tomu, abyste se v klidu zamysleli. Poctivá nabídka vám do zítřka nezmizí.
```
3. `body.2` + `button` · odkaz-platba · **Jen platba předem převodem**
```
Jediná možnost je poslat peníze předem převodem. Když zboží nepřijde, peníze se těžko vracejí. To, že vás prohlížeč nevaruje, ještě neznamená, že obchod je poctivý.
```
Nevinné části: `fields.0`, `fields.1` (jméno a adresu pro doručení potřebuje každý obchod).

Shrnutí:
```
Nápadně velká sleva, spěch a jediná možnost zaplatit předem převodem: to je častý trik falešných obchodů. U obchodu, který neznáte, si vyberte placení při převzetí. Když ho obchod nenabízí, raději nenakupujte.
```

Kontrola nápovědy: bod 6 („slibuje výhru“) může vést k nápadné slevě → hrozba 1. Bod 2 (reklama) vede ke kartě „Jak jste se sem dostali“, ta nejde označit. Body 1 a 3: bez varování, nevedou. Bod 4 nevede k žádné části. Bod 5: adresa neobsahuje známé jméno ani nesedí s nadpisem, nevede. Bod 7: stránka nechce PIN, číslo karty ani kód, nevede (jméno a adresa nejsou „údaje, které stránka nepotřebuje“). Platba předem převodem a spěch nemají v nápovědě vlastní bod, viz otázka 2 níže.

---

### prohlizec-10: Zimní bunda s výběrem placení (legitimní)

```
Jak jste se sem dostali: Hledali jste ve vyhledávači zimní bundu pro vnuka. Otevřeli jste e-shop, dali jste bundu do košíku a klepli na „Pokračovat k platbě“.

[address] zimni-bundy-obchod.cz
[heading] Doprava a platba
[body.0] Objednávka: zimní bunda, velikost 152, 1 290 Kč.
[body.1] Zaplatit můžete kartou, převodem na účet, nebo až při převzetí na poště.
[fields.0] Jméno a příjmení
[fields.1] Adresa pro doručení
[button] Pokračovat
```

Vyvrací:
```
Když e-shop nabízí platbu převodem, je to podvod.
```

Shrnutí:
```
Platba převodem sama o sobě podvod není. Tady si vybíráte z několika způsobů placení, včetně placení až při převzetí, a cena odpovídá běžné ceně. Obchod po vás chce jen to, co potřebuje k doručení. Když si obchodem nejste jistí, vyberte si placení při převzetí.
```

Kontrola nápovědy: bod 2 (otevřeli jste sami přes vyhledávač) nevede. Body 1, 3 a 5: bez varování, adresa odpovídá obchodu, nevedou. Bod 6: cena je běžná, nic nestraší, nevede. Bod 7: stránka nechce číslo karty, PIN ani kód, nevede. K označení tedy nic nevede.

## C. Otázky pro Tomáše

1. **Karta prozrazuje vzorec?** Podvod přichází z reklamy, legitimní stránka z vyhledávače. Legitimní stránka přes reklamu by narazila na bod 2 nápovědy („Na přihlášení a placení choďte adresou, kterou si napíšete sami“). Reklamu jako cestu na poctivou stránku už má `prohlizec-05`, takže vzorec „reklama = podvod“ v sekci neplatí. Doporučuji nechat.
2. **Nápověda a platba předem:** nápověda Prohlížeče nemá bod o platbě jen předem převodem. Hráč, který nápovědu poslechne, za to potrestán nebude (hrozba 3 jen přidává bod navíc), ale nápověda ho k ní ani nevede. Návrh doplnění bodu 7 (text pro hráče, jen návrh):
```
Údaje, které stránka nepotřebuje. PIN ke kartě do stránky nezadávejte nikdy. Číslo karty a kód z SMS jen při placení za věc, kterou jste si sami vybrali. I tehdy si v SMS nebo v aplikaci banky přečtěte, za co a kolik platíte. U obchodu, který neznáte, neplaťte předem převodem, vyberte si placení při převzetí.
```
   Doporučuji doplnit, jinak hrozba 3 stojí jen na shrnutí a hráč se ji předem nemá kde naučit.
3. **Věta „cena odpovídá běžné ceně“** v `prohlizec-10`: hráč běžnou cenu bundy znát nemusí. Alternativa bez ní: „Tady si vybíráte z několika způsobů placení, včetně placení až při převzetí.“ Doporučuji alternativu, je jistější.
