# Crédito ao Criador e Precedência de Pull Requests

O catálogo existe para tornar descobrível o trabalho independente com o DSH, sem retirar
propriedade aos seus criadores. As entradas públicas citam o repositório original e um commit
de origem imutável.

## Precedência para o mesmo plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Um pull request aberto pelo criador do plugin ou pela organização proprietária.
2. Um pull request da comunidade explicitamente aprovado ou coautorado pelo criador.
3. Um pull request da comunidade válido já existente.
4. Um pull request de automação do catálogo.
5. Um candidato privado sem pull request público.

Um pull request direto do criador é sempre preferido e tem precedência sobre qualquer pull
request de curadoria da comunidade ou de automação em aberto para o mesmo plugin canónico,
independentemente de qual foi aberto primeiro ou está mais avançado. O pull request do criador
torna-se o veículo de revisão; o seu branch nunca é substituído, sujeito a force-push nem
transplantado para o pull request curado. Se uma entrada curada já tiver sido integrada, o
histórico permanece intacto e o criador pode reivindicá-la ou corrigi-la numa nova contribuição.

## Atribuição pública

Cada entrada do catálogo carrega o identificador público do criador no GitHub, o repositório
original, o ID de nó do repositório, o subcaminho do plugin e o commit completo fixado. O
perfil público do criador é derivado do único identificador, em vez de ser guardado como uma
segunda identidade. O controlo de proveniência separado dos mantenedores resolve o ID de nó e
rejeita uma incompatibilidade de URL do repositório. As descrições dos pull requests devem
dizer `Created by @handle` e incluir os metadados do repositório de origem e do commit de
origem.

Uma pessoa que publica ou comenta numa Discussion não é automaticamente tratada como o criador.
A propriedade tem de ser sustentada pelo dono do repositório ou pela organização, pela autoria
do pacote, pelos metadados do manifesto ou pelo histórico exato da fonte fixada.

## Identidade Git

<!-- creator-first:source-bound-git-identity -->

A autoria do commit e a autoria do pull request são separadas. Um pull request originado pelo
criador mantém o criador como autor do pull request, e os seus commits preservam a autoria
naturalmente. Uma conta de mantenedor ou de automação pode aparecer como committer ou como
coautor verificado, mas nunca pode substituir a autoria do criador.

Para um commit curado, use o criador como autor Git ou adicione um trailer `Co-authored-by`
apenas quando a identidade exata está vinculada à fonte e é publicamente verificável, como uma
identidade já associada ao commit do criador no repositório original. Nunca adivinhe um e-mail,
fabrique um endereço noreply nem use um endereço privado encontrado fora de uma fonte pública
autorizada.

Quando não existe uma identidade Git verificada disponível, o curador ou a conta de automação
assina o commit e dá crédito visível explícito: `Created by @handle`, o perfil público
correspondente e uma ligação para o repositório original na entrada e no pull request. A
atribuição visível em YAML é sempre exigida, independentemente do mapeamento de identidade Git.
Um pull request direto posterior do criador substitui um pull request curado em aberto, em vez
de herdar o seu histórico sintético.

## Menção respeitosa ao criador

Um pull request curado usa uma única menção pública respeitosa `@criador` na sua descrição,
junto da ligação para o repositório original. Pode convidar a uma revisão ou a um pull request
direto de substituição. Não repita a menção, não abra issues promocionais, não faça cross-posting
nem envie mensagens diretas não solicitadas.

## Licença do catálogo versus licença a montante

Os factos do catálogo e os metadados editoriais em YAML são disponibilizados sob CC0-1.0. Essa
disponibilização não altera a licença do plugin a montante. O código, a documentação, as
capturas de ecrã, os logótipos e outro material criativo a montante permanecem sujeitos às suas
licenças e proprietários originais.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
