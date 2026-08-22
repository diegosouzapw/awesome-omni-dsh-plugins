# Katalogstyrning

> 🌐 [English](../../docs/GOVERNANCE.md) · **Svenska**

> **Inofficiellt community-projekt. Inte anknutet till, godkänt av eller sponsrat av DeepSeek.**
> DeepSeek-namn och -märken tillhör respektive ägare.

Hur den offentliga katalogen styrs: vem som bestämmer vad som kommer in, i vilken ordning
konkurrerande bidrag honoreras, vilka kontroller som körs automatiskt och vilka bedömningar som
förblir mänskliga. Policyerna som refereras här finns i
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md) och
[docs/RANKING.md](../../docs/RANKING.md); denna sida beskriver hur de hänger ihop.

## Principer

1. **Skaparen först.** Katalogen finns för att göra skapares arbete upptäckbart, aldrig för att ta
   över ägandeskapet av det. För samma kanoniska plugin ersätter en direkt pull request från
   skaparen varje öppen community-kuraterings- eller automatiserings-pull-request — den fullständiga
   företrädesordningen och Git-identitetsreglerna finns i
   [docs/CREDIT.md](../../docs/CREDIT.md).
2. **En plugin, en granskad pull request.** Inga batchsammanslagningar, inga genererade
   massimporter i den offentliga katalogen. Varje post förtjänar sin egen granskning.
3. **Bevis framför tillit.** Varje offentligt fält kan spåras till skaparens ursprungliga
   repository vid en fastnålad commit. En grön automatisk kontroll accepteras aldrig som bevis på
   ursprung.
4. **Inofficiell, alltid.** Inget katalogtillstånd presenteras som DeepSeek-granskning,
   -certifiering eller -godkännande.

## Hur ändringar landar på `main`

Alla ändringar når `main` genom granskade pull requests — det finns inga direkta pushar. Den
gällande policyn för standardbranchen:

- **Endast pull requests.** Katalogposter, dokumentation och schemaändringar kommer alla in via en
  PR; katalog-PR:er måste följa regeln en-plugin-per-branch i
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Linjär historik.** PR:er integreras så att `main` behåller en linjär, granskningsbar historik;
  sammanslagen offentlig historik skrivs inte om. Om en kuraterad post slogs samman innan skaparen
  hörde av sig gör skaparen anspråk på den eller korrigerar den i ett uppföljande bidrag i stället
  för en omskrivning av historiken.
- **Lösning av granskningstrådar.** Granskningskonversationer löses före sammanslagning; olöst
  feedback blockerar integrering.
- **Underhållarsammanslagning.** Endast en underhållare slår samman en pluginpost, och först efter
  att varje grind i [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Granskningsgrindar, kollisioner
  och sammanslagning" har godkänts på den aktuella PR-commiten.

## `catalog-validation`-kontrollen

Varje pull request som rör `catalog/plugins/`, `schemas/` eller själva workflowen kör
`catalog-validation`-jobbet (`.github/workflows/validate-catalog.yml`), fastnålat vid det
publicerade CLI:t:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Vad den validerar** — endast lokal struktur och semantik:

- Säker YAML-parsning av varje post under `catalog/plugins/`.
- Överensstämmelse med det offentliga schemat (se [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- SPDX-uttrycksparsning, exakta SemVer-versioner, giltiga SHA-512 SRI-integritetsvärden.
- Duplikatavvisning: inga upprepade post-ID:n och inga upprepade kanoniska
  repository-nod-plus-understig-nycklar.
- Den avsiktligt tomma katalogen godkänns (`0 entries valid; catalog is empty`).

**Vad den INTE validerar** — och därmed vad en grön kontroll aldrig bevisar:

- Fjärrrepository-identitet: den kontaktar inte GitHub och löser inte repository-node-ID:t mot
  URL:en.
- Bevis vid den fastnålade commiten: beskrivningar, licenser, DSH-integration och röktestbevis
  hämtas eller inspekteras inte.
- Skaparens ägandeskap, stjärnantal eller kollision med öppna pull requests.

Dessa bedömningar tillhör underhållarnas separata proveniensgrindar, som tillämpas före
sammanslagning och beskrivs i [CONTRIBUTING.md](../../CONTRIBUTING.md). Den lokala kontrollen är
golvet, inte ribban.

## Verifieringstillstånd

Verifiering registreras per post mot dess exakta fastnålade commit med de tillstånd som definieras
i det offentliga schemat (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). De två positiva tillstånden är avsiktligt snäva:

- `eligible` — den offentliga strukturen och den native DSH-integrationen validerades.
- `verified` — dessutom godkändes ett installations-rök-test för den fastnålade källan eller
  paketet; schemat kräver att röktestposten finns.

Inget av tillstånden — eller något annat — är ett godkännande, en garanti eller en
säkerhetscertifiering. Den fullständiga semantiken, inklusive hur tillstånd samverkar med
rankning, finns i [docs/RANKING.md](../../docs/RANKING.md); postens form finns i
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Anspråk, korrigeringar och borttagningar

Strukturerade GitHub-issue-formulär (`.github/ISSUE_TEMPLATE/`) är den styrda vägen för att ändra
en post som du inte själv skickade in:

| Formulär       | Vem använder det                             | Utfall                                            |
| -------------- | -------------------------------------------- | ------------------------------------------------- |
| **Claim**      | En skapare vars plugin har kuraterats av någon annan | Ägandeskapet binds till originalkällan; skaparen kan därefter bidra direkt |
| **Correction** | Alla som upptäcker felaktig offentlig metadata | En granskad rättelse av den berörda posten    |
| **Removal**    | En skapare som vill få sin listning borttagen, eller en rapportör av ett policybrott | Granskad borttagning eller karantän av posten |

Regler som gäller för alla tre flödena:

- Ägandeanspråk måste stödjas av verifierbara offentliga bevis (repository-ägande,
  paketskaparskap, manifestmetadata eller fastnålad källhistorik) — att kommentera i en
  Discussion fastställer inte skaparskap ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Säkerhetsproblem i en listad plugin går först till den pluginens egen underhållare;
  katalogsidan hanterar sedan korrigering eller karantän utan att publicera
  exploit-detaljer ([SECURITY.md](../../SECURITY.md)).
- Inkludera aldrig autentiseringsuppgifter, privata kontaktuppgifter eller andra hemligheter i ett
  formulär.

## Roller

- **Skapare** äger sina plugins och sina listningars företräde. De kan bidra direkt, godkänna
  community-kuratering eller göra anspråk på, korrigera eller ta bort en befintlig post.
- **Community-bidragsgivare** får kuratera poster för skapare som ännu inte har bidragit, enligt
  reglerna för respektfull kontakt och kredit i [docs/CREDIT.md](../../docs/CREDIT.md). Kuratering
  rankas aldrig högre än ett senare direkt skaparbidrag.
- **Underhållare** granskar, tillämpar proveniensgrindarna, löser kollisioner och slår samman. De
  underhåller även webbplatsen
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) och det publicerade CLI:t
  från privat källa; detta repositorys offentliga data, schema och policyer är vad dessa ytor
  konsumerar.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
