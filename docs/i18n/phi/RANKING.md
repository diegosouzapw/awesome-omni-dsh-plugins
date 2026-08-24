# Metodolohiya ng Ranggo

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Filipino**

Ang mga ranggo ay mga transparenteng tanawin sa mga na-merge nang pampublikong entry ng
katalogo. Hindi sila kailanman gumagamit ng nakatagong pinagsamang iskor at hindi kailanman
itinuturing ang mga bituin mula sa isang malawak na parent project bilang popularidad ng
plugin.

## Predicate ng Top Plugins by Stars

Ang isang entry ay kwalipikado lamang kapag totoo ang bawat kundisyon sa ibaba:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Ang mga kwalipikadong entry ay gumagamit ng `popularity.starsPolicy: exact-repository` at ng
non-negative integer sa `popularity.stars`. Ang mga pagkakapantay-pantay ay gumagamit ng
plugin ID na hindi nagpapangkat ng malaki at maliit na letra bilang deterministikong ayos ng
pagpapakita; ang tie-break ay hindi nangangahulugang may pagkakaiba sa kalidad.

Ang `kind` ang tanging panukoy ng uri ng artifact. Sinasadyang hindi nagtatago ang schema ng
ikalawang uri ng DSH integration na maaaring sumalungat dito.

## Mga malinaw na pagbubukod

Ang plugin sa loob ng mas malawak na monorepo ay nananatiling kwalipikado sa katalogo, ngunit
ang mga bituin ng parent nito ay hindi natutukoy para sa ranggo ng plugin. Dapat itong
gumamit ng `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository`, at `popularity.stars: null`. Lalabas
ito sa mga functional section at ibinubukod mula sa bawat ranggong batay sa bituin.

Ang mga pamilya ng plugin, tema, skin, skill, preset, client, interface, bridge, at mas
malalawak na ecosystem project ay hindi lumalabas sa Top Plugins by Stars. Binibigyan sila ng
hiwalay na mga seksyon kapag may kaparehong data. Ang mga aggregator, marketplace, installer
catalog, at listahan ay hindi entry ng katalogo at walang tinatanggap na seksyon sa katalogo.

## Mga tanawin ng ranggo

Maaaring maglathala ang proyekto ng magkakaibang tanawin para sa mga bituin, paglago sa
24-oras, paglago sa 7-araw, mga kamakailang update, naberipikang install, mga pamilya ng
plugin, tema at skin, client at interface, at mga ecosystem integration. Ang bawat tanawin ay
dapat ihayag ang sarili nitong panuntunan sa pagsasama at oras ng snapshot.

Sa zero kwalipikadong entry, hindi ire-render ang Top Plugins. Ang unang kwalipikadong merge
ay lilikha ng tanawin ng Top Plugins; ang label ay magbabago tungong Top 10 pagkatapos lamang
na umiiral ang sampung kwalipikadong entry. Walang pinahihintulutang placeholder o
gawa-gawang ranggo.

## Ang verification ay hindi pag-endorso

Ang `eligible` ay nangangahulugang na-validate ang pampublikong istruktura at DSH
integration. Ang `verified` ay karagdagang nangangahulugang pumasa ang installation smoke
test para sa nakapirming source o package. Ang alinmang status ay hindi pag-endorso,
garantiya, o ganap na sertipikasyon ng seguridad.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
