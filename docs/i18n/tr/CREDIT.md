# Üretici Ataması ve Pull Request Önceliği

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Türkçe**

Katalog, üreticilerinden sahipliği almadan bağımsız DSH çalışmalarını keşfedilebilir kılmak için
var. Genel kayıtlar özgün depoya ve değişmez bir kaynak commit'ine atıfta bulunur.

## Aynı eklenti için öncelik

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Eklenti üreticisi veya sahibi kuruluş tarafından açılan bir pull request.
2. Üretici tarafından açıkça onaylanmış veya ortak yazarlığı yapılmış bir topluluk pull request'i.
3. Mevcut, geçerli bir topluluk pull request'i.
4. Bir katalog otomasyonu pull request'i.
5. Genel pull request'i olmayan özel bir aday.

Doğrudan bir üretici pull request'i her zaman tercih edilir ve aynı kanonik eklenti için,
hangisinin önce açıldığına veya daha ileride olduğuna bakılmaksızın, açık herhangi bir topluluk
küratörlüğü veya otomasyon pull request'inin yerini alır. Üreticinin pull request'i inceleme
aracı haline gelir; onların dalı asla üzerine yazılmaz, force-push edilmez veya küratörlük
yapılan pull request'e taşınmaz. Küratörlük yapılan bir kayıt zaten birleştirildiyse, geçmiş
bozulmadan kalır ve üretici onu yeni bir katkıda talep edebilir veya düzeltebilir.

## Genel atıf

Her katalog kaydı, üreticinin genel GitHub kullanıcı adını, özgün deposunu, depo düğüm kimliğini,
eklenti alt yolunu ve tam sabitlenmiş commit'i taşır. Genel üretici profili, ikinci bir kimlik
olarak saklanmak yerine tek kullanıcı adından türetilir. Ayrı sürdürücü köken kapısı düğüm
kimliğini çözer ve bir depo URL uyuşmazlığını reddeder. Pull request açıklamaları
`Created by @handle` demeli ve kaynak deposu ile kaynak commit meta verilerini içermelidir.

Bir Discussion'da paylaşım yapan veya yorum bırakan bir kişi otomatik olarak üretici olarak kabul
edilmez. Sahiplik, depo sahibi veya kuruluş, paket yazarlığı, manifest meta verileri veya tam
sabitlenmiş kaynak geçmişi tarafından desteklenmelidir.

## Git kimliği

<!-- creator-first:source-bound-git-identity -->

Commit yazarlığı ve pull request yazarlığı ayrıdır. Üretici kaynaklı bir pull request, üreticiyi
pull request yazarı olarak tutar ve commit'leri yazarlığı doğal olarak korur. Bir sürdürücü veya
otomasyon hesabı, commit eden (committer) veya doğrulanmış ortak yazar (co-author) olarak
görünebilir, ancak üreticinin yazarlığının yerini alamaz.

Küratörlük yapılan bir commit için, yalnızca tam kimlik kaynağa bağlı ve herkese açık olarak
doğrulanabilir olduğunda — örneğin özgün depoda üreticinin commit'ine zaten eklenmiş bir kimlik
gibi — üreticiyi Git yazarı olarak kullanın veya bir `Co-authored-by` altbilgisi ekleyin. Asla bir
e-posta adresi tahmin etmeyin, bir noreply adresi uydurmayın veya yetkili genel bir kaynağın
dışında bulunan özel bir adresi kullanmayın.

Doğrulanmış bir Git kimliği mevcut olmadığında, küratör veya otomasyon hesabı commit'i yazar ve
bunun yerine açık, görünür atıf verir: `Created by @handle`, eşleşen genel profil ve kayıt ile
pull request'te özgün depoya bir bağlantı. Görünür YAML atıfı, Git kimlik eşlemesinden bağımsız
olarak her zaman gereklidir. Daha sonraki doğrudan bir üretici pull request'i, sentetik
geçmişini devralmak yerine açık bir küratörlük pull request'inin yerini alır.

## Saygılı üretici bahsi

Küratörlük yapılan bir pull request, açıklamasında özgün depo bağlantısının yanında saygılı, tek
bir genel `@üretici` bahsi kullanır. İnceleme veya değiştirici doğrudan bir pull request davet
edebilir. Bahsi tekrarlamayın, tanıtım amaçlı issue açmayın, çapraz paylaşım yapmayın veya
istenmeyen doğrudan mesajlar göndermeyin.

## Katalog lisansı ile üst kaynak lisansı

Katalog gerçekleri ve editoryal YAML meta verileri CC0-1.0 altında adanmıştır. Bu adama, üst
kaynak eklentinin lisansını değiştirmez. Üst kaynak (upstream) kod, belgeler, ekran görüntüleri,
logolar ve diğer yaratıcı materyaller özgün lisansları ve sahipleri altında kalmaya devam eder.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
