import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Award, Zap } from 'lucide-react';
import type { ElectionData } from '../../utils/election';
import type { Candidato } from '../../config/candidatos';
import { useMemo, useEffect, useState } from 'react';

interface OverlayViewProps {
  data: ElectionData | null;
  countdown: { d: number; h: number; m: number; s: number };
  vts: (n: number) => string;
  demo?: { mode: string; params?: Record<string, string> };
}

type CandidatoLive = Candidato & { votos: number; porcentaje: number };

{/* helpers */ }
function useEP(demo?: OverlayViewProps['demo']): URLSearchParams {
  const url = new URLSearchParams(window.location.search);
  return demo
    ? new URLSearchParams({ overlay: demo.mode, ...(demo.params ?? {}) } as Record<string, string>)
    : url;
}

function parseDim(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  return isNaN(Number(raw)) ? raw : `${Number(raw)}px`;
}

function flag(p: URLSearchParams, key: string, def: boolean): boolean {
  return p.has(key) ? p.get(key) !== '0' : def;
}

{/* shared primitives */ }
function GlassCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: 'rgba(10, 10, 20, 0.72)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderRadius: '0',
      boxShadow: 'none',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      ...style
    }}>
      {children}
    </div>
  );
}

function LiveBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: '100%', background: `linear-gradient(90deg,${color}99,${color})`, borderRadius: '99px' }}
      />
    </div>
  );
}

function LiveDot() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#ff4040', textTransform: 'uppercase' }}>
      <motion.span
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
        style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff4040', display: 'inline-block' }}
      />
      EN VIVO
    </span>
  );
}

function ColorStripe({ color }: { color: string }) {
  return (
    <div style={{ height: '3px', background: `linear-gradient(90deg,${color},${color}55,transparent)`, borderRadius: '0' }} />
  );
}

/**
 * Avatar unificado.
 * useParty=false → foto circular del candidato (fallback: initials)
 * useParty=true  → logo cuadrado del partido  (fallback: nombre del partido)
 */
function Avatar({ c, size = 72, useParty = false, style }: { c: CandidatoLive; size?: number; useParty?: boolean; style?: React.CSSProperties }) {
  const src = useParty ? c.logo : c.image;
  const label = useParty ? c.partido : c.initials;
  const radius = useParty ? '8px' : '50%';
  const objectFit = useParty ? 'contain' : 'cover';

  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      overflow: 'hidden',
      background: `${c.color}18`,
      flexShrink: 0,
      ...style
    }}>
      {src
        ? <img src={src} loading="lazy" style={{ width: '100%', height: '100%', objectFit }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, fontSize: size * 0.28, fontFamily: 'var(--fd)', textAlign: 'center', padding: '4px' }}>{label}</div>
      }
    </div>
  );
}

/* shared encuestas block */
function EncuestasBlock({ c }: { c: CandidatoLive }) {
  return (
    <div style={{ marginTop: '14px', display: 'flex', gap: '12px' }}>
          {[
        { l: 'Datum', v: c.enc, c: '#ff4444' },
        { l: 'Ipsos', v: c.sim, c: 'var(--gold)' },
      ].map(e => (
        <div key={e.l} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '4px', textTransform: 'uppercase' }}>{e.l}</div>
          <div style={{ fontFamily: 'var(--fd)', fontSize: '20px', color: e.c }}>{e.v}%</div>
        </div>
      ))}
    </div>
  );
}

/* shared rank + ideo badges */
function MetaBadges({ c, rank, showRank, showIdeo }: { c: CandidatoLive; rank: number; showRank: boolean; showIdeo: boolean }) {
  if (!showRank && !showIdeo) return null;
  return (
    <div style={{ display: 'flex', gap: '7px', marginTop: '5px', alignItems: 'center' }}>
      {showIdeo && <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', border: `1px solid ${c.color}44`, color: c.color, background: `${c.color}12` }}>{c.ideo}</span>}
      {showRank && <span style={{ fontSize: '11px', color: 'rgba(212,175,55,0.9)', fontFamily: 'var(--fd)' }}>#{rank}</span>}
    </div>
  );
}

/* shared pct + votos column */
function PctColumn({ c }: { c: CandidatoLive }) {
  return (
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <div style={{ fontFamily: 'var(--fd)', fontSize: '48px', lineHeight: 0.85, color: c.color, letterSpacing: '-0.02em' }}>{c.porcentaje}%</div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '7px' }}>{c.votos.toLocaleString()} votos</div>
      <div style={{ marginTop: '8px' }}><LiveDot /></div>
    </div>
  );
}

/* OVERLAY: candidate */
function CandidateOverlay({ resSorted, ep }: { resSorted: CandidatoLive[]; ep: URLSearchParams }) {
  const id = ep.get('id') ?? '';
  const c = resSorted.find(x => x.id === id);
  if (!c) return <div style={{ color: 'white', fontFamily: 'var(--fb)', padding: '16px' }}>Candidato no encontrado</div>;

  const rank = resSorted.findIndex(x => x.id === id) + 1;
  const showImg = flag(ep, 'img', true);
  const showPty = flag(ep, 'party', true);
  const showBar = flag(ep, 'v', false);
  const showEnc = flag(ep, 'e', false);
  const showProp = flag(ep, 'p', false);
  const showRank = flag(ep, 'r', false);
  const showIdeo = flag(ep, 'ideo', false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -40, filter: 'blur(12px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard>
        <ColorStripe color={c.color} />
        <div style={{ padding: '20px 24px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {showImg && <Avatar c={c} size={72} useParty={false} />}
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{c.nombre}</div>
                {showPty && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '4px' }}>{c.partido}</div>}
                <MetaBadges c={c} rank={rank} showRank={showRank} showIdeo={showIdeo} />
              </div>
            </div>
            <PctColumn c={c} />
          </div>
          {showBar && <div style={{ marginTop: '14px' }}><LiveBar pct={c.porcentaje} color={c.color} /></div>}
          {showEnc && <EncuestasBlock c={c} />}
          {showProp && c.props.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em', marginBottom: '7px' }}>PROPUESTAS</div>
              {c.props.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* OVERLAY: party */
function PartyOverlay({ resSorted, ep }: { resSorted: CandidatoLive[]; ep: URLSearchParams }) {
  const id = ep.get('id') ?? '';
  const c = resSorted.find(x => x.id === id);
  if (!c) return <div style={{ color: 'white', fontFamily: 'var(--fb)', padding: '16px' }}>Candidato no encontrado</div>;

  const rank = resSorted.findIndex(x => x.id === id) + 1;
  const showLogo = flag(ep, 'img', true);
  const showCand = flag(ep, 'cand', true);
  const showBar = flag(ep, 'v', false);
  const showEnc = flag(ep, 'e', false);
  const showRank = flag(ep, 'r', false);
  const showIdeo = flag(ep, 'ideo', false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -40, filter: 'blur(12px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard>
        <ColorStripe color={c.color} />
        <div style={{ padding: '20px 24px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Logo del partido */}
              {showLogo && <Avatar c={c} size={72} useParty={true} />}
              <div>
                {/* Partido es el título principal */}
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{c.partido}</div>
                {/* Candidato es el subtítulo */}
                {showCand && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '4px' }}>{c.nombre}</div>}
                <MetaBadges c={c} rank={rank} showRank={showRank} showIdeo={showIdeo} />
              </div>
            </div>
            {/* Porcentaje */}
            <PctColumn c={c} />
          </div>
          {showBar && <div style={{ marginTop: '14px' }}><LiveBar pct={c.porcentaje} color={c.color} /></div>}
          {showEnc && <EncuestasBlock c={c} />}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* OVERLAY: top */
function TopOverlay({ resSorted, ep, vts }: { resSorted: CandidatoLive[]; ep: URLSearchParams; vts: (n: number) => string }) {
  const count = Math.min(parseInt(ep.get('n') ?? '5'), 10);
  const topN = resSorted.slice(0, count);
  const maxVoto = topN[0]?.votos ?? 1;
  const showParty = flag(ep, 'party', false);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <GlassCard>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'linear-gradient(135deg,#D4920A,#f5c842)', padding: '6px', borderRadius: '9px' }}>
                <Trophy size={16} color="#000" />
              </div>
              <span style={{ fontFamily: 'var(--fd)', fontSize: '20px', letterSpacing: '0.04em' }}>TOP {count} {showParty ? 'PARTIDOS' : 'CANDIDATOS'}</span>
            </div>
            <LiveDot />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {topN.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '9px 12px', borderRadius: '12px',
                  background: i === 0 ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(c.votos / maxVoto) * 100}%`, background: `${c.color}08`, borderRadius: '12px' }} />
                <span style={{ fontFamily: 'var(--fd)', fontSize: '18px', width: '22px', textAlign: 'center', color: i === 0 ? 'var(--gold)' : 'rgba(255,255,255,0.3)', flexShrink: 0, zIndex: 1 }}>{i + 1}</span>
                <div style={{ zIndex: 1 }}>
                  <Avatar c={c} size={36} useParty={showParty} />
                </div>
                <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {showParty ? c.partido : c.nombre}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {showParty ? c.nombre : c.partido}
                  </div>
                </div>
                <div style={{ textAlign: 'right', zIndex: 1 }}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '20px', color: c.color }}>{c.porcentaje}%</div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>{c.votos.toLocaleString()} {vts(c.votos)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* OVERLAY: summary / totals */
function SummaryOverlay({
  data, resSorted, encSorted, simSorted, countdown, ep, mode,
}: {
  data: ElectionData;
  resSorted: CandidatoLive[];
  encSorted: CandidatoLive[];
  simSorted: CandidatoLive[];
  countdown: OverlayViewProps['countdown'];
  ep: URLSearchParams;
  mode: string;
}) {
  const top = resSorted[0];
  const topEnc = encSorted[0];
  const topSim = simSorted[0];

  const showLeader = flag(ep, 'leader', mode === 'summary');
  const showCountdown = flag(ep, 'countdown', mode === 'summary');
  const showStats = flag(ep, 'stats', mode === 'totals');
  const showDate = flag(ep, 'date', false);
  const showEnc = flag(ep, 'e', false);
  const showUrl = flag(ep, 'url', false);
  const showParty = flag(ep, 'party', false);

  const small = ep.get('size') === 'small';
  const fsNum = small ? 38 : 56;
  const pad = small ? 18 : 26;

  const PollLeader = ({ c, label, val, color }: { c: CandidatoLive; label: string; val: number; color: string }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '14px', flex: 1 }}>
      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.18em', marginBottom: '10px', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
        <Avatar c={c} size={40} useParty={showParty} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{showParty ? c.partido : c.nombre}</div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '1px' }}>{showParty ? c.nombre : c.partido}</div>
        </div>
        <div style={{ fontFamily: 'var(--fd)', fontSize: '24px', color }}>{val}%</div>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <GlassCard style={{ textAlign: 'center' }}>
        <div style={{ padding: pad }}>
          {showCountdown && (
            <div style={{ marginBottom: showLeader || showStats ? '26px' : 0 }}>
              {showDate && (
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: '8px', fontWeight: 600 }}>
                  DOMINGO 12 DE ABRIL, 2026
                </div>
              )}
              <div style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>TIEMPO PARA EL CIERRE</div>
              <div style={{ fontFamily: 'var(--fd)', fontSize: fsNum, display: 'flex', justifyContent: 'center', gap: '16px' }}>
                {[
                  { v: String(countdown.d), l: 'DÍAS' },
                  { v: String(countdown.h).padStart(2, '0'), l: 'HORAS' },
                  { v: String(countdown.m).padStart(2, '0'), l: 'MIN' },
                  { v: String(countdown.s).padStart(2, '0'), l: 'SEG' },
                ].map(({ v, l }) => (
                  <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <span style={{ background: 'rgba(212,175,55,0.08)', borderRadius: '10px', padding: `4px ${small ? 9 : 13}px`, minWidth: small ? '42px' : '58px', color: '#fff' }}>{v}</span>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {showLeader && top && (
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '14px', marginBottom: showEnc || showStats || showUrl ? '14px' : 0 }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.18em', marginBottom: '10px' }}>{showParty ? 'PARTIDO LÍDER EN VIVO' : 'CANDIDATO LÍDER EN VIVO'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
                <Avatar c={top} size={50} useParty={showParty} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>{showParty ? top.partido : top.nombre}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>{showParty ? top.nombre : top.partido}</div>
                </div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '34px', color: top.color }}>{top.porcentaje}%</div>
              </div>
            </div>
          )}
          {showEnc && topEnc && topSim && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: showStats || showUrl ? '14px' : 0 }}>
              <PollLeader c={topEnc} label="Líder datum" val={topEnc.enc} color="#ff4444" />
              <PollLeader c={topSim} label="Líder ipsos" val={topSim.sim} color="var(--gold)" />
            </div>
          )}
          {showStats && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'VOTOS TOTALES', value: data.total?.toLocaleString() ?? '…' },
                { label: 'PARTICIPACIÓN', value: data.total ? `${Math.round((data.total / (data.total + 1)) * 100)}%` : '…' },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '0.12em', marginBottom: '5px', fontWeight: 700 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '26px' }}>{value}</div>
                </div>
              ))}
            </div>
          )}
          {showUrl && (
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>VOTA EN: </span>
              <span style={{ fontSize: '14px', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.05em' }}>vote.auralixpe.xyz</span>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}



/* OVERLAY: ticker */
function TickerOverlay({ resSorted, data, ep }: { resSorted: CandidatoLive[]; data: ElectionData; ep: URLSearchParams }) {
  const [pos, setPos] = useState(0);
  const speed = parseInt(ep.get('speed') ?? '60');
  const h = parseInt(ep.get('h') ?? '52');
  const bg = ep.get('bg') ?? '0a0a14';
  const accent = ep.get('accent') ?? 'D4920A';

  const items: string[] = [
    'RESULTADOS EN VIVO',
    ...resSorted.map(c => `${c.nombre.split(' ')[0].toUpperCase()}  ${c.porcentaje}%  (${c.votos.toLocaleString()} votos)`),
    data.total ? `TOTAL DE VOTOS: ${data.total.toLocaleString()}` : '',
    resSorted[0] ? `${resSorted[0].nombre.toUpperCase()} LIDERA CON ${resSorted[0].porcentaje}%` : '',
  ].filter(Boolean);

  const text = items.join('   ·   ') + '   ·   ';
  const charW = h * 0.32 * 0.58;
  const totalW = text.length * charW;

  useEffect(() => {
    let last = performance.now();
    let raf: number;
    let p = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      p = (p + speed * dt) % totalW;
      setPos(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed, totalW]);

  return (
    <div style={{ width: '100%', height: h, background: `#${bg}ee`, backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', overflow: 'hidden', fontFamily: 'var(--fb)', position: 'relative' }}>
      <div style={{ flexShrink: 0, height: '100%', background: `#${accent}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: '7px', zIndex: 2 }}>
        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
          style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#000', display: 'inline-block' }} />
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#000', letterSpacing: '0.15em' }}>EN VIVO</span>
      </div>
      <div style={{ overflow: 'hidden', flex: 1, position: 'relative' }}>
        <div style={{ display: 'inline-block', whiteSpace: 'nowrap', fontSize: Math.round(h * 0.32), color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em', transform: `translateX(-${pos}px)`, willChange: 'transform' }}>
          {text}{text}
        </div>
      </div>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '72px', background: `linear-gradient(to right,transparent,#${bg}ee)`, pointerEvents: 'none' }} />
    </div>
  );
}

/* OVERLAY: lower-third */
function LowerThirdOverlay({ resSorted, ep }: { resSorted: CandidatoLive[]; ep: URLSearchParams }) {
  const id = ep.get('id') ?? '';
  const c = resSorted.find(x => x.id === id) ?? resSorted[0];
  if (!c) return null;

  const customName = ep.get('name') ?? c.nombre;
  const customSub = ep.get('sub') ?? c.partido;
  const showPct = flag(ep, 'pct', true);
  const style = ep.get('style') ?? 'line';

  if (style === 'block') {
    return (
      <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'inline-flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'var(--fb)' }}>
        <div style={{ background: c.color, padding: '7px 18px 5px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#000' }}>{customName}</div>
        </div>
        <div style={{ background: 'rgba(10,10,20,0.92)', padding: '4px 18px 6px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {customSub}{showPct ? `  ·  ${c.porcentaje}%` : ''}
          </div>
        </div>
      </motion.div>
    );
  }

  if (style === 'pill') {
    return (
      <motion.div initial={{ y: 20, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(20px)', borderRadius: '99px', padding: '7px 18px 7px 7px', fontFamily: 'var(--fb)' }}>
        <Avatar c={c} size={34} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{customName}</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>{customSub}</div>
        </div>
        {showPct && <div style={{ fontFamily: 'var(--fd)', fontSize: '18px', color: c.color, marginLeft: '4px' }}>{c.porcentaje}%</div>}
      </motion.div>
    );
  }

  // default: line
  return (
    <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'inline-flex', fontFamily: 'var(--fb)' }}>
      <div style={{ background: 'rgba(10,10,20,0.88)', backdropFilter: 'blur(20px)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        {ep.get('img') !== '0' && (
          <Avatar c={c} size={38} />
        )}
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{customName}</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>
            {customSub}{showPct ? `  ·  ${c.porcentaje}%` : ''}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* OVERLAY: alert */
function AlertOverlay({ resSorted, ep }: { resSorted: CandidatoLive[]; ep: URLSearchParams }) {
  const id = ep.get('id') ?? '';
  const c = resSorted.find(x => x.id === id) ?? resSorted[0];
  const type = (ep.get('type') ?? 'winner') as 'winner' | 'update' | 'info';

  const titleTxt = ep.get('title') ?? (type === 'winner' ? '¡GANADOR PROYECTADO!' : type === 'update' ? 'ACTUALIZACIÓN' : 'AVISO');
  const bodyTxt = ep.get('body') ?? (c ? `${c.nombre} lidera con ${c.porcentaje}% de los votos` : '');

  const iconMap: Record<string, React.ReactNode> = {
    winner: <Award size={24} />,
    update: <TrendingUp size={24} />,
    info: <Zap size={24} />,
  };
  const accentMap: Record<string, string> = {
    winner: 'var(--gold)',
    update: '#4fc3f7',
    info: '#b39ddb',
  };
  const accent = accentMap[type] ?? 'var(--gold)';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.9 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard>
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ height: '3px', background: `linear-gradient(90deg,transparent,${accent},transparent)`, borderRadius: '0' }}
          />
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <motion.div
                animate={type === 'winner' ? { rotate: [0, -8, 8, -8, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
                style={{ color: accent, flexShrink: 0 }}
              >
                {iconMap[type]}
              </motion.div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: accent, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2px' }}>{titleTxt}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{bodyTxt}</div>
              </div>
              {c && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <Avatar c={c} size={40} />
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '28px', color: c.color }}>{c.porcentaje}%</div>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}

/* OVERLAY: bars */
function BarsOverlay({ resSorted, ep }: { resSorted: CandidatoLive[]; ep: URLSearchParams }) {
  const count = Math.min(parseInt(ep.get('n') ?? '5'), 8);
  const topN = resSorted.slice(0, count);
  const maxPct = topN[0]?.porcentaje ?? 1;
  const horizontal = ep.get('dir') !== 'v';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <GlassCard>
        <div style={{ padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={13} color="rgba(255,255,255,0.35)" />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Resultados en vivo</span>
            </div>
            <LiveDot />
          </div>
          {horizontal ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topN.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '3px' }}>
                    <Avatar c={c} size={20} useParty={ep.get('party') === '1'} style={{ boxShadow: 'none' }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ep.get('party') === '1' ? c.partido : c.nombre}
                    </span>
                    <span style={{ fontFamily: 'var(--fd)', fontSize: '13px', color: c.color, minWidth: '36px', textAlign: 'right' }}>{c.porcentaje}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.porcentaje / maxPct) * 100}%` }}
                      transition={{ delay: i * 0.07 + 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', background: `linear-gradient(90deg,${c.color}77,${c.color})`, borderRadius: '99px' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '130px' }}>
              {topN.map((c, i) => (
                <div key={c.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                  <span style={{ fontFamily: 'var(--fd)', fontSize: '10px', color: c.color }}>{c.porcentaje}%</span>
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px 4px 0 0', overflow: 'hidden', height: '96px', display: 'flex', alignItems: 'flex-end' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(c.porcentaje / maxPct) * 100}%` }}
                      transition={{ delay: i * 0.07, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ width: '100%', background: `linear-gradient(to top,${c.color},${c.color}55)`, borderRadius: '3px 3px 0 0' }}
                    />
                  </div>
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 1.2 }}>{c.nombre.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

{/* root */ }
export default function OverlayView({ data, countdown, vts, demo }: OverlayViewProps) {
  const ep = useEP(demo);
  const overlayMode = demo ? demo.mode : ep.get('overlay');
  const overlayW = parseDim(ep.get('w') ?? ep.get('width'));
  const overlayH = parseDim(ep.get('h') ?? ep.get('height'));

  const { resSorted, encSorted, simSorted } = useMemo(() => {
    if (!data) return { resSorted: [], encSorted: [], simSorted: [] };
    const candidates = [...(data.candidatos as CandidatoLive[])];
    return {
      resSorted: [...candidates].sort((a, b) => b.votos - a.votos || b.enc - a.enc),
      encSorted: [...candidates].sort((a, b) => b.enc - a.enc || b.votos - a.votos),
      simSorted: [...candidates].sort((a, b) => b.sim - a.sim || b.votos - a.votos),
    };
  }, [data]);

  const outer: React.CSSProperties = {
    width: overlayW,
    height: overlayH,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  };

  if (!data) {
    return (
      <div style={{ ...outer, minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spin" style={{ width: '32px', height: '32px' }} />
      </div>
    );
  }

  const wrap = (node: React.ReactNode) => (
    <div style={outer}>
      {node}
    </div>
  );

  switch (overlayMode) {
    case 'candidate': return wrap(<CandidateOverlay resSorted={resSorted} ep={ep} />);
    case 'party': return wrap(<PartyOverlay resSorted={resSorted} ep={ep} />);
    case 'top': return wrap(<TopOverlay resSorted={resSorted} ep={ep} vts={vts} />);
    case 'summary':
    case 'totals': return wrap(<SummaryOverlay data={data} resSorted={resSorted} encSorted={encSorted} simSorted={simSorted} countdown={countdown} ep={ep} mode={overlayMode} />);
    case 'ticker': return wrap(<TickerOverlay resSorted={resSorted} data={data} ep={ep} />);
    case 'lower-third': return wrap(<LowerThirdOverlay resSorted={resSorted} ep={ep} />);
    case 'alert': return wrap(<AlertOverlay resSorted={resSorted} ep={ep} />);
    case 'bars': return wrap(<BarsOverlay resSorted={resSorted} ep={ep} />);
    default: return null;
  }
}