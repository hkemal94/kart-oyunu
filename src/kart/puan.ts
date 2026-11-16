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
// Formül Kemal'in (16 Kasım): a · çarpanlı taban (aşama çarpanlı). b ve c adayları kalktı.
// Formül onaylı; aşağıdaki SAYILAR DENEME VARSAYILANI, Kemal sayıları onaylamadı.
// Sayılar src/oyun/ayarlar.json → puan bölümünden gelir (KKM → Oyunlar → Ayarlar); buradaki
// sayılar yalnız dosyada değer yoksa kullanılan yedektir.

import type { SpiderMasasi } from './spider';
import type { KlondikeMasasi } from './klondike';
import { ayarSayisi } from '../oyun/ayarOku.ts';

// ---------------------------------------------------------------------------------------------
// Bir elin puana giren özeti. Masadan çıkarılır (spiderOzeti, klondikeOzeti); geri alınınca masa
// eski hâline döndüğü için özet de geri döner.

export type Oyun = 'spider' | 'klasik';

export interface ElOzeti {
  hamle: number;
  saniye: number;
}

export function spiderOzeti(masa: SpiderMasasi, saniye: number): ElOzeti {
  return { hamle: masa.hamle, saniye };
}

export function klondikeOzeti(masa: KlondikeMasasi, saniye: number): ElOzeti {
  return { hamle: masa.hamle, saniye };
}

// ---------------------------------------------------------------------------------------------
// Formül a · Çarpanlı taban (Kemal onaylı formül, 16 Kasım): her el sabit bir tabanla başlar; her
// hamle ve geçen süre tabandan düşer (bir alt sınırın altına inmez); sonuç aşama sayısıyla çarpılır
// (Aşama 2'de iki katı). Masada gösterilen puan "şimdi bitse" değeridir; el kazanılınca aynı
// hesap kesin puan olur. Sayılar DENEME VARSAYILANI, Kemal onaylamadı.

const sayi = (anahtar: string, yedek: number) => ayarSayisi('puan', anahtar, yedek);

export const PUAN_SAYILARI = {
  taban: sayi('taban', 2000), // DENEME VARSAYILANI
  hamleBasi: sayi('hamleBasi', 2), // her hamle tabandan düşer. DENEME VARSAYILANI
  saniyeBasi: sayi('saniyeBasi', 0.5), // her saniye tabandan düşer (dakikada 30). DENEME VARSAYILANI
  enAz: sayi('enAz', 200), // kazanılan el en az bu kadar getirir. DENEME VARSAYILANI
};

export function elPuani(o: ElOzeti, asama: number): number {
  const p = PUAN_SAYILARI;
  const ham = p.taban - p.hamleBasi * o.hamle - Math.floor(p.saniyeBasi * o.saniye);
  return Math.max(p.enAz, ham) * asama;
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
export function elKazanildi(k: PuanKaydi, anahtar: string, o: ElOzeti): KazancSonucu {
  const seri = seriOku(k, anahtar);
  const puan = elPuani(o, seri.asama);
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
// Saklama. Puan telefonun tarayıcısında saklanır. Deneme günlerinde her aday ayrı anahtarda
// duruyordu (kartOyunu.puan.a, .b, .c); formül a seçildi, a'nın anahtarı aynen sürer (oyuncunun
// puanı kaybolmaz). Eski b ve c kayıtları okunmaz, zararsızca durur.

export interface Depo {
  getItem(anahtar: string): string | null;
  setItem(anahtar: string, deger: string): void;
}

export const DEPO_ANAHTARI = 'kartOyunu.puan.a';

export function kayitOku(depo: Depo): PuanKaydi {
  try {
    const ham = depo.getItem(DEPO_ANAHTARI);
    if (!ham) return bosKayit();
    const v = JSON.parse(ham) as Partial<PuanKaydi>;
    return { seriler: v.seriler ?? {}, enIyi: v.enIyi ?? {} };
  } catch {
    return bosKayit();
  }
}

export function kayitYaz(depo: Depo, k: PuanKaydi): void {
  try {
    depo.setItem(DEPO_ANAHTARI, JSON.stringify(k));
  } catch {
    // Tarayıcı saklamaya izin vermezse oyun yine oynanır; yalnız puan kapanınca kaybolur.
  }
}
