export function AdjacencyList({ adjList, isDirected }) {
  return (
    <div>
      <p className="text-[10px] text-[#737686] dark:text-slate-500 mb-2">
        {isDirected ? 'Cada nó lista seus sucessores diretos.' : 'Cada nó lista seus vizinhos.'}
      </p>
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#c3c6d7]/40 dark:border-slate-800 font-mono text-xs p-3 overflow-x-auto shadow-sm">
        {Object.entries(adjList).sort().map(([node, neighbors]) => (
          <div key={node} className="mb-1 last:mb-0 flex items-start gap-1 min-w-0">
            <span className="text-[#004ac6] dark:text-blue-400 font-bold shrink-0">{node}</span>
            <span className="text-[#737686] dark:text-slate-500 shrink-0">{isDirected ? ' →' : ' -'}</span>
            <span className="flex flex-wrap gap-x-1">
              {neighbors.length > 0
                ? neighbors.map((n, i) => (
                    <span key={`${n}-${i}`}>
                      <span className="text-[#006242] dark:text-emerald-400 font-semibold">{n}</span>
                      {i < neighbors.length - 1 && <span className="text-[#737686] dark:text-slate-500">,</span>}
                    </span>
                  ))
                : <span className="text-[#737686] dark:text-slate-500">∅</span>
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
