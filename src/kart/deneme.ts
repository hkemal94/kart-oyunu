// Yalnız geliştirmede çalışan deneme elleri (adres sonuna ?deneme=kazan, ?deneme=dizi,
// ?deneme=klasik-kazan ya da ?deneme=klasik-orta).
// Ekran görüntüsü ve elle deneme için; yayındaki oyunda açılmaz (Uygulama.tsx, import.meta.env.DEV).
// - kazan: yedi dizi tamam; asa dokunup papazlı sütuna dokununca sekizinci dizi kalkar, oyun biter.
// - dizi: 2 renk, oyun ortası; kupa asını 4. sütundan 1. sütuna taşıyınca bir dizi kalkar.
//   Son sütun boş: "Dağıt"a dokununca uyarı çıkar.
// - uzun: Spider, 1 renk, ileri el: üç dizi tamam, desteden iki dağıtım kaldı, sütunlar uzun
//   (masa düzeni denemesi; Kemal, 15 Kasım).
// - klasik-kazan: klasik solitaire, 51 kart temelde; papaza çift dokununca oyun biter.
// - klasik-orta: klasik solitaire, 3 kart çekme; hep aynı el, ipucunun ilk önerisiyle 40 hamle oynanmış.
// - takvim, gunluk-kazan: günlük mücadele için hazır yıldızlar (aşağıda gunlukDenemesi).

import type { Kart, RenkSayisi } from './kart';
import { karistir, spiderKartlari, type SpiderMasasi } from './spider';
import { cek, ipuclari, klondikeDagit, tasi, TEMEL_TAKIMLARI, type KlondikeMasasi } from './klondike';
import { ayinGunSayisi, oncekiAy, tarihOku, tarihYaz, type GunlukKaydi } from '../oyun/gunluk';

export type DenemeTuru = 'kazan' | 'dizi' | 'uzun';

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
  if (tur === 'uzun') {
    const kartlar = spiderKartlari(1);
    const a = dizisi(kartlar, 3).map(ac); // papazdan asa
    const b = dizisi(kartlar, 4).map(ac);
    const kalan = karistir(
      kartlar.filter((k) => ['0-', '1-', '2-', '3-', '4-'].every((on) => !k.id.startsWith(on))),
      sabitRastgele(5),
    );
    const deste = kalan.splice(0, 20);
    const adetler = [6, 2, 1, 5, 1, 1, 1, 1, 1, 0]; // kalan 19 kart
    const sutunlar = adetler.map((n) => kalan.splice(0, n));
    sutunlar.forEach((s) => {
      if (s.length) s[s.length - 1] = ac(s[s.length - 1]);
    });
    sutunlar[0].push(...a.slice(0, 12)); // papazdan ikiliye uzun açık dizi
    sutunlar[3].push(...b.slice(0, 12));
    sutunlar[9].push(b[12]);
    sutunlar[7].push(a[12]);
    return { renk: 1, masa: { sutunlar, deste, tamamlanan: ['maca', 'maca', 'maca'], hamle: 0 } };
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

export type KlondikeDenemeTuru = 'klasik-kazan' | 'klasik-orta';

export function klondikeDenemesi(tur: KlondikeDenemeTuru): { masa: KlondikeMasasi } {
  if (tur === 'klasik-kazan') {
    const temeller: Kart[][] = TEMEL_TAKIMLARI.map((takim) =>
      Array.from({ length: takim === 'kupa' ? 12 : 13 }, (_, i) => ({ id: `${takim}-${i + 1}`, takim, deger: i + 1, acik: true })),
    );
    const sutunlar: Kart[][] = Array.from({ length: 7 }, () => []);
    sutunlar[0] = [{ id: 'kupa-13', takim: 'kupa', deger: 13, acik: true }];
    return { masa: { sutunlar, temeller, deste: [], acilan: [], cekme: 1, hamle: 0 } };
  }
  let masa = klondikeDagit(3, sabitRastgele(11));
  for (let i = 0; i < 40; i++) {
    const ip = ipuclari(masa)[0];
    if (!ip) break;
    masa = (ip.tur === 'cek' ? cek(masa) : tasi(masa, ip.yer, ip.hedef)) ?? masa;
  }
  return { masa };
}

// Günlük mücadele (8. paket): takvimde gerçekçi görünsün diye hazır yıldızlar. Yalnız geliştirmede
// (?deneme=takvim, ?deneme=gunluk-kazan). Geçen ayın bütün günleri yıldızlı (Ben → Aylık ödüller'de
// bir rozet), bu ayda bugünden önceki günlerin çoğu yıldızlı, birkaçı boş; bugün boş.
export function gunlukDenemesi(bugun: string): GunlukKaydi {
  const { yil, ay, gun } = tarihOku(bugun);
  const once = oncekiAy(yil, ay);
  const yildizlar: string[] = [];
  for (let g = 1; g <= ayinGunSayisi(once.yil, once.ay); g++) yildizlar.push(tarihYaz(once.yil, once.ay, g));
  for (let g = 1; g < gun; g++) if (g % 5 !== 3) yildizlar.push(tarihYaz(yil, ay, g));
  return { yildizlar };
}
