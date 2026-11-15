import { useEffect, useState } from 'react';
import { m } from '../metinler';
import { geriAlHakkiAl } from '../reklam/geriAlHakki';
import { hakBaslat, hakKullan, reklamHakkiEkle, yeniElHakki, type GeriAlHakki } from '../kart/geriAlHakki';

// İki masanın (Spider ve klasik solitaire) ortak parçaları: süre, geri al hakkı, alt şerit,
// "reklam yerine" kutusu ve oyun sonu kutusu (belge 1.3 ve 2).

export function sureYazisi(saniye: number): string {
  const s = saniye % 60;
  const dk = Math.floor(saniye / 60) % 60;
  const sa = Math.floor(saniye / 3600);
  const iki = (n: number) => String(n).padStart(2, '0');
  return sa > 0 ? `${sa}:${iki(dk)}:${iki(s)}` : `${dk}:${iki(s)}`;
}

// Süre: el başında başlar, el bitince durur; yeni elde sıfırlanır.
export function useSure(bitti: boolean) {
  const [basladi, setBasladi] = useState(() => Date.now());
  const [simdi, setSimdi] = useState(() => Date.now());
  const [bitis, setBitis] = useState<number | null>(null);
  useEffect(() => {
    if (bitis !== null) return;
    const z = setInterval(() => setSimdi(Date.now()), 1000);
    return () => clearInterval(z);
  }, [bitis]);
  useEffect(() => {
    if (bitti && bitis === null) setBitis(Date.now());
  }, [bitti, bitis]);
  const sifirla = () => {
    setBitis(null);
    setBasladi(Date.now());
    setSimdi(Date.now());
  };
  return { saniye: Math.max(0, Math.floor(((bitis ?? simdi) - basladi) / 1000)), sifirla };
}

// Geri al hakkı (Kemal, 15 Kasım soru turu): her elde sınırlı hak; bitince "reklam yerine" kutusu
// bir hak daha verir (src/kart/geriAlHakki.ts). Deneme için adresten değişir (?geriAlHak=).
export function useGeriAlHakki() {
  const [hak, setHak] = useState<GeriAlHakki>(() => hakBaslat(location.search));
  const [kutu, setKutu] = useState(false);
  return {
    hak,
    kutu,
    // Bir hak kullanır; hak yoksa kutuyu açar ve false döner
    kullan: () => {
      const yeni = hakKullan(hak);
      if (!yeni) {
        setKutu(true);
        return false;
      }
      setHak(yeni);
      return true;
    },
    // Telefon uygulamasında burada reklam izlenir; web'de düğmeye dokununca hak gelir
    // (src/reklam/geriAlHakki.ts)
    reklamlaAl: async () => {
      if (await geriAlHakkiAl()) setHak((h) => reklamHakkiEkle(h));
      setKutu(false);
    },
    kutuyuKapat: () => setKutu(false),
    yeniEl: () => {
      setHak(yeniElHakki); // haklar her elde baştan
      setKutu(false);
    },
  };
}

// Alt şerit (yol haritası 4): geri al, ipucu, yeni el, oyun seçimi. Simgeler kodla çizilir.
export function MasaDugmeleri(o: {
  geriAl: () => void;
  geriAlKapali: boolean;
  kalanHak: number;
  ipucu: () => void;
  yeniEl: () => void;
  geri: () => void;
}) {
  return (
    <nav className="masa-dugmeler">
      <button className="dugme ince" onClick={o.geriAl} disabled={o.geriAlKapali}>
        <svg className="simge" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5.5 3.5 2.5 6.5l3 3M3 6.5h6.5a4 4 0 0 1 0 8H7" />
        </svg>
        {m('masa.geriAl')}
        <span className="hak" aria-label={m('masa.geriAlHak', o.kalanHak)}>
          {o.kalanHak}
        </span>
      </button>
      <button className="dugme ince" onClick={o.ipucu}>
        <svg className="simge" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 12.5h4M6.5 14.5h3M8 1.5a4.5 4.5 0 0 0-2.5 8.2c.4.3.5.7.5 1.3v.5h4V11c0-.6.1-1 .5-1.3A4.5 4.5 0 0 0 8 1.5Z" />
        </svg>
        {m('masa.ipucu')}
      </button>
      <button className="dugme ince" onClick={o.yeniEl}>
        {m('masa.yeniEl')}
      </button>
      <button className="dugme ince" onClick={o.geri}>
        {m('masa.geri')}
      </button>
    </nav>
  );
}

// Geri al hakları bitince çıkan "reklam yerine" kutusu (web denemesi)
export function ReklamKutusu({ kapat, hakAl }: { kapat: () => void; hakAl: () => void }) {
  return (
    <div className="oyun-sonu hizli" onClick={kapat}>
      <section
        className="oyun-sonu-kutu"
        role="dialog"
        aria-label={m('masa.reklam.baslik')}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="kucuk">{m('masa.reklam.baslik')}</h2>
        <p className="reklam-yeri">{m('masa.reklam.yerTutucu')}</p>
        <button className="dugme ana genis" onClick={hakAl}>
          {m('masa.reklam.hakAl')}
        </button>
      </section>
    </div>
  );
}

// Oyun sonu: süre, hamle, "Yeni el", "Oyun seçimi" (belge 2)
export function OyunSonu(o: { altBaslik: string; saniye: number; hamle: number; yeniEl: () => void; geri: () => void }) {
  return (
    <div className="oyun-sonu">
      <section className="oyun-sonu-kutu" role="dialog" aria-label={m('sonu.baslik')}>
        <h2>{m('sonu.baslik')}</h2>
        <p className="oyun-sonu-alt">{o.altBaslik}</p>
        <dl>
          <div>
            <dt>{m('sonu.sure')}</dt>
            <dd>{sureYazisi(o.saniye)}</dd>
          </div>
          <div>
            <dt>{m('sonu.hamle')}</dt>
            <dd>{o.hamle}</dd>
          </div>
        </dl>
        <button className="dugme ana genis" onClick={o.yeniEl}>
          {m('sonu.yeniEl')}
        </button>
        <button className="dugme ikincil genis" onClick={o.geri}>
          {m('sonu.oyunSecimi')}
        </button>
      </section>
    </div>
  );
}
