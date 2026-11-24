// Kartların verisi (tasarım belgesi 1.2). Spider kuralları ayrı dosyada: spider.ts.

export type Takim = 'maca' | 'kupa' | 'karo' | 'sinek';
export const TAKIM_SIMGESI: Record<Takim, string> = {
  maca: '♠',
  kupa: '♥',
  karo: '♦',
  sinek: '♣',
};
export const KIRMIZI_TAKIMLAR: Takim[] = ['kupa', 'karo'];

export interface Kart {
  id: string;
  takim: Takim;
  deger: number; // 1 = as, 11 = vale, 12 = kız, 13 = papaz
  acik: boolean;
}

// Kartın hangi setten geldiği (1 ya da 2; klasik iskambildeki iki deste gibi, arka yüzü renginden
// ayrılır). Spider iki desteyle oynanır: kimliği "dizi-takım-değer", ilk dört dizi 1. set, son dört
// dizi 2. set (her set 52 kart). Klasik solitaire ve kimliği olmayan kart tek deste: 1. set.
export type KartSeti = 1 | 2;
export function kartSeti(id: string | undefined): KartSeti {
  const dizi = id?.match(/^(\d+)-/);
  return dizi && Number(dizi[1]) >= 4 ? 2 : 1;
}

// Spider zorluğu: 1 renk (yalnız maça), 2 renk (maça ve kupa), 4 renk (belge 1.2).
export type RenkSayisi = 1 | 2 | 4;
