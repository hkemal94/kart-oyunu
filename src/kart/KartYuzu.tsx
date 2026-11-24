import type { CSSProperties } from 'react';
import { m, type MetinAnahtari } from '../metinler';
import type { Deste } from '../oyun/oyuncuAyarlari';
import { KIRMIZI_TAKIMLAR, TAKIM_SIMGESI, kartSeti, type Kart, type KartSeti } from './kart';
import surekArka1 from '../assets/surek-arka-1.webp';
import surekArka2 from '../assets/surek-arka-2.webp';

// Kod ile çizilen yer tutucu kart (yol haritası, 1. paket; belge 4.2 sade deste).
// Köşede büyük değer ve takım simgesi; kırmızı ve siyah. Sade destenin arka yüzü düz renk.
// Sürek Kulübü destesinin arka yüzü görsel (yol haritası 14; Kemal, 24 Kasım: "iki desteyi
// otomatik ata, farklı renklerde aynı desende olsun"): 1. set lacivert-kiremit, 2. set
// ege-kırmızı. Ön yüz şimdilik iki destede de sade. Görseller gelince yalnız bu dosya değişir.

const SUREK_ARKA: Record<KartSeti, string> = { 1: surekArka1, 2: surekArka2 };

// Seçili deste: açılışta Uygulama ayarlardan belirler; ayarlardan değişince desteSec çağrılır ve
// ekran yeniden çizilir (dil gibi; src/metinler).
let deste: Deste = 'surek';
export function desteSec(yeni: Deste): void {
  deste = yeni;
}

export function degerYazisi(deger: number): string {
  if (deger === 1 || deger > 10) return m(`kart.deger.${deger}` as MetinAnahtari);
  return String(deger);
}

interface Ozellik {
  kart: Pick<Kart, 'takim' | 'deger' | 'acik'> & { id?: string }; // kimlik: kartın seti (arka yüzü)
  genislik: number;
  yukseklik?: number; // verilmezse standart oran (Spider masasında uzun ekranda kart biraz uzar)
  stil?: CSSProperties;
  sinif?: string;
}

export function KartYuzu({ kart, genislik, yukseklik = genislik * 1.42, stil, sinif }: Ozellik) {
  const kutu: CSSProperties = {
    width: genislik,
    height: yukseklik,
    borderRadius: Math.max(3, genislik * 0.1),
    ...stil,
  };
  if (!kart.acik) {
    if (deste === 'surek') {
      const set = kartSeti(kart.id);
      return (
        <div
          className={`kart arka surek set-${set} ${sinif ?? ''}`}
          style={{ ...kutu, backgroundImage: `url(${SUREK_ARKA[set]})` }}
          aria-label={m('kart.kapali')}
        />
      );
    }
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
