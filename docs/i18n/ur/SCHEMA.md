# کیٹلاگ اندراج اسکیما ریفرنس

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **اردو**

> **غیر سرکاری کمیونٹی پروجیکٹ۔ DeepSeek سے وابستہ، اس کی توثیق یافتہ یا اس کے زیرِ سرپرستی نہیں ہے۔**
> DeepSeek کے نام اور نشانات ان کے متعلقہ مالک کی ملکیت ہیں۔

یہ [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) کے لیے فیلڈ بہ فیلڈ ریفرنس ہے، وہ عوامی JSON Schema (ڈرافٹ 2020-12) جسے `catalog/plugins/` کے تحت ہر فائل کو پورا کرنا لازمی ہے۔ اسکیما فائل خود سچائی کا ماخذ ہے؛ جب یہ صفحہ اور اسکیما میں اختلاف ہو تو اسکیما غالب رہتی ہے۔

توثیق کی دو تہیں لاگو ہوتی ہیں۔ عوامی اسکیما محدود *محفوظ اشکال* نافذ کرتی ہے (patterns اور lengths جو option-like یا غیر محدود قدروں کو مسترد کرتے ہیں)۔ اس کے اوپر، `catalog validate` لازمی سیمینٹک parsers لاگو کرتا ہے: ورژنز کے لیے exact SemVer، integrity قدروں کے لیے SHA-512 SRI، لائسنسز کے لیے SPDX expression parsing، اور نقل key کا مسترد ہونا۔ کوئی قدر اسکیما pattern سے مطابقت رکھ سکتی ہے مگر پھر بھی سیمینٹک طور پر مسترد ہو سکتی ہے۔

اعلیٰ سطحی قواعد: اندراج ایک ہی YAML آبجیکٹ ہے، `additionalProperties: false`
(نامعلوم فیلڈز مسترد کر دیے جاتے ہیں)، اور نیچے دیے گئے تمام فیلڈز لازمی ہیں سوائے `media` کے —
واحد اختیاری فیلڈ۔

## اعلیٰ سطحی فیلڈز

| فیلڈ | قسم | درکار | خلاصہ |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   ہاں    | لازمی طور پر بالکل `1`                                        |
| `id`              | string  |   ہاں    | Lowercase kebab-case اندراج ID؛ لازمی طور پر فائل نام سے مطابقت رکھے |
| `name`            | string  |   ہاں    | نمائشی نام، 1–120 حروف                                        |
| `description`     | object  |   ہاں    | مرتب شدہ انگریزی خلاصہ اور اس کا evidence path                 |
| `unofficial`      | const   |   ہاں    | لازمی طور پر بالکل `true`                                     |
| `kind`            | enum    |   ہاں    | معیاری artifact discriminator                                  |
| `primaryCategory` | enum    |   ہاں    | واحد بنیادی صلاحیت زمرہ                                       |
| `tags`            | array   |   ہاں    | منفرد lowercase kebab-case ٹیگز (خالی ہو سکتے ہیں)             |
| `source`          | object  |   ہاں    | اصل ریپوزٹری، node ID، subpath اور پن شدہ کمٹ                  |
| `creator`         | object  |   ہاں    | تخلیق کار کا عوامی GitHub ہینڈل                                |
| `package`         | object  |   ہاں    | معیاری انسٹال ڈسکرپٹر (npm **یا** source)                      |
| `dsh`             | object  |   ہاں    | DSH پروفائلز اور نیٹو انٹیگریشن ثبوت کا راستہ                  |
| `repositoryScope` | enum    |   ہاں    | `dedicated` یا `monorepo`                                     |
| `popularity`      | object  |   ہاں    | ستاروں کی پالیسی اور تعداد (scope پر مشروط)                    |
| `license`         | object  |   ہاں    | اپ اسٹریم SPDX لائسنس اظہار                                    |
| `verification`    | object  |   ہاں    | توثیق حیثیت، چیک کا وقت، شناخت اور smoke test                  |
| `provenance`      | object  |   ہاں    | عوامی Discussion/comment URLs یا `null`                        |
| `media`           | array   |    نہیں    | زیادہ سے زیادہ 6 اسکرین شاٹس/ویڈیوز، ہر URL `source.commit` پر پن |

### `schemaVersion`

مستقل `1`۔ عوامی اسکیما ورژن 1 کی نشاندہی کرتا ہے؛ کوئی بھی دوسری قدر غلط ہے۔

### `id`

وہ string جو `^[a-z0-9]+(?:-[a-z0-9]+)*$` سے مطابقت رکھے — lowercase kebab-case، بغیر شروع/آخر یا دوہرے hyphens کے۔ [CONTRIBUTING.md](../../CONTRIBUTING.md) کے مطابق، اندراج فائل کا نام لازمی طور پر `catalog/plugins/<id>.yaml` ہونا چاہیے اسی قدر کے ساتھ؛ validator عدم مطابقت کو مسترد کرتا ہے (`id-filename-mismatch`)۔ ID کو لازمی طور پر تخلیق کار کے namespace سے بھی شروع ہونا چاہیے: `creator.github` ہینڈل lowercase میں، جہاں `[a-z0-9]` سے باہر کرداروں کا ہر سلسلہ ایک واحد `-` میں سکڑ جاتا ہے، جس کے بعد `-` ہو (`id-creator-prefix`)۔

### `name`

آزاد شکل نمائشی نام، `minLength: 1`، `maxLength: 120`۔

### `description`

بالکل دو درکار خصوصیات کے ساتھ آبجیکٹ (کوئی اور اجازت نہیں):

| خصوصیت       | قسم   | قواعد                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | انگریزی خلاصہ، 20–320 حروف                                            |
| `evidencePath` | string | نسبتی repo path pattern؛ کوئی شروعاتی `/` نہیں، کوئی backslashes نہیں، کوئی `.`/`..` segments نہیں |

انگریزی خلاصہ لازمی طور پر `evidencePath` پر موجود فائل سے، جیسا کہ یہ `source.commit` پر موجود ہے، مرتب کیا جانا چاہیے — کسی دوسرے کیٹلاگ سے کاپی نہیں کیا جانا چاہیے۔

### `unofficial`

مستقل `true`۔ Machine-readable نشان کہ فہرست غیر سرکاری ہے۔

### `kind`

**واحد** artifact-type discriminator (کوئی دوسرا integration-kind فیلڈ موجود نہیں)۔ ان میں سے ایک:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

معنی اور درجہ بندی کے نتائج [docs/CATEGORIES.md](../../docs/CATEGORIES.md) میں بیان کیے گئے ہیں۔

### `primaryCategory`

چودہ صلاحیت زمروں میں سے ایک:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

نمائشی labels اور انتخاب کی رہنمائی [docs/CATEGORIES.md](../../docs/CATEGORIES.md) میں ہے۔

### `tags`

منفرد strings کی array، ہر ایک `^[a-z0-9]+(?:-[a-z0-9]+)*$` سے مطابقت رکھتا ہے (lowercase kebab-case)۔ اسکیما کوئی کم از کم تعداد نافذ نہیں کرتی۔

### `source`

بالکل چار درکار خصوصیات کے ساتھ آبجیکٹ:

| خصوصیت           | قسم           | قواعد                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>` URL؛ owner GitHub username قواعد کی پیروی کرتا ہے، repo name 1–100 حروف، `.`/`..` نہیں ہو سکتا یا `.git` پر ختم نہیں ہو سکتا |
| `repositoryNodeId` | string         | ناقابلِ تبدیل GitHub repository node ID، غیر خالی                       |
| `subpath`          | string یا null | ریپوزٹری کے اندر پلگ ان کا subpath (وہی محفوظ نسبتی-path pattern جو `evidencePath` کا ہے)، یا ریپوزٹری-روٹ پلگ ان کے لیے `null` |
| `commit`           | string         | مکمل 40-حرفی hexadecimal کمٹ OID                                       |

کیٹلاگ توثیق کو لازمی طور پر `repositoryNodeId` حل کرنا چاہیے اور ریپوزٹری URL عدم مطابقت کو مسترد کرنا چاہیے — یہ حل ایک مینٹینر-سائیڈ گیٹ ہے، مقامی ساختی چیک کا حصہ نہیں۔

### `creator`

ایک واحد درکار خصوصیت کے ساتھ آبجیکٹ:

| خصوصیت | قسم   | قواعد                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | GitHub username (1–39 حروف، GitHub ہینڈل قواعد)   |

عوامی پروفائل URL ہمیشہ `https://github.com/<handle>` کے طور پر اخذ کیا جاتا ہے؛ کوئی دوسرا پروفائل فیلڈ محفوظ نہیں کیا جاتا، اس لیے دونوں کبھی الگ نہیں ہو سکتے۔

### `package`

معیاری انسٹال ڈسکرپٹر۔ یہ ڈیٹا ہے، کبھی shell کمانڈ نہیں، اور بالکل دو اشکال میں سے ایک لیتا ہے (`oneOf`):

**npm پیکج** — درکار `ecosystem`، `name`، `version`؛ اختیاری `integrity`:

| خصوصیت    | قسم  | قواعد                                                                      |
| ----------- | ----- | --------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | npm پیکج نام کی شکل (اختیاری طور پر scoped)، زیادہ سے زیادہ 214 حروف       |
| `version`   | string | Exact `x.y.z` ورژن شکل (اختیاری prerelease/build)؛ ranges مسترد۔ سیمینٹک تہہ اضافی طور پر قابلِ پارس، exact SemVer درکار کرتی ہے |
| `integrity` | string | اختیاری `sha512-…` SRI شکل، 8–256 حروف۔ سیمینٹک تہہ کو لازمی طور پر اسے درست SHA-512 SRI کے طور پر پارس کرنا چاہیے |

**source install** — صرف درکار `ecosystem`:

| خصوصیت    | قسم  | قواعد    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

سورس ڈسکرپٹر جان بوجھ کر اور کچھ محفوظ نہیں کرتا: ریپوزٹری، کمٹ اور subpath `source` سے اخذ کیے جاتے ہیں، اس لیے متغیر قدریں کبھی نہیں دہرائی جاتیں۔

### `dsh`

نیٹو DSH انٹیگریشن ثبوت:

| خصوصیت       | قسم   | قواعد                                                          |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | کم از کم ایک منفرد پروفائل نام جو `^[A-Za-z0-9][A-Za-z0-9._-]*$` سے مطابقت رکھتا ہو |
| `evidencePath` | string | `source.commit` پر DSH انٹیگریشن ثبوت کا محفوظ نسبتی راستہ      |

### `repositoryScope`

یا تو `dedicated` (ریپوزٹری کے ستارے اسی عین پلگ ان سے تعلق رکھتے ہیں) یا `monorepo` (پلگ ان کسی وسیع تر پروجیکٹ کے اندر ایک subpath یا پیکج ہے)۔ یہ قدر نیچے دیے گئے مشروط مقبولیت قواعد کو چلاتی ہے۔

### `popularity`

| خصوصیت     | قسم            | قواعد                                                |
| ------------ | --------------- | ----------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` یا `undefined-parent-repository`  |
| `stars`      | integer یا null | غیر منفی integer، یا `null`                            |

مشروط قواعد (اسکیما کے `allOf` blocks کے ذریعے نافذ):

- `repositoryScope: monorepo` **مجبور کرتا ہے** `starsPolicy: undefined-parent-repository` اور `stars: null`۔ پیرنٹ پروجیکٹ کے ستارے کبھی مونوریپو پلگ ان کو منسوب نہیں کیے جاتے۔
- `repositoryScope: dedicated` **مجبور کرتا ہے** `starsPolicy: exact-repository` اور ایک integer `stars >= 0`۔

یہ قدریں درجہ بندی کے اصول کو کیسے پروان چڑھاتی ہیں، اس کے لیے [docs/RANKING.md](../../docs/RANKING.md) دیکھیں۔

### `license`

| خصوصیت | قسم   | قواعد                                                          |
| -------- | ------ | ---------------------------------------------------------------- |
| `spdx`   | string | SPDX اظہار کی شکل، 2–256 حروف، بغیر شروعاتی hyphen کے             |

اسکیما صرف ایک محفوظ کریکٹر شکل نافذ کرتی ہے؛ کیٹلاگ توثیق کو لازمی طور پر ایک حقیقی SPDX expression parser کے ساتھ قدر کو پارس اور نارملائز کرنا چاہیے۔ پن شدہ کمٹ پر ثبوت شدہ مکمل اپ اسٹریم اظہار ریکارڈ کریں (مثال کے طور پر `Apache-2.0` یا `MIT OR GPL-3.0-only`)۔

### `verification`

توثیق `source.commit` پر لاگو ہوتی ہے۔ چار درکار خصوصیات کے ساتھ آبجیکٹ:

| خصوصیت             | قسم           | قواعد                                                  |
| -------------------- | -------------- | -------------------------------------------------------- |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | چیک کا `date-time` فارمیٹڈ ٹائم اسٹیمپ                    |
| `repositoryIdentity` | const          | لازمی طور پر `resolved` ہونا چاہیے                        |
| `smokeTest`          | object یا null | Smoke-test ریکارڈ، یا جب کوئی موزوں test موجود نہ ہو تو `null` |

جب موجود ہو، `smokeTest` کو درکار ہے:

| خصوصیت        | قسم   | قواعد                                                             |
| --------------- | ------ | ------------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — `package` یا پن شدہ سورس کا حوالہ دیتا ہے بغیر متغیر قدروں کو دہرائے |
| `check`         | object | درکار `name` (پیکج-نام شکل) اور `version` (exact ورژن شکل)          |
| `result`        | const  | `passed` — ناکام smoke test کو smoke test کے طور پر ریکارڈ نہیں کیا جاتا |

مشروط قاعدہ: `status: verified` کو ایک غیر null `smokeTest` آبجیکٹ **درکار** ہے۔ قابلِ جائزہ smoke ثبوت کے بغیر اندراجات `status: eligible` اور `smokeTest: null` استعمال کرتی ہیں۔ کوئی بھی حیثیت توثیق یا سیکیورٹی سرٹیفیکیشن نہیں ہے — دیکھیں [docs/RANKING.md](../../docs/RANKING.md)۔

### `provenance`

عوامی provenance لنکس، ہر ایک URI یا `null`:

| خصوصیت     | قسم          | قواعد                                            |
| ------------ | ------------- | -------------------------------------------------- |
| `discussion` | string یا null | عوامی Discussion URL جب موجود ہو                   |
| `comment`    | string یا null | عوامی comment URL جب موجود ہو                      |

### `media`

واحد اختیاری فیلڈ۔ زیادہ سے زیادہ **6** آئٹمز کی ایک صف، جن میں سے ہر ایک پلگ اِن کا ایک اسکرین شاٹ یا ایک مختصر ویڈیو بیان کرتا ہے:

| خصوصیت | قسم | قواعد |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` یا `video` |
| `url`    | string | ناقابلِ تبدیل GitHub URL، زیادہ سے زیادہ 2048 حروف (نیچے دیکھیں) |
| `alt`    | string | متبادل متن، 1–120 حروف |

یہاں کا URL اتنا ہی ناقابلِ تبدیل ہونا چاہیے جتنا `source.commit`۔ برانچ کا نام رکھنے والا
`raw.githubusercontent.com` راستہ (`.../main/docs/shot.png`) وہی دکھاتا ہے جو وہ برانچ آج رکھتی
ہے، لہٰذا جس دن برانچ آگے بڑھے گی، اندراج ایک غیر جائزہ شدہ تصویر شائع کر دے گا۔ صرف دو صورتیں
قبول ہیں:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — کمٹ پر پن کیا گیا raw راستہ؛
- `https://github.com/<owner>/<repo>/assets/…` — GitHub کا مواد کے مطابق پتہ رکھنے والا اپ لوڈ URL، `video` آئٹمز کے لیے۔

اسکیما صرف محفوظ شکل نافذ کرتی ہے (میزبان، 40 حروف کا سولہ عددی حوالہ، محدود لمبائی)۔ باقی
`catalog validate` معنوی طور پر نافذ کرتا ہے: URL کو **اندراج کی اپنی** ریپوزٹری میں **اندراج کے
اپنے** `source.commit` کو پن کرنا چاہیے، اور برانچ کا URL
`media[n].url must pin the entry commit, not a branch` کے ساتھ مسترد ہوتا ہے۔

جب دکھانے کو کچھ نہ ہو تو فیلڈ کو مکمل طور پر چھوڑ دیں — `media: []` "کوئی اسکرین شاٹ نہیں" کہنے
کا درست طریقہ نہیں ہے۔ یہ فیلڈ اضافی ہے: اس کے وجود سے پہلے شائع ہونے والے اندراجات درست رہتے
ہیں، اور اسے نظرانداز کرنے والا صارف ہر اندراج بالکل پہلے کی طرح پڑھتا ہے۔

## `kind: skill` اندراجات

اسکیما ورژن 1 `kind: skill` کے لیے ایک دوسرا، خودمکتفی اندراجی معاہدہ بھی متعین کرتی ہے، جو
[`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) کے طور پر شائع ہے (SKL-01 فیز 0)۔
یہ اوپر والی پلگ ان اسکیما کو کبھی نہیں چھیڑتا: `kind: plugin` والے اندراجات بالکل پہلے کی طرح
ویلیڈیٹ ہوتے رہتے ہیں، اور اسکل اسکیما فائل اسکل اندراجات کے لیے اسی طرح سچائی کا ماخذ ہے جس
طرح پلگ ان اسکیما پلگ ان اندراجات کے لیے ہے۔

اسکل انسٹال نہیں ہوتی، اسے harness کے ذریعے **لوڈ** کیا جاتا ہے، لہٰذا صرف-پلگ ان انسٹال
ڈسکرپٹرز (`package`, `dsh`) اسکل اندراج پر موجود نہیں ہوتے اور ان کی جگہ `usage` + `compat`
لیتے ہیں۔ اسکل اکثر ایسی ریپوزٹری کی ذیلی ڈائریکٹری میں بھی رہتی ہے جو بہت سی اسکلز کی میزبانی
کرتی ہے، اس لیے شناخت اور ڈی ڈیوپ صرف ریپوزٹری کے بجائے `source.repository` + `source.subpath`
ہے۔ اسکل اندراج کوئی `media` گیلری قبول نہیں کرتا: اسکل وہ متن ہے جسے harness لوڈ کرتی ہے، لہٰذا
اسکرین شاٹ لینے کو کچھ نہیں (`additionalProperties: false` ہی اسے نافذ کرتا ہے)۔

یہ فیلڈز بالکل وہی شکل اور قواعد برقرار رکھتی ہیں جو اوپر پلگ ان اندراجات کے لیے دستاویز کیے
گئے ہیں: `schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`, `tags`,
`source`, `creator`, `repositoryScope`, `license`, `provenance`۔ ہر فیلڈ درکار ہے سوائے
`triggers` کے، جو واحد اختیاری اسکل فیلڈ ہے۔

### اسکل مخصوص فیلڈز

| فیلڈ                | قسم   | درکار | قواعد                                                       |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   ہاں    | لازمی طور پر بالکل `skill`                                   |
| `skillScope`         | enum   |   ہاں    | `repository` (پوری ریپوزٹری **ہی** اسکل ہے) یا `subdirectory` (اسکل `source.subpath` پر رہتی ہے) |
| `triggers`           | array  |   نہیں    | اسکل کب فائر ہوتی ہے — وہ متن جسے صارف اسے لوڈ کرنے سے پہلے پرکھتا ہے۔ کم از کم 1 منفرد سٹرنگ، ہر ایک 3–200 حروف؛ جب کوئی نہ ہو تو فیلڈ کو مکمل طور پر چھوڑ دیں (`triggers: []` غیر درست ہے) |
| `usage.load`         | string |   ہاں    | harness اسکل کو کیسے لوڈ کرتی ہے، 1–200 حروف؛ اسکل لوڈ ہوتی ہے، کبھی انسٹال نہیں |
| `usage.evidencePath` | string |   ہاں    | `source.commit` پر لوڈ ثبوت تک محفوظ نسبتی راستہ (وہی pattern جو `description.evidencePath` کا ہے) |
| `compat.harnessMin`  | string |   ہاں    | کم از کم harness ورژن جس کے خلاف اسکل کی تصدیق کی گئی؛ بالکل `x.y.z` شکل (اختیاری prerelease/build)، زیادہ سے زیادہ 64 حروف۔ معنوی تہہ اضافی طور پر ایک پارس ہونے کے قابل، بالکل درست SemVer کا تقاضا کرتی ہے |

مشروط قواعد (اسکل اسکیما کے `allOf` بلاکس کے ذریعے نافذ):

- `skillScope: subdirectory` `source.subpath` کو ایک محفوظ نسبتی راستے کی سٹرنگ ہونے پر
  **مجبور** کرتا ہے — ذیلی ڈائریکٹری میں میزبان اسکل کو وہ ذیلی ڈائریکٹری پن کرنی ہوگی۔
- `skillScope: repository` `source.subpath: null` پر **مجبور** کرتا ہے — پوری ریپوزٹری والی
  اسکل کو subpath کا اعلان نہیں کرنا چاہیے۔

`verification` پلگ ان والی شکل برقرار رکھتا ہے (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`)، مگر `smokeTest` لازمی طور پر بالکل `null` ہونا چاہیے: اسکل کا کوئی انسٹال
smoke test نہیں ہوتا، اور مواد کا جائزہ ہی داخلے کا گیٹ ہے۔ اسکل اسکیما میں کوئی
`status: verified` → `smokeTest` شرط نہیں اور کوئی `repositoryScope` → `popularity` شرائط
نہیں؛ وہ جوڑ صرف پلگ ان اسکیما کے قواعد ہیں۔

### اسکلز کے لیے معنوی تہہ

اسکیما کے اوپر، کیٹلاگ ویلیڈیشن وہی لازمی معنوی پارسرز لاگو کرتی ہے جو پلگ انز کے لیے ہیں،
جہاں فیلڈز موجود ہوں: `license.spdx` کو ایک درست SPDX اظہار کے طور پر پارس ہونا چاہیے
(`invalid-spdx`)، اور `compat.harnessMin` کو بالکل درست SemVer ہونا چاہیے (`invalid-semver`)۔
کوئی `invalid-sri` کیس نہیں — اسکل کے پاس `package.integrity` نہیں ہوتا۔

### اسکل کی شناخت اور ڈی ڈیوپ

اسکل کی معیاری کلید `skill:<source.repositoryNodeId>:<normalized subpath>` ہے۔ subpath صرف
شناختی مقاصد کے لیے نارملائز کیا جاتا ہے: بیک سلیشز `/` بن جاتے ہیں، خالی اور `.` سیگمنٹس
گرا دیے جاتے ہیں، اور خالی نتیجہ (یا `subpath: null`) `.` بن جاتا ہے — یعنی پوری ریپوزٹری۔
NUL بائٹس یا `..` سیگمنٹس رکھنے والا subpath مسترد ہوتا ہے، کبھی "صاف" نہیں کیا جاتا۔ ایک ہی
ریپوزٹری کی دو اسکلز دو اندراجات ہیں؛ وہی ریپوزٹری + subpath دو بار ایک ٹکراؤ ہے۔

### کم سے کم اسکل مثال

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

## اسکیما کیا چیک نہیں کرتی

اسکیما جان بوجھ کر مقامی اور ساختی ہے۔ یہ تصدیق **نہیں** کرتی کہ ریپوزٹری موجود ہے، node ID URL سے مطابقت رکھتا ہے، ثبوت کے راستے پن شدہ کمٹ پر موجود ہیں، ستاروں کی تعداد درست ہے، یا تخلیق کار سورس کا مالک ہے۔ وہ چیکس [CONTRIBUTING.md](../../CONTRIBUTING.md) اور [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md) میں بیان کردہ مینٹینر جائزہ گیٹس سے تعلق رکھتی ہیں۔

<!-- i18n-source-hash: 7928f14612f5cf4a63bfedceed6c38d862a829a4f88a0045efd277aec2b62f47 -->
