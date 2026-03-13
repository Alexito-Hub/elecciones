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
      <div className="overlay-view" style={{ background: 'transparent', padding: '20px', width: overlayWidth ?? '100%', height: overlayHeight ?? 'auto', boxSizing: 'border-box', fontFamily: 'var(--fb)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="modal" style={{ border: `1px solid ${c.color}40`, background: 'rgba(7,7,12,0.98)', transform: 'none', maxHeight: 'none' }}>
          <div className="mhero" style={{ '--mc': c.color } as any}>
            <div className="mhero-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {showImage && (
                  <div className="mav" style={{ backgroundColor: c.color + '22', color: c.color, borderColor: c.color + '40', overflow: 'hidden', borderRadius: '50%' }}>
                    {c.image ? <img src={c.image} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : c.initials}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div className="mname">{c.nombre}</div>
                  {showParty && (
                    <div className="mparty">
                      {c.partido}
                      {showPartyLogo && c.logo && <span className="logo-pill" style={{ height: '16px', padding: '0 5px', marginLeft: '6px', verticalAlign: 'middle' }}><img src={c.logo} loading="lazy" /></span>}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    {showIdeo && <span className="mideo" style={{ color: c.color }}>{c.ideo}</span>}
                    {showR && <span style={{ fontFamily: 'var(--fd)', fontSize: '16px', opacity: 0.4 }}>PUESTO #{rank}</span>}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '120px' }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '30px', color: c.color, lineHeight: 1 }}>{c.porcentaje}%</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{c.votos.toLocaleString()} / {data?.total?.toLocaleString() ?? '...'} votos</div>
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
                    {c.props.map((p, i) => (
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
      <div className="overlay-view" style={{ background: 'transparent', padding: '20px', width: overlayWidth ?? '100%', height: overlayHeight ?? 'auto', boxSizing: 'border-box', fontFamily: 'var(--fb)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ background: 'rgba(7,7,12,0.92)', backdropFilter: 'blur(12px)', width: '100%', padding: '20px', border: '1px solid var(--bord2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--bord)', paddingBottom: '12px' }}>
            <Trophy size={20} color="var(--gold)" />
            <div style={{ fontFamily: 'var(--fd)', fontSize: '24px', letterSpacing: '0.05em' }}>TOP {count} — RESULTADOS EN VIVO</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topN.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--fd)', fontSize: '18px', width: '20px', color: 'var(--muted)' }}>{i + 1}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1.5px solid ${c.color}`, overflow: 'hidden', background: '#141422', flexShrink: 0 }}>
                  {c.image ? <img src={c.image} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : <div style={{ fontSize: '10px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.initials}</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nombre.split(' ')[0]} {c.nombre.split(' ').slice(-1)}</div>
                  <div style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.partido}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '18px', color: c.color }}>{c.porcentaje}%</div>
                  <div style={{ fontSize: '9px', color: 'var(--muted)' }}>{c.votos.toLocaleString()} {vts(c.votos)}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (overlayMode === 'summary') {
    const webTop = resSorted[0];
    const showLeader = effectiveParams.has('leader') ? effectiveParams.get('leader') !== '0' : true;
    const showCountdown = effectiveParams.has('countdown') ? effectiveParams.get('countdown') !== '0' : true;
    const showStats = effectiveParams.has('stats') ? effectiveParams.get('stats') !== '0' : false;
    const size = effectiveParams.get('size') === 'small' ? 'small' : 'large';

    const padding = size === 'small' ? 16 : 24;
    const fontSize = size === 'small' ? 28 : 36;

    return (
      <div className="overlay-view" style={{ background: 'transparent', padding: '20px', width: overlayWidth ?? '100%', height: overlayHeight ?? 'auto', fontFamily: 'var(--fb)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ background: 'rgba(7,7,12,0.96)', backdropFilter: 'blur(16px)', width: '100%', padding, border: '1px solid var(--bord2)' }}>
          {showCountdown && (
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>FALTAN PARA LAS ELECCIONES</div>
              <div style={{ fontFamily: 'var(--fd)', fontSize, display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <div>{countdown.d}<span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '4px' }}>D</span></div>
                <div>{countdown.h.toString().padStart(2, '0')}<span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '4px' }}>H</span></div>
                <div>{countdown.m.toString().padStart(2, '0')}<span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '4px' }}>M</span></div>
                <div>{countdown.s.toString().padStart(2, '0')}<span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '4px' }}>S</span></div>
              </div>
            </div>
          )}

          {showLeader && (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: showStats ? '20px' : '0' }}>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '12px', letterSpacing: '0.1em' }}>LÍDER EN NUESTRA WEB</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: `2px solid ${webTop.color}`, overflow: 'hidden' }}>
                  {webTop.image ? <img src={webTop.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{webTop.initials}</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{webTop.nombre.toUpperCase()}</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{webTop.partido}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '24px', color: webTop.color }}>{webTop.porcentaje}%</div>
                </div>
              </div>
            </div>
          )}

          {showStats && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
              <span>Total votos: {data?.total?.toLocaleString() ?? '...'}</span>
              <span>Participación: {data ? `${Math.round((data.total / (data.total + 1)) * 100)}%` : '...'}</span>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return null;
}
