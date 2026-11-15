import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as TepkiOlayi } from 'react';
import { m, type MetinAnahtari } from '../metinler';
import type { OyuncuAyarlari } from '../oyun/oyuncuAyarlari';
import { yarimMi, type YarimEl } from '../oyun/yarimEl';
import { ipucuHakkiAl } from '../reklam/ipucuHakki';
import { KartYuzu } from '../kart/KartYuzu';
import { gunlukRastgele, type GunlukEl } from '../oyun/gunluk';
import { tarihYazisi, useGunlukYildiz } from './Gunluk';
import { ekranaGoreAralik, kartOlcusu, sutunKonumlari } from '../kart/duzen';
import { TAKIM_SIMGESI, type Kart } from '../kart/kart';
import { DAGITIM_ADIMI, HAREKET } from '../kart/hareket';
import {
  cek,
  cekmeDurumu,
  ciftDokunusHedefi,
  geriAl,
  ipuclari,
  kazandiMi,
  klondikeDagit,
  KLONDIKE_SUTUN_SAYISI,
  oynanabilirKartlar,
  tasi,
  tasinabilirMi,
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
  HareketKalkani,
  konumYazisi,
  MasaDugmeleri,
  OyunSonu,
  ReklamKutusu,
  useElBirakma,
  useElKaydi,
  useGeriAlHakki,
  useHareket,
  useKayanlar,
  masaPayi,
  useMasaBlogu,
  usePuan,
  useSure,
} from './masaOrtak';
import { klondikeOzeti } from '../kart/puan';

// Klasik solitaire masası (yol haritası, 3. paket; belge 1.1). Kurallar src/kart/klondike.ts'te.
// Üstte ince bilgi satırı (süre, hamle); altında dört temel yığın, açılan kartlar ve çekme
// destesi; onun altında yedi sütun; en altta düğmeler. Karta dokun, sonra gideceği yere dokun; ya
// da sürükle. Karta çift dokununca önce uygun temel yığına, gidemiyorsa uygun bir sütuna kayar; yer
// yoksa sallanır (Kemal, 15 Kasım). Desteye dokununca kart açılır; deste bitince açılanlar destenin
// altına döner. Geri al ve ipucu Spider'daki gibi. Yeni elde kartlar desteden teker teker uçar; o an
// oynanamayan açık kartlar biraz koyu (ayardan kapanır; Kemal'in telefon yorumları, 15 Kasım).

const ARALIK = 4; // sütunlar arası boşluk (piksel)
const UST_ARALIK = 12; // üst sıra ile sütunlar arası boşluk
const SURUKLEME_ESIGI = 8; // bu kadar kayınca dokunuş değil sürükleme sayılır
const CIFT_DOKUNMA = 350; // iki dokunuş arası bu kadar kısaysa çift dokunuş (milisaniye)
const UYARI_SURESI = 2600; // uyarı ekranda bu kadar kalır (milisaniye)
const RED_SURESI = 380; // reddedilen kartın sallanma süresi (milisaniye)
const IPUCU_SURESI = 1600; // ipucunun parlama süresi (milisaniye)
// Üst sıra: temel yığınlar 1-4. sütunun, açılan kartlar 5. ve 6.nın, deste 7.nin üstünde.
// Sol el düzeninde (5. paket) ayna gibi: deste 1., açılanlar 2. ve 3., temeller 4-7. sütunun üstünde.
const UST_SIRA = {
  sag: { temel: 0, acilan: 4, deste: 6 },
  sol: { temel: 3, acilan: 1, deste: 0 },
};
// Kemal, 15 Kasım: aralık ekran yüksekliğine göre (src/kart/duzen.ts); düzen ve kart boyu aynı.
// Aralık bu uzunluktaki sütun sıkışmadan sığacak kadar açılır (6 kapalı, 8 açık), ama kartın bu
// paylarından fazla açılmaz.
const BEKLENEN_KAPALI = 6;
const BEKLENEN_ACIK = 8;
const EN_COK_ACIK = 0.42;
const EN_COK_KAPALI = 0.18; // kapalı kartlar sık (Kemal, 15 Kasım: örnek ekran)
const EN_AZ_KAPALI = 0.08;

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

// Her kartın hangi yığında olduğu (son hamlede yer değiştirenler kayarken üstte çizilir)
const yerler = (masa: KlondikeMasasi) => {
  const h = new Map<string, string>();
  masa.sutunlar.forEach((s, no) => s.forEach((k) => h.set(k.id, `s${no}`)));
  masa.temeller.forEach((t, no) => t.forEach((k) => h.set(k.id, `t${no}`)));
  masa.acilan.forEach((k) => h.set(k.id, 'a'));
  masa.deste.forEach((k) => h.set(k.id, 'd'));
  return h;
};

// Kart (yer b) seçili yerin (a) içinde mi: aynı sütunda ve daha üstte, ya da aynı yığının üstü
function icindeMi(a: Yer | null | undefined, b: Yer | null): boolean {
  if (!a || !b || a.tur !== b.tur) return false;
  if (a.tur === 'sutun' && b.tur === 'sutun') return a.no === b.no && b.sira >= a.sira;
  if (a.tur === 'temel' && b.tur === 'temel') return a.no === b.no;
  return true; // ikisi de açılan
}

interface Ozellik {
  cekme: CekmeSayisi;
  anaEkran: () => void; // masadan çıkar; yarım el saklanır (7. paket)
  oyunSecimi: () => void; // oyun sonundan
  ayarlar: OyuncuAyarlari;
  ayarAc: () => void;
  devam?: YarimEl; // kaldığı yerden açılan el (7. paket)
  baslangic?: KlondikeMasasi; // yalnız geliştirmedeki deneme eli için
  gunluk?: GunlukEl; // günlük mücadele eli (8. paket): dağıtım günün sabit karıştırmasıyla
}

export function KlondikeMasa({ cekme, anaEkran, oyunSecimi, ayarlar, ayarAc, devam, baslangic, gunluk }: Ozellik) {
  // Günlük elde "Yeni el" aynı günün elini baştan dağıtır (8. paket)
  const dagitim = () => klondikeDagit(cekme, gunluk ? gunlukRastgele(gunluk) : undefined);
  const [masa, setMasa] = useState<KlondikeMasasi>(() => (devam?.masa as KlondikeMasasi | undefined) ?? baslangic ?? dagitim());
  const [el, setEl] = useState(0); // yeni elde kartlar yeniden dağıtılarak gelsin diye
  const [secim, setSecim] = useState<Yer | null>(null);
  const [surukleme, setSurukleme] = useState<Surukleme | null>(null);
  const [red, setRed] = useState<Yer | null>(null);
  const [uyari, setUyari] = useState<MetinAnahtari | null>(null);
  const [gecmis, setGecmis] = useState<KlondikeMasasi[]>([]); // geri al için önceki masalar
  const geriAlHak = useGeriAlHakki(devam?.hak);
  const [ipucu, setIpucu] = useState<{ ipucu: KlondikeIpucu; sayi: number } | null>(null);
  const ipucuSirasi = useRef(0); // arka arkaya basınca sıradaki ipucu
  const sonDokunus = useRef<{ id: string; zaman: number } | null>(null);
  // Masa ekranı doldurur; kart alanı bilgi satırı ile alt şerit arasındaki yükseklik (masaOrtak.tsx)
  const { masaRef, blokRef, alanRef, alan } = useMasaBlogu();
  const hareket = useHareket(alanRef);
  const kayan = useKayanlar();
  const oynanabilir = useMemo(() => oynanabilirKartlar(masa), [masa]);

  const kazandi = kazandiMi(masa);
  const { saniye, sifirla: sureyiSifirla } = useSure(kazandi, devam?.saniye);
  // Puan ve seri (6. paket; src/kart/puan.ts). El yarımken bırakmak seriyi bitirir.
  const puan = usePuan('klasik', masa.cekme, klondikeOzeti(masa, saniye), kazandi);
  // Kaldığı yerden devam ve istatistik (7. paket)
  const kayit = useElKaydi({ oyun: 'klasik', zorluk: masa.cekme, masa } as Parameters<typeof useElKaydi>[0], saniye, geriAlHak.hak, kazandi, !!devam, gunluk?.tarih);
  const gunlukSonuc = useGunlukYildiz(gunluk, kazandi);
  const birakma = useElBirakma(yarimMi(masa.hamle, kazandi), () => {
    puan.seriyiBitir();
    kayit.birak();
  });

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

  const { en: kartEn, boy: kartBoy } = kartOlcusu(alan.en, alan.tamBoy, KLONDIKE_SUTUN_SAYISI, ARALIK);
  const kose = Math.max(3, kartEn * 0.1);
  const sutunUstu = kartBoy + UST_ARALIK;
  const sutunAlani = alan.boy - sutunUstu;
  const aralik = ekranaGoreAralik(kartBoy, sutunAlani, {
    kapaliSayisi: BEKLENEN_KAPALI,
    acikSayisi: BEKLENEN_ACIK,
    enCokAcik: EN_COK_ACIK,
    enCokKapali: EN_COK_KAPALI,
  });
  const yelpazeAdim = kartEn * 0.32; // 3 kart çekmede açılan son üç kart yan yana kayar
  // Kart eni tam piksele yuvarlanınca artan pay sütun aralarına dağılır: sütunlar iki kenara eşit uzanır
  const ara = Math.max(ARALIK, (alan.en - kartEn * KLONDIKE_SUTUN_SAYISI) / (KLONDIKE_SUTUN_SAYISI - 1));
  const sutunX = (c: number) => c * (kartEn + ara);
  const ustSira = UST_SIRA[ayarlar.solEl ? 'sol' : 'sag'];
  const temelX = (no: number) => sutunX(ustSira.temel + no);

  // Her kartın yeri ve konumu. Uzun sütun alana sığsın diye sıkışır.
  const cizimler: Cizim[] = [];
  masa.temeller.forEach((t, no) =>
    t.forEach((k, i) =>
      cizimler.push({ k, yer: i === t.length - 1 ? { tur: 'temel', no } : null, x: temelX(no), y: 0, z: i }),
    ),
  );
  const yelpaze = masa.cekme === 3 ? Math.min(3, masa.acilan.length) : 1;
  masa.acilan.forEach((k, i) => {
    const kay = Math.max(0, i - (masa.acilan.length - yelpaze));
    const ust = i === masa.acilan.length - 1;
    cizimler.push({ k, yer: ust ? { tur: 'acilan' } : null, x: sutunX(ustSira.acilan) + kay * yelpazeAdim, y: 0, z: i });
  });
  masa.deste.forEach((k, i) => cizimler.push({ k, yer: null, x: sutunX(ustSira.deste), y: 0, z: i }));
  masa.sutunlar.forEach((s, no) => {
    const konum = sutunKonumlari(
      s.map((k) => k.acik),
      aralik,
      kartBoy,
      sutunAlani,
      kartBoy * EN_AZ_KAPALI,
    );
    s.forEach((k, sira) => {
      cizimler.push({ k, yer: { tur: 'sutun', no, sira }, x: sutunX(no), y: sutunUstu + konum[sira], z: sira });
    });
  });

  // Ekrandaki noktanın hedefi: üst sırada temel yığınlar, altında sütunlar
  const hedefBul = (istemciX: number, istemciY: number): Hedef | null => {
    const r = alanRef.current!.getBoundingClientRect();
    const c = Math.min(KLONDIKE_SUTUN_SAYISI - 1, Math.max(0, Math.floor((istemciX - r.left + ara / 2) / (kartEn + ara))));
    if (istemciY - r.top < kartBoy + UST_ARALIK / 2) {
      const t = c - ustSira.temel;
      return t >= 0 && t < TEMEL_TAKIMLARI.length ? { tur: 'temel' } : null;
    }
    return { tur: 'sutun', no: c };
  };
  const yerinHedefi = (yer: Yer): Hedef | null =>
    yer.tur === 'sutun' ? { tur: 'sutun', no: yer.no } : yer.tur === 'temel' ? { tur: 'temel' } : null;

  // Her hamlede önceki masa geçmişe girer
  const hamleYap = (yeni: KlondikeMasasi) => {
    setGecmis((g) => [...g, masa]);
    kayan.isaretle(yerler(masa), yerler(yeni));
    setMasa(yeni);
  };

  // Yeni elde sütunların kartları desteden teker teker gelir (kaldığı yerden açılan elde ve deneme
  // elinde değil). Hız Spider'ınkiyle aynı (src/kart/hareket.ts).
  const dagitilanEl = useRef(-1);
  useLayoutEffect(() => {
    if (!alan.olculdu || dagitilanEl.current === el) return;
    dagitilanEl.current = el;
    if (el === 0 && (devam || baslangic)) return;
    const sira = masa.sutunlar
      .flatMap((s, c) => s.map((k, i) => ({ id: k.id, n: i * KLONDIKE_SUTUN_SAYISI + c })))
      .sort((a, b) => a.n - b.n)
      .map((a) => a.id);
    const kimden = { x: sutunX(ustSira.deste), y: 0 };
    hareket.baslat(sira.map((id, j) => ({ id, kimden, gecikme: j * DAGITIM_ADIMI, sure: HAREKET.ucus })));
  }, [el, alan.olculdu]);

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
    hareket.bitir();
    setMasa(dagitim());
    setEl((e) => e + 1);
    setGecmis([]);
    geriAlHak.yeniEl(); // haklar her elde baştan
    puan.yeniEl();
    kayit.yeniEl();
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
    // Dokunuş. Çift dokunuş (Kemal, 15 Kasım): kart önce uygun temel yığına, gidemiyorsa uygun bir
    // sütuna kayar; gidecek yer yoksa sallanır.
    const simdi = Date.now();
    const onceki = sonDokunus.current;
    sonDokunus.current = { id: c.k.id, zaman: simdi };
    const { yer } = c;
    if (yer && onceki && onceki.id === c.k.id && simdi - onceki.zaman < CIFT_DOKUNMA) {
      sonDokunus.current = null;
      setSecim(null);
      const hedef = tasinabilirMi(masa, yer) ? ciftDokunusHedefi(masa, yer) : null;
      const sonuc = hedef && tasi(masa, yer, hedef);
      if (sonuc) hamleYap(sonuc);
      else if (c.k.acik) setRed(yer);
      return;
    }
    const ayniYigin =
      secim && yer && (secim.tur === yer.tur && (yer.tur !== 'sutun' || (secim.tur === 'sutun' && secim.no === yer.no)));
    const hedef = yer ? yerinHedefi(yer) : null;
    if (secim && !ayniYigin && hedef) {
      sonDokunus.current = null; // bu dokunuş bir taşımaydı
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
    <main className="masa" ref={masaRef}>
      <div className="masa-blok" ref={blokRef} style={masaPayi(kartBoy)}>
      <BilgiSatiri
        saniye={saniye}
        baslik={m('masa.baslikKlasik', masa.cekme)}
        hamle={masa.hamle}
        puan={puan.puan}
        asama={puan.asama}
        ayarlar={ayarlar}
        ayarAc={ayarAc}
        gunluk={gunluk && tarihYazisi(gunluk.tarih, true)}
      />

      <div className="oyun-alani" ref={alanRef} onPointerUp={alaniBirak}>
        {TEMEL_TAKIMLARI.map((t, no) => (
          <div
            key={`temel-${t}`}
            className={`yuva temel ${secim && secim.tur !== 'temel' ? 'hedef' : ''} ${
              ipTemel === no && masa.temeller[no].length === 0 ? 'ipucu' : ''
            }`}
            style={{ left: temelX(no), width: kartEn, height: kartBoy, borderRadius: kose, fontSize: kartEn * 0.5 }}
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
        <div className={`yuva deste-yuvasi ${desteDurumu === 'bos' ? 'bos' : ''}`} style={{ left: sutunX(ustSira.deste), width: kartEn, height: kartBoy, borderRadius: kose }}>
          {desteDurumu === 'dondur' && (
            <svg className="simge buyuk" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.5h-2.5" />
            </svg>
          )}
        </div>

        <div key={el} className="kart-katmani" style={{ '--kayma': `${HAREKET.kayma}ms` } as CSSProperties}>
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
              // O an hiçbir yere gidemeyen açık kart biraz koyu (ayar; kurallar src/kart/klondike.ts)
              const soluk = ayarlar.koyulastir && c.k.acik && !oynanabilir.has(c.k.id);
              const sinif = [
                'kart-yeri',
                c.yer ? '' : 'sabit',
                tasinan ? 'tasiniyor' : '',
                icindeMi(secim, c.yer) ? 'secili' : '',
                icindeMi(red, c.yer) ? 'reddedildi' : '',
                ipucuMu(c) ? 'ipucu' : '',
                soluk ? 'soluk' : '',
              ].join(' ');
              return (
                <div
                  key={c.k.id}
                  data-kart={c.k.id}
                  className={sinif}
                  style={{
                    transform: konumYazisi(left, top),
                    zIndex: tasinan ? 500 + c.z : kayan.kayanlar.has(c.k.id) ? 300 + c.z : c.z,
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
          style={{ left: sutunX(ustSira.deste), width: kartEn, height: kartBoy, borderRadius: kose }}
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
        solEl={ayarlar.solEl}
        geriAl={geriAlBas}
        geriAlKapali={gecmis.length === 0}
        kalanHak={geriAlHak.hak.kalan}
        ipucu={ipucuBas}
        yeniEl={() => birakma.sor(yeniEl)}
        anaEkran={anaEkran}
      />
      </div>

      {/* Dağıtım sürerken dokunma kapalı; masaya tek dokunuş dağıtımı hemen bitirir */}
      {hareket.kilitli && <HareketKalkani bitir={hareket.bitir} />}

      {birakma.soruAcik && <ElBirakmaSorusu evet={birakma.evet} hayir={birakma.hayir} />}

      {geriAlHak.kutu && <ReklamKutusu kapat={geriAlHak.kutuyuKapat} hakAl={geriAlHak.reklamlaAl} />}

      {kazandi && (
        <OyunSonu altBaslik={m('masa.baslikKlasik', masa.cekme)} saniye={saniye} hamle={masa.hamle} puan={puan.sonuc} yeniEl={yeniEl} geri={oyunSecimi} gunluk={gunlukSonuc} />
      )}
    </main>
  );
}
