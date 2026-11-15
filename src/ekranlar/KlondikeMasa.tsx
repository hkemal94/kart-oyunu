import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as TepkiOlayi } from 'react';
import { m, type MetinAnahtari } from '../metinler';
import { ipucuHakkiAl } from '../reklam/ipucuHakki';
import { KartYuzu } from '../kart/KartYuzu';
import { TAKIM_SIMGESI, type Kart } from '../kart/kart';
import {
  cek,
  cekmeDurumu,
  geriAl,
  ipuclari,
  kazandiMi,
  klondikeDagit,
  KLONDIKE_SUTUN_SAYISI,
  tasi,
  tasinabilirMi,
  temeleGonder,
  temelNo,
  TEMEL_TAKIMLARI,
  type CekmeSayisi,
  type Hedef,
  type KlondikeIpucu,
  type KlondikeMasasi,
  type Yer,
} from '../kart/klondike';
import {
  BilgiSatiri,
  ElBirakmaSorusu,
  MasaDugmeleri,
  OyunSonu,
  ReklamKutusu,
  useElBirakma,
  useGeriAlHakki,
  usePuan,
  useSure,
} from './masaOrtak';
import { klondikeOzeti } from '../kart/puan';

// Klasik solitaire masası (yol haritası, 3. paket; belge 1.1). Kurallar src/kart/klondike.ts'te.
// Üstte ince bilgi satırı (süre, hamle); altında dört temel yığın, açılan kartlar ve çekme
// destesi; onun altında yedi sütun; en altta düğmeler. Karta dokun, sonra gideceği yere dokun; ya
// da sürükle. Karta çift dokununca uygun temel yığına gider. Desteye dokununca kart açılır; deste
// bitince açılanlar destenin altına döner. Geri al ve ipucu Spider'daki gibi.

const ARALIK = 4; // sütunlar arası boşluk (piksel)
const UST_ARALIK = 12; // üst sıra ile sütunlar arası boşluk
const SURUKLEME_ESIGI = 8; // bu kadar kayınca dokunuş değil sürükleme sayılır
const CIFT_DOKUNMA = 350; // iki dokunuş arası bu kadar kısaysa çift dokunuş (milisaniye)
const UYARI_SURESI = 2600; // uyarı ekranda bu kadar kalır (milisaniye)
const RED_SURESI = 380; // reddedilen kartın sallanma süresi (milisaniye)
const IPUCU_SURESI = 1600; // ipucunun parlama süresi (milisaniye)
const ACILAN_SUTUNU = 4; // açılan kartlar 5. ve 6. sütunun üstünde, deste 7.nin üstünde
const DESTE_SUTUNU = 6;

interface Surukleme {
  yer: Yer;
  baslaX: number;
  baslaY: number;
  x: number;
  y: number;
  tutX: number; // parmağın kartın sol üst köşesine uzaklığı
  tutY: number;
  basladi: boolean;
}

// Çizilen her kart: nerede, hangi yerden alınabilir (alınamayan kartta yer yok)
interface Cizim {
  k: Kart;
  yer: Yer | null;
  x: number;
  y: number;
  z: number;
}

// Kart (yer b) seçili yerin (a) içinde mi: aynı sütunda ve daha üstte, ya da aynı yığının üstü
function icindeMi(a: Yer | null | undefined, b: Yer | null): boolean {
  if (!a || !b || a.tur !== b.tur) return false;
  if (a.tur === 'sutun' && b.tur === 'sutun') return a.no === b.no && b.sira >= a.sira;
  if (a.tur === 'temel' && b.tur === 'temel') return a.no === b.no;
  return true; // ikisi de açılan
}

interface Ozellik {
  cekme: CekmeSayisi;
  geri: () => void;
  baslangic?: KlondikeMasasi; // yalnız geliştirmedeki deneme eli için
}

export function KlondikeMasa({ cekme, geri, baslangic }: Ozellik) {
  const [masa, setMasa] = useState<KlondikeMasasi>(() => baslangic ?? klondikeDagit(cekme));
  const [el, setEl] = useState(0); // yeni elde kartlar yeniden dağıtılarak gelsin diye
  const [secim, setSecim] = useState<Yer | null>(null);
  const [surukleme, setSurukleme] = useState<Surukleme | null>(null);
  const [red, setRed] = useState<Yer | null>(null);
  const [uyari, setUyari] = useState<MetinAnahtari | null>(null);
  const [gecmis, setGecmis] = useState<KlondikeMasasi[]>([]); // geri al için önceki masalar
  const geriAlHak = useGeriAlHakki();
  const [ipucu, setIpucu] = useState<{ ipucu: KlondikeIpucu; sayi: number } | null>(null);
  const ipucuSirasi = useRef(0); // arka arkaya basınca sıradaki ipucu
  const sonDokunus = useRef<{ id: string; zaman: number } | null>(null);
  const alanRef = useRef<HTMLDivElement>(null);
  const [alan, setAlan] = useState({ en: 360, boy: 560 });

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
  const { saniye, sifirla: sureyiSifirla } = useSure(kazandi);
  // Puan ve seri (6. paket; src/kart/puan.ts). El yarımken bırakmak seriyi bitirir.
  const puan = usePuan('klasik', masa.cekme, klondikeOzeti(masa, saniye), kazandi);
  const birakma = useElBirakma(masa.hamle > 0 && !kazandi, puan.seriyiBitir);

  // Uyarı, ipucu ve sallanma kendiliğinden kaybolur
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
  useEffect(() => {
    ipucuSirasi.current = 0; // masa değişince ipucu baştan sayılır
    setIpucu(null);
  }, [masa]);
  useEffect(() => {
    if (!red) return;
    const z = setTimeout(() => setRed(null), RED_SURESI);
    return () => clearTimeout(z);
  }, [red]);
  useEffect(() => setSecim(null), [el]);

  // İlk dağıtımda kartlar sırayla gelir
  const ilkSira = useMemo(() => {
    const harita = new Map<string, number>();
    masa.sutunlar.forEach((s, c) => s.forEach((k, i) => harita.set(k.id, i * KLONDIKE_SUTUN_SAYISI + c)));
    masa.deste.forEach((k) => harita.set(k.id, 0));
    return harita;
  }, [el]);

  const kartEn = Math.floor((alan.en - ARALIK * (KLONDIKE_SUTUN_SAYISI - 1)) / KLONDIKE_SUTUN_SAYISI);
  const kartBoy = kartEn * 1.42;
  const kose = Math.max(3, kartEn * 0.1);
  const sutunUstu = kartBoy + UST_ARALIK;
  const kapaliAdim = kartBoy * 0.15;
  const acikAdim = kartBoy * 0.32;
  const yelpazeAdim = kartEn * 0.32; // 3 kart çekmede açılan son üç kart yan yana kayar
  const sutunX = (c: number) => c * (kartEn + ARALIK);

  // Her kartın yeri ve konumu. Uzun sütun alana sığsın diye sıkışır.
  const cizimler: Cizim[] = [];
  masa.temeller.forEach((t, no) =>
    t.forEach((k, i) =>
      cizimler.push({ k, yer: i === t.length - 1 ? { tur: 'temel', no } : null, x: sutunX(no), y: 0, z: i }),
    ),
  );
  const yelpaze = masa.cekme === 3 ? Math.min(3, masa.acilan.length) : 1;
  masa.acilan.forEach((k, i) => {
    const kay = Math.max(0, i - (masa.acilan.length - yelpaze));
    const ust = i === masa.acilan.length - 1;
    cizimler.push({ k, yer: ust ? { tur: 'acilan' } : null, x: sutunX(ACILAN_SUTUNU) + kay * yelpazeAdim, y: 0, z: i });
  });
  masa.deste.forEach((k, i) => cizimler.push({ k, yer: null, x: sutunX(DESTE_SUTUNU), y: 0, z: i }));
  masa.sutunlar.forEach((s, no) => {
    const adimlar = s.slice(0, -1).map((k) => (k.acik ? acikAdim : kapaliAdim));
    const toplam = adimlar.reduce((a, b) => a + b, 0);
    const sigan = Math.max(0, alan.boy - sutunUstu - kartBoy);
    const oran = toplam > sigan && toplam > 0 ? sigan / toplam : 1;
    let y = sutunUstu;
    s.forEach((k, sira) => {
      cizimler.push({ k, yer: { tur: 'sutun', no, sira }, x: sutunX(no), y, z: sira });
      if (sira < adimlar.length) y += adimlar[sira] * oran;
    });
  });

  // Ekrandaki noktanın hedefi: üst sırada temel yığınlar, altında sütunlar
  const hedefBul = (istemciX: number, istemciY: number): Hedef | null => {
    const r = alanRef.current!.getBoundingClientRect();
    const c = Math.min(KLONDIKE_SUTUN_SAYISI - 1, Math.max(0, Math.floor((istemciX - r.left + ARALIK / 2) / (kartEn + ARALIK))));
    if (istemciY - r.top < kartBoy + UST_ARALIK / 2) return c < TEMEL_TAKIMLARI.length ? { tur: 'temel' } : null;
    return { tur: 'sutun', no: c };
  };
  const yerinHedefi = (yer: Yer): Hedef | null =>
    yer.tur === 'sutun' ? { tur: 'sutun', no: yer.no } : yer.tur === 'temel' ? { tur: 'temel' } : null;

  // Her hamlede önceki masa geçmişe girer
  const hamleYap = (yeni: KlondikeMasasi) => {
    setGecmis((g) => [...g, masa]);
    setMasa(yeni);
  };

  const geriAlBas = () => {
    setSecim(null);
    const sonuc = geriAl(masa, gecmis);
    if (!sonuc || !geriAlHak.kullan()) return;
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
    setMasa(klondikeDagit(cekme));
    setEl((e) => e + 1);
    setGecmis([]);
    geriAlHak.yeniEl(); // haklar her elde baştan
    puan.yeniEl();
    setSurukleme(null);
    setUyari(null);
    sureyiSifirla();
  };

  // Taşımayı dener; kurala uymazsa kart yerinde kalır (sürüklenen kart yumuşakça geri döner)
  const dene = (yer: Yer, hedef: Hedef | null) => {
    setSecim(null);
    if (!hedef) return;
    if (yer.tur === 'sutun' && hedef.tur === 'sutun' && yer.no === hedef.no) return;
    if (yer.tur === 'temel' && hedef.tur === 'temel') return;
    const sonuc = tasi(masa, yer, hedef);
    if (sonuc) hamleYap(sonuc);
    else setRed(yer);
  };

  const desteyeBas = () => {
    setSecim(null);
    const sonuc = cek(masa);
    if (sonuc) hamleYap(sonuc);
  };

  const kartBas = (e: TepkiOlayi<HTMLDivElement>, yer: Yer | null) => {
    e.stopPropagation();
    if (!yer || !tasinabilirMi(masa, yer)) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    setSurukleme({
      yer,
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

  const kartBirak = (e: TepkiOlayi<HTMLDivElement>, c: Cizim) => {
    e.stopPropagation();
    const s = surukleme;
    setSurukleme(null);
    if (s && s.basladi) {
      dene(s.yer, hedefBul(e.clientX, e.clientY));
      return;
    }
    // Dokunuş. Çift dokunuş: kart uygun temel yığına gider.
    const simdi = Date.now();
    const onceki = sonDokunus.current;
    sonDokunus.current = { id: c.k.id, zaman: simdi };
    const { yer } = c;
    if (yer && onceki && onceki.id === c.k.id && simdi - onceki.zaman < CIFT_DOKUNMA) {
      sonDokunus.current = null;
      const sonuc = temeleGonder(masa, yer);
      if (sonuc) {
        setSecim(null);
        hamleYap(sonuc);
        return;
      }
    }
    const ayniYigin =
      secim && yer && (secim.tur === yer.tur && (yer.tur !== 'sutun' || (secim.tur === 'sutun' && secim.no === yer.no)));
    const hedef = yer ? yerinHedefi(yer) : null;
    if (secim && !ayniYigin && hedef) {
      dene(secim, hedef);
    } else if (secim && yer && icindeMi(secim, yer) && icindeMi(yer, secim)) {
      setSecim(null); // seçili karta yeniden dokunuldu
    } else if (yer && tasinabilirMi(masa, yer)) {
      setSecim(yer);
    } else if (c.k.acik && yer) {
      setSecim(null);
      setRed(yer);
    } else {
      setSecim(null);
    }
  };

  // Boş yuvaya ya da boş yere dokunuş: seçili kart oraya gitmeyi dener
  const alaniBirak = (e: TepkiOlayi<HTMLDivElement>) => {
    if (secim) dene(secim, hedefBul(e.clientX, e.clientY));
  };

  const tasinanMi = (c: Cizim) => !!surukleme?.basladi && icindeMi(surukleme.yer, c.yer);
  // İpucu: taşınacak kart ya da dizi ve gideceği yerin üstteki kartı (boşsa yuvası) parlar
  const ip = ipucu?.ipucu.tur === 'tasi' ? ipucu.ipucu : null;
  const ipHedefSutun = ip?.hedef.tur === 'sutun' ? ip.hedef.no : null;
  const ipKart = ip && (ip.yer.tur === 'sutun' ? masa.sutunlar[ip.yer.no][ip.yer.sira] : null);
  const ipTemel =
    ip?.hedef.tur === 'temel'
      ? temelNo((ipKart ?? (ip.yer.tur === 'acilan' ? masa.acilan[masa.acilan.length - 1] : null))!.takim)
      : null;
  const ipucuMu = (c: Cizim) => {
    if (!ip || !c.yer) return false;
    if (icindeMi(ip.yer, c.yer)) return true;
    if (c.yer.tur === 'sutun') return ipHedefSutun === c.yer.no && c.yer.sira === masa.sutunlar[c.yer.no].length - 1;
    return c.yer.tur === 'temel' && c.yer.no === ipTemel;
  };

  const alanR = alanRef.current?.getBoundingClientRect();
  const desteDurumu = cekmeDurumu(masa);
  const cekIpucu = ipucu?.ipucu.tur === 'cek';
  // Sürüklenen dizinin ilk kartının konumu (öbürleri ona göre kayar)
  const surukIlk = surukleme?.basladi ? cizimler.find((c) => c.yer && icindeMi(c.yer, surukleme.yer) && icindeMi(surukleme.yer, c.yer)) : undefined;

  return (
    <main className="masa">
      <BilgiSatiri saniye={saniye} baslik={m('masa.baslikKlasik', masa.cekme)} hamle={masa.hamle} puan={puan.puan} asama={puan.asama} />

      <div className="oyun-alani" ref={alanRef} onPointerUp={alaniBirak}>
        {TEMEL_TAKIMLARI.map((t, no) => (
          <div
            key={`temel-${t}`}
            className={`yuva temel ${secim && secim.tur !== 'temel' ? 'hedef' : ''} ${
              ipTemel === no && masa.temeller[no].length === 0 ? 'ipucu' : ''
            }`}
            style={{ left: sutunX(no), width: kartEn, height: kartBoy, borderRadius: kose, fontSize: kartEn * 0.5 }}
            aria-label={m('masa.temel')}
          >
            {TAKIM_SIMGESI[t]}
          </div>
        ))}
        {masa.sutunlar.map((_, no) => (
          <div
            key={`yuva-${no}`}
            className={`yuva ${secim && !(secim.tur === 'sutun' && secim.no === no) ? 'hedef' : ''} ${
              ipHedefSutun === no && masa.sutunlar[no].length === 0 ? 'ipucu' : ''
            }`}
            style={{ left: sutunX(no), top: sutunUstu, width: kartEn, height: kartBoy, borderRadius: kose }}
          />
        ))}
        <div className={`yuva deste-yuvasi ${desteDurumu === 'bos' ? 'bos' : ''}`} style={{ left: sutunX(DESTE_SUTUNU), width: kartEn, height: kartBoy, borderRadius: kose }}>
          {desteDurumu === 'dondur' && (
            <svg className="simge buyuk" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.5h-2.5" />
            </svg>
          )}
        </div>

        <div key={el} className="kart-katmani">
          {/* Kartlar hep aynı sırada çizilir: yer değişince yeniden dağıtılıyormuş gibi oynamasın */}
          {[...cizimler]
            .sort((a, b) => (a.k.id < b.k.id ? -1 : 1))
            .map((c) => {
              const tasinan = tasinanMi(c);
              let { x: left, y: top } = c;
              if (tasinan && surukleme && alanR && surukIlk) {
                left = surukleme.x - surukleme.tutX - alanR.left + (c.x - surukIlk.x);
                top = surukleme.y - surukleme.tutY - alanR.top + (c.y - surukIlk.y);
              }
              const sinif = [
                'kart-yeri',
                c.yer ? '' : 'sabit',
                tasinan ? 'tasiniyor' : '',
                icindeMi(secim, c.yer) ? 'secili' : '',
                icindeMi(red, c.yer) ? 'reddedildi' : '',
                ipucuMu(c) ? 'ipucu' : '',
              ].join(' ');
              return (
                <div
                  key={c.k.id}
                  className={sinif}
                  style={{
                    left,
                    top,
                    zIndex: tasinan ? 500 + c.z : c.z,
                    animationDelay: `${(ilkSira.get(c.k.id) ?? 0) * 14}ms`,
                  }}
                  onPointerDown={(e) => kartBas(e, c.yer)}
                  onPointerMove={kartKay}
                  onPointerUp={(e) => kartBirak(e, c)}
                  onPointerCancel={() => setSurukleme(null)}
                >
                  {/* İpucu her basışta yeniden parlasın diye kart yeniden çizilir */}
                  <KartYuzu key={ipucuMu(c) ? `ip-${ipucu?.sayi}` : 'k'} kart={c.k} genislik={kartEn} />
                </div>
              );
            })}
        </div>

        {/* Çekme destesi: dokununca kart açılır; bitince açılanlar destenin altına döner */}
        <button
          key={cekIpucu ? `deste-${ipucu?.sayi}` : 'deste'}
          className={`deste klasik ${cekIpucu ? 'ipucu' : ''}`}
          style={{ left: sutunX(DESTE_SUTUNU), width: kartEn, height: kartBoy, borderRadius: kose }}
          disabled={desteDurumu === 'bos'}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={desteyeBas}
          aria-label={m(desteDurumu === 'dondur' ? 'masa.desteDondur' : 'masa.cek')}
        />

        {uyari && (
          <p className="uyari alt" role="status">
            {m(uyari)}
          </p>
        )}
      </div>

      <MasaDugmeleri
        geriAl={geriAlBas}
        geriAlKapali={gecmis.length === 0}
        kalanHak={geriAlHak.hak.kalan}
        ipucu={ipucuBas}
        yeniEl={() => birakma.sor(yeniEl)}
        geri={() => birakma.sor(geri)}
      />

      {birakma.soruAcik && <ElBirakmaSorusu evet={birakma.evet} hayir={birakma.hayir} />}

      {geriAlHak.kutu && <ReklamKutusu kapat={geriAlHak.kutuyuKapat} hakAl={geriAlHak.reklamlaAl} />}

      {kazandi && (
        <OyunSonu altBaslik={m('masa.baslikKlasik', masa.cekme)} saniye={saniye} hamle={masa.hamle} puan={puan.sonuc} yeniEl={yeniEl} geri={geri} />
      )}
    </main>
  );
}
