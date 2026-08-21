# Contribuir

> 🌐 [English](../../CONTRIBUTING.md) · **Español**

> **Proyecto comunitario no oficial. No afiliado, respaldado ni patrocinado por DeepSeek.**
> Los nombres y marcas de DeepSeek pertenecen a sus respectivos propietarios.

Gracias por mejorar el catálogo. Las contribuciones dan prioridad al creador: use evidencia del
repositorio original, preserve la atribución y mantenga cada plugin revisable de forma
independiente. El catálogo comienza vacío por diseño; ninguna entrada se acepta sin su propio
pull request revisado.

## Empiece por el creador

Un pull request abierto directamente por el creador del plugin o por la organización propietaria
siempre es preferible. Si el creador está listo para contribuir, use su rama y su pull request en
lugar de recrear su trabajo en una rama de curaduría o automatización.

La curaduría de la comunidad es bienvenida cuando ayuda a un creador que aún no ha abierto un
pull request. No establece propiedad ni prioridad sobre una contribución directa posterior del
creador.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Un plugin por rama y pull request

Cree una rama dedicada para un único plugin y abra un único pull request desde esa rama. La rama
y el pull request deben crear o modificar exactamente un archivo YAML en `catalog/plugins/`. No
mezcle plugins, limpieza de documentación, índices generados u otro mantenimiento no relacionado
en esa rama o pull request.

El ID de la entrada y el nombre del archivo deben ser el mismo valor en kebab-case minúsculo. Los
mantenedores revisan y fusionan cada pull request de plugin individualmente; un lote que contenga
varios plugins no se divide ni se fusiona parcialmente.

## Resuelva la fuente original

Todo campo público debe reconstruirse a partir del repositorio original del creador, el paquete,
el manifiesto, el README, la licencia o el release en el commit fijado. No copie el texto, la
asignación de categoría, capturas de pantalla, ranking, insignias ni metadatos generados de otro
catálogo o agregador. Un enlace encontrado en un proyecto paraguas, marketplace, lista o agregador
es solo una pista, no es evidencia ni es la fuente del plugin.

Nunca envíe un proyecto paraguas, agregador, marketplace, catálogo instalador o lista como entrada
del catálogo, incluso cuando sea instalable de forma independiente. Úselo solo como pista y
resuelva cada plugin hijo instalable de forma independiente hasta su creador real y repositorio
original. Un plugin en el monorepo real de su creador puede enviarse desde su subruta exacta, pero
debe seguir la política de estrellas de monorepo que se describe más abajo.

## Evidencia obligatoria

Proporcione todo lo siguiente en el pull request:

- La URL pública canónica del repositorio original y su ID de nodo de repositorio inmutable. Los
  mantenedores resuelven el ID de nodo y rechazan discrepancias de URL en el gate de procedencia
  separado.
- El handle público de GitHub del creador y la URL de perfil público correspondiente. El YAML
  almacena el handle una sola vez; la URL del perfil se deriva como `https://github.com/<handle>`.
- Un OID de commit de origen completo de 40 caracteres y la subruta exacta del plugin, o `null`
  para un plugin en la raíz del repositorio.
- Una descripción en inglés acotada y su ruta de evidencia en ese commit fijado.
- El `kind` del artefacto, la categoría primaria y las etiquetas seleccionadas en
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- La expresión SPDX completa de la licencia upstream, evidenciada en el commit fijado.
- Un descriptor de instalación canónico fijado a una versión exacta de npm, o al repositorio de
  origen, commit completo y subruta. El descriptor es datos, nunca un comando de shell.
- Evidencia de integración nativa con DSH y su ruta en el commit fijado.
- Evidencia de smoke test existente y no sensible para ese pin exacto del artefacto, o el valor
  explícito `not run`. No instale el plugin ni ejecute `preinstall`, `install`, `postinstall`,
  `prepare` u otro código de ciclo de vida de paquete/plugin solo para preparar una contribución
  al catálogo.
- Para un repositorio dedicado, el conteo de estrellas verificable para ese repositorio exacto,
  junto con la fuente pública y el momento de verificación. Para un plugin en monorepo, use la
  política de null obligatoria que se describe más abajo.
- Procedencia pública de Discussion o comentario cuando exista; en caso contrario, use `null`.
- El valor legible por máquina `unofficial: true`.

Si no existe un smoke test calificado, use `verification.status: eligible` y
`verification.smokeTest: null`. Use `verified` solo cuando exista evidencia de smoke test
revisable para el pin exacto. Ninguno de los dos estados es un respaldo ni una certificación de
seguridad.

Nunca envíe credenciales, cookies, direcciones de correo privadas, código fuente no publicado u
otros secretos.

## Reglas de YAML y schema

Cree `catalog/plugins/<plugin-id>.yaml` y valídelo contra
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). El schema es la fuente de la
verdad para los nombres de campos y valores permitidos; [docs/CATEGORIES.md](../../docs/CATEGORIES.md)
define cómo elegir el único `kind` de artefacto, la categoría primaria, las etiquetas y el alcance
del repositorio.

Un descriptor npm debe contener un nombre de paquete válido y una versión exacta. El schema
público rechaza valores parecidos a opciones y no acotados, pero no reimplementa SemVer ni SRI: la
validación del catálogo debe interpretar la versión, exigir SemVer exacto e interpretar cualquier
valor de integridad como SRI SHA-512 válido. Un descriptor de source está vinculado a
`source.repository`, `source.commit` y `source.subpath` sin duplicar valores mutables de origen.

Los instaladores deben usar arrays de argumentos, deshabilitar la ejecución por shell y colocar un
terminador de opción antes de los valores posicionales proporcionados por el catálogo, cuando el
comando invocado lo permita. La validación de la contribución no debe invocar un instalador ni el
ciclo de vida de un plugin.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` es una comprobación local, de solo lectura, estructural y semántica. Interpreta
YAML seguro, valida el schema público, interpreta expresiones SPDX, exige SemVer exacto y SRI
SHA-512 válido, y rechaza IDs duplicados y claves canónicas de nodo-de-repositorio-más-subruta. No
contacta a GitHub, no resuelve la identidad del repositorio ni inspecciona rutas de evidencia en
el commit fijado.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Antes de que una entrada alcance `eligible`, los mantenedores resuelven por separado el
repositorio canónico y el ID de nodo, vinculan al creador con la fuente original e inspeccionan la
descripción declarada, la licencia, la integración con DSH y la evidencia de smoke test en
`source.commit`. Un resultado de validación local en verde no es prueba de procedencia ni de
origen.

## Estrellas del repositorio

Solo pueden registrarse las estrellas que pertenezcan verificablemente al repositorio dedicado
exacto del plugin. Las estrellas de un proyecto padre nunca deben atribuirse a un plugin
almacenado dentro de un monorepo más amplio. Una entrada de monorepo permanece elegible para las
secciones funcionales del catálogo, pero debe declarar:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Una entrada dedicada usa `repositoryScope: dedicated`, `starsPolicy: exact-repository` y el
conteo de estrellas no negativo observado en ese mismo repositorio. Lea
[docs/RANKING.md](../../docs/RANKING.md) antes de enviar datos de popularidad.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Precedencia del creador y contacto respetuoso

Para el mismo plugin canónico, la precedencia es:

1. Un pull request abierto por el creador o la organización propietaria.
2. Un pull request de la comunidad explícitamente aprobado por el creador.
3. Un pull request de curaduría de la comunidad ya válido y existente.
4. Un pull request de automatización del catálogo.

Un pull request directo del creador reemplaza cualquier pull request de curaduría o automatización
abierto, sin importar cuál se abrió primero o cuál está más avanzado. El pull request del creador
se convierte en el vehículo de revisión; los mantenedores no hacen force-push a la rama del
creador ni trasplantan su trabajo al pull request curado. Si una entrada curada ya se fusionó, el
historial público no se reescribe. El creador puede usar una solicitud de reclamo o corrección y
luego contribuir con un pull request de seguimiento directamente.

Un pull request curado debe usar una única mención pública respetuosa `@creador` en su
descripción, junto a un enlace al repositorio original, invitando al creador a revisarlo o
reemplazarlo con un pull request directo. No repita la mención, no abra issues promocionales, no
haga cross-post, no envíe mensajes directos no solicitados ni haga spam al creador de ninguna otra
forma.

<!-- creator-first:source-bound-git-identity -->

Los pull requests y commits autorados por el creador preservan naturalmente el crédito al creador.
Los commits curados pueden usar la autoría Git del creador o un trailer `Co-authored-by` solo con
una identidad vinculada a la fuente y públicamente verificable. Nunca invente ni adivine un correo
electrónico. Cuando no haya una identidad Git verificada disponible, el curador autora el commit y
otorga crédito explícito "Created by @handle" con el enlace al repositorio original en el YAML y
en el pull request. Una cuenta de mantenedor o automatización puede ser committer o coautor
verificado, pero no debe reemplazar la autoría del creador. Consulte
[docs/CREDIT.md](../../docs/CREDIT.md) para la política completa.

## Comandos de validación y disponibilidad

El CLI de npm se publica como `omni-dsh-plugins@1.0.1`, así que los comandos que siguen
están disponibles hoy a través de `npx`. Úselos exactamente como están escritos; los
contribuidores no deben inventar comandos alternativos.

Ejecute estos comandos desde la raíz del repositorio:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` realiza únicamente las comprobaciones locales de YAML, schema, SPDX, SemVer
exacto, SRI SHA-512 y duplicados descritas arriba, y acepta el catálogo intencionalmente vacío. No
prueba la identidad remota del repositorio ni la evidencia de origen fijada. Los demás comandos
verifican la documentación pública obligatoria y los formularios estructurados de issues de
GitHub. Pasar estos comandos localmente no relaja los requisitos de evidencia; los mantenedores
igualmente aplican cada gate de release correspondiente antes de fusionar.

## Gates de revisión, colisiones y fusión

Los mantenedores aplican todos los gates al commit actual del pull request antes de fusionar:

1. **Alcance:** una rama dedicada, un archivo YAML de plugin y ningún cambio no relacionado.
2. **Identidad original:** el creador, el repositorio canónico, el ID de nodo, el commit completo
   y la subruta concuerdan entre sí.
3. **Schema y evidencia:** el YAML, las categorías, el SPDX, el pin de instalación, la evidencia de
   DSH y el estado del smoke test son internamente consistentes sin ejecutar código de ciclo de
   vida del plugin.
4. **Popularidad:** las estrellas dedicadas son verificables en el repositorio exacto, o las
   estrellas de monorepo son `null` con `undefined-parent-repository`.
5. **Documentación y formularios:** la documentación pública, las cercas de Markdown y los
   formularios estructurados permanecen válidos.
6. **Colisión y deduplicación:** ninguna entrada fusionada ni pull request abierto representa el
   mismo plugin canónico.

Nombres o IDs diferentes no hacen distintos a los plugins duplicados. Trate el mismo ID de nodo de
repositorio y subruta, el mismo paquete canónico, u otro objetivo de instalación demostrablemente
idéntico como una colisión. Resuelva alias y pull requests en competencia antes de la fusión. Un
pull request directo del creador gana una colisión frente a curaduría o automatización; de lo
contrario, los mantenedores seleccionan un vehículo de revisión y cierran o redirigen los
duplicados en lugar de fusionar ambos.

Solo un mantenedor fusiona un plugin después de que todos los gates pasan. Cada plugin aceptado se
fusiona individualmente; la validación, curaduría o automatización no implican fusión automática
ni en lote.

## Lista de verificación del pull request

- [ ] Usé una rama dedicada y este PR modifica exactamente una entrada de plugin.
- [ ] La fuente es el repositorio original del creador, no un proyecto paraguas ni un agregador.
- [ ] El handle/perfil del creador, el repositorio, el ID de nodo, la subruta y el commit completo
      están evidenciados.
- [ ] El kind, la categoría y las etiquetas siguen `docs/CATEGORIES.md`.
- [ ] La licencia SPDX y el descriptor de instalación fijado están evidenciados.
- [ ] La integración nativa con DSH y el resultado del smoke test o el estado `not run` están
      evidenciados.
- [ ] No ejecuté código de ciclo de vida de plugin o paquete para preparar esta contribución.
- [ ] Las estrellas dedicadas son verificables, o las estrellas de monorepo usan la política de
      null obligatoria.
- [ ] Verifiqué si ya existe una entrada y un pull request abierto para el mismo plugin canónico.
- [ ] La entrada es explícitamente no oficial y no contiene secretos ni datos personales privados.

## Política de idioma

La documentación de lanzamiento y las descripciones del catálogo son exclusivamente en inglés. El
despliegue de 43 locales sigue siendo un elemento de backlog posterior al MVP; no agregue
documentos de locale vacíos ni traducciones automáticas masivas.

<!-- i18n-source-hash: 54fa0daef6ededc936a6f681d0cbe7463ec4080757d199e691824dfdc8b388f4 -->
