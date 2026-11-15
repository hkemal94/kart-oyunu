import { useId } from 'react';
import type { PulDurumu } from './seri';
import { pulGorseli } from './pullar';

// Bir posta pulu (Kemal, 15 Kasım akşam): tırtıklı kenar, krem zemin, lacivert ince çizgi. Pul
// yazısızdır. Görseli kayıtta yoksa (pullar.ts) içi boş yer tutucu çerçeve çizilir.
// Büyük pul (çeyreğin 4. pulu) aynı çerçevenin daha büyük ve daha süslü hâli: çift çerçeve ve
// köşelerde küçük süs. Kazanılmamış pul soluk; gelecek ayın pulu çok soluk ve kilitli.
// Renkler CSS'ten (stil.css: .pul): bu dosyada oyuna özgü bir şey yok.

interface Ozellik {
  anahtar: string; // "2026-01" ya da "2026-Q1" (pullar.ts)
  durum: PulDurumu;
  buyuk?: boolean;
  etiket: string; // ekran okuyucu için (ör. "Ocak 2026 pulu, kazanıldı")
}

// Ölçüler pul biriminde (viewBox); ekrandaki boyutu CSS verir
const OLCU = {
  kucuk: { en: 50, boy: 60, delik: 2.1, aralik: 6.2, pay: 6.5 },
  buyuk: { en: 66, boy: 80, delik: 2.1, aralik: 6.2, pay: 7 },
};

// Kenar boyunca eşit aralıklı yarım daire oyuklar (tırtık)
function delikler(en: number, boy: number, r: number, aralik: number) {
  const d: { x: number; y: number }[] = [];
  const yatay = Math.max(2, Math.round(en / aralik));
  const dikey = Math.max(2, Math.round(boy / aralik));
  for (let i = 0; i < yatay; i++) {
    const x = ((i + 0.5) * en) / yatay;
    d.push({ x, y: 0 }, { x, y: boy });
  }
  for (let i = 0; i < dikey; i++) {
    const y = ((i + 0.5) * boy) / dikey;
    d.push({ x: 0, y }, { x: en, y });
  }
  return d.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={r} fill="#000" />);
}

export function Pul({ anahtar, durum, buyuk = false, etiket }: Ozellik) {
  const id = useId().replace(/:/g, '');
  const o = buyuk ? OLCU.buyuk : OLCU.kucuk;
  const gorsel = durum === 'kazanildi' ? pulGorseli(anahtar) : null;
  const ic = { x: o.pay, y: o.pay, w: o.en - 2 * o.pay, h: o.boy - 2 * o.pay };
  const sus = 3.2; // büyük pulun ikinci çerçevesinin içe payı
  return (
    <svg
      className={`pul ${buyuk ? 'buyuk' : ''} ${durum}`}
      viewBox={`0 0 ${o.en} ${o.boy}`}
      role="img"
      aria-label={etiket}
    >
      <defs>
        <mask id={`tirtik-${id}`}>
          <rect width={o.en} height={o.boy} fill="#fff" />
          {delikler(o.en, o.boy, o.delik, o.aralik)}
        </mask>
      </defs>
      <rect className="pul-zemin" width={o.en} height={o.boy} mask={`url(#tirtik-${id})`} />
      {gorsel ? (
        <image href={`${import.meta.env.BASE_URL}${gorsel}`} x={ic.x} y={ic.y} width={ic.w} height={ic.h} preserveAspectRatio="xMidYMid slice" />
      ) : null}
      <rect className="pul-cizgi" x={ic.x} y={ic.y} width={ic.w} height={ic.h} />
      {buyuk && (
        <>
          <rect className="pul-cizgi" x={ic.x + sus} y={ic.y + sus} width={ic.w - 2 * sus} height={ic.h - 2 * sus} />
          {[
            [ic.x, ic.y],
            [ic.x + ic.w, ic.y],
            [ic.x, ic.y + ic.h],
            [ic.x + ic.w, ic.y + ic.h],
          ].map(([x, y], i) => (
            <path key={i} className="pul-sus" d={`M${x} ${y - 2.2} L${x + 2.2} ${y} L${x} ${y + 2.2} L${x - 2.2} ${y} Z`} />
          ))}
        </>
      )}
      {durum === 'gelecek' && (
        // Kilit: gelecek ayın pulu henüz açılmadı
        <g className="pul-kilit" transform={`translate(${o.en / 2} ${o.boy / 2})`}>
          <path d="M-3.2 -1 V-3.4 A3.2 3.2 0 0 1 3.2 -3.4 V-1" />
          <rect x={-4.6} y={-1} width={9.2} height={7} rx={1.2} />
        </g>
      )}
    </svg>
  );
}
