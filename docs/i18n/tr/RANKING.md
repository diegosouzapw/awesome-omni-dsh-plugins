# Sıralama Metodolojisi

Sıralamalar, birleştirilmiş genel katalog kayıtları üzerindeki şeffaf görünümlerdir. Asla gizli
bir birleşik puan kullanmazlar ve geniş bir üst projenin yıldızlarını asla eklenti popülerliği
olarak ele almazlar.

## Yıldıza Göre En İyi Eklentiler koşulu

Bir kayıt yalnızca aşağıdaki tüm koşullar doğru olduğunda uygun olur:

```text
kind == plugin (kanonik yerel DSH paketi ayırt edicisi)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Uygun kayıtlar `popularity.starsPolicy: exact-repository` ve `popularity.stars` içinde negatif
olmayan bir tam sayı kullanır. Eşitlikler, belirleyici bir görüntüleme sırası olarak büyük/küçük
harf duyarsız eklenti kimliğini kullanır; eşitlik bozma bir kalite farkını ima etmez.

`kind`, tek yapı türü ayırt edicisidir. Şema, kasıtlı olarak onunla çelişebilecek ikinci bir DSH
entegrasyon türü saklamaz.

## Açık hariç tutmalar

Daha geniş bir monorepo içindeki bir eklenti katalog için uygun kalır, ancak üst yıldızları
eklenti sıralaması için tanımsızdır. `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` ve `popularity.stars: null` kullanmalıdır.
İşlevsel bölümlerde görünür ve her yıldız tabanlı sıralamadan hariç tutulur.

Eklenti aileleri, temalar, arayüz temaları (skins), yetenekler (skills), ön ayarlar, istemciler,
arayüzler, köprüler ve daha geniş ekosistem projeleri, Yıldıza Göre En İyi Eklentiler'de
görünmez. Karşılaştırılabilir veri bulunduğunda ayrı bölümler alırlar. Toplayıcılar, pazar
yerleri, kurulum katalogları ve listeler katalog kaydı değildir ve hiçbir katalog bölümü almaz.

## Sıralama görünümleri

Proje; yıldızlar, 24 saatlik büyüme, 7 günlük büyüme, son güncellemeler, doğrulanmış kurulumlar,
eklenti aileleri, temalar ve arayüz temaları, istemciler ve arayüzler ile ekosistem entegrasyonları
için ayrı görünümler yayımlayabilir. Her görünüm kendi dahil etme kuralını ve anlık görüntü
zamanını açıklamalıdır.

Sıfır uygun kayıtta, En İyi Eklentiler (Top Plugins) görüntülenmez. İlk uygun birleştirme bir En
İyi Eklentiler görünümü oluşturur; etiket, yalnızca on uygun kayıt mevcut olduktan sonra Top 10
olarak değişir. Hiçbir yer tutucu veya uydurma sıralamaya izin verilmez.

## Doğrulama bir onay değildir

`eligible`, genel yapının ve DSH entegrasyonunun doğrulandığı anlamına gelir. `verified`, ek
olarak, sabitlenmiş kaynak veya paket için bir kurulum smoke test'inin geçtiği anlamına gelir.
Hiçbir durum bir onay, garanti veya kesin güvenlik sertifikası değildir.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
