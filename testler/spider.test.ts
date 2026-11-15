// Spider kurallarının basit testleri (yol haritası, 2. paket). Yeni paket yok: Node'un kendi
// test aracıyla çalışır. Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Kart, Takim } from '../src/kart/kart.ts';
import {
  birakilabilirMi,
  dagitilabilirMi,
  destedenDagit,
  kazandiMi,
  spiderDagit,
  tasi,
  tasinabilirMi,
  type SpiderMasasi,
} from '../src/kart/spider.ts';

let sayac = 0;
const k = (deger: number, takim: Takim = 'maca', acik = true): Kart => ({
  id: `t${sayac++}`,
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
// Papazdan (13) belli bir değere kadar aynı takımdan açık dizi
const dizi = (bitis: number, takim: Takim = 'maca') =>
  Array.from({ length: 14 - bitis }, (_, i) => k(13 - i, takim));

test('dağıtım: 104 kart, 54 masada, 50 destede, her sütunun yalnız üstü açık', () => {
  for (const renk of [1, 2, 4] as const) {
    const masa = spiderDagit(renk);
    const masadaki = masa.sutunlar.flat();
    assert.equal(masa.sutunlar.length, 10);
    assert.equal(masadaki.length, 54);
    assert.equal(masa.deste.length, 50);
    assert.deepEqual(masa.sutunlar.map((s) => s.length), [6, 6, 6, 6, 5, 5, 5, 5, 5, 5]);
    masa.sutunlar.forEach((s) => s.forEach((kart, i) => assert.equal(kart.acik, i === s.length - 1)));
    const takimlar = new Set([...masadaki, ...masa.deste].map((x) => x.takim));
    assert.equal(takimlar.size, renk);
  }
});

test('dizi taşıma: aynı takımdan sıralı dizi bir büyük kartın üstüne gider', () => {
  const s = bos();
  s[0] = [k(4, 'maca', false), k(9, 'kupa'), k(8, 'kupa'), k(7, 'kupa')];
  s[1] = [k(10, 'maca')];
  const masa = masaKur(s);
  assert.equal(tasinabilirMi(masa, 0, 1), true);
  const sonuc = tasi(masa, 0, 1, 1);
  assert.ok(sonuc);
  assert.deepEqual(sonuc.sutunlar[1].map((x) => x.deger), [10, 9, 8, 7]);
  assert.equal(sonuc.hamle, 1);
  // En üstte kalan kapalı kart kendiliğinden açılır
  assert.equal(sonuc.sutunlar[0].length, 1);
  assert.equal(sonuc.sutunlar[0][0].acik, true);
});

test('dizi taşıma: karışık takımlı ya da kapalı kartlı dizi birlikte taşınmaz', () => {
  const s = bos();
  s[0] = [k(9, 'kupa'), k(8, 'maca'), k(7, 'maca')];
  s[1] = [k(10, 'maca')];
  s[2] = [k(6, 'maca', false), k(5, 'maca')];
  const masa = masaKur(s);
  assert.equal(tasinabilirMi(masa, 0, 0), false); // 9 kupa üstünde 8 maça
  assert.equal(tasi(masa, 0, 0, 1), null);
  assert.equal(tasinabilirMi(masa, 0, 1), true); // 8-7 maça birlikte gider
  assert.equal(tasinabilirMi(masa, 2, 0), false); // kapalı kart
});

test('taşıma: renk fark etmez, değer bir büyük olmalı; boş sütuna her kart', () => {
  const s = bos();
  s[0] = [k(7, 'kupa')];
  s[1] = [k(8, 'maca')];
  s[2] = [k(9, 'maca')];
  const masa = masaKur(s);
  assert.equal(birakilabilirMi(masa, 0, 0, 1), true); // 7 kupa → 8 maça
  assert.equal(birakilabilirMi(masa, 0, 0, 2), false); // 7 → 9 olmaz
  assert.equal(tasi(masa, 0, 0, 2), null);
  assert.equal(birakilabilirMi(masa, 0, 0, 3), true); // boş sütun
  assert.equal(birakilabilirMi(masa, 2, 0, 3), true);
  assert.equal(birakilabilirMi(masa, 0, 0, 0), false); // aynı sütun
});

test('dizi tamamlama: papazdan asa aynı takım kendiliğinden kalkar', () => {
  const s = bos();
  s[0] = [k(3, 'kupa', false), ...dizi(2)];
  s[1] = [k(1)];
  const sonuc = tasi(masaKur(s), 1, 0, 0);
  assert.ok(sonuc);
  assert.deepEqual(sonuc.tamamlanan, ['maca']);
  assert.equal(sonuc.sutunlar[0].length, 1);
  assert.equal(sonuc.sutunlar[0][0].acik, true); // altta kalan kapalı kart açıldı
  assert.equal(sonuc.sutunlar[1].length, 0);
});

test('dizi tamamlama: karışık takımlı K–A dizisi kalkmaz', () => {
  const s = bos();
  s[0] = [...dizi(2, 'maca')];
  s[1] = [k(1, 'kupa')];
  const sonuc = tasi(masaKur(s), 1, 0, 0);
  assert.ok(sonuc);
  assert.deepEqual(sonuc.tamamlanan, []);
  assert.equal(sonuc.sutunlar[0].length, 13);
});

test('dizi tamamlama: desteden gelen as da diziyi tamamlar', () => {
  const s = bos().map(() => [k(5, 'kupa')]);
  s[4] = [...dizi(2)];
  const deste = Array.from({ length: 10 }, (_, i) => k(i === 4 ? 1 : 6, i === 4 ? 'maca' : 'kupa', false));
  const sonuc = destedenDagit(masaKur(s, { deste }));
  assert.ok(sonuc);
  assert.deepEqual(sonuc.tamamlanan, ['maca']);
  assert.equal(sonuc.sutunlar[4].length, 0);
  assert.equal(sonuc.deste.length, 0);
});

test('desteden dağıtma: her sütuna birer açık kart', () => {
  const masa = spiderDagit(2);
  const sonuc = destedenDagit(masa);
  assert.ok(sonuc);
  assert.equal(sonuc.deste.length, 40);
  sonuc.sutunlar.forEach((s, c) => {
    assert.equal(s.length, masa.sutunlar[c].length + 1);
    assert.equal(s[s.length - 1].acik, true);
  });
  assert.equal(sonuc.hamle, 1);
});

test('boş sütunla dağıtma: olmaz', () => {
  const s = bos().map(() => [k(5)]);
  s[6] = [];
  const masa = masaKur(s, { deste: Array.from({ length: 10 }, () => k(2, 'maca', false)) });
  assert.equal(dagitilabilirMi(masa), 'bosSutun');
  assert.equal(destedenDagit(masa), null);
  assert.equal(dagitilabilirMi(masaKur(bos().map(() => [k(5)]))), 'desteBos');
});

test('kazanma: sekiz dizi tamamlanınca', () => {
  const s = bos();
  s[0] = [...dizi(2, 'karo')];
  s[1] = [k(1, 'karo')];
  const yedi: Takim[] = ['maca', 'maca', 'kupa', 'kupa', 'karo', 'sinek', 'sinek'];
  const masa = masaKur(s, { tamamlanan: yedi });
  assert.equal(kazandiMi(masa), false);
  const sonuc = tasi(masa, 1, 0, 0);
  assert.ok(sonuc);
  assert.equal(sonuc.tamamlanan.length, 8);
  assert.equal(kazandiMi(sonuc), true);
  assert.ok(sonuc.sutunlar.every((x) => x.length === 0));
});
