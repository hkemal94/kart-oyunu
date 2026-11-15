import { useState } from 'react';
import { Acilis } from './ekranlar/Acilis';
import { OyunSecimi } from './ekranlar/OyunSecimi';
import { Masa } from './ekranlar/Masa';
import { KlondikeMasa } from './ekranlar/KlondikeMasa';
import type { RenkSayisi } from './kart/kart';
import type { CekmeSayisi } from './kart/klondike';
import { Ayarlar } from './ekranlar/Ayarlar';
import { dilSec } from './metinler';
import { ayarlariOku, ayarlariYaz, ilkDil, type OyuncuAyarlari } from './oyun/oyuncuAyarlari';
import { denemeMasasi, klondikeDenemesi, type DenemeTuru, type KlondikeDenemeTuru } from './kart/deneme';

type Ekran = 'acilis' | 'secim' | 'spider' | 'klasik';

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

// Ekranlar arası geçiş (belge 2): açılış → oyun seçimi → masa (Spider ya da klasik solitaire).
// Ayarlar (5. paket) her ekranın üstüne açılır; kapanınca altta kalan ekran olduğu gibi sürer.
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
  const [renk, setRenk] = useState<RenkSayisi>(deneme?.oyun === 'spider' ? deneme.renk : 1);
  const [cekme, setCekme] = useState<CekmeSayisi>(deneme?.oyun === 'klasik' ? deneme.masa.cekme : 1);

  return (
    <div className="cerceve">
      {ekran === 'acilis' && <Acilis basla={() => setEkran('secim')} />}
      {ekran === 'secim' && (
        <OyunSecimi
          renk={renk}
          renkSec={setRenk}
          spiderBasla={() => setEkran('spider')}
          cekme={cekme}
          cekmeSec={setCekme}
          klasikBasla={() => setEkran('klasik')}
          ayarAc={ayarAc}
        />
      )}
      {ekran === 'spider' && (
        <Masa
          renk={renk}
          geri={() => setEkran('secim')}
          ayarlar={ayarlar}
          ayarAc={ayarAc}
          baslangic={deneme?.oyun === 'spider' ? deneme.masa : undefined}
        />
      )}
      {ekran === 'klasik' && (
        <KlondikeMasa
          cekme={cekme}
          geri={() => setEkran('secim')}
          ayarlar={ayarlar}
          ayarAc={ayarAc}
          baslangic={deneme?.oyun === 'klasik' ? deneme.masa : undefined}
        />
      )}
      {ayarAcik && <Ayarlar ayarlar={ayarlar} degistir={ayarDegistir} kapat={() => setAyarAcik(false)} />}
    </div>
  );
}
