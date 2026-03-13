import { Wifi, WifiOff } from 'lucide-react';
import type { ElectionData } from '../utils/election';

interface ResultsProps {
  data: ElectionData | null;
  conn: boolean;
}

export default function Results({ data, conn }: ResultsProps) {
  if (!data) return <div style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>Cargando resultados oficiales...</div>;

  const resSorted = [...data.candidatos].sort((a, b) => b.votos - a.votos || b.enc - a.enc);

  return (
    <div id="tr">
      <div className="res-list">
        {resSorted.map((c, i) => (
          <div key={c.id} className="card" style={{ marginBottom: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontFamily: 'var(--fd)', fontSize: '20px', color: 'var(--muted)', width: '24px' }}>{i + 1}</span>
              <div className="av" style={{ backgroundColor: c.color + '22', color: c.color, width: '38px', height: '38px', overflow: 'hidden', border: `1.5px solid ${c.color}40`, borderRadius: '50%' }}>
                {c.image ? <img src={c.image} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : c.initials}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>
                  {c.nombre.toUpperCase()}
                  {c.logo && <span className="logo-pill" style={{ height: '14px', padding: '0 4px', marginLeft: '6px', verticalAlign: 'middle', background: 'white' }}><img src={c.logo} loading="lazy" /></span>}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{c.partido}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--fd)', fontSize: '22px', color: c.color }}>{c.porcentaje}%</div>
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{c.votos.toLocaleString()} Votos</div>
            </div>
          </div>
        ))}
      </div>

      <div className="totals" style={{ marginTop: '40px' }}>
        <div>
          <div className="big">{data.total.toLocaleString()}</div>
          <div className="big-lbl">Votos registrados en este simulacro</div>
        </div>
        <div className="totals-r">
          <div>Última actualización: {new Date(data.timestamp).toLocaleTimeString()}</div>
          <div className="conn-row">
            {conn ? <Wifi size={11} /> : <WifiOff size={11} />}
            <span>{conn ? 'Conexión estable' : 'Sin conexión'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
