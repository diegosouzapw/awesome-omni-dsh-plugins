# Contribuir

> 🌐 [English](../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · **Português** · [中文（简体）](../zh-CN/CONTRIBUTING.md)

> **Projeto comunitário não oficial. Sem afiliação, sem endosso e sem patrocínio da DeepSeek.**
> Os nomes e marcas DeepSeek pertencem aos respetivos proprietários.

Obrigado por ajudar a melhorar o catálogo. As contribuições dão prioridade ao criador: use provas
do repositório original, preserve a atribuição de autoria e mantenha cada plugin revisável de
forma independente. O catálogo começa vazio por conceção; nenhuma entrada é aceite sem o seu
próprio pull request revisto.

## Comece pelo criador

Um pull request aberto diretamente pelo criador do plugin ou pela organização proprietária é
sempre preferível. Se o criador estiver disposto a contribuir, use o branch e o pull request
dele em vez de recriar o seu trabalho num branch de curadoria ou de automação.

A curadoria da comunidade é bem-vinda quando ajuda um criador que ainda não abriu um pull
request. Não estabelece propriedade nem prioridade sobre uma contribuição direta posterior do
criador.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Um plugin por branch e por pull request

Crie um branch dedicado para um plugin e abra um pull request a partir desse branch. O branch e
o pull request têm de criar ou alterar exatamente um ficheiro YAML em `catalog/plugins/`. Não
misture plugins, limpeza de documentação, índices gerados ou manutenção não relacionada nesse
branch ou pull request.

O ID da entrada e o nome do ficheiro têm de ser o mesmo valor em kebab-case minúsculo. Os
mantenedores revêem e integram cada pull request de plugin individualmente; um lote com vários
plugins não é dividido nem parcialmente integrado.

## Resolva a fonte original

Cada campo público tem de ser reconstruído a partir do repositório, pacote, manifesto, README,
licença ou lançamento originais do criador, no commit fixado. Não copie o texto, a atribuição de
categoria, as capturas de ecrã, a classificação, os emblemas ou os metadados gerados de outro
catálogo ou agregador. Uma ligação encontrada num projeto guarda-chuva, mercado, lista ou
agregador é apenas uma pista, não uma prova nem a fonte do plugin.

Nunca submeta um projeto guarda-chuva, agregador, mercado, catálogo de instaladores ou lista
como entrada de catálogo, mesmo quando é instalável de forma independente. Use-o apenas como
pista e resolva cada plugin filho instalável de forma independente até ao seu criador e
repositório original reais. Um plugin dentro do monorepo real do seu criador pode ser submetido
a partir do seu subcaminho exato, mas tem de seguir a política de estrelas de monorepo abaixo.

## Provas exigidas

Forneça tudo o seguinte no pull request:

- O URL público canónico do repositório original e o seu ID de nó de repositório imutável. Os
  mantenedores resolvem o ID de nó e rejeitam incompatibilidades de URL no controlo de
  proveniência separado.
- O identificador público do GitHub do criador e o URL de perfil público correspondente. O YAML
  guarda o identificador uma vez; o URL do perfil é derivado como `https://github.com/<handle>`.
- Um OID de commit de origem completo com 40 carateres e o subcaminho exato do plugin, ou `null`
  para um plugin na raiz do repositório.
- Uma descrição em inglês limitada e o respetivo caminho de prova nesse commit fixado.
- O `kind` do artefacto, a categoria principal e as etiquetas selecionadas a partir de
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- A expressão SPDX completa da licença a montante, evidenciada no commit fixado.
- Um descritor de instalação canónico fixado a uma versão npm exata, ou ao repositório de
  origem, ao commit completo e ao subcaminho. O descritor é dado, nunca um comando de shell.
- Prova de integração nativa com o DSH e o respetivo caminho no commit fixado.
- Prova de teste de fumo existente e não sensível para essa fixação exata do artefacto, ou o
  valor explícito `not run`. Não instale o plugin nem execute `preinstall`, `install`,
  `postinstall`, `prepare` ou outro código do ciclo de vida do pacote/plugin apenas para preparar
  uma contribuição de catálogo.
- Para um repositório dedicado, a contagem de estrelas verificável desse repositório exato,
  juntamente com a fonte pública e a hora de verificação. Para um plugin de monorepo, use a
  política de nulo obrigatória abaixo.
- Proveniência de Discussion ou comentário público quando existir; caso contrário, use `null`.
- O valor `unofficial: true`, legível por máquina.

Se ainda não existir um teste de fumo elegível, use `verification.status: eligible` e
`verification.smokeTest: null`. Use `verified` apenas quando existir prova de teste de fumo
revisável para essa fixação exata. Nenhum dos dois estados é um endosso ou uma certificação de
segurança.

Nunca submeta credenciais, cookies, endereços de e-mail privados, fonte não publicada ou outros
segredos.

## Regras de YAML e de esquema

Crie `catalog/plugins/<plugin-id>.yaml` e valide-o contra
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). O `id` tem de ser igual ao
nome base do ficheiro e tem de começar com o seu espaço de nomes: o seu identificador
`creator.github` em minúsculas (qualquer sequência de carateres fora de `[a-z0-9]` torna-se um
único `-`) seguido de `-`, por exemplo `some-creator-my-plugin` para o identificador
`Some-Creator`. A validação do catálogo aplica ambas as regras. O esquema é a fonte da verdade
para os nomes de campo e valores permitidos; [docs/CATEGORIES.md](../../docs/CATEGORIES.md)
define como escolher o único tipo de artefacto, a categoria principal, as etiquetas e o âmbito
do repositório.

Um descritor npm tem de conter um nome de pacote válido e uma versão exata. O esquema público
rejeita valores semelhantes a opções e não limitados, mas não reimplementa o SemVer nem o SRI:
a validação do catálogo tem de analisar a versão, exigir SemVer exato e analisar qualquer valor
de integridade como SRI SHA-512 válido. Um descritor de fonte está vinculado a
`source.repository`, `source.commit` e `source.subpath` sem duplicar valores de fonte mutáveis.

Os instaladores têm de usar matrizes de argumentos, desativar a execução de shell e colocar um
terminador de opção antes dos valores posicionais fornecidos pelo catálogo, quando o comando
invocado o suportar. A validação de submissão não pode invocar um instalador ou o ciclo de vida
de um plugin.

<!-- catalog-validation:local-structure-and-semantics-only -->

O `catalog validate` é uma verificação local, apenas de leitura, estrutural e semântica. Analisa
YAML seguro, valida o esquema público, analisa expressões SPDX, exige SemVer exato e SRI
SHA-512 válido, e rejeita IDs duplicados e chaves canónicas de nó de repositório mais
subcaminho. Não contacta o GitHub, não resolve a identidade do repositório nem inspeciona
caminhos de prova no commit fixado.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Antes de uma entrada chegar a `eligible`, os mantenedores resolvem separadamente o repositório
canónico e o ID de nó, vinculam o criador à fonte original e inspecionam a descrição, a
licença, a integração com o DSH e a prova de teste de fumo declaradas em `source.commit`. Um
resultado de validação local bem-sucedido não é prova de proveniência ou de origem.

## Estrelas do repositório

Só podem ser registadas estrelas verificavelmente pertencentes ao repositório dedicado exato do
plugin. As estrelas de um projeto-pai nunca podem ser atribuídas a um plugin guardado dentro de
um monorepo mais amplo. Uma entrada de monorepo permanece elegível para as secções funcionais do
catálogo, mas tem de declarar:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Uma entrada dedicada usa `repositoryScope: dedicated`, `starsPolicy: exact-repository` e a
contagem de estrelas não negativa observada nesse mesmo repositório. Leia
[docs/RANKING.md](../../docs/RANKING.md) antes de submeter dados de popularidade.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Precedência do criador e contacto respeitoso

Para o mesmo plugin canónico, a precedência é:

1. Um pull request aberto pelo criador ou pela organização proprietária.
2. Um pull request da comunidade explicitamente aprovado pelo criador.
3. Um pull request de curadoria da comunidade válido já existente.
4. Um pull request de automação do catálogo.

Um pull request direto do criador tem precedência sobre qualquer pull request de curadoria ou
automação em aberto, independentemente de qual foi aberto primeiro ou está mais avançado. O
pull request do criador torna-se o veículo de revisão; os mantenedores não fazem force-push ao
branch do criador nem transplantam o seu trabalho para o pull request curado. Se uma entrada
curada já tiver sido integrada, o histórico público não é reescrito. O criador pode usar um
pedido de reivindicação ou de correção e depois contribuir diretamente com um pull request de
acompanhamento.

Um pull request curado deve usar uma única menção pública respeitosa `@criador` na sua
descrição, junto de uma ligação para o repositório original, convidando o criador a rever ou a
substituí-lo por um pull request direto. Não repita a menção, não abra issues promocionais, não
faça cross-posting, não envie mensagens diretas não solicitadas nem incomode o criador de outra
forma.

<!-- creator-first:source-bound-git-identity -->

Os pull requests e commits da autoria do criador preservam naturalmente o crédito do criador.
Os commits curados só podem usar a autoria Git do criador ou um trailer `Co-authored-by` com uma
identidade vinculada à fonte e publicamente verificável. Nunca invente ou adivinhe um e-mail.
Quando não existe uma identidade Git verificada disponível, o curador assina o commit e dá
crédito explícito `Created by @handle`, com a ligação para o repositório original no YAML e no
pull request. Uma conta de mantenedor ou de automação pode ser committer ou coautor verificado,
mas nunca pode substituir a autoria do criador. Veja [docs/CREDIT.md](../../docs/CREDIT.md) para
a política completa.

## Comandos de validação e disponibilidade

A CLI npm é publicada como `omni-dsh-plugins@1.0.1`, pelo que os comandos abaixo estão
disponíveis através de `npx` hoje. Use-os exatamente como estão escritos; os contribuidores não
devem inventar comandos alternativos.

Execute estes comandos a partir da raiz do repositório:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

O `catalog validate` executa apenas as verificações locais de YAML, esquema, SPDX, SemVer
exato, SRI SHA-512 e duplicados descritas acima, e aceita o catálogo intencionalmente sem
entradas. Não prova a identidade remota do repositório nem a prova da fonte fixada. Os outros
comandos verificam a documentação pública exigida e os formulários estruturados de issues do
GitHub. Passar estes comandos localmente não flexibiliza os requisitos de prova; os mantenedores
continuam a aplicar todos os controlos de lançamento correspondentes antes de integrar.

## Controlos de revisão, colisões e integração

Os mantenedores aplicam todos os controlos ao commit atual do pull request antes de integrar:

1. **Âmbito:** um branch dedicado, um ficheiro YAML de plugin e nenhuma alteração não
   relacionada.
2. **Identidade original:** o criador, o repositório canónico, o ID de nó, o commit completo e o
   subcaminho concordam entre si.
3. **Esquema e prova:** o YAML, as categorias, o SPDX, a fixação de instalação, a prova do DSH e
   o estado de teste de fumo são internamente consistentes, sem executar código do ciclo de vida
   do plugin.
4. **Popularidade:** as estrelas dedicadas são verificáveis no repositório exato, ou as estrelas
   de monorepo são `null` com `undefined-parent-repository`.
5. **Documentação e formulários:** a documentação pública, as vedações Markdown e os formulários
   estruturados permanecem válidos.
6. **Colisão e deduplicação:** nenhuma entrada integrada ou pull request em aberto representa o
   mesmo plugin canónico.

Nomes ou IDs diferentes não tornam plugins duplicados distintos. Trate o mesmo ID de nó de
repositório e subcaminho, o mesmo pacote canónico, ou outro alvo de instalação demonstravelmente
idêntico como uma colisão. Resolva aliases e pull requests concorrentes antes da integração. Um
pull request direto do criador ganha uma colisão com curadoria ou automação; caso contrário, os
mantenedores selecionam um veículo de revisão e fecham ou redirecionam os duplicados em vez de
integrar ambos.

Só um mantenedor integra um plugin depois de todos os controlos passarem. Cada plugin aceite é
integrado individualmente; a validação, a curadoria ou a automação não implicam integração
automática ou em lote.

## Lista de verificação do pull request

- [ ] Usei um branch dedicado e este PR altera exatamente uma entrada de plugin.
- [ ] A fonte é o repositório original do criador, não um guarda-chuva ou agregador.
- [ ] O identificador/perfil do criador, o repositório, o ID de nó, o subcaminho e o commit
      completo estão comprovados.
- [ ] O kind, a categoria e as etiquetas seguem `docs/CATEGORIES.md`.
- [ ] A licença SPDX e o descritor de instalação fixado estão comprovados.
- [ ] A integração nativa com o DSH e o resultado do teste de fumo ou o estado `not run` estão
      comprovados.
- [ ] Não executei código do ciclo de vida do plugin ou do pacote para preparar esta
      contribuição.
- [ ] As estrelas dedicadas são verificáveis, ou as estrelas de monorepo usam a política de nulo
      exigida.
- [ ] Verifiquei se já existe uma entrada e um pull request em aberto para o mesmo plugin
      canónico.
- [ ] A entrada é explicitamente não oficial e não contém segredos nem dados pessoais privados.

## Política linguística

A documentação de lançamento e as descrições do catálogo são apenas em inglês. O lançamento
para as 43 línguas continua a ser um item do backlog pós-MVP; não adicione documentos vazios de
locale nem traduções automáticas em lote.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
