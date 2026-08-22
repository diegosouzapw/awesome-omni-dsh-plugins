# Katalog Yönetişimi

> **Resmi olmayan bir topluluk projesidir. DeepSeek ile bağlantılı, DeepSeek tarafından onaylanmış veya desteklenmiş değildir.**
> DeepSeek adları ve markaları kendi sahiplerine aittir.

Genel katalogun nasıl yönetildiği: neyin gireceğine kimin karar verdiği, rakip katkıların hangi
sırayla onurlandırıldığı, hangi denetimlerin otomatik çalıştığı ve hangi değerlendirmelerin insan
elinde kaldığı. Burada atıfta bulunulan politikalar [CONTRIBUTING.md](../../CONTRIBUTING.md),
[docs/CREDIT.md](CREDIT.md) ve [docs/RANKING.md](RANKING.md) içinde yaşar; bu sayfa bunların
nasıl bir araya geldiğini açıklar.

## İlkeler

1. **Üretici önceliklidir.** Katalog, üreticilerin çalışmalarını keşfedilebilir kılmak için
   vardır, asla onlardan sahipliği almak için değil. Aynı kanonik eklenti için doğrudan bir
   üretici pull request'i, açık herhangi bir topluluk küratörlüğü veya otomasyon pull
   request'inin yerini alır — tam öncelik sırası ve Git kimlik kuralları
   [docs/CREDIT.md](CREDIT.md) içindedir.
2. **Bir eklenti, bir incelenmiş pull request.** Toplu birleştirme yok, genel kataloga üretilmiş
   toplu içe aktarma yok. Her kayıt kendi incelemesini kazanır.
3. **Güvenden çok kanıt.** Her genel alan, sabitlenmiş bir commit'teki özgün üretici deposuna
   kadar izlenebilir. Yeşil bir otomatik denetim asla köken kanıtı olarak kabul edilmez.
4. **Her zaman resmi değil.** Hiçbir katalog durumu DeepSeek incelemesi, sertifikası veya onayı
   olarak sunulmaz.

## Değişikliklerin `main`'e nasıl ulaştığı

Tüm değişiklikler incelenmiş pull request'ler aracılığıyla `main`'e ulaşır — doğrudan push
yoktur. Varsayılan dal için çalışma politikası:

- **Yalnızca pull request'ler.** Katalog kayıtları, belgeler ve şema değişikliklerinin hepsi bir
  PR üzerinden girer; katalog PR'leri [CONTRIBUTING.md](../../CONTRIBUTING.md) içindeki
  dal-başına-bir-eklenti kuralını izlemelidir.
- **Doğrusal geçmiş.** PR'ler, `main`'in doğrusal, denetlenebilir bir geçmiş tutacağı şekilde
  entegre edilir; birleştirilmiş genel geçmiş yeniden yazılmaz. Küratörlük yapılan bir kayıt bir
  üretici öne çıkmadan önce birleştirildiyse, üretici bunu bir geçmiş yeniden yazımı yerine takip
  eden bir katkıda talep eder veya düzeltir.
- **İnceleme dizisi çözümü.** İnceleme konuşmaları birleştirmeden önce çözülür; çözülmemiş geri
  bildirim entegrasyonu engeller.
- **Sürdürücü birleştirmesi.** Bir eklenti kaydını yalnızca bir sürdürücü birleştirir ve yalnızca
  [CONTRIBUTING.md](../../CONTRIBUTING.md) → "İnceleme kapıları, çakışmalar ve birleştirme"
  içindeki her kapı, mevcut PR commit'inde geçtikten sonra.

## `catalog-validation` denetimi

`catalog/plugins/`, `schemas/` veya iş akışının kendisine dokunan her pull request,
yayımlanmış CLI'ye sabitlenmiş `catalog-validation` görevini
(`.github/workflows/validate-catalog.yml`) çalıştırır:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Neyi doğruladığı** — yalnızca yerel yapı ve semantik:

- `catalog/plugins/` altındaki her kaydın güvenli YAML ayrıştırması.
- Genel şemaya uygunluk (bkz. [docs/SCHEMA.md](SCHEMA.md)).
- SPDX ifade ayrıştırması, tam SemVer sürümleri, geçerli SHA-512 SRI bütünlük değerleri.
- Yineleme reddi: tekrarlanan kayıt kimliği yok ve tekrarlanan kanonik
  depo-düğüm-artı-alt-yol anahtarı yok.
- Kasıtlı sıfır-kayıtlı katalog geçer (`0 entries valid; catalog is empty`).

**Neyi DOĞRULAMADIĞI** — ve bu nedenle yeşil bir denetimin asla kanıtlamadığı:

- Uzak depo kimliği: GitHub'a bağlanmaz veya depo düğüm kimliğini URL'ye göre çözmez.
- Sabitlenmiş commit'teki kanıt: açıklamalar, lisanslar, DSH entegrasyonu ve smoke kanıtı
  getirilmez veya incelenmez.
- Üretici sahipliği, yıldız sayıları veya açık pull request'lerle çakışma.

Bu değerlendirmeler, birleştirmeden önce uygulanan ve
[CONTRIBUTING.md](../../CONTRIBUTING.md) içinde açıklanan sürdürücülerin ayrı köken kapılarına
aittir. Yerel denetim taban çizgisidir, çıta değil.

## Doğrulama durumları

Doğrulama, genel şemada (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`) tanımlanan durumlar kullanılarak her kayıt için tam sabitlenmiş commit'ine göre
kaydedilir. İki olumlu durum kasıtlı olarak dardır:

- `eligible` — genel yapı ve yerel DSH entegrasyonu doğrulandı.
- `verified` — ek olarak, sabitlenmiş kaynak veya paket için bir kurulum smoke test'i geçti;
  şema, smoke-test kaydının mevcut olmasını gerektirir.

Ne bu durum ne de başka bir durum bir onay, garanti veya güvenlik sertifikasıdır. Durumların
sıralama ile nasıl etkileşime girdiği dahil tam anlambilim [docs/RANKING.md](RANKING.md)
içindedir; kayıt şekli [docs/SCHEMA.md](SCHEMA.md) içindedir.

## Talepler, düzeltmeler ve kaldırmalar

Yapılandırılmış GitHub issue formları (`.github/ISSUE_TEMPLATE/`), göndermediğiniz bir kaydı
değiştirmek için yönetilen yoldur:

| Form           | Kim kullanır                              | Sonuç                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Talep (Claim)**      | Eklentisi başkası tarafından küratörlük yapılmış bir üretici | Sahiplik özgün kaynağa bağlanır; üretici daha sonra doğrudan katkıda bulunabilir |
| **Düzeltme (Correction)** | Yanlış genel meta veri fark eden herkes | Etkilenen kayda incelenmiş bir düzeltme             |
| **Kaldırma (Removal)**    | Kaydının kaldırılmasını isteyen bir üretici, veya bir politika ihlalini bildiren kişi | Kaydın incelenmiş kaldırılması veya karantinaya alınması |

Üç akışa da uygulanan kurallar:

- Sahiplik talepleri doğrulanabilir genel kanıtlarla desteklenmelidir (depo sahipliği, paket
  yazarlığı, manifest meta verileri veya sabitlenmiş kaynak geçmişi) — bir Discussion'a yorum
  yapmak üreticiliği kanıtlamaz ([docs/CREDIT.md](CREDIT.md)).
- Listelenmiş bir eklentideki güvenlik sorunları önce o eklentinin kendi sürdürücüsüne gider;
  katalog tarafı daha sonra exploit ayrıntısı yayımlamadan düzeltmeyi veya karantinayı yönetir
  ([SECURITY.md](../../SECURITY.md)).
- Bir forma asla kimlik bilgileri, özel iletişim bilgileri veya başka gizli bilgiler eklemeyin.

## Roller

- **Üreticiler** eklentilerine ve kayıtlarının önceliğine sahiptir. Doğrudan katkıda
  bulunabilir, topluluk küratörlüğünü onaylayabilir veya mevcut bir kaydı talep
  edebilir/düzeltebilir/kaldırabilirler.
- **Topluluk katkıda bulunanları**, [docs/CREDIT.md](CREDIT.md) içindeki saygılı iletişim ve
  atıf kuralları altında, henüz katkıda bulunmamış üreticiler için kayıt küratörlüğü
  yapabilirler. Küratörlük hiçbir zaman daha sonraki doğrudan bir üretici katkısından üstün
  değildir.
- **Sürdürücüler**, inceler, köken kapılarını uygular, çakışmaları çözer ve birleştirir. Ayrıca
  web sitesini ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) ve
  yayımlanmış CLI'yi özel kaynaktan sürdürürler; bu depo, o yüzeylerin tükettiği genel veriyi,
  şemayı ve politikaları taşır.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
