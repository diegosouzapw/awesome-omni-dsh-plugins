# Hozzájárulás

> 🌐 [English](../../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Magyar**

> **Nem hivatalos közösségi projekt. Nem áll kapcsolatban a DeepSeekkel, és nem az ő jóváhagyásával vagy támogatásával készült.**
> A DeepSeek nevek és védjegyek a megfelelő tulajdonosaik tulajdonát képezik.

Köszönjük, hogy fejleszted a katalógust. A hozzájárulások alkotó-központúak: használj eredeti
repository-bizonyítékokat, őrizd meg a jóváírást, és tartsd minden bővítményt önállóan
átvizsgálhatóként. A katalógus szándékosan üresen indul; egyetlen bejegyzés sem kerül elfogadásra
saját, átvizsgált pull request nélkül.

## Kezdd az alkotóval

Mindig az a pull request preferált, amelyet közvetlenül a bővítmény alkotója vagy a tulajdonos
szervezet nyit meg. Ha az alkotó kész hozzájárulni, használd az ő branch-ét és pull requestjét
ahelyett, hogy egy kurátori vagy automatizálási branch-ben újra elkészítenéd a munkáját.

A közösségi kurálás akkor is szívesen látott, ha olyan alkotónak segít, aki még nem nyitott pull
requestet. Ez nem alapoz meg tulajdonjogot vagy elsőbbséget egy későbbi, közvetlen alkotói
hozzájárulással szemben.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Egy bővítmény branch-enként és pull requestenként

Hozz létre egy dedikált branch-et egyetlen bővítményhez, és nyiss egyetlen pull requestet abból a
branch-ből. A branch-nek és a pull requestnek pontosan egy YAML-fájlt kell létrehoznia vagy
módosítania a `catalog/plugins/` alatt. Ne keverj bele bővítményeket, dokumentáció-tisztítást,
generált indexeket vagy nem kapcsolódó karbantartást abba a branch-be vagy pull requestbe.

A bejegyzés ID-jának és a fájlnévnek ugyanannak a kisbetűs kebab-case értéknek kell lennie. A
karbantartók egyenként vizsgálják át és egyesítik minden bővítmény pull requestjét; egy több
bővítményt tartalmazó köteget nem osztanak fel, és nem egyesítenek részlegesen.

## Oldd fel az eredeti forrást

Minden nyilvános mezőt az eredeti alkotó repository-jából, csomagjából, manifesztjéből,
README-jéből, licenszéből vagy release-éből kell újraépíteni, a rögzített commitnál. Ne másold le
egy másik katalógus vagy aggregátor szövegét, kategória-besorolását, képernyőképeit, rangsorát,
jelvényeit vagy generált metaadatait. Egy ernyőprojektben, marketplace-en, listán vagy
aggregátorban talált link csak nyom, nem bizonyíték, és nem a bővítmény forrása.

Soha ne nyújts be ernyőprojektet, aggregátort, marketplace-et, telepítő-katalógust vagy listát
katalógusbejegyzésként, még akkor sem, ha az önállóan telepíthető. Használd csak nyomként, és
minden önállóan telepíthető gyermek-bővítményt oldj fel a valódi alkotójáig és eredeti
repository-jáig egyenként. Egy bővítmény az alkotójának valódi monorepójában a saját pontos
subpath-jából is benyújtható, de ehhez követnie kell az alábbi monorepo-csillagszabályzatot.

## Kötelező bizonyítékok

A pull requestben add meg mindezt:

- Az eredeti repository kanonikus nyilvános URL-jét és annak immutábilis repository node ID-ját.
  A karbantartók a node ID-t a külön eredetiség-kapuban oldják fel, és ott utasítják el az
  URL-eltéréseket.
- Az alkotó nyilvános GitHub handle-jét és az annak megfelelő nyilvános profil URL-jét. A YAML a
  handle-t egyszer tárolja; a profil URL-je `https://github.com/<handle>` formában származtatott.
- Egy teljes, 40 karakteres forráscommit OID-t és a bővítmény pontos subpath-ját, vagy `null`
  értéket egy repository-gyökérben lévő bővítmény esetén.
- Egy korlátozott angol nyelvű leírást és annak bizonyítási útvonalát a rögzített commitnál.
- Az artefaktum `kind`-ját, az elsődleges kategóriáját és a
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md) fájlból választott címkéket.
- Az upstream teljes SPDX licenckifejezését, bizonyítva a rögzített commitnál.
- Egy kanonikus telepítési deszkriptort, amely vagy egy pontos npm-verzióhoz, vagy a
  forrás-repository-hoz, a teljes commithoz és a subpath-hoz van rögzítve. A deszkriptor adat,
  soha nem shell-parancs.
- Natív DSH-integrációs bizonyítékot és annak útvonalát a rögzített commitnál.
- Meglévő, nem érzékeny smoke-teszt bizonyítékot pontosan ahhoz az artefaktum-pinhez, vagy az
  explicit `not run` értéket. Ne telepítsd a bővítményt, és ne futtasd a `preinstall`, `install`,
  `postinstall`, `prepare` vagy más csomag-/bővítmény-életciklus kódot csupán egy
  katalógus-hozzájárulás előkészítése céljából.
- Egy dedikált repository esetén a pontosan ahhoz a repository-hoz tartozó, ellenőrizhető
  csillagszámot, a nyilvános forrással és az ellenőrzés időpontjával együtt. Egy monorepo-bővítmény
  esetén használd az alábbi kötelező null-szabályzatot.
- Nyilvános Discussion vagy komment eredetiséget, ha van; egyébként használj `null` értéket.
- A géppel olvasható `unofficial: true` értéket.

Ha nem létezik megfelelő smoke-teszt, használd a `verification.status: eligible` és a
`verification.smokeTest: null` értéket. A `verified` állapotot csak akkor használd, ha
átvizsgálható smoke-teszt bizonyíték létezik pontosan ahhoz a pinhez. Egyik állapot sem
jóváhagyás vagy biztonsági tanúsítvány.

Soha ne nyújts be hitelesítő adatokat, cookie-kat, privát e-mail-címeket, nem publikált
forráskódot vagy más titkokat.

## YAML- és sémaszabályok

Hozd létre a `catalog/plugins/<plugin-id>.yaml` fájlt, és validáld a
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) séma ellen. Az `id`-nak meg kell
egyeznie a fájl alapnevével, és a saját névtereddel kell kezdődnie: a `creator.github` handle-ed
kisbetűsített formájával (az `[a-z0-9]`-on kívüli karakterek bármely sorozata egyetlen `-`-lesz),
majd egy `-`-lel folytatva; például `some-creator-my-plugin` a `Some-Creator` handle esetén. A
katalógusvalidáció mindkettőt kikényszeríti. A séma a mezőnevek és a megengedett értékek hiteles
forrása; a [docs/CATEGORIES.md](../../docs/CATEGORIES.md) határozza meg, hogyan válaszd ki az
egyetlen artefaktum-`kind`-ot, az elsődleges kategóriát, a címkéket és a repository-hatókört.

Egy npm-deszkriptornak érvényes csomagnevet és pontos verziót kell tartalmaznia. A nyilvános séma
elutasítja az opció-szerű és nem korlátozott értékeket, de nem valósítja meg újra a SemVert vagy
az SRI-t: a katalógusvalidációnak kell interpretálnia a verziót, pontos SemVert megkövetelnie, és
bármely integritásértéket érvényes SHA-512 SRI-ként interpretálnia. Egy forrás-deszkriptor a
`source.repository`, a `source.commit` és a `source.subpath` mezőkhöz van kötve, a mutábilis
forrásértékek duplikálása nélkül.

A telepítőknek argumentum-tömböket kell használniuk, le kell tiltaniuk a shell-végrehajtást, és
opció-terminátort kell elhelyezniük a katalógus által megadott pozicionális értékek előtt, ahol a
meghívott parancs ezt támogatja. A beküldési validáció nem hívhat meg telepítőt vagy
bővítmény-életciklust.

<!-- catalog-validation:local-structure-and-semantics-only -->

A `catalog validate` egy helyi, csak olvasható, strukturális és szemantikai ellenőrzés. Biztonságos
YAML-t interpretál, validálja a nyilvános sémát, interpretálja az SPDX-kifejezéseket, pontos
SemVert és érvényes SHA-512 SRI-t követel meg, és elutasítja a duplikált ID-kat és a kanonikus
repository-node-plusz-subpath kulcsokat. Nem lép kapcsolatba a GitHubbal, nem oldja fel a
repository-azonosságot, és nem vizsgálja meg a bizonyítási útvonalakat a rögzített commitnál.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Mielőtt egy bejegyzés elérné az `eligible` állapotot, a karbantartók külön feloldják a kanonikus
repository-t és a node ID-t, összekötik az alkotót az eredeti forrással, és megvizsgálják a
deklarált leírást, licencet, DSH-integrációt és smoke-teszt bizonyítékot a `source.commit`-nál.
Egy helyi, zöld validációs eredmény nem eredetiség- vagy származásbizonyíték.

## Repository-csillagok

Csak a bővítmény pontos, dedikált repository-jához verifikáltan tartozó csillagok rögzíthetők.
Egy szülőprojekt csillagai soha nem tulajdoníthatók egy szélesebb monorepón belül tárolt
bővítménynek. Egy monorepo-bejegyzés a katalógus funkcionális szekcióihoz jogosult marad, de
deklarálnia kell:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Egy dedikált bejegyzés a `repositoryScope: dedicated`, a `starsPolicy: exact-repository` és az
ugyanazon repository-n megfigyelt, nem negatív csillagszámot használja. Olvasd el a
[docs/RANKING.md](../../docs/RANKING.md) fájlt, mielőtt népszerűségi adatokat nyújtanál be.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Alkotói elsőbbség és tiszteletteljes kapcsolatfelvétel

Ugyanahhoz a kanonikus bővítményhez az elsőbbség sorrendje:

1. Az alkotó vagy a tulajdonos szervezet által nyitott pull request.
2. Az alkotó által kifejezetten jóváhagyott közösségi pull request.
3. Egy meglévő, érvényes közösségi kurátori pull request.
4. Egy katalógus-automatizálási pull request.

Egy közvetlen alkotói pull request felülírja bármely nyitott kurátori vagy automatizálási pull
requestet, függetlenül attól, hogy melyiket nyitották meg előbb, vagy melyik áll előrébb. Az
alkotó pull requestje válik az átvizsgálás eszközévé; a karbantartók nem force-pusholnak az alkotó
branch-ébe, és nem ültetik át a munkáját a kurált pull requestbe. Ha egy kurált bejegyzés már
egyesítve lett, a nyilvános történelmet nem írják át. Az alkotó igénybe vehet egy igénylési vagy
javítási kérelmet, majd közvetlenül hozzájárulhat egy followup pull requesttel.

Egy kurált pull requestnek egyetlen tiszteletteljes, nyilvános `@alkotó` említést kell használnia
a leírásában, az eredeti repository-ra mutató link mellett, meghívva az alkotót, hogy vizsgálja
át, vagy cserélje le egy közvetlen pull requestre. Ne ismételd meg az említést, ne nyiss
promóciós issue-kat, ne kereszt-posztolj, ne küldj nem kért közvetlen üzeneteket, és semmilyen más
módon ne spammeld az alkotót.

<!-- creator-first:source-bound-git-identity -->

Az alkotó által írt pull requestek és commitok természetes módon megőrzik az alkotói jóváírást. A
kurált commitok csak forráshoz kötött, nyilvánosan verifikálható identitással használhatják az
alkotó Git-szerzőségét vagy egy `Co-authored-by` trailert. Soha ne találj ki vagy tippelj meg egy
e-mail-címet. Ha nem áll rendelkezésre verifikált Git-identitás, a kurátor szerzi a commitot, és
explicit "Created by @handle" jóváírást ad, az eredeti repository linkjével a YAML-ban és a pull
requestben. Egy karbantartói vagy automatizálási fiók lehet committer vagy verifikált szerzőtárs,
de nem helyettesítheti az alkotó szerzőségét. Lásd [docs/CREDIT.md](../../docs/CREDIT.md) a teljes
szabályzatért.

## Validációs parancsok és elérhetőség

Az npm CLI `omni-dsh-plugins@1.0.1` néven van publikálva, így az alábbi parancsok ma is
elérhetők `npx`-en keresztül. Használd őket pontosan úgy, ahogy le vannak írva; a
hozzájárulóknak nem szabad helyettesítő parancsokat kitalálniuk.

Futtasd ezeket a parancsokat a repository gyökeréből:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

A `catalog validate` csak a fent leírt helyi YAML-, séma-, SPDX-, pontos SemVer-, SHA-512 SRI- és
duplikátum-ellenőrzéseket végzi el, és elfogadja a szándékosan nulla bejegyzést tartalmazó
katalógust. Nem bizonyítja a távoli repository-azonosságot vagy a rögzített forrásbizonyítékot. A
többi parancs a kötelező nyilvános dokumentációt és a strukturált GitHub issue-űrlapokat
ellenőrzi. Ezeknek a parancsoknak a helyi átfutása nem lazítja meg a bizonyítási
követelményeket; a karbantartók egyesítés előtt továbbra is alkalmazzák a megfelelő minden
release-kaput.

## Átvizsgálási kapuk, ütközések és egyesítés

A karbantartók minden kaput alkalmaznak a pull request aktuális commitjára, mielőtt egyesítenék:

1. **Hatókör:** egy dedikált branch, egy bővítmény-YAML fájl, és semmi nem kapcsolódó változtatás.
2. **Eredeti azonosság:** az alkotó, a kanonikus repository, a node ID, a teljes commit és a
   subpath egyeznek.
3. **Séma és bizonyíték:** a YAML, a kategóriák, az SPDX, a telepítési pin, a DSH-bizonyíték és a
   smoke-státusz belsőleg konzisztensek, bővítmény-életciklus-kód futtatása nélkül.
4. **Népszerűség:** a dedikált csillagok verifikálhatók a pontos repository-n, vagy a
   monorepo-csillagok `null` értékűek, `undefined-parent-repository` szabályzattal.
5. **Dokumentáció és űrlapok:** a nyilvános dokumentáció, a Markdown-fence-ek és a strukturált
   űrlapok érvényesek maradnak.
6. **Ütközés és deduplikáció:** egyetlen egyesített bejegyzés vagy nyitott pull request sem
   képviseli ugyanazt a kanonikus bővítményt.

A különböző nevek vagy ID-k nem teszik megkülönböztethetővé a duplikált bővítményeket. Kezeld
ütközésként ugyanazt a repository node ID-t és subpath-ot, ugyanazt a kanonikus csomagot, vagy más,
bizonyíthatóan azonos telepítési célpontot. Oldd fel az aliasokat és a versengő pull requesteket
egyesítés előtt. Egy közvetlen alkotói pull request nyer egy kurálással vagy automatizálással
szembeni ütközést; egyébként a karbantartók kiválasztanak egy átvizsgálási eszközt, és lezárják
vagy átirányítják a duplikátumokat ahelyett, hogy mindkettőt egyesítenék.

Csak egy karbantartó egyesít egy bővítményt, miután minden kapu teljesült. Minden elfogadott
bővítmény egyenként kerül egyesítésre; a validáció, a kurálás vagy az automatizálás nem jelent
automatikus vagy köteges egyesítést.

## Pull request checklist

- [ ] Egy dedikált branch-et használtam, és ez a PR pontosan egy bővítménybejegyzést változtat.
- [ ] A forrás az eredeti alkotó repository-ja, nem egy ernyőprojekt vagy aggregátor.
- [ ] Az alkotó handle-je/profilja, a repository, a node ID, a subpath és a teljes commit
      bizonyítottak.
- [ ] A kind, a kategória és a címkék a `docs/CATEGORIES.md` fájlt követik.
- [ ] Az SPDX-licenc és a rögzített telepítési deszkriptor bizonyítottak.
- [ ] A natív DSH-integráció és a smoke-eredmény vagy a `not run` státusz bizonyítottak.
- [ ] Nem futtattam bővítmény- vagy csomag-életciklus-kódot ennek a hozzájárulásnak az
      előkészítéséhez.
- [ ] A dedikált csillagok verifikálhatók, vagy a monorepo-csillagok a kötelező null-szabályzatot
      használják.
- [ ] Ellenőriztem, hogy létezik-e már bejegyzés és nyitott pull request ugyanahhoz a kanonikus
      bővítményhez.
- [ ] A bejegyzés kifejezetten nem hivatalos, és nem tartalmaz titkokat vagy privát személyes
      adatokat.

## Nyelvi szabályzat

Az indítási dokumentáció és a katalógusleírások kizárólag angol nyelvűek. A 43 lokál-kiadás
MVP utáni backlog-elem marad; ne adj hozzá üres locale-dokumentumokat vagy automatikus,
tömeges fordításokat.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
