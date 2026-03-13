import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Vote } from 'lucide-react';
import type { ElectionCandidate } from '../../utils/election';

interface CandidateModalProps {
  modal: ElectionCandidate | null;
  setModal: (c: ElectionCandidate | null) => void;
  mLoad: boolean;
  vd: boolean;
  v: boolean;
  vote: (id: string) => void;
  copy: (id: string, type: string) => void;
}

export default function CandidateModal({ modal, setModal, mLoad, vd, v, vote, copy }: CandidateModalProps) {
  return (
    <AnimatePresence>
      {modal && (
        <div className="ov open" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 14 }} className="modal">
            <button className="mx" onClick={() => setModal(null)}><X size={13} /></button>
            <div className="mhero" style={{ '--mc': modal.color } as any}>
              <div className="mhero-in">
                <div className="mav" style={{ backgroundColor: modal.color + '22', color: modal.color, borderColor: modal.color + '40', overflow: 'hidden', borderRadius: '50%' }}>
                  {modal.image ? <img src={modal.image} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : modal.initials}
                </div>
                <div>
                  <div className="mname">{modal.nombre}</div>
                  <div className="mparty">
                    {modal.partido}
                    {modal.logo && <span className="logo-pill" style={{ height: '18px', padding: '0 6px', marginLeft: '10px', verticalAlign: 'middle' }}><img src={modal.logo} loading="lazy" /></span>}
                  </div>
                  <span className="mideo" style={{ color: modal.color }}>{modal.ideo}</span>
                </div>
              </div>
            </div>
            <div className="mbody">
              <button className="mlink" style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', marginBottom: '18px' }} onClick={() => copy(modal.id, 'candidate')}>
                <Share2 size={12} /> Copiar enlace para OBS / Streaming
              </button>

              <div className="sec">Intención de voto — Encuestas</div>
              <div className="enc-block">
                <div className="enc-sources">
                  <div className="enc-src">
                    <div className="enc-src-val" style={{ color: 'var(--red)' }}>{modal.enc}%</div>
                    <div className="enc-src-lbl">Datum</div>
                  </div>
                  <div className="enc-src">
                    <div className="enc-src-val" style={{ color: 'var(--gold)' }}>{modal.sim}%</div>
                    <div className="enc-src-lbl">Ipsos</div>
                  </div>
                </div>
              </div>

              <div className="sec">Principales propuestas</div>
              <div className="props" style={{ marginBottom: '20px', minHeight: '60px' }}>
                {mLoad ? (
                  <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>Cargando propuestas...</div>
                ) : (
                  modal.props && modal.props.length > 0 ? (
                    modal.props.map((p, i) => (
                      <div key={i} className="prop">
                        <div className="pdot" style={{ backgroundColor: modal.color }}></div>
                        <span>{p}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>Plan de Gobierno no disponible.</div>
                  )
                )}
              </div>

              {/* Links and Vote Button extracted logic */}
              <button className="mvbtn" style={{ backgroundColor: modal.color }} disabled={vd || v} onClick={() => vote(modal.id)}>
                {v ? <div className="spin" /> : <Vote size={16} />}
                {vd ? 'YA REGISTRASTE TU VOTO' : `VOTAR POR ${modal.nombre.split(' ')[0].toUpperCase()}`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
