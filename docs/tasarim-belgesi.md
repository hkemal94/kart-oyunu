# Kart oyunu · Tasarım belgesi

> **TASLAK · Kemal onaylamadı.** Bu belge oyunun tek kaynağıdır (Kemal, 15 Kasım 2026); ama
> belgenin tamamı henüz Kemal'in onayından geçmedi. Karar değişirse önce bu belge, sonra kod
> değişir.

**Proje:** Kart oyunu (Kems Company). Oyunun adı: **Düzada Cards Club**; adın altındaki tanıtıcı
satır "Solitaire · Spider" (Kemal, 15 Kasım 2026)
**Depo:** `hkemal94/kart-oyunu` (depo adı çalışma adı olarak kalır, değişmez; Kemal, 15 Kasım 2026)
**Yol haritası:** `docs/yol-haritasi.md`
**Yazan:** Oyun Tasarımcısı (ilk taslak, 14 Kasım 2026); depoya Oyun Geliştiricisi taşıdı
(15 Kasım 2026). Onay Kemal'in.

Kaynak: Kems Ajans'taki tasarım belgesi taslağı (`oneriler/kart-oyunu-tasarim-belgesi-taslak-14-11-2026.md`,
Kemal'in 14 ve 15 Kasım cevapları işli) ve yapım planı taslağı
(`oneriler/kart-oyunu-yapim-plani-16-11-2026.md`). Düzada bilgisi yalnız KKM'deki
`docs/03-duzada-kunyesi.md`'den.

Okuma kuralı: "[ad: Kemal]" ve "[Kemal]" Kemal'in dolduracağı boş alandır. "Öneri" ya da "aday"
yazan her şey seçenektir, karar değildir. Ad, slogan, kurgu metni yok. Fiyat, oran, süre ve
reklam sıklığı sayısı yok: "veri yok".

## Kararların geçmişi

En yeni üstte.

- **16 Kasım (puan formülü):** Kemal formülü seçti: **a · çarpanlı taban (aşama çarpanlı)**. b ve c
  adayları kalktı; adresle aday denemesi (`?puan=`) artık bir şey yapmaz. Kemal yalnız formülü
  seçti, sayıları onaylamadı: 2000 taban, hamle başı 2, dakikada 30, en az 200 deneme varsayılanı
  olarak kalır (8.3). Deneme günlerinde a ile toplanan seri ve en iyi puan korunur.
- **15 Kasım gece (oyunun adı ve koyulaştırma):** Kemal oyunun adını seçti: **Düzada Cards Club**;
  adın altındaki tanıtıcı satır "Solitaire · Spider" (İngilizcede de aynen). Açılışta, ana ekranda,
  oyun seçiminde ve sayfa başlığında bu ad. Depo adı `kart-oyunu` çalışma adı olarak kalır. 7.
  bölümdeki ad sorusu kapandı; oyun logosu yine ertelendi. Aynı gece koyulaştırmada düzeltme
  (Kemal: "Bir kart en öndeyse koyu olmaz"): sütunun en önündeki kart oynanamasa da koyulaşmaz;
  koyulaşma yalnız arkada kalan, oynanamayan açık kartlarda. Klasik solitaire'de açılanların ve
  temellerin en üstteki kartı da en önde sayılır (öneri). Spider ve klasik solitaire'de (1.3).
- **15 Kasım (kendiliğinden bitirme):** Kemal sıradaki adımı seçti: 4. paketten kalan kendiliğinden
  bitirme (1.3). Klasik solitaire'de bütün kartlar açık, deste ve açılan kartlar boşken masada
  "Bitir" düğmesi çıkar; oyun bunu kendisi başlatmaz. Aynı gün ikinci karar: günlük mücadelede
  masadaki "Yeni el" günün elini baştan dağıtır (şu anki davranış kalır; 7. bölümdeki açık soru ve
  14. soru kapandı). Spider'a kendiliğinden bitirme konmadı; Kemal aynı gün karar verdi: Spider'da
  "Bitir" olmasın (15. soru kapandı).
- **15 Kasım (telefon yorumları):** Kemal oyunu telefonda denedi, beş yorum yazdı; hepsi oyuna
  girdi (1.3, 2, 8.1). (1) Çift dokunuşla hızlı yerleştirme: iki masada da karta (Spider'da
  taşınabilir dizinin en üst kartına) iki kez dokununca kart gidebileceği yere kısa bir kaymayla
  gider; klasikte önce temel yığın, yoksa uygun sütun; Spider'da önce aynı takımın bir büyük kartı,
  sonra başka takımın bir büyük kartı, en son boş sütun. Yer yoksa kart hafifçe sallanır. Hamle
  sayılır, geri alınır. (2) Teker teker dağıtma: yeni elde kartlar desteden masaya teker teker,
  hızlı uçarak dağılır; Spider'da "Dağıt"taki on kart da. Dağıtım sürerken dokunma kapalı, masaya
  tek dokunuş dağıtımı hemen bitirir; kaldığı yerden açılan elde hareket yok. (3) O an hiçbir yere
  oynanamayan açık kartlar bir iki ton koyu (başka kartın altında kalıp taşınamayanlar da); kapalı
  kartlar hariç. Ayarlar'da "Oynanamayan kartları koyulaştır", varsayılanı açık. (4) Spider'da
  tamamlanan sıra tek seferde kaybolmaz; en alttaki astan başlayarak teker teker "Tamamlanan
  diziler"e akar, bu sırada dokunma kapalı. (5) Günlük mücadele takvimi en çok Ocak 2026'ya kadar
  geri gider (7. bölümdeki açık soru kapandı). Ajansın önerisi olarak kodda duranlar (Kemal'in onayı
  yok): süreler (Spider açılış dağıtımı 1,8 saniye, bir kartın uçuşu 0,24 saniye, kayma 0,24
  saniye, akış 0,7 saniye) ayar dosyasında, Kemal KKM'den değiştirir; "Dağıt" ve klasik
  solitaire'in açılışı Spider açılışıyla aynı hızda; telefonda "hareketi azalt" açıksa hareketler
  atlanır (kartlar hemen yerinde, sallanma kısa); "oynanabilir" kural olarak "kendisi ya da üstünde
  durduğu dizi o an kurala uygun bir yere gidebiliyor" demek (boş sütun varken Spider'da taşınabilir
  her dizi; klasikte temeldeki üst kart da sütuna inebiliyorsa); çift dokunuşta aynı öncelikte
  soldaki sütun seçilir.
- **15 Kasım (günlük mücadele, 8. paket):** Kemal: "Günlük mücadeleye başla". Takvim, günün eli,
  yıldız, aylık ödül yer tutucusu ve ana ekrandaki günün kartı oyuna girdi (8.1, 2). Belgedeki öneri
  (aynı gün, aynı oyun ve zorlukta herkese aynı dağıtım) Kemal'in "bunu yap"ıyla kodda: dağıtım
  tarih, oyun ve zorluktan türeyen sabit bir karıştırmayla. Ajansın önerisi olarak kodda duranlar
  (Kemal'in onayı yok): gün telefonun saatine göre değişir; günlük yarım el normal yarım elden ayrı
  saklanır, tek tane olur, başka bir günlük el açılırken eli bırakma sorusu çıkar; masadaki "Yeni
  el" günlük elde aynı günün elini baştan dağıtır; kazanılmış gün yeniden oynanır, yeni yıldız
  gelmez; günlük oyun sonunda tek düğme "Takvime dön"; önceki aylara sınır yok.
- **15 Kasım (ince kenar, masa ekranı doldurur):** Çerçeveli ilk hâli görünce Kemal: "Bu inanılmaz
  fazla bir sayfa kenarı, şekli çok fazla bu." Seçtiği: "İnce kenar, masa ekranı doldursun". Örnek bir
  Spider ekranı için de "Bu uygun işte" dedi (yalnız oran ve yerleşim alındı; görseli, rengi, çuhası
  alınmadı). Bütün ekranlarda yalnız ince pay (8-12 piksel, ekran boyuna göre; çentik ve alt çubuk
  güvenli alanı ayrıca). Masada çerçeve yok; masa ekranın tamamını kaplar: üstte bilgi (oyun ve
  ayar düğmesi; altında süre, hamle, puan, aşama), hemen altında kartlar (üstten başlar), en altta
  tamamlanan diziler, deste ve düğmeler. Kartlar ekran enini doldurur (Spider 10, klasik 7 sütun);
  kapalı kartlar sık, açıklar daha geniş. Düğmeler başparmak boyunda, simge üstte yazı altta. Elin
  başında masanın ortası boş kalır (Kemal: uygun). Menü ekranlarında içerik ortada, ince kenarla.
- **15 Kasım (kenar payı ve çerçeve; yerini "ince kenar" aldı):** Kemal: "Ekranlara sayfa kenarı gibi bir şey belirleyelim;
  ekranın ortası bomboş, her şey kenarlarda." Seçtiği: "Çerçeve + içerik ortada toplansın". Bütün
  ekranlarda tek ortak kenar payı (ekran boyuna göre ölçeklenir). Menü ekranlarında (ana ekran, Ben,
  Mücadeleler, oyun seçimi, ayarlar) içerik dikeyde ve yatayda ortada, genişliği sınırlı; alt
  sekmeler yerinde. Masada üst satır, kartlar, alt şerit ve düğmeler ince krem çizgili, yuvarlak
  köşeli tek blok; blok dikeyde ortada, yüksekliği içeriğe göre; sütunlar uzayınca büyür, en çok
  kenar payına kadar. Kart boyu ve aralık bloğun en çok alabileceği yüksekliğe göre hesaplanır.
  Masada yandaki pay, kartlar küçülmesin diye ortak payın dörtte biri (okunurluk önce). Dekor yok;
  kulüp evi görseli gelince çerçeve ona uyarlanır.
- **15 Kasım (ana ekran ve Ben sekmesi, 7. paket):** Kemal: "Ana ekran ve Ben sekmesiyle devam et".
  Altta üç sekme (Ana ekran · Mücadeleler · Ben), ana ekran, Ben sekmesi, kaldığı yerden devam ve
  basit istatistik oyuna girdi (2, 1.3, 8.4). Ajansın önerisi olarak kodda duranlar (Kemal'in onayı
  yok): masanın alt şeridindeki dördüncü düğme "Oyun seçimi" yerine "Ana ekran" oldu; eli bırakmadan
  masadan çıkar, el saklanır. Geri al geçmişi saklanmaz, kalan hak saklanır. Bir el ilk hamlede
  "oynanan" sayılır. Ana ekranda en iyi puan, yarım el varsa onun, yoksa son seçilen oyun ve
  zorluğun puanıdır. "Nasıl oynanır" metni standart kuralların kısa özeti olarak yazıldı (taslak,
  Kemal onaylayacak).
- **15 Kasım (puan paketi, 6. paket):** Kemal: "Puanla devam et". Seri, aşama, en iyi puan ve eli
  bırakma sorusu oyuna girdi (8.3, 2). Puan formülü için ajans üç aday getirdi (a, b, c; 8.3);
  Kemal seçecek, o zamana kadar aday a varsayılan. Adaylar adresten denenir (`?puan=b`). Ajansın
  önerisi olarak kodda duranlar (Kemal'in onayı yok): seri de en iyi puan gibi oyun ve zorluk
  başına ayrı; hiç hamle yapılmamış el bırakılırken soru çıkmaz, seri bitmez; masadaki puan
  "şimdi bitse" puanıdır. Kaybetmenin tanımı belgede yok; şimdilik seriyi yalnız eli bırakmak
  bitirir (soru, 7).
- **15 Kasım (soru turu 2. set):** Kartpostal yerleri (Kemal seçti, yedi yer): İskele ve The Imperial Kemsköy; Liman ve Deniz Feneri; Dirlik Stadı; Küçükçetmi Çiftliği; Merkez ve Belediye; Ada Tepesi ve sırtlar (Kuzey Sırtı, Çetmi Sırtı); Sahil Yolu ve Güney Burnu.
  Kartpostallar yazısız: üstünde yer adı ya da başka yazı yok. Aylık ödül nesneleri: ajans 18
  adaylık bir liste getirdi, Kemal seçecek (8.1, 8.2, 7).
- **15 Kasım (klasik solitaire, 3. paket):** Kemal: "klasik solitaire'e başla". Standart Klondike
  kuralları işlendi (1.1). Ajansın önerisi olarak kodda duranlar (Kemal'in onayı yok): deste
  bitince açılan kartlar sınırsız döner (sınır açık soru, 7); karta çift dokununca uygun temel
  yığına gider; klasik solitaire'de ipucu sırası temele giden, kapalı kartı açan, öbürleri (1.3).
- **15 Kasım (soru turu):** Geri al sınırlı: her elde birkaç ücretsiz hak, fazlası telefon
  uygulamasında reklamla; web denemesinde haklar bitince "[YER TUTUCU: burada reklam olacak]"
  kutusu ve bir düğme çıkar, dokununca bir hak gelir. Hak sayısını Kemal web denemesinde seçer
  (sayı kodda tek yerde, adresle değişir). Geri almak hamle sayılır. İpucu sırası: önce diziyi
  tamamlayan, sonra aynı takıma konan, sonra kapalı kartı açan, sonra öbürleri. Kartın kırmızısına
  Sürek Kulübü destesi çizilince karar verilecek; o zamana kadar koyu kiremit. En iyi puan oyun ve
  zorluk başına ayrı. Günlük mücadele eli puan serisine sayılır. Puan hesabı: ajans puan paketinde
  2-3 aday getirir, Kemal seçer. Aylık ödül: her ay bir Düzada nesnesi ya da simgesi, hangileri
  [Kemal]. Kartpostal yerlerini Kemal seçer. Kare sayısı, etkinlik süresi, renk ve zorluk web
  denemesinde ayarlanabilir gelir, Kemal seçer (1.3, 5, 7, 8.1–8.3; kayıt:
  `docs/soru-cevap/kart-oyunu-1.md`).
- **15 Kasım (puan ve günlük mücadele):** Puan kazandıkça birikir: kazanılan elin puanı bir
  sonraki ele taşınır, aşama bir artar (Aşama 1, 2, 3…), yüksek aşama daha çok puan getirir;
  kaybedince ya da el yarımken yeni oyuna geçince seri biter, puan sıfırdan başlar; en yüksek seri
  puanı "en iyi puan" olur. Aşama başına artış ve formül [Kemal]. El yarımken "yeni oyun"a
  dokununca kısa bir onay sorusu çıkar; evet denirse bırakılan el kaybedilmiş sayılır, seri biter.
  Günlük mücadelede oyun ve zorluğu oyuncu seçer. Geçmiş günler sonradan oynanabilir; aylık ödül
  ayın bütün günleri yıldızlanınca gelir (8.1, 8.3).
- **15 Kasım (örnek oyun):** Kemal sevdiği bir Spider oyununu gösterdi ("bunun gibi bir oyun yapmak
  istiyorum"); belgede "Kemal'in gösterdiği örnek Spider oyunu" diye geçer. Yalnız oynanış şekli
  alınır; adı, görseli, kupa çizimleri, metinleri alınmaz. Eklenecekler (dördü de): günlük mücadele,
  kartpostal etkinliği (Düzada kartpostalları; Kems'in önerisi, Kemal seçti), puan ve en iyi puan,
  ana ekran ve "Ben" sekmesi (altta üç sekme). Para modeli telefon uygulamasında "örnekteki gibi":
  ipucu reklam izleyerek alınır, el bitince reklam girer, bir kez satın alınınca reklam kalkar. Web
  deneme sürümünde reklam ve satın alma yine yok; ipucu web'de reklamsız çalışır (8. bölüm).
- **15 Kasım ("Oyuna başlayalım"):** Spider klasik solitaire'den önce gelir; Spider'da 1, 2 ve 4
  renk. Depo `kart-oyunu` adıyla açıldı; ad geçici çalışma adı. Sade Meyhane masasına görseli
  gelince karar verilecek; şimdilik oyunda yok. Teknoloji: Vite + React + TypeScript, 2B.
- **15 Kasım akşam (pul koleksiyonu):** aylık rozet kalktı, yerine **pul koleksiyonu** geldi.
  Her tamamlanan ay bir pul verir; bir çeyreğin üç aylık pulu toplanınca daha büyük ve süslü bir
  **4. pul** gelir ("3+1 pul serisi"). Pullar gerçek posta pulu gibi, her biri ayrı tasarlanır (tek
  şablon yok). Ben → Ödüller'de "Pul koleksiyonu" kartı, dokununca ayrı sayfa. Pullar yazısız;
  çeyrek ve yıl pulun altında yazar. Eski "18 Düzada nesnesinden 12 seç" listesi düştü (8.1, 7).
- **15 Kasım akşam (desteler):** paket desteler belli oldu: beş mahallenin (Liman, İskele, Çiftlik,
  Merkez, Stadyum) her biri için ikişer deste (10) ve yalnız renkten oluşan 2 deste, toplam 12;
  seriler ikişer desteden oluşur. Bir süre yalnız arka yüzler çalışılır, ön yüzlere sonra bakılır;
  deste arkaları günlük görsel işine de girer. Masa ve deste ayrı paketler. Web deneme sürümünde
  şimdilik hepsi açık (kilit yok); neyin kilitleneceği ve satılacağı yayın sürümünden önce
  konuşulacak. Deste ve seri adları [Kemal] (4.2).
- **15 Kasım gece:** ilk kilitli masa Sade Meyhane; ilk kilitli destenin içeriği sonra; web sürümü
  yalnız deneme, web'de reklam ve satın alma yok.
- **15 Kasım:** ilk sürümde bir kilitli masa ve bir kilitli deste; ödüllü reklamla deneme bir el
  sürer; önce web oyunu, sonra telefon uygulaması.
- **14 Kasım, üçüncü tur:** altı yardımcı ilk sürümde ve ücretsiz; ödüllü reklamın karşılığı
  kilitli masa ya da desteyi deneme; dil Türkçe ve İngilizce.
- **14 Kasım, ikinci tur:** reklam düzeni (seyrek geçiş reklamı yalnız oyun sonunda + isteğe bağlı
  ödüllü reklam + reklamsız paket); Sürek Kulübü destesi ücretsiz ve varsayılan, sade deste
  ücretsiz; kulüp evi masasında taş avlulu çiftlik evi, Kangal, zeytinlik ve yamaç.
- **14 Kasım:** ekran dikey; ilk masa Küçükçetmi Çiftliği kulüp evi; reklam seyrek ve ölçülü;
  birden çok deste, biri Kems'in satacağı Sürek Kulübü destesi.

---

## 0. Oyun bir cümlede ve sabitler

**Bir cümlede:** Küçükçetmi Çiftliği'nin kulüp evinde, Sürek Kulübü'nün iskambil destesiyle (ya
da seçilen başka bir desteyle), arkada çiftliğin sesi, tek kişilik kart dizme oyunları (önce
Spider, sonra klasik solitaire) oynanan sakin bir telefon oyunu.

Sabitler (Kemal'in 14-11-2026 ve 15-11-2026 kararları):
- **Tür:** tek kişilik kart dizme oyunları ("solitaire gibi, spider gibi"). Fal yok, fal anlamı yok.
- **İlk sürümdeki oyunlar:** Spider ve klasik solitaire (Klondike). **Spider önce gelir** (1, 2 ve
  4 renk), klasik solitaire ondan sonra (Kemal, 15 Kasım).
- **Platform:** mağaza uygulaması (telefon mağazaları). Telefon önce.
- **Yapım yolu:** **önce web oyunu, sonra telefon uygulaması** (Kemal, 15 Kasım; öbür oyunlar
  gibi). Oyun tarayıcıda yazılır ve denenir, sonra mağaza uygulamasına paketlenir (6. bölüm).
- **Web sürümü:** **yalnız deneme** (Kemal, 15 Kasım gece). Kemal ve yakın çevresi bağlantıyla
  dener; **web'de reklam ve satın alma yok**. Herkese açık web oyunu yok.
- **Kenar payı** (Kemal, 15 Kasım): her ekranda yalnız ince pay; menü ekranlarında içerik ortada;
  masa çerçevesiz, ekranın tamamını kaplar (2. bölüm, kararların geçmişi).
- **Ekran yönü:** **dikey** (Kemal, 14-11-2026). Öbür oyunlardan farklı olarak telefon dik tutulur.
- **Dil:** ilk sürüm **Türkçe ve İngilizce** (Kemal, 14 Kasım). Oyun açılırken telefonun diline
  göre başlar, ayarlardan değiştirilir (öneri; 5. paketle yapıldı: seçim anında bütün ekranı
  değiştirir ve saklanır).
- **Yardımcılar:** geri al, ipucu, kendiliğinden bitirme, kaldığı yerden devam, süre ve hamle
  sayacı (ayarlardan kapatılabilir), basit istatistik; hepsi ilk sürümde (Kemal, 14 Kasım; 1.3).
  **İpucu telefon uygulamasında reklam izleyerek alınır** (Kemal, 15 Kasım: "örnekteki gibi");
  web deneme sürümünde reklamsız. **Geri al sınırlı:** her elde birkaç ücretsiz hak, fazlası
  telefon uygulamasında reklamla (Kemal, 15 Kasım soru turu; 1.3).
- **Örnek oyun:** Kemal'in gösterdiği örnek Spider oyunu (15 Kasım). Yalnız oynanış şekli alınır
  (günlük mücadele, süreli resim etkinliği, puan, sekmeli ana ekran, para modeli); adı, görseli,
  kupa çizimleri ve metinleri belgeye ve depoya girmez (8. bölüm).
- **Desteler:** oyunda **birden çok deste** seçeneği olur; **biri Kems'in satacağı fiziksel deste,
  Küçükçetmi Sürek Kulübü destesi** (52 kart + 2 joker; merch destesiyle aynı tasarım) (Kemal,
  14-11-2026). **İlk sürümde iki deste ücretsiz: Sürek Kulübü destesi (varsayılan) ve sade deste**
  (Kemal, 14 Kasım); yanında **12 paket deste**: beş mahallenin her biri için ikişer deste ve
  yalnız renkten oluşan 2 deste, ikişerli seriler (Kemal, 15 Kasım akşam). Web denemesinde hepsi
  açık; kilit ve satış yayın sürümünden önce konuşulacak. Ayrıntı 4. bölüm.
- **Masalar:** **ilk masa Küçükçetmi Çiftliği kulüp evi**, ücretsiz (Kemal, 14-11-2026; deste
  kulübün); **ilk sürümün kilitli masası Sade Meyhane** (Kemal, 15 Kasım ve 15 Kasım gece; 3.2). Masanın
  oyuna nasıl gireceğine **görseli gelince karar verilecek**; şimdilik oyunda yok (Kemal, 15 Kasım).
- **Hava:** Düzada masası. Deste bir Düzada mekânının masasında; arka planda mahallenin sesi.
- **Para modeli:** ücretsiz; deste ve masa paketleri satılır; reklam da olur (Kemal: "çok reklam
  görsünler istemiyorum ama para da lazım"). **15 Kasım, "örnekteki gibi":** ipucu reklam izleyerek
  alınır, el bitince reklam girer, bir kez satın alınınca reklam kalkar. Öncesinden kalan: ödüllü
  reklamla kilitli masa ya da desteyi **bir el boyunca** deneme (Kemal, 15 Kasım). Reklam ve satın
  alma yalnız telefon uygulamasında; web deneme sürümünde yok (Kemal, 15 Kasım gece). Reklam
  sıklığı ve fiyat [Kemal] (veri yok; 5. bölüm).
- **Ton:** sessiz, dinlendirici; bağıran dil, baskı, ünlem yok (marka kiti).
- **Yazım:** Düzada (ü), Kemsköy (ö). Ekrandaki her yazı tek bir metin dosyasından gelir, Türkçesi
  ve İngilizcesi ayrı dosyada (öneri; öbür oyunlardaki gibi).
- **Ad:** Düzada Cards Club; tanıtıcı satır "Solitaire · Spider" (Kemal, 15 Kasım gece).
- **Depo:** `hkemal94/kart-oyunu`; "kart-oyunu" çalışma adı olarak kalır, oyunun adı değildir
  (Kemal, 15 Kasım). Dal ve PR kuralları öbür oyunlarla aynı (`CLAUDE.md`).
- **Teknoloji:** Vite + React + TypeScript, 2B (yapım planı 4; Kemal, 15 Kasım: "Oyuna başlayalım").

## 1. İlk sürüm: oyunlar ve kurallar

İki oyun da standart kurallarıyla oynanır; yeni kural icat edilmez. Jokerler bu iki oyunda yoktur.
Yapım sırası: önce Spider, sonra klasik solitaire (Kemal, 15 Kasım; yol haritası). Bölüm
numaraları eski sırada kaldı.

### 1.1 Klasik solitaire (Klondike)

- Tek deste, 52 kart. Masada yedi sütun: birinci sütunda bir, yedincide yedi kart; her sütunun
  yalnız en üstteki kartı açık.
- Hedef: dört takımı (maça, kupa, karo, sinek) birer yığında astan papaza sıralamak.
- Sütunlarda kartlar büyükten küçüğe, kırmızı ve siyah değişerek dizilir. Boş sütuna yalnız papaz
  (ya da papazla başlayan dizi) konur.
- Kalan kartlar çekme destesinde; oyuncu buradan kart açar.
- **Zorluk seçeneği:** 1 kart çekme (kolay) ya da 3 kart çekme (klasik).
- Standart ayrıntılar (3. paket; yeni kural yok): açık ve sıralı dizi (bir küçük, ters renk)
  birlikte taşınır; boş sütuna yalnız papaz ya da papazla başlayan dizi konur; temele yalnız tek
  kart gider; temelden sütuna geri almak serbesttir; sütunun üstünde kalan kapalı kart
  kendiliğinden açılır. 3 kart çekmede en son açılan kart en üstte kalır ve yalnız o oynanır.
- **Deste bitince:** açılan kartlar sırası bozulmadan destenin altına döner. Dönüş şimdilik
  sınırsız (standart; öneri); sınır olsun mu açık soru (7). Dönmek bir hamle sayılır.
- **Çift dokunuş (öneri, standart kolaylık):** karta çift dokununca uygun temel yığına gider.

### 1.2 Spider

- İki deste, 104 kart (jokersiz). On sütun: ilk dördüne altışar, kalan altısına beşer kart; her
  sütunun yalnız üstteki kartı açık. Kalan 50 kart, onar onar beş kez dağıtılır.
- Hedef: aynı takımdan papazdan asa tam diziyi sekiz kez kurmak; tamamlanan dizi masadan kalkar.
- Kartlar sütunda renk fark etmeden büyükten küçüğe dizilir; ama birlikte taşınabilen dizi aynı
  takımdan olmalıdır. Boş sütuna her kart konabilir.
- **Zorluk seçeneği:** 1 renk (yalnız maça), 2 renk (maça ve kupa), 4 renk (bütün takımlar).
- Not: Spider'da iki deste kullanılır; dijital oyunda bu, seçili desteden iki takım demektir.
  Basılı merch destesini etkilemez.
- **Dikey ekran notu:** on sütun dik telefonda dar düşer; kartlar sütunda üst üste daha sık
  dizilir ve yalnız köşedeki değer ve simge görünür. Bu yüzden Spider'da köşe okunurluğu
  belirleyicidir (4. bölüm). Uzun sütunlarda kartlar kendiliğinden sıkışır (öneri).

### 1.3 İki oyunda ortak yardımcılar (Kemal, 14 Kasım)

İlk sürümde altısı da var. 14 Kasım'da altısı da ücretsizdi; 15 Kasım'da (Kemal, "örnekteki gibi")
ipucu telefon uygulamasında reklam izleyerek alınır hâle geldi; 15 Kasım soru turunda geri al
sınırlı oldu. Öbür dördü (kendiliğinden bitirme, kaldığı yerden devam, sayaç, istatistik) ücretsiz
kalır.
- **Geri al (Kemal, 15 Kasım soru turu):** sınırlı. Her elde birkaç ücretsiz hak var; yeni elde
  haklar baştan başlar. Haklar bitince telefon uygulamasında reklam izleyerek bir hak daha alınır
  (5. bölüm). Web denemesinde reklam yok: geri al'a basınca kısa bir kutu çıkar
  ("[YER TUTUCU: burada reklam olacak]" ve bir düğme); düğmeye dokununca bir hak gelir. Bu,
  telefon uygulamasındaki akışın denemesidir. Geri almak bir hamle sayılır (Kemal). Bir eldeki
  hak sayısı [Kemal]: web denemesinde seçecek. Sayı kodda tek yerde tanımlı ve deneme için adres
  sonuna `?geriAlHak=` yazılarak değişir; koddaki sayı yalnız deneme varsayılanıdır, karar değildir
  (7. bölüm).
- **İpucu:** bir sonraki olası hamleyi gösterir. Telefon uygulamasında **reklam izleyerek alınır**
  (Kemal, 15 Kasım; 5. bölüm). Web deneme sürümünde reklamsız çalışır. **Sıra (Kemal, 15 Kasım
  soru turu):** önce diziyi tamamlayan hamle (papazdan asa aynı takım diziyi kuran), sonra aynı
  takıma konan, sonra kapalı kartı açan, sonra öbürleri. Bu sıra Spider içindir. **Klasik
  solitaire'de (öneri; Kemal'in onayı yok):** önce temele giden, sonra kapalı kartı açan, sonra
  öbürleri; hamle yoksa desteden çekmeyi gösterir.
- **Kendiliğinden bitirme:** bütün kartlar açılınca oyun kalanları kendisi yerleştirir.
  **Yapılan (4. paket, `ajans/kendiliginden-bitirme`; Kemal, 15 Kasım):** klasik solitaire'de
  bütün kartlar açık, deste ve açılan kartlar boşken (el bu durumda her zaman biter) masanın
  altında, düğme şeridinin üstünde belirgin bir "Bitir" düğmesi çıkar. Oyun kendisi başlatmaz;
  basınca kartlar en küçükten başlayarak birer birer temellere kayar (Spider'daki akan sıranın
  hızıyla, ayar dosyasındaki "hareket" süreleri). Sürerken masaya dokununca kalan kartlar hemen
  yerine geçer. Her kart bir hamle sayılır (elle bitirmekle aynı puan; öneri); puan, istatistik ve
  günlük mücadele yıldızı normal kazanç gibi işler. Bitirme tek geri al adımıdır (öneri: daha sade;
  el zaten kazanılmış olur). Kurallar `src/kart/klondike.ts` (`bitirilebilirMi`, `bitirmeAdimlari`),
  testleri `testler/bitirme.test.ts`. Spider'da yok (Kemal 15 Kasım: Spider'da "Bitir" olmasın).
- **Kaldığı yerden devam:** uygulama kapanınca oyun kaybolmaz; ana ekranda "devam et" çıkar.
  **Yapılan (7. paket):** en az bir hamle yapılmış, kazanılmamış el telefonun tarayıcısında
  saklanır (her hamlede, telefon başka uygulamaya geçince ve masadan çıkınca). Saklananlar: oyun ve
  zorluk, masanın hâli, süre, kalan geri al hakkı. Tek yarım el olur. Geri al geçmişi saklanmaz
  (öneri, standart çözüm: uzun Spider elinde geçmiş tarayıcının saklama yerini doldurabilir); el
  açılınca "Geri al" ilk yeni hamleye kadar soluk durur. Kazanınca ya da bırakınca silinir.
- **Süre ve hamle sayacı:** masanın üst satırında; ayarlardan kapatılabilir.
- **Basit istatistik:** oynanan, kazanılan, en iyi süre; oyun sonu ekranında ve menüde.
  **Yapılan (7. paket):** Ben sekmesinde "İstatistik": oyun ve zorluk başına (Spider 1, 2, 4 renk;
  klasik 1, 3 kart) oynanan, kazanılan, en iyi süre. Bir el ilk hamlede oynanan sayılır (öneri);
  kaldığı yerden açılan el yeniden sayılmaz. Oyun sonu ekranında henüz yok (öneri: sonraki pakette).

Yardımcı değil, kontrol (öneri; Kemal'in listesinde yoktu): dokunarak taşıma. Karta dokununca
uygun yere kendisi gider; sürüklemek de olur. Dikey ekranda tek başparmakla oynanabilsin diye
dokunarak taşıma ana yol olur.

**Çift dokunuşla hızlı yerleştirme (Kemal, 15 Kasım telefon yorumları):** iki masada da bir karta
(Spider'da taşınabilir bir dizinin en üst kartına) iki kez dokununca, gidebileceği geçerli bir yer
varsa kart kısa bir kaymayla oraya gider. Klasik solitaire'de önce temel yığın, yoksa uygun bir
sütun (dolu sütun boş sütundan önce; öneri). Spider'da öncelik: aynı takımın bir büyük kartının
altı, sonra başka takımın bir büyük kartı, en son boş sütun; aynı öncelikte soldaki sütun (öneri).
Sütunun tamamını boş sütuna taşımak bir şey değiştirmediği için sayılmaz. Yer yoksa kart hafifçe
sallanır. Hamle sayılır, geri alınır. Kurallar `src/kart/spider.ts` ve `src/kart/klondike.ts`'te
(`ciftDokunusHedefi`), testleri `testler/oynanabilir.test.ts`.

**Oynanamayan kartları koyulaştırma (Kemal, 15 Kasım telefon yorumları):** o an hiçbir yere
oynanamayan açık kartlar bir iki ton koyu görünür; başka bir kartın altında kalıp taşınamayanlar da.
Kapalı kartlar bunun dışında. "Oynanabilir" (kural, ekrandan ayrı: `oynanabilirKartlar`): kartın
kendisi ya da üstünde durduğu birlikte taşınabilir dizi o an kurala uygun bir yere gidebiliyor.
Klasikte açılanlarda ve temelde yalnız en üstteki kart alınabilir. Ayarlar'dan kapatılır (2).
Spider'da 26 Kasım'dan beri gri kuralı başka (Kemal: "Sıralı dizideyse gri olmasın"): aynı takımdan,
birer birer küçülerek sütunun sonuna kadar giden dizinin her kartı açık renkte kalır, o an gidecek
yeri olmasa da; yalnız sırayı bozan bir kartın altında kaldığı için taşınamayan açık kartlar gri olur
(`koyulasacakKartlar`, `tasinabilirMi`). En öndeki kart yine hiç koyulaşmaz.
Klasikte de 26 Kasım'dan beri aynı kural (Kemal: "Klasik solitaire de Spider gibi olsun — sıralı dizi
açık, yalnız sırası bozulanların altındakiler koyu"): sütunda renkleri sırayla değişen, birer birer
küçülerek sütunun sonuna kadar giden açık dizinin her kartı açık renkte kalır, o an gidecek yeri
olmasa da; yalnız sırası bozulan bir kartın altında kalan açık kartlar koyu olur. Oyunun kendi
hamleleri sütunlarda hep böyle dizi bıraktığı için klasikte sütunlarda koyu kart normalde hiç çıkmaz.
Açılanlar ve temeller değişmedi: en üstteki kart hiç koyulaşmaz, altındaki açık kartlar koyu (3 kart
çekmede yelpazedeki arka iki kart görünür).

Oyuncu ne yapar, neden eğlenceli: kısa, kendi hızında bir düzen kurma işi; her el yeni bir
bulmaca, kaybetmenin cezası yok, yeni el bir dokunuş uzakta. Her elin ücretsiz geri al hakları ve
ipucu takılınca bırakmak yerine denemeyi sürdürtür. Kulüp evinin masası ve çiftliğin sesi bunu "bir
yerde oturup oyun açmak" hissine çevirir.

## 2. Ekranlar

Dikey, kısa ve derli toplu; boş delik kalmaz, ekrana yayılmaz (Kemal'in DK Lite kuralı, burada da
öneri). Her ekran Türkçe ve İngilizce; İngilizcede yazı uzayabileceği için düğmeler buna göre
bırakılır (öneri).
- **Açılış:** Kems Company ve Sürek Kulübü izi (minik, boğmayan), sonra masa. Uzun açılış videosu yok.
  Ortada kart yelpazesi, oyunun adı "Düzada Cards Club" ve altında "Solitaire · Spider" (Kemal, 15 Kasım gece).
- **Alt sekmeler (Kemal, 15 Kasım):** altta üç sekme: ana ekran, mücadeleler, ben. Masada sekmeler
  görünmez (Kemal, 15 Kasım; masa tam ekran). Masadan "Ana ekran" ile çıkınca geri gelir (7. paket).
- **Ana ekran (Kemal, 15 Kasım):** üstte günlük mücadele ve etkinlik kartları; ortada oyunun adı
  (Düzada Cards Club) ve en iyi puan (en yüksek seri puanı; 8.3); altta "devam et" (yarım el varsa) ve
  "yeni oyun". El yarımken "yeni oyun"a dokununca önce onay sorusu çıkar (aşağıda, "Eli bırakma").
  **Yapılan (7. paket):** üstte "Günlük mücadele" ve "Kartpostal etkinliği" kartları "Yakında"
  (8. ve 9. paket; **8. paketle** "Günlük mücadele" kartında bugünün tarihi ve "Oyna", bugün
  kazanıldıysa yıldız ve "Takvim"); ortada küçük kart yelpazesi, oyunun adı (Düzada Cards Club), "En iyi puan" ve hangi oyunun
  puanı olduğu (yarım el varsa onun, yoksa son seçilen oyun ve zorluk; öneri); altta "Oyuna devam
  et" (yarım el yoksa soluk, altında "Yarım el yok") ve "Yeni oyun". Soruya "Evet" denirse yarım
  el silinir, o oyunun serisi biter, oyun seçimi açılır; "Hayır" denirse soru kapanır, ana ekran
  kalır (öneri).
- **Oyun seçimi:** "yeni oyun"a dokununca açılır (öneri; 7. pakette böyle). Alttaki "Ayarlar"
  ayarları, "İstatistik" Ben sekmesindeki istatistiği açar; "Paketler" yakında. Altta sekmeler görünür. Alt alta iki kart: Spider (üstte),
  klasik solitaire (Kemal, 15 Kasım). Her birinin altında zorluk seçimi (1/3 kart; 1/2/4 renk).
- **Mücadeleler sekmesi:** günlük mücadelenin takvimi ve kartpostal etkinliği (8.1 ve 8.2).
  7. pakette yer tutucu: iki "Yakında" kartı ve "[YER TUTUCU]". **8. paketle:** üstte ayın adı ve
  "yıldız/gün sayısı", Pazartesi'den başlayan takvim (kazanılan günde yıldız, bugün vurgulu,
  gelecek günler soluk ve kilitli), önceki aylara ok; altta seçili günün oyunu, zorluğu ve
  "Oyna"; en altta "Kartpostal etkinliği · Yakında".
- **Ben sekmesi (Kemal, 15 Kasım):** ödüller (pul koleksiyonu ve kartpostal koleksiyonu; aylık
  ödüllerin yerine 15 Kasım akşam pul koleksiyonu geldi, 8.1), ayarlar,
  nasıl oynanır, yardım, oyun hakkında, gizlilik. İstatistik ve paketlerin yeri: öneri, bu sekme;
  karar Kemal'in. **Yapılan (7. paket):** en üstte "Ödüller" (aylık ödüller ve kartpostal
  koleksiyonu, ikisi boş yer tutucu); altında İstatistik, Ayarlar (5. paketteki ekran üstüne
  açılır), Nasıl oynanır; sonra Yardım, Oyun hakkında, Gizlilik (yer tutucu). Satıra dokununca
  sayfa açılır, "Geri" listeye döner. Paketler henüz bu sekmede yok (13. paket).
- **Masa:** (7. paket: alt şeritteki dördüncü düğme "Oyun seçimi" yerine "Ana ekran"; soru sormadan
  masadan çıkar, el saklanır; öneri.) **Kart hareketleri (Kemal, 15 Kasım telefon yorumları):** yeni
  elde kartlar desteden masaya teker teker, hızlı uçarak dağılır (Spider'da "Dağıt"taki on kart da;
  klasikte sütunların kartları); dağıtım sürerken dokunma kapalı, masaya tek dokunuş dağıtımı hemen
  bitirir; kaldığı yerden açılan elde hareket yok. Spider'da tamamlanan sıra en alttaki astan
  başlayarak teker teker "Tamamlanan diziler"e akar, bu sırada da dokunma kapalı. Süreler tek yerde,
  ayar dosyasında (`src/oyun/ayarlar.json` → hareket; öneri, Kemal ayarlar): Spider açılış dağıtımı
  1,8 saniye, akış 0,7 saniye. Telefonda akıcı olsun diye kartlar yalnız "transform" ile yer
  değiştirir; telefonun "hareketi azalt" tercihi açıksa hareketler atlanır. Üstte ince bilgi satırı (süre, hamle; ayarda açıksa puan ve aşama; küçük ve sessiz, kapatılabilir; sonunda küçük ayar düğmesi, 5. paket), ortada oyun
  alanı, arkada seçili masa (kulüp evi ya da Sade Meyhane), altta başparmak hizasında ince bir
  şerit: geri al, ipucu, yeni el, menü. Deneme elinde bilgi satırında küçük, sessiz bir "deneme"
  izi (öneri). Bilgi satırında o anki aşama da görünebilir (öneri; "Aşama 1, 2, 3…", 8.3).
- **Eli bırakma (Kemal, 15 Kasım):** el yarımken "yeni oyun"a dokununca kısa bir onay sorusu
  çıkar; anlamı "eli bırakıyor musun, serin biter". Metni [YER TUTUCU: eli bırakma
  sorusu], Kemal onaylar. "Evet" denirse yeni el başlar; bırakılan el kaybedilmiş sayılır ve seri
  biter (8.3). "Hayır" denirse oyuncu ele döner. Sessiz ve kısa; uyarı dili, ünlem yok (ton).
  Masadaki "yeni el" ve "oyun seçimi" düğmeleri de aynı soruyu sorar (6. paket; öneri). Hiç hamle
  yapılmamış elde soru çıkmaz (öneri). Düğmeler "Evet" ve "Hayır".
- **Oyun sonu:** kartlar masada kısa bir hareketle toplanır; süre, hamle, puan ve en iyi puan,
  istatistik; "yeni el" ve "oyun seçimi". Kazanınca puan bir sonraki ele taşınır ve yeni aşama
  gösterilir (Kemal, 15 Kasım; 8.3); "yeni el" serinin bir sonraki elidir. Kazanmayınca seri biter,
  puan sıfırdan başlar (Kemal, 15 Kasım); "yeniden dene" ve "yeni el"; başka ceza yok.
  Telefon uygulamasında el bitince reklam burada girer (Kemal, 15 Kasım; sıklığı [Kemal]; 5.
  bölüm). Oyun ortasında hiç yok; web deneme sürümünde hiç yok. Deneme elinin
  sonunda masa ya da deste kendi seçilene döner; yanında sessiz bir "paketi aç" bağlantısı olabilir
  (öneri; baskı dili yok).
- **Paketler:** iki sekme, desteler ve masalar. Desteler sekmesinde 12 paket deste (beş mahallenin
  her biri için ikişer, 2 renk destesi; ikişerli seriler halinde), masalarda Sade Meyhane (Kemal,
  15 Kasım gece). Masa ve deste ayrı paketler. Web denemesinde hepsi açık (Kemal, 15 Kasım akşam);
  hangilerinin kilitli geleceği yayın sürümünden önce konuşulacak. Her paket büyük önizlemeyle; sahip olunan "kullan", olmayan "aç" (fiyat: veri
  yok) ve yanında sessiz bir "reklam izle, bir el dene" (Kemal, 14 ve 15 Kasım; 5. bölüm).
  Reklamsız paket burada. Web deneme sürümünde "aç" ve "reklam izle" düğmeleri gerçek değildir
  (5. bölüm). Sürek Kulübü destesinin kartında fiziksel desteye küçük, sessiz bir bağlantı olabilir
  (öneri; satış yeri ve metni Kemal'in).
- **Ayarlar (öneri):** ses ve mahalle sesi ayrı ayrı, dil (Türkçe / İngilizce), sol el düzeni,
  sayaçları gizle, deste seçimi. **Titreşim** ve **"her hamlede puanı göster"** (Kemal, 15 Kasım).
  Ayarlar Ben sekmesindedir.
  **Yapılan (5. paket, `ajans/ayarlar-dil`):** Ben sekmesi gelene kadar ayarlar oyun seçimindeki
  "Ayarlar" düğmesinden ve masanın üst satırındaki küçük düğmeden açılır; ekranın üstüne gelir,
  kapanınca el kaldığı yerden sürer. Üç bölüm: ses ve titreşim (ses, mahalle sesi, titreşim; ses
  paketi gelince çalışır, anahtarlar şimdiden duruyor), masa (sol el düzeni, sayaçları gizle, her
  hamlede puanı göster; telefon yorumlarıyla "oynanamayan kartları koyulaştır", varsayılanı açık),
  dil ve deste (Türkçe / English; deste şimdilik yalnız sade deste).
  Değişiklik anında geçerli olur ve telefonun tarayıcısında saklanır. Sol el düzeninde alt şeritteki
  düğmeler ve deste yer değiştirir (Spider'da deste sola, tamamlanan diziler sağa; klasik
  solitaire'de üst sıra ayna gibi: deste solda, temel yığınlar sağda). Sayaçları gizle: süre ve
  hamle görünmez. Puanı göster kapalıysa puan ve aşama görünmez (oyun sonu kutusunda puan yine
  görünür). Varsayılanlar (öneri): sesler açık, sağ el, sayaçlar ve puan görünür; dil telefonun
  diline göre.

## 3. Düzada masası

Masa, kanonda olan bir Düzada mekânıdır; kart oyunu mekânı anlatmaz, yalnız havasını taşır.
Mekân adları yalnız künyede konmuş olanlardır; yenisi yok. İngilizce sürümde yer adları
çevrilmez, olduğu gibi yazılır (öneri).

### 3.1 İlk masa: Küçükçetmi Çiftliği kulüp evi (Kemal, 14-11-2026)

Künyede olanlar (yalnız bunlar kullanılır):
- Küçükçetmi Çiftliği Sürek Kulübü'nün evidir; **çiftlik evi kulüp evidir** (künye, Ada hayatı · 4).
- Çiftlik'in **iç tarafında, tepeye yakın, kıyıdan uzak** (künye, Ada hayatı · 7). Yani masadan
  deniz görünmez; zeytinlik ve yamaç görünür (çıkarım).
- Çiftlik Mahallesi'nde evler **taş, avlulu çiftlik evleri** (künye, Ada hayatı · 2).
- Çevrede **zeytinlikler** (asırlık ve yeni karışık), Ada Tepesi yamaçlarında arıcılık ve çam balı
  (künye).
- Kulüp av bıraktıktan sonra **nişancılık, doğa yürüyüşleri, Kangal yetiştiriciliği**; aynı
  zamanda **bir buluşma yeri** (künye). **Eski av tüfekleri hâlâ durur** (Kemal, 4 Kasım; ortak
  kurallar).
- Kulübün resmî amblemi **Kangal**; ayrıca yazı ve KÇ monogramı var (künye, logolar).
- **Sürek geleneği kış başı** (künye, şenlik takvimi).

**Künyede yok:** kulüp evinin iç düzeni (oda, şömine, mobilya, masanın kendisi), masanın içeride
mi avluda mı durduğu, evin rengi ve kat sayısı. Bunlar uydurulmaz; görsel taslakta Kemal'in
seçtiği öğeler kullanılır.

**Masada görünecekler (Kemal, 14 Kasım):**
- Taş, avlulu çiftlik evi ve avlu.
- Kangal (köşede ya da avluda).
- Zeytinlik ve yamaç manzarası; kıyıdan uzak, **deniz görünmez**.

Kemal bu turda seçmedi: duvarda eski av tüfekleri; küçük KÇ monogramı ya da Kangal amblemi. Masa
görselinde bunlar yer almaz (sonra istenirse eklenir).

Ses (öneri, künyeden): Kangal'ın uzaktan sesi, avlu, zeytinlik rüzgârı, arılar (ilkbahar/yaz).
Av tüfeği sesi yok (ton ve kulübün bugünkü hâli; öneri).

### 3.2 İlk kilitli masa: Sade Meyhane (Kemal, 15 Kasım gece)

**15 Kasım:** Sade Meyhane masasına **görseli gelince karar verilecek** (Kemal). O zamana kadar
oyunda ve paketler ekranında yok; aşağıdaki bilgiler görsel işi için kayıttır.

**İlk sürümün kilitli masası Sade Meyhane** (Kemal, 15 Kasım gece). Ödüllü reklamla bir el
denenir, paket olarak açılır (telefon uygulamasında; fiyat: veri yok). İlk masa kıyıdan uzak,
deniz görmeyen bir yer; Sade Meyhane koya bakan yamaçta olduğu için iki masa birbirinden ayrılır.

Künyede olanlar (yalnız bunlar kullanılır):
- İskele Mahallesi'nde bir meyhane (künye, yerler listesi).
- **Kemsköy Caddesi'nde değil: otelin yanında, koya bakan yamaçta** (Kemal, 8 Kasım 2026: harita
  doğru; künye).
- Binası **eski zeytinyağı fabrikasının taş binası**. Fabrika İskele tarafında, 19. yüzyıl sonu ile
  1920'ler arasında kuruldu, 1950–1970'lerde kapandı (künye). Çiftlik'teki kooperatif fabrikası
  ayrı bir fabrikadır; karıştırılmaz (Kemal, 22 Ekim; künye).
- Fabrika kapandıktan sonra bir süre boş kaldı, **1980–1990'larda meyhane oldu** (künye, mekânlar).
- **Yıl boyu açık**; İskele'de gece hayatı yıl boyu, kışın sakin (künye).
- Sahibi **Eylül Alimyeri**; Dondurmacı Kızlar'ın da sahibi (künye).
- Ad: "Sade Meyhane" (Kemal, 8 Ekim); eski metinlerdeki "Sade Meze" adı değişti, takma adıdır
  (künye).

**Künyede yok:** meyhanenin iç düzeni (salon, masalar, bahçe ya da teras olup olmadığı), masanın
içeride mi dışarıda mı durduğu, binanın rengi ve kat sayısı, fabrikadan kalan bir iz (makine,
taş, baca) olup olmadığı, sofrada ne olduğu. Bunlar uydurulmaz; masada görünecekler Kemal'in
seçimidir (görseli gelince; Kemal, 15 Kasım). Görsel işinden önce yeri künyede ve vikide yeniden okunur, haritadaki
konumuna bakılır (ortak kurallar, "Çizmeden önce yerine bak").

Ses (öneri, künyeden): koy, akşam sofrası uğultusu (sessiz, uzak). Müzik ya da kalabalık sesi yok
(ton; öneri).

Öneri bağ: Sade Meyhane İskele'de olduğu için, renk bağında kupa (İskele) figürleri bu masada öne
çıkabilir. Karar Kemal'in.

### 3.3 Sonraki masa adayları

Kalanlar sonraki paketlerdir; sırası Kemal'in. Kaynak: künye.
1. **Merkez kahvehanesi** (Merkez): meydan, çınar, taş çeşme; Dirlik'in deplasman maçları burada
   izlenir. Ses: çay bardağı, çeşme suyu, meydan.
2. **Liman sahili** (Liman): feribot, balık hali, martılar; akşamları son feribota kadar canlı.
   Ses: martı, motor, iskele.
3. **Taraftar Birahanesi** (Stadyum): plaja bakan kıyıda, maç öncesi buluşma yeri. Ses: dalga,
   uzaktan tribün.
4. **The Imperial Kemsköy** (İskele): otelin içi (lobi ya da sol kuledeki restoran). Ses: sakin iç
   mekân, uzaktan deniz.
5. **Deniz Feneri** (Liman): limana bakan fener. Ses: rüzgâr, deniz.

Görsel işinden önce her masanın yeri künyede ve vikide yeniden okunur (ortak kurallar, "Çizmeden
önce yerine bak").

Öneri bağ: masa ile destenin mahalle renkleri eşleşebilir (maça Liman, kupa İskele, karo Çiftlik,
sinek Merkez; Stadyum jokerde ya da kutuda). İlk masa Çiftlik olduğundan kulüp evinde karo
figürleri öne çıkabilir. Karar Kemal'in.

Mahallenin sesi (öneri): sessiz, döngülü bir ortam sesi; müzik yerine ya da altında. Kart sesleri
(dağıtma, çevirme, yerleştirme) yumuşak. Ses ayrı ayrı kısılabilir. Mevsim ve saat (gündüz/akşam)
değişimi ilk sürümde değil, ileride aday.

## 4. Desteler

Kemal (14-11-2026): "Desteler olsun işte ama biri bizim satacağımız destelerden olsun." Oyunda
birden çok deste seçilebilir; biri Kems'in satacağı fiziksel deste.

**İlk sürümün desteleri:** Sürek Kulübü destesi ücretsiz ve varsayılan + sade deste ücretsiz
(Kemal, 14 Kasım) + 12 paket deste: beş mahallenin her biri için ikişer deste ve 2 renk destesi
(Kemal, 15 Kasım akşam; 4.2'de 3. madde). Web denemesinde hepsi açık.

### 4.1 Sürek Kulübü destesi (kesin: Kems'in satacağı deste)

İskambil kararlarına (14-11-2026) bağlı; oyun desteyi değiştirmez, aynen kullanır.
- **Renk ↔ mahalle:** maça Liman, kupa İskele, karo Çiftlik, sinek Merkez. Stadyum jokerde ya da
  kutuda yer alabilir.
- **Figürler (papaz, kız, vale):** vikideki kişiler ve mahallenin adsız tipleri birlikte; olmazsa
  adsız kişiler tasarlanır, beğenilirse karakter olur (Kemal). Oyun figürlere ad, hikâye yazmaz.
- **Jokerler:** Kangal ve sarman kedi. Klondike ve Spider'da kullanılmaz; desteyi açınca ya da
  paketler ekranında görünür, ilerideki oyunlarda kullanılır.
- **Kulüp izi:** arka yüz ve kutu, as kartları, maça ası özel; minik logolar ve dokunuşlar,
  boğmadan (Kemal). Arka yüz "şovlu", ortasında illüstrasyon.
- **Arka yüz ve iki set** (Kemal, 24 Kasım: "iki desteyi otomatik ata, farklı renklerde aynı desende
  olsun"): ince dikey şerit, ortada krem oval içinde siyah Kangal. Klasik iskambildeki iki deste gibi
  iki set: 1. set lacivert-kiremit, 2. set ege-kırmızı. Spider iki seti birlikte, klasik solitaire
  yalnız 1. seti kullanır. Oyuncu set seçmez; set kartın kendisinden gelir.
- **Renkler:** kulüp paleti bu deste için esner, daha renkli ve şovlu (Kemal).
- **Oyundaki yeri:** fiziksel destenin oyundaki eşi; oyun destenin vitrini olur. **Ücretsiz ve
  varsayılan deste** (Kemal, 14 Kasım): oyuncu oyunu ilk açtığında bu desteyle oynar.
- **Çizim stili:** "gün gün dener bakarız" (Kemal). Bitene kadar oyun aşağıdaki sade desteyle
  yapılabilir.

### 4.2 Öbür desteler

1. **Sade deste** (ilk sürümde, ücretsiz; Kemal, 14 Kasım): klasik, çizimsiz, köşede büyük değer
   ve takım simgesi, kırmızı ve siyah. Dikey ekranda, özellikle Spider'ın dar on sütununda en
   okunaklısı. Sürek Kulübü destesinin çizimleri bitmeden de oyun bununla oynanabilir. Arka yüzünde
   yalnız minik bir kulüp ya da Kems izi olabilir (öneri).
2. **Sade destenin dört renkli hâli:** her takım ayrı renk (ayarlarda seçenek); renk ayrımı zor
   olan oyuncu için. Erişilebilirlik ayarı olduğu için kilitlenmez (öneri).
3. **Paket desteler: 12 deste** (Kemal, 15 Kasım akşam):
   - **Mahalle desteleri (10):** Liman, İskele, Çiftlik, Merkez ve Stadyum için ikişer deste. Her
     mahallenin iki destesi bir seri.
   - **Renk desteleri (2):** yalnız renkten oluşan iki deste, bir seri.
   - **Bir süre yalnız arka yüz** çalışılır; ön yüzler (resimli kartlar) sonra. O zamana kadar ön
     yüz sade deste gibidir. Arka yüzler günlük görsel işine de girer (gece turu).
   - Öğeler yalnız künyeden; yazı, harf, rakam, logo, gerçek kişi yok. Deste ve seri adları
     [Kemal]; ajans istenirse yalnız aday listesi getirir.
   - Masa ve deste **ayrı paketler** (Kemal, 15 Kasım akşam).
   - **Web deneme sürümünde hepsi açık, kilit yok** (Kemal, 15 Kasım akşam). Hangilerinin kilitli
     geleceği, satılacağı ve fiyatı yayın sürümünden önce konuşulacak (fiyat: veri yok).
   - Sürek Kulübü destesi gibi okunurluk kuralına uyar.
4. **Sonraki paket desteler:** yeni arka yüz ve figür tasarımları. İçerikleri, kaç tane oldukları
   ve hangilerinin fiziksel olarak da satılacağı Kemal'in. Ad koyulmadı.

**Okunurluk (her destede):** kartın köşesinde değer ve takım simgesi büyük, klasik kırmızı/siyah;
şovlu renk ve illüstrasyon kartın gövdesinde (öneri, Sürek Kulübü destesi için de). Dikey ekranda
kart küçük göründüğü için bu öneri öncekinden daha önemli. Kart köşesindeki harfler (papaz, kız,
vale) Türkçe ve İngilizcede farklıdır; dile göre değişip değişmeyeceği açık (öneri: değişir).

## 5. Para modeli

Kemal: "1 ve 3 karışık": ücretsiz + deste ve masa paketleri; reklam da olabilir. 14-11-2026:
"El aralarında her defasında reklam olmasın, çok reklam görsünler istemiyorum ama para da lazım."
Fiyat ve sıklık sonra (veri yok). 15 Kasım (Kemal, örnek oyun için "örnekteki gibi"): ipucu reklam
izleyerek alınır, el bitince reklam girer, bir kez satın alınınca reklam kalkar. Reklam sıklığı ve
fiyat [Kemal].
- **Ücretsiz:** iki oyun, bütün zorluklar, iki deste (Sürek Kulübü destesi ve sade deste; Kemal,
  14 Kasım), kulüp evi masası, ipucu dışındaki yardımcılar (geri al her elde birkaç hakla; 1.3), günlük
  mücadele ve kartpostal etkinliği (öneri). Oyunun kendisi kilitlenmez (öneri).
- **Paketler:** yeni deste (arka yüz ve figür tasarımları) ve yeni masa (mekân ve sesi). Fiyat: veri
  yok. Paket içerikleri Kemal'in. Masa ve deste ayrı paketler. Paket desteler 12 (Kemal,
  15 Kasım akşam; 4.2); masa Sade Meyhane (3.2). Web denemesinde hepsi açık; hangilerinin kilitli
  ve satılık geleceği yayın sürümünden önce konuşulacak (15 Kasım'daki "bir masa ve bir deste
  kilitli" kararı o konuşmada yeniden ele alınır).
- **Reklam ilkeleri** (Kemal'in cevabından):
  - Her el arasında reklam yok (14 Kasım). El sonu reklamı **birkaç elde bir** girer (Kemal, 15
    Kasım); kaç elde bir olacağı denenip seçilir: [Kemal].
  - Oyun ortasında reklam yok.
  - Alt şerit reklamı yok (masanın havasını bozar).
- **Reklam düzeni (Kemal, 14 Kasım; 15 Kasım'da "örnekteki gibi"):** el sonu reklamı + ödüllü
  reklam (ipucu ve deneme) + reklamsız satın alma.
  - **El sonu reklamı:** el bitince, oyun sonu ekranında girer (Kemal, 15 Kasım). Kaç elde bir ve
    ilk kaç oyunda hiç olmadığı [Kemal]; sayılar deneme sonrası.
  - **İsteğe bağlı ödüllü reklam (Kemal, 14 Kasım):** oyuncu isterse izler, izlemezse hiçbir şey
    kaybetmez. Karşılığı:
    - kilitli masayı (Sade Meyhane) bir el boyunca deneme;
    - kilitli desteyi bir el boyunca deneme.
    - ipucu (Kemal, 15 Kasım: "örnekteki gibi").
    - geri al hakkı (Kemal, 15 Kasım soru turu): elin ücretsiz hakları bitince bir izlemede bir
      hak daha. Yeri masadaki geri al düğmesi; haklar bitince oyuncu dokununca kısa kutu çıkar.
    - Deneme süresi: **bir el** (Kemal, 15 Kasım). Deneme o elin sonunda (kazanınca ya da "yeni el"e
      geçince) biter, masa ya da deste oyuncunun kendi seçtiğine döner.
    - Yarım kalan el (öneri): uygulama kapanıp "devam et" ile dönülürse deneme o el bitene kadar
      sürer; "yeniden dene" aynı eli baştan açtığı için deneme de sürer. Yeni bir el için yeniden
      izlemek gerekir.
    - İpucu 14 Kasım'da ücretsiz olduğu için ödül listesinden düşmüştü; 15 Kasım'da yeniden
      ödüllü reklamın karşılığı oldu (1.3). Bir izlemede kaç ipucu: [Kemal].
    - Yeri: deneme için paketler ekranında, kilitli paketin yanında (öneri); ipucu için masadaki
      ipucu düğmesinde, oyuncu dokununca (öneri). Kendiliğinden çıkmaz.
    - Ödüllü reklamla deneme, kilitli paket olduğu zaman anlam kazanır; neyin kilitleneceği yayın
      sürümünden önce konuşulacak (Kemal, 15 Kasım akşam).
  - **Reklamsız satın alma:** bir kez satın alınınca reklam kalkar (Kemal, 14 ve 15 Kasım; fiyat
    [Kemal], veri yok). İpucu o zaman reklamsız mı gelir, deneme reklamı durur mu: [Kemal]
    (öneri: ipucu reklamsız gelir; deneme isteğe bağlı olduğu için durabilir).
- **Web sürümü: yalnız deneme** (Kemal, 15 Kasım gece). Kemal ve yakın çevresi bağlantıyla dener;
  **web'de reklam ve satın alma yok**. Gerçek reklam ve satın alma yalnız telefon uygulamasıyla
  gelir (6. bölüm). **İpucu web'de reklamsız çalışır** (Kemal, 15 Kasım). Geri al hakları bitince
  web'de reklam yerine "[YER TUTUCU: burada reklam olacak]" kutusu çıkar; düğmesi bir hak verir
  (Kemal, 15 Kasım soru turu; 1.3). Web'de paketler ekranı
  ve düğmeler yer tutucu olarak durur; deneyenler kilitli
  masayı görebilsin diye deneme sürümünde Sade Meyhane açık ya da ayarlardan açılabilir olabilir
  (öneri; karar Kemal'in).
- Gelir, indirme, izlenme tahmini: veri yok.

## 6. Yapım yolu (Kemal, 15 Kasım)

**Karar: önce web oyunu, sonra telefon uygulaması** (Kemal, 15 Kasım). Bu, belgenin önceki
hâlindeki birinci yoldur: oyun Dondurmacı Kızlar ve DK Lite gibi tarayıcı oyunu olarak yazılır,
sonra telefon uygulamasına paketlenir (paketleme aracı öbür oyunlardaki gibi Capacitor; öneri).
Ekibin bildiği yol; tarayıcıda denemek kolay.

Sıra (öneri):
1. **Web deneme sürümü** (Kemal, 15 Kasım gece: yalnız deneme): iki oyun (önce Spider), iki ücretsiz deste,
   kulüp evi masası, altı yardımcı (ipucu reklamsız), puan, ana ekran ve üç sekme, günlük
   mücadele, kartpostal etkinliği (8. bölüm), Türkçe ve İngilizce metin dosyaları, dikey düzen. Sade Meyhane
   masası görseli hazır olunca girer. Paket desteler (12) arka yüzleri hazır oldukça girer; web'de
   hepsi açık, kilit yok (Kemal, 15 Kasım akşam). Paketler ekranı ve ödüllü reklam düğmesi yalnız yer tutucu; **web'de reklam ve satın
   alma yok**. Kemal ve yakın çevresi telefonun tarayıcısından bağlantıyla dener (öbür oyunlar
   gibi); herkese açık değil.
2. **Telefon uygulaması:** web oyunu paketlenir; dikey ekran kilidi, gerçek reklam (el sonu,
   ipucu, deneme), reklamı kaldıran satın alma ve paketler, mağaza sayfaları bu adımda eklenir.

Elenen yollar (kayıt için): baştan telefon uygulaması (React Native / Expo); oyun motoru (Godot ya
da Unity); herkese açık, reklamlı ve satın almalı web oyunu (Kemal, 15 Kasım gece).

Telefon adımında gerekecek (veri yok, sonra): mağaza geliştirici hesapları, uygulama içi satın
alma, reklam hizmeti, gizlilik metni (Türkçe ve İngilizce). Bunlar Kemal'in hesabıyla açılır; ajan
açmaz. Depo açıldı: `hkemal94/kart-oyunu` (Kemal, 15 Kasım; geçici çalışma adı). Deneme bağlantısı
https://hkemal94.github.io/kart-oyunu/ (ana dala birleşince GitHub Pages'te yayınlanır).

## 7. Açık sorular (Kemal'in kararı)

14-11-2026'da kapananlar: ekran yönü (dikey), ilk masa (kulüp evi), reklam türü (seyrek ve ölçülü;
sıklık açık), deste okunurluğu (birden çok deste; ayrıntı açık).

14 Kasım, ikinci turda kapananlar (Kemal): reklam düzeni (seyrek geçiş reklamı yalnız oyun sonunda
+ isteğe bağlı ödüllü reklam + reklamsız paket), ilk sürümün desteleri (Sürek Kulübü destesi
ücretsiz ve varsayılan + sade deste ücretsiz), kulüp evi masasının görseli (taş, avlulu çiftlik evi
ve avlu · Kangal · zeytinlik ve yamaç; deniz görünmez).

14 Kasım, üçüncü turda kapananlar (Kemal): yardımcılar (geri al · ipucu · kendiliğinden bitirme ·
kaldığı yerden devam · süre ve hamle sayacı, kapatılabilir · basit istatistik), ödüllü reklamın
karşılığı (kilitli masayı ya da desteyi bir süre deneme; ipucu ücretsiz olduğu için ödül
listesinden düştü), dil (Türkçe ve İngilizce).

15 Kasım'da kapananlar (Kemal): ilk sürümde kilitli paket (evet; bir masa ve bir deste), deneme
süresi (bir el boyunca), yapım yolu (önce web oyunu, sonra telefon uygulaması).

15 Kasım gece kapananlar (Kemal): ilk kilitli masa (Sade Meyhane), web sürümü (yalnız deneme;
Kemal ve yakın çevresi bağlantıyla dener; web'de reklam ve satın alma yok).

15 Kasım ("Oyuna başlayalım") kapananlar (Kemal): oyun sırası (Spider önce, 1, 2 ve 4 renk;
klasik solitaire sonra), depo (`kart-oyunu`, geçici çalışma adı), teknoloji (Vite + React +
TypeScript, 2B). Ertelenen: Sade Meyhane masası, görseli gelince.

15 Kasım (örnek oyun) kapananlar (Kemal): eklenecekler (günlük mücadele, kartpostal etkinliği,
puan ve en iyi puan, ana ekran ve Ben sekmesi), para modeli (örnekteki gibi: ipucu reklamla, el
bitince reklam, bir kez satın alınınca reklam kalkar).

15 Kasım (puan ve günlük mücadele) kapananlar (Kemal): puanın yapısı (kazandıkça birikir, aşama
artar; kaybedince ya da el bırakılınca seri biter; en iyi puan en yüksek seri puanı), el yarımken
"yeni oyun" (onay sorusu; evet denirse el kaybedilmiş sayılır), günlük mücadelede oyun ve zorluk
(oyuncu seçer), "ay dolunca" (ayın bütün günleri yıldızlanınca), geçmiş günler (sonradan
oynanabilir).

15 Kasım (soru turu) kapananlar (Kemal; kayıt `docs/soru-cevap/kart-oyunu-1.md`): geri al (sınırlı;
her elde birkaç ücretsiz hak, fazlası telefon uygulamasında reklamla; web'de "reklam yerine" kutusu
bir hak verir), geri almak hamle sayılır mı (evet), ipucu sırası (diziyi tamamlayan, aynı takım,
kapalı kartı açan, öbürleri), en iyi puan (oyun ve zorluk başına ayrı), günlük mücadele eli seriye
sayılır mı (evet; kazanınca aşama artar, kaybedince seri biter), aylık ödülün türü (her ay bir
Düzada nesnesi ya da simgesi), puan hesabının yolu (ajans 2-3 aday getirir, Kemal seçer).
Ertelenen: kartın kırmızısı (Sürek Kulübü destesi çizilince).

16 Kasım kapananlar (Kemal): puan formülü (a · çarpanlı taban, aşama çarpanlı; 8.3).

15 Kasım (soru turu 2. set) kapananlar (Kemal): kartpostal yerleri (İskele ve The Imperial Kemsköy; Liman ve Deniz Feneri; Dirlik Stadı; Küçükçetmi Çiftliği; Merkez ve Belediye; Ada Tepesi ve sırtlar (Kuzey Sırtı, Çetmi Sırtı); Sahil Yolu ve Güney Burnu), kartpostalda yazı
(yok, yazısız).

Açık kalanlar:
- **Klasik solitaire'de deste dönüşü:** açılan kartlar destenin altına kaç kez dönebilsin? Şimdilik
  sınırsız (standart; öneri). Adaylar: sınırsız (önerilen) · 3 kart çekmede üç kez, 1 kart çekmede
  bir kez (bazı oyunlardaki gibi) · ayarlardan seçilsin.
- **Klasik solitaire'de ipucu sırası:** öneri temele giden, kapalı kartı açan, öbürleri (1.3).
- **Geri al hak sayısı:** bir elde kaç ücretsiz hak: [Kemal], web denemesinde seçecek (Kemal, 15
  Kasım soru turu). Kodda deneme varsayılanı var, karar değil; adres sonuna `?geriAlHak=` yazılarak
  denenir (1.3).
- **Paket desteler:** içerik kapandı (Kemal, 15 Kasım akşam: 5 mahalle × 2 + 2 renk destesi; 4.2).
  Açık kalan: deste ve seri adları [Kemal]; yayın sürümünde hangilerinin kilitli ve satılık olacağı,
  fiyat (yayın öncesi konuşulacak).
- **Sade Meyhane masası:** ne görüneceği ve web denemesinde açık mı duracağı; görseli gelince
  (Kemal, 15 Kasım). Künyede yalnız taş fabrika binası, koya bakan yamaç ve otelin yanı var.
- **Kartpostal sırası:** yedi yer seçildi (8.2); hangi sırayla açılacağı [Kemal].
- **Kare sayısı, etkinlik süresi, renk ve zorluk eşleşmesi:** web denemesinde ayarlanabilir gelir,
  Kemal seçer (Kemal, 15 Kasım soru turu). Sayılar [Kemal].
- **Pul koleksiyonu:** kazanma, yer ve yazı kapandı (Kemal, 15 Kasım akşam; 8.1). Açık kalan: her
  pulun tasarımı (her biri ayrı çalışılır; ilk pullar hangi aylardan başlar ve konuları [Kemal]);
  4. pulun ne kadar büyük ve süslü olacağı tasarımla birlikte. Eski 18 adaylık nesne listesi düştü.
- **Puan sayıları:** formül a seçildi (16 Kasım, 8.3); taban, hamle ve süre payı, en az puan deneme
  varsayılanı, [Kemal] (KKM → Oyunlar → Ayarlar).
- **Kaybetme:** el ne zaman kaybedilmiş sayılır? Şimdilik yalnız eli bırakınca (8.3). Adaylar:
  yalnız eli bırakınca (şu anki) · Spider ve klasik solitaire'de yapılacak hamle kalmayınca da
  (o an "yeniden dene" kutusu çıkar).
- **Seri oyun ve zorluk başına mı:** şimdilik evet (öneri; en iyi puan gibi). Aday: tek seri,
  hangi oyun oynanırsa oynansın sürer.
- **Eli bırakma sorusunun metni:** [YER TUTUCU], Kemal onaylar (2. bölüm).
- **El sonu reklamı:** birkaç elde bir (Kemal, 15 Kasım); kaç elde bir ve ilk kaç oyunda hiç
  yok: [Kemal]. Reklamsız satın alınınca ipucu reklamsız mı: [Kemal].
- **Günlük mücadelede dağıtım:** aynı gün aynı zorlukta herkese aynı dağıtım (8.1). Kemal 15 Kasım'da
  "bunu yap" dedi; 8. paketle kodda. Kapandı.
- **Günlük mücadelede önceki aylar:** takvim en çok Ocak 2026'ya kadar (Kemal 15 Kasım). Kapandı.
- **Günlük elde "Yeni el":** aynı günün elini baştan dağıtır (eli bırakma sorusuyla). Kemal
  15 Kasım: şu anki davranış kalır. Kapandı.
- **Spider'da kendiliğinden bitirme:** Spider'da "Bitir" yok; tam diziler zaten kendiliğinden
  kalkıyor. Kemal 15 Kasım: önerilen hâl kalıcı. Kapandı.
- **Kart köşesindeki harfler:** dile göre değişsin mi (öneri: değişir). İskelette iki dilde de
  A, J, Q, K; harfler metin dosyasında, karar gelince yalnız orası değişir. 5. pakette de böyle
  kaldı (Türkçe harfler belgede yazılı değil). Değişirse hangi harfler: [Kemal].
- **Kartın kırmızısı:** kiremit (#F26B6F) krem kartın küçük köşesinde zor okunuyor. Kemal (15 Kasım
  soru turu): Sürek Kulübü destesi çizilince karar verilecek; o zamana kadar kiremidin koyusu
  (#B8383D) kalır.
- **Reklam sayıları ve fiyat:** reklam sıklığı, bir izlemede kaç ipucu, fiyatlar: [Kemal], deneme sonrası.
- **Oyunun adı:** **kapandı** (Kemal, 15 Kasım gece): Düzada Cards Club; tanıtıcı satır "Solitaire ·
  Spider". Oyun logosu ertelendi.
- **Sonraki masalar:** 3.3'teki adaylar hangi sırayla paket olur.

## 8. Örnek oyundan gelenler (Kemal, 15 Kasım)

Kemal'in gösterdiği örnek Spider oyunundan yalnız oynanış şekli alınır. Örneğin adı, görseli, kupa
çizimleri ve metinleri bu belgeye, depoya ve oyuna girmez. Ödül ve resim görselleri bizim
tasarımımızdır; görsel üretimi Kemal onayıyla.

### 8.1 Günlük mücadele

- Her gün bir el (Kemal). Kazanınca takvimde o güne yıldız konur.
- **Oyun ve zorluğu oyuncu seçer** (Kemal, 15 Kasım): günün elini oyuncu kendi seçtiği oyun
  (Spider ya da klasik solitaire) ve zorlukla (1/2/4 renk; 1/3 kart) oynar.
- Öneri (Kemal'in onayı yok): günün eli seçilen zorluğa göre o günün elidir; aynı gün aynı oyun ve
  zorlukta herkese aynı dağıtım gelir. Başka gün ya da başka zorlukta dağıtım başkadır.
- **Geçmiş günler sonradan oynanabilir** (Kemal, 15 Kasım): takvimde geçmiş bir güne dokununca o
  günün eli açılır. Sonradan kazanılan geçmiş gün de yıldız alır (öneri; aylık ödül bütün günleri
  istediği için).
- **Pul koleksiyonu (Kemal, 15 Kasım akşam; aylık rozetin yerine):**
  - **Kazanma:** her ay bir pul. Ay, bütün günleri yıldızlanınca tamamlanır (15 Kasım kuralı
    sürüyor). Bir çeyreğin (Ocak–Mart, Nisan–Haziran, Temmuz–Eylül, Ekim–Aralık) üç aylık pulu
    toplanınca daha büyük ve süslü bir **4. pul** gelir: "3+1 pul serisi". Geçmiş günler sonradan
    oynanabildiği için geçmiş bir ayın ve çeyreğin pulu da sonradan tamamlanabilir.
  - **Görünüm:** gerçek posta pulu gibi (tırtıklı kenar). **Her pul ayrı tasarlanır**, tek şablon
    yok; hepsine tek tek çalışılır. Yalnız künyedeki nesne, yer ve simgeler; örnek oyunun kupası
    kopyalanmaz. Görsel üretimi Kemal onayıyla; tasarlanmamış pul yer tutucuyla durur.
  - **Yer:** Ben → Ödüller'de "Pul koleksiyonu" kartı; dokununca ayrı sayfa açılır (öneri: her yıl
    bir satır, çeyrek başına 3 pul + 4. pul; kazanılmamış pul soluk, gelecek aylar kilitli).
  - **Yazı:** pul yazısız; çeyrek ve yıl pulun altında, sayfada yazar.
  - **Eski rozetler:** telefonda yalnız yıldızlı günler saklandığı için pullar da bu listeden
    hesaplanır; tamamlanmış her ay kendi pulu olur, kazanılan hiçbir şey kaybolmaz (öneri, Oyun
    Tasarımcısı 15 Kasım).
  - Eski öneri ("her ay bir Düzada nesnesi", 18 adaylık liste) düştü.
  - **Pul koleksiyonu bütün oyunların ortak ödül sistemi** (Kemal, 15 Kasım): tasarım dili, 3+1 seri
    ve koleksiyon sayfası oyunlar arasında aynı. Ortak kurallar Kems Ajans deposunda
    `docs/pul-koleksiyonu.md`. Bu oyunda bir ay, ayın bütün günleri yıldızlanınca kazanılır.
  - **Yapılan (`ajans/pul-koleksiyonu`, 15 Kasım):** Ben → Ödüller'de "Pul koleksiyonu" kartı (son
    üç pul, kaç pul ve büyük pul toplandığı); dokununca sayfa: yıl başına bir bölüm (koleksiyon Ocak
    2026'dan başlar, takvimle aynı), her çeyrekte üç aylık pul ve yanında büyük pul, altında çeyrek
    ve yıl (ay adları dile göre). Pullar kodla çizilmiş yer tutucu: tırtıklı kenar, krem zemin,
    lacivert ince çizgi, yazısız; büyük pul daha büyük, çift çerçeveli, köşeleri süslü. Kazanılmamış
    pul soluk; gelecek ayların pulu çok soluk ve kilitli. Takvimin altında ve günlük elin oyun
    sonunda "Bu ayın pulu kazanıldı", çeyrek de tamamsa "Çeyreğin büyük pulu kazanıldı". Pul kodu
    oyundan bağımsız `src/pul/` klasöründe (başka oyuna kopyalanabilir; `src/pul/BENIOKU.md`); bu
    oyuna özgü tek girdi kazanılan aylar (`src/oyun/gunluk.ts` → `tamamlananAylar`). Pul görselleri
    `src/pul/pullar.ts`'e anahtarla eklenir: `"2026-01"` aylık pul, `"2026-Q1"` çeyreğin büyük pulu;
    görseli olmayan pul yer tutucuyla çizilir.
- **Günlük mücadele eli puan serisine sayılır** (Kemal, 15 Kasım soru turu): kazanınca serinin
  aşaması artar, kaybedince seri biter (8.3). Önceki öneri ("ayrı tutulsun") düştü.
- Takvim Mücadeleler sekmesinde; ana ekranın üstünde günün kartı.
- **Yapılan (8. paket, `ajans/gunluk-mucadele`; Kemal, 15 Kasım: "Günlük mücadeleye başla"):**
  - Dağıtım: tarih, oyun ve zorluktan türeyen sabit karıştırma; aynı gün, aynı oyun ve zorlukta
    her telefonda aynı el, başka gün ya da zorlukta başka el (yukarıdaki öneri, Kemal "bunu yap").
  - Takvim (Mücadeleler): ayın adı, "yıldız/gün sayısı", Pazartesi'den başlayan haftalar, gün
    kısaltmaları dile göre; kazanılan günde yıldız (kodla çizilir; örnek oyunun kupası
    kopyalanmaz), bugün vurgulu, gelecek günler soluk ve dokunulmaz, önceki aylara ok. Takvim en
    çok Ocak 2026'ya kadar geri gider; o ayda geri ok soluk ve kapalı (Kemal, 15 Kasım). Altta
    seçili gün için oyun ve zorluk seçimi ve "Oyna".
  - Masada başlığın yanında küçük yıldızlı tarih işareti; kazanınca oyun sonunda "Günün yıldızı"
    ve "Takvime dön".
  - Aylık ödül: ayın bütün günleri yıldızlanınca Ben → Ödüller → Aylık ödüller'de
    "[YER TUTUCU: ayın ödülü]" rozeti. 15 Kasım akşam kararıyla pul koleksiyonuna dönüştü
    (`ajans/pul-koleksiyonu`; yukarıda).
  - Günlük yarım el kaldığı yerden devam eder, normal yarım elden ayrı saklanır.
  - Seri: günlük el normal elle aynı seriye (oyun ve zorluk başına) sayılır; kazanınca aşama
    artar, bırakınca seri biter.

### 8.2 Kartpostal etkinliği

- Süreli etkinlik (Kemal). Bir resim karelere bölünür; kazanılan her el bir kareyi açar.
- Kare rengi o karenin zorluğunu gösterir (Kemal).
- Biten resim koleksiyona girer (Ben sekmesi, ödüller). Önceki resim açılmadan sonraki kilitli
  kalır (Kemal).
- Resimler **Düzada kartpostalları** (Kems'in önerisi; Kemal "Kartpostal etkinliği"ni seçti).
- **Kartpostal yerleri (Kemal, 15 Kasım soru turu 2. set):**
  1. İskele ve The Imperial Kemsköy
  2. Liman ve Deniz Feneri
  3. Dirlik Stadı
  4. Küçükçetmi Çiftliği
  5. Merkez ve Belediye
  6. Ada Tepesi ve sırtlar (Kuzey Sırtı, Çetmi Sırtı)
  7. Sahil Yolu ve Güney Burnu

  Sıra burada yazıldığı gibidir; hangi sırayla açılacağı [Kemal]. Yalnız künyede olan yerler
  çizilir; her görselden önce yer künyede ve vikide okunur, haritadaki konumuna bakılır (ortak
  kurallar, "Çizmeden önce yerine bak").
- **Kartpostallar yazısız** (Kemal, 15 Kasım soru turu 2. set): üstünde yer adı ya da başka yazı
  yok.
- Kare sayısı, etkinlik süresi, renk ve zorluk eşleşmesi **web denemesinde ayarlanabilir gelir,
  Kemal seçer** (Kemal, 15 Kasım soru turu). Sayılar [Kemal]; kodda yalnız işaretli deneme
  varsayılanı durur. Uydurma sayı yok.
- Etkinlik süresi bitince yarım resim ne olur: [Kemal].
- Görseller ayrı bir görsel paketiyle gelir (yol haritası); o zamana kadar yer tutucu resim.

### 8.3 Puan ve en iyi puan

- Süre ve hamleye göre çarpanlı puan; "tüm zamanların en iyisi" saklanır ve ana ekranda görünür
  (Kemal).
- **Puan kazandıkça birikir** (Kemal, 15 Kasım):
  - El kazanılınca puan bir sonraki ele taşınır ve aşama bir artar (Aşama 1, 2, 3…). Yüksek aşama
    daha çok puan getirir.
  - Kaybedince ya da el yarımken yeni oyuna geçince seri biter, puan sıfırdan başlar ve Aşama 1'e
    döner. El yarımken yeni oyuna geçmeden önce onay sorusu çıkar (2. bölüm, "Eli bırakma").
  - **En iyi puan = en yüksek seri puanı** (Kemal, 15 Kasım).
- Aşama başına artış, süre ve hamlenin payı ve formül: [Kemal] (uydurma sayı yok). **Ajans puan
  paketi (yol haritası 6) yapılırken 2-3 aday getirir, Kemal seçer** (Kemal, 15 Kasım soru turu).
- **Formül: a (Kemal 16 Kasım).** Çarpanlı taban, aşama çarpanlı: her el bir tabandan başlar; her
  hamle ve geçen süre tabandan düşer, kazanılan el bir alt sınırın altına inmez; sonuç aşamayla
  çarpılır (Aşama 2'de iki katı). Kodda tek yerde: `src/kart/puan.ts`; sayılar
  `src/oyun/ayarlar.json` → puan (KKM → Oyunlar → Ayarlar). **Formül Kemal onaylı, sayılar deneme
  varsayılanı** (Kemal onaylamadı): taban 2000, her hamle 2, her dakika 30 puan, en az 200.
  - **Örnek el:** Spider, 200 hamle, 15 dakika: Aşama 1'de 1150, Aşama 2'de 2300, Aşama 3'te 3450
    (üç elin serisi 6900). Klasik solitaire, 120 hamle, 5 dakika, Aşama 1: 1610.
  - Tarihçe: 15 Kasım'daki puan paketinde öbür adaylar b · hamle başı puan ve c · bonuslu sabit
    puandı (`?puan=b` / `?puan=c` ile denenirdi); 16 Kasım'da kalktılar.
- **Kodda duranlar (6. paket; öneri, Kemal'in onayı yok):** masanın üst satırında "Puan" ve
  "Aşama"; puan, biriken seri puanı ile bu elin "şimdi bitse" puanının toplamıdır. Seri de en iyi
  puan gibi oyun ve zorluk başına ayrı tutulur (soru, 7). Oyun sonunda bu elin puanı, seri puanı,
  yeni aşama ve seri en iyiyi geçtiyse "Yeni en iyi" işareti. Oyun seçiminde her kartın altında
  seçili zorluğun en iyi puanı. Seri ve en iyi puan telefonun tarayıcısında saklanır.
- **Kaybetme:** belgede kaybetmenin tanımı yok (ör. Spider'da hamle kalmayınca). Şimdilik seriyi
  yalnız eli bırakmak bitirir; tanım Kemal'e soruldu (7).
- **En iyi puan oyun ve zorluk başına ayrı** (Kemal, 15 Kasım soru turu): ör. 1 renk Spider ile
  4 renk Spider'ın en iyi puanı ayrı saklanır.
- **Günlük mücadele eli seriye sayılır** (Kemal, 15 Kasım soru turu; 8.1): kazanınca aşama artar,
  kaybedince seri biter.
- Kaldığı yerden devam (1.3): uygulama kapanınca seri bitmez; yarım el "devam et" ile sürer (öneri;
  eli bırakmak yalnız "yeni oyun" ya da "yeni el" ile olur). 7. paketle geldi: sayfa kapanınca
  yarım el artık kaybolmuyor.
- Ayarlarda "her hamlede puanı göster" (Kemal): açıksa masanın bilgi satırında puan görünür.

### 8.4 Ana ekran ve Ben sekmesi

Ayrıntı 2. bölümde (alt sekmeler, ana ekran, Ben sekmesi, ayarlarda titreşim ve "her hamlede puanı
göster"). "Yardım", "oyun hakkında" ve "gizlilik" metinleri Kemal'in; yazılana kadar
`[YER TUTUCU: …]` durur. Gizlilik metni telefon adımında gerekir (6. bölüm).
"Nasıl oynanır" (7. paket; Kems'in işi, 15 Kasım): Spider ve klasik solitaire'in standart
kurallarının kısa özeti ve iki oyunda ortak üç madde (dokunarak taşıma, geri al ve ipucu, puan).
Kurgu değil, kural anlatımıdır; Türkçesi ve İngilizcesi metin dosyalarında. **Taslak, Kemal
onaylayacak.**

## Kemal'e sorular

15 Kasım soru turunda sekiz sorunun hepsi cevaplandı (kayıt: `docs/soru-cevap/kart-oyunu-1.md`).
Açık kalanlar sayı ya da seçim; web denemesinde ve ilgili paket gelince sorulur:

1. Kart oyunu: Bir elde kaç ücretsiz geri al hakkı olsun? Neden: geri al sınırlı (15 Kasım); sayı
   uydurulmaz, kodda yalnız deneme varsayılanı var. Nasıl denenir: adres sonuna `?geriAlHak=` ve
   bir sayı. Adaylar: web denemesinde birkaç sayıyı deneyip seçerim (önerilen) · şimdi ben söylerim.
2. Kart oyunu: Kartpostallarda hangi Düzada yerleri olsun? **Cevaplandı** (15 Kasım soru turu 2.
   set): yedi yer, yazısız (8.2). Açık kalan: hangi sırayla açılacakları.
3. Kart oyunu: Kartpostal etkinliğinde kare sayısı, etkinlik süresi, renk ve zorluk eşleşmesi?
   Web denemesinde ayarlanabilir gelir (9. paket), Kemal seçer.
4. Kart oyunu: Aylık ödülde hangi ay hangi Düzada nesnesi ya da simgesi? **Değişti:** rozet yerine
   pul koleksiyonu (Kemal 15 Kasım akşam; 8.1). Kazanma, yer ve yazı cevaplandı; her pulun
   tasarımı ayrı çalışılır, konuları [Kemal].
5. Kart oyunu: Puan hesabı hangi aday olsun? **Cevaplandı** (16 Kasım): a · çarpanlı taban (8.3).
   Açık kalan: sayılar (deneme varsayılanı).
6. Kart oyunu: Klasik solitaire'de açılan kartlar destenin altına kaç kez dönsün? Neden: deste
   bitince ne olacağı belgede yoktu; şimdilik standart olan sınırsız. Adaylar: sınırsız
   (önerilen) · 3 kart çekmede üç kez, 1 kart çekmede bir kez · ayarlardan seçilsin.
7. Kart oyunu: Klasik solitaire'de ipucu hangi sırayla gelsin? Adaylar: temele giden, kapalı
   kartı açan, öbürleri; hamle yoksa desteden çek (önerilen, şu anki) · başka bir sıra.
8. Kart oyunu: El ne zaman kaybedilmiş sayılsın (seri biter)? Neden: belgede kaybetmenin tanımı
   yok. Adaylar: yalnız eli bırakınca (önerilen, şu anki) · yapılacak hamle kalmayınca da.
9. Kart oyunu: Seri her oyun ve zorlukta ayrı mı sürsün? Adaylar: ayrı, en iyi puan gibi
   (önerilen, şu anki) · tek seri, oyun değişse de sürer.
10. Kart oyunu: Eli bırakma sorusunun metni ne olsun? Şimdi "[YER TUTUCU: eli bırakma sorusu]";
   anlamı "eli bırakıyor musun, serin biter" (2).
11. Kart oyunu: "Nasıl oynanır" metni uygun mu? Neden: standart kuralların kısa özeti olarak
   ajans yazdı (7. paket). Adaylar: olduğu gibi kalsın (önerilen) · düzeltmelerimi yazarım.
12. Kart oyunu: Masadaki dördüncü düğme "Ana ekran" olsun mu (eli bırakmadan çıkar)? Adaylar:
   "Ana ekran" (önerilen, şu anki) · "Menü" adıyla küçük bir menü açılsın.
13. Kart oyunu: Günlük mücadele takviminde ne kadar geriye gidilebilsin? **Cevaplandı:** takvim en
   çok Ocak 2026'ya kadar (Kemal 15 Kasım).
14. Kart oyunu: Günlük elde masadaki "Yeni el" ne yapsın? **Cevaplandı:** aynı günün elini baştan
   dağıtır, şu anki davranış kalır (Kemal 15 Kasım).
15. Kart oyunu: Spider'da da "Bitir" düğmesi olsun mu? **Cevaplandı:** olmasın; önerilen hâl
   kalıcı (Kemal 15 Kasım).
