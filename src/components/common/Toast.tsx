import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 text-sm font-medium"
      style={{
        backgroundColor:
          toast.type === 'success'
            ? '#10385F'
            : toast.type === 'error'
            ? '#7f1d1d'
            : '#1456A0',
        borderColor:
          toast.type === 'success'
            ? '#22c55e'
            : toast.type === 'error'
            ? '#ef4444'
            : '#60a5fa',
        color: '#ffffff',
      }}
    >
      {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
      {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
      {toast.type === 'info' && <Info className="w-5 h-5 text-sky-300 shrink-0" />}
      <span>{toast.message}</span>
    </div>
  );
};
