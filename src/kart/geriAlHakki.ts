// Geri al hakkı (belge 1.3; Kemal, 15 Kasım soru turu): geri al sınırlı. Her elde birkaç ücretsiz
// hak var; bitince telefon uygulamasında reklam izleyerek bir hak daha alınır. Web denemesinde
// reklam yok: "reklam yerine" kutusu çıkar, düğmeye dokununca bir hak gelir (src/reklam/geriAlHakki.ts).
// Kurallar ekrandan ayrı; testleri testler/yardimcilar.test.ts.

import { ayarSayisi } from '../oyun/ayarOku.ts';

// Bir eldeki ücretsiz hak sayısı src/oyun/ayarlar.json'dan gelir (yardimcilar → geriAlHak; KKM'den
// değişir). DENEME VARSAYILANI, KEMAL SEÇECEK: bu sayı karar değildir; kod çalışsın diye konuldu.
// Web denemesinde adres sonuna ?geriAlHak=5 gibi yazılarak o açılış için değiştirilir.
const ham = Math.floor(ayarSayisi('yardimcilar', 'geriAlHak', 3));
export const GERI_AL_HAK_DENEME_VARSAYILANI = ham >= 0 ? ham : 3;
const ADRES_ANAHTARI = 'geriAlHak';

// Adresteki ?geriAlHak= değerini okur (0 ya da daha büyük tam sayı); yoksa ya da bozuksa
// deneme varsayılanı.
export function geriAlHakSayisi(adresSorgusu: string): number {
  const ham = new URLSearchParams(adresSorgusu).get(ADRES_ANAHTARI);
  if (ham === null || !/^\d+$/.test(ham.trim())) return GERI_AL_HAK_DENEME_VARSAYILANI;
  return Number(ham.trim());
}

// Bir elin hakları: el başındaki sayı ve kalan.
export interface GeriAlHakki {
  elBasi: number;
  kalan: number;
}

export function hakBaslat(adresSorgusu: string): GeriAlHakki {
  const sayi = geriAlHakSayisi(adresSorgusu);
  return { elBasi: sayi, kalan: sayi };
}

// Bir hak kullanır; hak kalmadıysa null (ekran "reklam yerine" kutusunu açar).
export function hakKullan(h: GeriAlHakki): GeriAlHakki | null {
  return h.kalan > 0 ? { ...h, kalan: h.kalan - 1 } : null;
}

// Reklam izlenince (web'de "reklam yerine" düğmesi) bir hak eklenir.
export function reklamHakkiEkle(h: GeriAlHakki): GeriAlHakki {
  return { ...h, kalan: h.kalan + 1 };
}

// Yeni elde haklar baştan başlar (reklamla gelenler de sıfırlanır).
export function yeniElHakki(h: GeriAlHakki): GeriAlHakki {
  return { ...h, kalan: h.elBasi };
}
