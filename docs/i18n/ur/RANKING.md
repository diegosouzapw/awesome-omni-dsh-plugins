# درجہ بندی کا طریقہ کار

> 🌐 [English](../../docs/RANKING.md) · **اردو**

درجہ بندیاں ضم شدہ عوامی کیٹلاگ اندراجات پر شفاف views ہیں۔ یہ کبھی کوئی پوشیدہ combined اسکور استعمال نہیں کرتیں اور کبھی کسی وسیع پیرنٹ پروجیکٹ کے ستاروں کو پلگ ان کی مقبولیت نہیں سمجھتیں۔

## Top Plugins by Stars پیش شرط

ایک اندراج صرف تب اہل ہوتی ہے جب نیچے دی گئی ہر شرط درست ہو:

```text
kind == plugin (معیاری نیٹو DSH بنڈل discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

اہل اندراجات `popularity.starsPolicy: exact-repository` اور `popularity.stars` میں ایک غیر منفی integer استعمال کرتی ہیں۔ برابری کی صورت میں case-insensitive پلگ ان ID کو ایک متعین نمائشی ترتیب کے طور پر استعمال کیا جاتا ہے؛ tie-break کوالٹی کے فرق کی نشاندہی نہیں کرتا۔

`kind` واحد artifact-type discriminator ہے۔ اسکیما جان بوجھ کر ایک دوسرا DSH integration kind محفوظ نہیں کرتی جو اس سے متضاد ہو سکے۔

## واضح اخراجات

ایک وسیع تر مونوریپو کے اندر پلگ ان کیٹلاگ-اہل رہتا ہے، مگر پلگ ان درجہ بندی کے لیے اس کے پیرنٹ ستارے غیر متعین ہیں۔ اسے لازمی طور پر `repositoryScope: monorepo`، `popularity.starsPolicy: undefined-parent-repository` اور `popularity.stars: null` استعمال کرنا چاہیے۔ یہ فعال سیکشنز میں ظاہر ہوتا ہے اور ہر ستارہ بنیاد درجہ بندی سے خارج ہے۔

پلگ ان families، تھیمز، skins، skills، presets، کلائنٹس، انٹرفیسز، برجز اور وسیع تر ecosystem پروجیکٹس Top Plugins by Stars میں ظاہر نہیں ہوتے۔ انہیں الگ سیکشنز ملتے ہیں جہاں موازنہ کے قابل ڈیٹا موجود ہو۔ اگریگیٹرز، مارکیٹ پلیسز، انسٹالر کیٹلاگز اور فہرستیں کیٹلاگ اندراجات نہیں ہیں اور انہیں کوئی کیٹلاگ سیکشن نہیں ملتا۔

## درجہ بندی کے views

پروجیکٹ ستاروں، 24-گھنٹے کی growth، 7-دن کی growth، حالیہ اپ ڈیٹس، تصدیق شدہ انسٹالز، پلگ ان families، تھیمز اور skins، کلائنٹس اور انٹرفیسز، اور ecosystem انٹیگریشنز کے لیے الگ views شائع کر سکتا ہے۔ ہر view کو اپنا شمولیت کا قاعدہ اور snapshot وقت ظاہر کرنا چاہیے۔

صفر اہل اندراجات پر، Top Plugins رینڈر نہیں کی جاتی۔ پہلی اہل ضم شدگی ایک Top Plugins view بناتی ہے؛ لیبل صرف دس اہل اندراجات موجود ہونے کے بعد Top 10 میں تبدیل ہوتا ہے۔ کسی placeholder یا من گھڑت درجہ بندی کی اجازت نہیں۔

## توثیق کوئی توثیقی رائے نہیں ہے

`eligible` کا مطلب ہے کہ عوامی ساخت اور DSH انٹیگریشن کی توثیق کی گئی۔ `verified` کا مطلب اضافی طور پر یہ ہے کہ پن شدہ سورس یا پیکج کے لیے ایک انسٹالیشن smoke test پاس ہوا۔ کوئی بھی حیثیت توثیق، ضمانت یا مطلق سیکیورٹی سرٹیفیکیشن نہیں ہے۔

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
