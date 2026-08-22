# కేటలాగ్ వర్గాలు

ప్రతి కేటలాగ్ ఎంట్రీకి ఒక ఆర్టిఫ్యాక్ట్ రకం (kind), ఒక ప్రాథమిక సామర్థ్య వర్గం మరియు సున్నా లేదా అంతకంటే
ఎక్కువ ట్యాగ్‌లు ఉంటాయి. ప్రాథమిక వర్గం ఎంట్రీ ఎక్కడ కనిపిస్తుందో నిర్ణయిస్తుంది; ట్యాగ్‌లు ఎంట్రీని నకలు
చేయకుండా వర్గాల అడ్డంగా శోధనను అందిస్తాయి.

## ఆర్టిఫ్యాక్ట్ రకాలు

<!-- catalog-policy:aggregators-never-entries -->

| విలువ | అర్థం | ప్లగిన్‌గా స్టార్-ర్యాంక్ చేయబడుతుందా |
|---|---|---:|
| `plugin` | ఇన్‌స్టాల్ చేయదగిన నేటివ్ DSH బండిల్ | అన్ని ర్యాంకింగ్ షరతులు నెరవేరినప్పుడు మాత్రమే |
| `plugin-family` | బహుళ DSH ప్లగిన్‌లను కలిగి ఉన్న రిపాజిటరీ | లేదు; వేరు విభాగం |
| `skin-theme` | DSH UI స్కిన్ లేదా విజువల్ థీమ్ | లేదు; వేరు విభాగం |
| `skill` | DSH మద్దతుతో కూడిన ఏజెంట్ స్కిల్ | లేదు |
| `preset-profile` | DSH ప్రొఫైల్ లేదా ప్రీసెట్ | లేదు |
| `client-interface` | డెస్క్‌టాప్, TUI, ఎడిటర్ లేదా రిమోట్ క్లయింట్ | లేదు |
| `bridge-adapter` | మరొక ప్రొడక్ట్ నుండి DSHలోకి ఇంటిగ్రేషన్ | లేదు |
| `ecosystem-project` | DSH ఇంటిగ్రేషన్‌ను కలిగి ఉన్న విస్తృత ప్రాజెక్ట్ | లేదు |

అంబ్రెల్లా రిపాజిటరీ, అగ్రిగేటర్, మార్కెట్‌ప్లేస్, ఇన్‌స్టాలర్ కేటలాగ్ లేదా జాబితా ఎప్పుడూ కేటలాగ్ ఎంట్రీ
కాదు, అగ్రిగేటర్ స్వయంగా ఇన్‌స్టాల్ చేయదగినదైనప్పటికీ. దానిని కేవలం సూచనగా మాత్రమే ఉపయోగించవచ్చు.
ప్రతి సూచనను స్వతంత్రంగా ఇన్‌స్టాల్ చేయదగిన చైల్డ్ ఆర్టిఫ్యాక్ట్ వరకు అనుసరించి, ఆ ఆర్టిఫ్యాక్ట్ యొక్క
వాస్తవ సృష్టికర్త, అసలు రిపాజిటరీ, ప్యాకేజీ మరియు సోర్స్ సబ్‌పాత్‌ను సమర్పించే ముందు పరిష్కరించండి.
నిజమైన సృష్టికర్త మోనోరెపో చైల్డ్ ప్లగిన్‌కు అసలు రిపాజిటరీ కావచ్చు, కానీ చైల్డ్ ఆ ఖచ్చితమైన సబ్‌పాత్‌ను
మరియు మోనోరెపో స్టార్ల పాలసీని ఉపయోగించాలి.

`kind` ఫీల్డ్ కానానికల్ DSH ఆర్టిఫ్యాక్ట్ డిస్క్రిమినేటర్. వేరే ఇంటిగ్రేషన్ రకం లేదు: `plugin` అంటే
ఇప్పటికే నేటివ్ DSH బండిల్ అని అర్థం, అదే సమయంలో `ecosystem-project` అంటే ఇప్పటికే DSH ఇంటిగ్రేషన్
కలిగిన విస్తృత ప్రాజెక్ట్ అని అర్థం. ఇది విరుద్ధమైన వర్గీకరణ జంటలను నిరోధిస్తుంది.

## ప్రాథమిక సామర్థ్య వర్గాలు

| విలువ | డిస్‌ప్లే లేబుల్ |
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

ప్లగిన్ యొక్క ప్రాథమిక పనిని ఉత్తమంగా సూచించే వర్గాన్ని ఎంచుకోండి, కనిపించే అవకాశాన్ని పెంచే అవకాశం
ఉన్న వర్గాన్ని కాదు.

## ఇంటర్‌ఫేస్ ట్యాగ్‌లు

ప్రామాణిక ఇంటర్‌ఫేస్ ట్యాగ్‌లలో `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` మరియు `theme` ఉన్నాయి. పిన్ చేయబడిన అసలు సోర్స్‌లో
కనిపించే సాక్ష్యాన్ని వివరిస్తున్నప్పుడు అదనపు లోయర్‌కేస్ కేబాబ్-కేస్ సామర్థ్య ట్యాగ్‌లు అనుమతించబడతాయి.

## రిపాజిటరీ స్కోప్

రిపాజిటరీ స్టార్లు ఖచ్చితంగా కేటలాగ్ చేయబడిన ప్లగిన్‌కు చెందినప్పుడే `dedicated` ఉపయోగించండి. ప్లగిన్
విస్తృత ప్రాజెక్ట్ లోపల సబ్‌పాత్ లేదా ప్యాకేజీ అయినప్పుడు `monorepo` ఉపయోగించండి. మోనోరెపో ఎంట్రీ
తప్పనిసరిగా `popularity.starsPolicy: undefined-parent-repository` మరియు
`popularity.stars: null` ఉపయోగించాలి.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
