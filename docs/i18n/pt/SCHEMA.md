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

Regras de topo: a entrada é um único objeto YAML, `additionalProperties: false` (campos
desconhecidos são rejeitados), e **todos** os campos seguintes são obrigatórios.

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

Uma das treze categorias de capacidade:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

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

## O que o esquema não verifica

O esquema é intencionalmente local e estrutural. **Não** verifica se o repositório existe, se o
ID de nó corresponde ao URL, se os caminhos de prova existem no commit fixado, se a contagem de
estrelas é exata, nem se o criador é dono da fonte. Essas verificações pertencem aos controlos de
revisão dos mantenedores descritos em [CONTRIBUTING.md](../../CONTRIBUTING.md) e
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
