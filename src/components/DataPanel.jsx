// Labels per algorithm
const LABELS = {
  BFS: { frontier: 'Queue',         visited: 'Visitados',          order: 'Ordem de Visita' },
  DFS: { frontier: 'Stack',         visited: 'Visitados',          order: 'Ordem de Visita' },
  FTD: { frontier: 'Fila BFS',      visited: 'Alcançáveis',        order: 'Fecho Direto'    },
  FTI: { frontier: 'Fila BFS',      visited: 'Predecessores',      order: 'Fecho Indireto'  },
};

export default function DataPanel({ algorithm, algoState }) {
  const lbl = LABELS[algorithm] ?? LABELS.BFS;
  const isClosure = algorithm === 'FTD' || algorithm === 'FTI';

  if (!algoState) {
    return (
      <div className="flex flex-col gap-3 h-full">
        {isClosure && (
          <ClosureInfo algorithm={algorithm} />
        )}
        <PanelSection title={lbl.frontier}>
          <EmptyHint text="Selecione um nó inicial para começar." />
        </PanelSection>
        <PanelSection title={lbl.visited}><EmptyHint text="—" /></PanelSection>
        <PanelSection title={lbl.order}><EmptyHint text="—" /></PanelSection>
      </div>
    );
  }

  // FTD/FTI share BFS state shape (queue-based)
  const isDFS = algorithm === 'DFS';
  const frontier = isDFS ? (algoState.stack ?? []) : (algoState.queue ?? []);
  const visited = [...algoState.visited];
  const order = algoState.order ?? [];

  return (
    <div className="flex flex-col gap-3 h-full">
      {isClosure && <ClosureInfo algorithm={algorithm} />}

      {/* Frontier (Queue / Stack) */}
      <PanelSection title={`${lbl.frontier} [${frontier.length}]`}>
        {frontier.length === 0 ? (
          <EmptyHint text="Vazio" />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {(isDFS ? [...frontier].reverse() : frontier).map((id, i) => (
              <NodeTag
                key={`${id}-${i}`}
                label={id}
                color="amber"
                badge={isDFS && i === 0 ? 'TOPO' : !isDFS && i === 0 ? 'FRENTE' : null}
              />
            ))}
          </div>
        )}
      </PanelSection>

      {/* Visited / Closure set */}
      <PanelSection title={`${lbl.visited} [${visited.length}]`}>
        {visited.length === 0 ? (
          <EmptyHint text="Vazio" />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {visited.map(id => (
              <NodeTag key={id} label={id} color="green" />
            ))}
          </div>
        )}
      </PanelSection>

      {/* Order / Final closure */}
      <PanelSection
        title={`${lbl.order} [${order.length}]`}
        highlight={isClosure && algoState.done}
      >
        {order.length === 0 ? (
          <EmptyHint text="—" />
        ) : (
          <div className="flex flex-wrap gap-1 items-center">
            {order.map((id, i) => (
              <span key={`${id}-${i}`} className="flex items-center gap-1">
                <span className="text-sm font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded">
                  {id}
                </span>
                {i < order.length - 1 && <span className="text-gray-500 dark:text-gray-500 text-xs">→</span>}
              </span>
            ))}
          </div>
        )}
        {isClosure && algoState.done && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">
            Fecho completo: {order.length} nó{order.length !== 1 ? 's' : ''}
            {algorithm === 'FTD' ? ' alcançáveis' : ' predecessores'}
          </p>
        )}
      </PanelSection>

      {/* Step log */}
      {algoState.stepLog && (
        <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed">{algoState.stepLog}</p>
        </div>
      )}
    </div>
  );
}

// Small explanation card shown at top for closure algorithms
function ClosureInfo({ algorithm }) {
  return (
    <div className="rounded-lg p-2.5 border text-xs leading-relaxed bg-gray-100 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
      {algorithm === 'FTD'
        ? <>
            <span className="font-bold">Fecho Transitivo Direto</span> — encontra todos os nós
            alcançáveis a partir da origem seguindo arestas de saída.
          </>
        : <>
            <span className="font-bold">Fecho Transitivo Indireto</span> — encontra todos os nós
            que possuem um caminho até a origem (grafo invertido).
          </>
      }
    </div>
  );
}

function PanelSection({ title, children, highlight }) {
  return (
    <div className={`rounded-lg p-3 border transition-colors ${
      highlight
        ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700/50'
        : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/50'
    }`}>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function NodeTag({ label, color, badge }) {
  const cls = {
    amber: 'bg-amber-50 dark:bg-amber-900/60 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-600/50',
    green: 'bg-green-50 dark:bg-green-900/60 text-green-700 dark:text-green-200 border-green-200 dark:border-green-600/50',
  }[color];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono text-sm font-bold ${cls}`}>
      {badge && <span className="text-[10px] font-semibold opacity-70">{badge}</span>}
      {label}
    </span>
  );
}

function EmptyHint({ text }) {
  return <p className="text-xs text-gray-500 dark:text-gray-500 italic">{text}</p>;
}

