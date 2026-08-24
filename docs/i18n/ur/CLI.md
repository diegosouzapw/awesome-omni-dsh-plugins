# CLI ریفرنس — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **اردو**

> **غیر سرکاری کمیونٹی پروجیکٹ۔ DeepSeek سے وابستہ، اس کی توثیق یافتہ یا اس کے زیرِ سرپرستی نہیں ہے۔**
> DeepSeek کے نام اور نشانات ان کے متعلقہ مالک کی ملکیت ہیں۔

یہ صفحہ شائع شدہ CLI کو بالکل اسی طرح دستاویز کرتا ہے جیسے یہ ورژن `1.0.1` میں کام کرتا ہے۔ نیچے دیا گیا ہر synopsis اور flag شائع شدہ کمانڈ کے اپنے `--help` output سے آتا ہے؛ یہاں کچھ بھی غیر شائع شدہ رویے کو بیان نہیں کرتا۔ CLI اسی ریپوزٹری میں [`cli/`](../../cli) کے تحت تیار کیا جاتا ہے اور npm پر [`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins) کے طور پر ریلیز کیا جاتا ہے، ایک provenance attestation کے ساتھ جو ہر build کو اس کمٹ اور workflow run سے جوڑتی ہے جس نے اسے تیار کیا۔

```bash
npx omni-dsh-plugins --help
```

## v1.0.1 میں ڈیزائن کے اصول

- **پہلے سے طے شدہ طور پر صرف پڑھنے کے لیے۔** `catalog`، `search`، `info`، `list` اور `doctor` کبھی پروفائلز میں ترمیم نہیں کرتے، فائلیں نہیں لکھتے یا پلگ ان کوڈ سپون نہیں کرتے۔
- **کوڈ ایگزیکیوشن کے لیے رضامندی گیٹ۔** `add`، `update` اور `remove` DSH/pnpm lifecycle کوڈ چلانے سے انکار کرتے ہیں جب تک آپ `--allow-code-execution` پاس نہ کریں۔ اس کے بغیر، تصدیق شدہ پلان دیکھنے کے لیے `--dry-run` استعمال کریں۔
- **نیٹو Windows پالیسی۔** کوڈ ایگزیکیوشن کے ساتھ نیٹو Windows `add`/`update`/`remove` v1.0.1 میں غیر فعال ہیں؛ WSL استعمال کریں۔ Dry-run اور صرف پڑھنے کے لیے کمانڈز دستیاب رہتی ہیں، اور نیٹو Windows ریکوری markers کو دستاویزی دستی ریکوری درکار ہوتی ہے۔
- **پن شدہ inputs۔** کیٹلاگ input ایک مقامی directory، snapshot فائل، یا پن شدہ عوامی snapshot URL ہو سکتا ہے، اختیاری طور پر ایک عین 40-حرفی revision پر lock کیا گیا۔

## عمومی آپشنز

یہ آپشنز کیٹلاگ استعمال کرنے والی کمانڈز پر ظاہر ہوتے ہیں (`catalog validate`، `search`، `info`، `add`، `update`، `remove`، `doctor`):

| آپشن                    | معنی                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | مقامی کیٹلاگ directory، snapshot فائل، یا پن شدہ عوامی snapshot URL |
| `--revision <sha>`        | عین 40-حرفی snapshot revision                                       |
| `--json`                  | مستحکم JSON output پیدا کریں                                        |

عالمی آپشنز: `-V, --version` CLI ورژن پرنٹ کرتا ہے؛ `-h, --help` کسی بھی کمانڈ کے لیے help پرنٹ کرتا ہے (`dsh-plugins help [command]` بھی کام کرتا ہے)۔

## Exit codes

CLI روایتی process exit codes استعمال کرتا ہے:

| Exit code | معنی                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | کامیابی (بشمول "خالی مگر درست" نتائج جیسے خالی کیٹلاگ)                       |
| `1`       | ناکامی: توثیق کی خرابی، اندراج نہیں ملا، درکار آپشن غائب، یا کوئی diagnostic چیک جو خرابی رپورٹ کرے |

v1.0.1 کے ساتھ مشاہدہ کی گئی مثالیں: ایک درست خالی کیٹلاگ پر `catalog validate` `0 entries valid; catalog is empty` کے ساتھ `0` سے exit ہوتا ہے؛ `info <unknown-id>` `Plugin not found` کے ساتھ `1` سے exit ہوتا ہے؛ جب کوئی چیک (جیسے غائب `dsh` executable) خرابی رپورٹ کرے تو `doctor` `1` سے exit ہوتا ہے۔

## کمانڈز

### `catalog` — عوامی کیٹلاگ surfaces کی توثیق کریں

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — کیٹلاگ YAML اور سیمینٹکس کی توثیق کرتا ہے: محفوظ YAML پارسنگ، عوامی اسکیما، SPDX expression پارسنگ، exact SemVer، SHA-512 SRI، اور نقل ID / repository-node-plus-subpath مسترد کرنا۔ یہ مقامی اور صرف پڑھنے کے لیے ہے: یہ GitHub سے رابطہ نہیں کرتا، ریپوزٹری کی شناخت حل نہیں کرتا یا پن شدہ کمٹ پر ثبوت کا معائنہ نہیں کرتا۔ یہ وہی عین کمانڈ ہے جو `catalog-validation` CI job ہر کیٹلاگ pull request پر چلاتا ہے۔
- **`catalog docs-check [root]`** — چیک کرتا ہے کہ درکار عوامی کیٹلاگ دستاویزات موجود ہیں اور Markdown fences متوازن ہیں۔
- **`catalog github-forms-check [root]`** — منظم عوامی GitHub issue فارمز (claim، correction، removal) چیک کرتا ہے۔

```bash
# ریپوزٹری کی جڑ سے:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — عوامی کیٹلاگ فیلڈز کو مقامی طور پر تلاش کریں

```text
dsh-plugins search [options] <query...>
```

منتخب کیٹلاگ input کے خلاف عوامی کیٹلاگ فیلڈز کو مقامی طور پر تلاش کرتا ہے۔ مماثل اندراجات پرنٹ کرتا ہے، یا جب کچھ بھی مماثل نہ ہو تو `No plugins found.` (exit `0`)۔

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — کیٹلاگ سے آگے پلگ انز تلاش کریں

```text
dsh-plugins discover [options] <query...>
```

> `discover` `1.0.0` میں شپ ہوتا ہے، اس پیکج نام کے تحت پہلی ریلیز۔

پہلے کیوریٹ شدہ کیٹلاگ تلاش کرتا ہے، پھر — جب تک `--offline` نہ دیا جائے — لائیو GitHub `dsh-plugin` topic، تاکہ ایسا پلگ ان جو ابھی تک جمع نہیں کروایا گیا ہو پھر بھی قابلِ دریافت رہے۔ کیٹلاگ نتائج وہ ثبوت رکھتے ہیں جو کیٹلاگ کے پاس ہے (پن شدہ کمٹ، تخلیق کار، لائسنس)؛ کمیونٹی نتائج اس میں سے کچھ نہیں رکھتے اور اسی طرح لیبل کیے جاتے ہیں، کیونکہ ان کے بارے میں کچھ بھی جائزہ شدہ نہیں ہے۔

`--limit <n>` فی tier نتائج کی حد لگاتا ہے (طے شدہ `8`)۔ `--json` مستحکم machine شکل خارج کرتا ہے، جو کبھی مقامی نہیں کی جاتی۔

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — ایک عوامی کیٹلاگ اندراج دکھائیں

```text
dsh-plugins info [options] <id>
```

معیاری پلگ ان ID کے ذریعے ایک عوامی کیٹلاگ اندراج دکھاتا ہے۔ جب ID کیٹلاگ میں نہ ہو تو `Plugin not found: <id>` کے ساتھ `1` سے exit ہوتا ہے۔

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — سرکاری DSH وفد کے ذریعے ایک کیٹلاگ پلگ ان شامل کریں

```text
dsh-plugins add [options] <id>
```

| آپشن                   | معنی                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | تبدیل کرنے کے لیے DSH پروفائل (عملی طور پر درکار؛ اس کے بغیر کمانڈ خرابی دیتی ہے) |
| `--dry-run`              | فائلوں یا subprocesses کے بغیر تصدیق شدہ پلان دکھائیں               |
| `--allow-code-execution` | DSH/pnpm lifecycle کوڈ کے لیے رضامندی (نیٹو Windows غیر فعال؛ WSL استعمال کریں) |
| `--catalog` / `--revision` / `--json` | اوپر دیے گئے عمومی آپشنز                                |

اس ورژن میں dry-run سیمینٹکس: کمانڈ پن شدہ اندراج کے لیے پلان حل اور تصدیق کرتی ہے اور اسے پرنٹ کرتی ہے، کوئی فائل نہیں بناتی اور کوئی subprocess سپون نہیں کرتی۔ اصل انسٹالیشن سرکاری DSH ٹولنگ کو وفد کرتی ہے اور صرف `--allow-code-execution` کے ساتھ آگے بڑھتی ہے۔

```bash
# صرف پیش نظارہ — کچھ بھی نہیں لکھا جاتا، کچھ بھی ایگزیکیوٹ نہیں ہوتا:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# اصل انسٹال — lifecycle کوڈ کے لیے واضح رضامندی:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — سرکاری DSH وفد کے ذریعے ایک کیٹلاگ پلگ ان اپ ڈیٹ کریں

```text
dsh-plugins update [options] <id>
```

`add` جیسے ہی آپشنز اور رضامندی سیمینٹکس: `--profile <name>`، `--dry-run`، `--allow-code-execution`، بالاضافہ عمومی کیٹلاگ آپشنز۔

### `remove` — سرکاری DSH وفد کے ذریعے ایک کیٹلاگ کے زیرِ انتظام پلگ ان ہٹائیں

```text
dsh-plugins remove [options] <id>
```

`add` جیسے ہی آپشنز اور رضامندی سیمینٹکس۔ صرف کیٹلاگ کے زیرِ انتظام انسٹالز ہٹائے جاتے ہیں۔

### `recover` — ایک محفوظ شدہ POSIX تبدیلی ریکور کریں

```text
dsh-plugins recover
```

ایک منقطع `add`/`update`/`remove` کے بعد ایک محفوظ شدہ POSIX تبدیلی ریکور کرتا ہے۔ کچھ بھی زیرِ التوا نہ ہونے پر یہ `No mutation recovery is pending.` پرنٹ کرتا ہے اور `0` سے exit ہوتا ہے۔ نیٹو Windows ریکوری دستاویزی پالیسی کے مطابق دستی رہتی ہے۔

### `list` — کیٹلاگ کے زیرِ انتظام انسٹالز کی فہرست دیں

```text
dsh-plugins list [--profile <name>] [--json]
```

پروفائلز میں ترمیم کیے بغیر کیٹلاگ کے زیرِ انتظام انسٹالز کی فہرست دیتا ہے۔ `--profile <name>` DSH پروفائل کے مطابق فلٹر کرتا ہے۔ کوئی انسٹالز نہ ہونے پر یہ `No catalog-managed plugins installed.` پرنٹ کرتا ہے اور `0` سے exit ہوتا ہے۔

### `doctor` — صرف پڑھنے کے لیے تشخیص

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

صرف پڑھنے کے لیے Node، DSH، نیٹو Windows پالیسی اور کیٹلاگ تشخیص چلاتا ہے۔ ہر چیک `ok` یا `error` رپورٹ کرتا ہے؛ کوئی بھی `error` مجموعی exit code کو `1` بناتا ہے۔ `dsh` executable کے بغیر مشین پر مثالی output:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## مقامی توثیق کیا ثابت نہیں کرتی

ایک سبز `catalog validate` run صرف ساخت اور مقامی سیمینٹکس کی تصدیق کرتا ہے۔ یہ ریموٹ ریپوزٹری کی شناخت، تخلیق کار کی ملکیت، یا پن شدہ کمٹ پر ثبوت ثابت نہیں کرتا — مینٹینرز کسی بھی ضم کرنے سے پہلے یہ الگ provenance گیٹس لاگو کرتے ہیں، جیسا کہ [CONTRIBUTING.md](../../CONTRIBUTING.md) اور [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md) میں بیان کیا گیا ہے۔

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
