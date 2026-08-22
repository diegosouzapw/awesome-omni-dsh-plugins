# הפניית CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **עברית**

> **פרויקט קהילתי בלתי רשמי. אינו קשור, מאושר או ממומן על ידי DeepSeek.**
> השמות והסימנים של DeepSeek שייכים לבעליהם המתאימים.

עמוד זה מתעד את ה-CLI המפורסם בדיוק כפי שהוא מתנהג בגרסה `1.0.1`. כל synopsis וכל flag שלהלן
מגיעים מפלט ה-`--help` של הפקודה המפורסמת עצמה; שום דבר כאן אינו מתאר התנהגות שטרם פורסמה.
ה-CLI מפותח במאגר זה תחת [`cli/`](../../cli) ומשוחרר ל-npm כחבילת
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), עם אישור מקור (provenance
attestation) המקשר כל build לקומיט ולהרצת ה-workflow שהפיקו אותו.

```bash
npx omni-dsh-plugins --help
```

## עקרונות עיצוב ב-v1.0.1

- **לקריאה בלבד כברירת מחדל.** `catalog`, `search`, `info`, `list` ו-`doctor` לעולם אינם
  משנים פרופילים, כותבים קבצים או מריצים קוד תוסף.
- **שער הסכמה להרצת קוד.** `add`, `update` ו-`remove` מסרבות להריץ קוד מחזור חיים של
  DSH/pnpm אלא אם תעבירו `--allow-code-execution`. בלעדיו, השתמשו ב-`--dry-run` כדי לראות את
  התוכנית המאומתת.
- **מדיניות Windows מקורי.** `add`/`update`/`remove` מקוריים ב-Windows עם הרצת קוד מושבתים
  ב-v1.0.1; השתמשו ב-WSL. dry-run ופקודות לקריאה בלבד נשארות זמינות, וסמני שחזור Windows
  מקוריים דורשים שחזור ידני מתועד.
- **קלטים מוצמדים.** קלט הקטלוג יכול להיות ספרייה מקומית, קובץ snapshot, או כתובת snapshot
  ציבורית מוצמדת, אופציונלית נעולה לרוויזיה מדויקת בת 40 תווים.

## אפשרויות משותפות

אפשרויות אלה מופיעות בפקודות הצורכות קטלוג (`catalog validate`, `search`, `info`, `add`,
`update`, `remove`, `doctor`):

| אפשרות                    | משמעות                                                            |
| ------------------------- | ---------------------------------------------------------------------- |
| `--catalog <path-or-url>` | ספריית קטלוג מקומית, קובץ snapshot, או כתובת snapshot ציבורית מוצמדת   |
| `--revision <sha>`        | רוויזיית snapshot מדויקת בת 40 תווים                                  |
| `--json`                  | פלט JSON יציב                                                         |

אפשרויות גלובליות: `-V, --version` מדפיסה את גרסת ה-CLI; `-h, --help` מדפיסה עזרה עבור כל
פקודה (`dsh-plugins help [command]` עובד גם כן).

## קודי יציאה

ה-CLI משתמש בקודי יציאה סטנדרטיים:

| קוד יציאה | משמעות                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | הצלחה (כולל תוצאות "ריקות אך תקפות" כמו קטלוג ריק)                        |
| `1`       | כשל: שגיאת אימות, רשומה לא נמצאה, אפשרות נדרשת חסרה, או בדיקה אבחונית המדווחת שגיאה |

דוגמאות שנצפו ב-v1.0.1: `catalog validate` על קטלוג ריק תקף יוצא עם `0` עם
`0 entries valid; catalog is empty`; `info <unknown-id>` יוצא עם `1` עם `Plugin not found`;
`doctor` יוצא עם `1` כאשר בדיקה כלשהי (כמו קובץ הרצה `dsh` חסר) מדווחת שגיאה.

## פקודות

### `catalog` — אימות משטחי הקטלוג הציבוריים

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — מאמתת YAML וסמנטיקה של הקטלוג: פירוש YAML בטוח, הסכימה הציבורית,
  פירוש ביטויי SPDX, SemVer מדויק, SHA-512 SRI, ודחיית ID כפול / מפתח Node-מאגר-בתוספת-
  תת-נתיב. היא מקומית ולקריאה בלבד: היא אינה פונה ל-GitHub, אינה פותרת זהות מאגר ואינה בודקת
  ראיה בקומיט המוצמד. זו הפקודה המדויקת שעבודת ה-CI `catalog-validation` מריצה על כל בקשת
  משיכה של קטלוג.
- **`catalog docs-check [root]`** — בודקת שהתיעוד הציבורי הנדרש של הקטלוג קיים ושגדרות
  ה-Markdown מאוזנות.
- **`catalog github-forms-check [root]`** — בודקת את טפסי ה-issue המובנים הציבוריים של
  GitHub (תביעה, תיקון, הסרה).

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — חיפוש שדות ציבוריים של הקטלוג באופן מקומי

```text
dsh-plugins search [options] <query...>
```

מחפשת שדות ציבוריים של הקטלוג באופן מקומי מול קלט הקטלוג הנבחר. מדפיסה רשומות תואמות, או
`No plugins found.` (יציאה `0`) כאשר שום דבר לא תואם.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — מציאת תוספים מעבר לקטלוג

```text
dsh-plugins discover [options] <query...>
```

> `discover` משוחררת ב-`1.0.0`, השחרור הראשון תחת שם חבילה זה.

מחפשת תחילה בקטלוג המאוצר, ואז — אלא אם ניתן `--offline` — בנושא (topic) `dsh-plugin` החי
של GitHub, כך שתוסף שטרם הוגש עדיין ניתן למציאה. תוצאות הקטלוג נושאות את הראיה שהקטלוג מחזיק
(קומיט מוצמד, יוצר, רישיון); תוצאות קהילה אינן נושאות דבר מכך ומסומנות ככאלה, מכיוון ששום דבר
בהן לא נבדק.

`--limit <n>` מגבילה תוצאות לכל שכבה (ברירת מחדל `8`). `--json` מפיקה את הצורה היציבה
הניתנת למכונה, שלעולם אינה מתורגמת.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — הצגת רשומה ציבורית אחת מהקטלוג

```text
dsh-plugins info [options] <id>
```

מציגה רשומה ציבורית אחת מהקטלוג לפי ID קנוני של תוסף. יוצאת עם `1` עם `Plugin not found: <id>`
כאשר ה-ID אינו בקטלוג.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — הוספת תוסף קטלוג אחד דרך האצלה רשמית של DSH

```text
dsh-plugins add [options] <id>
```

| אפשרות                   | משמעות                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| `--profile <name>`       | פרופיל DSH לשינוי (נדרש בפועל; הפקודה נכשלת בלעדיו)                  |
| `--dry-run`              | הצגת התוכנית המאומתת בלי קבצים או תת-תהליכים                          |
| `--allow-code-execution` | הסכמה לקוד מחזור חיים של DSH/pnpm (Windows מקורי מושבת; השתמשו ב-WSL) |
| `--catalog` / `--revision` / `--json` | האפשרויות המשותפות שלעיל                              |

סמנטיקת dry-run בגרסה זו: הפקודה פותרת ומאמתת את התוכנית עבור הרשומה המוצמדת ומדפיסה אותה,
בלי ליצור קבצים ובלי להריץ תת-תהליכים. התקנה בפועל מאצילה לכלי ה-DSH הרשמיים וממשיכה רק עם
`--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — עדכון תוסף קטלוג אחד דרך האצלה רשמית של DSH

```text
dsh-plugins update [options] <id>
```

אותן אפשרויות וסמנטיקת הסכמה כמו `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, בתוספת האפשרויות המשותפות.

### `remove` — הסרת תוסף מנוהל-קטלוג אחד דרך האצלה רשמית של DSH

```text
dsh-plugins remove [options] <id>
```

אותן אפשרויות וסמנטיקת הסכמה כמו `add`. רק התקנות מנוהלות-קטלוג מוסרות.

### `recover` — שחזור מוטציית POSIX שנשמרה

```text
dsh-plugins recover
```

משחזרת מוטציית POSIX שנשמרה לאחר `add`/`update`/`remove` שהופרעו. כאשר אין דבר ממתין היא
מדפיסה `No mutation recovery is pending.` ויוצאת עם `0`. שחזור Windows מקורי נשאר ידני, לפי
המדיניות המתועדת.

### `list` — רשימת התקנות מנוהלות-קטלוג

```text
dsh-plugins list [--profile <name>] [--json]
```

מציגה רשימת התקנות מנוהלות-קטלוג בלי לשנות פרופילים. `--profile <name>` מסננת לפי פרופיל
DSH. כאשר אין התקנות היא מדפיסה `No catalog-managed plugins installed.` ויוצאת עם `0`.

### `doctor` — אבחון לקריאה בלבד

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

מריצה אבחון לקריאה בלבד של Node, DSH, מדיניות Windows מקורית והקטלוג. כל בדיקה מדווחת `ok`
או `error`; כל `error` הופך את קוד היציאה הכולל ל-`1`. פלט לדוגמה במכונה ללא קובץ הרצה
`dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## מה אימות מקומי אינו מוכיח

הרצת `catalog validate` ירוקה מאשרת מבנה וסמנטיקה מקומית בלבד. היא אינה מוכיחה זהות מאגר
מרוחקת, בעלות יוצר, או ראיה בקומיט המוצמד — המתחזקים מיישמים את שערי הראיה הנפרדים האלה
לפני כל מיזוג, כמתואר ב-[CONTRIBUTING.md](../../CONTRIBUTING.md) וב-
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
