# Kategorie katalogu

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Čeština**

Každý záznam katalogu má jeden druh artefaktu (kind), jednu primární kategorii schopnosti a
žádné nebo více tagů. Primární kategorie určuje, kde se záznam objeví; tagy poskytují
vyhledávání napříč kategoriemi bez duplikace záznamu.

## Druhy artefaktů

<!-- catalog-policy:aggregators-never-entries -->

| Hodnota | Význam | Řazení podle hvězdiček jako plugin |
|---|---|---:|
| `plugin` | Instalovatelný nativní balíček DSH | Pouze při splnění všech podmínek řazení |
| `plugin-family` | Repozitář obsahující více pluginů DSH | Ne; samostatná sekce |
| `skin-theme` | Vzhled (skin) nebo vizuální motiv UI DSH | Ne; samostatná sekce |
| `skill` | Dovednost agenta s podporou DSH | Ne |
| `preset-profile` | Profil nebo přednastavení DSH | Ne |
| `client-interface` | Desktopový, TUI, editorský nebo vzdálený klient | Ne |
| `bridge-adapter` | Integrace jiného produktu do DSH | Ne |
| `ecosystem-project` | Širší projekt obsahující integraci s DSH | Ne |

Zastřešující (umbrella) repozitář, agregátor, tržiště, instalační katalog nebo seznam není nikdy
záznamem katalogu, ani když je samotný agregátor instalovatelný. Může být použit pouze jako
stopa. Každou stopu dohledejte k nezávisle instalovatelnému dílčímu artefaktu a před podáním
určete skutečného tvůrce, původní repozitář, balíček a zdrojovou podcestu tohoto artefaktu.
Skutečné monorepo tvůrce může být původním repozitářem dílčího pluginu, ale dílčí plugin musí
používat přesně tuto podcestu a zásady hvězdiček pro monorepo.

Pole `kind` je kanonickým diskriminátorem artefaktů DSH. Neexistuje žádný samostatný druh
integrace: `plugin` již znamená nativní balíček DSH, zatímco `ecosystem-project` již znamená
širší projekt s integrací DSH. To zabraňuje rozporným dvojicím klasifikace.

## Primární kategorie schopností

| Hodnota | Zobrazovaný popisek |
|---|---|
| `user-interface-dashboards` | Uživatelské rozhraní a přehledy |
| `memory-rag` | Paměť a RAG |
| `search-research` | Vyhledávání a výzkum |
| `coding-developer-tools` | Programování a vývojářské nástroje |
| `browser-automation` | Prohlížeč a automatizace |
| `vision-audio-multimodal` | Vidění, zvuk a multimodalita |
| `sessions-productivity` | Relace a produktivita |
| `security-permissions-approvals` | Zabezpečení, oprávnění a schvalování |
| `diagnostics-observability` | Diagnostika a pozorovatelnost |
| `models-providers-routing` | Modely, poskytovatelé a směrování |
| `messaging-notifications` | Zprávy a oznámení |
| `data-external-services` | Data a externí služby |
| `entertainment-customization` | Zábava a přizpůsobení |

Zvolte kategorii, která nejlépe vystihuje hlavní funkci pluginu, nikoli kategorii, která by
nejspíše zvýšila viditelnost.

## Tagy rozhraní

Standardní tagy rozhraní zahrnují `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` a `theme`. Další tagy schopností v malých písmenech
kebab-case jsou povoleny, pokud popisují důkaz viditelný ve fixovaném původním zdroji.

## Rozsah repozitáře

`dedicated` použijte pouze tehdy, pokud hvězdičky repozitáře patří přesně katalogizovanému
pluginu. `monorepo` použijte, pokud je plugin podcestou nebo balíčkem uvnitř širšího projektu.
Záznam z monorepa musí používat `popularity.starsPolicy: undefined-parent-repository` a
`popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
