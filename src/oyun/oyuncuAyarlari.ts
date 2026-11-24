// Oyuncunun ayarları (yol haritası 5; belge 2, "Ayarlar"): ses, mahalle sesi, titreşim, sol el
// düzeni, sayaçları gizle, her hamlede puanı göster, oynanamayan kartları koyulaştır, dil, deste. Telefonun tarayıcısında saklanır.
// Ekrandan ayrı; testleri testler/ayarlar.test.ts. Bu dosya hiçbir şey içe almaz.

export type Dil = 'tr' | 'en';
export const DILLER: Dil[] = ['tr', 'en'];
// Desteler (belge 4): Sürek Kulübü destesi ücretsiz ve varsayılan (Kemal, 14 Kasım), sade deste
// ücretsiz. Sürek destesinin şimdilik yalnız arka yüzü var (24 Kasım); ön yüzü sade deste gibi.
export type Deste = 'surek' | 'sade';
export const DESTELER: Deste[] = ['surek', 'sade'];
// Sürek destesi gelmeden önce saklanan "sade" bir seçim değildi (tek seçenekti). Bu sürüm
// işaretiyle saklanmamış kayıtta deste varsayılana (Sürek) döner.
const DESTE_SURUMU = 2;

export interface OyuncuAyarlari {
  ses: boolean; // kart sesleri (ses paketi gelince çalışır, 12. paket)
  mahalleSesi: boolean; // masanın ortam sesi (ses paketi gelince çalışır)
  titresim: boolean; // (ses paketiyle gelir)
  solEl: boolean; // alt şeritteki düğmeler ve deste yer değiştirir
  sayaclariGizle: boolean; // süre ve hamle görünmez
  puaniGoster: boolean; // masanın bilgi satırında puan ve aşama
  koyulastir: boolean; // o an oynanamayan açık kartlar bir iki ton koyu (Kemal, 15 Kasım)
  dil: Dil | null; // null: henüz seçilmedi, telefonun diline göre açılır
  deste: Deste; // kart arka yüzü bu desteden (ön yüzler şimdilik iki destede de sade)
}

// Varsayılanlar (öneri): sesler açık, sağ el, sayaçlar ve puan görünür. Oynanamayan kartları
// koyulaştırma açık (Kemal, 15 Kasım).
export const VARSAYILAN_AYARLAR: OyuncuAyarlari = {
  ses: true,
  mahalleSesi: true,
  titresim: true,
  solEl: false,
  sayaclariGizle: false,
  puaniGoster: true,
  koyulastir: true,
  dil: null,
  deste: 'surek',
};

export interface Depo {
  getItem(anahtar: string): string | null;
  setItem(anahtar: string, deger: string): void;
}

export const AYAR_ANAHTARI = 'kartOyunu.ayarlar';

// Saklanan ayarları okur; bozuk ya da eksik alan varsayılana döner.
export function ayarlariOku(depo: Depo): OyuncuAyarlari {
  try {
    const ham = depo.getItem(AYAR_ANAHTARI);
    if (!ham) return { ...VARSAYILAN_AYARLAR };
    const v = JSON.parse(ham) as Partial<Record<keyof OyuncuAyarlari | 'desteSurumu', unknown>>;
    const evetHayir = (k: 'ses' | 'mahalleSesi' | 'titresim' | 'solEl' | 'sayaclariGizle' | 'puaniGoster' | 'koyulastir') =>
      typeof v[k] === 'boolean' ? (v[k] as boolean) : VARSAYILAN_AYARLAR[k];
    return {
      ses: evetHayir('ses'),
      mahalleSesi: evetHayir('mahalleSesi'),
      titresim: evetHayir('titresim'),
      solEl: evetHayir('solEl'),
      sayaclariGizle: evetHayir('sayaclariGizle'),
      puaniGoster: evetHayir('puaniGoster'),
      koyulastir: evetHayir('koyulastir'),
      dil: DILLER.includes(v.dil as Dil) ? (v.dil as Dil) : null,
      deste:
        v.desteSurumu === DESTE_SURUMU && DESTELER.includes(v.deste as Deste) ? (v.deste as Deste) : VARSAYILAN_AYARLAR.deste,
    };
  } catch {
    return { ...VARSAYILAN_AYARLAR };
  }
}

export function ayarlariYaz(depo: Depo, a: OyuncuAyarlari): void {
  try {
    depo.setItem(AYAR_ANAHTARI, JSON.stringify({ ...a, desteSurumu: DESTE_SURUMU }));
  } catch {
    // Tarayıcı saklamaya izin vermezse ayar yalnız bu açılışta geçerli olur.
  }
}

// Açılıştaki dil: adreste ?dil= varsa o (deneme için), yoksa seçilmiş dil, yoksa telefonun dili
// (Türkçe ise Türkçe, değilse İngilizce; belge 0).
export function ilkDil(adresSorgusu: string, secili: Dil | null, telefonDili: string): Dil {
  const adres = new URLSearchParams(adresSorgusu).get('dil');
  if (adres === 'tr' || adres === 'en') return adres;
  if (secili) return secili;
  return (telefonDili || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en';
}
