# CLI-reference — `omni-dsh-plugins@1.0.0`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Dansk**

> **Uofficielt community-projekt. Ikke tilknyttet, godkendt af eller sponsoreret af DeepSeek.**
> DeepSeeks navne og mærker tilhører deres respektive ejere.

Denne side dokumenterer det udgivne CLI præcis, som det opfører sig i version `1.0.0`. Hver
synopsis og flag nedenfor stammer fra den udgivne kommandos egen `--help`-output; intet her
beskriver ikke-udgivet adfærd. CLI'et vedligeholdes fra privat kildekode og udgives til npm som
den scopede pakke
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins).

```bash
npx omni-dsh-plugins --help
```

## Designprincipper i v1.0.0

- **Skrivebeskyttet som standard.** `catalog`, `search`, `info`, `list` og `doctor` ændrer aldrig
  profiler, skriver aldrig filer og starter aldrig plugin-kode.
- **Samtykke-gate for kodeeksekvering.** `add`, `update` og `remove` nægter at køre DSH/pnpm-
  livscykluskode, medmindre du angiver `--allow-code-execution`. Uden den kan du bruge `--dry-run`
  for at se den verificerede plan.
- **Native Windows-politik.** Native Windows `add`/`update`/`remove` med kodeeksekvering er
  deaktiveret i v1.0.0; brug WSL. Dry-run og de skrivebeskyttede kommandoer forbliver
  tilgængelige, og native Windows-genopretningsmarkører kræver dokumenteret manuel genopretning.
- **Fastlåste input.** Katalogets input kan være en lokal mappe, en snapshot-fil, eller en
  fastlåst offentlig snapshot-URL, eventuelt låst til en præcis 40-tegns revision.

## Fælles indstillinger

Disse indstillinger optræder på de kommandoer, der forbruger kataloget (`catalog validate`,
`search`, `info`, `add`, `update`, `remove`, `doctor`):

| Indstilling               | Betydning                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Lokal katalogmappe, snapshot-fil, eller fastlåst offentlig snapshot-URL |
| `--revision <sha>`        | Præcis 40-tegns snapshot-revision                                  |
| `--json`                  | Udsender stabil JSON-output                                        |

Globale indstillinger: `-V, --version` udskriver CLI-versionen; `-h, --help` udskriver hjælp for
enhver kommando (`dsh-plugins help [command]` virker også).

## Exit-koder

CLI'et bruger konventionelle proces-exit-koder:

| Exit-kode | Betydning                                                                  |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Succes (inklusive "tomt, men gyldigt"-resultater, såsom et tomt katalog)   |
| `1`       | Fejl: valideringsfejl, post ikke fundet, manglende påkrævet indstilling, eller en diagnostisk kontrol, der rapporterer en fejl |

Eksempler observeret i v1.0.0: `catalog validate` på et gyldigt tomt katalog afsluttes med `0` og
`0 entries valid; catalog is empty`; `info <unknown-id>` afsluttes med `1` og `Plugin not found`;
`doctor` afsluttes med `1`, når en vilkårlig kontrol (såsom en manglende eksekverbar fil `dsh`)
rapporterer en fejl.

## Kommandoer

### `catalog` — validerer de offentlige katalogflader

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — validerer katalogets YAML og semantik: sikker YAML-fortolkning, det
  offentlige schema, fortolkning af SPDX-udtryk, præcis SemVer, SHA-512 SRI, samt afvisning af
  duplikerede ID'er / repository-node-plus-understi. Den er lokal og skrivebeskyttet: den
  kontakter ikke GitHub, løser ikke repository-identitet og undersøger ikke beviser ved den
  fastlåste commit. Dette er præcis den kommando, som CI-jobbet `catalog-validation` kører på
  hver katalog-pull-request.
- **`catalog docs-check [root]`** — kontrollerer, at den påkrævede offentlige
  katalogdokumentation findes, og at Markdown-kodeblokke er balancerede.
- **`catalog github-forms-check [root]`** — kontrollerer de strukturerede offentlige
  GitHub-issue-formularer (claim, korrektion, fjernelse).

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — søger i offentlige katalogfelter lokalt

```text
dsh-plugins search [options] <query...>
```

Søger i offentlige katalogfelter lokalt mod det valgte katalog-input. Udskriver matchende poster,
eller `No plugins found.` (exit `0`), når intet matcher.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — finder plugins ud over kataloget

```text
dsh-plugins discover [options] <query...>
```

> **Ikke i den udgivne `1.0.0`.** `discover` udgives i `1.0.0`; alle andre kommandoer på denne
> side virker med den version, der aktuelt er på npm. Kører du den mod `@1.0.0`, fejler den med
> en ukendt kommando.

Søger først i det kuraterede katalog, og derefter — medmindre `--offline` angives — i det aktive
GitHub-emne `dsh-plugin`, så en plugin, der endnu ikke er blevet indsendt, stadig kan findes.
Katalogresultater bærer de beviser, som kataloget indeholder (fastlåst commit, skaber, licens);
fællesskabsresultater bærer ingen af delene og er mærket som sådan, fordi intet ved dem er blevet
gennemgået.

`--limit <n>` sætter et loft over resultater pr. niveau (standard `8`). `--json` udsender den
stabile maskinform, som aldrig lokaliseres.

```bash
npx omni-dsh-plugins@1.0.0 discover memory --catalog .
npx omni-dsh-plugins@1.0.0 discover vision --offline --catalog . --json
```

### `info` — viser én offentlig katalogpost

```text
dsh-plugins info [options] <id>
```

Viser én offentlig katalogpost ud fra det kanoniske plugin-ID. Afsluttes med `1` og
`Plugin not found: <id>`, når ID'et ikke findes i kataloget.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — tilføjer én katalog-plugin via officiel DSH-delegering

```text
dsh-plugins add [options] <id>
```

| Indstilling               | Betydning                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| `--profile <name>`       | DSH-profil, der skal ændres (påkrævet i praksis; kommandoen fejler uden den) |
| `--dry-run`              | Viser den verificerede plan uden filer eller underprocesser         |
| `--allow-code-execution` | Samtykke til DSH/pnpm-livscykluskode (deaktiveret på native Windows; brug WSL) |
| `--catalog` / `--revision` / `--json` | Fælles indstillinger ovenfor                            |

Dry-run-semantik i denne version: kommandoen løser og verificerer planen for den fastlåste post og
udskriver den, uden at oprette filer eller starte underprocesser. Den faktiske installation
delegeres til de officielle DSH-værktøjer og fortsætter kun med `--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — opdaterer én katalog-plugin via officiel DSH-delegering

```text
dsh-plugins update [options] <id>
```

Samme indstillinger og samtykke-semantik som `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, samt de fælles katalogindstillinger.

### `remove` — fjerner én katalogstyret plugin via officiel DSH-delegering

```text
dsh-plugins remove [options] <id>
```

Samme indstillinger og samtykke-semantik som `add`. Kun katalogstyrede installationer fjernes.

### `recover` — genopretter en tilbageholdt POSIX-mutation

```text
dsh-plugins recover
```

Genopretter en tilbageholdt POSIX-mutation efter en afbrudt `add`/`update`/`remove`. Er der intet
afventende, udskriver den `No mutation recovery is pending.` og afsluttes med `0`. Native
Windows-genopretning forbliver manuel, i henhold til den dokumenterede politik.

### `list` — lister katalogstyrede installationer

```text
dsh-plugins list [--profile <name>] [--json]
```

Lister katalogstyrede installationer uden at ændre profiler. `--profile <name>` filtrerer efter
DSH-profil. Uden installationer udskriver den `No catalog-managed plugins installed.` og
afsluttes med `0`.

### `doctor` — skrivebeskyttet diagnostik

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Kører skrivebeskyttet diagnostik af Node, DSH, native Windows-politik og kataloget. Hver kontrol
rapporterer `ok` eller `error`; enhver `error` gør den samlede exit-kode til `1`. Eksempel på
output på en maskine uden den eksekverbare fil `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Hvad lokal validering ikke beviser

En grøn kørsel af `catalog validate` bekræfter kun struktur og lokal semantik. Den beviser ikke
identiteten af et fjernrepository, skaberens ejerskab, eller beviser ved den fastlåste commit —
vedligeholdere anvender disse separate proveniens-gates før enhver merge, som beskrevet i
[CONTRIBUTING.md](../../CONTRIBUTING.md) og [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: 4f83ebb097bcbee07d61c5660c045f69c7b8d76a1d81184746f91f2b674cb298 -->
