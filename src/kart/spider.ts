// Spider kuralları (tasarım belgesi 1.2; yol haritası, 2. paket). Ekrandan ayrı durur:
// burada yalnız masanın durumu ve kurallar var, çizim yok. Testleri: testler/spider.test.ts.
// Bu dosya yalnız tür alır (import type); böylece Node testleri derlemeden çalıştırabilir.

import type { Kart, RenkSayisi, Takim } from './kart';
import { geriAl as ortakGeriAl, karistir, type GeriAlSonucu as OrtakGeriAlSonucu } from './ortak.ts';

// Ortak parçalar (src/kart/ortak.ts); eski yerinden de alınabilsin diye burada da açık.
export { karistir };

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

// Taşımanın toparlanmadan önceki hâli: dizi yerinde, tamamlanan dizi henüz kalkmadı. Ekran
// tamamlanan dizinin kartlarını buradaki yerlerinden "Tamamlanan diziler"e akıtır (Kemal 15 Kasım).
export function tasiToparlamadan(masa: SpiderMasasi, kaynak: number, sira: number, hedef: number): SpiderMasasi | null {
  if (!birakilabilirMi(masa, kaynak, sira, hedef)) return null;
  const sutunlar = masa.sutunlar.map((s) => [...s]);
  const giden = sutunlar[kaynak].splice(sira);
  sutunlar[hedef].push(...giden);
  return { ...masa, sutunlar, hamle: masa.hamle + 1 };
}

// Kurala uyan taşımayı yapar; uymayanda null döner (ekran kartı yerine geri götürür).
export function tasi(masa: SpiderMasasi, kaynak: number, sira: number, hedef: number): SpiderMasasi | null {
  const ara = tasiToparlamadan(masa, kaynak, sira, hedef);
  return ara && toparla(ara);
}

// Standart kural: deste bitmediyse ve boş sütun yoksa dağıtılır.
export function dagitilabilirMi(masa: SpiderMasasi): DagitmaDurumu {
  if (masa.deste.length === 0) return 'desteBos';
  if (masa.sutunlar.some((s) => s.length === 0)) return 'bosSutun';
  return 'olur';
}

// Dağıtmanın toparlanmadan önceki hâli (yukarıda tasiToparlamadan gibi)
export function dagitToparlamadan(masa: SpiderMasasi): SpiderMasasi | null {
  if (dagitilabilirMi(masa) !== 'olur') return null;
  const deste = [...masa.deste];
  const sutunlar = masa.sutunlar.map((s) => {
    const kart = deste.shift();
    return kart ? [...s, { ...kart, acik: true }] : s;
  });
  return { ...masa, sutunlar, deste, hamle: masa.hamle + 1 };
}

// Desteden her sütuna birer açık kart; olmuyorsa null.
export function destedenDagit(masa: SpiderMasasi): SpiderMasasi | null {
  const ara = dagitToparlamadan(masa);
  return ara && toparla(ara);
}

export function kazandiMi(masa: SpiderMasasi): boolean {
  return masa.tamamlanan.length >= SPIDER_DIZI;
}

// ---------------------------------------------------------------------------------------------
// Yardımcılar (yol haritası, 4. paket; belge 1.3): geri al ve ipucu. Ekrandan ayrı.

// Geri al: her hamleden önceki masa saklanır. Taşıma ya da dağıtma, kendiliğinden açılan kart ve
// kalkan dizi aynı adımın içindedir; geri alınca hepsi birlikte geri gelir. Geri almak da bir hamle
// sayılır (Kemal, 15 Kasım soru turu). Ortak kural src/kart/ortak.ts'te; hak sınırı
// src/kart/geriAlHakki.ts'te.
export type GeriAlSonucu = OrtakGeriAlSonucu<SpiderMasasi>;

export function geriAl(masa: SpiderMasasi, gecmis: SpiderMasasi[]): GeriAlSonucu | null {
  return ortakGeriAl(masa, gecmis);
}

// İpucu: ya bir taşıma (hangi sütunun hangi kartından itibaren, hangi sütuna) ya da "Dağıt".
export type Ipucu =
  | { tur: 'tasi'; kaynak: number; sira: number; hedef: number }
  | { tur: 'dagit' };

// Masadaki işe yarar hamleler, öncelik sırasıyla (Kemal, 15 Kasım soru turu): önce diziyi
// tamamlayan (papazdan asa aynı takım dizi kurup masadan kaldıran), sonra aynı takıma konan, sonra
// kapalı kartı açan, sonra öbürleri. Hiç taşıma yoksa ve dağıtılabiliyorsa yalnız "Dağıt". Boş liste:
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
        // Taşıma bir diziyi tamamlıyor mu: tamamlanan dizi sayısı artar
        const sonuc = tasi(masa, kaynak, sira, hedef);
        const diziTamamlar = !!sonuc && sonuc.tamamlanan.length > masa.tamamlanan.length;
        if (!diziTamamlar && altUygun && !(ayniTakim && alt.takim !== kart.takim)) return;
        const puan = (diziTamamlar ? 8 : 0) + (ayniTakim ? 4 : 0) + (kartAcar ? 2 : 0) + (h.length > 0 ? 1 : 0);
        adaylar.push({ ipucu: { tur: 'tasi', kaynak, sira, hedef }, puan });
      });
    }
  });
  // Sıralama kararlı: aynı puanda soldaki sütun önce gelir
  const sirali = adaylar.sort((a, b) => b.puan - a.puan).map((a) => a.ipucu);
  if (sirali.length === 0 && dagitilabilirMi(masa) === 'olur') return [{ tur: 'dagit' }];
  return sirali;
}

// ---------------------------------------------------------------------------------------------
// Kemal'in telefon yorumları (15 Kasım). Ekrandan ayrı; testleri testler/oynanabilir.test.ts.

// Çift dokunuş: dizi (sütunun sira'dan sonuna kadarki kartları) nereye gider. Öncelik (Kemal):
// aynı takımdan bir büyük kartın altı, sonra başka takımdan bir büyük kart, en son boş sütun.
// Aynı öncelikte soldaki sütun. Sütunun tamamını boş sütuna taşımak bir şey değiştirmediği için
// sayılmaz. Gidecek yer yoksa null (ekran kartı hafifçe sallar).
export function ciftDokunusHedefi(masa: SpiderMasasi, kaynak: number, sira: number): number | null {
  if (!tasinabilirMi(masa, kaynak, sira)) return null;
  const kart = masa.sutunlar[kaynak][sira];
  let enIyi: number | null = null;
  let enIyiOncelik = 0;
  for (let hedef = 0; hedef < masa.sutunlar.length; hedef++) {
    const h = masa.sutunlar[hedef];
    if (!birakilabilirMi(masa, kaynak, sira, hedef)) continue;
    if (h.length === 0 && sira === 0) continue;
    const ust = h[h.length - 1];
    const oncelik = !ust ? 1 : ust.takim === kart.takim ? 3 : 2;
    if (oncelik > enIyiOncelik) {
      enIyi = hedef;
      enIyiOncelik = oncelik;
    }
  }
  return enIyi;
}

// Oynanabilir kartlar (Kemal: "o an hiçbir yere oynanamayan açık kartlar koyulaşsın"). Açık bir
// kart, kendisi ya da üstünde durduğu birlikte taşınabilir dizi o an kurala uygun bir yere
// gidebiliyorsa oynanabilir; gidemiyorsa ya da başka bir kartın altında kalıp taşınamıyorsa
// oynanamaz. Boş sütuna her dizi gidebildiği için boş sütun varken taşınabilir her dizi oynanır.
// Kapalı kartlar listeye girmez. Dönen: oynanabilir kartların kimlikleri.
// 26 Kasım'dan beri gri kuralı bunu kullanmaz (aşağıda koyulasacakKartlar); kural ve testleri duruyor.
export function oynanabilirKartlar(masa: SpiderMasasi): Set<string> {
  const sonuc = new Set<string>();
  masa.sutunlar.forEach((s, kaynak) => {
    for (let sira = 0; sira < s.length; sira++) {
      if (!tasinabilirMi(masa, kaynak, sira)) continue;
      const gider = masa.sutunlar.some((_, hedef) => birakilabilirMi(masa, kaynak, sira, hedef));
      if (gider) {
        for (let i = sira; i < s.length; i++) sonuc.add(s[i].id);
        break; // üstteki kartlar bu diziyle birlikte gider
      }
    }
  });
  return sonuc;
}

// Koyulaşacak kartlar (gri kural). Kemal, 26 Kasım: "Sıralı dizideyse gri olmasın." Açık bir kart,
// kendisinden sütunun sonuna kadar aynı takımdan, birer birer küçülerek giden bir dizi oluşturuyorsa
// (tasinabilirMi) açık renkte kalır; o an gidecek yeri olmasa da. Yalnız sırayı bozan bir kartın
// altında kaldığı için taşınamayan açık kartlar koyulaşır. Örnek: 10♠ üstünde 9♠ ikisi de açık;
// 7♠ üstünde 6♥ varsa 7♠ koyu. Eski kural ("o an bir yere gidebiliyorsa açık", oynanabilirKartlar)
// sıralı dizileri de koyulaştırıyordu; o fonksiyon duruyor ama gri kuralı artık onu kullanmaz.
// Sütunun en önündeki kart hiç koyulaşmaz (Kemal, 15 Kasım gece: "Bir kart en öndeyse koyu
// olmaz"); tasinabilirMi onun için zaten doğrudur. Kapalı kartlar listeye girmez.
// Dönen: koyu çizilecek kartların kimlikleri.
export function koyulasacakKartlar(masa: SpiderMasasi): Set<string> {
  const sonuc = new Set<string>();
  masa.sutunlar.forEach((s, sutun) => {
    for (let i = 0; i < s.length - 1; i++) if (s[i].acik && !tasinabilirMi(masa, sutun, i)) sonuc.add(s[i].id);
  });
  return sonuc;
}
