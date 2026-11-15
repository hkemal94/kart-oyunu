import { useState } from 'react';
import { Acilis } from './ekranlar/Acilis';
import { OyunSecimi } from './ekranlar/OyunSecimi';
import { Masa } from './ekranlar/Masa';
import { KlondikeMasa } from './ekranlar/KlondikeMasa';
import type { RenkSayisi } from './kart/kart';
import type { CekmeSayisi } from './kart/klondike';
import { denemeMasasi, klondikeDenemesi, type DenemeTuru, type KlondikeDenemeTuru } from './kart/deneme';

type Ekran = 'acilis' | 'secim' | 'spider' | 'klasik';

// Yalnız geliştirmede: adres sonuna ?deneme=kazan, ?deneme=dizi, ?deneme=klasik-kazan ya da
// ?deneme=klasik-orta yazılınca hazır bir el doğrudan masada açılır (ekran görüntüsü ve elle
// deneme için). Yayındaki oyunda çalışmaz.
function denemeOku() {
  if (!import.meta.env.DEV) return null;
  const tur = new URLSearchParams(location.search).get('deneme');
  if (tur === 'kazan' || tur === 'dizi') return { oyun: 'spider' as const, ...denemeMasasi(tur as DenemeTuru) };
  if (tur === 'klasik-kazan' || tur === 'klasik-orta') {
    return { oyun: 'klasik' as const, ...klondikeDenemesi(tur as KlondikeDenemeTuru) };
  }
  return null;
}

// Ekranlar arası geçiş (belge 2): açılış → oyun seçimi → masa (Spider ya da klasik solitaire).
export function Uygulama() {
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
        />
      )}
      {ekran === 'spider' && (
        <Masa
          renk={renk}
          geri={() => setEkran('secim')}
          baslangic={deneme?.oyun === 'spider' ? deneme.masa : undefined}
        />
      )}
      {ekran === 'klasik' && (
        <KlondikeMasa
          cekme={cekme}
          geri={() => setEkran('secim')}
          baslangic={deneme?.oyun === 'klasik' ? deneme.masa : undefined}
        />
      )}
    </div>
  );
}
