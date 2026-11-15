// Kart hareketlerinin süreleri (Kemal'in telefon yorumları, 15 Kasım). Sayılar ayar dosyasında
// (src/oyun/ayarlar.json → hareket), hepsi öneri. Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adimSuresi, AKIS_ADIMI, DAGITIM_ADIMI, DIZI_KART_SAYISI, HAREKET, SPIDER_ILK_DAGITIM, toplamSure } from '../src/kart/hareket.ts';
import kkm from '../src/oyun/ayarlar.json' with { type: 'json' };

test('süreler KKM ayar dosyasından okunur', () => {
  const h = (kkm.bolumler as Record<string, { ayarlar: Record<string, { deger: number }> }>).hareket.ayarlar;
  for (const k of Object.keys(HAREKET) as (keyof typeof HAREKET)[]) assert.equal(HAREKET[k], h[k].deger, k);
});

test('Spider açılış dağıtımı teker teker ve toplamı ayardaki süre (öneri 1,5-2 saniye)', () => {
  assert.ok(DAGITIM_ADIMI > 0);
  const toplam = toplamSure(SPIDER_ILK_DAGITIM, DAGITIM_ADIMI, HAREKET.ucus);
  assert.ok(Math.abs(toplam - HAREKET.dagitim) < 1e-6);
  assert.ok(toplam >= 1500 && toplam <= 2000, `${toplam}`);
  // "Dağıt"taki on kart aynı hızla, toplam kısa
  assert.ok(toplamSure(10, DAGITIM_ADIMI, HAREKET.ucus) < 800);
});

test('tamamlanan sıranın akışı 13 kart teker teker, toplam öneri 0,6-0,8 saniye', () => {
  const toplam = toplamSure(DIZI_KART_SAYISI, AKIS_ADIMI, HAREKET.akisUcusu);
  assert.ok(AKIS_ADIMI > 0);
  assert.ok(toplam >= 600 && toplam <= 800, `${toplam}`);
});

test('adım süresi: tek kartta bekleme yok; toplam uçuştan kısaysa hepsi birlikte', () => {
  assert.equal(adimSuresi(1, 1000, 200), 0);
  assert.equal(adimSuresi(5, 100, 200), 0);
  assert.equal(adimSuresi(3, 600, 200), 200);
});
