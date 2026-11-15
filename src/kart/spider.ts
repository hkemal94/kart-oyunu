// Spider kuralları (tasarım belgesi 1.2; yol haritası, 2. paket). Ekrandan ayrı durur:
// burada yalnız masanın durumu ve kurallar var, çizim yok. Testleri: testler/spider.test.ts.
// Bu dosya yalnız tür alır (import type); böylece Node testleri derlemeden çalıştırabilir.

import type { Kart, RenkSayisi, Takim } from './kart';

export const SPIDER_SUTUN_SAYISI = 10;
export const SPIDER_DIZI = 8; // iki deste = 104 kart = sekiz tam dizi
const DIZI_UZUNLUGU = 13; // papazdan asa
// İlk dördüne altışar, kalan altısına beşer kart: 54 kart masada, 50'si destede (belge 1.2).
const ILK_DAGITIM = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5];

export const ZORLUK_TAKIMLARI: Record<RenkSayisi, Takim[]> = {
  1: ['maca'],
  2: ['maca', 'kupa'],
  4: ['maca', 'kupa', 'karo', 'sinek'],
};

export interface SpiderMasasi {
  sutunlar: Kart[][];
  deste: Kart[]; // kalan kartlar; her dağıtımda her sütuna birer kart
  tamamlanan: Takim[]; // masadan kalkan her tam dizinin takımı, kalkış sırasıyla
  hamle: number; // taşıma ve dağıtma sayısı; kendiliğinden kalkan dizi sayılmaz
}

// Bir dağıtımın sonucu: olur ya da neden olmadığı.
export type DagitmaDurumu = 'olur' | 'desteBos' | 'bosSutun';

export function spiderKartlari(renk: RenkSayisi): Kart[] {
  const takimlar = ZORLUK_TAKIMLARI[renk];
  const kartlar: Kart[] = [];
  for (let d = 0; d < SPIDER_DIZI; d++) {
    const takim = takimlar[d % takimlar.length];
    for (let deger = 1; deger <= DIZI_UZUNLUGU; deger++) {
      kartlar.push({ id: `${d}-${takim}-${deger}`, takim, deger, acik: false });
    }
  }
  return kartlar;
}

export function karistir<T>(dizi: T[], rastgele: () => number = Math.random): T[] {
  const sonuc = [...dizi];
  for (let i = sonuc.length - 1; i > 0; i--) {
    const j = Math.floor(rastgele() * (i + 1));
    [sonuc[i], sonuc[j]] = [sonuc[j], sonuc[i]];
  }
  return sonuc;
}

export function spiderDagit(renk: RenkSayisi, rastgele: () => number = Math.random): SpiderMasasi {
  const karisik = karistir(spiderKartlari(renk), rastgele);
  const sutunlar: Kart[][] = ILK_DAGITIM.map((adet) => karisik.splice(0, adet));
  sutunlar.forEach((s) => {
    s[s.length - 1] = { ...s[s.length - 1], acik: true };
  });
  return { sutunlar, deste: karisik, tamamlanan: [], hamle: 0 };
}

// Sütunun sira'dan sonuna kadarki kartları birlikte taşınabilir mi:
// hepsi açık, aynı takımdan ve birer birer küçülerek sıralı.
export function tasinabilirMi(masa: SpiderMasasi, sutun: number, sira: number): boolean {
  const s = masa.sutunlar[sutun];
  if (!s || sira < 0 || sira >= s.length) return false;
  for (let i = sira; i < s.length; i++) {
    if (!s[i].acik) return false;
    if (i > sira && (s[i].takim !== s[i - 1].takim || s[i].deger !== s[i - 1].deger - 1)) return false;
  }
  return true;
}

// Dizi hedef sütuna konabilir mi: boş sütuna her dizi; değilse üstteki kart bir değer büyük
// olmalı (renk fark etmez).
export function birakilabilirMi(masa: SpiderMasasi, kaynak: number, sira: number, hedef: number): boolean {
  if (kaynak === hedef || !tasinabilirMi(masa, kaynak, sira)) return false;
  const h = masa.sutunlar[hedef];
  if (!h) return false;
  if (h.length === 0) return true;
  const ust = h[h.length - 1];
  return ust.acik && ust.deger === masa.sutunlar[kaynak][sira].deger + 1;
}

// Sütunun sonunda papazdan asa aynı takımdan açık tam dizi varsa kaldırır; en üstte kalan kapalı
// kartı açar. Yeni masa döner.
function toparla(masa: SpiderMasasi): SpiderMasasi {
  const tamamlanan = [...masa.tamamlanan];
  const sutunlar = masa.sutunlar.map((s) => {
    let yeni = s;
    if (yeni.length >= DIZI_UZUNLUGU) {
      const bas = yeni.length - DIZI_UZUNLUGU;
      if (yeni[bas].deger === DIZI_UZUNLUGU && tasinabilirMi({ ...masa, sutunlar: [yeni] }, 0, bas)) {
        tamamlanan.push(yeni[bas].takim);
        yeni = yeni.slice(0, bas);
      }
    }
    const son = yeni[yeni.length - 1];
    if (son && !son.acik) yeni = [...yeni.slice(0, -1), { ...son, acik: true }];
    return yeni;
  });
  return { ...masa, sutunlar, tamamlanan };
}

// Kurala uyan taşımayı yapar; uymayanda null döner (ekran kartı yerine geri götürür).
export function tasi(masa: SpiderMasasi, kaynak: number, sira: number, hedef: number): SpiderMasasi | null {
  if (!birakilabilirMi(masa, kaynak, sira, hedef)) return null;
  const sutunlar = masa.sutunlar.map((s) => [...s]);
  const giden = sutunlar[kaynak].splice(sira);
  sutunlar[hedef].push(...giden);
  return toparla({ ...masa, sutunlar, hamle: masa.hamle + 1 });
}

// Standart kural: deste bitmediyse ve boş sütun yoksa dağıtılır.
export function dagitilabilirMi(masa: SpiderMasasi): DagitmaDurumu {
  if (masa.deste.length === 0) return 'desteBos';
  if (masa.sutunlar.some((s) => s.length === 0)) return 'bosSutun';
  return 'olur';
}

// Desteden her sütuna birer açık kart; olmuyorsa null.
export function destedenDagit(masa: SpiderMasasi): SpiderMasasi | null {
  if (dagitilabilirMi(masa) !== 'olur') return null;
  const deste = [...masa.deste];
  const sutunlar = masa.sutunlar.map((s) => {
    const kart = deste.shift();
    return kart ? [...s, { ...kart, acik: true }] : s;
  });
  return toparla({ ...masa, sutunlar, deste, hamle: masa.hamle + 1 });
}

export function kazandiMi(masa: SpiderMasasi): boolean {
  return masa.tamamlanan.length >= SPIDER_DIZI;
}

// ---------------------------------------------------------------------------------------------
// Yardımcılar (yol haritası, 4. paket; belge 1.3): geri al ve ipucu. Ekrandan ayrı.

// Geri al: her hamleden önceki masa saklanır. Taşıma ya da dağıtma, kendiliğinden açılan kart ve
// kalkan dizi aynı adımın içindedir; geri alınca hepsi birlikte geri gelir. Sınır yok (Kemal'in
// kararına kadar; belge 7). Geri almak da bir hamle sayılır (öneri; standart çözüm).
export interface GeriAlSonucu {
  masa: SpiderMasasi;
  gecmis: SpiderMasasi[];
}

export function geriAl(masa: SpiderMasasi, gecmis: SpiderMasasi[]): GeriAlSonucu | null {
  if (gecmis.length === 0) return null;
  const onceki = gecmis[gecmis.length - 1];
  return { masa: { ...onceki, hamle: masa.hamle + 1 }, gecmis: gecmis.slice(0, -1) };
}

// İpucu: ya bir taşıma (hangi sütunun hangi kartından itibaren, hangi sütuna) ya da "Dağıt".
export type Ipucu =
  | { tur: 'tasi'; kaynak: number; sira: number; hedef: number }
  | { tur: 'dagit' };

// Masadaki işe yarar hamleler, öncelik sırasıyla (öneri): önce aynı takıma konan, sonra kapalı
// kartı açan, sonra öbürleri. Hiç taşıma yoksa ve dağıtılabiliyorsa yalnız "Dağıt". Boş liste:
// yapılacak bir şey yok. Bir şey kazandırmayan hamleler (sütunu olduğu gibi boş sütuna taşımak,
// zaten uygun bir kartın üstündeki diziyi başka takıma taşımak) önerilmez.
export function ipuclari(masa: SpiderMasasi): Ipucu[] {
  const adaylar: { ipucu: Ipucu; puan: number }[] = [];
  const ilkBos = masa.sutunlar.findIndex((s) => s.length === 0);
  masa.sutunlar.forEach((s, kaynak) => {
    for (let sira = 0; sira < s.length; sira++) {
      if (!tasinabilirMi(masa, kaynak, sira)) continue;
      const kart = s[sira];
      const alt = s[sira - 1]; // dizinin altında kalan kart
      const altUygun = alt && alt.acik && alt.deger === kart.deger + 1;
      const kartAcar = !!alt && !alt.acik;
      masa.sutunlar.forEach((h, hedef) => {
        if (h.length === 0 && hedef !== ilkBos) return; // boş sütunlar birbirinin aynısı
        if (!birakilabilirMi(masa, kaynak, sira, hedef)) return;
        const ust = h[h.length - 1];
        const ayniTakim = !!ust && ust.takim === kart.takim;
        if (h.length === 0 && sira === 0) return; // sütunu boş sütuna taşımak bir şey değiştirmez
        if (altUygun && !(ayniTakim && alt.takim !== kart.takim)) return;
        const puan = (ayniTakim ? 4 : 0) + (kartAcar ? 2 : 0) + (h.length > 0 ? 1 : 0);
        adaylar.push({ ipucu: { tur: 'tasi', kaynak, sira, hedef }, puan });
      });
    }
  });
  // Sıralama kararlı: aynı puanda soldaki sütun önce gelir
  const sirali = adaylar.sort((a, b) => b.puan - a.puan).map((a) => a.ipucu);
  if (sirali.length === 0 && dagitilabilirMi(masa) === 'olur') return [{ tur: 'dagit' }];
  return sirali;
}
