// Puan ve en iyi puanın testleri (yol haritası, 6. paket; belge 8.3). Çalıştırma: npm test
// Formül a · çarpanlı taban Kemal'in (16 Kasım); sayılar deneme varsayılanı (Kemal onaylamadı),
// sayılar değişince bu testler de değişir.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bosKayit,
  DEPO_ANAHTARI,
  elKazanildi,
  elPuani,
  enIyiOku,
  kayitOku,
  kayitYaz,
  klondikeOzeti,
  puanAnahtari,
  seriBitir,
  seriOku,
  spiderOzeti,
  type Depo,
  type ElOzeti,
} from '../src/kart/puan.ts';
import { klondikeDagit } from '../src/kart/klondike.ts';
import { spiderDagit } from '../src/kart/spider.ts';

// Belgedeki örnek eller (8.3)
const spiderEli: ElOzeti = { hamle: 200, saniye: 900 };
const klasikEli: ElOzeti = { hamle: 120, saniye: 300 };

const bellekDepo = () => {
  const bellek = new Map<string, string>();
  const depo: Depo = { getItem: (k) => bellek.get(k) ?? null, setItem: (k, v) => void bellek.set(k, v) };
  return { bellek, depo };
};

test('formül a: tabandan hamle ve süre düşer, aşamayla çarpılır, alt sınır var', () => {
  assert.equal(elPuani(spiderEli, 1), 2000 - 400 - 450);
  assert.equal(elPuani(spiderEli, 2), (2000 - 400 - 450) * 2);
  assert.equal(elPuani(klasikEli, 1), 2000 - 240 - 150);
  // Çok uzun el alt sınırda kalır
  assert.equal(elPuani({ hamle: 900, saniye: 3600 }, 3), 200 * 3);
});

test('geri al hamle sayılır: hamle artınca puan düşer', () => {
  assert.ok(elPuani({ ...klasikEli, hamle: klasikEli.hamle + 1 }, 1) < elPuani(klasikEli, 1));
});

test('özet masadan çıkar: yeni dağıtımda hamle yok', () => {
  assert.deepEqual(spiderOzeti(spiderDagit(2), 5), { hamle: 0, saniye: 5 });
  assert.deepEqual(klondikeOzeti(klondikeDagit(1), 0), { hamle: 0, saniye: 0 });
});

test('seri birikir ve aşama artar', () => {
  const a = puanAnahtari('spider', 1);
  let kayit = bosKayit();
  assert.deepEqual(seriOku(kayit, a), { puan: 0, asama: 1 });
  const bir = elKazanildi(kayit, a, spiderEli);
  assert.equal(bir.elPuani, 1150);
  assert.equal(bir.seriPuani, 1150);
  assert.equal(bir.yeniAsama, 2);
  kayit = bir.kayit;
  const iki = elKazanildi(kayit, a, spiderEli);
  assert.equal(iki.elPuani, 2300); // Aşama 2: iki kat
  assert.equal(iki.seriPuani, 3450);
  assert.equal(iki.yeniAsama, 3);
  assert.deepEqual(seriOku(iki.kayit, a), { puan: 3450, asama: 3 });
});

test('eli bırakınca seri sıfırlanır, en iyi kalır', () => {
  const a = puanAnahtari('klasik', 3);
  const k1 = elKazanildi(bosKayit(), a, klasikEli).kayit;
  const k2 = elKazanildi(k1, a, klasikEli).kayit;
  const enIyi = enIyiOku(k2, a);
  const bitti = seriBitir(k2, a);
  assert.deepEqual(seriOku(bitti, a), { puan: 0, asama: 1 });
  assert.equal(enIyiOku(bitti, a), enIyi);
  // Yeni seri en iyiyi geçmedikçe en iyi değişmez
  const yeni = elKazanildi(bitti, a, klasikEli);
  assert.equal(yeni.yeniEnIyi, false);
  assert.equal(enIyiOku(yeni.kayit, a), enIyi);
});

test('en iyi puan oyun ve zorluk başına ayrı', () => {
  const s1 = puanAnahtari('spider', 1);
  const s4 = puanAnahtari('spider', 4);
  const k1 = puanAnahtari('klasik', 1);
  const ilk = elKazanildi(bosKayit(), s1, spiderEli);
  assert.equal(ilk.yeniEnIyi, true);
  assert.equal(enIyiOku(ilk.kayit, s1), 1150);
  assert.equal(enIyiOku(ilk.kayit, s4), null);
  assert.equal(enIyiOku(ilk.kayit, k1), null);
  // Bir zorlukta seriyi bitirmek öbürüne dokunmaz
  const ikinci = elKazanildi(ilk.kayit, k1, klasikEli).kayit;
  const bitti = seriBitir(ikinci, s1);
  assert.deepEqual(seriOku(bitti, k1), { puan: 1610, asama: 2 });
  assert.equal(enIyiOku(bitti, k1), 1610);
});

test('kayıt saklanır ve geri okunur; bozuk kayıt boş sayılır', () => {
  const { bellek, depo } = bellekDepo();
  const k = elKazanildi(bosKayit(), puanAnahtari('spider', 2), spiderEli).kayit;
  kayitYaz(depo, k);
  assert.deepEqual(kayitOku(depo), k);
  bellek.set(DEPO_ANAHTARI, '{bozuk');
  assert.deepEqual(kayitOku(depo), bosKayit());
});

test('deneme günlerinden kalan a kaydı korunur; b ve c kayıtları yok sayılır (Kemal, 16 Kasım)', () => {
  const { bellek, depo } = bellekDepo();
  const anahtar = puanAnahtari('spider', 1);
  const aKaydi = elKazanildi(bosKayit(), anahtar, spiderEli).kayit;
  // Eski sürüm a'yı bu anahtarda saklıyordu; b ve c ayrı anahtarlarda
  bellek.set('kartOyunu.puan.a', JSON.stringify(aKaydi));
  bellek.set('kartOyunu.puan.b', JSON.stringify({ seriler: { [anahtar]: { puan: 99999, asama: 9 } }, enIyi: { [anahtar]: 99999 } }));
  bellek.set('kartOyunu.puan.c', '{bozuk');
  assert.equal(DEPO_ANAHTARI, 'kartOyunu.puan.a');
  assert.deepEqual(kayitOku(depo), aKaydi);
  assert.equal(enIyiOku(kayitOku(depo), anahtar), 1150);
  // Yeni yazım b ve c kayıtlarına dokunmaz
  kayitYaz(depo, seriBitir(kayitOku(depo), anahtar));
  assert.equal(enIyiOku(kayitOku(depo), anahtar), 1150);
  assert.ok(bellek.get('kartOyunu.puan.b')?.includes('99999'));
});
