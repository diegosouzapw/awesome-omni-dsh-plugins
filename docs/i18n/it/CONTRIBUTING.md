# Contribuire

> 🌐 [English](../../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Italiano**

> **Progetto comunitario non ufficiale. Non affiliato, approvato o sponsorizzato da DeepSeek.**
> I nomi e i marchi DeepSeek appartengono ai rispettivi proprietari.

Grazie per migliorare il catalogo. I contributi danno priorità al creatore: usa prove del
repository originale, preserva l'attribuzione e mantieni ogni plugin revisionabile in modo
indipendente. Il catalogo parte vuoto per progetto; nessuna voce viene accettata senza una
propria pull request revisionata.

## Comincia dal creatore

Una pull request aperta direttamente dal creatore del plugin o dall'organizzazione proprietaria è
sempre preferita. Se il creatore è pronto a contribuire, usa il suo branch e la sua pull request
invece di ricreare il suo lavoro in un branch di curatela o automazione.

La curatela della community è benvenuta quando aiuta un creatore che non ha ancora aperto una
pull request. Non stabilisce proprietà né priorità rispetto a una successiva contribuzione
diretta del creatore.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Un plugin per branch e pull request

Crea un branch dedicato per un unico plugin e apri una singola pull request da quel branch. Il
branch e la pull request devono creare o modificare esattamente un file YAML sotto
`catalog/plugins/`. Non mescolare plugin, pulizia della documentazione, indici generati o
manutenzione non correlata in quel branch o pull request.

L'ID della voce e il nome del file devono essere lo stesso valore in kebab-case minuscolo. I
maintainer revisionano e uniscono ogni pull request di plugin individualmente; un lotto
contenente più plugin non viene diviso né unito parzialmente.

## Risali alla fonte originale

Ogni campo pubblico deve essere ricostruito a partire dal repository originale del creatore, dal
pacchetto, dal manifesto, dal README, dalla licenza o dalla release al commit fissato. Non
copiare il testo, l'assegnazione di categoria, gli screenshot, la classifica, i badge o i
metadati generati di un altro catalogo o aggregatore. Un link trovato in un progetto ombrello, in
un marketplace, in una lista o in un aggregatore è solo una pista, non è una prova né la fonte
del plugin.

Non inviare mai un progetto ombrello, un aggregatore, un marketplace, un catalogo installatore o
una lista come voce di catalogo, anche quando è installabile in modo indipendente. Usalo solo
come pista e risali, per ogni plugin figlio installabile in modo indipendente, al suo vero
creatore e repository originale. Un plugin nel vero monorepo del suo creatore può essere inviato
dal suo subpath esatto, ma deve seguire la policy sulle stelle per i monorepo qui sotto.

## Prove richieste

Fornisci tutto quanto segue nella pull request:

- L'URL pubblico canonico del repository originale e il suo ID di nodo del repository
  immutabile. I maintainer risolvono l'ID del nodo e rifiutano le discrepanze di URL nel gate di
  provenienza separato.
- L'handle pubblico GitHub del creatore e l'URL del profilo pubblico corrispondente. Lo YAML
  memorizza l'handle una sola volta; l'URL del profilo viene derivato come
  `https://github.com/<handle>`.
- Un OID di commit sorgente completo di 40 caratteri e il subpath esatto del plugin, oppure
  `null` per un plugin nella radice del repository.
- Una descrizione in inglese limitata e il suo percorso di evidenza a quel commit fissato.
- Il `kind` dell'artefatto, la categoria primaria e i tag selezionati da
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- L'espressione SPDX completa della licenza a monte, evidenziata al commit fissato.
- Un descrittore di installazione canonico fissato a una versione npm esatta, oppure al
  repository sorgente, al commit completo e al subpath. Il descrittore è dato, mai un comando
  shell.
- Prova dell'integrazione nativa con il DSH e il suo percorso al commit fissato.
- Prove di smoke test esistenti e non sensibili per quel pin esatto dell'artefatto, oppure il
  valore esplicito `not run`. Non installare il plugin né eseguire `preinstall`, `install`,
  `postinstall`, `prepare` o altro codice del ciclo di vita del pacchetto/plugin solo per
  preparare un contributo al catalogo.
- Per un repository dedicato, il conteggio delle stelle verificabile per quell'esatto
  repository, insieme alla fonte pubblica e all'orario della verifica. Per un plugin in
  monorepo, usa la policy di null obbligatoria qui sotto.
- La provenienza pubblica di Discussion o commento quando esiste; altrimenti usa `null`.
- Il valore leggibile da macchina `unofficial: true`.

Se non esiste già uno smoke test qualificante, usa `verification.status: eligible` e
`verification.smokeTest: null`. Usa `verified` solo quando esiste una prova di smoke test
revisionabile per il pin esatto. Nessuno dei due stati è un avallo o una certificazione di
sicurezza.

Non inviare mai credenziali, cookie, indirizzi email privati, codice sorgente non pubblicato o
altri segreti.

## Regole YAML e schema

Crea `catalog/plugins/<plugin-id>.yaml` e validalo rispetto a
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). Lo schema è la fonte di verità
per i nomi dei campi e i valori consentiti; [docs/CATEGORIES.md](../../docs/CATEGORIES.md)
definisce come scegliere l'unico kind dell'artefatto, la categoria primaria, i tag e l'ambito del
repository.

Un descrittore npm deve contenere un nome di pacchetto valido e una versione esatta. Lo schema
pubblico rifiuta valori simili a opzioni e non limitati, ma non reimplementa SemVer o SRI: la
validazione del catalogo deve interpretare la versione, richiedere SemVer esatto e interpretare
qualsiasi valore di integrità come SRI SHA-512 valido. Un descrittore di sorgente è vincolato a
`source.repository`, `source.commit` e `source.subpath` senza duplicare valori mutabili della
sorgente.

Gli installer devono usare array di argomenti, disabilitare l'esecuzione tramite shell e
collocare un terminatore di opzione prima dei valori posizionali forniti dal catalogo, dove il
comando invocato lo supporta. La validazione della submission non deve invocare un installer o
il ciclo di vita di un plugin.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` è un controllo locale, di sola lettura, strutturale e semantico. Interpreta
YAML sicuro, valida lo schema pubblico, interpreta espressioni SPDX, richiede SemVer esatto e
SRI SHA-512 valido, e rifiuta ID duplicati e chiavi canoniche nodo-di-repository-più-subpath. Non
contatta GitHub, non risolve l'identità del repository né ispeziona i percorsi di evidenza al
commit fissato.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Prima che una voce raggiunga `eligible`, i maintainer risolvono separatamente il repository
canonico e l'ID del nodo, vincolano il creatore alla fonte originale e ispezionano la
descrizione dichiarata, la licenza, l'integrazione DSH e la prova di smoke test a
`source.commit`. Un risultato di validazione locale verde non è prova di provenienza o di
origine.

## Stelle del repository

Possono essere registrate solo le stelle verificabilmente appartenenti all'esatto repository
dedicato del plugin. Le stelle di un progetto padre non devono mai essere attribuite a un plugin
memorizzato all'interno di un monorepo più ampio. Una voce di monorepo resta idonea per le
sezioni funzionali del catalogo, ma deve dichiarare:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Una voce dedicata usa `repositoryScope: dedicated`, `starsPolicy: exact-repository` e il
conteggio non negativo delle stelle osservato su quello stesso repository. Leggi
[docs/RANKING.md](../../docs/RANKING.md) prima di inviare dati sulla popolarità.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Precedenza del creatore e contatto rispettoso

Per lo stesso plugin canonico, la precedenza è:

1. Una pull request aperta dal creatore o dall'organizzazione proprietaria.
2. Una pull request della community esplicitamente approvata dal creatore.
3. Una pull request di curatela della community esistente e valida.
4. Una pull request di automazione del catalogo.

Una pull request diretta del creatore prevale su qualsiasi pull request di curatela o
automazione in aperto, indipendentemente da quale sia stata aperta per prima o sia più avanzata.
La pull request del creatore diventa il veicolo di revisione; i maintainer non fanno force-push
sul branch del creatore né trapiantano il suo lavoro nella pull request curata. Se una voce
curata è già stata unita, la cronologia pubblica non viene riscritta. Il creatore può usare una
richiesta di rivendicazione o correzione e poi contribuire direttamente con una pull request di
follow-up.

Una pull request curata dovrebbe usare una singola menzione pubblica e rispettosa `@creatore`
nella sua descrizione, accanto a un link al repository originale, invitando il creatore a
revisionarla o a sostituirla con una pull request diretta. Non ripetere la menzione, non aprire
issue promozionali, non fare cross-post, non inviare messaggi diretti non richiesti né fare
altrimenti spam al creatore.

<!-- creator-first:source-bound-git-identity -->

Le pull request e i commit autorati dal creatore preservano naturalmente il credito al creatore.
I commit curati possono usare l'autoria Git del creatore o un trailer `Co-authored-by` solo con
un'identità vincolata alla fonte e pubblicamente verificabile. Non inventare né indovinare mai
un'email. Quando non è disponibile alcuna identità Git verificata, il curatore autora il commit
e attribuisce credito esplicito `Created by @handle` con il link al repository originale nello
YAML e nella pull request. Un account maintainer o di automazione può essere committer o
co-autore verificato, ma non deve sostituire l'autoria del creatore. Vedi
[docs/CREDIT.md](../../docs/CREDIT.md) per la policy completa.

## Comandi di validazione e disponibilità

La CLI npm è pubblicata come `omni-dsh-plugins@1.0.1`, quindi i comandi qui sotto sono
disponibili oggi tramite `npx`. Usali esattamente come scritti; i contributori non dovrebbero
inventare comandi sostitutivi.

Esegui questi comandi dalla radice del repository:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` esegue solo i controlli locali di YAML, schema, SPDX, SemVer esatto, SRI
SHA-512 e duplicati descritti sopra, e accetta il catalogo intenzionalmente vuoto. Non prova
l'identità remota del repository né l'evidenza della sorgente fissata. Gli altri comandi
verificano la documentazione pubblica obbligatoria e i formulari strutturati di issue di GitHub.
Superare questi comandi localmente non allenta i requisiti di evidenza; i maintainer applicano
comunque ogni gate di release corrispondente prima di unire.

## Gate di revisione, collisioni e merge

I maintainer applicano ogni gate al commit corrente della pull request prima di unire:

1. **Ambito:** un branch dedicato, un file YAML di plugin e nessuna modifica non correlata.
2. **Identità originale:** creatore, repository canonico, ID del nodo, commit completo e
   subpath concordano.
3. **Schema e prove:** YAML, categorie, SPDX, pin di installazione, prova DSH e stato dello
   smoke test sono internamente coerenti senza eseguire codice del ciclo di vita del plugin.
4. **Popolarità:** le stelle dedicate sono verificabili sull'esatto repository, oppure le
   stelle di monorepo sono `null` con `undefined-parent-repository`.
5. **Documentazione e formulari:** la documentazione pubblica, le fence Markdown e i formulari
   strutturati restano validi.
6. **Collisione e deduplicazione:** nessuna voce unita o pull request in aperto rappresenta lo
   stesso plugin canonico.

Nomi o ID diversi non rendono distinti plugin duplicati. Tratta come una collisione lo stesso ID
di nodo di repository e subpath, lo stesso pacchetto canonico, o un altro target di installazione
dimostrabilmente identico. Risolvi alias e pull request concorrenti prima del merge. Una pull
request diretta del creatore vince una collisione contro curatela o automazione; altrimenti i
maintainer selezionano un veicolo di revisione e chiudono o reindirizzano i duplicati invece di
unirli entrambi.

Solo un maintainer unisce un plugin dopo che tutti i gate sono superati. Ogni plugin accettato
viene unito individualmente; validazione, curatela o automazione non implicano un merge
automatico o in blocco.

## Checklist della pull request

- [ ] Ho usato un branch dedicato e questa PR modifica esattamente una voce di plugin.
- [ ] La fonte è il repository originale del creatore, non un progetto ombrello o un
      aggregatore.
- [ ] L'handle/profilo del creatore, il repository, l'ID del nodo, il subpath e il commit
      completo sono evidenziati.
- [ ] Il kind, la categoria e i tag seguono `docs/CATEGORIES.md`.
- [ ] La licenza SPDX e il descrittore di installazione fissato sono evidenziati.
- [ ] L'integrazione nativa con il DSH e il risultato dello smoke test o lo stato `not run`
      sono evidenziati.
- [ ] Non ho eseguito codice del ciclo di vita di plugin o pacchetto per preparare questo
      contributo.
- [ ] Le stelle dedicate sono verificabili, oppure le stelle di monorepo usano la policy di
      null obbligatoria.
- [ ] Ho verificato l'esistenza di una voce già presente e di una pull request in aperto per
      lo stesso plugin canonico.
- [ ] La voce è esplicitamente non ufficiale e non contiene segreti né dati personali privati.

## Policy sulla lingua

La documentazione di lancio e le descrizioni del catalogo sono solo in inglese. Il rollout su 43
locali resta un elemento di backlog post-MVP; non aggiungere documenti di locale vuoti né
traduzioni automatiche in blocco.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
