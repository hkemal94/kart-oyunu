// Masa düzeninin testleri (Kemal, 15 Kasım: kartlar büyüsün, aralık ekrana göre, uzun sütun
// sıkışsın ama alanın dışına taşmasın). Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ekranaGoreAralik, KART_ORANI, kartOlcusu, sutunKonumlari, yelpazeEni } from '../src/kart/duzen.ts';

test('kart eni genişlikten gelir; uzun ekranda boy en çok verilen orana kadar uzar', () => {
  const kisa = kartOlcusu(378, 400, 10, 2, KART_ORANI, 1.6);
  const uzun = kartOlcusu(378, 700, 10, 2, KART_ORANI, 1.6);
  assert.equal(kisa.en, 36);
  assert.equal(uzun.en, 36);
  assert.equal(kisa.boy, Math.round(36 * KART_ORANI));
  assert.ok(uzun.boy > kisa.boy);
  assert.ok(uzun.boy <= Math.round(36 * 1.6));
});

test('klasik solitaire: iki oran aynıysa kart hep standart', () => {
  const o = kartOlcusu(378, 800, 7, 4);
  assert.equal(o.boy, Math.round(o.en * KART_ORANI));
});

test('aralık ekran yüksekliğiyle açılır, kart payını aşmaz', () => {
  const ayar = { kapaliSayisi: 5, acikSayisi: 10, enCokAcik: 0.52, enCokKapali: 0.4 };
  const alcak = ekranaGoreAralik(50, 300, ayar);
  const yuksek = ekranaGoreAralik(50, 900, ayar);
  assert.ok(yuksek.acik > alcak.acik);
  assert.ok(yuksek.acik <= 50 * 0.52 + 1e-9);
  assert.ok(yuksek.kapali <= 50 * 0.4 + 1e-9);
  assert.ok(yuksek.kapali < yuksek.acik);
});

test('kısa sütun sıkışmaz', () => {
  const y = sutunKonumlari([false, false, true], { acik: 20, kapali: 10 }, 50, 500, 4);
  assert.deepEqual(y, [0, 10, 20]);
});

test('uzun sütun önce kapalı kartlarda sıkışır, son kart alanın içinde kalır', () => {
  const acikMi = [...Array(6).fill(false), ...Array(14).fill(true)];
  const aralik = { acik: 20, kapali: 12 };
  // açıkların toplamı 13*20 = 260; alan 50 + 260 + 6*5 = 340
  const y = sutunKonumlari(acikMi, aralik, 50, 340, 4);
  assert.ok(y[1] - y[0] < 12);
  assert.ok(y[1] - y[0] >= 4);
  assert.equal(y[7] - y[6], 20); // açık aralık değişmedi
  assert.ok(y[y.length - 1] + 50 <= 340 + 1e-9);
});

test('çok uzun sütunda bütün aralıklar sıkışır, yine taşmaz', () => {
  const acikMi = [...Array(5).fill(false), ...Array(30).fill(true)];
  const y = sutunKonumlari(acikMi, { acik: 20, kapali: 12 }, 50, 400, 4);
  assert.ok(Math.abs(y[y.length - 1] + 50 - 400) < 1e-6);
  assert.ok(y[6] - y[5] < 20);
});

test('alt şeritteki dar yelpaze', () => {
  assert.equal(yelpazeEni(0, 36, 11), 0);
  assert.equal(yelpazeEni(1, 36, 11), 36);
  assert.equal(yelpazeEni(8, 36, 11), 36 + 7 * 11);
});
