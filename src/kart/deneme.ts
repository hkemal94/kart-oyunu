// Yalnız geliştirmede çalışan deneme elleri (adres sonuna ?deneme=kazan ya da ?deneme=dizi).
// Ekran görüntüsü ve elle deneme için; yayındaki oyunda açılmaz (Uygulama.tsx, import.meta.env.DEV).
// - kazan: yedi dizi tamam; asa dokunup papazlı sütuna dokununca sekizinci dizi kalkar, oyun biter.
// - dizi: 2 renk, oyun ortası; kupa asını 4. sütundan 1. sütuna taşıyınca bir dizi kalkar.
//   Son sütun boş: "Dağıt"a dokununca uyarı çıkar.

import type { Kart, RenkSayisi } from './kart';
import { karistir, spiderKartlari, type SpiderMasasi } from './spider';

export type DenemeTuru = 'kazan' | 'dizi';

// Her seferinde aynı eli veren basit sayı üreteci
function sabitRastgele(tohum: number): () => number {
  let x = tohum;
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
}

const ac = (k: Kart): Kart => ({ ...k, acik: true });
// d. dizinin kartları, papazdan asa
const dizisi = (kartlar: Kart[], d: number) =>
  kartlar.filter((k) => k.id.startsWith(`${d}-`)).sort((a, b) => b.deger - a.deger);

export function denemeMasasi(tur: DenemeTuru): { renk: RenkSayisi; masa: SpiderMasasi } {
  if (tur === 'kazan') {
    const kartlar = spiderKartlari(1);
    const son = dizisi(kartlar, 7).map(ac);
    const sutunlar: Kart[][] = Array.from({ length: 10 }, () => []);
    sutunlar[0] = son.slice(0, 12); // papazdan ikiliye
    sutunlar[1] = [son[12]]; // as
    return { renk: 1, masa: { sutunlar, deste: [], tamamlanan: Array(7).fill('maca'), hamle: 0 } };
  }
  const kartlar = spiderKartlari(2);
  const hazir = dizisi(kartlar, 3).map(ac); // kupa dizisi
  const kalan = karistir(
    kartlar.filter((k) => !k.id.startsWith('1-') && !k.id.startsWith('3-')),
    sabitRastgele(7),
  );
  const deste = kalan.splice(0, 40);
  const adetler = [2, 5, 5, 3, 5, 5, 5, 4, 4, 0]; // son sütun boş: dağıtma uyarısı denensin
  const sutunlar = adetler.map((a) => kalan.splice(0, a));
  sutunlar.forEach((s, c) => {
    if (c !== 0 && c !== 3 && s.length) s[s.length - 1] = ac(s[s.length - 1]);
  });
  sutunlar[0].push(...hazir.slice(0, 12));
  sutunlar[3].push(hazir[12]);
  return { renk: 2, masa: { sutunlar, deste, tamamlanan: ['kupa'], hamle: 0 } };
}
