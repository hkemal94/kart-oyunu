// Yalnız geliştirmede çalışan deneme elleri (adres sonuna ?deneme=kazan, ?deneme=dizi,
// ?deneme=klasik-kazan ya da ?deneme=klasik-orta).
// Ekran görüntüsü ve elle deneme için; yayındaki oyunda açılmaz (Uygulama.tsx, import.meta.env.DEV).
// - kazan: yedi dizi tamam; asa dokunup papazlı sütuna dokununca sekizinci dizi kalkar, oyun biter.
// - dizi: 2 renk, oyun ortası; kupa asını 4. sütundan 1. sütuna taşıyınca bir dizi kalkar.
//   Son sütun boş: "Dağıt"a dokununca uyarı çıkar.
// - uzun: Spider, 1 renk, ileri el: üç dizi tamam, desteden iki dağıtım kaldı, sütunlar uzun
//   (masa düzeni denemesi; Kemal, 15 Kasım).
// - cift: Spider, 2 renk (Kemal'in telefon yorumları, 15 Kasım). 8♥'ye çift dokununca 9♠ yerine
//   9♥'nin altına kayar (aynı takım önce); 5♠'ye çift dokununca gidecek yer yok, sallanır. Masada
//   oynanamayan kartlar koyu.
// - klasik-kazan: klasik solitaire, 51 kart temelde; papaza çift dokununca oyun biter.
// - klasik-orta: klasik solitaire, 3 kart çekme; hep aynı el, ipucunun ilk önerisiyle 40 hamle oynanmış.
// - klasik-bitir: klasik solitaire, bitmeye yakın el (4. paket, kendiliğinden bitirme): deste ve açılan
//   kartlar boş, sütunlardaki 30 kartın hepsi açık; masada "Bitir" düğmesi görünür.
// - takvim, gunluk-kazan: günlük mücadele için hazır yıldızlar (aşağıda gunlukDenemesi).
// - pullar: pul koleksiyonu için hazır yıldızlar (aşağıda pulDenemesi).

import type { Kart, RenkSayisi } from './kart';
import { karistir, spiderKartlari, type SpiderMasasi } from './spider';
import { cek, ipuclari, klondikeDagit, tasi, TEMEL_TAKIMLARI, type KlondikeMasasi } from './klondike';
import { ayinGunSayisi, oncekiAy, tarihOku, tarihYaz, type GunlukKaydi } from '../oyun/gunluk';

export type DenemeTuru = 'kazan' | 'dizi' | 'uzun' | 'cift';

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
  if (tur === 'cift') {
    const havuz = karistir(spiderKartlari(2), sabitRastgele(3));
    const al = (takim: Kart['takim'], deger: number) => {
      const i = havuz.findIndex((k) => k.takim === takim && k.deger === deger);
      return ac(havuz.splice(i, 1)[0]);
    };
    // Sütunların en üstteki açık kartları: 9♥, 8♥, 9♠, 5♠ ve öbürleri (5♠'nin gideceği 6 yok)
    const acik = [al('kupa', 9), al('kupa', 8), al('maca', 9), al('maca', 5), al('maca', 13), al('kupa', 2), al('kupa', 11), al('maca', 3), al('maca', 12), al('maca', 7)];
    const kapali = [5, 4, 5, 4, 4, 4, 5, 4, 5, 4]; // 44 kapalı kart; 50 kart destede
    const sutunlar = kapali.map((n, c) => [...havuz.splice(0, n), acik[c]]);
    return { renk: 2, masa: { sutunlar, deste: havuz, tamamlanan: [], hamle: 0 } };
  }
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

export type KlondikeDenemeTuru = 'klasik-kazan' | 'klasik-orta' | 'klasik-bitir';

export function klondikeDenemesi(tur: KlondikeDenemeTuru): { masa: KlondikeMasasi } {
  if (tur === 'klasik-kazan') {
    const temeller: Kart[][] = TEMEL_TAKIMLARI.map((takim) =>
      Array.from({ length: takim === 'kupa' ? 12 : 13 }, (_, i) => ({ id: `${takim}-${i + 1}`, takim, deger: i + 1, acik: true })),
    );
    const sutunlar: Kart[][] = Array.from({ length: 7 }, () => []);
    sutunlar[0] = [{ id: 'kupa-13', takim: 'kupa', deger: 13, acik: true }];
    return { masa: { sutunlar, temeller, deste: [], acilan: [], cekme: 1, hamle: 0 } };
  }
  if (tur === 'klasik-bitir') {
    // Temelde maça ve karo altıya, kupa ve sinek beşe kadar; kalan 30 kart sütunlarda, ters renk sıralı
    const ust: Record<string, number> = { maca: 6, kupa: 5, karo: 6, sinek: 5 };
    const kart = (takim: Kart['takim'], deger: number): Kart => ({ id: `${takim}-${deger}`, takim, deger, acik: true });
    const temeller: Kart[][] = TEMEL_TAKIMLARI.map((takim) => Array.from({ length: ust[takim] }, (_, i) => kart(takim, i + 1)));
    const dizi = (bas: number, takimlar: Kart['takim'][], adet: number) =>
      Array.from({ length: adet }, (_, i) => kart(takimlar[i % 2], bas - i));
    const sutunlar: Kart[][] = [
      dizi(13, ['maca', 'kupa'], 5), // K♠ Q♥ J♠ 10♥ 9♠
      dizi(13, ['kupa', 'maca'], 4), // K♥ Q♠ J♥ 10♠
      dizi(13, ['karo', 'sinek'], 8), // K♦ Q♣ J♦ 10♣ 9♦ 8♣ 7♦ 6♣
      dizi(13, ['sinek', 'karo'], 4), // K♣ Q♦ J♣ 10♦
      dizi(8, ['kupa', 'maca'], 3), // 8♥ 7♠ 6♥
      dizi(9, ['kupa', 'maca'], 3), // 9♥ 8♠ 7♥
      dizi(9, ['sinek', 'karo'], 3), // 9♣ 8♦ 7♣
    ];
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
// (?deneme=takvim, ?deneme=gunluk-kazan). Geçen ayın bütün günleri yıldızlı (Ben → Pul koleksiyonu'nda
// bir pul), bu ayda bugünden önceki günlerin çoğu yıldızlı, birkaçı boş; bugün boş.
export function gunlukDenemesi(bugun: string): GunlukKaydi {
  const { yil, ay, gun } = tarihOku(bugun);
  const once = oncekiAy(yil, ay);
  const yildizlar: string[] = [];
  for (let g = 1; g <= ayinGunSayisi(once.yil, once.ay); g++) yildizlar.push(tarihYaz(once.yil, once.ay, g));
  for (let g = 1; g < gun; g++) if (g % 5 !== 3) yildizlar.push(tarihYaz(yil, ay, g));
  return { yildizlar };
}

// Pul koleksiyonu (?deneme=pullar): Ocak, Şubat ve Mart 2026'nın bütün günleri yıldızlı (üç pul ve
// çeyreğin büyük pulu), Mayıs ve Ağustos 2026 da tamam (iki pul daha); Haziran'da birkaç gün eksik.
// Bugünden sonraki aylar yazılmaz. Yalnız geliştirmede.
export function pulDenemesi(bugun: string): GunlukKaydi {
  const yildizlar: string[] = [];
  for (const ay of [1, 2, 3, 5, 6, 8]) {
    const tarih = tarihYaz(2026, ay, 1);
    if (tarih.slice(0, 7) > bugun.slice(0, 7)) continue;
    for (let g = 1; g <= ayinGunSayisi(2026, ay); g++) if (ay !== 6 || g % 7 !== 2) yildizlar.push(tarihYaz(2026, ay, g));
  }
  return { yildizlar: yildizlar.filter((t) => t <= bugun) };
}
