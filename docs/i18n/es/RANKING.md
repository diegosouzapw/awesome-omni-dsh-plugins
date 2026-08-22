# Metodología de clasificación

> 🌐 [English](../../docs/RANKING.md) · **Español**

> **Proyecto comunitario no oficial. No afiliado, respaldado ni patrocinado por DeepSeek.**
> Los nombres y marcas de DeepSeek pertenecen a sus respectivos propietarios.

Las clasificaciones son vistas transparentes sobre las entradas públicas fusionadas del catálogo.
Nunca usan una puntuación combinada oculta ni tratan las estrellas de un proyecto principal más
amplio como popularidad del plugin.

## Predicado de Top Plugins por estrellas

Una entrada califica solo cuando todas las condiciones siguientes son verdaderas:

```text
kind == plugin (el discriminador canónico de paquete nativo de DSH)
repositoryScope == dedicated
verification.status in [eligible, verified]
el repositorio está activo y no archivado
las estrellas pertenecen al repositorio exacto del plugin
la entrada está fusionada en el catálogo público
```

Las entradas que califican usan `popularity.starsPolicy: exact-repository` y un entero no
negativo en `popularity.stars`. Los empates usan el ID del plugin sin distinción de mayúsculas
como orden de visualización determinista; el desempate no implica una diferencia de calidad.

`kind` es el único discriminador de tipo de artefacto. El schema deliberadamente no almacena un
segundo tipo de integración con DSH que pudiera contradecirlo.

## Exclusiones explícitas

Un plugin dentro de un monorepo más amplio sigue siendo elegible para el catálogo, pero sus
estrellas del proyecto padre están indefinidas para la clasificación de plugins. Debe usar
`repositoryScope: monorepo`, `popularity.starsPolicy: undefined-parent-repository` y
`popularity.stars: null`. Aparece en secciones funcionales y queda excluido de toda clasificación
basada en estrellas.

Las familias de plugins, temas, skins, skills, presets, clientes, interfaces, puentes y proyectos
de ecosistema más amplios no aparecen en Top Plugins por estrellas. Reciben secciones separadas
donde existen datos comparables. Los agregadores, marketplaces, catálogos instaladores y listas
no son entradas del catálogo y no reciben sección propia.

## Vistas de clasificación

El proyecto puede publicar vistas distintas para estrellas, crecimiento en 24 horas, crecimiento
en 7 días, actualizaciones recientes, instalaciones verificadas, familias de plugins, temas y
skins, clientes e interfaces, e integraciones de ecosistema. Cada vista debe divulgar su propia
regla de inclusión y el momento de la instantánea.

Con cero entradas elegibles, Top Plugins no se renderiza. La primera fusión elegible crea una
vista de Top Plugins; la etiqueta cambia a Top 10 solo después de que existan diez entradas que
califiquen. No se permite ninguna clasificación de relleno ni fabricada.

## La verificación no es un respaldo

`eligible` significa que se validaron la estructura pública y la integración con DSH. `verified`
además significa que una prueba de humo de instalación pasó para la fuente o el paquete fijado.
Ningún estado es un respaldo, una garantía ni una certificación de seguridad absoluta.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
