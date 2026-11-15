// Kartların verisi ve Spider dağıtımı (tasarım belgesi 1.2).
// Bu pakette kural kontrolü yok (yol haritası, 1. paket): kartlar istenen
// sütuna taşınabilir. Kurallar 2. pakette ayrı bir dosyada gelecek.

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

// Spider zorluğu: 1 renk (yalnız maça), 2 renk (maça ve kupa), 4 renk (belge 1.2).
export type RenkSayisi = 1 | 2 | 4;
const ZORLUK_TAKIMLARI: Record<RenkSayisi, Takim[]> = {
  1: ['maca'],
  2: ['maca', 'kupa'],
  4: ['maca', 'kupa', 'karo', 'sinek'],
};

// Spider iki desteyle oynanır: 104 kart = 8 takım dizisi (her dizi as..papaz).
const SPIDER_DIZI_SAYISI = 8;
const SUTUN_SAYISI = 10;
// İlk dördüne altışar, kalan altısına beşer kart (belge 1.2).
const ILK_DAGITIM = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5];

function karistir<T>(dizi: T[]): T[] {
  const sonuc = [...dizi];
  for (let i = sonuc.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sonuc[i], sonuc[j]] = [sonuc[j], sonuc[i]];
  }
  return sonuc;
}

export interface SpiderMasasi {
  sutunlar: Kart[][];
  deste: Kart[]; // kalan kartlar; onar onar dağıtılır
}

export function spiderDagit(renk: RenkSayisi): SpiderMasasi {
  const takimlar = ZORLUK_TAKIMLARI[renk];
  const kartlar: Kart[] = [];
  for (let d = 0; d < SPIDER_DIZI_SAYISI; d++) {
    const takim = takimlar[d % takimlar.length];
    for (let deger = 1; deger <= 13; deger++) {
      kartlar.push({ id: `${d}-${takim}-${deger}`, takim, deger, acik: false });
    }
  }
  const karisik = karistir(kartlar);
  const sutunlar: Kart[][] = ILK_DAGITIM.map((adet) => karisik.splice(0, adet));
  sutunlar.forEach((s) => {
    s[s.length - 1].acik = true;
  });
  return { sutunlar, deste: karisik };
}

// Desteden her sütuna birer açık kart (kural kontrolü yok).
export function desteden(masa: SpiderMasasi): SpiderMasasi {
  if (masa.deste.length === 0) return masa;
  const deste = [...masa.deste];
  const sutunlar = masa.sutunlar.map((s) => {
    const kart = deste.shift();
    return kart ? [...s, { ...kart, acik: true }] : s;
  });
  return { sutunlar, deste };
}

// Bir sütundaki kartı (ve üstündekileri) başka sütuna taşır. Kural kontrolü yok.
// Kaynak sütunda en üstte kapalı kart kalırsa açılır.
export function tasi(masa: SpiderMasasi, kaynak: number, sira: number, hedef: number): SpiderMasasi {
  if (kaynak === hedef) return masa;
  const sutunlar = masa.sutunlar.map((s) => [...s]);
  const giden = sutunlar[kaynak].splice(sira);
  if (giden.length === 0) return masa;
  sutunlar[hedef].push(...giden);
  const kalan = sutunlar[kaynak];
  if (kalan.length > 0 && !kalan[kalan.length - 1].acik) {
    kalan[kalan.length - 1] = { ...kalan[kalan.length - 1], acik: true };
  }
  return { ...masa, sutunlar };
}

export const SPIDER_SUTUN_SAYISI = SUTUN_SAYISI;
export const SPIDER_DIZI = SPIDER_DIZI_SAYISI;
