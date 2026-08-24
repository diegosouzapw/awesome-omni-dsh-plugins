# Správa katalógu

> 🌐 [English](../../GOVERNANCE.md) · [Português (Brasil)](../pt-BR/GOVERNANCE.md) · [中文（简体）](../zh-CN/GOVERNANCE.md) · **Slovenčina**

> **Neoficiálny komunitný projekt. Nie je prepojený s DeepSeek, nie je ním podporovaný ani sponzorovaný.**
> Názvy a značky DeepSeek patria ich príslušnému vlastníkovi.

Ako je verejný katalóg spravovaný: kto rozhoduje o tom, čo vstúpi, v akom poradí sa rešpektujú
súperiace príspevky, ktoré kontroly bežia automaticky a ktoré úsudky zostávajú ľudské. Politiky, na
ktoré sa tu odkazuje, sú v [CONTRIBUTING.md](../../CONTRIBUTING.md),
[docs/CREDIT.md](../../docs/CREDIT.md) a [docs/RANKING.md](../../docs/RANKING.md); táto stránka
popisuje, ako do seba zapadajú.

## Princípy

1. **Prednosť tvorcu.** Katalóg existuje, aby bola práca tvorcov objaviteľná, nikdy nie na to, aby
   im prevzal vlastníctvo. Pre ten istý kanonický plugin priamy pull request tvorcu nahrádza ktorýkoľvek
   otvorený komunitný kurátorský alebo automatizovaný pull request — úplné poradie prednosti a
   pravidlá Git identity sú v [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Jeden plugin, jeden posúdený pull request.** Žiadne dávkové zlučovanie, žiadne generované
   hromadné importy do verejného katalógu. Každý záznam si zaslúži vlastné posúdenie.
3. **Dôkazy namiesto dôvery.** Každé verejné pole sleduje pôvodný repozitár tvorcu na pripnutom
   commite. Zelená automatizovaná kontrola sa nikdy neprijíma ako dôkaz pôvodu.
4. **Neoficiálne, vždy.** Žiadny stav katalógu sa neprezentuje ako posúdenie, certifikácia alebo
   odporúčanie zo strany DeepSeek.

## Ako sa zmeny dostávajú na `main`

Všetky zmeny sa na `main` dostávajú cez posúdené pull requesty — neexistujú priame push. Prevádzková
politika pre predvolenú vetvu:

- **Iba pull requesty.** Záznamy katalógu, dokumentácia aj zmeny schémy vstupujú cez PR; PR katalógu
  musia dodržiavať pravidlo jeden-plugin-na-vetvu z [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Lineárna história.** PR sa integrujú tak, aby si `main` udržal lineárnu, auditovateľnú históriu;
  zlúčená verejná história sa neprepisuje. Ak sa kurátorský záznam zlúčil skôr, než sa tvorca
  prihlásil, tvorca si ho nárokuje alebo opraví v nadväzujúcom príspevku namiesto prepísania histórie.
- **Riešenie vlákien posúdenia.** Diskusie v posúdení sa vyriešia pred zlúčením; nevyriešená spätná
  väzba blokuje integráciu.
- **Zlúčenie správcom.** Záznam pluginu zlučuje iba správca, a to až po prejdení každej brány v
  [CONTRIBUTING.md](../../CONTRIBUTING.md) → „Brány posúdenia, kolízie a zlúčenie" na aktuálnom
  commite PR.

## Kontrola `catalog-validation`

Každý pull request, ktorý sa dotkne `catalog/plugins/`, `schemas/` alebo samotného workflow, spustí
úlohu `catalog-validation` (`.github/workflows/validate-catalog.yml`), pripnutú na publikované CLI:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Čo validuje** — iba lokálnu štruktúru a sémantiku:

- Bezpečné parsovanie YAML každého záznamu v `catalog/plugins/`.
- Zhodu s verejnou schémou (pozri [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Parsovanie SPDX výrazov, presné SemVer verzie, platné SHA-512 SRI hodnoty integrity.
- Odmietanie duplikátov: žiadne opakované ID záznamov a žiadne opakované kanonické kľúče
  repozitár-uzol-podcesta.
- Zámerne prázdny katalóg prejde (`0 entries valid; catalog is empty`).

**Čo nevaliduje** — a teda čo zelená kontrola nikdy nepreukazuje:

- Identitu vzdialeného repozitára: nekontaktuje GitHub ani nedohľadáva ID uzla repozitára voči URL.
- Dôkazy na pripnutom commite: popisy, licencie, DSH integrácia ani dôkazy zo smoke testu sa
  nenačítavajú ani nekontrolujú.
- Vlastníctvo tvorcu, počty hviezdičiek ani kolíziu s otvorenými pull requestmi.

Tieto úsudky patria do samostatných brán pôvodu správcov, uplatňovaných pred zlúčením a popísaných v
[CONTRIBUTING.md](../../CONTRIBUTING.md). Lokálna kontrola je minimum, nie latka.

## Stavy overenia

Overenie sa zaznamenáva pre každý záznam voči jeho presnému pripnutému commitu pomocou stavov
definovaných vo verejnej schéme (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). Dva pozitívne stavy sú zámerne úzke:

- `eligible` — verejná štruktúra a natívna DSH integrácia boli validované.
- `verified` — navyše prešiel inštalačný smoke test pre pripnutý zdroj alebo balík; schéma vyžaduje,
  aby bol záznam smoke testu prítomný.

Žiadny stav — ani žiadny iný — nie je odporúčaním, zárukou ani bezpečnostnou certifikáciou. Úplná
sémantika vrátane toho, ako stavy interagujú s rebríčkom, je v
[docs/RANKING.md](../../docs/RANKING.md); tvar záznamu je v [docs/SCHEMA.md](../../docs/SCHEMA.md).

## Nároky, opravy a odstránenia

Štruktúrované formuláre GitHub issues (`.github/ISSUE_TEMPLATE/`) sú riadenou cestou na zmenu
záznamu, ktorý ste nepredložili:

| Formulár       | Kto ho používa                              | Výsledok                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Nárok**      | Tvorca, ktorého plugin kurátorsky spracoval niekto iný | Vlastníctvo sa zviaže s pôvodným zdrojom; tvorca potom môže prispieť priamo |
| **Oprava**     | Ktokoľvek, kto si všimne nepresné verejné metadáta | Posúdená oprava dotknutého záznamu             |
| **Odstránenie**    | Tvorca, ktorý chce svoj záznam odstrániť, alebo nahlasovateľ porušenia politiky | Posúdené odstránenie alebo karanténa záznamu |

Pravidlá platné pre všetky tri postupy:

- Nároky na vlastníctvo musia byť podložené overiteľnými verejnými dôkazmi (vlastníctvo repozitára,
  autorstvo balíka, metadáta manifestu alebo história pripnutého zdroja) — komentovanie v Discussion
  nezakladá autorstvo ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Bezpečnostné problémy zaradeného pluginu smerujú najprv správcovi daného pluginu; strana katalógu
  potom vybaví opravu alebo karanténu bez zverejnenia podrobností o zneužití
  ([SECURITY.md](../../SECURITY.md)).
- Do formulára nikdy nezahŕňajte prihlasovacie údaje, súkromné kontaktné údaje ani iné tajomstvá.

## Role

- **Tvorcovia** vlastnia svoje pluginy a prednosť svojich záznamov. Môžu prispieť priamo, schváliť
  komunitné kurátorstvo alebo si nárokovať/opraviť/odstrániť existujúci záznam.
- **Komunitní prispievatelia** môžu kurátorsky spracovať záznamy pre tvorcov, ktorí ešte
  neprispeli, podľa pravidiel ohľaduplného kontaktu a pripisovania zásluh v
  [docs/CREDIT.md](../../docs/CREDIT.md). Kurátorstvo nikdy nepredbehne neskorší priamy príspevok
  tvorcu.
- **Správcovia** posudzujú, uplatňujú brány pôvodu, riešia kolízie a zlučujú. Tiež udržiavajú web
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) a publikované CLI zo
  súkromného zdrojového kódu; verejné dáta, schéma a politiky tohto repozitára sú to, čo tieto
  povrchy spotrebúvajú.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
