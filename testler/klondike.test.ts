// Klasik solitaire (Klondike) kurallarının testleri (yol haritası, 3. paket). Yeni paket yok:
// Node'un kendi test aracıyla çalışır. Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Kart, Takim } from '../src/kart/kart.ts';
import {
  birakilabilirMi,
  cek,
  cekmeDurumu,
  geriAl,
  ipuclari,
  kazandiMi,
  klondikeDagit,
  klondikeKartlari,
  tasi,
  tasinabilirMi,
  temeleGonder,
  TEMEL_TAKIMLARI,
  type KlondikeMasasi,
} from '../src/kart/klondike.ts';

let sayac = 0;
const k = (deger: number, takim: Takim = 'maca', acik = true): Kart => ({
  id: `k${sayac++}`,
  takim,
  deger,
  acik,
});
const bos = (): Kart[][] => Array.from({ length: 7 }, () => []);
const masaKur = (sutunlar: Kart[][], ek: Partial<KlondikeMasasi> = {}): KlondikeMasasi => ({
  sutunlar,
  temeller: TEMEL_TAKIMLARI.map(() => []),
  deste: [],
  acilan: [],
  cekme: 1,
  hamle: 0,
  ...ek,
});
// Bir takımın astan verilen değere kadar temel yığını
const yigin = (takim: Takim, kadar: number) => Array.from({ length: kadar }, (_, i) => k(i + 1, takim));
const sutun = (no: number, sira: number) => ({ tur: 'sutun' as const, no, sira });

test('dağıtım: 52 kart, yedi sütunda 1-7 kart, yalnız üstteki açık, 24 kart destede', () => {
  const masa = klondikeDagit(3);
  assert.deepEqual(
    masa.sutunlar.map((s) => s.length),
    [1, 2, 3, 4, 5, 6, 7],
  );
  for (const s of masa.sutunlar) {
    s.forEach((kart, i) => assert.equal(kart.acik, i === s.length - 1));
  }
  assert.equal(masa.deste.length, 24);
  assert.ok(masa.deste.every((x) => !x.acik));
  assert.deepEqual(masa.acilan, []);
  assert.ok(masa.temeller.every((t) => t.length === 0));
  const hepsi = [...masa.sutunlar.flat(), ...masa.deste];
  assert.equal(new Set(hepsi.map((x) => x.id)).size, 52);
  assert.equal(klondikeKartlari().length, 52);
  assert.equal(masa.cekme, 3);
});

test('sütunda dizme: bir küçük ve ters renk; aynı renk ya da yanlış değer reddedilir', () => {
  const s = bos();
  s[0] = [k(8, 'maca')];
  s[1] = [k(7, 'kupa')]; // kırmızı 7 → siyah 8: olur
  s[2] = [k(7, 'sinek')]; // siyah 7 → siyah 8: olmaz
  s[3] = [k(6, 'karo')]; // 6 → 8: olmaz
  const masa = masaKur(s);
  assert.ok(birakilabilirMi(masa, sutun(1, 0), { tur: 'sutun', no: 0 }));
  assert.ok(!birakilabilirMi(masa, sutun(2, 0), { tur: 'sutun', no: 0 }));
  assert.ok(!birakilabilirMi(masa, sutun(3, 0), { tur: 'sutun', no: 0 }));
  assert.equal(tasi(masa, sutun(2, 0), { tur: 'sutun', no: 0 }), null);
  const sonra = tasi(masa, sutun(1, 0), { tur: 'sutun', no: 0 });
  assert.ok(sonra);
  assert.equal(sonra.sutunlar[0].length, 2);
  assert.equal(sonra.hamle, 1);
});

test('sütunda dizme: açık sıralı dizi birlikte taşınır, altta kalan kapalı kart açılır', () => {
  const s = bos();
  s[0] = [k(2, 'kupa', false), k(9, 'maca'), k(8, 'kupa'), k(7, 'sinek')];
  s[1] = [k(10, 'karo')];
  s[2] = [k(9, 'sinek'), k(7, 'kupa')]; // 9 sinek ile 7 kupa sıralı değil
  const masa = masaKur(s);
  assert.ok(tasinabilirMi(masa, sutun(0, 1)));
  assert.ok(!tasinabilirMi(masa, sutun(0, 0))); // kapalı kart taşınmaz
  assert.ok(!tasinabilirMi(masa, sutun(2, 0)));
  const sonra = tasi(masa, sutun(0, 1), { tur: 'sutun', no: 1 });
  assert.ok(sonra);
  assert.equal(sonra.sutunlar[1].length, 4);
  assert.equal(sonra.sutunlar[0].length, 1);
  assert.equal(sonra.sutunlar[0][0].acik, true); // kendiliğinden açıldı
});

test('boş sütuna yalnız papaz ya da papazla başlayan dizi konur', () => {
  const s = bos();
  s[0] = [k(5, 'kupa', false), k(13, 'kupa'), k(12, 'sinek')];
  s[1] = [k(12, 'maca')];
  const masa = masaKur(s, { acilan: [k(13, 'maca')] });
  const bosHedef = { tur: 'sutun' as const, no: 6 };
  assert.ok(!birakilabilirMi(masa, sutun(1, 0), bosHedef)); // kız boş sütuna konmaz
  assert.ok(birakilabilirMi(masa, { tur: 'acilan' }, bosHedef)); // açılan papaz konur
  const sonra = tasi(masa, sutun(0, 1), bosHedef); // papazla başlayan dizi
  assert.ok(sonra);
  assert.equal(sonra.sutunlar[6].length, 2);
  assert.equal(sonra.sutunlar[0][0].acik, true);
});

test('temel: astan papaza aynı takım; çift dokunuşla kart kendi yığınına gider', () => {
  const s = bos();
  s[0] = [k(1, 'karo')];
  s[1] = [k(3, 'karo')];
  s[2] = [k(2, 'kupa'), k(2, 'karo')];
  const masa = masaKur(s);
  assert.ok(!birakilabilirMi(masa, sutun(1, 0), { tur: 'temel' })); // önce as
  const m1 = temeleGonder(masa, sutun(0, 0));
  assert.ok(m1);
  assert.equal(m1.temeller[TEMEL_TAKIMLARI.indexOf('karo')].length, 1);
  assert.equal(temeleGonder(m1, sutun(2, 0)), null); // üstte değil
  const m2 = temeleGonder(m1, sutun(2, 1));
  assert.ok(m2);
  assert.equal(temeleGonder(m2, sutun(2, 0)), null); // 2 kupa: kupa yığını boş
  const m3 = temeleGonder(m2, sutun(1, 0));
  assert.ok(m3);
  assert.equal(m3.temeller[TEMEL_TAKIMLARI.indexOf('karo')].length, 3);
  // Dizi temele gitmez, yalnız tek kart
  const d = bos();
  d[0] = [k(2, 'maca'), k(1, 'kupa')];
  assert.ok(!birakilabilirMi(masaKur(d), sutun(0, 0), { tur: 'temel' }));
});

test('temel: temelden sütuna geri alma serbest', () => {
  const temeller = TEMEL_TAKIMLARI.map(() => [] as Kart[]);
  temeller[TEMEL_TAKIMLARI.indexOf('kupa')] = yigin('kupa', 7);
  const s = bos();
  s[0] = [k(8, 'sinek')];
  const masa = masaKur(s, { temeller });
  const yer = { tur: 'temel' as const, no: TEMEL_TAKIMLARI.indexOf('kupa') };
  assert.ok(!birakilabilirMi(masa, yer, { tur: 'temel' }));
  const sonra = tasi(masa, yer, { tur: 'sutun', no: 0 });
  assert.ok(sonra);
  assert.equal(sonra.temeller[1].length, 6);
  assert.equal(sonra.sutunlar[0][1].deger, 7);
});

test('deste: 1 kart ve 3 kart çekme; bitince açılanlar sırası bozulmadan döner, sınırsız', () => {
  const deste = [k(1, 'maca', false), k(2, 'maca', false), k(3, 'maca', false), k(4, 'maca', false)];
  // Destenin üstü sonda: ilk çekilen 4, sonra 3, 2, 1
  const birli = cek(masaKur(bos(), { deste }));
  assert.ok(birli);
  assert.deepEqual(birli.acilan.map((x) => x.deger), [4]);
  assert.ok(birli.acilan[0].acik);
  const uclu = masaKur(bos(), { deste, cekme: 3 });
  const u1 = cek(uclu);
  assert.ok(u1);
  assert.deepEqual(u1.acilan.map((x) => x.deger), [4, 3, 2]); // en son açılan (2) en üstte
  const u2 = cek(u1);
  assert.ok(u2);
  assert.deepEqual(u2.acilan.map((x) => x.deger), [4, 3, 2, 1]); // kalan tek kart
  assert.equal(cekmeDurumu(u2), 'dondur');
  const u3 = cek(u2);
  assert.ok(u3);
  assert.deepEqual(u3.acilan, []);
  assert.deepEqual(u3.deste.map((x) => x.deger), [1, 2, 3, 4]); // eski sırasına döndü
  assert.ok(u3.deste.every((x) => !x.acik));
  assert.equal(u3.hamle, 3);
  // İkinci tur da aynı kartları verir (sınırsız dönüş)
  assert.deepEqual(cek(u3)!.acilan.map((x) => x.deger), [4, 3, 2]);
  assert.equal(cek(masaKur(bos())), null); // deste de açılan da boş
  assert.equal(cekmeDurumu(masaKur(bos())), 'bos');
});

test('deste: açılanın en üstteki kartı oynanır', () => {
  const s = bos();
  s[0] = [k(9, 'maca')];
  const masa = masaKur(s, { acilan: [k(8, 'sinek'), k(8, 'kupa')] });
  const sonra = tasi(masa, { tur: 'acilan' }, { tur: 'sutun', no: 0 });
  assert.ok(sonra);
  assert.equal(sonra.sutunlar[0][1].takim, 'kupa');
  assert.deepEqual(sonra.acilan.map((x) => x.takim), ['sinek']);
});

test('kazanma: 52 kart temelde', () => {
  const temeller = TEMEL_TAKIMLARI.map((t) => yigin(t, 13));
  assert.ok(kazandiMi(masaKur(bos(), { temeller })));
  const eksik = TEMEL_TAKIMLARI.map((t, i) => yigin(t, i === 0 ? 12 : 13));
  const s = bos();
  s[0] = [k(13, 'maca')];
  const masa = masaKur(s, { temeller: eksik });
  assert.ok(!kazandiMi(masa));
  const son = temeleGonder(masa, sutun(0, 0));
  assert.ok(son);
  assert.ok(kazandiMi(son));
});

test('geri al: taşıma, açılan kart, çekme ve deste dönüşü geri gelir; hamle artar', () => {
  const s = bos();
  s[0] = [k(4, 'kupa', false), k(9, 'kupa')];
  s[1] = [k(10, 'maca')];
  const m0 = masaKur(s, { deste: [k(1, 'maca', false)] });
  const m1 = tasi(m0, sutun(0, 1), { tur: 'sutun', no: 1 });
  assert.ok(m1);
  const m2 = cek(m1);
  assert.ok(m2);
  const m3 = cek(m2); // deste döner
  assert.ok(m3);
  const g1 = geriAl(m3, [m0, m1, m2]);
  assert.ok(g1);
  assert.deepEqual(g1.masa.acilan, m2.acilan);
  const g2 = geriAl(g1.masa, g1.gecmis);
  assert.ok(g2);
  assert.deepEqual(g2.masa.deste, m0.deste);
  const g3 = geriAl(g2.masa, g2.gecmis);
  assert.ok(g3);
  assert.deepEqual(g3.masa.sutunlar, m0.sutunlar);
  assert.equal(g3.masa.sutunlar[0][0].acik, false); // açılan kart yeniden kapalı
  assert.equal(g3.masa.hamle, 6); // üç hamle, üç geri alma
  assert.equal(geriAl(g3.masa, g3.gecmis), null);
});

test('ipucu: bulunan her hamle kurala uyar; sıra temel, kapalı kartı açan, öbürleri', () => {
  const s = bos();
  s[0] = [k(10, 'sinek')];
  s[1] = [k(5, 'kupa', false), k(9, 'kupa')]; // 9 kupa → 10 sinek, altında kapalı kart
  s[2] = [k(8, 'karo'), k(1, 'maca')]; // as temele
  s[3] = [k(13, 'maca'), k(12, 'kupa')]; // zaten dizili: önerilmez
  const masa = masaKur(s, { acilan: [k(8, 'sinek')] }); // 8 sinek → 9 kupa
  const liste = ipuclari(masa);
  for (const ip of liste) {
    assert.equal(ip.tur, 'tasi');
    if (ip.tur === 'tasi') assert.ok(tasi(masa, ip.yer, ip.hedef));
  }
  assert.deepEqual(liste[0], { tur: 'tasi', yer: sutun(2, 1), hedef: { tur: 'temel' } });
  assert.deepEqual(liste[1], { tur: 'tasi', yer: sutun(1, 1), hedef: { tur: 'sutun', no: 0 } });
  assert.deepEqual(liste[liste.length - 1], { tur: 'tasi', yer: { tur: 'acilan' }, hedef: { tur: 'sutun', no: 1 } });
  assert.ok(!liste.some((ip) => ip.tur === 'tasi' && ip.yer.tur === 'sutun' && ip.yer.no === 3));
});

test('ipucu: hamle yoksa desteden çek; hiçbir şey yoksa boş liste', () => {
  const s = bos();
  s[0] = [k(13, 'maca')]; // papaz boş sütuna taşınmaz
  s[1] = [k(5, 'kupa')];
  assert.deepEqual(ipuclari(masaKur(s, { deste: [k(9, 'karo', false)] })), [{ tur: 'cek' }]);
  assert.deepEqual(ipuclari(masaKur(s, { acilan: [k(9, 'karo')] })), [{ tur: 'cek' }]); // deste döner
  assert.deepEqual(ipuclari(masaKur(s)), []);
});
