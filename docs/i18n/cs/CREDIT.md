# Kredit tvůrců a přednost pull requestů

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Čeština**

Katalog existuje proto, aby byla nezávislá práce na DSH dohledatelná, aniž by se tvůrcům bralo
vlastnictví. Veřejné záznamy citují původní repozitář a neměnný zdrojový commit.

## Přednost pro stejný plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Pull request otevřený tvůrcem pluginu nebo vlastnící organizací.
2. Komunitní pull request výslovně schválený nebo spoluautorizovaný tvůrcem.
3. Existující platný komunitní pull request.
4. Pull request z automatizace katalogu.
5. Soukromý kandidát bez veřejného pull requestu.

Přímý pull request tvůrce je vždy preferován a má přednost před jakýmkoli otevřeným komunitním
pull requestem s kurátorstvím nebo automatizací pro stejný kanonický plugin, bez ohledu na to,
který byl otevřen dříve nebo je dále v procesu. Pull request tvůrce se stává nástrojem pro
posouzení; jeho branch se nikdy nepřepisuje, neprovádí se na něj force-push ani se jeho práce
nepřenáší do kurátorovaného pull requestu. Pokud byl kurátorovaný záznam již sloučen, historie
zůstává nedotčena a tvůrce si jej může nárokovat nebo opravit v novém příspěvku.

## Veřejné připsání

Každý záznam katalogu nese veřejný GitHub handle tvůrce, původní repozitář, ID uzlu repozitáře,
podcestu pluginu a úplný fixovaný commit. Veřejný profil tvůrce se odvozuje z jediného handlu
místo toho, aby se ukládal jako druhá identita. Samostatná brána správců pro původ (provenance)
ověřuje ID uzlu a odmítá nesoulad URL repozitáře. Popisy pull requestů by měly uvádět
`Created by @handle` a zahrnovat metadata zdrojového repozitáře a zdrojového commitu.

Osoba, která něco zveřejní v Discussion nebo tam komentuje, není automaticky považována za
tvůrce. Vlastnictví musí být podloženo vlastníkem repozitáře nebo organizací, autorstvím
balíčku, metadaty manifestu nebo přesnou historií fixovaného zdroje.

## Identita Git

<!-- creator-first:source-bound-git-identity -->

Autorství commitu a autorství pull requestu jsou oddělené. Pull request zahájený tvůrcem
zachovává tvůrce jako autora pull requestu a jeho commity přirozeně zachovávají autorství. Účet
správce nebo automatizace se může objevit jako committer nebo jako ověřený spoluautor, ale
nesmí nahradit autorství tvůrce.

Pro kurátorovaný commit použijte tvůrce jako autora Gitu nebo přidejte trailer
`Co-authored-by` pouze tehdy, pokud je přesná identita zdrojově vázaná a veřejně ověřitelná —
například identita již připojená ke commitu tvůrce v původním repozitáři. Nikdy e-mail
nehádejte, nevytvářejte noreply adresu ani nepoužívejte soukromou adresu nalezenou mimo
pověřený veřejný zdroj.

Pokud ověřená identita Git není k dispozici, commit autoruje kurátor nebo účet automatizace a
místo toho udělí výslovný viditelný kredit: `Created by @handle`, odpovídající veřejný profil a
odkaz na původní repozitář v záznamu a v pull requestu. Viditelné připsání v YAML je vždy
povinné nezávisle na mapování identity Git. Pozdější přímý pull request tvůrce nahradí otevřený
kurátorovaný pull request, místo aby zdědil jeho syntetickou historii.

## Uctivá zmínka o tvůrci

Kurátorovaný pull request použije v popisu jednu uctivou veřejnou zmínku `@creator` vedle
odkazu na původní repozitář. Může pozvat k posouzení nebo k náhradnímu přímému pull requestu.
Zmínku neopakujte, neotvírejte propagační issues, nedělejte cross-post ani neposílejte
nevyžádané přímé zprávy.

## Licence katalogu versus licence zdroje

Fakta katalogu a redakční metadata YAML jsou uvolněna pod CC0-1.0. Toto uvolnění nemění licenci
upstream pluginu. Upstream kód, dokumentace, snímky obrazovky, loga a další tvůrčí materiál
zůstávají podléhat svým původním licencím a vlastníkům.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
