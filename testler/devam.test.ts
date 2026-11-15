// Kaldığı yerden devamın testleri (yol haritası 4 ve 7). Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { YARIM_EL_ANAHTARI, yarimElOku, yarimElSil, yarimElYaz, yarimMi, type Depo, type YarimEl } from '../src/oyun/yarimEl.ts';
import { spiderDagit, tasi as spiderTasi, ipuclari as spiderIpuclari, type SpiderMasasi } from '../src/kart/spider.ts';
import { cek, klondikeDagit } from '../src/kart/klondike.ts';
import { sonSecimOku, sonSecimYaz, ILK_SECIM } from '../src/oyun/sonSecim.ts';

const bellek = (): Depo & { veri: Map<string, string> } => {
  const veri = new Map<string, string>();
  return { veri, getItem: (k) => veri.get(k) ?? null, setItem: (k, v) => void veri.set(k, v), removeItem: (k) => void veri.delete(k) };
};

// Her seferinde aynı eli veren basit sayı üreteci
function sabit(tohum: number) {
  let x = tohum;
  return () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648);
}

// Spider'da ipucunun önerdiği ilk taşımayı yapar (bir hamle)
function birHamle(masa: SpiderMasasi): SpiderMasasi {
  const ip = spiderIpuclari(masa).find((i) => i.tur === 'tasi');
  assert.ok(ip && ip.tur === 'tasi');
  const sonuc = spiderTasi(masa, ip.kaynak, ip.sira, ip.hedef);
  assert.ok(sonuc);
  return sonuc;
}

const hak = { elBasi: 3, kalan: 2 };

test('yarım el yoksa okunan boş', () => {
  assert.equal(yarimElOku(bellek()), null);
});

test('Spider yarım eli saklanır ve aynen geri gelir', () => {
  const depo = bellek();
  const masa = birHamle(spiderDagit(2, sabit(7)));
  const el: YarimEl = { oyun: 'spider', zorluk: 2, masa, saniye: 95, hak };
  yarimElYaz(depo, el);
  assert.deepEqual(yarimElOku(depo), el);
});

test('klasik solitaire yarım eli saklanır ve aynen geri gelir', () => {
  const depo = bellek();
  const masa = cek(klondikeDagit(3, sabit(11)));
  assert.ok(masa);
  const el: YarimEl = { oyun: 'klasik', zorluk: 3, masa, saniye: 12, hak: { elBasi: 3, kalan: 3 } };
  yarimElYaz(depo, el);
  assert.deepEqual(yarimElOku(depo), el);
});

test('silinen yarım el geri gelmez', () => {
  const depo = bellek();
  yarimElYaz(depo, { oyun: 'spider', zorluk: 1, masa: birHamle(spiderDagit(1, sabit(3))), saniye: 1, hak });
  yarimElSil(depo);
  assert.equal(yarimElOku(depo), null);
});

test('hiç hamle yapılmamış el yarım sayılmaz', () => {
  assert.equal(yarimMi(0, false), false);
  assert.equal(yarimMi(5, false), true);
  assert.equal(yarimMi(5, true), false);
  const depo = bellek();
  yarimElYaz(depo, { oyun: 'spider', zorluk: 1, masa: spiderDagit(1, sabit(3)), saniye: 0, hak });
  assert.equal(yarimElOku(depo), null);
});

test('bozuk ya da eksik kayıt yok sayılır', () => {
  const depo = bellek();
  for (const ham of ['{bozuk', 'null', '{"surum":1}', '{"surum":99,"oyun":"spider"}']) {
    depo.setItem(YARIM_EL_ANAHTARI, ham);
    assert.equal(yarimElOku(depo), null, ham);
  }
  // Kartı eksik masa
  const masa = birHamle(spiderDagit(1, sabit(5)));
  const eksik = { ...masa, deste: masa.deste.slice(1) };
  depo.setItem(YARIM_EL_ANAHTARI, JSON.stringify({ surum: 1, oyun: 'spider', zorluk: 1, masa: eksik, saniye: 3, hak }));
  assert.equal(yarimElOku(depo), null);
  // Zorluğu masayla uyuşmayan klasik el
  const k = cek(klondikeDagit(1, sabit(5)))!;
  depo.setItem(YARIM_EL_ANAHTARI, JSON.stringify({ surum: 1, oyun: 'klasik', zorluk: 3, masa: k, saniye: 3, hak }));
  assert.equal(yarimElOku(depo), null);
});

test('saklama kapalıysa oyun bozulmaz', () => {
  const kapali: Depo = {
    getItem: () => {
      throw new Error('kapalı');
    },
    setItem: () => {
      throw new Error('kapalı');
    },
    removeItem: () => {
      throw new Error('kapalı');
    },
  };
  yarimElYaz(kapali, { oyun: 'spider', zorluk: 1, masa: birHamle(spiderDagit(1, sabit(3))), saniye: 1, hak });
  yarimElSil(kapali);
  assert.equal(yarimElOku(kapali), null);
});

test('son seçilen oyun ve zorluk saklanır', () => {
  const depo = bellek();
  assert.deepEqual(sonSecimOku(depo), ILK_SECIM);
  sonSecimYaz(depo, { oyun: 'klasik', renk: 4, cekme: 3 });
  assert.deepEqual(sonSecimOku(depo), { oyun: 'klasik', renk: 4, cekme: 3 });
});
