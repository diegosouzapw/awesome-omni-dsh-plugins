# Catégories du catalogue

> 🌐 [English](../../docs/CATEGORIES.md) · **Français**

> **Projet communautaire non officiel. Non affilié à, ni approuvé ni sponsorisé par DeepSeek.**
> Les noms et marques DeepSeek appartiennent à leurs propriétaires respectifs.

Chaque entrée du catalogue a un type d'artefact, une catégorie de capacité principale et zéro ou
plusieurs tags. La catégorie principale détermine où l'entrée apparaît ; les tags fournissent une
recherche transversale sans dupliquer l'entrée.

## Types d'artefacts

<!-- catalog-policy:aggregators-never-entries -->

| Valeur | Signification | Classé par étoiles comme plugin |
|---|---|---:|
| `plugin` | Bundle DSH natif installable | Seulement si toutes les conditions de classement sont remplies |
| `plugin-family` | Dépôt contenant plusieurs plugins DSH | Non ; section séparée |
| `skin-theme` | Skin d'UI ou thème visuel DSH | Non ; section séparée |
| `skill` | Compétence d'agent avec support DSH | Non |
| `preset-profile` | Profil ou préréglage DSH | Non |
| `client-interface` | Client de bureau, TUI, éditeur ou distant | Non |
| `bridge-adapter` | Intégration d'un autre produit vers DSH | Non |
| `ecosystem-project` | Projet plus large contenant une intégration DSH | Non |

Un dépôt fourre-tout, un agrégateur, une marketplace, un catalogue d'installateurs ou une liste
n'est jamais une entrée de catalogue, même lorsque l'agrégateur lui-même est installable. Il ne
peut être utilisé que comme piste. Suivez chaque piste jusqu'à un artefact enfant installable de
façon indépendante et résolvez le créateur réel, le dépôt d'origine, le paquet et le sous-chemin
source de cet artefact avant de le soumettre. Un vrai monorepo de créateur peut être le dépôt
d'origine d'un plugin enfant, mais l'enfant doit utiliser ce sous-chemin exact et la politique
d'étoiles de monorepo.

Le champ `kind` est le discriminant canonique d'artefact DSH. Il n'existe pas de deuxième champ
de type d'intégration : `plugin` signifie déjà un bundle DSH natif, tandis que
`ecosystem-project` signifie déjà un projet plus large avec une intégration DSH. Cela évite les
paires de classification contradictoires.

## Catégories de capacité principale

| Valeur | Libellé d'affichage |
|---|---|
| `user-interface-dashboards` | Interface utilisateur et tableaux de bord |
| `memory-rag` | Mémoire et RAG |
| `search-research` | Recherche et exploration |
| `coding-developer-tools` | Codage et outils développeur |
| `browser-automation` | Navigateur et automatisation |
| `vision-audio-multimodal` | Vision, audio et multimodal |
| `sessions-productivity` | Sessions et productivité |
| `security-permissions-approvals` | Sécurité, permissions et approbations |
| `diagnostics-observability` | Diagnostics et observabilité |
| `models-providers-routing` | Modèles, fournisseurs et routage |
| `messaging-notifications` | Messagerie et notifications |
| `data-external-services` | Données et services externes |
| `entertainment-customization` | Divertissement et personnalisation |

Choisissez la catégorie qui représente le mieux la fonction principale du plugin, pas la
catégorie la plus susceptible d'augmenter sa visibilité.

## Tags d'interface

Les tags d'interface standards incluent `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` et `theme`. Des tags de capacité supplémentaires en
kebab-case minuscule sont autorisés lorsqu'ils décrivent une preuve visible dans la source
originale épinglée.

## Portée du dépôt

Utilisez `dedicated` uniquement lorsque les étoiles du dépôt appartiennent au plugin catalogué
exact. Utilisez `monorepo` lorsque le plugin est un sous-chemin ou un paquet dans un projet plus
large. Une entrée de monorepo doit utiliser `popularity.starsPolicy: undefined-parent-repository`
et `popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
