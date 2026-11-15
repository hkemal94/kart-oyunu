import { useState } from 'react';
import { Acilis } from './ekranlar/Acilis';
import { OyunSecimi } from './ekranlar/OyunSecimi';
import { Masa } from './ekranlar/Masa';
import type { RenkSayisi } from './kart/kart';

type Ekran = 'acilis' | 'secim' | 'masa';

// Ekranlar arası geçiş (belge 2): açılış → oyun seçimi → masa.
export function Uygulama() {
  const [ekran, setEkran] = useState<Ekran>('acilis');
  const [renk, setRenk] = useState<RenkSayisi>(1);

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
      {ekran === 'masa' && <Masa renk={renk} geri={() => setEkran('secim')} />}
    </div>
  );
}
