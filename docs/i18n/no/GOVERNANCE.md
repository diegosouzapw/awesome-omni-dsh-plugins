# Katalogstyring

> 🌐 [English](../../GOVERNANCE.md) · [Português (Brasil)](../pt-BR/GOVERNANCE.md) · [中文（简体）](../zh-CN/GOVERNANCE.md) · **Norsk**

> **Uoffisielt community-prosjekt. Ikke tilknyttet, godkjent av eller sponset av DeepSeek.**
> DeepSeek-navn og -merker tilhører sine respektive eiere.

Hvordan den offentlige katalogen styres: hvem bestemmer hva som kommer inn, i hvilken
rekkefølge konkurrerende bidrag hedres, hvilke sjekker som kjører automatisk, og hvilke
bedømmelser som forblir menneskelige. Policyene som refereres her, finnes i
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md) og
[docs/RANKING.md](../../docs/RANKING.md); denne siden beskriver hvordan de henger sammen.

## Prinsipper

1. **Skaperen først.** Katalogen finnes for å gjøre skaperes arbeid oppdagbart, aldri for å
   ta eierskap til det. For den samme kanoniske pluginen fortrenger en direkte skaper-pull-
   request enhver åpen fellesskapskuraterings- eller automatiserings-pull-request — full
   forrangsrekkefølge og Git-identitetsregler i [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Én plugin, én gjennomgått pull request.** Ingen batch-sammenslåinger, ingen genererte
   masseimporter til den offentlige katalogen. Hver oppføring gjør seg fortjent til sin egen
   gjennomgang.
3. **Bevis fremfor tillit.** Alle offentlige felt spores til skaperens opprinnelige
   repositorium ved en fastpinnet kommit. En grønn automatisert sjekk aksepteres aldri som
   opprinnelsesbevis.
4. **Uoffisiell, alltid.** Ingen katalogtilstand presenteres som DeepSeek-gjennomgang,
   -sertifisering eller -godkjenning.

## Hvordan endringer lander på `main`

Alle endringer når `main` gjennom gjennomgåtte pull requests — det finnes ingen direkte
push-er. Arbeidspolitikken for default branch:

- **Bare pull requests.** Katalogoppføringer, dokumentasjon og skjemaendringer kommer alle inn
  gjennom en PR; katalog-PR-er må følge én-plugin-per-branch-regelen i
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Lineær historikk.** PR-er integreres slik at `main` beholder en lineær, reviderbar
  historikk; sammenslått offentlig historikk skrives ikke om. Hvis en kuratert oppføring ble
  slått sammen før skaperen meldte seg, gjør skaperen krav på eller retter den i et
  oppfølgingsbidrag i stedet for en omskriving av historikken.
- **Løsning av gjennomgangstråder.** Gjennomgangssamtaler løses før sammenslåing; uløst
  tilbakemelding blokkerer integrering.
- **Vedlikeholdersammenslåing.** Bare en vedlikeholder slår sammen en pluginoppføring, og
  bare etter at hver port i [CONTRIBUTING.md](../../CONTRIBUTING.md) → «Gjennomgangsporter,
  kollisjoner og sammenslåing» er bestått på den gjeldende PR-kommitten.

## `catalog-validation`-sjekken

Hver pull request som berører `catalog/plugins/`, `schemas/` eller selve workflow-en, kjører
`catalog-validation`-jobben (`.github/workflows/validate-catalog.yml`), fastpinnet til den
publiserte CLI-en:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Hva den validerer** — bare lokal struktur og semantikk:

- Sikker YAML-parsing av hver oppføring under `catalog/plugins/`.
- Samsvar med det offentlige skjemaet (se [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- SPDX-uttrykks-parsing, eksakte SemVer-versjoner, gyldige SHA-512 SRI-integritetsverdier.
- Duplikatavvisning: ingen gjentatte oppførings-ID-er og ingen gjentatte kanoniske
  repository-node-pluss-understi-nøkler.
- Den bevisst tomme katalogen passerer (`0 entries valid; catalog is empty`).

**Hva den IKKE validerer** — og dermed hva en grønn sjekk aldri beviser:

- Ekstern repositorieidentitet: den kontakter ikke GitHub og løser ikke repositoriets node-ID
  mot URL-en.
- Bevis ved den fastpinnede kommitten: beskrivelser, lisenser, DSH-integrasjon og
  smoketestbevis hentes ikke og inspiseres ikke.
- Skapereierskap, stjernetall eller kollisjon med åpne pull requests.

De bedømmelsene tilhører vedlikeholdernes separate opprinnelsesporter, som anvendes før
sammenslåing og er beskrevet i [CONTRIBUTING.md](../../CONTRIBUTING.md). Den lokale sjekken
er gulvet, ikke lista.

## Verifiseringstilstander

Verifisering registreres per oppføring mot dens eksakte fastpinnede kommit, med tilstandene
definert i det offentlige skjemaet (`eligible`, `verified`, `stale`, `unavailable`,
`archived`, `quarantined`). De to positive tilstandene er bevisst smale:

- `eligible` — den offentlige strukturen og den native DSH-integrasjonen ble validert.
- `verified` — i tillegg besto en installasjonssmoketest for den fastpinnede kilden eller
  pakken; skjemaet krever at smoketest-oppføringen finnes.

Ingen tilstand — eller noen annen — er en godkjenning, garanti eller sikkerhetssertifisering.
Fullstendig semantikk, inkludert hvordan tilstander samvirker med rangering, finnes i
[docs/RANKING.md](../../docs/RANKING.md); oppføringsformen er i
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Krav, rettelser og fjerninger

Strukturerte GitHub-issue-skjemaer (`.github/ISSUE_TEMPLATE/`) er den styrte veien for å endre
en oppføring du ikke selv sendte inn:

| Skjema           | Hvem bruker det                              | Resultat                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Claim**      | En skaper hvis plugin ble kuratert av noen andre | Eierskap bindes til den opprinnelige kilden; skaperen kan deretter bidra direkte |
| **Correction** | Alle som oppdager unøyaktige offentlige metadata | En gjennomgått rettelse av den berørte oppføringen             |
| **Removal**    | En skaper som vil fjerne oppføringen sin, eller en rapportør av et policybrudd | Gjennomgått fjerning eller karantene av oppføringen |

Regler som gjelder for alle tre flytene:

- Eierskapskrav må støttes av verifiserbare offentlige bevis (repositorieeierskap,
  pakkeforfatterskap, manifestmetadata eller fastpinnet kildehistorikk) — å kommentere på en
  Discussion etablerer ikke skaperskap ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Sikkerhetsproblemer i en oppført plugin går først til den pluginens egen vedlikeholder;
  katalogsiden håndterer deretter rettelse eller karantene uten å publisere
  utnyttelsesdetaljer ([SECURITY.md](../../SECURITY.md)).
- Inkluder aldri legitimasjon, private kontaktopplysninger eller andre hemmeligheter i et
  skjema.

## Roller

- **Skapere** eier sine plugins og sine oppføringers forrang. De kan bidra direkte, godkjenne
  fellesskapskuratering, eller gjøre krav på/rette/fjerne en eksisterende oppføring.
- **Fellesskapsbidragsytere** kan kuratere oppføringer for skapere som ennå ikke har bidratt,
  under reglene for respektfull kontakt og kreditering i
  [docs/CREDIT.md](../../docs/CREDIT.md). Kuratering utkonkurrerer aldri et senere direkte
  skaperbidrag.
- **Vedlikeholdere** gjennomgår, anvender opprinnelsesportene, løser kollisjoner og slår
  sammen. De vedlikeholder også nettstedet
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) og den publiserte
  CLI-en fra privat kildekode; dette repositoriets offentlige data, skjema og policyer er det
  disse flatene konsumerer.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
