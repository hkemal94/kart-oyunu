import tr from './tr.json' with { type: 'json' };
import enHam from './en.json' with { type: 'json' };
import type { Dil } from '../oyun/oyuncuAyarlari.ts';

// Ekrandaki bütün yazılar buradan gelir; koda yazı gömülmez.
// İki dil: Türkçe ve İngilizce. Yeni yazı iki dosyaya birden eklenir;
// İngilizcede eksik anahtar olursa derleme hata verir.
export type MetinAnahtari = keyof typeof tr;
const en: Record<MetinAnahtari, string> = enHam;

export type { Dil };
const SOZLUKLER: Record<Dil, Record<MetinAnahtari, string>> = { tr, en };

// Seçili dil (5. paket): açılışta Uygulama ayarlardan belirler; ayarlardan değişince dilSec
// çağrılır ve ekran yeniden çizilir.
let dil: Dil = 'tr';

export function dilSec(yeni: Dil): void {
  dil = yeni;
  if (typeof document !== 'undefined') document.documentElement.lang = yeni;
}

export const seciliDil = (): Dil => dil;

// Metni seçili dilde verir; {0}, {1} yerine verilen değerler gelir.
export function m(anahtar: MetinAnahtari, ...degerler: (string | number)[]): string {
  let s = SOZLUKLER[dil][anahtar];
  degerler.forEach((d, i) => {
    s = s.replace(`{${i}}`, String(d));
  });
  return s;
}

// Sayıyı seçili dilin biçimiyle yazar (Türkçede 1.240, İngilizcede 1,240).
export function sayi(n: number): string {
  return n.toLocaleString(dil === 'tr' ? 'tr-TR' : 'en-US');
}
