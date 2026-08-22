# रैंकिंग पद्धति

> 🌐 [English](../../docs/RANKING.md) · **हिन्दी**

रैंकिंग मर्ज की गई सार्वजनिक कैटलॉग एंट्रीज़ के पारदर्शी दृश्य हैं। ये कभी भी कोई छिपा हुआ संयुक्त स्कोर उपयोग नहीं
करतीं और किसी व्यापक पेरेंट प्रोजेक्ट के स्टार्स को कभी प्लगइन लोकप्रियता के रूप में नहीं मानतीं।

## Top Plugins by Stars प्रेडिकेट

एक एंट्री केवल तभी योग्य होती है जब नीचे दी गई हर शर्त सत्य हो:

```text
kind == plugin (कैनोनिकल नेटिव DSH बंडल डिस्क्रिमिनेटर)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

योग्य एंट्रीज़ `popularity.starsPolicy: exact-repository` और `popularity.stars` में एक गैर-ऋणात्मक integer का
उपयोग करती हैं। बराबरी की स्थिति में केस-असंवेदनशील प्लगइन ID को नियतात्मक (deterministic) प्रदर्शन क्रम के रूप में
उपयोग किया जाता है; यह टाई-ब्रेक किसी गुणवत्ता अंतर का संकेत नहीं देता।

`kind` ही एकमात्र आर्टिफ़ैक्ट-प्रकार डिस्क्रिमिनेटर है। स्कीमा जानबूझकर एक दूसरा DSH इंटीग्रेशन kind संग्रहीत नहीं
करती जो इसका खंडन कर सके।

## स्पष्ट बहिष्करण

किसी व्यापक monorepo के अंदर एक प्लगइन कैटलॉग-योग्य बना रहता है, लेकिन प्लगइन रैंकिंग के लिए उसके पेरेंट के स्टार्स
अपरिभाषित (undefined) हैं। इसे `repositoryScope: monorepo`, `popularity.starsPolicy:
undefined-parent-repository` और `popularity.stars: null` का उपयोग करना होगा। यह फ़ंक्शनल सेक्शनों में दिखाई देता है
और हर स्टार-आधारित रैंकिंग से बाहर रखा जाता है।

Plugin families, themes, skins, skills, presets, clients, interfaces, bridges और व्यापक ecosystem projects
Top Plugins by Stars में दिखाई नहीं देते। जहां तुलना-योग्य डेटा मौजूद है, वहां उन्हें अलग सेक्शन मिलते हैं।
Aggregators, marketplaces, installer catalogs और सूचियां कैटलॉग एंट्री नहीं हैं और उन्हें कोई कैटलॉग सेक्शन नहीं
मिलता।

## रैंकिंग दृश्य

प्रोजेक्ट स्टार्स, 24-घंटे की वृद्धि, 7-दिन की वृद्धि, हाल के अपडेट, सत्यापित इंस्टॉल, plugin families, themes और
skins, clients और interfaces, और ecosystem integrations के लिए अलग-अलग दृश्य प्रकाशित कर सकता है। हर दृश्य को
अपना समावेशन नियम और स्नैपशॉट समय स्पष्ट करना होगा।

शून्य योग्य एंट्रीज़ पर, Top Plugins रेंडर नहीं होता। पहली योग्य मर्ज एक Top Plugins दृश्य बनाती है; लेबल केवल
दस योग्य एंट्रीज़ मौजूद होने के बाद Top 10 में बदलता है। कोई प्लेसहोल्डर या मनगढ़ंत रैंकिंग अनुमत नहीं है।

## सत्यापन समर्थन नहीं है

`eligible` का मतलब है कि सार्वजनिक संरचना और DSH इंटीग्रेशन को मान्य किया गया। `verified` का अतिरिक्त अर्थ है कि
पिन किए गए source या package के लिए एक इंस्टॉलेशन स्मोक टेस्ट पास हुआ। कोई भी स्थिति समर्थन, गारंटी या पूर्ण
सुरक्षा प्रमाणन नहीं है।

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
