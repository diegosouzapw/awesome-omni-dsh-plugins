# Méthodologie de classement

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Français**

> **Projet communautaire non officiel. Non affilié à, ni approuvé ni sponsorisé par DeepSeek.**
> Les noms et marques DeepSeek appartiennent à leurs propriétaires respectifs.

Les classements sont des vues transparentes sur les entrées publiques fusionnées du catalogue.
Ils n'utilisent jamais un score combiné caché et ne traitent jamais les étoiles d'un projet
parent plus large comme la popularité d'un plugin.

## Prédicat du Top des plugins par étoiles

Une entrée n'est éligible que lorsque chaque condition ci-dessous est vraie :

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Les entrées éligibles utilisent `popularity.starsPolicy: exact-repository` et un entier non
négatif dans `popularity.stars`. Les égalités utilisent l'ID de plugin insensible à la casse comme
ordre d'affichage déterministe ; le départage n'implique pas de différence de qualité.

`kind` est le seul discriminant de type d'artefact. Le schéma ne stocke intentionnellement pas un
second type d'intégration DSH qui pourrait le contredire.

## Exclusions explicites

Un plugin à l'intérieur d'un monorepo plus large reste éligible au catalogue, mais ses étoiles de
projet parent sont indéfinies pour le classement des plugins. Il doit utiliser
`repositoryScope: monorepo`, `popularity.starsPolicy: undefined-parent-repository` et
`popularity.stars: null`. Il apparaît dans les sections fonctionnelles et est exclu de tout
classement basé sur les étoiles.

Les familles de plugins, thèmes, skins, compétences, préréglages, clients, interfaces, passerelles
et projets d'écosystème plus larges n'apparaissent pas dans le Top des plugins par étoiles. Ils
reçoivent des sections séparées lorsque des données comparables existent. Les agrégateurs,
marketplaces, catalogues d'installateurs et listes ne sont pas des entrées de catalogue et ne
reçoivent aucune section de catalogue.

## Vues de classement

Le projet peut publier des vues distinctes pour les étoiles, la croissance sur 24 heures, la
croissance sur 7 jours, les mises à jour récentes, les installations vérifiées, les familles de
plugins, les thèmes et skins, les clients et interfaces, et les intégrations d'écosystème. Chaque
vue doit divulguer sa propre règle d'inclusion et son moment d'instantané.

À zéro entrée éligible, le Top des plugins n'est pas rendu. La première fusion éligible crée une
vue Top des plugins ; le libellé ne devient Top 10 qu'après l'existence de dix entrées éligibles.
Aucun classement de remplacement ou fabriqué n'est autorisé.

## La vérification n'est pas une approbation

`eligible` signifie que la structure publique et l'intégration DSH ont été validées. `verified`
signifie en plus qu'un test de fumée d'installation a réussi pour la source ou le paquet
épinglé. Aucun statut n'est une approbation, une garantie ou une certification de sécurité
absolue.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
