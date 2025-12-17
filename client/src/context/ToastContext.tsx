import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage, ToastType } from '../types';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const timerIds = React.useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timerIds.current.forEach((timer) => clearTimeout(timer));
      timerIds.current.clear();
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    // Clear specific timer
    if (timerIds.current.has(id)) {
      clearTimeout(timerIds.current.get(id)!);
      timerIds.current.delete(id);
    }
  };

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    const timer = setTimeout(() => {
      removeToast(id);
    }, 4000);

    timerIds.current.set(id, timer);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              layout
              className="pointer-events-auto clay-card p-4 rounded-2xl flex items-center gap-3 shadow-2xl bg-white/80 border border-white/60 backdrop-blur-md"
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner
                ${toast.type === 'success' ? 'bg-green-50 text-green-600' : ''}
                ${toast.type === 'error' ? 'bg-red-50 text-red-600' : ''}
                ${toast.type === 'info' ? 'bg-rose-50 text-rose-600' : ''}
              `}>
                {toast.type === 'success' && <CheckCircle size={20} />}
                {toast.type === 'error' && <AlertCircle size={20} />}
                {toast.type === 'info' && <Info size={20} />}
              </div>
              <p className="flex-1 text-sm font-bold text-stone-800">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="text-stone-400 hover:text-rose-500 transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};