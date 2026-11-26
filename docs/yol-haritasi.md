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
- 15 Kasım 2026 (aynı öneri, soru turu sonrası): Kemal'in 15 Kasım soru turu işlendi (kayıt
  `docs/soru-cevap/kart-oyunu-1.md`). Geri al artık her elde sınırlı hakla; haklar bitince
  "reklam yerine" kutusu bir hak verir. İpucunda diziyi tamamlayan hamle önce gelir. Belge 1.3, 5,
  7, 8.1–8.3 güncellendi.
- 15 Kasım 2026 (öneri; `ajans/klasik-solitaire`, `ajans/geri-al-ipucu`'nun üstünde): 3. paket,
  klasik solitaire (Kemal: "klasik solitaire'e başla"). Oyun seçiminde ikinci kart açıldı (1 ya da
  3 kart çekme). Masada üstte dört temel yığın, açılan kartlar ve deste; altında yedi sütun; en
  altta aynı düğmeler (geri al hakla, ipucu, yeni el, oyun seçimi). Belgeye Kemal'in soru turu 2.
  set kararları da işlendi (kartpostal yerleri, yazısız kartpostal, aylık ödül adayları).
  Bilgisayarda telefon boyutunda denendi; gerçek telefonda denenmedi.
- 15 Kasım 2026 (öneri; `ajans/puan`): 6. paket, puan ve en iyi puan (Kemal: "Puanla devam et").
  Masanın üst satırında puan ve aşama; oyun sonunda bu elin puanı, seri puanı, yeni aşama ve "Yeni
  en iyi"; oyun seçiminde her kartın altında en iyi puan; el yarımken "Yeni el" ya da "Oyun
  seçimi"ne basınca eli bırakma sorusu. Formül için üç aday (a, b, c; `?puan=b`); Kemal seçecek.
  Bilgisayarda telefon boyutunda denendi; gerçek telefonda denenmedi.
- 15 Kasım 2026 (öneri; `ajans/spider-duzen`): Spider düzeni (Kemal 15 Kasım). Spider'da kartlar
  biraz uzadı, kartlar arası aralık ekranın yüksekliğine göre açıldı; elin başında masa daha dolu.
  Sütun uzadıkça aralık kendiliğinden sıkışır (önce kapalı kartlar), alt şeritle çakışmaz. Alt
  şeritte tamamlanan diziler ve deste dar yelpaze (kartlar birbirinin üstüne yarı biner); boş dizi
  yuvası yok, yalnız "2/8" sayacı. Klasik solitaire'de aralık da ekrana göre; düzeni aynı.
  Bilgisayarda 320x640, 390x844 ve 430x932 boyutlarında denendi (taşma yok); gerçek telefonda
  denenmedi. Ekran görüntüleri: `docs/ekran-goruntuleri/duzen-*.png`.
- 15 Kasım 2026 (öneri; `ajans/ayarlar-dil`, `ajans/spider-duzen`'in üstünde): 5. paket, ayarlar
  ve iki dil. Oyun seçimindeki "Ayarlar" açıldı, masada küçük ayar düğmesi; ses, mahalle sesi ve
  titreşim anahtarları (ses paketi gelince), sol el düzeni, sayaçları gizle, her hamlede puanı
  göster, dil (Türkçe / English), deste (sade). Dil anında değişir, ayarlar saklanır. KKM için
  `docs/ekran-goruntuleri/liste.json` ve `src/oyun/ayarlar.json` (geri al hakkı, puan adayı ve
  adayların sayıları; oyun bu dosyadan okur). Bilgisayarda telefon boyutunda denendi; gerçek
  telefonda denenmedi.
- 15 Kasım 2026 (öneri; `ajans/ana-ekran`): 7. paket, ana ekran ve Ben sekmesi (Kemal: "Ana
  ekran ve Ben sekmesiyle devam et"); 4. paketten kaldığı yerden devam ve basit istatistik de geldi.
  Altta üç sekme (Ana ekran · Mücadeleler · Ben); masada sekmeler gizli. Ana ekranda "Yakında"
  kartları (günlük mücadele, kartpostal etkinliği), oyunun adı [Kemal], en iyi puan, "Oyuna devam
  et" ve "Yeni oyun". Yarım el sayfa kapansa da saklanıyor. Ben sekmesinde ödüller (boş), istatistik,
  ayarlar, nasıl oynanır (taslak), yardım, oyun hakkında, gizlilik (yer tutucu). Masadaki dördüncü
  düğme "Ana ekran" oldu. Bilgisayarda telefon boyutunda denendi; gerçek telefonda denenmedi.
  Ekran görüntüleri: `docs/ekran-goruntuleri/ana-*.png`.
- 15 Kasım 2026 (aynı öneri, `ajans/ana-ekran`; Kemal: "Çerçeve + içerik ortada toplansın"): bütün
  ekranlarda ortak kenar payı; menü ekranlarında içerik ortada; masa ince çerçeveli tek blok, dikeyde
  ortada, sütunlar uzayınca büyür. Kart boyu değişmedi. 320x640, 390x844 ve 430x932'de denendi
  (taşma yok); gerçek telefonda denenmedi. Ekran görüntüleri: `ana-8-spider-dagitim.png`,
  `ana-9-klasik-dagitim.png`.
- 15 Kasım 2026 (öneri; `ajans/gunluk-mucadele`): 8. paket, günlük mücadele (Kemal: "Günlük
  mücadeleye başla"). Mücadeleler sekmesinde takvim (Pazartesi'den başlar, kazanılan günde yıldız,
  bugün vurgulu, gelecek günler soluk ve kilitli, önceki aylara ok), altta seçili günün oyunu,
  zorluğu ve "Oyna". Ana ekrandaki "Günlük mücadele" kartı açıldı (bugünün tarihi ve "Oyna";
  kazanıldıysa yıldız). Masada üst satırda günün tarihi işareti; kazanınca oyun sonunda "Günün
  yıldızı". Ayın bütün günleri yıldızlanınca Ben → Ödüller → Aylık ödüller'de yer tutucu rozet
  (görsel Kemal'de). Bilgisayarda telefon boyutunda denendi; gerçek telefonda denenmedi. Ekran
  görüntüleri: `docs/ekran-goruntuleri/gunluk-*.png`. Bu öneri birleşince sıradaki iş: 4. paketten kalan
  kendiliğinden bitirme, sonra 9. paket (kartpostal etkinliği).
- 15 Kasım 2026 (aynı öneri, `ajans/ana-ekran`; Kemal: "İnce kenar, masa ekranı doldursun", örnek
  ekran için "Bu uygun işte"): çerçeve kalktı, kenar payı inceldi (8-12 piksel); masa ekranın tamamını
  kaplar, kartlar ekran enini doldurur, kapalı kartlar sık; bilgi satırı iki satır ve büyük yazı;
  düğmeler başparmak boyunda. 320x640, 390x844 ve 430x932'de denendi (taşma yok); gerçek telefonda
  denenmedi. Ekran görüntüleri: `ana-*.png` yenilendi.
- 15 Kasım 2026 (öneri; `ajans/ust-alt-pay`; Kemal: "Altlı üstlü birer kart boyu kadar artırır mısın
  sayfa kenarını"): iki masada bilgi satırının üstüne ve düğmelerin altına birer kart boyu boşluk
  (Spider ve klasikte kendi kart boyu). Kart eni ve boyu, yan paylar değişmedi; kartların alanı bu pay
  kadar kısaldı, uzun Spider sütunu yine alt şeride değmez. Menü ekranları değişmedi. 320x640,
  390x844 ve 430x932'de denendi (taşma yok); gerçek telefonda denenmedi. Ekran görüntüleri:
  `pay-*.png`.
- 15 Kasım 2026 (öneri; `ajans/telefon-yorumlari-1`; Kemal telefonda denedi, beş yorum): (1) karta
  çift dokununca gidebileceği yere kısa bir kaymayla gider (klasikte önce temel, yoksa uygun sütun;
  Spider'da önce aynı takımın bir büyüğü, sonra başka takımın bir büyüğü, en son boş sütun); yer
  yoksa kart sallanır; hamle sayılır, geri alınır. (2) Yeni elde kartlar desteden teker teker uçarak
  dağılır, Spider'da "Dağıt"taki on kart da; dağıtım sürerken masaya dokununca hemen biter; kaldığı
  yerden açılan elde hareket yok. (3) O an hiçbir yere oynanamayan açık kartlar biraz koyu; Ayarlar'da
  "Oynanamayan kartları koyulaştır" (varsayılan açık). (4) Spider'da tamamlanan sıra astan papaza teker
  teker "Tamamlanan diziler"e akar. (5) Takvim en çok Ocak 2026'ya kadar geri gider. Süreler ayar
  dosyasında (`src/oyun/ayarlar.json` → hareket; öneri, Kemal ayarlar). Telefonda "hareketi azalt"
  açıksa hareketler atlanır. Bilgisayarda telefon boyutunda (390x844) denendi; gerçek telefonda
  denenmedi. Ekran görüntüleri: `docs/ekran-goruntuleri/yorum-*.png`.
- 15 Kasım 2026 (öneri; `ajans/kendiliginden-bitirme`; Kemal: sıradaki adım kendiliğinden bitirme):
  4. paketten kalan kendiliğinden bitirme. Klasik solitaire'de bütün kartlar açık, deste ve açılan
  kartlar boşken masanın altında "Bitir" düğmesi çıkar; basınca kartlar en küçükten birer birer
  temellere kayar, el kazanılır (puan, istatistik, günlük yıldız normal). Bitirme tek geri al adımı;
  sürerken masaya dokununca hemen biter. Spider'a konmadı (sonra Kemal: Spider'da "Bitir" olmasın).
  Günlük elde "Yeni el" günün elini baştan dağıtır: Kemal "şu anki kalsın" dedi, belgeye karar
  olarak yazıldı. Bilgisayarda telefon boyutunda (390x844) denendi; gerçek telefonda denenmedi.
  Ekran görüntüleri: `docs/ekran-goruntuleri/bitir-*.png`.
- 15 Kasım 2026 (öneri; `ajans/spider-bitir-karari`): yalnız belge. Kemal: Spider'da "Bitir"
  olmasın, önerilen hâl kalıcı (belge 7, soru 15 kapandı). Oyunda değişen bir şey yok.
- 15 Kasım 2026 (öneri; `ajans/kilitli-deste-kararlari`): yalnız belge. Kemal'in deste kararları:
  12 paket deste (beş mahallenin her biri için ikişer, 2 renk destesi; ikişerli seriler), bir süre
  yalnız arka yüzler (günlük görsel işine de girer), masa ve deste ayrı paketler, web denemesinde
  hepsi açık. Oyunda değişen bir şey yok.
- 15 Kasım 2026 (öneri; `ajans/pul-koleksiyonu-karari`): yalnız belge. Kemal: aylık rozet yerine
  pul koleksiyonu. Her ay bir pul; çeyreğin üç pulu toplanınca büyük bir 4. pul ("3+1"). Her pul
  ayrı tasarlanır, yazısız; Ben → Ödüller'de kart ve ayrı sayfa. Oyunda değişen bir şey yok; kodu
  sonraki pakette (pullar tasarlanınca görseller girer, o zamana kadar yer tutucu).
- 15 Kasım 2026 (öneri; `ajans/pul-koleksiyonu`; Kemal: "başla"): pul koleksiyonu paketi. Ben →
  Ödüller'de "Aylık ödüller" yerine "Pul koleksiyonu" kartı (son üç pul ve kaç pul toplandığı);
  dokununca ayrı sayfa: yıl başına bir bölüm, her çeyrekte üç aylık pul ve yanında büyük 4. pul,
  altında çeyrek ve yıl ("Ocak–Mart 2026"). Pullar kodla çizilmiş yer tutucu: tırtıklı kenar, krem
  zemin, lacivert ince çizgi, yazısız; büyük pul çift çerçeveli. Kazanılmamış pul soluk, gelecek
  aylar kilitli. Takvimde ve oyun sonunda "Bu ayın pulu kazanıldı", çeyrek de tamamsa "Çeyreğin büyük
  pulu kazanıldı". Ayrı kayıt yok: pullar yıldızlı günlerden hesaplanır, eski rozetler kaybolmaz.
  Pul bütün oyunların ortak ödül sistemi olduğu için (Kemal, 15 Kasım) pul kodu oyundan bağımsız
  `src/pul/` klasöründe; görseller `src/pul/pullar.ts`'e tek tek eklenir. Bilgisayarda telefon
  boyutunda (390x844) denendi; gerçek telefonda denenmedi. Ekran görüntüleri:
  `docs/ekran-goruntuleri/pul-*.png`.
- 15 Kasım 2026 gece (öneri; `ajans/kemal-notlari-15-11`; Kemal'in gece notları): (1) Oyunun adı
  geldi (Kemal seçti): **Düzada Cards Club**, altındaki tanıtıcı satır "Solitaire · Spider" (İngilizcede
  de aynen). Açılışta, ana ekranda, oyun seçiminde, Ben → Oyun hakkında'da ve tarayıcı sekmesinin
  başlığında bu ad. Açılış ekranı ortada derli toplu; uzun telefonda kart yelpazesi biraz büyür. Depo
  adı `kart-oyunu` çalışma adı olarak kalır. (2) Koyulaştırmada düzeltme (Kemal: "Bir kart en öndeyse
  koyu olmaz"): sütunun en önündeki kart oynanamasa da koyu olmaz; yalnız arkada kalan, oynanamayan
  açık kartlar koyulaşır (Spider ve klasik; klasikte açılanların ve temellerin en üstteki kartı da
  koyu olmaz). Bilgisayarda telefon boyutunda (390x844) denendi; gerçek telefonda denenmedi. Ekran
  görüntüleri: `docs/ekran-goruntuleri/ad-*.png`.
- 16 Kasım 2026 (öneri; `ajans/ben-ust-bosluk`; Kemal: "Yap"): Ben sekmesinde ve bütün alt
  sayfalarında (Pul koleksiyonu, İstatistik, Nasıl oynanır, Yardım, Oyun hakkında, Gizlilik) içerik
  artık ekranın ortasına inmiyor; başlığın hemen altından başlıyor, üstte boşluk kalmıyor. Ayarlar
  zaten ekranın üstüne açılan kutu, değişmedi. Ana ekran, Mücadeleler, oyun seçimi ve masa
  değişmedi. Bilgisayarda iPhone 13 boyutunda denendi; gerçek telefonda denenmedi. Ekran
  görüntüleri: `docs/ekran/ben-ust-bosluk/` (önce-sonra). Bu iş bitti.
- 16 Kasım 2026 (öneri; `ajans/mucadeleler-ust-bosluk`; Kemal onayladı): aynı düzeltme Mücadeleler
  sekmesine ve oyun seçimine. İçerik artık ekranın ortasına inmiyor; başlığın hemen altından
  başlıyor, kalan boşluk altta. Kural genelleşti: menü ekranları arasında yalnız Ana ekran ortalı
  kalıyor. Ana ekran ve masa değişmedi. Fark içeriğin ekrandan kısa kaldığı uzun ekranlarda görünür
  (bilgisayarda iPad Mini boyutunda denendi); iPhone 13 boyutunda içerik ekrandan uzun olduğu için
  görüntü önce ve sonra aynı. Gerçek telefonda denenmedi. Ekran görüntüleri:
  `docs/ekran/mucadeleler-ust-bosluk/` (önce-sonra).
- 16 Kasım 2026 (öneri; `ajans/puan-a`; Kemal kararı): puan formülü kesinleşti, **a · çarpanlı
  taban (aşama çarpanlı)**. b ve c adayları ve adresle aday denemesi kalktı; adres sonundaki
  `?puan=` artık bir şey yapmaz. Ekranda değişen yok: puan zaten a ile hesaplanıyordu. Deneme
  günlerinde a ile toplanan seri ve en iyi puan korunur; b ve c ile toplananlar okunmaz. Sayılar
  (2000 taban, hamle başı 2, dakikada 30, en az 200) deneme varsayılanı, Kemal onaylamadı; KKM →
  Oyunlar → Ayarlar'da "Puan · a · çarpanlı taban" bölümünde. Bilgisayarda iPhone 13 boyutunda
  denendi; gerçek telefonda denenmedi. Ekran görüntüsü: `docs/ekran/puan-a/` (sonra).
- 24 Kasım 2026 (öneri; `ajans/surek-deste-arkalari`; Kemal: "iki desteyi otomatik ata, farklı
  renklerde aynı desende olsun"): 14. paketin ilk adımı, Sürek Kulübü destesinin arka yüzü. Desen
  ince dikey şerit, ortada krem oval içinde siyah Kangal; iki set iki renkte (klasik iskambildeki iki
  deste gibi): 1. set lacivert-kiremit, 2. set ege-kırmızı. Spider iki desteyle oynandığı için kapalı
  kartlar iki setten karışık gelir (ilk dört dizi 1. set, son dört dizi 2. set); klasik solitaire tek
  deste, hep 1. set. Ayarlar → Deste'de "Sürek Kulübü destesi" (varsayılan) ve "Sade deste" (eski düz
  kiremit arka yüz) seçilir. Ön yüzler iki destede de şimdilik sade. Daha önce saklanan "sade"
  seçimi seçim sayılmadı (tek seçenekti); herkes Sürek destesiyle açar. Bilgisayarda iPhone 13
  boyutunda denendi; gerçek telefonda denenmedi. Ekran görüntüleri: `docs/ekran-goruntuleri/surek-*.png`.
- 26 Kasım 2026 (öneri; `ajans/spider-gri-kural`; Kemal: "Sıralı dizideyse gri olmasın"): Spider'da
  gri kural değişti. Aynı takımdan, birer birer küçülerek giden dizinin her kartı açık renkte kalır,
  o an gidecek yeri olmasa da (ör. K-Q-J-10♠'nin dördü de açık). Yalnız sırayı bozan bir kartın
  altında kalıp taşınamayan açık kartlar gri (ör. 7♠ üstünde 6♥ varsa 7♠ gri). En öndeki kart yine
  hiç griye dönmez; klasik solitaire değişmedi. Bilgisayarda 390x844 boyutunda denendi; gerçek
  telefonda denenmedi. Ekran görüntüsü: `docs/ekran-goruntuleri/gri-1-spider-sirali-dizi.png`.
  Aynı öneride (Kemal, 26 Kasım) Ayarlar'daki açıklama: "Sırası bozulan dizinin altında kalan kartlar
  biraz koyu görünür" (İngilizcesi de).
- 26 Kasım 2026 (öneri; `ajans/klasik-gri-kural`; Kemal: "Klasik solitaire de Spider gibi olsun"):
  klasik solitaire'de de sütunlardaki gri kural Spider'daki gibi. Renkleri sırayla değişen, birer
  birer küçülen açık dizinin her kartı açık renkte kalır, o an gidecek yeri olmasa da; yalnız sırası
  bozulan kartın altında kalanlar koyu. Oyunun hamleleri sütunda sırası bozuk açık kart bırakmadığı
  için sütunlarda koyulaşma artık görünmez; açılanlar (3 kart çekmede arka iki kart) ve temeller eskisi
  gibi. Bilgisayarda 390x844 boyutunda denendi; gerçek telefonda denenmedi. Ekran görüntüsü:
  `docs/ekran-goruntuleri/gri-2-klasik-sirali-dizi.png`.
- Sırada: 9. paket (kartpostal etkinliği); pul görselleri tasarlandıkça tek tek.

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

### 3. Klasik solitaire · bitti (`ajans/klasik-solitaire`; Kemal birleştirince kesinleşir)

- Standart kurallar (belge 1.1), 1 ve 3 kart çekme, kazanma, oyun sonu ekranı. Oyun seçiminde
  ikinci kart açılır.
- Yapılan: kurallar `src/kart/klondike.ts`'te, ekrandan ayrı; testleri `testler/klondike.test.ts`
  (dağıtım, ters renk dizme, boş sütuna papaz, temel, deste dönüşü, kazanma, geri al, ipucu).
  Spider ile ortak parçalar (karıştırma, geri al) `src/kart/ortak.ts`'te; iki masanın ortak
  ekran parçaları (süre, alt şerit, "reklam yerine" kutusu, oyun sonu) `src/ekranlar/masaOrtak.tsx`'te.
  Spider testleri değişmeden geçiyor.
- Ekranda: tek deste, yedi sütun (1'den 7'ye, üstteki açık). Üstte dört temel yığın (her yığın
  bir takımın; içinde soluk takım simgesi), açılan kartlar (3 kart çekmede son üçü yan yana) ve
  deste. Desteye dokununca kart açılır; deste bitince yerinde dönüş simgesi çıkar, dokununca
  açılanlar destenin altına döner (sınırsız; sınır Kemal'e soru). Bir küçük ve ters renk dizilir;
  açık sıralı dizi birlikte taşınır; boş sütuna yalnız papaz. Temelden sütuna geri almak serbest.
  Kart dokunarak (karta, sonra gideceği yere) ya da sürükleyerek taşınır; karta çift dokununca
  uygun temel yığına gider (telefon yorumlarıyla: temele gidemiyorsa uygun bir sütuna). Kurala uymayan taşımada kart yerine döner ve sallanır. 52 kart
  temelde olunca oyun sonu: süre, hamle, "Yeni el", "Oyun seçimi".
- Geri al ve ipucu Spider'daki gibi; geri al hakkı aynı yerden (`src/kart/geriAlHakki.ts`,
  `?geriAlHak=`). İpucu sırası (öneri): temele giden, kapalı kartı açan, öbürleri; hamle yoksa
  deste parlar.
- Deneme yolları (yalnız geliştirmede): `?deneme=klasik-kazan` (papaza çift dokununca oyun biter),
  `?deneme=klasik-orta` (3 kart çekme, oyun ortası).
- Ekran görüntüleri: `docs/ekran-goruntuleri/klondike-*.png`.
- Bu pakette yok: kendiliğinden bitirme (4. paket), puan (6. paket).
- Neye bağlı: 2. paket.

### 4. Yardımcılar · bitti (kendiliğinden bitirme `ajans/kendiliginden-bitirme`; Kemal birleştirince kesinleşir)

- Geri al, ipucu, kendiliğinden bitirme, kaldığı yerden devam (telefonun tarayıcısında saklanır),
  süre ve hamle sayacı, basit istatistik. Alt şeritte geri al, ipucu, yeni el, menü; üstte ince
  sayaç satırı.
- Geri al sınırlı (Kemal, 15 Kasım soru turu): her elde birkaç ücretsiz hak, fazlası telefon
  uygulamasında reklamla. Hak sayısı [Kemal], web denemesinde seçecek.
- İpucu web'de reklamsız çalışır (Kemal, 15 Kasım); reklamla alınması telefon adımında.
- **Geri al · bitti (Spider).** Son hamleyi geri getirir: taşıma, dağıtma, kendiliğinden açılan
  kart, kalkan dizi. Geri almak bir hamle sayılır (Kemal, 15 Kasım soru turu). Yeni elde geçmiş
  sıfırlanır.
- **Geri al hakkı · bitti (Spider; Kemal, 15 Kasım soru turu).** Düğmenin yanında kalan hak
  yazar. Haklar bitince geri al'a basınca kısa kutu çıkar: "[YER TUTUCU: burada reklam olacak]"
  ve "Bir hak al"; dokununca bir hak gelir (telefon uygulamasındaki reklam akışının denemesi).
  Yeni elde haklar baştan başlar. Hak sayısı kodda tek yerde (`src/kart/geriAlHakki.ts`); oradaki
  sayı yalnız deneme varsayılanı, Kemal seçecek. Deneme için adres sonuna `?geriAlHak=5` gibi
  yazılır. Reklamın takılacağı yer `src/reklam/geriAlHakki.ts` (ipucununkiyle aynı biçimde).
  Ekran görüntüsü: `docs/ekran-goruntuleri/yardim-3-hak-bitti.png`.
- **İpucu · bitti (Spider).** Bir hamleyi kısa süre parlatır (taşınacak kart ya da dizi ve
  gideceği sütun). Sıra (Kemal, 15 Kasım soru turu): diziyi tamamlayan, aynı takıma konan, kapalı
  kartı açan, öbürleri; bir şey
  kazandırmayan hamle önerilmez. Arka arkaya basınca sıradaki ipucu gelir. Hamle yoksa "Dağıt"
  parlar; o da yoksa kısa uyarı. Reklamın takılacağı yer ayrıldı (`src/reklam/ipucuHakki.ts`);
  web'de hep serbest. Kurallar `src/kart/spider.ts`'te, testleri `testler/yardimcilar.test.ts`.
  Ekran görüntüleri: `docs/ekran-goruntuleri/yardim-*.png`.
- Alt şerit: Geri al, İpucu, Yeni el, Ana ekran (tek satır; 7. pakette "Oyun seçimi" yerine "Ana ekran").
- **Klasik solitaire için geri al ve ipucu · bitti** (3. paketle, `ajans/klasik-solitaire`).
- **Kaldığı yerden devam · bitti** (7. paketle, `ajans/ana-ekran`). En az bir hamle yapılmış el
  telefonun tarayıcısında saklanır (her hamlede, uygulamadan çıkınca, masadan çıkınca); ana ekrandaki
  "Oyuna devam et" açar. Spider ve klasik solitaire. Süre ve kalan geri al hakkı sürer; geri al
  geçmişi saklanmaz (öneri). Kurallar `src/oyun/yarimEl.ts`, testleri `testler/devam.test.ts`.
- **Basit istatistik · bitti** (7. paketle). Oyun ve zorluk başına oynanan, kazanılan, en iyi süre;
  Ben sekmesinde. `src/oyun/istatistik.ts`, testleri `testler/istatistik.test.ts`.
- **Kendiliğinden bitirme · bitti (klasik solitaire; `ajans/kendiliginden-bitirme`).** Bütün
  kartlar açık, deste ve açılan kartlar boşken masanın altında "Bitir" düğmesi; oyun kendisi
  başlatmaz. Basınca kartlar en küçükten birer birer temellere kayar (akan sıra hızı, ayar
  dosyasındaki "hareket"); sürerken masaya dokununca hemen biter; telefonda "hareketi azalt" açıksa
  kartlar hemen yerinde. Her kart bir hamle (elle bitirmekle aynı puan); puan, istatistik ve günlük
  yıldız normal kazanç gibi. Tek geri al adımı. Kurallar `src/kart/klondike.ts`, testleri
  `testler/bitirme.test.ts`. Deneme yolu (yalnız geliştirmede): `?deneme=klasik-bitir`. Spider'da
  yok: tam diziler zaten kendiliğinden kalkıyor; Kemal 15 Kasım: Spider'da "Bitir" olmasın
  (belge 7, soru 15 kapandı).
- **Bekliyor:** oyun sonu ekranında istatistik (öneri). Süre ve hamle sayacı
  2. pakette geldi; ayardan kapatma 5. pakette.
- Neye bağlı: 2. ve 3. paket.

### 5. Ayarlar ve iki dil · bitti (`ajans/ayarlar-dil`; Kemal birleştirince kesinleşir)

- Ayarlar ekranı (ses ve mahalle sesi ayrı, dil, sol el düzeni, sayaçları gizle, deste seçimi).
  Dil seçimi ekrandan (şimdilik telefonun diline göre). Sade destenin dört renkli hâli (öneri).
  Kart köşesindeki harflerin dile göre değişmesi açık soru. Titreşim ve "her hamlede puanı göster"
  (Kemal, 15 Kasım; puan 6. pakette gelince çalışır).
- Yapılan: ayarlar ekranı `src/ekranlar/Ayarlar.tsx`; ayarların saklanması ve açılış dili
  `src/oyun/oyuncuAyarlari.ts`; testleri `testler/ayarlar.test.ts` (saklama, bozuk kayıt, dil
  değişimi, iki dil dosyasının aynı anahtarları). Oyun seçimindeki "Ayarlar" ve masanın üst
  satırındaki küçük düğme açar; kapanınca el sürer. Ses, mahalle sesi, titreşim: anahtar duruyor,
  "Ses paketi gelince" yazıyor (12. paket). Sol el: alt şeritteki düğmeler ve deste yer değiştirir;
  klasik solitaire'de üst sıra ayna gibi. Sayaçları gizle: süre ve hamle görünmez. Puanı göster
  kapalıysa puan ve aşama görünmez. Dil: Türkçe / English, anında bütün ekran. Deste: yalnız sade
  deste. Ekran görüntüleri: `docs/ekran-goruntuleri/ayar-*.png`.
- KKM için (Kemal, 15 Kasım): `docs/ekran-goruntuleri/liste.json` (KKM'nin Ekran görüntüleri
  sekmesi) ve `src/oyun/ayarlar.json` (KKM'nin Ayarlar sekmesi: geri al hakkı, puan sayıları).
  Oyun bu sayıları dosyadan okur; `?geriAlHak=` deneme için çalışır (`?puan=` 16 Kasım'da kalktı).
- Bu pakette yok: sade destenin dört renkli hâli (öneri; deste seçimine ikinci seçenek olarak
  sonra), kart köşesindeki harflerin dile göre değişmesi (Kemal'e soru; şimdilik iki dilde A, J,
  Q, K), seslerin kendisi (12. paket).

### 6. Puan ve en iyi puan (Kemal, 15 Kasım; örnek oyun) · bitti (formül a, Kemal 16 Kasım; `ajans/puan`, `ajans/puan-a`)

- Süre ve hamleye göre çarpanlı puan, "tüm zamanların en iyisi"; oyun sonu ekranında ve ayar açıksa
  masanın bilgi satırında (belge 8.3).
- Formül ve çarpanlar [Kemal]; bu paket yapılırken ajans 2-3 aday getirir, Kemal seçer (Kemal,
  15 Kasım soru turu). En iyi puan oyun ve zorluk başına ayrı; günlük mücadele eli seriye sayılır
  (Kemal, 15 Kasım soru turu).
- Yapılan: kurallar ve formül `src/kart/puan.ts`'te, ekrandan ayrı; testleri `testler/puan.test.ts`.
  Kazanınca elin puanı seriye eklenir, aşama bir artar; eli bırakınca seri sıfırlanır; en iyi
  puan (en yüksek seri puanı) oyun ve zorluk başına ayrı. Seri ve en iyi puan telefonun
  tarayıcısında saklanır, sayfa kapanıp açılınca sürer. Formül: a · çarpanlı taban, aşama çarpanlı
  (Kemal, 16 Kasım; belge 8.3). b ve c adayları ve `?puan=` denemesi 16 Kasım'da kalktı. Sayılar
  deneme varsayılanı, Kemal seçecek.
- Ekranda: üst satırda "Puan" ve "Aşama" (ayarlar gelene kadar hep görünür); oyun sonunda "Bu el",
  "Seri puanı", "Yeni aşama", "Yeni en iyi"; oyun seçiminde "En iyi: …"; eli bırakma sorusu
  ("[YER TUTUCU: eli bırakma sorusu]", Evet / Hayır). Ekran görüntüleri:
  `docs/ekran-goruntuleri/puan-*.png`.
- Bu pakette yok: günlük mücadele (8. paket; puan kodu hazır), kaybetme ekranı (kaybetmenin tanımı
  Kemal'e soru), ayardaki "her hamlede puanı göster" (5. paket).
- Neye bağlı: 4. paket (süre ve hamle sayacı), Kemal'in formül kararı (16 Kasım: a).

### 7. Ana ekran ve Ben sekmesi (Kemal, 15 Kasım; örnek oyun) · bitti (`ajans/ana-ekran`; Kemal birleştirince kesinleşir)

- Altta üç sekme: ana ekran, mücadeleler, ben. Ana ekranda üstte günlük mücadele ve etkinlik
  kartları (yer tutucu), ortada oyunun adı (Düzada Cards Club, 15 Kasım gece) ve en iyi puan, altta "devam et" ve "yeni oyun"
  (belge 2).
- Ben sekmesi: ödüller, ayarlar (5. paket buraya taşınır), nasıl oynanır, yardım, oyun hakkında,
  gizlilik; metinler yer tutucu.
- Yapılan: ekranlar `src/ekranlar/AnaEkran.tsx`, `Ben.tsx`, `Sekmeler.tsx`; geçişler
  `src/Uygulama.tsx`. Ana ekran: üstte "Günlük mücadele" ve "Kartpostal etkinliği" (Yakında), ortada
  oyunun adı (Düzada Cards Club) ve en iyi puan (yarım el varsa onun, yoksa son seçilen oyun ve zorluk), altta
  "Oyuna devam et" (yarım el yoksa soluk) ve "Yeni oyun" (oyun seçimine; yarım el varken eli bırakma
  sorusu). Mücadeleler: yer tutucu. Ben: Ödüller (aylık ödüller, kartpostal koleksiyonu; boş),
  İstatistik, Ayarlar, Nasıl oynanır (standart kuralların kısa özeti; taslak, Kemal onaylayacak),
  Yardım, Oyun hakkında, Gizlilik (yer tutucu). Oyun seçimindeki "İstatistik" açıldı, "Paketler"
  yakında. Masada sekmeler gizli; masadaki "Ana ekran" eli bırakmadan çıkar. Son seçilen oyun ve
  zorluk saklanır (`src/oyun/sonSecim.ts`). Bütün yazılar `tr.json` ve `en.json`'da.
- Bu pakette yok: günlük mücadele (8), kartpostal etkinliği (9), ödüllerin içi, Paketler (13),
  yardım, oyun hakkında ve gizlilik metinleri (Kemal'in).
- Neye bağlı: 5. ve 6. paket.

### 8. Günlük mücadele (Kemal, 15 Kasım; örnek oyun) · bitti (ödül görseli Kemal'de; `ajans/gunluk-mucadele`)

- Her gün bir el; kazanınca takvimde o güne yıldız; ay dolunca o ayın pulu, çeyrek dolunca büyük pul (belge 8.1; pul koleksiyonu, `ajans/pul-koleksiyonu`). Takvim
  Mücadeleler sekmesinde.
- Ödülün görseli [Kemal] (örnekteki kupa kopyalanmaz); ajans 18 adaylık bir liste getirdi, Kemal
  seçecek (15 Kasım soru turu 2. set). O zamana kadar yer tutucu.
- Yapılan: kurallar `src/oyun/gunluk.ts`'te, ekrandan ayrı; testleri `testler/gunluk.test.ts`
  (aynı tarih, oyun ve zorlukta aynı dağıtım, başka günde başka dağıtım; yıldızın saklanması;
  geçmiş gün oynanır, gelecek gün kilitli; ay dolunca ödül; takvimin Pazartesi'den başlaması;
  günlük yarım elin normalinden ayrı durması; seri sayımı). Ekranlar `src/ekranlar/Gunluk.tsx`.
- Ekranda: Mücadeleler sekmesinin üstünde ayın adı ve "yıldız/gün sayısı", takvim (kazanılan günde
  yıldız, bugün kiremit çerçeveli, gelecek günler soluk ve dokunulmaz, yarım el kalan günün altı
  çizili), sol okla önceki aylar (sağ ok bu ayda kapalı); ayın bütün günleri yıldızlıysa altında
  "Ay tamamlandı · [YER TUTUCU: ayın ödülü]". Altta seçili günün tarihi, oyun (Spider / Klasik
  solitaire) ve zorluk (1/2/4 renk; 1/3 kart çekme) ve "Oyna" (yarım el varsa "Devam et",
  kazanılmış günde "Yeniden oyna"). Gelecek gün seçilemez. Ana ekranda "Günlük mücadele" kartı:
  bugünün tarihi ve "Oyna" (bugünün yarım eli varsa onu açar, yoksa son günlük seçimle bugünün
  elini); bugün kazanıldıysa tarihin yanında yıldız ve "Takvim". Masada başlığın yanında küçük
  yıldızlı tarih işareti. Kazanınca oyun sonu kutusunda "Günün yıldızı" ve tarih; ay o an
  tamamlandıysa bir satır daha; tek düğme "Takvime dön". Ben → Ödüller → Aylık ödüller'de her
  tamamlanan ay için "[YER TUTUCU: ayın ödülü]" rozeti.
- Kodda duranlar (öneri, Kemal'in onayı yok): günlük elin dağıtımı tarih, oyun ve zorluktan
  türeyen sabit bir karıştırmayla (belgedeki öneri; Kemal "bunu yap" dedi). Gün telefonun kendi
  saatine göre değişir. Günlük yarım el ayrı yerde saklanır (normal "Oyuna devam et" ile
  karışmaz); bir tane olur; başka bir günlük el açılırken eli bırakma sorusu çıkar, "Evet" o elin
  serisini bitirir. Masadaki "Yeni el" günlük elde aynı günün elini baştan dağıtır (eli bırakma
  sorusuyla; Kemal 15 Kasım: bu davranış kalır). Kazanılmış gün yeniden oynanabilir, yeni yıldız gelmez. Takvim en çok Ocak 2026'ya
  kadar geri gider; o ayda geri ok soluk ve kapalı (Kemal, 15 Kasım telefon yorumları).
  Günlük el istatistiğe de sayılır. Ay ve gün adları metin dosyasında, dile göre.
- Deneme yolları (yalnız geliştirmede): `?deneme=takvim` (takvime hazır yıldızlar: geçen ay tam,
  bu ay birkaç boş gün), `?deneme=gunluk-kazan` (bugünün günlük eli olarak bir hamlede biten
  Spider). Ekran görüntüleri: `docs/ekran-goruntuleri/gunluk-*.png`.
- Neye bağlı: 7. paket.

### 9. Kartpostal etkinliği (Kemal, 15 Kasım; örnek oyun)

- Süreli etkinlik; resim karelere bölünür, kazanılan her el bir kare açar; kare rengi zorluğu
  gösterir; biten resim koleksiyona girer, önceki bitmeden sonraki kilitli (belge 8.2).
- Kare sayısı, süre, renk ve zorluk eşleşmesi [Kemal]; o zamana kadar yer tutucu resim ve değer.
- Neye bağlı: 7. paket.

### 10. Kartpostal görselleri (görsel paketi)

- Düzada kartpostalları; yerler seçildi (Kemal, 15 Kasım soru turu 2. set; belge 8.2): İskele ve
  The Imperial Kemsköy; Liman ve Deniz Feneri; Dirlik Stadı; Küçükçetmi Çiftliği; Merkez ve
  Belediye; Ada Tepesi ve sırtlar (Kuzey Sırtı, Çetmi Sırtı); Sahil Yolu ve Güney Burnu.
  Kartpostallar yazısız. Sırası [Kemal]. Her yer künyede ve vikide yeniden okunur, ilham
  panosuna bakılır; taslak görsel, Kemal seçer, oyuna girer. **Görsel üretimi Kemal onayıyla.**
- Neye bağlı: 9. paket.

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

### 14. Sürek Kulübü destesi (görseller) · arka yüz bitti (`ajans/surek-deste-arkalari`; Kemal birleştirince kesinleşir), ön yüzler bekliyor

- Arka yüz, 52 ön yüz ve 2 joker; merch destesiyle aynı tasarım (belge 4.1). Oyuna girince
  varsayılan deste olur.
- Yapılan (24 Kasım): arka yüz, iki set iki renkte aynı desen (1. set lacivert-kiremit, 2. set
  ege-kırmızı; Kemal: "iki desteyi otomatik ata"). Görseller `src/assets/surek-arka-*.webp`; kartın
  hangi setten olduğu `src/kart/kart.ts` → `kartSeti`. Ayarlarda deste seçimi açıldı, varsayılan
  Sürek Kulübü destesi.
- Bu adımda yok: ön yüzler ve jokerler (çizim stili Kemal'de).
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

- Klasik gri kuralı: Spider gibi, sıralı dizi koyu olmaz (`ajans/klasik-gri-kural`, 26 Kasım 2026;
  Kemal birleştirince kesinleşir).
- Spider gri kuralı: sıralı dizi gri olmaz (`ajans/spider-gri-kural`, 26 Kasım 2026; Kemal
  birleştirince kesinleşir).
- 14. paketin ilk adımı: Sürek Kulübü destesinin arka yüzü, iki set iki renkte (`ajans/surek-deste-arkalari`,
  24 Kasım 2026; Kemal birleştirince kesinleşir).
- Mücadeleler ve oyun seçiminde içerik başlığın hemen altından başlar (`ajans/mucadeleler-ust-bosluk`,
  16 Kasım 2026; Kemal birleştirince kesinleşir).
- Oyunun adı (Düzada Cards Club) ve en öndeki kartın koyu olmaması (`ajans/kemal-notlari-15-11`,
  15 Kasım 2026 gece; Kemal birleştirince kesinleşir).
- Pul koleksiyonu, yer tutucu pullarla (`ajans/pul-koleksiyonu`, 15 Kasım 2026; pul görselleri
  sonra tek tek; Kemal birleştirince kesinleşir).
- 4. Yardımcılar: kendiliğinden bitirme, klasik solitaire (`ajans/kendiliginden-bitirme`, 15 Kasım
  2026; Kemal birleştirince kesinleşir). 4. paketin bütün maddeleri bitti.
- Kemal'in telefon yorumları (15 Kasım): çift dokunuşla hızlı yerleştirme, teker teker dağıtma,
  oynanamayan kartları koyulaştırma (ayarla), tamamlanan sıranın akışı, takvimin Ocak 2026 sınırı
  (`ajans/telefon-yorumlari-1`, 15 Kasım 2026; Kemal birleştirince kesinleşir).

- 8. Günlük mücadele (`ajans/gunluk-mucadele`, 15 Kasım 2026; ödül görseli Kemal'de; Kemal
  birleştirince kesinleşir).
- 7. Ana ekran ve Ben sekmesi; 4. paketten kaldığı yerden devam ve basit istatistik
  (`ajans/ana-ekran`, 15 Kasım 2026; Kemal birleştirince kesinleşir).
- 5. Ayarlar ve iki dil, KKM ayar dosyası ve ekran görüntüsü listesiyle (`ajans/ayarlar-dil`,
  15 Kasım 2026; önce `ajans/spider-duzen`, sonra bu birleşince kesinleşir).
- Spider düzeni (Kemal 15 Kasım): büyüyen kartlar, ekrana göre aralık, dar yelpaze alt şerit;
  klasik solitaire'de ekrana göre aralık (`ajans/spider-duzen`, 15 Kasım 2026; Kemal birleştirince
  kesinleşir).
- 0. Depo ve iskelet ve 1. Kart ve masa (PR #1, 15 Kasım 2026).
- 2. Spider kuralları (PR #3, 15 Kasım 2026).
- 4. Yardımcılar: geri al ve ipucu, Spider (`ajans/geri-al-ipucu`, 15 Kasım 2026; Kemal
  birleştirince kesinleşir).
- 3. Klasik solitaire, geri al ve ipucuyla (`ajans/klasik-solitaire`, 15 Kasım 2026; önce
  `ajans/geri-al-ipucu`, sonra bu birleşince kesinleşir).
- 6. Puan ve en iyi puan (`ajans/puan`, 15 Kasım 2026); formül a, b ve c kalktı (`ajans/puan-a`,
  16 Kasım 2026; Kemal birleştirince kesinleşir).
