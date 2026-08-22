# कैटलॉग श्रेणियां

> 🌐 [English](../../docs/CATEGORIES.md) · **हिन्दी**

हर कैटलॉग एंट्री का एक आर्टिफ़ैक्ट kind, एक प्राथमिक क्षमता श्रेणी और शून्य या अधिक टैग होते हैं। प्राथमिक श्रेणी
तय करती है कि एंट्री कहां दिखाई देती है; टैग एंट्री को दोहराए बिना क्रॉस-श्रेणी खोज उपलब्ध कराते हैं।

## आर्टिफ़ैक्ट kind

<!-- catalog-policy:aggregators-never-entries -->

| मान | अर्थ | प्लगइन के रूप में स्टार-रैंक किया गया |
|---|---|---:|
| `plugin` | इंस्टॉल-योग्य नेटिव DSH बंडल | केवल तभी जब हर रैंकिंग शर्त पूरी हो |
| `plugin-family` | कई DSH प्लगइन रखने वाली रिपॉज़िटरी | नहीं; अलग सेक्शन |
| `skin-theme` | DSH UI स्किन या विज़ुअल थीम | नहीं; अलग सेक्शन |
| `skill` | DSH समर्थन वाली एजेंट स्किल | नहीं |
| `preset-profile` | DSH प्रोफाइल या प्रीसेट | नहीं |
| `client-interface` | डेस्कटॉप, TUI, एडिटर या रिमोट क्लाइंट | नहीं |
| `bridge-adapter` | किसी अन्य प्रोडक्ट से DSH में इंटीग्रेशन | नहीं |
| `ecosystem-project` | DSH इंटीग्रेशन रखने वाला व्यापक प्रोजेक्ट | नहीं |

एक अम्ब्रेला रिपॉज़िटरी, एग्रीगेटर, मार्केटप्लेस, इंस्टॉलर कैटलॉग या सूची कभी भी कैटलॉग एंट्री नहीं होती, भले ही
एग्रीगेटर स्वयं इंस्टॉल-योग्य हो। इसे केवल एक लीड के रूप में इस्तेमाल किया जा सकता है। हर लीड का पीछा एक स्वतंत्र
रूप से इंस्टॉल-योग्य चाइल्ड आर्टिफ़ैक्ट तक करें और उसे सबमिट करने से पहले उस आर्टिफ़ैक्ट के असली निर्माता, मूल
रिपॉज़िटरी, package और source subpath को हल करें। एक असली निर्माता monorepo किसी चाइल्ड प्लगइन के लिए मूल
रिपॉज़िटरी हो सकती है, लेकिन चाइल्ड को उसी सटीक subpath और monorepo स्टार्स नीति का उपयोग करना होगा।

`kind` फ़ील्ड कैनोनिकल DSH आर्टिफ़ैक्ट डिस्क्रिमिनेटर है। कोई अलग इंटीग्रेशन kind मौजूद नहीं है: `plugin` का मतलब
पहले से ही एक नेटिव DSH बंडल है, जबकि `ecosystem-project` का मतलब पहले से ही DSH इंटीग्रेशन रखने वाला एक व्यापक
प्रोजेक्ट है। यह विरोधाभासी वर्गीकरण जोड़ों को रोकता है।

## प्राथमिक क्षमता श्रेणियां

| मान | प्रदर्शन लेबल |
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

वह श्रेणी चुनें जो प्लगइन के प्राथमिक काम का सबसे अच्छा प्रतिनिधित्व करे, न कि वह श्रेणी जो दृश्यता बढ़ाने की
सबसे अधिक संभावना रखे।

## इंटरफ़ेस टैग

मानक इंटरफ़ेस टैग में `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`, `mobile`, `remote`, `editor`,
`headless` और `theme` शामिल हैं। अतिरिक्त लोअरकेस kebab-case क्षमता टैग तब अनुमत हैं जब वे पिन किए गए मूल source
में दिखाई देने वाले प्रमाण का वर्णन करते हों।

## रिपॉज़िटरी स्कोप

`dedicated` का उपयोग केवल तब करें जब रिपॉज़िटरी के स्टार्स ठीक उसी कैटलॉग किए गए प्लगइन के हों। `monorepo` का
उपयोग तब करें जब प्लगइन किसी व्यापक प्रोजेक्ट के अंदर एक subpath या package हो। एक monorepo एंट्री को
`popularity.starsPolicy: undefined-parent-repository` और `popularity.stars: null` का उपयोग करना होगा।

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
