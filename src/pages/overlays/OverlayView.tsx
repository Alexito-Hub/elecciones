import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Award, Zap } from 'lucide-react';
import type { ElectionData } from '../../utils/election';
import { useMemo, useEffect, useState } from 'react';

interface OverlayViewProps {
  data: ElectionData | null;
  countdown: { d: number, h: number, m: number, s: number };
  vts: (n: number) => string;
  demo?: { mode: string; params?: Record<string, string> };
}

/* ─── helpers ─────────────────────────────────────────────── */
function useParams(demo?: OverlayViewProps['demo']) {
  const urlParams = new URLSearchParams(window.location.search);
  return demo
    ? new URLSearchParams({ overlay: demo.mode, ...(demo.params || {}) } as Record<string, string>)
    : urlParams;
}

function parseDim(raw?: string | null) {
  if (!raw) return undefined;
  return isNaN(Number(raw)) ? raw : `${Number(raw)}px`;
}

function flag(p: URLSearchParams, key: string, def: boolean) {
  return p.has(key) ? p.get(key) !== '0' : def;
}

/* ─── sub-components ─────────────────────────────────────── */

/** Glassmorphism card shell shared by multiple overlays */
function GlassCard({
  children,
  accentColor,
  style,
  className,
}: {
  children: React.ReactNode;
  accentColor?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: 'rgba(10, 10, 20, 0.72)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderTop: '1px solid rgba(255,255,255,0.22)',
        borderRadius: '20px',
        boxShadow: accentColor
          ? `0 24px 56px rgba(0,0,0,0.55), 0 0 0 1px ${accentColor}18, inset 0 1px 0 rgba(255,255,255,0.1)`
          : '0 24px 56px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Thin animated progress bar */
function LiveBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: '100%', background: `linear-gradient(90deg, ${color}99, ${color})`, borderRadius: '99px' }}
      />
    </div>
  );
}

/** Blinking red dot — "en vivo" */
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

/* ══════════════════════════════════════════════════════════════
   OVERLAY: candidate  (mejorado)
══════════════════════════════════════════════════════════════ */
function CandidateOverlay({ data, resSorted, ep }: any) {
  const overlayId = ep.get('id') || '';
  const c = resSorted.find((x: any) => x.id === overlayId);
  if (!c) return <div style={{ color: 'white', padding: 40, fontFamily: 'var(--fb)' }}>Candidato no encontrado</div>;

  const rank = resSorted.findIndex((x: any) => x.id === overlayId) + 1;
  const showImage = flag(ep, 'img', true);
  const showParty = flag(ep, 'party', true);
  const showBar = flag(ep, 'v', false);
  const showE = flag(ep, 'e', false);
  const showP = flag(ep, 'p', false);
  const showR = flag(ep, 'r', false);
  const showIdeo = flag(ep, 'ideo', false);

  return (
    <div style={{ padding: '32px', fontFamily: 'var(--fb)' }}>
      <motion.div
        initial={{ opacity: 0, x: -40, filter: 'blur(12px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard accentColor={c.color}>
          {/* Header stripe */}
          <div style={{
            height: '3px',
            background: `linear-gradient(90deg, ${c.color}, ${c.color}55, transparent)`,
            borderRadius: '20px 20px 0 0',
          }} />

          <div style={{ padding: '24px 28px 20px' }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {showImage && (
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    border: `2px solid ${c.color}55`,
                    overflow: 'hidden',
                    background: `${c.color}18`,
                    flexShrink: 0,
                    boxShadow: `0 0 0 4px ${c.color}18`,
                  }}>
                    {c.image
                      ? <img src={c.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, fontSize: '22px', fontFamily: 'var(--fd)' }}>{c.initials}</div>
                    }
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{c.nombre}</div>
                  {showParty && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '5px' }}>{c.partido}</div>}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                    {showIdeo && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${c.color}44`, color: c.color, background: `${c.color}12` }}>{c.ideo}</span>}
                    {showR && <span style={{ fontSize: '11px', color: 'rgba(212,175,55,0.9)', fontFamily: 'var(--fd)', letterSpacing: '0.05em' }}>#{rank}</span>}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '52px', lineHeight: 0.85, color: c.color, letterSpacing: '-0.02em' }}>{c.porcentaje}%</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>{c.votos.toLocaleString()} votos</div>
                <div style={{ marginTop: '10px' }}><LiveDot /></div>
              </div>
            </div>

            {/* Bar */}
            {showBar && (
              <div style={{ marginTop: '20px' }}>
                <LiveBar pct={c.porcentaje} color={c.color} />
              </div>
            )}

            {/* Encuesta */}
            {showE && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
                {[{ label: 'Datum', val: c.enc, color: '#ff4444' }, { label: 'Ipsos', val: c.sim, color: 'var(--gold)' }].map(s => (
                  <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '28px', color: s.color }}>{s.val}%</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginTop: '4px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Propuestas */}
            {showP && c.props && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: '10px' }}>PROPUESTAS</div>
                {c.props.map((p: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: c.color, marginTop: '6px', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   OVERLAY: top  (mejorado)
══════════════════════════════════════════════════════════════ */
function TopOverlay({ resSorted, ep, vts }: any) {
  const count = Math.min(parseInt(ep.get('n') || '5'), 10);
  const topN = resSorted.slice(0, count);
  const maxVotos = topN[0]?.votos || 1;

  return (
    <div style={{ padding: '32px', fontFamily: 'var(--fb)' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <GlassCard>
          <div style={{ padding: '24px 28px' }}>
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'linear-gradient(135deg, #D4920A, #f5c842)', padding: '7px', borderRadius: '10px' }}>
                  <Trophy size={18} color="#000" />
                </div>
                <span style={{ fontFamily: 'var(--fd)', fontSize: '22px', letterSpacing: '0.04em' }}>TOP {count}</span>
              </div>
              <LiveDot />
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {topN.map((c: any, i: number) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: i === 0 ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                    border: i === 0 ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* bg bar */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${(c.votos / maxVotos) * 100}%`,
                    background: `${c.color}0a`,
                    borderRadius: '12px',
                    transition: 'width 1s ease',
                  }} />

                  <span style={{ fontFamily: 'var(--fd)', fontSize: '20px', width: '24px', textAlign: 'center', color: i === 0 ? 'var(--gold)' : 'rgba(255,255,255,0.3)', flexShrink: 0, zIndex: 1 }}>
                    {i + 1}
                  </span>

                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `2px solid ${c.color}66`, overflow: 'hidden', background: `${c.color}12`, flexShrink: 0, zIndex: 1 }}>
                    {c.image
                      ? <img src={c.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: c.color }}>{c.initials}</div>
                    }
                  </div>

                  <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nombre}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{c.partido}</div>
                  </div>

                  <div style={{ textAlign: 'right', zIndex: 1 }}>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '22px', color: c.color }}>{c.porcentaje}%</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{c.votos.toLocaleString()} {vts(c.votos)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   OVERLAY: summary / totals  (mejorado)
══════════════════════════════════════════════════════════════ */
function SummaryOverlay({ data, resSorted, countdown, ep, mode }: any) {
  const webTop = resSorted[0];
  const showLeader = flag(ep, 'leader', mode === 'summary');
  const showCountdown = flag(ep, 'countdown', mode === 'summary');
  const showStats = flag(ep, 'stats', mode === 'totals');
  const small = ep.get('size') === 'small';
  const fsNum = small ? 40 : 64;
  const pad = small ? 20 : 32;

  return (
    <div style={{ padding: `${pad}px`, fontFamily: 'var(--fb)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <GlassCard style={{ textAlign: 'center' }}>
          <div style={{ padding: `${pad}px` }}>

            {showCountdown && (
              <div style={{ marginBottom: (showLeader || showStats) ? '32px' : 0 }}>
                <div style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 700 }}>TIEMPO PARA EL CIERRE</div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: fsNum, display: 'flex', justifyContent: 'center', gap: '24px' }}>
                  {[
                    { v: countdown.d, l: 'DÍAS' },
                    { v: countdown.h.toString().padStart(2, '0'), l: 'HORAS' },
                    { v: countdown.m.toString().padStart(2, '0'), l: 'MIN' },
                    { v: countdown.s.toString().padStart(2, '0'), l: 'SEG' },
                  ].map(({ v, l }) => (
                    <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', padding: `4px ${small ? 10 : 16}px`, minWidth: small ? '48px' : '68px', color: '#fff' }}>{v}</span>
                      <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showLeader && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', marginBottom: showStats ? '20px' : 0 }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', marginBottom: '14px' }}>CANDIDATO LÍDER EN VIVO</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', textAlign: 'left' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: `2px solid ${webTop.color}66`, overflow: 'hidden', flexShrink: 0, boxShadow: `0 0 16px ${webTop.color}33` }}>
                    {webTop.image ? <img src={webTop.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px' }}>{webTop.initials}</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{webTop.nombre}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '3px' }}>{webTop.partido}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '40px', color: webTop.color }}>{webTop.porcentaje}%</div>
                </div>
              </div>
            )}

            {showStats && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {[
                  { label: 'VOTOS TOTALES', value: data?.total?.toLocaleString() ?? '…' },
                  { label: 'PARTICIPACIÓN', value: data ? `${Math.round((data.total / (data.total + 1)) * 100)}%` : '…' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: '18px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '0.12em', marginBottom: '8px', fontWeight: 700 }}>{label}</div>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '32px' }}>{value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   OVERLAY: ticker  (nuevo)
   Banda horizontal inferior — ideal para OBS / stream
══════════════════════════════════════════════════════════════ */
function TickerOverlay({ resSorted, data, ep }: any) {
  const [pos, setPos] = useState(0);
  const speed = parseInt(ep.get('speed') || '60'); // px/s

  const items: string[] = [
    `RESULTADOS EN VIVO`,
    ...resSorted.map((c: any) => `${c.nombre.split(' ')[0].toUpperCase()}  ${c.porcentaje}%  (${c.votos.toLocaleString()} votos)`),
    data?.total ? `TOTAL DE VOTOS: ${data.total.toLocaleString()}` : '',
    `${resSorted[0]?.nombre?.toUpperCase()} LIDERA CON ${resSorted[0]?.porcentaje}%`,
  ].filter(Boolean);

  const text = items.join('   ·   ') + '   ·   ';

  useEffect(() => {
    let last = performance.now();
    let raf: number;
    let p = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      p += speed * dt;
      setPos(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  const h = parseInt(ep.get('h') || '52');
  const bg = ep.get('bg') || '0a0a14';
  const accent = ep.get('accent') || 'D4920A';

  return (
    <div style={{
      width: '100%',
      height: `${h}px`,
      background: `#${bg}ee`,
      backdropFilter: 'blur(12px)',
      borderTop: `2px solid #${accent}`,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      fontFamily: 'var(--fb)',
      position: 'relative',
    }}>
      {/* LEFT BADGE */}
      <div style={{
        flexShrink: 0,
        height: '100%',
        background: `#${accent}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px',
        gap: '8px',
        zIndex: 2,
      }}>
        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
          style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#000', display: 'inline-block' }} />
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#000', letterSpacing: '0.15em' }}>EN VIVO</span>
      </div>

      {/* SCROLLING TEXT */}
      <div style={{ overflow: 'hidden', flex: 1, position: 'relative' }}>
        <div style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          fontSize: `${Math.round(h * 0.32)}px`,
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '0.04em',
          transform: `translateX(-${pos % (text.length * 8.5)}px)`,
          willChange: 'transform',
        }}>
          {text}{text}
        </div>
      </div>

      {/* RIGHT fade gradient */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', background: `linear-gradient(to right, transparent, #${bg}ee)`, pointerEvents: 'none' }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   OVERLAY: lower-third  (nuevo)
   Nombre + cargo / partido — estilo broadcast TV
══════════════════════════════════════════════════════════════ */
function LowerThirdOverlay({ resSorted, ep }: any) {
  const overlayId = ep.get('id') || '';
  const c = resSorted.find((x: any) => x.id === overlayId) || resSorted[0];
  if (!c) return null;

  const customName = ep.get('name') || c.nombre;
  const customSub = ep.get('sub') || c.partido;
  const showPct = flag(ep, 'pct', true);
  const style = ep.get('style') || 'line'; // 'line' | 'block' | 'pill'

  if (style === 'block') {
    return (
      <div style={{ fontFamily: 'var(--fb)', display: 'inline-flex', flexDirection: 'column', overflow: 'hidden' }}>
        <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{ background: c.color, padding: '8px 20px 6px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#000', letterSpacing: '0.02em' }}>{customName}</div>
          </div>
          <div style={{ background: 'rgba(10,10,20,0.92)', padding: '5px 20px 7px', borderBottom: `2px solid ${c.color}` }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {customSub}{showPct ? `  ·  ${c.porcentaje}%` : ''}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (style === 'pill') {
    return (
      <div style={{ fontFamily: 'var(--fb)' }}>
        <motion.div initial={{ y: 20, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(20px)', borderRadius: '99px', padding: '8px 20px 8px 8px', border: `1px solid ${c.color}44` }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${c.color}`, overflow: 'hidden', background: `${c.color}18` }}>
            {c.image ? <img src={c.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: c.color }}>{c.initials}</div>}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{customName}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>{customSub}</div>
          </div>
          {showPct && <div style={{ fontFamily: 'var(--fd)', fontSize: '20px', color: c.color, marginLeft: '4px' }}>{c.porcentaje}%</div>}
        </motion.div>
      </div>
    );
  }

  // Default: 'line' style
  return (
    <div style={{ fontFamily: 'var(--fb)', display: 'inline-flex', flexDirection: 'column' }}>
      <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <div style={{ background: 'rgba(10,10,20,0.88)', backdropFilter: 'blur(20px)', padding: '12px 22px', borderLeft: `4px solid ${c.color}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
          {ep.get('img') !== '0' && (
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: `1.5px solid ${c.color}77`, overflow: 'hidden' }}>
              {c.image ? <img src={c.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: c.color }}>{c.initials}</div>}
            </div>
          )}
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{customName}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>
              {customSub}{showPct ? `  ·  ${c.porcentaje}%` : ''}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   OVERLAY: alert  (nuevo)
   Alerta animada — para evento especial o ganador
══════════════════════════════════════════════════════════════ */
function AlertOverlay({ resSorted, ep }: any) {
  const overlayId = ep.get('id') || '';
  const c = resSorted.find((x: any) => x.id === overlayId) || resSorted[0];
  const type = ep.get('type') || 'winner'; // 'winner' | 'update' | 'info'
  const titleTxt = ep.get('title') || (type === 'winner' ? '¡GANADOR PROYECTADO!' : type === 'update' ? 'ACTUALIZACIÓN' : 'AVISO');
  const bodyTxt = ep.get('body') || (c ? `${c.nombre} lidera con ${c.porcentaje}% de los votos` : '');

  const icons: Record<string, React.ReactNode> = {
    winner: <Award size={28} />,
    update: <TrendingUp size={28} />,
    info: <Zap size={28} />,
  };

  const accentMap: Record<string, string> = {
    winner: 'var(--gold)',
    update: '#4fc3f7',
    info: '#b39ddb',
  };
  const accent = accentMap[type] || 'var(--gold)';

  return (
    <div style={{ padding: '32px', fontFamily: 'var(--fb)' }}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassCard accentColor={c?.color}>
            {/* Top glowing bar */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ height: '3px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, borderRadius: '20px 20px 0 0' }}
            />

            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Icon */}
                <motion.div
                  animate={type === 'winner' ? { rotate: [0, -8, 8, -8, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
                  style={{ color: accent, flexShrink: 0 }}
                >
                  {icons[type]}
                </motion.div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: accent, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3px' }}>{titleTxt}</div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{bodyTxt}</div>
                </div>

                {/* Candidate avatar + pct */}
                {c && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `2px solid ${c.color}77`, overflow: 'hidden', boxShadow: `0 0 12px ${c.color}44` }}>
                      {c.image ? <img src={c.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: c.color }}>{c.initials}</div>}
                    </div>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '34px', color: c.color }}>{c.porcentaje}%</div>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   OVERLAY: bars  (nuevo)
   Gráfico de barras comparativo entre candidatos
══════════════════════════════════════════════════════════════ */
function BarsOverlay({ resSorted, ep, vts }: any) {
  const count = Math.min(parseInt(ep.get('n') || '5'), 8);
  const topN = resSorted.slice(0, count);
  const maxPct = topN[0]?.porcentaje || 1;
  const horizontal = ep.get('dir') !== 'v'; // default horizontal

  return (
    <div style={{ padding: '32px', fontFamily: 'var(--fb)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <GlassCard>
          <div style={{ padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={16} color="rgba(255,255,255,0.5)" />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Resultados en vivo</span>
              </div>
              <LiveDot />
            </div>

            {horizontal
              ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {topN.map((c: any, i: number) => (
                    <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        {c.image
                          ? <img src={c.image} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${c.color}55` }} />
                          : <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: `${c.color}22`, border: `1px solid ${c.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: c.color }}>{c.initials}</div>
                        }
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nombre.split(' ')[0]} {c.nombre.split(' ')[1] || ''}</span>
                        <span style={{ fontFamily: 'var(--fd)', fontSize: '14px', color: c.color, minWidth: '42px', textAlign: 'right' }}>{c.porcentaje}%</span>
                      </div>
                      <div style={{ height: '7px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(c.porcentaje / maxPct) * 100}%` }}
                          transition={{ delay: i * 0.07 + 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          style={{ height: '100%', background: `linear-gradient(90deg, ${c.color}88, ${c.color})`, borderRadius: '99px' }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
              : (
                // vertical bars
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '160px' }}>
                  {topN.map((c: any, i: number) => (
                    <div key={c.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontFamily: 'var(--fd)', fontSize: '12px', color: c.color }}>{c.porcentaje}%</span>
                      <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '6px 6px 0 0', overflow: 'hidden', height: '120px', display: 'flex', alignItems: 'flex-end' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(c.porcentaje / maxPct) * 100}%` }}
                          transition={{ delay: i * 0.07, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          style={{ width: '100%', background: `linear-gradient(to top, ${c.color}, ${c.color}66)`, borderRadius: '4px 4px 0 0' }}
                        />
                      </div>
                      <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.2 }}>{c.nombre.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════════════════ */
export default function OverlayView({ data, countdown, vts, demo }: OverlayViewProps) {
  const ep = useParams(demo);
  const overlayMode = demo ? demo.mode : ep.get('overlay');
  const overlayWidth = parseDim(ep.get('w') || ep.get('width'));
  const overlayHeight = parseDim(ep.get('h') || ep.get('height'));

  const resSorted = useMemo(() => {
    if (!data) return [];
    return [...data.candidatos].sort((a, b) => b.votos - a.votos || b.enc - a.enc);
  }, [data]);

  const outerStyle: React.CSSProperties = {
    background: 'transparent',
    width: overlayWidth ?? '100%',
    height: overlayHeight ?? 'auto',
    boxSizing: 'border-box',
    fontFamily: 'var(--fb)',
  };

  if (!data) return (
    <div style={{ ...outerStyle, minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spin" style={{ width: '36px', height: '36px' }} />
    </div>
  );

  switch (overlayMode) {
    case 'candidate': return <div style={outerStyle}><CandidateOverlay data={data} resSorted={resSorted} ep={ep} /></div>;
    case 'top': return <div style={outerStyle}><TopOverlay resSorted={resSorted} ep={ep} vts={vts} /></div>;
    case 'summary':
    case 'totals': return <div style={outerStyle}><SummaryOverlay data={data} resSorted={resSorted} countdown={countdown} ep={ep} mode={overlayMode} /></div>;
    // ── nuevos ──
    case 'ticker': return <div style={{ ...outerStyle, height: outerStyle.height ?? 'auto' }}><TickerOverlay resSorted={resSorted} data={data} ep={ep} /></div>;
    case 'lower-third': return <div style={outerStyle}><LowerThirdOverlay resSorted={resSorted} ep={ep} /></div>;
    case 'alert': return <div style={outerStyle}><AlertOverlay resSorted={resSorted} ep={ep} /></div>;
    case 'bars': return <div style={outerStyle}><BarsOverlay resSorted={resSorted} ep={ep} vts={vts} /></div>;
    default: return null;
  }
}

/*
═══════════════════════════════════════════════════════════════
  GUÍA RÁPIDA DE PARÁMETROS URL
═══════════════════════════════════════════════════════════════

── EXISTENTES (mejorados) ──────────────────────────────────────
  ?overlay=candidate&id=XXX        Tarjeta de candidato
    img=0      oculta foto
    party=0    oculta partido
    v=1        barra de votos en vivo
    e=1        encuestas
    p=1        propuestas
    r=1        rango (#1, #2…)
    ideo=1     ideología

  ?overlay=top&n=5                 Top N candidatos
  ?overlay=summary                 Líder + cuenta regresiva
  ?overlay=totals                  Totales + estadísticas

── NUEVOS ──────────────────────────────────────────────────────
  ?overlay=ticker                  Ticker horizontal (banda)
    speed=60   velocidad px/s
    h=52       altura en px
    bg=0a0a14  color fondo hex (sin #)
    accent=D4920A color acento hex

  ?overlay=lower-third&id=XXX      Lower third (nombre + cargo)
    style=line | block | pill      estilos visuales
    name=XXX   nombre personalizado
    sub=XXX    subtítulo personalizado
    pct=0      oculta porcentaje
    img=0      oculta foto (en style=line)

  ?overlay=alert&id=XXX            Alerta animada
    type=winner | update | info    tipo (icono y color)
    title=TEXTO                    título personalizado
    body=TEXTO                     cuerpo personalizado

  ?overlay=bars&n=5                Gráfico de barras
    dir=v      barras verticales (default: horizontal)
    n=5        cantidad de candidatos

── DIMENSIONES (todos los overlays) ───────────────────────────
    w=800  o  width=800px          ancho
    h=400  o  height=400px         alto
*/