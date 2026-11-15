// Kaldığı yerden devam (yol haritası 4 ve 7; belge 1.3 ve 2): yarım el telefonun tarayıcısında
// saklanır; ana ekrandaki "Oyuna devam et" onu açar. Spider ve klasik solitaire ikisi de.
// Ekrandan ayrı; testleri testler/devam.test.ts. Bu dosya yalnız tür alır.
//
// Saklananlar: oyun ve zorluk, masanın son hâli, geçen süre ve bu elde kalan geri al hakkı.
// Geri al geçmişi saklanmaz (öneri, standart çözüm): Spider'da her hamle bütün masanın bir
// kopyası olduğu için geçmiş uzun elde tarayıcının saklama yerini doldurabilir. El açılınca
// "Geri al" ilk yeni hamleye kadar soluk durur; kalan hak sayısı korunur.
//
// Tek yarım el olur: yeni bir ele ilk hamle yapılınca eskisinin yerine o yazılır. El kazanılınca
// ya da bırakılınca (eli bırakma sorusunda "Evet") silinir.

import type { SpiderMasasi } from '../kart/spider';
import type { KlondikeMasasi, CekmeSayisi } from '../kart/klondike';
import type { Kart, RenkSayisi } from '../kart/kart';
import type { GeriAlHakki } from '../kart/geriAlHakki';

export interface Depo {
  getItem(anahtar: string): string | null;
  setItem(anahtar: string, deger: string): void;
  removeItem(anahtar: string): void;
}

export const YARIM_EL_ANAHTARI = 'kartOyunu.yarimEl';
const SURUM = 1; // saklama biçimi değişirse eski kayıt okunmaz

interface Ortak {
  saniye: number; // elin o ana kadar süren süresi
  hak: GeriAlHakki; // bu elin geri al hakkı (el başı ve kalan)
}
export type YarimEl =
  | (Ortak & { oyun: 'spider'; zorluk: RenkSayisi; masa: SpiderMasasi })
  | (Ortak & { oyun: 'klasik'; zorluk: CekmeSayisi; masa: KlondikeMasasi });

// El yarım mı: en az bir hamle yapılmış ve kazanılmamış (eli bırakma sorusuyla aynı kural)
export const yarimMi = (hamle: number, kazandi: boolean) => hamle > 0 && !kazandi;

// Anahtar: normal yarım el için YARIM_EL_ANAHTARI; günlük mücadelenin yarım eli ayrı anahtarda
// durur (8. paket, src/oyun/gunluk.ts), ikisi karışmaz.
export function yarimElYaz(depo: Depo, el: YarimEl, anahtar = YARIM_EL_ANAHTARI): void {
  try {
    depo.setItem(anahtar, JSON.stringify({ surum: SURUM, ...el }));
  } catch {
    // Tarayıcı saklamaya izin vermezse oyun yine oynanır; yalnız sayfa kapanınca el kaybolur.
  }
}

export function yarimElSil(depo: Depo, anahtar = YARIM_EL_ANAHTARI): void {
  try {
    depo.removeItem(anahtar);
  } catch {
    // saklama kapalıysa silinecek bir şey de yok
  }
}

// ---------------------------------------------------------------------------------------------
// Okuma: bozuk ya da eksik kayıt yok sayılır (oyun hiçbir zaman bozuk bir masa açmaz).

const sayiMi = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const TAKIMLAR = ['maca', 'kupa', 'karo', 'sinek'];

function kartMi(v: unknown): v is Kart {
  const k = v as Kart;
  return (
    !!k &&
    typeof k.id === 'string' &&
    TAKIMLAR.includes(k.takim) &&
    Number.isInteger(k.deger) &&
    k.deger >= 1 &&
    k.deger <= 13 &&
    typeof k.acik === 'boolean'
  );
}
const kartlarMi = (v: unknown): v is Kart[] => Array.isArray(v) && v.every(kartMi);
const sutunlarMi = (v: unknown, sayi: number): v is Kart[][] =>
  Array.isArray(v) && v.length === sayi && v.every(kartlarMi);

function spiderMasasiMi(v: unknown): v is SpiderMasasi {
  const m = v as SpiderMasasi;
  if (!m || !sutunlarMi(m.sutunlar, 10) || !kartlarMi(m.deste) || !sayiMi(m.hamle)) return false;
  if (!Array.isArray(m.tamamlanan) || !m.tamamlanan.every((t) => TAKIMLAR.includes(t))) return false;
  // 104 kart: masada, destede ve tamamlanan dizilerde (her dizi 13 kart)
  const toplam = m.sutunlar.reduce((t, s) => t + s.length, 0) + m.deste.length + m.tamamlanan.length * 13;
  return toplam === 104;
}

function klondikeMasasiMi(v: unknown): v is KlondikeMasasi {
  const m = v as KlondikeMasasi;
  if (!m || !sutunlarMi(m.sutunlar, 7) || !sutunlarMi(m.temeller, 4)) return false;
  if (!kartlarMi(m.deste) || !kartlarMi(m.acilan) || !sayiMi(m.hamle)) return false;
  if (m.cekme !== 1 && m.cekme !== 3) return false;
  const toplam =
    m.sutunlar.reduce((t, s) => t + s.length, 0) +
    m.temeller.reduce((t, s) => t + s.length, 0) +
    m.deste.length +
    m.acilan.length;
  return toplam === 52;
}

const hakMi = (v: unknown): v is GeriAlHakki => {
  const h = v as GeriAlHakki;
  return !!h && sayiMi(h.elBasi) && sayiMi(h.kalan);
};

export function yarimElOku(depo: Pick<Depo, 'getItem'>, anahtar = YARIM_EL_ANAHTARI): YarimEl | null {
  try {
    const ham = depo.getItem(anahtar);
    if (!ham) return null;
    const v = JSON.parse(ham);
    if (!v || v.surum !== SURUM || !sayiMi(v.saniye) || !hakMi(v.hak)) return null;
    const ortak = { saniye: Math.floor(v.saniye), hak: { elBasi: v.hak.elBasi, kalan: v.hak.kalan } };
    if (v.oyun === 'spider' && [1, 2, 4].includes(v.zorluk) && spiderMasasiMi(v.masa)) {
      if (!yarimMi(v.masa.hamle, v.masa.tamamlanan.length === 8)) return null;
      return { oyun: 'spider', zorluk: v.zorluk, masa: v.masa, ...ortak };
    }
    if (v.oyun === 'klasik' && v.zorluk === v.masa?.cekme && klondikeMasasiMi(v.masa)) {
      const temelde = v.masa.temeller.reduce((t: number, s: Kart[]) => t + s.length, 0);
      if (!yarimMi(v.masa.hamle, temelde === 52)) return null;
      return { oyun: 'klasik', zorluk: v.zorluk, masa: v.masa, ...ortak };
    }
    return null;
  } catch {
    return null;
  }
}
