# مرجع الأوامر (CLI) — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **العربية**

> **مشروع مجتمعي غير رسمي. غير منتسب لشركة DeepSeek ولا معتمد أو ممول منها.**
> أسماء DeepSeek وعلاماتها التجارية ملك لأصحابها المعنيين.

توثّق هذه الصفحة الـ CLI المنشور تمامًا كما يتصرف في الإصدار `1.0.1`. كل ملخص أمر (synopsis) وكل
علامة (flag) أدناه مأخوذة من مخرجات `--help` الخاصة بالأمر المنشور نفسه؛ لا شيء هنا يصف سلوكًا لم
يُنشَر بعد. يُطوَّر الـ CLI في هذا المستودع تحت [`cli/`](../../cli) ويُنشَر على npm كحزمة
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins)، مع إثبات مصدر (provenance
attestation) يربط كل بناء (build) بالالتزام (commit) وتشغيل سير العمل (workflow run) اللذين
أنتجاه.

```bash
npx omni-dsh-plugins --help
```

## مبادئ التصميم في الإصدار v1.0.1

- **للقراءة فقط افتراضيًا.** لا تُعدِّل `catalog`، و`search`، و`info`، و`list`، و`doctor` أبدًا
  الملفات الشخصية (profiles)، ولا تكتب ملفات، ولا تُشغِّل كود إضافة.
- **بوابة موافقة لتنفيذ الكود.** ترفض `add`، و`update`، و`remove` تشغيل كود دورة حياة DSH/pnpm ما
  لم تُمرِّر `--allow-code-execution`. بدونها، استخدم `--dry-run` لرؤية الخطة المُتحقَّق منها.
- **سياسة Windows الأصلية.** في الإصدار v1.0.1، تكون `add`/`update`/`remove` الأصلية على Windows
  مع تنفيذ الكود مُعطَّلة؛ استخدم WSL. يبقى الـ dry-run والأوامر للقراءة فقط متاحة، وتتطلب علامات
  الاسترجاع (recovery markers) الأصلية على Windows استرجاعًا يدويًا موثَّقًا.
- **مدخلات مثبَّتة.** يمكن أن يكون مدخل الكتالوج دليلًا محليًا، أو ملف لقطة (snapshot)، أو عنوان
  URL للقطة عامة مثبَّتة، مقيَّدًا اختياريًا بمراجعة (revision) دقيقة مكوّنة من 40 حرفًا.

## الخيارات المشتركة

تظهر هذه الخيارات على الأوامر التي تستهلك الكتالوج (`catalog validate`، و`search`، و`info`،
و`add`، و`update`، و`remove`، و`doctor`):

| الخيار                    | المعنى                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | دليل كتالوج محلي، أو ملف لقطة، أو عنوان URL للقطة عامة مثبَّتة |
| `--revision <sha>`        | مراجعة لقطة دقيقة مكوّنة من 40 حرفًا                               |
| `--json`                  | إخراج JSON مستقر                                            |

الخيارات العامة: يطبع `-V, --version` إصدار الـ CLI؛ ويطبع `-h, --help` تعليمات المساعدة لأي أمر
(يعمل `dsh-plugins help [command]` أيضًا).

## رموز الخروج

يستخدم الـ CLI رموز خروج عملية (process exit codes) تقليدية:

| رمز الخروج | المعنى                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | نجاح (بما في ذلك نتائج "فارغة لكن صالحة" مثل كتالوج فارغ)     |
| `1`       | فشل: خطأ تحقق، أو إدخال غير موجود، أو خيار مطلوب مفقود، أو فحص تشخيصي يُبلِّغ عن خطأ |

أمثلة لوحظت في الإصدار v1.0.1: يخرج `catalog validate` على كتالوج فارغ صالح بـ `0` مع
`0 entries valid; catalog is empty`؛ ويخرج `info <unknown-id>` بـ `1` مع `Plugin not found`؛
ويخرج `doctor` بـ `1` عندما يُبلِّغ أي فحص (مثل عدم وجود ملف `dsh` التنفيذي) عن خطأ.

## الأوامر

### `catalog` — التحقق من سطوح الكتالوج العامة

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — يتحقق من YAML الكتالوج ودلالاته: تحليل YAML آمن، والمخطط العام،
  وتحليل تعبير SPDX، وSemVer دقيق، وSRI من نوع SHA-512، ورفض المعرّفات المكررة / "عقدة المستودع +
  المسار الفرعي". وهو محلي وللقراءة فقط: لا يتواصل مع GitHub، ولا يحلّ هوية المستودع، ولا يفحص
  الأدلة عند الالتزام المثبَّت. هذا هو بالضبط الأمر الذي تُشغِّله مهمة CI الخاصة بـ
  `catalog-validation` على كل طلب سحب للكتالوج.
- **`catalog docs-check [root]`** — يتحقق من وجود توثيق الكتالوج العام المطلوب ومن توازن أسيجة
  Markdown (fences).
- **`catalog github-forms-check [root]`** — يتحقق من نماذج مشكلات (issue) GitHub العامة
  المُهيكَلة (مطالبة، تصحيح، إزالة).

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — البحث محليًا في حقول الكتالوج العامة

```text
dsh-plugins search [options] <query...>
```

يبحث محليًا في حقول الكتالوج العامة ضمن مدخل الكتالوج المُختار. يطبع الإدخالات المطابقة، أو
`No plugins found.` (خروج `0`) عندما لا يوجد أي تطابق.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — العثور على إضافات خارج الكتالوج

```text
dsh-plugins discover [options] <query...>
```

> يُشحَن `discover` في الإصدار `1.0.0`، أول إصدار تحت اسم هذه الحزمة.

يبحث أولًا في الكتالوج المُنسَّق، ثم — ما لم تُمرَّر `--offline` — في موضوع (topic) `dsh-plugin`
الحي على GitHub، بحيث تبقى الإضافة التي لم تُقدَّم بعد قابلة للعثور عليها. تحمل نتائج الكتالوج
الأدلة التي يحتفظ بها الكتالوج (الالتزام المثبَّت، والمنشئ، والترخيص)؛ ولا تحمل نتائج المجتمع أيًا
من ذلك وتُوسَم على هذا النحو، لأن لا شيء منها روجِع.

يُحدِّد `--limit <n>` عدد النتائج القصوى لكل طبقة (الافتراضي `8`). تُصدِر `--json` الشكل الآلي
المستقر، الذي لا يُترجَم (localized) أبدًا.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — عرض إدخال كتالوج عام واحد

```text
dsh-plugins info [options] <id>
```

يعرض إدخال كتالوج عام واحد حسب معرّف الإضافة القانوني. يخرج بـ `1` مع `Plugin not found: <id>`
عندما لا يكون المعرّف موجودًا في الكتالوج.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — إضافة إضافة كتالوج واحدة عبر تفويض DSH الرسمي

```text
dsh-plugins add [options] <id>
```

| الخيار                    | المعنى                                                            |
| ------------------------- | -------------------------------------------------------------------- |
| `--profile <name>`       | ملف DSH الشخصي المراد تعديله (مطلوب عمليًا؛ يفشل الأمر بدونه) |
| `--dry-run`              | يعرض الخطة المُتحقَّق منها دون ملفات أو عمليات فرعية               |
| `--allow-code-execution` | موافقة على كود دورة حياة DSH/pnpm (معطَّل على Windows الأصلي؛ استخدم WSL) |
| `--catalog` / `--revision` / `--json` | الخيارات المشتركة أعلاه                                  |

دلالة الـ dry-run في هذا الإصدار: يحلّ الأمر خطة الإدخال المثبَّت ويتحقق منها ويطبعها، دون إنشاء
ملفات أو تشغيل عمليات فرعية. يُفوِّض التثبيت الفعلي لأدوات DSH الرسمية ولا يمضي قدمًا إلا مع
`--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — تحديث إضافة كتالوج واحدة عبر تفويض DSH الرسمي

```text
dsh-plugins update [options] <id>
```

نفس خيارات ودلالات موافقة `add`: `--profile <name>`، و`--dry-run`، و`--allow-code-execution`،
بالإضافة إلى خيارات الكتالوج المشتركة.

### `remove` — إزالة إضافة كتالوج واحدة مُدارة عبر تفويض DSH الرسمي

```text
dsh-plugins remove [options] <id>
```

نفس خيارات ودلالات موافقة `add`. تُزال فقط التثبيتات المُدارة عبر الكتالوج.

### `recover` — استرجاع تعديل POSIX محتفَظ به

```text
dsh-plugins recover
```

يسترجع تعديل POSIX محتفَظ به بعد `add`/`update`/`remove` مُقاطَع. عند عدم وجود شيء معلَّق، يطبع
`No mutation recovery is pending.` ويخرج بـ `0`. يبقى الاسترجاع الأصلي على Windows يدويًا، وفق
السياسة الموثَّقة.

### `list` — سرد التثبيتات المُدارة عبر الكتالوج

```text
dsh-plugins list [--profile <name>] [--json]
```

يسرد التثبيتات المُدارة عبر الكتالوج دون تعديل الملفات الشخصية. يُصفِّي `--profile <name>` حسب
ملف DSH الشخصي. عند عدم وجود تثبيتات، يطبع `No catalog-managed plugins installed.` ويخرج بـ `0`.

### `doctor` — تشخيصات للقراءة فقط

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

يُشغِّل تشخيصات للقراءة فقط لـ Node، وDSH، وسياسة Windows الأصلية، والكتالوج. يُبلِّغ كل فحص بـ
`ok` أو `error`؛ وأي `error` يجعل رمز الخروج الإجمالي `1`. مثال على المخرجات على جهاز بلا ملف
`dsh` التنفيذي:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## ما لا يُثبته التحقق المحلي

تؤكد عملية `catalog validate` الناجحة (خضراء) البنية والدلالة المحلية فقط. وهي لا تُثبِت هوية
المستودع البعيدة، أو ملكية المنشئ، أو الدليل عند الالتزام المثبَّت — يُطبِّق المشرفون تلك البوابات
المنفصلة لإثبات المصدر قبل أي دمج، كما هو موصوف في [CONTRIBUTING.md](../../CONTRIBUTING.md)
و[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
