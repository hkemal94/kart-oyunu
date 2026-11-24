import { m, seciliDil, type MetinAnahtari } from '../metinler';
import { DESTELER, DILLER, type OyuncuAyarlari } from '../oyun/oyuncuAyarlari';

// Ayarlar (yol haritası 5; belge 2, "Ayarlar"). Oyun seçiminden ve masadaki küçük düğmeden açılır;
// masanın üstüne gelir, kapanınca el kaldığı yerden sürer. Değişiklik anında geçerli olur ve
// telefonun tarayıcısında saklanır (src/oyun/oyuncuAyarlari.ts). Ses ve titreşim ses paketiyle
// (12. paket) çalışacak; anahtarları şimdiden duruyor, yanında "ses paketi gelince" yazıyor.

type Anahtar = 'ses' | 'mahalleSesi' | 'titresim' | 'solEl' | 'sayaclariGizle' | 'puaniGoster' | 'koyulastir';

interface Ozellik {
  ayarlar: OyuncuAyarlari;
  degistir: (yeni: Partial<OyuncuAyarlari>) => void;
  kapat: () => void;
}

export function Ayarlar({ ayarlar, degistir, kapat }: Ozellik) {
  const satir = (anahtar: Anahtar, aciklama?: MetinAnahtari) => {
    const ad = `ayar.${anahtar}` as MetinAnahtari;
    return (
      <label className="ayar-satiri">
        <span className="ayar-yazi">
          <span>{m(ad)}</span>
          {aciklama && <small>{m(aciklama)}</small>}
        </span>
        <input
          type="checkbox"
          role="switch"
          className="anahtar"
          checked={ayarlar[anahtar]}
          onChange={(e) => degistir({ [anahtar]: e.target.checked })}
        />
      </label>
    );
  };
  const dil = seciliDil();

  return (
    <div className="ayarlar-katman" onClick={kapat}>
      <main className="ayarlar" role="dialog" aria-label={m('ayar.baslik')} onClick={(e) => e.stopPropagation()}>
        <header className="ayarlar-ust">
          <h1>{m('ayar.baslik')}</h1>
          <button className="dugme ana" onClick={kapat}>
            {m('ayar.tamam')}
          </button>
        </header>

        <section className="ayar-bolum">
          <h2>{m('ayar.bolum.ses')}</h2>
          {satir('ses', 'ayar.sesPaketi')}
          {satir('mahalleSesi', 'ayar.sesPaketi')}
          {satir('titresim', 'ayar.sesPaketi')}
        </section>

        <section className="ayar-bolum">
          <h2>{m('ayar.bolum.masa')}</h2>
          {satir('solEl', 'ayar.solEl.aciklama')}
          {satir('sayaclariGizle', 'ayar.sayaclariGizle.aciklama')}
          {satir('puaniGoster', 'ayar.puaniGoster.aciklama')}
          {satir('koyulastir', 'ayar.koyulastir.aciklama')}
        </section>

        <section className="ayar-bolum">
          <h2>{m('ayar.bolum.dil')}</h2>
          <div className="ayar-secim">
            <span>{m('ayar.dil')}</span>
            <div className="secenekler">
              {DILLER.map((d) => (
                <button key={d} className={d === dil ? 'secili' : ''} onClick={() => degistir({ dil: d })} lang={d}>
                  {m(`ayar.dil.${d}` as MetinAnahtari)}
                </button>
              ))}
            </div>
          </div>
          <div className="ayar-secim">
            <span>{m('ayar.deste')}</span>
            <div className="secenekler">
              {DESTELER.map((d) => (
                <button key={d} className={d === ayarlar.deste ? 'secili' : ''} onClick={() => degistir({ deste: d })}>
                  {m(`ayar.deste.${d}` as MetinAnahtari)}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
