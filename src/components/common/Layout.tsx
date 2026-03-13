import { Vote, Clock, Users, BarChart2, Trophy, ExternalLink } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';

interface LayoutProps {
  conn: boolean;
  time: Date;
  online: number;
  totalVotes: number;
  vts: (n: number) => string;
}

export default function Layout({ conn, time, online, totalVotes, vts }: LayoutProps) {
  const location = useLocation();
  const isOverlay = location.pathname.startsWith('/overlay');

  if (isOverlay) return <Outlet />;

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
            <span>{totalVotes.toLocaleString()} {vts(totalVotes)} totales</span>
          </div>
        </div>

        <div className="tabs-wrap">
          <div className="tabs">
            <Link to="/" className={`tab ${location.pathname === '/' ? 'on' : ''}`} style={{ textDecoration: 'none' }}>
              <Vote size={14} /> Votar
            </Link>
            <Link to="/resultados" className={`tab ${location.pathname === '/resultados' ? 'on' : ''}`} style={{ textDecoration: 'none' }}>
              <BarChart2 size={14} /> Resultados
            </Link>
          </div>
        </div>
      </header>

      <div className="wrap">
        <Outlet />
      </div>

      <footer style={{ marginTop: '10px', padding: '60px 20px', borderTop: '1px solid var(--bord)', background: 'linear-gradient(to bottom, transparent, rgba(7,7,12,0.8))' }}>
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
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '15px', fontSize: '14px' }}>TÉRMINOS Y LEGALES</div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
                Este simulacro no constituye una encuesta oficial bajo la normativa del JNE. Los resultados representan únicamente la opinión de los usuarios de Auralix. Todo intento de fraude resultará en el baneo de la IP.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
