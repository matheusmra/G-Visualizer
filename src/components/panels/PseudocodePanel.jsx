import { useEffect, useRef } from 'react';
import { PSEUDOCODE } from '../../constants/pseudocode.js';

// Colours per line state
const LINE_CLASS = {
  active: 'bg-[#e8eeff] dark:bg-blue-900/40 text-[#004ac6] dark:text-blue-200 font-semibold',
  normal: 'text-[#515f74] dark:text-slate-400',
  done:   'bg-[#e6fff5] dark:bg-emerald-900/30 text-[#006242] dark:text-emerald-200 font-semibold',
};

export default function PseudocodePanel({ algorithm, algoState }) {
  const pseudo = PSEUDOCODE[algorithm];
  const activeRef = useRef(null);

  // Auto-scroll to first active line
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [algoState?.pseudoLines]);

  if (!pseudo) return null;

  const activeLines = new Set(algoState?.pseudoLines ?? []);
  const isDone      = algoState?.done ?? false;

  return (
    <div className="flex flex-col gap-3">
      {/* Algorithm description */}
      <p className="text-xs text-[#515f74] dark:text-slate-400 leading-relaxed">
        {pseudo.description}
      </p>

      {/* Code block */}
      <div className="rounded-xl border border-[#e0e3e5] dark:border-slate-700 overflow-hidden">
        {!algoState && (
          <div className="px-3 py-1.5 bg-[#f7f9fb] dark:bg-slate-800/80 border-b border-[#e0e3e5] dark:border-slate-700">
            <span className="text-[10px] text-[#737686] dark:text-slate-500 italic">Inicie o algoritmo para ver o destaque</span>
          </div>
        )}

        <div className="py-1 overflow-x-auto bg-white dark:bg-slate-900">
          {pseudo.lines.map((line, i) => {
            const lineNum = i + 1;
            const isActive = activeLines.has(lineNum);
            const cls = isDone && isActive
              ? LINE_CLASS.done
              : isActive
              ? LINE_CLASS.active
              : LINE_CLASS.normal;

            return (
              <div
                key={i}
                ref={isActive && i === Math.min(...[...activeLines].map(n => n - 1)) ? activeRef : null}
                className={`flex gap-3 px-3 py-1 transition-colors duration-200 ${cls}`}
              >
                <span className="w-5 text-right shrink-0 text-[#c3c6d7] dark:text-slate-600 select-none font-mono text-xs leading-5">
                  {lineNum}
                </span>
                <span className="font-mono text-xs whitespace-pre leading-5">{line}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* State legend */}
      <div className="flex flex-wrap gap-3 text-xs text-[#515f74] dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#e8eeff] dark:bg-blue-900/40 border border-[#004ac6]/30 dark:border-blue-500/50" />
          <span>Linha sendo executada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#e6fff5] dark:bg-emerald-900/30 border border-[#00875a]/30 dark:border-emerald-600/40" />
          <span>Concluído</span>
        </div>
      </div>
    </div>
  );
}
