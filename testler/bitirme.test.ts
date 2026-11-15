// Kendiliğinden bitirme (4. paket; Kemal, 15 Kasım) kural testleri. Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Kart, Takim } from '../src/kart/kart.ts';
import * as klondike from '../src/kart/klondike.ts';

const k = (takim: Takim, deger: number, acik = true): Kart => ({ id: `${takim}-${deger}`, takim, deger, acik });
// Temelde her takımın astan bu değere kadarki kartları
const temeller = (ust: Record<Takim, number>) =>
  klondike.TEMEL_TAKIMLARI.map((t) => Array.from({ length: ust[t] }, (_, i) => k(t, i + 1)));
const masa = (sutunlar: Kart[][], ek: Partial<klondike.KlondikeMasasi> = {}): klondike.KlondikeMasasi => {
  const tam = [...sutunlar];
  while (tam.length < 7) tam.push([]);
  return { sutunlar: tam, temeller: temeller({ maca: 11, kupa: 11, karo: 12, sinek: 12 }), deste: [], acilan: [], cekme: 1, hamle: 5, ...ek };
};
// Kalan kartlar: Q♠ K♠, Q♥ K♥, K♦, K♣
const ornek = () => masa([[k('kupa', 13), k('maca', 12)], [k('maca', 13), k('kupa', 12)], [k('karo', 13)], [k('sinek', 13)]]);

test('Bitirme: bütün kartlar açık, deste ve açılanlar boşken olur', () => {
  assert.equal(klondike.bitirilebilirMi(ornek()), true);
});

test('Bitirme: kapalı kart, deste ya da açılan kart varken olmaz', () => {
  const kapali = ornek();
  kapali.sutunlar[2] = [k('karo', 13, false)];
  assert.equal(klondike.bitirilebilirMi(kapali), false);
  assert.equal(klondike.bitirilebilirMi({ ...ornek(), deste: [k('sinek', 1, false)] }), false);
  assert.equal(klondike.bitirilebilirMi({ ...ornek(), acilan: [k('sinek', 1)] }), false);
  assert.deepEqual(klondike.bitirmeAdimlari(kapali), []);
});

test('Bitirme: kazanılmış elde düğme çıkmaz', () => {
  const bitmis = masa([], { temeller: temeller({ maca: 13, kupa: 13, karo: 13, sinek: 13 }) });
  assert.equal(klondike.bitirilebilirMi(bitmis), false);
});

test('Bitirme: kartlar en küçükten birer birer temele gider, her biri bir hamle, sonunda el kazanılır', () => {
  const adimlar = klondike.bitirmeAdimlari(ornek());
  assert.equal(adimlar.length, 6); // masada kalan kart sayısı
  const son = adimlar[adimlar.length - 1];
  assert.equal(klondike.kazandiMi(son), true);
  assert.equal(son.hamle, 5 + 6);
  // Önce iki kız, sonra papazlar
  const ilk = adimlar[0];
  assert.equal(ilk.temeller.reduce((t, y) => t + y.length, 0), 47);
  assert.equal(ilk.sutunlar[0].length, 1); // Q♠ soldaki sütundan önce gider
  assert.ok(adimlar.slice(0, -1).every((a) => !klondike.kazandiMi(a)));
});
