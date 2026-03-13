import { Trophy } from 'lucide-react';

// base URL for overlays (origin by default, can be replaced in production)
const getBaseUrl = () => {
  if (import.meta.env.VITE_OVERLAY_HOST) {
    return import.meta.env.VITE_OVERLAY_HOST;
  }
  return window.location.origin;
};

function makeUrl(params: Record<string,string>) {
  const base = getBaseUrl();
  const search = new URLSearchParams(params).toString();
  return `${base}?${search}`;
}

import type { ElectionData } from '../../utils/election';

interface OverlayGuideProps {
  data: ElectionData | null;
  countdown: { d: number, h: number, m: number, s: number };
  vts: (n: number) => string;
}

export default function OverlayGuide({ data }: OverlayGuideProps) {
  const firstId = data?.candidatos?.[0]?.id || '';
  return (
    <div className="guide-container">
      <div className="guide-wrap">
        <header className="guide-header">
          <Trophy size={48} color="var(--gold)" style={{ filter: 'drop-shadow(0 2px 8px var(--gold))' }} />
          <h1>GUÍA MAESTRA DE OVERLAYS</h1>
          <p>Potencia tu transmisión con datos en tiempo real. Todos los overlays son <b>100% dinámicos</b> y se actualizan automáticamente vía WebSockets.</p>
        </header>

        <div className="guide-grid">
          {/* Overlay: Resumen General */}
          <section className="guide-section">
            <h2>Resumen General</h2>
            <div className="desc"><b>Descripción:</b> Muestra el conteo regresivo y el líder actual de la votación en formato compacto. Ideal para pantallas de información o resumen.</div>
            <div className="params">
              <b>Parámetros:</b>
              <ul>
                <li><b>v</b>: Muestra el porcentaje del líder (default: 1).</li>
                <li><b>size</b>: small/large. Cambia el tamaño del resumen.</li>
              </ul>
            </div>
            <div className="example"><b>Ejemplo de uso:</b> <code>?overlay=summary&v=1&size=large&w=450&h=220</code></div>
            <div className="reco"><b>Recomendación:</b> Úsalo para mostrar el estado general del evento en tiempo real.</div>
            <div className="guide-preview">
              <iframe
                src={makeUrl({ overlay: 'summary', v: '1', size: 'large' })}
                style={{ width: '100%', height: '150px', border: 'none' }}
                title="Resumen General"
              />
            </div>
          </section>

          {/* Overlay: Ranking en Vivo (Top N) */}
          <section className="guide-section">
            <h2>Ranking en Vivo (Top N)</h2>
            <div className="desc"><b>Descripción:</b> Lista vertical de los candidatos con más votos. Ideal para mostrar la competencia por el primer lugar.</div>
            <div className="params">
              <b>Parámetros:</b>
              <ul>
                <li><b>n</b>: Número de puestos a mostrar (ej: n=3, n=10).</li>
                <li><b>v</b>: Mostrar/ocultar porcentaje de votos.</li>
                <li><b>card</b>: small/large. Cambia el tamaño de las tarjetas.</li>
              </ul>
            </div>
            <div className="example"><b>Ejemplo de uso:</b> <code>?overlay=top&n=5&v=1&card=large&w=500&h=340</code></div>
            <div className="reco"><b>Recomendación:</b> Úsalo para destacar la competencia entre los principales candidatos.</div>
            <div className="guide-preview">
              <iframe
                src={makeUrl({ overlay: 'top', n: '5', v: '1', card: 'large' })}
                style={{ width: '100%', height: '350px', border: 'none' }}
                title="Ranking en Vivo"
              />
            </div>
          </section>
          {/* Overlay: Candidato */}
          <section className="guide-section">
            <h2>Ficha de Candidato</h2>
            <div className="desc"><b>Descripción:</b> Muestra información detallada de un candidato específico.</div>
            <div className="params">
              <b>Parámetros:</b>
              <ul>
                <li><b>id</b>: Identificador único del candidato.</li>
                <li><b>v</b>, <b>e</b>, <b>p</b>, <b>l</b>, <b>r</b>: controles de secciones (1 para mostrar).</li>
                <li><b>card</b>: small/large para tamaño de ficha.</li>
              </ul>
            </div>
            <div className="example"><b>Ejemplo de uso:</b> <code>?overlay=candidate&id={firstId || 'lopez_chau'}&v=1&e=1&p=1&l=1&r=1&w=450&h=600</code></div>
            <div className="reco"><b>Recomendación:</b> Úsalo cuando quieras destacar a un candidato en particular durante la transmisión.</div>
            <div className="guide-preview">
              <iframe
                src={makeUrl({ overlay: 'candidate', id: firstId || 'lopez_chau', v: '1', e: '1', p: '1', l: '1', r: '1' })}
                style={{ width: '100%', height: '80vh', border: 'none' }}
                title="Ficha Candidato"
              />
            </div>
          </section>
          <section className="guide-section">
            <h2>Votación Total</h2>
            <div className="desc"><b>Descripción:</b> Muestra el total de votos acumulados y porcentaje de participación.</div>
            <div className="params">
              <b>Parámetros:</b>
              <ul>
                <li><b>showPct</b>: Mostrar porcentaje de participación.</li>
              </ul>
            </div>
            <div className="example"><b>Ejemplo de uso:</b> <code>?overlay=totals&showPct=1</code></div>
            <div className="reco"><b>Recomendación:</b> Úsalo para mostrar el avance global de la votación.</div>
            <div className="guide-preview">
              <iframe
                src={makeUrl({ overlay: 'totals', showPct: '1' })}
                style={{ width: '100%', height: '150px', border: 'none' }}
                title="Votación Total"
              />            </div>
          </section>
        </div>

        {/* Nota de Uso */}
        <div style={{ marginTop: '48px', fontSize: '14px', color: 'var(--muted)' }}>
          <p>Para usar un overlay simplemente agrega <code>?overlay=&lt;nombre&gt;</code> con los parámetros listados en las secciones anteriores. Todos funcionan de forma independiente del backend; los datos son tomados del cliente.</p>
        </div>

      </div>
    </div>
  );
}
