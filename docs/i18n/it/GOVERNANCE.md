# Governance del catalogo

> 🌐 [English](../../docs/GOVERNANCE.md) · **Italiano**

> **Progetto comunitario non ufficiale. Non affiliato, approvato o sponsorizzato da DeepSeek.**
> I nomi e i marchi DeepSeek appartengono ai rispettivi proprietari.

Come viene governato il catalogo pubblico: chi decide cosa entra, in quale ordine vengono
onorate le contribuzioni concorrenti, quali controlli vengono eseguiti automaticamente e quali
giudizi restano umani. Le policy citate qui vivono in
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](CREDIT.md) e
[docs/RANKING.md](RANKING.md); questa pagina descrive come si integrano tra loro.

## Principi

1. **Priorità al creatore.** Il catalogo esiste per rendere scopribile il lavoro dei creatori,
   mai per sottrarne la proprietà. Per lo stesso plugin canonico, una pull request diretta del
   creatore prevale su qualsiasi pull request aperta di curatela della community o di
   automazione — l'ordine di precedenza completo e le regole sull'identità Git sono in
   [docs/CREDIT.md](CREDIT.md).
2. **Un plugin, una pull request revisionata.** Nessun merge in blocco, nessuna importazione
   generata in massa nel catalogo pubblico. Ogni voce guadagna la propria revisione.
3. **Prove sopra la fiducia.** Ogni campo pubblico risale al repository originale del creatore a
   un commit fissato. Un controllo automatico verde non è mai accettato come prova di origine.
4. **Non ufficiale, sempre.** Nessuno stato del catalogo viene presentato come revisione,
   certificazione o avallo da parte di DeepSeek.

## Come le modifiche arrivano su `main`

Tutte le modifiche raggiungono `main` tramite pull request revisionate — non esistono push
diretti. La policy operativa per il branch predefinito:

- **Solo pull request.** Le voci del catalogo, la documentazione e le modifiche allo schema
  entrano tutte tramite una PR; le PR del catalogo devono seguire la regola
  un-plugin-per-branch in [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Cronologia lineare.** Le PR vengono integrate in modo che `main` mantenga una cronologia
  lineare e verificabile; la cronologia pubblica unita non viene riscritta. Se una voce curata
  è stata unita prima che il creatore si facesse avanti, il creatore rivendica o corregge la
  voce con una contribuzione di follow-up invece di una riscrittura della cronologia.
- **Risoluzione dei thread di revisione.** Le conversazioni di revisione vengono risolte prima
  del merge; feedback non risolto blocca l'integrazione.
- **Merge del maintainer.** Solo un maintainer unisce una voce di plugin, e solo dopo che ogni
  gate in [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Gate di revisione, collisioni e merge" è
  superato sul commit corrente della PR.

## Il controllo `catalog-validation`

Ogni pull request che tocca `catalog/plugins/`, `schemas/` o il workflow stesso esegue il job
`catalog-validation` (`.github/workflows/validate-catalog.yml`), fissato alla CLI pubblicata:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Cosa valida** — solo struttura e semantica locale:

- Parsing YAML sicuro di ogni voce sotto `catalog/plugins/`.
- Conformità allo schema pubblico (vedi [docs/SCHEMA.md](SCHEMA.md)).
- Parsing di espressioni SPDX, versioni SemVer esatte, valori di integrità SRI SHA-512 validi.
- Rifiuto dei duplicati: nessun ID voce ripetuto e nessuna chiave canonica
  nodo-di-repository-più-subpath ripetuta.
- Il catalogo intenzionalmente a zero voci passa (`0 entries valid; catalog is empty`).

**Cosa NON valida** — e quindi cosa un controllo verde non dimostra mai:

- Identità remota del repository: non contatta GitHub né risolve l'ID nodo del repository
  rispetto all'URL.
- Prove al commit fissato: descrizioni, licenze, integrazione DSH e prove di smoke test non
  vengono recuperate né ispezionate.
- Proprietà del creatore, conteggio delle stelle, o collisione con pull request aperte.

Quei giudizi appartengono ai gate di provenienza separati dei maintainer, applicati prima del
merge e descritti in [CONTRIBUTING.md](../../CONTRIBUTING.md). Il controllo locale è il
pavimento, non l'asticella.

## Stati di verifica

La verifica viene registrata per voce rispetto al suo esatto commit fissato, usando gli stati
definiti nello schema pubblico (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). I due stati positivi sono deliberatamente ristretti:

- `eligible` — la struttura pubblica e l'integrazione nativa DSH sono state validate.
- `verified` — in aggiunta, uno smoke test di installazione è passato per la sorgente o il
  pacchetto fissato; lo schema richiede che il record dello smoke test sia presente.

Né questo stato — né alcun altro — è un avallo, una garanzia o una certificazione di sicurezza.
La semantica completa, incluso come gli stati interagiscono con la classifica, è in
[docs/RANKING.md](RANKING.md); la forma del record è in [docs/SCHEMA.md](SCHEMA.md).

## Rivendicazioni, correzioni e rimozioni

I formulari strutturati di issue GitHub (`.github/ISSUE_TEMPLATE/`) sono il percorso governato
per modificare una voce che non hai inviato tu:

| Formulario     | Chi lo usa                              | Esito                                             |
| -------------- | ----------------------------------------- | ---------------------------------------------------- |
| **Rivendicazione** | Un creatore il cui plugin è stato curato da qualcun altro | La proprietà viene vincolata alla fonte originale; il creatore può quindi contribuire direttamente |
| **Correzione** | Chiunque noti metadati pubblici inesatti | Una correzione revisionata alla voce interessata             |
| **Rimozione**  | Un creatore che vuole che la sua voce venga rimossa, oppure chi segnala una violazione della policy | Rimozione revisionata o quarantena della voce |

Regole che si applicano a tutti e tre i flussi:

- Le rivendicazioni di proprietà devono essere supportate da prove pubbliche verificabili
  (proprietà del repository, autoria del pacchetto, metadati del manifesto o cronologia sorgente
  fissata) — commentare in una Discussion non stabilisce la qualità di creatore
  ([docs/CREDIT.md](CREDIT.md)).
- I problemi di sicurezza in un plugin elencato vanno prima al maintainer di quel plugin; il
  lato catalogo gestisce quindi la correzione o la quarantena senza pubblicare dettagli di
  exploit ([SECURITY.md](../SECURITY.md)).
- Non includere mai credenziali, dettagli di contatto privati o altri segreti in un formulario.

## Ruoli

- **I creatori** possiedono i loro plugin e la precedenza delle loro voci. Possono contribuire
  direttamente, approvare la curatela della community, oppure rivendicare/correggere/rimuovere
  una voce esistente.
- **I contributori della community** possono curare voci per creatori che non hanno ancora
  contribuito, secondo le regole di contatto rispettoso e credito in
  [docs/CREDIT.md](CREDIT.md). La curatela non supera mai una successiva contribuzione diretta
  del creatore.
- **I maintainer** revisionano, applicano i gate di provenienza, risolvono le collisioni e
  uniscono. Mantengono anche il sito web
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) e la CLI pubblicata a
  partire da sorgente privato; i dati pubblici, lo schema e le policy di questo repository sono
  ciò che quelle superfici consumano.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
