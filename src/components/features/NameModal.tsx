import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface NameModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function NameModal({ show, onClose, onSubmit }: NameModalProps) {
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (show) {
      setName('');
      setTouched(false);
    }
  }, [show]);

  // Regex for valid names: Letters, spaces, and Spanish accents/characters
  // Prevents numbers, symbols, and "weird" characters
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
  
  const isValid = useMemo(() => {
    const trimmed = name.trim();
    return trimmed.length >= 3 && nameRegex.test(name);
  }, [name]);

  const hasError = useMemo(() => {
    return touched && name.length > 0 && !nameRegex.test(name);
  }, [name, touched]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // We allow typing anything but show error if invalid
    // Alternatively, we could filter characters, but showing error is better UX
    setName(value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isValid) {
      onSubmit(name.trim());
    } else {
      setTouched(true);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="ov open" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="modal"
            style={{ maxWidth: '400px' }}
          >
            <button className="mx" onClick={onClose}><X size={13} /></button>
            
            <div style={{ padding: '32px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'var(--gold)15', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 16px',
                  color: 'var(--gold)',
                  border: '1px solid var(--gold)30'
                }}>
                  <User size={24} />
                </div>
                <h2 style={{ fontFamily: 'var(--fd)', fontSize: '24px', letterSpacing: '0.04em', color: 'var(--gold)', marginBottom: '8px' }}>
                  REGISTRA TU NOMBRE
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  Ingresa tu nombre completo para continuar con el proceso de votación.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={handleInputChange}
                    onBlur={() => setTouched(true)}
                    placeholder="Escribe tu nombre aquí..."
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${hasError ? 'var(--red)' : touched && isValid ? 'var(--gold)' : 'var(--bord2)'}`,
                      borderRadius: '12px',
                      padding: '14px 16px',
                      color: '#fff',
                      fontSize: '15px',
                      fontFamily: 'var(--fb)',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                  />
                  {touched && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ 
                        position: 'absolute', 
                        right: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: hasError ? 'var(--red)' : isValid ? 'var(--gold)' : 'var(--muted)' 
                      }}
                    >
                      {hasError ? <AlertCircle size={18} /> : isValid ? <User size={18} /> : null}
                    </motion.div>
                  )}
                </div>

                <div style={{ height: '20px', marginBottom: '12px' }}>
                  {hasError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }}
                      style={{ fontSize: '11px', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      No se permiten números ni caracteres especiales.
                    </motion.div>
                  )}
                  {!hasError && touched && name.trim().length < 3 && name.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }}
                      style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      El nombre es demasiado corto.
                    </motion.div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isValid}
                  style={{
                    width: '100%',
                    background: isValid ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
                    color: isValid ? '#000' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontFamily: 'var(--fd)',
                    fontSize: '18px',
                    letterSpacing: '0.06em',
                    cursor: isValid ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  CONTINUAR <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
