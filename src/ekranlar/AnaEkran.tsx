import { m, sayi } from '../metinler';
import { KartYuzu } from '../kart/KartYuzu';
import { enIyiOku, kayitOku, puanAnahtari } from '../kart/puan';
import type { SonSecim } from '../oyun/sonSecim';
import type { YarimEl } from '../oyun/yarimEl';
import { GununKarti } from './Gunluk';

// Ana ekran (yol haritası 7; belge 2 ve 8.4; Kemal, 15 Kasım):
// üstte günlük mücadele (8. paket: bugünün tarihi ve "Oyna"; kazanıldıysa yıldız) ve kartpostal
// etkinliği ("yakında"; 9. paket), ortada oyunun adı (Düzada Cards Club) ve seçili oyunun en iyi puanı, altta "Oyuna devam et" (yarım
// el yoksa soluk) ve "Yeni oyun" (oyun seçimine gider; yarım el varken önce eli bırakma sorusu).

interface Ozellik {
  secim: SonSecim; // en iyi puanı gösterilen oyun: yarım el varsa onun, yoksa son seçilen
  yarimEl: YarimEl | null;
  devamEt: () => void;
  yeniOyun: () => void;
  gunlukOyna: () => void; // bugünün günlük eli (8. paket)
  takvim: () => void; // Mücadeleler sekmesi
}

export const oyunAdi = (oyun: 'spider' | 'klasik', zorluk: number) =>
  oyun === 'spider' ? m('oyun.spiderZorluk', zorluk) : m('oyun.klasikZorluk', zorluk);

export function AnaEkran({ secim, yarimEl, devamEt, yeniOyun, gunlukOyna, takvim }: Ozellik) {
  const oyun = yarimEl?.oyun ?? secim.oyun;
  const zorluk = yarimEl?.zorluk ?? (oyun === 'spider' ? secim.renk : secim.cekme);
  const enIyi = enIyiOku(kayitOku(localStorage), puanAnahtari(oyun, zorluk));

  return (
    <main className="sekme-ekrani ana-ekran">
      <section className="ana-kartlar">
        <GununKarti oyna={gunlukOyna} takvim={takvim} />
        <div className="ana-kart kapali" aria-disabled="true">
          <span className="ana-kart-ad">{m('ana.etkinlik')}</span>
          <small>{m('ana.yakinda')}</small>
        </div>
      </section>

      <section className="ana-orta">
        <div className="ana-yelpaze" aria-hidden="true">
          <KartYuzu kart={{ takim: 'maca', deger: 1, acik: true }} genislik={58} stil={{ transform: 'rotate(-8deg)' }} />
          <KartYuzu kart={{ takim: 'kupa', deger: 13, acik: true }} genislik={58} stil={{ transform: 'translateY(-6px)' }} />
          <KartYuzu kart={{ takim: 'karo', deger: 12, acik: true }} genislik={58} stil={{ transform: 'rotate(8deg)' }} />
        </div>
        <h1 className="oyun-adi">{m('oyun.ad')}</h1>
        <div className="ana-en-iyi">
          <small>{m('ana.enIyi')}</small>
          <strong>{enIyi === null ? m('ana.enIyiYok') : sayi(enIyi)}</strong>
          <span>{oyunAdi(oyun, zorluk)}</span>
        </div>
      </section>

      <section className="ana-dugmeler">
        <button className="dugme ana genis" onClick={devamEt} disabled={!yarimEl}>
          {m('ana.devam')}
          {!yarimEl && <small className="dugme-alt">{m('ana.devamYok')}</small>}
        </button>
        <button className="dugme koyu genis" onClick={yeniOyun}>
          {m('ana.yeniOyun')}
        </button>
      </section>
    </main>
  );
}
