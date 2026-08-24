# Katkıda Bulunma

> 🌐 [English](../../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Türkçe**

> **Resmi olmayan bir topluluk projesidir. DeepSeek ile bağlantılı, DeepSeek tarafından onaylanmış veya desteklenmiş değildir.**
> DeepSeek adları ve markaları kendi sahiplerine aittir.

Katalogu geliştirdiğiniz için teşekkür ederiz. Katkılar üretici önceliklidir: özgün depo
kanıtlarını kullanın, atıfı koruyun ve her eklentiyi bağımsız olarak incelenebilir tutun.
Katalog, tasarım gereği boş başlar; hiçbir kayıt kendi incelenmiş pull request'i olmadan kabul
edilmez.

## Üreticiden başlayın

Eklentinin üreticisi veya sahibi kuruluş tarafından doğrudan açılan bir pull request her zaman
tercih edilir. Üretici katkıda bulunmaya hazırsa, çalışmasını bir küratör veya otomasyon dalında
yeniden oluşturmak yerine kendi dalını ve pull request'ini kullanın.

Henüz pull request açmamış bir üreticiye yardımcı olduğunda topluluk küratörlüğü memnuniyetle
karşılanır. Ancak bu, daha sonra gelecek doğrudan bir üretici katkısı üzerinde sahiplik veya
öncelik oluşturmaz.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Dal ve pull request başına bir eklenti

Tek bir eklenti için özel bir dal oluşturun ve o daldan tek bir pull request açın. Dal ve pull
request, `catalog/plugins/` altında tam olarak bir YAML dosyası oluşturmalı veya değiştirmelidir.
Bu dala veya pull request'e birden fazla eklentiyi, belge temizliğini, üretilmiş dizinleri veya
ilgisiz bakım işlerini karıştırmayın.

Kayıt kimliği (ID) ve dosya adı aynı küçük harfli kebab-case değeri olmalıdır. Sürdürücüler her
eklenti pull request'ini ayrı ayrı inceler ve birleştirir; birden fazla eklenti içeren bir toplu
iş bölünmez veya kısmen birleştirilmez.

## Özgün kaynağı belirleyin

Her genel alan, özgün üretici deposundan, paketten, manifest dosyasından, README'den, lisanstan
veya sabitlenmiş commit'teki sürümden yeniden oluşturulmalıdır. Başka bir katalog veya toplayıcının
metnini, kategori atamasını, ekran görüntülerini, sıralamasını, rozetlerini veya üretilmiş meta
verilerini kopyalamayın. Bir şemsiye projede, pazar yerinde, listede veya toplayıcıda bulunan bir
bağlantı yalnızca bir ipucudur, kanıt veya eklenti kaynağı değildir.

Bağımsız olarak kurulabilir olsa bile, bir şemsiye, toplayıcı, pazar yeri, kurulum kataloğu veya
listeyi asla katalog kaydı olarak göndermeyin. Bunu yalnızca bir ipucu olarak kullanın ve bağımsız
olarak kurulabilen her alt eklentiyi kendi gerçek üreticisine ve özgün deposuna çözümleyin. Bir
eklenti, üreticisinin gerçek monorepo'sunda yer alıyorsa tam alt yolundan gönderilebilir, ancak
aşağıdaki monorepo yıldız politikasını izlemelidir.

## Gerekli kanıtlar

Pull request'te aşağıdakilerin tümünü sağlayın:

- Özgün deponun kanonik genel URL'si ve değişmez depo düğüm kimliği (node ID). Sürdürücüler düğüm
  kimliğini çözer ve ayrı köken (provenance) kapısında URL uyuşmazlıklarını reddeder.
- Üreticinin genel GitHub kullanıcı adı ve eşleşen genel profil URL'si. YAML, kullanıcı adını
  yalnızca bir kez saklar; profil URL'si `https://github.com/<handle>` olarak türetilir.
- Tam 40 karakterlik bir kaynak commit OID'si ve eklentinin tam alt yolu, ya da depo köküne
  yerleşik bir eklenti için `null`.
- Sınırlı bir İngilizce açıklama ve o sabitlenmiş commit'teki kanıt yolu.
- [docs/CATEGORIES.md](../../docs/CATEGORIES.md) belgesinden seçilen yapı `kind`'ı, birincil
  kategori ve etiketler.
- Sabitlenmiş commit'te kanıtlanan tam üst kaynak SPDX lisans ifadesi.
- Tam bir npm sürümüne veya kaynak deposuna, tam commit'e ve alt yola sabitlenmiş kanonik bir
  kurulum tanımlayıcısı. Bu tanımlayıcı veridir, asla bir kabuk (shell) komutu değildir.
- Yerel DSH entegrasyon kanıtı ve sabitlenmiş commit'teki yolu.
- Tam olarak o eklenti sabitlemesi için mevcut, hassas olmayan smoke kanıtı, ya da açık `not run`
  değeri. Yalnızca bir katalog katkısı hazırlamak için eklentiyi kurmayın veya `preinstall`,
  `install`, `postinstall`, `prepare` ya da başka paket/eklenti yaşam döngüsü kodunu
  çalıştırmayın.
- Özel bir depo için, o tam depoya ait doğrulanabilir yıldız sayısı, genel kaynak ve kontrol
  zamanı ile birlikte. Bir monorepo eklentisi için aşağıdaki gerekli null politikasını kullanın.
- Varsa genel Discussion veya yorum kökeni; yoksa `null`.
- Makine tarafından okunabilir `unofficial: true` değeri.

Uygun bir smoke test zaten yoksa `verification.status: eligible` ve
`verification.smokeTest: null` kullanın. `verified` durumunu yalnızca tam sabitleme için
incelenebilir smoke kanıtı mevcut olduğunda kullanın. Her iki durum da bir onay veya güvenlik
sertifikası değildir.

Asla kimlik bilgileri, çerezler, özel e-posta adresleri, yayımlanmamış kaynak kodu veya başka
gizli bilgiler göndermeyin.

## YAML ve şema kuralları

`catalog/plugins/<plugin-id>.yaml` dosyasını oluşturun ve
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) şemasına göre doğrulayın. `id`,
dosyanın temel adına eşit olmalı ve ad alanınızla (namespace) başlamalıdır: küçük harfe çevrilmiş
`creator.github` kullanıcı adınız (`[a-z0-9]` dışındaki her karakter dizisi tek bir `-`'ye
dönüşür), ardından `-` gelir; örneğin `Some-Creator` kullanıcı adı için `some-creator-my-plugin`.
Katalog doğrulaması her ikisini de zorunlu kılar. Alan adları ve izin verilen değerler için şema
gerçek kaynaktır; [docs/CATEGORIES.md](../../docs/CATEGORIES.md), tek yapı `kind`'ının, birincil
kategorinin, etiketlerin ve depo kapsamının nasıl seçileceğini tanımlar.

Bir npm tanımlayıcısı geçerli bir paket adı ve tam sürüm içermelidir. Genel şema, seçenek benzeri
ve sınırsız değerleri reddeder, ancak SemVer veya SRI'yi yeniden uygulamaz: katalog doğrulaması
sürümü ayrıştırmalı, tam SemVer gerektirmeli ve herhangi bir bütünlük (integrity) değerini geçerli
SHA-512 SRI olarak ayrıştırmalıdır. Bir kaynak tanımlayıcısı, değişken kaynak değerlerini
tekrarlamadan `source.repository`, `source.commit` ve `source.subpath`'e bağlıdır.

Kurulumcular argüman dizileri kullanmalı, kabuk (shell) yürütmesini devre dışı bırakmalı ve
çağrılan komut destekliyorsa katalog tarafından sağlanan konumsal değerlerden önce bir seçenek
sonlandırıcı yerleştirmelidir. Gönderim doğrulaması bir kurulumcuyu veya eklenti yaşam döngüsünü
çağırmamalıdır.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate`, yerel, salt okunur bir yapısal ve semantik denetimdir. Güvenli YAML'ı
ayrıştırır, genel şemayı doğrular, SPDX ifadelerini ayrıştırır, tam SemVer ve geçerli SHA-512 SRI
gerektirir ve yinelenen kimlikleri reddeder. GitHub'a bağlanmaz, depo kimliğini çözmez veya
sabitlenmiş commit'teki kanıt yollarını incelemez.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Bir kayıt `eligible` durumuna ulaşmadan önce, sürdürücüler ayrıca kanonik depoyu ve düğüm
kimliğini çözer, üreticiyi özgün kaynağa bağlar ve `source.commit`'teki bildirilen açıklamayı,
lisansı, DSH entegrasyonunu ve smoke kanıtını inceler. Yerel yeşil bir doğrulama sonucu, köken
veya kaynak kanıtı değildir.

## Depo yıldızları

Yalnızca tam özel eklenti deposuna doğrulanabilir şekilde ait olan yıldızlar kaydedilebilir. Bir
üst projenin yıldızları, daha geniş bir monorepo içinde saklanan bir eklentiye asla
atfedilmemelidir. Bir monorepo kaydı, işlevsel katalog bölümleri için uygun kalır ancak şunu
bildirmelidir:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Özel bir kayıt `repositoryScope: dedicated`, `starsPolicy: exact-repository` ve aynı depoda
gözlemlenen negatif olmayan yıldız sayısını kullanır. Popülerlik verisi göndermeden önce
[docs/RANKING.md](../../docs/RANKING.md) belgesini okuyun.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Üretici önceliği ve saygılı iletişim

Aynı kanonik eklenti için öncelik şöyledir:

1. Üretici veya sahibi kuruluş tarafından açılan bir pull request.
2. Üretici tarafından açıkça onaylanmış bir topluluk pull request'i.
3. Mevcut, geçerli bir topluluk küratörlüğü pull request'i.
4. Bir katalog otomasyonu pull request'i.

Doğrudan bir üretici pull request'i, hangisinin önce açıldığına veya daha ileride olduğuna
bakılmaksızın, açık herhangi bir küratörlük veya otomasyon pull request'inin yerini alır. Üretici
pull request'i inceleme aracı haline gelir; sürdürücüler üreticinin dalına force-push yapmaz veya
çalışmasını küratörlük yapılan pull request'e taşımaz. Küratörlük yapılan bir kayıt zaten
birleştirildiyse, genel geçmiş yeniden yazılmaz. Üretici bir talep veya düzeltme isteği kullanabilir
ve ardından doğrudan bir takip pull request'i ile katkıda bulunabilir.

Küratörlük yapılan bir pull request, açıklamasında özgün depo bağlantısının yanında saygılı, tek bir
genel `@üretici` bahsi kullanmalıdır ve üreticiyi incelemeye veya doğrudan bir pull request ile
değiştirmeye davet edebilir. Bahsi tekrarlamayın, tanıtım amaçlı issue açmayın, çapraz paylaşım
yapmayın veya üreticiye istenmeyen doğrudan mesajlar göndermeyin.

<!-- creator-first:source-bound-git-identity -->

Üretici tarafından yazılmış pull request'ler ve commit'ler, üretici atıfını doğal olarak korur.
Küratörlük yapılan commit'ler, yalnızca kaynağa bağlı, herkese açık olarak doğrulanabilir bir
kimlik olduğunda üretici Git yazarlığını veya bir `Co-authored-by` altbilgisini kullanabilir. Bir
e-posta adresini asla uydurmayın veya tahmin etmeyin. Doğrulanmış bir Git kimliği mevcut
olmadığında, küratör commit'i yazar ve YAML ile pull request'te özgün depo bağlantısıyla birlikte
açık `Created by @handle` atıfı verir. Bir sürdürücü veya otomasyon hesabı commit eden (committer)
veya doğrulanmış ortak yazar (co-author) olabilir, ancak üreticinin yazarlığının yerini
alamaz. Tam politika için bkz. [docs/CREDIT.md](../../docs/CREDIT.md).

## Doğrulama komutları ve kullanılabilirlik

npm CLI'si `omni-dsh-plugins@1.0.1` olarak yayımlanmıştır, bu nedenle aşağıdaki komutlar
bugün `npx` aracılığıyla kullanılabilir. Bunları tam olarak yazıldığı gibi kullanın; katkıda
bulunanlar yerine geçecek komutlar uydurmamalıdır.

Bu komutları depo kök dizininden çalıştırın:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate`, yukarıda açıklanan yalnızca yerel YAML, şema, SPDX, tam SemVer, SHA-512 SRI
ve yinelenen denetimlerini gerçekleştirir ve kasıtlı sıfır kayıtlı kataloğu kabul eder. Uzak depo
kimliğini veya sabitlenmiş kaynak kanıtını kanıtlamaz. Diğer komutlar, gerekli genel belgeleri ve
yapılandırılmış GitHub issue formlarını denetler. Bu komutları yerel olarak geçirmek, kanıt
gereksinimlerini gevşetmez; sürdürücüler birleştirmeden önce yine de her karşılık gelen yayın
kapısını uygular.

## İnceleme kapıları, çakışmalar ve birleştirme

Sürdürücüler, birleştirmeden önce mevcut pull request commit'ine her kapıyı uygular:

1. **Kapsam:** tek bir özel dal, tek bir eklenti YAML dosyası ve ilgisiz değişiklik yok.
2. **Özgün kimlik:** üretici, kanonik depo, düğüm kimliği, tam commit ve alt yol uyuşur.
3. **Şema ve kanıt:** YAML, kategoriler, SPDX, kurulum sabitlemesi, DSH kanıtı ve smoke durumu,
   eklenti yaşam döngüsü kodu çalıştırılmadan iç tutarlıdır.
4. **Popülerlik:** özel yıldızlar tam depoda doğrulanabilir, ya da monorepo yıldızları
   `undefined-parent-repository` ile `null`'dır.
5. **Belgeler ve formlar:** genel belgeler, Markdown çitleri (fences) ve yapılandırılmış formlar
   geçerli kalır.
6. **Çakışma ve tekilleştirme:** hiçbir birleştirilmiş kayıt veya açık pull request aynı kanonik
   eklentiyi temsil etmez.

Farklı adlar veya kimlikler yinelenen eklentileri birbirinden farklı kılmaz. Aynı depo düğüm
kimliğini ve alt yolunu, aynı kanonik paketi veya kanıtlanabilir şekilde aynı kurulum hedefini
bir çakışma olarak ele alın. Birleştirmeden önce takma adları ve rakip pull request'leri çözün.
Doğrudan bir üretici pull request'i, küratörlük veya otomasyonla bir çakışmayı kazanır; aksi
halde sürdürücüler bir inceleme aracı seçer ve her ikisini de birleştirmek yerine yinelenenleri
kapatır veya yönlendirir.

Bir eklenti, yalnızca tüm kapılar geçtikten sonra bir sürdürücü tarafından birleştirilir. Kabul
edilen her eklenti ayrı ayrı birleştirilir; doğrulama, küratörlük veya otomasyon otomatik veya
toplu birleştirmeyi ima etmez.

## Pull request kontrol listesi

- [ ] Tek bir özel dal kullandım ve bu PR tam olarak bir eklenti kaydını değiştiriyor.
- [ ] Kaynak, bir şemsiye veya toplayıcı değil, özgün üretici deposudur.
- [ ] Üretici kullanıcı adı/profili, deposu, düğüm kimliği, alt yolu ve tam commit'i
      kanıtlanmıştır.
- [ ] Yapı `kind`'ı, kategori ve etiketler `docs/CATEGORIES.md` belgesini izliyor.
- [ ] SPDX lisansı ve sabitlenmiş kurulum tanımlayıcısı kanıtlanmıştır.
- [ ] Yerel DSH entegrasyonu ve smoke sonucu veya `not run` durumu kanıtlanmıştır.
- [ ] Bu katkıyı hazırlamak için eklenti veya paket yaşam döngüsü kodu çalıştırmadım.
- [ ] Özel yıldızlar doğrulanabilir, ya da monorepo yıldızları gerekli null politikasını
      kullanıyor.
- [ ] Aynı kanonik eklenti için mevcut bir kayıt ve açık pull request olup olmadığını kontrol
      ettim.
- [ ] Kayıt açıkça resmi değildir ve hiçbir gizli bilgi veya özel kişisel veri içermez.

## Dil politikası

Lansman belgeleri ve katalog açıklamaları yalnızca İngilizcedir. 43 yerel dil kapsamı, MVP
sonrası bir birikim (backlog) maddesi olarak kalır; boş yerel dil belgeleri veya otomatik toplu
çeviriler eklemeyin.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
