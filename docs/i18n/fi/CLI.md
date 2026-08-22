# CLI-referenssi — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Suomi**

> **Epävirallinen yhteisöprojekti. Ei liity DeepSeekiin eikä DeepSeek ole hyväksynyt tai sponsoroinut sitä.**
> DeepSeekin nimet ja tunnukset kuuluvat niiden omistajalle.

Tämä sivu dokumentoi julkaistun CLI:n täsmälleen sellaisena kuin se toimii versiossa `1.0.1`.
Jokainen tiivistelmä ja lippu alla on peräisin julkaistun komennon omasta `--help`-tulosteesta;
mikään täällä ei kuvaa julkaisematonta toimintaa. CLI:tä kehitetään tässä repositoriossa
hakemistossa [`cli/`](../../cli), ja se julkaistaan npm:ään nimellä
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins) provenienssiattestilla, joka
sitoo jokaisen buildin sen tuottaneeseen committiin ja workflow-ajoon.

```bash
npx omni-dsh-plugins --help
```

## Suunnitteluperiaatteet versiossa v1.0.1

- **Oletuksena vain luku.** `catalog`, `search`, `info`, `list` ja `doctor` eivät koskaan muuta
  profiileja, kirjoita tiedostoja tai käynnistä liitännäiskoodia.
- **Suostumusportti koodin suoritukselle.** `add`, `update` ja `remove` kieltäytyvät ajamasta
  DSH/pnpm-elinkaarikoodia, ellet anna lippua `--allow-code-execution`. Ilman sitä käytä
  `--dry-run` nähdäksesi varmennetun suunnitelman.
- **Natiivin Windowsin käytäntö.** Natiivin Windowsin `add`/`update`/`remove` koodin suorituksella
  on poistettu käytöstä versiossa v1.0.1; käytä WSL:ää. Kuivaharjoitus ja vain luku -komennot
  pysyvät käytettävissä, ja natiivin Windowsin palautusmerkit vaativat dokumentoidun manuaalisen
  palautuksen.
- **Kiinnitetyt syötteet.** Katalogisyöte voi olla paikallinen hakemisto, snapshot-tiedosto tai
  kiinnitetty julkinen snapshot-URL, valinnaisesti lukittuna tarkkaan 40-merkkiseen revisioon.

## Yhteiset optiot

Nämä optiot esiintyvät katalogia kuluttavissa komennoissa (`catalog validate`, `search`, `info`,
`add`, `update`, `remove`, `doctor`):

| Optio                     | Merkitys                                                           |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Paikallinen katalogihakemisto, snapshot-tiedosto tai kiinnitetty julkinen snapshot-URL |
| `--revision <sha>`        | Tarkka 40-merkkinen snapshot-revisio                               |
| `--json`                  | Tulostaa vakaan JSON-tulosteen                                     |

Globaalit optiot: `-V, --version` tulostaa CLI:n version; `-h, --help` tulostaa ohjeen mille
tahansa komennolle (`dsh-plugins help [command]` toimii myös).

## Poistumiskoodit

CLI käyttää tavanomaisia prosessin poistumiskoodeja:

| Poistumiskoodi | Merkitys                                                                   |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Onnistuminen (mukaan lukien "tyhjä mutta kelvollinen" -tulokset, kuten tyhjä katalogi) |
| `1`       | Epäonnistuminen: validointivirhe, merkintää ei löytynyt, vaadittu optio puuttuu tai diagnostinen tarkistus raportoi virheen |

Versiossa v1.0.1 havaittuja esimerkkejä: `catalog validate` kelvolliselle tyhjälle katalogille
poistuu koodilla `0` tulosteella `0 entries valid; catalog is empty`; `info <unknown-id>` poistuu
koodilla `1` tulosteella `Plugin not found`; `doctor` poistuu koodilla `1`, kun mikä tahansa
tarkistus (kuten puuttuva `dsh`-suoritettava) raportoi virheen.

## Komennot

### `catalog` — validoi julkisen katalogin pinnat

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — validoi katalogin YAML:n ja semantiikan: turvallinen YAML-jäsennys,
  julkinen skeema, SPDX-lausekkeiden jäsennys, tarkka SemVer, SHA-512 SRI ja duplikaattien
  ID:iden / repositorion-solmu-plus-alipolku-avainten hylkäys. Se on paikallinen ja vain luku
  -tilainen: se ei ota yhteyttä GitHubiin, selvitä repositorion identiteettiä eikä tarkista
  todisteita kiinnitetyssä commitissa. Tämä on täsmälleen sama komento, jonka
  `catalog-validation`-CI-työ ajaa jokaiselle katalogi-pull-requestille.
- **`catalog docs-check [root]`** — tarkistaa, että vaadittu julkinen katalogidokumentaatio on
  olemassa ja että Markdown-koodilohkot ovat tasapainossa.
- **`catalog github-forms-check [root]`** — tarkistaa strukturoidut julkiset
  GitHub-issue-lomakkeet (claim, correction, removal).

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — hae julkisen katalogin kentistä paikallisesti

```text
dsh-plugins search [options] <query...>
```

Hakee julkisen katalogin kentistä paikallisesti valittua katalogisyötettä vasten. Tulostaa
vastaavat merkinnät, tai `No plugins found.` (poistuminen `0`), kun mikään ei vastaa.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — löydä liitännäisiä katalogin ulkopuolelta

```text
dsh-plugins discover [options] <query...>
```

> `discover` sisältyy versioon `1.0.0`, ensimmäiseen julkaisuun tällä paketin nimellä.

Hakee ensin kuratoidusta katalogista ja sen jälkeen — ellei `--offline` ole annettu — elävästä
GitHubin `dsh-plugin`-aiheesta, jotta liitännäinen, jota ei ole vielä lähetetty, on silti
löydettävissä. Katalogitulokset kantavat katalogin hallussaan olevat todisteet (kiinnitetty
commit, luoja, lisenssi); yhteisötulokset eivät kanna mitään niistä, ja ne on merkitty
sellaisiksi, koska mitään niiden osalta ei ole tarkastettu.

`--limit <n>` rajoittaa tuloksia per taso (oletus `8`). `--json` tulostaa vakaan konemuodon,
jota ei koskaan lokalisoitaisiin.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — näytä yksi julkinen katalogimerkintä

```text
dsh-plugins info [options] <id>
```

Näyttää yhden julkisen katalogimerkinnän kanonisen liitännäis-ID:n perusteella. Poistuu koodilla
`1` tulosteella `Plugin not found: <id>`, kun ID ei ole katalogissa.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — lisää yksi katalogiliitännäinen virallisen DSH-delegoinnin kautta

```text
dsh-plugins add [options] <id>
```

| Optio                    | Merkitys                                                           |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | Muutettava DSH-profiili (käytännössä vaadittu; komento epäonnistuu ilman sitä) |
| `--dry-run`              | Näytä varmennettu suunnitelma ilman tiedostoja tai aliprosesseja   |
| `--allow-code-execution` | Suostumus DSH/pnpm-elinkaarikoodiin (natiivi Windows poistettu käytöstä; käytä WSL:ää) |
| `--catalog` / `--revision` / `--json` | Yhteiset optiot yllä                                 |

Kuivaharjoituksen semantiikka tässä versiossa: komento selvittää ja varmentaa suunnitelman
kiinnitetylle merkinnälle ja tulostaa sen luomatta tiedostoja ja käynnistämättä aliprosesseja.
Varsinainen asennus delegoidaan virallisille DSH-työkaluille ja etenee vain lipulla
`--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — päivitä yksi katalogiliitännäinen virallisen DSH-delegoinnin kautta

```text
dsh-plugins update [options] <id>
```

Samat optiot ja suostumussemantiikka kuin komennossa `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution` sekä yhteiset katalogioptiot.

### `remove` — poista yksi katalogin hallinnoima liitännäinen virallisen DSH-delegoinnin kautta

```text
dsh-plugins remove [options] <id>
```

Samat optiot ja suostumussemantiikka kuin komennossa `add`. Vain katalogin hallinnoimat
asennukset poistetaan.

### `recover` — palauta säilytetty POSIX-muutos

```text
dsh-plugins recover
```

Palauttaa säilytetyn POSIX-muutoksen keskeytetyn `add`/`update`/`remove`-komennon jälkeen. Kun
mitään ei ole vireillä, se tulostaa `No mutation recovery is pending.` ja poistuu koodilla `0`.
Natiivin Windowsin palautus pysyy manuaalisena, dokumentoidun käytännön mukaisesti.

### `list` — listaa katalogin hallinnoimat asennukset

```text
dsh-plugins list [--profile <name>] [--json]
```

Listaa katalogin hallinnoimat asennukset muuttamatta profiileja. `--profile <name>` suodattaa
DSH-profiilin mukaan. Ilman asennuksia se tulostaa `No catalog-managed plugins installed.` ja
poistuu koodilla `0`.

### `doctor` — vain luku -diagnostiikka

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Ajaa vain luku -tilaisen Noden, DSH:n, natiivin Windowsin käytännön ja katalogin diagnostiikan.
Jokainen tarkistus raportoi `ok` tai `error`; mikä tahansa `error` tekee kokonaispoistumiskoodin
`1`. Esimerkkituloste koneella, jolla ei ole `dsh`-suoritettavaa:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Mitä paikallinen validointi ei todista

Vihreä `catalog validate` -ajo vahvistaa vain rakenteen ja paikallisen semantiikan. Se ei todista
etärepositorion identiteettiä, luojan omistajuutta eikä todisteita kiinnitetyssä commitissa —
ylläpitäjät soveltavat näitä erillisiä alkuperäportteja ennen jokaista yhdistämistä, kuten
kuvataan tiedostoissa [CONTRIBUTING.md](../../CONTRIBUTING.md) ja
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
