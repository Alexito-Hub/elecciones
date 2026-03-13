import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, FileText } from 'lucide-react';

interface CardProps {
  id: string; name: string; party: string; votos: number; pct: number;
  selected: boolean; disabled: boolean; onV: () => void; onM: () => void;
  rank?: number; color?: string; initials?: string; image?: string; enc?: number; sim?: number;
  logo?: string;
}

const CandidateCard: React.FC<CardProps> = ({
  name, party, votos, pct, selected, onV, onM,
  rank, color = '#e63c3c', initials = '?', image, enc, sim
}) => {
  const [iErr, setiErr] = useState(false);
  return (
    <div
      style={{ '--cc': color } as any}
      className={`card ${selected ? 'sel' : ''}`}
      onClick={onV}
    >
      {rank && <div className="rank">{rank}</div>}
      <div className="chk"><Check size={10} strokeWidth={4} /></div>
      <div className="card-top">
        <div className="av" style={{ backgroundColor: color + '20', color, borderColor: color + '28' }}>
          {image && !iErr ? <img src={image} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setiErr(true)} /> : initials}
        </div>
        <div>
          <div className="cname">{name}</div>
          <div className="cparty">{party}</div>
        </div>
      </div>
      <div className="bar-w"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="bar-f" /></div>
      <div className="bar-meta"><span className="bar-pct">{pct}%</span><span>{votos.toLocaleString()} {votos === 1 ? 'voto' : 'votos'}</span></div>
      <div className="hov">
        <button className="hov-btn" onClick={(e) => { e.stopPropagation(); onM(); }}><FileText size={12} /> Ver propuestas</button>
        <p className="hov-hint">Pulsa para ver propuestas. Haz clic en la tarjeta para seleccionar y votar.</p>
      </div>
    </div>
  );
};

export default CandidateCard;
