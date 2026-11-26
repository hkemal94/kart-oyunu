// Klasik solitaire (Klondike) kuralları (tasarım belgesi 1.1; yol haritası, 3. paket). Standart
// kurallar, yeni kural yok. Ekrandan ayrı durur: burada yalnız masanın durumu ve kurallar var,
// çizim yok. Testleri: testler/klondike.test.ts. Ortak parçalar (karıştırma, geri al) ortak.ts'te.

import type { Kart, Takim } from './kart';
import { geriAl as ortakGeriAl, karistir, type GeriAlSonucu } from './ortak.ts';

export const KLONDIKE_SUTUN_SAYISI = 7;
export const KLONDIKE_KART_SAYISI = 52;
const PAPAZ = 13;
// Dört temel yığın; her yığın tek takımın yeri, astan papaza (belge 1.1). Yığının takımı sabit:
// as hangi yığına bırakılırsa bırakılsın kendi takımının yerine gider.
export const TEMEL_TAKIMLARI: Takim[] = ['maca', 'kupa', 'karo', 'sinek'];
const KIRMIZI: Takim[] = ['kupa', 'karo'];

// Zorluk: 1 kart çekme (kolay) ya da 3 kart çekme (klasik) (belge 1.1).
export type CekmeSayisi = 1 | 3;

export interface KlondikeMasasi {
  sutunlar: Kart[][]; // yedi sütun
  temeller: Kart[][]; // TEMEL_TAKIMLARI sırasıyla; her yığının en üstteki kartı sonda
  deste: Kart[]; // çekme destesi, kapalı; en üstteki kart sonda
  acilan: Kart[]; // desteden açılan kartlar; en üstteki (oynanabilen) sonda
  cekme: CekmeSayisi;
  hamle: number; // taşıma, çekme ve destenin dönüşü birer hamle
}

// Bir kartın ya da dizinin alındığı yer
export type Yer =
  | { tur: 'sutun'; no: number; sira: number }
  | { tur: 'acilan' }
  | { tur: 'temel'; no: number };
// Bırakılacak yer. Temelde yığın seçilmez: kart kendi takımının yığınına gider.
export type Hedef = { tur: 'sutun'; no: number } | { tur: 'temel' };

const kirmiziMi = (t: Takim) => KIRMIZI.includes(t);
export const temelNo = (t: Takim) => TEMEL_TAKIMLARI.indexOf(t);

export function klondikeKartlari(): Kart[] {
  const kartlar: Kart[] = [];
  for (const takim of TEMEL_TAKIMLARI) {
    for (let deger = 1; deger <= PAPAZ; deger++) {
      kartlar.push({ id: `${takim}-${deger}`, takim, deger, acik: false });
    }
  }
  return kartlar;
}

// Yedi sütun: birinciye bir, yedinciye yedi kart; her sütunun en üstteki kartı açık. Kalan 24
// kart çekme destesinde (belge 1.1).
export function klondikeDagit(cekme: CekmeSayisi, rastgele: () => number = Math.random): KlondikeMasasi {
  const karisik = karistir(klondikeKartlari(), rastgele);
  const sutunlar: Kart[][] = Array.from({ length: KLONDIKE_SUTUN_SAYISI }, (_, i) => karisik.splice(0, i + 1));
  sutunlar.forEach((s) => {
    s[s.length - 1] = { ...s[s.length - 1], acik: true };
  });
  return { sutunlar, temeller: TEMEL_TAKIMLARI.map(() => []), deste: karisik, acilan: [], cekme, hamle: 0 };
}

// Yerdeki kartlar (sütunda sira'dan sona; açılanda ve temelde yalnız en üstteki)
export function yerdekiKartlar(masa: KlondikeMasasi, yer: Yer): Kart[] {
  if (yer.tur === 'sutun') return masa.sutunlar[yer.no]?.slice(yer.sira) ?? [];
  const yigin = yer.tur === 'acilan' ? masa.acilan : masa.temeller[yer.no] ?? [];
  return yigin.length ? [yigin[yigin.length - 1]] : [];
}

// Yerden alınabilir mi. Sütunda: sira'dan sona hepsi açık, birer küçülerek ve renk değişerek
// sıralı (açık sıralı dizi birlikte taşınır). Açılanda ve temelde en üstteki kart.
export function tasinabilirMi(masa: KlondikeMasasi, yer: Yer): boolean {
  if (yer.tur !== 'sutun') return yerdekiKartlar(masa, yer).length === 1;
  const s = masa.sutunlar[yer.no];
  if (!s || yer.sira < 0 || yer.sira >= s.length) return false;
  for (let i = yer.sira; i < s.length; i++) {
    if (!s[i].acik) return false;
    if (i > yer.sira && (s[i].deger !== s[i - 1].deger - 1 || kirmiziMi(s[i].takim) === kirmiziMi(s[i - 1].takim))) {
      return false;
    }
  }
  return true;
}

// Bırakılabilir mi. Temele: tek kart, kendi takımının yığınına, bir büyük değer (as boş yığına).
// Sütuna: bir küçük ve ters renk; boş sütuna yalnız papaz ya da papazla başlayan dizi.
export function birakilabilirMi(masa: KlondikeMasasi, yer: Yer, hedef: Hedef): boolean {
  if (!tasinabilirMi(masa, yer)) return false;
  const kartlar = yerdekiKartlar(masa, yer);
  const kart = kartlar[0];
  if (hedef.tur === 'temel') {
    if (kartlar.length !== 1 || yer.tur === 'temel') return false;
    return kart.deger === masa.temeller[temelNo(kart.takim)].length + 1;
  }
  if (yer.tur === 'sutun' && yer.no === hedef.no) return false;
  const h = masa.sutunlar[hedef.no];
  if (!h) return false;
  if (h.length === 0) return kart.deger === PAPAZ;
  const ust = h[h.length - 1];
  return ust.acik && ust.deger === kart.deger + 1 && kirmiziMi(ust.takim) !== kirmiziMi(kart.takim);
}

// Sütunun üstünde kapalı kart kaldıysa kendiliğinden açılır
function toparla(masa: KlondikeMasasi): KlondikeMasasi {
  const sutunlar = masa.sutunlar.map((s) => {
    const son = s[s.length - 1];
    return son && !son.acik ? [...s.slice(0, -1), { ...son, acik: true }] : s;
  });
  return { ...masa, sutunlar };
}

// Kurala uyan taşımayı yapar; uymayanda null döner (ekran kartı yerine geri götürür).
export function tasi(masa: KlondikeMasasi, yer: Yer, hedef: Hedef): KlondikeMasasi | null {
  if (!birakilabilirMi(masa, yer, hedef)) return null;
  const sutunlar = masa.sutunlar.map((s) => [...s]);
  const temeller = masa.temeller.map((t) => [...t]);
  const acilan = [...masa.acilan];
  let giden: Kart[];
  if (yer.tur === 'sutun') giden = sutunlar[yer.no].splice(yer.sira);
  else if (yer.tur === 'acilan') giden = acilan.splice(-1);
  else giden = temeller[yer.no].splice(-1);
  if (hedef.tur === 'temel') temeller[temelNo(giden[0].takim)].push(...giden);
  else sutunlar[hedef.no].push(...giden);
  return toparla({ ...masa, sutunlar, temeller, acilan, hamle: masa.hamle + 1 });
}

// Karta çift dokununca: kart uygun temel yığına gidebiliyorsa yeni masa, gidemiyorsa null.
export function temeleGonder(masa: KlondikeMasasi, yer: Yer): KlondikeMasasi | null {
  if (yer.tur === 'sutun' && yer.sira !== masa.sutunlar[yer.no]?.length - 1) return null;
  return tasi(masa, yer, { tur: 'temel' });
}

// Desteye dokununca ne olur: kart çekilir, açılanlar destenin altına döner ya da hiçbir şey.
export type CekmeDurumu = 'cek' | 'dondur' | 'bos';
export function cekmeDurumu(masa: KlondikeMasasi): CekmeDurumu {
  if (masa.deste.length > 0) return 'cek';
  return masa.acilan.length > 0 ? 'dondur' : 'bos';
}

// Desteden 1 ya da 3 kart açar (üçlüde en son açılan en üstte kalır). Deste bitince açılanlar
// sırası bozulmadan, kapalı olarak destenin altına döner; dönüş sınırsız (belge 1.1; sınır açık
// soru). İkisi de boşsa null.
export function cek(masa: KlondikeMasasi): KlondikeMasasi | null {
  const durum = cekmeDurumu(masa);
  if (durum === 'bos') return null;
  if (durum === 'dondur') {
    const deste = [...masa.acilan].reverse().map((k) => ({ ...k, acik: false }));
    return { ...masa, deste, acilan: [], hamle: masa.hamle + 1 };
  }
  const deste = [...masa.deste];
  const acilan = [...masa.acilan];
  for (let i = 0; i < masa.cekme && deste.length > 0; i++) {
    acilan.push({ ...deste.pop()!, acik: true });
  }
  return { ...masa, deste, acilan, hamle: masa.hamle + 1 };
}

export function kazandiMi(masa: KlondikeMasasi): boolean {
  return masa.temeller.reduce((t, y) => t + y.length, 0) >= KLONDIKE_KART_SAYISI;
}

// ---------------------------------------------------------------------------------------------
// Yardımcılar (belge 1.3): geri al ve ipucu, Spider'daki gibi.

export function geriAl(masa: KlondikeMasasi, gecmis: KlondikeMasasi[]): GeriAlSonucu<KlondikeMasasi> | null {
  return ortakGeriAl(masa, gecmis);
}

// İpucu: ya bir taşıma ya da "desteden çek".
export type KlondikeIpucu = { tur: 'tasi'; yer: Yer; hedef: Hedef } | { tur: 'cek' };

// Masadaki işe yarar hamleler, öncelik sırasıyla (öneri; belgede Klondike için ayrı sıra yok):
// önce temele giden, sonra kapalı kartı açan, sonra öbürleri. Hiç taşıma yoksa ve desteden
// çekilebiliyorsa (ya da deste dönebiliyorsa) yalnız "çek". Boş liste: yapılacak bir şey yok.
// Bir şey kazandırmayan hamleler önerilmez: papazı bir boş sütundan öbürüne taşımak, zaten uygun
// bir kartın üstündeki diziyi başka sütuna taşımak (altındaki kart temele gidemiyorsa), temelden
// geri almak.
export function ipuclari(masa: KlondikeMasasi): KlondikeIpucu[] {
  const adaylar: { ipucu: KlondikeIpucu; puan: number }[] = [];
  const ilkBos = masa.sutunlar.findIndex((s) => s.length === 0);
  const sutunHedefleri = (yer: Yer, puan: number) => {
    masa.sutunlar.forEach((h, no) => {
      if (h.length === 0 && no !== ilkBos) return; // boş sütunlar birbirinin aynısı
      const hedef: Hedef = { tur: 'sutun', no };
      if (birakilabilirMi(masa, yer, hedef)) adaylar.push({ ipucu: { tur: 'tasi', yer, hedef }, puan });
    });
  };
  const temeleGider = (k: Kart) => k.deger === masa.temeller[temelNo(k.takim)].length + 1;

  masa.sutunlar.forEach((s, no) => {
    for (let sira = 0; sira < s.length; sira++) {
      const yer: Yer = { tur: 'sutun', no, sira };
      if (!tasinabilirMi(masa, yer)) continue;
      const alt = s[sira - 1]; // dizinin altında kalan kart
      const kartAcar = !!alt && !alt.acik;
      if (sira === s.length - 1 && birakilabilirMi(masa, yer, { tur: 'temel' })) {
        adaylar.push({ ipucu: { tur: 'tasi', yer, hedef: { tur: 'temel' } }, puan: 8 + (kartAcar ? 4 : 0) });
      }
      if (sira === 0 && s[0].deger === PAPAZ) continue; // papaz zaten sütunun dibinde
      if (alt && alt.acik && !temeleGider(alt)) continue; // zaten uygun kartın üstünde
      sutunHedefleri(yer, kartAcar ? 4 : alt ? 2 : 1);
    }
  });
  if (masa.acilan.length > 0) {
    const yer: Yer = { tur: 'acilan' };
    if (birakilabilirMi(masa, yer, { tur: 'temel' })) {
      adaylar.push({ ipucu: { tur: 'tasi', yer, hedef: { tur: 'temel' } }, puan: 8 });
    }
    sutunHedefleri(yer, 1);
  }
  // Sıralama kararlı: aynı puanda soldaki sütun önce, açılan kart en sonda gelir
  const sirali = adaylar.sort((a, b) => b.puan - a.puan).map((a) => a.ipucu);
  if (sirali.length === 0 && cekmeDurumu(masa) !== 'bos') return [{ tur: 'cek' }];
  return sirali;
}

// ---------------------------------------------------------------------------------------------
// Kemal'in telefon yorumları (15 Kasım). Ekrandan ayrı; testleri testler/oynanabilir.test.ts.

// Bir yerden gidilebilecek bütün yerler: önce temel, sonra dolu sütunlar, en son boş sütun
// (soldan sağa). Kendi sütunu ve temelden temele sayılmaz.
function gidilecekYerler(masa: KlondikeMasasi, yer: Yer): Hedef[] {
  const yerler: Hedef[] = [];
  if (birakilabilirMi(masa, yer, { tur: 'temel' })) yerler.push({ tur: 'temel' });
  const sutunlar = masa.sutunlar.map((s, no) => ({ no, bos: s.length === 0 }));
  for (const bos of [false, true]) {
    for (const s of sutunlar) {
      if (s.bos !== bos) continue;
      const hedef: Hedef = { tur: 'sutun', no: s.no };
      if (birakilabilirMi(masa, yer, hedef)) yerler.push(hedef);
    }
  }
  return yerler;
}

// Çift dokunuş (Kemal): kart önce temel yığına, gidemiyorsa uygun bir sütuna gider (dolu sütun boş
// sütundan önce). Sütunda dokunulan kart üstündeki diziyle birlikte gider; temele yalnız sütunun en
// üstteki kartı gider. Gidecek yer yoksa null (ekran kartı hafifçe sallar).
export function ciftDokunusHedefi(masa: KlondikeMasasi, yer: Yer): Hedef | null {
  return gidilecekYerler(masa, yer)[0] ?? null;
}

// Oynanabilir kartlar (Kemal: "o an hiçbir yere oynanamayan açık kartlar koyulaşsın"). Açık bir
// kart, kendisi ya da üstünde durduğu birlikte taşınabilir dizi o an kurala uygun bir yere (temel
// ya da sütun) gidebiliyorsa oynanabilir. Açılanlarda ve temelde yalnız en üstteki kart alınabilir;
// altındakiler oynanamaz. Kapalı kartlar (deste dahil) listeye girmez.
// 26 Kasım'dan beri gri kuralı sütunlarda bunu kullanmaz (koyulasacakKartlar); açılanlarda ve temellerde
// kullanır. Kural ve testleri duruyor.
export function oynanabilirKartlar(masa: KlondikeMasasi): Set<string> {
  const sonuc = new Set<string>();
  masa.sutunlar.forEach((s, no) => {
    for (let sira = 0; sira < s.length; sira++) {
      const yer: Yer = { tur: 'sutun', no, sira };
      if (!tasinabilirMi(masa, yer) || gidilecekYerler(masa, yer).length === 0) continue;
      for (let i = sira; i < s.length; i++) sonuc.add(s[i].id);
      break;
    }
  });
  const ustte = (yer: Yer) => {
    const k = yerdekiKartlar(masa, yer)[0];
    if (k && gidilecekYerler(masa, yer).length > 0) sonuc.add(k.id);
  };
  ustte({ tur: 'acilan' });
  masa.temeller.forEach((_, no) => ustte({ tur: 'temel', no }));
  return sonuc;
}

// Koyulaşacak kartlar (gri kural). Kemal, 26 Kasım: "Klasik solitaire de Spider gibi olsun — sıralı
// dizi açık, yalnız sırası bozulanların altındakiler koyu; açıklama iki oyun için de doğru kalsın."
// Sütunlarda: açık bir kart, kendisinden sütunun sonuna kadar oyunun kuralıyla birlikte taşınabilen
// bir dizi kuruyorsa (renkleri sırayla değişen, birer birer küçülen açık kartlar; tasinabilirMi) açık
// renkte kalır, o an gidecek yeri olmasa da. Yalnız sırayı bozan bir kartın altında kaldığı için
// taşınamayan açık kartlar koyulaşır. Sütunun en önündeki kart hiç koyulaşmaz (Kemal, 15 Kasım gece:
// "Bir kart en öndeyse koyu olmaz"); tasinabilirMi onun için zaten doğrudur. Kapalı kartlar listeye girmez.
// Not: oyunun kendi hamleleri sütunlarda hep kurala uygun açık dizi bıraktığı için sütunlarda koyu kart
// normalde hiç çıkmaz (geri al da yalnız önceki geçerli masaya döner).
// Açılanlar ve temeller değişmedi (eski kural, oynanabilirKartlar): en üstteki kart hiç koyulaşmaz,
// altındaki açık kartlar alınamadığı için koyudur (3 kart çekmede yelpazedeki arka kartlar).
// Dönen: koyu çizilecek kartların kimlikleri.
export function koyulasacakKartlar(masa: KlondikeMasasi): Set<string> {
  const sonuc = new Set<string>();
  masa.sutunlar.forEach((s, no) => {
    for (let sira = 0; sira < s.length - 1; sira++) {
      if (s[sira].acik && !tasinabilirMi(masa, { tur: 'sutun', no, sira })) sonuc.add(s[sira].id);
    }
  });
  const oynanir = oynanabilirKartlar(masa);
  const arkadakiler = (yigin: Kart[]) => {
    for (let i = 0; i < yigin.length - 1; i++) if (yigin[i].acik && !oynanir.has(yigin[i].id)) sonuc.add(yigin[i].id);
  };
  arkadakiler(masa.acilan);
  masa.temeller.forEach(arkadakiler);
  return sonuc;
}

// ---------------------------------------------------------------------------------------------
// Kendiliğinden bitirme (yol haritası 4. paket; Kemal, 15 Kasım). Ekrandan ayrı; testleri
// testler/bitirme.test.ts. Oyun bunu kendisi başlatmaz: masada "Bitir" düğmesi çıkar, basınca kartlar
// birer birer temellere gider.

// Bitirilebilir mi: el bitmemiş, deste ve açılan kartlar boş, sütunlardaki bütün kartlar açık. Bu
// durumda el her zaman biter: sütunlardaki açık kartlar sıralı olduğu için kalan en küçük kart hep
// bir sütunun en üstündedir ve kendi temeline gider.
export function bitirilebilirMi(masa: KlondikeMasasi): boolean {
  return (
    !kazandiMi(masa) &&
    masa.deste.length === 0 &&
    masa.acilan.length === 0 &&
    masa.sutunlar.every((s) => s.every((k) => k.acik))
  );
}

// Bitirmenin adımları: her adımda değeri en küçük olan üst kart (eşitse soldaki sütun) temele gider.
// Her adım bir hamle sayılır (elle bitirmekle aynı puan). Dizinin son masası kazanılmış eldir.
// Bitirilemiyorsa boş liste.
export function bitirmeAdimlari(masa: KlondikeMasasi): KlondikeMasasi[] {
  if (!bitirilebilirMi(masa)) return [];
  const adimlar: KlondikeMasasi[] = [];
  let simdiki = masa;
  while (!kazandiMi(simdiki)) {
    let no = -1;
    for (let c = 0; c < simdiki.sutunlar.length; c++) {
      const s = simdiki.sutunlar[c];
      const ust = s[s.length - 1];
      if (!ust || ust.deger !== simdiki.temeller[temelNo(ust.takim)].length + 1) continue;
      if (no < 0 || ust.deger < simdiki.sutunlar[no][simdiki.sutunlar[no].length - 1].deger) no = c;
    }
    if (no < 0) return []; // olmaması gerekir; olursa hiç başlamaz
    const yeni = tasi(simdiki, { tur: 'sutun', no, sira: simdiki.sutunlar[no].length - 1 }, { tur: 'temel' });
    if (!yeni) return [];
    adimlar.push(yeni);
    simdiki = yeni;
  }
  return adimlar;
}
