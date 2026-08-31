# कैटलॉग एंट्री स्कीमा संदर्भ

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **हिन्दी**

> **गैर-आधिकारिक सामुदायिक परियोजना। DeepSeek से संबद्ध, अनुमोदित या प्रायोजित नहीं है।**
> DeepSeek नाम और चिह्न अपने संबंधित स्वामी के हैं।

यह [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) के लिए फ़ील्ड-दर-फ़ील्ड संदर्भ है — वह
सार्वजनिक JSON स्कीमा (draft 2020-12) जिसे `catalog/plugins/` के अंतर्गत हर फ़ाइल को संतुष्ट करना होता है। स्कीमा
फ़ाइल स्वयं सत्य का स्रोत है; जब यह पेज और स्कीमा असहमत हों, तो स्कीमा मान्य होती है।

सत्यापन की दो परतें लागू होती हैं। सार्वजनिक स्कीमा सीमित *सुरक्षित आकार* लागू करती है (पैटर्न और लंबाई जो
विकल्प-जैसे या असीमित मानों को अस्वीकार करते हैं)। इसके ऊपर, `catalog validate` अनिवार्य सिमेंटिक पार्सर लागू करता है:
वर्ज़न के लिए सटीक SemVer, इंटीग्रिटी मानों के लिए SHA-512 SRI, लाइसेंस के लिए SPDX एक्सप्रेशन पार्सिंग, और डुप्लिकेट-key
अस्वीकृति। कोई मान स्कीमा पैटर्न से मेल खा सकता है और फिर भी सिमेंटिक रूप से अस्वीकृत हो सकता है।

शीर्ष-स्तरीय नियम: प्रविष्टि एक ही YAML ऑब्जेक्ट है, `additionalProperties: false`
(अज्ञात फ़ील्ड अस्वीकार किए जाते हैं), और नीचे दिए गए सभी फ़ील्ड आवश्यक हैं, सिवाय `media` के —
एकमात्र वैकल्पिक फ़ील्ड।

## टॉप-लेवल फ़ील्ड

| फ़ील्ड             | प्रकार    | आवश्यक | सारांश                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   हां    | ठीक `1` होना चाहिए                                           |
| `id`              | string  |   हां    | लोअरकेस kebab-case एंट्री ID; फ़ाइलनाम से मेल खाना चाहिए        |
| `name`            | string  |   हां    | प्रदर्शन नाम, 1–120 वर्ण                                |
| `description`     | object  |   हां    | क्यूरेटेड अंग्रेज़ी सारांश और उसका प्रमाण पथ                |
| `unofficial`      | const   |   हां    | ठीक `true` होना चाहिए                                        |
| `kind`            | enum    |   हां    | कैनोनिकल आर्टिफ़ैक्ट डिस्क्रिमिनेटर                              |
| `primaryCategory` | enum    |   हां    | एकल प्राथमिक क्षमता श्रेणी                            |
| `tags`            | array   |   हां    | अद्वितीय लोअरकेस kebab-case टैग (खाली हो सकती है)               |
| `source`          | object  |   हां    | मूल रिपॉज़िटरी, नोड ID, सबपाथ और पिन की गई कमिट       |
| `creator`         | object  |   हां    | निर्माता का सार्वजनिक GitHub हैंडल                              |
| `package`         | object  |   हां    | कैनोनिकल इंस्टॉल डिस्क्रिप्टर (npm **या** source)              |
| `dsh`             | object  |   हां    | DSH प्रोफाइल और नेटिव-इंटीग्रेशन प्रमाण पथ             |
| `repositoryScope` | enum    |   हां    | `dedicated` या `monorepo`                                     |
| `popularity`      | object  |   हां    | स्टार्स नीति और स्टार गिनती (scope पर निर्भर)            |
| `license`         | object  |   हां    | अपस्ट्रीम SPDX लाइसेंस एक्सप्रेशन                    |
| `verification`    | object  |   हां    | सत्यापन स्थिति, जांच का समय, पहचान और स्मोक टेस्ट      |
| `provenance`      | object  |   हां    | सार्वजनिक Discussion/comment URL या `null`                      |
| `media`           | array   |    नहीं    | अधिकतम 6 स्क्रीनशॉट/वीडियो, हर URL `source.commit` पर पिन |

### `schemaVersion`

स्थिर (constant) `1`। सार्वजनिक स्कीमा वर्ज़न 1 की पहचान करता है; कोई भी अन्य मान अमान्य है।

### `id`

ऐसा string जो `^[a-z0-9]+(?:-[a-z0-9]+)*$` से मेल खाता है — लोअरकेस kebab-case, बिना आगे/पीछे या डबल हाइफ़न के।
[CONTRIBUTING.md](../../CONTRIBUTING.md) के अनुसार, एंट्री फ़ाइल का नाम `catalog/plugins/<id>.yaml` जैसा और उतना ही
मान वाला होना चाहिए; वैलिडेटर बेमेल को अस्वीकार करता है (`id-filename-mismatch`)। ID की शुरुआत निर्माता के नेमस्पेस से
भी होनी चाहिए: `creator.github` हैंडल लोअरकेस में, जिसमें `[a-z0-9]` से बाहर के हर क्रम को एक अकेले `-` में संकुचित
किया गया हो, उसके बाद `-` (`id-creator-prefix`)।

### `name`

फ्री-फ़ॉर्म प्रदर्शन नाम, `minLength: 1`, `maxLength: 120`।

### `description`

ठीक दो आवश्यक प्रॉपर्टी वाली object (कोई अन्य अनुमत नहीं):

| प्रॉपर्टी       | प्रकार   | नियम                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | अंग्रेज़ी सारांश, 20–320 वर्ण                                    |
| `evidencePath` | string | सापेक्ष रिपो पथ पैटर्न; बिना आगे `/`, बिना बैकस्लैश, बिना `.`/`..` सेगमेंट के |

अंग्रेज़ी सारांश को `evidencePath` पर मौजूद फ़ाइल से — जैसा वह `source.commit` पर मौजूद है — क्यूरेट किया जाना चाहिए, न
कि किसी अन्य कैटलॉग से कॉपी किया जाना चाहिए।

### `unofficial`

स्थिर `true`। यह मशीन-पठनीय मार्कर है कि लिस्टिंग गैर-आधिकारिक है।

### `kind`

**एकमात्र** आर्टिफ़ैक्ट-प्रकार डिस्क्रिमिनेटर (कोई दूसरा इंटीग्रेशन-kind फ़ील्ड मौजूद नहीं है)। इनमें से एक:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

अर्थ और रैंकिंग परिणाम [docs/CATEGORIES.md](../../docs/CATEGORIES.md) में परिभाषित हैं।

### `primaryCategory`

चौदह क्षमता श्रेणियों में से एक:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

प्रदर्शन लेबल और चयन मार्गदर्शन [docs/CATEGORIES.md](../../docs/CATEGORIES.md) में हैं।

### `tags`

अद्वितीय strings की array, जिनमें से प्रत्येक `^[a-z0-9]+(?:-[a-z0-9]+)*$` से मेल खाता है (लोअरकेस kebab-case)।
स्कीमा द्वारा कोई न्यूनतम गिनती लागू नहीं की जाती।

### `source`

ठीक चार आवश्यक प्रॉपर्टी वाली object:

| प्रॉपर्टी           | प्रकार           | नियम                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>` URL; owner GitHub username नियमों का पालन करता है, repo नाम 1–100 वर्ण, `.`/`..` नहीं हो सकता या `.git` पर समाप्त नहीं हो सकता |
| `repositoryNodeId` | string         | अपरिवर्तनीय GitHub रिपॉज़िटरी नोड ID, गैर-रिक्त                         |
| `subpath`          | string या null | रिपॉज़िटरी के अंदर प्लगइन का सबपाथ (`evidencePath` जैसा ही सुरक्षित सापेक्ष-पथ पैटर्न), या रिपॉज़िटरी-रूट प्लगइन के लिए `null` |
| `commit`           | string         | पूरा 40-वर्ण हेक्साडेसिमल commit OID                               |

कैटलॉग सत्यापन को `repositoryNodeId` हल करना और रिपॉज़िटरी URL बेमेल को अस्वीकार करना होता है — वह समाधान एक
मेंटेनर-साइड गेट है, स्थानीय संरचनात्मक जांच का हिस्सा नहीं।

### `creator`

एक आवश्यक प्रॉपर्टी वाली object:

| प्रॉपर्टी | प्रकार   | नियम                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | GitHub username (1–39 वर्ण, GitHub हैंडल नियम) |

सार्वजनिक प्रोफ़ाइल URL हमेशा `https://github.com/<handle>` के रूप में व्युत्पन्न (derive) होती है; कोई दूसरा प्रोफ़ाइल
फ़ील्ड संग्रहीत नहीं होता, इसलिए दोनों कभी अलग नहीं हो सकते।

### `package`

कैनोनिकल इंस्टॉल डिस्क्रिप्टर। यह डेटा है, कभी शेल कमांड नहीं, और ठीक दो आकारों में से एक लेता है (`oneOf`):

**npm package** — आवश्यक `ecosystem`, `name`, `version`; वैकल्पिक `integrity`:

| प्रॉपर्टी    | प्रकार  | नियम                                                                      |
| ----------- | ----- | --------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | npm package नाम का आकार (वैकल्पिक रूप से scoped), अधिकतम 214 वर्ण                 |
| `version`   | string | सटीक `x.y.z` वर्ज़न आकार (वैकल्पिक prerelease/build); ranges अस्वीकृत। सिमेंटिक परत को इसके अतिरिक्त एक पार्स-योग्य, सटीक SemVer की आवश्यकता है |
| `integrity` | string | वैकल्पिक `sha512-…` SRI आकार, 8–256 वर्ण। सिमेंटिक परत को इसे मान्य SHA-512 SRI के रूप में पार्स करना चाहिए |

**source install** — केवल `ecosystem` आवश्यक:

| प्रॉपर्टी    | प्रकार  | नियम    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

एक source डिस्क्रिप्टर जानबूझकर और कुछ भी संग्रहीत नहीं करता: रिपॉज़िटरी, commit और subpath `source` से व्युत्पन्न होते
हैं, इसलिए परिवर्तनशील मान कभी दोहराए नहीं जाते।

### `dsh`

नेटिव DSH इंटीग्रेशन प्रमाण:

| प्रॉपर्टी       | प्रकार   | नियम                                                          |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | कम से कम एक अद्वितीय प्रोफ़ाइल नाम जो `^[A-Za-z0-9][A-Za-z0-9._-]*$` से मेल खाता हो |
| `evidencePath` | string | `source.commit` पर DSH इंटीग्रेशन प्रमाण का सुरक्षित सापेक्ष पथ |

### `repositoryScope`

या तो `dedicated` (रिपॉज़िटरी के स्टार्स इसी सटीक प्लगइन के हैं) या `monorepo` (प्लगइन किसी व्यापक प्रोजेक्ट के अंदर
एक subpath या package है)। यह मान नीचे दिए गए सशर्त popularity नियमों को संचालित करता है।

### `popularity`

| प्रॉपर्टी     | प्रकार            | नियम                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` या `undefined-parent-repository`  |
| `stars`      | integer या null | गैर-ऋणात्मक integer, या `null`                      |

सशर्त नियम (स्कीमा के `allOf` ब्लॉक द्वारा लागू):

- `repositoryScope: monorepo` **बाध्य करता है** `starsPolicy: undefined-parent-repository` और
  `stars: null` को। पेरेंट-प्रोजेक्ट के स्टार्स कभी किसी monorepo प्लगइन को नहीं दिए जाते।
- `repositoryScope: dedicated` **बाध्य करता है** `starsPolicy: exact-repository` और एक integer
  `stars >= 0` को।

ये मान रैंकिंग प्रेडिकेट को कैसे प्रभावित करते हैं, इसके लिए [docs/RANKING.md](../../docs/RANKING.md) देखें।

### `license`

| प्रॉपर्टी | प्रकार   | नियम                                                          |
| -------- | ------ | -------------------------------------------------------------- |
| `spdx`   | string | SPDX एक्सप्रेशन आकार, 2–256 वर्ण, बिना आगे हाइफ़न के          |

स्कीमा केवल एक सुरक्षित कैरेक्टर आकार लागू करती है; कैटलॉग सत्यापन को मान को एक असली SPDX एक्सप्रेशन पार्सर से पार्स
और सामान्यीकृत करना होता है। पिन की गई कमिट पर साक्ष्यित पूरा अपस्ट्रीम एक्सप्रेशन रिकॉर्ड करें (उदाहरण के लिए
`Apache-2.0` या `MIT OR GPL-3.0-only`)।

### `verification`

सत्यापन `source.commit` पर लागू होता है। चार आवश्यक प्रॉपर्टी वाली object:

| प्रॉपर्टी             | प्रकार           | नियम                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | जांच का `date-time` फ़ॉर्मैट किया गया टाइमस्टैम्प           |
| `repositoryIdentity` | const          | `resolved` होना चाहिए                                     |
| `smokeTest`          | object या null | स्मोक-टेस्ट रिकॉर्ड, या जब कोई योग्य टेस्ट मौजूद न हो तब `null` |

जब मौजूद हो, `smokeTest` को इसकी आवश्यकता होती है:

| प्रॉपर्टी        | प्रकार   | नियम                                                             |
| --------------- | ------ | ----------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — बिना परिवर्तनशील मानों को दोहराए `package` या पिन किए गए source को संदर्भित करता है |
| `check`         | object | आवश्यक `name` (package-name आकार) और `version` (सटीक वर्ज़न आकार) |
| `result`        | const  | `passed` — असफल स्मोक टेस्ट को स्मोक टेस्ट के रूप में रिकॉर्ड नहीं किया जाता    |

सशर्त नियम: `status: verified` को एक non-null `smokeTest` object की **आवश्यकता होती है**। समीक्षा योग्य स्मोक प्रमाण
के बिना एंट्री `status: eligible` और `smokeTest: null` का उपयोग करती हैं। कोई भी status समर्थन या सुरक्षा प्रमाणन नहीं
है — देखें [docs/RANKING.md](../../docs/RANKING.md)।

### `provenance`

सार्वजनिक प्रोवेनेंस लिंक, प्रत्येक एक URI या `null`:

| प्रॉपर्टी     | प्रकार          | नियम                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string या null | सार्वजनिक Discussion URL जब कोई मौजूद हो            |
| `comment`    | string या null | सार्वजनिक comment URL जब कोई मौजूद हो               |

### `media`

एकमात्र वैकल्पिक फ़ील्ड। अधिकतम **6** आइटम की सूची, जिनमें से हर एक प्लगइन का एक स्क्रीनशॉट या एक छोटा वीडियो बताता है:

| गुण | प्रकार | नियम |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` या `video` |
| `url`    | string | अपरिवर्तनीय GitHub URL, अधिकतम 2048 अक्षर (नीचे देखें) |
| `alt`    | string | वैकल्पिक पाठ, 1–120 अक्षर |

यहाँ का URL उतना ही अपरिवर्तनीय होना चाहिए जितना `source.commit`। ब्रांच नाम वाला
`raw.githubusercontent.com` पथ (`.../main/docs/shot.png`) वही दिखाता है जो वह ब्रांच आज रखती है,
इसलिए जिस दिन ब्रांच आगे बढ़ेगी उस दिन प्रविष्टि एक बिना समीक्षा वाली छवि प्रकाशित कर देगी। केवल दो
रूप स्वीकार्य हैं:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — कमिट पर पिन किया गया raw पथ;
- `https://github.com/<owner>/<repo>/assets/…` — GitHub का सामग्री-आधारित अपलोड URL, `video` आइटम के लिए।

स्कीमा केवल सुरक्षित आकार लागू करती है (होस्ट, 40 अक्षरों का हेक्साडेसिमल संदर्भ, सीमित लंबाई)।
बाकी `catalog validate` अर्थ के स्तर पर लागू करता है: URL को **प्रविष्टि के अपने** रिपॉज़िटरी में
**प्रविष्टि के अपने** `source.commit` को पिन करना चाहिए, और ब्रांच URL को
`media[n].url must pin the entry commit, not a branch` के साथ अस्वीकार किया जाता है।

जब दिखाने के लिए कुछ न हो तो फ़ील्ड पूरी तरह छोड़ दें — `media: []` "कोई स्क्रीनशॉट नहीं" कहने का
मान्य तरीका नहीं है। यह फ़ील्ड योगात्मक है: इसके अस्तित्व से पहले प्रकाशित प्रविष्टियाँ मान्य रहती
हैं, और इसे अनदेखा करने वाला उपभोक्ता हर प्रविष्टि पहले जैसी ही पढ़ता है।

## `kind: skill` प्रविष्टियाँ

स्कीमा संस्करण 1 `kind: skill` के लिए एक दूसरा, स्व-निहित प्रविष्टि अनुबंध भी परिभाषित करता है, जो
[`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) के रूप में प्रकाशित है (SKL-01 फ़ेज़ 0)।
यह ऊपर के प्लगइन स्कीमा को कभी नहीं छूता: `kind: plugin` वाली प्रविष्टियाँ ठीक पहले की तरह मान्य होती
रहती हैं, और स्किल स्कीमा फ़ाइल स्किल प्रविष्टियों के लिए उसी तरह सत्य का स्रोत है जिस तरह प्लगइन
स्कीमा प्लगइन प्रविष्टियों के लिए है।

स्किल इंस्टॉल नहीं होती, उसे हार्नेस **लोड** करता है, इसलिए केवल-प्लगइन वाले इंस्टॉल डिस्क्रिप्टर
(`package`, `dsh`) स्किल प्रविष्टि पर मौजूद नहीं होते और उनकी जगह `usage` + `compat` लेते हैं।
स्किल अक्सर ऐसे रिपॉज़िटरी की सबडायरेक्टरी में भी रहती है जो कई स्किल्स होस्ट करता है, इसलिए पहचान
और डीडुप्लीकेशन `source.repository` + `source.subpath` है, अकेला रिपॉज़िटरी नहीं। स्किल प्रविष्टि
कोई `media` गैलरी स्वीकार नहीं करती: स्किल वह टेक्स्ट है जिसे हार्नेस लोड करता है, इसलिए स्क्रीनशॉट
लेने के लिए कुछ नहीं है (`additionalProperties: false` ही इसे लागू करता है)।

ये फ़ील्ड ऊपर प्लगइन प्रविष्टियों के लिए प्रलेखित आकार और नियम ठीक वैसे ही बनाए रखते हैं:
`schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`, `tags`,
`source`, `creator`, `repositoryScope`, `license`, `provenance`. `triggers` — एकमात्र वैकल्पिक
स्किल फ़ील्ड — को छोड़कर हर फ़ील्ड आवश्यक है।

### स्किल-विशिष्ट फ़ील्ड

| फ़ील्ड                | प्रकार   | आवश्यक | नियम                                                        |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   हां    | ठीक `skill` होना चाहिए                                       |
| `skillScope`         | enum   |   हां    | `repository` (पूरा रिपॉज़िटरी **ही** स्किल है) या `subdirectory` (स्किल `source.subpath` पर रहती है) |
| `triggers`           | array  |    नहीं    | स्किल कब सक्रिय होती है — वह टेक्स्ट जिसे उपयोगकर्ता लोड करने से पहले आँकता है। कम से कम 1 अद्वितीय स्ट्रिंग, प्रत्येक 3–200 वर्ण; जब कोई न हो तो फ़ील्ड पूरी तरह छोड़ दें (`triggers: []` अमान्य है) |
| `usage.load`         | string |   हां    | हार्नेस स्किल को कैसे लोड करता है, 1–200 वर्ण; स्किल लोड होती है, कभी इंस्टॉल नहीं होती |
| `usage.evidencePath` | string |   हां    | `source.commit` पर लोड प्रमाण तक सुरक्षित सापेक्ष पथ (`description.evidencePath` जैसा ही पैटर्न) |
| `compat.harnessMin`  | string |   हां    | न्यूनतम हार्नेस संस्करण जिसके विरुद्ध स्किल सत्यापित की गई; ठीक `x.y.z` आकार (वैकल्पिक prerelease/build), अधिकतम 64 वर्ण। सिमेंटिक परत अतिरिक्त रूप से एक पार्स करने योग्य, सटीक SemVer मांगती है |

सशर्त नियम (स्किल स्कीमा के `allOf` ब्लॉकों द्वारा लागू):

- `skillScope: subdirectory` `source.subpath` को सुरक्षित सापेक्ष पथ स्ट्रिंग होने के लिए
  **बाध्य करता है** — सबडायरेक्टरी में होस्ट की गई स्किल को वह सबडायरेक्टरी पिन करनी ही होगी।
- `skillScope: repository` `source.subpath: null` **बाध्य करता है** — पूरे-रिपॉज़िटरी वाली स्किल
  को subpath घोषित नहीं करना चाहिए।

`verification` प्लगइन आकार बनाए रखता है (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), लेकिन `smokeTest` ठीक `null` होना चाहिए: स्किल का कोई इंस्टॉल स्मोक टेस्ट नहीं
होता, और सामग्री समीक्षा ही प्रवेश द्वार है। स्किल स्कीमा में `status: verified` → `smokeTest`
शर्त नहीं है और `repositoryScope` → `popularity` शर्तें भी नहीं हैं; वे युग्मन केवल
प्लगइन-स्कीमा के नियम हैं।

### स्किल्स के लिए सिमेंटिक परत

स्कीमा के ऊपर, कैटलॉग सत्यापन वहीं वही अनिवार्य सिमेंटिक पार्सर लागू करता है जो प्लगइनों के लिए
हैं, जहाँ फ़ील्ड मौजूद हों: `license.spdx` को मान्य SPDX अभिव्यक्ति के रूप में पार्स होना चाहिए
(`invalid-spdx`), और `compat.harnessMin` को सटीक SemVer होना चाहिए (`invalid-semver`)।
कोई `invalid-sri` केस नहीं है — स्किल के पास `package.integrity` नहीं होता।

### स्किल पहचान और डीडुप्लीकेशन

स्किल की कैनोनिकल कुंजी `skill:<source.repositoryNodeId>:<normalized subpath>` है। subpath केवल
पहचान के प्रयोजनों के लिए सामान्यीकृत होता है: बैकस्लैश `/` बन जाते हैं, खाली और `.` खंड हटा दिए
जाते हैं, और खाली परिणाम (या `subpath: null`) `.` बन जाता है — पूरा रिपॉज़िटरी। NUL बाइट या `..`
खंडों वाला subpath अस्वीकार किया जाता है, कभी "साफ़" नहीं किया जाता। एक ही रिपॉज़िटरी की दो
स्किल्स दो प्रविष्टियाँ हैं; वही रिपॉज़िटरी + subpath दो बार एक टकराव है।

### न्यूनतम स्किल उदाहरण

```yaml
schemaVersion: 1
id: alice-dsh-commit-lint-skill
name: DSH Commit Lint Skill
description:
  en: Loads a commit-message linting skill that checks Conventional Commit shape before the harness commits.
  evidencePath: skills/commit-lint/SKILL.md
unofficial: true
kind: skill
skillScope: subdirectory
primaryCategory: coding-developer-tools
tags:
  - git
  - linting
triggers:
  - When the user asks to commit staged work
source:
  repository: https://github.com/alice/dsh-skills
  repositoryNodeId: R_kgDOexample1
  subpath: skills/commit-lint
  commit: 0123456789abcdef0123456789abcdef01234567
creator:
  github: alice
usage:
  load: dsh skill load skills/commit-lint
  evidencePath: skills/commit-lint/SKILL.md
compat:
  harnessMin: 1.4.0
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
license:
  spdx: MIT
verification:
  status: eligible
  checkedAt: 2026-08-30T12:00:00Z
  repositoryIdentity: resolved
  smokeTest: null
provenance:
  discussion: null
  comment: null
```

## स्कीमा क्या जांच नहीं करती

स्कीमा जानबूझकर स्थानीय और संरचनात्मक है। यह **यह सत्यापित नहीं करती** कि रिपॉज़िटरी मौजूद है, कि नोड ID URL से मेल
खाती है, कि प्रमाण पथ पिन की गई कमिट पर मौजूद हैं, कि स्टार गिनती सटीक है, या कि निर्माता source का मालिक है। ये जांच
[CONTRIBUTING.md](../../CONTRIBUTING.md) और [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md) में वर्णित मेंटेनर समीक्षा
गेट्स से संबंधित हैं।

<!-- i18n-source-hash: dd689b0ee2a7910f069d498c831668b022852a8a20cc64efb3516ce6e289c4dd -->
