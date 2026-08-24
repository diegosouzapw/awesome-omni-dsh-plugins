# Kredito ng Lumikha at Prayoridad ng Pull Request

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Filipino**

Umiiral ang katalogo upang madiskubre ang independiyenteng DSH na trabaho nang hindi
kinaagawan ang mga lumikha ng pagmamay-ari. Ang mga pampublikong entry ay bumabanggit sa
orihinal na repository at sa isang hindi nagbabagong source commit.

## Prayoridad para sa parehong plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Ang pull request na binuksan ng lumikha ng plugin o ng organisasyong may-ari.
2. Ang community pull request na malinaw na inaprubahan o kasamang sinulat ng lumikha.
3. Ang umiiral at wastong community pull request.
4. Ang catalog automation pull request.
5. Ang pribadong kandidat na walang pampublikong pull request.

Ang direkta na pull request ng lumikha ay palaging mas gustong at papalitan ang anumang bukas
na community curation o automation pull request para sa parehong canonical na plugin, alinman
ang nagbukas nang mas mauna o mas malayo na ang narating. Ang pull request ng lumikha ang
magiging sasakyan ng review; hindi kailanman mapapalitan, mafa-force-push, o maililipat ang
kanilang branch sa curated pull request. Kung na-merge na ang isang curated entry, nananatiling
buo ang kasaysayan at maaari itong i-claim o iwasto ng lumikha sa isang bagong ambag.

## Pampublikong attribution

Ang bawat entry ng katalogo ay may dalang pampublikong GitHub handle ng lumikha, orihinal na
repository, repository node ID, subpath ng plugin, at buong nakapirming commit. Ang
pampublikong profile ng lumikha ay hinango mula sa iisang handle sa halip na itabi bilang
ikalawang pagkakakilanlan. Ang hiwalay na provenance gate ng maintainer ang naglulutas ng
node ID at tumatanggi ng hindi pagtugma ng repository URL. Ang mga paglalarawan ng pull
request ay dapat nagsasabi ng `Created by @handle` at magsasama ng metadata ng source
repository at source commit.

Ang isang taong nagpo-post o nagkokomento sa isang Discussion ay hindi awtomatikong itinuturing
na lumikha. Ang pagmamay-ari ay dapat suportahan ng may-ari ng repository o organisasyon,
pagkakatha ng package, manifest metadata, o eksaktong nakapirming source history.

## Git identity

<!-- creator-first:source-bound-git-identity -->

Magkahiwalay ang authorship ng commit at authorship ng pull request. Ang pull request na
nagmula sa lumikha ay pinapanatili ang lumikha bilang may-akda ng pull request, at ang
kanilang mga commit ay natural na nagpapanatili ng authorship. Ang maintainer o automation
account ay maaaring lumabas bilang committer o bilang naberipikang co-author, ngunit hindi
dapat palitan ang authorship ng lumikha.

Para sa curated commit, gamitin ang lumikha bilang Git author o magdagdag ng
`Co-authored-by` trailer kapag lamang ang eksaktong pagkakakilanlan ay source-bound at
pampublikong maberipika, tulad ng pagkakakilanlang nakakabit na sa commit ng lumikha sa
orihinal na repository. Huwag kailanman humula ng email, mag-imbento ng noreply address, o
gumamit ng pribadong address na natagpuan sa labas ng awtorisadong pampublikong source.

Kapag walang available na naberipikang Git identity, ang curator o automation account ang
mag-uulat ng commit at sa halip ay magbibigay ng malinaw na nakikitang kredito:
`Created by @handle`, ang tumutugmang pampublikong profile, at link sa orihinal na repository
sa entry at pull request. Ang nakikitang YAML attribution ay palaging kinakailangan nang
neatdependiyente sa Git identity mapping. Ang kalaunang direkta na pull request ng lumikha ay
papalitan ang bukas na curated pull request sa halip na mamanahin ang sintetiko nitong
kasaysayan.

## Magalang na pagbanggit sa lumikha

Ang curated pull request ay gumagamit ng isang magalang na pampublikong `@creator` mention sa
paglalarawan nito sa tabi ng link sa orihinal na repository. Maaari itong mag-anyaya ng
review o kapalit na direkta na pull request. Huwag ulitin ang mention, magbukas ng mga
promotional issue, mag-cross-post, o magpadala ng mga hindi hinihintay na direct message.

## Lisensya ng katalogo kumpara sa lisensya ng upstream

Ang mga katotohanan ng katalogo at editoryal na YAML metadata ay inilaan sa ilalim ng
CC0-1.0. Ang paglalaang iyon ay hindi nagbabago sa lisensya ng upstream plugin. Ang upstream
code, dokumentasyon, screenshot, logo, at iba pang likhang materyal ay nananatiling saklaw ng
kanilang orihinal na lisensya at mga may-ari.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
