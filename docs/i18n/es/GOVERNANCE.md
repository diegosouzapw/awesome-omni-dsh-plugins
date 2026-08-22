# Gobernanza del catálogo

> 🌐 [English](../../docs/GOVERNANCE.md) · **Español**

> **Proyecto comunitario no oficial. No afiliado, respaldado ni patrocinado por DeepSeek.**
> Los nombres y marcas de DeepSeek pertenecen a sus respectivos propietarios.

Cómo se gobierna el catálogo público: quién decide qué entra, en qué orden se honran las
contribuciones en competencia, qué comprobaciones se ejecutan automáticamente y qué juicios
siguen siendo humanos. Las políticas referenciadas aquí viven en
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md) y
[docs/RANKING.md](../../docs/RANKING.md); esta página describe cómo encajan entre sí.

## Principios

1. **Prioridad al creador.** El catálogo existe para hacer descubrible el trabajo de los
   creadores, nunca para tomar posesión de él. Para el mismo plugin canónico, un pull request
   directo del creador reemplaza cualquier pull request de curaduría comunitaria o automatización
   abierto — el orden de precedencia completo y las reglas de identidad de Git están en
   [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Un plugin, un pull request revisado.** Sin fusiones en lote, sin importaciones masivas
   generadas hacia el catálogo público. Cada entrada se gana su propia revisión.
3. **Evidencia sobre confianza.** Cada campo público se remonta al repositorio original del
   creador en un commit fijado. Una comprobación automatizada en verde nunca se acepta como
   prueba de origen.
4. **No oficial, siempre.** Ningún estado del catálogo se presenta como revisión, certificación o
   respaldo de DeepSeek.

## Cómo llegan los cambios a `main`

Todos los cambios llegan a `main` mediante pull requests revisados — no hay pushes directos. La
política de trabajo para la rama por defecto:

- **Solo pull requests.** Las entradas del catálogo, la documentación y los cambios de schema
  entran todos mediante un PR; los PR de catálogo deben seguir la regla de un-plugin-por-rama en
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Historial lineal.** Los PR se integran de forma que `main` mantenga un historial lineal y
  auditable; el historial público fusionado no se reescribe. Si una entrada curada se fusionó
  antes de que el creador se presentara, el creador la reclama o la corrige en una contribución
  de seguimiento en lugar de una reescritura del historial.
- **Resolución de hilos de revisión.** Las conversaciones de revisión se resuelven antes de
  fusionar; el feedback sin resolver bloquea la integración.
- **Fusión por mantenedor.** Solo un mantenedor fusiona una entrada de plugin, y solo después de
  que cada gate en [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Gates de revisión, colisiones y
  fusión" pasa en el commit actual del PR.

## La comprobación `catalog-validation`

Cada pull request que toca `catalog/plugins/`, `schemas/` o el propio workflow ejecuta el job
`catalog-validation` (`.github/workflows/validate-catalog.yml`), fijado a la CLI publicada:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Qué valida** — solo estructura y semántica local:

- Interpretación segura de YAML de cada entrada bajo `catalog/plugins/`.
- Conformidad con el schema público (ver [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Interpretación de expresión SPDX, versiones SemVer exactas, valores de integridad SRI SHA-512
  válidos.
- Rechazo de duplicados: sin IDs de entrada repetidos y sin claves canónicas repetidas de
  nodo-de-repositorio-más-subruta.
- El catálogo intencionalmente vacío pasa (`0 entries valid; catalog is empty`).

**Qué NO valida** — y por lo tanto qué nunca prueba una comprobación en verde:

- Identidad remota del repositorio: no contacta a GitHub ni resuelve el ID de nodo del
  repositorio contra la URL.
- Evidencia en el commit fijado: las descripciones, licencias, integración con DSH y evidencia de
  smoke test no se obtienen ni se inspeccionan.
- Propiedad del creador, conteo de estrellas, o colisión con pull requests abiertos.

Esos juicios pertenecen a los gates de procedencia separados de los mantenedores, aplicados antes
de la fusión y descritos en [CONTRIBUTING.md](../../CONTRIBUTING.md). La comprobación local es el
piso, no el techo.

## Estados de verificación

La verificación se registra por entrada frente a su commit exacto fijado, usando los estados
definidos en el schema público (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). Los dos estados positivos son deliberadamente estrechos:

- `eligible` — se validaron la estructura pública y la integración nativa con DSH.
- `verified` — adicionalmente, una prueba de humo de instalación pasó para la fuente o el paquete
  fijado; el schema exige que el registro de smoke test esté presente.

Ningún estado — ni ningún otro — es un respaldo, garantía o certificación de seguridad. La
semántica completa, incluyendo cómo interactúan los estados con la clasificación, está en
[docs/RANKING.md](../../docs/RANKING.md); la forma del registro está en
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Reclamaciones, correcciones y eliminaciones

Los formularios estructurados de issues de GitHub (`.github/ISSUE_TEMPLATE/`) son el camino
gobernado para cambiar una entrada que usted no envió:

| Formulario     | Quién lo usa                              | Resultado                                             |
| -------------- | ----------------------------------------- | ------------------------------------------------------ |
| **Reclamo**    | Un creador cuyo plugin fue curado por otra persona | La propiedad se vincula a la fuente original; el creador puede entonces contribuir directamente |
| **Corrección** | Cualquiera que detecte metadatos públicos inexactos | Una corrección revisada a la entrada afectada           |
| **Eliminación**| Un creador que quiere que su listado se elimine, o alguien que reporta una violación de política | Eliminación revisada o cuarentena de la entrada |

Reglas que se aplican a los tres flujos:

- Las reclamaciones de propiedad deben estar respaldadas por evidencia pública verificable
  (propiedad del repositorio, autoría del paquete, metadatos del manifiesto o historial de la
  fuente fijada) — comentar en una Discussion no establece la autoría
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Los problemas de seguridad en un plugin listado van primero a su propio mantenedor; el lado del
  catálogo entonces maneja la corrección o cuarentena sin publicar detalles del exploit
  ([SECURITY.md](../../SECURITY.md)).
- Nunca incluya credenciales, datos de contacto privados u otros secretos en un formulario.

## Roles

- **Creadores** son dueños de sus plugins y de la precedencia de sus listados. Pueden contribuir
  directamente, aprobar la curaduría comunitaria, o reclamar/corregir/eliminar una entrada
  existente.
- **Contribuidores de la comunidad** pueden curar entradas para creadores que aún no han
  contribuido, bajo las reglas de contacto respetuoso y crédito en
  [docs/CREDIT.md](../../docs/CREDIT.md). La curaduría nunca supera una contribución directa
  posterior del creador.
- **Mantenedores** revisan, aplican los gates de procedencia, resuelven colisiones y fusionan.
  También mantienen el sitio web
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) y la CLI publicada desde
  código fuente privado; los datos públicos, el schema y las políticas de este repositorio son lo
  que esas superficies consumen.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
