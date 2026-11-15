# Kart oyunu · Tasarım belgesi

> **TASLAK · Kemal onaylamadı.** Bu belge oyunun tek kaynağıdır (Kemal, 15 Kasım 2026); ama
> belgenin tamamı henüz Kemal'in onayından geçmedi. Karar değişirse önce bu belge, sonra kod
> değişir.

**Proje:** Kart oyunu (Kems Company). Oyunun adı: [ad: Kemal]
**Depo:** `hkemal94/kart-oyunu` ("kart-oyunu" geçici çalışma adı; Kemal, 15 Kasım 2026)
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
- **Ekran yönü:** **dikey** (Kemal, 14-11-2026). Öbür oyunlardan farklı olarak telefon dik tutulur.
- **Dil:** ilk sürüm **Türkçe ve İngilizce** (Kemal, 14 Kasım). Oyun açılırken telefonun diline
  göre başlar, ayarlardan değiştirilir (öneri).
- **Yardımcılar:** geri al, ipucu, kendiliğinden bitirme, kaldığı yerden devam, süre ve hamle
  sayacı (ayarlardan kapatılabilir), basit istatistik; hepsi ilk sürümde (Kemal, 14 Kasım; 1.3).
  **İpucu telefon uygulamasında reklam izleyerek alınır** (Kemal, 15 Kasım: "örnekteki gibi");
  web deneme sürümünde reklamsız. Geri al ücretsiz mi, sınırsız mı açık (7. bölüm).
- **Örnek oyun:** Kemal'in gösterdiği örnek Spider oyunu (15 Kasım). Yalnız oynanış şekli alınır
  (günlük mücadele, süreli resim etkinliği, puan, sekmeli ana ekran, para modeli); adı, görseli,
  kupa çizimleri ve metinleri belgeye ve depoya girmez (8. bölüm).
- **Desteler:** oyunda **birden çok deste** seçeneği olur; **biri Kems'in satacağı fiziksel deste,
  Küçükçetmi Sürek Kulübü destesi** (52 kart + 2 joker; merch destesiyle aynı tasarım) (Kemal,
  14-11-2026). **İlk sürümde iki deste ücretsiz: Sürek Kulübü destesi (varsayılan) ve sade deste**
  (Kemal, 14 Kasım); **yanında bir kilitli deste paketi** (Kemal, 15 Kasım); içeriğine sonra karar
  verilecek (Kemal, 15 Kasım gece). Ayrıntı 4. bölüm.
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
- **Depo:** `hkemal94/kart-oyunu`; "kart-oyunu" geçici çalışma adıdır, oyunun adı değildir
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
ipucu telefon uygulamasında reklam izleyerek alınır hâle geldi. Öbür dördü (kendiliğinden bitirme,
kaldığı yerden devam, sayaç, istatistik) ücretsiz kalır; geri al açık soru.
- **Geri al.** Ücretsiz mi, sınırsız mı: [Kemal] (öneri: ücretsiz ve sınırsız; oyunun cezasız
  havasına uyar). Kemal'in cevabı yok (7. bölüm).
- **İpucu:** bir sonraki olası hamleyi gösterir. Telefon uygulamasında **reklam izleyerek alınır**
  (Kemal, 15 Kasım; 5. bölüm). Web deneme sürümünde reklamsız çalışır.
- **Kendiliğinden bitirme:** bütün kartlar açılınca oyun kalanları kendisi yerleştirir.
- **Kaldığı yerden devam:** uygulama kapanınca oyun kaybolmaz; ana ekranda "devam et" çıkar.
- **Süre ve hamle sayacı:** masanın üst satırında; ayarlardan kapatılabilir.
- **Basit istatistik:** oynanan, kazanılan, en iyi süre; oyun sonu ekranında ve menüde.

Yardımcı değil, kontrol (öneri; Kemal'in listesinde yoktu): dokunarak taşıma. Karta dokununca
uygun yere kendisi gider; sürüklemek de olur. Dikey ekranda tek başparmakla oynanabilsin diye
dokunarak taşıma ana yol olur.

Oyuncu ne yapar, neden eğlenceli: kısa, kendi hızında bir düzen kurma işi; her el yeni bir
bulmaca, kaybetmenin cezası yok, yeni el bir dokunuş uzakta. Geri al ve ipucunun serbest olması
takılınca bırakmak yerine denemeyi sürdürtür. Kulüp evinin masası ve çiftliğin sesi bunu "bir
yerde oturup oyun açmak" hissine çevirir.

## 2. Ekranlar

Dikey, kısa ve derli toplu; boş delik kalmaz, ekrana yayılmaz (Kemal'in DK Lite kuralı, burada da
öneri). Her ekran Türkçe ve İngilizce; İngilizcede yazı uzayabileceği için düğmeler buna göre
bırakılır (öneri).
- **Açılış:** Kems Company ve Sürek Kulübü izi (minik, boğmayan), sonra masa. Uzun açılış videosu yok.
- **Alt sekmeler (Kemal, 15 Kasım):** altta üç sekme: ana ekran, mücadeleler, ben. Masada sekmeler
  görünmez (öneri; oyun alanı dar).
- **Ana ekran (Kemal, 15 Kasım):** üstte günlük mücadele ve etkinlik kartları; ortada oyunun adı
  [ad: Kemal] ve en iyi puan (en yüksek seri puanı; 8.3); altta "devam et" (yarım el varsa) ve
  "yeni oyun". El yarımken "yeni oyun"a dokununca önce onay sorusu çıkar (aşağıda, "Eli bırakma").
- **Oyun seçimi:** "yeni oyun"a dokununca açılır (öneri). Alt alta iki kart: Spider (üstte),
  klasik solitaire (Kemal, 15 Kasım). Her birinin altında zorluk seçimi (1/3 kart; 1/2/4 renk).
- **Mücadeleler sekmesi:** günlük mücadelenin takvimi ve kartpostal etkinliği (8.1 ve 8.2).
- **Ben sekmesi (Kemal, 15 Kasım):** ödüller (aylık ödüller ve kartpostal koleksiyonu), ayarlar,
  nasıl oynanır, yardım, oyun hakkında, gizlilik. İstatistik ve paketlerin yeri: öneri, bu sekme;
  karar Kemal'in.
- **Masa:** üstte ince bilgi satırı (süre, hamle; ayarda açıksa puan; küçük ve sessiz, kapatılabilir), ortada oyun
  alanı, arkada seçili masa (kulüp evi ya da Sade Meyhane), altta başparmak hizasında ince bir
  şerit: geri al, ipucu, yeni el, menü. Deneme elinde bilgi satırında küçük, sessiz bir "deneme"
  izi (öneri). Bilgi satırında o anki aşama da görünebilir (öneri; "Aşama 1, 2, 3…", 8.3).
- **Eli bırakma (Kemal, 15 Kasım):** el yarımken "yeni oyun"a dokununca kısa bir onay sorusu
  çıkar; anlamı "eli bırakıyor musun, serin biter". Metni [YER TUTUCU: eli bırakma
  sorusu], Kemal onaylar. "Evet" denirse yeni el başlar; bırakılan el kaybedilmiş sayılır ve seri
  biter (8.3). "Hayır" denirse oyuncu ele döner. Sessiz ve kısa; uyarı dili, ünlem yok (ton).
  Masadaki "yeni el" düğmesinin de aynı soruyu sorması öneridir.
- **Oyun sonu:** kartlar masada kısa bir hareketle toplanır; süre, hamle, puan ve en iyi puan,
  istatistik; "yeni el" ve "oyun seçimi". Kazanınca puan bir sonraki ele taşınır ve yeni aşama
  gösterilir (Kemal, 15 Kasım; 8.3); "yeni el" serinin bir sonraki elidir. Kazanmayınca seri biter,
  puan sıfırdan başlar (Kemal, 15 Kasım); "yeniden dene" ve "yeni el"; başka ceza yok.
  Telefon uygulamasında el bitince reklam burada girer (Kemal, 15 Kasım; sıklığı [Kemal]; 5.
  bölüm). Oyun ortasında hiç yok; web deneme sürümünde hiç yok. Deneme elinin
  sonunda masa ya da deste kendi seçilene döner; yanında sessiz bir "paketi aç" bağlantısı olabilir
  (öneri; baskı dili yok).
- **Paketler:** iki sekme, desteler ve masalar. İlk sürümde her sekmede bir kilitli paket var
  (Kemal, 15 Kasım): masalarda Sade Meyhane (Kemal, 15 Kasım gece), destelerde içeriği sonra
  belli olacak deste. Her paket büyük önizlemeyle; sahip olunan "kullan", olmayan "aç" (fiyat: veri
  yok) ve yanında sessiz bir "reklam izle, bir el dene" (Kemal, 14 ve 15 Kasım; 5. bölüm).
  Reklamsız paket burada. Web deneme sürümünde "aç" ve "reklam izle" düğmeleri gerçek değildir
  (5. bölüm). Sürek Kulübü destesinin kartında fiziksel desteye küçük, sessiz bir bağlantı olabilir
  (öneri; satış yeri ve metni Kemal'in).
- **Ayarlar (öneri):** ses ve mahalle sesi ayrı ayrı, dil (Türkçe / İngilizce), sol el düzeni,
  sayaçları gizle, deste seçimi. **Titreşim** ve **"her hamlede puanı göster"** (Kemal, 15 Kasım).
  Ayarlar Ben sekmesindedir.

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
(Kemal, 14 Kasım) + bir kilitli deste paketi (Kemal, 15 Kasım; içeriği sonra, Kemal 15 Kasım gece;
4.2'de 3. madde).

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
3. **İlk kilitli deste paketi** (ilk sürümde; Kemal, 15 Kasım): ödüllü reklamla bir el denenir,
   paket olarak açılır (telefon uygulamasında; fiyat: veri yok). **İçeriğine sonra karar verilecek**
   (Kemal, 15 Kasım gece: sonra); açık soru olarak 7. bölümde. Ad koyulmadı: [ad: Kemal]. Sürek
   Kulübü destesi gibi okunurluk kuralına uyar. Karar gelene kadar web deneme sürümünde paketler
   ekranının deste sekmesinde yer tutucu durur (öneri). Önceki turdaki adaylar karar sırasında
   yeniden bakılmak üzere kayıtta: kilitli masanın mahallesine (İskele, Sade Meyhane) bağlı bir
   deste · Sürek Kulübü destesinin ikinci bir arka yüzü ve renk takımı · Sürek Kulübü destesinin
   çizim stili belli olunca karar.
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
  14 Kasım), kulüp evi masası, ipucu dışındaki yardımcılar (geri al açık soru; 1.3), günlük
  mücadele ve kartpostal etkinliği (öneri). Oyunun kendisi kilitlenmez (öneri).
- **Paketler:** yeni deste (arka yüz ve figür tasarımları) ve yeni masa (mekân ve sesi). Fiyat: veri
  yok. Paket içerikleri Kemal'in. **İlk sürümde bir masa ve bir deste paketi kilitli gelir**
  (Kemal, 15 Kasım): masa Sade Meyhane (Kemal, 15 Kasım gece; 3.2), destenin içeriği sonra (Kemal,
  15 Kasım gece; 4.2).
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
    - Deneme süresi: **bir el** (Kemal, 15 Kasım). Deneme o elin sonunda (kazanınca ya da "yeni el"e
      geçince) biter, masa ya da deste oyuncunun kendi seçtiğine döner.
    - Yarım kalan el (öneri): uygulama kapanıp "devam et" ile dönülürse deneme o el bitene kadar
      sürer; "yeniden dene" aynı eli baştan açtığı için deneme de sürer. Yeni bir el için yeniden
      izlemek gerekir.
    - İpucu 14 Kasım'da ücretsiz olduğu için ödül listesinden düşmüştü; 15 Kasım'da yeniden
      ödüllü reklamın karşılığı oldu (1.3). Bir izlemede kaç ipucu: [Kemal].
    - Yeri: deneme için paketler ekranında, kilitli paketin yanında (öneri); ipucu için masadaki
      ipucu düğmesinde, oyuncu dokununca (öneri). Kendiliğinden çıkmaz.
    - İlk sürümde bir kilitli masa ve bir kilitli deste olduğu için ödüllü reklamın ilk günden
      karşılığı var (Kemal, 15 Kasım).
  - **Reklamsız satın alma:** bir kez satın alınınca reklam kalkar (Kemal, 14 ve 15 Kasım; fiyat
    [Kemal], veri yok). İpucu o zaman reklamsız mı gelir, deneme reklamı durur mu: [Kemal]
    (öneri: ipucu reklamsız gelir; deneme isteğe bağlı olduğu için durabilir).
- **Web sürümü: yalnız deneme** (Kemal, 15 Kasım gece). Kemal ve yakın çevresi bağlantıyla dener;
  **web'de reklam ve satın alma yok**. Gerçek reklam ve satın alma yalnız telefon uygulamasıyla
  gelir (6. bölüm). **İpucu web'de reklamsız çalışır** (Kemal, 15 Kasım). Web'de paketler ekranı
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
   mücadele, kartpostal etkinliği (8. bölüm), Türkçe ve İngilizce metin dosyaları, dikey düzen. Kilitli masa
   Sade Meyhane, görseli hazır olunca girer; kilitli destenin yeri yer tutucuyla kurulur (içeriği
   sonra). Paketler ekranı ve ödüllü reklam düğmesi yalnız yer tutucu; **web'de reklam ve satın
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

Açık kalanlar:
- **İlk kilitli deste:** içeriği ne. Kemal: sonra (15 Kasım gece). Adaylar 4.2'de kayıtta.
- **Sade Meyhane masası:** ne görüneceği ve web denemesinde açık mı duracağı; görseli gelince
  (Kemal, 15 Kasım). Künyede yalnız taş fabrika binası, koya bakan yamaç ve otelin yanı var.
- **Geri al:** ücretsiz mi, sınırsız mı: [Kemal] (öneri: ücretsiz ve sınırsız; Kemal'e soru 1).
  Kemal'in cevabı yok.
- **Kartpostal yerleri:** hangi Düzada yerleri, hangi sırayla: [Kemal] (Kemal'e soru 3).
- **Kare sayısı, etkinlik süresi, renk ve zorluk eşleşmesi:** [Kemal] (Kemal'e soru 4).
- **Aylık ödülün görseli:** [Kemal]; örnekteki kupa kopyalanmaz (Kemal'e soru 5).
- **Puan formülü ve aşama artışı:** yapı belli (8.3); aşama başına artış, süre ve hamlenin payı ve
  formül [Kemal]; öneri: ajans yapım sırasında aday getirir (Kemal'e soru 6).
- **En iyi puan:** oyun ve zorluk başına mı, tek mi: [Kemal] (öneri: oyun ve zorluk başına; Kemal'e
  soru 7).
- **Eli bırakma sorusunun metni:** [YER TUTUCU], Kemal onaylar (2. bölüm).
- **El sonu reklamı:** birkaç elde bir (Kemal, 15 Kasım); kaç elde bir ve ilk kaç oyunda hiç
  yok: [Kemal]. Reklamsız satın alınınca ipucu reklamsız mı: [Kemal].
- **Günlük mücadele ve seri:** günlük mücadele eli 8.3'teki seriye sayılır mı, ayrı mı: [Kemal]
  (8.1; Kemal'e soru 8). Aynı gün aynı zorlukta herkese aynı dağıtım: öneri, Kemal'in onayı yok (8.1).
- **Kart köşesindeki harfler:** dile göre değişsin mi (öneri: değişir). İskelette iki dilde de
  A, J, Q, K; harfler metin dosyasında, karar gelince yalnız orası değişir.
- **Kartın kırmızısı:** kiremit (#F26B6F) krem kartın küçük köşesinde zor okunuyor; iskelette
  kiremidin koyusu (#B8383D) kullanıldı (öneri; Kemal'e soru 2).
- **Reklam sayıları ve fiyat:** reklam sıklığı, bir izlemede kaç ipucu, fiyatlar: [Kemal], deneme sonrası.
- **Oyunun adı:** [ad: Kemal]. İstenirse ajans yalnız aday listesi verir. Oyun logosu ertelendi.
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
- **Aylık ödül ayın bütün günleri yıldızlanınca gelir** (Kemal, 15 Kasım); Ben sekmesindeki
  "ödüller"de durur. Ödülün görseli [Kemal]; örnekteki kupa çizimi kopyalanmaz.
- Günlük mücadele eli 8.3'teki seriye sayılır mı, ayrı mı: [Kemal] (Kemal'e soru 8).
- Takvim Mücadeleler sekmesinde; ana ekranın üstünde günün kartı.

### 8.2 Kartpostal etkinliği

- Süreli etkinlik (Kemal). Bir resim karelere bölünür; kazanılan her el bir kareyi açar.
- Kare rengi o karenin zorluğunu gösterir (Kemal).
- Biten resim koleksiyona girer (Ben sekmesi, ödüller). Önceki resim açılmadan sonraki kilitli
  kalır (Kemal).
- Resimler **Düzada kartpostalları** (Kems'in önerisi; Kemal "Kartpostal etkinliği"ni seçti).
  Hangi yerlerin olacağı [Kemal]. Yalnız künyede olan yerler çizilir; her görselden önce yer
  künyede ve vikide okunur (ortak kurallar, "Çizmeden önce yerine bak"). Kartpostalda yer adı ya
  da yazı olup olmayacağı [Kemal].
- Kare sayısı: [Kemal]. Etkinlik süresi: [Kemal]. Renk ve zorluk eşleşmesi: [Kemal]. Uydurma sayı
  yok.
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
- Aşama başına artış, süre ve hamlenin payı ve formül: [Kemal] (uydurma sayı yok). Öneri: ajans
  yapım sırasında aday getirir (yaygın solitaire puanlama yollarından biri), Kemal seçer.
- En iyi puan oyun ve zorluk başına mı, tek mi: [Kemal] (öneri: oyun ve zorluk başına; Kemal'e
  soru 7).
- Kaldığı yerden devam (1.3): uygulama kapanınca seri bitmez; yarım el "devam et" ile sürer (öneri;
  eli bırakmak yalnız "yeni oyun" ya da "yeni el" ile olur).
- Ayarlarda "her hamlede puanı göster" (Kemal): açıksa masanın bilgi satırında puan görünür.

### 8.4 Ana ekran ve Ben sekmesi

Ayrıntı 2. bölümde (alt sekmeler, ana ekran, Ben sekmesi, ayarlarda titreşim ve "her hamlede puanı
göster"). "Nasıl oynanır", "yardım", "oyun hakkında" ve "gizlilik" metinleri Kemal'in; yazılana
kadar `[YER TUTUCU: …]` durur. Gizlilik metni telefon adımında gerekir (6. bölüm).

## Kemal'e sorular

1. Kart oyunu: Geri al ücretsiz ve sınırsız mı olsun? Neden: ipucu reklama bağlandı, geri al
   açıkta kaldı; oyunda ceza yok. Adaylar: ücretsiz ve sınırsız (önerilen) · ücretsiz ama sınırlı,
   fazlası reklamla · sonra karar veririm, web denemesinden sonra.
2. Kart oyunu: Kartlardaki kırmızı hangi ton olsun? Neden: marka kitinin kiremidi krem kartta
   küçük köşede zor okunuyor. Adaylar: kiremidin koyusu (önerilen; iskelette bu) · kiremidin
   kendisi · klasik iskambil kırmızısı · Sürek Kulübü destesi gelince karar veririm.
3. Kart oyunu: Kartpostallarda hangi Düzada yerleri olsun? Neden: resimleri çizmeden önce yerin
   künyede olması gerek. Adaylar (künyede olan yerler): masa adaylarıyla aynı yerler (kulüp evi,
   Sade Meyhane, Merkez meydanı, Liman, Deniz Feneri; önerilen) · her mahalleden bir yer · ben
   seçerim.
4. Kart oyunu: Kartpostal etkinliğinde kare sayısı, etkinlik süresi ve kare renklerinin zorluk
   karşılığı ne olsun? Neden: sayı uydurulmaz. Adaylar: web denemesinde yer tutucuyla deneyip sonra
   karar veririm (önerilen) · şimdi ben söylerim.
5. Kart oyunu: Aylık ödülün görseli ne olsun? Neden: örnekteki kupa kopyalanmaz, bize ait bir şey
   gerek. Adaylar: her ay bir Düzada nesnesi ya da simgesi, Kemal seçer (önerilen) · Sürek Kulübü
   izli tek bir rozet, ay ay rengi değişir · ben söylerim.
6. Kart oyunu: Puan nasıl hesaplansın? Neden: yapı belli (kazandıkça birikir, aşama artar; 15
   Kasım), ama aşama başına artış ve süre ve hamlenin payı yok. Adaylar: ajans yapım sırasında
   aday getirir, ben seçerim (önerilen) · şimdi ben söylerim.
7. Kart oyunu: En iyi puan oyun ve zorluk başına mı olsun, tek mi? Neden: 1 renk Spider ile 4 renk
   Spider'ın serisi aynı ölçüde değil. Adaylar: oyun ve zorluk başına (önerilen) · tek en iyi puan ·
   web denemesinden sonra karar veririm.
8. Kart oyunu: Günlük mücadele eli puan serisine sayılsın mı? Neden: günlük el kazanılınca seri
   aşama alır mı, kaybedilince seri biter mi belli değil. Adaylar: ayrı tutulsun, seriye
   dokunmasın (önerilen) · seriye sayılsın · sonra karar veririm.
