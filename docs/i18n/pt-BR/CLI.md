# Referência do CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · **Português (Brasil)** · [中文](../zh-CN/CLI.md)

> **Projeto comunitário não oficial. Não afiliado, endossado ou patrocinado pela DeepSeek.**
> Nomes e marcas da DeepSeek pertencem aos respectivos proprietários.

Esta página documenta o CLI publicado exatamente como ele se comporta na versão `1.0.1`. Toda
sinopse e flag abaixo vem da própria saída de `--help` do comando publicado; nada aqui descreve
comportamento não lançado. O CLI é desenvolvido neste repositório em [`cli/`](../../cli) e
lançado no npm como
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), com uma atestação de
proveniência que vincula cada build ao commit e à execução de workflow que o produziu.

```bash
npx omni-dsh-plugins --help
```

## Princípios de design na v1.0.1

- **Somente leitura por padrão.** `catalog`, `search`, `info`, `list` e `doctor` nunca modificam
  perfis, escrevem arquivos ou disparam código de plugin.
- **Gate de consentimento para execução de código.** `add`, `update` e `remove` recusam executar
  código de ciclo de vida do DSH/pnpm a menos que você passe `--allow-code-execution`. Sem essa
  flag, use `--dry-run` para ver o plano verificado.
- **Política nativa para Windows.** `add`/`update`/`remove` nativos no Windows com execução de
  código estão desabilitados na v1.0.1; use o WSL. O dry-run e os comandos somente leitura
  continuam disponíveis, e marcadores de recuperação nativos do Windows exigem recuperação manual
  documentada.
- **Entradas fixadas.** A entrada do catálogo pode ser um diretório local, um arquivo de
  snapshot, ou uma URL de snapshot público fixada, opcionalmente travada a uma revisão exata de
  40 caracteres.

## Opções comuns

Estas opções aparecem nos comandos que consomem o catálogo (`catalog validate`, `search`, `info`,
`add`, `update`, `remove`, `doctor`):

| Opção                     | Significado                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Diretório local do catálogo, arquivo de snapshot ou URL de snapshot público fixada |
| `--revision <sha>`        | Revisão exata de snapshot com 40 caracteres                        |
| `--json`                  | Emite saída JSON estável                                           |

Opções globais: `-V, --version` imprime a versão do CLI; `-h, --help` imprime a ajuda de qualquer
comando (`dsh-plugins help [command]` também funciona).

## Códigos de saída

O CLI usa códigos de saída de processo convencionais:

| Código de saída | Significado                                                                |
| ---------------: | -------------------------------------------------------------------------- |
| `0`              | Sucesso (incluindo resultados "vazios mas válidos", como um catálogo vazio) |
| `1`              | Falha: erro de validação, entrada não encontrada, opção obrigatória ausente, ou uma checagem de diagnóstico reportando um erro |

Exemplos observados na v1.0.1: `catalog validate` em um catálogo vazio válido sai com `0` e
`0 entries valid; catalog is empty`; `info <unknown-id>` sai com `1` e `Plugin not found`;
`doctor` sai com `1` quando qualquer checagem (como um executável `dsh` ausente) reporta um erro.

## Comandos

### `catalog` — valida as superfícies públicas do catálogo

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — valida o YAML e a semântica do catálogo: parsing seguro de YAML, o
  schema público, parsing de expressão SPDX, SemVer exato, SRI SHA-512, e rejeição de ID
  duplicado / nó-de-repositório-mais-subcaminho. É local e somente leitura: não contata o GitHub,
  não resolve a identidade do repositório nem inspeciona evidências no commit fixado. Este é
  exatamente o comando que o job de CI `catalog-validation` executa em todo pull request de
  catálogo.
- **`catalog docs-check [root]`** — verifica se a documentação pública obrigatória do catálogo
  existe e se as cercas Markdown estão balanceadas.
- **`catalog github-forms-check [root]`** — verifica os formulários públicos estruturados de
  issue do GitHub (reivindicação, correção, remoção).

```bash
# A partir da raiz do repositório:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — pesquisa campos públicos do catálogo localmente

```text
dsh-plugins search [options] <query...>
```

Pesquisa campos públicos do catálogo localmente na entrada de catálogo selecionada. Imprime as
entradas correspondentes, ou `No plugins found.` (saída `0`) quando nada corresponde.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — encontra plugins além do catálogo

```text
dsh-plugins discover [options] <query...>
```

> `discover` estreou na `1.0.0`, o primeiro lançamento sob este nome de pacote.

Pesquisa primeiro o catálogo curado e, depois — a menos que `--offline` seja passado —, o tópico
`dsh-plugin` do GitHub ao vivo, de modo que um plugin ainda não submetido continua encontrável.
Os resultados do catálogo carregam a evidência que o catálogo possui (commit fixado, criador,
licença); os resultados da comunidade não carregam nenhuma dessas evidências e são rotulados como
tal, porque nada sobre eles foi revisado.

`--limit <n>` limita os resultados por camada (padrão `8`). `--json` emite o formato de máquina
estável, que nunca é localizado.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — mostra uma entrada pública do catálogo

```text
dsh-plugins info [options] <id>
```

Mostra uma entrada pública do catálogo pelo ID canônico do plugin. Sai com `1` e
`Plugin not found: <id>` quando o ID não está no catálogo.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — adiciona um plugin do catálogo por meio da delegação oficial ao DSH

```text
dsh-plugins add [options] <id>
```

| Opção                    | Significado                                                         |
| ------------------------ | -------------------------------------------------------------------- |
| `--profile <name>`       | Perfil do DSH a ser modificado (obrigatório na prática; o comando falha sem ele) |
| `--dry-run`              | Mostra o plano verificado sem arquivos ou subprocessos               |
| `--allow-code-execution` | Consente com o código de ciclo de vida do DSH/pnpm (desabilitado no Windows nativo; use o WSL) |
| `--catalog` / `--revision` / `--json` | Opções comuns acima                                      |

Semântica do dry-run nesta versão: o comando resolve e verifica o plano para a entrada fixada e o
imprime, sem criar arquivos nem disparar subprocessos. A instalação real delega para as
ferramentas oficiais do DSH e só prossegue com `--allow-code-execution`.

```bash
# Somente pré-visualização — nada é escrito, nada executa:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Instalação real — consentimento explícito ao código de ciclo de vida:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — atualiza um plugin do catálogo por meio da delegação oficial ao DSH

```text
dsh-plugins update [options] <id>
```

Mesmas opções e semântica de consentimento de `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, mais as opções comuns de catálogo.

### `remove` — remove um plugin gerenciado pelo catálogo por meio da delegação oficial ao DSH

```text
dsh-plugins remove [options] <id>
```

Mesmas opções e semântica de consentimento de `add`. Somente instalações gerenciadas pelo
catálogo são removidas.

### `recover` — recupera uma mutação POSIX retida

```text
dsh-plugins recover
```

Recupera uma mutação POSIX retida após um `add`/`update`/`remove` interrompido. Sem nada pendente,
imprime `No mutation recovery is pending.` e sai com `0`. A recuperação nativa do Windows
permanece manual, conforme a política documentada.

### `list` — lista instalações gerenciadas pelo catálogo

```text
dsh-plugins list [--profile <name>] [--json]
```

Lista instalações gerenciadas pelo catálogo sem modificar perfis. `--profile <name>` filtra por
perfil do DSH. Sem instalações, imprime `No catalog-managed plugins installed.` e sai com `0`.

### `doctor` — diagnóstico somente leitura

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Executa diagnósticos somente leitura de Node, DSH, política nativa do Windows e catálogo. Cada
checagem reporta `ok` ou `error`; qualquer `error` torna o código de saída geral `1`. Exemplo de
saída em uma máquina sem o executável `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## O que a validação local não prova

Uma execução verde de `catalog validate` confirma apenas estrutura e semântica local. Ela não
prova identidade remota do repositório, propriedade do criador, ou evidência no commit fixado —
os mantenedores aplicam esses gates de proveniência separados antes de qualquer merge, conforme
descrito em [CONTRIBUTING.md](../../CONTRIBUTING.md) e
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
