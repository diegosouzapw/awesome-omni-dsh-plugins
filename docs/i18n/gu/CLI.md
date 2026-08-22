# CLI સંદર્ભ — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **ગુજરાતી**

> **બિનસત્તાવાર સામુદાયિક પ્રોજેક્ટ. DeepSeek સાથે સંલગ્ન નથી, તેના દ્વારા સમર્થિત નથી કે પ્રાયોજિત નથી.**
> DeepSeek નામો અને ચિહ્નો તેમના સંબંધિત માલિકના છે.

આ પેજ પ્રકાશિત CLI ને વર્ઝન `1.0.1` માં તે જેવું વર્તે છે બરાબર તેવું દસ્તાવેજીકૃત કરે છે. નીચેના દરેક
સિનોપ્સિસ અને ફ્લેગ પ્રકાશિત કમાન્ડના પોતાના `--help` આઉટપુટમાંથી આવે છે; અહીં કંઈ પણ
અનરિલીઝ્ડ વર્તનનું વર્ણન કરતું નથી. CLI આ રિપોઝિટરીમાં [`cli/`](../../cli) હેઠળ વિકસાવવામાં આવે છે અને
npm પર [`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins) તરીકે રિલીઝ થાય છે, પ્રોવેનન્સ
એટેસ્ટેશન સાથે જે દરેક બિલ્ડને તે બનાવનાર કમિટ અને વર્કફ્લો રન સાથે બાંધે છે.

```bash
npx omni-dsh-plugins --help
```

## v1.0.1 માં ડિઝાઇન સિદ્ધાંતો

- **ડિફોલ્ટ રીતે રીડ-ઓન્લી.** `catalog`, `search`, `info`, `list` અને `doctor` ક્યારેય પ્રોફાઇલ્સ
  બદલતા નથી, ફાઇલો લખતા નથી કે પ્લગિન કોડ ચલાવતા નથી.
- **કોડ એક્ઝિક્યુશન માટે કન્સેન્ટ ગેટ.** `add`, `update` અને `remove` DSH/pnpm લાઇફસાયકલ કોડ
  ચલાવવાનો ઇનકાર કરે છે જ્યાં સુધી તમે `--allow-code-execution` પાસ ન કરો. તેના વિના, વેરિફાઇડ
  પ્લાન જોવા માટે `--dry-run` વાપરો.
- **નેટિવ Windows પોલિસી.** કોડ એક્ઝિક્યુશન સાથેના નેટિવ Windows `add`/`update`/`remove`
  v1.0.1 માં ડિસેબલ છે; વાપરો WSL. ડ્રાય-રન અને રીડ-ઓન્લી કમાન્ડ્સ ઉપલબ્ધ રહે છે, અને નેટિવ
  Windows રિકવરી માર્કર્સને દસ્તાવેજીકૃત મેન્યુઅલ રિકવરીની જરૂર પડે છે.
- **પિન કરેલા ઇનપુટ્સ.** કેટલોગ ઇનપુટ લોકલ ડિરેક્ટરી, સ્નેપશોટ ફાઇલ, અથવા પિન કરેલ પબ્લિક
  સ્નેપશોટ URL હોઈ શકે છે, વૈકલ્પિક રીતે ચોક્કસ 40-અક્ષરના રિવિઝન પર લોક કરેલું.

## સામાન્ય ઓપ્શન્સ

આ ઓપ્શન્સ કેટલોગ-વપરાશ કમાન્ડ્સ પર દેખાય છે (`catalog validate`, `search`, `info`,
`add`, `update`, `remove`, `doctor`):

| ઓપ્શન                   | અર્થ                                                               |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | લોકલ કેટલોગ ડિરેક્ટરી, સ્નેપશોટ ફાઇલ, અથવા પિન કરેલ પબ્લિક સ્નેપશોટ URL |
| `--revision <sha>`        | ચોક્કસ 40-અક્ષરનું સ્નેપશોટ રિવિઝન                                  |
| `--json`                  | સ્થિર JSON આઉટપુટ આપે છે                                          |

ગ્લોબલ ઓપ્શન્સ: `-V, --version` CLI વર્ઝન છાપે છે; `-h, --help` કોઈપણ કમાન્ડ માટે હેલ્પ
છાપે છે (`dsh-plugins help [command]` પણ કામ કરે છે).

## એક્ઝિટ કોડ્સ

CLI પરંપરાગત પ્રોસેસ એક્ઝિટ કોડ્સ વાપરે છે:

| એક્ઝિટ કોડ | અર્થ                                                                       |
| --------: | -------------------------------------------------------------------------- |
| `0`       | સફળતા ("ખાલી પણ માન્ય" પરિણામો સહિત, જેમ કે ખાલી કેટલોગ)                  |
| `1`       | નિષ્ફળતા: વેલિડેશન ભૂલ, એન્ટ્રી ન મળી, જરૂરી ઓપ્શન ખૂટે છે, અથવા ડાયગ્નોસ્ટિક ચેક ભૂલ જાણ કરે છે |

v1.0.1 સાથે જોવાયેલા ઉદાહરણો: માન્ય ખાલી કેટલોગ પર `catalog validate` `0`
સાથે `0 entries valid; catalog is empty` એક્ઝિટ કરે છે; `info <unknown-id>` `1` સાથે `Plugin not found` એક્ઝિટ કરે છે;
`doctor` `1` એક્ઝિટ કરે છે જ્યારે કોઈ ચેક (જેમ કે ખૂટતું `dsh` એક્ઝિક્યુટેબલ) ભૂલ જાણ કરે છે.

## કમાન્ડ્સ

### `catalog` — પબ્લિક કેટલોગ સરફેસ વેલિડેટ કરો

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — કેટલોગ YAML અને સિમેન્ટિક્સ વેલિડેટ કરે છે: સેફ YAML પાર્સિંગ, પબ્લિક
  સ્કીમા, SPDX એક્સપ્રેશન પાર્સિંગ, ચોક્કસ SemVer, SHA-512 SRI, અને ડુપ્લિકેટ ID /
  રિપોઝિટરી-નોડ-પ્લસ-સબપાથ નકાર. તે લોકલ અને રીડ-ઓન્લી છે: તે GitHub સાથે સંપર્ક કરતું
  નથી, રિપોઝિટરી ઓળખ ઉકેલતું નથી કે પિન કરેલા કમિટ પર પુરાવાનું નિરીક્ષણ કરતું નથી. આ એ
  જ કમાન્ડ છે જે `catalog-validation` CI જોબ દરેક કેટલોગ પુલ રિક્વેસ્ટ પર ચલાવે છે.
- **`catalog docs-check [root]`** — જરૂરી પબ્લિક કેટલોગ દસ્તાવેજીકરણ અસ્તિત્વમાં છે અને
  Markdown ફેન્સ સંતુલિત છે તે ચકાસે છે.
- **`catalog github-forms-check [root]`** — સ્ટ્રક્ચર્ડ પબ્લિક GitHub ઇશ્યુ ફોર્મ્સ
  (ક્લેમ, કરેક્શન, રિમૂવલ) ચકાસે છે.

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — પબ્લિક કેટલોગ ફિલ્ડ્સ લોકલી સર્ચ કરો

```text
dsh-plugins search [options] <query...>
```

પસંદ કરેલા કેટલોગ ઇનપુટ સામે પબ્લિક કેટલોગ ફિલ્ડ્સ લોકલી સર્ચ કરે છે. મેચ થતી
એન્ટ્રીઝ છાપે છે, અથવા કંઈ મેચ ન થાય ત્યારે `No plugins found.` (એક્ઝિટ `0`).

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — કેટલોગની બહાર પ્લગિન્સ શોધો

```text
dsh-plugins discover [options] <query...>
```

> `discover` `1.0.0` માં આવે છે, આ પેકેજ નામ હેઠળની પહેલી રિલીઝ.

પહેલા ક્યુરેટ કરેલો કેટલોગ સર્ચ કરે છે, પછી — જ્યાં સુધી `--offline` ન અપાય — લાઇવ GitHub
`dsh-plugin` ટોપિક, જેથી હજુ સબમિટ ન થયેલું પ્લગિન પણ શોધી શકાય. કેટલોગ પરિણામો
કેટલોગ ધરાવે છે તે પુરાવો રાખે છે (પિન કરેલ કમિટ, ક્રિએટર, લાઇસન્સ); સામુદાયિક પરિણામો
તેમાંનું કંઈ રાખતા નથી અને તેમ જ લેબલ થાય છે, કારણ કે તેમના વિશે કંઈ પણ રિવ્યૂ થયેલું નથી.

`--limit <n>` પ્રતિ ટિયર પરિણામો મર્યાદિત કરે છે (ડિફોલ્ટ `8`). `--json` સ્થિર મશીન શેપ આપે છે, જે
ક્યારેય લોકલાઇઝ થતો નથી.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — એક પબ્લિક કેટલોગ એન્ટ્રી બતાવો

```text
dsh-plugins info [options] <id>
```

કેનોનિકલ પ્લગિન ID દ્વારા એક પબ્લિક કેટલોગ એન્ટ્રી બતાવે છે. જ્યારે ID કેટલોગમાં ન હોય ત્યારે
`1` સાથે `Plugin not found: <id>` એક્ઝિટ કરે છે.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — ઓફિશિયલ DSH ડેલિગેશન દ્વારા એક કેટલોગ પ્લગિન ઉમેરો

```text
dsh-plugins add [options] <id>
```

| ઓપ્શન                  | અર્થ                                                               |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | બદલવાનું DSH પ્રોફાઇલ (વ્યવહારમાં જરૂરી; કમાન્ડ તેના વિના ભૂલ આપે છે) |
| `--dry-run`              | ફાઇલો કે સબપ્રોસેસ વિના વેરિફાઇડ પ્લાન બતાવો                       |
| `--allow-code-execution` | DSH/pnpm લાઇફસાયકલ કોડ માટે કન્સેન્ટ (નેટિવ Windows ડિસેબલ; વાપરો WSL) |
| `--catalog` / `--revision` / `--json` | ઉપરના સામાન્ય ઓપ્શન્સ                                    |

આ વર્ઝનમાં ડ્રાય-રન સિમેન્ટિક્સ: કમાન્ડ પિન કરેલી એન્ટ્રી માટે પ્લાન ઉકેલે છે અને વેરિફાય
કરે છે અને છાપે છે, કોઈ ફાઇલો બનાવ્યા વિના અને કોઈ સબપ્રોસેસ ચલાવ્યા વિના. વાસ્તવિક ઇન્સ્ટોલેશન
ઓફિશિયલ DSH ટૂલિંગને ડેલિગેટ થાય છે અને ફક્ત `--allow-code-execution` સાથે આગળ વધે છે.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — ઓફિશિયલ DSH ડેલિગેશન દ્વારા એક કેટલોગ પ્લગિન અપડેટ કરો

```text
dsh-plugins update [options] <id>
```

`add` જેવા જ ઓપ્શન્સ અને કન્સેન્ટ સિમેન્ટિક્સ: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, ઉપરાંત સામાન્ય કેટલોગ ઓપ્શન્સ.

### `remove` — ઓફિશિયલ DSH ડેલિગેશન દ્વારા એક કેટલોગ-મેનેજ્ડ પ્લગિન દૂર કરો

```text
dsh-plugins remove [options] <id>
```

`add` જેવા જ ઓપ્શન્સ અને કન્સેન્ટ સિમેન્ટિક્સ. ફક્ત કેટલોગ-મેનેજ્ડ ઇન્સ્ટોલ્સ જ દૂર થાય છે.

### `recover` — જાળવી રાખેલ POSIX મ્યુટેશન રિકવર કરો

```text
dsh-plugins recover
```

ખંડિત `add`/`update`/`remove` પછી જાળવી રાખેલ POSIX મ્યુટેશન રિકવર કરે છે. કંઈ
બાકી ન હોય ત્યારે તે `No mutation recovery is pending.` છાપે છે અને `0` એક્ઝિટ કરે છે. નેટિવ Windows રિકવરી
દસ્તાવેજીકૃત પોલિસી મુજબ મેન્યુઅલ જ રહે છે.

### `list` — કેટલોગ-મેનેજ્ડ ઇન્સ્ટોલ્સ લિસ્ટ કરો

```text
dsh-plugins list [--profile <name>] [--json]
```

પ્રોફાઇલ્સમાં ફેરફાર કર્યા વિના કેટલોગ-મેનેજ્ડ ઇન્સ્ટોલ્સ લિસ્ટ કરે છે. `--profile <name>` DSH
પ્રોફાઇલ પ્રમાણે ફિલ્ટર કરે છે. કોઈ ઇન્સ્ટોલ ન હોય ત્યારે તે `No catalog-managed plugins installed.`
છાપે છે અને `0` એક્ઝિટ કરે છે.

### `doctor` — રીડ-ઓન્લી ડાયગ્નોસ્ટિક્સ

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

રીડ-ઓન્લી Node, DSH, નેટિવ Windows પોલિસી અને કેટલોગ ડાયગ્નોસ્ટિક્સ ચલાવે છે. દરેક ચેક
`ok` અથવા `error` જાણ કરે છે; કોઈપણ `error` એક્ઝિટ કોડને એકંદરે `1` બનાવે છે. `dsh`
એક્ઝિક્યુટેબલ વિનાની મશીન પર ઉદાહરણ આઉટપુટ:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## લોકલ વેલિડેશન શું સાબિત કરતું નથી

ગ્રીન `catalog validate` રન ફક્ત સ્ટ્રક્ચર અને લોકલ સિમેન્ટિક્સની પુષ્ટિ કરે છે. તે રિમોટ
રિપોઝિટરી ઓળખ, ક્રિએટર માલિકી, કે પિન કરેલા કમિટ પર પુરાવો સાબિત કરતું નથી — મેન્ટેનર્સ
કોઈપણ મર્જ પહેલાં તે અલગ પ્રોવેનન્સ ગેટ્સ લાગુ કરે છે, જે
[CONTRIBUTING.md](../../CONTRIBUTING.md) અને [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md) માં વર્ણવ્યા મુજબ છે.

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
