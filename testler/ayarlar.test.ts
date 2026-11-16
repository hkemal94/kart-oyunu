// Ayarlar ve iki dilin testleri (yol haritası, 5. paket). Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  AYAR_ANAHTARI,
  ayarlariOku,
  ayarlariYaz,
  ilkDil,
  VARSAYILAN_AYARLAR,
  type Depo,
} from '../src/oyun/oyuncuAyarlari.ts';
import { dilSec, m, sayi, seciliDil } from '../src/metinler/index.ts';
import tr from '../src/metinler/tr.json' with { type: 'json' };
import en from '../src/metinler/en.json' with { type: 'json' };
import kkmAyarlari from '../src/oyun/ayarlar.json' with { type: 'json' };
import { GERI_AL_HAK_DENEME_VARSAYILANI } from '../src/kart/geriAlHakki.ts';
import { PUAN_SAYILARI } from '../src/kart/puan.ts';

const bellek = (): Depo & { veri: Map<string, string> } => {
  const veri = new Map<string, string>();
  return { veri, getItem: (k) => veri.get(k) ?? null, setItem: (k, v) => void veri.set(k, v) };
};

test('ayar yoksa varsayılanlar gelir', () => {
  assert.deepEqual(ayarlariOku(bellek()), VARSAYILAN_AYARLAR);
});

test('oynanamayan kartları koyulaştır: varsayılanı açık, kapatılınca saklanır (Kemal, 15 Kasım)', () => {
  assert.equal(VARSAYILAN_AYARLAR.koyulastir, true);
  const depo = bellek();
  ayarlariYaz(depo, { ...VARSAYILAN_AYARLAR, koyulastir: false });
  assert.equal(ayarlariOku(depo).koyulastir, false);
  // Eski kayıtta alan yoksa açık gelir
  depo.setItem(AYAR_ANAHTARI, JSON.stringify({ solEl: true }));
  assert.equal(ayarlariOku(depo).koyulastir, true);
});

test('ayarlar saklanır ve yeniden açılınca aynen okunur', () => {
  const depo = bellek();
  const a = { ...VARSAYILAN_AYARLAR, solEl: true, sayaclariGizle: true, puaniGoster: false, ses: false, dil: 'en' as const };
  ayarlariYaz(depo, a);
  assert.ok(depo.veri.has(AYAR_ANAHTARI));
  assert.deepEqual(ayarlariOku(depo), a);
});

test('bozuk ya da eksik kayıt varsayılana döner', () => {
  const depo = bellek();
  depo.setItem(AYAR_ANAHTARI, '{bozuk');
  assert.deepEqual(ayarlariOku(depo), VARSAYILAN_AYARLAR);
  depo.setItem(AYAR_ANAHTARI, JSON.stringify({ solEl: 'evet', dil: 'de', titresim: false }));
  const o = ayarlariOku(depo);
  assert.equal(o.solEl, false);
  assert.equal(o.dil, null);
  assert.equal(o.titresim, false);
  assert.equal(o.deste, 'sade');
});

test('saklamaya izin vermeyen tarayıcıda oyun durmaz', () => {
  const depo: Depo = {
    getItem: () => {
      throw new Error('yok');
    },
    setItem: () => {
      throw new Error('yok');
    },
  };
  assert.deepEqual(ayarlariOku(depo), VARSAYILAN_AYARLAR);
  assert.doesNotThrow(() => ayarlariYaz(depo, VARSAYILAN_AYARLAR));
});

test('açılış dili: adres, sonra seçilen dil, sonra telefonun dili', () => {
  assert.equal(ilkDil('?dil=en', 'tr', 'tr-TR'), 'en');
  assert.equal(ilkDil('', 'en', 'tr-TR'), 'en');
  assert.equal(ilkDil('', null, 'tr-TR'), 'tr');
  assert.equal(ilkDil('', null, 'de-DE'), 'en');
  assert.equal(ilkDil('?dil=fr', null, 'tr'), 'tr');
});

test('dil değişince bütün yazılar ve sayı biçimi anında değişir', () => {
  dilSec('tr');
  assert.equal(seciliDil(), 'tr');
  assert.equal(m('masa.geriAl'), 'Geri al');
  assert.equal(m('masa.baslik', 2), 'Spider · 2 renk');
  assert.equal(sayi(1240), '1.240');
  dilSec('en');
  assert.equal(seciliDil(), 'en');
  assert.equal(m('masa.geriAl'), 'Undo');
  assert.equal(m('masa.baslik', 2), 'Spider · 2 suit');
  assert.equal(m('ayar.baslik'), 'Settings');
  assert.equal(sayi(1240), '1,240');
  dilSec('tr');
});

test('iki dil dosyasında aynı anahtarlar var, hiçbiri boş değil', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(tr).sort());
  for (const [k, v] of Object.entries(en)) assert.ok(v.trim(), k);
});

test('kart köşe harfleri iki dilde de A, J, Q, K (belge 7: karar Kemal\'in)', () => {
  for (const s of [tr, en]) {
    assert.deepEqual([s['kart.deger.1'], s['kart.deger.11'], s['kart.deger.12'], s['kart.deger.13']], ['A', 'J', 'Q', 'K']);
  }
});

// KKM'nin Ayarlar sekmesindeki dosya (src/oyun/ayarlar.json): oyun sayıları buradan okur
type KkmAyar = { deger: unknown };
const bolumler = (kkmAyarlari as { bolumler: Record<string, { ayarlar: Record<string, KkmAyar> }> }).bolumler;
const deger = (b: string, k: string) => bolumler[b].ayarlar[k].deger;

test('KKM ayar dosyasında yalnız sayı değerleri var', () => {
  for (const [b, bolum] of Object.entries(bolumler)) {
    for (const [k, a] of Object.entries(bolum.ayarlar)) assert.equal(typeof a.deger, 'number', `${b}.${k}`);
  }
});

test('oyun geri al hakkını ve puan sayılarını KKM ayar dosyasından okur', () => {
  assert.equal(GERI_AL_HAK_DENEME_VARSAYILANI, deger('yardimcilar', 'geriAlHak'));
  for (const k of Object.keys(PUAN_SAYILARI) as (keyof typeof PUAN_SAYILARI)[]) assert.equal(PUAN_SAYILARI[k], deger('puan', k));
  // Formül a seçildi (Kemal, 16 Kasım): aday seçimi ve b, c bölümleri dosyada yok
  assert.deepEqual(Object.keys(bolumler.puan.ayarlar).sort(), ['enAz', 'hamleBasi', 'saniyeBasi', 'taban']);
  assert.ok(!('puanA' in bolumler) && !('puanB' in bolumler) && !('puanC' in bolumler));
});
