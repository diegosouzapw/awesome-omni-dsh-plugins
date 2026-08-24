# Contribuindo

> 🌐 [English](../../../CONTRIBUTING.md) · **Português (Brasil)** · [中文（简体）](../zh-CN/CONTRIBUTING.md)

> **Projeto comunitário não oficial. Não afiliado, endossado ou patrocinado pela DeepSeek.**
> Nomes e marcas da DeepSeek pertencem aos respectivos proprietários.

Obrigado por melhorar o catálogo. As contribuições têm prioridade ao criador: use evidências do
repositório original, preserve a atribuição de autoria e mantenha cada plugin revisável de forma
independente. O catálogo começa vazio por design; nenhuma entrada é aceita sem seu próprio pull
request revisado.

## Comece pelo criador

Um pull request aberto diretamente pelo criador do plugin ou pela organização proprietária é
sempre preferível. Se o criador estiver pronto para contribuir, use o branch e o pull request
dele em vez de recriar o trabalho em um branch de curadoria ou automação.

A curadoria da comunidade é bem-vinda quando ajuda um criador que ainda não abriu um pull
request. Ela não estabelece propriedade nem prioridade sobre uma contribuição direta posterior do
criador.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Um plugin por branch e pull request

Crie um branch dedicado para um único plugin e abra um único pull request a partir desse branch.
O branch e o pull request devem criar ou alterar exatamente um arquivo YAML em
`catalog/plugins/`. Não misture plugins, limpeza de documentação, índices gerados ou manutenção
não relacionada nesse branch ou pull request.

O ID da entrada e o nome do arquivo devem ser o mesmo valor em kebab-case minúsculo. Os
mantenedores revisam e mesclam cada pull request de plugin individualmente; um lote contendo
múltiplos plugins não é dividido nem mesclado parcialmente.

## Resolva a fonte original

Todo campo público deve ser reconstruído a partir do repositório original do criador, pacote,
manifesto, README, licença ou release no commit fixado. Não copie o texto, a atribuição de
categoria, capturas de tela, ranking, selos ou metadados gerados de outro catálogo ou agregador.
Um link encontrado em um projeto guarda-chuva, marketplace, lista ou agregador é apenas uma pista,
não é evidência e não é a fonte do plugin.

Nunca submeta um projeto guarda-chuva, agregador, marketplace, catálogo instalador ou lista como
entrada de catálogo, mesmo quando ele for instalável de forma independente. Use-o apenas como
pista e resolva cada plugin filho instalável de forma independente até seu criador real e
repositório original. Um plugin no monorepo real do seu criador pode ser submetido a partir do seu
subcaminho exato, mas deve seguir a política de estrelas de monorepo abaixo.

## Evidências obrigatórias

Forneça tudo o que segue no pull request:

- A URL pública canônica do repositório original e seu ID de nó de repositório imutável. Os
  mantenedores resolvem o ID do nó e rejeitam divergências de URL no gate de proveniência
  separado.
- O handle público do GitHub do criador e a URL de perfil público correspondente. O YAML armazena
  o handle uma vez; a URL do perfil é derivada como `https://github.com/<handle>`.
- Um OID de commit de origem com 40 caracteres completo e o subcaminho exato do plugin, ou `null`
  para um plugin na raiz do repositório.
- Uma descrição em inglês limitada e seu caminho de evidência naquele commit fixado.
- O `kind` do artefato, a categoria primária e as tags selecionadas em
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- A expressão SPDX completa da licença upstream, evidenciada no commit fixado.
- Um descritor de instalação canônico fixado a uma versão exata do npm, ou ao repositório de
  origem, commit completo e subcaminho. O descritor é dado, nunca um comando de shell.
- Evidência de integração nativa com o DSH e seu caminho no commit fixado.
- Evidência de smoke test existente e não sensível para esse pin exato do artefato, ou o valor
  explícito `not run`. Não instale o plugin nem execute `preinstall`, `install`, `postinstall`,
  `prepare` ou outro código de ciclo de vida de pacote/plugin apenas para preparar uma
  contribuição de catálogo.
- Para um repositório dedicado, a contagem de estrelas verificável para esse repositório exato,
  junto com a fonte pública e o horário da verificação. Para um plugin em monorepo, use a política
  de null obrigatória abaixo.
- Proveniência pública de Discussion ou comentário quando existir; caso contrário, use `null`.
- O valor legível por máquina `unofficial: true`.

Se não existir um smoke test qualificado, use `verification.status: eligible` e
`verification.smokeTest: null`. Use `verified` somente quando existir evidência de smoke test
revisável para o pin exato. Nenhum dos dois estados é um endosso ou uma certificação de segurança.

Nunca submeta credenciais, cookies, endereços de e-mail privados, código-fonte não publicado ou
outros segredos.

## Regras de YAML e schema

Crie `catalog/plugins/<plugin-id>.yaml` e valide-o contra
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). O `id` deve ser igual ao nome
base do arquivo e deve começar com o seu namespace: o seu handle `creator.github` em minúsculas
(qualquer sequência de caracteres fora de `[a-z0-9]` vira um único `-`) seguido de `-`, por
exemplo `some-creator-my-plugin` para o handle `Some-Creator`. A validação do catálogo aplica
ambas as regras. O schema é a fonte da verdade para nomes de campos e valores permitidos;
[docs/CATEGORIES.md](../../docs/CATEGORIES.md) define como escolher o único `kind` de artefato,
a categoria primária, as tags e o escopo do repositório.

Um descritor npm deve conter um nome de pacote válido e uma versão exata. O schema público
rejeita valores parecidos com opções e não limitados, mas não reimplementa SemVer ou SRI: a
validação do catálogo deve interpretar a versão, exigir SemVer exato e interpretar qualquer valor
de integridade como SRI SHA-512 válido. Um descritor de origem é vinculado a `source.repository`,
`source.commit` e `source.subpath` sem duplicar valores mutáveis de origem.

Os instaladores devem usar arrays de argumentos, desabilitar a execução via shell e colocar um
terminador de opção antes dos valores posicionais fornecidos pelo catálogo, onde o comando
invocado suportar isso. A validação de submissão não deve invocar um instalador ou o ciclo de
vida de um plugin.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` é uma checagem local, somente leitura, estrutural e semântica. Ela interpreta
YAML seguro, valida o schema público, interpreta expressões SPDX, exige SemVer exato e SRI
SHA-512 válido, e rejeita IDs duplicados e chaves de nó-de-repositório-mais-subcaminho canônicas.
Ela não contata o GitHub, não resolve a identidade do repositório nem inspeciona caminhos de
evidência no commit fixado.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Antes de uma entrada alcançar `eligible`, os mantenedores resolvem separadamente o repositório
canônico e o ID do nó, vinculam o criador à origem original e inspecionam a descrição declarada,
a licença, a integração com o DSH e a evidência de smoke test em `source.commit`. Um resultado de
validação local verde não é prova de proveniência ou de origem.

## Estrelas do repositório

Somente estrelas verificavelmente pertencentes ao repositório dedicado exato do plugin podem ser
registradas. As estrelas de um projeto pai nunca devem ser atribuídas a um plugin armazenado
dentro de um monorepo mais amplo. Uma entrada de monorepo permanece elegível para seções
funcionais do catálogo, mas deve declarar:

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

## Precedência do criador e contato respeitoso

Para o mesmo plugin canônico, a precedência é:

1. Um pull request aberto pelo criador ou pela organização proprietária.
2. Um pull request da comunidade explicitamente aprovado pelo criador.
3. Um pull request de curadoria da comunidade já válido e existente.
4. Um pull request de automação de catálogo.

Um pull request direto do criador substitui qualquer pull request de curadoria ou automação em
aberto, independentemente de qual foi aberto primeiro ou está mais avançado. O pull request do
criador se torna o veículo de revisão; os mantenedores não fazem force-push no branch do criador
nem transplantam o trabalho dele para o pull request curado. Se uma entrada curada já foi
mesclada, o histórico público não é reescrito. O criador pode usar um pedido de reivindicação ou
correção e depois contribuir com um pull request de acompanhamento diretamente.

Um pull request curado deve usar uma única menção pública respeitosa `@criador` em sua descrição,
ao lado de um link para o repositório original, convidando o criador a revisá-lo ou substituí-lo
por um pull request direto. Não repita a menção, não abra issues promocionais, não faça
cross-post, não envie mensagens diretas não solicitadas nem faça spam com o criador de qualquer
outra forma.

<!-- creator-first:source-bound-git-identity -->

Pull requests e commits autorados pelo criador preservam naturalmente o crédito ao criador.
Commits curados podem usar a autoria Git do criador ou um trailer `Co-authored-by` somente com
uma identidade vinculada à fonte e publicamente verificável. Nunca invente ou adivinhe um e-mail.
Quando nenhuma identidade Git verificada estiver disponível, o curador autora o commit e dá
crédito explícito "Created by @handle" com o link do repositório original no YAML e no pull
request. Uma conta de mantenedor ou automação pode ser committer ou coautor verificado, mas não
deve substituir a autoria do criador. Veja [docs/CREDIT.md](../../docs/CREDIT.md) para a política
completa.

## Comandos de validação e disponibilidade

O CLI npm é publicado como `omni-dsh-plugins@1.0.1`, então os comandos abaixo estão
disponíveis via `npx` hoje. Use-os exatamente como escritos; os contribuidores não devem inventar
comandos substitutos.

Execute estes comandos a partir da raiz do repositório:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` realiza apenas as checagens locais de YAML, schema, SPDX, SemVer exato,
SRI SHA-512 e duplicidade descritas acima, e aceita o catálogo intencionalmente vazio. Ele não
prova a identidade remota do repositório nem a evidência de origem fixada. Os outros comandos
verificam a documentação pública obrigatória e os formulários estruturados de issue do GitHub.
Passar nesses comandos localmente não afrouxa os requisitos de evidência; os mantenedores ainda
aplicam cada gate de release correspondente antes de mesclar.

## Gates de revisão, colisões e merge

Os mantenedores aplicam todos os gates ao commit atual do pull request antes de mesclar:

1. **Escopo:** um branch dedicado, um arquivo YAML de plugin e nenhuma alteração não relacionada.
2. **Identidade original:** criador, repositório canônico, ID do nó, commit completo e subcaminho
   concordam entre si.
3. **Schema e evidência:** YAML, categorias, SPDX, pin de instalação, evidência de DSH e status
   de smoke test são internamente consistentes sem executar código de ciclo de vida do plugin.
4. **Popularidade:** as estrelas dedicadas são verificáveis no repositório exato, ou as estrelas
   de monorepo são `null` com `undefined-parent-repository`.
5. **Documentação e formulários:** documentação pública, cercas Markdown e formulários
   estruturados permanecem válidos.
6. **Colisão e deduplicação:** nenhuma entrada mesclada ou pull request em aberto representa o
   mesmo plugin canônico.

Nomes ou IDs diferentes não tornam plugins duplicados distintos. Trate o mesmo ID de nó de
repositório e subcaminho, o mesmo pacote canônico, ou outro alvo de instalação demonstravelmente
idêntico como uma colisão. Resolva aliases e pull requests concorrentes antes do merge. Um pull
request direto do criador vence uma colisão contra curadoria ou automação; caso contrário, os
mantenedores selecionam um veículo de revisão e fecham ou redirecionam duplicatas em vez de
mesclar ambos.

Somente um mantenedor mescla um plugin depois que todos os gates passam. Cada plugin aceito é
mesclado individualmente; validação, curadoria ou automação não implicam merge automático ou em
lote.

## Checklist do pull request

- [ ] Usei um branch dedicado e este PR altera exatamente uma entrada de plugin.
- [ ] A fonte é o repositório original do criador, não um guarda-chuva ou agregador.
- [ ] O handle/perfil do criador, o repositório, o ID do nó, o subcaminho e o commit completo
      estão evidenciados.
- [ ] O kind, a categoria e as tags seguem `docs/CATEGORIES.md`.
- [ ] A licença SPDX e o descritor de instalação fixado estão evidenciados.
- [ ] A integração nativa com o DSH e o resultado do smoke test ou o status `not run` estão
      evidenciados.
- [ ] Não executei código de ciclo de vida de plugin ou pacote para preparar esta contribuição.
- [ ] As estrelas dedicadas são verificáveis, ou as estrelas de monorepo usam a política de null
      obrigatória.
- [ ] Verifiquei se já existe uma entrada e um pull request em aberto para o mesmo plugin
      canônico.
- [ ] A entrada é explicitamente não oficial e não contém segredos nem dados pessoais privados.

## Política de idioma

A documentação de lançamento e as descrições do catálogo são exclusivamente em inglês. O
lançamento com 43 locais permanece um item de backlog pós-MVP; não adicione documentos de locale
vazios nem traduções automáticas em massa.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
