# Kart oyunu · Yol haritası

> **TASLAK · Kemal onaylamadı.** Paketler Kems Ajans'taki yapım planı taslağından
> (`oneriler/kart-oyunu-yapim-plani-16-11-2026.md`); sıra Kemal'in 15 Kasım kararıyla değişti:
> Spider 2. pakette, klasik solitaire ondan sonra. 15 Kasım (örnek oyun): Kemal'in gösterdiği
> örnek Spider oyunundan dört paket ve bir görsel paketi eklendi (6–10).

Yazan: Oyun Geliştiricisi (Kems Ajans), 15 Kasım 2026. Onay Kemal'in. Kararların ayrıntısı:
`docs/tasarim-belgesi.md`. Tarih ve süre yazılmadı (veri yok). Her paket küçük, tek PR'la gelir;
her paketin sonunda Kemal'in telefonda açıp deneyebileceği bir şey olur. Önce "oynanış oturdu mu",
sonra "güzel mi". Kemal "şimdi" derse bir paket öne geçer.

## Neredeyiz

- 15 Kasım 2026 (ana dalda, PR #1): 0. ve 1. paket. Dikey açılış ekranı, oyun seçimi
  (Spider açık, klasik solitaire "yakında"), düz lacivert masa, kodla çizilen kartlar. Spider
  eli dağıtılıyor (1, 2, 4 renk); kart dokunarak ya da sürükleyerek taşınıyor; desteye dokununca
  her sütuna birer kart geliyor. Kural kontrolü yok. Yazılar yer tutucu; oyunun adı [Kemal].
  Ekran görüntüleri: `docs/ekran-goruntuleri/`. Bilgisayarda telefon boyutunda denendi; gerçek
  telefonda denenmedi.
- 15 Kasım 2026 (öneri; `ajans/ornek-oyun-kararlari`): yalnız belge. Kemal'in gösterdiği örnek
  Spider oyunundan gelen kararlar belgeye (8. bölüm) ve buraya işlendi; oyunda bir şey değişmedi.
- 15 Kasım 2026 (ana dalda, PR #3): 2. paket, Spider kuralları. Kurala uymayan
  taşıma reddedilir, kart yerine döner; tamamlanan dizi kalkar; boş sütun varken dağıtma uyarısı;
  üstte süre ve hamle; 8 dizide oyun sonu ekranı. Bilgisayarda telefon boyutunda denendi; gerçek
  telefonda denenmedi.
- 15 Kasım 2026 (öneri; `ajans/geri-al-ipucu`): 4. paketin ilk iki maddesi, geri al ve ipucu
  (Kemal: "Geri al ve ipucunu yap"). Masanın altında tek satır: Geri al, İpucu, Yeni el, Oyun
  seçimi. Bilgisayarda telefon boyutunda denendi; gerçek telefonda denenmedi.
- Sırada: 3. paket, klasik solitaire; 4. paketin kalan maddeleri.

## Paketler

### 0. Depo ve iskelet · bitti (PR #1)

- Depo açıldı (Kemal, 15 Kasım; `kart-oyunu` geçici çalışma adı). İskelet: Vite + React +
  TypeScript, 2B, dikey. `CLAUDE.md`, tasarım belgesi (taslak), bu yol haritası,
  `docs/lisanslar.md`, `src/metinler/tr.json` ve `en.json`. Deneme bağlantısı GitHub Pages'te
  (https://hkemal94.github.io/kart-oyunu/; ilk sefer için Kemal'in Pages ayarı gerekiyor).
- Ekranda: açılış ekranı, oyun seçimi (Spider açık, klasik solitaire "yakında"; ayarlar,
  istatistik, paketler "yakında"). Yazılar yer tutucu.

### 1. Kart ve masa (yer tutucu deste) · bitti (PR #1)

- Kartlar kodla çizilir: köşede büyük değer ve takım simgesi, kırmızı ve siyah; arka yüz düz
  kiremit (yer tutucu). Dikey ekrana göre düz lacivert masa (kulüp evi görseli 11. pakette).
- Spider dağıtımı (on sütun, ilk dördüne altışar, kalanlara beşer; 50 kart destede). Karta
  dokun, sonra sütuna dokun; ya da sürükle. Uzun sütun alana sığsın diye sıkışır.
- Kural kontrolü yok: her açık kart her sütuna gider; sütunda en üstte kalan kapalı kart açılır.

### 2. Spider (Kemal, 15 Kasım: önce Spider) · bitti (PR #3)

- Standart kurallar (belge 1.2), 1 / 2 / 4 renk, iki deste. Doğru diziyi taşıma, tamamlanan
  dizinin masadan kalkması, kazanma, oyun sonu ekranı (yeni el, oyun seçimi).
- Yapılan: kurallar `src/kart/spider.ts`'te, ekrandan ayrı; testleri `testler/spider.test.ts`
  (`npm test`, yeni paket yok). Bir kart bir büyük kartın üstüne (renk fark etmez); birlikte
  taşınan dizi aynı takımdan, sıralı ve açık; boş sütuna her kart ya da dizi. Kurala uymayan
  taşımada kart yumuşakça yerine döner ve hafifçe sallanır. Papazdan asa aynı takım dizisi
  kendiliğinden "Tamamlanan diziler"e gider; en üstte kalan kapalı kart açılır. Boş sütun varken
  "Dağıt"a dokununca kısa uyarı. Üstte ince satır: süre ve hamle (taşıma ve dağıtma birer hamle).
  Sekiz dizide oyun sonu: süre, hamle, "Yeni el", "Oyun seçimi". Ekran görüntüleri:
  `docs/ekran-goruntuleri/spider-*.png`.
- Bu pakette yok: geri al ve ipucu (4. paket), puan (6. paket), kazanmadan bırakınca "yeniden
  dene" (oyun sonu kutusu yalnız kazanınca çıkıyor; kaybetme ekranı 4. pakette geri al ile
  birlikte düşünülür, öneri).
- Dikey ekranda on sütun: köşe okunurluğu burada denenir; sonuç deste görsellerine kural olarak
  gider (Merch Tasarımcısı'na not). Kemal küçük telefonda dener.
- Neye bağlı: 1. paket.

### 3. Klasik solitaire

- Standart kurallar (belge 1.1), 1 ve 3 kart çekme, kazanma, oyun sonu ekranı. Oyun seçiminde
  ikinci kart açılır.
- Neye bağlı: 2. paket.

### 4. Yardımcılar · geri al ve ipucu bitti (`ajans/geri-al-ipucu`), kalanlar bekliyor

- Geri al, ipucu, kendiliğinden bitirme, kaldığı yerden devam (telefonun tarayıcısında saklanır),
  süre ve hamle sayacı, basit istatistik. Alt şeritte geri al, ipucu, yeni el, menü; üstte ince
  sayaç satırı.
- Geri al sınırı karar değil; karar gelene kadar sınırsız (öneri; belge 7).
- İpucu web'de reklamsız çalışır (Kemal, 15 Kasım); reklamla alınması telefon adımında.
- **Geri al · bitti (Spider).** Son hamleyi geri getirir: taşıma, dağıtma, kendiliğinden açılan
  kart, kalkan dizi. Arka arkaya basılabilir; Kemal'in kararına kadar sınırsız. Geri almak da
  bir hamle sayılır (öneri; standart çözüm). Yeni elde geçmiş sıfırlanır.
- **İpucu · bitti (Spider).** Bir hamleyi kısa süre parlatır (taşınacak kart ya da dizi ve
  gideceği sütun). Sıra (öneri): aynı takıma konan, kapalı kartı açan, öbürleri; bir şey
  kazandırmayan hamle önerilmez. Arka arkaya basınca sıradaki ipucu gelir. Hamle yoksa "Dağıt"
  parlar; o da yoksa kısa uyarı. Reklamın takılacağı yer ayrıldı (`src/reklam/ipucuHakki.ts`);
  web'de hep serbest. Kurallar `src/kart/spider.ts`'te, testleri `testler/yardimcilar.test.ts`.
  Ekran görüntüleri: `docs/ekran-goruntuleri/yardim-*.png`.
- Alt şerit: Geri al, İpucu, Yeni el, Oyun seçimi (tek satır; "menü" 7. pakette ana ekranla gelir).
- **Bekliyor:** kendiliğinden bitirme, kaldığı yerden devam, basit istatistik; klasik solitaire
  için geri al ve ipucu (3. paketle). Süre ve hamle sayacı 2. pakette geldi; ayardan kapatma
  5. pakette.
- Neye bağlı: 2. ve 3. paket.

### 5. Ayarlar ve iki dil

- Ayarlar ekranı (ses ve mahalle sesi ayrı, dil, sol el düzeni, sayaçları gizle, deste seçimi).
  Dil seçimi ekrandan (şimdilik telefonun diline göre). Sade destenin dört renkli hâli (öneri).
  Kart köşesindeki harflerin dile göre değişmesi açık soru. Titreşim ve "her hamlede puanı göster"
  (Kemal, 15 Kasım; puan 6. pakette gelince çalışır).

### 6. Puan ve en iyi puan (Kemal, 15 Kasım; örnek oyun)

- Süre ve hamleye göre çarpanlı puan, "tüm zamanların en iyisi"; oyun sonu ekranında ve ayar açıksa
  masanın bilgi satırında (belge 8.3).
- Formül ve çarpanlar [Kemal]; standart çözüm sonra seçilir, ajans aday getirir.
- Neye bağlı: 4. paket (süre ve hamle sayacı), Kemal'in formül kararı.

### 7. Ana ekran ve Ben sekmesi (Kemal, 15 Kasım; örnek oyun)

- Altta üç sekme: ana ekran, mücadeleler, ben. Ana ekranda üstte günlük mücadele ve etkinlik
  kartları (yer tutucu), ortada oyunun adı [Kemal] ve en iyi puan, altta "devam et" ve "yeni oyun"
  (belge 2).
- Ben sekmesi: ödüller, ayarlar (5. paket buraya taşınır), nasıl oynanır, yardım, oyun hakkında,
  gizlilik; metinler yer tutucu.
- Neye bağlı: 5. ve 6. paket.

### 8. Günlük mücadele (Kemal, 15 Kasım; örnek oyun)

- Her gün bir el; kazanınca takvimde o güne yıldız; ay dolunca aylık ödül (belge 8.1). Takvim
  Mücadeleler sekmesinde.
- Ödülün görseli [Kemal] (örnekteki kupa kopyalanmaz); o zamana kadar yer tutucu.
- Neye bağlı: 7. paket; hangi oyun ve zorluk Kemal'in kararı.

### 9. Kartpostal etkinliği (Kemal, 15 Kasım; örnek oyun)

- Süreli etkinlik; resim karelere bölünür, kazanılan her el bir kare açar; kare rengi zorluğu
  gösterir; biten resim koleksiyona girer, önceki bitmeden sonraki kilitli (belge 8.2).
- Kare sayısı, süre, renk ve zorluk eşleşmesi [Kemal]; o zamana kadar yer tutucu resim ve değer.
- Neye bağlı: 7. paket.

### 10. Kartpostal görselleri (görsel paketi)

- Düzada kartpostalları; hangi yerler [Kemal]. Her yer künyede ve vikide yeniden okunur, ilham
  panosuna bakılır; taslak görsel, Kemal seçer, oyuna girer. **Görsel üretimi Kemal onayıyla.**
- Neye bağlı: 9. paket ve Kemal'in yer seçimi.

### 11. Kulüp evi masası (görsel)

- Yer künyede ve vikide yeniden okunur; ilham panosuna bakılır; taslak görsel, Kemal seçer, oyuna
  girer. Taş avlulu çiftlik evi, Kangal, zeytinlik ve yamaç; deniz görünmez (belge 3.1).
- Neye bağlı: Kemal'in görsel onayı. O zamana kadar düz masa kalır.

### 12. Sesler

- Kart sesleri ve kulüp evinin ortam sesi; ücretsiz ve ticari kullanıma açık kaynaklardan,
  kaynak Kemal'e sorularak. Lisans kaydı.

### 13. Paketler ekranı (yer tutucu)

- İki sekme (desteler, masalar); Sürek Kulübü destesi ve sade deste "kullan"; kilitli deste yer
  tutucu kart. "Aç" ve "reklam izle, bir el dene" görünür ama web'de gerçek değildir.
- Sade Meyhane bu pakette yok (Kemal, 15 Kasım: görseli gelince karar).

### 14. Sürek Kulübü destesi (görseller)

- Arka yüz, 52 ön yüz ve 2 joker; merch destesiyle aynı tasarım (belge 4.1). Oyuna girince
  varsayılan deste olur.
- Neye bağlı: arka yüz için Kemal'in yorumu, ön yüz çizim stili, 2. paketteki okunurluk sonucu.

### 15. Sade Meyhane masası · bekliyor

- Kemal, 15 Kasım: görseli gelince karar verilecek; şimdilik oyuna konmaz. Görsel geldiğinde ne
  görüneceği ve web denemesinde açık mı duracağı Kemal'e sorulur (belge 3.2 ve 7).

### 16. Web deneme turu

- Bütün ekranlar küçük ve büyük telefonda denenir; Kemal ve yakın çevresi bağlantıdan oynar;
  geri bildirimler küçük paketler olur.

### Sonra: telefon uygulaması

- Telefon paketleme ve dikey ekran kilidi; uygulama içi satın alma; para modeli "örnekteki gibi"
  (Kemal, 15 Kasım): ipucu reklam izleyerek, el bitince reklam, bir kez satın alınınca reklam
  kalkar; ödüllü reklamla kilitli masa ya da deste denemesi (reklam sıklığı ve fiyat [Kemal]);
  mağaza sayfaları, gizlilik metni. Mağaza ve
  reklam hesapları Kemal'in hesabıyla açılır.

## Bitenler

- 0. Depo ve iskelet ve 1. Kart ve masa (PR #1, 15 Kasım 2026).
- 2. Spider kuralları (PR #3, 15 Kasım 2026).
- 4. Yardımcılar: geri al ve ipucu, Spider (`ajans/geri-al-ipucu`, 15 Kasım 2026; Kemal
  birleştirince kesinleşir).
