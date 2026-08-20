# Référence du schéma d'entrée du catalogue

> 🌐 [English](../../docs/SCHEMA.md) · **Français**

> **Projet communautaire non officiel. Non affilié à, ni approuvé ni sponsorisé par DeepSeek.**
> Les noms et marques DeepSeek appartiennent à leurs propriétaires respectifs.

Ceci est la référence champ par champ de
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), le schéma JSON public
(draft 2020-12) que chaque fichier sous `catalog/plugins/` doit satisfaire. Le fichier de schéma
lui-même est la source de vérité ; lorsque cette page et le schéma divergent, le schéma l'emporte.

Deux couches de validation s'appliquent. Le schéma public applique des *formes sûres* bornées
(motifs et longueurs qui rejettent les valeurs ressemblant à des options ou non bornées). Par-
dessus, `catalog validate` applique des analyseurs sémantiques obligatoires : SemVer exact pour
les versions, SRI SHA-512 pour les valeurs d'intégrité, analyse d'expression SPDX pour les
licences, et rejet des clés dupliquées. Une valeur peut correspondre au motif du schéma et être
quand même rejetée sémantiquement.

Règles de premier niveau : l'entrée est un unique objet YAML, `additionalProperties: false` (les
champs inconnus sont rejetés), et **tous** les champs suivants sont obligatoires.

## Champs de premier niveau

| Champ             | Type    | Obligatoire | Résumé                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   oui    | Doit être exactement `1`                                           |
| `id`              | string  |   oui    | ID d'entrée en kebab-case minuscule ; doit correspondre au nom de fichier        |
| `name`            | string  |   oui    | Nom d'affichage, 1 à 120 caractères                                |
| `description`     | object  |   oui    | Résumé anglais curé plus son chemin de preuve                |
| `unofficial`      | const   |   oui    | Doit être exactement `true`                                        |
| `kind`            | enum    |   oui    | Discriminant canonique de l'artefact                          |
| `primaryCategory` | enum    |   oui    | Catégorie de capacité principale unique                       |
| `tags`            | array   |   oui    | Tags uniques en kebab-case minuscule (peut être vide)              |
| `source`          | object  |   oui    | Dépôt d'origine, ID de nœud, sous-chemin et commit fixé       |
| `creator`         | object  |   oui    | Handle GitHub public du créateur                              |
| `package`         | object  |   oui    | Descripteur d'installation canonique (npm **ou** source)             |
| `dsh`             | object  |   oui    | Profils DSH et chemin de preuve d'intégration native             |
| `repositoryScope` | enum    |   oui    | `dedicated` ou `monorepo`                                     |
| `popularity`      | object  |   oui    | Politique d'étoiles et nombre d'étoiles (conditionnel au périmètre)      |
| `license`         | object  |   oui    | Expression SPDX de licence amont                               |
| `verification`    | object  |   oui    | Statut de vérification, heure de contrôle, identité et smoke test      |
| `provenance`      | object  |   oui    | URL publiques de Discussion/commentaire ou `null`              |

### `schemaVersion`

Constante `1`. Identifie la version 1 du schéma public ; toute autre valeur est invalide.

### `id`

Chaîne correspondant à `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kebab-case minuscule, sans trait d'union au
début/à la fin ni doublé. Selon [CONTRIBUTING.md](../../CONTRIBUTING.md), le fichier d'entrée doit
être nommé `catalog/plugins/<id>.yaml` avec la valeur identique.

### `name`

Nom d'affichage libre, `minLength: 1`, `maxLength: 120`.

### `description`

Objet avec exactement deux propriétés obligatoires (aucune autre autorisée) :

| Propriété      | Type   | Règles                                                                 |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `en`           | string | Résumé anglais, 20 à 320 caractères                                    |
| `evidencePath` | string | Motif de chemin relatif au dépôt ; pas de `/` initial, pas de barres obliques inversées, pas de segments `.`/`..` |

Le résumé anglais doit être curé à partir du fichier à `evidencePath` tel qu'il existe à
`source.commit` — pas copié depuis un autre catalogue.

### `unofficial`

Constante `true`. Marqueur lisible par machine indiquant que la fiche est non officielle.

### `kind`

Le **seul** discriminant de type d'artefact (aucun second champ de type d'intégration n'existe).
L'un de :

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Les significations et les conséquences sur le classement sont définies dans
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Une des treize catégories de capacité :

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

Les libellés d'affichage et les recommandations de sélection sont dans
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Tableau de chaînes uniques, chacune correspondant à `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case
minuscule). Aucun nombre minimal n'est imposé par le schéma.

### `source`

Objet avec exactement quatre propriétés obligatoires :

| Propriété          | Type           | Règles                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | URL `https://github.com/<owner>/<repo>` ; le owner suit les règles de nom d'utilisateur GitHub, le nom du repo fait 1 à 100 caractères, ne peut pas être `.`/`..` ni se terminer par `.git` |
| `repositoryNodeId` | string         | ID de nœud de dépôt GitHub immuable, non vide                         |
| `subpath`          | string or null | Sous-chemin du plugin dans le dépôt (même motif de chemin relatif sûr que `evidencePath`), ou `null` pour un plugin à la racine du dépôt |
| `commit`           | string         | OID de commit hexadécimal complet à 40 caractères                              |

La validation du catalogue doit résoudre `repositoryNodeId` et rejeter une divergence d'URL de
dépôt — cette résolution est un contrôle côté mainteneur, pas une partie du contrôle structurel
local.

### `creator`

Objet avec une seule propriété obligatoire :

| Propriété | Type   | Règles                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | Nom d'utilisateur GitHub (1 à 39 caractères, règles de handle GitHub) |

L'URL de profil public est toujours dérivée comme `https://github.com/<handle>` ; aucun second
champ de profil n'est stocké, donc les deux ne peuvent jamais diverger.

### `package`

Le descripteur d'installation canonique. C'est une donnée, jamais une commande shell, et il prend
exactement une de deux formes (`oneOf`) :

**paquet npm** — obligatoires `ecosystem`, `name`, `version` ; optionnel `integrity` :

| Propriété    | Type  | Règles                                                                      |
| ----------- | ----- | ---------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                        |
| `name`      | string | Forme de nom de paquet npm (éventuellement scoped), max 214 caractères                 |
| `version`   | string | Forme de version exacte `x.y.z` (prerelease/build optionnels) ; les plages sont rejetées. La couche sémantique exige en plus un SemVer exact analysable |
| `integrity` | string | Forme SRI optionnelle `sha512-…`, 8 à 256 caractères. La couche sémantique doit l'analyser comme un SRI SHA-512 valide |

**installation source** — obligatoire uniquement `ecosystem` :

| Propriété    | Type  | Règles    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

Un descripteur source ne stocke délibérément rien d'autre : le dépôt, le commit et le sous-chemin
sont dérivés de `source`, donc les valeurs mutables ne sont jamais dupliquées.

### `dsh`

Preuve d'intégration native avec le DSH :

| Propriété       | Type   | Règles                                                          |
| -------------- | ------ | ---------------------------------------------------------------- |
| `profiles`     | array  | Au moins un nom de profil unique correspondant à `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Chemin relatif sûr vers la preuve d'intégration DSH à `source.commit` |

### `repositoryScope`

Soit `dedicated` (les étoiles du dépôt appartiennent à ce plugin exact), soit `monorepo` (le
plugin est un sous-chemin ou un paquet dans un projet plus large). Cette valeur détermine les
règles conditionnelles de popularité ci-dessous.

### `popularity`

| Propriété     | Type            | Règles                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` ou `undefined-parent-repository`  |
| `stars`      | integer or null | Entier non négatif, ou `null`                      |

Règles conditionnelles (appliquées par les blocs `allOf` du schéma) :

- `repositoryScope: monorepo` **impose** `starsPolicy: undefined-parent-repository` et
  `stars: null`. Les étoiles du projet parent ne sont jamais attribuées à un plugin de monorepo.
- `repositoryScope: dedicated` **impose** `starsPolicy: exact-repository` et un `stars >= 0`
  entier.

Voir [docs/RANKING.md](../../docs/RANKING.md) pour savoir comment ces valeurs alimentent le
prédicat de classement.

### `license`

| Propriété | Type   | Règles                                                          |
| -------- | ------ | ---------------------------------------------------------------- |
| `spdx`   | string | Forme d'expression SPDX, 2 à 256 caractères, sans trait d'union initial          |

Le schéma applique seulement une forme de caractères sûre ; la validation du catalogue doit
analyser et normaliser la valeur avec un véritable analyseur d'expression SPDX. Enregistrez
l'expression amont complète prouvée au commit fixé (par exemple `Apache-2.0` ou
`MIT OR GPL-3.0-only`).

### `verification`

La vérification s'applique à `source.commit`. Objet avec quatre propriétés obligatoires :

| Propriété             | Type           | Règles                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | Horodatage du contrôle au format `date-time`           |
| `repositoryIdentity` | const          | Doit être `resolved`                                    |
| `smokeTest`          | object or null | Enregistrement de smoke test, ou `null` lorsqu'aucun test qualifiant n'existe |

Lorsqu'il est présent, `smokeTest` exige :

| Propriété        | Type   | Règles                                                             |
| --------------- | ------ | ------------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — référence `package` ou la source fixée sans dupliquer les valeurs mutables |
| `check`         | object | `name` (forme de nom de paquet) et `version` (forme de version exacte) obligatoires |
| `result`        | const  | `passed` — un smoke test échoué n'est pas enregistré comme un smoke test    |

Règle conditionnelle : `status: verified` **exige** un objet `smokeTest` non null. Les entrées
sans preuve de smoke test révisable utilisent `status: eligible` et `smokeTest: null`. Aucun
statut n'est une approbation ou une certification de sécurité — voir
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Liens publics de provenance, chacun une URI ou `null` :

| Propriété     | Type          | Règles                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string or null | URL publique de Discussion lorsqu'elle existe            |
| `comment`    | string or null | URL publique de commentaire lorsqu'elle existe             |

## Ce que le schéma ne vérifie pas

Le schéma est intentionnellement local et structurel. Il **ne** vérifie **pas** que le dépôt
existe, que l'ID de nœud correspond à l'URL, que les chemins de preuve existent au commit fixé,
que le nombre d'étoiles est exact, ou que le créateur possède la source. Ces contrôles relèvent
des contrôles de révision des mainteneurs décrits dans [CONTRIBUTING.md](../../CONTRIBUTING.md) et
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: 8803e392a6a1668bc8cfe3451ec41e804fb2943046a0a7e6b0301caf42aae034 -->
