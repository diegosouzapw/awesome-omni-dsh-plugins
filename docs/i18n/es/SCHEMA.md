# Referencia del Schema de Entrada del Catálogo

> 🌐 [English](../../docs/SCHEMA.md) · **Español**

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
(los campos desconocidos se rechazan), y **todos** los campos siguientes son obligatorios.

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

Una de las trece categorías de capacidad:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

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

## Lo que el schema no verifica

El schema es intencionalmente local y estructural. **No** verifica que el repositorio exista, que
el ID de nodo coincida con la URL, que las rutas de evidencia existan en el commit fijado, que el
conteo de estrellas sea preciso, ni que el creador sea dueño de la fuente. Esas comprobaciones
pertenecen a los gates de revisión de los mantenedores descritos en
[CONTRIBUTING.md](../../CONTRIBUTING.md) y [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
