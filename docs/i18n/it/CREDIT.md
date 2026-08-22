# Credito al creatore e precedenza delle pull request

> 🌐 [English](../../docs/CREDIT.md) · **Italiano**

Il catalogo esiste per rendere scopribile il lavoro DSH indipendente senza sottrarre la
proprietà ai suoi creatori. Le voci pubbliche citano il repository originale e un commit
sorgente immutabile.

## Precedenza per lo stesso plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Una pull request aperta dal creatore del plugin o dall'organizzazione proprietaria.
2. Una pull request della community esplicitamente approvata o co-autorata dal creatore.
3. Una pull request di curatela della community esistente e valida.
4. Una pull request di automazione del catalogo.
5. Un candidato privato senza alcuna pull request pubblica.

Una pull request diretta del creatore è sempre preferita e prevale su qualsiasi pull request
aperta di curatela della community o di automazione per lo stesso plugin canonico,
indipendentemente da quale sia stata aperta per prima o sia più avanzata. La pull request del
creatore diventa il veicolo di revisione; il suo branch non viene mai sovrascritto,
force-pushato o trapiantato nella pull request curata. Se una voce curata è già stata unita, la
cronologia resta intatta e il creatore può rivendicarla o correggerla con una nuova
contribuzione.

## Attribuzione pubblica

Ogni voce del catalogo porta l'handle pubblico GitHub del creatore, il repository originale,
l'ID nodo del repository, il subpath del plugin e il commit fissato completo. Il profilo
pubblico del creatore è derivato dal singolo handle invece di essere memorizzato come una
seconda identità. Il gate di provenienza separato dei maintainer risolve l'ID nodo e rifiuta una
mancata corrispondenza dell'URL del repository. Le descrizioni delle pull request dovrebbero
dire `Created by @handle` e includere i metadati del repository sorgente e del commit sorgente.

Una persona che pubblica o commenta in una Discussion non viene automaticamente trattata come il
creatore. La proprietà deve essere supportata dal proprietario del repository o
dall'organizzazione, dall'autoria del pacchetto, dai metadati del manifesto o dalla cronologia
sorgente esatta fissata.

## Identità Git

<!-- creator-first:source-bound-git-identity -->

L'autoria del commit e l'autoria della pull request sono separate. Una pull request originata
dal creatore mantiene il creatore come autore della pull request, e i suoi commit preservano
naturalmente l'autoria. Un account maintainer o di automazione può apparire come committer o
come co-autore verificato, ma non deve sostituire l'autoria del creatore.

Per un commit curato, usa il creatore come autore Git o aggiungi un trailer `Co-authored-by`
solo quando l'identità esatta è vincolata alla fonte e pubblicamente verificabile, come
un'identità già collegata al commit del creatore nel repository originale. Non indovinare mai
un'email, non fabbricare un indirizzo noreply e non usare un indirizzo privato trovato al di
fuori di una fonte pubblica autorizzata.

Quando un'identità Git verificata non è disponibile, il curatore o l'account di automazione
autora il commit e fornisce invece un credito visibile esplicito: `Created by @handle`, il
profilo pubblico corrispondente e un link al repository originale nella voce e nella pull
request. L'attribuzione YAML visibile è sempre richiesta indipendentemente dalla mappatura
dell'identità Git. Una successiva pull request diretta del creatore sostituisce una pull request
curata aperta invece di ereditarne la cronologia sintetica.

## Menzione rispettosa del creatore

Una pull request curata usa una singola menzione pubblica e rispettosa `@creatore` nella sua
descrizione, accanto al link al repository originale. Può invitare a una revisione o a una
pull request diretta sostitutiva. Non ripetere la menzione, non aprire issue promozionali, non
fare cross-post né inviare messaggi diretti non richiesti.

## Licenza del catalogo rispetto alla licenza a monte

I fatti del catalogo e i metadati editoriali YAML sono dedicati sotto CC0-1.0. Quella dedica non
cambia la licenza del plugin a monte. Il codice, la documentazione, gli screenshot, i loghi e
altro materiale creativo a monte restano soggetti alle loro licenze e proprietari originali.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
