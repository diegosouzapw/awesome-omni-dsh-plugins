# Categorias do Catálogo

Cada entrada do catálogo tem um tipo de artefacto, uma categoria principal de capacidade e zero
ou mais etiquetas. A categoria principal determina onde a entrada aparece; as etiquetas
permitem a pesquisa entre categorias, sem duplicar a entrada.

## Tipos de artefacto

<!-- catalog-policy:aggregators-never-entries -->

| Valor | Significado | Classificado por estrelas como plugin |
|---|---|---:|
| `plugin` | Pacote nativo do DSH instalável | Só quando todas as condições de classificação são cumpridas |
| `plugin-family` | Repositório que contém vários plugins do DSH | Não; secção separada |
| `skin-theme` | Skin de UI ou tema visual do DSH | Não; secção separada |
| `skill` | Skill de agente com suporte ao DSH | Não |
| `preset-profile` | Perfil ou predefinição do DSH | Não |
| `client-interface` | Cliente de desktop, TUI, editor ou remoto | Não |
| `bridge-adapter` | Integração de outro produto no DSH | Não |
| `ecosystem-project` | Projeto mais amplo que contém uma integração com o DSH | Não |

Um repositório guarda-chuva, agregador, mercado, catálogo de instaladores ou lista nunca é uma
entrada de catálogo, mesmo quando o próprio agregador é instalável. Só pode ser usado como
pista. Siga cada pista até um artefacto filho instalável de forma independente e resolva o
criador real desse artefacto, o repositório original, o pacote e o subcaminho de origem antes de
o submeter. Um monorepo genuíno do criador pode ser o repositório original de um plugin filho,
mas o filho tem de usar esse subcaminho exato e a política de estrelas de monorepo.

O campo `kind` é o discriminador canónico de artefacto do DSH. Não existe um tipo de integração
separado: `plugin` já significa um pacote nativo do DSH, enquanto `ecosystem-project` já
significa um projeto mais amplo com integração com o DSH. Isto evita pares de classificação
contraditórios.

## Categorias principais de capacidade

| Valor | Etiqueta de exibição |
|---|---|
| `user-interface-dashboards` | Interface de utilizador e painéis |
| `memory-rag` | Memória e RAG |
| `search-research` | Pesquisa e investigação |
| `coding-developer-tools` | Programação e ferramentas de desenvolvimento |
| `browser-automation` | Navegador e automação |
| `vision-audio-multimodal` | Visão, áudio e multimodal |
| `sessions-productivity` | Sessões e produtividade |
| `security-permissions-approvals` | Segurança, permissões e aprovações |
| `diagnostics-observability` | Diagnóstico e observabilidade |
| `models-providers-routing` | Modelos, fornecedores e encaminhamento |
| `messaging-notifications` | Mensagens e notificações |
| `data-external-services` | Dados e serviços externos |
| `entertainment-customization` | Entretenimento e personalização |

Escolha a categoria que melhor representa a função principal do plugin, não a categoria mais
provável de aumentar a visibilidade.

## Etiquetas de interface

As etiquetas de interface padrão incluem `web-ui`, `sidebar`, `settings`, `tui`, `cli`,
`desktop`, `mobile`, `remote`, `editor`, `headless` e `theme`. São permitidas etiquetas
adicionais de capacidade em kebab-case minúsculo, quando descrevem prova visível na fonte
original fixada.

## Âmbito do repositório

Use `dedicated` apenas quando as estrelas do repositório pertencem exatamente ao plugin
catalogado. Use `monorepo` quando o plugin é um subcaminho ou pacote dentro de um projeto mais
amplo. Uma entrada de monorepo tem de usar `popularity.starsPolicy:
undefined-parent-repository` e `popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
