import { useEffect } from 'react';

const ACCENT = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  info:    'bg-gray-400 dark:bg-gray-500',
  error:   'bg-red-500',
};

const TITLE_COLOR = {
  success: 'text-green-700 dark:text-green-400',
  warning: 'text-amber-700 dark:text-amber-400',
  info:    'text-gray-600 dark:text-gray-400',
  error:   'text-red-700 dark:text-red-400',
};

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 5000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const type = toast.type ?? 'info';

  return (
    <div className="flex rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl max-w-sm w-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Colored left accent */}
      <div className={`w-1 shrink-0 ${ACCENT[type] ?? ACCENT.info}`} />

      {/* Content */}
      <div className="flex items-start gap-3 p-3 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className={`text-xs font-bold mb-0.5 ${TITLE_COLOR[type]}`}>
              {toast.title}
            </p>
          )}
          <p className="text-sm leading-relaxed break-words text-gray-600 dark:text-gray-300">{toast.message}</p>
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors leading-none text-base mt-0.5"
          aria-label="Fechar"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col-reverse gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}


