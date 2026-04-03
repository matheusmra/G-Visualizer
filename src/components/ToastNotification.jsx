import { useEffect } from 'react';

const ICONS = {
  success: '✓',
  warning: '⚠',
  info:    'ℹ',
  error:   '✕',
};

const STYLES = {
  success: 'bg-green-900/90 border-green-600/60 text-green-100',
  warning: 'bg-amber-900/90 border-amber-600/60 text-amber-100',
  info:    'bg-slate-800/95 border-slate-600/60 text-slate-200',
  error:   'bg-red-900/90 border-red-600/60 text-red-100',
};

const ICON_STYLES = {
  success: 'text-green-400',
  warning: 'text-amber-400',
  info:    'text-slate-400',
  error:   'text-red-400',
};

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 5000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const type = toast.type ?? 'info';

  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-xl border shadow-2xl
        max-w-sm w-full animate-in slide-in-from-left-2 fade-in
        ${STYLES[type] ?? STYLES.info}
      `}
    >
      {/* Icon */}
      <span className={`text-xl font-bold shrink-0 mt-0.5 ${ICON_STYLES[type]}`}>
        {ICONS[type]}
      </span>

      {/* Message */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-xs font-bold uppercase tracking-wide opacity-80 mb-0.5">
            {toast.title}
          </p>
        )}
        <p className="text-sm leading-relaxed break-words">{toast.message}</p>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity text-sm mt-0.5"
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 flex flex-col-reverse gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
