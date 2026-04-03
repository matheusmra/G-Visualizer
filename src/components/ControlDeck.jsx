const TRAVERSAL_ALGOS  = ['BFS', 'DFS'];
const CLOSURE_ALGOS    = ['FTD', 'FTI'];

const ALGO_LABELS = {
  BFS: 'BFS',
  DFS: 'DFS',
  FTD: 'FTD',
  FTI: 'FTI',
};

export default function ControlDeck({
  algorithm,
  setAlgorithm,
  startNode,
  setStartNode,
  nodeIds,
  onStart,
  onStepForward,
  onStepBackward,
  onPlay,
  onPause,
  onReset,
  isPlaying,
  isDone,
  algoState,
  historyLength,
  speed,
  setSpeed,
}) {
  const canStep = !!algoState && !isDone;
  const canBack = !!algoState && historyLength > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">

      {/* ── Algorithm groups ── */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-500 mr-1 hidden sm:block">Travessia</span>
        <div className="flex rounded-lg overflow-hidden border border-slate-600">
          {TRAVERSAL_ALGOS.map(alg => (
            <button
              key={alg}
              onClick={() => setAlgorithm(alg)}
              className={`px-3 py-1.5 text-sm font-bold transition-colors ${
                algorithm === alg
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {ALGO_LABELS[alg]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-500 mr-1 hidden sm:block">Fecho</span>
        <div className="flex rounded-lg overflow-hidden border border-slate-600">
          {CLOSURE_ALGOS.map(alg => (
            <button
              key={alg}
              onClick={() => setAlgorithm(alg)}
              title={alg === 'FTD' ? 'Fecho Transitivo Direto' : 'Fecho Transitivo Indireto'}
              className={`px-3 py-1.5 text-sm font-bold transition-colors ${
                algorithm === alg
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {ALGO_LABELS[alg]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Start node ── */}
      {nodeIds.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium whitespace-nowrap">Nó inicial</label>
          <select
            value={startNode}
            onChange={e => setStartNode(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {nodeIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Start / Reset ── */}
      {!algoState ? (
        <button
          onClick={onStart}
          disabled={nodeIds.length === 0}
          className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
        >
          ▶ Iniciar
        </button>
      ) : (
        <button
          onClick={onReset}
          className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-bold rounded-lg transition-colors"
        >
          ↺ Reset
        </button>
      )}

      {/* ── Step back ── */}
      <button
        onClick={onStepBackward}
        disabled={!canBack}
        title="Voltar um passo"
        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 text-sm font-bold rounded-lg transition-colors"
      >
        ⏮ Voltar
      </button>

      {/* ── Step forward ── */}
      <button
        onClick={onStepForward}
        disabled={!canStep || isPlaying}
        title="Avançar um passo"
        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 text-sm font-bold rounded-lg transition-colors"
      >
        Passo ⏭
      </button>

      {/* ── Play / Pause ── */}
      {!isPlaying ? (
        <button
          onClick={onPlay}
          disabled={!canStep}
          title="Executar automaticamente"
          className="px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
        >
          ▶ Play
        </button>
      ) : (
        <button
          onClick={onPause}
          className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 text-white text-sm font-bold rounded-lg transition-colors"
        >
          ⏸ Pause
        </button>
      )}

      {/* ── Speed ── */}
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-xs text-slate-400 whitespace-nowrap">Velocidade</label>
        <input
          type="range"
          min={100}
          max={2000}
          step={100}
          value={2100 - speed}
          onChange={e => setSpeed(2100 - Number(e.target.value))}
          className="w-24 accent-violet-500"
          title={`${speed}ms por passo`}
        />
        <span className="text-xs text-slate-500 w-12">{speed}ms</span>
      </div>

      {/* ── Done badge ── */}
      {isDone && (
        <span className="px-2 py-1 bg-green-900/50 border border-green-600/50 text-green-300 text-xs font-semibold rounded-full">
          ✓ Concluído
        </span>
      )}

      {/* ── Empty graph hint ── */}
      {nodeIds.length === 0 && (
        <span className="text-xs text-slate-500 italic">Adicione nós para começar.</span>
      )}
    </div>
  );
}

