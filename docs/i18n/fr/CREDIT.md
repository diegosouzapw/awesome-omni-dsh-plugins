# Crédit du créateur et priorité des pull requests

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Français**

> **Projet communautaire non officiel. Non affilié à, ni approuvé ni sponsorisé par DeepSeek.**
> Les noms et marques DeepSeek appartiennent à leurs propriétaires respectifs.

Le catalogue existe pour rendre le travail DSH indépendant découvrable sans retirer la propriété
à ses créateurs. Les entrées publiques citent le dépôt d'origine et un commit source immuable.

## Priorité pour un même plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Une pull request ouverte par le créateur du plugin ou l'organisation propriétaire.
2. Une pull request communautaire explicitement approuvée ou co-rédigée par le créateur.
3. Une pull request communautaire valide déjà existante.
4. Une pull request d'automatisation du catalogue.
5. Un candidat privé sans pull request publique.

Une pull request directe du créateur est toujours préférée et remplace toute pull request de
curation communautaire ou d'automatisation ouverte pour le même plugin canonique, qu'elle ait été
ouverte en premier ou qu'elle soit la plus avancée. La pull request du créateur devient le
véhicule de révision ; sa branche n'est jamais écrasée, forcée en push (force-push) ou
transplantée dans la pull request curée. Si une entrée curée est déjà fusionnée, l'historique
reste intact et le créateur peut la revendiquer ou la corriger dans une nouvelle contribution.

## Attribution publique

Chaque entrée du catalogue porte le handle GitHub public du créateur, le dépôt d'origine, l'ID de
nœud de dépôt, le sous-chemin du plugin et le commit complet épinglé. Le profil public du
créateur est dérivé de ce handle unique au lieu d'être stocké comme une seconde identité. Le
contrôle de provenance séparé des mainteneurs résout l'ID de nœud et rejette une divergence d'URL
de dépôt. Les descriptions de pull request doivent indiquer « Created by @handle » et inclure les
métadonnées du dépôt source et du commit source.

Une personne qui publie ou commente une Discussion n'est pas automatiquement traitée comme le
créateur. La propriété doit être appuyée par le propriétaire du dépôt ou de l'organisation, la
paternité du paquet, les métadonnées de manifeste ou l'historique de source épinglé exact.

## Identité Git

<!-- creator-first:source-bound-git-identity -->

La paternité du commit et la paternité de la pull request sont séparées. Une pull request
originaire du créateur garde le créateur comme auteur de la pull request, et ses commits
préservent naturellement la paternité. Un compte de mainteneur ou d'automatisation peut apparaître
comme committer ou comme coauteur vérifié, mais ne doit pas remplacer la paternité du créateur.

Pour un commit curé, utilisez le créateur comme auteur Git ou ajoutez un trailer
`Co-authored-by` uniquement lorsque l'identité exacte est liée à la source et publiquement
vérifiable, comme une identité déjà attachée au commit du créateur dans le dépôt d'origine.
Ne devinez jamais un e-mail, ne fabriquez jamais une adresse noreply et n'utilisez pas une
adresse privée trouvée hors d'une source publique autorisée.

Lorsqu'aucune identité Git vérifiée n'est disponible, le curateur ou le compte d'automatisation
rédige le commit et donne un crédit visible explicite à la place : « Created by @handle », le
profil public correspondant et un lien vers le dépôt d'origine dans l'entrée et la pull request.
L'attribution YAML visible est toujours requise indépendamment de la correspondance d'identité
Git. Une pull request directe ultérieure du créateur remplace une pull request curée ouverte au
lieu d'hériter de son historique synthétique.

## Mention respectueuse du créateur

Une pull request curée utilise une seule mention publique respectueuse `@créateur` dans sa
description, à côté du lien vers le dépôt d'origine. Elle peut inviter à une revue ou à une
pull request de remplacement directe. Ne répétez pas la mention, n'ouvrez pas d'issues
promotionnelles, ne faites pas de cross-post et n'envoyez pas de messages directs non sollicités.

## Licence du catalogue versus licence en amont

Les faits du catalogue et les métadonnées YAML éditoriales sont dédiés au domaine public sous
CC0-1.0. Cette dédicace ne change pas la licence du plugin en amont. Le code, la documentation,
les captures d'écran, les logos et autre matériel créatif en amont restent soumis à leurs
licences et propriétaires d'origine.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
