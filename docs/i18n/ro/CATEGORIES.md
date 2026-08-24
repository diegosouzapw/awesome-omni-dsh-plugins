# Categoriile catalogului

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Română**

Fiecare intrare de catalog are un `kind` de artefact, o categorie de capabilitate primară și zero
sau mai multe tag-uri. Categoria primară determină unde apare intrarea; tag-urile oferă căutare
între categorii fără a duplica intrarea.

## Tipuri de artefact

<!-- catalog-policy:aggregators-never-entries -->

| Valoare | Semnificație | Clasat după stele ca plugin |
|---|---|---:|
| `plugin` | Pachet nativ DSH instalabil | Doar când toate condițiile de clasament sunt îndeplinite |
| `plugin-family` | Repository care conține mai multe pluginuri DSH | Nu; secțiune separată |
| `skin-theme` | Skin de UI sau temă vizuală DSH | Nu; secțiune separată |
| `skill` | Skill de agent cu suport DSH | Nu |
| `preset-profile` | Profil sau preset DSH | Nu |
| `client-interface` | Client desktop, TUI, de editor sau la distanță | Nu |
| `bridge-adapter` | Integrare a unui alt produs în DSH | Nu |
| `ecosystem-project` | Proiect mai amplu care conține o integrare DSH | Nu |

Un repository-umbrelă, agregator, marketplace, catalog de instalare sau listă nu este niciodată o
intrare de catalog, chiar când agregatorul însuși este instalabil. Poate fi folosit doar ca
indiciu. Urmărește fiecare indiciu până la un artefact-copil instalabil independent și rezolvă
creatorul real, repository-ul original, pachetul și subpath-ul sursă ale acelui artefact înainte de
a-l trimite. Un monorepo autentic al unui creator poate fi repository-ul original pentru un
plugin-copil, dar copilul trebuie să folosească exact acel subpath și politica de stele pentru
monorepo.

Câmpul `kind` este discriminatorul canonic de artefact DSH. Nu există un kind separat de
integrare: `plugin` înseamnă deja un pachet nativ DSH, în timp ce `ecosystem-project` înseamnă
deja un proiect mai amplu cu integrare DSH. Aceasta previne perechile contradictorii de
clasificare.

## Categorii de capabilitate primară

| Valoare | Etichetă de afișare |
|---|---|
| `user-interface-dashboards` | Interfață utilizator și dashboard-uri |
| `memory-rag` | Memorie și RAG |
| `search-research` | Căutare și cercetare |
| `coding-developer-tools` | Programare și unelte pentru dezvoltatori |
| `browser-automation` | Browser și automatizare |
| `vision-audio-multimodal` | Vedere, audio și multimodal |
| `sessions-productivity` | Sesiuni și productivitate |
| `security-permissions-approvals` | Securitate, permisiuni și aprobări |
| `diagnostics-observability` | Diagnostice și observabilitate |
| `models-providers-routing` | Modele, furnizori și rutare |
| `messaging-notifications` | Mesagerie și notificări |
| `data-external-services` | Date și servicii externe |
| `entertainment-customization` | Divertisment și personalizare |

Alege categoria care reprezintă cel mai bine funcția principală a pluginului, nu categoria cu cele
mai mari șanse de a crește vizibilitatea.

## Tag-uri de interfață

Tag-urile standard de interfață includ `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` și `theme`. Tag-uri suplimentare de capabilitate în
kebab-case cu litere mici sunt permise când descriu dovezi vizibile în sursa originală fixată.

## Scopul repository-ului

Folosește `dedicated` doar când stelele repository-ului aparțin exact pluginului catalogat.
Folosește `monorepo` când pluginul este un subpath sau un pachet într-un proiect mai amplu. O
intrare de monorepo trebuie să folosească `popularity.starsPolicy: undefined-parent-repository` și
`popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
