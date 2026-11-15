import { useState } from 'react';
import { m, sayi } from '../metinler';
import { enIyiOku, kayitOku, puanAdayi, puanAnahtari } from '../kart/puan';
import { KartYuzu } from '../kart/KartYuzu';
import type { RenkSayisi } from '../kart/kart';
import type { CekmeSayisi } from '../kart/klondike';

// Oyun seçimi (belge 2; Kemal, 15 Kasım: Spider klasik solitaire'den önce).
// Alt alta iki oyun: Spider (1, 2, 4 renk) ve klasik solitaire (1 ya da 3 kart çekme; 3. paket).
// Her kartın altında seçili zorluğun en iyi puanı (6. paket; belge 8.3, oyun ve zorluk başına ayrı).
// Altta Ayarlar (5. paket); istatistik ve paketler sonraki paketlerde.
const RENKLER: RenkSayisi[] = [1, 2, 4];
const CEKMELER: CekmeSayisi[] = [1, 3];

interface Ozellik {
  renk: RenkSayisi;
  renkSec: (r: RenkSayisi) => void;
  spiderBasla: () => void;
  cekme: CekmeSayisi;
  cekmeSec: (c: CekmeSayisi) => void;
  klasikBasla: () => void;
  ayarAc: () => void;
}

export function OyunSecimi({ renk, renkSec, spiderBasla, cekme, cekmeSec, klasikBasla, ayarAc }: Ozellik) {
  const [kayit] = useState(() => kayitOku(localStorage, puanAdayi(location.search)));
  const enIyi = (anahtar: string) => {
    const p = enIyiOku(kayit, anahtar);
    return p === null ? m('secim.enIyiYok') : m('secim.enIyi', sayi(p));
  };
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
        <p className="en-iyi">{enIyi(puanAnahtari('spider', renk))}</p>
      </section>

      <section className="oyun-karti">
        <div className="oyun-karti-ust">
          <div>
            <h2>
              {m('secim.klasik')}
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
            {CEKMELER.map((c) => (
              <button key={c} className={c === cekme ? 'secili' : ''} onClick={() => cekmeSec(c)}>
                {m('secim.cekme', c)}
              </button>
            ))}
          </div>
        </div>
        <button className="dugme ana genis" onClick={klasikBasla}>
          {m('secim.yeniEl')}
        </button>
        <p className="en-iyi">{enIyi(puanAnahtari('klasik', cekme))}</p>
      </section>

      <nav className="secim-alt">
        <button className="acik" onClick={ayarAc}>
          <span>{m('secim.ayarlar')}</span>
        </button>
        {(['secim.istatistik', 'secim.paketler'] as const).map((a) => (
          <button key={a} disabled>
            <span>{m(a)}</span>
            <small>{m('secim.yakinda')}</small>
          </button>
        ))}
      </nav>
    </main>
  );
}
