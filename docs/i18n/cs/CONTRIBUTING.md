# Přispívání

> 🌐 [English](../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Čeština**

> **Neoficiální komunitní projekt. Není přidružen k DeepSeek, DeepSeek jej neschvaluje ani nesponzoruje.**
> Názvy a značky DeepSeek náleží jejich příslušným vlastníkům.

Děkujeme, že vylepšujete katalog. Příspěvky mají prioritu u tvůrce: používejte důkazy z
původního repozitáře, zachovávejte připsání autorství a udržujte každý plugin nezávisle
posouditelný. Katalog je záměrně prázdný od začátku; žádný záznam není přijat bez vlastního
posouzeného pull requestu.

## Začněte u tvůrce

Pull request otevřený přímo tvůrcem pluginu nebo vlastnící organizací je vždy preferován. Pokud
je tvůrce připraven přispět, použijte jeho branch a pull request místo toho, abyste jeho práci
znovu vytvářeli v branchi kurátora nebo automatizace.

Kurátorství komunity je vítáno, pokud pomáhá tvůrci, který zatím pull request neotevřel.
Nezakládá to vlastnictví ani prioritu vůči pozdějšímu přímému příspěvku tvůrce.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Jeden plugin na branch a pull request

Vytvořte vyhrazený branch pro jeden plugin a z tohoto branche otevřete jeden pull request.
Branch a pull request musí vytvořit nebo změnit přesně jeden soubor YAML v
`catalog/plugins/`. Nemíchejte do tohoto branche ani pull requestu pluginy, úklid
dokumentace, generované indexy ani nesouvisející údržbu.

ID záznamu a název souboru musí být stejná hodnota v malých písmenech ve formátu kebab-case.
Správci posuzují a slučují každý pull request s pluginem jednotlivě; dávka obsahující více
pluginů se nedělí ani neslučuje částečně.

## Určete původní zdroj

Každé veřejné pole musí být rekonstruováno z původního repozitáře tvůrce, balíčku, manifestu,
souboru README, licence nebo release ve fixovaném commitu. Nekopírujte text, přiřazení
kategorie, snímky obrazovky, žebříček, odznaky ani generovaná metadata z jiného katalogu nebo
agregátoru. Odkaz nalezený v zastřešujícím projektu, tržišti, seznamu nebo agregátoru je pouze
stopa, nikoli důkaz a nikoli zdroj pluginu.

Nikdy nepodávejte zastřešující projekt, agregátor, tržiště, instalační katalog nebo seznam jako
záznam v katalogu, i když je nezávisle instalovatelný. Použijte jej pouze jako stopu a
dohledejte skutečného tvůrce a původní repozitář u každého nezávisle instalovatelného dílčího
pluginu. Plugin ve skutečném monorepu svého tvůrce lze podat z jeho přesné podcesty, ale musí
dodržovat níže uvedenou politiku hvězdiček pro monorepo.

## Povinné důkazy

V pull requestu uveďte vše z následujícího:

- Kanonickou veřejnou URL adresu původního repozitáře a jeho neměnné ID uzlu repozitáře.
  Správci ověřují ID uzlu a odmítají nesoulad URL adres v samostatné bráně pro původ
  (provenance gate).
- Veřejný GitHub handle tvůrce a odpovídající veřejnou URL profilu. YAML ukládá handle jednou;
  URL profilu je odvozena jako `https://github.com/<handle>`.
- Úplné 40znakové OID zdrojového commitu a přesnou podcestu pluginu, nebo `null` pro plugin v
  kořeni repozitáře.
- Omezený popis v angličtině a jeho cestu k důkazu v daném fixovaném commitu.
- `kind` artefaktu, primární kategorii a tagy vybrané z
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Úplný upstream výraz licence SPDX doložený ve fixovaném commitu.
- Kanonický instalační deskriptor fixovaný na přesnou verzi npm, nebo na zdrojový repozitář,
  úplný commit a podcestu. Deskriptor jsou data, nikdy shellový příkaz.
- Důkaz nativní integrace s DSH a jeho cestu ve fixovaném commitu.
- Existující, necitlivý důkaz smoke testu pro přesně tento fixovaný artefakt, nebo explicitní
  hodnotu `not run`. Neinstalujte plugin ani nespouštějte `preinstall`, `install`,
  `postinstall`, `prepare` nebo jiný kód životního cyklu balíčku/pluginu jen kvůli přípravě
  příspěvku do katalogu.
- Pro vyhrazený repozitář ověřitelný počet hvězdiček pro přesně tento repozitář, spolu s
  veřejným zdrojem a časem kontroly. Pro plugin v monorepu použijte níže uvedenou povinnou
  politiku hodnoty null.
- Veřejný původ (provenance) z Discussion nebo komentáře, pokud existuje; jinak použijte
  `null`.
- Strojově čitelnou hodnotu `unofficial: true`.

Pokud ještě neexistuje žádný kvalifikující smoke test, použijte `verification.status: eligible`
a `verification.smokeTest: null`. Hodnotu `verified` použijte pouze tehdy, když existuje
posouditelný důkaz smoke testu pro přesně tento fixovaný stav. Žádný z těchto stavů není
doporučením ani bezpečnostní certifikací.

Nikdy nepodávejte přihlašovací údaje, cookies, soukromé e-mailové adresy, nezveřejněný zdrojový
kód ani jiná tajemství.

## Pravidla YAML a schématu

Vytvořte `catalog/plugins/<plugin-id>.yaml` a ověřte jej proti
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). Schéma je zdrojem pravdy pro
názvy polí a povolené hodnoty; [docs/CATEGORIES.md](../../docs/CATEGORIES.md) definuje, jak
zvolit jediný druh artefaktu (kind), primární kategorii, tagy a rozsah repozitáře.

Deskriptor npm musí obsahovat platný název balíčku a přesnou verzi. Veřejné schéma odmítá
hodnoty připomínající volby a neomezené hodnoty, ale neimplementuje znovu SemVer ani SRI:
validace katalogu musí verzi rozparsovat, vyžadovat přesný SemVer a jakoukoli hodnotu integrity
rozparsovat jako platné SHA-512 SRI. Zdrojový deskriptor je vázán na `source.repository`,
`source.commit` a `source.subpath`, aniž by duplikoval proměnlivé zdrojové hodnoty.

Instalátory musí používat pole argumentů, zakázat spouštění přes shell a umístit ukončovač
voleb před poziční hodnoty poskytnuté katalogem tam, kde to volaný příkaz podporuje. Validace
při podání nesmí spouštět instalátor ani životní cyklus pluginu.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` je lokální, pouze pro čtení, strukturální a sémantická kontrola. Parsuje
bezpečný YAML, validuje veřejné schéma, parsuje výrazy SPDX, vyžaduje přesný SemVer a platné
SHA-512 SRI a odmítá duplicitní ID a kanonické klíče uzel-repozitáře-plus-podcesta.
Nekontaktuje GitHub, neřeší identitu repozitáře ani nekontroluje cesty k důkazům ve fixovaném
commitu.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Než záznam dosáhne stavu `eligible`, správci samostatně určí kanonický repozitář a ID uzlu,
svážou tvůrce s původním zdrojem a zkontrolují deklarovaný popis, licenci, integraci s DSH a
důkaz smoke testu v `source.commit`. Lokální „zelený“ výsledek validace není důkazem původu ani
provenance.

## Hvězdičky repozitáře

Zaznamenat lze pouze hvězdičky, o kterých lze ověřit, že patří přesně vyhrazenému repozitáři
pluginu. Hvězdičky nadřazeného projektu nesmí být nikdy přiřazeny pluginu uloženému uvnitř
širšího monorepa. Záznam z monorepa zůstává způsobilý pro funkční sekce katalogu, ale musí
deklarovat:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Vyhrazený záznam používá `repositoryScope: dedicated`, `starsPolicy: exact-repository` a
nezáporný počet hvězdiček zjištěný na tomtéž repozitáři. Před odesláním údajů o popularitě si
přečtěte [docs/RANKING.md](../../docs/RANKING.md).

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Přednost tvůrce a uctivý kontakt

Pro stejný kanonický plugin platí toto pořadí přednosti:

1. Pull request otevřený tvůrcem nebo vlastnící organizací.
2. Pull request komunity výslovně schválený tvůrcem.
3. Existující platný pull request s kurátorstvím komunity.
4. Pull request z automatizace katalogu.

Přímý pull request tvůrce má přednost před jakýmkoli otevřeným pull requestem s kurátorstvím
nebo automatizací, bez ohledu na to, který byl otevřen dříve nebo je dále v procesu. Pull
request tvůrce se stává nástrojem pro posouzení; správci nedělají force-push do branche tvůrce
ani nepřenášejí jeho práci do kurátorovaného pull requestu. Pokud už byl kurátorovaný záznam
sloučen, veřejná historie se nepřepisuje. Tvůrce může použít žádost o nárokování (claim) nebo
opravu a poté přímo přispět navazujícím pull requestem.

Kurátorovaný pull request by měl v popisu použít jednu uctivou veřejnou zmínku `@tvůrce` vedle
odkazu na původní repozitář, s pozváním tvůrce, aby jej posoudil nebo nahradil přímým pull
requestem. Zmínku neopakujte, neotvírejte propagační issues, nedělejte cross-post, neposílejte
nevyžádané přímé zprávy ani jinak tvůrce nespamujte.

<!-- creator-first:source-bound-git-identity -->

Pull requesty a commity autorované tvůrcem přirozeně zachovávají připsání zásluh tvůrci.
Kurátorované commity mohou použít Git autorství tvůrce nebo trailer `Co-authored-by` pouze se
zdrojově vázanou, veřejně ověřitelnou identitou. Nikdy nevymýšlejte ani nehádejte e-mailovou
adresu. Pokud není k dispozici žádná ověřená Git identita, commit autoruje kurátor a udělí
výslovné připsání „Created by @handle“ s odkazem na původní repozitář v YAML a v pull requestu.
Účet správce nebo automatizace může být committerem nebo ověřeným spoluautorem, ale nesmí
nahradit autorství tvůrce. Úplnou politiku najdete v [docs/CREDIT.md](../../docs/CREDIT.md).

## Validační příkazy a dostupnost

CLI npm je publikováno jako `@diegosouza.pw/dsh-plugins@0.1.0`, takže níže uvedené příkazy jsou
dnes dostupné přes `npx`. Používejte je přesně tak, jak jsou napsány; přispěvatelé by si neměli
vymýšlet náhradní příkazy.

Tyto příkazy spouštějte z kořene repozitáře:

```bash
npx @diegosouza.pw/dsh-plugins catalog validate --catalog .
npx @diegosouza.pw/dsh-plugins catalog docs-check .
npx @diegosouza.pw/dsh-plugins catalog github-forms-check .
```

`catalog validate` provádí pouze výše popsané lokální kontroly YAML, schématu, SPDX, přesného
SemVeru, SHA-512 SRI a duplicit a akceptuje záměrně prázdný katalog. Neprokazuje identitu
vzdáleného repozitáře ani důkaz fixovaného zdroje. Ostatní příkazy kontrolují požadovanou
veřejnou dokumentaci a strukturované formuláře GitHub issue. Úspěšný průchod těmito příkazy
lokálně neuvolňuje požadavky na důkazy; správci před sloučením stále uplatňují každou
odpovídající bránu (gate) pro release.

## Brány posouzení, kolize a sloučení

Správci před sloučením uplatní na aktuální commit pull requestu každou bránu:

1. **Rozsah:** jeden vyhrazený branch, jeden soubor YAML pluginu a žádné nesouvisející změny.
2. **Původní identita:** tvůrce, kanonický repozitář, ID uzlu, úplný commit a podcesta se
   shodují.
3. **Schéma a důkazy:** YAML, kategorie, SPDX, fixace instalace, důkaz DSH a stav smoke testu
   jsou vnitřně konzistentní, aniž by se spouštěl kód životního cyklu pluginu.
4. **Popularita:** vyhrazené hvězdičky jsou ověřitelné na přesném repozitáři, nebo hvězdičky
   monorepa jsou `null` s `undefined-parent-repository`.
5. **Dokumentace a formuláře:** veřejná dokumentace, ohraničení Markdown (fences) a
   strukturované formuláře zůstávají platné.
6. **Kolize a deduplikace:** žádný sloučený záznam ani otevřený pull request nereprezentuje
   stejný kanonický plugin.

Odlišné názvy nebo ID nedělají duplicitní pluginy odlišnými. Za kolizi považujte stejné ID uzlu
repozitáře a podcestu, stejný kanonický balíček, nebo jiný prokazatelně shodný instalační cíl.
Před sloučením vyřešte aliasy a konkurenční pull requesty. Přímý pull request tvůrce vítězí v
kolizi s kurátorstvím nebo automatizací; jinak správci vyberou jeden nástroj pro posouzení a
duplicitní záznamy uzavřou nebo přesměrují, místo aby sloučili oba.

Plugin sloučí pouze správce poté, co projdou všechny brány. Každý přijatý plugin je sloučen
jednotlivě; validace, kurátorství nebo automatizace neimplikují automatické ani dávkové
sloučení.

## Kontrolní seznam pull requestu

- [ ] Použil(a) jsem jeden vyhrazený branch a tento PR mění přesně jeden záznam pluginu.
- [ ] Zdrojem je původní repozitář tvůrce, nikoli zastřešující projekt nebo agregátor.
- [ ] Handle/profil tvůrce, repozitář, ID uzlu, podcesta a úplný commit jsou doloženy.
- [ ] Kind, kategorie a tagy odpovídají `docs/CATEGORIES.md`.
- [ ] Licence SPDX a fixovaný instalační deskriptor jsou doloženy.
- [ ] Nativní integrace s DSH a výsledek smoke testu nebo stav `not run` jsou doloženy.
- [ ] Nespustil(a) jsem kód životního cyklu pluginu ani balíčku kvůli přípravě tohoto
      příspěvku.
- [ ] Vyhrazené hvězdičky jsou ověřitelné, nebo hvězdičky monorepa používají povinnou politiku
      hodnoty null.
- [ ] Zkontroloval(a) jsem, zda neexistuje záznam ani otevřený pull request pro stejný
      kanonický plugin.
- [ ] Záznam je výslovně neoficiální a neobsahuje žádná tajemství ani soukromá osobní data.

## Jazyková politika

Dokumentace k uvedení a popisy v katalogu jsou pouze v angličtině. Nasazení 43 jazykových verzí
zůstává položkou backlogu po MVP; nepřidávejte prázdné dokumenty pro locale ani automatické
hromadné překlady.

<!-- i18n-source-hash: 54fa0daef6ededc936a6f681d0cbe7463ec4080757d199e691824dfdc8b388f4 -->
