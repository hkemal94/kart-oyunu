// Puan ve en iyi puanın testleri (yol haritası, 6. paket; belge 8.3). Çalıştırma: npm test
// Sayılar adayların deneme sayılarıdır (ADAY, KEMAL SEÇECEK); karar değişince bu testler de değişir.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bosKayit,
  elKazanildi,
  elPuani,
  enIyiOku,
  kayitOku,
  kayitYaz,
  klondikeOzeti,
  PUAN_ADAYI_VARSAYILANI,
  puanAdayi,
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
const spiderEli: ElOzeti = { oyun: 'spider', hamle: 200, saniye: 900, ilerleme: 8, acilanKapali: 44 };
const klasikEli: ElOzeti = { oyun: 'klasik', hamle: 120, saniye: 300, ilerleme: 52, acilanKapali: 21 };

test('aday adresten seçilir, varsayılan a', () => {
  assert.equal(PUAN_ADAYI_VARSAYILANI, 'a');
  assert.equal(puanAdayi(''), 'a');
  assert.equal(puanAdayi('?puan=b'), 'b');
  assert.equal(puanAdayi('?puan=C'), 'c');
  assert.equal(puanAdayi('?puan=x'), 'a');
  assert.equal(puanAdayi('?geriAlHak=2&puan=c'), 'c');
});

test('aday a: tabandan hamle ve süre düşer, aşamayla çarpılır, alt sınır var', () => {
  assert.equal(elPuani('a', spiderEli, 1, true), 2000 - 400 - 450);
  assert.equal(elPuani('a', spiderEli, 2, true), (2000 - 400 - 450) * 2);
  assert.equal(elPuani('a', klasikEli, 1, true), 2000 - 240 - 150);
  // Çok uzun el alt sınırda kalır
  assert.equal(elPuani('a', { ...spiderEli, hamle: 900, saniye: 3600 }, 3, true), 200 * 3);
});

test('aday b: oynarken toplanır, kazanınca süre bonusu, aşama başına yarım kat', () => {
  // Oyun ortası: süre bonusu yok
  const orta: ElOzeti = { oyun: 'spider', hamle: 40, saniye: 200, ilerleme: 1, acilanKapali: 10 };
  assert.equal(elPuani('b', orta, 1, false), 100 + 50 - 40);
  // Kazanınca: 800 + 220 - 200 + (1200 - 900)
  assert.equal(elPuani('b', spiderEli, 1, true), 1120);
  assert.equal(elPuani('b', spiderEli, 2, true), 1680);
  assert.equal(elPuani('b', spiderEli, 3, true), 2240);
  // Klasik: 52 x 15 + 21 x 5 - 120 + (1200 - 300)
  assert.equal(elPuani('b', klasikEli, 1, true), 780 + 105 - 120 + 900);
  // Eksiye inmez
  assert.equal(elPuani('b', { ...orta, ilerleme: 0, acilanKapali: 0 }, 1, false), 0);
});

test('aday c: sabit puan, süre ve hamle bonusu, aşama başına sabit ek', () => {
  assert.equal(elPuani('c', spiderEli, 1, true), 1000 + 300 + 200);
  assert.equal(elPuani('c', spiderEli, 2, true), 1000 + 300 + 200 + 250);
  assert.equal(elPuani('c', klasikEli, 1, true), 1000 + 900 + 360);
  // Tavanı aşan elde bonus yok
  assert.equal(elPuani('c', { ...spiderEli, hamle: 500, saniye: 2000 }, 1, true), 1000);
});

test('geri al hamle sayılır: hamle artınca a, b ve c puanı düşer', () => {
  const sonra = { ...klasikEli, hamle: klasikEli.hamle + 1 };
  for (const aday of ['a', 'b', 'c'] as const) {
    assert.ok(elPuani(aday, sonra, 1, true) < elPuani(aday, klasikEli, 1, true), aday);
  }
});

test('özet masadan çıkar: yeni dağıtımda ilerleme ve açılan kart yok', () => {
  const s = spiderOzeti(spiderDagit(2), 5);
  assert.deepEqual([s.hamle, s.ilerleme, s.acilanKapali, s.saniye], [0, 0, 0, 5]);
  const k = klondikeOzeti(klondikeDagit(1), 0);
  assert.deepEqual([k.hamle, k.ilerleme, k.acilanKapali], [0, 0, 0]);
});

test('seri birikir ve aşama artar', () => {
  const a = puanAnahtari('spider', 1);
  let kayit = bosKayit();
  assert.deepEqual(seriOku(kayit, a), { puan: 0, asama: 1 });
  const bir = elKazanildi(kayit, a, 'a', spiderEli);
  assert.equal(bir.elPuani, 1150);
  assert.equal(bir.seriPuani, 1150);
  assert.equal(bir.yeniAsama, 2);
  kayit = bir.kayit;
  const iki = elKazanildi(kayit, a, 'a', spiderEli);
  assert.equal(iki.elPuani, 2300); // Aşama 2: iki kat
  assert.equal(iki.seriPuani, 3450);
  assert.equal(iki.yeniAsama, 3);
  assert.deepEqual(seriOku(iki.kayit, a), { puan: 3450, asama: 3 });
});

test('eli bırakınca seri sıfırlanır, en iyi kalır', () => {
  const a = puanAnahtari('klasik', 3);
  const k1 = elKazanildi(bosKayit(), a, 'c', klasikEli).kayit;
  const k2 = elKazanildi(k1, a, 'c', klasikEli).kayit;
  const enIyi = enIyiOku(k2, a);
  const bitti = seriBitir(k2, a);
  assert.deepEqual(seriOku(bitti, a), { puan: 0, asama: 1 });
  assert.equal(enIyiOku(bitti, a), enIyi);
  // Yeni seri en iyiyi geçmedikçe en iyi değişmez
  const yeni = elKazanildi(bitti, a, 'c', klasikEli);
  assert.equal(yeni.yeniEnIyi, false);
  assert.equal(enIyiOku(yeni.kayit, a), enIyi);
});

test('en iyi puan oyun ve zorluk başına ayrı', () => {
  const s1 = puanAnahtari('spider', 1);
  const s4 = puanAnahtari('spider', 4);
  const k1 = puanAnahtari('klasik', 1);
  const ilk = elKazanildi(bosKayit(), s1, 'a', spiderEli);
  assert.equal(ilk.yeniEnIyi, true);
  assert.equal(enIyiOku(ilk.kayit, s1), 1150);
  assert.equal(enIyiOku(ilk.kayit, s4), null);
  assert.equal(enIyiOku(ilk.kayit, k1), null);
  // Bir zorlukta seriyi bitirmek öbürüne dokunmaz
  const ikinci = elKazanildi(ilk.kayit, k1, 'a', klasikEli).kayit;
  const bitti = seriBitir(ikinci, s1);
  assert.deepEqual(seriOku(bitti, k1), { puan: 1610, asama: 2 });
  assert.equal(enIyiOku(bitti, k1), 1610);
});

test('kayıt saklanır ve geri okunur; aday başına ayrı; bozuk kayıt boş sayılır', () => {
  const bellek = new Map<string, string>();
  const depo: Depo = { getItem: (k) => bellek.get(k) ?? null, setItem: (k, v) => void bellek.set(k, v) };
  const a = puanAnahtari('spider', 2);
  const k = elKazanildi(bosKayit(), a, 'b', spiderEli).kayit;
  kayitYaz(depo, 'b', k);
  assert.deepEqual(kayitOku(depo, 'b'), k);
  assert.deepEqual(kayitOku(depo, 'a'), bosKayit());
  bellek.set('kartOyunu.puan.c', '{bozuk');
  assert.deepEqual(kayitOku(depo, 'c'), bosKayit());
});
