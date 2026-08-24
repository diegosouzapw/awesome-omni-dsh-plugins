# Crédito al creador y precedencia de pull requests

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Español**

> **Proyecto comunitario no oficial. No afiliado, respaldado ni patrocinado por DeepSeek.**
> Los nombres y marcas de DeepSeek pertenecen a sus respectivos propietarios.

El catálogo existe para hacer que el trabajo independiente de DSH sea descubrible sin quitarles
la propiedad a sus creadores. Las entradas públicas citan el repositorio original y un commit de
origen inmutable.

## Precedencia para el mismo plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Un pull request abierto por el creador del plugin o la organización propietaria.
2. Un pull request de la comunidad explícitamente aprobado o coautorado por el creador.
3. Un pull request de la comunidad válido y existente.
4. Un pull request de automatización del catálogo.
5. Un candidato privado sin pull request público.

Un pull request directo del creador siempre es preferido y reemplaza a cualquier pull request de
curaduría comunitaria o automatización abierto para el mismo plugin canónico, sin importar cuál
se abrió primero o cuál está más avanzado. El pull request del creador se convierte en el
vehículo de revisión; su rama nunca se sobrescribe, recibe force-push ni se trasplanta al pull
request curado. Si una entrada curada ya se fusionó, el historial permanece intacto y el creador
puede reclamarla o corregirla en una nueva contribución.

## Atribución pública

Cada entrada del catálogo lleva el handle público de GitHub del creador, el repositorio original,
el ID de nodo del repositorio, la subruta del plugin y el commit completo fijado. El perfil
público del creador se deriva del único handle en lugar de almacenarse como una segunda
identidad. El gate de procedencia separado de los mantenedores resuelve el ID de nodo y rechaza
una discrepancia de URL de repositorio. Las descripciones de pull request deben decir
`Created by @handle` e incluir los metadatos del repositorio de origen y el commit de origen.

Una persona que publica o comenta en una Discussion no se trata automáticamente como el creador.
La propiedad debe estar respaldada por el propietario del repositorio o la organización, la
autoría del paquete, los metadatos del manifiesto o el historial exacto de la fuente fijada.

## Identidad de Git

<!-- creator-first:source-bound-git-identity -->

La autoría del commit y la autoría del pull request son cosas separadas. Un pull request
originado por el creador mantiene al creador como autor del pull request, y sus commits
preservan la autoría de forma natural. Una cuenta de mantenedor o automatización puede aparecer
como committer o como coautor verificado, pero no debe reemplazar la autoría del creador.

Para un commit curado, use al creador como autor de Git o agregue un trailer `Co-authored-by`
solo cuando la identidad exacta esté vinculada a la fuente y sea públicamente verificable, como
una identidad ya adjunta al commit del creador en el repositorio original. Nunca adivine un
correo electrónico, fabrique una dirección noreply ni use una dirección privada encontrada fuera
de una fuente pública autorizada.

Cuando no haya una identidad de Git verificada disponible, el curador o la cuenta de
automatización autora el commit y otorga crédito visible explícito en su lugar:
`Created by @handle`, el perfil público correspondiente y un enlace al repositorio original en la
entrada y en el pull request. La atribución visible en el YAML siempre es obligatoria de forma
independiente al mapeo de identidad de Git. Un pull request directo posterior del creador
reemplaza un pull request curado abierto en lugar de heredar su historial sintético.

## Mención respetuosa al creador

Un pull request curado usa una única mención pública respetuosa `@creador` en su descripción,
junto al enlace del repositorio original. Puede invitar a una revisión o a un pull request de
reemplazo directo. No repita la mención, no abra issues promocionales, no haga cross-post ni
envíe mensajes directos no solicitados.

## Licencia del catálogo frente a la licencia upstream

Los hechos del catálogo y los metadatos editoriales en YAML están dedicados bajo CC0-1.0. Esa
dedicación no cambia la licencia del plugin upstream. El código, la documentación, las capturas
de pantalla, los logotipos y otro material creativo upstream permanecen sujetos a sus licencias y
propietarios originales.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
