import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle } from 'lucide-react';

interface ToastProps {
  err: string | null;
  msg: string | null;
}

export default function Toast({ err, msg }: ToastProps) {
  return (
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
  );
}
