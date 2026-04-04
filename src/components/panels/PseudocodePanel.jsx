import { useEffect, useRef } from 'react';
import { PSEUDOCODE } from '../../constants/pseudocode.js';

// Colours per line state
const LINE_CLASS = {
  active: 'bg-indigo-100 dark:bg-indigo-700/70 text-indigo-900 dark:text-indigo-100 font-semibold',
  normal: 'text-gray-600 dark:text-gray-400',
  done:   'bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-200 font-semibold',
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
      <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50 text-xs text-gray-700 dark:text-gray-400 leading-relaxed">
        {pseudo.description}
      </div>

      {/* Code block */}
      <div className="rounded-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/50">
          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">pseudocódigo</span>
          {!algoState && (
            <span className="text-[10px] text-gray-500 dark:text-gray-600 italic">Inicie o algoritmo para ver o destaque</span>
          )}
        </div>

        <div className="py-2 overflow-x-auto">
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
                className={`flex gap-2 px-3 py-0.5 transition-colors duration-200 ${cls}`}
              >
                <span className="w-5 text-right shrink-0 text-gray-500 dark:text-gray-600 select-none font-mono text-xs">
                  {lineNum}
                </span>
                <span className="font-mono text-sm whitespace-pre">{line}</span>
                {isActive && (
                  <span className="ml-auto shrink-0 text-[10px] text-indigo-500/70 italic hidden sm:block">
                    ← aqui
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* State legend */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-indigo-100 dark:bg-indigo-700/70 border border-indigo-400 dark:border-indigo-500" />
          <span>Linha sendo executada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-100 dark:bg-green-800/50 border border-green-400 dark:border-green-600" />
          <span>Concluído</span>
        </div>
      </div>
    </div>
  );
}
