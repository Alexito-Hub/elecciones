import { useState } from 'react';
import { Search, ArrowUpDown, CheckCircle } from 'lucide-react';
import type { ElectionData, ElectionCandidate } from '../utils/election';
import CandidateCard from '../components/features/CandidateCard';

interface HomeProps {
  data: ElectionData | null;
  vd: boolean;
  v: boolean;
  selId: string | null;
  setSelId: (id: string | null) => void;
  votoCand: string | null;
  detail: (c: ElectionCandidate) => void;
  vote: (id?: string) => void;
}

export default function Home({ data, vd, v, selId, setSelId, votoCand, detail, vote }: HomeProps) {
  const [search, setSearch] = useState('');
  const [sortEnc, setSortEnc] = useState(false);

  const sorted = data ? [...data.candidatos].sort((a, b) => {
    if (sortEnc) return b.enc - a.enc;
    return b.votos - a.votos || b.enc - a.enc;
  }) : [];

  const filtered = sorted.filter(c =>
    c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.partido?.toLowerCase().includes(search.toLowerCase()) ||
    c.ideo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="tv">
      <div className="toolbar">
        <div className="search-wrap">
          <Search size={15} />
          <input
            className="search"
            placeholder="Buscar candidato o partido…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={`sort-btn ${!sortEnc ? 'on' : ''}`} onClick={() => setSortEnc(!sortEnc)}>
          <ArrowUpDown size={13} /> {sortEnc ? 'Por encuesta' : 'Por votos'}
        </button>
        <span className="count">{filtered.length} candidatos</span>
      </div>

      <div className="grid">
        {filtered.map((c, i) => (
          <CandidateCard
            key={c.id}
            {...c}
            name={c.nombre}
            party={c.partido}
            pct={c.porcentaje}
            rank={i + 1}
            selected={selId === c.id}
            disabled={vd || v}
            onV={() => setSelId(c.id === selId ? null : c.id)}
            onM={() => detail(c)}
          />
        ))}
      </div>

      <div className="vote-wrap" style={{ marginBottom: '8px' }}>
        {vd ? (
          <div className="card" style={{ padding: '20px', border: '1px solid var(--gold)', background: 'rgba(255,184,0,0.05)', textAlign: 'center', maxWidth: '500px', margin: '0 auto 16px' }}>
            <CheckCircle size={30} color="var(--gold)" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontFamily: 'var(--fd)', fontSize: '20px', color: 'var(--gold)' }}>¡Voto registrado con éxito!</div>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '5px' }}>
              Tu participación ha sido contabilizada para {votoCand ? <b>{data?.candidatos.find(c => c.id === votoCand)?.nombre}</b> : 'tu candidato seleccionado'}.
            </p>
          </div>
        ) : (
          <button className="vote-btn" disabled={!selId || v || vd} onClick={() => vote()}>
            {v ? <div className="spin" /> : <CheckCircle size={18} />}
            {'REGISTRAR MI VOTO'}
          </button>
        )}
        <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--muted)', opacity: 0.6, maxWidth: '400px', margin: '8px auto 0' }}>
          Este simulacro no oficial prohíbe el fraude y el uso de bots. Al votar, aceptas nuestros términos de participación ciudadana independiente.
        </div>
      </div>
    </div>
  );
}
