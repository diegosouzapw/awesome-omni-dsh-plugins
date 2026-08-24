# Katalog Kategorileri

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Türkçe**

Her katalog kaydının bir yapı `kind`'ı, bir birincil yetenek kategorisi ve sıfır veya daha fazla
etiketi vardır. Birincil kategori, kaydın nerede görüneceğini belirler; etiketler ise kaydı
tekrarlamadan kategoriler arası arama sağlar.

## Yapı türleri (artifact kinds)

<!-- catalog-policy:aggregators-never-entries -->

| Değer | Anlamı | Eklenti olarak yıldızla sıralanır mı |
|---|---|---:|
| `plugin` | Kurulabilir yerel DSH paketi | Yalnızca tüm sıralama koşulları karşılandığında |
| `plugin-family` | Birden çok DSH eklentisi içeren depo | Hayır; ayrı bölüm |
| `skin-theme` | DSH arayüz teması veya görsel tema | Hayır; ayrı bölüm |
| `skill` | DSH desteği olan ajan yeteneği (skill) | Hayır |
| `preset-profile` | DSH profili veya ön ayarı | Hayır |
| `client-interface` | Masaüstü, TUI, düzenleyici veya uzak istemci | Hayır |
| `bridge-adapter` | Başka bir üründen DSH'ye entegrasyon | Hayır |
| `ecosystem-project` | Bir DSH entegrasyonu içeren daha geniş proje | Hayır |

Bir şemsiye depo, toplayıcı, pazar yeri, kurulum kataloğu veya liste — toplayıcının kendisi
kurulabilir olsa bile — asla bir katalog kaydı değildir. Yalnızca bir ipucu olarak
kullanılabilir. Her ipucunu bağımsız olarak kurulabilir bir alt yapıya kadar takip edin ve
göndermeden önce o yapının gerçek üreticisini, özgün deposunu, paketini ve kaynak alt yolunu
çözümleyin. Gerçek bir üretici monorepo'su, bir alt eklenti için özgün depo olabilir, ancak alt
eklenti tam olarak o alt yolu ve monorepo yıldız politikasını kullanmalıdır.

`kind` alanı, kanonik DSH yapı ayırt edicisidir. Ayrı bir entegrasyon türü yoktur: `plugin`
zaten yerel bir DSH paketi anlamına gelir, `ecosystem-project` ise zaten DSH entegrasyonu olan
daha geniş bir proje anlamına gelir. Bu, çelişkili sınıflandırma çiftlerini önler.

## Birincil yetenek kategorileri

| Değer | Görüntü etiketi |
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

Görünürlüğü artırma olasılığı en yüksek kategoriyi değil, eklentinin birincil işini en iyi
temsil eden kategoriyi seçin.

## Arayüz etiketleri

Standart arayüz etiketleri arasında `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` ve `theme` bulunur. Sabitlenmiş özgün kaynakta görünür
kanıtları tanımladığında ek küçük harfli kebab-case yetenek etiketlerine izin verilir.

## Depo kapsamı

`dedicated`'i yalnızca depo yıldızları tam olarak kataloglanan eklentiye ait olduğunda kullanın.
Eklenti daha geniş bir projenin içinde bir alt yol veya paket olduğunda `monorepo` kullanın. Bir
monorepo kaydı `popularity.starsPolicy: undefined-parent-repository` ve
`popularity.stars: null` kullanmalıdır.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
