// Kemal'in telefon yorumlarının (15 Kasım) kural testleri: çift dokunuşta kartın gideceği yer ve
// "oynanabilir" kartlar (oynanamayan açık kartlar ekranda koyulaşır). Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Kart, Takim } from '../src/kart/kart.ts';
import * as spider from '../src/kart/spider.ts';
import * as klondike from '../src/kart/klondike.ts';

let sayac = 0;
const k = (deger: number, takim: Takim = 'maca', acik = true): Kart => ({ id: `k${sayac++}`, takim, deger, acik });
const spiderMasa = (sutunlar: Kart[][], ek: Partial<spider.SpiderMasasi> = {}): spider.SpiderMasasi => {
  const tam = [...sutunlar];
  while (tam.length < 10) tam.push([k(1, 'sinek', false), k(13, 'karo')]); // dolgu: başka yere gitmeyen papaz
  return { sutunlar: tam, deste: [], tamamlanan: [], hamle: 0, ...ek };
};
const klondikeMasa = (sutunlar: Kart[][], ek: Partial<klondike.KlondikeMasasi> = {}): klondike.KlondikeMasasi => {
  const tam = [...sutunlar];
  while (tam.length < 7) tam.push([k(2, 'sinek', false), k(13, 'karo')]); // dolgu: boş sütun yok
  return { sutunlar: tam, temeller: klondike.TEMEL_TAKIMLARI.map(() => []), deste: [], acilan: [], cekme: 1, hamle: 0, ...ek };
};

// --- Spider: çift dokunuş -------------------------------------------------------------------

test('Spider çift dokunuş: aynı takımın bir büyüğü, başka takımın bir büyüğünden önce gelir', () => {
  const yedi = k(7, 'kupa');
  const masa = spiderMasa([[k(8, 'maca')], [k(5, 'karo', false), yedi], [k(8, 'kupa')]]);
  assert.equal(spider.ciftDokunusHedefi(masa, 1, 1), 2);
});

test('Spider çift dokunuş: aynı takım yoksa başka takımın bir büyüğü, boş sütundan önce', () => {
  const masa = spiderMasa([[], [k(5, 'karo', false), k(7, 'kupa')], [k(8, 'maca')]]);
  assert.equal(spider.ciftDokunusHedefi(masa, 1, 1), 2);
});

test('Spider çift dokunuş: başka yer yoksa boş sütun; yer yoksa null', () => {
  const masa = spiderMasa([[k(3, 'karo', false), k(7, 'kupa')], []]);
  assert.equal(spider.ciftDokunusHedefi(masa, 0, 1), 1);
  const yerYok = spiderMasa([[k(3, 'karo', false), k(7, 'kupa')]]);
  assert.equal(spider.ciftDokunusHedefi(yerYok, 0, 1), null);
});

test('Spider çift dokunuş: dizinin en üst kartından bütün dizi gider; sütunun tamamı boş sütuna gitmez', () => {
  const masa = spiderMasa([[k(9, 'maca'), k(8, 'maca'), k(7, 'maca')], [k(10, 'kupa')], []]);
  assert.equal(spider.ciftDokunusHedefi(masa, 0, 0), 1); // boş sütun değil, 10'un altı
  const yalniz = spiderMasa([[k(9, 'maca'), k(8, 'maca')], []]);
  assert.equal(spider.ciftDokunusHedefi(yalniz, 0, 0), null); // sütunu boş sütuna taşımak bir şey değiştirmez
  // Sıralı olmayan dizi taşınamaz
  const bozuk = spiderMasa([[k(9, 'maca'), k(8, 'kupa')], [k(10, 'kupa')]]);
  assert.equal(spider.ciftDokunusHedefi(bozuk, 0, 0), null);
});

test('Spider çift dokunuş hamle sayılır ve geri alınabilir', () => {
  const masa = spiderMasa([[k(3, 'karo', false), k(7, 'kupa')], [k(8, 'kupa')]]);
  const hedef = spider.ciftDokunusHedefi(masa, 0, 1)!;
  const yeni = spider.tasi(masa, 0, 1, hedef)!;
  assert.equal(yeni.hamle, 1);
  const geri = spider.geriAl(yeni, [masa])!;
  assert.deepEqual(geri.masa.sutunlar, masa.sutunlar);
});

// --- Spider: oynanabilir kartlar ------------------------------------------------------------

test('Spider oynanabilir: gidebilen kart oynanır, gidemeyen açık kart oynanmaz, kapalı kart listede yok', () => {
  const gider = k(7, 'kupa');
  const gidemez = k(4, 'maca');
  const kapali = k(2, 'kupa', false);
  const masa = spiderMasa([[kapali, gider], [k(8, 'maca')], [gidemez]]);
  const o = spider.oynanabilirKartlar(masa);
  assert.ok(o.has(gider.id));
  assert.ok(!o.has(gidemez.id));
  assert.ok(!o.has(kapali.id));
});

test('Spider oynanabilir: başka bir kartın altında kalıp taşınamayan kart oynanmaz', () => {
  const alttaki = k(9, 'kupa'); // üstünde başka takımdan kart var: birlikte taşınamaz
  const ustteki = k(8, 'maca');
  const masa = spiderMasa([[alttaki, ustteki], [k(10, 'maca')]]);
  const o = spider.oynanabilirKartlar(masa);
  assert.ok(!o.has(alttaki.id)); // 10'un altına gidebilirdi ama üstündeki kart yüzünden taşınamaz
  assert.ok(!o.has(ustteki.id)); // 8'in gidebileceği 9 yok
});

test('Spider oynanabilir: dizi gidebiliyorsa dizinin bütün kartları oynanır; boş sütun varken her taşınabilir dizi', () => {
  const dokuz = k(9, 'maca');
  const sekiz = k(8, 'maca');
  const masa = spiderMasa([[k(1, 'kupa', false), dokuz, sekiz], [k(10, 'kupa')]]);
  const o = spider.oynanabilirKartlar(masa);
  assert.ok(o.has(dokuz.id) && o.has(sekiz.id));
  const tek = k(4, 'maca');
  const bosVar = spiderMasa([[k(1, 'kupa', false), tek], []]);
  assert.ok(spider.oynanabilirKartlar(bosVar).has(tek.id));
});

test('Spider: toparlanmadan önceki hâlde tamamlanan dizi henüz masada, sonra kalkar', () => {
  const dizi = Array.from({ length: 12 }, (_, i) => k(13 - i, 'maca')); // papazdan ikiliye
  const as = k(1, 'maca');
  const masa = spiderMasa([[k(5, 'kupa', false), ...dizi], [as]]);
  const ara = spider.tasiToparlamadan(masa, 1, 0, 0)!;
  assert.equal(ara.sutunlar[0].length, 14);
  assert.equal(ara.tamamlanan.length, 0);
  const son = spider.tasi(masa, 1, 0, 0)!;
  assert.equal(son.tamamlanan.length, 1);
  assert.equal(son.sutunlar[0].length, 1);
  assert.ok(son.sutunlar[0][0].acik); // altta kalan kapalı kart açıldı
});

// --- Klasik solitaire: çift dokunuş ---------------------------------------------------------

test('Klasik çift dokunuş: önce temel yığın', () => {
  const as = k(1, 'kupa');
  const masa = klondikeMasa([[as], [k(2, 'maca')]]);
  assert.deepEqual(klondike.ciftDokunusHedefi(masa, { tur: 'sutun', no: 0, sira: 0 }), { tur: 'temel' });
});

test('Klasik çift dokunuş: temele gidemiyorsa uygun sütun; dolu sütun boş sütundan önce', () => {
  const papaz = k(13, 'kupa');
  const vale = k(11, 'kupa');
  const masa = klondikeMasa([[k(3, 'maca', false), vale], [k(12, 'maca')], [], [k(4, 'sinek', false), papaz]]);
  assert.deepEqual(klondike.ciftDokunusHedefi(masa, { tur: 'sutun', no: 0, sira: 1 }), { tur: 'sutun', no: 1 });
  assert.deepEqual(klondike.ciftDokunusHedefi(masa, { tur: 'sutun', no: 3, sira: 1 }), { tur: 'sutun', no: 2 });
});

test('Klasik çift dokunuş: açılan kart da gider; gidecek yer yoksa null', () => {
  const dort = k(4, 'maca');
  const masa = klondikeMasa([[k(5, 'kupa')]], { acilan: [dort] });
  assert.deepEqual(klondike.ciftDokunusHedefi(masa, { tur: 'acilan' }), { tur: 'sutun', no: 0 });
  const yerYok = klondikeMasa([[k(9, 'kupa')]], { acilan: [k(4, 'maca')] });
  assert.equal(klondike.ciftDokunusHedefi(yerYok, { tur: 'acilan' }), null);
});

// --- Klasik solitaire: oynanabilir kartlar --------------------------------------------------

test('Klasik oynanabilir: temele ya da sütuna gidebilen oynanır; altta kalan ve gidemeyen oynanmaz', () => {
  const as = k(1, 'karo');
  const gidemez = k(9, 'maca');
  const dizininBasi = k(6, 'kupa');
  const dizininUstu = k(5, 'maca');
  const kapali = k(3, 'sinek', false);
  const masa = klondikeMasa([[as], [gidemez], [kapali, dizininBasi, dizininUstu], [k(7, 'sinek')]]);
  const o = klondike.oynanabilirKartlar(masa);
  assert.ok(o.has(as.id)); // temele
  assert.ok(!o.has(gidemez.id));
  assert.ok(o.has(dizininBasi.id) && o.has(dizininUstu.id)); // 6-5 dizisi 7'nin altına
  assert.ok(!o.has(kapali.id));
});

test('Klasik oynanabilir: açılanlarda yalnız en üstteki alınabilir; deste listede yok', () => {
  const alttaki = k(1, 'kupa'); // temele gidebilirdi ama üstünde başka kart var
  const ustteki = k(1, 'maca');
  const masa = klondikeMasa([], { acilan: [alttaki, ustteki], deste: [k(5, 'karo', false)] });
  const o = klondike.oynanabilirKartlar(masa);
  assert.ok(o.has(ustteki.id));
  assert.ok(!o.has(alttaki.id));
  assert.equal(o.size, 1);
});

// --- Koyulaşma: en öndeki kart koyu olmaz (Kemal, 15 Kasım gece) -----------------------------

test('Spider koyulaşma: en öndeki kart oynanamasa da koyu olmaz; arkadaki oynanamayan açık kart koyu', () => {
  const alttaki = k(9, 'kupa');
  const ustteki = k(8, 'maca'); // oynanamaz ama en önde
  const kapali = k(2, 'karo', false);
  const masa = spiderMasa([[kapali, alttaki, ustteki], [k(10, 'maca')]]);
  const koyu = spider.koyulasacakKartlar(masa);
  assert.ok(!spider.oynanabilirKartlar(masa).has(ustteki.id));
  assert.ok(!koyu.has(ustteki.id));
  assert.ok(koyu.has(alttaki.id));
  assert.ok(!koyu.has(kapali.id));
  // Tek açık kartı olan, hiçbir yere gidemeyen sütun: kart en önde, koyu değil
  const tek = k(4, 'maca');
  assert.ok(!spider.koyulasacakKartlar(spiderMasa([[tek]])).has(tek.id));
});

test('Klasik koyulaşma: sütunun, açılanların ve temelin en öndeki kartı koyu olmaz', () => {
  const alttaki = k(9, 'kupa');
  const ustteki = k(3, 'maca'); // oynanamaz ama en önde
  const acilanAlt = k(12, 'sinek');
  const acilanUst = k(12, 'karo'); // gidecek yer yok ama en önde
  const masa = klondikeMasa([[k(2, 'karo', false), alttaki, ustteki]], { acilan: [acilanAlt, acilanUst] });
  const koyu = klondike.koyulasacakKartlar(masa);
  assert.ok(!klondike.oynanabilirKartlar(masa).has(ustteki.id));
  assert.ok(!koyu.has(ustteki.id));
  assert.ok(koyu.has(alttaki.id));
  assert.ok(!koyu.has(acilanUst.id));
  assert.ok(koyu.has(acilanAlt.id));
  // Dolgu sütunlarının tek açık papazları da en önde: koyu değil
  for (const s of masa.sutunlar) assert.ok(!koyu.has(s[s.length - 1].id));
});
