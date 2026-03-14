import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import socket from './services/socket';
import api from './services/client';
import type { ElectionData, ElectionCandidate } from './utils/election';

// Pages
import Home from './pages/Home';
import Results from './pages/Results';
import OverlayGuide from './pages/overlays/OverlayGuide';
import OverlayView from './pages/overlays/OverlayView';
import ErrorPage from './pages/ErrorPage';

// Components
import Layout from './components/common/Layout';
import CandidateModal from './components/features/CandidateModal';
import Toast from './components/common/Toast';

const getFingerprint = async () => {
  return btoa(navigator.userAgent + screen.width + (navigator as any).hardwareConcurrency);
};

// helper component used when an overlay is requested directly
function OverlayPage() {
  const [data, setData] = useState<ElectionData | null>(null);
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

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    socket.on('connect', () => { });
    socket.on('estado', (res: ElectionData) => setData(res));
    socket.on('actualizacion', (res: ElectionData) => setData(res));
    // keep presence/online hooks if needed in future
    return () => {
      socket.off('connect');
      socket.off('estado');
      socket.off('actualizacion');
    };
  }, []);

  useEffect(() => {
    document.body.classList.add('overlay-body');
    return () => document.body.classList.remove('overlay-body');
  }, []);

  return <OverlayView data={data} countdown={countdown} vts={vts} />;
}

export default function App() {
  // if any overlay query param is present, bypass the router
  if (window.location.search.includes('overlay=')) {
    return <OverlayPage />;
  }
  const [data, setData] = useState<ElectionData | null>(null);
  const [online, setOnline] = useState(1);
  const [name, setName] = useState('');
  const [selId, setSelId] = useState<string | null>(null);
  const [v, setV] = useState(false);
  const [vd, setVd] = useState(false);
  const [votoCand, setVotoCand] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [conn, setConn] = useState(false);
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
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('estado');
      socket.off('actualizacion');
      socket.off('presencia');
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('voto_registrado_2026');
    if (saved) { setVd(true); setVotoCand(localStorage.getItem('voto_candidato_id')); }
  }, []);

  const vote = async (candId?: string) => {
    const id = candId || selId;
    if (!id || v || vd) return;
    if (name === '') {
      const val = window.prompt("Ingresa tu nombre para registrar el voto:");
      if (!val) return;
      setName(val);
      // We'll call vote again recursively with the name set, or just proceed
    }
    setV(true);
    try {
      const fingerprint = await getFingerprint();
      const token = await api.get('/api/token').then(r => r.data.token);
      const res = await api.post('/api/votar', { token, candidato_id: id, fingerprint_cliente: fingerprint, nombre: name || 'Anonimo' });
      if (res.data.status) {
        setVd(true); setVotoCand(id); setMsg('Voto registrado!'); setModal(null);
        localStorage.setItem('voto_registrado_2026', 'true'); localStorage.setItem('voto_candidato_id', id);
      } else { setErr(res.data.msg); }
    } catch (e: any) { setErr('Error de conexión'); } finally { setV(false); }
  };

  const detail = async (c: ElectionCandidate) => {
    setModal(c);
    if (c.props && c.props.length > 0) return;
    setmLoad(true);
    try {
      const res = await api.get(`/api/candidato/${c.id}`);
      if (res.data.status) setModal(prev => prev?.id === c.id ? { ...prev, props: res.data.data.props } : prev);
    } finally { setmLoad(false); }
  };

  const copy = (id: string, type: string) => {
    let url = `${window.location.origin}`;
    if (type === 'top') url += `?overlay=top&n=5`;
    else if (type === 'summary') url += `?overlay=summary`;
    else if (type === 'candidate') url += `?overlay=candidate&id=${id}&v=1&e=1&p=1&l=1&r=1`;
    else if (type === 'info') url += `?overlay=candidate&id=${id}&v=0&e=1&p=1&l=1&r=0`;
    navigator.clipboard.writeText(url);
    setMsg('Enlace copiado!');
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout conn={conn} time={time} online={online} totalVotes={data?.total ?? 0} vts={vts} />}>
          <Route path="/" element={<Home data={data} vd={vd} v={v} selId={selId} setSelId={setSelId} votoCand={votoCand} detail={detail} vote={vote} />} />
          <Route path="/resultados" element={<Results data={data} conn={conn} />} />
        </Route>

        <Route path="/overlay/guia" element={<OverlayGuide data={data} countdown={countdown} vts={vts} />} />
        <Route path="/error" element={<ErrorPage />} />

        <Route path="*" element={
          window.location.search.includes('overlay=') ?
            <OverlayView data={data} countdown={countdown} vts={vts} /> :
            <Navigate to="/error" />
        } />
      </Routes>
      <CandidateModal modal={modal} setModal={setModal} mLoad={mLoad} vd={vd} v={v} vote={vote} copy={copy} />
      <Toast err={err} msg={msg} />
    </BrowserRouter>
  );
}
