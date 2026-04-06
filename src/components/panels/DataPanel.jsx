// Labels per algorithm
const LABELS = {
  BFS:  { frontier: 'Fila',     frontierType: 'FIFO',   visited: 'Visitados',     order: 'Ordem de Visita'  },
  DFS:  { frontier: 'Pilha',    frontierType: 'LIFO',   visited: 'Visitados',     order: 'Ordem de Visita'  },
  FTD:  { frontier: 'Fila BFS', frontierType: null,     visited: 'Alcançáveis',   order: 'Fecho Direto'     },
  FTI:  { frontier: 'Fila BFS', frontierType: null,     visited: 'Predecessores', order: 'Fecho Indireto'   },
  TOPO: { frontier: 'Fila',     frontierType: 'grau 0', visited: 'Processados',   order: 'Ordem Topológica' },
};

export default function DataPanel({ algorithm, algoState }) {
  const lbl = LABELS[algorithm] ?? LABELS.BFS;
  const isClosure = algorithm === 'FTD' || algorithm === 'FTI';

  if (!algoState) {
    return (
      <div className="flex flex-col gap-3">
        {isClosure && (
          <ClosureInfo algorithm={algorithm} />
        )}
        <Card title={lbl.frontier} type={lbl.frontierType}>
          <EmptyHint text="Selecione um nó inicial para começar." />
        </Card>
        <Card title={lbl.visited}><EmptyHint text="—" /></Card>
        <Card title={lbl.order}><EmptyHint text="—" /></Card>
      </div>
    );
  }

  // FTD/FTI share BFS state shape (queue-based)
  const isDFS     = algorithm === 'DFS';
  const frontier  = isDFS ? (algoState.stack ?? []) : (algoState.queue ?? []);
  const visited   = [...algoState.visited];
  const order     = algoState.order ?? [];

  return (
    <div className="flex flex-col gap-3 h-full">
      {isClosure && <ClosureInfo algorithm={algorithm} />}

      {/* Frontier (Fila / Pilha) */}
      <Card title={lbl.frontier} type={lbl.frontierType} count={frontier.length}>
        {frontier.length === 0 ? (
          <EmptyHint text="Vazio" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {(isDFS ? [...frontier].reverse() : frontier).map((id, i) => (
              <QueueTag
                key={`${id}-${i}`}
                label={id}
                isFront={i === 0}
                frontLabel={isDFS ? 'TOPO' : 'FRENTE'}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Visitados / Fecho */}
      <Card title={lbl.visited} count={visited.length}>
        {visited.length === 0 ? (
          <EmptyHint text="Vazio" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {visited.map(id => <VisitedTag key={id} label={id} />)}
          </div>
        )}
      </Card>

      {/* Ordem / Fecho final */}
      <Card title={lbl.order} count={order.length} highlight={isClosure && algoState.done}>
        {order.length === 0 ? (
          <EmptyHint text="—" />
        ) : (
          <div className="flex flex-wrap gap-1 items-center">
            {order.map((id, i) => (
              <span key={`${id}-${i}`} className="flex items-center gap-1">
                <span className="text-sm font-mono font-bold text-[#004ac6] dark:text-blue-400 bg-[#f0f4ff] dark:bg-blue-950/50 px-2 py-0.5 rounded-lg">
                  {id}
                </span>
                {i < order.length - 1 && (
                  <span className="text-[#c3c6d7] dark:text-slate-600 text-xs">→</span>
                )}
              </span>
            ))}
          </div>
        )}
        {isClosure && algoState.done && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-semibold">
            Fecho completo: {order.length} nó{order.length !== 1 ? 's' : ''}
            {algorithm === 'FTD' ? ' alcançáveis' : ' predecessores'}
          </p>
        )}
      </Card>

      {/* Log do passo */}
      {algoState.stepLog && (
        <div className="mt-auto pt-2 border-t border-[#e0e3e5] dark:border-slate-700">
          <p className="text-xs text-[#515f74] dark:text-slate-400 italic leading-relaxed">
            {algoState.stepLog}
          </p>
        </div>
      )}
    </div>
  );
}

// Small explanation card shown at top for closure algorithms
function ClosureInfo({ algorithm }) {
  return (
    <div className="rounded-xl p-3 border text-xs leading-relaxed border-[#e0e3e5] dark:border-slate-700 bg-[#f7f9fb] dark:bg-slate-800/60 text-[#515f74] dark:text-slate-400">
      {algorithm === 'FTD'
        ? <>
            <span className="font-bold text-[#191c1e] dark:text-slate-200">Fecho Transitivo Direto</span> — encontra todos os nós
            alcançáveis a partir da origem seguindo arestas de saída.
          </>
        : <>
            <span className="font-bold text-[#191c1e] dark:text-slate-200">Fecho Transitivo Indireto</span> — encontra todos os nós
            que possuem um caminho até a origem (grafo invertido).
          </>
      }
    </div>
  );
}

function Card({ title, type, count, children, highlight }) {
  return (
    <div className={`rounded-xl border overflow-hidden transition-colors ${
      highlight
        ? 'border-emerald-200 dark:border-emerald-700/50'
        : 'border-[#e0e3e5] dark:border-slate-700'
    }`}>
      <div className={`flex items-center justify-between px-3 py-2 border-b ${
        highlight
          ? 'border-emerald-200 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-950/20'
          : 'border-[#e0e3e5] dark:border-slate-700 bg-[#f7f9fb] dark:bg-slate-800/60'
      }`}>
        <div className="flex items-center gap-1.5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#515f74] dark:text-slate-400">
            {title}
          </h3>
          {type && (
            <span className="text-[9px] font-bold text-[#737686] dark:text-slate-500 bg-[#e0e3e5] dark:bg-slate-700 rounded px-1 py-px leading-none">
              {type}
            </span>
          )}
        </div>
        {count !== undefined && (
          <span className="text-[10px] font-bold text-[#515f74] dark:text-slate-400 tabular-nums">
            {count}
          </span>
        )}
      </div>
      <div className="p-3 bg-white dark:bg-slate-900/30 min-h-[44px]">
        {children}
      </div>
    </div>
  );
}

function QueueTag({ label, isFront, frontLabel }) {
  return (
    <div className="relative inline-flex mt-2">
      {isFront && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black bg-[#004ac6] text-white rounded px-1 py-px leading-none whitespace-nowrap z-10">
          {frontLabel}
        </span>
      )}
      <span className="w-10 h-10 rounded-2xl border-2 border-[#c3c6d7] dark:border-slate-600 bg-[#f7f9fb] dark:bg-slate-800 text-[#191c1e] dark:text-slate-200 font-mono text-base font-bold inline-flex items-center justify-center">
        {label}
      </span>
    </div>
  );
}

function VisitedTag({ label }) {
  return (
    <span className="w-8 h-8 rounded-full bg-[#e6fff5] dark:bg-emerald-900/40 border-2 border-[#00875a]/30 dark:border-emerald-600/50 text-[#006242] dark:text-emerald-300 font-mono text-sm font-bold inline-flex items-center justify-center">
      {label}
    </span>
  );
}

function EmptyHint({ text }) {
  return <p className="text-xs text-[#737686] dark:text-slate-500 italic">{text}</p>;
}
