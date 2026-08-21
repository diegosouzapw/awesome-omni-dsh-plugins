# Referencia del CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · **Español**

> **Proyecto comunitario no oficial. No afiliado, respaldado ni patrocinado por DeepSeek.**
> Los nombres y marcas de DeepSeek pertenecen a sus respectivos propietarios.

Esta página documenta el CLI publicado exactamente como se comporta en la versión `1.0.0`. Cada
sinopsis y flag a continuación proviene de la propia salida `--help` del comando publicado; nada
aquí describe comportamiento no lanzado. El CLI se mantiene desde código fuente privado y se
publica en npm como el paquete con alcance
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins).

```bash
npx omni-dsh-plugins --help
```

## Principios de diseño en v1.0.1

- **Solo lectura por defecto.** `catalog`, `search`, `info`, `list` y `doctor` nunca modifican
  perfiles, escriben archivos ni disparan código de plugin.
- **Gate de consentimiento para la ejecución de código.** `add`, `update` y `remove` se niegan a
  ejecutar código de ciclo de vida de DSH/pnpm a menos que pase `--allow-code-execution`. Sin
  ella, use `--dry-run` para ver el plan verificado.
- **Política nativa de Windows.** `add`/`update`/`remove` nativos en Windows con ejecución de
  código están deshabilitados en v1.0.1; use WSL. El dry-run y los comandos de solo lectura
  siguen disponibles, y los marcadores de recuperación nativos de Windows requieren recuperación
  manual documentada.
- **Entradas fijadas.** La entrada del catálogo puede ser un directorio local, un archivo de
  snapshot, o una URL de snapshot público fijada, opcionalmente bloqueada a una revisión exacta
  de 40 caracteres.

## Opciones comunes

Estas opciones aparecen en los comandos que consumen el catálogo (`catalog validate`, `search`,
`info`, `add`, `update`, `remove`, `doctor`):

| Opción                    | Significado                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Directorio local del catálogo, archivo de snapshot, o URL de snapshot público fijada |
| `--revision <sha>`        | Revisión exacta de snapshot de 40 caracteres                               |
| `--json`                  | Emite salida JSON estable                                            |

Opciones globales: `-V, --version` imprime la versión del CLI; `-h, --help` imprime la ayuda de
cualquier comando (`dsh-plugins help [command]` también funciona).

## Códigos de salida

El CLI usa códigos de salida de proceso convencionales:

| Código de salida | Significado                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Éxito (incluyendo resultados "vacíos pero válidos" como un catálogo vacío)     |
| `1`       | Fallo: error de validación, entrada no encontrada, opción requerida faltante, o una comprobación de diagnóstico que reporta un error |

Ejemplos observados en v1.0.1: `catalog validate` en un catálogo vacío válido sale con `0` y
`0 entries valid; catalog is empty`; `info <unknown-id>` sale con `1` y `Plugin not found`;
`doctor` sale con `1` cuando alguna comprobación (como un ejecutable `dsh` faltante) reporta un
error.

## Comandos

### `catalog` — valida las superficies públicas del catálogo

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — valida el YAML y la semántica del catálogo: interpretación segura de
  YAML, el schema público, interpretación de expresión SPDX, SemVer exacto, SRI SHA-512, y rechazo
  de ID duplicado / nodo-de-repositorio-más-subruta. Es local y de solo lectura: no contacta a
  GitHub, no resuelve la identidad del repositorio ni inspecciona evidencia en el commit fijado.
  Este es exactamente el comando que ejecuta el job de CI `catalog-validation` en cada pull
  request del catálogo.
- **`catalog docs-check [root]`** — comprueba que exista la documentación pública obligatoria del
  catálogo y que las cercas de Markdown estén balanceadas.
- **`catalog github-forms-check [root]`** — comprueba los formularios públicos estructurados de
  issues de GitHub (reclamo, corrección, eliminación).

```bash
# Desde la raíz del repositorio:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — busca campos públicos del catálogo localmente

```text
dsh-plugins search [options] <query...>
```

Busca campos públicos del catálogo localmente en la entrada de catálogo seleccionada. Imprime las
entradas coincidentes, o `No plugins found.` (salida `0`) cuando nada coincide.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — encuentra plugins más allá del catálogo

```text
dsh-plugins discover [options] <query...>
```

> **No está en la `1.0.0` publicada.** `discover` se publica en `1.0.0`; el resto de los comandos
> de esta página funcionan con la versión actualmente en npm. Ejecutarlo contra `@1.0.0` falla
> con un comando desconocido.

Busca primero en el catálogo curado, luego — a menos que se dé `--offline` — en el tema
`dsh-plugin` en vivo de GitHub, de modo que un plugin que aún no se ha enviado siga siendo
localizable. Los resultados del catálogo llevan la evidencia que el catálogo contiene (commit
fijado, creador, licencia); los resultados de la comunidad no llevan nada de eso y están
etiquetados como tal, porque nada sobre ellos ha sido revisado.

`--limit <n>` limita los resultados por nivel (por defecto `8`). `--json` emite la forma estable
de máquina, que nunca se localiza.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — muestra una entrada pública del catálogo

```text
dsh-plugins info [options] <id>
```

Muestra una entrada pública del catálogo por ID canónico de plugin. Sale con `1` y
`Plugin not found: <id>` cuando el ID no está en el catálogo.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — agrega un plugin del catálogo mediante delegación oficial a DSH

```text
dsh-plugins add [options] <id>
```

| Opción                   | Significado                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | Perfil de DSH a modificar (requerido en la práctica; el comando falla sin él) |
| `--dry-run`              | Muestra el plan verificado sin archivos ni subprocesos               |
| `--allow-code-execution` | Da consentimiento al código de ciclo de vida de DSH/pnpm (deshabilitado en Windows nativo; use WSL) |
| `--catalog` / `--revision` / `--json` | Opciones comunes arriba                                  |

Semántica del dry-run en esta versión: el comando resuelve y verifica el plan para la entrada
fijada y lo imprime, sin crear archivos ni disparar subprocesos. La instalación real delega en
las herramientas oficiales de DSH y solo procede con `--allow-code-execution`.

```bash
# Solo vista previa — nada se escribe, nada se ejecuta:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Instalación real — consentimiento explícito al código de ciclo de vida:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — actualiza un plugin del catálogo mediante delegación oficial a DSH

```text
dsh-plugins update [options] <id>
```

Mismas opciones y semántica de consentimiento que `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, más las opciones comunes de catálogo.

### `remove` — elimina un plugin gestionado por el catálogo mediante delegación oficial a DSH

```text
dsh-plugins remove [options] <id>
```

Mismas opciones y semántica de consentimiento que `add`. Solo se eliminan las instalaciones
gestionadas por el catálogo.

### `recover` — recupera una mutación POSIX retenida

```text
dsh-plugins recover
```

Recupera una mutación POSIX retenida después de un `add`/`update`/`remove` interrumpido. Sin nada
pendiente, imprime `No mutation recovery is pending.` y sale con `0`. La recuperación nativa de
Windows sigue siendo manual, según la política documentada.

### `list` — lista las instalaciones gestionadas por el catálogo

```text
dsh-plugins list [--profile <name>] [--json]
```

Lista las instalaciones gestionadas por el catálogo sin modificar perfiles. `--profile <name>`
filtra por perfil de DSH. Sin instalaciones, imprime `No catalog-managed plugins installed.` y
sale con `0`.

### `doctor` — diagnóstico de solo lectura

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Ejecuta diagnósticos de solo lectura de Node, DSH, política nativa de Windows y catálogo. Cada
comprobación reporta `ok` o `error`; cualquier `error` hace que el código de salida general sea
`1`. Ejemplo de salida en una máquina sin el ejecutable `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Lo que la validación local no prueba

Una ejecución en verde de `catalog validate` confirma solo estructura y semántica local. No prueba
la identidad remota del repositorio, la propiedad del creador, ni la evidencia en el commit
fijado — los mantenedores aplican esos gates de procedencia separados antes de cualquier fusión,
tal como se describe en [CONTRIBUTING.md](../../CONTRIBUTING.md) y
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: 4f83ebb097bcbee07d61c5660c045f69c7b8d76a1d81184746f91f2b674cb298 -->
