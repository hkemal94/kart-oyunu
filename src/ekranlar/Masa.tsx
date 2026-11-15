import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as TepkiOlayi } from 'react';
import { m, type MetinAnahtari } from '../metinler';
import { ipucuHakkiAl } from '../reklam/ipucuHakki';
import { MasaDugmeleri, OyunSonu, ReklamKutusu, sureYazisi, useGeriAlHakki, useSure } from './masaOrtak';
import { KartYuzu } from '../kart/KartYuzu';
import type { RenkSayisi } from '../kart/kart';
import {
  dagitilabilirMi,
  destedenDagit,
  geriAl,
  ipuclari,
  kazandiMi,
  spiderDagit,
  SPIDER_DIZI,
  SPIDER_SUTUN_SAYISI,
  tasi,
  tasinabilirMi,
  type Ipucu,
  type SpiderMasasi,
} from '../kart/spider';

// Masa (yol haritası, 2. paket): Spider kurallarıyla oynanır (kurallar src/kart/spider.ts).
// Üstte ince bilgi satırı (süre, hamle), ortada kartlar, altta tamamlanan diziler ve deste,
// en altta düğmeler. Karta dokun, sonra sütuna dokun; ya da sürükle. Kurala uymayan taşımada
// kart yerine döner ve hafifçe sallanır. Altta "Geri al" ve "İpucu" (4. paket): geri al son
// hamleyi geri getirir; her elde sınırlı hak var, bitince "reklam yerine" kutusu bir hak daha verir
// (src/kart/geriAlHakki.ts). İpucu bir hamleyi kısa süre parlatır, arka arkaya basınca sıradaki gelir.

const ARALIK = 3; // sütunlar arası boşluk (piksel)
const SURUKLEME_ESIGI = 8; // bu kadar kayınca dokunuş değil sürükleme sayılır
const UYARI_SURESI = 2600; // boş sütun uyarısı ekranda bu kadar kalır (milisaniye)
const RED_SURESI = 380; // reddedilen kartın sallanma süresi (milisaniye)
const IPUCU_SURESI = 1600; // ipucunun parlama süresi (milisaniye)

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

interface Ozellik {
  renk: RenkSayisi;
  geri: () => void;
  baslangic?: SpiderMasasi; // yalnız geliştirmedeki deneme eli için
}

export function Masa({ renk, geri, baslangic }: Ozellik) {
  const [masa, setMasa] = useState<SpiderMasasi>(() => baslangic ?? spiderDagit(renk));
  const [el, setEl] = useState(0); // yeni elde kartlar yeniden dağıtılarak gelsin diye
  const [secim, setSecim] = useState<Secim | null>(null);
  const [surukleme, setSurukleme] = useState<Surukleme | null>(null);
  const [red, setRed] = useState<Secim | null>(null);
  const [uyari, setUyari] = useState<MetinAnahtari | null>(null);
  const [gecmis, setGecmis] = useState<SpiderMasasi[]>([]); // geri al için önceki masalar
  // Bir eldeki ücretsiz geri al hakkı ve haklar bitince "reklam yerine" kutusu (masaOrtak.tsx)
  const geriAlHak = useGeriAlHakki();
  const [ipucu, setIpucu] = useState<{ ipucu: Ipucu; sayi: number } | null>(null);
  const ipucuSirasi = useRef(0); // arka arkaya basınca sıradaki ipucu
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

  const kazandi = kazandiMi(masa);
  // Süre: el başında başlar, kazanınca durur
  const { saniye, sifirla: sureyiSifirla } = useSure(kazandi);

  // Uyarı ve sallanma kendiliğinden kaybolur
  useEffect(() => {
    if (!uyari) return;
    const z = setTimeout(() => setUyari(null), UYARI_SURESI);
    return () => clearTimeout(z);
  }, [uyari]);
  useEffect(() => {
    if (!ipucu) return;
    const z = setTimeout(() => setIpucu(null), IPUCU_SURESI);
    return () => clearTimeout(z);
  }, [ipucu]);
  // Masa değişince ipucu baştan sayılır
  useEffect(() => {
    ipucuSirasi.current = 0;
    setIpucu(null);
  }, [masa]);
  useEffect(() => {
    if (!red) return;
    const z = setTimeout(() => setRed(null), RED_SURESI);
    return () => clearTimeout(z);
  }, [red]);

  // İlk dağıtımda kartlar sırayla gelir; desteden gelenler sütun sırasıyla.
  const ilkSira = useMemo(() => {
    const harita = new Map<string, number>();
    masa.sutunlar.forEach((s, c) => s.forEach((k, i) => harita.set(k.id, i * SPIDER_SUTUN_SAYISI + c)));
    return harita;
  }, [el]);

  useEffect(() => setSecim(null), [el]);

  const kartEn = Math.floor((alan.en - ARALIK * (SPIDER_SUTUN_SAYISI - 1)) / SPIDER_SUTUN_SAYISI);
  const kartBoy = kartEn * 1.42;
  const kapaliAdim = kartBoy * 0.14;
  const acikAdim = kartBoy * 0.34;
  const kose = Math.max(3, kartEn * 0.1);

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

  // Her hamlede önceki masa geçmişe girer
  const hamleYap = (yeni: SpiderMasasi) => {
    setGecmis((g) => [...g, masa]);
    setMasa(yeni);
  };

  const geriAlBas = () => {
    setSecim(null);
    const sonuc = geriAl(masa, gecmis);
    if (!sonuc) return;
    if (!geriAlHak.kullan()) return;
    setMasa(sonuc.masa);
    setGecmis(sonuc.gecmis);
  };

  const ipucuBas = async () => {
    setSecim(null);
    // Telefon uygulamasında burada reklam izlenir; web'de hep serbest (src/reklam/ipucuHakki.ts)
    if (!(await ipucuHakkiAl())) return;
    const liste = ipuclari(masa);
    if (liste.length === 0) {
      setUyari('masa.uyari.hamleYok');
      return;
    }
    const sira = ipucuSirasi.current % liste.length;
    ipucuSirasi.current = sira + 1;
    setIpucu((o) => ({ ipucu: liste[sira], sayi: (o?.sayi ?? 0) + 1 }));
  };

  const yeniEl = () => {
    setMasa(spiderDagit(renk));
    setEl((e) => e + 1);
    setGecmis([]);
    geriAlHak.yeniEl(); // haklar her elde baştan
    setSurukleme(null);
    setUyari(null);
    sureyiSifirla();
  };

  // Taşımayı dener; kurala uymazsa kart yerinde kalır (sürüklenen kart yumuşakça geri döner)
  const dene = (kaynak: number, sira: number, hedef: number) => {
    setSecim(null);
    if (kaynak === hedef) return;
    const sonuc = tasi(masa, kaynak, sira, hedef);
    if (sonuc) hamleYap(sonuc);
    else setRed({ sutun: kaynak, sira });
  };

  const dagit = () => {
    setSecim(null);
    const durum = dagitilabilirMi(masa);
    if (durum === 'bosSutun') {
      setUyari('masa.uyari.bosSutun');
      return;
    }
    const sonuc = destedenDagit(masa);
    if (sonuc) hamleYap(sonuc);
  };

  const kartBas = (e: TepkiOlayi<HTMLDivElement>, sutun: number, sira: number) => {
    e.stopPropagation();
    // Yalnız birlikte taşınabilen dizi (açık, aynı takım, sıralı) sürüklenir
    if (!tasinabilirMi(masa, sutun, sira)) return;
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
      dene(s.sutun, s.sira, sutunBul(e.clientX));
      return;
    }
    // Dokunuş
    if (secim && secim.sutun !== sutun) {
      dene(secim.sutun, secim.sira, sutun);
    } else if (secim && secim.sutun === sutun && secim.sira === sira) {
      setSecim(null);
    } else if (tasinabilirMi(masa, sutun, sira)) {
      setSecim({ sutun, sira });
    } else if (masa.sutunlar[sutun][sira].acik) {
      setSecim(null);
      setRed({ sutun, sira });
    } else {
      setSecim(null);
    }
  };

  const alaniBirak = (e: TepkiOlayi<HTMLDivElement>) => {
    if (secim) dene(secim.sutun, secim.sira, sutunBul(e.clientX));
  };

  const tasinanMi = (c: number, i: number) => surukleme?.basladi && surukleme.sutun === c && i >= surukleme.sira;
  const seciliMi = (c: number, i: number) => secim && secim.sutun === c && i >= secim.sira;
  const reddedildiMi = (c: number, i: number) => red && red.sutun === c && i >= red.sira;
  // İpucu: taşınacak dizi ve gideceği sütunun üstteki kartı (boşsa yuvası) parlar
  const ip = ipucu?.ipucu.tur === 'tasi' ? ipucu.ipucu : null;
  const ipucuMu = (c: number, i: number) =>
    !!ip && ((ip.kaynak === c && i >= ip.sira) || (ip.hedef === c && i === masa.sutunlar[c].length - 1));

  const alanR = alanRef.current?.getBoundingClientRect();
  const destedenKalan = masa.deste.length / SPIDER_SUTUN_SAYISI;

  return (
    <main className="masa">
      <header className="masa-bilgi">
        <span>{m('masa.sure', sureYazisi(saniye))}</span>
        <span className="masa-bilgi-baslik">{m('masa.baslik', renk)}</span>
        <span>{m('masa.hamle', masa.hamle)}</span>
      </header>

      <div className="oyun-alani" ref={alanRef} onPointerUp={alaniBirak}>
        {masa.sutunlar.map((_, c) => (
          <div
            key={`yuva-${c}`}
            className={`yuva ${secim && secim.sutun !== c ? 'hedef' : ''} ${
              ip && ip.hedef === c && masa.sutunlar[c].length === 0 ? 'ipucu' : ''
            }`}
            style={{ left: sutunX(c), width: kartEn, height: kartBoy, borderRadius: kose }}
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
              const sinif = [
                'kart-yeri',
                tasinan ? 'tasiniyor' : '',
                seciliMi(c, i) ? 'secili' : '',
                reddedildiMi(c, i) ? 'reddedildi' : '',
                ipucuMu(c, i) ? 'ipucu' : '',
              ].join(' ');
              return (
                <div
                  key={k.id}
                  className={sinif}
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
                  {/* İpucu her basışta yeniden parlasın diye kart yeniden çizilir */}
                  <KartYuzu key={ipucuMu(c, i) ? `ip-${ipucu?.sayi}` : 'k'} kart={k} genislik={kartEn} />
                </div>
              );
            })}
        </div>
      </div>

      <section className="masa-alt">
        <span className="masa-alt-etiket">
          {m('masa.tamamlanan')} · {masa.tamamlanan.length}/{SPIDER_DIZI}
        </span>
        <div className="masa-alt-sira">
          {Array.from({ length: SPIDER_DIZI }, (_, i) => {
            const takim = masa.tamamlanan[i];
            return takim ? (
              <KartYuzu
                key={`dolu-${i}`}
                kart={{ takim, deger: 13, acik: true }}
                genislik={kartEn}
                sinif="tamam"
              />
            ) : (
              <div key={i} className="yuva bos" style={{ width: kartEn, height: kartBoy, borderRadius: kose }} />
            );
          })}
          <button
            key={ipucu?.ipucu.tur === 'dagit' ? `deste-${ipucu.sayi}` : 'deste'}
            className={`deste ${ipucu?.ipucu.tur === 'dagit' ? 'ipucu' : ''}`}
            style={{ width: kartEn * 2 + ARALIK, height: kartBoy }}
            disabled={masa.deste.length === 0}
            onClick={dagit}
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
        {uyari && (
          <p className="uyari" role="status">
            {m(uyari)}
          </p>
        )}
      </section>

      <MasaDugmeleri
        geriAl={geriAlBas}
        geriAlKapali={gecmis.length === 0}
        kalanHak={geriAlHak.hak.kalan}
        ipucu={ipucuBas}
        yeniEl={yeniEl}
        geri={geri}
      />

      {geriAlHak.kutu && <ReklamKutusu kapat={geriAlHak.kutuyuKapat} hakAl={geriAlHak.reklamlaAl} />}

      {kazandi && (
        <OyunSonu altBaslik={m('masa.baslik', renk)} saniye={saniye} hamle={masa.hamle} yeniEl={yeniEl} geri={geri} />
      )}
    </main>
  );
}
