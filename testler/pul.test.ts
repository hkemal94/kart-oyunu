// Pul koleksiyonunun testleri (src/pul/seri.ts; Kemal, 15 Kasım akşam). Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ceyrekTamamMi, pulDurumu } from '../src/pul/seri.ts';
import { pulGorseli } from '../src/pul/pullar.ts';
import { tamamlananAylar, ayinGunSayisi, tarihYaz } from '../src/oyun/gunluk.ts';

const tumAy = (yil: number, ay: number) => Array.from({ length: ayinGunSayisi(yil, ay) }, (_, i) => tarihYaz(yil, ay, i + 1));

test('hiç pul yokken: geçmiş aylar eksik, bu ay eksik, gelecek aylar kilitli', () => {
  const k = pulDurumu([], '2026-11-15', 2026);
  assert.equal(k.yillar.length, 1);
  assert.equal(k.ayPulu, 0);
  assert.equal(k.buyukPul, 0);
  const aylar = k.yillar[0].ceyrekler.flatMap((c) => c.aylar);
  assert.equal(aylar.length, 12);
  assert.equal(aylar[0].anahtar, '2026-01');
  assert.equal(aylar[10].durum, 'eksik'); // Kasım (bu ay)
  assert.equal(aylar[11].durum, 'gelecek'); // Aralık
  assert.equal(k.yillar[0].ceyrekler[3].buyuk, 'gelecek'); // Ekim–Aralık henüz bitemez
  assert.equal(k.yillar[0].ceyrekler[0].buyuk, 'eksik');
  assert.equal(k.yillar[0].ceyrekler[0].anahtar, '2026-Q1');
});

test('çeyreğin üç ayı kazanılınca büyük pul gelir; eksik ay varsa gelmez', () => {
  const k = pulDurumu(['2026-01', '2026-02', '2026-03', '2026-05'], '2026-11-15', 2026);
  assert.equal(k.ayPulu, 4);
  assert.equal(k.buyukPul, 1);
  assert.equal(k.yillar[0].ceyrekler[0].buyuk, 'kazanildi');
  assert.equal(k.yillar[0].ceyrekler[1].buyuk, 'eksik');
  assert.equal(k.yillar[0].ceyrekler[1].aylar[1].durum, 'kazanildi');
});

test('yeni yıl gelince yıl eklenir; gelecek ay kazanılmış sayılmaz; bozuk anahtar atlanır', () => {
  const k = pulDurumu(['2026-12', '2027-03', 'bozuk', '2026-13'], '2027-02-01', 2026);
  assert.deepEqual(k.yillar.map((y) => y.yil), [2026, 2027]);
  assert.equal(k.ayPulu, 1);
  assert.equal(k.yillar[1].ceyrekler[0].aylar[2].durum, 'gelecek');
});

test('ceyrekTamamMi: ay kazanılınca çeyreğin büyük pulu geldi mi', () => {
  assert.equal(ceyrekTamamMi(['2026-01', '2026-02'], '2026-02'), false);
  assert.equal(ceyrekTamamMi(['2026-01', '2026-02', '2026-03'], '2026-02'), true);
  assert.equal(ceyrekTamamMi(['2026-10', '2026-11', '2026-12'], '2026-12'), true);
});

test('kart oyununun girdisi: yıldızlı günlerden kazanılan aylar; eski rozetler kaybolmaz', () => {
  const yildizlar = [...tumAy(2026, 1), ...tumAy(2026, 2), ...tumAy(2026, 3), ...tumAy(2026, 4).slice(1)];
  const aylar = tamamlananAylar({ yildizlar });
  assert.deepEqual(aylar, ['2026-01', '2026-02', '2026-03']);
  const k = pulDurumu(aylar, '2026-11-15', 2026);
  assert.equal(k.ayPulu, 3);
  assert.equal(k.buyukPul, 1);
});

test('görseli olmayan pul yer tutucuyla çizilir', () => {
  assert.equal(pulGorseli('2026-01'), null);
  assert.equal(pulGorseli('2026-Q1'), null);
});
