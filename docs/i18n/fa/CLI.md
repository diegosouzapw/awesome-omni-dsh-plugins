# مرجع CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **فارسی**

> **پروژه غیررسمی جامعه. وابسته به، تأییدشده توسط یا اسپانسرشده توسط DeepSeek نیست.**
> نام‌ها و علائم DeepSeek متعلق به مالک مربوطه‌شان است.

این صفحه CLI منتشرشده را دقیقاً همان‌طور که در نسخهٔ `1.0.1` رفتار می‌کند مستند می‌کند. هر synopsis
و پرچم زیر از خروجی `--help` خودِ دستور منتشرشده گرفته شده؛ هیچ‌چیز اینجا رفتاری منتشرنشده را
توصیف نمی‌کند. CLI در این ریپازیتوری زیر [`cli/`](../../cli) توسعه می‌یابد و به npm به‌عنوان
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins) منتشر می‌شود، با یک
تأییدیهٔ منشأ (provenance attestation) که هر بیلد را به کامیت و اجرای workflowی که آن را تولید
کرده پیوند می‌دهد.

```bash
npx omni-dsh-plugins --help
```

## اصول طراحی در v1.0.1

- **پیش‌فرض فقط‌خواندنی.** `catalog`، `search`، `info`، `list` و `doctor` هرگز پروفایل‌ها را
  تغییر نمی‌دهند، فایل نمی‌نویسند یا کد افزونه را اجرا نمی‌کنند.
- **دروازهٔ رضایت برای اجرای کد.** `add`، `update` و `remove` از اجرای کد چرخهٔ حیات DSH/pnpm
  خودداری می‌کنند مگر آنکه `--allow-code-execution` را ارسال کنید. بدون آن، از `--dry-run` برای
  دیدن طرح تأییدشده استفاده کنید.
- **سیاست Windows بومی.** در v1.0.1، دستورات `add`/`update`/`remove` بومیِ Windows با اجرای کد
  غیرفعال‌اند؛ از WSL استفاده کنید. dry-run و دستورات فقط‌خواندنی همچنان در دسترس‌اند، و
  نشانگرهای بازیابیِ بومیِ Windows نیازمند بازیابی دستیِ مستندشده هستند.
- **ورودی‌های پین‌شده.** ورودی کاتالوگ می‌تواند یک پوشهٔ محلی، یک فایل snapshot یا یک URL
  snapshot عمومیِ پین‌شده باشد، که اختیاراً به یک revision دقیق و ۴۰ کاراکتری قفل شده است.

## گزینه‌های مشترک

این گزینه‌ها روی دستوراتی که کاتالوگ را مصرف می‌کنند ظاهر می‌شوند (`catalog validate`، `search`،
`info`، `add`، `update`، `remove`، `doctor`):

| گزینه                    | معنی                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | پوشهٔ محلی کاتالوگ، فایل snapshot، یا URL snapshot عمومیِ پین‌شده |
| `--revision <sha>`        | revision دقیق و ۴۰ کاراکتری snapshot                               |
| `--json`                  | خروجی JSON پایدار                                            |

گزینه‌های سراسری: `-V, --version` نسخهٔ CLI را چاپ می‌کند؛ `-h, --help` راهنمای هر دستوری را
چاپ می‌کند (`dsh-plugins help [command]` هم کار می‌کند).

## کدهای خروج

CLI از کدهای خروج متعارف فرآیند استفاده می‌کند:

| کد خروج | معنی                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | موفقیت (شامل نتایج «خالی اما معتبر» مانند یک کاتالوگ خالی)     |
| `1`       | شکست: خطای اعتبارسنجی، ورودی پیدا نشد، گزینهٔ الزامیِ گم‌شده، یا یک بررسی تشخیصی که خطا گزارش می‌کند |

نمونه‌های مشاهده‌شده با v1.0.1: `catalog validate` روی یک کاتالوگ خالیِ معتبر با
`0 entries valid; catalog is empty` خارج می‌شود با کد `0`؛ `info <unknown-id>` با
`Plugin not found` با کد `1` خارج می‌شود؛ `doctor` وقتی هر بررسی‌ای (مانند یک اجرایی گم‌شدهٔ
`dsh`) خطا گزارش کند با کد `1` خارج می‌شود.

## دستورات

### `catalog` — اعتبارسنجی سطوح عمومی کاتالوگ

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — YAML و معناشناسی کاتالوگ را اعتبارسنجی می‌کند: تجزیهٔ YAML امن،
  اسکیمای عمومی، تجزیهٔ عبارت SPDX، SemVer دقیق، SRI از نوع SHA-512 و رد شناسهٔ تکراری /
  گرهٔ ریپازیتوری‌به‌علاوهٔ زیرمسیر. این محلی و فقط‌خواندنی است: با GitHub تماس نمی‌گیرد، هویت
  ریپازیتوری را حل نمی‌کند یا شاهد را در کامیت پین‌شده بازرسی نمی‌کند. این دقیقاً همان دستوری
  است که job سی‌آی `catalog-validation` روی هر pull request کاتالوگ اجرا می‌کند.
- **`catalog docs-check [root]`** — بررسی می‌کند که مستندات عمومی الزامی کاتالوگ وجود دارند و
  fenceهای Markdown متوازن‌اند.
- **`catalog github-forms-check [root]`** — فرم‌های ساختاریافتهٔ عمومیِ issue گیت‌هاب (ادعا،
  اصلاح، حذف) را بررسی می‌کند.

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — جستجوی محلیِ فیلدهای عمومی کاتالوگ

```text
dsh-plugins search [options] <query...>
```

فیلدهای عمومی کاتالوگ را به‌صورت محلی در برابر ورودیِ کاتالوگ انتخاب‌شده جستجو می‌کند. ورودی‌های
منطبق را چاپ می‌کند، یا وقتی چیزی منطبق نیست `No plugins found.` (کد خروج `0`).

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — یافتن افزونه‌ها فراتر از کاتالوگ

```text
dsh-plugins discover [options] <query...>
```

> `discover` در `1.0.0` عرضه شده، اولین نسخه زیر این نام بسته.

ابتدا کاتالوگ ویرایش‌شده را جستجو می‌کند، سپس — مگر آنکه `--offline` داده شود — تاپیک زندهٔ
`dsh-plugin` گیت‌هاب را، بنابراین افزونه‌ای که هنوز ارسال نشده همچنان قابل‌یافتن است. نتایج
کاتالوگ شاهدی را که کاتالوگ نگه می‌دارد حمل می‌کنند (کامیت پین‌شده، سازنده، مجوز)؛ نتایج جامعه
هیچ‌کدام از این‌ها را ندارند و به همین شکل برچسب‌گذاری می‌شوند، چون هیچ‌چیز دربارهٔ آن‌ها
بازبینی نشده است.

`--limit <n>` نتایج هر لایه را محدود می‌کند (پیش‌فرض `8`). `--json` شکل ماشینی پایدار را چاپ
می‌کند که هرگز بومی‌سازی نمی‌شود.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — نمایش یک ورودی عمومی کاتالوگ

```text
dsh-plugins info [options] <id>
```

یک ورودی عمومی کاتالوگ را با شناسهٔ قانونیِ افزونه نشان می‌دهد. وقتی شناسه در کاتالوگ نیست با
`Plugin not found: <id>` با کد `1` خارج می‌شود.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — افزودن یک افزونهٔ کاتالوگ از طریق تفویض رسمی DSH

```text
dsh-plugins add [options] <id>
```

| گزینه                   | معنی                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | پروفایل DSH برای تغییر (در عمل الزامی است؛ دستور بدون آن خطا می‌دهد) |
| `--dry-run`              | نمایش طرح تأییدشده بدون فایل یا زیرفرآیند               |
| `--allow-code-execution` | رضایت به کد چرخهٔ حیات DSH/pnpm (Windows بومی غیرفعال؛ از WSL استفاده کنید) |
| `--catalog` / `--revision` / `--json` | گزینه‌های مشترک بالا                                  |

معناشناسی dry-run در این نسخه: دستور طرح ورودی پین‌شده را حل و تأیید می‌کند و آن را چاپ می‌کند،
بدون ایجاد فایل و بدون اجرای زیرفرآیند. نصب واقعی به ابزار رسمی DSH تفویض می‌شود و فقط با
`--allow-code-execution` ادامه می‌یابد.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — به‌روزرسانی یک افزونهٔ کاتالوگ از طریق تفویض رسمی DSH

```text
dsh-plugins update [options] <id>
```

همان گزینه‌ها و معناشناسی رضایتِ `add`: `--profile <name>`، `--dry-run`،
`--allow-code-execution`، به‌همراه گزینه‌های مشترک کاتالوگ.

### `remove` — حذف یک افزونهٔ تحت مدیریت کاتالوگ از طریق تفویض رسمی DSH

```text
dsh-plugins remove [options] <id>
```

همان گزینه‌ها و معناشناسی رضایتِ `add`. فقط نصب‌های تحت مدیریت کاتالوگ حذف می‌شوند.

### `recover` — بازیابی یک جهش POSIX نگه‌داشته‌شده

```text
dsh-plugins recover
```

یک جهش POSIX نگه‌داشته‌شده را پس از یک `add`/`update`/`remove` قطع‌شده بازیابی می‌کند. وقتی
چیزی در انتظار نیست `No mutation recovery is pending.` چاپ می‌کند و با کد `0` خارج می‌شود.
بازیابی بومیِ Windows طبق سیاست مستندشده دستی باقی می‌ماند.

### `list` — فهرست نصب‌های تحت مدیریت کاتالوگ

```text
dsh-plugins list [--profile <name>] [--json]
```

نصب‌های تحت مدیریت کاتالوگ را بدون تغییر پروفایل‌ها فهرست می‌کند. `--profile <name>` بر اساس
پروفایل DSH فیلتر می‌کند. وقتی هیچ نصبی وجود ندارد `No catalog-managed plugins installed.`
چاپ می‌کند و با کد `0` خارج می‌شود.

### `doctor` — تشخیص فقط‌خواندنی

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

تشخیص‌های فقط‌خواندنیِ Node، DSH، سیاست بومی Windows و کاتالوگ را اجرا می‌کند. هر بررسی `ok` یا
`error` گزارش می‌کند؛ هر `error` کد خروج کلی را `1` می‌کند. نمونهٔ خروجی روی ماشینی بدون
اجرایی `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## آنچه اعتبارسنجی محلی اثبات نمی‌کند

اجرای سبزِ `catalog validate` فقط ساختار و معناشناسی محلی را تأیید می‌کند. این هویت ریپازیتوری از
راه دور، مالکیت سازنده یا شاهد در کامیت پین‌شده را اثبات نمی‌کند — نگهدارندگان پیش از هر ادغامی
آن دروازه‌های منشأ جداگانه را اعمال می‌کنند، همان‌طور که در
[CONTRIBUTING.md](../../CONTRIBUTING.md) و [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md)
توصیف شده است.

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
