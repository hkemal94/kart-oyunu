// İstatistiğin testleri (yol haritası 4 ve 7). Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BOS_ISTATISTIK,
  elBasladi,
  elKazanildi,
  ISTATISTIK_ANAHTARI,
  istatistikGuncelle,
  istatistikOku,
  istatistikYukle,
  type Depo,
} from '../src/oyun/istatistik.ts';

const bellek = (): Depo => {
  const veri = new Map<string, string>();
  return { getItem: (k) => veri.get(k) ?? null, setItem: (k, v) => void veri.set(k, v) };
};

test('hiç oynanmadıysa sıfır ve en iyi süre yok', () => {
  assert.deepEqual(istatistikOku(istatistikYukle(bellek()), 'spider-1'), BOS_ISTATISTIK);
});

test('başlayan el oynanan, kazanılan el kazanılan sayılır; en iyi süre en kısası', () => {
  let i = {};
  i = elBasladi(i, 'spider-1');
  i = elKazanildi(i, 'spider-1', 600);
  i = elBasladi(i, 'spider-1');
  i = elBasladi(i, 'spider-1');
  i = elKazanildi(i, 'spider-1', 420);
  i = elBasladi(i, 'spider-1');
  i = elKazanildi(i, 'spider-1', 700);
  assert.deepEqual(istatistikOku(i, 'spider-1'), { oynanan: 4, kazanilan: 3, enIyiSure: 420 });
});

test('oyun ve zorluk başına ayrı sayılır', () => {
  let i = {};
  i = elBasladi(i, 'spider-1');
  i = elBasladi(i, 'klasik-3');
  i = elKazanildi(i, 'klasik-3', 200);
  assert.deepEqual(istatistikOku(i, 'spider-1'), { oynanan: 1, kazanilan: 0, enIyiSure: null });
  assert.deepEqual(istatistikOku(i, 'klasik-3'), { oynanan: 1, kazanilan: 1, enIyiSure: 200 });
  assert.deepEqual(istatistikOku(i, 'spider-4'), BOS_ISTATISTIK);
});

test('kazanılan oynanandan fazla olmaz', () => {
  const i = elKazanildi({}, 'spider-2', 300);
  assert.deepEqual(istatistikOku(i, 'spider-2'), { oynanan: 1, kazanilan: 1, enIyiSure: 300 });
});

test('saklanır, yeniden açılınca aynen okunur; bozuk kayıt boş sayılır', () => {
  const depo = bellek();
  istatistikGuncelle(depo, (i) => elBasladi(i, 'spider-1'));
  istatistikGuncelle(depo, (i) => elKazanildi(i, 'spider-1', 90));
  assert.deepEqual(istatistikOku(istatistikYukle(depo), 'spider-1'), { oynanan: 1, kazanilan: 1, enIyiSure: 90 });
  depo.setItem(ISTATISTIK_ANAHTARI, '{bozuk');
  assert.deepEqual(istatistikYukle(depo), {});
  depo.setItem(ISTATISTIK_ANAHTARI, JSON.stringify({ 'spider-1': { oynanan: 'x' }, 'klasik-1': { oynanan: 2, kazanilan: 1 } }));
  assert.deepEqual(istatistikYukle(depo), { 'klasik-1': { oynanan: 2, kazanilan: 1, enIyiSure: null } });
});
