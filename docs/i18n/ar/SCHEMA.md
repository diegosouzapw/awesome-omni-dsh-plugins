# مرجع مخطط إدخال الكتالوج

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **العربية**

> **مشروع مجتمعي غير رسمي. غير منتسب لشركة DeepSeek ولا معتمد أو ممول منها.**
> أسماء DeepSeek وعلاماتها التجارية ملك لأصحابها المعنيين.

هذا هو المرجع حقلًا بحقل لـ [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml)، مخطط JSON Schema العام (المسودة 2020-12) الذي يجب أن يُحقِّقه كل ملف تحت `catalog/plugins/`. ملف المخطط نفسه هو مصدر الحقيقة؛ وعندما تختلف هذه الصفحة عن المخطط، يفوز المخطط.

تنطبق طبقتان من التحقق. يفرض المخطط العام *أشكالًا آمنة* محدودة (أنماط وأطوال ترفض القيم الشبيهة بالخيارات أو غير المحدودة). فوق ذلك، يُطبِّق `catalog validate` مُحلِّلات دلالية إلزامية: SemVer دقيق للإصدارات، وSRI من نوع SHA-512 لقيم السلامة (integrity)، وتحليل تعبير SPDX للتراخيص، ورفض المفاتيح المكررة. يمكن أن تُطابق قيمة ما نمط المخطط وتُرفَض دلاليًا مع ذلك.

قواعد المستوى الأعلى: الإدخال هو كائن YAML واحد، و`additionalProperties: false`
(تُرفض الحقول غير المعروفة)، وجميع الحقول أدناه مطلوبة باستثناء `media` — الحقل الاختياري الوحيد.

## الحقول ذات المستوى الأعلى

| الحقل             | النوع    | مطلوب | الملخص                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   نعم    | يجب أن يكون `1` بالضبط                                          |
| `id`              | string  |   نعم    | معرّف الإدخال بصيغة kebab-case بأحرف صغيرة؛ يجب أن يطابق اسم الملف        |
| `name`            | string  |   نعم    | الاسم المعروض، من 1 إلى 120 حرفًا                                |
| `description`     | object  |   نعم    | ملخص إنجليزي مُنسَّق (curated) بالإضافة إلى مسار دليله                 |
| `unofficial`      | const   |   نعم    | يجب أن يكون `true` بالضبط                                        |
| `kind`            | enum    |   نعم    | مُميِّز القطعة القانوني (canonical artifact discriminator)                                             |
| `primaryCategory` | enum    |   نعم    | فئة قدرة أساسية واحدة                                       |
| `tags`            | array   |   نعم    | وسوم فريدة بصيغة kebab-case بأحرف صغيرة (يمكن أن تكون فارغة)               |
| `source`          | object  |   نعم    | المستودع الأصلي، ومعرّف العقدة، والمسار الفرعي، والالتزام المثبَّت       |
| `creator`         | object  |   نعم    | مُعرِّف GitHub العام للمنشئ       |
| `package`         | object  |   نعم    | واصف التثبيت القانوني (npm **أو** source)                     |
| `dsh`             | object  |   نعم    | ملفات DSH الشخصية ومسار دليل التكامل الأصلي             |
| `repositoryScope` | enum    |   نعم    | `dedicated` أو `monorepo`                                     |
| `popularity`      | object  |   نعم    | سياسة النجوم وعدد النجوم (مشروط بالنطاق)            |
| `license`         | object  |   نعم    | تعبير SPDX لترخيص المصدر الأصلي                              |
| `verification`    | object  |   نعم    | حالة التحقق، ووقت الفحص، والهوية، واختبار التشغيل السريع      |
| `provenance`      | object  |   نعم    | عناوين URL عامة لنقاش/تعليق أو `null`                      |
| `media`           | array   |    لا    | حتى 6 لقطات شاشة/مقاطع فيديو، وكل عنوان URL مثبَّت على `source.commit` |

### `schemaVersion`

ثابت `1`. يُحدِّد الإصدار 1 من المخطط العام؛ وأي قيمة أخرى غير صالحة.

### `id`

سلسلة نصية تطابق `^[a-z0-9]+(?:-[a-z0-9]+)*$` — بصيغة kebab-case بأحرف صغيرة، بلا واصلات في البداية/النهاية ولا واصلات مزدوجة. وفق [CONTRIBUTING.md](../../CONTRIBUTING.md)، يجب تسمية ملف الإدخال `catalog/plugins/<id>.yaml` بنفس القيمة تمامًا؛ ويرفض المُدقِّق (validator) أي تعارض (`id-filename-mismatch`). يجب أيضًا أن يبدأ المعرّف بمساحة اسم (namespace) المُنشئ: مُعرِّف `creator.github` بأحرف صغيرة، مع طيّ كل سلسلة أحرف خارج `[a-z0-9]` إلى واصلة واحدة `-`، متبوعةً بـ `-` (`id-creator-prefix`).

### `name`

اسم معروض حر الصيغة، `minLength: 1`، `maxLength: 120`.

### `description`

كائن يحتوي على خاصيتين مطلوبتين بالضبط (لا يُسمح بغيرهما):

| الخاصية        | النوع   | القواعد                                                                 |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `en`           | string | ملخص إنجليزي، من 20 إلى 320 حرفًا                                    |
| `evidencePath` | string | نمط مسار نسبي إلى المستودع؛ بلا `/` في البداية، وبلا شرطات مائلة عكسية، وبلا مقاطع `.`/`..` |

يجب أن يكون الملخص الإنجليزي مُنسَّقًا (curated) من الملف الموجود في `evidencePath` كما هو عند `source.commit` — وليس منسوخًا من كتالوج آخر.

### `unofficial`

ثابت `true`. علامة قابلة للقراءة آليًا تُبيِّن أن الإدخال غير رسمي.

### `kind`

مُميِّز نوع القطعة **الوحيد** (لا يوجد حقل ثانٍ لنوع التكامل). واحد من:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

المعاني وتبعاتها على الترتيب (ranking) مُعرَّفة في [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

واحدة من الفئات الأربع عشرة للقدرة:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

توجد تسميات العرض وإرشادات الاختيار في [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

مصفوفة سلاسل نصية فريدة، كل واحدة تطابق `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case بأحرف صغيرة). لا يفرض المخطط عددًا أدنى.

### `source`

كائن يحتوي على أربع خصائص مطلوبة بالضبط:

| الخاصية            | النوع           | القواعد                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | عنوان URL بصيغة `https://github.com/<owner>/<repo>`؛ يتبع المالك قواعد اسم مستخدم GitHub، واسم المستودع من 1 إلى 100 حرف، ولا يجوز أن يكون `.`/`..` ولا أن ينتهي بـ `.git` |
| `repositoryNodeId` | string         | معرّف عقدة مستودع GitHub الثابت، غير فارغ                         |
| `subpath`          | string or null | المسار الفرعي للإضافة داخل المستودع (نفس نمط المسار النسبي الآمن مثل `evidencePath`)، أو `null` لإضافة عند جذر المستودع |
| `commit`           | string         | معرّف التزام سداسي عشري كامل مكوّن من 40 حرفًا                               |

يجب أن يحلّ التحقق من الكتالوج `repositoryNodeId` ويرفض تعارض عنوان URL للمستودع — هذا الحلّ هو بوابة من جانب المشرف، وليس جزءًا من الفحص البنيوي المحلي.

### `creator`

كائن يحتوي على خاصية واحدة مطلوبة:

| الخاصية  | النوع   | القواعد                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | اسم مستخدم GitHub (من 1 إلى 39 حرفًا، وفق قواعد معرّف GitHub) |

يُشتَقّ عنوان URL للملف الشخصي العام دائمًا كـ `https://github.com/<handle>`؛ ولا يوجد حقل ملف شخصي ثانٍ مُخزَّن، لذا لا يمكن أن يختلفا أبدًا.

### `package`

واصف التثبيت القانوني. وهو بيانات، وليس أمر شل أبدًا، ويأخذ واحدًا بالضبط من شكلين (`oneOf`):

**حزمة npm** — مطلوب `ecosystem`، و`name`، و`version`؛ واختياري `integrity`:

| الخاصية    | النوع  | القواعد                                                                      |
| ----------- | ----- | ---------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                        |
| `name`      | string | صيغة اسم حزمة npm (مُقيَّدة النطاق اختياريًا)، بحد أقصى 214 حرفًا                 |
| `version`   | string | صيغة إصدار دقيقة `x.y.z` (prerelease/build اختياريان)؛ تُرفَض النطاقات (ranges). تشترط الطبقة الدلالية إضافيًا SemVer دقيقًا وقابلًا للتحليل |
| `integrity` | string | صيغة SRI اختيارية `sha512-…`، من 8 إلى 256 حرفًا. يجب أن تُحلِّله الطبقة الدلالية كـ SRI صالح من نوع SHA-512 |

**تثبيت من المصدر (source)** — مطلوب `ecosystem` فقط:

| الخاصية    | النوع  | القواعد    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

لا يُخزِّن واصف المصدر عمدًا أي شيء آخر: يُشتَقّ المستودع، والالتزام، والمسار الفرعي من `source`، بحيث لا تُكرَّر القيم المتغيّرة أبدًا.

### `dsh`

دليل تكامل DSH الأصلي:

| الخاصية       | النوع   | القواعد                                                          |
| -------------- | ------ | ------------------------------------------------------------------ |
| `profiles`     | array  | ملف شخصي فريد واحد على الأقل يطابق `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | مسار نسبي آمن لدليل تكامل DSH عند `source.commit` |

### `repositoryScope`

إما `dedicated` (نجوم المستودع تخصّ هذه الإضافة بالذات) أو `monorepo` (الإضافة مسار فرعي أو حزمة داخل مشروع أوسع). تُوجِّه هذه القيمة قواعد الشعبية المشروطة أدناه.

### `popularity`

| الخاصية       | النوع            | القواعد                                                |
| -------------- | --------------- | ---------------------------------------------------- |
| `starsPolicy`  | enum            | `exact-repository` أو `undefined-parent-repository`  |
| `stars`        | integer or null | عدد صحيح غير سالب، أو `null`                      |

القواعد المشروطة (مفروضة بواسطة كتل `allOf` في المخطط):

- يفرض `repositoryScope: monorepo` `starsPolicy: undefined-parent-repository` و`stars: null`. لا تُنسَب نجوم المشروع الأصلي أبدًا إلى إضافة في مستودع أحادي.
- يفرض `repositoryScope: dedicated` `starsPolicy: exact-repository` وعددًا صحيحًا `stars >= 0`.

راجع [docs/RANKING.md](../../docs/RANKING.md) لمعرفة كيف تُغذّي هذه القيم مُسنِد الترتيب (ranking predicate).

### `license`

| الخاصية | النوع   | القواعد                                                          |
| -------- | ------ | ---------------------------------------------------------------- |
| `spdx`   | string | صيغة تعبير SPDX، من 2 إلى 256 حرفًا، بلا واصلة في البداية          |

يفرض المخطط فقط صيغة حرفية آمنة؛ ويجب أن يُحلِّل التحقق من الكتالوج القيمة ويُطبِّعها باستخدام مُحلِّل تعبير SPDX حقيقي. سجِّل التعبير الكامل للمصدر الأصلي (upstream) الموثَّق عند الالتزام المثبَّت (على سبيل المثال `Apache-2.0` أو `MIT OR GPL-3.0-only`).

### `verification`

يُطبَّق التحقق على `source.commit`. كائن يحتوي على أربع خصائص مطلوبة:

| الخاصية              | النوع           | القواعد                                                  |
| --------------------- | -------------- | -------------------------------------------------------- |
| `status`              | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`           | string         | طابع زمني للفحص بصيغة `date-time`           |
| `repositoryIdentity`  | const          | يجب أن يكون `resolved`                                          |
| `smokeTest`           | object or null | سجل اختبار التشغيل السريع، أو `null` عندما لا يوجد اختبار مؤهَّل |

عند وجوده، يشترط `smokeTest`:

| الخاصية         | النوع   | القواعد                                                             |
| ---------------- | ------ | -------------------------------------------------------------------- |
| `installTarget`  | const  | `canonical-install-descriptor` — يُشير إلى `package` أو المصدر المثبَّت دون تكرار القيم المتغيّرة |
| `check`          | object | `name` (صيغة اسم حزمة) و`version` (صيغة إصدار دقيقة) مطلوبان |
| `result`         | const  | `passed` — لا يُسجَّل اختبار تشغيل سريع فاشل كاختبار تشغيل سريع    |

قاعدة مشروطة: يشترط `status: verified` كائن `smokeTest` غير فارغ (non-null). تستخدم الإدخالات بلا دليل اختبار تشغيل سريع قابل للمراجعة `status: eligible` و`smokeTest: null`. لا تُشكِّل أي حالة تزكية أو شهادة أمان — راجع [docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

روابط إثبات مصدر عامة، كل واحد منها URI أو `null`:

| الخاصية      | النوع          | القواعد                                            |
| ------------- | ------------- | ------------------------------------------------- |
| `discussion`  | string or null | عنوان URL عام لنقاش (Discussion) عندما يكون موجودًا            |
| `comment`     | string or null | عنوان URL عام لتعليق عندما يكون موجودًا               |

### `media`

الحقل الاختياري الوحيد. مصفوفة تضم **6** عناصر كحدٍّ أقصى، يصف كل عنصر لقطة شاشة واحدة أو مقطع فيديو قصيرًا للإضافة:

| الخاصية | النوع | القواعد |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` أو `video` |
| `url`    | string | عنوان URL ثابت على GitHub، بحد أقصى 2048 حرفًا (انظر أدناه) |
| `alt`    | string | نص بديل، من 1 إلى 120 حرفًا |

يجب أن يكون عنوان URL هنا ثابتًا مثل `source.commit` تمامًا. المسار
`raw.githubusercontent.com` الذي يحمل اسم فرع (`.../main/docs/shot.png`) يعرض ما يحتويه ذلك الفرع
اليوم، لذا سينشر الإدخال صورة غير مراجَعة في اليوم الذي يتحرك فيه الفرع. يُقبل شكلان فقط:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — مسار raw المثبَّت على الالتزام؛
- `https://github.com/<owner>/<repo>/assets/…` — عنوان الرفع المعنوَن بالمحتوى من GitHub، لعناصر `video`.

يفرض المخطط الشكل الآمن فقط (المضيف، ومرجع سداسي عشري من 40 حرفًا، وطول محدود). أما الباقي
فيفرضه `catalog validate` دلاليًا: يجب أن يثبّت عنوان URL قيمة `source.commit` **الخاصة بالإدخال
نفسه** داخل مستودع **الإدخال نفسه**، ويُرفض عنوان الفرع برسالة
`media[n].url must pin the entry commit, not a branch`.

احذف الحقل بالكامل عندما لا يكون هناك ما تعرضه — `media: []` ليست طريقة صالحة لقول "لا توجد
لقطات شاشة". الحقل إضافي: تظل الإدخالات المنشورة قبل وجوده صالحة، ويقرأ المستهلك الذي يتجاهله كل
إدخال تمامًا كما كان.

## إدخالات `kind: skill`

يُعرِّف الإصدار 1 من المخطط أيضًا عقد إدخال ثانيًا قائمًا بذاته لـ `kind: skill`، منشورًا باسم [`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) (المرحلة 0 من SKL-01). وهو لا يمسّ أبدًا مخطط الإضافات أعلاه: تستمر الإدخالات ذات `kind: plugin` في التحقق تمامًا كما كانت من قبل، وملف مخطط المهارة (skill) هو مصدر الحقيقة لإدخالات المهارات بنفس الطريقة التي يكون بها مخطط الإضافات مصدر الحقيقة لإدخالات الإضافات.

المهارة لا تُثبَّت، بل **تُحمَّل** بواسطة بيئة التشغيل (harness)، لذا فإن واصفات التثبيت الخاصة بالإضافات فقط (`package` و`dsh`) لا وجود لها في إدخال المهارة وتُستبدل بـ `usage` + `compat`. كما تعيش المهارة كثيرًا في مجلد فرعي من مستودع يستضيف مهارات عديدة، لذا فإن الهوية وإزالة التكرار (dedupe) هما `source.repository` + `source.subpath` وليس المستودع وحده. ولا يقبل إدخال المهارة معرض `media`: فالمهارة نص تُحمِّله بيئة التشغيل، فليس هناك ما يُلتقط له لقطة شاشة (`additionalProperties: false` هو ما يفرض ذلك).

تحتفظ هذه الحقول تمامًا بالشكل والقواعد الموثَّقة لإدخالات الإضافات أعلاه: `schemaVersion`، و`id`، و`name`، و`description`، و`unofficial`، و`primaryCategory`، و`tags`، و`source`، و`creator`، و`repositoryScope`، و`license`، و`provenance`. كل حقل مطلوب باستثناء `triggers`، حقل المهارة الاختياري الوحيد.

### الحقول الخاصة بالمهارة

| الحقل                | النوع   | مطلوب | القواعد                                                       |
| -------------------- | ------ | :------: | ------------------------------------------------------------- |
| `kind`               | const  |   نعم    | يجب أن يكون `skill` بالضبط                                      |
| `skillScope`         | enum   |   نعم    | `repository` (المستودع كله **هو** المهارة) أو `subdirectory` (المهارة تعيش في `source.subpath`) |
| `triggers`           | array  |    لا    | متى تنطلق المهارة — النص الذي يُقيِّمه المستخدم قبل تحميلها. سلسلة نصية فريدة واحدة على الأقل، كل واحدة من 3 إلى 200 حرف؛ احذف الحقل بالكامل عندما لا يوجد أي منها (`triggers: []` غير صالح) |
| `usage.load`         | string |   نعم    | كيف تُحمِّل بيئة التشغيل المهارة، من 1 إلى 200 حرف؛ المهارة تُحمَّل ولا تُثبَّت أبدًا |
| `usage.evidencePath` | string |   نعم    | مسار نسبي آمن (نفس نمط `description.evidencePath`) إلى دليل التحميل عند `source.commit` |
| `compat.harnessMin`  | string |   نعم    | الحد الأدنى لإصدار بيئة التشغيل الذي تم التحقق من المهارة مقابله؛ صيغة `x.y.z` دقيقة (prerelease/build اختياريان)، بحد أقصى 64 حرفًا. تشترط الطبقة الدلالية إضافيًا SemVer دقيقًا وقابلًا للتحليل |

القواعد المشروطة (مفروضة بواسطة كتل `allOf` في مخطط المهارة):

- يفرض `skillScope: subdirectory` أن يكون `source.subpath` سلسلة مسار نسبي آمن — المهارة المستضافة في مجلد فرعي يجب أن تُثبِّت ذلك المجلد الفرعي.
- يفرض `skillScope: repository` القيمة `source.subpath: null` — مهارة المستودع الكامل يجب ألا تُعلن مسارًا فرعيًا.

يحتفظ `verification` بشكل الإضافات (`status`، و`checkedAt`، و`repositoryIdentity`، و`smokeTest`)، لكن `smokeTest` يجب أن يكون `null` بالضبط: فالمهارة لا تملك اختبار تشغيل سريع للتثبيت، ومراجعة المحتوى هي بوابة القبول. لا يحمل مخطط المهارة شرط `status: verified` → `smokeTest` ولا شروط `repositoryScope` → `popularity`؛ فهذه الارتباطات قواعد خاصة بمخطط الإضافات فقط.

### الطبقة الدلالية للمهارات

فوق المخطط، يُطبِّق التحقق من الكتالوج نفس المُحلِّلات الدلالية الإلزامية المُطبَّقة على الإضافات حيثما وُجدت الحقول: يجب أن يُحلَّل `license.spdx` كتعبير SPDX صالح (`invalid-spdx`)، ويجب أن يكون `compat.harnessMin` بصيغة SemVer دقيقة (`invalid-semver`). ولا توجد حالة `invalid-sri` — فالمهارة لا تملك `package.integrity`.

### هوية المهارة وإزالة التكرار

المفتاح القانوني للمهارة هو `skill:<source.repositoryNodeId>:<normalized subpath>`. يُطبَّع المسار الفرعي لأغراض الهوية فقط: تتحول الشرطات المائلة العكسية إلى `/`، وتُحذف المقاطع الفارغة ومقاطع `.`، والنتيجة الفارغة (أو `subpath: null`) تصبح `.` — أي المستودع كله. أما المسار الفرعي الذي يحتوي على بايتات NUL أو مقاطع `..` فيُرفض ولا "يُنظَّف" أبدًا. مهارتان من نفس المستودع هما إدخالان؛ ونفس المستودع + المسار الفرعي مرتين هو تصادم.

### مثال مهارة بالحد الأدنى

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

## ما لا يفحصه المخطط

المخطط محلي وبنيوي عمدًا. وهو لا يتحقق من وجود المستودع، أو تطابق معرّف العقدة مع عنوان URL، أو وجود مسارات الأدلة عند الالتزام المثبَّت، أو دقة عدد النجوم، أو ملكية المنشئ للمصدر. تنتمي تلك الفحوصات إلى بوابات مراجعة المشرفين الموصوفة في [CONTRIBUTING.md](../../CONTRIBUTING.md) و[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: dd689b0ee2a7910f069d498c831668b022852a8a20cc64efb3516ce6e289c4dd -->
