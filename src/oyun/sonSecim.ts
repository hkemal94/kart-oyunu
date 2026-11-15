// Son seçilen oyun ve zorluk (7. paket): ana ekrandaki en iyi puan "seçili oyunun" puanıdır
// (Kemal, 15 Kasım); oyun seçimi de açılınca son zorluk seçili gelir. Telefonun tarayıcısında
// saklanır. Bu dosya yalnız tür alır.

import type { RenkSayisi } from '../kart/kart';
import type { CekmeSayisi } from '../kart/klondike';

export interface SonSecim {
  oyun: 'spider' | 'klasik';
  renk: RenkSayisi;
  cekme: CekmeSayisi;
}

export const SON_SECIM_ANAHTARI = 'kartOyunu.secim';
// İlk açılışta: Spider (önce gelir; belge 0), 1 renk, 1 kart çekme
export const ILK_SECIM: SonSecim = { oyun: 'spider', renk: 1, cekme: 1 };

// Günlük mücadelenin son seçimi ayrı anahtarda durur (8. paket); ana ekrandaki en iyi puanı değiştirmez.
export const GUNLUK_SECIM_ANAHTARI = 'kartOyunu.gunlukSecim';

export function sonSecimOku(depo: { getItem(a: string): string | null }, anahtar = SON_SECIM_ANAHTARI): SonSecim {
  try {
    const v = JSON.parse(depo.getItem(anahtar) ?? 'null') as Partial<SonSecim> | null;
    if (!v) return { ...ILK_SECIM };
    return {
      oyun: v.oyun === 'klasik' ? 'klasik' : 'spider',
      renk: v.renk === 2 || v.renk === 4 ? v.renk : 1,
      cekme: v.cekme === 3 ? 3 : 1,
    };
  } catch {
    return { ...ILK_SECIM };
  }
}

export function sonSecimYaz(depo: { setItem(a: string, d: string): void }, s: SonSecim, anahtar = SON_SECIM_ANAHTARI): void {
  try {
    depo.setItem(anahtar, JSON.stringify(s));
  } catch {
    // saklama kapalıysa seçim yalnız bu açılışta durur
  }
}
