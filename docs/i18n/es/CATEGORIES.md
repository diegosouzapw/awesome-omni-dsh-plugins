# Categorías del catálogo

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Español**

> **Proyecto comunitario no oficial. No afiliado, respaldado ni patrocinado por DeepSeek.**
> Los nombres y marcas de DeepSeek pertenecen a sus respectivos propietarios.

Cada entrada del catálogo tiene un tipo de artefacto, una categoría de capacidad primaria y cero
o más etiquetas. La categoría primaria determina dónde aparece la entrada; las etiquetas permiten
la búsqueda entre categorías sin duplicar la entrada.

## Tipos de artefacto

<!-- catalog-policy:aggregators-never-entries -->

| Valor | Significado | ¿Se clasifica por estrellas como plugin? |
|---|---|---:|
| `plugin` | Paquete nativo instalable de DSH | Solo cuando se cumplen todas las condiciones de clasificación |
| `plugin-family` | Repositorio que contiene varios plugins de DSH | No; sección separada |
| `skin-theme` | Skin de UI o tema visual de DSH | No; sección separada |
| `skill` | Skill de agente con soporte para DSH | No |
| `preset-profile` | Perfil o preset de DSH | No |
| `client-interface` | Cliente de escritorio, TUI, editor o remoto | No |
| `bridge-adapter` | Integración de otro producto hacia DSH | No |
| `ecosystem-project` | Proyecto más amplio que contiene una integración con DSH | No |

Un repositorio paraguas, agregador, marketplace, catálogo instalador o lista nunca es una entrada
del catálogo, incluso cuando el propio agregador sea instalable. Solo puede usarse como pista.
Siga cada pista hasta un artefacto hijo instalable de forma independiente y resuelva el creador
real, el repositorio original, el paquete y la subruta de origen de ese artefacto antes de
enviarlo. Un monorepo genuino de un creador puede ser el repositorio original de un plugin hijo,
pero el hijo debe usar esa subruta exacta y la política de estrellas de monorepo.

El campo `kind` es el discriminador canónico de artefacto de DSH. No existe un tipo de
integración separado: `plugin` ya significa un paquete nativo de DSH, mientras que
`ecosystem-project` ya significa un proyecto más amplio con integración con DSH. Esto evita
pares de clasificación contradictorios.

## Categorías de capacidad primaria

| Valor | Etiqueta de visualización |
|---|---|
| `user-interface-dashboards` | Interfaz de usuario y paneles |
| `memory-rag` | Memoria y RAG |
| `search-research` | Búsqueda e investigación |
| `coding-developer-tools` | Codificación y herramientas de desarrollo |
| `browser-automation` | Navegador y automatización |
| `vision-audio-multimodal` | Visión, audio y multimodal |
| `sessions-productivity` | Sesiones y productividad |
| `security-permissions-approvals` | Seguridad, permisos y aprobaciones |
| `diagnostics-observability` | Diagnóstico y observabilidad |
| `models-providers-routing` | Modelos, proveedores y enrutamiento |
| `messaging-notifications` | Mensajería y notificaciones |
| `data-external-services` | Datos y servicios externos |
| `entertainment-customization` | Entretenimiento y personalización |

Elija la categoría que mejor represente el trabajo principal del plugin, no la categoría que más
probablemente aumente la visibilidad.

## Etiquetas de interfaz

Las etiquetas de interfaz estándar incluyen `web-ui`, `sidebar`, `settings`, `tui`, `cli`,
`desktop`, `mobile`, `remote`, `editor`, `headless` y `theme`. Se permiten etiquetas de capacidad
adicionales en kebab-case minúsculo cuando describen evidencia visible en la fuente original
fijada.

## Alcance del repositorio

Use `dedicated` solo cuando las estrellas del repositorio pertenezcan exactamente al plugin
catalogado. Use `monorepo` cuando el plugin sea una subruta o un paquete dentro de un proyecto
más amplio. Una entrada de monorepo debe usar `popularity.starsPolicy:
undefined-parent-repository` y `popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
