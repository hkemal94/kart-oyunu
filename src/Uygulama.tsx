import { useEffect, useState } from 'react';
import { Acilis } from './ekranlar/Acilis';
import { OyunSecimi } from './ekranlar/OyunSecimi';
import { Masa } from './ekranlar/Masa';
import { KlondikeMasa } from './ekranlar/KlondikeMasa';
import { AnaEkran } from './ekranlar/AnaEkran';
import { Ben, type BenSayfasi } from './ekranlar/Ben';
import { Mucadeleler, SekmeCubugu, type Sekme } from './ekranlar/Sekmeler';
import { ElBirakmaSorusu } from './ekranlar/masaOrtak';
import { kayitOku, kayitYaz, puanAdayi, puanAnahtari, seriBitir } from './kart/puan';
import { sonSecimOku, sonSecimYaz, type SonSecim } from './oyun/sonSecim';
import { yarimElOku, yarimElSil, type YarimEl } from './oyun/yarimEl';
import { Ayarlar } from './ekranlar/Ayarlar';
import { dilSec } from './metinler';
import { ayarlariOku, ayarlariYaz, ilkDil, type OyuncuAyarlari } from './oyun/oyuncuAyarlari';
import { denemeMasasi, klondikeDenemesi, type DenemeTuru, type KlondikeDenemeTuru } from './kart/deneme';

type Ekran = 'acilis' | 'sekmeler' | 'secim' | 'spider' | 'klasik';

// Yalnız geliştirmede: adres sonuna ?deneme=kazan, ?deneme=dizi, ?deneme=uzun, ?deneme=klasik-kazan ya da
// ?deneme=klasik-orta yazılınca hazır bir el doğrudan masada açılır (ekran görüntüsü ve elle
// deneme için). Yayındaki oyunda çalışmaz.
function denemeOku() {
  if (!import.meta.env.DEV) return null;
  const tur = new URLSearchParams(location.search).get('deneme');
  if (tur === 'kazan' || tur === 'dizi' || tur === 'uzun') return { oyun: 'spider' as const, ...denemeMasasi(tur as DenemeTuru) };
  if (tur === 'klasik-kazan' || tur === 'klasik-orta') {
    return { oyun: 'klasik' as const, ...klondikeDenemesi(tur as KlondikeDenemeTuru) };
  }
  return null;
}

// Açılışta ayarlar okunur ve dil seçilir (ilk çizimden önce)
function ilkAyarlar(): OyuncuAyarlari {
  const a = ayarlariOku(localStorage);
  dilSec(ilkDil(location.search, a.dil, navigator.language));
  return a;
}

// Ekranlar arası geçiş (belge 2; 7. paket): açılış → sekmeler (Ana ekran · Mücadeleler · Ben) →
// oyun seçimi → masa (Spider ya da klasik solitaire). Masada alt sekmeler görünmez; masadan
// "Ana ekran" ile çıkınca sekmeler geri gelir, yarım el saklanır. Ayarlar (5. paket) her ekranın
// üstüne açılır; kapanınca altta kalan ekran olduğu gibi sürer.
export function Uygulama() {
  const [ayarlar, setAyarlar] = useState(ilkAyarlar);
  const [ayarAcik, setAyarAcik] = useState(false);
  const ayarDegistir = (yeni: Partial<OyuncuAyarlari>) => {
    const a = { ...ayarlar, ...yeni };
    if (yeni.dil) dilSec(yeni.dil); // bütün yazılar anında değişir
    ayarlariYaz(localStorage, a);
    setAyarlar(a);
  };
  const ayarAc = () => setAyarAcik(true);

  const [deneme] = useState(denemeOku);
  const [ekran, setEkran] = useState<Ekran>(deneme ? deneme.oyun : 'acilis');
  const [sekme, setSekme] = useState<Sekme>('ana');
  const [benSayfa, setBenSayfa] = useState<BenSayfasi | null>(null);
  const [secim, setSecim] = useState<SonSecim>(() => {
    const s = sonSecimOku(localStorage);
    if (deneme?.oyun === 'spider') return { ...s, oyun: 'spider', renk: deneme.renk };
    if (deneme?.oyun === 'klasik') return { ...s, oyun: 'klasik', cekme: deneme.masa.cekme };
    return s;
  });
  const secimDegistir = (yeni: Partial<SonSecim>) => {
    const s = { ...secim, ...yeni };
    sonSecimYaz(localStorage, s);
    setSecim(s);
  };

  // Kaldığı yerden devam: saklanan yarım el masadan dönünce yeniden okunur (masa çıkarken yazar)
  const [yarimEl, setYarimEl] = useState<YarimEl | null>(() => yarimElOku(localStorage));
  useEffect(() => {
    if (ekran === 'sekmeler') setYarimEl(yarimElOku(localStorage));
  }, [ekran]);
  const [devam, setDevam] = useState<YarimEl | undefined>(undefined);
  const [elNo, setElNo] = useState(0); // her açılışta masa baştan kurulsun
  const [birakSoru, setBirakSoru] = useState(false);

  const anaEkranaDon = () => {
    setSekme('ana');
    setBenSayfa(null);
    setEkran('sekmeler');
  };
  const masayaGit = (oyun: 'spider' | 'klasik', d?: YarimEl) => {
    setDevam(d);
    setElNo((n) => n + 1);
    setEkran(oyun);
  };
  const devamEt = () => {
    const y = yarimElOku(localStorage);
    if (!y) return setYarimEl(null);
    secimDegistir(y.oyun === 'spider' ? { oyun: 'spider', renk: y.zorluk } : { oyun: 'klasik', cekme: y.zorluk });
    masayaGit(y.oyun, y);
  };
  // "Yeni oyun": oyun seçimine gider; yarım el varken önce eli bırakma sorusu (belge 2)
  const yeniOyun = () => (yarimEl ? setBirakSoru(true) : setEkran('secim'));
  const eliBirak = () => {
    const y = yarimElOku(localStorage);
    if (y) {
      // Bırakılan el kaybedilmiş sayılır: o oyun ve zorluğun serisi biter (8.3)
      const aday = puanAdayi(location.search);
      kayitYaz(localStorage, aday, seriBitir(kayitOku(localStorage, aday), puanAnahtari(y.oyun, y.zorluk)));
    }
    yarimElSil(localStorage);
    setYarimEl(null);
    setBirakSoru(false);
    setEkran('secim');
  };

  const sekmeSec = (s: Sekme) => {
    setSekme(s);
    setBenSayfa(null);
    setEkran('sekmeler');
  };
  const masada = ekran === 'spider' || ekran === 'klasik';

  return (
    <div className="cerceve">
      {ekran === 'acilis' && <Acilis basla={anaEkranaDon} />}
      {ekran === 'sekmeler' && sekme === 'ana' && (
        <AnaEkran secim={secim} yarimEl={yarimEl} devamEt={devamEt} yeniOyun={yeniOyun} />
      )}
      {ekran === 'sekmeler' && sekme === 'mucadeleler' && <Mucadeleler />}
      {ekran === 'sekmeler' && sekme === 'ben' && <Ben sayfa={benSayfa} sayfaAc={setBenSayfa} ayarAc={ayarAc} />}
      {ekran === 'secim' && (
        <OyunSecimi
          renk={secim.renk}
          renkSec={(renk) => secimDegistir({ renk })}
          spiderBasla={() => {
            secimDegistir({ oyun: 'spider' });
            masayaGit('spider');
          }}
          cekme={secim.cekme}
          cekmeSec={(cekme) => secimDegistir({ cekme })}
          klasikBasla={() => {
            secimDegistir({ oyun: 'klasik' });
            masayaGit('klasik');
          }}
          ayarAc={ayarAc}
          istatistikAc={() => {
            setSekme('ben');
            setBenSayfa('istatistik');
            setEkran('sekmeler');
          }}
        />
      )}
      {ekran === 'spider' && (
        <Masa
          key={elNo}
          renk={secim.renk}
          anaEkran={anaEkranaDon}
          oyunSecimi={() => setEkran('secim')}
          ayarlar={ayarlar}
          ayarAc={ayarAc}
          devam={devam?.oyun === 'spider' ? devam : undefined}
          baslangic={deneme?.oyun === 'spider' && elNo === 0 ? deneme.masa : undefined}
        />
      )}
      {ekran === 'klasik' && (
        <KlondikeMasa
          key={elNo}
          cekme={secim.cekme}
          anaEkran={anaEkranaDon}
          oyunSecimi={() => setEkran('secim')}
          ayarlar={ayarlar}
          ayarAc={ayarAc}
          devam={devam?.oyun === 'klasik' ? devam : undefined}
          baslangic={deneme?.oyun === 'klasik' && elNo === 0 ? deneme.masa : undefined}
        />
      )}
      {!masada && ekran !== 'acilis' && (
        <SekmeCubugu secili={ekran === 'secim' ? 'ana' : sekme} sec={sekmeSec} />
      )}
      {birakSoru && <ElBirakmaSorusu evet={eliBirak} hayir={() => setBirakSoru(false)} />}
      {ayarAcik && <Ayarlar ayarlar={ayarlar} degistir={ayarDegistir} kapat={() => setAyarAcik(false)} />}
    </div>
  );
}
