# Referência do Schema de Entrada do Catálogo

> 🌐 [English](../../docs/SCHEMA.md) · **Português (Brasil)** · [中文](../zh-CN/SCHEMA.md)

> **Projeto comunitário não oficial. Não afiliado, endossado ou patrocinado pela DeepSeek.**
> Nomes e marcas da DeepSeek pertencem aos respectivos proprietários.

Esta é a referência campo a campo de
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), o JSON Schema público
(draft 2020-12) que todo arquivo em `catalog/plugins/` deve satisfazer. O próprio arquivo de
schema é a fonte da verdade; quando esta página e o schema divergem, o schema prevalece.

Duas camadas de validação se aplicam. O schema público aplica *formatos seguros* limitados
(padrões e comprimentos que rejeitam valores parecidos com opções ou não limitados). Sobre isso,
`catalog validate` aplica interpretadores semânticos obrigatórios: SemVer exato para versões, SRI
SHA-512 para valores de integridade, parsing de expressão SPDX para licenças, e rejeição de chave
duplicada. Um valor pode corresponder ao padrão do schema e ainda assim ser rejeitado
semanticamente.

Regras de nível superior: a entrada é um único objeto YAML, `additionalProperties: false`
(campos desconhecidos são rejeitados), e **todos** os campos a seguir são obrigatórios.

## Campos de nível superior

| Campo              | Tipo    | Obrigatório | Resumo                                                        |
| ------------------ | ------- | :---------: | --------------------------------------------------------------- |
| `schemaVersion`    | const   |     sim     | Deve ser exatamente `1`                                         |
| `id`                | string  |     sim     | ID da entrada em kebab-case minúsculo; deve corresponder ao nome do arquivo |
| `name`              | string  |     sim     | Nome de exibição, 1–120 caracteres                               |
| `description`       | object  |     sim     | Resumo em inglês curado mais seu caminho de evidência            |
| `unofficial`        | const   |     sim     | Deve ser exatamente `true`                                       |
| `kind`              | enum    |     sim     | Discriminador canônico do artefato                               |
| `primaryCategory`   | enum    |     sim     | Categoria de capacidade primária única                           |
| `tags`              | array   |     sim     | Tags únicas em kebab-case minúsculo (pode ser vazio)              |
| `source`            | object  |     sim     | Repositório original, ID do nó, subcaminho e commit fixado       |
| `creator`           | object  |     sim     | Handle público do GitHub do criador                              |
| `package`           | object  |     sim     | Descritor de instalação canônico (npm **ou** source)             |
| `dsh`                | object  |     sim     | Perfis do DSH e caminho de evidência de integração nativa        |
| `repositoryScope`   | enum    |     sim     | `dedicated` ou `monorepo`                                        |
| `popularity`        | object  |     sim     | Política de estrelas e contagem de estrelas (condicional ao escopo) |
| `license`           | object  |     sim     | Expressão SPDX de licença upstream                               |
| `verification`      | object  |     sim     | Status de verificação, horário da checagem, identidade e smoke test |
| `provenance`         | object  |     sim     | URLs públicas de Discussion/comentário ou `null`                  |

### `schemaVersion`

Constante `1`. Identifica a versão 1 do schema público; qualquer outro valor é inválido.

### `id`

String correspondendo a `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kebab-case minúsculo, sem hífens no
início/fim ou duplos. Conforme [CONTRIBUTING.md](../../CONTRIBUTING.md), o arquivo da entrada deve
se chamar `catalog/plugins/<id>.yaml` com o valor idêntico; o validador rejeita uma divergência
(`id-filename-mismatch`). O ID também deve começar com o namespace do criador: o handle
`creator.github` em minúsculas, com cada sequência de caracteres fora de `[a-z0-9]` colapsada em
um único `-`, seguido de `-` (`id-creator-prefix`).

### `name`

Nome de exibição livre, `minLength: 1`, `maxLength: 120`.

### `description`

Objeto com exatamente duas propriedades obrigatórias (nenhuma outra permitida):

| Propriedade    | Tipo   | Regras                                                                 |
| -------------- | ------ | ------------------------------------------------------------------------ |
| `en`            | string | Resumo em inglês, 20–320 caracteres                                      |
| `evidencePath`  | string | Padrão de caminho relativo ao repositório; sem `/` inicial, sem barras invertidas, sem segmentos `.`/`..` |

O resumo em inglês deve ser curado a partir do arquivo em `evidencePath` como ele existe em
`source.commit` — não copiado de outro catálogo.

### `unofficial`

Constante `true`. Marcador legível por máquina de que a listagem é não oficial.

### `kind`

O **único** discriminador de tipo de artefato (não existe um segundo campo de tipo de
integração). Um de:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Os significados e as consequências para o ranking são definidos em
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Uma das treze categorias de capacidade:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

Os rótulos de exibição e a orientação de seleção estão em
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Array de strings únicas, cada uma correspondendo a `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case
minúsculo). O schema não impõe uma contagem mínima.

### `source`

Objeto com exatamente quatro propriedades obrigatórias:

| Propriedade          | Tipo             | Regras                                                                    |
| --------------------- | ---------------- | --------------------------------------------------------------------------- |
| `repository`          | string           | URL `https://github.com/<owner>/<repo>`; o owner segue as regras de nome de usuário do GitHub, o nome do repo tem 1–100 caracteres, não pode ser `.`/`..` nem terminar em `.git` |
| `repositoryNodeId`     | string           | ID de nó de repositório do GitHub imutável, não vazio                       |
| `subpath`              | string ou null   | Subcaminho do plugin dentro do repositório (mesmo padrão de caminho relativo seguro que `evidencePath`), ou `null` para um plugin na raiz do repositório |
| `commit`               | string           | OID de commit hexadecimal completo com 40 caracteres                        |

A validação do catálogo deve resolver `repositoryNodeId` e rejeitar uma divergência de URL do
repositório — essa resolução é um gate do lado do mantenedor, não parte da checagem estrutural
local.

### `creator`

Objeto com uma única propriedade obrigatória:

| Propriedade | Tipo   | Regras                                               |
| ------------ | ------ | ------------------------------------------------------ |
| `github`     | string | Nome de usuário do GitHub (1–39 caracteres, regras de handle do GitHub) |

A URL do perfil público é sempre derivada como `https://github.com/<handle>`; não existe um
segundo campo de perfil armazenado, então os dois nunca podem divergir.

### `package`

O descritor de instalação canônico. É dado, nunca um comando de shell, e assume exatamente um de
dois formatos (`oneOf`):

**pacote npm** — obrigatórios `ecosystem`, `name`, `version`; opcional `integrity`:

| Propriedade  | Tipo   | Regras                                                                       |
| ------------- | ------ | -------------------------------------------------------------------------------- |
| `ecosystem`   | const  | `npm`                                                                             |
| `name`        | string | Formato de nome de pacote npm (opcionalmente com escopo), máximo de 214 caracteres |
| `version`     | string | Formato de versão exata `x.y.z` (prerelease/build opcionais); ranges são rejeitados. A camada semântica ainda exige um SemVer exato interpretável |
| `integrity`   | string | Formato SRI opcional `sha512-…`, 8–256 caracteres. A camada semântica deve interpretá-lo como SRI SHA-512 válido |

**instalação por source** — obrigatório apenas `ecosystem`:

| Propriedade  | Tipo   | Regras   |
| ------------- | ------ | -------- |
| `ecosystem`   | const  | `source` |

Um descritor de source deliberadamente não armazena mais nada: o repositório, o commit e o
subcaminho são derivados de `source`, então valores mutáveis nunca são duplicados.

### `dsh`

Evidência de integração nativa com o DSH:

| Propriedade    | Tipo   | Regras                                                                 |
| --------------- | ------ | -------------------------------------------------------------------------- |
| `profiles`       | array  | Pelo menos um nome de perfil único correspondendo a `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath`    | string | Caminho relativo seguro para a evidência de integração com o DSH em `source.commit` |

### `repositoryScope`

`dedicated` (as estrelas do repositório pertencem exatamente a este plugin) ou `monorepo` (o
plugin é um subcaminho ou pacote dentro de um projeto mais amplo). Este valor conduz as regras
condicionais de popularidade abaixo.

### `popularity`

| Propriedade    | Tipo               | Regras                                                |
| --------------- | ------------------- | -------------------------------------------------------- |
| `starsPolicy`    | enum                | `exact-repository` ou `undefined-parent-repository`      |
| `stars`          | integer ou null     | Inteiro não negativo, ou `null`                           |

Regras condicionais (aplicadas pelos blocos `allOf` do schema):

- `repositoryScope: monorepo` **força** `starsPolicy: undefined-parent-repository` e
  `stars: null`. As estrelas do projeto pai nunca são atribuídas a um plugin de monorepo.
- `repositoryScope: dedicated` **força** `starsPolicy: exact-repository` e um `stars >= 0`
  inteiro.

Veja [docs/RANKING.md](../../docs/RANKING.md) para saber como esses valores alimentam o
predicado de ranking.

### `license`

| Propriedade | Tipo   | Regras                                                          |
| ------------ | ------ | -------------------------------------------------------------------- |
| `spdx`        | string | Formato de expressão SPDX, 2–256 caracteres, sem hífen inicial       |

O schema aplica apenas um formato de caractere seguro; a validação do catálogo deve interpretar e
normalizar o valor com um interpretador real de expressão SPDX. Registre a expressão upstream
completa evidenciada no commit fixado (por exemplo, `Apache-2.0` ou `MIT OR GPL-3.0-only`).

### `verification`

A verificação se aplica a `source.commit`. Objeto com quatro propriedades obrigatórias:

| Propriedade            | Tipo             | Regras                                                  |
| ------------------------ | ----------------- | ----------------------------------------------------------- |
| `status`                  | enum              | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`               | string            | Timestamp da checagem no formato `date-time`                |
| `repositoryIdentity`      | const             | Deve ser `resolved`                                          |
| `smokeTest`               | object ou null    | Registro do smoke test, ou `null` quando não existe teste qualificado |

Quando presente, `smokeTest` exige:

| Propriedade      | Tipo   | Regras                                                              |
| ----------------- | ------ | -------------------------------------------------------------------------- |
| `installTarget`    | const  | `canonical-install-descriptor` — referencia `package` ou o source fixado sem duplicar valores mutáveis |
| `check`             | object | `name` (formato de nome de pacote) e `version` (formato de versão exata) obrigatórios |
| `result`            | const  | `passed` — um smoke test com falha não é registrado como um smoke test    |

Regra condicional: `status: verified` **exige** um objeto `smokeTest` não nulo. Entradas sem
evidência de smoke test revisável usam `status: eligible` e `smokeTest: null`. Nenhum status é um
endosso ou uma certificação de segurança — veja [docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Links públicos de proveniência, cada um uma URI ou `null`:

| Propriedade   | Tipo             | Regras                                            |
| -------------- | ----------------- | ------------------------------------------------------ |
| `discussion`    | string ou null    | URL pública de Discussion quando existir                |
| `comment`       | string ou null    | URL pública de comentário quando existir                 |

## O que o schema não verifica

O schema é intencionalmente local e estrutural. Ele **não** verifica se o repositório existe, se
o ID do nó corresponde à URL, se os caminhos de evidência existem no commit fixado, se a contagem
de estrelas é precisa, ou se o criador é dono da fonte. Essas checagens pertencem aos gates de
revisão dos mantenedores descritos em [CONTRIBUTING.md](../../CONTRIBUTING.md) e
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
