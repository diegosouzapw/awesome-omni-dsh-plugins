# مرجع اسکیمای ورودی کاتالوگ

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **فارسی**

> **پروژه غیررسمی جامعه. وابسته به، تأییدشده توسط یا اسپانسرشده توسط DeepSeek نیست.**
> نام‌ها و علائم DeepSeek متعلق به مالک مربوطه‌شان است.

این مرجع فیلد‌به‌فیلد برای [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) است،
JSON Schema عمومی (پیش‌نویس 2020-12) که هر فایل زیر `catalog/plugins/` باید آن را برآورده کند.
خودِ فایل اسکیما منبع حقیقت است؛ هرگاه این صفحه با اسکیما مغایرت داشته باشد، اسکیما برنده است.

دو لایهٔ اعتبارسنجی اعمال می‌شود. اسکیمای عمومی *شکل‌های امن* محدود را الزامی می‌کند (الگوها و
طول‌هایی که مقادیر شبیه‌گزینه یا نامحدود را رد می‌کنند). روی آن، `catalog validate`
تجزیه‌کننده‌های معنایی الزامی را اعمال می‌کند: SemVer دقیق برای نسخه‌ها، SRI از نوع SHA-512 برای
مقادیر integrity، تجزیهٔ عبارت SPDX برای مجوزها و رد کلیدهای تکراری. یک مقدار می‌تواند با الگوی
اسکیما مطابقت داشته باشد و همچنان به‌صورت معنایی رد شود.

قواعد سطح بالا: ورودی یک شیء YAML واحد است، `additionalProperties: false`
(فیلدهای ناشناخته رد می‌شوند)، و همهٔ فیلدهای زیر الزامی هستند به‌جز `media` — تنها فیلد اختیاری.

## فیلدهای سطح بالا

| فیلد               | نوع    | الزامی | خلاصه                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   بله    | باید دقیقاً `1` باشد                                           |
| `id`              | string  |   بله    | شناسهٔ ورودی به‌صورت kebab-case با حروف کوچک؛ باید با نام فایل مطابقت داشته باشد |
| `name`            | string  |   بله    | نام نمایشی، ۱ تا ۱۲۰ کاراکتر                                |
| `description`     | object  |   بله    | خلاصهٔ انگلیسی ویرایش‌شده به‌همراه مسیر شاهدش               |
| `unofficial`      | const   |   بله    | باید دقیقاً `true` باشد                                        |
| `kind`            | enum    |   بله    | تمایزدهندهٔ قانونیِ مصنوع                                     |
| `primaryCategory` | enum    |   بله    | تک دستهٔ اصلی قابلیت                                          |
| `tags`            | array   |   بله    | برچسب‌های یکتای kebab-case با حروف کوچک (می‌تواند خالی باشد) |
| `source`          | object  |   بله    | ریپازیتوری اصلی، شناسهٔ گره، زیرمسیر و کامیت پین‌شده       |
| `creator`         | object  |   بله    | هندل عمومی GitHub سازنده                                      |
| `package`         | object  |   بله    | توصیف‌گر نصب قانونی (npm **یا** source)                     |
| `dsh`             | object  |   بله    | پروفایل‌های DSH و مسیر شاهد یکپارچگی بومی                  |
| `repositoryScope` | enum    |   بله    | `dedicated` یا `monorepo`                                     |
| `popularity`      | object  |   بله    | سیاست ستاره‌ها و تعداد ستاره (مشروط به scope)             |
| `license`         | object  |   بله    | عبارت SPDX مجوز بالادستی                                    |
| `verification`    | object  |   بله    | وضعیت اعتبارسنجی، زمان بررسی، هویت و smoke test            |
| `provenance`      | object  |   بله    | لینک‌های Discussion/کامنت عمومی یا `null`                   |
| `media`           | array   |    خیر    | حداکثر ۶ تصویر صفحه/ویدئو، هر URL به `source.commit` سنجاق‌شده |

### `schemaVersion`

ثابت `1`. نسخهٔ ۱ اسکیمای عمومی را شناسایی می‌کند؛ هر مقدار دیگری نامعتبر است.

### `id`

رشته‌ای که با `^[a-z0-9]+(?:-[a-z0-9]+)*$` مطابقت دارد — kebab-case با حروف کوچک، بدون خط‌تیرهٔ
ابتدایی/انتهایی یا دوگانه. طبق [CONTRIBUTING.md](../../CONTRIBUTING.md)، فایل ورودی باید
`catalog/plugins/<id>.yaml` با همان مقدار نام‌گذاری شود؛ اعتبارسنج ناهماهنگی را رد می‌کند
(`id-filename-mismatch`). شناسه همچنین باید با فضای نام سازنده شروع شود: هندل `creator.github`
با حروف کوچک، با تبدیل هر دنبالهٔ کاراکتری خارج از `[a-z0-9]` به یک `-`، به‌همراه `-`
(`id-creator-prefix`).

### `name`

نام نمایشی آزادشکل، `minLength: 1`، `maxLength: 120`.

### `description`

شیئی با دقیقاً دو ویژگی الزامی (هیچ ویژگی دیگری مجاز نیست):

| ویژگی          | نوع    | قواعد                                                                 |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `en`           | string | خلاصهٔ انگلیسی، ۲۰ تا ۳۲۰ کاراکتر                                    |
| `evidencePath` | string | الگوی مسیر نسبیِ ریپو؛ بدون `/` ابتدایی، بدون بک‌اسلش، بدون بخش‌های `.`/`..` |

خلاصهٔ انگلیسی باید از فایل موجود در `evidencePath` همان‌طور که در `source.commit` وجود دارد
ویرایش شده باشد — نه کپی‌شده از کاتالوگ دیگری.

### `unofficial`

ثابت `true`. نشانگر قابل‌خواندن توسط ماشین که فهرست غیررسمی است.

### `kind`

**تنها** تمایزدهندهٔ نوع مصنوع (هیچ فیلد دوم برای نوع یکپارچگی وجود ندارد). یکی از:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

معانی و پیامدهای آن‌ها بر رتبه‌بندی در [docs/CATEGORIES.md](../../docs/CATEGORIES.md) تعریف
شده‌اند.

### `primaryCategory`

یکی از چهارده دستهٔ قابلیت:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

برچسب‌های نمایشی و راهنمای انتخاب در [docs/CATEGORIES.md](../../docs/CATEGORIES.md) هستند.

### `tags`

آرایه‌ای از رشته‌های یکتا که هرکدام با `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case با حروف کوچک)
مطابقت دارند. اسکیما هیچ حداقل تعدادی را الزامی نمی‌کند.

### `source`

شیئی با دقیقاً چهار ویژگی الزامی:

| ویژگی               | نوع            | قواعد                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | URL به‌صورت `https://github.com/<owner>/<repo>`؛ owner از قواعد نام‌کاربری GitHub پیروی می‌کند، نام ریپو ۱ تا ۱۰۰ کاراکتر، نمی‌تواند `.`/`..` باشد یا با `.git` پایان یابد |
| `repositoryNodeId` | string         | شناسهٔ گرهٔ ریپازیتوری GitHub ثابت، غیرخالی                         |
| `subpath`          | string or null | زیرمسیر افزونه درون ریپازیتوری (همان الگوی مسیر نسبیِ امن `evidencePath`)، یا `null` برای افزونه‌ای در ریشهٔ ریپازیتوری |
| `commit`           | string         | OID کامیت هگزادسیمالِ کامل و ۴۰ کاراکتری                               |

اعتبارسنجی کاتالوگ باید `repositoryNodeId` را حل کند و ناهماهنگی URL ریپازیتوری را رد کند — این
حل‌کردن یک دروازهٔ سمت نگهدارنده است، نه بخشی از بررسی ساختاریِ محلی.

### `creator`

شیئی با یک ویژگی الزامی:

| ویژگی    | نوع    | قواعد                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | نام‌کاربری GitHub (۱ تا ۳۹ کاراکتر، قواعد هندل GitHub) |

URL پروفایل عمومی همیشه به‌صورت `https://github.com/<handle>` استخراج می‌شود؛ هیچ فیلد پروفایل
دومی ذخیره نمی‌شود، بنابراین این دو هرگز نمی‌توانند واگرا شوند.

### `package`

توصیف‌گر نصب قانونی. این داده است، هرگز دستور شل نیست، و دقیقاً یکی از دو شکل را می‌گیرد
(`oneOf`):

**بستهٔ npm** — الزامی: `ecosystem`، `name`، `version`؛ اختیاری: `integrity`:

| ویژگی    | نوع  | قواعد                                                                      |
| ----------- | ----- | ---------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | شکل نام بستهٔ npm (اختیاراً scope-دار)، حداکثر ۲۱۴ کاراکتر                 |
| `version`   | string | شکل نسخهٔ دقیق `x.y.z` (prerelease/build اختیاری)؛ بازه‌ها رد می‌شوند. لایهٔ معنایی به‌طور اضافی SemVer دقیق و قابل‌تجزیه را الزامی می‌کند |
| `integrity` | string | شکل اختیاری SRI به‌صورت `sha512-…`، ۸ تا ۲۵۶ کاراکتر. لایهٔ معنایی باید آن را به‌عنوان SRI معتبرِ SHA-512 تجزیه کند |

**نصب از منبع (source)** — فقط `ecosystem` الزامی است:

| ویژگی    | نوع  | قواعد    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

توصیف‌گر source عمداً چیز دیگری ذخیره نمی‌کند: ریپازیتوری، کامیت و زیرمسیر از `source` استخراج
می‌شوند، بنابراین مقادیر متغیر هرگز تکرار نمی‌شوند.

### `dsh`

شاهد یکپارچگی بومی DSH:

| ویژگی       | نوع   | قواعد                                                          |
| -------------- | ------ | ------------------------------------------------------------------ |
| `profiles`     | array  | حداقل یک نام پروفایل یکتا مطابق با `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | مسیر نسبیِ امن به شاهد یکپارچگی DSH در `source.commit` |

### `repositoryScope`

یا `dedicated` (ستاره‌های ریپازیتوری متعلق به همین افزونهٔ دقیق هستند) یا `monorepo` (افزونه
زیرمسیر یا بسته‌ای درون یک پروژهٔ گسترده‌تر است). این مقدار قواعد مشروط محبوبیت در زیر را هدایت
می‌کند.

### `popularity`

| ویژگی     | نوع            | قواعد                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` یا `undefined-parent-repository`  |
| `stars`      | integer or null | عدد صحیح غیرمنفی، یا `null`                      |

قواعد مشروط (اعمال‌شده توسط بلوک‌های `allOf` اسکیما):

- `repositoryScope: monorepo` `starsPolicy: undefined-parent-repository` و `stars: null` را
  **الزامی می‌کند**. ستاره‌های پروژهٔ والد هرگز به افزونهٔ مونوریپو نسبت داده نمی‌شوند.
- `repositoryScope: dedicated` `starsPolicy: exact-repository` و یک عدد صحیح `stars >= 0` را
  **الزامی می‌کند**.

برای اینکه این مقادیر چگونه به قاعدهٔ رتبه‌بندی تغذیه می‌شوند [docs/RANKING.md](../../docs/RANKING.md)
را ببینید.

### `license`

| ویژگی | نوع   | قواعد                                                          |
| -------- | ------ | ---------------------------------------------------------------- |
| `spdx`   | string | شکل عبارت SPDX، ۲ تا ۲۵۶ کاراکتر، بدون خط‌تیرهٔ ابتدایی          |

اسکیما فقط یک شکل کاراکتریِ امن را الزامی می‌کند؛ اعتبارسنجی کاتالوگ باید مقدار را با یک
تجزیه‌کنندهٔ واقعیِ عبارت SPDX تجزیه و نرمال‌سازی کند. عبارت کامل بالادستی را که در کامیت
پین‌شده شاهدش موجود است ثبت کنید (برای مثال `Apache-2.0` یا `MIT OR GPL-3.0-only`).

### `verification`

اعتبارسنجی روی `source.commit` اعمال می‌شود. شیئی با چهار ویژگی الزامی:

| ویژگی             | نوع           | قواعد                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | برچسب‌زمانی به فرمت `date-time` برای زمان بررسی           |
| `repositoryIdentity` | const          | باید `resolved` باشد                                     |
| `smokeTest`          | object or null | رکورد smoke test، یا `null` وقتی هیچ آزمون واجدشرایطی وجود ندارد |

وقتی موجود باشد، `smokeTest` این‌ها را الزامی می‌کند:

| ویژگی        | نوع   | قواعد                                                             |
| --------------- | ------ | ------------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — بدون تکرار مقادیر متغیر به `package` یا منبع پین‌شده اشاره می‌کند |
| `check`         | object | `name` (شکل نام بسته) و `version` (شکل نسخهٔ دقیق) الزامی‌اند |
| `result`        | const  | `passed` — smoke test ناموفق به‌عنوان smoke test ثبت نمی‌شود    |

قاعدهٔ مشروط: `status: verified` یک شیء غیر-null از `smokeTest` را **الزامی می‌کند**. ورودی‌های
بدون شاهد smoke test قابل‌بازبینی از `status: eligible` و `smokeTest: null` استفاده می‌کنند.
هیچ وضعیتی تأیید یا گواهی امنیتی نیست — ببینید [docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

لینک‌های منشأ عمومی، هرکدام یک URI یا `null`:

| ویژگی     | نوع          | قواعد                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string or null | URL عمومی Discussion در صورت وجود            |
| `comment`    | string or null | URL عمومی کامنت در صورت وجود               |

### `media`

تنها فیلد اختیاری. آرایه‌ای با حداکثر **۶** مورد که هر مورد یک تصویر صفحه یا یک ویدئوی کوتاه از افزونه را توصیف می‌کند:

| ویژگی | نوع | قواعد |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` یا `video` |
| `url`    | string | نشانی تغییرناپذیر GitHub، حداکثر ۲۰۴۸ نویسه (پایین‌تر را ببینید) |
| `alt`    | string | متن جایگزین، ۱ تا ۱۲۰ نویسه |

نشانی اینجا باید به همان اندازهٔ `source.commit` تغییرناپذیر باشد. مسیر
`raw.githubusercontent.com` که نام یک شاخه را دارد (`.../main/docs/shot.png`) آنچه را که آن شاخه
امروز نگه می‌دارد نشان می‌دهد، پس روزی که شاخه جابه‌جا شود، ورودی تصویری بازبینی‌نشده منتشر می‌کند.
تنها دو شکل پذیرفته می‌شود:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — مسیر raw سنجاق‌شده به کامیت؛
- `https://github.com/<owner>/<repo>/assets/…` — نشانی بارگذاری محتوانشانی‌شدهٔ GitHub، برای موارد `video`.

شِما فقط شکل امن را الزام می‌کند (میزبان، ارجاع شانزده‌شانزدهی ۴۰ نویسه‌ای، طول کران‌دار). بقیه را
`catalog validate` به‌صورت معنایی الزام می‌کند: نشانی باید `source.commit` **خودِ ورودی** را در
مخزن **خودِ ورودی** سنجاق کند، و نشانی شاخه با
`media[n].url must pin the entry commit, not a branch` رد می‌شود.

وقتی چیزی برای نشان دادن نیست، فیلد را کاملاً حذف کنید — `media: []` راه معتبری برای گفتن «بدون
تصویر صفحه» نیست. این فیلد افزایشی است: ورودی‌هایی که پیش از وجود آن منتشر شده‌اند معتبر می‌مانند و
مصرف‌کننده‌ای که آن را نادیده بگیرد هر ورودی را دقیقاً مثل گذشته می‌خواند.

## ورودی‌های `kind: skill`

نسخهٔ ۱ اسکیما همچنین یک قرارداد ورودی دومِ خودکفا برای `kind: skill` تعریف می‌کند که به‌صورت
[`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) منتشر شده است (SKL-01 فاز ۰).
این قرارداد هرگز به اسکیمای پلاگین بالا دست نمی‌زند: ورودی‌های دارای `kind: plugin` دقیقاً مثل
قبل اعتبارسنجی می‌شوند، و فایل اسکیمای اسکیل برای ورودی‌های اسکیل همان‌طور منبع حقیقت است که
اسکیمای پلاگین برای ورودی‌های پلاگین است.

اسکیل نصب نمی‌شود، بلکه هارنس آن را **بارگذاری** می‌کند؛ بنابراین توصیف‌گرهای نصبِ مخصوص
پلاگین (`package`، `dsh`) روی ورودی اسکیل وجود ندارند و با `usage` + `compat` جایگزین می‌شوند.
اسکیل همچنین اغلب در زیرشاخه‌ای از ریپازیتوری‌ای زندگی می‌کند که میزبان اسکیل‌های فراوانی است،
پس هویت و حذف تکرار `source.repository` + `source.subpath` است، نه ریپازیتوری به‌تنهایی.
ورودی اسکیل هیچ گالری `media` را نمی‌پذیرد: اسکیل متنی است که هارنس بارگذاری می‌کند، پس چیزی
برای تصویربرداری وجود ندارد (`additionalProperties: false` همان چیزی است که این را الزام
می‌کند).

این فیلدها دقیقاً همان شکل و قواعدی را نگه می‌دارند که در بالا برای ورودی‌های پلاگین مستند
شده است: `schemaVersion`، `id`، `name`، `description`، `unofficial`، `primaryCategory`،
`tags`، `source`، `creator`، `repositoryScope`، `license`، `provenance`. همهٔ فیلدها الزامی
هستند به‌جز `triggers`، تنها فیلد اختیاری اسکیل.

### فیلدهای مخصوص اسکیل

| فیلد                 | نوع    | الزامی | قواعد                                                       |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   بله    | باید دقیقاً `skill` باشد                                    |
| `skillScope`         | enum   |   بله    | `repository` (کل ریپازیتوری **خودِ** اسکیل است) یا `subdirectory` (اسکیل در `source.subpath` زندگی می‌کند) |
| `triggers`           | array  |    خیر    | کِی اسکیل فعال می‌شود — متنی که کاربر پیش از بارگذاری آن ارزیابی می‌کند. دست‌کم ۱ رشتهٔ یکتا، هرکدام ۳ تا ۲۰۰ کاراکتر؛ وقتی هیچ‌کدام وجود ندارد فیلد را کاملاً حذف کنید (`triggers: []` نامعتبر است) |
| `usage.load`         | string |   بله    | این‌که هارنس اسکیل را چگونه بارگذاری می‌کند، ۱ تا ۲۰۰ کاراکتر؛ اسکیل بارگذاری می‌شود، هرگز نصب نمی‌شود |
| `usage.evidencePath` | string |   بله    | مسیر نسبی امن (همان الگوی `description.evidencePath`) به شاهد بارگذاری در `source.commit` |
| `compat.harnessMin`  | string |   بله    | حداقل نسخهٔ هارنسی که اسکیل در برابر آن راستی‌آزمایی شده است؛ شکل دقیق `x.y.z` (پیش‌انتشار/بیلد اختیاری)، حداکثر ۶۴ کاراکتر. لایهٔ معنایی علاوه بر این یک SemVer دقیق و قابل‌تجزیه الزام می‌کند |

قواعد شرطی (که بلوک‌های `allOf` اسکیمای اسکیل الزام می‌کنند):

- `skillScope: subdirectory` **الزام می‌کند** که `source.subpath` یک رشتهٔ مسیر نسبی امن
  باشد — اسکیلی که در یک زیرشاخه میزبانی می‌شود باید آن زیرشاخه را سنجاق کند.
- `skillScope: repository` **الزام می‌کند** `source.subpath: null` — اسکیلِ تمام‌ریپازیتوری
  نباید subpath اعلام کند.

`verification` شکل پلاگین را نگه می‌دارد (`status`، `checkedAt`، `repositoryIdentity`،
`smokeTest`)، اما `smokeTest` باید دقیقاً `null` باشد: اسکیل تست دود نصب ندارد و بازبینی
محتوا دروازهٔ پذیرش است. اسکیمای اسکیل شرطِ `status: verified` → `smokeTest` و شرط‌های
`repositoryScope` → `popularity` را ندارد؛ آن پیوندها فقط قواعد اسکیمای پلاگین هستند.

### لایهٔ معنایی برای اسکیل‌ها

روی اسکیما، اعتبارسنجی کاتالوگ همان تجزیه‌گرهای معنایی اجباریِ پلاگین‌ها را هرجا فیلدها
وجود دارند اعمال می‌کند: `license.spdx` باید به‌صورت یک عبارت SPDX معتبر تجزیه شود
(`invalid-spdx`)، و `compat.harnessMin` باید یک SemVer دقیق باشد (`invalid-semver`). حالت
`invalid-sri` وجود ندارد — اسکیل `package.integrity` ندارد.

### هویت و حذف تکرار اسکیل

کلید متعارف یک اسکیل `skill:<source.repositoryNodeId>:<normalized subpath>` است. subpath فقط
برای هویت نرمال‌سازی می‌شود: بک‌اسلش‌ها `/` می‌شوند، بخش‌های خالی و `.` حذف می‌شوند، و نتیجهٔ
خالی (یا `subpath: null`) به `.` تبدیل می‌شود — کل ریپازیتوری. subpath حاوی بایت NUL یا
بخش‌های `..` رد می‌شود، هرگز «پاک‌سازی» نمی‌شود. دو اسکیل از یک ریپازیتوری دو ورودی هستند؛
همان ریپازیتوری + subpath دو بار یک برخورد است.

### حداقلی‌ترین مثال اسکیل

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

## آنچه اسکیما بررسی نمی‌کند

اسکیما عمداً محلی و ساختاری است. این **بررسی نمی‌کند** که ریپازیتوری وجود دارد، شناسهٔ گره با URL
مطابقت دارد، مسیرهای شاهد در کامیت پین‌شده وجود دارند، تعداد ستاره دقیق است، یا سازنده مالک منبع
است. آن بررسی‌ها متعلق به دروازه‌های بازبینی نگهدارندگان هستند که در
[CONTRIBUTING.md](../../CONTRIBUTING.md) و [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md)
توصیف شده‌اند.

<!-- i18n-source-hash: 7928f14612f5cf4a63bfedceed6c38d862a829a4f88a0045efd277aec2b62f47 -->
