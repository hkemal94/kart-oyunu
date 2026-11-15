import { useEffect, useRef, useState } from 'react';
import { m, type MetinAnahtari } from '../metinler';
import { YildizSimgesi } from './masaOrtak';
import {
  aydakiYildizlar,
  ayinGunSayisi,
  ayTamamMi,
  ayniElMi,
  gunDurumu,
  gunlukOku,
  gunlukYaz,
  gunlukYarimElOku,
  oncekiAy,
  sonrakiAy,
  takvimHucreleri,
  tamamlananAylar,
  tarihOku,
  tarihtenBugun,
  tarihYaz,
  yildizEkle,
  yildizVarMi,
  type GunlukEl,
} from '../oyun/gunluk';
import type { SonSecim } from '../oyun/sonSecim';

// Günlük mücadele ekranları (yol haritası 8; belge 8.1; Kemal, 15 Kasım). Kurallar
// src/oyun/gunluk.ts'te. Burada: tarih yazısı, kazanınca yıldız, Mücadeleler sekmesindeki takvim,
// ana ekrandaki günün kartı ve Ben → Ödüller → Aylık ödüller. Ay ve gün adları metin dosyasından,
// dile göre. Yıldız kodla çizilir; örnek oyunun kupası ve görseli kopyalanmaz.

const ayAdi = (ay: number) => m(`ay.${ay}` as MetinAnahtari);

// "15 Kasım 2026" / "November 15, 2026"
export function tarihYazisi(tarih: string, kisa = false): string {
  const { yil, ay, gun } = tarihOku(tarih);
  return kisa ? m('tarih.kisa', gun, ayAdi(ay)) : m('tarih.uzun', gun, ayAdi(ay), yil);
}

// Günlük el kazanılınca o güne yıldız konur (bir el bir kez). Oyun sonu kutusu için tarih ve
// ayın tamamlanıp tamamlanmadığı döner.
export function useGunlukYildiz(gunluk: GunlukEl | undefined, kazandi: boolean) {
  const [sonuc, setSonuc] = useState<{ tarih: string; ayTamam: boolean } | null>(null);
  const yazildi = useRef(false);
  useEffect(() => {
    if (!gunluk) return;
    if (!kazandi) {
      // Yeni el (aynı günün eli baştan): bir sonraki kazanç yeniden sayılır
      yazildi.current = false;
      setSonuc(null);
      return;
    }
    if (yazildi.current) return;
    yazildi.current = true;
    const s = yildizEkle(gunlukOku(localStorage), gunluk.tarih, tarihtenBugun());
    if (s.yeniYildiz) gunlukYaz(localStorage, s.kayit);
    setSonuc({ tarih: tarihYazisi(gunluk.tarih, true), ayTamam: s.ayTamam });
  }, [kazandi]);
  return sonuc;
}

const ZORLUKLAR: Record<GunlukEl['oyun'], number[]> = { spider: [1, 2, 4], klasik: [1, 3] };
export const zorlukSec = (s: SonSecim) => (s.oyun === 'spider' ? s.renk : s.cekme);

// ---------------------------------------------------------------------------------------------
// Mücadeleler sekmesi: ayın adı ve yıldız sayısı, Pazartesi'den başlayan takvim, önceki aylara
// ok; altta seçili günün oyunu, zorluğu ve "Oyna". Kartpostal etkinliği (9. paket) "Yakında".

interface TakvimOzellik {
  gorulenAy: { yil: number; ay: number };
  ayDegistir: (a: { yil: number; ay: number }) => void;
  seciliGun: string;
  gunSec: (tarih: string) => void;
  secim: SonSecim; // günlük mücadelenin son oyun ve zorluk seçimi
  secimDegistir: (s: Partial<SonSecim>) => void;
  oyna: (el: GunlukEl) => void;
}

export function Mucadeleler({ gorulenAy, ayDegistir, seciliGun, gunSec, secim, secimDegistir, oyna }: TakvimOzellik) {
  const bugun = tarihtenBugun();
  const kayit = gunlukOku(localStorage);
  const yarim = gunlukYarimElOku(localStorage);
  const { yil, ay } = gorulenAy;
  const bu = tarihOku(bugun);
  const sonAyda = yil > bu.yil || (yil === bu.yil && ay >= bu.ay);
  const durum = gunDurumu(seciliGun, bugun);
  const zorluk = zorlukSec(secim);
  const el: GunlukEl = { tarih: seciliGun, oyun: secim.oyun, zorluk };
  const devamMi = !!yarim && ayniElMi(yarim, el);
  const kazanildi = yildizVarMi(kayit, seciliGun);

  const zorlukDegistir = (z: number) =>
    secimDegistir(secim.oyun === 'spider' ? { renk: z as SonSecim['renk'] } : { cekme: z as SonSecim['cekme'] });

  return (
    <main className="sekme-ekrani mucadeleler">
      <h1 className="sekme-baslik">{m('mucadele.baslik')}</h1>

      <section className="takvim">
        <header className="takvim-ust">
          <button className="takvim-ok" onClick={() => ayDegistir(oncekiAy(yil, ay))} aria-label={m('gunluk.oncekiAy')}>
            <svg className="simge" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3.5 5.5 8 10 12.5" />
            </svg>
          </button>
          <div className="takvim-baslik">
            <strong>{m('takvim.ay', ayAdi(ay), yil)}</strong>
            <span>
              <YildizSimgesi />
              {m('gunluk.yildizSayisi', aydakiYildizlar(kayit, yil, ay), ayinGunSayisi(yil, ay))}
            </span>
          </div>
          <button
            className="takvim-ok"
            onClick={() => ayDegistir(sonrakiAy(yil, ay))}
            disabled={sonAyda}
            aria-label={m('gunluk.sonrakiAy')}
          >
            <svg className="simge" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M6 3.5 10.5 8 6 12.5" />
            </svg>
          </button>
        </header>

        <div className="takvim-izgara" role="grid">
          {[1, 2, 3, 4, 5, 6, 7].map((g) => (
            <span key={`g${g}`} className="takvim-gun-adi">
              {m(`gunKisa.${g}` as MetinAnahtari)}
            </span>
          ))}
          {takvimHucreleri(yil, ay).map((gun, i) => {
            if (gun === null) return <span key={`b${i}`} className="takvim-bos" />;
            const tarih = tarihYaz(yil, ay, gun);
            const d = gunDurumu(tarih, bugun);
            const yildiz = yildizVarMi(kayit, tarih);
            const sinif = ['takvim-gun', d, yildiz ? 'yildizli' : '', tarih === seciliGun ? 'secili' : '', yarim?.tarih === tarih ? 'yarim' : '']
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={tarih}
                className={sinif}
                disabled={d === 'gelecek'}
                onClick={() => gunSec(tarih)}
                aria-label={tarihYazisi(tarih)}
                aria-pressed={tarih === seciliGun}
              >
                {yildiz ? <YildizSimgesi /> : <span>{gun}</span>}
              </button>
            );
          })}
        </div>
        {ayTamamMi(kayit, yil, ay) && (
          <p className="takvim-odul">
            {m('gunluk.ayTamam')} · {m('gunluk.ayinOdulu')}
          </p>
        )}
      </section>

      <section className="gunluk-secim">
        <header className="gunluk-secim-ust">
          <strong>{tarihYazisi(seciliGun)}</strong>
          {durum === 'bugun' && <small className="rozet-acik">{m('gunluk.bugun')}</small>}
          {kazanildi && (
            <small className="rozet-acik">
              <YildizSimgesi />
              {m('gunluk.kazanildi')}
            </small>
          )}
          {!kazanildi && yarim?.tarih === seciliGun && <small className="rozet-acik">{m('gunluk.yarim')}</small>}
        </header>
        {durum === 'gelecek' ? (
          <p className="gunluk-kilitli">{m('gunluk.kilitli')}</p>
        ) : (
          <>
            <div className="secenekler">
              {(['spider', 'klasik'] as const).map((o) => (
                <button key={o} className={o === secim.oyun ? 'secili' : ''} onClick={() => secimDegistir({ oyun: o })}>
                  {m(o === 'spider' ? 'secim.spider' : 'secim.klasik')}
                </button>
              ))}
            </div>
            <div className="secenekler">
              {ZORLUKLAR[secim.oyun].map((z) => (
                <button key={z} className={z === zorluk ? 'secili' : ''} onClick={() => zorlukDegistir(z)}>
                  {m(secim.oyun === 'spider' ? 'secim.renk' : 'secim.cekme', z)}
                </button>
              ))}
            </div>
            <button className="dugme ana genis" onClick={() => oyna(el)}>
              {m(devamMi ? 'gunluk.devam' : kazanildi ? 'gunluk.yenidenOyna' : 'gunluk.oyna')}
            </button>
          </>
        )}
      </section>

      <div className="ana-kart kapali gunluk-etkinlik" aria-disabled="true">
        <span className="ana-kart-ad">{m('ana.etkinlik')}</span>
        <small>{m('ana.yakinda')}</small>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------------------------
// Ana ekrandaki günün kartı: bugünün tarihi ve "Oyna"; bugün kazanıldıysa yıldız ve "Takvim".

export function GununKarti({ oyna, takvim }: { oyna: () => void; takvim: () => void }) {
  const bugun = tarihtenBugun();
  const kazanildi = yildizVarMi(gunlukOku(localStorage), bugun);
  return (
    <button className={`ana-kart gunluk-kart ${kazanildi ? 'kazanildi' : ''}`} onClick={kazanildi ? takvim : oyna}>
      <span className="ana-kart-ad">{m('ana.gunluk')}</span>
      <span className="gunluk-kart-tarih">
        {kazanildi && <YildizSimgesi />}
        {tarihYazisi(bugun, true)}
      </span>
      <small>{m(kazanildi ? 'ana.gunlukTakvim' : 'gunluk.oyna')}</small>
    </button>
  );
}

// ---------------------------------------------------------------------------------------------
// Ben → Ödüller → Aylık ödüller: bütün günleri yıldızlanan her ay için bir rozet. Ödülün görseli
// Kemal'in seçimini bekliyor (18 aday, Onay bekleyenler); o zamana kadar yer tutucu.

export function AylikOduller() {
  const aylar = tamamlananAylar(gunlukOku(localStorage));
  if (aylar.length === 0) return <small>{m('ben.aylikBos')}</small>;
  return (
    <div className="aylik-oduller">
      {aylar.map((a) => {
        const [yil, ay] = a.split('-').map(Number);
        return (
          <span key={a} className="aylik-rozet">
            <YildizSimgesi />
            <b>{m('takvim.ay', ayAdi(ay), yil)}</b>
            <small>{m('gunluk.ayinOdulu')}</small>
          </span>
        );
      })}
    </div>
  );
}
