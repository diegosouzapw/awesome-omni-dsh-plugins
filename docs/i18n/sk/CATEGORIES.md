# Kategórie katalógu

Každý záznam katalógu má jeden druh artefaktu, jednu primárnu kategóriu schopností a nula alebo
viac značiek. Primárna kategória určuje, kde sa záznam objaví; značky umožňujú vyhľadávanie naprieč
kategóriami bez duplikácie záznamu.

## Druhy artefaktov

<!-- catalog-policy:aggregators-never-entries -->

| Hodnota | Význam | Zaradenie do rebríčka hviezdičiek ako plugin |
|---|---|---:|
| `plugin` | Inštalovateľný natívny DSH balík | Iba keď sú splnené všetky podmienky rebríčka |
| `plugin-family` | Repozitár obsahujúci viacero DSH pluginov | Nie; samostatná sekcia |
| `skin-theme` | DSH UI skin alebo vizuálna téma | Nie; samostatná sekcia |
| `skill` | Zručnosť agenta s podporou DSH | Nie |
| `preset-profile` | DSH profil alebo predvoľba | Nie |
| `client-interface` | Desktopový, TUI, editorový alebo vzdialený klient | Nie |
| `bridge-adapter` | Integrácia iného produktu do DSH | Nie |
| `ecosystem-project` | Širší projekt obsahujúci DSH integráciu | Nie |

Zastrešujúci repozitár, agregátor, trhovisko, inštalačný katalóg ani zoznam nikdy nie je záznamom
katalógu, a to ani vtedy, keď je samotný agregátor inštalovateľný. Možno ho použiť iba ako stopu.
Každú stopu sledujte až k nezávisle inštalovateľnému podradenému artefaktu a pred jeho predložením
dohľadajte skutočného tvorcu, pôvodný repozitár, balík a zdrojovú podcestu daného artefaktu.
Skutočné monorepo tvorcu môže byť pôvodným repozitárom podradeného pluginu, ale podradený plugin
musí použiť tú presnú podcestu a politiku hviezdičiek monorepa.

Pole `kind` je kanonický diskriminátor DSH artefaktov. Neexistuje samostatný druh integrácie:
`plugin` už znamená natívny DSH balík, zatiaľ čo `ecosystem-project` už znamená širší projekt
s DSH integráciou. Tým sa predchádza rozporným dvojiciam zaradenia.

## Primárne kategórie schopností

| Hodnota | Zobrazované označenie |
|---|---|
| `user-interface-dashboards` | User interface and dashboards |
| `memory-rag` | Memory and RAG |
| `search-research` | Search and research |
| `coding-developer-tools` | Coding and developer tools |
| `browser-automation` | Browser and automation |
| `vision-audio-multimodal` | Vision, audio and multimodal |
| `sessions-productivity` | Sessions and productivity |
| `security-permissions-approvals` | Security, permissions and approvals |
| `diagnostics-observability` | Diagnostics and observability |
| `models-providers-routing` | Models, providers and routing |
| `messaging-notifications` | Messaging and notifications |
| `data-external-services` | Data and external services |
| `entertainment-customization` | Entertainment and customization |

Vyberte kategóriu, ktorá najlepšie vystihuje hlavnú funkciu pluginu, nie kategóriu, ktorá by
najpravdepodobnejšie zvýšila viditeľnosť.

## Značky rozhrania

Štandardné značky rozhrania zahŕňajú `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` a `theme`. Ďalšie značky schopností v kebab-case malými
písmenami sú povolené, ak opisujú dôkaz viditeľný v pripnutom pôvodnom zdroji.

## Rozsah repozitára

`dedicated` použite iba vtedy, keď hviezdičky repozitára patria presne katalogizovanému pluginu.
`monorepo` použite, keď je plugin podcestou alebo balíkom v širšom projekte. Záznam v monorepe musí
používať `popularity.starsPolicy: undefined-parent-repository` a `popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
