// Kart hareketlerinin süreleri (Kemal'in telefon yorumları, 15 Kasım 2026): teker teker dağıtma,
// çift dokunuşta kayma, tamamlanan sıranın akışı. Sayılar tek yerde: src/oyun/ayarlar.json →
// "hareket" (KKM → Oyunlar → Ayarlar). Hepsi ÖNERİ, Kemal ayarlar. Hesap burada, çizim ekranda
// (src/ekranlar/masaOrtak.tsx). Testleri: testler/hareket.test.ts.

import { ayarSayisi } from '../oyun/ayarOku.ts';

const sure = (anahtar: string, yedek: number) => {
  const d = ayarSayisi('hareket', anahtar, yedek);
  return d >= 0 ? d : yedek;
};

// Milisaniye. ÖNERİ, Kemal ayarlar.
export const HAREKET = {
  dagitim: sure('dagitim', 1800), // Spider açılış dağıtımının toplamı (54 kart)
  ucus: sure('ucus', 240), // bir kartın desteden yerine uçuşu
  kayma: sure('kayma', 240), // taşınan kartın yerine kayması (çift dokunuş dahil)
  akis: sure('akis', 700), // tamamlanan 13 kartın "Tamamlanan diziler"e akışının toplamı
  akisUcusu: sure('akisUcusu', 220), // akışta bir kartın uçuşu
};

export const SPIDER_ILK_DAGITIM = 54; // ilk dördüne altışar, kalan altısına beşer
export const DIZI_KART_SAYISI = 13;

// Teker teker giden kartlarda iki kart arası bekleme: ilk kart hemen kalkar, son kart toplam süre
// dolunca yerine varır. Toplam uçuştan kısaysa hepsi birlikte kalkar.
export function adimSuresi(adet: number, toplam: number, ucus: number): number {
  if (adet <= 1) return 0;
  return Math.max(0, (toplam - ucus) / (adet - 1));
}

// Teker teker giden adet kartın toplam süresi
export function toplamSure(adet: number, adim: number, ucus: number): number {
  return adet <= 0 ? 0 : (adet - 1) * adim + ucus;
}

// Dağıtımda iki kart arası: Spider açılışına göre; "Dağıt"taki 10 kart ve klasik solitaire'in
// açılışı aynı hızla gider (öneri).
export const DAGITIM_ADIMI = adimSuresi(SPIDER_ILK_DAGITIM, HAREKET.dagitim, HAREKET.ucus);
// Tamamlanan sırada iki kart arası (en alttaki astan papaza)
export const AKIS_ADIMI = adimSuresi(DIZI_KART_SAYISI, HAREKET.akis, HAREKET.akisUcusu);
