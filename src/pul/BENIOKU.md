# src/pul: pul koleksiyonu

Bu klasör, Kems'in bütün oyunlarında ortak olan pul koleksiyonunun (Kemal, 15 Kasım 2026)
kart oyunundaki uygulamasıdır. Ortak standart (tasarım dili, 3+1 seri, koleksiyon sayfası):
Kems Ajans deposunda `docs/pul-koleksiyonu.md`.

- `seri.ts`: 3+1 hesabı. Girdi: kazanılan aylar (`"YYYY-AA"` listesi) ve bugün. Saf; ekrana dokunmaz.
- `Pul.tsx`: pul çerçevesi (tırtıklı kenar, krem zemin, lacivert ince çizgi) ve büyük pul (çift çerçeve).
- `KoleksiyonSayfasi.tsx`: koleksiyon sayfası ve onu açan kart. Yazıları oyun verir (`yazilar`).
- `pullar.ts`: görsel kaydı. Anahtar `"YYYY-AA"` (aylık pul) ya da `"YYYY-Q1"`..`"YYYY-Q4"` (büyük pul);
  görseli olmayan pul yer tutucu çerçeveyle çizilir.
- Renkler `src/stil.css`'te, `.pul` ile başlayan kurallarda.

Bu klasör oyunun başka dosyalarına bağlı değildir. Başka bir oyuna kopyalanırken yalnız
"kazanılan aylar" girdisi değişir (kart oyununda: ayın bütün günleri yıldızlanan aylar,
`src/oyun/gunluk.ts` → `tamamlananAylar`); yazılar o oyunun metin dosyasından verilir,
`.pul` stilleri de taşınır.
