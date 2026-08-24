# Categorie del catalogo

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Italiano**

Ogni voce del catalogo ha un tipo di artefatto, una categoria di capacità primaria e zero o più
tag. La categoria primaria determina dove appare la voce; i tag offrono una ricerca
cross-categoria senza duplicare la voce.

## Tipi di artefatto

<!-- catalog-policy:aggregators-never-entries -->

| Valore | Significato | Classificato a stelle come plugin |
|---|---|---:|
| `plugin` | Bundle DSH nativo installabile | Solo quando ogni condizione di classifica è soddisfatta |
| `plugin-family` | Repository contenente più plugin DSH | No; sezione separata |
| `skin-theme` | Skin UI o tema visivo DSH | No; sezione separata |
| `skill` | Skill dell'agente con supporto DSH | No |
| `preset-profile` | Profilo o preset DSH | No |
| `client-interface` | Client desktop, TUI, editor o remoto | No |
| `bridge-adapter` | Integrazione da un altro prodotto verso DSH | No |
| `ecosystem-project` | Progetto più ampio contenente un'integrazione DSH | No |

Un repository ombrello, un aggregatore, un marketplace, un catalogo installatore o una lista non
è mai una voce di catalogo, anche quando l'aggregatore stesso è installabile. Può essere usato
solo come pista. Segui ogni pista fino a un artefatto figlio installabile in modo indipendente e
risali al vero creatore, repository originale, pacchetto e subpath sorgente di quell'artefatto
prima di inviarlo. Un genuino monorepo del creatore può essere il repository originale per un
plugin figlio, ma il figlio deve usare quell'esatto subpath e la policy sulle stelle di
monorepo.

Il campo `kind` è il discriminatore canonico dell'artefatto DSH. Non esiste un tipo di
integrazione separato: `plugin` significa già un bundle DSH nativo, mentre `ecosystem-project`
significa già un progetto più ampio con integrazione DSH. Questo previene coppie di
classificazione contraddittorie.

## Categorie di capacità primaria

| Valore | Etichetta visualizzata |
|---|---|
| `user-interface-dashboards` | Interfaccia utente e dashboard |
| `memory-rag` | Memoria e RAG |
| `search-research` | Ricerca e ricerca approfondita |
| `coding-developer-tools` | Coding e strumenti per sviluppatori |
| `browser-automation` | Browser e automazione |
| `vision-audio-multimodal` | Visione, audio e multimodale |
| `sessions-productivity` | Sessioni e produttività |
| `security-permissions-approvals` | Sicurezza, permessi e approvazioni |
| `diagnostics-observability` | Diagnostica e osservabilità |
| `models-providers-routing` | Modelli, provider e routing |
| `messaging-notifications` | Messaggistica e notifiche |
| `data-external-services` | Dati e servizi esterni |
| `entertainment-customization` | Intrattenimento e personalizzazione |

Scegli la categoria che meglio rappresenta il compito primario del plugin, non la categoria più
probabile ad aumentarne la visibilità.

## Tag di interfaccia

I tag di interfaccia standard includono `web-ui`, `sidebar`, `settings`, `tui`, `cli`,
`desktop`, `mobile`, `remote`, `editor`, `headless` e `theme`. Sono consentiti tag di capacità
aggiuntivi in kebab-case minuscolo quando descrivono prove visibili nella sorgente originale
fissata.

## Ambito del repository

Usa `dedicated` solo quando le stelle del repository appartengono all'esatto plugin catalogato.
Usa `monorepo` quando il plugin è un subpath o un pacchetto all'interno di un progetto più
ampio. Una voce di monorepo deve usare `popularity.starsPolicy: undefined-parent-repository` e
`popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
