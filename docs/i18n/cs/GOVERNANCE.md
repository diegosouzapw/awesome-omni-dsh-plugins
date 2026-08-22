# Správa katalogu

> **Neoficiální komunitní projekt. Není přidružen k DeepSeek, DeepSeek jej neschvaluje ani nesponzoruje.**
> Názvy a značky DeepSeek náleží jejich příslušným vlastníkům.

Jak je veřejný katalog spravován: kdo rozhoduje o tom, co vstoupí, v jakém pořadí jsou
konkurující si příspěvky upřednostněny, které kontroly běží automaticky a které úsudky zůstávají
lidské. Zásady, na které se zde odkazuje, jsou v [CONTRIBUTING.md](../../CONTRIBUTING.md),
[docs/CREDIT.md](../../docs/CREDIT.md) a [docs/RANKING.md](../../docs/RANKING.md); tato stránka
popisuje, jak do sebe zapadají.

## Principy

1. **Priorita pro tvůrce.** Katalog existuje proto, aby byla práce tvůrců dohledatelná, nikdy
   proto, aby ji převzal. Pro stejný kanonický plugin má přímý pull request tvůrce přednost před
   jakýmkoli otevřeným pull requestem komunity s kurátorstvím nebo automatizací — úplné pořadí
   přednosti a pravidla identity Git najdete v [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Jeden plugin, jeden zkontrolovaný pull request.** Žádné dávkové slučování, žádné
   generované hromadné importy do veřejného katalogu. Každý záznam si zaslouží vlastní
   posouzení.
3. **Důkaz místo důvěry.** Každé veřejné pole vede k původnímu repozitáři tvůrce na fixovaném
   commitu. Zelená automatická kontrola se nikdy nepřijímá jako důkaz původu.
4. **Neoficiální, vždy.** Žádný stav katalogu se neprezentuje jako posouzení, certifikace nebo
   schválení ze strany DeepSeek.

## Jak se změny dostávají do `main`

Všechny změny dosáhnou `main` prostřednictvím zkontrolovaných pull requestů — neexistují přímá
nahrání (push). Provozní zásady pro výchozí branch:

- **Pouze pull requesty.** Záznamy katalogu, dokumentace i změny schématu vstupují přes PR; PR
  katalogu musí dodržovat pravidlo jeden plugin na branch uvedené v
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Lineární historie.** PR se integrují tak, aby si `main` zachoval lineární, auditovatelnou
  historii; sloučená veřejná historie se nepřepisuje. Pokud byl kurátorovaný záznam sloučen
  dříve, než se tvůrce přihlásil, tvůrce si jej nárokuje nebo opraví v navazujícím příspěvku
  místo přepisování historie.
- **Řešení vláken posouzení.** Konverzace z posouzení se řeší před sloučením; nevyřešená zpětná
  vazba blokuje integraci.
- **Sloučení správcem.** Záznam pluginu sloučí pouze správce, a to až poté, co každá brána v
  [CONTRIBUTING.md](../../CONTRIBUTING.md) → „Brány posouzení, kolize a sloučení“ projde na
  aktuálním commitu PR.

## Kontrola `catalog-validation`

Každý pull request, který se dotkne `catalog/plugins/`, `schemas/` nebo samotného workflow,
spustí úlohu `catalog-validation` (`.github/workflows/validate-catalog.yml`), fixovanou na
publikované CLI:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Co validuje** — pouze lokální strukturu a sémantiku:

- Bezpečné parsování YAML každého záznamu pod `catalog/plugins/`.
- Shodu s veřejným schématem (viz [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Parsování výrazů SPDX, přesné verze SemVer, platné hodnoty integrity SHA-512 SRI.
- Odmítnutí duplicit: žádná opakovaná ID záznamů a žádné opakované kanonické klíče
  uzel-repozitáře-plus-podcesta.
- Záměrně prázdný katalog projde (`0 entries valid; catalog is empty`).

**Co NEvaliduje** — a tedy co zelená kontrola nikdy neprokazuje:

- Identitu vzdáleného repozitáře: nekontaktuje GitHub ani neověřuje ID uzlu repozitáře vůči
  URL.
- Důkaz ve fixovaném commitu: popisy, licence, integrace s DSH ani důkaz smoke testu se
  nenačítají ani nekontrolují.
- Vlastnictví tvůrcem, počty hvězdiček ani kolize s otevřenými pull requesty.

Tyto úsudky patří k samostatným bránám správců pro původ (provenance), uplatňovaným před
sloučením a popsaným v [CONTRIBUTING.md](../../CONTRIBUTING.md). Lokální kontrola je minimum,
nikoli laťka.

## Stavy ověření

Ověření se zaznamenává pro každý záznam vůči jeho přesnému fixovanému commitu, pomocí stavů
definovaných ve veřejném schématu (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). Dva kladné stavy jsou záměrně úzké:

- `eligible` — veřejná struktura a nativní integrace s DSH byly ověřeny.
- `verified` — navíc prošel instalační smoke test pro fixovaný zdroj nebo balíček; schéma
  vyžaduje přítomnost záznamu smoke testu.

Žádný stav — ani žádný jiný — není doporučením, zárukou ani bezpečnostní certifikací. Úplná
sémantika, včetně toho, jak stavy interagují s řazením, je v
[docs/RANKING.md](../../docs/RANKING.md); tvar záznamu je v
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Nároky, opravy a odstranění

Strukturované formuláře GitHub issues (`.github/ISSUE_TEMPLATE/`) jsou řízenou cestou pro změnu
záznamu, který jste nepodali:

| Formulář          | Kdo jej používá                            | Výsledek                                            |
| ----------------- | ------------------------------------------ | --------------------------------------------------- |
| **Nárok (Claim)** | Tvůrce, jehož plugin kurátoroval někdo jiný | Vlastnictví se sváže s původním zdrojem; tvůrce poté může přispívat přímo |
| **Oprava (Correction)** | Kdokoli, kdo zjistí nepřesná veřejná metadata | Zkontrolovaná oprava dotčeného záznamu              |
| **Odstranění (Removal)** | Tvůrce, který chce svůj záznam odstranit, nebo nahlašovatel porušení zásad | Zkontrolované odstranění nebo karanténa záznamu     |

Pravidla platná pro všechny tři postupy:

- Nároky na vlastnictví musí být podloženy ověřitelnými veřejnými důkazy (vlastnictví
  repozitáře, autorství balíčku, metadata manifestu nebo historie fixovaného zdroje) —
  komentování v Discussion autorství nezakládá ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Bezpečnostní problémy v pluginu ze seznamu jdou nejprve vlastnímu správci daného pluginu;
  strana katalogu poté řeší opravu nebo karanténu bez zveřejnění podrobností o zneužití
  ([SECURITY.md](../../SECURITY.md)).
- Nikdy do formuláře nezahrnujte přihlašovací údaje, soukromé kontaktní informace ani jiná
  tajemství.

## Role

- **Tvůrci** vlastní své pluginy a přednost svých záznamů. Mohou přispívat přímo, schvalovat
  kurátorství komunity nebo si nárokovat/opravit/odstranit existující záznam.
- **Komunitní přispěvatelé** mohou kurátorovat záznamy pro tvůrce, kteří zatím nepřispěli, a to
  podle pravidel uctivého kontaktu a kreditu v [docs/CREDIT.md](../../docs/CREDIT.md).
  Kurátorství nikdy nepřeváží pozdější přímý příspěvek tvůrce.
- **Správci** posuzují, uplatňují brány původu, řeší kolize a slučují. Udržují také web
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) a publikované CLI ze
  soukromého zdroje; veřejná data, schéma a zásady tohoto repozitáře jsou to, co tyto povrchy
  konzumují.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
