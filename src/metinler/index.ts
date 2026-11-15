import tr from './tr.json';
import enHam from './en.json';

// Ekrandaki bütün yazılar buradan gelir; koda yazı gömülmez.
// İki dil: Türkçe ve İngilizce. Yeni yazı iki dosyaya birden eklenir;
// İngilizcede eksik anahtar olursa derleme hata verir.
export type MetinAnahtari = keyof typeof tr;
const en: Record<MetinAnahtari, string> = enHam;

export type Dil = 'tr' | 'en';
const SOZLUKLER: Record<Dil, Record<MetinAnahtari, string>> = { tr, en };

// Dil seçimi ekranı 5. pakette. Şimdilik telefonun dili Türkçeyse Türkçe,
// değilse İngilizce açılır; adres sonuna ?dil=en yazılırsa İngilizce.
function ilkDil(): Dil {
  const adres = new URLSearchParams(location.search).get('dil');
  if (adres === 'tr' || adres === 'en') return adres;
  return (navigator.language || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en';
}
const dil: Dil = ilkDil();
document.documentElement.lang = dil;

// Metni seçili dilde verir; {0}, {1} yerine verilen değerler gelir.
export function m(anahtar: MetinAnahtari, ...degerler: (string | number)[]): string {
  let s = SOZLUKLER[dil][anahtar];
  degerler.forEach((d, i) => {
    s = s.replace(`{${i}}`, String(d));
  });
  return s;
}
