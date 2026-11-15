import { useEffect, useRef, useState } from 'react';
import { m, sayi } from '../metinler';
import { geriAlHakkiAl } from '../reklam/geriAlHakki';
import type { OyuncuAyarlari } from '../oyun/oyuncuAyarlari';
import { hakBaslat, hakKullan, reklamHakkiEkle, yeniElHakki, type GeriAlHakki } from '../kart/geriAlHakki';
import {
  elKazanildi,
  elPuani,
  kayitOku,
  kayitYaz,
  puanAdayi,
  puanAnahtari,
  seriBitir,
  seriOku,
  type ElOzeti,
  type KazancSonucu,
  type Oyun,
} from '../kart/puan';

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

// Puan ve seri (yol haritası 6; belge 8.3). Kurallar ve üç aday src/kart/puan.ts'te; aday adresten
// seçilir (?puan=a|b|c). Seri ve en iyi puan telefonun tarayıcısında saklanır.
export function usePuan(oyun: Oyun, zorluk: number, ozet: ElOzeti, kazandi: boolean) {
  const [aday] = useState(() => puanAdayi(location.search));
  const anahtar = puanAnahtari(oyun, zorluk);
  const [kayit, setKayit] = useState(() => kayitOku(localStorage, aday));
  const [sonuc, setSonuc] = useState<KazancSonucu | null>(null);
  const yazildi = useRef(false); // bir el yalnız bir kez kazanılır

  const kaydet = (k: typeof kayit) => {
    setKayit(k);
    kayitYaz(localStorage, aday, k);
  };

  useEffect(() => {
    if (!kazandi || yazildi.current) return;
    yazildi.current = true;
    const s = elKazanildi(kayitOku(localStorage, aday), anahtar, aday, ozet);
    kaydet(s.kayit);
    setSonuc(s);
  }, [kazandi]);

  const seri = seriOku(kayit, anahtar);
  return {
    sonuc,
    // Masada görünen: biriken seri puanı ve bu elin "şimdi bitse" puanı; el kazanılınca kesin puan
    puan: sonuc ? sonuc.seriPuani : seri.puan + elPuani(aday, ozet, seri.asama, false),
    asama: seri.asama,
    // El yarımken bırakıldı (ya da kaybedildi): seri biter
    seriyiBitir: () => kaydet(seriBitir(kayitOku(localStorage, aday), anahtar)),
    // Yeni el: kazanılan elden sonra seri sürer
    yeniEl: () => {
      yazildi.current = false;
      setSonuc(null);
    },
  };
}

// El yarımken "Yeni el" ya da "Oyun seçimi"ne basınca: önce soru (belge 2, "Eli bırakma").
// Evet denirse el kaybedilmiş sayılır, seri biter. Hamle yapılmadıysa ya da el bittiyse soru yok.
export function useElBirakma(yarim: boolean, seriyiBitir: () => void) {
  const [bekleyen, setBekleyen] = useState<(() => void) | null>(null);
  return {
    soruAcik: bekleyen !== null,
    sor: (is: () => void) => {
      if (yarim) setBekleyen(() => is);
      else is();
    },
    evet: () => {
      seriyiBitir();
      bekleyen?.();
      setBekleyen(null);
    },
    hayir: () => setBekleyen(null),
  };
}

export function ElBirakmaSorusu({ evet, hayir }: { evet: () => void; hayir: () => void }) {
  return (
    <div className="oyun-sonu hizli" onClick={hayir}>
      <section
        className="oyun-sonu-kutu"
        role="alertdialog"
        aria-label={m('masa.birak.soru')}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="birak-soru">{m('masa.birak.soru')}</p>
        <div className="birak-dugmeler">
          <button className="dugme ikincil" onClick={hayir}>
            {m('masa.birak.hayir')}
          </button>
          <button className="dugme ana" onClick={evet}>
            {m('masa.birak.evet')}
          </button>
        </div>
      </section>
    </div>
  );
}

// Üst bilgi satırı: süre, hamle, başlık, puan ve aşama (tek satır, kompakt), sonda küçük ayar
// düğmesi. Ayarlarda "sayaçları gizle" açıksa süre ve hamle, "her hamlede puanı göster" kapalıysa
// puan ve aşama görünmez (5. paket).
export function BilgiSatiri(o: {
  saniye: number;
  baslik: string;
  hamle: number;
  puan: number;
  asama: number;
  ayarlar: OyuncuAyarlari;
  ayarAc: () => void;
}) {
  const sayac = !o.ayarlar.sayaclariGizle;
  const puan = o.ayarlar.puaniGoster;
  return (
    <header className="masa-bilgi">
      {sayac && <span>{m('masa.sure', sureYazisi(o.saniye))}</span>}
      {sayac && <span>{m('masa.hamle', o.hamle)}</span>}
      <span className="masa-bilgi-baslik">{o.baslik}</span>
      {puan && <span>{m('masa.puan', sayi(o.puan))}</span>}
      {puan && <span>{m('masa.asama', o.asama)}</span>}
      <button className="ayar-dugmesi" onClick={o.ayarAc} aria-label={m('masa.ayarlar')}>
        <svg className="simge" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2.5 4.5h7M12.5 4.5h1M2.5 11.5h1M6.5 11.5h7" />
          <circle cx="11" cy="4.5" r="1.5" />
          <circle cx="5" cy="11.5" r="1.5" />
        </svg>
      </button>
    </header>
  );
}

// Alt şerit (yol haritası 4): geri al, ipucu, yeni el, oyun seçimi. Simgeler kodla çizilir.
// Sol el düzeninde (5. paket) sıra ayna gibi ters döner; deste de öbür yana geçer.
export function MasaDugmeleri(o: {
  solEl: boolean;
  geriAl: () => void;
  geriAlKapali: boolean;
  kalanHak: number;
  ipucu: () => void;
  yeniEl: () => void;
  geri: () => void;
}) {
  return (
    <nav className={`masa-dugmeler ${o.solEl ? 'sol-el' : ''}`}>
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

// Oyun sonu: süre, hamle, puan (bu el, seri, yeni aşama, yeni en iyi), "Yeni el", "Oyun seçimi"
// (belge 2 ve 8.3). "Yeni el" serinin bir sonraki elidir.
export function OyunSonu(o: {
  altBaslik: string;
  saniye: number;
  hamle: number;
  puan: KazancSonucu | null;
  yeniEl: () => void;
  geri: () => void;
}) {
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
        {o.puan && (
          <>
            <dl className="puanlar">
              <div>
                <dt>{m('sonu.elPuani')}</dt>
                <dd>+{sayi(o.puan.elPuani)}</dd>
              </div>
              <div>
                <dt>{m('sonu.seriPuani')}</dt>
                <dd>{sayi(o.puan.seriPuani)}</dd>
              </div>
              <div>
                <dt>{m('sonu.asama')}</dt>
                <dd>{o.puan.yeniAsama}</dd>
              </div>
            </dl>
            {o.puan.yeniEnIyi && <p className="yeni-en-iyi">{m('sonu.yeniEnIyi')}</p>}
          </>
        )}
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
