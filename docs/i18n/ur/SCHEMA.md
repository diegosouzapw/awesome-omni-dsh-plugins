# کیٹلاگ اندراج اسکیما ریفرنس

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **اردو**

> **غیر سرکاری کمیونٹی پروجیکٹ۔ DeepSeek سے وابستہ، اس کی توثیق یافتہ یا اس کے زیرِ سرپرستی نہیں ہے۔**
> DeepSeek کے نام اور نشانات ان کے متعلقہ مالک کی ملکیت ہیں۔

یہ [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) کے لیے فیلڈ بہ فیلڈ ریفرنس ہے، وہ عوامی JSON Schema (ڈرافٹ 2020-12) جسے `catalog/plugins/` کے تحت ہر فائل کو پورا کرنا لازمی ہے۔ اسکیما فائل خود سچائی کا ماخذ ہے؛ جب یہ صفحہ اور اسکیما میں اختلاف ہو تو اسکیما غالب رہتی ہے۔

توثیق کی دو تہیں لاگو ہوتی ہیں۔ عوامی اسکیما محدود *محفوظ اشکال* نافذ کرتی ہے (patterns اور lengths جو option-like یا غیر محدود قدروں کو مسترد کرتے ہیں)۔ اس کے اوپر، `catalog validate` لازمی سیمینٹک parsers لاگو کرتا ہے: ورژنز کے لیے exact SemVer، integrity قدروں کے لیے SHA-512 SRI، لائسنسز کے لیے SPDX expression parsing، اور نقل key کا مسترد ہونا۔ کوئی قدر اسکیما pattern سے مطابقت رکھ سکتی ہے مگر پھر بھی سیمینٹک طور پر مسترد ہو سکتی ہے۔

اعلیٰ سطحی قواعد: اندراج ایک واحد YAML آبجیکٹ ہے، `additionalProperties: false` (نامعلوم فیلڈز مسترد کیے جاتے ہیں)، اور درج ذیل **تمام** فیلڈز درکار ہیں۔

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

تیرہ صلاحیت زمروں میں سے ایک:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

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

## اسکیما کیا چیک نہیں کرتی

اسکیما جان بوجھ کر مقامی اور ساختی ہے۔ یہ تصدیق **نہیں** کرتی کہ ریپوزٹری موجود ہے، node ID URL سے مطابقت رکھتا ہے، ثبوت کے راستے پن شدہ کمٹ پر موجود ہیں، ستاروں کی تعداد درست ہے، یا تخلیق کار سورس کا مالک ہے۔ وہ چیکس [CONTRIBUTING.md](../../CONTRIBUTING.md) اور [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md) میں بیان کردہ مینٹینر جائزہ گیٹس سے تعلق رکھتی ہیں۔

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
