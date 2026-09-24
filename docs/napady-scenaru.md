# Náměty na scénáře

Podklad pro milníky 4–6. Každý námět má odkaz na zdroj, ze kterého vychází. Odkazy dodal Tomáš. Claude je při zápisu neotevíral, před použitím ve scénáři je potřeba zdroj přečíst.

Každý text scénáře napsaný podle námětu je **návrh k Tomášovu ověření**, ne citace skutečného podvodu. Platí pravidla ze sekce 7 v `CLAUDE.md`: pestrost, aspoň polovina podvodů bezchybnou češtinou, část podvodů těžkých, smyšlené domény a čísla, žádné skutečné osobnosti.

Značení: **E** = e-mail, **Z** = zprávy (SMS a WhatsApp), **L** = legitimní zpráva.

## E-mail – podvody

| # | Námět | Zdroj |
| --- | --- | --- |
| E1 | Balíkovna vrací 5 000 Kč za dopravu, peníze se mají vybrat přes odkaz. | https://ceskaposta.cz/o-spolecnosti/bezpecnostni-informace/aktualni-informace |
| E2 | Pošta: balík leží na místní poště kvůli špatné adrese, oprava přes odkaz. | tamtéž jako E1 |
| E3 | Portál občana: daňový přeplatek, vyplacení přes QR kód. | https://businessinfo.cz/clanky/podvodne-e-maily-utocnici-opet-zneuzivaji-jmeno-a-logo-financni-spravy-i-portalu-obcana/ |
| E4 | Podvod přes zobrazované jméno: odesílatel „Finanční správa“, skutečná adresa cizí (smyšlená soukromá adresa na gmail.com), ukáže se až po „▾ zobrazit adresu“. Podvržená adresa @fs.gov.cz se nepoužije: doména má DMARC `p=quarantine`, taková zpráva by skončila ve spamu (rozhodnutí v CLAUDE.md, sekce 7). Scénář `email-02` (milník 4). | tamtéž jako E3; Finanční správa 30. 10. 2025: https://financnisprava.gov.cz/cs/financni-sprava/media-a-verejnost/tiskove-zpravy-gfr/tiskove-zpravy-2025/dalsi-intenzivni-vlna-podvodnych-emailu-a-sms ; Finanční správa 17. 12. 2025: https://financnisprava.gov.cz/cs/financni-sprava/novinky/novinky-2025/financni-sprava-varuje-pred-dalsi-vlnou-podvodnych-mailu (ověřeno přes WebFetch v chatu, formulace se shodují v obou zdrojích; Tomáš je přečte sám před zveřejněním odkazu na hru) |
| E5 | Daňový výměr v příloze, ve skutečnosti škodlivý program. | https://tiscali.cz/falesny-financni-urad-rozesila-e-maily-s-danovym-vymerem-otevrete-prilohu-a-pustite-si-do-pocitace-trojana-691315 |
| E6 | Banka chce aktualizaci údajů, po jejich zadání přesměruje na pravý web banky. | https://policie.gov.cz/clanek/pozor-na-podvodne-e-maily.aspx |
| E7 | „Omylem zaslané kopie dokladů a smlouvy“ s přílohou. | https://policie.gov.cz/clanek/dalsi-podvodne-e-maily.aspx |
| E8 | Výhrůžka jménem Europolu nebo policie trestním stíháním. | https://policie.gov.cz/clanek/podvodne-e-maily.aspx |
| E9 | ČEZ: platba po splatnosti. Pravé e-maily chodí jen z @cez.cz. | https://cez.cz/cs/podvodne-maily |
| E10 | Vyúčtování energií s tlačítkem „Zobrazit fakturu“. | https://rvpzv.cz/blog/phishing-jak-rozpoznat-podvod |
| E11 | Vrácení přeplatku, ale chtějí celé číslo karty. Správně stačí číslo účtu. **Těžký.** | https://csas.cz/cs/zpravy-z-banky/2024/11/26/podvodnou-sms-nebo-e-mail-muzete-dostat-i-vy-jak-je-poznat-a-neprijit-o-penize |
| E12 | „Výše pohledávky na vašem účtu“, příloha .zip se „smlouvou“. | https://policie.gov.cz/clanek/policie-cr-policie-ceske-republiky-podvodny-e-mail-vam-muze-zavirovat-pocitac.aspx |
| E13 | Falešná exekuce: neexistující paragraf, exekutor, který už nepůsobí. | https://dvojklik.cz/9-kroku-jak-poznat-podvodne-e-maily/ |
| E14 | Neuhrazená faktura slušnou češtinou, bez čísla účtu, nutí otevřít přílohu. **Těžký.** | https://irozhlas.cz/veda-technologie/technologie/malware-podvodny-e-mail-virus_2002180914_sot |
| E15 | Dluh u zdravotní pojišťovny (VZP). | https://penize.cz/tema/podvod |
| E16 | Vyděračský e-mail: „poslal jsem to z vašeho účtu, mám přístup k počítači a kameře“, výkupné v bitcoinech, případně staré heslo z úniku (ve scénáři smyšlené). Pro seniory **bez erotického obsahu**. | https://nukib.gov.cz/cs/infoservis/hrozby/1670-upozorneni-na-novou-vlnu-podvodnych-vyderacskych-emailu/ |
| E17 | Podvod, který oslovuje jménem (jméno z uniklých dat). Lekce: jméno v oslovení není záruka pravosti, rozhoduje, co zpráva chce. **Zdroj pro únik jmen a jejich zneužití doplnit** (NÚKIB 2015 uvádí jen, že podvody oslovují obecně). | https://nukib.gov.cz/cs/infoservis/doporuceni/1494-phishing-stale-aktualni-hrozba/ (obecné oslovení) |

## Zprávy (SMS a WhatsApp) – podvody

U podvodných SMS patří do vysvětlení rada: „Podezřelou SMS můžete přeposlat na číslo 7726, operátor pak odesílatele zablokuje.“ U WhatsAppu ne.

| # | Námět | Zdroj |
| --- | --- | --- |
| Z1 | „Mami, tohle je moje nové číslo“, rozbitý mikrofon, potřeba zaplatit fakturu. Scénář `zpravy-02` (milník 5, chat, „rozbil se mi mobil“). | https://policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy ; Policie ČR, KŘP Středočeského kraje 25. 9. 2025: https://archiv.policie.gov.cz/clanek/pozor-na-podvodne-zpravy-na-whatsappu-mami-mam-nove-cislo.aspx ; Policie ČR, ÚO Kladno 17. 9. 2025: https://archiv.policie.gov.cz/clanek/ahoj-mami-mam-nove-cislo-napis-mi-na-whatsapp-tohle-neni-vase-dite-ale-podvodnik.aspx ; Bezpečnější Ostrava 20. 10. 2025: https://bezpecnejsi.ostrava.cz/ahoj-tati-rozbil-se-mi-telefon-nehoda-nebo-podvod/ |
| Z2 | Kamarád s napadeným WhatsAppem: „Ahoj, můžeš mi rychle pomoct?“ | https://airbank.cz/co-vas-nejvic-zajima/podvody-ktere-zrovna-leti/ |
| Z3 | Hlasování v soutěži: pošlete kód a „Připojit zařízení“, ve skutečnosti převzetí WhatsAppu. | tamtéž jako Z2 |
| Z4 | Dopravní pokuta, třídenní lhůta, falešný Portál dopravy. Scénář `zpravy-01` (milník 5, SMS). | https://tiscali.cz/podvodna-sms-k-uhrade-pokuty-vypada-zcela-legitimne-cesi-skacou-na-trik-ktery-je-pripravi-o-tisice-korun-720319 ; Ministerstvo dopravy 12. 6. 2026: https://md.gov.cz/Media/Media-a-tiskove-zpravy/Pozor-na-falesne-SMS-o-pokutach |
| Z5 | Clo za balík 216,99 Kč. | https://ceskaposta.cz/-/bezpečnostní-upozornění-na-podvodné-sms-zprávy-2 |
| Z6 | Trestní oznámení ze zfalšované linky 158, falešná Datová schránka, přihlášení bankovní identitou, doména .top. | https://moneta.cz/blog/pozor-na-podvodne-sms-zasilane-jmenem-policie-cr |
| Z7 | Falešné SMS jménem Bank iD. | https://tiscali.cz/vetsina-cechu-si-niceho-nevsimne-a-proste-klikne-podvodny-e-mail-nebo-sms-ale-muzete-spolehlive-rozpoznat-i-v-dobe-ai-676291 |
| Z8 | „Máte nárok na státní příspěvek.“ | https://policie.gov.cz/kyberkriminalita/podvodne-sms-zpravy |
| Z9 | Daňový přeplatek, falešný portál MOJE daně. | podpora.mojedane.gov.cz (varování před podvodnými telefonáty a SMS; přesnou adresu stránky doplnit) |
| Z10 | Bazar: „kupující“ pošle odkaz na „přijetí platby“ kartou. | https://airbank.cz/co-vas-nejvic-zajima/podvody-ktere-zrovna-leti/ |
| Z11 | Brigáda z domu: lajkování, pak Telegram, pak zaplatit za „rozšířenou nabídku“. | tamtéž jako Z10 |
| Z12 | Láska přes internet, „voják v zahraničí“ chce peníze na cestu. | tamtéž jako Z10 |

## Legitimní zprávy – náměty

Pro obě sekce. V každé sekci musí být aspoň 5 legitimních scénářů a mají být skutečně věrohodné, ne nudné.

| # | Námět |
| --- | --- |
| L1 | SMS kód od banky s upozorněním, ať ho nikomu nesdělujete. |
| L2 | Připomínka termínu u lékaře. |
| L3 | Kurýr oznamuje čas doručení, bez výzvy k platbě. |
| L4 | Potvrzení objednávky z e-shopu bez odkazu k placení. |
| L5 | Zpráva od vnuka ze známého čísla, která nic nechce. Obdoba je scénář `zpravy-03` (milník 5: syn posílá odkaz na fotky). |
| L6 | Oznámení banky „přihlaste se sami v aplikaci“, bez odkazu. |
| L7 | Skutečná zpráva z @cez.cz nebo @fs.gov.cz bez požadavku na údaje. |
| L9 | **Úkol pro milník 6:** legitimní e-mail s odkazem, který vede na pravou doménu firmy. Lekce: odkaz sám o sobě není podvod, rozhoduje, kam vede. (Scénář ČEZ `email-03` z milníku 4 je bez odkazu, zdroj ČEZ odkazy v pravých e-mailech nepotvrzuje.) |
| L8 | E-mail od zaměstnavatele se zaheslovanou výplatní páskou (PDF), heslo = rodné číslo. Lekce: příloha sama o sobě není podvod, rozhoduje, jestli ji čekám a od koho je. **Ověřit ve zdroji, že je to běžná praxe.** |

## Pokrytí pestrosti (sekce 7)

Ke kontrole při psaní scénářů, aby se kombinace neopakovaly:

- **Za koho se vydává:** pošta (E1, E2, Z5), úřad (E3, E4, E5, E8, E13, Z4, Z6, Z8, Z9), banka (E6, E11, Z7), energie (E9, E10), pojišťovna (E15), rodina (Z1), kamarád (Z2, Z3), e-shop (E14), bazar (Z10). K doplnění: e-shop a pojišťovna ve Zprávách.
- **Co chce:** kliknout, zaplatit, zadat kód (Z3, Z7), otevřít přílohu (E5, E7, E12, E14), naskenovat QR (E3), nainstalovat aplikaci (zatím žádný námět), odpovědět (Z1, Z2, Z12).
- **Jaký tlak:** strach (E8, E13, E16, Z6), spěch (Z4), zvědavost (E7), soucit (Z1, Z12), výhra (Z3, E1).
