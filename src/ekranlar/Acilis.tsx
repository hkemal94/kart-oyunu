import { m } from '../metinler';
import { KartYuzu } from '../kart/KartYuzu';
import type { Kart } from '../kart/kart';

// Açılış (belge 2): kısa; logo yok, yazılar yer tutucu. Dokununca oyun seçimi.
const YELPAZE: Pick<Kart, 'takim' | 'deger' | 'acik'>[] = [
  { takim: 'maca', deger: 1, acik: true },
  { takim: 'kupa', deger: 13, acik: true },
  { takim: 'karo', deger: 12, acik: true },
  { takim: 'sinek', deger: 11, acik: true },
];

export function Acilis({ basla }: { basla: () => void }) {
  return (
    <main className="acilis" onClick={basla}>
      <div className="acilis-orta">
        <div className="yelpaze">
          {YELPAZE.map((k, i) => (
            <KartYuzu
              key={i}
              kart={k}
              genislik={104}
              stil={{ transform: `rotate(${(i - 1.5) * 10}deg) translateY(${Math.abs(i - 1.5) * 10}px)` }}
            />
          ))}
        </div>
        <h1 className="oyun-adi">{m('oyun.ad')}</h1>
        <p className="alt-yazi">{m('acilis.altYazi')}</p>
        <button className="dugme ana" onClick={basla}>
          {m('acilis.basla')}
        </button>
      </div>
      <footer className="acilis-alt">
        <span className="sirket">{m('acilis.sirket')}</span>
        <span className="kulup-izi">{m('acilis.kulupIzi')}</span>
        <span className="surum">{m('acilis.surum')}</span>
      </footer>
    </main>
  );
}
