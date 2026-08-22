# Governação do Catálogo

> **Projeto comunitário não oficial. Sem afiliação, sem endosso e sem patrocínio da DeepSeek.**
> Os nomes e marcas DeepSeek pertencem aos respetivos proprietários.

Como o catálogo público é governado: quem decide o que entra, por que ordem as contribuições
concorrentes são honradas, que verificações correm automaticamente e que decisões continuam a
ser humanas. As políticas aqui referidas vivem em
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md) e
[docs/RANKING.md](../../docs/RANKING.md); esta página descreve como se encaixam.

## Princípios

1. **Prioridade ao criador.** O catálogo existe para tornar o trabalho dos criadores
   descobrível, nunca para se apropriar dele. Para o mesmo plugin canónico, um pull request
   direto do criador tem precedência sobre qualquer pull request de curadoria da comunidade ou
   de automação em aberto — a ordem de precedência completa e as regras de identidade Git estão
   em [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Um plugin, um pull request revisto.** Sem merges em lote, sem importações geradas em massa
   para o catálogo público. Cada entrada ganha a sua própria revisão.
3. **Prova acima de confiança.** Cada campo público remonta ao repositório original do criador
   num commit fixado. Uma verificação automatizada verde nunca é aceite como prova de origem.
4. **Sempre não oficial.** Nenhum estado do catálogo é apresentado como revisão, certificação ou
   endosso da DeepSeek.

## Como as alterações chegam à `main`

Todas as alterações chegam à `main` através de pull requests revistos — não há pushes diretos.
A política de trabalho para o branch predefinido:

- **Apenas pull requests.** As entradas de catálogo, a documentação e as alterações de esquema
  entram todas através de um PR; os PRs de catálogo têm de seguir a regra de um plugin por
  branch em [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Histórico linear.** Os PRs são integrados de forma a que a `main` mantenha um histórico
  linear e auditável; o histórico público integrado não é reescrito. Se uma entrada curada foi
  integrada antes de o criador se manifestar, o criador reivindica-a ou corrige-a numa
  contribuição de acompanhamento, em vez de uma reescrita de histórico.
- **Resolução das threads de revisão.** As conversas de revisão são resolvidas antes da
  integração; feedback não resolvido bloqueia a integração.
- **Integração pelos mantenedores.** Só um mantenedor integra uma entrada de plugin, e só depois
  de todos os controlos em [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Controlos de revisão,
  colisões e integração" passarem no commit atual do PR.

## A verificação `catalog-validation`

Todo o pull request que altere `catalog/plugins/`, `schemas/` ou o próprio workflow executa a
tarefa `catalog-validation` (`.github/workflows/validate-catalog.yml`), fixada à CLI publicada:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**O que valida** — apenas estrutura e semântica local:

- Análise segura de YAML de cada entrada em `catalog/plugins/`.
- Conformidade com o esquema público (veja [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Análise de expressões SPDX, versões SemVer exatas, valores de integridade SRI SHA-512
  válidos.
- Rejeição de duplicados: sem IDs de entrada repetidos e sem chaves canónicas repetidas de nó
  de repositório mais subcaminho.
- O catálogo intencionalmente sem entradas passa (`0 entries valid; catalog is empty`).

**O que NÃO valida** — e, por isso, o que uma verificação verde nunca prova:

- Identidade remota do repositório: não contacta o GitHub nem resolve o ID de nó do repositório
  face ao URL.
- Prova no commit fixado: descrições, licenças, integração com o DSH e prova de teste de fumo
  não são obtidas nem inspecionadas.
- Propriedade do criador, contagens de estrelas ou colisão com pull requests em aberto.

Essas decisões pertencem aos controlos de proveniência separados dos mantenedores, aplicados
antes da integração e descritos em [CONTRIBUTING.md](../../CONTRIBUTING.md). A verificação local
é o piso, não o teto.

## Estados de verificação

A verificação é registada por entrada, face ao seu commit fixado exato, usando os estados
definidos no esquema público (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). Os dois estados positivos são deliberadamente estreitos:

- `eligible` — a estrutura pública e a integração nativa com o DSH foram validadas.
- `verified` — adicionalmente, um teste de fumo de instalação passou para a fonte ou pacote
  fixado; o esquema exige que o registo do teste de fumo esteja presente.

Nem esse estado — nem qualquer outro — é um endosso, uma garantia ou uma certificação de
segurança. A semântica completa, incluindo como os estados interagem com a classificação, está
em [docs/RANKING.md](../../docs/RANKING.md); a forma do registo está em
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Reivindicações, correções e remoções

Os formulários estruturados de issues do GitHub (`.github/ISSUE_TEMPLATE/`) são o caminho
governado para alterar uma entrada que não submeteu:

| Formulário     | Quem o usa                                              | Resultado                                                          |
| --------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Reivindicação** | Um criador cujo plugin foi curado por outra pessoa      | A propriedade é vinculada à fonte original; o criador pode então contribuir diretamente |
| **Correção**    | Qualquer pessoa que detete metadados públicos incorretos | Uma correção revista à entrada afetada                                 |
| **Remoção**     | Um criador que quer a sua listagem removida, ou um denunciante de uma violação de política | Remoção ou quarentena revista da entrada |

Regras aplicáveis aos três fluxos:

- As reivindicações de propriedade têm de ser sustentadas por prova pública verificável
  (propriedade do repositório, autoria do pacote, metadados do manifesto ou histórico da fonte
  fixada) — comentar numa Discussion não estabelece a autoria
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Os problemas de segurança num plugin listado vão primeiro para o mantenedor desse plugin; o
  lado do catálogo trata depois da correção ou quarentena, sem publicar detalhes de exploração
  ([SECURITY.md](../../SECURITY.md)).
- Nunca inclua credenciais, dados de contacto privados ou outros segredos num formulário.

## Papéis

- **Criadores** são donos dos seus plugins e da precedência das suas listagens. Podem contribuir
  diretamente, aprovar a curadoria da comunidade, ou reivindicar/corrigir/remover uma entrada
  existente.
- **Contribuidores da comunidade** podem curar entradas para criadores que ainda não
  contribuíram, sob as regras de contacto respeitoso e crédito em
  [docs/CREDIT.md](../../docs/CREDIT.md). A curadoria nunca supera uma contribuição direta
  posterior do criador.
- **Mantenedores** revêem, aplicam os controlos de proveniência, resolvem colisões e integram.
  Também mantêm o site
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) e a CLI publicada a
  partir de código-fonte privado; os dados públicos, o esquema e as políticas deste
  repositório são o que essas superfícies consomem.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
