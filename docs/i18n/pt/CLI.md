# Referência da CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Português**

> **Projeto comunitário não oficial. Sem afiliação, sem endosso e sem patrocínio da DeepSeek.**
> Os nomes e marcas DeepSeek pertencem aos respetivos proprietários.

Esta página documenta a CLI publicada exatamente como se comporta na versão `1.0.1`. Cada
sinopse e flag abaixo vem da própria saída `--help` do comando publicado; nada aqui descreve
comportamento ainda não lançado. A CLI é desenvolvida neste repositório em [`cli/`](../../cli)
e publicada no npm como [`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins),
com uma atestação de proveniência que liga cada compilação ao commit e à execução do workflow
que a produziram.

```bash
npx omni-dsh-plugins --help
```

## Princípios de design na v1.0.1

- **Apenas leitura por predefinição.** `catalog`, `search`, `info`, `list` e `doctor` nunca
  alteram perfis, escrevem ficheiros nem geram código de plugin.
- **Controlo de consentimento para execução de código.** `add`, `update` e `remove` recusam-se
  a executar código do ciclo de vida do DSH/pnpm, a menos que passe `--allow-code-execution`.
  Sem essa flag, use `--dry-run` para ver o plano verificado.
- **Política do Windows nativo.** No Windows nativo, o `add`/`update`/`remove` com execução de
  código está desativado na v1.0.1; use o WSL. A simulação (dry-run) e os comandos apenas de
  leitura continuam disponíveis, e os marcadores de recuperação nativos do Windows exigem
  recuperação manual documentada.
- **Entradas fixadas.** A entrada do catálogo pode ser um diretório local, um ficheiro de
  snapshot, ou um URL de snapshot público fixado, opcionalmente bloqueado a uma revisão exata
  de 40 carateres.

## Opções comuns

Estas opções aparecem nos comandos que consomem o catálogo (`catalog validate`, `search`,
`info`, `add`, `update`, `remove`, `doctor`):

| Opção                       | Significado                                                          |
| ---------------------------- | ------------------------------------------------------------------------ |
| `--catalog <path-or-url>`    | Diretório local do catálogo, ficheiro de snapshot ou URL de snapshot público fixado |
| `--revision <sha>`           | Revisão exata de snapshot com 40 carateres                               |
| `--json`                     | Emite saída JSON estável                                                 |

Opções globais: `-V, --version` imprime a versão da CLI; `-h, --help` imprime a ajuda de
qualquer comando (`dsh-plugins help [command]` também funciona).

## Códigos de saída

A CLI usa códigos de saída de processo convencionais:

| Código de saída | Significado                                                                    |
| ---------------: | ---------------------------------------------------------------------------------- |
| `0`              | Sucesso (incluindo resultados "vazios mas válidos", como um catálogo vazio)        |
| `1`              | Falha: erro de validação, entrada não encontrada, opção obrigatória em falta, ou um diagnóstico a reportar um erro |

Exemplos observados na v1.0.1: `catalog validate` num catálogo vazio e válido termina com `0` e
`0 entries valid; catalog is empty`; `info <id-desconhecido>` termina com `1` e
`Plugin not found`; o `doctor` termina com `1` quando alguma verificação (como um executável
`dsh` em falta) reporta um erro.

## Comandos

### `catalog` — valida as superfícies públicas do catálogo

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — valida o YAML e a semântica do catálogo: análise segura de YAML, o
  esquema público, análise de expressões SPDX, SemVer exato, SRI SHA-512 e rejeição de IDs
  duplicados / de chaves de nó de repositório mais subcaminho. É local e apenas de leitura: não
  contacta o GitHub, não resolve a identidade do repositório nem inspeciona a prova no commit
  fixado. É exatamente o comando que a tarefa de CI `catalog-validation` executa em cada pull
  request de catálogo.
- **`catalog docs-check [root]`** — verifica se a documentação pública exigida do catálogo
  existe e se as vedações Markdown estão equilibradas.
- **`catalog github-forms-check [root]`** — verifica os formulários estruturados públicos de
  issues do GitHub (reivindicação, correção, remoção).

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

Pesquisa campos públicos do catálogo localmente, na entrada de catálogo selecionada. Imprime as
entradas correspondentes, ou `No plugins found.` (saída `0`) quando nada corresponde.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — encontra plugins para além do catálogo

```text
dsh-plugins discover [options] <query...>
```

> O `discover` foi lançado na `1.0.0`, a primeira versão sob este nome de pacote.

Pesquisa primeiro o catálogo curado e, a menos que seja indicado `--offline`, também o tópico
`dsh-plugin` do GitHub ao vivo, para que um plugin ainda não submetido continue a ser
encontrável. Os resultados do catálogo trazem a prova que o catálogo detém (commit fixado,
criador, licença); os resultados da comunidade não trazem nenhuma dessas provas e são
identificados como tal, porque nada neles foi revisto.

`--limit <n>` limita os resultados por camada (predefinição `8`). `--json` emite a forma
máquina estável, que nunca é localizada.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — mostra uma entrada pública do catálogo

```text
dsh-plugins info [options] <id>
```

Mostra uma entrada pública do catálogo pelo ID canónico do plugin. Termina com `1` e
`Plugin not found: <id>` quando o ID não está no catálogo.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — adiciona um plugin do catálogo através da delegação oficial do DSH

```text
dsh-plugins add [options] <id>
```

| Opção                        | Significado                                                           |
| ------------------------------ | --------------------------------------------------------------------------- |
| `--profile <name>`             | Perfil do DSH a alterar (obrigatório na prática; o comando falha sem ele)   |
| `--dry-run`                    | Mostra o plano verificado, sem ficheiros nem subprocessos                   |
| `--allow-code-execution`       | Consentimento para código do ciclo de vida do DSH/pnpm (desativado no Windows nativo; use o WSL) |
| `--catalog` / `--revision` / `--json` | Opções comuns acima                                                 |

Semântica do dry-run nesta versão: o comando resolve e verifica o plano para a entrada fixada e
imprime-o, sem criar ficheiros nem gerar subprocessos. A instalação real delega na ferramenta
oficial do DSH e só prossegue com `--allow-code-execution`.

```bash
# Apenas pré-visualização — nada é escrito, nada é executado:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Instalação real — consentimento explícito para código do ciclo de vida:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — atualiza um plugin do catálogo através da delegação oficial do DSH

```text
dsh-plugins update [options] <id>
```

Mesmas opções e semântica de consentimento que o `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, mais as opções comuns do catálogo.

### `remove` — remove um plugin gerido pelo catálogo através da delegação oficial do DSH

```text
dsh-plugins remove [options] <id>
```

Mesmas opções e semântica de consentimento que o `add`. Só são removidas as instalações geridas
pelo catálogo.

### `recover` — recupera uma mutação POSIX retida

```text
dsh-plugins recover
```

Recupera uma mutação POSIX retida depois de um `add`/`update`/`remove` interrompido. Sem nada
pendente, imprime `No mutation recovery is pending.` e termina com `0`. A recuperação no
Windows nativo continua a ser manual, de acordo com a política documentada.

### `list` — lista instalações geridas pelo catálogo

```text
dsh-plugins list [--profile <name>] [--json]
```

Lista as instalações geridas pelo catálogo sem alterar perfis. `--profile <name>` filtra por
perfil do DSH. Sem instalações, imprime `No catalog-managed plugins installed.` e termina com
`0`.

### `doctor` — diagnósticos apenas de leitura

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Executa diagnósticos apenas de leitura do Node, do DSH, da política nativa do Windows e do
catálogo. Cada verificação reporta `ok` ou `error`; qualquer `error` torna o código de saída
geral `1`. Exemplo de saída numa máquina sem o executável `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## O que a validação local não prova

Uma execução verde de `catalog validate` confirma apenas a estrutura e a semântica local. Não
prova a identidade remota do repositório, a propriedade do criador nem a prova no commit fixado
— os mantenedores aplicam esses controlos de proveniência separados antes de qualquer merge,
conforme descrito em [CONTRIBUTING.md](../../CONTRIBUTING.md) e
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
