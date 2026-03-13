import { motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="overlay-view" style={{ background: 'var(--bg)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fb)', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div style={{ display: 'inline-flex', padding: '20px', background: 'var(--red)10', borderRadius: '50%', marginBottom: '25px', border: '1px solid var(--red)30' }}>
            <WifiOff size={48} color="var(--red)" />
        </div>
        <h1 style={{ fontSize: '64px', fontWeight: 900, margin: '0 0 10px', color: 'var(--text)' }}>404</h1>
        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 20px', color: 'var(--gold)', textTransform: 'uppercase' }}>Ruta no encontrada</h2>
        <p style={{ color: 'var(--muted)', maxWidth: '400px', margin: '0 auto 30px', lineHeight: 1.6 }}>
            Parece que te has perdido en el mapa electoral. La página que buscas no existe o ha sido movida.
        </p>
        <button className="sort-btn" style={{ fontSize: '16px', padding: '12px 30px' }} onClick={() => window.location.href = '/'}>
          VOLVER AL INICIO
        </button>
      </motion.div>
    </div>
  );
}
