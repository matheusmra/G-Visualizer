const TRAVERSAL_ALGOS = ['BFS', 'DFS'];
const CLOSURE_ALGOS   = ['FTD', 'FTI'];

const ALGO_TITLES = {
  BFS: 'Busca em Largura',
  DFS: 'Busca em Profundidade',
  FTD: 'Fecho Transitivo Direto',
  FTI: 'Fecho Transitivo Indireto',
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
    <div className="flex flex-wrap items-center gap-2">

      {/* Traversal group */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400 dark:text-gray-500 mr-1 hidden sm:block">Travessia</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {TRAVERSAL_ALGOS.map(alg => (
            <button
              key={alg}
              onClick={() => setAlgorithm(alg)}
              title={ALGO_TITLES[alg]}
              className={`px-3 py-1.5 text-sm font-bold transition-colors ${
                algorithm === alg
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {alg}
            </button>
          ))}
        </div>
      </div>

      {/* Closure group */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400 dark:text-gray-500 mr-1 hidden sm:block">Fecho</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {CLOSURE_ALGOS.map(alg => (
            <button
              key={alg}
              onClick={() => setAlgorithm(alg)}
              title={ALGO_TITLES[alg]}
              className={`px-3 py-1.5 text-sm font-bold transition-colors ${
                algorithm === alg
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {alg}
            </button>
          ))}
        </div>
      </div>

      {/* Start node */}
      {nodeIds.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">Nó inicial</label>
          <select
            value={startNode}
            onChange={e => setStartNode(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {nodeIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
      )}

      {/* Start / Reset */}
      {!algoState ? (
        <button
          onClick={onStart}
          disabled={nodeIds.length === 0}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
        >
          Iniciar
        </button>
      ) : (
        <button
          onClick={onReset}
          className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
        >
          Resetar
        </button>
      )}

      {/* Step back */}
      <button
        onClick={onStepBackward}
        disabled={!canBack}
        title="Voltar um passo"
        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
      >
        Voltar
      </button>

      {/* Step forward */}
      <button
        onClick={onStepForward}
        disabled={!canStep || isPlaying}
        title="Avan\u00e7ar um passo"
        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
      >
        Passo
      </button>

      {/* Play / Pause */}
      {!isPlaying ? (
        <button
          onClick={onPlay}
          disabled={!canStep}
          title="Executar automaticamente"
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
        >
          Play
        </button>
      ) : (
        <button
          onClick={onPause}
          className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-lg transition-colors"
        >
          Pausar
        </button>
      )}

      {/* Speed */}
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">Velocidade</label>
        <input
          type="range"
          min={100}
          max={2000}
          step={100}
          value={2100 - speed}
          onChange={e => setSpeed(2100 - Number(e.target.value))}
          className="w-24 accent-indigo-600"
          title={`${speed}ms por passo`}
        />
        <span className="text-xs text-gray-400 dark:text-gray-500 w-12">{speed}ms</span>
      </div>

      {/* Done badge */}
      {isDone && (
        <span className="px-2 py-1 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
          Concluído
        </span>
      )}

      {/* Empty graph hint */}
      {nodeIds.length === 0 && (
        <span className="text-xs text-gray-400 dark:text-gray-500 italic">Adicione nós para começar.</span>
      )}
    </div>
  );
}


