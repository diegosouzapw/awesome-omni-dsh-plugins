# Pamamahala ng Katalogo

> **Hindi opisyal na proyekto ng komunidad. Walang kaugnayan sa, hindi inendorso, at hindi itinataguyod ng DeepSeek.**
> Ang mga pangalan at marka ng DeepSeek ay pag-aari ng kani-kanilang may-ari.

Kung paano pinapamahalaan ang pampublikong katalogo: sino ang nagpapasya kung ano ang
pumapasok, sa anong pagkakasunod-sunod pinaparangalan ang magkakatunggaling ambag, aling mga
pagsusuri ang awtomatikong tumatakbo, at aling mga hatol ang nananatiling pantao. Ang mga
patakarang tinutukoy dito ay nasa [CONTRIBUTING.md](../../CONTRIBUTING.md),
[docs/CREDIT.md](../../docs/CREDIT.md), at [docs/RANKING.md](../../docs/RANKING.md);
inilalarawan ng pahinang ito kung paano sila nagkakaugnay.

## Mga prinsipyo

1. **Unahin ang lumikha.** Umiiral ang katalogo upang madiskubre ang trabaho ng mga
   lumikha, hindi kailanman upang angkinin ito. Para sa parehong canonical na plugin, ang
   direkta na pull request ng lumikha ay papalitan ang anumang bukas na community curation o
   automation pull request — ang buong pagkakasunod-sunod ng prayoridad at mga patakaran sa
   Git identity ay nasa [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Isang plugin, isang nasuring pull request.** Walang batch merge, walang generated bulk
   import sa pampublikong katalogo. Ang bawat entry ay may sariling review.
3. **Ebidensya higit sa tiwala.** Ang bawat pampublikong field ay natutunton sa orihinal na
   repository ng lumikha sa isang nakapirming commit. Ang berdeng automated check ay hindi
   kailanman tinatanggap bilang patunay ng pinagmulan.
4. **Hindi opisyal, palagi.** Walang estado ng katalogo na ipinapakita bilang review,
   sertipikasyon, o pag-endorso ng DeepSeek.

## Paano dumadating ang mga pagbabago sa `main`

Lahat ng pagbabago ay umaabot sa `main` sa pamamagitan ng mga nasuring pull request — walang
direktang push. Ang gumaganang patakaran para sa default branch:

- **Pull request lamang.** Ang mga entry ng katalogo, dokumentasyon, at pagbabago ng schema
  ay lahat pumapasok sa pamamagitan ng PR; ang mga catalog PR ay dapat sumunod sa
  tuntuning one-plugin-per-branch sa [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Linear na kasaysayan.** Ang mga PR ay iniintegrate upang mapanatili ng `main` ang
  linear, auditable na kasaysayan; ang na-merge nang pampublikong kasaysayan ay hindi
  isusulat muli. Kung na-merge ang isang curated entry bago lumitaw ang lumikha, i-claim o
  iwawasto ito ng lumikha sa isang follow-up na ambag sa halip na pagsulat muli ng
  kasaysayan.
- **Paglutas ng review thread.** Ang mga usapan sa review ay nilulutas bago ang merge; ang
  hindi pa nalulutas na feedback ay humaharang sa integration.
- **Merge ng maintainer.** Tanging maintainer lamang ang nagme-merge ng entry ng plugin, at
  pagkatapos lamang na makapasa ang bawat gate sa [CONTRIBUTING.md](../../CONTRIBUTING.md) →
  "Mga review gate, banggaan, at merge" sa kasalukuyang commit ng PR.

## Ang `catalog-validation` check

Ang bawat pull request na tumutukoy sa `catalog/plugins/`, `schemas/`, o mismong workflow ay
pinapatakbo ang `catalog-validation` job (`.github/workflows/validate-catalog.yml`), na
nakapirmi sa inilathalang CLI:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Ano ang vina-validate nito** — lokal na istruktura at semantics lamang:

- Ligtas na pag-parse ng YAML ng bawat entry sa ilalim ng `catalog/plugins/`.
- Pagsunod sa pampublikong schema (tingnan ang [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Pag-parse ng SPDX expression, eksaktong SemVer version, wastong SHA-512 SRI integrity
  value.
- Pagtanggi ng dobleng: walang nauulit na ID ng entry at walang nauulit na canonical
  repository-node-plus-subpath key.
- Ang sinasadyang zero-entry na katalogo ay lumalagpas (`0 entries valid; catalog is empty`).

**Ano ang HINDI nito vina-validate** — at samakatuwid kung ano ang hindi kailanman
pinatutunayan ng berdeng check:

- Remote repository identity: hindi ito nakikipag-ugnayan sa GitHub o naglulutas ng
  repository node ID laban sa URL.
- Ebidensya sa nakapirming commit: ang mga paglalarawan, lisensya, DSH integration, at smoke
  evidence ay hindi kinukuha o sinusuri.
- Pagmamay-ari ng lumikha, bilang ng bituin, o banggaan sa mga bukas na pull request.

Ang mga hatol na iyon ay nabibilang sa hiwalay na provenance gate ng mga maintainer, na
ginagamit bago ang merge at inilarawan sa [CONTRIBUTING.md](../../CONTRIBUTING.md). Ang
lokal na check ay sahig, hindi ang pamantayan.

## Mga estado ng verification

Ang verification ay itinatala bawat entry laban sa eksakto nitong nakapirming commit, gamit
ang mga estado na tinukoy sa pampublikong schema (`eligible`, `verified`, `stale`,
`unavailable`, `archived`, `quarantined`). Ang dalawang positibong estado ay sinasadyang
makitid:

- `eligible` — na-validate ang pampublikong istruktura at native DSH integration.
- `verified` — bilang karagdagan, pumasa ang installation smoke test para sa nakapirming
  source o package; kinakailangan ng schema na umiiral ang talaan ng smoke-test.

Ang alinmang estado — o anumang iba pa — ay hindi pag-endorso, garantiya, o sertipikasyon ng
seguridad. Ang kumpletong semantics, kasama kung paano nakakaapekto ang mga estado sa
ranggo, ay nasa [docs/RANKING.md](../../docs/RANKING.md); ang hugis ng talaan ay nasa
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Mga claim, correction, at removal

Ang mga structured GitHub issue form (`.github/ISSUE_TEMPLATE/`) ang pinamamahalaang daan
para baguhin ang isang entry na hindi ninyo isinumite:

| Form           | Sino ang gumagamit nito                              | Resulta                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Claim**      | Isang lumikha na ang plugin ay ni-curate ng iba | Ang pagmamay-ari ay ibinibigkis sa orihinal na source; maaari nang mag-ambag nang direkta ang lumikha |
| **Correction** | Sinumang nakakakita ng hindi tumpak na pampublikong metadata | Isang nasuring pag-aayos sa apektadong entry             |
| **Removal**    | Isang lumikha na gustong alisin ang kanyang listahan, o isang nag-uulat ng paglabag sa patakaran | Nasuring pag-alis o quarantine ng entry |

Mga tuntuning lumalapat sa tatlong daloy:

- Ang mga claim ng pagmamay-ari ay dapat suportahan ng maberipikang pampublikong ebidensya
  (pagmamay-ari ng repository, pagkakatha ng package, manifest metadata, o nakapirming
  source history) — ang pagkomento sa isang Discussion ay hindi nagtatatag ng pagkakatha
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Ang mga problema sa seguridad ng isang nakalistang plugin ay pupunta muna sa sariling
  maintainer ng plugin na iyon; ang panig ng katalogo ang pagkatapos ay hahawak ng
  correction o quarantine nang hindi inilalathala ang detalye ng exploit
  ([SECURITY.md](../../SECURITY.md)).
- Huwag kailanman magsama ng mga kredensyal, pribadong detalye ng pakikipag-ugnayan, o iba
  pang sekreto sa isang form.

## Mga papel

- **Mga lumikha** ang may-ari ng kanilang mga plugin at ng prayoridad ng kanilang mga
  listahan. Maaari silang mag-ambag nang direkta, aprubahan ang community curation, o
  mag-claim/magwasto/mag-alis ng umiiral nang entry.
- **Mga kontribyutor ng komunidad** ay maaaring mag-curate ng mga entry para sa mga
  lumikha na hindi pa nag-aambag, sa ilalim ng mga tuntunin ng magalang na pakikipag-ugnayan
  at kredito sa [docs/CREDIT.md](../../docs/CREDIT.md). Ang curation ay hindi kailanman
  tataas kaysa sa kalaunang direkta na ambag ng lumikha.
- **Mga maintainer** ay nagsusuri, gumagamit ng provenance gate, naglulutas ng banggaan, at
  nagme-merge. Pinapanatili rin nila ang website
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) at ang inilathalang
  CLI mula sa pribadong source; ang pampublikong data, schema, at mga patakaran ng
  repository na ito ang ginagamit ng mga surface na iyon.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
