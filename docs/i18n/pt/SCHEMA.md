# Referência do esquema de entradas do catálogo

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Português**

> **Projeto comunitário não oficial. Sem afiliação, sem endosso e sem patrocínio da DeepSeek.**
> Os nomes e marcas DeepSeek pertencem aos respetivos proprietários.

Esta é a referência campo a campo de
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), o JSON Schema público
(draft 2020-12) que todo o ficheiro em `catalog/plugins/` tem de satisfazer. O próprio ficheiro
de esquema é a fonte da verdade; quando esta página e o esquema divergem, prevalece o esquema.

Aplicam-se duas camadas de validação. O esquema público impõe *formas seguras* limitadas
(padrões e comprimentos que rejeitam valores semelhantes a opções ou não limitados). Por cima
disso, o `catalog validate` aplica analisadores semânticos obrigatórios: SemVer exato para
versões, SRI SHA-512 para valores de integridade, análise de expressões SPDX para licenças, e
rejeição de chaves duplicadas. Um valor pode corresponder ao padrão do esquema e ainda assim ser
rejeitado semanticamente.

Regras de nível superior: a entrada é um único objeto YAML, `additionalProperties: false`
(campos desconhecidos são rejeitados), e todos os campos abaixo são obrigatórios, exceto `media`,
o único campo opcional.

## Campos de topo

| Campo              | Tipo    | Obrigatório | Resumo                                                          |
| ------------------ | ------- | :---------: | ----------------------------------------------------------------- |
| `schemaVersion`     | const   |     sim     | Tem de ser exatamente `1`                                         |
| `id`                | string  |     sim     | ID de entrada em kebab-case minúsculo; tem de corresponder ao nome do ficheiro |
| `name`              | string  |     sim     | Nome de exibição, 1–120 carateres                                  |
| `description`       | object  |     sim     | Resumo curado em inglês, mais o respetivo caminho de prova         |
| `unofficial`        | const   |     sim     | Tem de ser exatamente `true`                                       |
| `kind`              | enum    |     sim     | Discriminador canónico do artefacto                                |
| `primaryCategory`   | enum    |     sim     | Uma única categoria principal de capacidade                        |
| `tags`              | array   |     sim     | Etiquetas únicas em kebab-case minúsculo (pode ser vazio)           |
| `source`            | object  |     sim     | Repositório original, ID de nó, subcaminho e commit fixado          |
| `creator`           | object  |     sim     | Identificador público do criador no GitHub                         |
| `package`           | object  |     sim     | Descritor de instalação canónico (npm **ou** fonte)                 |
| `dsh`               | object  |     sim     | Perfis do DSH e caminho de prova de integração nativa               |
| `repositoryScope`   | enum    |     sim     | `dedicated` ou `monorepo`                                          |
| `popularity`        | object  |     sim     | Política de estrelas e contagem de estrelas (condicional ao âmbito) |
| `license`           | object  |     sim     | Expressão SPDX da licença a montante                                |
| `verification`      | object  |     sim     | Estado de verificação, hora de verificação, identidade e teste de fumo |
| `provenance`         | object  |     sim     | URLs públicos de Discussion/comentário, ou `null`                   |
| `media`           | array   |    não    | Até 6 capturas/vídeos, cada URL fixada em `source.commit` |

### `schemaVersion`

Constante `1`. Identifica a versão 1 do esquema público; qualquer outro valor é inválido.

### `id`

String que corresponde a `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kebab-case minúsculo, sem hífenes
iniciais/finais ou duplos. Segundo [CONTRIBUTING.md](../../CONTRIBUTING.md), o ficheiro da
entrada tem de se chamar `catalog/plugins/<id>.yaml` com o mesmo valor; o validador rejeita uma
incompatibilidade (`id-filename-mismatch`). O ID também tem de começar com o espaço de nomes do
criador: o identificador `creator.github` em minúsculas, com cada sequência de carateres fora de
`[a-z0-9]` colapsada num único `-`, seguido de `-` (`id-creator-prefix`).

### `name`

Nome de exibição em formato livre, `minLength: 1`, `maxLength: 120`.

### `description`

Objeto com exatamente duas propriedades obrigatórias (nenhuma outra é permitida):

| Propriedade    | Tipo   | Regras                                                                            |
| -------------- | ------ | ----------------------------------------------------------------------------------- |
| `en`           | string | Resumo em inglês, 20–320 carateres                                                  |
| `evidencePath` | string | Padrão de caminho relativo ao repositório; sem `/` inicial, sem barras invertidas, sem segmentos `.`/`..` |

O resumo em inglês tem de ser curado a partir do ficheiro em `evidencePath` tal como existe em
`source.commit` — nunca copiado de outro catálogo.

### `unofficial`

Constante `true`. Marcador legível por máquina de que a listagem é não oficial.

### `kind`

O **único** discriminador de tipo de artefacto (não existe um segundo campo de tipo de
integração). Um de:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Os significados e as consequências na classificação estão definidos em
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Uma das catorze categorias de capacidade:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

As etiquetas de exibição e as orientações de seleção estão em
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Array de strings únicas, cada uma correspondendo a `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case
minúsculo). O esquema não impõe um número mínimo.

### `source`

Objeto com exatamente quatro propriedades obrigatórias:

| Propriedade         | Tipo             | Regras                                                                     |
| -------------------- | ---------------- | ----------------------------------------------------------------------------- |
| `repository`         | string           | URL `https://github.com/<owner>/<repo>`; o owner segue as regras de nome de utilizador do GitHub, o nome do repo tem 1–100 carateres, não pode ser `.`/`..` nem terminar em `.git` |
| `repositoryNodeId`   | string           | ID de nó de repositório do GitHub imutável, não vazio                          |
| `subpath`            | string ou null   | Subcaminho do plugin dentro do repositório (mesmo padrão seguro de caminho relativo que `evidencePath`), ou `null` para um plugin na raiz do repositório |
| `commit`              | string           | OID de commit hexadecimal completo com 40 carateres                            |

A validação do catálogo tem de resolver o `repositoryNodeId` e rejeitar uma incompatibilidade
de URL de repositório — essa resolução é um controlo do lado do mantenedor, não faz parte da
verificação estrutural local.

### `creator`

Objeto com uma única propriedade obrigatória:

| Propriedade | Tipo   | Regras                                                    |
| ----------- | ------ | ------------------------------------------------------------ |
| `github`    | string | Nome de utilizador do GitHub (1–39 carateres, regras de identificador do GitHub) |

O URL de perfil público é sempre derivado como `https://github.com/<handle>`; não existe um
segundo campo de perfil guardado, pelo que os dois nunca podem divergir.

### `package`

O descritor de instalação canónico. É dado, nunca um comando de shell, e assume exatamente uma
de duas formas (`oneOf`):

**Pacote npm** — obrigatórios `ecosystem`, `name`, `version`; opcional `integrity`:

| Propriedade  | Tipo   | Regras                                                                        |
| ------------- | ------ | ---------------------------------------------------------------------------------- |
| `ecosystem`   | const  | `npm`                                                                               |
| `name`        | string | Forma de nome de pacote npm (opcionalmente com escopo), máx. 214 carateres         |
| `version`     | string | Forma exata de versão `x.y.z` (pré-lançamento/build opcional); intervalos são rejeitados. A camada semântica exige adicionalmente um SemVer exato e analisável |
| `integrity`   | string | Forma opcional `sha512-…` de SRI, 8–256 carateres. A camada semântica tem de a analisar como SRI SHA-512 válido |

**Instalação de fonte** — obrigatório apenas `ecosystem`:

| Propriedade  | Tipo   | Regras   |
| ------------- | ------ | -------- |
| `ecosystem`   | const  | `source` |

Um descritor de fonte guarda deliberadamente mais nada: o repositório, o commit e o subcaminho
são derivados de `source`, pelo que os valores mutáveis nunca são duplicados.

### `dsh`

Prova de integração nativa com o DSH:

| Propriedade    | Tipo   | Regras                                                              |
| --------------- | ------ | ------------------------------------------------------------------------ |
| `profiles`      | array  | Pelo menos um nome de perfil único correspondente a `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath`  | string | Caminho relativo seguro para a prova de integração com o DSH em `source.commit` |

### `repositoryScope`

`dedicated` (as estrelas do repositório pertencem exatamente a este plugin) ou `monorepo` (o
plugin é um subcaminho ou pacote dentro de um projeto mais amplo). Este valor determina as
regras condicionais de popularidade abaixo.

### `popularity`

| Propriedade    | Tipo               | Regras                                                |
| --------------- | ------------------ | ---------------------------------------------------------- |
| `starsPolicy`   | enum               | `exact-repository` ou `undefined-parent-repository`         |
| `stars`         | integer ou null    | Inteiro não negativo, ou `null`                              |

Regras condicionais (impostas pelos blocos `allOf` do esquema):

- `repositoryScope: monorepo` **obriga** a `starsPolicy: undefined-parent-repository` e
  `stars: null`. As estrelas do projeto-pai nunca são atribuídas a um plugin de monorepo.
- `repositoryScope: dedicated` **obriga** a `starsPolicy: exact-repository` e a um inteiro
  `stars >= 0`.

Veja [docs/RANKING.md](../../docs/RANKING.md) para como estes valores alimentam o predicado de
classificação.

### `license`

| Propriedade | Tipo   | Regras                                                          |
| ----------- | ------ | -------------------------------------------------------------------- |
| `spdx`      | string | Forma de expressão SPDX, 2–256 carateres, sem hífen inicial          |

O esquema impõe apenas uma forma de carateres segura. A validação do catálogo tem de analisar e
normalizar o valor com um analisador real de expressões SPDX. Registe a expressão completa a
montante, evidenciada no commit fixado (por exemplo, `Apache-2.0` ou `MIT OR GPL-3.0-only`).

### `verification`

A verificação aplica-se a `source.commit`. Objeto com quatro propriedades obrigatórias:

| Propriedade            | Tipo             | Regras                                                     |
| ------------------------ | ---------------- | ------------------------------------------------------------- |
| `status`                 | enum             | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`              | string           | Timestamp no formato `date-time` da verificação                |
| `repositoryIdentity`     | const            | Tem de ser `resolved`                                          |
| `smokeTest`               | object ou null   | Registo do teste de fumo, ou `null` quando não existe teste elegível |

Quando presente, `smokeTest` exige:

| Propriedade       | Tipo   | Regras                                                                        |
| ------------------ | ------ | ----------------------------------------------------------------------------------- |
| `installTarget`     | const  | `canonical-install-descriptor` — refere-se a `package` ou à fonte fixada sem duplicar valores mutáveis |
| `check`             | object | `name` (forma de nome de pacote) e `version` (forma de versão exata), obrigatórios |
| `result`            | const  | `passed` — um teste de fumo falhado não é registado como teste de fumo              |

Regra condicional: `status: verified` **exige** um objeto `smokeTest` não nulo. As entradas sem
prova de teste de fumo revisável usam `status: eligible` e `smokeTest: null`. Nenhum estado é um
endosso ou uma certificação de segurança — veja [docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Ligações públicas de proveniência, cada uma um URI ou `null`:

| Propriedade    | Tipo             | Regras                                              |
| --------------- | ---------------- | -------------------------------------------------------- |
| `discussion`    | string ou null   | URL público de Discussion quando existir                   |
| `comment`       | string ou null   | URL público de comentário quando existir                   |

### `media`

O único campo opcional. Um array com um máximo de **6** itens, cada um a descrever uma captura de ecrã ou um vídeo curto do plugin:

| Propriedade | Tipo | Regras |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` ou `video` |
| `url`    | string | URL imutável do GitHub, no máximo 2048 caracteres (ver abaixo) |
| `alt`    | string | Texto alternativo, 1–120 caracteres |

Uma URL aqui tem de ser tão imutável quanto `source.commit`. Um caminho
`raw.githubusercontent.com` que transporta um nome de ramo (`.../main/docs/shot.png`) mostra o que
esse ramo contém hoje, pelo que a entrada publicaria uma imagem não revista no dia em que o ramo
se mover. São aceites dois formatos:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — o caminho raw fixado;
- `https://github.com/<owner>/<repo>/assets/…` — o URL de carregamento endereçado por conteúdo do GitHub, para itens `video`.

O schema garante o formato seguro (host, referência hexadecimal de 40 caracteres, comprimento
limitado). O `catalog validate` garante o resto semanticamente: o URL tem de fixar o
`source.commit` **da própria entrada** no repositório **da própria entrada**, e um URL de ramo é
rejeitado com `media[n].url must pin the entry commit, not a branch`.

Omita o campo por completo quando não houver nada a mostrar — `media: []` não é uma forma válida
de dizer "sem capturas de ecrã". O campo é aditivo: as entradas publicadas antes de ele existir
mantêm-se válidas, e um consumidor que o ignora lê todas as entradas exatamente como antes.

## Entradas `kind: skill`

A versão 1 do esquema também define um segundo contrato de entrada, autónomo, para
`kind: skill`, publicado como
[`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) (SKL-01, fase 0). Nunca toca
no esquema de plugins acima: as entradas com `kind: plugin` continuam a validar exatamente
como antes, e o ficheiro de esquema de skill é a fonte da verdade para entradas de skill da
mesma forma que o esquema de plugins o é para entradas de plugin.

Uma skill não é instalada, é **carregada** pelo harness, pelo que os descritores de
instalação exclusivos de plugins (`package`, `dsh`) não existem numa entrada de skill e são
substituídos por `usage` + `compat`. Uma skill também vive frequentemente num subdiretório
de um repositório que aloja muitas skills, pelo que a identidade e a desduplicação são
`source.repository` + `source.subpath`, em vez do repositório sozinho. Uma entrada de skill
não admite galeria `media`: uma skill é texto que o harness carrega, pelo que não há nada
para capturar (é `additionalProperties: false` que o impõe).

Estes campos mantêm exatamente a forma e as regras documentadas acima para as entradas de
plugin: `schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`,
`tags`, `source`, `creator`, `repositoryScope`, `license`, `provenance`. Todos os campos são
obrigatórios exceto `triggers`, o único campo opcional de skill.

### Campos específicos de skill

| Campo                | Tipo   | Obrigatório | Regras                                                      |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   sim    | Tem de ser exatamente `skill`                               |
| `skillScope`         | enum   |   sim    | `repository` (o repositório inteiro **é** a skill) ou `subdirectory` (a skill vive em `source.subpath`) |
| `triggers`           | array  |    não    | Quando a skill dispara — o texto que um utilizador avalia antes de a carregar. Pelo menos 1 string única, cada uma com 3–200 carateres; omita o campo por completo quando não houver nenhum (`triggers: []` é inválido) |
| `usage.load`         | string |   sim    | Como o harness carrega a skill, 1–200 carateres; uma skill é carregada, nunca instalada |
| `usage.evidencePath` | string |   sim    | Caminho relativo seguro (mesmo padrão que `description.evidencePath`) para a prova de carregamento em `source.commit` |
| `compat.harnessMin`  | string |   sim    | Versão mínima do harness contra a qual a skill foi verificada; forma exata `x.y.z` (pré-lançamento/build opcional), máx. 64 carateres. A camada semântica exige adicionalmente um SemVer exato e analisável |

Regras condicionais (impostas pelos blocos `allOf` do esquema de skill):

- `skillScope: subdirectory` **obriga** a que `source.subpath` seja uma string de caminho
  relativo seguro — uma skill alojada num subdiretório tem de fixar esse subdiretório.
- `skillScope: repository` **obriga** a `source.subpath: null` — uma skill de repositório
  inteiro não pode declarar um subcaminho.

`verification` mantém a forma dos plugins (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), mas `smokeTest` tem de ser exatamente `null`: uma skill não tem teste de fumo
de instalação, e a revisão de conteúdo é o controlo de admissão. O esquema de skill não
transporta a condição `status: verified` → `smokeTest` nem as condições `repositoryScope` →
`popularity`; esses acoplamentos são regras exclusivas do esquema de plugins.

### Camada semântica para skills

Por cima do esquema, a validação do catálogo aplica os mesmos analisadores semânticos
obrigatórios que para os plugins onde os campos existem: `license.spdx` tem de ser analisado
como uma expressão SPDX válida (`invalid-spdx`), e `compat.harnessMin` tem de ser um SemVer
exato (`invalid-semver`). Não existe o caso `invalid-sri` — uma skill não tem
`package.integrity`.

### Identidade e desduplicação de skills

A chave canónica de uma skill é `skill:<source.repositoryNodeId>:<normalized subpath>`. O
subcaminho é normalizado apenas para fins de identidade: as barras invertidas tornam-se `/`,
os segmentos vazios e `.` são descartados, e um resultado vazio (ou `subpath: null`)
torna-se `.` — o repositório inteiro. Um subcaminho contendo bytes NUL ou segmentos `..` é
rejeitado, nunca "limpo". Duas skills do mesmo repositório são duas entradas; o mesmo
repositório + subcaminho duas vezes é uma colisão.

### Exemplo mínimo de skill

```yaml
schemaVersion: 1
id: alice-dsh-commit-lint-skill
name: DSH Commit Lint Skill
description:
  en: Loads a commit-message linting skill that checks Conventional Commit shape before the harness commits.
  evidencePath: skills/commit-lint/SKILL.md
unofficial: true
kind: skill
skillScope: subdirectory
primaryCategory: coding-developer-tools
tags:
  - git
  - linting
triggers:
  - When the user asks to commit staged work
source:
  repository: https://github.com/alice/dsh-skills
  repositoryNodeId: R_kgDOexample1
  subpath: skills/commit-lint
  commit: 0123456789abcdef0123456789abcdef01234567
creator:
  github: alice
usage:
  load: dsh skill load skills/commit-lint
  evidencePath: skills/commit-lint/SKILL.md
compat:
  harnessMin: 1.4.0
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
license:
  spdx: MIT
verification:
  status: eligible
  checkedAt: 2026-08-30T12:00:00Z
  repositoryIdentity: resolved
  smokeTest: null
provenance:
  discussion: null
  comment: null
```

## O que o esquema não verifica

O esquema é intencionalmente local e estrutural. **Não** verifica se o repositório existe, se o
ID de nó corresponde ao URL, se os caminhos de prova existem no commit fixado, se a contagem de
estrelas é exata, nem se o criador é dono da fonte. Essas verificações pertencem aos controlos de
revisão dos mantenedores descritos em [CONTRIBUTING.md](../../CONTRIBUTING.md) e
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: 7928f14612f5cf4a63bfedceed6c38d862a829a4f88a0045efd277aec2b62f47 -->
