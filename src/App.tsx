import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote, Search, CheckCircle,
  Wifi, WifiOff, Users, Clock,
  BarChart2, ArrowUpDown, Info, X, Share2, FileText, Trophy, ExternalLink
} from 'lucide-react';
import socket from './api/socket';
import api from './api/client';
import CandidateCard from './components/CandidateCard';

interface ElectionCandidate {
  id: string;
  nombre: string;
  partido: string;
  votos: number;
  porcentaje: number;
  enc: number;
  sim: number;
  image?: string;
  logo?: string;
  ideo: string;
  color: string;
  initials: string;
  links: { l: string; u: string }[];
  planId?: number;
  props?: string[];
}

interface ElectionData {
  candidatos: ElectionCandidate[];
  total: number;
  timestamp: number;
}

const getFingerprint = async () => {
  return btoa(navigator.userAgent + screen.width + (navigator as any).hardwareConcurrency);
};

function App() {
  const [data, setData] = useState<ElectionData | null>(null);
  const [online, setOnline] = useState(1);
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState(false);
  const [search, setSearch] = useState('');
  const [selId, setSelId] = useState<string | null>(null);
  const [v, setV] = useState(false);
  const [vd, setVd] = useState(false);
  const [votoCand, setVotoCand] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [conn, setConn] = useState(false);
  const [tab, setTab] = useState<'votar' | 'resultados'>('votar');
  const [sortEnc, setSortEnc] = useState(false);
  const [modal, setModal] = useState<ElectionCandidate | null>(null);
  const [mLoad, setmLoad] = useState(false);
  const [time, setTime] = useState(new Date());

  const vts = (n: number) => n === 1 ? 'voto' : 'votos';

  const countdown = useMemo(() => {
    const target = new Date('2026-04-12T08:00:00').getTime();
    const diff = target - time.getTime();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60)
    };
  }, [time]);

  const urlParams = new URLSearchParams(window.location.search);
  const path = window.location.pathname;
  const overlayMode = path === '/overlay/guia' ? 'guia' : urlParams.get('overlay');
  const overlayId = urlParams.get('id');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    socket.on('connect', () => setConn(true));
    socket.on('disconnect', () => setConn(false));
    socket.on('estado', (res: ElectionData) => setData(res));
    socket.on('actualizacion', (res: ElectionData) => setData(res));
    socket.on('presencia', (res: { online: number }) => setOnline(res.online));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('estado');
      socket.off('actualizacion');
      socket.off('presencia');
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('voto_registrado_2026');
    if (saved) {
      setVd(true);
      setVotoCand(localStorage.getItem('voto_candidato_id'));
    }
  }, []);

  const sorted = useMemo(() => {
    if (!data) return [];
    const list = [...data.candidatos];
    if (sortEnc) return list.sort((a, b) => b.enc - a.enc);
    return list.sort((a, b) => b.votos - a.votos || b.enc - a.enc);
  }, [data, sortEnc]);

  const resSorted = useMemo(() => {
    if (!data) return [];
    return [...data.candidatos].sort((a, b) => b.votos - a.votos || b.enc - a.enc);
  }, [data]);

  const datumLeader = useMemo(() => {
    if (!data) return null;
    return [...data.candidatos].sort((a, b) => b.enc - a.enc)[0];
  }, [data]);

  const ipsosLeader = useMemo(() => {
    if (!data) return null;
    return [...data.candidatos].sort((a, b) => b.sim - a.sim)[0];
  }, [data]);

  const filtered = sorted.filter(c =>
    c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.partido?.toLowerCase().includes(search.toLowerCase()) ||
    c.ideo?.toLowerCase().includes(search.toLowerCase())
  );

  const vote = async (candId?: string) => {
    const id = candId || selId;
    if (!id || v || vd) return;
    if (!prompt && name === '') {
      setPrompt(true);
      if (candId) setSelId(candId);
      return;
    }
    setV(true);
    setPrompt(false);
    setErr(null);
    setMsg(null);
    try {
      const fingerprint = await getFingerprint();
      const token = await api.get('/api/token').then(r => r.data.token);
      const res = await api.post('/api/votar', {
        token,
        candidato_id: id,
        fingerprint_cliente: fingerprint,
        nombre: name
      });
      if (res.data.status) {
        setVd(true);
        setVotoCand(id);
        setMsg('¡Gracias por participar! Tu voto ha sido registrado.');
        setSelId(null);
        setModal(null);
        localStorage.setItem('voto_registrado_2026', 'true');
        localStorage.setItem('voto_candidato_id', id);
      } else {
        setErr(res.data.msg || 'Error al registrar voto');
      }
    } catch (e: any) {
      setErr(e.response?.data?.msg || 'Error de conexión con el servidor');
    } finally {
      setV(false);
    }
  };

  const detail = async (c: ElectionCandidate) => {
    setModal(c);
    if (c.props && c.props.length > 0) return;
    setmLoad(true);
    try {
      const res = await api.get(`/api/candidato/${c.id}`);
      if (res.data.status) {
        setModal(prev => prev?.id === c.id ? { ...prev, props: res.data.data.props } : prev);
      }
    } catch (e) {
      console.error("Error loading plan details", e);
    } finally {
      setmLoad(false);
    }
  };

  const copy = (id: string, type: 'candidate' | 'top' | 'summary' | 'info' = 'candidate') => {
    let url = `${window.location.origin}${window.location.pathname}`;
    if (type === 'top') url += `?overlay=top&n=5`;
    if (type === 'summary') url += `?overlay=summary`;
    if (type === 'candidate') url += `?overlay=candidate&id=${id}&v=1&e=1&p=1&l=1&r=1`;
    if (type === 'info') url += `?overlay=candidate&id=${id}&v=0&e=1&p=1&l=1&r=0`;
    
    navigator.clipboard.writeText(url);
    setMsg('Enlace para overlay copiado!');
    setTimeout(() => setMsg(null), 3000);
  };

  // OVERLAY RENDER
  if (overlayMode === 'guia') {
    return (
      <div className="overlay-view" style={{ background: 'var(--bg)', minHeight: '100vh', padding: '60px 20px', fontFamily: 'var(--fb)' }}>
        <div className="wrap" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <Trophy size={42} color="var(--gold)" />
                <h1 style={{ fontSize: '42px', margin: 0, fontWeight: 900 }}>GUÍA MAESTRA DE OVERLAYS</h1>
            </div>
            <p style={{ color: 'var(--muted)', marginBottom: '50px', fontSize: '18px', lineHeight: 1.6 }}>
                Potencia tu transmisión con datos en tiempo real. Todos los overlays son 100% dinámicos y se actualizan automáticamente vía WebSockets.
            </p>

            <div style={{ display: 'grid', gap: '30px' }}>
                {/* 1. SUMMARY */}
                <div style={{ background: 'var(--s1)', padding: '30px', borderRadius: '20px', border: '1px solid var(--bord)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                        <div>
                            <div style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '20px', textTransform: 'uppercase' }}>1. Resumen General</div>
                            <code style={{ fontSize: '12px', opacity: 0.6 }}>?overlay=summary</code>
                        </div>
                        <button className="sort-btn" onClick={() => copy('', 'summary')}>Copiar URL</button>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--soft)', marginBottom: '15px' }}>Vista compacta que muestra el conteo regresivo y el líder actual de la votación.</p>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px' }}>
                        <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '8px', color: 'var(--muted)' }}>PARÁMETROS OPCIONALES:</div>
                        <ul style={{ fontSize: '12px', color: 'var(--soft)', listStyle: 'none', padding: 0, margin: 0 }}>
                            <li>• `v=1`: Valor por defecto. Muestra el porcentaje del líder.</li>
                        </ul>
                    </div>
                </div>

                {/* 2. TOP N */}
                <div style={{ background: 'var(--s1)', padding: '30px', borderRadius: '20px', border: '1px solid var(--bord)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                        <div>
                            <div style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '20px', textTransform: 'uppercase' }}>2. Ranking en Vivo (Top N)</div>
                            <code style={{ fontSize: '12px', opacity: 0.6 }}>?overlay=top&n=5</code>
                        </div>
                        <button className="sort-btn" onClick={() => copy('top5', 'top')}>Copiar URL (Top 5)</button>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--soft)', marginBottom: '15px' }}>Lista vertical de los candidatos con más votos. Ideal para mostrar la pelea por el primer lugar.</p>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px' }}>
                        <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '8px', color: 'var(--muted)' }}>PARÁMETROS OPCIONALES:</div>
                        <ul style={{ fontSize: '12px', color: 'var(--soft)', listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <li>• `n=[numero]`: Cantidad de puestos a mostrar (ej: `n=3`, `n=10`).</li>
                            <li>• `v=1/0`: Mostrar/ocultar porcentaje de votos.</li>
                        </ul>
                    </div>
                </div>

                {/* 3. CANDIDATE */}
                <div style={{ background: 'var(--s1)', padding: '30px', borderRadius: '20px', border: '1px solid var(--bord)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                        <div>
                            <div style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '20px', textTransform: 'uppercase' }}>3. Ficha Desplegable (Candidato)</div>
                            <code style={{ fontSize: '12px', opacity: 0.6 }}>?overlay=candidate&id=[id]</code>
                        </div>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--soft)', marginBottom: '15px' }}>Vista ultra detallada de un candidato específico. Para obtener el enlace, entra al perfil del candidato y usa el botón de compartir.</p>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px' }}>
                        <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '8px', color: 'var(--muted)' }}>CONTROL DE SECCIONES (1: ON / 0: OFF):</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '11px', color: 'var(--soft)' }}>
                            <div>• `v`: Votos en vivo</div>
                            <div>• `e`: Resultados encuestas</div>
                            <div>• `p`: Propuestas de plan</div>
                            <div>• `l`: Links oficiales</div>
                            <div>• `r`: Puesto en el ranking</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '50px', padding: '30px', border: '1px dashed var(--gold)', borderRadius: '20px', background: 'var(--gold)05', textAlign: 'center' }}>
                <div style={{ fontWeight: 900, color: 'var(--gold)', marginBottom: '20px', fontSize: '18px' }}>🚀 CONFIGURACIÓN RÁPIDA EN OBS</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', fontSize: '13px', color: 'var(--soft)' }}>
                    <div style={{ maxWidth: '200px' }}>
                        <div style={{ color: 'var(--gold)', fontWeight: 800, marginBottom: '5px' }}>PASO 1</div>
                        Copia la URL del overlay que desees.
                    </div>
                    <div style={{ maxWidth: '200px' }}>
                        <div style={{ color: 'var(--gold)', fontWeight: 800, marginBottom: '5px' }}>PASO 2</div>
                        En OBS: Escenas → Fuentes → + → Navegador.
                    </div>
                    <div style={{ maxWidth: '200px' }}>
                        <div style={{ color: 'var(--gold)', fontWeight: 800, marginBottom: '5px' }}>PASO 3</div>
                        Pega la URL y asigna 500x800 de tamaño.
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (overlayMode === 'candidate' && overlayId) {
    if (!data) return <div className="overlay-view" style={{ background: 'transparent', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spin" style={{ width: '40px', height: '40px' }} /></div>;
    const c = resSorted.find(cand => cand.id === overlayId);
    if (!c) return <div className="overlay-view" style={{ background: 'transparent', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--fb)' }}>Candidato no encontrado</div>;

    const rank = resSorted.findIndex(cand => cand.id === overlayId) + 1;
    const showV = urlParams.get('v') !== '0';
    const showE = urlParams.get('e') !== '0';
    const showP = urlParams.get('p') === '1';
    const showL = urlParams.get('l') !== '0';
    const showR = urlParams.get('r') !== '0';

    return (
      <div className="overlay-view" style={{ background: 'transparent', padding: '20px', width: '420px', fontFamily: 'var(--fb)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="modal" style={{ border: `1px solid ${c.color}40`, background: 'rgba(7,7,12,0.98)', transform: 'none', maxHeight: 'none' }}>
            <div className="mhero" style={{ '--mc': c.color } as any}>
                <div className="mhero-in">
                    <div className="mav" style={{ backgroundColor: c.color + '22', color: c.color, borderColor: c.color + '40', overflow: 'hidden', borderRadius: '50%' }}>
                        {c.image ? <img src={c.image} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : c.initials}
                    </div>
                    <div>
                        <div className="mname">{c.nombre}</div>
                        <div className="mparty">
                            {c.partido}
                            {c.logo && <span className="logo-pill" style={{ height: '16px', padding: '0 5px', marginLeft: '6px', verticalAlign: 'middle' }}><img src={c.logo} loading="lazy" /></span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <span className="mideo" style={{ color: c.color }}>{c.ideo}</span>
                            {showR && <span style={{ fontFamily: 'var(--fd)', fontSize: '16px', opacity: 0.4 }}>PUESTO #{rank}</span>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mbody">
                {showV && (
                    <>
                        <div className="sec">RESULTADOS EN VIVO — {c.porcentaje}%</div>
                        <div className="bar-w" style={{ height: '6px', marginBottom: '15px' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${c.porcentaje}%` }} className="bar-f" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginBottom: (showE || showP || showL) ? '20px' : '0' }}>
                            <span>{c.votos.toLocaleString()} {vts(c.votos)}</span>
                            <div className="status-item"><div className="live-dot" style={{ width: '5px', height: '5px' }}></div>LIVE</div>
                        </div>
                    </>
                )}

                {showP && (
                   <>
                        <div className="sec">Principales propuestas</div>
                        <div className="props" style={{ marginBottom: '20px', minHeight: '60px' }}>
                            {mLoad ? (
                                <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>Cargando propuestas...</div>
                            ) : (
                                c.props && c.props.length > 0 ? (
                                    c.props.map((p, i) => (
                                        <div key={i} className="prop">
                                            <div className="pdot" style={{ backgroundColor: c.color }}></div>
                                            <span>{p}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>Plan de Gobierno no disponible.</div>
                                )
                            )}
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

                {showL && (
                    <>
                        <div className="sec">Información Oficial</div>
                        <div className="mlinks">
                            {c.links.map((lk, i) => (
                                <a key={i} className="mlink" href={lk.u} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: '120px', fontSize: '10px' }}>
                                    <FileText size={10} style={{ opacity: 0.5 }} /> {lk.l.split(' (')[0]}
                                </a>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </motion.div>
      </div>
    );
  }

  if (overlayMode === 'top') {
    if (!data) return <div className="overlay-view" style={{ background: 'transparent', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spin" style={{ width: '40px', height: '40px' }} /></div>;
    const count = Math.min(parseInt(urlParams.get('n') || '3'), 10);
    const sortMode = urlParams.get('mode') || 'votos';
    const list = sortMode === 'encuesta' ? sorted : resSorted;
    const topN = list.slice(0, count);

    return (
      <div className="overlay-view" style={{ background: 'transparent', padding: '20px', width: '500px', fontFamily: 'var(--fb)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ background: 'rgba(7,7,12,0.92)', backdropFilter: 'blur(12px)', width: '100%', padding: '20px', border: '1px solid var(--bord2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--bord)', paddingBottom: '12px' }}>
            <Trophy size={20} color="var(--gold)" />
            <div style={{ fontFamily: 'var(--fd)', fontSize: '24px', letterSpacing: '0.05em' }}>TOP {count} — {sortMode === 'encuesta' ? 'POR ENCUESTA' : 'RESULTADOS EN VIVO'}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topN.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--fd)', fontSize: '18px', width: '20px', color: 'var(--muted)' }}>{i + 1}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1.5px solid ${c.color}`, overflow: 'hidden', background: '#141422', flexShrink: 0, display: 'flex', aspectRatio: '1/1' }}>
                  {c.image ? <img src={c.image} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : <div style={{ fontSize: '10px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.initials}</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nombre.split(' ')[0]} {c.nombre.split(' ').slice(-1)}</div>
                  <div style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.partido}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
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
    if (!data) return <div className="overlay-view" style={{ background: 'transparent', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spin" style={{ width: '40px', height: '40px' }} /></div>;
    const webTop = resSorted[0];
    // Customization: ?overlay=summary&timer=true&date=true
    const showTimer = urlParams.get('timer') !== 'false';
    const showDate = urlParams.get('date') !== 'false';

    return (
      <div className="overlay-view" style={{ background: 'transparent', padding: '20px', width: '480px', fontFamily: 'var(--fb)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ background: 'rgba(7,7,12,0.96)', backdropFilter: 'blur(16px)', width: '100%', padding: '24px', border: '1px solid var(--bord2)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {showTimer ? 'FALTAN PARA LAS ELECCIONES' : 'PRÓXIMAS ELECCIONES GENERALES'}
            </div>
            {showTimer && (
              <div style={{ fontFamily: 'var(--fd)', fontSize: '32px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <div>{countdown.d}<span style={{fontSize: '12px', color: 'var(--muted)', marginLeft: '4px'}}>D</span></div>
                <div>{countdown.h.toString().padStart(2, '0')}<span style={{fontSize: '12px', color: 'var(--muted)', marginLeft: '4px'}}>H</span></div>
                <div>{countdown.m.toString().padStart(2, '0')}<span style={{fontSize: '12px', color: 'var(--muted)', marginLeft: '4px'}}>M</span></div>
                <div>{countdown.s.toString().padStart(2, '0')}<span style={{fontSize: '12px', color: 'var(--muted)', marginLeft: '4px'}}>S</span></div>
              </div>
            )}
            {showDate && (
              <div style={{ fontFamily: 'var(--fd)', fontSize: showTimer ? '14px' : '32px', marginTop: showTimer ? '8px' : '0', color: showTimer ? 'var(--muted)' : 'inherit' }}>
                12 DE ABRIL, 2026
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '12px', letterSpacing: '0.1em' }}>LIDER EN NUESTRA WEB</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: `2px solid ${webTop.color}`, overflow: 'hidden' }}>
                    <img src={webTop.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{webTop.nombre.toUpperCase()}</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{webTop.partido}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '24px', color: webTop.color }}>{webTop.porcentaje}%</div>
                  <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '-4px' }}>{webTop.votos.toLocaleString()} de {data.total.toLocaleString()} {vts(data.total)}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '8px' }}>DATUM INTERNACIONAL</div>
                {datumLeader && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${datumLeader.color}`, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={datumLeader.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '14px', color: 'var(--red)' }}>{datumLeader.enc}%</div>
                  </div>
                )}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '8px' }}>IPSOS SIMULACRO</div>
                {ipsosLeader && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${ipsosLeader.color}`, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={ipsosLeader.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '14px', color: 'var(--gold)' }}>{ipsosLeader.sim}%</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '10px', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <div className="live-dot" style={{ width: '5px', height: '5px' }}></div>
            RESULTADOS ACTUALIZADOS EN TIEMPO REAL
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* TICKER */}
      <div className="ticker">
        <div className="tk">
          <span>VOTACION EN TIEMPO REAL · PERU 2026</span>
          <span>ELECCIONES GENERALES · 12 DE ABRIL DE 2026</span>
          <span>36 CANDIDATOS OFICIALES · JNE</span>
          <span>DATOS DE ENCUESTA: DATUM, CPI, IPSOS · MARZO 2026</span>
          <span>RESULTADOS ACTUALIZADOS AL INSTANTE</span>
          <span>VOTACION EN TIEMPO REAL · PERU 2026</span>
        </div>
      </div>

      {/* HEADER */}
      <header>
        <div className="label">
          <span className="label-line"></span>
          Encuesta electoral · Perú 2026
          <span className="label-line"></span>
        </div>
        <h1>SI MAÑANA FUERAN<br /><span>LAS ELECCIONES</span></h1>
        <p className="sub">¿Por quién votarías? Explora candidatos, sus propuestas y registra tu voto. Solo desde la web.</p>

        <div className="pill">
          <Clock size={13} style={{ color: 'var(--gold)' }} />
          Primera vuelta: 12 de abril de 2026
        </div>

        <div className="status">
          <div className="status-item">
            <div className={`live-dot ${!conn ? 'off' : ''}`}></div>
            <span>{conn ? 'En vivo' : 'Conectando'}</span>
          </div>
          <div className="status-item">
            <Clock size={12} />
            <span>{time.toLocaleTimeString()}</span>
          </div>
          <div className="status-item">
            <Users size={12} />
            <span>{online} usuarios en línea</span>
          </div>
          <div className="status-item" style={{ color: 'var(--gold)' }}>
            <Vote size={12} />
            <span>{data?.total.toLocaleString() ?? '0'} {vts(data?.total ?? 0)} totales</span>
          </div>
        </div>

        <div className="tabs-wrap">
          <div className="tabs">
            <button className={`tab ${tab === 'votar' ? 'on' : ''}`} onClick={() => setTab('votar')}>
              <Vote size={14} /> Votar
            </button>
            <button className={`tab ${tab === 'resultados' ? 'on' : ''}`} onClick={() => setTab('resultados')}>
              <BarChart2 size={14} /> Resultados
            </button>
          </div>
        </div>
      </header>

      <div className="wrap">
        {tab === 'votar' ? (
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
              <button
                className={`sort-btn ${!sortEnc ? 'on' : ''}`}
                onClick={() => setSortEnc(!sortEnc)}
              >
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

            <div className="vote-wrap">
              {vd ? (
                <div className="card" style={{ padding: '20px', border: '1px solid var(--gold)', background: 'rgba(255,184,0,0.05)', textAlign: 'center', maxWidth: '500px', margin: '0 auto 30px' }}>
                  <CheckCircle size={30} color="var(--gold)" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '20px', color: 'var(--gold)' }}>¡Voto registrado con éxito!</div>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '5px' }}>
                    Tu participación ha sido contabilizada para {votoCand ? <b>{data?.candidatos.find(c => c.id === votoCand)?.nombre}</b> : 'tu candidato seleccionado'}.
                  </p>
                </div>
              ) : (
                <button
                  className="vote-btn"
                  disabled={!selId || v || vd}
                  onClick={() => vote()}
                >
                  {v ? <div className="spin" /> : <CheckCircle size={18} />}
                  {'REGISTRAR MI VOTO'}
                </button>
              )}
              <div style={{ marginTop: '20px', fontSize: '11px', color: 'var(--muted)', opacity: 0.6, maxWidth: '400px', margin: '20px auto 0' }}>
                Este simulacro no oficial prohíbe el fraude y el uso de bots. Al votar, aceptas nuestros términos de participación ciudadana independiente.
              </div>
            </div>

            <div className="totals">
              <div>
                <div className="big">{data?.total.toLocaleString() ?? '0'}</div>
                <div className="big-lbl">Votos registrados en este simulacro</div>
              </div>
              <div className="totals-r">
                <div>Última actualización: {data ? new Date(data.timestamp).toLocaleTimeString() : time.toLocaleTimeString()}</div>
                <div className="conn-row">
                  {conn ? <Wifi size={11} /> : <WifiOff size={11} />}
                  <span>{conn ? 'Conexión estable' : 'Sin conexión'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div id="tr">
            <div className="res-list">
              {resSorted.map((c, i) => (
                <div key={c.id} className="card" style={{ marginBottom: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontFamily: 'var(--fd)', fontSize: '20px', color: 'var(--muted)', width: '24px' }}>{i + 1}</span>
                    <div
                      className="av"
                      style={{
                        backgroundColor: c.color + '22',
                        color: c.color,
                        width: '38px',
                        height: '38px',
                        overflow: 'hidden',
                        border: `1.5px solid ${c.color}40`,
                        borderRadius: '50%'
                      }}
                    >
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
                    <div style={{ fontSize: '10px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>{c.votos.toLocaleString()} Votos</span>
                      <span style={{ opacity: 0.6 }}>Poll: {c.enc}% · Sim: {c.sim}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{ marginTop: '80px', padding: '60px 20px', borderTop: '1px solid var(--bord)', background: 'linear-gradient(to bottom, transparent, rgba(7,7,12,0.8))' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
          <div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '20px', marginBottom: '15px', color: 'var(--gold)' }}>AURALIX ELECCIONES</div>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
              Plataforma independiente diseñada para fomentar la participación ciudadana y el voto informado. No representamos a ninguna entidad oficial del Estado Peruano ni a partidos políticos.
            </p>
            <div style={{ marginTop: '20px' }}>
              <button className="sort-btn" style={{ background: 'var(--gold)15', borderColor: 'var(--gold)40', color: 'var(--gold)' }} onClick={() => window.open('/overlay/guia', '_blank')}>
                <Trophy size={12} style={{ marginRight: '6px' }}/> Ver Guía de Overlays
              </button>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '15px', fontSize: '14px' }}>ORIGEN DE DATOS</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={12} />
                <a href="https://plataformaelectoral.jne.gob.pe/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Jurado Nacional de Elecciones (Oficial)</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={12} />
                <a href="https://votoinformado.jne.gob.pe/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Voto Informado - Hoja de Vida</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={12} />
                <span>Encuestas: Datum Internacional e Ipsos Apoyo</span>
              </li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '15px', fontSize: '14px' }}>TÉRMINOS Y LEGALES</div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
              Este simulacro no constituye una encuesta oficial bajo la normativa del JNE. Los resultados representan únicamente la opinión de los usuarios de Auralix. Se prohíbe el uso de bots o sistemas automatizados para manipular los resultados. Todo intento de fraude resultará en el baneo de la IP.
            </p>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', opacity: 0.5 }}>© 2026 Auralix Project · Desarrollado con datos de acceso público del JNE</div>
        </div>
      </footer>

      {/* MODAL */}
      <AnimatePresence>
        {modal && (
          <div className="ov open" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 14 }}
              className="modal"
            >
              <button className="mx" onClick={() => setModal(null)}><X size={13} /></button>
              <div className="mhero" style={{ '--mc': modal.color } as any}>
                <div className="mhero-in">
                  <div
                    className="mav"
                    style={{
                      backgroundColor: modal.color + '22',
                      color: modal.color,
                      borderColor: modal.color + '40',
                      overflow: 'hidden',
                      borderRadius: '50%'
                    }}
                  >
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
                <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                  <button
                    className="mlink"
                    style={{ flex: 1, justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                    onClick={() => modal && copy(modal.id, 'candidate')}
                  >
                    <Share2 size={12} /> Copiar enlace para OBS / Streaming
                  </button>
                </div>

                <div className="sec">Intención de voto — Encuestas Marzo 2026</div>
                <div className="enc-block">
                  <div className="enc-sources">
                    <div className="enc-src">
                      <div className="enc-src-val" style={{ color: 'var(--red)' }}>{modal.enc}%</div>
                      <div className="enc-src-lbl">Datum Internac.</div>
                    </div>
                    <div className="enc-src">
                      <div className="enc-src-val" style={{ color: 'var(--gold)' }}>{modal.sim}%</div>
                      <div className="enc-src-lbl">Ipsos Simulacro</div>
                    </div>
                  </div>
                </div>
                <div className="sec">Principales propuestas</div>
                <div className="props" style={{ marginBottom: '20px', minHeight: '60px' }}>
                  {mLoad ? (
                    <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                      <div className="spin" style={{ margin: '0 auto 10px' }} />
                      Cargando propuestas...
                    </div>
                  ) : (
                    modal.props && modal.props.length > 0 ? (
                      modal.props.map((p, i) => (
                        <div key={i} className="prop">
                          <div className="pdot" style={{ backgroundColor: modal.color }}></div>
                          <span>{p}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                        Plan de Gobierno no disponible.
                      </div>
                    )
                  )}
                </div>

                <div className="sec">Información Oficial</div>
                <div className="mlinks">
                   {modal.links.map((lk, i) => (
                    <a
                      key={i}
                      className="mlink"
                      href={lk.u}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        '--mc': modal.color,
                        flex: 1,
                        minWidth: '140px',
                        justifyContent: 'center',
                        background: lk.l.includes('PDF') ? modal.color + '15' : 'rgba(255,255,255,0.03)',
                        borderColor: lk.l.includes('PDF') ? modal.color + '40' : 'var(--bord)'
                      } as any}
                    >
                      <FileText size={11} style={{ opacity: 0.5 }} /> {lk.l.split(' (')[0]}
                    </a>
                  ))}
                </div>
                <button
                  className="mvbtn"
                  style={{ backgroundColor: modal.color }}
                  disabled={vd || v}
                  onClick={() => modal && vote(modal.id)}
                >
                  {v ? <div className="spin" /> : <Vote size={16} />}
                  {vd ? 'YA REGISTRASTE TU VOTO' : `VOTAR POR ${modal.nombre.split(' ')[0].toUpperCase()}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {prompt && selId && (
          <div className="ov open" onClick={(e) => e.target === e.currentTarget && setPrompt(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal"
              style={{ maxWidth: '400px', overflow: 'hidden' }}
            >
              <div className="mhead" style={{ border: 'none', paddingBottom: '10px', padding: '20px 20px 0' }}>
                <div className="mname">Confirmar Voto</div>
                <button className="mclose" onClick={() => setPrompt(false)}><X size={18} /></button>
              </div>
              <div className="mbody" style={{ padding: '0 20px 24px' }}>
                <p style={{ marginBottom: '20px', opacity: 0.7, fontSize: '14px', lineHeight: 1.5 }}>
                  Para registrar tu voto por <b>{sorted.find(c => c.id === selId)?.nombre}</b>, por favor ingresa tu nombre completo o un seudónimo.
                </p>
                <div className="search-wrap" style={{ minWidth: '100%', marginBottom: '20px' }}>
                  <Users size={16} style={{ opacity: 0.5 }} />
                  <input
                    autoFocus
                    className="search"
                    placeholder="Tu nombre (Obligatorio)"
                    maxLength={50}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && name.trim().length > 2 && vote()}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="mvbtn"
                    style={{ flex: 1, margin: 0, backgroundColor: sorted.find(c => c.id === selId)?.color }}
                    disabled={name.trim().length < 3 || v}
                    onClick={() => vote()}
                  >
                    {v ? <div className="spin" /> : 'CONFIRMAR MI VOTO'}
                  </button>
                </div>
                {name.trim() !== '' && name.trim().length < 3 && (
                  <div style={{ fontSize: '10px', color: 'var(--red)', marginTop: '8px', textAlign: 'center' }}>
                    El nombre debe tener al menos 3 caracteres.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(err || msg) && (
          <motion.div
            initial={{ transform: 'translateX(-50%) translateY(58px)', opacity: 0 }}
            animate={{ transform: 'translateX(-50%) translateY(0)', opacity: 1 }}
            exit={{ transform: 'translateX(-50%) translateY(58px)', opacity: 0 }}
            className={`toast show ${err ? 'err' : 'ok'}`}
          >
            {err ? <Info size={14} /> : <CheckCircle size={14} />}
            <span>{err || msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
