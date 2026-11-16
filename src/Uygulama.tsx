import { useEffect, useState } from 'react';
import { Acilis } from './ekranlar/Acilis';
import { OyunSecimi } from './ekranlar/OyunSecimi';
import { Masa } from './ekranlar/Masa';
import { KlondikeMasa } from './ekranlar/KlondikeMasa';
import { AnaEkran } from './ekranlar/AnaEkran';
import { Ben, type BenSayfasi } from './ekranlar/Ben';
import { SekmeCubugu, type Sekme } from './ekranlar/Sekmeler';
import { Mucadeleler, zorlukSec } from './ekranlar/Gunluk';
import {
  ayniElMi,
  gunlukYarimElOku,
  gunlukYarimElSil,
  gunlukYaz,
  takvimAyi,
  tarihOku,
  tarihtenBugun,
  type GunlukEl,
} from './oyun/gunluk';
import { ElBirakmaSorusu } from './ekranlar/masaOrtak';
import { kayitOku, kayitYaz, puanAnahtari, seriBitir } from './kart/puan';
import { GUNLUK_SECIM_ANAHTARI, sonSecimOku, sonSecimYaz, type SonSecim } from './oyun/sonSecim';
import { yarimElOku, yarimElSil, type YarimEl } from './oyun/yarimEl';
import { Ayarlar } from './ekranlar/Ayarlar';
import { dilSec } from './metinler';
import { ayarlariOku, ayarlariYaz, ilkDil, type OyuncuAyarlari } from './oyun/oyuncuAyarlari';
import { denemeMasasi, gunlukDenemesi, klondikeDenemesi, pulDenemesi, type DenemeTuru, type KlondikeDenemeTuru } from './kart/deneme';

type Ekran = 'acilis' | 'sekmeler' | 'secim' | 'spider' | 'klasik';

// Yalnız geliştirmede: adres sonuna ?deneme=kazan, ?deneme=dizi, ?deneme=uzun, ?deneme=cift, ?deneme=klasik-kazan ya da
// ?deneme=klasik-orta (ya da ?deneme=klasik-bitir: bitmeye yakın el, 4. paket) yazılınca hazır bir el doğrudan masada açılır (ekran görüntüsü ve elle
// deneme için). ?deneme=gunluk-kazan bugünün günlük eli olarak bir hamlede biten Spider'ı açar;
// ?deneme=takvim takvime hazır yıldızlar koyar (8. paket); ?deneme=pullar pul koleksiyonu için
// hazır yıldızlar koyar (Ben → Ödüller → Pul koleksiyonu). Yayındaki oyunda çalışmaz.
function denemeOku() {
  if (!import.meta.env.DEV) return null;
  const tur = new URLSearchParams(location.search).get('deneme');
  if (tur === 'takvim' || tur === 'gunluk-kazan') gunlukYaz(localStorage, gunlukDenemesi(tarihtenBugun()));
  if (tur === 'pullar') gunlukYaz(localStorage, pulDenemesi(tarihtenBugun()));
  if (tur === 'gunluk-kazan') return { oyun: 'spider' as const, gunluk: true, ...denemeMasasi('kazan') };
  if (tur === 'kazan' || tur === 'dizi' || tur === 'uzun' || tur === 'cift') return { oyun: 'spider' as const, ...denemeMasasi(tur as DenemeTuru) };
  if (tur === 'klasik-kazan' || tur === 'klasik-orta' || tur === 'klasik-bitir') {
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

  // Günlük mücadele (8. paket): masadaki el günlükse onun günü, oyunu ve zorluğu
  const [gunluk, setGunluk] = useState<GunlukEl | undefined>(() =>
    deneme && 'gunluk' in deneme ? { tarih: tarihtenBugun(), oyun: 'spider', zorluk: deneme.renk } : undefined,
  );
  const [gunlukSecim, setGunlukSecim] = useState<SonSecim>(() => sonSecimOku(localStorage, GUNLUK_SECIM_ANAHTARI));
  const gunlukSecimDegistir = (yeni: Partial<SonSecim>) => {
    const s = { ...gunlukSecim, ...yeni };
    sonSecimYaz(localStorage, s, GUNLUK_SECIM_ANAHTARI);
    setGunlukSecim(s);
  };
  const [seciliGun, setSeciliGun] = useState(tarihtenBugun);
  const ayi = (tarih: string) => {
    const { yil, ay } = tarihOku(tarih);
    return { yil, ay };
  };
  const [gorulenAy, setGorulenAy] = useState(() => ayi(tarihtenBugun()));
  // Başka bir günlük yarım el varken yeni günlük el: önce eli bırakma sorusu (bekleyen el burada)
  const [gunlukBirak, setGunlukBirak] = useState<GunlukEl | null>(null);

  const anaEkranaDon = () => {
    setSekme('ana');
    setBenSayfa(null);
    setEkran('sekmeler');
  };
  const masayaGit = (oyun: 'spider' | 'klasik', d?: YarimEl, g?: GunlukEl) => {
    setDevam(d);
    setGunluk(g);
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
      kayitYaz(localStorage, seriBitir(kayitOku(localStorage), puanAnahtari(y.oyun, y.zorluk)));
    }
    yarimElSil(localStorage);
    setYarimEl(null);
    setBirakSoru(false);
    setEkran('secim');
  };

  // Günlük el: o günün yarım eli varsa kaldığı yerden; başka bir günlük yarım el varsa önce soru
  const gunlukBaslat = (el: GunlukEl) => {
    setGunlukBirak(null);
    masayaGit(el.oyun, undefined, el);
  };
  const gunlukOyna = (el: GunlukEl) => {
    setSeciliGun(el.tarih);
    const y = gunlukYarimElOku(localStorage);
    if (y && ayniElMi(y, el)) return masayaGit(el.oyun, y.el, el);
    if (y) return setGunlukBirak(el);
    gunlukBaslat(el);
  };
  // Bırakılan günlük el kaybedilmiş sayılır: o oyun ve zorluğun serisi biter (8.3)
  const gunlukEliBirak = () => {
    const y = gunlukYarimElOku(localStorage);
    if (y) {
      kayitYaz(localStorage, seriBitir(kayitOku(localStorage), puanAnahtari(y.el.oyun, y.el.zorluk)));
    }
    gunlukYarimElSil(localStorage);
    if (gunlukBirak) gunlukBaslat(gunlukBirak);
  };
  // Ana ekrandaki günün kartı: bugünün yarım eli varsa o, yoksa son günlük seçimle bugünün eli
  const bugunuOyna = () => {
    const bugun = tarihtenBugun();
    const y = gunlukYarimElOku(localStorage);
    if (y && y.tarih === bugun) return gunlukOyna({ tarih: bugun, oyun: y.el.oyun, zorluk: y.el.zorluk });
    gunlukOyna({ tarih: bugun, oyun: gunlukSecim.oyun, zorluk: zorlukSec(gunlukSecim) });
  };
  const takvimeDon = () => {
    if (gunluk) {
      setSeciliGun(gunluk.tarih);
      setGorulenAy(ayi(gunluk.tarih));
    }
    setSekme('mucadeleler');
    setBenSayfa(null);
    setEkran('sekmeler');
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
        <AnaEkran
          secim={secim}
          yarimEl={yarimEl}
          devamEt={devamEt}
          yeniOyun={yeniOyun}
          gunlukOyna={bugunuOyna}
          takvim={() => {
            setSeciliGun(tarihtenBugun());
            setGorulenAy(ayi(tarihtenBugun()));
            sekmeSec('mucadeleler');
          }}
        />
      )}
      {ekran === 'sekmeler' && sekme === 'mucadeleler' && (
        <Mucadeleler
          gorulenAy={gorulenAy}
          ayDegistir={(a) => setGorulenAy(takvimAyi(a.yil, a.ay))}
          seciliGun={seciliGun}
          gunSec={setSeciliGun}
          secim={(() => {
            // Seçili günün yarım eli varsa onun oyunu ve zorluğu seçili gelir
            const y = gunlukYarimElOku(localStorage);
            if (!y || y.tarih !== seciliGun) return gunlukSecim;
            return y.el.oyun === 'spider' ? { ...gunlukSecim, oyun: 'spider', renk: y.el.zorluk } : { ...gunlukSecim, oyun: 'klasik', cekme: y.el.zorluk };
          })()}
          secimDegistir={gunlukSecimDegistir}
          oyna={gunlukOyna}
        />
      )}
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
          renk={gunluk ? (gunluk.zorluk as SonSecim['renk']) : secim.renk}
          anaEkran={anaEkranaDon}
          oyunSecimi={gunluk ? takvimeDon : () => setEkran('secim')}
          gunluk={gunluk}
          ayarlar={ayarlar}
          ayarAc={ayarAc}
          devam={devam?.oyun === 'spider' ? devam : undefined}
          baslangic={deneme?.oyun === 'spider' && elNo === 0 ? deneme.masa : undefined}
        />
      )}
      {ekran === 'klasik' && (
        <KlondikeMasa
          key={elNo}
          cekme={gunluk ? (gunluk.zorluk as SonSecim['cekme']) : secim.cekme}
          anaEkran={anaEkranaDon}
          oyunSecimi={gunluk ? takvimeDon : () => setEkran('secim')}
          gunluk={gunluk}
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
      {gunlukBirak && <ElBirakmaSorusu evet={gunlukEliBirak} hayir={() => setGunlukBirak(null)} />}
      {ayarAcik && <Ayarlar ayarlar={ayarlar} degistir={ayarDegistir} kapat={() => setAyarAcik(false)} />}
    </div>
  );
}
