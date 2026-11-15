import { m, type MetinAnahtari } from '../metinler';

// Alt sekmeler (belge 2; Kemal, 15 Kasım): Ana ekran · Mücadeleler · Ben. Masada görünmez.
// Simgeler kodla çizilir (örnek oyunun simgeleri kopyalanmaz).

export type Sekme = 'ana' | 'mucadeleler' | 'ben';

const SEKMELER: { ad: Sekme; yazi: MetinAnahtari; simge: string }[] = [
  { ad: 'ana', yazi: 'sekme.ana', simge: 'M2.5 7.5 8 3l5.5 4.5v6h-4v-4h-3v4h-4z' },
  { ad: 'mucadeleler', yazi: 'sekme.mucadeleler', simge: 'M2.5 4h11v9.5h-11zM2.5 7h11M5.5 2.5V5M10.5 2.5V5' },
  { ad: 'ben', yazi: 'sekme.ben', simge: 'M8 8a2.75 2.75 0 1 0 0-5.5A2.75 2.75 0 0 0 8 8ZM3 13.5c.6-2.6 2.6-4 5-4s4.4 1.4 5 4' },
];

export function SekmeCubugu({ secili, sec }: { secili: Sekme; sec: (s: Sekme) => void }) {
  return (
    <nav className="sekme-cubugu">
      {SEKMELER.map((s) => (
        <button
          key={s.ad}
          className={s.ad === secili ? 'secili' : ''}
          aria-current={s.ad === secili ? 'page' : undefined}
          onClick={() => sec(s.ad)}
        >
          <svg className="simge" viewBox="0 0 16 16" aria-hidden="true">
            <path d={s.simge} />
          </svg>
          <span>{m(s.yazi)}</span>
        </button>
      ))}
    </nav>
  );
}

// Mücadeleler sekmesi: günlük mücadele (8. paket) ve kartpostal etkinliği (9. paket) gelene kadar yer tutucu.
export function Mucadeleler() {
  return (
    <main className="sekme-ekrani mucadeleler">
      <h1 className="sekme-baslik">{m('mucadele.baslik')}</h1>
      <div className="ana-kartlar dikey">
        {(['ana.gunluk', 'ana.etkinlik'] as const).map((a) => (
          <div key={a} className="ana-kart kapali" aria-disabled="true">
            <span className="ana-kart-ad">{m(a)}</span>
            <small>{m('ana.yakinda')}</small>
          </div>
        ))}
      </div>
      <p className="yer-tutucu-yazi">{m('mucadele.yerTutucu')}</p>
    </main>
  );
}
