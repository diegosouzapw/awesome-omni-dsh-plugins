# Referencia del Schema de Entrada del Catálogo

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Español**

> **Proyecto comunitario no oficial. No afiliado, respaldado ni patrocinado por DeepSeek.**
> Los nombres y marcas de DeepSeek pertenecen a sus respectivos propietarios.

Esta es la referencia campo por campo de
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), el JSON Schema público
(draft 2020-12) que debe satisfacer todo archivo bajo `catalog/plugins/`. El propio archivo de
schema es la fuente de la verdad; cuando esta página y el schema difieren, el schema prevalece.

Se aplican dos capas de validación. El schema público impone *formas seguras* acotadas (patrones
y longitudes que rechazan valores parecidos a opciones o no acotados). Sobre eso, `catalog
validate` aplica intérpretes semánticos obligatorios: SemVer exacto para versiones, SRI SHA-512
para valores de integridad, interpretación de expresión SPDX para licencias, y rechazo de clave
duplicada. Un valor puede coincidir con el patrón del schema y aun así ser rechazado
semánticamente.

Reglas de nivel superior: la entrada es un único objeto YAML, `additionalProperties: false`
(los campos desconocidos se rechazan), y todos los campos siguientes son obligatorios excepto
`media`, el único campo opcional.

## Campos de nivel superior

| Campo             | Tipo    | Requerido | Resumen                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   sí    | Debe ser exactamente `1`                                           |
| `id`              | string  |   sí    | ID de la entrada en kebab-case minúsculo; debe coincidir con el nombre del archivo |
| `name`            | string  |   sí    | Nombre de visualización, 1–120 caracteres                            |
| `description`     | object  |   sí    | Resumen en inglés curado más su ruta de evidencia                  |
| `unofficial`      | const   |   sí    | Debe ser exactamente `true`                                        |
| `kind`            | enum    |   sí    | Discriminador canónico del artefacto                              |
| `primaryCategory` | enum    |   sí    | Categoría de capacidad primaria única                              |
| `tags`            | array   |   sí    | Etiquetas únicas en kebab-case minúsculo (puede estar vacío)               |
| `source`          | object  |   sí    | Repositorio original, ID de nodo, subruta y commit fijado       |
| `creator`         | object  |   sí    | Handle público de GitHub del creador                              |
| `package`         | object  |   sí    | Descriptor de instalación canónico (npm **o** source)             |
| `dsh`             | object  |   sí    | Perfiles de DSH y ruta de evidencia de integración nativa            |
| `repositoryScope` | enum    |   sí    | `dedicated` o `monorepo`                                     |
| `popularity`      | object  |   sí    | Política de estrellas y conteo de estrellas (condicional al alcance) |
| `license`         | object  |   sí    | Expresión SPDX de licencia upstream                               |
| `verification`    | object  |   sí    | Estado de verificación, momento de comprobación, identidad y smoke test |
| `provenance`      | object  |   sí    | URLs públicas de Discussion/comentario o `null`                      |
| `media`           | array   |    no    | Hasta 6 capturas/vídeos, cada URL fijada a `source.commit` |

### `schemaVersion`

Constante `1`. Identifica la versión 1 del schema público; cualquier otro valor es inválido.

### `id`

Cadena que coincide con `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kebab-case minúsculo, sin guiones al
inicio/final ni dobles. Según [CONTRIBUTING.md](../../CONTRIBUTING.md), el archivo de la entrada
debe llamarse `catalog/plugins/<id>.yaml` con el valor idéntico; el validador rechaza una
discrepancia (`id-filename-mismatch`). El ID también debe comenzar con el namespace del creador:
el handle `creator.github` en minúsculas, con cada secuencia de caracteres fuera de `[a-z0-9]`
colapsada en un único `-`, seguido de `-` (`id-creator-prefix`).

### `name`

Nombre de visualización libre, `minLength: 1`, `maxLength: 120`.

### `description`

Objeto con exactamente dos propiedades requeridas (no se permiten otras):

| Propiedad      | Tipo   | Reglas                                                                 |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `en`           | string | Resumen en inglés, 20–320 caracteres                                    |
| `evidencePath` | string | Patrón de ruta relativa al repositorio; sin `/` inicial, sin barras invertidas, sin segmentos `.`/`..` |

El resumen en inglés debe estar curado a partir del archivo en `evidencePath` tal como existe en
`source.commit` — no copiado de otro catálogo.

### `unofficial`

Constante `true`. Marcador legible por máquina de que el listado es no oficial.

### `kind`

El **único** discriminador de tipo de artefacto (no existe un segundo campo de tipo de
integración). Uno de:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Los significados y las consecuencias en el ranking se definen en
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Una de las catorce categorías de capacidad:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Las etiquetas de visualización y la guía de selección están en
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Array de cadenas únicas, cada una coincidiendo con `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case
minúsculo). El schema no impone un conteo mínimo.

### `source`

Objeto con exactamente cuatro propiedades requeridas:

| Propiedad          | Tipo           | Reglas                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | URL `https://github.com/<owner>/<repo>`; el owner sigue las reglas de nombre de usuario de GitHub, el nombre del repo tiene 1–100 caracteres, no puede ser `.`/`..` ni terminar en `.git` |
| `repositoryNodeId` | string         | ID de nodo de repositorio de GitHub inmutable, no vacío                         |
| `subpath`          | string o null | Subruta del plugin dentro del repositorio (mismo patrón de ruta relativa segura que `evidencePath`), o `null` para un plugin en la raíz del repositorio |
| `commit`           | string         | OID de commit hexadecimal completo de 40 caracteres                               |

La validación del catálogo debe resolver `repositoryNodeId` y rechazar una discrepancia de URL de
repositorio — esa resolución es un gate del lado del mantenedor, no parte de la comprobación
estructural local.

### `creator`

Objeto con una única propiedad requerida:

| Propiedad | Tipo   | Reglas                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | Nombre de usuario de GitHub (1–39 caracteres, reglas de handle de GitHub) |

La URL de perfil público siempre se deriva como `https://github.com/<handle>`; no se almacena un
segundo campo de perfil, así que los dos nunca pueden divergir.

### `package`

El descriptor de instalación canónico. Son datos, nunca un comando de shell, y adopta exactamente
una de dos formas (`oneOf`):

**paquete npm** — requeridos `ecosystem`, `name`, `version`; opcional `integrity`:

| Propiedad   | Tipo  | Reglas                                                                      |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | Forma de nombre de paquete npm (opcionalmente con alcance), máximo 214 caracteres                 |
| `version`   | string | Forma de versión exacta `x.y.z` (prerelease/build opcionales); los rangos se rechazan. La capa semántica además exige un SemVer exacto interpretable |
| `integrity` | string | Forma SRI opcional `sha512-…`, 8–256 caracteres. La capa semántica debe interpretarlo como SRI SHA-512 válido |

**instalación por source** — requerido solo `ecosystem`:

| Propiedad   | Tipo  | Reglas    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

Un descriptor de source deliberadamente no almacena nada más: el repositorio, el commit y la
subruta se derivan de `source`, así que los valores mutables nunca se duplican.

### `dsh`

Evidencia de integración nativa con DSH:

| Propiedad       | Tipo   | Reglas                                                          |
| -------------- | ------ | ---------------------------------------------------------------------- |
| `profiles`     | array  | Al menos un nombre de perfil único que coincida con `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Ruta relativa segura a la evidencia de integración con DSH en `source.commit` |

### `repositoryScope`

`dedicated` (las estrellas del repositorio pertenecen exactamente a este plugin) o `monorepo` (el
plugin es una subruta o paquete dentro de un proyecto más amplio). Este valor rige las reglas
condicionales de popularidad que siguen.

### `popularity`

| Propiedad     | Tipo            | Reglas                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` o `undefined-parent-repository`  |
| `stars`      | integer o null | Entero no negativo, o `null`                      |

Reglas condicionales (aplicadas por los bloques `allOf` del schema):

- `repositoryScope: monorepo` **fuerza** `starsPolicy: undefined-parent-repository` y
  `stars: null`. Las estrellas del proyecto padre nunca se atribuyen a un plugin de monorepo.
- `repositoryScope: dedicated` **fuerza** `starsPolicy: exact-repository` y un `stars >= 0`
  entero.

Consulte [docs/RANKING.md](../../docs/RANKING.md) para saber cómo estos valores alimentan el
predicado de ranking.

### `license`

| Propiedad | Tipo   | Reglas                                                          |
| -------- | ------ | -------------------------------------------------------------- |
| `spdx`   | string | Forma de expresión SPDX, 2–256 caracteres, sin guion inicial          |

El schema solo impone una forma de carácter segura; la validación del catálogo debe interpretar y
normalizar el valor con un intérprete real de expresión SPDX. Registre la expresión upstream
completa evidenciada en el commit fijado (por ejemplo `Apache-2.0` o `MIT OR GPL-3.0-only`).

### `verification`

La verificación se aplica a `source.commit`. Objeto con cuatro propiedades requeridas:

| Propiedad             | Tipo           | Reglas                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | Timestamp con formato `date-time` de la comprobación           |
| `repositoryIdentity` | const          | Debe ser `resolved`                                     |
| `smokeTest`          | object o null | Registro del smoke test, o `null` cuando no existe una prueba calificada |

Cuando está presente, `smokeTest` requiere:

| Propiedad        | Tipo   | Reglas                                                             |
| --------------- | ------ | ------------------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — hace referencia a `package` o al source fijado sin duplicar valores mutables |
| `check`         | object | Requeridos `name` (forma de nombre de paquete) y `version` (forma de versión exacta) |
| `result`        | const  | `passed` — un smoke test fallido no se registra como un smoke test    |

Regla condicional: `status: verified` **requiere** un objeto `smokeTest` no nulo. Las entradas
sin evidencia de smoke test revisable usan `status: eligible` y `smokeTest: null`. Ningún estado
es un respaldo ni una certificación de seguridad — consulte
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Enlaces públicos de procedencia, cada uno una URI o `null`:

| Propiedad     | Tipo          | Reglas                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string o null | URL pública de Discussion cuando exista            |
| `comment`    | string o null | URL pública de comentario cuando exista            |

### `media`

El único campo opcional. Un array de como máximo **6** elementos, cada uno describiendo una captura de pantalla o un vídeo corto del plugin:

| Propiedad | Tipo | Reglas |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` o `video` |
| `url`    | string | URL inmutable de GitHub, máximo 2048 caracteres (ver abajo) |
| `alt`    | string | Texto alternativo, 1–120 caracteres |

Una URL aquí debe ser tan inmutable como `source.commit`. Una ruta `raw.githubusercontent.com`
que lleva un nombre de rama (`.../main/docs/shot.png`) muestra lo que esa rama contiene hoy, así
que la entrada publicaría una imagen no revisada el día en que la rama se mueva. Se aceptan dos
formas:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — la ruta raw fijada;
- `https://github.com/<owner>/<repo>/assets/…` — la URL de subida direccionada por contenido de GitHub, para elementos `video`.

El esquema exige la forma segura (host, referencia hexadecimal de 40 caracteres, longitud
acotada). `catalog validate` exige el resto semánticamente: la URL debe fijar el `source.commit`
**de la propia entrada** en el repositorio **de la propia entrada**, y una URL de rama se rechaza
con `media[n].url must pin the entry commit, not a branch`.

Omite el campo por completo cuando no haya nada que mostrar: `media: []` no es una forma válida
de decir "sin capturas". El campo es aditivo: las entradas publicadas antes de que existiera
siguen siendo válidas, y un consumidor que lo ignora lee todas las entradas igual que antes.

## Entradas `kind: skill`

La versión 1 del schema también define un segundo contrato de entrada autocontenido para
`kind: skill`, publicado como [`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml)
(SKL-01 fase 0). Nunca toca el schema de plugin de arriba: las entradas con `kind: plugin`
siguen validándose exactamente como antes, y el archivo de schema de skill es la fuente de la
verdad para las entradas de skill igual que el schema de plugin lo es para las entradas de
plugin.

Una skill no se instala, la **carga** el harness, así que los descriptores de instalación
exclusivos de plugin (`package`, `dsh`) no existen en una entrada de skill y se reemplazan por
`usage` + `compat`. Una skill también vive con frecuencia en un subdirectorio de un repositorio
que aloja muchas skills, por lo que la identidad y la deduplicación es `source.repository` +
`source.subpath` en lugar del repositorio solo. Una entrada de skill no admite galería `media`:
una skill es texto que el harness carga, así que no hay nada que capturar
(`additionalProperties: false` es lo que lo hace cumplir).

Estos campos mantienen exactamente la forma y las reglas documentadas arriba para las entradas
de plugin: `schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`,
`tags`, `source`, `creator`, `repositoryScope`, `license`, `provenance`. Todos los campos son
requeridos excepto `triggers`, el único campo opcional de skill.

### Campos específicos de skill

| Campo                | Tipo   | Requerido | Reglas                                                      |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   sí    | Debe ser exactamente `skill`                                |
| `skillScope`         | enum   |   sí    | `repository` (el repositorio entero **es** la skill) o `subdirectory` (la skill vive en `source.subpath`) |
| `triggers`           | array  |    no    | Cuándo se activa la skill — el texto que un usuario evalúa antes de cargarla. Al menos 1 string único, cada uno de 3–200 caracteres; omite el campo por completo cuando no haya ninguno (`triggers: []` es inválido) |
| `usage.load`         | string |   sí    | Cómo el harness carga la skill, 1–200 caracteres; una skill se carga, nunca se instala |
| `usage.evidencePath` | string |   sí    | Ruta relativa segura (el mismo patrón que `description.evidencePath`) a la evidencia de carga en `source.commit` |
| `compat.harnessMin`  | string |   sí    | Versión mínima del harness contra la que se verificó la skill; forma exacta `x.y.z` (prerelease/build opcional), máx. 64 caracteres. La capa semántica exige además un SemVer exacto y parseable |

Reglas condicionales (aplicadas por los bloques `allOf` del schema de skill):

- `skillScope: subdirectory` **fuerza** que `source.subpath` sea un string de ruta relativa
  segura — una skill alojada en un subdirectorio debe fijar ese subdirectorio.
- `skillScope: repository` **fuerza** `source.subpath: null` — una skill de repositorio
  completo no debe declarar un subpath.

`verification` mantiene la forma de plugin (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), pero `smokeTest` debe ser exactamente `null`: una skill no tiene smoke test de
instalación, y la revisión de contenido es la puerta de admisión. El schema de skill no lleva
el condicional `status: verified` → `smokeTest` ni los condicionales `repositoryScope` →
`popularity`; esos acoplamientos son reglas exclusivas del schema de plugin.

### Capa semántica para skills

Sobre el schema, la validación del catálogo aplica los mismos parsers semánticos obligatorios
que para los plugins allí donde los campos existen: `license.spdx` debe parsear como una
expresión SPDX válida (`invalid-spdx`), y `compat.harnessMin` debe ser un SemVer exacto
(`invalid-semver`). No hay caso `invalid-sri` — una skill no tiene `package.integrity`.

### Identidad y deduplicación de skills

La clave canónica de una skill es `skill:<source.repositoryNodeId>:<normalized subpath>`. El
subpath se normaliza solo a efectos de identidad: las barras invertidas se convierten en `/`,
los segmentos vacíos y `.` se eliminan, y un resultado vacío (o `subpath: null`) se convierte
en `.` — el repositorio completo. Un subpath que contenga bytes NUL o segmentos `..` se
rechaza, nunca se "limpia". Dos skills del mismo repositorio son dos entradas; el mismo
repositorio + subpath dos veces es una colisión.

### Ejemplo mínimo de skill

```yaml
schemaVersion: 1
id: alice-dsh-commit-lint-skill
name: DSH Commit Lint Skill
description:
  en: Loads a commit-message linting skill that checks Conventional Commit shape before the harness commits.
  evidencePath: skills/commit-lint/SKILL.md
unofficial: true
kind: skill
skillScope: subdirectory
primaryCategory: coding-developer-tools
tags:
  - git
  - linting
triggers:
  - When the user asks to commit staged work
source:
  repository: https://github.com/alice/dsh-skills
  repositoryNodeId: R_kgDOexample1
  subpath: skills/commit-lint
  commit: 0123456789abcdef0123456789abcdef01234567
creator:
  github: alice
usage:
  load: dsh skill load skills/commit-lint
  evidencePath: skills/commit-lint/SKILL.md
compat:
  harnessMin: 1.4.0
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
license:
  spdx: MIT
verification:
  status: eligible
  checkedAt: 2026-08-30T12:00:00Z
  repositoryIdentity: resolved
  smokeTest: null
provenance:
  discussion: null
  comment: null
```

## Lo que el schema no verifica

El schema es intencionalmente local y estructural. **No** verifica que el repositorio exista, que
el ID de nodo coincida con la URL, que las rutas de evidencia existan en el commit fijado, que el
conteo de estrellas sea preciso, ni que el creador sea dueño de la fuente. Esas comprobaciones
pertenecen a los gates de revisión de los mantenedores descritos en
[CONTRIBUTING.md](../../CONTRIBUTING.md) y [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: 7928f14612f5cf4a63bfedceed6c38d862a829a4f88a0045efd277aec2b62f47 -->
