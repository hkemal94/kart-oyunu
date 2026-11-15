import { m } from '../metinler';
import { KartYuzu } from '../kart/KartYuzu';
import type { RenkSayisi } from '../kart/kart';

// Oyun seçimi (belge 2; Kemal, 15 Kasım: Spider klasik solitaire'den önce).
// Spider açık; klasik solitaire "yakında". Ayarlar, istatistik, paketler sonraki paketlerde.
const RENKLER: RenkSayisi[] = [1, 2, 4];

interface Ozellik {
  renk: RenkSayisi;
  renkSec: (r: RenkSayisi) => void;
  spiderBasla: () => void;
}

export function OyunSecimi({ renk, renkSec, spiderBasla }: Ozellik) {
  return (
    <main className="secim">
      <header className="secim-ust">
        <span className="secim-oyun-adi">{m('oyun.ad')}</span>
        <h1>{m('secim.baslik')}</h1>
      </header>

      <section className="oyun-karti">
        <div className="oyun-karti-ust">
          <div>
            <h2>{m('secim.spider')}</h2>
            <p>{m('secim.spider.aciklama')}</p>
          </div>
          <div className="mini-kartlar">
            <KartYuzu kart={{ takim: 'maca', deger: 13, acik: true }} genislik={50} />
            <KartYuzu kart={{ takim: 'kupa', deger: 12, acik: true }} genislik={50} />
            <KartYuzu kart={{ takim: 'maca', deger: 11, acik: true }} genislik={50} />
          </div>
        </div>
        <div className="zorluk">
          <span>{m('secim.zorluk')}</span>
          <div className="secenekler">
            {RENKLER.map((r) => (
              <button key={r} className={r === renk ? 'secili' : ''} onClick={() => renkSec(r)}>
                {m('secim.renk', r)}
              </button>
            ))}
          </div>
        </div>
        <button className="dugme ana genis" onClick={spiderBasla}>
          {m('secim.yeniEl')}
        </button>
      </section>

      <section className="oyun-karti kapali">
        <div className="oyun-karti-ust">
          <div>
            <h2>
              {m('secim.klasik')} <span className="rozet">{m('secim.yakinda')}</span>
            </h2>
            <p>{m('secim.klasik.aciklama')}</p>
          </div>
          <div className="mini-kartlar">
            <KartYuzu kart={{ takim: 'kupa', deger: 1, acik: true }} genislik={50} />
            <KartYuzu kart={{ takim: 'sinek', deger: 2, acik: true }} genislik={50} />
            <KartYuzu kart={{ takim: 'karo', deger: 3, acik: true }} genislik={50} />
          </div>
        </div>
        <div className="zorluk">
          <span>{m('secim.zorluk')}</span>
          <div className="secenekler">
            <button disabled>{m('secim.cekme', 1)}</button>
            <button disabled>{m('secim.cekme', 3)}</button>
          </div>
        </div>
      </section>

      <nav className="secim-alt">
        {(['secim.ayarlar', 'secim.istatistik', 'secim.paketler'] as const).map((a) => (
          <button key={a} disabled>
            <span>{m(a)}</span>
            <small>{m('secim.yakinda')}</small>
          </button>
        ))}
      </nav>
    </main>
  );
}
