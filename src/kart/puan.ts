// Puan ve en iyi puan (yol haritası, 6. paket; belge 8.3). Kurallar ekrandan ayrı; testleri
// testler/puan.test.ts. Bu dosya yalnız masa türlerini içe alır, ekrana dokunmaz.
//
// Kemal'in kararları (15 Kasım):
// - Puan kazandıkça birikir: el kazanılınca puan bir sonraki ele taşınır, aşama bir artar.
//   Yüksek aşama daha çok puan getirir.
// - Seri biter: kaybedince ya da el yarımken yeni oyuna geçince (eli bırakma) puan sıfırdan,
//   aşama 1'den başlar.
// - En iyi puan: en yüksek seri puanı; oyun ve zorluk başına ayrı.
// - Geri al bir hamle sayılır (hamle sayısını masa tutar; burada ayrıca bir şey yok).
// - Günlük mücadele eli de seriye sayılır (8. paket). O paket yalnız aynı işlevleri çağırır:
//   kazanınca elKazanildi, kaybedince ya da bırakınca seriBitir. Burada ayrıca bir şey gerekmez.
//
// Formül Kemal'in: ajans üç aday getirdi (a, b, c). Deneme için adres sonuna ?puan=b gibi yazılır.
// Aşağıdaki BÜTÜN SAYILAR ADAY, KEMAL SEÇECEK: karar değildir, kod çalışsın diye konuldu.

import type { SpiderMasasi } from './spider';
import type { KlondikeMasasi } from './klondike';

export type PuanAdayi = 'a' | 'b' | 'c';
export const PUAN_ADAYLARI: PuanAdayi[] = ['a', 'b', 'c'];
// Seçim gelene kadar varsayılan aday. ADAY, KEMAL SEÇECEK.
export const PUAN_ADAYI_VARSAYILANI: PuanAdayi = 'a';
const ADRES_ANAHTARI = 'puan';

// Adresteki ?puan= değerini okur; yoksa ya da bozuksa varsayılan aday.
export function puanAdayi(adresSorgusu: string): PuanAdayi {
  const ham = new URLSearchParams(adresSorgusu).get(ADRES_ANAHTARI)?.trim().toLowerCase();
  return PUAN_ADAYLARI.includes(ham as PuanAdayi) ? (ham as PuanAdayi) : PUAN_ADAYI_VARSAYILANI;
}

// ---------------------------------------------------------------------------------------------
// Bir elin puana giren özeti. Masadan çıkarılır (spiderOzeti, klondikeOzeti); geri alınınca masa
// eski hâline döndüğü için özet de geri döner.

export type Oyun = 'spider' | 'klasik';

export interface ElOzeti {
  oyun: Oyun;
  hamle: number;
  saniye: number;
  ilerleme: number; // Spider: tamamlanan dizi; klasik solitaire: temeldeki kart
  acilanKapali: number; // el başında kapalı olup açılan kart sayısı
}

// El başında sütunlarda kapalı duran kart sayısı (belge 1.1 ve 1.2)
const SPIDER_ILK_KAPALI = 44; // 54 kart dağıtılır, 10'u açık
const KLONDIKE_ILK_KAPALI = 21; // 28 kart dağıtılır, 7'si açık

const kapaliSay = (sutunlar: { acik: boolean }[][]) =>
  sutunlar.reduce((t, s) => t + s.filter((k) => !k.acik).length, 0);

export function spiderOzeti(masa: SpiderMasasi, saniye: number): ElOzeti {
  return {
    oyun: 'spider',
    hamle: masa.hamle,
    saniye,
    ilerleme: masa.tamamlanan.length,
    acilanKapali: Math.max(0, SPIDER_ILK_KAPALI - kapaliSay(masa.sutunlar)),
  };
}

export function klondikeOzeti(masa: KlondikeMasasi, saniye: number): ElOzeti {
  return {
    oyun: 'klasik',
    hamle: masa.hamle,
    saniye,
    ilerleme: masa.temeller.reduce((t, y) => t + y.length, 0),
    acilanKapali: Math.max(0, KLONDIKE_ILK_KAPALI - kapaliSay(masa.sutunlar)),
  };
}

// ---------------------------------------------------------------------------------------------
// Üç aday. Her biri bir elin puanını verir: özet, elin aşaması (1, 2, 3…) ve el kazanıldı mı.
// Masada gösterilen puan "şimdi bitse" değeridir (kazanildi = false); el kazanılınca kesin puan
// kazanildi = true ile hesaplanır. Bütün sayılar ADAY, KEMAL SEÇECEK.

// Aday a · Çarpanlı taban: her el sabit bir tabanla başlar; her hamle ve geçen süre tabandan
// düşer (bir alt sınırın altına inmez); sonuç aşama sayısıyla çarpılır (Aşama 2'de iki katı).
export const ADAY_A = {
  taban: 2000, // ADAY, KEMAL SEÇECEK
  hamleBasi: 2, // her hamle tabandan düşer. ADAY, KEMAL SEÇECEK
  saniyeBasi: 0.5, // her saniye tabandan düşer (dakikada 30). ADAY, KEMAL SEÇECEK
  enAz: 200, // kazanılan el en az bu kadar getirir. ADAY, KEMAL SEÇECEK
};

function adayA(o: ElOzeti, asama: number): number {
  const ham = ADAY_A.taban - ADAY_A.hamleBasi * o.hamle - Math.floor(ADAY_A.saniyeBasi * o.saniye);
  return Math.max(ADAY_A.enAz, ham) * asama;
}

// Aday b · Hamle başı puan: puan oynarken toplanır. Her ilerleme (Spider'da tamamlanan dizi,
// klasik solitaire'de temele giden kart) ve açılan her kapalı kart puan getirir; her hamle bir
// puan götürür. El kazanılınca hızlı bitirene süre bonusu eklenir. Toplam, aşama başına yarım
// kat büyür (Aşama 2'de 1,5 katı, Aşama 3'te 2 katı).
export const ADAY_B = {
  dizi: 100, // Spider'da tamamlanan her dizi. ADAY, KEMAL SEÇECEK
  temelKarti: 15, // klasik solitaire'de temele giden her kart. ADAY, KEMAL SEÇECEK
  acilanKart: 5, // açılan her kapalı kart. ADAY, KEMAL SEÇECEK
  hamleBasi: 1, // her hamle götürür. ADAY, KEMAL SEÇECEK
  sureTavani: 1200, // süre bonusu: bu kadar saniyeden (20 dakika) önce biten ele, kalan her saniye bir puan. ADAY, KEMAL SEÇECEK
  asamaArtisi: 0.5, // aşama başına çarpana eklenen. ADAY, KEMAL SEÇECEK
};

function adayB(o: ElOzeti, asama: number, kazanildi: boolean): number {
  const ilerleme = o.ilerleme * (o.oyun === 'spider' ? ADAY_B.dizi : ADAY_B.temelKarti);
  const oyunda = Math.max(0, ilerleme + o.acilanKapali * ADAY_B.acilanKart - o.hamle * ADAY_B.hamleBasi);
  const bonus = kazanildi ? Math.max(0, ADAY_B.sureTavani - o.saniye) : 0;
  return Math.round((oyunda + bonus) * (1 + ADAY_B.asamaArtisi * (asama - 1)));
}

// Aday c · Bonuslu sabit puan: kazanılan her el sabit bir puan getirir; üstüne hızlı bitirene
// süre bonusu, az hamleyle bitirene hamle bonusu eklenir. Aşama çarpmaz, her aşama sabit bir ek
// getirir (Aşama 2'de bir ek, Aşama 3'te iki ek).
export const ADAY_C = {
  taban: 1000, // ADAY, KEMAL SEÇECEK
  sureTavani: 1200, // bu kadar saniyeden (20 dakika) önce biten ele kalan her saniye bir puan. ADAY, KEMAL SEÇECEK
  hamleTavani: 300, // bu kadar hamleden az bitene kalan her hamle için hamleBonusu. ADAY, KEMAL SEÇECEK
  hamleBonusu: 2, // ADAY, KEMAL SEÇECEK
  asamaEki: 250, // Aşama 1'in üstündeki her aşama için. ADAY, KEMAL SEÇECEK
};

function adayC(o: ElOzeti, asama: number): number {
  const sure = Math.max(0, ADAY_C.sureTavani - o.saniye);
  const hamle = Math.max(0, ADAY_C.hamleTavani - o.hamle) * ADAY_C.hamleBonusu;
  return ADAY_C.taban + sure + hamle + ADAY_C.asamaEki * (asama - 1);
}

export function elPuani(aday: PuanAdayi, o: ElOzeti, asama: number, kazanildi: boolean): number {
  if (aday === 'b') return adayB(o, asama, kazanildi);
  if (aday === 'c') return adayC(o, asama);
  return adayA(o, asama);
}

// ---------------------------------------------------------------------------------------------
// Seri ve en iyi puan. Seri de en iyi puan da oyun ve zorluk başına ayrı tutulur (anahtar:
// "spider-1", "klasik-3"…). Telefonun tarayıcısında saklanır; kapanıp açılınca seri sürer.

export interface Seri {
  puan: number; // kazanılan ellerden biriken puan
  asama: number; // sıradaki elin aşaması; 1'den başlar
}

export const YENI_SERI: Seri = { puan: 0, asama: 1 };

export interface PuanKaydi {
  seriler: Record<string, Seri>;
  enIyi: Record<string, number>;
}

export const bosKayit = (): PuanKaydi => ({ seriler: {}, enIyi: {} });

export const puanAnahtari = (oyun: Oyun, zorluk: number) => `${oyun}-${zorluk}`;

export const seriOku = (k: PuanKaydi, anahtar: string): Seri => k.seriler[anahtar] ?? YENI_SERI;
export const enIyiOku = (k: PuanKaydi, anahtar: string): number | null => k.enIyi[anahtar] ?? null;

export interface KazancSonucu {
  kayit: PuanKaydi;
  elPuani: number;
  seriPuani: number; // elin puanı eklendikten sonra
  yeniAsama: number; // bir sonraki elin aşaması
  yeniEnIyi: boolean;
}

// El kazanıldı: elin puanı seriye eklenir, aşama bir artar; seri puanı en iyiyi geçerse en iyi olur.
export function elKazanildi(k: PuanKaydi, anahtar: string, aday: PuanAdayi, o: ElOzeti): KazancSonucu {
  const seri = seriOku(k, anahtar);
  const puan = elPuani(aday, o, seri.asama, true);
  const yeni: Seri = { puan: seri.puan + puan, asama: seri.asama + 1 };
  const eski = enIyiOku(k, anahtar);
  const yeniEnIyi = eski === null || yeni.puan > eski;
  return {
    kayit: {
      seriler: { ...k.seriler, [anahtar]: yeni },
      enIyi: yeniEnIyi ? { ...k.enIyi, [anahtar]: yeni.puan } : k.enIyi,
    },
    elPuani: puan,
    seriPuani: yeni.puan,
    yeniAsama: yeni.asama,
    yeniEnIyi,
  };
}

// Seri biter (el kaybedildi ya da yarımken bırakıldı): puan sıfırdan, aşama 1'den. En iyi kalır.
export function seriBitir(k: PuanKaydi, anahtar: string): PuanKaydi {
  return { ...k, seriler: { ...k.seriler, [anahtar]: YENI_SERI } };
}

// ---------------------------------------------------------------------------------------------
// Saklama. Deneme sırasında her adayın kaydı ayrı durur (bir adayın puanı öbürünü bozmasın);
// Kemal seçince yalnız seçilen aday kalır.

export interface Depo {
  getItem(anahtar: string): string | null;
  setItem(anahtar: string, deger: string): void;
}

const depoAnahtari = (aday: PuanAdayi) => `kartOyunu.puan.${aday}`;

export function kayitOku(depo: Depo, aday: PuanAdayi): PuanKaydi {
  try {
    const ham = depo.getItem(depoAnahtari(aday));
    if (!ham) return bosKayit();
    const v = JSON.parse(ham) as Partial<PuanKaydi>;
    return { seriler: v.seriler ?? {}, enIyi: v.enIyi ?? {} };
  } catch {
    return bosKayit();
  }
}

export function kayitYaz(depo: Depo, aday: PuanAdayi, k: PuanKaydi): void {
  try {
    depo.setItem(depoAnahtari(aday), JSON.stringify(k));
  } catch {
    // Tarayıcı saklamaya izin vermezse oyun yine oynanır; yalnız puan kapanınca kaybolur.
  }
}
