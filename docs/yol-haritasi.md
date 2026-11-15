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
- Sırada: 2. paket, Spider kuralları.

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

### 2. Spider (Kemal, 15 Kasım: önce Spider)

- Standart kurallar (belge 1.2), 1 / 2 / 4 renk, iki deste. Doğru diziyi taşıma, tamamlanan
  dizinin masadan kalkması, kazanma, oyun sonu ekranı (yeni el, yeniden dene, oyun seçimi).
- Dikey ekranda on sütun: köşe okunurluğu burada denenir; sonuç deste görsellerine kural olarak
  gider (Merch Tasarımcısı'na not). Kemal küçük telefonda dener.
- Neye bağlı: 1. paket.

### 3. Klasik solitaire

- Standart kurallar (belge 1.1), 1 ve 3 kart çekme, kazanma, oyun sonu ekranı. Oyun seçiminde
  ikinci kart açılır.
- Neye bağlı: 2. paket.

### 4. Yardımcılar

- Geri al, ipucu, kendiliğinden bitirme, kaldığı yerden devam (telefonun tarayıcısında saklanır),
  süre ve hamle sayacı, basit istatistik. Alt şeritte geri al, ipucu, yeni el, menü; üstte ince
  sayaç satırı.
- Geri al sınırı karar değil; karar gelene kadar sınırsız (öneri; belge 7).
- İpucu web'de reklamsız çalışır (Kemal, 15 Kasım); reklamla alınması telefon adımında.
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
