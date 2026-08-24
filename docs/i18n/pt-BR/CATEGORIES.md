# Categorias do Catálogo

> 🌐 [English](../../CATEGORIES.md) · **Português (Brasil)** · [中文（简体）](../zh-CN/CATEGORIES.md)

Cada entrada de catálogo tem um `kind` de artefato, uma categoria de capacidade primária e zero
ou mais tags. A categoria primária determina onde a entrada aparece; as tags fornecem busca
entre categorias sem duplicar a entrada.

## Tipos de artefato

<!-- catalog-policy:aggregators-never-entries -->

| Valor | Significado | Ranqueado por estrelas como plugin |
|---|---|---:|
| `plugin` | Pacote nativo do DSH instalável | Somente quando toda condição de ranqueamento é atendida |
| `plugin-family` | Repositório contendo múltiplos plugins do DSH | Não; seção separada |
| `skin-theme` | Skin de UI ou tema visual do DSH | Não; seção separada |
| `skill` | Skill de agente com suporte ao DSH | Não |
| `preset-profile` | Perfil ou preset do DSH | Não |
| `client-interface` | Cliente desktop, TUI, de editor ou remoto | Não |
| `bridge-adapter` | Integração de outro produto com o DSH | Não |
| `ecosystem-project` | Projeto mais amplo contendo uma integração com o DSH | Não |

Um repositório guarda-chuva, agregador, marketplace, catálogo instalador ou lista nunca é uma
entrada de catálogo, mesmo quando o próprio agregador é instalável. Ele só pode ser usado como
pista. Siga cada pista até um artefato filho instalável de forma independente e resolva o
criador real, o repositório original, o pacote e o subcaminho de origem daquele artefato antes de
submetê-lo. Um monorepo genuíno do criador pode ser o repositório original de um plugin filho,
mas o filho deve usar exatamente esse subcaminho e a política de estrelas de monorepo.

O campo `kind` é o discriminador canônico de artefato do DSH. Não existe um `kind` de integração
separado: `plugin` já significa um pacote nativo do DSH, enquanto `ecosystem-project` já
significa um projeto mais amplo com integração ao DSH. Isso evita pares de classificação
contraditórios.

## Categorias de capacidade primária

| Valor | Rótulo de exibição |
|---|---|
| `user-interface-dashboards` | User interface and dashboards |
| `memory-rag` | Memory and RAG |
| `search-research` | Search and research |
| `coding-developer-tools` | Coding and developer tools |
| `browser-automation` | Browser and automation |
| `vision-audio-multimodal` | Vision, audio and multimodal |
| `sessions-productivity` | Sessions and productivity |
| `security-permissions-approvals` | Security, permissions and approvals |
| `diagnostics-observability` | Diagnostics and observability |
| `models-providers-routing` | Models, providers and routing |
| `messaging-notifications` | Messaging and notifications |
| `data-external-services` | Data and external services |
| `entertainment-customization` | Entertainment and customization |

Escolha a categoria que melhor representa a função primária do plugin, não a categoria com maior
probabilidade de aumentar a visibilidade.

## Tags de interface

Tags de interface padrão incluem `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` e `theme`. Tags de capacidade adicionais em
kebab-case minúsculo são permitidas quando descrevem evidência visível na fonte original fixada.

## Escopo do repositório

Use `dedicated` somente quando as estrelas do repositório pertencerem exatamente ao plugin
catalogado. Use `monorepo` quando o plugin for um subcaminho ou pacote dentro de um projeto mais
amplo. Uma entrada de monorepo deve usar `popularity.starsPolicy: undefined-parent-repository` e
`popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
