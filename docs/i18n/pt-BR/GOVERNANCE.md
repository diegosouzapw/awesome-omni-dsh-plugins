# Governança do Catálogo

> 🌐 [English](../../GOVERNANCE.md) · **Português (Brasil)** · [中文（简体）](../zh-CN/GOVERNANCE.md)

> **Projeto comunitário não oficial. Não afiliado, endossado ou patrocinado pela DeepSeek.**
> Nomes e marcas da DeepSeek pertencem aos respectivos proprietários.

Como o catálogo público é governado: quem decide o que entra, em que ordem contribuições
concorrentes são honradas, quais checagens rodam automaticamente e quais julgamentos permanecem
humanos. As políticas referenciadas aqui vivem em [CONTRIBUTING.md](../../CONTRIBUTING.md),
[docs/CREDIT.md](../../docs/CREDIT.md) e [docs/RANKING.md](../../docs/RANKING.md); esta página descreve como elas se
encaixam.

## Princípios

1. **Prioridade ao criador.** O catálogo existe para tornar o trabalho dos criadores
   descobrível, nunca para tomar posse dele. Para o mesmo plugin canônico, um pull request
   direto do criador substitui qualquer pull request de curadoria da comunidade ou automação em
   aberto — a ordem completa de precedência e as regras de identidade Git estão em
   [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Um plugin, um pull request revisado.** Sem merges em lote, sem importações em massa geradas
   no catálogo público. Cada entrada ganha sua própria revisão.
3. **Evidência acima de confiança.** Todo campo público remete ao repositório original do
   criador em um commit fixado. Uma checagem automatizada verde nunca é aceita como prova de
   origem.
4. **Sempre não oficial.** Nenhum estado do catálogo é apresentado como revisão, certificação ou
   endosso da DeepSeek.

## Como as mudanças chegam à `main`

Todas as mudanças chegam à `main` por meio de pull requests revisados — não há pushes diretos. A
política de trabalho para o branch padrão:

- **Somente pull requests.** Entradas de catálogo, documentação e mudanças de schema entram
  todas por meio de um PR; PRs de catálogo devem seguir a regra de um-plugin-por-branch em
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Histórico linear.** Os PRs são integrados de modo que a `main` mantenha um histórico linear e
  auditável; o histórico público mesclado não é reescrito. Se uma entrada curada foi mesclada
  antes de o criador se manifestar, o criador reivindica ou corrige a entrada em uma contribuição
  de acompanhamento, em vez de uma reescrita de histórico.
- **Resolução de threads de revisão.** As conversas de revisão são resolvidas antes do merge;
  feedback não resolvido bloqueia a integração.
- **Merge pelo mantenedor.** Somente um mantenedor mescla uma entrada de plugin, e somente depois
  que todo gate em [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Gates de revisão, colisões e
  merge" passa no commit atual do PR.

## A checagem `catalog-validation`

Todo pull request que toca `catalog/plugins/`, `schemas/` ou o próprio workflow executa o job
`catalog-validation` (`.github/workflows/validate-catalog.yml`), fixado na CLI publicada:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**O que ela valida** — apenas estrutura e semântica local:

- Parsing seguro de YAML de toda entrada em `catalog/plugins/`.
- Conformidade com o schema público (veja [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Parsing de expressão SPDX, versões SemVer exatas, valores de integridade SRI SHA-512 válidos.
- Rejeição de duplicatas: sem IDs de entrada repetidos e sem chaves canônicas de
  nó-de-repositório-mais-subcaminho repetidas.
- O catálogo intencionalmente com zero entradas passa (`0 entries valid; catalog is empty`).

**O que ela NÃO valida** — e, portanto, o que uma checagem verde nunca prova:

- Identidade remota do repositório: ela não contata o GitHub nem resolve o ID do nó do
  repositório contra a URL.
- Evidência no commit fixado: descrições, licenças, integração com o DSH e evidência de smoke
  test não são buscadas nem inspecionadas.
- Propriedade do criador, contagens de estrelas, ou colisão com pull requests em aberto.

Esses julgamentos pertencem aos gates de proveniência separados dos mantenedores, aplicados
antes do merge e descritos em [CONTRIBUTING.md](../../CONTRIBUTING.md). A checagem local é o
piso, não a barra.

## Estados de verificação

A verificação é registrada por entrada contra seu commit exato fixado, usando os estados
definidos no schema público (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). Os dois estados positivos são deliberadamente estreitos:

- `eligible` — a estrutura pública e a integração nativa com o DSH foram validadas.
- `verified` — adicionalmente, um smoke test de instalação passou para a fonte ou pacote
  fixado; o schema exige que o registro de smoke test esteja presente.

Nenhum estado — nem qualquer outro — é um endosso, garantia ou certificação de segurança. A
semântica completa, incluindo como os estados interagem com o ranking, está em
[docs/RANKING.md](../../docs/RANKING.md); o formato do registro está em [docs/SCHEMA.md](../../docs/SCHEMA.md).

## Reivindicações, correções e remoções

Formulários estruturados de issue do GitHub (`.github/ISSUE_TEMPLATE/`) são o caminho governado
para alterar uma entrada que você não submeteu:

| Formulário     | Quem usa                              | Resultado                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Reivindicação** | Um criador cujo plugin foi curado por outra pessoa | A propriedade é vinculada à fonte original; o criador pode então contribuir diretamente |
| **Correção**   | Qualquer pessoa que note metadados públicos incorretos | Uma correção revisada na entrada afetada          |
| **Remoção**    | Um criador que quer sua listagem removida, ou alguém reportando uma violação de política | Remoção revisada ou quarentena da entrada |

Regras que se aplicam aos três fluxos:

- Reivindicações de propriedade devem ser sustentadas por evidência pública verificável
  (propriedade do repositório, autoria de pacote, metadados de manifesto ou histórico de fonte
  fixado) — comentar em uma Discussion não estabelece autoria
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Problemas de segurança em um plugin listado vão primeiro para o mantenedor daquele plugin; o
  lado do catálogo então trata a correção ou quarentena sem publicar detalhes de exploração
  ([SECURITY.md](../../SECURITY.md)).
- Nunca inclua credenciais, dados de contato privados ou outros segredos em um formulário.

## Papéis

- **Criadores** são donos de seus plugins e da precedência de suas listagens. Podem contribuir
  diretamente, aprovar curadoria da comunidade, ou reivindicar/corrigir/remover uma entrada
  existente.
- **Contribuidores da comunidade** podem curar entradas para criadores que ainda não
  contribuíram, sob as regras de contato respeitoso e crédito em [docs/CREDIT.md](../../docs/CREDIT.md). A
  curadoria nunca supera uma contribuição direta posterior do criador.
- **Mantenedores** revisam, aplicam os gates de proveniência, resolvem colisões e mesclam.
  Também mantêm o website ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online))
  e o CLI publicado a partir de código-fonte privado; os dados públicos, o schema e as políticas
  deste repositório são o que essas superfícies consomem.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
