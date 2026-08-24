# Gouvernance du catalogue

> 🌐 [English](../../GOVERNANCE.md) · [Português (Brasil)](../pt-BR/GOVERNANCE.md) · [中文（简体）](../zh-CN/GOVERNANCE.md) · **Français**

> **Projet communautaire non officiel. Non affilié à, ni approuvé ni sponsorisé par DeepSeek.**
> Les noms et marques DeepSeek appartiennent à leurs propriétaires respectifs.

Comment le catalogue public est gouverné : qui décide de ce qui entre, dans quel ordre les
contributions concurrentes sont honorées, quels contrôles s'exécutent automatiquement, et quels
jugements restent humains. Les politiques référencées ici vivent dans
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md) et
[docs/RANKING.md](../../docs/RANKING.md) ; cette page décrit comment elles s'articulent.

## Principes

1. **Priorité au créateur.** Le catalogue existe pour rendre le travail des créateurs
   découvrable, jamais pour en prendre la propriété. Pour un même plugin canonique, une pull
   request directe du créateur remplace toute pull request de curation communautaire ou
   d'automatisation ouverte — l'ordre de priorité complet et les règles d'identité Git sont dans
   [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Un plugin, une pull request revue.** Aucune fusion en lot, aucun import en masse généré
   dans le catalogue public. Chaque entrée gagne sa propre revue.
3. **La preuve avant la confiance.** Chaque champ public remonte au dépôt du créateur original, à
   un commit épinglé. Un contrôle automatisé au vert n'est jamais accepté comme preuve d'origine.
4. **Toujours non officiel.** Aucun état du catalogue n'est présenté comme une revue, une
   certification ou une approbation de DeepSeek.

## Comment les changements atteignent `main`

Tous les changements atteignent `main` via des pull requests revues — il n'y a pas de push
direct. La politique de travail pour la branche par défaut :

- **Pull requests uniquement.** Les entrées du catalogue, la documentation et les changements de
  schéma entrent tous via une PR ; les PR de catalogue doivent suivre la règle d'un plugin par
  branche définie dans [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Historique linéaire.** Les PR sont intégrées de façon à ce que `main` conserve un historique
  linéaire et auditable ; l'historique public fusionné n'est pas réécrit. Si une entrée curée a
  été fusionnée avant que le créateur ne se manifeste, le créateur la revendique ou la corrige
  dans une contribution de suivi plutôt que par une réécriture d'historique.
- **Résolution des fils de revue.** Les conversations de revue sont résolues avant la fusion ; un
  retour non résolu bloque l'intégration.
- **Fusion par un mainteneur.** Seul un mainteneur fusionne une entrée de plugin, et seulement
  après que chaque contrôle listé dans [CONTRIBUTING.md](../../CONTRIBUTING.md) →
  « Contrôles de révision, collisions et fusion » a réussi sur le commit actuel de la PR.

## Le contrôle `catalog-validation`

Chaque pull request touchant `catalog/plugins/`, `schemas/` ou le workflow lui-même déclenche le
job `catalog-validation` (`.github/workflows/validate-catalog.yml`), fixé au CLI publié :

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Ce qu'il valide** — uniquement la structure et la sémantique locale :

- L'analyse YAML sûre de chaque entrée sous `catalog/plugins/`.
- La conformité au schéma public (voir [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- L'analyse d'expression SPDX, les versions SemVer exactes, les valeurs d'intégrité SRI SHA-512
  valides.
- Le rejet des doublons : aucun ID d'entrée répété et aucune clé canonique
  nœud-de-dépôt-plus-sous-chemin répétée.
- Le catalogue intentionnellement vide passe (`0 entries valid; catalog is empty`).

**Ce qu'il NE valide PAS** — et donc ce qu'un contrôle au vert ne prouve jamais :

- L'identité distante du dépôt : il ne contacte pas GitHub et ne résout pas l'ID de nœud du dépôt
  par rapport à l'URL.
- La preuve au commit fixé : les descriptions, licences, intégrations DSH et preuves de smoke
  test ne sont ni récupérées ni inspectées.
- La propriété du créateur, le nombre d'étoiles, ou la collision avec des pull requests ouvertes.

Ces jugements relèvent des contrôles de provenance séparés des mainteneurs, appliqués avant la
fusion et décrits dans [CONTRIBUTING.md](../../CONTRIBUTING.md). Le contrôle local est le
plancher, pas la barre.

## États de vérification

La vérification est enregistrée par entrée par rapport à son commit exact épinglé, en utilisant
les états définis dans le schéma public (`eligible`, `verified`, `stale`, `unavailable`,
`archived`, `quarantined`). Les deux états positifs sont délibérément étroits :

- `eligible` — la structure publique et l'intégration DSH native ont été validées.
- `verified` — en plus, un test de fumée d'installation a réussi pour la source ou le paquet
  épinglé ; le schéma exige que l'enregistrement du smoke test soit présent.

Aucun état — ni aucun autre — n'est une approbation, une garantie ou une certification de
sécurité. La sémantique complète, y compris la façon dont les états interagissent avec le
classement, est dans [docs/RANKING.md](../../docs/RANKING.md) ; la forme de l'enregistrement est
dans [docs/SCHEMA.md](../../docs/SCHEMA.md).

## Revendications, corrections et suppressions

Les formulaires d'issue GitHub structurés (`.github/ISSUE_TEMPLATE/`) sont le chemin gouverné
pour modifier une entrée que vous n'avez pas soumise :

| Formulaire      | Qui l'utilise                              | Résultat                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Revendication** | Un créateur dont le plugin a été curé par quelqu'un d'autre | La propriété est liée à la source d'origine ; le créateur peut ensuite contribuer directement |
| **Correction** | Quiconque repère des métadonnées publiques inexactes | Une correction revue de l'entrée concernée             |
| **Suppression**    | Un créateur qui veut que sa fiche soit supprimée, ou un rapporteur d'une violation de politique | Suppression revue ou mise en quarantaine de l'entrée |

Règles qui s'appliquent aux trois flux :

- Les revendications de propriété doivent être appuyées par une preuve publique vérifiable
  (propriété du dépôt, paternité du paquet, métadonnées de manifeste ou historique de source
  épinglé) — commenter une Discussion n'établit pas la paternité
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Les problèmes de sécurité dans un plugin listé vont d'abord au mainteneur de ce plugin ; le
  côté catalogue gère ensuite la correction ou la mise en quarantaine sans publier de détail
  d'exploitation ([SECURITY.md](../../SECURITY.md)).
- N'incluez jamais d'identifiants, de coordonnées privées ou d'autres secrets dans un formulaire.

## Rôles

- **Les créateurs** possèdent leurs plugins et la priorité de leurs fiches. Ils peuvent
  contribuer directement, approuver une curation communautaire, ou revendiquer/corriger/supprimer
  une entrée existante.
- **Les contributeurs communautaires** peuvent curer des entrées pour des créateurs qui n'ont pas
  encore contribué, selon les règles de contact respectueux et de crédit dans
  [docs/CREDIT.md](../../docs/CREDIT.md). La curation ne prime jamais sur une contribution
  directe ultérieure du créateur.
- **Les mainteneurs** revoient, appliquent les contrôles de provenance, résolvent les collisions
  et fusionnent. Ils maintiennent aussi le site web
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) et le CLI publié depuis
  une source privée ; les données publiques, le schéma et les politiques de ce dépôt sont ce que
  ces surfaces consomment.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
