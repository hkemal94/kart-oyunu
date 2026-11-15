// Basit istatistik (yol haritası 4 ve 7; belge 1.3): oynanan, kazanılan, en iyi süre; oyun ve
// zorluk başına ayrı ("spider-1", "klasik-3"… puandaki anahtarla aynı). Telefonun tarayıcısında
// saklanır; Ben sekmesindeki "İstatistik" okur. Ekrandan ayrı; testleri testler/istatistik.test.ts.
// Bu dosya hiçbir şey içe almaz.
//
// Ne zaman sayılır (öneri, Kemal'in onayı yok): bir el ilk hamlesi yapılınca "oynanan" olur
// (açılıp hiç dokunulmadan bırakılan el sayılmaz; eli bırakma sorusundaki kuralla aynı).
// Kazanılınca "kazanılan" bir artar, süre en iyiden kısaysa en iyi süre olur. Kaldığı yerden
// açılan el yeniden sayılmaz.

export interface Depo {
  getItem(anahtar: string): string | null;
  setItem(anahtar: string, deger: string): void;
}

export interface OyunIstatistigi {
  oynanan: number;
  kazanilan: number;
  enIyiSure: number | null; // saniye; henüz kazanılmadıysa yok
}

export type Istatistik = Record<string, OyunIstatistigi>;

export const ISTATISTIK_ANAHTARI = 'kartOyunu.istatistik';
export const BOS_ISTATISTIK: OyunIstatistigi = { oynanan: 0, kazanilan: 0, enIyiSure: null };

export const istatistikOku = (i: Istatistik, anahtar: string): OyunIstatistigi => i[anahtar] ?? BOS_ISTATISTIK;

// Bir el oynanmaya başlandı (ilk hamle)
export function elBasladi(i: Istatistik, anahtar: string): Istatistik {
  const o = istatistikOku(i, anahtar);
  return { ...i, [anahtar]: { ...o, oynanan: o.oynanan + 1 } };
}

// Bir el kazanıldı; süre saniye
export function elKazanildi(i: Istatistik, anahtar: string, saniye: number): Istatistik {
  const o = istatistikOku(i, anahtar);
  const enIyiSure = o.enIyiSure === null ? saniye : Math.min(o.enIyiSure, saniye);
  // Kazanılan, oynanandan fazla olamaz (ör. sayım başlamadan önce yarım kalmış bir el)
  const oynanan = Math.max(o.oynanan, o.kazanilan + 1);
  return { ...i, [anahtar]: { oynanan, kazanilan: o.kazanilan + 1, enIyiSure } };
}

const sayiMi = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;

export function istatistikYukle(depo: Pick<Depo, 'getItem'>): Istatistik {
  try {
    const ham = depo.getItem(ISTATISTIK_ANAHTARI);
    if (!ham) return {};
    const v = JSON.parse(ham) as Record<string, Partial<OyunIstatistigi>>;
    const sonuc: Istatistik = {};
    for (const [anahtar, o] of Object.entries(v ?? {})) {
      if (!o || !sayiMi(o.oynanan) || !sayiMi(o.kazanilan)) continue;
      sonuc[anahtar] = {
        oynanan: Math.floor(o.oynanan),
        kazanilan: Math.floor(o.kazanilan),
        enIyiSure: sayiMi(o.enIyiSure) ? Math.floor(o.enIyiSure) : null,
      };
    }
    return sonuc;
  } catch {
    return {};
  }
}

export function istatistikKaydet(depo: Depo, i: Istatistik): void {
  try {
    depo.setItem(ISTATISTIK_ANAHTARI, JSON.stringify(i));
  } catch {
    // Tarayıcı saklamaya izin vermezse sayım yalnız bu açılışta durur.
  }
}

// Okuyup değiştirip yazar (iki sekme açıksa birinin sayımı öbürünü ezmesin diye her seferinde okur)
export function istatistikGuncelle(depo: Depo, degistir: (i: Istatistik) => Istatistik): Istatistik {
  const yeni = degistir(istatistikYukle(depo));
  istatistikKaydet(depo, yeni);
  return yeni;
}
