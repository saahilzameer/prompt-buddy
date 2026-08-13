import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'notification';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`flex items-center gap-3 min-w-[300px] p-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
                toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                toast.type === 'notification' ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' :
                'bg-white/10 border-white/10 text-white/80'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
              {toast.type === 'notification' && <Bell className="w-5 h-5 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
              
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              
              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
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
