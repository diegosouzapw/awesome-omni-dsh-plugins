# Pag-aambag

> 🌐 [English](../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Filipino**

> **Hindi opisyal na proyekto ng komunidad. Walang kaugnayan sa, hindi inendorso, at hindi itinataguyod ng DeepSeek.**
> Ang mga pangalan at marka ng DeepSeek ay pag-aari ng kani-kanilang may-ari.

Salamat sa pagpapabuti ng katalogo. Ang mga ambag ay unang inuuna ang lumikha: gumamit ng
ebidensya mula sa orihinal na repository, panatilihin ang attribution, at panatilihing
independiyenteng masusuri ang bawat plugin. Sinasadyang nagsisimulang walang laman ang
katalogo; walang entry na tinatanggap nang walang sariling nasuring pull request.

## Magsimula sa lumikha

Palaging mas gustong ang pull request na binuksan nang direkta ng lumikha ng plugin o ng
organisasyong may-ari. Kung handa nang mag-ambag ang lumikha, gamitin ang kanilang branch at
pull request sa halip na muling likhain ang kanilang trabaho sa isang curator o automation
branch.

Malugod na tinatanggap ang community curation kapag nakakatulong ito sa isang lumikha na hindi
pa nagbubukas ng pull request. Hindi nito itinatatag ang pagmamay-ari o prayoridad kaysa sa
isang kalaunang direkta na ambag ng lumikha.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Isang plugin bawat branch at pull request

Lumikha ng nakalaang branch para sa isang plugin at magbukas ng isang pull request mula sa
branch na iyon. Ang branch at pull request ay dapat lumikha o magbago ng eksaktong isang YAML
file sa ilalim ng `catalog/plugins/`. Huwag pagsamahin ang ibang plugin, paglilinis ng
dokumentasyon, mga generated index, o hindi kaugnay na maintenance sa branch o pull request na
iyon.

Ang ID ng entry at ang filename ay dapat magkaparehong halagang lowercase kebab-case.
Indibiduwal na sinusuri at mineme-merge ng mga maintainer ang bawat pull request ng plugin;
ang isang batch na naglalaman ng maraming plugin ay hindi hinahati o bahagyang mineme-merge.

## Lutasin ang orihinal na source

Ang bawat pampublikong field ay dapat muling itayo mula sa orihinal na repository ng lumikha,
package, manifest, README, lisensya, o release sa nakapirming commit. Huwag kopyahin ang
prosa, pagtatalaga ng kategorya, screenshot, ranggo, badge, o generated metadata ng ibang
katalogo o aggregator. Ang link na natagpuan sa isang umbrella project, marketplace, listahan,
o aggregator ay bakas lamang — hindi ebidensya at hindi ang source ng plugin.

Huwag kailanman magsumite ng umbrella, aggregator, marketplace, installer catalog, o listahan
bilang entry ng katalogo, kahit na independiyente itong mai-install. Gamitin lamang ito bilang
bakas at lutasin ang bawat independiyenteng mai-install na child plugin patungo sa totoong
lumikha at orihinal na repository nito. Ang isang plugin sa loob ng totoong monorepo ng
lumikha ay maaaring isumite mula sa eksakto nitong subpath, ngunit dapat itong sumunod sa
patakaran ng mga bituin ng monorepo sa ibaba.

## Kinakailangang ebidensya

Ibigay ang lahat ng mga sumusunod sa pull request:

- Ang canonical na pampublikong URL ng orihinal na repository at ang hindi nagbabago nitong
  repository node ID. Lulutasin ng mga maintainer ang node ID at tatanggihan ang mga hindi
  tugmang URL sa hiwalay na provenance gate.
- Ang pampublikong GitHub handle ng lumikha at ang tumutugmang pampublikong profile URL.
  Isang beses lamang itinatabi ng YAML ang handle; ang profile URL ay hinango bilang
  `https://github.com/<handle>`.
- Isang buong 40-character source commit OID at ang eksaktong subpath ng plugin, o `null`
  para sa isang plugin sa root ng repository.
- Isang may-hanggang paglalarawan sa Ingles at ang evidence path nito sa nakapirming commit na
  iyon.
- Ang `kind` ng artifact, pangunahing kategorya, at mga tag na napili mula sa
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Ang kumpletong upstream SPDX license expression na may ebidensya sa nakapirming commit.
- Isang canonical install descriptor na nakapirmi sa eksaktong npm version, o sa source
  repository, buong commit, at subpath. Ang descriptor ay data, hindi kailanman isang shell
  command.
- Ebidensya ng native DSH integration at ang path nito sa nakapirming commit.
- Umiiral at hindi sensitibong smoke evidence para sa eksaktong artifact pin na iyon, o ang
  malinaw na halagang `not run`. Huwag i-install ang plugin o patakbuhin ang `preinstall`,
  `install`, `postinstall`, `prepare`, o iba pang package/plugin lifecycle code para lamang
  maghanda ng ambag sa katalogo.
- Para sa isang dedicated na repository, ang maberipikang bilang ng bituin para sa eksaktong
  repository na iyon, kasama ang pampublikong source at oras ng pagsusuri. Para sa isang
  monorepo na plugin, gamitin ang kinakailangang null policy sa ibaba.
- Pampublikong Discussion o comment provenance kapag umiiral; kung hindi, gamitin ang `null`.
- Ang machine-readable na halagang `unofficial: true`.

Kung wala pang kwalipikadong smoke test, gamitin ang `verification.status: eligible` at
`verification.smokeTest: null`. Gamitin ang `verified` lamang kapag umiiral ang nasusuring
smoke evidence para sa eksaktong pin. Ang alinmang estado ay hindi isang pag-endorso o
sertipikasyon ng seguridad.

Huwag kailanman magsumite ng mga kredensyal, cookie, pribadong email address, hindi pa
inilalathalang source, o iba pang sekreto.

## Mga tuntunin ng YAML at schema

Lumikha ng `catalog/plugins/<plugin-id>.yaml` at i-validate ito laban sa
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). Ang `id` ay dapat kapareho
ng basename ng file at dapat magsimula sa inyong namespace: ang inyong `creator.github` handle
na lowercase (ang anumang sunud-sunod na character sa labas ng `[a-z0-9]` ay magiging isang
`-`) na sinusundan ng `-`, halimbawa `some-creator-my-plugin` para sa handle na
`Some-Creator`. Ipinapatupad ng catalog validation ang pareho. Ang schema ang pinagmumulan ng katotohanan para sa
mga pangalan ng field at mga pinahihintulutang halaga; tinutukoy ng
[docs/CATEGORIES.md](../../docs/CATEGORIES.md) kung paano piliin ang iisang uri ng artifact,
pangunahing kategorya, mga tag, at saklaw ng repository.

Ang npm descriptor ay dapat naglalaman ng wastong pangalan ng package at eksaktong bersyon.
Tinatanggihan ng pampublikong schema ang mga option-like at unbounded na halaga, ngunit hindi
nito muling ipinapatupad ang SemVer o SRI: dapat i-parse ng catalog validation ang bersyon,
mangailangan ng eksaktong SemVer, at i-parse ang anumang integrity value bilang wastong
SHA-512 SRI. Ang source descriptor ay nakabigkis sa `source.repository`, `source.commit`, at
`source.subpath` nang hindi dinodoble ang mga mutable na halaga ng source.

Ang mga installer ay dapat gumamit ng argument array, i-disable ang shell execution, at
maglagay ng option terminator bago ang mga positional value na ibinigay ng katalogo kapag
sinusuportahan ito ng tinatawag na command. Hindi dapat tumawag ng installer o plugin
lifecycle ang submission validation.

<!-- catalog-validation:local-structure-and-semantics-only -->

Ang `catalog validate` ay isang lokal, read-only na pagsusuri ng istruktura at semantika.
Nagpa-parse ito ng ligtas na YAML, nagva-validate ng pampublikong schema, nagpa-parse ng mga
SPDX expression, nangangailangan ng eksaktong SemVer at wastong SHA-512 SRI, at tumatanggi ng
mga dobleng ID at canonical repository-node-plus-subpath key. Hindi ito makikipag-ugnayan sa
GitHub, maglulutas ng pagkakakilanlan ng repository, o susuriin ang mga evidence path sa
nakapirming commit.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Bago maabot ng isang entry ang `eligible`, hiwalay na lulutasin ng mga maintainer ang
canonical na repository at node ID, ibibigkis ang lumikha sa orihinal na source, at susuriin
ang inihayag na paglalarawan, lisensya, DSH integration, at smoke evidence sa
`source.commit`. Ang berdeng lokal na resulta ng validation ay hindi patunay ng provenance o
pinagmulan.

## Mga bituin ng repository

Tanging ang mga bituing napapatunayang pag-aari ng eksaktong dedicated na repository ng plugin
ang maaaring itala. Hindi kailanman dapat iatribwir sa isang plugin na nakaimbak sa loob ng
mas malawak na monorepo ang mga bituin ng parent project. Ang isang monorepo entry ay
nananatiling kwalipikado para sa mga functional section ng katalogo, ngunit dapat magdeklara:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Ang dedicated entry ay gumagamit ng `repositoryScope: dedicated`,
`starsPolicy: exact-repository`, at ang non-negative na bilang ng bituing naobserbahan sa
parehong repository na iyon. Basahin ang [docs/RANKING.md](../../docs/RANKING.md) bago
magsumite ng popularity data.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Prayoridad ng lumikha at magalang na pakikipag-ugnayan

Para sa parehong canonical na plugin, ang prayoridad ay:

1. Ang pull request na binuksan ng lumikha o ng organisasyong may-ari.
2. Ang community pull request na malinaw na inaprubahan ng lumikha.
3. Ang umiiral at wastong community curation pull request.
4. Ang catalog automation pull request.

Ang direkta na pull request ng lumikha ay papalitan ang anumang bukas na curation o automation
pull request, alinman ang nagbukas nang mas mauna o mas malayo na ang narating. Ang pull
request ng lumikha ang magiging sasakyan ng review; hindi magfo-force-push ang mga maintainer
sa branch ng lumikha o ililipat ang kanilang trabaho sa curated pull request. Kung na-merge
na ang isang curated entry, hindi isusulat muli ang pampublikong kasaysayan. Maaaring gumamit
ang lumikha ng claim o correction request at pagkatapos ay mag-ambag nang direkta ng follow-up
na pull request.

Ang curated pull request ay dapat gumamit ng isang magalang na pampublikong `@creator` mention
sa paglalarawan nito, sa tabi ng link sa orihinal na repository, na inaanyayahan ang lumikha
na suriin o palitan ito ng direkta na pull request. Huwag ulitin ang mention, magbukas ng mga
promotional issue, mag-cross-post, magpadala ng mga hindi hinihintay na direct message, o
kung hindi man ay i-spam ang lumikha.

<!-- creator-first:source-bound-git-identity -->

Ang mga pull request at commit na sinulat ng lumikha ay natural na nagpapanatili ng kredito ng
lumikha. Ang mga curated commit ay maaaring gumamit ng Git authorship ng lumikha o
`Co-authored-by` trailer lamang kapag ang pagkakakilanlan ay source-bound at pampublikong
maberipika. Huwag kailanman mag-imbento o humula ng email. Kapag walang available na
naberipikang Git identity, ang curator ang mag-uulat ng commit at magbibigay ng malinaw na
`Created by @handle` na kredito kasama ang link sa orihinal na repository sa YAML at pull
request. Ang maintainer o automation account ay maaaring maging committer o naberipikang
co-author, ngunit hindi dapat palitan ang authorship ng lumikha. Tingnan ang
[docs/CREDIT.md](../../docs/CREDIT.md) para sa kumpletong patakaran.

## Mga command ng validation at availability

Ang npm CLI ay inilathala bilang `omni-dsh-plugins@1.0.1`, kaya ang mga command sa ibaba ay
available na ngayon sa pamamagitan ng `npx`. Gamitin ang mga ito nang eksakto tulad ng
nakasulat; hindi dapat mag-imbento ng kapalit na command ang mga kontribyutor.

Patakbuhin ang mga command na ito mula sa root ng repository:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

Ang `catalog validate` ay nagsasagawa lamang ng mga lokal na YAML, schema, SPDX, eksaktong
SemVer, SHA-512 SRI, at duplicate check na inilarawan sa itaas, at tinatanggap ang sinasadyang
zero-entry na katalogo. Hindi nito pinatutunayan ang remote repository identity o ang
nakapirming source evidence. Ang iba pang command ay sumusuri ng kinakailangang pampublikong
dokumentasyon at structured GitHub issue form. Ang pagpasa ng mga command na ito nang lokal ay
hindi nagpapahina sa mga kinakailangan sa ebidensya; ginagamit pa rin ng mga maintainer ang
bawat kaugnay na release gate bago ang merge.

## Mga review gate, banggaan, at merge

Ginagamit ng mga maintainer ang bawat gate sa kasalukuyang commit ng pull request bago ang
merge:

1. **Saklaw:** isang nakalaang branch, isang plugin YAML file, at walang hindi kaugnay na mga
   pagbabago.
2. **Orihinal na pagkakakilanlan:** magkakatugma ang lumikha, canonical na repository, node
   ID, buong commit, at subpath.
3. **Schema at ebidensya:** ang YAML, mga kategorya, SPDX, install pin, DSH evidence, at
   smoke status ay internally consistent nang hindi pinapatakbo ang plugin lifecycle code.
4. **Popularidad:** ang dedicated na mga bituin ay maberipika sa eksaktong repository, o ang
   mga bituin ng monorepo ay `null` na may `undefined-parent-repository`.
5. **Dokumentasyon at form:** mananatiling wasto ang pampublikong docs, Markdown fence, at
   structured form.
6. **Banggaan at deduplication:** walang na-merge na entry o bukas na pull request na
   kumakatawan sa parehong canonical na plugin.

Ang magkakaibang pangalan o ID ay hindi gumagawa sa mga dobleng plugin na magkakaiba. Ituring
na banggaan ang parehong repository node ID at subpath, ang parehong canonical package, o
ibang mapatutunayang magkaparehong install target. Lutasin ang mga alias at magkakatunggaling
pull request bago ang merge. Ang direkta na pull request ng lumikha ang mananalo sa banggaan
laban sa curation o automation; kung hindi, pipiliin ng mga maintainer ang isang sasakyan ng
review at isasara o ireredirect ang mga dobleng sa halip na i-merge ang pareho.

Tanging maintainer lamang ang nagme-merge ng plugin pagkatapos lumagpas ang lahat ng gate.
Indibiduwal na mineme-merge ang bawat tinanggap na plugin; ang validation, curation, o
automation ay hindi nangangahulugang awtomatiko o batch na merge.

## Checklist ng pull request

- [ ] Gumamit ako ng isang nakalaang branch at eksaktong isang plugin entry ang binabago ng PR na ito.
- [ ] Ang source ay ang orihinal na repository ng lumikha, hindi isang umbrella o aggregator.
- [ ] May ebidensya ang creator handle/profile, repository, node ID, subpath, at buong commit.
- [ ] Ang kind, kategorya, at mga tag ay sumusunod sa `docs/CATEGORIES.md`.
- [ ] May ebidensya ang SPDX license at ang nakapirming install descriptor.
- [ ] May ebidensya ang native DSH integration at ang smoke result o `not run` status.
- [ ] Hindi ko pinatakbo ang plugin o package lifecycle code para ihanda ang ambag na ito.
- [ ] Maberipika ang dedicated na mga bituin, o gumagamit ang monorepo na mga bituin ng kinakailangang null policy.
- [ ] Sinuri ko kung may umiiral nang entry at bukas na pull request para sa parehong canonical na plugin.
- [ ] Ang entry ay malinaw na hindi opisyal at walang mga sekreto o pribadong personal na datos.

## Patakaran sa wika

Ang dokumentasyon ng launch at mga paglalarawan ng katalogo ay sa Ingles lamang. Ang rollout
sa 43 locale ay nananatiling post-MVP backlog item; huwag magdagdag ng mga walang-lamang
locale document o awtomatikong maramihang pagsasalin.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
