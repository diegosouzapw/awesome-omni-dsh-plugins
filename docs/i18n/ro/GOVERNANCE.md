# Guvernanța catalogului

> 🌐 [English](../../docs/GOVERNANCE.md) · **Română**

> **Proiect comunitar neoficial. Nu este afiliat, susținut sau sponsorizat de DeepSeek.**
> Numele și mărcile DeepSeek aparțin proprietarului lor de drept.

Cum este guvernat catalogul public: cine decide ce intră, în ce ordine sunt onorate contribuțiile
concurente, ce verificări rulează automat și ce judecăți rămân umane. Politicile la care se face
referire aici se află în [CONTRIBUTING.md](../../CONTRIBUTING.md),
[docs/CREDIT.md](../../docs/CREDIT.md) și [docs/RANKING.md](../../docs/RANKING.md); această pagină
descrie cum se îmbină ele.

## Principii

1. **Creatorul are prioritate.** Catalogul există pentru a face munca creatorilor descoperibilă,
   niciodată pentru a și-o însuși. Pentru același plugin canonic, un pull request direct al
   creatorului înlocuiește orice pull request deschis de curatore comunitară sau automatizare —
   ordinea completă a priorității și regulile de identitate Git în
   [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Un plugin, un pull request revizuit.** Fără integrări în lot, fără importuri generate în masă
   în catalogul public. Fiecare intrare își câștigă propriul review.
3. **Dovezi în locul încrederii.** Fiecare câmp public poate fi urmărit până la repository-ul
   original al creatorului, la un commit fixat. O verificare automată verde nu este niciodată
   acceptată drept dovadă de origine.
4. **Neoficial, întotdeauna.** Nicio stare a catalogului nu este prezentată drept revizuire,
   certificare sau susținere DeepSeek.

## Cum ajung schimbările pe `main`

Toate schimbările ajung pe `main` prin pull request-uri revizuite — nu există push direct.
Politica de lucru pentru ramura implicită:

- **Doar pull request-uri.** Intrările de catalog, documentația și schimbările de schemă intră
  toate printr-un PR; PR-urile de catalog trebuie să respecte regula unui plugin per ramură din
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Istoric liniar.** PR-urile sunt integrate astfel încât `main` să păstreze un istoric liniar și
  auditabil; istoricul public integrat nu este rescris. Dacă o intrare curată a fost integrată
  înainte ca creatorul să se prezinte, creatorul o revendică sau o corectează într-o contribuție de
  continuare, în locul rescrierii istoricului.
- **Rezolvarea firelor de review.** Conversațiile de review sunt rezolvate înainte de integrare;
  feedback-ul nerezolvat blochează integrarea.
- **Integrare de către întreținători.** Doar un întreținător integrează o intrare de plugin și doar
  după ce fiecare poartă din [CONTRIBUTING.md](../../CONTRIBUTING.md) → „Porți de review, coliziuni
  și integrare" trece pe commit-ul curent al PR-ului.

## Verificarea `catalog-validation`

Fiecare pull request care atinge `catalog/plugins/`, `schemas/` sau workflow-ul însuși rulează
job-ul `catalog-validation` (`.github/workflows/validate-catalog.yml`), fixat la CLI-ul publicat:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Ce validează** — doar structură și semantică locală:

- Parsare YAML sigură a fiecărei intrări sub `catalog/plugins/`.
- Conformitate cu schema publică (vezi [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Parsarea expresiilor SPDX, versiuni SemVer exacte, valori de integritate SHA-512 SRI valide.
- Respingerea duplicatelor: fără ID-uri de intrare repetate și fără chei canonice
  repository-node-plus-subpath repetate.
- Catalogul intenționat cu zero intrări trece (`0 entries valid; catalog is empty`).

**Ce NU validează** — și deci ce nu dovedește niciodată o verificare verde:

- Identitatea remote a repository-ului: nu contactează GitHub și nu rezolvă ID-ul de nod al
  repository-ului în raport cu URL-ul.
- Dovezile la commit-ul fixat: descrierile, licențele, integrarea DSH și dovezile smoke nu sunt
  descărcate sau inspectate.
- Proprietatea creatorului, numerele de stele sau coliziunea cu pull request-uri deschise.

Aceste judecăți aparțin porților separate de proveniență ale întreținătorilor, aplicate înainte de
integrare și descrise în [CONTRIBUTING.md](../../CONTRIBUTING.md). Verificarea locală este podeaua,
nu ștacheta.

## Stări de verificare

Verificarea este înregistrată per intrare, față de commit-ul ei exact fixat, folosind stările
definite în schema publică (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). Cele două stări pozitive sunt intenționat înguste:

- `eligible` — structura publică și integrarea DSH nativă au fost validate.
- `verified` — în plus, un smoke-test de instalare a trecut pentru sursa sau pachetul fixat; schema
  cere ca înregistrarea smoke-testului să fie prezentă.

Niciuna dintre stări — nici orice alta — nu este o susținere, o garanție sau o certificare de
securitate. Semantica completă, inclusiv cum interacționează stările cu clasamentul, se află în
[docs/RANKING.md](../../docs/RANKING.md); forma înregistrării este în
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Revendicări, corecturi și eliminări

Formularele structurate de issue GitHub (`.github/ISSUE_TEMPLATE/`) sunt calea guvernată pentru a
schimba o intrare pe care nu ai trimis-o tu:

| Formular        | Cine îl folosește                          | Rezultat                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Claim**      | Un creator al cărui plugin a fost curat de altcineva | Proprietatea este legată de sursa originală; creatorul poate apoi contribui direct |
| **Correction** | Oricine observă metadate publice inexacte | O corectare revizuită a intrării afectate             |
| **Removal**    | Un creator care dorește eliminarea listării lui, sau un raportor al unei încălcări de politică | Eliminare sau carantinare revizuită a intrării |

Reguli care se aplică tuturor celor trei fluxuri:

- Revendicările de proprietate trebuie susținute de dovezi publice verificabile (proprietatea
  repository-ului, autoratul pachetului, metadatele manifestului sau istoricul sursei fixate) —
  a comenta într-un Discussion nu stabilește calitatea de creator
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Problemele de securitate ale unui plugin listat merg mai întâi la întreținătorul acelui plugin;
  partea de catalog gestionează apoi corectarea sau carantinarea, fără a publica detalii de
  exploit ([SECURITY.md](../../SECURITY.md)).
- Nu include niciodată credențiale, date de contact private sau alte secrete într-un formular.

## Roluri

- **Creatorii** își dețin pluginurile și prioritatea listărilor lor. Pot contribui direct, pot
  aproba curatoria comunitară sau pot revendica/corecta/elimina o intrare existentă.
- **Contributorii comunitari** pot curate intrări pentru creatorii care nu au contribuit încă,
  conform regulilor de contact respectuos și creditare din
  [docs/CREDIT.md](../../docs/CREDIT.md). Curatoria nu depășește niciodată o contribuție directă
  ulterioară a creatorului.
- **Întreținătorii** revizuiesc, aplică porțile de proveniență, rezolvă coliziunile și integrează.
  Ei întrețin de asemenea site-ul ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online))
  și CLI-ul publicat dintr-o sursă privată; datele publice, schema și politicile acestui repository
  sunt ceea ce consumă acele suprafețe.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
