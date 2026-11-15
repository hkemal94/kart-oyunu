import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as TepkiOlayi } from 'react';
import { m } from '../metinler';
import { KartYuzu } from '../kart/KartYuzu';
import {
  desteden,
  spiderDagit,
  SPIDER_DIZI,
  SPIDER_SUTUN_SAYISI,
  tasi,
  type RenkSayisi,
  type SpiderMasasi,
} from '../kart/kart';

// Masa (yol haritası, 1. paket): dikey ekrana göre düz renkli masa, Spider dağıtımı.
// Karta dokununca seçilir, sonra bir sütuna dokununca oraya gider; sürükleyerek de taşınır.
// Kural kontrolü bu pakette yok.

const ARALIK = 3; // sütunlar arası boşluk (piksel)
const SURUKLEME_ESIGI = 8; // bu kadar kayınca dokunuş değil sürükleme sayılır

interface Secim {
  sutun: number;
  sira: number;
}
interface Surukleme extends Secim {
  baslaX: number;
  baslaY: number;
  x: number;
  y: number;
  tutX: number; // parmağın kartın sol üst köşesine uzaklığı
  tutY: number;
  basladi: boolean;
}

export function Masa({ renk, geri }: { renk: RenkSayisi; geri: () => void }) {
  const [masa, setMasa] = useState<SpiderMasasi>(() => spiderDagit(renk));
  const [el, setEl] = useState(0); // yeni elde kartlar yeniden dağıtılarak gelsin diye
  const [secim, setSecim] = useState<Secim | null>(null);
  const [surukleme, setSurukleme] = useState<Surukleme | null>(null);
  const alanRef = useRef<HTMLDivElement>(null);
  const [alan, setAlan] = useState({ en: 360, boy: 500 });

  useLayoutEffect(() => {
    const d = alanRef.current;
    if (!d) return;
    const olc = () => setAlan({ en: d.clientWidth, boy: d.clientHeight });
    olc();
    const g = new ResizeObserver(olc);
    g.observe(d);
    return () => g.disconnect();
  }, []);

  // İlk dağıtımda kartlar sırayla gelir; desteden gelenler sütun sırasıyla.
  const ilkSira = useMemo(() => {
    const harita = new Map<string, number>();
    masa.sutunlar.forEach((s, c) => s.forEach((k, i) => harita.set(k.id, i * SPIDER_SUTUN_SAYISI + c)));
    return harita;
  }, [el]);

  // Geri tuşu ve sayfa değişiminde seçim kalmasın
  useEffect(() => setSecim(null), [el]);

  const kartEn = Math.floor((alan.en - ARALIK * (SPIDER_SUTUN_SAYISI - 1)) / SPIDER_SUTUN_SAYISI);
  const kartBoy = kartEn * 1.42;
  const kapaliAdim = kartBoy * 0.14;
  const acikAdim = kartBoy * 0.34;

  // Her sütundaki kartın üstten uzaklığı; uzun sütun alana sığsın diye sıkışır.
  const konumlar = masa.sutunlar.map((s) => {
    const adimlar = s.slice(0, -1).map((k) => (k.acik ? acikAdim : kapaliAdim));
    const toplam = adimlar.reduce((a, b) => a + b, 0);
    const sigan = Math.max(0, alan.boy - kartBoy);
    const oran = toplam > sigan && toplam > 0 ? sigan / toplam : 1;
    let y = 0;
    return s.map((_, i) => {
      const bu = y;
      if (i < adimlar.length) y += adimlar[i] * oran;
      return bu;
    });
  });

  const sutunX = (c: number) => c * (kartEn + ARALIK);
  const sutunBul = (istemciX: number) => {
    const r = alanRef.current!.getBoundingClientRect();
    const c = Math.floor((istemciX - r.left + ARALIK / 2) / (kartEn + ARALIK));
    return Math.min(SPIDER_SUTUN_SAYISI - 1, Math.max(0, c));
  };

  const yeniEl = () => {
    setMasa(spiderDagit(renk));
    setEl((e) => e + 1);
    setSurukleme(null);
  };

  const sutunaDokun = (hedef: number) => {
    if (!secim) return;
    setMasa((mv) => tasi(mv, secim.sutun, secim.sira, hedef));
    setSecim(null);
  };

  const kartBas = (e: TepkiOlayi<HTMLDivElement>, sutun: number, sira: number) => {
    e.stopPropagation();
    const kart = masa.sutunlar[sutun][sira];
    // Kapalı karta dokunmak: seçim varsa o sütuna taşı, yoksa bir şey yapma
    if (!kart.acik) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    setSurukleme({
      sutun,
      sira,
      baslaX: e.clientX,
      baslaY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      tutX: e.clientX - r.left,
      tutY: e.clientY - r.top,
      basladi: false,
    });
  };

  const kartKay = (e: TepkiOlayi<HTMLDivElement>) => {
    if (!surukleme) return;
    const basladi =
      surukleme.basladi ||
      Math.hypot(e.clientX - surukleme.baslaX, e.clientY - surukleme.baslaY) > SURUKLEME_ESIGI;
    setSurukleme({ ...surukleme, x: e.clientX, y: e.clientY, basladi });
    if (basladi && !surukleme.basladi) setSecim(null);
  };

  const kartBirak = (e: TepkiOlayi<HTMLDivElement>, sutun: number, sira: number) => {
    e.stopPropagation();
    const s = surukleme;
    setSurukleme(null);
    if (s && s.basladi) {
      const hedef = sutunBul(e.clientX);
      setMasa((mv) => tasi(mv, s.sutun, s.sira, hedef));
      return;
    }
    // Dokunuş
    if (secim && secim.sutun !== sutun) {
      sutunaDokun(sutun);
    } else if (secim && secim.sutun === sutun && secim.sira === sira) {
      setSecim(null);
    } else if (masa.sutunlar[sutun][sira].acik) {
      setSecim({ sutun, sira });
    } else if (secim) {
      setSecim(null);
    }
  };

  const tasinanMi = (c: number, i: number) => surukleme?.basladi && surukleme.sutun === c && i >= surukleme.sira;
  const seciliMi = (c: number, i: number) => secim && secim.sutun === c && i >= secim.sira;

  const alanR = alanRef.current?.getBoundingClientRect();
  const destedenKalan = masa.deste.length / SPIDER_SUTUN_SAYISI;

  return (
    <main className="masa">
      <header className="masa-ust">
        <button className="dugme ince" onClick={geri}>
          ‹ {m('masa.geri')}
        </button>
        <h1>{m('masa.baslik', renk)}</h1>
        <button className="dugme ince" onClick={yeniEl}>
          {m('masa.yeniEl')}
        </button>
      </header>
      <p className="masa-not">{m('masa.not')}</p>

      <div
        className="oyun-alani"
        ref={alanRef}
        onPointerUp={(e) => sutunaDokun(sutunBul(e.clientX))}
      >
        {masa.sutunlar.map((_, c) => (
          <div
            key={`yuva-${c}`}
            className={`yuva ${secim && secim.sutun !== c ? 'hedef' : ''}`}
            style={{ left: sutunX(c), width: kartEn, height: kartBoy, borderRadius: Math.max(3, kartEn * 0.1) }}
          />
        ))}
        <div key={el} className="kart-katmani">
          {/* Kartlar hep aynı sırada çizilir: sütun değişince yeniden dağıtılıyormuş gibi oynamasın */}
          {masa.sutunlar
            .flatMap((s, c) => s.map((k, i) => ({ k, c, i })))
            .sort((a, b) => (a.k.id < b.k.id ? -1 : 1))
            .map(({ k, c, i }) => {
              const tasinan = tasinanMi(c, i);
              let left = sutunX(c);
              let top = konumlar[c][i];
              if (tasinan && surukleme && alanR) {
                left = surukleme.x - surukleme.tutX - alanR.left;
                top = surukleme.y - surukleme.tutY - alanR.top + (konumlar[c][i] - konumlar[c][surukleme.sira]);
              }
              return (
                <div
                  key={k.id}
                  className={`kart-yeri ${tasinan ? 'tasiniyor' : ''} ${seciliMi(c, i) ? 'secili' : ''}`}
                  style={{
                    left,
                    top,
                    zIndex: tasinan ? 500 + i : i,
                    animationDelay: `${(ilkSira.get(k.id) ?? c) * 14}ms`,
                  }}
                  onPointerDown={(e) => kartBas(e, c, i)}
                  onPointerMove={kartKay}
                  onPointerUp={(e) => kartBirak(e, c, i)}
                  onPointerCancel={() => setSurukleme(null)}
                >
                  <KartYuzu kart={k} genislik={kartEn} />
                </div>
              );
            })}
        </div>
      </div>

      <footer className="masa-alt">
        <span className="masa-alt-etiket">{m('masa.tamamlanan')}</span>
        <div className="masa-alt-sira">
          {Array.from({ length: SPIDER_DIZI }, (_, i) => (
            <div
              key={i}
              className="yuva bos"
              style={{ width: kartEn, height: kartBoy, borderRadius: Math.max(3, kartEn * 0.1) }}
            />
          ))}
          <button
            className="deste"
            style={{ width: kartEn * 2 + ARALIK, height: kartBoy }}
            disabled={masa.deste.length === 0}
            onClick={() => setMasa((mv) => desteden(mv))}
            aria-label={m('masa.deste')}
          >
            <span className="deste-yigin" style={{ width: kartEn + 8, height: kartBoy }}>
              {Array.from({ length: destedenKalan }, (_, i) => (
                <KartYuzu
                  key={i}
                  kart={{ takim: 'maca', deger: 1, acik: false }}
                  genislik={kartEn}
                  stil={{ position: 'absolute', left: i * 2, top: 0 }}
                />
              ))}
            </span>
            <span className="deste-yazi">{masa.deste.length ? m('masa.deste') : m('masa.desteBos')}</span>
          </button>
        </div>
      </footer>
    </main>
  );
}
