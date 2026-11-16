// Günlük mücadelenin testleri (yol haritası 8; belge 8.1). Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  aydakiYildizlar,
  ayinGunSayisi,
  ayTamamMi,
  bosGunluk,
  gunDurumu,
  gunlukOku,
  gunlukRastgele,
  gunlukYarimElOku,
  gunlukYarimElSil,
  gunlukYarimElYaz,
  gunlukYaz,
  oncekiAy,
  oncekiAyaGidilirMi,
  oynanabilirMi,
  takvimAyi,
  TAKVIM_ILK_AY,
  takvimHucreleri,
  tamamlananAylar,
  tarihtenBugun,
  tarihYaz,
  yildizEkle,
  yildizVarMi,
  type GunlukEl,
} from '../src/oyun/gunluk.ts';
import { yarimElOku, type Depo, type YarimEl } from '../src/oyun/yarimEl.ts';
import { spiderDagit, tasi } from '../src/kart/spider.ts';
import { klondikeDagit } from '../src/kart/klondike.ts';
import { bosKayit, elKazanildi, puanAnahtari, seriBitir, seriOku, type ElOzeti } from '../src/kart/puan.ts';

const bellek = (): Depo & { veri: Map<string, string> } => {
  const veri = new Map<string, string>();
  return { veri, getItem: (k) => veri.get(k) ?? null, setItem: (k, v) => void veri.set(k, v), removeItem: (k) => void veri.delete(k) };
};

const dizilis = (m: { sutunlar: { id: string }[][]; deste: { id: string }[] }) =>
  JSON.stringify([m.sutunlar.map((s) => s.map((k) => k.id)), m.deste.map((k) => k.id)]);

const spiderGunu = (el: GunlukEl) => spiderDagit(el.zorluk as 1 | 2 | 4, gunlukRastgele(el));

test('aynı tarih, oyun ve zorluk aynı dağıtımı verir', () => {
  const el: GunlukEl = { tarih: '2026-11-15', oyun: 'spider', zorluk: 2 };
  assert.equal(dizilis(spiderGunu(el)), dizilis(spiderGunu({ ...el })));
  const k: GunlukEl = { tarih: '2026-11-15', oyun: 'klasik', zorluk: 3 };
  assert.equal(dizilis(klondikeDagit(3, gunlukRastgele(k))), dizilis(klondikeDagit(3, gunlukRastgele({ ...k }))));
});

test('farklı tarih, oyun ya da zorluk farklı dağıtım verir', () => {
  const el: GunlukEl = { tarih: '2026-11-15', oyun: 'spider', zorluk: 2 };
  const bugun = dizilis(spiderGunu(el));
  assert.notEqual(bugun, dizilis(spiderGunu({ ...el, tarih: '2026-11-16' })));
  assert.notEqual(bugun, dizilis(spiderGunu({ ...el, tarih: '2025-11-15' })));
  // Aynı gün başka zorluk: 4 renkte takımlar da farklı olduğundan karşılaştırma kart sırasıyla
  const k1 = klondikeDagit(1, gunlukRastgele({ tarih: '2026-11-15', oyun: 'klasik', zorluk: 1 }));
  const k3 = klondikeDagit(1, gunlukRastgele({ tarih: '2026-11-15', oyun: 'klasik', zorluk: 3 }));
  assert.notEqual(dizilis(k1), dizilis(k3));
  // Otuz günün hepsi birbirinden farklı
  const gunler = new Set(Array.from({ length: 30 }, (_, i) => dizilis(spiderGunu({ ...el, tarih: tarihYaz(2026, 11, i + 1) }))));
  assert.equal(gunler.size, 30);
});

test('yıldız saklanır ve yeniden okunur', () => {
  const depo = bellek();
  assert.deepEqual(gunlukOku(depo), bosGunluk());
  const s = yildizEkle(gunlukOku(depo), '2026-11-14', '2026-11-15');
  assert.equal(s.yeniYildiz, true);
  gunlukYaz(depo, s.kayit);
  const okunan = gunlukOku(depo);
  assert.equal(yildizVarMi(okunan, '2026-11-14'), true);
  assert.equal(yildizVarMi(okunan, '2026-11-15'), false);
  // Aynı gün ikinci kez kazanılınca yeni yıldız yok, kayıt değişmez
  const ikinci = yildizEkle(okunan, '2026-11-14', '2026-11-15');
  assert.equal(ikinci.yeniYildiz, false);
  assert.equal(ikinci.kayit.yildizlar.length, 1);
  // Bozuk kayıt yok sayılır
  depo.setItem('kartOyunu.gunluk', '{bozuk');
  assert.deepEqual(gunlukOku(depo), bosGunluk());
  depo.setItem('kartOyunu.gunluk', JSON.stringify({ yildizlar: ['2026-11-02', 5, 'dun', '2026-11-02'] }));
  assert.deepEqual(gunlukOku(depo).yildizlar, ['2026-11-02']);
});

test('geçmiş gün oynanır ve yıldız alır, gelecek gün kilitli', () => {
  const bugun = '2026-11-15';
  assert.equal(gunDurumu('2026-11-15', bugun), 'bugun');
  assert.equal(gunDurumu('2026-10-31', bugun), 'gecmis');
  assert.equal(gunDurumu('2026-11-16', bugun), 'gelecek');
  assert.equal(oynanabilirMi('2026-11-01', bugun), true);
  assert.equal(oynanabilirMi('2025-12-31', bugun), true);
  assert.equal(oynanabilirMi(bugun, bugun), true);
  assert.equal(oynanabilirMi('2026-11-16', bugun), false);
  assert.equal(oynanabilirMi('2027-01-01', bugun), false);
  assert.equal(yildizEkle(bosGunluk(), '2026-11-03', bugun).yeniYildiz, true);
  const gelecek = yildizEkle(bosGunluk(), '2026-11-20', bugun);
  assert.equal(gelecek.yeniYildiz, false);
  assert.deepEqual(gelecek.kayit.yildizlar, []);
});

test('ayın bütün günleri yıldızlanınca ödül gelir', () => {
  const bugun = '2026-12-05';
  let k = bosGunluk();
  const gun = ayinGunSayisi(2026, 11);
  assert.equal(gun, 30);
  let son = null as ReturnType<typeof yildizEkle> | null;
  for (let g = gun; g >= 1; g--) {
    son = yildizEkle(k, tarihYaz(2026, 11, g), bugun);
    k = son.kayit;
    if (g > 1) assert.equal(son.ayTamam, false);
  }
  assert.equal(son?.ayTamam, true);
  assert.equal(ayTamamMi(k, 2026, 11), true);
  assert.equal(aydakiYildizlar(k, 2026, 11), 30);
  assert.deepEqual(tamamlananAylar(k), ['2026-11']);
  // Bir gün eksikse ödül yok
  const eksik = { yildizlar: k.yildizlar.filter((t) => t !== '2026-11-17') };
  assert.equal(ayTamamMi(eksik, 2026, 11), false);
  assert.deepEqual(tamamlananAylar(eksik), []);
  // Şubat 28 gün
  assert.equal(ayinGunSayisi(2027, 2), 28);
  assert.equal(ayinGunSayisi(2028, 2), 29);
});

test('takvim Pazartesi’den başlar', () => {
  // 1 Kasım 2026 Pazar: önünde altı boş hücre
  const h = takvimHucreleri(2026, 11);
  assert.deepEqual(h.slice(0, 7), [null, null, null, null, null, null, 1]);
  assert.equal(h.length % 7, 0);
  assert.equal(h.filter((g) => g !== null).length, 30);
  // 1 Haziran 2026 Pazartesi: boş hücre yok
  assert.equal(takvimHucreleri(2026, 6)[0], 1);
  assert.deepEqual(oncekiAy(2026, 1), { yil: 2025, ay: 12 });
  assert.equal(tarihtenBugun(new Date(2026, 10, 5, 23, 59)), '2026-11-05');
});

test('günlük yarım el normal yarım elle karışmaz', () => {
  const depo = bellek();
  const masa = spiderDagit(1, gunlukRastgele({ tarih: '2026-11-14', oyun: 'spider', zorluk: 1 }));
  const oynanmis = tasi(masa, 0, masa.sutunlar[0].length - 1, 1) ?? { ...masa, hamle: 1 };
  const el = { oyun: 'spider', zorluk: 1, masa: { ...oynanmis, hamle: Math.max(1, oynanmis.hamle) }, saniye: 30, hak: { elBasi: 3, kalan: 3 } } as YarimEl;
  gunlukYarimElYaz(depo, '2026-11-14', el);
  assert.equal(yarimElOku(depo), null); // normal "Oyuna devam et" bunu görmez
  const okunan = gunlukYarimElOku(depo);
  assert.equal(okunan?.tarih, '2026-11-14');
  assert.equal(okunan?.el.oyun, 'spider');
  gunlukYarimElSil(depo);
  assert.equal(gunlukYarimElOku(depo), null);
});

test('günlük el seriye sayılır: kazanınca aşama artar, bırakınca seri biter', () => {
  // Günlük elin puan anahtarı normal elinkiyle aynıdır (oyun ve zorluk); aynı seri sürer
  const anahtar = puanAnahtari('spider', 2);
  const ozet: ElOzeti = { hamle: 200, saniye: 900 };
  let k = bosKayit();
  k = elKazanildi(k, anahtar, ozet).kayit; // normal el
  assert.equal(seriOku(k, anahtar).asama, 2);
  const gunlukKazanc = elKazanildi(k, anahtar, ozet); // günlük el
  k = gunlukKazanc.kayit;
  assert.equal(gunlukKazanc.yeniAsama, 3);
  assert.equal(seriOku(k, anahtar).puan, 1150 + 2300);
  k = seriBitir(k, anahtar); // günlük el bırakıldı
  assert.deepEqual(seriOku(k, anahtar), { puan: 0, asama: 1 });
});

test('takvim en çok Ocak 2026\'ya kadar geri gider (Kemal, 15 Kasım)', () => {
  assert.deepEqual(TAKVIM_ILK_AY, { yil: 2026, ay: 1 });
  assert.equal(oncekiAyaGidilirMi(2026, 1), false); // Ocak 2026'da geri ok kapalı
  assert.equal(oncekiAyaGidilirMi(2026, 2), true);
  assert.equal(oncekiAyaGidilirMi(2026, 11), true);
  assert.equal(oncekiAyaGidilirMi(2027, 1), true); // Ocak 2027'den Aralık 2026'ya gidilir
  assert.equal(oncekiAyaGidilirMi(2025, 12), false);
  // Kasım 2026'dan geri geri gidilince Ocak 2026'da durulur
  let ay = { yil: 2026, ay: 11 };
  let adim = 0;
  while (oncekiAyaGidilirMi(ay.yil, ay.ay)) {
    ay = oncekiAy(ay.yil, ay.ay);
    adim++;
  }
  assert.deepEqual(ay, { yil: 2026, ay: 1 });
  assert.equal(adim, 10);
  // Sınırın gerisindeki ay sınıra çekilir
  assert.deepEqual(takvimAyi(2025, 12), { yil: 2026, ay: 1 });
  assert.deepEqual(takvimAyi(2026, 3), { yil: 2026, ay: 3 });
});
