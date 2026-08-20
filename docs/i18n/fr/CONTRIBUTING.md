# Contribuer

> 🌐 [English](../../CONTRIBUTING.md) · **Français**

> **Projet communautaire non officiel. Non affilié à, ni approuvé ni sponsorisé par DeepSeek.**
> Les noms et marques DeepSeek appartiennent à leurs propriétaires respectifs.

Merci d'améliorer le catalogue. Les contributions donnent la priorité au créateur : utilisez des
preuves issues du dépôt d'origine, préservez l'attribution et gardez chaque plugin révisable de
manière indépendante. Le catalogue démarre vide par conception ; aucune entrée n'est acceptée sans
sa propre pull request révisée.

## Commencez par le créateur

Une pull request ouverte directement par le créateur du plugin ou l'organisation propriétaire est
toujours préférée. Si le créateur est prêt à contribuer, utilisez sa branche et sa pull request au
lieu de recréer son travail dans une branche de curation ou d'automatisation.

La curation communautaire est bienvenue lorsqu'elle aide un créateur qui n'a pas encore ouvert de
pull request. Elle n'établit ni propriété ni priorité sur une contribution directe ultérieure du
créateur.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Un plugin par branche et par pull request

Créez une branche dédiée pour un seul plugin et ouvrez une seule pull request depuis cette
branche. La branche et la pull request doivent créer ou modifier exactement un fichier YAML sous
`catalog/plugins/`. Ne mélangez pas plugins, nettoyage de documentation, index générés ou
maintenance sans rapport dans cette branche ou cette pull request.

L'ID de l'entrée et le nom du fichier doivent être la même valeur en kebab-case minuscule. Les
mainteneurs révisent et fusionnent chaque pull request de plugin individuellement ; un lot
contenant plusieurs plugins n'est ni scindé ni fusionné partiellement.

## Résolvez la source d'origine

Chaque champ public doit être reconstruit à partir du dépôt d'origine du créateur, du paquet, du
manifeste, du README, de la licence ou de la release au commit fixé. Ne copiez pas le texte,
l'attribution de catégorie, les captures d'écran, le classement, les badges ou les métadonnées
générées d'un autre catalogue ou agrégateur. Un lien trouvé dans un projet fourre-tout, une
marketplace, une liste ou un agrégateur n'est qu'une piste, pas une preuve, et pas la source du
plugin.

Ne soumettez jamais un projet fourre-tout, un agrégateur, une marketplace, un catalogue
d'installateurs ou une liste comme entrée de catalogue, même lorsqu'il est installable de façon
indépendante. Utilisez-le seulement comme piste et résolvez chaque plugin enfant installable de
façon indépendante jusqu'à son créateur réel et son dépôt d'origine. Un plugin dans le monorepo
réel de son créateur peut être soumis depuis son sous-chemin exact, mais il doit suivre la
politique d'étoiles de monorepo ci-dessous.

## Preuves requises

Fournissez tout ce qui suit dans la pull request :

- L'URL publique canonique du dépôt d'origine et son ID de nœud de dépôt immuable. Les
  mainteneurs résolvent l'ID de nœud et rejettent les divergences d'URL dans le contrôle de
  provenance séparé.
- Le handle GitHub public du créateur et l'URL de profil public correspondante. Le YAML stocke le
  handle une seule fois ; l'URL de profil est dérivée comme `https://github.com/<handle>`.
- Un OID de commit source complet à 40 caractères et le sous-chemin exact du plugin, ou `null`
  pour un plugin à la racine du dépôt.
- Une description en anglais bornée et son chemin de preuve à ce commit fixé.
- Le `kind` de l'artefact, la catégorie principale et les tags sélectionnés dans
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- L'expression SPDX complète de la licence amont, prouvée au commit fixé.
- Un descripteur d'installation canonique fixé à une version npm exacte, ou au dépôt source, au
  commit complet et au sous-chemin. Le descripteur est une donnée, jamais une commande shell.
- Une preuve d'intégration native avec le DSH et son chemin au commit fixé.
- Une preuve de smoke test existante et non sensible pour ce pin exact de l'artefact, ou la valeur
  explicite `not run`. N'installez pas le plugin et n'exécutez pas `preinstall`, `install`,
  `postinstall`, `prepare` ni aucun autre code de cycle de vie de paquet/plugin uniquement pour
  préparer une contribution au catalogue.
- Pour un dépôt dédié, le nombre d'étoiles vérifiable pour ce dépôt exact, avec la source publique
  et l'heure de vérification. Pour un plugin en monorepo, utilisez la politique de null
  obligatoire ci-dessous.
- La provenance publique de Discussion ou de commentaire lorsqu'elle existe ; sinon, utilisez
  `null`.
- La valeur lisible par machine `unofficial: true`.

En l'absence de smoke test qualifiant, utilisez `verification.status: eligible` et
`verification.smokeTest: null`. N'utilisez `verified` que lorsqu'il existe une preuve de smoke
test révisable pour le pin exact. Aucun des deux états n'est une approbation ni une certification
de sécurité.

Ne soumettez jamais d'identifiants, de cookies, d'adresses e-mail privées, de code source non
publié ou d'autres secrets.

## Règles YAML et schéma

Créez `catalog/plugins/<plugin-id>.yaml` et validez-le contre
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). Le schéma est la source de
vérité pour les noms de champs et les valeurs autorisées ;
[docs/CATEGORIES.md](../../docs/CATEGORIES.md) définit comment choisir le `kind` unique de
l'artefact, la catégorie principale, les tags et le périmètre de dépôt.

Un descripteur npm doit contenir un nom de paquet valide et une version exacte. Le schéma public
rejette les valeurs ressemblant à des options et non bornées, mais ne réimplémente pas SemVer ni
SRI : la validation du catalogue doit analyser la version, exiger un SemVer exact et analyser
toute valeur d'intégrité comme un SRI SHA-512 valide. Un descripteur source est lié à
`source.repository`, `source.commit` et `source.subpath` sans dupliquer les valeurs mutables de
la source.

Les installateurs doivent utiliser des tableaux d'arguments, désactiver l'exécution via shell et
placer un terminateur d'option avant les valeurs positionnelles fournies par le catalogue, lorsque
la commande invoquée le prend en charge. La validation de soumission ne doit pas invoquer un
installateur ni le cycle de vie d'un plugin.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` est un contrôle local, en lecture seule, structurel et sémantique. Il analyse
du YAML sûr, valide le schéma public, analyse les expressions SPDX, exige un SemVer exact et un
SRI SHA-512 valide, et rejette les ID dupliqués ainsi que les clés nœud-de-dépôt-plus-sous-chemin
canoniques. Il ne contacte pas GitHub, ne résout pas l'identité du dépôt et n'inspecte pas les
chemins de preuve au commit fixé.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Avant qu'une entrée n'atteigne `eligible`, les mainteneurs résolvent séparément le dépôt canonique
et l'ID de nœud, lient le créateur à la source d'origine, et inspectent la description déclarée,
la licence, l'intégration DSH et la preuve de smoke test à `source.commit`. Un résultat de
validation locale vert n'est pas une preuve de provenance ou d'origine.

## Étoiles du dépôt

Seules les étoiles vérifiablement liées au dépôt dédié exact du plugin peuvent être enregistrées.
Les étoiles d'un projet parent ne doivent jamais être attribuées à un plugin stocké dans un
monorepo plus large. Une entrée de monorepo reste éligible pour les sections fonctionnelles du
catalogue mais doit déclarer :

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Une entrée dédiée utilise `repositoryScope: dedicated`, `starsPolicy: exact-repository` et le
nombre d'étoiles non négatif observé sur ce même dépôt. Lisez
[docs/RANKING.md](../../docs/RANKING.md) avant de soumettre des données de popularité.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Précédence du créateur et contact respectueux

Pour un même plugin canonique, la précédence est :

1. Une pull request ouverte par le créateur ou l'organisation propriétaire.
2. Une pull request communautaire explicitement approuvée par le créateur.
3. Une pull request de curation communautaire valide déjà existante.
4. Une pull request d'automatisation du catalogue.

Une pull request directe du créateur remplace toute pull request de curation ou d'automatisation
ouverte, qu'elle ait été ouverte en premier ou qu'elle soit la plus avancée. La pull request du
créateur devient le véhicule de révision ; les mainteneurs ne font pas de force-push sur la
branche du créateur ni ne transplantent son travail dans la pull request curée. Si une entrée
curée est déjà fusionnée, l'historique public n'est pas réécrit. Le créateur peut utiliser une
demande de revendication ou de correction, puis contribuer directement avec une pull request de
suivi.

Une pull request curée doit utiliser une seule mention publique respectueuse `@créateur` dans sa
description, à côté d'un lien vers le dépôt d'origine, invitant le créateur à la réviser ou à la
remplacer par une pull request directe. Ne répétez pas la mention, n'ouvrez pas d'issues
promotionnelles, ne faites pas de cross-post, n'envoyez pas de messages directs non sollicités et
ne spammez pas le créateur d'une autre manière.

<!-- creator-first:source-bound-git-identity -->

Les pull requests et commits rédigés par le créateur préservent naturellement le crédit du
créateur. Les commits curés peuvent utiliser l'auteur Git du créateur ou un trailer
`Co-authored-by` uniquement avec une identité liée à la source et publiquement vérifiable.
N'inventez ni ne devinez jamais un e-mail. Lorsqu'aucune identité Git vérifiée n'est disponible, le
curateur rédige le commit et donne un crédit explicite « Created by @handle » avec le lien du
dépôt d'origine dans le YAML et la pull request. Un compte de mainteneur ou d'automatisation peut
être committer ou coauteur vérifié, mais ne doit pas remplacer l'auteur du créateur. Voir
[docs/CREDIT.md](../../docs/CREDIT.md) pour la politique complète.

## Commandes de validation et disponibilité

Le CLI npm est publié sous le nom `omni-dsh-plugins@1.0.0`, donc les commandes
ci-dessous sont disponibles via `npx` dès aujourd'hui. Utilisez-les exactement telles qu'écrites ;
les contributeurs ne doivent pas inventer de commandes de substitution.

Exécutez ces commandes depuis la racine du dépôt :

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` n'effectue que les contrôles locaux de YAML, schéma, SPDX, SemVer exact, SRI
SHA-512 et duplication décrits ci-dessus, et accepte le catalogue intentionnellement vide. Il ne
prouve pas l'identité distante du dépôt ni la preuve de source fixée. Les autres commandes
vérifient la documentation publique obligatoire et les formulaires structurés d'issue GitHub.
Réussir ces commandes localement n'assouplit pas les exigences de preuve ; les mainteneurs
appliquent toujours chaque contrôle de release correspondant avant de fusionner.

## Contrôles de révision, collisions et fusion

Les mainteneurs appliquent chaque contrôle au commit actuel de la pull request avant de fusionner :

1. **Périmètre :** une branche dédiée, un fichier YAML de plugin et aucun changement sans rapport.
2. **Identité d'origine :** créateur, dépôt canonique, ID de nœud, commit complet et sous-chemin
   concordent.
3. **Schéma et preuves :** YAML, catégories, SPDX, pin d'installation, preuve DSH et statut de
   smoke test sont cohérents en interne sans exécuter de code de cycle de vie du plugin.
4. **Popularité :** les étoiles dédiées sont vérifiables sur le dépôt exact, ou les étoiles de
   monorepo sont `null` avec `undefined-parent-repository`.
5. **Documentation et formulaires :** la documentation publique, les blocs Markdown et les
   formulaires structurés restent valides.
6. **Collision et déduplication :** aucune entrée fusionnée ni pull request ouverte ne représente
   le même plugin canonique.

Des noms ou ID différents ne rendent pas des plugins dupliqués distincts. Traitez comme une
collision le même ID de nœud de dépôt et sous-chemin, le même paquet canonique, ou une autre cible
d'installation manifestement identique. Résolvez les alias et les pull requests concurrentes avant
la fusion. Une pull request directe du créateur l'emporte sur une collision avec la curation ou
l'automatisation ; sinon, les mainteneurs sélectionnent un véhicule de révision et ferment ou
redirigent les doublons plutôt que de fusionner les deux.

Seul un mainteneur fusionne un plugin une fois tous les contrôles passés. Chaque plugin accepté
est fusionné individuellement ; la validation, la curation ou l'automatisation n'impliquent pas de
fusion automatique ou par lot.

## Checklist de pull request

- [ ] J'ai utilisé une branche dédiée et cette PR modifie exactement une entrée de plugin.
- [ ] La source est le dépôt d'origine du créateur, pas un projet fourre-tout ni un agrégateur.
- [ ] Le handle/profil du créateur, le dépôt, l'ID de nœud, le sous-chemin et le commit complet
      sont prouvés.
- [ ] Le kind, la catégorie et les tags suivent `docs/CATEGORIES.md`.
- [ ] La licence SPDX et le descripteur d'installation fixé sont prouvés.
- [ ] L'intégration native DSH et le résultat du smoke test ou le statut `not run` sont prouvés.
- [ ] Je n'ai pas exécuté de code de cycle de vie de plugin ou de paquet pour préparer cette
      contribution.
- [ ] Les étoiles dédiées sont vérifiables, ou les étoiles de monorepo utilisent la politique de
      null obligatoire.
- [ ] J'ai vérifié l'absence d'entrée existante et de pull request ouverte pour le même plugin
      canonique.
- [ ] L'entrée est explicitement non officielle et ne contient ni secrets ni données personnelles
      privées.

## Politique linguistique

La documentation de lancement et les descriptions du catalogue sont exclusivement en anglais. Le
déploiement en 43 langues reste un élément de backlog post-MVP ; n'ajoutez pas de documents de
locale vides ni de traductions automatiques en masse.

<!-- i18n-source-hash: 54fa0daef6ededc936a6f681d0cbe7463ec4080757d199e691824dfdc8b388f4 -->
