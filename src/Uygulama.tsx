import { useState } from 'react';
import { Acilis } from './ekranlar/Acilis';
import { OyunSecimi } from './ekranlar/OyunSecimi';
import { Masa } from './ekranlar/Masa';
import type { RenkSayisi } from './kart/kart';
import { denemeMasasi, type DenemeTuru } from './kart/deneme';

type Ekran = 'acilis' | 'secim' | 'masa';

// Yalnız geliştirmede: adres sonuna ?deneme=kazan ya da ?deneme=dizi yazılınca hazır bir el
// doğrudan masada açılır (ekran görüntüsü ve elle deneme için). Yayındaki oyunda çalışmaz.
function denemeOku() {
  if (!import.meta.env.DEV) return null;
  const tur = new URLSearchParams(location.search).get('deneme');
  return tur === 'kazan' || tur === 'dizi' ? denemeMasasi(tur as DenemeTuru) : null;
}

// Ekranlar arası geçiş (belge 2): açılış → oyun seçimi → masa.
export function Uygulama() {
  const [deneme] = useState(denemeOku);
  const [ekran, setEkran] = useState<Ekran>(deneme ? 'masa' : 'acilis');
  const [renk, setRenk] = useState<RenkSayisi>(deneme?.renk ?? 1);

  return (
    <div className="cerceve">
      {ekran === 'acilis' && <Acilis basla={() => setEkran('secim')} />}
      {ekran === 'secim' && (
        <OyunSecimi
          renk={renk}
          renkSec={setRenk}
          spiderBasla={() => setEkran('masa')}
        />
      )}
      {ekran === 'masa' && (
        <Masa renk={renk} geri={() => setEkran('secim')} baslangic={deneme?.masa} />
      )}
    </div>
  );
}
