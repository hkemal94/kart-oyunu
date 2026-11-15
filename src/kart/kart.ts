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

// Spider zorluğu: 1 renk (yalnız maça), 2 renk (maça ve kupa), 4 renk (belge 1.2).
export type RenkSayisi = 1 | 2 | 4;
