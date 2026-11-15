# kart-oyunu

Kems Company'nin tek kişilik kart oyunu (Spider, sonra klasik solitaire). Oyunun adı:
**Düzada Cards Club** (Kemal, 15 Kasım 2026); depo adı "kart-oyunu" çalışma adı olarak kalır.

- Kurallar ve çalışma şekli: `CLAUDE.md`
- Oyunun tek kaynağı: `docs/tasarim-belgesi.md` (taslak)
- Sıra ve açık işler: `docs/yol-haritasi.md`
- Deneme bağlantısı (ana dala birleşince): https://hkemal94.github.io/kart-oyunu/

Çalıştırmak için: `npm install`, sonra `npm run dev`. Derleme: `npm run build`. Kural testleri:
`npm test`. Geliştirmede hazır deneme elleri: adres sonuna `?deneme=dizi` (oyun ortası) ya da
`?deneme=kazan` (bir hamlede oyun sonu), `?deneme=takvim` (günlük mücadele takvimine hazır yıldızlar),
`?deneme=gunluk-kazan` (bugünün günlük eli, bir hamlede oyun sonu), `?deneme=cift` (çift dokunuş ve koyu
kartlar); yayındaki oyunda çalışmaz.
Geri al hakkı sayısını denemek için (yayındaki oyunda da çalışır): `?geriAlHak=5`.
