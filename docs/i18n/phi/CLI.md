# Sanggunian ng CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Filipino**

> **Hindi opisyal na proyekto ng komunidad. Walang kaugnayan sa, hindi inendorso, at hindi itinataguyod ng DeepSeek.**
> Ang mga pangalan at marka ng DeepSeek ay pag-aari ng kani-kanilang may-ari.

Dinokumento ng pahinang ito ang inilathalang CLI nang eksakto tulad ng pag-uugali nito sa
bersyon `1.0.1`. Ang bawat synopsis at flag sa ibaba ay mula sa sariling `--help` output ng
inilathalang command; wala rito ang naglalarawan ng hindi pa inilalathalang pag-uugali. Ang
CLI ay binuo sa repository na ito sa ilalim ng [`cli/`](../../cli) at inilabas sa npm bilang
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), na may provenance
attestation na nagbubuklod ng bawat build sa commit at workflow run na gumawa nito.

```bash
npx omni-dsh-plugins --help
```

## Mga prinsipyo ng disenyo sa v1.0.1

- **Read-only bilang default.** Hindi kailanman magbabago ng profile, magsusulat ng file, o
  magpapatatakbo ng plugin code ang `catalog`, `search`, `info`, `list`, at `doctor`.
- **Consent gate para sa pagpapatakbo ng code.** Tatanggihan ng `add`, `update`, at `remove`
  na patakbuhin ang DSH/pnpm lifecycle code maliban kung ipapasa ninyo ang
  `--allow-code-execution`. Kung wala nito, gamitin ang `--dry-run` para makita ang
  naberipikang plano.
- **Patakaran ng native Windows.** Ang native Windows `add`/`update`/`remove` na may
  pagpapatakbo ng code ay naka-disable sa v1.0.1; gamitin ang WSL. Ang dry-run at mga
  read-only command ay mananatiling available, at ang native Windows recovery marker ay
  nangangailangan ng naka-dokumentong manual recovery.
- **Nakapirming input.** Ang input ng katalogo ay maaaring lokal na direktoryo, snapshot
  file, o nakapirming pampublikong snapshot URL, na opsyonal na nakakandado sa eksaktong
  40-character revision.

## Mga karaniwang opsyon

Ang mga opsyong ito ay lumalabas sa mga command na kumokonsumo ng katalogo
(`catalog validate`, `search`, `info`, `add`, `update`, `remove`, `doctor`):

| Opsyon                    | Kahulugan                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Lokal na direktoryo ng katalogo, snapshot file, o nakapirming pampublikong snapshot URL |
| `--revision <sha>`        | Eksaktong 40-character snapshot revision                               |
| `--json`                  | Naglalabas ng matatag na JSON output                                            |

Global na opsyon: `-V, --version` ay nagpapakita ng bersyon ng CLI; `-h, --help` ay
nagpapakita ng tulong para sa anumang command (gumagana rin ang `dsh-plugins help [command]`).

## Mga exit code

Gumagamit ang CLI ng kumbensyonal na exit code ng proseso:

| Exit code | Kahulugan                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Tagumpay (kabilang ang mga resultang "walang laman ngunit wasto" tulad ng walang-lamang katalogo)     |
| `1`       | Pagkabigo: validation error, hindi natagpuan ang entry, nawawalang kinakailangang opsyon, o isang diagnostic check na nag-uulat ng error |

Mga halimbawang naobserbahan sa v1.0.1: ang `catalog validate` sa isang wastong walang-lamang
katalogo ay lumalabas ng `0` na may `0 entries valid; catalog is empty`; ang
`info <unknown-id>` ay lumalabas ng `1` na may `Plugin not found`; ang `doctor` ay lumalabas
ng `1` kapag ang anumang check (tulad ng nawawalang `dsh` executable) ay nag-uulat ng error.

## Mga command

### `catalog` — i-validate ang mga surface ng pampublikong katalogo

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — nagva-validate ng YAML at semantics ng katalogo: ligtas na
  pag-parse ng YAML, ang pampublikong schema, pag-parse ng SPDX expression, eksaktong SemVer,
  SHA-512 SRI, at pagtanggi ng dobleng ID / repository-node-plus-subpath. Ito ay lokal at
  read-only: hindi ito makikipag-ugnayan sa GitHub, maglulutas ng pagkakakilanlan ng
  repository, o susuriin ang ebidensya sa nakapirming commit. Ito ang eksaktong command na
  pinapatakbo ng CI job na `catalog-validation` sa bawat pull request ng katalogo.
- **`catalog docs-check [root]`** — sinusuri na umiiral ang kinakailangang pampublikong
  dokumentasyon ng katalogo at balanse ang mga Markdown fence.
- **`catalog github-forms-check [root]`** — sinusuri ang structured na pampublikong GitHub
  issue form (claim, correction, removal).

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — maghanap nang lokal sa mga pampublikong field ng katalogo

```text
dsh-plugins search [options] <query...>
```

Naghahanap nang lokal sa mga pampublikong field ng katalogo laban sa napiling input ng
katalogo. Ipinapakita ang mga tumugmang entry, o `No plugins found.` (exit `0`) kapag walang
tumugma.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — humanap ng mga plugin sa labas ng katalogo

```text
dsh-plugins discover [options] <query...>
```

> Ang `discover` ay kasama sa `1.0.0`, ang unang release sa ilalim ng pangalan ng package na ito.

Una munang hinahanap ang curated na katalogo, pagkatapos — maliban kung ibinigay ang
`--offline` — ang live na GitHub `dsh-plugin` topic, upang ang plugin na hindi pa naisusumite
ay matagpuan pa rin. Ang mga resulta ng katalogo ay may dalang ebidensyang taglay ng katalogo
(nakapirming commit, lumikha, lisensya); ang mga resulta ng komunidad ay walang dala at
tinatakan bilang ganoon, dahil wala sa kanila ang nasuri.

`--limit <n>` ang naglilimita ng resulta bawat antas (default `8`). Ang `--json` ay
naglalabas ng matatag na machine shape, na hindi kailanman nilolokalisasiyon.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — ipakita ang isang pampublikong entry ng katalogo

```text
dsh-plugins info [options] <id>
```

Ipinapakita ang isang pampublikong entry ng katalogo ayon sa canonical plugin ID. Lumalabas
ng `1` na may `Plugin not found: <id>` kapag wala sa katalogo ang ID.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — magdagdag ng isang plugin ng katalogo sa pamamagitan ng opisyal na delegasyon ng DSH

```text
dsh-plugins add [options] <id>
```

| Opsyon                   | Kahulugan                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | DSH profile na mumutahin (sa praktika kinakailangan; mag-e-error ang command kung wala nito) |
| `--dry-run`              | Ipakita ang naberipikang plano nang walang file o subprocess               |
| `--allow-code-execution` | Pahintulot sa DSH/pnpm lifecycle code (naka-disable ang native Windows; gamitin ang WSL) |
| `--catalog` / `--revision` / `--json` | Mga karaniwang opsyon sa itaas                                  |

Semantics ng dry-run sa bersyong ito: lulutasin at bebiberipikahin ng command ang plano para
sa nakapirming entry at ipapakita ito, nang hindi lumilikha ng file at hindi nagpapatatakbo ng
subprocess. Ang tunay na instalasyon ay idinedelega sa opisyal na DSH tooling at magpapatuloy
lamang sa `--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — i-update ang isang plugin ng katalogo sa pamamagitan ng opisyal na delegasyon ng DSH

```text
dsh-plugins update [options] <id>
```

Parehong mga opsyon at semantics ng pahintulot tulad ng `add`: `--profile <name>`,
`--dry-run`, `--allow-code-execution`, kasama ang mga karaniwang opsyon ng katalogo.

### `remove` — alisin ang isang plugin na pinamamahalaan ng katalogo sa pamamagitan ng opisyal na delegasyon ng DSH

```text
dsh-plugins remove [options] <id>
```

Parehong mga opsyon at semantics ng pahintulot tulad ng `add`. Tanging ang mga install na
pinamamahalaan ng katalogo lamang ang inaalis.

### `recover` — mabawi ang isang napansinang POSIX mutation

```text
dsh-plugins recover
```

Binabawi ang napansinang POSIX mutation pagkatapos ng isang naantala na
`add`/`update`/`remove`. Kapag walang nakabinbin, ipapakita nito ang
`No mutation recovery is pending.` at lalabas ng `0`. Ang native Windows recovery ay
nananatiling manual, ayon sa naka-dokumentong patakaran.

### `list` — ilista ang mga install na pinamamahalaan ng katalogo

```text
dsh-plugins list [--profile <name>] [--json]
```

Nililista ang mga install na pinamamahalaan ng katalogo nang hindi binabago ang mga profile.
Ang `--profile <name>` ay nagsasala ayon sa DSH profile. Kapag walang install, ipapakita nito
ang `No catalog-managed plugins installed.` at lalabas ng `0`.

### `doctor` — read-only na diagnostics

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Nagpapatakbo ng read-only na diagnostics para sa Node, DSH, native Windows policy, at
katalogo. Ang bawat check ay nag-uulat ng `ok` o `error`; ang anumang `error` ay ginagawang
`1` ang kabuuang exit code. Halimbawang output sa isang makina na walang `dsh` executable:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Ano ang hindi pinatutunayan ng lokal na validation

Ang isang berdeng pagtakbo ng `catalog validate` ay kinukumpirma lamang ang istruktura at
lokal na semantics. Hindi nito pinatutunayan ang remote repository identity, pagmamay-ari ng
lumikha, o ebidensya sa nakapirming commit — ginagamit ng mga maintainer ang mga hiwalay na
provenance gate na iyon bago ang anumang merge, tulad ng inilarawan sa
[CONTRIBUTING.md](../../CONTRIBUTING.md) at [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
