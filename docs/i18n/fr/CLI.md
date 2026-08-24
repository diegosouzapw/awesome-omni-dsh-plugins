# Référence CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Français**

> **Projet communautaire non officiel. Non affilié à, ni approuvé ni sponsorisé par DeepSeek.**
> Les noms et marques DeepSeek appartiennent à leurs propriétaires respectifs.

Cette page documente le CLI publié exactement tel qu'il se comporte dans la version `1.0.1`.
Chaque synopsis et chaque flag ci-dessous provient de la sortie `--help` de la commande publiée
elle-même ; rien ici ne décrit un comportement non publié. Le CLI est développé dans ce dépôt sous
[`cli/`](../../cli) et publié sur npm sous
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), avec une attestation de
provenance liant chaque build au commit et à l'exécution du workflow qui l'a produit.

```bash
npx omni-dsh-plugins --help
```

## Principes de conception dans la v1.0.1

- **Lecture seule par défaut.** `catalog`, `search`, `info`, `list` et `doctor` ne modifient
  jamais les profils, n'écrivent pas de fichiers et ne déclenchent pas de code de plugin.
- **Contrôle de consentement pour l'exécution de code.** `add`, `update` et `remove` refusent
  d'exécuter le code de cycle de vie DSH/pnpm à moins que vous ne passiez
  `--allow-code-execution`. Sans cela, utilisez `--dry-run` pour voir le plan vérifié.
- **Politique native Windows.** `add`/`update`/`remove` natifs sous Windows avec exécution de
  code sont désactivés dans la v1.0.1 ; utilisez WSL. Le dry-run et les commandes en lecture seule
  restent disponibles, et les marqueurs de récupération natifs Windows exigent une récupération
  manuelle documentée.
- **Entrées fixées.** L'entrée du catalogue peut être un répertoire local, un fichier de
  snapshot, ou une URL de snapshot public fixée, éventuellement verrouillée sur une révision
  exacte à 40 caractères.

## Options communes

Ces options apparaissent sur les commandes consommant le catalogue (`catalog validate`, `search`,
`info`, `add`, `update`, `remove`, `doctor`) :

| Option                    | Signification                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Répertoire local du catalogue, fichier de snapshot, ou URL de snapshot public fixée |
| `--revision <sha>`        | Révision exacte de snapshot à 40 caractères                               |
| `--json`                  | Émet une sortie JSON stable                                            |

Options globales : `-V, --version` affiche la version du CLI ; `-h, --help` affiche l'aide pour
n'importe quelle commande (`dsh-plugins help [command]` fonctionne aussi).

## Codes de sortie

Le CLI utilise des codes de sortie de processus conventionnels :

| Code de sortie | Signification                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Succès (y compris les résultats « vides mais valides » comme un catalogue vide)     |
| `1`       | Échec : erreur de validation, entrée introuvable, option obligatoire manquante, ou un contrôle de diagnostic signalant une erreur |

Exemples observés avec la v1.0.1 : `catalog validate` sur un catalogue vide valide se termine avec
`0` et `0 entries valid; catalog is empty` ; `info <unknown-id>` se termine avec `1` et
`Plugin not found` ; `doctor` se termine avec `1` lorsqu'un contrôle (comme un exécutable `dsh`
manquant) signale une erreur.

## Commandes

### `catalog` — valide les surfaces publiques du catalogue

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — valide le YAML et la sémantique du catalogue : analyse YAML sûre, le
  schéma public, analyse d'expression SPDX, SemVer exact, SRI SHA-512, et rejet des ID dupliqués /
  nœud-de-dépôt-plus-sous-chemin. C'est local et en lecture seule : cela ne contacte pas GitHub,
  ne résout pas l'identité du dépôt et n'inspecte pas les preuves au commit fixé. C'est exactement
  la commande que le job CI `catalog-validation` exécute sur chaque pull request de catalogue.
- **`catalog docs-check [root]`** — vérifie que la documentation publique obligatoire du catalogue
  existe et que les blocs Markdown sont équilibrés.
- **`catalog github-forms-check [root]`** — vérifie les formulaires structurés publics d'issue
  GitHub (revendication, correction, suppression).

```bash
# Depuis la racine du dépôt :
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — recherche les champs publics du catalogue localement

```text
dsh-plugins search [options] <query...>
```

Recherche les champs publics du catalogue localement dans l'entrée de catalogue sélectionnée.
Affiche les entrées correspondantes, ou `No plugins found.` (sortie `0`) lorsque rien ne
correspond.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — trouve des plugins au-delà du catalogue

```text
dsh-plugins discover [options] <query...>
```

> `discover` est livré dans la `1.0.0`, la première version publiée sous ce nom de paquet.

Recherche d'abord dans le catalogue curé, puis — sauf si `--offline` est fourni — dans le topic
GitHub `dsh-plugin` en direct, afin qu'un plugin qui n'a pas encore été soumis reste trouvable.
Les résultats du catalogue portent les preuves que le catalogue détient (commit fixé, créateur,
licence) ; les résultats communautaires n'en portent aucune et sont étiquetés comme tels, car rien
à leur sujet n'a été révisé.

`--limit <n>` plafonne les résultats par niveau (par défaut `8`). `--json` émet la forme machine
stable, qui n'est jamais localisée.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — affiche une entrée publique du catalogue

```text
dsh-plugins info [options] <id>
```

Affiche une entrée publique du catalogue par ID canonique de plugin. Se termine avec `1` et
`Plugin not found: <id>` lorsque l'ID n'est pas dans le catalogue.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — ajoute un plugin du catalogue via la délégation officielle au DSH

```text
dsh-plugins add [options] <id>
```

| Option                   | Signification                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | Profil DSH à modifier (obligatoire en pratique ; la commande échoue sans lui) |
| `--dry-run`              | Affiche le plan vérifié sans fichiers ni sous-processus               |
| `--allow-code-execution` | Consentement au code de cycle de vie DSH/pnpm (désactivé sur Windows natif ; utilisez WSL) |
| `--catalog` / `--revision` / `--json` | Options communes ci-dessus                                  |

Sémantique du dry-run dans cette version : la commande résout et vérifie le plan pour l'entrée
fixée et l'affiche, sans créer de fichiers ni déclencher de sous-processus. L'installation réelle
délègue aux outils officiels du DSH et ne procède qu'avec `--allow-code-execution`.

```bash
# Aperçu uniquement — rien n'est écrit, rien ne s'exécute :
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Installation réelle — consentement explicite au code de cycle de vie :
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — met à jour un plugin du catalogue via la délégation officielle au DSH

```text
dsh-plugins update [options] <id>
```

Mêmes options et sémantique de consentement que `add` : `--profile <name>`, `--dry-run`,
`--allow-code-execution`, plus les options communes de catalogue.

### `remove` — supprime un plugin géré par le catalogue via la délégation officielle au DSH

```text
dsh-plugins remove [options] <id>
```

Mêmes options et sémantique de consentement que `add`. Seules les installations gérées par le
catalogue sont supprimées.

### `recover` — récupère une mutation POSIX conservée

```text
dsh-plugins recover
```

Récupère une mutation POSIX conservée après un `add`/`update`/`remove` interrompu. Sans rien en
attente, elle affiche `No mutation recovery is pending.` et se termine avec `0`. La récupération
native Windows reste manuelle, selon la politique documentée.

### `list` — liste les installations gérées par le catalogue

```text
dsh-plugins list [--profile <name>] [--json]
```

Liste les installations gérées par le catalogue sans modifier les profils. `--profile <name>`
filtre par profil DSH. Sans installations, elle affiche `No catalog-managed plugins installed.`
et se termine avec `0`.

### `doctor` — diagnostics en lecture seule

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Exécute des diagnostics en lecture seule de Node, DSH, politique native Windows et catalogue.
Chaque contrôle signale `ok` ou `error` ; toute `error` rend le code de sortie global `1`. Exemple
de sortie sur une machine sans l'exécutable `dsh` :

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Ce que la validation locale ne prouve pas

Une exécution verte de `catalog validate` confirme seulement la structure et la sémantique
locale. Elle ne prouve pas l'identité distante du dépôt, la propriété du créateur, ni la preuve au
commit fixé — les mainteneurs appliquent ces contrôles de provenance séparés avant toute fusion,
comme décrit dans [CONTRIBUTING.md](../../CONTRIBUTING.md) et
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
