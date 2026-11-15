import type { CSSProperties } from 'react';
import { m, type MetinAnahtari } from '../metinler';
import { KIRMIZI_TAKIMLAR, TAKIM_SIMGESI, type Kart } from './kart';

// Kod ile çizilen yer tutucu kart (yol haritası, 1. paket; belge 4.2 sade deste).
// Köşede büyük değer ve takım simgesi; kırmızı ve siyah. Arka yüz düz renk.
// Görseller gelince yalnız bu dosya değişir.

export function degerYazisi(deger: number): string {
  if (deger === 1 || deger > 10) return m(`kart.deger.${deger}` as MetinAnahtari);
  return String(deger);
}

interface Ozellik {
  kart: Pick<Kart, 'takim' | 'deger' | 'acik'>;
  genislik: number;
  stil?: CSSProperties;
  sinif?: string;
}

export function KartYuzu({ kart, genislik, stil, sinif }: Ozellik) {
  const yukseklik = genislik * 1.42;
  const kutu: CSSProperties = {
    width: genislik,
    height: yukseklik,
    borderRadius: Math.max(3, genislik * 0.1),
    ...stil,
  };
  if (!kart.acik) {
    return <div className={`kart arka ${sinif ?? ''}`} style={kutu} aria-label={m('kart.kapali')} />;
  }
  const kirmizi = KIRMIZI_TAKIMLAR.includes(kart.takim);
  const simge = TAKIM_SIMGESI[kart.takim];
  const deger = degerYazisi(kart.deger);
  const kose = genislik * (deger.length > 1 ? 0.34 : 0.4);
  return (
    <div
      className={`kart yuz ${kirmizi ? 'kirmizi' : 'siyah'} ${sinif ?? ''}`}
      style={kutu}
      aria-label={`${deger} ${m(`kart.takim.${kart.takim}` as MetinAnahtari)}`}
    >
      <div className="kose" style={{ fontSize: kose, padding: `${genislik * 0.04}px ${genislik * 0.06}px` }}>
        <span className="kose-deger">{deger}</span>
        <span className="kose-simge" style={{ fontSize: kose * 0.85 }}>
          {simge}
        </span>
      </div>
      <div className="orta-simge" style={{ fontSize: genislik * 0.62 }}>
        {simge}
      </div>
    </div>
  );
}
