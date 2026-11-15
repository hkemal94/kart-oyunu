// Günlük mücadele (yol haritası 8; belge 8.1). Kurallar ekrandan ayrı; testleri
// testler/gunluk.test.ts. Bu dosya ekrana dokunmaz.
//
// Kemal'in kararları (15 Kasım):
// - Her gün bir el. Kazanınca takvimde o güne yıldız konur.
// - Oyunu ve zorluğu oyuncu seçer (Spider 1/2/4 renk, klasik solitaire 1/3 kart).
// - Geçmiş günler sonradan oynanabilir; kazanılınca o güne de yıldız gelir. Gelecek günler kilitli.
// - Ayın bütün günleri yıldızlanınca o ayın ödülü gelir (görseli [Kemal]).
// - Günlük el puan serisine sayılır: puan anahtarı normal elinkiyle aynıdır (src/kart/puan.ts).
//
// Belgedeki öneri (Kemal "bunu yap" dedi): aynı gün, aynı oyun ve zorlukta herkese aynı dağıtım.
// Dağıtım tarih, oyun ve zorluktan türeyen sabit bir sayıyla karıştırılır (gunlukRastgele).

import { yarimElOku, yarimElSil, yarimElYaz, type Depo, type YarimEl } from './yarimEl.ts';

export type GunlukOyun = 'spider' | 'klasik';

// Günün eli: tarih ("2026-11-15" biçiminde, telefonun saatine göre), oyun ve zorluk
export interface GunlukEl {
  tarih: string;
  oyun: GunlukOyun;
  zorluk: number;
}

// ---------------------------------------------------------------------------------------------
// Tarih. Gün telefonun kendi saatine göre değişir (yerel gece yarısı).

const iki = (n: number) => String(n).padStart(2, '0');

export const tarihYaz = (yil: number, ay: number, gun: number) => `${yil}-${iki(ay)}-${iki(gun)}`;

export function tarihtenBugun(simdi: Date = new Date()): string {
  return tarihYaz(simdi.getFullYear(), simdi.getMonth() + 1, simdi.getDate());
}

export function tarihOku(tarih: string): { yil: number; ay: number; gun: number } {
  const [yil, ay, gun] = tarih.split('-').map(Number);
  return { yil, ay, gun };
}

export const ayinGunSayisi = (yil: number, ay: number) => new Date(yil, ay, 0).getDate();

// Ayın ilk günü haftanın kaçıncı günü (Pazartesi 0, Pazar 6)
export const ayinIlkGunu = (yil: number, ay: number) => (new Date(yil, ay - 1, 1).getDay() + 6) % 7;

// Takvim hücreleri: Pazartesi'den başlayan haftalar; ay başından önceki boş yerler null
export function takvimHucreleri(yil: number, ay: number): (number | null)[] {
  const bos: null[] = Array.from({ length: ayinIlkGunu(yil, ay) }, () => null);
  const gunler = Array.from({ length: ayinGunSayisi(yil, ay) }, (_, i) => i + 1);
  const hucreler: (number | null)[] = [...bos, ...gunler];
  while (hucreler.length % 7) hucreler.push(null);
  return hucreler;
}

export const oncekiAy = (yil: number, ay: number) => (ay === 1 ? { yil: yil - 1, ay: 12 } : { yil, ay: ay - 1 });

// Takvim en çok Ocak 2026'ya kadar geri gider (Kemal, 15 Kasım). O ayda geri ok kapalı.
export const TAKVIM_ILK_AY = { yil: 2026, ay: 1 };
export const oncekiAyaGidilirMi = (yil: number, ay: number) =>
  yil > TAKVIM_ILK_AY.yil || (yil === TAKVIM_ILK_AY.yil && ay > TAKVIM_ILK_AY.ay);
// Görülecek ay sınırın gerisindeyse sınıra çekilir
export const takvimAyi = (yil: number, ay: number) =>
  yil < TAKVIM_ILK_AY.yil || (yil === TAKVIM_ILK_AY.yil && ay < TAKVIM_ILK_AY.ay) ? { ...TAKVIM_ILK_AY } : { yil, ay };
export const sonrakiAy = (yil: number, ay: number) => (ay === 12 ? { yil: yil + 1, ay: 1 } : { yil, ay: ay + 1 });

export type GunDurumu = 'gecmis' | 'bugun' | 'gelecek';

// Tarihler "YYYY-AA-GG" biçiminde olduğu için yazı olarak karşılaştırılır
export function gunDurumu(tarih: string, bugun: string): GunDurumu {
  if (tarih === bugun) return 'bugun';
  return tarih < bugun ? 'gecmis' : 'gelecek';
}

// Geçmiş günler ve bugün oynanır; gelecek günler kilitli (Kemal, 15 Kasım)
export const oynanabilirMi = (tarih: string, bugun: string) => gunDurumu(tarih, bugun) !== 'gelecek';

// ---------------------------------------------------------------------------------------------
// Sabit karıştırma: aynı tarih, oyun ve zorluk her telefonda aynı sayı dizisini verir.

// Yazıdan 32 bitlik sayı (FNV-1a)
export function gunlukTohum(el: GunlukEl): number {
  const yazi = `${el.tarih}|${el.oyun}|${el.zorluk}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < yazi.length; i++) {
    h ^= yazi.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Tohumdan 0 ile 1 arasında sayı dizisi (mulberry32); her çağrıda baştan başlar
export function tohumluRastgele(tohum: number): () => number {
  let a = tohum >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const gunlukRastgele = (el: GunlukEl) => tohumluRastgele(gunlukTohum(el));

// ---------------------------------------------------------------------------------------------
// Yıldızlar. Telefonun tarayıcısında saklanır.

export interface GunlukKaydi {
  yildizlar: string[]; // kazanılan günler, sıralı
}

export const GUNLUK_ANAHTARI = 'kartOyunu.gunluk';
export const bosGunluk = (): GunlukKaydi => ({ yildizlar: [] });

const TARIH_BICIMI = /^\d{4}-\d{2}-\d{2}$/;

export function gunlukOku(depo: Pick<Depo, 'getItem'>): GunlukKaydi {
  try {
    const v = JSON.parse(depo.getItem(GUNLUK_ANAHTARI) ?? 'null') as Partial<GunlukKaydi> | null;
    if (!v || !Array.isArray(v.yildizlar)) return bosGunluk();
    const yildizlar = [...new Set(v.yildizlar.filter((t): t is string => typeof t === 'string' && TARIH_BICIMI.test(t)))];
    return { yildizlar: yildizlar.sort() };
  } catch {
    return bosGunluk();
  }
}

export function gunlukYaz(depo: Pick<Depo, 'setItem'>, k: GunlukKaydi): void {
  try {
    depo.setItem(GUNLUK_ANAHTARI, JSON.stringify(k));
  } catch {
    // saklama kapalıysa yıldız yalnız bu açılışta durur
  }
}

export const yildizVarMi = (k: GunlukKaydi, tarih: string) => k.yildizlar.includes(tarih);

export const aydakiYildizlar = (k: GunlukKaydi, yil: number, ay: number) =>
  k.yildizlar.filter((t) => t.startsWith(`${yil}-${iki(ay)}-`)).length;

export const ayTamamMi = (k: GunlukKaydi, yil: number, ay: number) =>
  aydakiYildizlar(k, yil, ay) === ayinGunSayisi(yil, ay);

// Bütün günleri yıldızlanan aylar ("2026-11" biçiminde, eskiden yeniye): her biri bir aylık ödül
export function tamamlananAylar(k: GunlukKaydi): string[] {
  const aylar = [...new Set(k.yildizlar.map((t) => t.slice(0, 7)))].sort();
  return aylar.filter((a) => {
    const [yil, ay] = a.split('-').map(Number);
    return ayTamamMi(k, yil, ay);
  });
}

export interface YildizSonucu {
  kayit: GunlukKaydi;
  yeniYildiz: boolean; // bu kazançla ilk kez yıldız geldi
  ayTamam: boolean; // bu yıldızla ay tamamlandı (ayın ödülü geldi)
}

// Günün eli kazanıldı: o güne yıldız konur. Gelecek bir güne yıldız konmaz.
export function yildizEkle(k: GunlukKaydi, tarih: string, bugun: string): YildizSonucu {
  if (!oynanabilirMi(tarih, bugun) || yildizVarMi(k, tarih)) return { kayit: k, yeniYildiz: false, ayTamam: false };
  const kayit = { yildizlar: [...k.yildizlar, tarih].sort() };
  const { yil, ay } = tarihOku(tarih);
  return { kayit, yeniYildiz: true, ayTamam: ayTamamMi(kayit, yil, ay) };
}

// ---------------------------------------------------------------------------------------------
// Günlük elin yarısı (kaldığı yerden devam): normal yarım elden ayrı yerde saklanır, karışmaz.
// Tek günlük yarım el olur; tarihi yanında durur.

export const GUNLUK_YARIM_ANAHTARI = 'kartOyunu.gunlukYarimEl';

export interface GunlukYarimEl {
  tarih: string;
  el: YarimEl;
}

export function gunlukYarimElOku(depo: Pick<Depo, 'getItem'>): GunlukYarimEl | null {
  const el = yarimElOku(depo, GUNLUK_YARIM_ANAHTARI);
  if (!el) return null;
  try {
    const tarih = JSON.parse(depo.getItem(GUNLUK_YARIM_ANAHTARI) ?? 'null')?.tarih;
    return typeof tarih === 'string' && TARIH_BICIMI.test(tarih) ? { tarih, el } : null;
  } catch {
    return null;
  }
}

export const gunlukYarimElYaz = (depo: Depo, tarih: string, el: YarimEl) =>
  yarimElYaz(depo, { ...el, tarih } as unknown as YarimEl, GUNLUK_YARIM_ANAHTARI);

export const gunlukYarimElSil = (depo: Depo) => yarimElSil(depo, GUNLUK_YARIM_ANAHTARI);

// Yarım el bu günün bu oyun ve zorluktaki eli mi
export const ayniElMi = (y: GunlukYarimEl, el: GunlukEl) =>
  y.tarih === el.tarih && y.el.oyun === el.oyun && y.el.zorluk === el.zorluk;
