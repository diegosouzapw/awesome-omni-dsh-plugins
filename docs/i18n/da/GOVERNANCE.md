# Katalogstyring

> 🌐 [English](../../GOVERNANCE.md) · [Português (Brasil)](../pt-BR/GOVERNANCE.md) · [中文（简体）](../zh-CN/GOVERNANCE.md) · **Dansk**

> **Uofficielt community-projekt. Ikke tilknyttet, godkendt af eller sponsoreret af DeepSeek.**
> DeepSeek-navne og -mærker tilhører deres respektive ejer.

Sådan styres det offentlige katalog: hvem der beslutter, hvad der kommer ind, i hvilken rækkefølge
konkurrerende bidrag honoreres, hvilke kontroller der kører automatisk, og hvilke vurderinger der
forbliver menneskelige. Politikkerne, der refereres her, findes i
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md) og
[docs/RANKING.md](../../docs/RANKING.md); denne side beskriver, hvordan de hænger sammen.

## Principper

1. **Skaber først.** Kataloget findes for at gøre skaberes arbejde opdageeligt, aldrig for at tage
   ejerskabet over det. For det samme kanoniske plugin går en direkte pull request fra skaberen
   forud for enhver åben fællesskabs-kuraterings- eller automatiserings-pull-request — den fulde
   forrangsrækkefølge og Git-identitetsregler findes i [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Ét plugin, én gennemgået pull request.** Ingen batch-merges, ingen genererede masseimporteringer
   i det offentlige katalog. Hver post gør sig fortjent til sin egen gennemgang.
3. **Beviser frem for tillid.** Hvert offentligt felt kan spores til skaberens oprindelige
   repository ved et fastlåst commit. En grøn automatisk kontrol accepteres aldrig som bevis for
   oprindelse.
4. **Uofficiel, altid.** Ingen katalogtilstand præsenteres som DeepSeek-gennemgang, -certificering
   eller -anbefaling.

## Hvordan ændringer lander på `main`

Alle ændringer når `main` via gennemgåede pull requests — der er ingen direkte pushes. Den
gældende politik for standardbranchen:

- **Kun pull requests.** Katalogposter, dokumentation og schemaændringer kommer alle ind via en
  PR; katalog-PR'er skal følge ét-plugin-pr.-branch-reglen i
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Lineær historik.** PR'er integreres, så `main` bevarer en lineær, reviderbar historik; merget
  offentlig historik omskrives ikke. Hvis en kurateret post blev merget, før skaberen meldte sig,
  gør skaberen krav på den eller korrigerer den i et opfølgende bidrag i stedet for en
  historikomsrivning.
- **Løsning af review-tråde.** Review-samtaler løses før merge; uløst feedback blokerer
  integrationen.
- **Vedligeholder-merge.** Kun en vedligeholder merger en pluginpost, og først efter at hver gate
  i [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Review-gates, kollisioner og merge" er bestået på
  den aktuelle PR-commit.

## `catalog-validation`-kontrollen

Hver pull request, der rører `catalog/plugins/`, `schemas/` eller selve workflowet, kører
`catalog-validation`-jobbet (`.github/workflows/validate-catalog.yml`), fastlåst til det udgivne
CLI:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Hvad den validerer** — kun lokal struktur og semantik:

- Sikker YAML-fortolkning af hver post under `catalog/plugins/`.
- Overensstemmelse med det offentlige schema (se [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Fortolkning af SPDX-udtryk, præcise SemVer-versioner, gyldige SHA-512 SRI-integritetsværdier.
- Afvisning af dubletter: ingen gentagne post-ID'er og ingen gentagne kanoniske
  repository-node-plus-understi-nøgler.
- Det bevidst tomme katalog består (`0 entries valid; catalog is empty`).

**Hvad den IKKE validerer** — og derfor hvad en grøn kontrol aldrig beviser:

- Fjernrepository-identitet: den kontakter ikke GitHub og løser ikke repository-node-ID'et mod
  URL'en.
- Beviser ved den fastlåste commit: beskrivelser, licenser, DSH-integration og smoke-beviser
  hentes eller inspiceres ikke.
- Skaberes ejerskab, stjerneantal eller kollision med åbne pull requests.

Disse vurderinger tilhører vedligeholdernes separate proveniens-gates, som anvendes før merge og
er beskrevet i [CONTRIBUTING.md](../../CONTRIBUTING.md). Den lokale kontrol er gulvet, ikke
barren.

## Verificeringstilstande

Verificering registreres pr. post mod dens præcise fastlåste commit ved hjælp af de tilstande, der
er defineret i det offentlige schema (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). De to positive tilstande er bevidst snævre:

- `eligible` — den offentlige struktur og native DSH-integration blev valideret.
- `verified` — derudover bestod en installations-smoke-test for den fastlåste kilde eller pakke;
  schemaet kræver, at smoke-test-posten er til stede.

Ingen af tilstandene — eller nogen anden — er en anbefaling, garanti eller
sikkerhedscertificering. Den fulde semantik, herunder hvordan tilstande interagerer med
rangering, findes i [docs/RANKING.md](../../docs/RANKING.md); postens form findes i
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Krav, rettelser og fjernelser

Strukturerede GitHub-issue-formularer (`.github/ISSUE_TEMPLATE/`) er den styrede vej til at ændre
en post, du ikke selv har indsendt:

| Formular       | Hvem bruger den                            | Resultat                                            |
| -------------- | ------------------------------------------ | --------------------------------------------------- |
| **Claim**      | En skaber, hvis plugin er kurateret af en anden | Ejerskabet bindes til den oprindelige kilde; skaberen kan derefter bidrage direkte |
| **Correction** | Alle, der opdager unøjagtige offentlige metadata | En gennemgået rettelse af den berørte post       |
| **Removal**    | En skaber, der vil have sin optagelse fjernet, eller en rapportør af et politikbrud | Gennemgået fjernelse eller karantæne af posten |

Regler, der gælder for alle tre forløb:

- Ejerskabskrav skal understøttes af verificerbare offentlige beviser (repository-ejerskab,
  pakkeforfatterskab, manifest-metadata eller fastlåst kildehistorik) — en kommentar i en
  Discussion etablerer ikke skaberskab ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Sikkerhedsproblemer i et optaget plugin går først til det pågældende plugins egen vedligeholder;
  katalogsiden håndterer derefter rettelse eller karantæne uden at offentliggøre
  exploit-detaljer ([SECURITY.md](../../SECURITY.md)).
- Inkluder aldrig legitimationsoplysninger, private kontaktoplysninger eller andre hemmeligheder i
  en formular.

## Roller

- **Skabere** ejer deres plugins og deres optagelsers forrang. De kan bidrage direkte, godkende
  fællesskabskuratering eller gøre krav på, korrigere eller fjerne en eksisterende post.
- **Fællesskabsbidragydere** må kuratere poster for skabere, der endnu ikke har bidraget, under
  reglerne for respektfuld kontakt og kreditering i [docs/CREDIT.md](../../docs/CREDIT.md).
  Kuratering rangerer aldrig over et senere direkte skaberbidrag.
- **Vedligeholdere** gennemgår, anvender proveniens-gates, løser kollisioner og merger. De
  vedligeholder også webstedet
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) og det udgivne CLI fra
  privat kilde; dette repositorys offentlige data, schema og politikker er, hvad disse flader
  forbruger.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
