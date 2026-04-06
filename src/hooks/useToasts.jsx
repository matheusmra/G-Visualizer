import { useState, useCallback } from 'react';

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ToastContainer = () => {
    if (toasts.length === 0) return null;
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`min-w-80 max-w-sm p-4 rounded-2xl shadow-xl flex items-start gap-4 pointer-events-auto transition-all animate-bounce-in border ${
              toast.type === 'error'
                ? 'bg-[#ffdad6] text-[#ba1a1a] dark:bg-red-950/80 dark:text-red-300 border-[#ba1a1a]/20 dark:border-red-900'
                : toast.type === 'success'
                  ? 'bg-[#d3efdc] text-[#006242] dark:bg-emerald-950/80 dark:text-emerald-300 border-[#006242]/20 dark:border-emerald-900'
                  : 'bg-slate-900/90 text-slate-100 dark:bg-slate-100 dark:text-slate-900 border-slate-700 dark:border-slate-300'
            }`}
             role="alert"
             aria-live="assertive"
          >
            <span className="material-symbols-outlined shrink-0 mt-0.5" aria-hidden="true" style={{ fontSize: '20px' }}>
              {toast.type === 'error' ? 'error' : toast.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <div className="flex-1 min-w-0">
              {toast.title && <p className="text-sm font-bold leading-tight mb-0.5">{toast.title}</p>}
              <p className="text-xs opacity-90 leading-relaxed font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="opacity-40 hover:opacity-100 transition-opacity mt-0.5"
              aria-label="Fechar notificação"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">close</span>
            </button>
          </div>
        ))}
      </div>
    );
  };

  return { toasts, addToast, ToastContainer };
}
