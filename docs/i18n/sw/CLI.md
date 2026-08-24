# Marejeo ya CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Kiswahili**

> **Mradi usio rasmi wa jamii. Hauhusiani na, haujaidhinishwa na, wala haujafadhiliwa na DeepSeek.**
> Majina na alama za DeepSeek ni mali ya wamiliki wao husika.

Ukurasa huu unaandika CLI iliyochapishwa kama inavyofanya kazi haswa katika toleo `1.0.1`. Kila
muhtasari na bendera iliyo hapa chini inatokana na matokeo ya `--help` ya amri yenyewe iliyochapishwa;
hakuna kitu hapa kinachoelezea tabia isiyochapishwa bado. CLI inaendelezwa katika hazina hii chini ya
[`cli/`](../../cli) na kutolewa kwa npm kama [`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins),
ikiwa na uthibitisho wa asili unaounganisha kila ujenzi na commit na mbio ya mtiririko wa kazi iliyoizalisha.

```bash
npx omni-dsh-plugins --help
```

## Kanuni za muundo katika v1.0.1

- **Kusoma tu kwa chaguomsingi.** `catalog`, `search`, `info`, `list` na `doctor` kamwe hazibadilishi
  wasifu, kuandika faili au kuzindua msimbo wa programu-jalizi.
- **Lango la idhini kwa utekelezaji wa msimbo.** `add`, `update` na `remove` zinakataa kutekeleza
  msimbo wa mzunguko wa maisha wa DSH/pnpm isipokuwa upitishe `--allow-code-execution`. Bila hilo,
  tumia `--dry-run` kuona mpango uliothibitishwa.
- **Sera ya Windows asilia.** `add`/`update`/`remove` za Windows asilia zenye utekelezaji wa msimbo
  zimezimwa katika v1.0.1; tumia WSL. Dry-run na amri za kusoma tu zinabaki zinapatikana, na alama za
  urejeshaji za Windows asilia zinahitaji urejeshaji wa mikono ulioandikwa.
- **Ingizo zilizobandikwa.** Ingizo la katalogi linaweza kuwa saraka ya kienyeji, faili la snapshot,
  au URL ya snapshot ya umma iliyobandikwa, kwa hiari ikifungwa kwa marekebisho halisi ya herufi 40.

## Chaguo za kawaida

Chaguo hizi huonekana kwenye amri zinazotumia katalogi (`catalog validate`, `search`, `info`,
`add`, `update`, `remove`, `doctor`):

| Chaguo                    | Maana                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Saraka ya katalogi ya kienyeji, faili la snapshot, au URL ya snapshot ya umma iliyobandikwa |
| `--revision <sha>`        | Marekebisho halisi ya snapshot ya herufi 40                               |
| `--json`                  | Hutoa matokeo thabiti ya JSON                                            |

Chaguo za kimataifa: `-V, --version` huchapisha toleo la CLI; `-h, --help` huchapisha msaada kwa amri
yoyote (`dsh-plugins help [command]` pia inafanya kazi).

## Misimbo ya kutoka

CLI hutumia misimbo ya kawaida ya kutoka kwa mchakato:

| Msimbo wa kutoka | Maana                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Mafanikio (ikiwa ni pamoja na matokeo "tupu lakini halali" kama katalogi tupu)     |
| `1`       | Kushindwa: hitilafu ya uthibitishaji, kiingilio hakijapatikana, chaguo linalohitajika halipo, au ukaguzi wa utambuzi unaoripoti hitilafu |

Mifano iliyoonwa na v1.0.1: `catalog validate` kwenye katalogi tupu halali hutoka `0` ikiwa na
`0 entries valid; catalog is empty`; `info <unknown-id>` hutoka `1` ikiwa na `Plugin not found`;
`doctor` hutoka `1` wakati ukaguzi wowote (kama vile kutokuwepo kwa kitoa amri cha `dsh`) unaporipoti
hitilafu.

## Amri

### `catalog` — thibitisha nyuso za umma za katalogi

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — huthibitisha YAML na semantiki za katalogi: uchambuzi salama wa YAML,
  schema ya umma, uchambuzi wa usemi wa SPDX, SemVer halisi, SRI ya SHA-512, na kukataliwa kwa ID
  rudufu / funguo rasmi za repository-node-plus-subpath. Ni ya kienyeji na ya kusoma tu: haiwasiliani
  na GitHub, haitatui utambulisho wa hazina wala kukagua ushahidi kwenye commit iliyobandikwa. Hii ndiyo
  amri ile ile ambayo kazi ya CI ya `catalog-validation` huendesha kwenye kila pull request ya katalogi.
- **`catalog docs-check [root]`** — hukagua kwamba nyaraka za umma za katalogi zinazohitajika zipo na
  kwamba fences za Markdown ziko sawia.
- **`catalog github-forms-check [root]`** — hukagua fomu za umma za masuala ya GitHub zilizopangwa
  (dai, marekebisho, uondoaji).

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — tafuta sehemu za umma za katalogi kienyeji

```text
dsh-plugins search [options] <query...>
```

Hutafuta sehemu za umma za katalogi kienyeji dhidi ya ingizo la katalogi lililochaguliwa. Huchapisha
viingilio vinavyolingana, au `No plugins found.` (kutoka `0`) wakati hakuna kinacholingana.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — pata programu-jalizi zaidi ya katalogi

```text
dsh-plugins discover [options] <query...>
```

> `discover` ilitolewa katika `1.0.0`, toleo la kwanza chini ya jina hili la kifurushi.

Hutafuta katalogi iliyokusanywa kwanza, kisha — isipokuwa `--offline` itolewe — mada hai ya GitHub ya
`dsh-plugin`, ili programu-jalizi ambayo haijawasilishwa bado iweze kupatikana. Matokeo ya katalogi
hubeba ushahidi ambao katalogi inayo (commit iliyobandikwa, muumba, leseni); matokeo ya jamii hayabebi
chochote na huwekwa lebo hivyo, kwa sababu hakuna kitu kuhusu yacho ambacho kimekaguliwa.

`--limit <n>` huweka kikomo cha matokeo kwa kila ngazi (chaguomsingi `8`). `--json` hutoa umbo thabiti
la mashine, ambalo kamwe halitafsiriwa.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — onyesha kiingilio kimoja cha umma cha katalogi

```text
dsh-plugins info [options] <id>
```

Huonyesha kiingilio kimoja cha umma cha katalogi kwa ID rasmi ya programu-jalizi. Hutoka `1` ikiwa na
`Plugin not found: <id>` wakati ID haipo katika katalogi.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — ongeza programu-jalizi moja ya katalogi kupitia uwakilishi rasmi wa DSH

```text
dsh-plugins add [options] <id>
```

| Chaguo                   | Maana                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | Wasifu ya DSH ya kubadilisha (inahitajika vitendo; amri hutoa hitilafu bila hiyo) |
| `--dry-run`              | Onyesha mpango uliothibitishwa bila faili au michakato midogo               |
| `--allow-code-execution` | Idhini kwa msimbo wa mzunguko wa maisha wa DSH/pnpm (Windows asilia imezimwa; tumia WSL) |
| `--catalog` / `--revision` / `--json` | Chaguo za kawaida hapo juu                                  |

Semantiki ya dry-run katika toleo hili: amri hutatua na kuthibitisha mpango kwa kiingilio kilichobandikwa
na kuuchapisha, bila kuunda faili wala kuzindua michakato midogo. Usakinishaji halisi huwakilishwa kwa
zana rasmi za DSH na huendelea tu kwa `--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — sasisha programu-jalizi moja ya katalogi kupitia uwakilishi rasmi wa DSH

```text
dsh-plugins update [options] <id>
```

Chaguo na semantiki za idhini zile zile kama `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, pamoja na chaguo za kawaida za katalogi.

### `remove` — ondoa programu-jalizi moja inayosimamiwa na katalogi kupitia uwakilishi rasmi wa DSH

```text
dsh-plugins remove [options] <id>
```

Chaguo na semantiki za idhini zile zile kama `add`. Ni usakinishaji unaosimamiwa na katalogi pekee
unaondoolewa.

### `recover` — rejesha mabadiliko ya POSIX yaliyobaki

```text
dsh-plugins recover
```

Hurejesha mabadiliko ya POSIX yaliyobaki baada ya `add`/`update`/`remove` iliyokatishwa. Ikiwa hakuna
kilichosubiri, huchapisha `No mutation recovery is pending.` na kutoka `0`. Urejeshaji wa Windows
asilia unabaki wa mikono, kulingana na sera iliyoandikwa.

### `list` — orodhesha usakinishaji unaosimamiwa na katalogi

```text
dsh-plugins list [--profile <name>] [--json]
```

Huuorodhesha usakinishaji unaosimamiwa na katalogi bila kubadilisha wasifu. `--profile <name>`
huchuja kwa wasifu ya DSH. Ikiwa hakuna usakinishaji, huchapisha `No catalog-managed plugins installed.`
na kutoka `0`.

### `doctor` — utambuzi wa kusoma tu

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Huendesha utambuzi wa kusoma tu wa Node, DSH, sera ya Windows asilia na katalogi. Kila ukaguzi
huripoti `ok` au `error`; `error` yoyote hufanya msimbo wa jumla wa kutoka uwe `1`. Mfano wa matokeo
kwenye mashine isiyo na kitoa amri cha `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Uthibitishaji wa kienyeji haushuhudii nini

Mbilio ya kijani ya `catalog validate` huhakikisha muundo na semantiki za kienyeji pekee. Haishuhudii
utambulisho wa hazina ya mbali, umiliki wa muumba, wala ushahidi kwenye commit iliyobandikwa —
wasimamizi hutumia malango hayo tofauti ya asili kabla ya kuunganisha chochote, kama ilivyoelezwa
katika [CONTRIBUTING.md](../../CONTRIBUTING.md) na [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
