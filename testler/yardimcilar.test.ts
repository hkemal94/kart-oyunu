// Geri al ve ipucunun testleri (yol haritası, 4. paket). Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Kart, Takim } from '../src/kart/kart.ts';
import { destedenDagit, geriAl, ipuclari, tasi, type SpiderMasasi } from '../src/kart/spider.ts';

let sayac = 0;
const k = (deger: number, takim: Takim = 'maca', acik = true): Kart => ({
  id: `y${sayac++}`,
  takim,
  deger,
  acik,
});
const bos = (): Kart[][] => Array.from({ length: 10 }, () => []);
const masaKur = (sutunlar: Kart[][], ek: Partial<SpiderMasasi> = {}): SpiderMasasi => ({
  sutunlar,
  deste: [],
  tamamlanan: [],
  hamle: 0,
  ...ek,
});
const dizi = (bitis: number, takim: Takim = 'maca') =>
  Array.from({ length: 14 - bitis }, (_, i) => k(13 - i, takim));
// Her sütunda tek bir üçlü: hiçbiri öbürüne konamaz, taşıma yok
const tikali = () => bos().map((_, i) => [k(3, i < 5 ? 'maca' : 'kupa')]);

test('geri al: taşıma ve kendiliğinden açılan kart geri gelir, hamle artar', () => {
  const s = bos();
  s[0] = [k(4, 'kupa', false), k(9, 'kupa')];
  s[1] = [k(10, 'maca')];
  const ilk = masaKur(s);
  const sonra = tasi(ilk, 0, 1, 1);
  assert.ok(sonra);
  assert.equal(sonra.sutunlar[0][0].acik, true);
  const geri = geriAl(sonra, [ilk]);
  assert.ok(geri);
  assert.deepEqual(geri.masa.sutunlar, ilk.sutunlar);
  assert.equal(geri.masa.sutunlar[0][0].acik, false); // açılan kart yeniden kapalı
  assert.equal(geri.masa.hamle, 2); // taşıma 1, geri alma 1
  assert.deepEqual(geri.gecmis, []);
  assert.equal(geriAl(geri.masa, geri.gecmis), null); // geçmiş bitti
});

test('geri al: desteden dağıtma geri alınınca kartlar desteye döner', () => {
  const s = bos().map(() => [k(5, 'kupa')]);
  const deste = Array.from({ length: 20 }, () => k(2, 'maca', false));
  const ilk = masaKur(s, { deste });
  const sonra = destedenDagit(ilk);
  assert.ok(sonra);
  const geri = geriAl(sonra, [ilk]);
  assert.ok(geri);
  assert.equal(geri.masa.deste.length, 20);
  assert.deepEqual(geri.masa.deste, deste);
  assert.ok(geri.masa.sutunlar.every((x) => x.length === 1));
});

test('geri al: tamamlanıp kalkan dizi masaya döner; arka arkaya geri alınır', () => {
  const s = bos();
  s[0] = [k(3, 'kupa', false), ...dizi(3)];
  s[1] = [k(2)];
  s[2] = [k(1)];
  const m0 = masaKur(s);
  const m1 = tasi(m0, 1, 0, 0);
  assert.ok(m1);
  const m2 = tasi(m1, 2, 0, 0);
  assert.ok(m2);
  assert.deepEqual(m2.tamamlanan, ['maca']);
  assert.equal(m2.sutunlar[0].length, 1);
  const g1 = geriAl(m2, [m0, m1]);
  assert.ok(g1);
  assert.deepEqual(g1.masa.tamamlanan, []);
  assert.equal(g1.masa.sutunlar[0].length, 13); // dizi geri geldi, as yine 3. sütunda
  assert.equal(g1.masa.sutunlar[0][0].acik, false);
  assert.equal(g1.masa.sutunlar[2].length, 1);
  const g2 = geriAl(g1.masa, g1.gecmis);
  assert.ok(g2);
  assert.deepEqual(g2.masa.sutunlar, m0.sutunlar);
  assert.equal(g2.masa.hamle, 4);
});

test('ipucu: bulunan her hamle kurala uyar; aynı takıma konan önce gelir', () => {
  const s = tikali();
  s[0] = [k(8, 'kupa')]; // 7 maça buraya konabilir (başka takım)
  s[1] = [k(8, 'maca')]; // 7 maça buraya da (aynı takım)
  s[2] = [k(6, 'kupa', false), k(7, 'maca')];
  const masa = masaKur(s);
  const liste = ipuclari(masa);
  assert.ok(liste.length > 0);
  for (const ip of liste) {
    assert.equal(ip.tur, 'tasi');
    if (ip.tur === 'tasi') assert.ok(tasi(masa, ip.kaynak, ip.sira, ip.hedef));
  }
  assert.deepEqual(liste[0], { tur: 'tasi', kaynak: 2, sira: 1, hedef: 1 });
  assert.deepEqual(liste[1], { tur: 'tasi', kaynak: 2, sira: 1, hedef: 0 });
});

test('ipucu: kapalı kartı açan hamle, açmayandan önce gelir', () => {
  const s = tikali();
  s[0] = [k(9, 'kupa')];
  s[1] = [k(4, 'kupa'), k(8, 'maca')]; // altı açık ama uygun değil
  s[2] = [k(2, 'kupa', false), k(8, 'sinek')]; // altında kapalı kart
  const liste = ipuclari(masaKur(s));
  assert.deepEqual(liste[0], { tur: 'tasi', kaynak: 2, sira: 1, hedef: 0 });
  assert.deepEqual(liste[1], { tur: 'tasi', kaynak: 1, sira: 1, hedef: 0 });
});

test('ipucu: işe yaramayan hamle önerilmez', () => {
  const s = tikali();
  s[0] = [k(9, 'kupa'), k(8, 'maca')]; // zaten uygun kartın üstünde
  s[1] = [k(9, 'sinek')];
  s[9] = [];
  const liste = ipuclari(masaKur(s));
  // 8 maçayı 9 sineğe taşımak ya da tek kartlık sütunu boş sütuna taşımak bir şey kazandırmaz
  assert.ok(!liste.some((ip) => ip.tur === 'tasi' && ip.kaynak === 0 && ip.sira === 1 && ip.hedef === 1));
  assert.ok(!liste.some((ip) => ip.tur === 'tasi' && ip.sira === 0 && ip.hedef === 9));
});

test('ipucu: hamle yoksa ve deste doluysa "Dağıt"; hiçbir şey yoksa boş liste', () => {
  const deste = Array.from({ length: 10 }, () => k(2, 'maca', false));
  assert.deepEqual(ipuclari(masaKur(tikali(), { deste })), [{ tur: 'dagit' }]);
  assert.deepEqual(ipuclari(masaKur(tikali())), []);
});
