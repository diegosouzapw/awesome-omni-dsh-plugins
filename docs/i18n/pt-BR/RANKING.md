# Metodologia de Ranqueamento

> 🌐 [English](../../RANKING.md) · **Português (Brasil)** · [中文（简体）](../zh-CN/RANKING.md)

Os rankings são visões transparentes sobre as entradas de catálogo público mescladas. Eles nunca
usam uma pontuação combinada oculta e nunca tratam estrelas de um projeto pai amplo como
popularidade de plugin.

## Predicado de Top Plugins by Stars

Uma entrada se qualifica somente quando toda condição abaixo é verdadeira:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Entradas qualificadas usam `popularity.starsPolicy: exact-repository` e um inteiro não negativo
em `popularity.stars`. Empates usam o ID do plugin, sem diferenciar maiúsculas de minúsculas,
como ordem de exibição determinística; o critério de desempate não implica uma diferença de
qualidade.

`kind` é o único discriminador de tipo de artefato. O schema intencionalmente não armazena um
segundo `kind` de integração com o DSH que poderia contradizê-lo.

## Exclusões explícitas

Um plugin dentro de um monorepo mais amplo permanece elegível para o catálogo, mas suas estrelas
de projeto pai são indefinidas para o ranqueamento de plugins. Ele deve usar
`repositoryScope: monorepo`, `popularity.starsPolicy: undefined-parent-repository` e
`popularity.stars: null`. Ele aparece em seções funcionais e é excluído de todo ranqueamento
baseado em estrelas.

Famílias de plugins, temas, skins, skills, presets, clientes, interfaces, pontes e projetos de
ecossistema mais amplos não aparecem em Top Plugins by Stars. Eles recebem seções separadas onde
existem dados comparáveis. Agregadores, marketplaces, catálogos instaladores e listas não são
entradas de catálogo e não recebem seção de catálogo.

## Visões de ranqueamento

O projeto pode publicar visões distintas para estrelas, crescimento em 24 horas, crescimento em 7
dias, atualizações recentes, instalações verificadas, famílias de plugins, temas e skins,
clientes e interfaces, e integrações de ecossistema. Cada visão deve divulgar sua própria regra
de inclusão e horário de snapshot.

Com zero entradas elegíveis, o Top Plugins não é renderizado. O primeiro merge elegível cria uma
visão de Top Plugins; o rótulo muda para Top 10 somente depois que existirem dez entradas
qualificadas. Nenhum ranking-placeholder ou fabricado é permitido.

## Verificação não é endosso

`eligible` significa que a estrutura pública e a integração com o DSH foram validadas. `verified`
significa adicionalmente que um smoke test de instalação passou para a fonte ou pacote fixado.
Nenhum dos dois status é um endosso, garantia ou certificação de segurança absoluta.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
