import { m, type MetinAnahtari } from '../metinler';
import { sureYazisi } from './masaOrtak';
import { istatistikOku, istatistikYukle } from '../oyun/istatistik';
import { puanAnahtari } from '../kart/puan';
import { oyunAdi } from './AnaEkran';
import { PulKoleksiyonu, PulKoleksiyonuKarti } from './Gunluk';

// Ben sekmesi (yol haritası 7; belge 2 ve 8.4; Kemal, 15 Kasım):
// ödüller (pul koleksiyonu, 15 Kasım akşam; dokununca ayrı sayfa; kartpostal koleksiyonu şimdilik boş yer tutucu), istatistik, ayarlar
// (mevcut ayarlar ekranı üstüne açılır), nasıl oynanır, yardım, oyun hakkında, gizlilik (son üçü
// yer tutucu). Satıra dokununca alt sayfa açılır; "Geri" listeye döner.

export type BenSayfasi = 'pullar' | 'istatistik' | 'nasil' | 'yardim' | 'hakkinda' | 'gizlilik';

interface Ozellik {
  sayfa: BenSayfasi | null;
  sayfaAc: (s: BenSayfasi | null) => void;
  ayarAc: () => void;
}

const Ok = () => (
  <svg className="simge" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M6 3.5 10.5 8 6 12.5" />
  </svg>
);

export function Ben({ sayfa, sayfaAc, ayarAc }: Ozellik) {
  if (sayfa) return <AltSayfa sayfa={sayfa} geri={() => sayfaAc(null)} />;

  const satir = (ad: MetinAnahtari, git: () => void) => (
    <button className="ben-satir" onClick={git}>
      <span>{m(ad)}</span>
      <Ok />
    </button>
  );
  return (
    <main className="sekme-ekrani ben">
      <h1 className="sekme-baslik">{m('ben.baslik')}</h1>

      <section className="ben-bolum">
        <h2>{m('ben.oduller')}</h2>
        <div className="odul-kartlari">
          {/* Pul koleksiyonu: bütün günleri yıldızlanan her ay bir pul, çeyreğin üçü bir büyük pul */}
          <PulKoleksiyonuKarti ac={() => sayfaAc('pullar')} />
          <div className="odul-karti">
            <span>{m('ben.koleksiyon')}</span>
            <small>{m('ben.bos')}</small>
          </div>
        </div>
      </section>

      <section className="ben-bolum liste">
        {satir('ben.istatistik', () => sayfaAc('istatistik'))}
        {satir('ben.ayarlar', ayarAc)}
        {satir('ben.nasil', () => sayfaAc('nasil'))}
      </section>

      <section className="ben-bolum liste">
        {satir('ben.yardim', () => sayfaAc('yardim'))}
        {satir('ben.hakkinda', () => sayfaAc('hakkinda'))}
        {satir('ben.gizlilik', () => sayfaAc('gizlilik'))}
      </section>
    </main>
  );
}

const BASLIK: Record<BenSayfasi, MetinAnahtari> = {
  pullar: 'ben.pullar',
  istatistik: 'ben.istatistik',
  nasil: 'ben.nasil',
  yardim: 'ben.yardim',
  hakkinda: 'ben.hakkinda',
  gizlilik: 'ben.gizlilik',
};

function AltSayfa({ sayfa, geri }: { sayfa: BenSayfasi; geri: () => void }) {
  return (
    <main className="sekme-ekrani ben alt-sayfa">
      <header className="alt-sayfa-ust">
        <button className="geri-dugmesi" onClick={geri}>
          <svg className="simge" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3.5 5.5 8 10 12.5" />
          </svg>
          {m('ben.geri')}
        </button>
        <h1 className="sekme-baslik">{m(BASLIK[sayfa])}</h1>
      </header>
      {sayfa === 'pullar' && <PulKoleksiyonu />}
      {sayfa === 'istatistik' && <Istatistik />}
      {sayfa === 'nasil' && <NasilOynanir />}
      {sayfa === 'yardim' && <p className="yer-tutucu-yazi">{m('ben.yardim.yerTutucu')}</p>}
      {sayfa === 'hakkinda' && <p className="yer-tutucu-yazi">{m('ben.hakkinda.yerTutucu')}</p>}
      {sayfa === 'gizlilik' && <p className="yer-tutucu-yazi">{m('ben.gizlilik.yerTutucu')}</p>}
    </main>
  );
}

// İstatistik: oyun ve zorluk başına oynanan, kazanılan, en iyi süre (src/oyun/istatistik.ts)
const SATIRLAR: { oyun: 'spider' | 'klasik'; zorluk: number }[] = [
  { oyun: 'spider', zorluk: 1 },
  { oyun: 'spider', zorluk: 2 },
  { oyun: 'spider', zorluk: 4 },
  { oyun: 'klasik', zorluk: 1 },
  { oyun: 'klasik', zorluk: 3 },
];

function Istatistik() {
  const ist = istatistikYukle(localStorage);
  return (
    <>
      <table className="istatistik">
        <thead>
          <tr>
            <th />
            <th>{m('istatistik.oynanan')}</th>
            <th>{m('istatistik.kazanilan')}</th>
            <th>{m('istatistik.enIyiSure')}</th>
          </tr>
        </thead>
        <tbody>
          {SATIRLAR.map(({ oyun, zorluk }) => {
            const o = istatistikOku(ist, puanAnahtari(oyun, zorluk));
            return (
              <tr key={`${oyun}-${zorluk}`}>
                <th scope="row">{oyunAdi(oyun, zorluk)}</th>
                <td>{o.oynanan}</td>
                <td>{o.kazanilan}</td>
                <td>{o.enIyiSure === null ? m('istatistik.yok') : sureYazisi(o.enIyiSure)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="ben-not">{m('istatistik.not')}</p>
    </>
  );
}

// Nasıl oynanır: iki oyunun standart kurallarının kısa özeti (belge 1.1, 1.2, 1.3). Taslak; Kemal onaylayacak.
const KURALLAR: { baslik: MetinAnahtari; maddeler: MetinAnahtari[] }[] = [
  { baslik: 'nasil.spider.baslik', maddeler: ['nasil.spider.1', 'nasil.spider.2', 'nasil.spider.3', 'nasil.spider.4', 'nasil.spider.5'] },
  { baslik: 'nasil.klasik.baslik', maddeler: ['nasil.klasik.1', 'nasil.klasik.2', 'nasil.klasik.3', 'nasil.klasik.4', 'nasil.klasik.5'] },
  { baslik: 'nasil.ortak.baslik', maddeler: ['nasil.ortak.1', 'nasil.ortak.2', 'nasil.ortak.3'] },
];

function NasilOynanir() {
  return (
    <div className="kurallar">
      {KURALLAR.map((k) => (
        <section key={k.baslik} className="ben-bolum kural">
          <h2>{m(k.baslik)}</h2>
          <ul>
            {k.maddeler.map((a) => (
              <li key={a}>{m(a)}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
