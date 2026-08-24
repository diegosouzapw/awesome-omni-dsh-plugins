# Sprievodca prispievaním

> 🌐 [English](../../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Slovenčina**

> **Neoficiálny komunitný projekt. Nie je prepojený s DeepSeek, nie je ním podporovaný ani sponzorovaný.**
> Názvy a značky DeepSeek patria ich príslušnému vlastníkovi.

Ďakujeme, že zlepšujete katalóg. Príspevky uprednostňujú tvorcov: používajte dôkazy z pôvodného
repozitára, zachovajte pripísanie autorstva a udržujte každý plugin nezávisle posúditeľný. Katalóg
je zámerne prázdny od začiatku; žiadny záznam nie je prijatý bez vlastného posúdeného pull requestu.

## Začnite pri tvorcovi

Pull request otvorený priamo tvorcom pluginu alebo vlastniacou organizáciou je vždy preferovaný.
Ak je tvorca pripravený prispieť, použite jeho vetvu a pull request namiesto toho, aby ste jeho
prácu znovu vytvárali v kurátorskej alebo automatizačnej vetve.

Komunitné kurátorstvo je vítané, keď pomáha tvorcovi, ktorý pull request neotvoril. Nezakladá
však vlastníctvo ani prednosť pred neskorším priamym príspevkom tvorcu.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Jeden plugin na jednu vetvu a pull request

Vytvorte vyhradenú vetvu pre jeden plugin a otvorte z nej jeden pull request. Vetva a pull request
musia vytvoriť alebo zmeniť presne jeden YAML súbor v priečinku `catalog/plugins/`. Nepridávajte do
tejto vetvy ani pull requestu iné pluginy, čistenie dokumentácie, generované indexy ani nesúvisiacu
údržbu.

ID záznamu a názov súboru musia byť rovnaká hodnota v kebab-case malými písmenami. Správcovia
posudzujú a zlučujú každý pull request pluginu jednotlivo; dávka obsahujúca viacero pluginov sa
nedelí ani čiastočne nezlučuje.

## Dohľadajte pôvodný zdroj

Každé verejné pole musí byť zrekonštruované z pôvodného repozitára tvorcu, balíka, manifestu,
README, licencie alebo vydania na pripnutom commite. Nekopírujte text, zaradenie do kategórií,
snímky obrazovky, rebríčky, odznaky ani generované metadáta z iného katalógu alebo agregátora.
Odkaz nájdený v zastrešujúcom projekte, trhovisku, zozname alebo agregátore je iba stopa, nie dôkaz
a ani zdroj pluginu.

Nikdy nepredkladajte zastrešujúci projekt, agregátor, trhovisko, inštalačný katalóg ani zoznam ako
záznam katalógu, a to ani vtedy, keď sa dá nezávisle nainštalovať. Použite ho iba ako stopu a
každý nezávisle inštalovateľný podradený plugin dohľadajte k jeho skutočnému tvorcovi a pôvodnému
repozitáru. Plugin v skutočnom monorepe tvorcu môže byť predložený zo svojej presnej podcesty, ale
musí dodržiavať nižšie uvedenú politiku hviezdičiek monorepa.

## Požadované dôkazy

V pull requeste poskytnite všetko nasledujúce:

- Kanonickú verejnú URL pôvodného repozitára a jeho nemenné ID uzla repozitára. Správcovia uzol
  dohľadajú a odmietnu nezhodu URL v samostatnej bráne pôvodu.
- Verejný GitHub handle tvorcu a zodpovedajúcu verejnú URL profilu. YAML ukladá handle iba raz;
  URL profilu sa odvodzuje ako `https://github.com/<handle>`.
- Úplný 40-znakový OID zdrojového commitu a presnú podcestu pluginu, alebo `null` pre plugin
  v koreni repozitára.
- Ohraničený anglický popis a jeho cestu dôkazu na danom pripnutom commite.
- Druh artefaktu `kind`, primárnu kategóriu a značky vybrané z
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Úplný upstream SPDX licenčný výraz s dôkazom na pripnutom commite.
- Kanonický inštalačný deskriptor pripnutý na presnú verziu npm, alebo na zdrojový repozitár,
  úplný commit a podcestu. Deskriptor je dáta, nikdy nie shellový príkaz.
- Dôkaz natívnej DSH integrácie a jeho cestu na pripnutom commite.
- Existujúci, necitlivý dôkaz zo smoke testu pre presné pripnutie artefaktu, alebo explicitnú
  hodnotu `not run`. Neinštalujte plugin ani nespúšťajte `preinstall`, `install`, `postinstall`,
  `prepare` ani iný kód životného cyklu balíka/pluginu iba preto, aby ste pripravili príspevok do
  katalógu.
- Pre vyhradený repozitár overiteľný počet hviezdičiek pre daný presný repozitár spolu s verejným
  zdrojom a časom kontroly. Pre plugin v monorepe použite nižšie požadovanú null politiku.
- Verejný pôvod z Discussion alebo komentára, ak existuje; inak použite `null`.
- Strojovo čitateľnú hodnotu `unofficial: true`.

Ak neexistuje žiadny kvalifikujúci smoke test, použite `verification.status: eligible` a
`verification.smokeTest: null`. Hodnotu `verified` použite iba vtedy, keď existuje preskúmateľný
dôkaz zo smoke testu pre presné pripnutie. Žiadny stav nie je odporúčaním ani bezpečnostnou
certifikáciou.

Nikdy nepredkladajte prihlasovacie údaje, cookies, súkromné e-mailové adresy, nepublikovaný zdrojový
kód ani iné tajomstvá.

## Pravidlá YAML a schémy

Vytvorte `catalog/plugins/<plugin-id>.yaml` a validujte ho voči
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). Pole `id` sa musí rovnať
základnému názvu súboru a musí začínať vaším menným priestorom: vaším handle `creator.github`
malými písmenami (akákoľvek postupnosť znakov mimo `[a-z0-9]` sa zmení na jednu `-`) nasledovaným
znakom `-`, napríklad `some-creator-my-plugin` pre handle `Some-Creator`. Validácia katalógu
vynucuje oboje. Schéma je zdrojom pravdy pre názvy polí a povolené hodnoty;
[docs/CATEGORIES.md](../../docs/CATEGORIES.md) definuje, ako vybrať jediný druh artefaktu, primárnu
kategóriu, značky a rozsah repozitára.

Deskriptor npm musí obsahovať platný názov balíka a presnú verziu. Verejná schéma odmieta hodnoty
vyzerajúce ako prepínače a neohraničené hodnoty, ale neimplementuje znovu SemVer ani SRI: validácia
katalógu musí verziu spracovať, vyžadovať presné SemVer a akúkoľvek hodnotu integrity spracovať ako
platné SHA-512 SRI. Zdrojový deskriptor je viazaný na `source.repository`, `source.commit` a
`source.subpath` bez duplikácie meniteľných zdrojových hodnôt.

Inštalátory musia používať polia argumentov, zakázať spúšťanie shellu a umiestniť oddeľovač
prepínačov pred pozičné hodnoty poskytnuté katalógom, ak to volaný príkaz podporuje. Validácia
predloženia nikdy nesmie vyvolať inštalátor ani životný cyklus pluginu.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` je lokálna štrukturálna a sémantická kontrola len na čítanie. Parsuje bezpečný
YAML, validuje verejnú schému, parsuje SPDX výrazy, vyžaduje presné SemVer a platné SHA-512 SRI a
odmieta duplicitné ID a duplicitné kanonické kľúče repozitár-uzol-podcesta. Nikdy nekontaktuje
GitHub, nedohľadáva identitu repozitára ani nekontroluje cesty dôkazov na pripnutom commite.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Skôr než záznam dosiahne stav `eligible`, správcovia samostatne dohľadajú kanonický repozitár a ID
uzla, zviažu tvorcu s pôvodným zdrojom a skontrolujú deklarovaný popis, licenciu, DSH integráciu a
dôkaz zo smoke testu na `source.commit`. Zelený výsledok lokálnej validácie nie je dôkazom pôvodu
ani provenancie.

## Hviezdičky repozitára

Zaznamenané môžu byť iba hviezdičky overiteľne patriace presnému vyhradenému repozitáru pluginu.
Hviezdičky nadradeného projektu sa nikdy nesmú pripísať pluginu uloženému v širšom monorepe. Záznam
v monorepe zostáva oprávnený pre funkčné sekcie katalógu, ale musí deklarovať:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Vyhradený záznam používa `repositoryScope: dedicated`, `starsPolicy: exact-repository` a
nezáporný počet hviezdičiek pozorovaný na tom istom repozitári. Pred odoslaním údajov o
popularite si prečítajte [docs/RANKING.md](../../docs/RANKING.md).

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Prednosť tvorcu a ohľaduplný kontakt

Pre ten istý kanonický plugin je poradie prednosti:

1. Pull request otvorený tvorcom alebo vlastniacou organizáciou.
2. Komunitný pull request explicitne schválený tvorcom.
3. Existujúci platný komunitný kurátorský pull request.
4. Automatizovaný pull request katalógu.

Priamy pull request tvorcu nahrádza ktorýkoľvek otvorený kurátorský alebo automatizovaný pull
request bez ohľadu na to, ktorý bol otvorený skôr alebo je ďalej. Pull request tvorcu sa stáva
vozidlom posúdenia; správcovia nevykonávajú force-push na vetve tvorcu ani jeho prácu neprenášajú
do kurátorského pull requestu. Ak už bol kurátorský záznam zlúčený, verejná história sa neprepisuje.
Tvorca môže použiť nárok alebo žiadosť o opravu a následne priamo prispieť nadväzujúcim pull
requestom.

Kurátorský pull request by mal vo svojom popise použiť jednu ohľaduplnú verejnú zmienku `@creator`
vedľa odkazu na pôvodný repozitár a pozvať tvorcu na posúdenie alebo nahradenie priamym pull
requestom. Zmienku neopakujte, neotvárajte propagačné issues, nekrížovo neprispievajte, neposielajte
nevyžiadané súkromné správy ani tvorcu inak neobťažujte.

<!-- creator-first:source-bound-git-identity -->

Pull requesty a commity od tvorcu prirodzene zachovávajú zásluhy tvorcu. Kurátorské commity môžu
použiť Git autorstvo tvorcu alebo trailer `Co-authored-by` iba pri identite viazanej na zdroj a
verejne overiteľnej. Nikdy nevymýšľajte ani nehádajte e-mail. Ak nie je dostupná overená Git
identita, autorom commitu je kurátor a v YAML a pull requestu uvedie explicitné pripísanie
`Created by @handle` s odkazom na pôvodný repozitár. Správca alebo automatizačný účet môže byť
committer alebo overený spoluautor, ale nesmie nahradiť autorstvo tvorcu. Úplnú politiku nájdete
v [docs/CREDIT.md](../../docs/CREDIT.md).

## Validačné príkazy a dostupnosť

npm CLI je publikované ako `omni-dsh-plugins@1.0.1`, takže príkazy nižšie sú dnes dostupné
prostredníctvom `npx`. Používajte ich presne tak, ako sú napísané; prispievatelia by nemali
vymýšľať náhradné príkazy.

Tieto príkazy spúšťajte z koreňa repozitára:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` vykonáva iba lokálne kontroly YAML, schémy, SPDX, presného SemVer, SHA-512 SRI a
duplikátov popísané vyššie a prijíma zámerne prázdny katalóg. Nepreukazuje identitu vzdialeného
repozitára ani dôkazy pripnutého zdroja. Ostatné príkazy kontrolujú požadovanú verejnú dokumentáciu
a štruktúrované formuláre GitHub issues. Ich lokálne prejdenie nezmierňuje požiadavky na dôkazy;
správcovia pred zlúčením stále uplatnia každú zodpovedajúcu bránu vydania.

## Brány posúdenia, kolízie a zlúčenie

Správcovia pred zlúčením uplatnia každú bránu na aktuálny commit pull requestu:

1. **Rozsah:** jedna vyhradená vetva, jeden YAML súbor pluginu a žiadne nesúvisiace zmeny.
2. **Pôvodná identita:** tvorca, kanonický repozitár, ID uzla, úplný commit a podcesta sa zhodujú.
3. **Schéma a dôkazy:** YAML, kategórie, SPDX, inštalačné pripnutie, dôkaz DSH a stav smoke testu
   sú vnútorne konzistentné bez spustenia kódu životného cyklu pluginu.
4. **Popularita:** hviezdičky vyhradeného repozitára sú overiteľné na presnom repozitári, alebo
   hviezdičky monorepa sú `null` s `undefined-parent-repository`.
5. **Dokumentácia a formuláre:** verejná dokumentácia, Markdown fences a štruktúrované formuláre
   zostávajú platné.
6. **Kolízia a deduplikácia:** žiadny zlúčený záznam ani otvorený pull request nereprezentuje ten
   istý kanonický plugin.

Rozdielne názvy alebo ID nerobia z duplicitných pluginov rôzne. Rovnaké ID uzla repozitára a
podcestu, rovnaký kanonický balík alebo iný preukázateľne identický inštalačný cieľ považujte za
kolíziu. Aliasy a súperiacie pull requesty vyriešte pred zlúčením. Priamy pull request tvorcu
vyhráva kolíziu s kurátorstvom alebo automatizáciou; inak správcovia vyberú jedno vozidlo posúdenia
a duplikáty zatvoria alebo presmerujú namiesto toho, aby zlučovali oba.

Plugin zlučuje iba správca po prejdení všetkých brán. Každý prijatý plugin sa zlučuje jednotlivo;
validácia, kurátorstvo ani automatizácia neznamenajú automatické ani dávkové zlúčenie.

## Kontrolný zoznam pull requestu

- [ ] Použil som jednu vyhradenú vetvu a tento PR mení presne jeden záznam pluginu.
- [ ] Zdrojom je pôvodný repozitár tvorcu, nie zastrešujúci projekt ani agregátor.
- [ ] Handle/profil tvorcu, repozitár, ID uzla, podcesta a úplný commit sú podložené dôkazmi.
- [ ] Druh, kategória a značky sa riadia `docs/CATEGORIES.md`.
- [ ] SPDX licencia a pripnutý inštalačný deskriptor sú podložené dôkazmi.
- [ ] Natívna DSH integrácia a výsledok smoke testu alebo stav `not run` sú podložené dôkazmi.
- [ ] Na prípravu tohto príspevku som nespustil kód životného cyklu pluginu ani balíka.
- [ ] Hviezdičky vyhradeného repozitára sú overiteľné, alebo hviezdičky monorepa používajú
      požadovanú null politiku.
- [ ] Skontroloval som existenciu záznamu a otvoreného pull requestu pre ten istý kanonický plugin.
- [ ] Záznam je explicitne neoficiálny a neobsahuje žiadne tajomstvá ani súkromné osobné údaje.

## Jazyková politika

Dokumentácia vydania a popisy v katalógu sú iba v angličtine. Sprístupnenie v 43 jazykoch zostáva
položkou backlogu po MVP; nepridávajte prázdne jazykové dokumenty ani automatické hromadné preklady.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
