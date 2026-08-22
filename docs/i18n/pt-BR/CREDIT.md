# Crédito ao Criador e Precedência de Pull Request

> 🌐 [English](../../docs/CREDIT.md) · **Português (Brasil)**

O catálogo existe para tornar o trabalho independente com o DSH descobrível sem tirar a
propriedade de seus criadores. As entradas públicas citam o repositório original e um commit de
origem imutável.

## Precedência para o mesmo plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Um pull request aberto pelo criador do plugin ou pela organização proprietária.
2. Um pull request da comunidade explicitamente aprovado ou coautorado pelo criador.
3. Um pull request da comunidade existente e válido.
4. Um pull request de automação de catálogo.
5. Um candidato privado sem pull request público.

Um pull request direto do criador é sempre preferível e substitui qualquer pull request de
curadoria da comunidade ou automação em aberto para o mesmo plugin canônico, independentemente de
qual foi aberto primeiro ou está mais avançado. O pull request do criador se torna o veículo de
revisão; o branch dele nunca é sobrescrito, recebe force-push ou é transplantado para o pull
request curado. Se uma entrada curada já foi mesclada, o histórico permanece intacto e o criador
pode reivindicá-la ou corrigi-la em uma nova contribuição.

## Atribuição pública

Toda entrada de catálogo carrega o handle público do GitHub do criador, o repositório original, o
ID do nó de repositório, o subcaminho do plugin e o commit completo fixado. O perfil público do
criador é derivado do handle único, em vez de ser armazenado como uma segunda identidade. O gate
de proveniência separado dos mantenedores resolve o ID do nó e rejeita uma divergência de URL do
repositório. As descrições de pull request devem dizer `Created by @handle` e incluir metadados
do repositório de origem e do commit de origem.

Uma pessoa que posta ou comenta em uma Discussion não é automaticamente tratada como o criador. A
propriedade deve ser sustentada pelo dono do repositório ou organização, autoria de pacote,
metadados de manifesto ou histórico de fonte exato fixado.

## Identidade Git

<!-- creator-first:source-bound-git-identity -->

A autoria do commit e a autoria do pull request são separadas. Um pull request originado pelo
criador mantém o criador como autor do pull request, e seus commits preservam a autoria
naturalmente. Uma conta de mantenedor ou automação pode aparecer como committer ou como coautor
verificado, mas não deve substituir a autoria do criador.

Para um commit curado, use o criador como autor Git ou adicione um trailer `Co-authored-by`
somente quando a identidade exata for vinculada à fonte e publicamente verificável, como uma
identidade já anexada ao commit do criador no repositório original. Nunca adivinhe um e-mail,
fabrique um endereço noreply ou use um endereço privado encontrado fora de uma fonte pública
autorizada.

Quando uma identidade Git verificada não estiver disponível, o curador ou a conta de automação
autora o commit e dá crédito visível explícito no lugar: `Created by @handle`, o perfil público
correspondente e um link para o repositório original na entrada e no pull request. A atribuição
visível no YAML é sempre exigida, independentemente do mapeamento de identidade Git. Um pull
request direto do criador posterior substitui um pull request curado em aberto, em vez de herdar
seu histórico sintético.

## Menção respeitosa ao criador

Um pull request curado usa uma única menção pública respeitosa `@criador` em sua descrição, ao
lado do link do repositório original. Pode convidar a uma revisão ou a um pull request direto de
substituição. Não repita a menção, não abra issues promocionais, não faça cross-post nem envie
mensagens diretas não solicitadas.

## Licença do catálogo versus licença upstream

Os fatos do catálogo e os metadados editoriais em YAML são dedicados sob CC0-1.0. Essa dedicação
não altera a licença do plugin upstream. Código, documentação, capturas de tela, logotipos e
outro material criativo upstream permanecem sujeitos às suas licenças e proprietários originais.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
