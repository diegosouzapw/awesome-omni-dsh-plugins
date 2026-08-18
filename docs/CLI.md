# CLI Reference — `@diegosouza.pw/dsh-plugins@0.1.0`

> **Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.**
> DeepSeek names and marks belong to their respective owner.

This page documents the published CLI exactly as it behaves in version `0.1.0`. Every synopsis
and flag below comes from the published command's own `--help` output; nothing here describes
unreleased behavior. The CLI is maintained from private source and released to npm as the
scoped package [`@diegosouza.pw/dsh-plugins`](https://www.npmjs.com/package/@diegosouza.pw/dsh-plugins).

```bash
npx @diegosouza.pw/dsh-plugins@0.1.0 --help
```

## Design principles in v0.1.0

- **Read-only by default.** `catalog`, `search`, `info`, `list` and `doctor` never modify
  profiles, write files or spawn plugin code.
- **Consent gate for code execution.** `add`, `update` and `remove` refuse to run DSH/pnpm
  lifecycle code unless you pass `--allow-code-execution`. Without it, use `--dry-run` to see
  the verified plan.
- **Native Windows policy.** Native Windows `add`/`update`/`remove` with code execution are
  disabled in v0.1.0; use WSL. Dry-run and the read-only commands remain available, and native
  Windows recovery markers require documented manual recovery.
- **Pinned inputs.** Catalog input can be a local directory, a snapshot file, or a pinned
  public snapshot URL, optionally locked to an exact 40-character revision.

## Common options

These options appear on the catalog-consuming commands (`catalog validate`, `search`, `info`,
`add`, `update`, `remove`, `doctor`):

| Option                    | Meaning                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Local catalog directory, snapshot file, or pinned public snapshot URL |
| `--revision <sha>`        | Exact 40-character snapshot revision                               |
| `--json`                  | Emit stable JSON output                                            |

Global options: `-V, --version` prints the CLI version; `-h, --help` prints help for any
command (`dsh-plugins help [command]` works too).

## Exit codes

The CLI uses conventional process exit codes:

| Exit code | Meaning                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Success (including "empty but valid" results such as an empty catalog)     |
| `1`       | Failure: validation error, entry not found, missing required option, or a diagnostic check reporting an error |

Examples observed with v0.1.0: `catalog validate` on a valid empty catalog exits `0` with
`0 entries valid; catalog is empty`; `info <unknown-id>` exits `1` with `Plugin not found`;
`doctor` exits `1` when any check (such as a missing `dsh` executable) reports an error.

## Commands

### `catalog` — validate the public catalog surfaces

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — validates catalog YAML and semantics: safe YAML parsing, the public
  schema, SPDX expression parsing, exact SemVer, SHA-512 SRI, and duplicate ID /
  repository-node-plus-subpath rejection. It is local and read-only: it does not contact
  GitHub, resolve repository identity or inspect evidence at the pinned commit. This is the
  exact command the `catalog-validation` CI job runs on every catalog pull request.
- **`catalog docs-check [root]`** — checks that the required public catalog documentation
  exists and that Markdown fences are balanced.
- **`catalog github-forms-check [root]`** — checks the structured public GitHub issue forms
  (claim, correction, removal).

```bash
# From the repository root:
npx @diegosouza.pw/dsh-plugins@0.1.0 catalog validate --catalog .
npx @diegosouza.pw/dsh-plugins@0.1.0 catalog docs-check .
npx @diegosouza.pw/dsh-plugins@0.1.0 catalog github-forms-check .
```

### `search` — search public catalog fields locally

```text
dsh-plugins search [options] <query...>
```

Searches public catalog fields locally against the selected catalog input. Prints matching
entries, or `No plugins found.` (exit `0`) when nothing matches.

```bash
npx @diegosouza.pw/dsh-plugins@0.1.0 search memory --catalog .
npx @diegosouza.pw/dsh-plugins@0.1.0 search notes markdown --catalog . --json
```

### `info` — show one public catalog entry

```text
dsh-plugins info [options] <id>
```

Shows one public catalog entry by canonical plugin ID. Exits `1` with `Plugin not found: <id>`
when the ID is not in the catalog.

```bash
npx @diegosouza.pw/dsh-plugins@0.1.0 info example-notes-search --catalog .
```

### `add` — add one catalog plugin through official DSH delegation

```text
dsh-plugins add [options] <id>
```

| Option                   | Meaning                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | DSH profile to mutate (required in practice; the command errors without it) |
| `--dry-run`              | Show the verified plan without files or subprocesses               |
| `--allow-code-execution` | Consent to DSH/pnpm lifecycle code (native Windows disabled; use WSL) |
| `--catalog` / `--revision` / `--json` | Common options above                                  |

Dry-run semantics in this version: the command resolves and verifies the plan for the pinned
entry and prints it, creating no files and spawning no subprocesses. Actual installation
delegates to official DSH tooling and only proceeds with `--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx @diegosouza.pw/dsh-plugins@0.1.0 add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx @diegosouza.pw/dsh-plugins@0.1.0 add example-notes-search --profile default --allow-code-execution
```

### `update` — update one catalog plugin through official DSH delegation

```text
dsh-plugins update [options] <id>
```

Same options and consent semantics as `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, plus the common catalog options.

### `remove` — remove one catalog-managed plugin through official DSH delegation

```text
dsh-plugins remove [options] <id>
```

Same options and consent semantics as `add`. Only catalog-managed installs are removed.

### `recover` — recover a retained POSIX mutation

```text
dsh-plugins recover
```

Recovers a retained POSIX mutation after an interrupted `add`/`update`/`remove`. With nothing
pending it prints `No mutation recovery is pending.` and exits `0`. Native Windows recovery
remains manual, per the documented policy.

### `list` — list catalog-managed installs

```text
dsh-plugins list [--profile <name>] [--json]
```

Lists catalog-managed installs without modifying profiles. `--profile <name>` filters by DSH
profile. With no installs it prints `No catalog-managed plugins installed.` and exits `0`.

### `doctor` — read-only diagnostics

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Runs read-only Node, DSH, native Windows policy and catalog diagnostics. Each check reports
`ok` or `error`; any `error` makes the overall exit code `1`. Example output on a machine
without the `dsh` executable:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## What local validation does not prove

A green `catalog validate` run confirms structure and local semantics only. It does not prove
remote repository identity, creator ownership, or evidence at the pinned commit — maintainers
apply those separate provenance gates before any merge, as described in
[CONTRIBUTING.md](../CONTRIBUTING.md) and [docs/GOVERNANCE.md](GOVERNANCE.md).
