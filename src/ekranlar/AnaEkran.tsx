import { m, sayi } from '../metinler';
import { KartYuzu } from '../kart/KartYuzu';
import { enIyiOku, kayitOku, puanAdayi, puanAnahtari } from '../kart/puan';
import type { SonSecim } from '../oyun/sonSecim';
import type { YarimEl } from '../oyun/yarimEl';

// Ana ekran (yol haritası 7; belge 2 ve 8.4; Kemal, 15 Kasım):
// üstte günlük mücadele ve kartpostal etkinliği kartları (bu pakette ikisi de "yakında"; 8. ve 9.
// paket), ortada oyunun adı [Kemal] ve seçili oyunun en iyi puanı, altta "Oyuna devam et" (yarım
// el yoksa soluk) ve "Yeni oyun" (oyun seçimine gider; yarım el varken önce eli bırakma sorusu).

interface Ozellik {
  secim: SonSecim; // en iyi puanı gösterilen oyun: yarım el varsa onun, yoksa son seçilen
  yarimEl: YarimEl | null;
  devamEt: () => void;
  yeniOyun: () => void;
}

export const oyunAdi = (oyun: 'spider' | 'klasik', zorluk: number) =>
  oyun === 'spider' ? m('oyun.spiderZorluk', zorluk) : m('oyun.klasikZorluk', zorluk);

export function AnaEkran({ secim, yarimEl, devamEt, yeniOyun }: Ozellik) {
  const oyun = yarimEl?.oyun ?? secim.oyun;
  const zorluk = yarimEl?.zorluk ?? (oyun === 'spider' ? secim.renk : secim.cekme);
  const enIyi = enIyiOku(kayitOku(localStorage, puanAdayi(location.search)), puanAnahtari(oyun, zorluk));

  return (
    <main className="sekme-ekrani ana-ekran">
      <section className="ana-kartlar">
        {(['ana.gunluk', 'ana.etkinlik'] as const).map((a) => (
          <div key={a} className="ana-kart kapali" aria-disabled="true">
            <span className="ana-kart-ad">{m(a)}</span>
            <small>{m('ana.yakinda')}</small>
          </div>
        ))}
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
