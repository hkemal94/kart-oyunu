# CLAUDE.md — Kart oyunu (çalışma adı)

Bu depoda çalışan her oturum önce bu dosyayı, sonra `docs/tasarim-belgesi.md`
ve `docs/yol-haritasi.md`'yi okur. Tasarım belgesi oyunun tek kaynağıdır.

Oyunun adı: Düzada Cards Club (Kemal, 15 Kasım 2026); depo adı kart-oyunu çalışma adı olarak kalır.

## Kim için

Kemal. Kodlama deneyimi yok. Açıklamalar Türkçe, sade, teknik terimsiz;
kodu değil ekranda ne değiştiğini anlat. Kod içindeki adlar ve yorumlar Türkçe.

## Kim yazar

Kems Ajans'ın oyun departmanı (Oyun Tasarımcısı, Oyun Geliştiricisi). Her değişiklik
**ayrı dalda** (`ajans/<kısa-konu>`) ve öneri PR'ı ile gelir; ana dala Kemal
birleştirir. Ana dala yazılmaz, zorla gönderilmez. PR açıklaması Türkçe: ekranda ne
değişti, telefonda nasıl denenir, Kemal'in yapacağı bir şey var mı. Denenmeyen iş
"denenmedi" diye yazılır; her PR'a telefon boyutunda ekran görüntüsü eklenir.

## Kesin kurallar

- Kurgu metni, ad, slogan, logo yazılmaz; oyun, masa, deste, paket adları Kemal'in.
  Gerekirse `[Kemal]` diye boş bırakılır; yer tutucu yazı `[YER TUTUCU: …]` diye işaretlenir.
- Uydurma sayı yok. Fiyat, reklam sıklığı, süre gibi değerler Kemal onaylayınca girer.
- Düzada bilgisi yalnız KKM'deki `docs/03-duzada-kunyesi.md`'den alınır.
  Yazım Kemsköy (ö), Düzada (ü).
- Başka oyunun görseli, adı, kartı kopyalanmaz; yalnız oyunların standart kuralları alınır.
- Renkler marka kitinden: lacivert `#0E1C4F`, krem `#F3EFE8`, kiremit `#F26B6F` (az). Yazı tipi Poppins.
- Ekrandaki her yazı `src/metinler/tr.json`'dan gelir, İngilizcesi `src/metinler/en.json`'da;
  koda gömülmez. Yeni yazı iki dosyaya birden eklenir (eksikse derleme hata verir).
- Ekran dikey. Ekranlar dolu ve kompakt: boş delik kalmaz, ekrana yayılmaz.
- Web sürümü yalnız deneme: reklam ve satın alma yok (Kemal, 15 Kasım).
- Her yeni ses, simge, yazı tipi, görsel `docs/lisanslar.md`'ye yazılır; kaynağı Kemal'e sorulmadan eklenmez.
- `npm run build` her iş sonunda hatasız geçer.
- Her PR `docs/yol-haritasi.md`'yi günceller.
- Kararı verilmemiş konu: sor, seçme. Açık sorular tasarım belgesinin 7. bölümünde.

## Teknik

Vite + React + TypeScript, 2B. `npm install`, sonra `npm run dev` (deneme), `npm run build`
(derleme). Ana dala birleşince oyun https://hkemal94.github.io/kart-oyunu/ adresinde açılır
(`.github/workflows/yayinla.yml`).

- `src/kart/`: kartların verisi ve kod ile çizilen kart. Kurallar ekrandan ayrı tutulur.
- `src/ekranlar/`: açılış, oyun seçimi, masa.
- `src/metinler/`: Türkçe ve İngilizce yazılar.
