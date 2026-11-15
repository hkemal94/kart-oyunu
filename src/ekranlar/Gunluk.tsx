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
  oncekiAyaGidilirMi,
  sonrakiAy,
  takvimHucreleri,
  TAKVIM_ILK_AY,
  tamamlananAylar,
  tarihOku,
  tarihtenBugun,
  tarihYaz,
  yildizEkle,
  yildizVarMi,
  type GunlukEl,
} from '../oyun/gunluk';
import type { SonSecim } from '../oyun/sonSecim';
import { ceyrekTamamMi, type PulDurumu } from '../pul/seri';
import { KoleksiyonKarti, KoleksiyonSayfasi, type PulYazilari } from '../pul/KoleksiyonSayfasi';

// Günlük mücadele ekranları (yol haritası 8; belge 8.1; Kemal, 15 Kasım). Kurallar
// src/oyun/gunluk.ts'te. Burada: tarih yazısı, kazanınca yıldız, Mücadeleler sekmesindeki takvim,
// ana ekrandaki günün kartı ve Ben → Ödüller → Pul koleksiyonu (pullar src/pul'da, oyundan bağımsız). Ay ve gün adları metin dosyasından,
// dile göre. Yıldız kodla çizilir; örnek oyunun kupası ve görseli kopyalanmaz.

const ayAdi = (ay: number) => m(`ay.${ay}` as MetinAnahtari);

// "15 Kasım 2026" / "November 15, 2026"
export function tarihYazisi(tarih: string, kisa = false): string {
  const { yil, ay, gun } = tarihOku(tarih);
  return kisa ? m('tarih.kisa', gun, ayAdi(ay)) : m('tarih.uzun', gun, ayAdi(ay), yil);
}

// Günlük el kazanılınca o güne yıldız konur (bir el bir kez). Oyun sonu kutusu için tarih,
// ayın tamamlanıp tamamlanmadığı (ayın pulu) ve çeyreğin tamamlanıp tamamlanmadığı (büyük pul) döner.
export interface GunlukSonucu {
  tarih: string;
  ayTamam: boolean;
  ceyrekTamam: boolean;
}

export function useGunlukYildiz(gunluk: GunlukEl | undefined, kazandi: boolean) {
  const [sonuc, setSonuc] = useState<GunlukSonucu | null>(null);
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
    const ceyrekTamam = s.ayTamam && ceyrekTamamMi(tamamlananAylar(s.kayit), gunluk.tarih.slice(0, 7));
    setSonuc({ tarih: tarihYazisi(gunluk.tarih, true), ayTamam: s.ayTamam, ceyrekTamam });
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
  const ilkAyda = !oncekiAyaGidilirMi(yil, ay); // Ocak 2026'dan geriye gidilmez (Kemal, 15 Kasım)
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
          <button
            className="takvim-ok"
            onClick={() => !ilkAyda && ayDegistir(oncekiAy(yil, ay))}
            disabled={ilkAyda}
            aria-label={m('gunluk.oncekiAy')}
          >
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
            {m('gunluk.ayTamam')} · {m('gunluk.ayinPulu')}
            {ceyrekTamamMi(tamamlananAylar(kayit), tarihYaz(yil, ay, 1).slice(0, 7)) && (
              <>
                <br />
                {m('gunluk.buyukPul')}
              </>
            )}
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
// Ben → Ödüller → Pul koleksiyonu (Kemal, 15 Kasım akşam; aylık rozetin yerine). Pullar ortak pul
// klasöründen (src/pul); bu oyuna özgü tek girdi kazanılan aylar: bütün günleri yıldızlanan aylar.
// Ayrı bir kayıt yok: eski aylık rozetler de bu listeden geldiği için hiçbiri kaybolmaz.
// Koleksiyon takvimle aynı yıldan başlar (Ocak 2026).

const durumYazisi = (d: PulDurumu) => m(d === 'kazanildi' ? 'pul.kazanildi' : d === 'eksik' ? 'pul.eksik' : 'pul.gelecek');
const ceyrekYazisi = (yil: number, ilk: number, son: number) => m('pul.ceyrek', ayAdi(ilk), ayAdi(son), yil);

function pulYazilari(): PulYazilari {
  return {
    yil: (yil) => m('pul.yil', yil),
    ceyrek: ceyrekYazisi,
    ayEtiketi: (yil, ay, d) => m('pul.ayEtiketi', ayAdi(ay), yil, durumYazisi(d)),
    buyukEtiketi: (yil, c, d) => m('pul.buyukEtiketi', ceyrekYazisi(yil, c * 3 - 2, c * 3), durumYazisi(d)),
    sayac: (a, b) => m('pul.sayac', a, b),
    bos: m('pul.bos'),
    not: m('pul.not'),
  };
}

const pulGirdisi = () => ({
  kazanilanAylar: tamamlananAylar(gunlukOku(localStorage)),
  bugun: tarihtenBugun(),
  ilkYil: TAKVIM_ILK_AY.yil,
  yazilar: pulYazilari(),
});

export const PulKoleksiyonuKarti = ({ ac }: { ac: () => void }) => (
  <KoleksiyonKarti baslik={m('ben.pullar')} ac={ac} {...pulGirdisi()} />
);

export const PulKoleksiyonu = () => <KoleksiyonSayfasi {...pulGirdisi()} />;
