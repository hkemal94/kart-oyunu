import { Pul } from './Pul';
import { ceyreginAylari, pulDurumu, type Ceyrek, type PulDurumu } from './seri';

// Pul koleksiyonu sayfası ve onu açan kart (Kemal, 15 Kasım akşam). Oyundan bağımsız: girdi
// "kazanılan aylar" ("YYYY-AA"), bugün ve koleksiyonun ilk yılı. Yazılar oyunun metin dosyasından
// gelir; oyun onları `yazilar` ile verir (bu klasör metin dosyasını kendisi okumaz).
// Sayfa: her yıl bir bölüm; her çeyrek bir satır: üç aylık pul ve yanında büyük 4. pul, altında
// çeyreğin ve yılın adı. Pullar yazısız.

export interface PulYazilari {
  yil: (yil: number) => string; // bölüm başlığı
  ceyrek: (yil: number, ilkAy: number, sonAy: number) => string; // "Ocak–Mart 2026"
  ayEtiketi: (yil: number, ay: number, durum: PulDurumu) => string; // ekran okuyucu
  buyukEtiketi: (yil: number, ceyrek: Ceyrek, durum: PulDurumu) => string; // ekran okuyucu
  sayac: (ayPulu: number, buyukPul: number) => string;
  bos: string; // hiç pul yokken kartta
  not: string; // sayfanın altında kısa kural
}

interface Ozellik {
  kazanilanAylar: string[];
  bugun: string;
  ilkYil: number;
  yazilar: PulYazilari;
}

export function KoleksiyonSayfasi({ kazanilanAylar, bugun, ilkYil, yazilar }: Ozellik) {
  const k = pulDurumu(kazanilanAylar, bugun, ilkYil);
  return (
    <div className="pul-koleksiyonu">
      <p className="pul-sayac">{yazilar.sayac(k.ayPulu, k.buyukPul)}</p>
      {[...k.yillar].reverse().map((y) => (
        <section key={y.yil} className="pul-yil">
          <h2>{yazilar.yil(y.yil)}</h2>
          {y.ceyrekler.map((c) => {
            const [ilk, , son] = ceyreginAylari(c.ceyrek);
            return (
              <figure key={c.anahtar} className="pul-ceyrek">
                <div className="pul-seri">
                  {c.aylar.map((a) => (
                    <Pul key={a.anahtar} anahtar={a.anahtar} durum={a.durum} etiket={yazilar.ayEtiketi(a.yil, a.ay, a.durum)} />
                  ))}
                  <Pul anahtar={c.anahtar} durum={c.buyuk} buyuk etiket={yazilar.buyukEtiketi(c.yil, c.ceyrek, c.buyuk)} />
                </div>
                <figcaption>{yazilar.ceyrek(c.yil, ilk, son)}</figcaption>
              </figure>
            );
          })}
        </section>
      ))}
      <p className="pul-not">{yazilar.not}</p>
    </div>
  );
}

// Ödüller listesindeki kart: başlık, kaç pul toplandığı ve son kazanılan üç pul (yoksa soluk
// çerçeveler). Dokununca koleksiyon sayfası açılır.
export function KoleksiyonKarti({
  baslik,
  kazanilanAylar,
  bugun,
  ilkYil,
  yazilar,
  ac,
}: Ozellik & { baslik: string; ac: () => void }) {
  const k = pulDurumu(kazanilanAylar, bugun, ilkYil);
  const son = k.yillar
    .flatMap((y) => y.ceyrekler.flatMap((c) => c.aylar))
    .filter((a) => a.durum === 'kazanildi')
    .slice(-3);
  const ornek = son.length ? son : null;
  return (
    <button className="odul-karti pul-karti" onClick={ac}>
      <span>{baslik}</span>
      <span className="pul-karti-seri" aria-hidden="true">
        {ornek
          ? ornek.map((a) => <Pul key={a.anahtar} anahtar={a.anahtar} durum="kazanildi" etiket="" />)
          : [0, 1, 2].map((i) => <Pul key={i} anahtar="" durum="eksik" etiket="" />)}
      </span>
      <small>{k.ayPulu + k.buyukPul ? yazilar.sayac(k.ayPulu, k.buyukPul) : yazilar.bos}</small>
    </button>
  );
}
