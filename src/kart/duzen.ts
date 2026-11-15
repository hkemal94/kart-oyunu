// Masa düzeni (Kemal, 15 Kasım: "kartlar büyüsün, aralık açılsın"). Kart boyu ve kapalı / açık
// kart aralığı ekranın yüksekliğine göre ayarlanır; sütun uzadıkça aralık kendiliğinden sıkışır,
// alt şeritle çakışmaz. Çizim yok, yalnız hesap; testleri testler/duzen.test.ts.

export const KART_ORANI = 1.42; // kartın boyu / eni (standart iskambil)

// Kartın en ve boyu: en, sütun sayısına göre genişlikten gelir; boy uzun ekranda biraz uzar
// (enAzOran ile enCokOran arası). Klasik solitaire'de iki oran aynıdır, kart hep standart kalır.
export function kartOlcusu(
  alanEn: number,
  alanBoy: number,
  sutunSayisi: number,
  aralik: number,
  enAzOran = KART_ORANI,
  enCokOran = KART_ORANI,
): { en: number; boy: number } {
  const en = Math.max(1, Math.floor((alanEn - aralik * (sutunSayisi - 1)) / sutunSayisi));
  // Alan eninden ne kadar uzunsa kart o kadar uzar (dikey telefonlarda alan 1,2 ile 1,9 kat uzun)
  const uzunluk = alanBoy / Math.max(1, alanEn);
  const oran = Math.min(enCokOran, Math.max(enAzOran, enAzOran + (uzunluk - 1.2) * 0.25));
  return { en, boy: Math.round(en * oran) };
}

export interface Aralik {
  acik: number; // açık kartın altındaki kartla arası
  kapali: number; // kapalı kartın altındaki kartla arası
}

// Ekrana göre aralık: "beklenen" uzunluktaki bir sütun (kapalıSayisi kapalı + acikSayisi açık
// kart) alana sıkışmadan sığacak kadar açılır; ama kartın belli bir payından fazla açılmaz.
export function ekranaGoreAralik(
  kartBoy: number,
  sigan: number, // sütunun ilk kartının üstünden alanın altına kadar
  o: { kapaliSayisi: number; acikSayisi: number; enCokAcik: number; enCokKapali: number },
): Aralik {
  const kapaliPayi = 0.65; // kapalı aralık açığın en çok bu kadarı
  const birim = Math.max(0, sigan - kartBoy) / (o.acikSayisi + o.kapaliSayisi * kapaliPayi);
  const acik = Math.min(kartBoy * o.enCokAcik, birim);
  const kapali = Math.min(kartBoy * o.enCokKapali, acik * kapaliPayi);
  return { acik, kapali };
}

// Bir sütundaki kartların üstten uzaklığı. Sığmazsa önce kapalı kartlar en aza kadar sıkışır,
// sonra bütün aralıklar aynı oranla; son kart hiçbir zaman alanın dışına taşmaz.
export function sutunKonumlari(
  acikMi: boolean[],
  aralik: Aralik,
  kartBoy: number,
  sigan: number,
  enAzKapali: number,
): number[] {
  const yer = Math.max(0, sigan - kartBoy);
  const ust = acikMi.slice(0, -1);
  let kapaliAdim = aralik.kapali;
  let acikAdim = aralik.acik;
  const kapaliSay = ust.filter((a) => !a).length;
  const acikSay = ust.length - kapaliSay;
  const toplam = () => kapaliSay * kapaliAdim + acikSay * acikAdim;
  if (toplam() > yer && kapaliSay > 0) {
    const kalan = yer - acikSay * acikAdim;
    kapaliAdim = Math.max(Math.min(kapaliAdim, enAzKapali), kalan / kapaliSay);
    kapaliAdim = Math.min(kapaliAdim, aralik.kapali);
  }
  if (toplam() > yer && toplam() > 0) {
    const oran = yer / toplam();
    kapaliAdim *= oran;
    acikAdim *= oran;
  }
  let y = 0;
  return acikMi.map((_, i) => {
    const bu = y;
    if (i < ust.length) y += ust[i] ? acikAdim : kapaliAdim;
    return bu;
  });
}

// Alt şeritteki dar yelpaze: her kart bir öncekinin üstüne biner (tamamlanan diziler, deste).
export function yelpazeEni(adet: number, kartEn: number, adim: number): number {
  return adet <= 0 ? 0 : kartEn + (adet - 1) * adim;
}
