import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { ElectionData } from '../../utils/election';
import { useMemo } from 'react';

interface OverlayViewProps {
  data: ElectionData | null;
  countdown: { d: number, h: number, m: number, s: number };
  vts: (n: number) => string;
  /** When provided, forces the component to render a specific overlay mode and parameters instead
   * of reading from window.location. Useful for previews in the guide page. */
  demo?: { mode: string; params?: Record<string, string> };
}

export default function OverlayView({ data, countdown, vts, demo }: OverlayViewProps) {
  const urlParams = new URLSearchParams(window.location.search);
  // apply demo overrides if provided; cast to Record<string,string> for constructor
  const effectiveParams = demo
    ? new URLSearchParams({ overlay: demo.mode, ...(demo.params || {}) } as Record<string, string>)
    : urlParams;
  const overlayMode = demo ? demo.mode : effectiveParams.get('overlay');
  const overlayId = demo ? (demo.params?.id || '') : effectiveParams.get('id');

  // allow tuning the overlay frame size via URL params (w, h, width, height)
  const rawW = (demo ? demo.params?.w : effectiveParams.get('w')) || (demo ? demo.params?.width : effectiveParams.get('width'));
  const rawH = (demo ? demo.params?.h : effectiveParams.get('h')) || (demo ? demo.params?.height : effectiveParams.get('height'));
  const overlayWidth = rawW ? (isNaN(Number(rawW)) ? rawW : `${Number(rawW)}px`) : undefined;
  const overlayHeight = rawH ? (isNaN(Number(rawH)) ? rawH : `${Number(rawH)}px`) : undefined;

  const resSorted = useMemo(() => {
    if (!data) return [];
    return [...data.candidatos].sort((a, b) => b.votos - a.votos || b.enc - a.enc);
  }, [data]);

  if (!data) return <div className="overlay-view" style={{ background: 'transparent', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spin" style={{ width: '40px', height: '40px' }} /></div>;

  if (overlayMode === 'candidate' && overlayId) {
    const c = resSorted.find(cand => cand.id === overlayId);
    if (!c) return <div className="overlay-view" style={{ background: 'transparent', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--fb)' }}>Candidato no encontrado</div>;

    const rank = resSorted.findIndex(cand => cand.id === overlayId) + 1;
    // Control visual sections via query params
    // - img=0 hides the candidate image
    // - party=0 hides the party label
    // - v=1 shows the live bar (RESULTADOS EN VIVO)
    // - e=1 shows encuesta section
    // - p=1 shows propuestas section
    // - l=1 shows links section
    // - r=1 shows rank label
    const showImage = effectiveParams.has('img') ? effectiveParams.get('img') !== '0' : true;
    const showParty = effectiveParams.has('party') ? effectiveParams.get('party') !== '0' : true;
    const showPartyLogo = effectiveParams.has('partyLogo') ? effectiveParams.get('partyLogo') !== '0' : false;
    const showIdeo = effectiveParams.has('ideo') ? effectiveParams.get('ideo') !== '0' : false;
    const showBar = effectiveParams.has('v') ? effectiveParams.get('v') !== '0' : false;
    const showE = effectiveParams.has('e') ? effectiveParams.get('e') !== '0' : false;
    const showP = effectiveParams.has('p') ? effectiveParams.get('p') === '1' : false;
    const showL = effectiveParams.has('l') ? effectiveParams.get('l') !== '0' : false;
    const showR = effectiveParams.has('r') ? effectiveParams.get('r') !== '0' : false;

    return (
      <div className="overlay-view" style={{ background: 'transparent', padding: '40px', width: overlayWidth ?? '100%', height: overlayHeight ?? 'auto', boxSizing: 'border-box', fontFamily: 'var(--fb)' }}>
        <motion.div 
          initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }} 
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="modal" 
          style={{ 
            border: `1px solid rgba(255,255,255,0.1)`,
            borderTop: `1px solid rgba(255,255,255,0.25)`,
            background: 'rgba(13, 13, 24, 0.7)', 
            backdropFilter: 'blur(30px)', 
            transform: 'none', 
            maxHeight: 'none', 
            boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${c.color}15`,
            borderRadius: '24px'
          }}
        >
          <div className="mhero" style={{ '--mc': c.color } as any}>
            <div className="mhero-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {showImage && (
                  <div className="mav" style={{ width: '80px', height: '80px', backgroundColor: c.color + '22', color: c.color, borderColor: c.color + '40', overflow: 'hidden', borderRadius: '50%', boxShadow: `0 0 20px ${c.color}33` }}>
                    {c.image ? <img src={c.image} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : c.initials}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div className="mname" style={{ fontSize: '32px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{c.nombre}</div>
                  {showParty && (
                    <div className="mparty" style={{ fontSize: '12px', letterSpacing: '0.15em', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                      {c.partido}
                      {showPartyLogo && c.logo && <span className="logo-pill" style={{ height: '20px', padding: '0 8px', marginLeft: '10px', verticalAlign: 'middle' }}><img src={c.logo} loading="lazy" /></span>}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    {showIdeo && <span className="mideo" style={{ color: c.color, background: `${c.color}22`, border: `1px solid ${c.color}44` }}>{c.ideo}</span>}
                    {showR && <span style={{ fontFamily: 'var(--fd)', fontSize: '18px', opacity: 0.6, color: 'var(--gold)' }}>PUESTO #{rank}</span>}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '140px' }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '48px', color: c.color, lineHeight: 0.9, textShadow: `0 0 20px ${c.color}44` }}>{c.porcentaje}%</div>
                <div style={{ fontSize: '13px', color: 'var(--soft)', marginTop: '8px' }}>{c.votos.toLocaleString()} <span style={{ opacity: 0.6 }}>votos</span></div>
              </div>
            </div>
          </div>

          {(showBar || showP || showE) && (
            <div className="mbody">
              {showBar && (
                <>
                  <div className="sec">RESULTADOS EN VIVO</div>
                  <div className="bar-w" style={{ height: '6px', marginBottom: '15px' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${c.porcentaje}%` }} className="bar-f" />
                  </div>
                </>
              )}
              {showP && c.props && (
                <>
                  <div className="sec">Principales propuestas</div>
                  <div className="props" style={{ marginBottom: '20px' }}>
                    {c.props?.map((p, i) => (
                      <div key={i} className="prop">
                        <div className="pdot" style={{ backgroundColor: c.color }}></div>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {showE && (
                <>
                  <div className="sec">Intención de voto — Encuestas</div>
                  <div className="enc-block" style={{ marginBottom: showL ? '20px' : '0' }}>
                    <div className="enc-sources">
                      <div className="enc-src">
                        <div className="enc-src-val" style={{ color: 'var(--red)' }}>{c.enc}%</div>
                        <div className="enc-src-lbl">Datum</div>
                      </div>
                      <div className="enc-src">
                        <div className="enc-src-val" style={{ color: 'var(--gold)' }}>{c.sim}%</div>
                        <div className="enc-src-lbl">Ipsos</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (overlayMode === 'top') {
    const count = Math.min(parseInt(effectiveParams.get('n') || '5'), 10);
    const topN = resSorted.slice(0, count);

    return (
      <div className="overlay-view" style={{ background: 'transparent', padding: '40px', width: overlayWidth ?? '100%', height: overlayHeight ?? 'auto', boxSizing: 'border-box', fontFamily: 'var(--fb)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.98 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="card" 
          style={{ 
            background: 'rgba(13, 13, 24, 0.7)', 
            backdropFilter: 'blur(30px)', 
            width: '100%', 
            padding: '30px', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderTop: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            borderRadius: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
            <div style={{ background: 'var(--gold)', padding: '8px', borderRadius: '10px' }}>
              <Trophy size={24} color="#000" />
            </div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '32px', letterSpacing: '0.05em', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>TOP {count} — RESULTADOS EN VIVO</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topN.map((c, i) => (
              <motion.div 
                key={c.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '16px', background: i === 0 ? 'rgba(212, 146, 10, 0.1)' : 'rgba(255,255,255,0.03)' }}
              >
                <span style={{ fontFamily: 'var(--fd)', fontSize: '24px', width: '28px', color: i === 0 ? 'var(--gold)' : 'var(--muted)', textAlign: 'center' }}>{i + 1}</span>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `2px solid ${c.color}`, overflow: 'hidden', background: '#141422', flexShrink: 0, boxShadow: `0 0 15px ${c.color}22` }}>
                  {c.image ? <img src={c.image} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : <div style={{ fontSize: '14px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.initials}</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', lineHeight: 1.2, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{c.nombre}</div>
                  <div style={{ fontSize: '11px', color: 'var(--soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.partido}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '26px', color: c.color, textShadow: `0 0 10px ${c.color}33` }}>{c.porcentaje}%</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{c.votos.toLocaleString()} {vts(c.votos)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (overlayMode === 'summary' || overlayMode === 'totals') {
    const webTop = resSorted[0];
    const showLeader = effectiveParams.has('leader') ? effectiveParams.get('leader') !== '0' : (overlayMode === 'summary');
    const showCountdown = effectiveParams.has('countdown') ? effectiveParams.get('countdown') !== '0' : (overlayMode === 'summary');
    const showStats = effectiveParams.has('stats') ? effectiveParams.get('stats') !== '0' : (overlayMode === 'totals');
    const size = effectiveParams.get('size') === 'small' ? 'small' : 'large';

    const padding = size === 'small' ? 24 : 40;
    const fontSize = size === 'small' ? 36 : 64;

    return (
      <div className="overlay-view" style={{ background: 'transparent', padding: '40px', width: overlayWidth ?? '100%', height: overlayHeight ?? 'auto', fontFamily: 'var(--fb)' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="card" 
          style={{ 
            background: 'rgba(13, 13, 24, 0.7)', 
            backdropFilter: 'blur(30px)', 
            width: '100%', 
            padding, 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderTop: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            borderRadius: '24px',
            textAlign: 'center'
          }}
        >
          {showCountdown && (
            <div style={{ marginBottom: showLeader || showStats ? '40px' : '0' }}>
              <div style={{ fontSize: '13px', color: 'var(--gold)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>TIEMPO PARA EL CIERRE</div>
              <div style={{ fontFamily: 'var(--fd)', fontSize, display: 'flex', justifyContent: 'center', gap: '30px', textShadow: '0 4px 20px rgba(212, 146, 10, 0.2)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>{countdown.d}<span style={{ fontSize: '14px', color: 'var(--soft)', letterSpacing: '0.1em' }}>DÍAS</span></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>{countdown.h.toString().padStart(2, '0')}<span style={{ fontSize: '14px', color: 'var(--soft)', letterSpacing: '0.1em' }}>HORAS</span></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>{countdown.m.toString().padStart(2, '0')}<span style={{ fontSize: '14px', color: 'var(--soft)', letterSpacing: '0.1em' }}>MIN</span></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>{countdown.s.toString().padStart(2, '0')}<span style={{ fontSize: '14px', color: 'var(--soft)', letterSpacing: '0.1em' }}>SEG</span></div>
              </div>
            </div>
          )}

          {showLeader && (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: showStats ? '30px' : '0' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 700 }}>CANDIDATO LÍDER EN VIVO</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', textAlign: 'left' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: `3px solid ${webTop.color}`, overflow: 'hidden', boxShadow: `0 0 20px ${webTop.color}33` }}>
                  {webTop.image ? <img src={webTop.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px' }}>{webTop.initials}</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{webTop.nombre}</div>
                  <div style={{ fontSize: '12px', color: 'var(--soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{webTop.partido}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '42px', color: webTop.color, textShadow: `0 0 20px ${webTop.color}44` }}>{webTop.porcentaje}%</div>
                </div>
              </div>
            </div>
          )}

          {showStats && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: '8px', fontWeight: 700 }}>VOTOS TOTALES</div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '36px' }}>{data?.total?.toLocaleString() ?? '...'}</div>
              </div>
              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: '8px', fontWeight: 700 }}>PARTICIPACIÓN</div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '36px' }}>{data ? `${Math.round((data.total / (data.total + 1)) * 100)}%` : '...'}</div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return null;
}
