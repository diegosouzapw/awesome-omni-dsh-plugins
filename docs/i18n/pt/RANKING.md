# Metodologia de Classificação

As classificações são vistas transparentes sobre entradas públicas integradas no catálogo.
Nunca usam uma pontuação combinada oculta e nunca tratam as estrelas de um projeto-pai amplo
como popularidade do plugin.

## Predicado de Top Plugins por Estrelas

Uma entrada só se qualifica quando todas as condições abaixo são verdadeiras:

```text
kind == plugin (o discriminador canónico do pacote nativo do DSH)
repositoryScope == dedicated
verification.status in [eligible, verified]
repositório ativo e não arquivado
estrelas pertencentes exatamente ao repositório do plugin
entrada integrada no catálogo público
```

As entradas qualificadas usam `popularity.starsPolicy: exact-repository` e um inteiro não
negativo em `popularity.stars`. Os empates usam o ID do plugin, sem distinção entre maiúsculas
e minúsculas, como ordem de exibição determinística; o desempate não implica uma diferença de
qualidade.

O `kind` é o único discriminador de tipo de artefacto. O esquema não guarda intencionalmente um
segundo tipo de integração com o DSH que o pudesse contradizer.

## Exclusões explícitas

Um plugin dentro de um monorepo mais amplo continua elegível para o catálogo, mas as suas
estrelas de projeto-pai não são definidas para efeitos de classificação de plugins. Tem de usar
`repositoryScope: monorepo`, `popularity.starsPolicy: undefined-parent-repository` e
`popularity.stars: null`. Aparece em secções funcionais e é excluído de toda a classificação
baseada em estrelas.

As famílias de plugins, temas, skins, skills, predefinições, clientes, interfaces, pontes e
projetos de ecossistema mais amplos não aparecem em Top Plugins by Stars. Recebem secções
separadas onde existem dados comparáveis. Agregadores, mercados, catálogos de instaladores e
listas não são entradas de catálogo e não recebem secção de catálogo.

## Vistas de classificação

O projeto pode publicar vistas distintas para estrelas, crescimento em 24 horas, crescimento em
7 dias, atualizações recentes, instalações verificadas, famílias de plugins, temas e skins,
clientes e interfaces, e integrações de ecossistema. Cada vista tem de divulgar a sua própria
regra de inclusão e a hora do snapshot.

Com zero entradas elegíveis, o Top Plugins não é apresentado. A primeira integração elegível
cria uma vista de Top Plugins; a etiqueta só muda para Top 10 depois de existirem dez entradas
qualificadas. Não é permitida nenhuma classificação de preenchimento nem fabricada.

## A verificação não é um endosso

`eligible` significa que a estrutura pública e a integração com o DSH foram validadas.
`verified` significa, adicionalmente, que um teste de fumo de instalação passou para a fonte ou
o pacote fixado. Nenhum dos dois estados é um endosso, uma garantia ou uma certificação de
segurança absoluta.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
