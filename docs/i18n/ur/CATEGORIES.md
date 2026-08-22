# کیٹلاگ زمرے

> 🌐 [English](../../docs/CATEGORIES.md) · **اردو**

ہر کیٹلاگ اندراج کا ایک artifact kind، ایک بنیادی صلاحیت زمرہ اور صفر یا زیادہ ٹیگز ہوتے ہیں۔ بنیادی زمرہ طے کرتا ہے کہ اندراج کہاں ظاہر ہوتا ہے؛ ٹیگز اندراج کو دہرائے بغیر cross-category تلاش فراہم کرتے ہیں۔

## Artifact kinds

<!-- catalog-policy:aggregators-never-entries -->

| قدر | معنی | پلگ ان کے طور پر ستارہ درجہ بندی شدہ |
|---|---|---:|
| `plugin` | انسٹال ہونے کے قابل نیٹو DSH بنڈل | صرف جب ہر درجہ بندی کی شرط پوری ہو |
| `plugin-family` | متعدد DSH پلگ انز پر مشتمل ریپوزٹری | نہیں؛ الگ سیکشن |
| `skin-theme` | DSH UI skin یا بصری تھیم | نہیں؛ الگ سیکشن |
| `skill` | DSH سپورٹ کے ساتھ ایجنٹ سکل | نہیں |
| `preset-profile` | DSH پروفائل یا preset | نہیں |
| `client-interface` | ڈیسک ٹاپ، TUI، ایڈیٹر یا ریموٹ کلائنٹ | نہیں |
| `bridge-adapter` | کسی دوسری پروڈکٹ سے DSH میں انٹیگریشن | نہیں |
| `ecosystem-project` | DSH انٹیگریشن پر مشتمل وسیع تر پروجیکٹ | نہیں |

ایک umbrella ریپوزٹری، اگریگیٹر، مارکیٹ پلیس، انسٹالر کیٹلاگ یا فہرست کبھی بھی کیٹلاگ اندراج نہیں ہوتی، چاہے اگریگیٹر خود انسٹال ہونے کے قابل ہی کیوں نہ ہو۔ اسے صرف ایک سراغ کے طور پر استعمال کیا جا سکتا ہے۔ ہر سراغ کو ایک آزادانہ طور پر انسٹال ہونے والے چائلڈ artifact تک لے جائیں اور جمع کروانے سے پہلے اس artifact کے اصل تخلیق کار، اصل ریپوزٹری، پیکج اور سورس subpath کو حل کریں۔ ایک اصل تخلیق کار مونوریپو کسی چائلڈ پلگ ان کے لیے اصل ریپوزٹری ہو سکتی ہے، مگر چائلڈ کو اس کا عین subpath اور مونوریپو ستاروں کی پالیسی استعمال کرنی چاہیے۔

`kind` فیلڈ معیاری DSH artifact discriminator ہے۔ کوئی الگ integration kind موجود نہیں: `plugin` پہلے سے ہی نیٹو DSH بنڈل کا مطلب رکھتا ہے، جبکہ `ecosystem-project` پہلے سے ہی DSH انٹیگریشن کے ساتھ وسیع تر پروجیکٹ کا مطلب رکھتا ہے۔ یہ متضاد classification جوڑوں کو روکتا ہے۔

## بنیادی صلاحیت زمرے

| قدر | نمائشی لیبل |
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

وہ زمرہ منتخب کریں جو پلگ ان کے بنیادی کام کی بہترین نمائندگی کرے، نہ کہ وہ زمرہ جس سے سب سے زیادہ نمائش بڑھنے کا امکان ہو۔

## انٹرفیس ٹیگز

معیاری انٹرفیس ٹیگز میں `web-ui`، `sidebar`، `settings`، `tui`، `cli`، `desktop`، `mobile`، `remote`، `editor`، `headless` اور `theme` شامل ہیں۔ اضافی lowercase kebab-case صلاحیت ٹیگز کی اجازت ہے جب وہ پن شدہ اصل سورس میں نظر آنے والے ثبوت کو بیان کریں۔

## ریپوزٹری اسکوپ

`dedicated` صرف اس وقت استعمال کریں جب ریپوزٹری کے ستارے عین کیٹلاگ کردہ پلگ ان سے تعلق رکھتے ہوں۔ `monorepo` اس وقت استعمال کریں جب پلگ ان کسی وسیع تر پروجیکٹ کے اندر ایک subpath یا پیکج ہو۔ ایک مونوریپو اندراج کو لازمی طور پر `popularity.starsPolicy: undefined-parent-repository` اور `popularity.stars: null` استعمال کرنا چاہیے۔

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
