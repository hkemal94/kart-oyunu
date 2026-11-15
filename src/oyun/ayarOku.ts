// Oyunun ayarlanabilir sayıları src/oyun/ayarlar.json'dan okunur (KKM → Oyunlar → Ayarlar sekmesi
// aynı dosyayı gösterir; Kemal oradan değiştirip "Oyuna gönder" deyince depoda PR açılır).
// Dosyada değer yoksa ya da sayı değilse koddaki yedek kullanılır. Bu dosya Node testlerinde de
// çalışır (JSON içe alma biçimi bu yüzden "with { type: 'json' }").

import ayarlar from './ayarlar.json' with { type: 'json' };

interface Ayar {
  deger: unknown;
}
type Bolumler = Record<string, { ayarlar: Record<string, Ayar> }>;

const bolumler = (ayarlar as { bolumler: Bolumler }).bolumler;

export function ayarSayisi(bolum: string, anahtar: string, yedek: number): number {
  const d = bolumler[bolum]?.ayarlar[anahtar]?.deger;
  return typeof d === 'number' && Number.isFinite(d) ? d : yedek;
}
