# Kart oyunu · Yol haritası

> **TASLAK · Kemal onaylamadı.** Paketler Kems Ajans'taki yapım planı taslağından
> (`oneriler/kart-oyunu-yapim-plani-16-11-2026.md`); sıra Kemal'in 15 Kasım kararıyla değişti:
> Spider 2. pakette, klasik solitaire ondan sonra.

Yazan: Oyun Geliştiricisi (Kems Ajans), 15 Kasım 2026. Onay Kemal'in. Kararların ayrıntısı:
`docs/tasarim-belgesi.md`. Tarih ve süre yazılmadı (veri yok). Her paket küçük, tek PR'la gelir;
her paketin sonunda Kemal'in telefonda açıp deneyebileceği bir şey olur. Önce "oynanış oturdu mu",
sonra "güzel mi". Kemal "şimdi" derse bir paket öne geçer.

## Neredeyiz

- 15 Kasım 2026 (öneri; `ajans/iskelet`): 0. ve 1. paket. Dikey açılış ekranı, oyun seçimi
  (Spider açık, klasik solitaire "yakında"), düz lacivert masa, kodla çizilen kartlar. Spider
  eli dağıtılıyor (1, 2, 4 renk); kart dokunarak ya da sürükleyerek taşınıyor; desteye dokununca
  her sütuna birer kart geliyor. Kural kontrolü yok. Yazılar yer tutucu; oyunun adı [Kemal].
  Ekran görüntüleri: `docs/ekran-goruntuleri/`. Bilgisayarda telefon boyutunda denendi; gerçek
  telefonda denenmedi.
- Sırada: 2. paket, Spider kuralları.

## Paketler

### 0. Depo ve iskelet · öneri (`ajans/iskelet`)

- Depo açıldı (Kemal, 15 Kasım; `kart-oyunu` geçici çalışma adı). İskelet: Vite + React +
  TypeScript, 2B, dikey. `CLAUDE.md`, tasarım belgesi (taslak), bu yol haritası,
  `docs/lisanslar.md`, `src/metinler/tr.json` ve `en.json`. Deneme bağlantısı GitHub Pages'te
  (https://hkemal94.github.io/kart-oyunu/; ilk sefer için Kemal'in Pages ayarı gerekiyor).
- Ekranda: açılış ekranı, oyun seçimi (Spider açık, klasik solitaire "yakında"; ayarlar,
  istatistik, paketler "yakında"). Yazılar yer tutucu.

### 1. Kart ve masa (yer tutucu deste) · öneri (`ajans/iskelet`)

- Kartlar kodla çizilir: köşede büyük değer ve takım simgesi, kırmızı ve siyah; arka yüz düz
  kiremit (yer tutucu). Dikey ekrana göre düz lacivert masa (kulüp evi görseli 6. pakette).
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
- Neye bağlı: 2. ve 3. paket.

### 5. Ayarlar ve iki dil

- Ayarlar ekranı (ses ve mahalle sesi ayrı, dil, sol el düzeni, sayaçları gizle, deste seçimi).
  Dil seçimi ekrandan (şimdilik telefonun diline göre). Sade destenin dört renkli hâli (öneri).
  Kart köşesindeki harflerin dile göre değişmesi açık soru.

### 6. Kulüp evi masası (görsel)

- Yer künyede ve vikide yeniden okunur; ilham panosuna bakılır; taslak görsel, Kemal seçer, oyuna
  girer. Taş avlulu çiftlik evi, Kangal, zeytinlik ve yamaç; deniz görünmez (belge 3.1).
- Neye bağlı: Kemal'in görsel onayı. O zamana kadar düz masa kalır.

### 7. Sesler

- Kart sesleri ve kulüp evinin ortam sesi; ücretsiz ve ticari kullanıma açık kaynaklardan,
  kaynak Kemal'e sorularak. Lisans kaydı.

### 8. Paketler ekranı (yer tutucu)

- İki sekme (desteler, masalar); Sürek Kulübü destesi ve sade deste "kullan"; kilitli deste yer
  tutucu kart. "Aç" ve "reklam izle, bir el dene" görünür ama web'de gerçek değildir.
- Sade Meyhane bu pakette yok (Kemal, 15 Kasım: görseli gelince karar).

### 9. Sürek Kulübü destesi (görseller)

- Arka yüz, 52 ön yüz ve 2 joker; merch destesiyle aynı tasarım (belge 4.1). Oyuna girince
  varsayılan deste olur.
- Neye bağlı: arka yüz için Kemal'in yorumu, ön yüz çizim stili, 2. paketteki okunurluk sonucu.

### 10. Sade Meyhane masası · bekliyor

- Kemal, 15 Kasım: görseli gelince karar verilecek; şimdilik oyuna konmaz. Görsel geldiğinde ne
  görüneceği ve web denemesinde açık mı duracağı Kemal'e sorulur (belge 3.2 ve 7).

### 11. Web deneme turu

- Bütün ekranlar küçük ve büyük telefonda denenir; Kemal ve yakın çevresi bağlantıdan oynar;
  geri bildirimler küçük paketler olur.

### Sonra: telefon uygulaması

- Telefon paketleme ve dikey ekran kilidi; uygulama içi satın alma; seyrek geçiş reklamı ve
  isteğe bağlı ödüllü reklam (sayılar [Kemal]); mağaza sayfaları, gizlilik metni. Mağaza ve
  reklam hesapları Kemal'in hesabıyla açılır.

## Bitenler

Henüz ana dala birleşen paket yok.
