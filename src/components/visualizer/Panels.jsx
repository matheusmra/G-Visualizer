import { PRESETS } from '../../data/presets.js';
import { ALGO_IDS, ALGO_TITLES } from '../../constants/algorithms.js';

export function ControlSidebar({
  presetKey, setPresetKey,
  isCustom, editMode, setEditMode,
  isDirected, setIsDirected,
  handleActivatePresetEdit, handleClearGraphWithReset, handleRandomize,
  nodeIds, startNode, setStartNode,
  algoState, start, handleReset,
  speed, setSpeed,
  isDone, history
}) {
  return (
    <aside className="w-52 shrink-0 border-r border-[#e0e3e5] dark:border-slate-800 flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#004ac6] dark:text-blue-400">Interação</p>
          <p className="text-[10px] tracking-widest uppercase text-[#737686] dark:text-slate-500 mt-0.5">Ferramentas</p>
        </div>

        <div>
          <label className="text-[10px] tracking-widest uppercase text-[#737686] dark:text-slate-500 block mb-1.5">Grafo atual</label>
          <select
            value={presetKey}
            onChange={e => setPresetKey(e.target.value)}
            className="w-full bg-[#f2f4f6] dark:bg-slate-800 border border-[#c3c6d7]/50 dark:border-slate-700 text-[#191c1e] dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#004ac6] dark:focus:border-blue-500"
            aria-label="Selecionar grafo"
          >
            {Object.entries(PRESETS).map(([key, p]) => (
              <option key={key} value={key}>{p.name}</option>
            ))}
            <option value="custom">Grafo Customizado</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          {!isCustom ? (
            <>
              <button
                onClick={handleActivatePresetEdit}
                aria-label="Ativar Modo Edição"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#c3c6d7]/50 dark:border-slate-700 text-[#515f74] dark:text-slate-400 hover:border-[#004ac6] hover:text-[#004ac6] dark:hover:text-blue-400 hover:bg-[#f0f4ff] dark:hover:bg-blue-950/30 transition-all text-xs font-medium bg-[#f7f9fb] dark:bg-slate-800/60"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }} aria-hidden="true">edit</span>
                Ativar Modo Edição
              </button>
              <div className="flex items-center gap-2 px-3 py-2 opacity-40 cursor-not-allowed">
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }} aria-hidden="true">lock</span>
                <span className="text-xs text-[#515f74] dark:text-slate-400">Ferramentas bloqueadas</span>
              </div>
            </>
          ) : (
            <>
              {[
                { id: 'addNode', label: 'Adicionar Nó',     icon: 'add_circle' },
                { id: 'addEdge', label: 'Adicionar Aresta', icon: 'timeline' },
                { id: 'delete',  label: 'Excluir',          icon: 'backspace' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setEditMode(editMode === t.id ? null : t.id)}
                  aria-label={t.label}
                  aria-pressed={editMode === t.id}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                    editMode === t.id
                      ? 'bg-[#004ac6] text-white border-[#004ac6] shadow-sm shadow-[#004ac6]/30'
                      : 'bg-[#f7f9fb] dark:bg-slate-800/60 text-[#515f74] dark:text-slate-400 border-[#c3c6d7]/50 dark:border-slate-700 hover:border-[#004ac6] hover:text-[#004ac6] dark:hover:text-blue-400'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }} aria-hidden="true">{t.icon}</span>
                  {t.label}
                </button>
              ))}
              <button
                onClick={handleClearGraphWithReset}
                aria-label="Limpar Canvas"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border bg-[#f7f9fb] dark:bg-slate-800/60 text-[#515f74] dark:text-slate-400 border-[#c3c6d7]/50 dark:border-slate-700 hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }} aria-hidden="true">delete_sweep</span>
                Limpar Canvas
              </button>
              <button
                onClick={handleRandomize}
                aria-label="Aleatorizar Grafo"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border bg-[#f7f9fb] dark:bg-slate-800/60 text-[#515f74] dark:text-slate-400 border-[#c3c6d7]/50 dark:border-slate-700 hover:border-[#004ac6] hover:text-[#004ac6] dark:hover:text-blue-400 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }} aria-hidden="true">shuffle</span>
                Aleatorizar
              </button>

              <div className="mt-2 flex items-center justify-between px-3 py-2 bg-[#f0f4ff] dark:bg-blue-900/20 border border-[#004ac6]/10 dark:border-blue-700/30 rounded-xl">
                <span className="text-[10px] font-bold text-[#004ac6] dark:text-blue-300 uppercase tracking-wider">Direcionado</span>
                <button
                  onClick={() => setIsDirected(!isDirected)}
                  className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${isDirected ? 'bg-[#004ac6]' : 'bg-[#c3c6d7] dark:bg-slate-700'}`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${isDirected ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="h-px bg-[#e0e3e5] dark:bg-slate-800" />

        {nodeIds.length > 0 && (
          <div>
            <label className="text-[10px] tracking-widest uppercase text-[#737686] dark:text-slate-500 block mb-1.5">Nó Inicial</label>
            <select
              value={startNode}
              onChange={e => setStartNode(e.target.value)}
              disabled={!!algoState}
              aria-label="Selecionar nó inicial"
              className="w-full bg-[#f2f4f6] dark:bg-slate-800 border border-[#c3c6d7]/50 dark:border-slate-700 text-[#191c1e] dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#004ac6] disabled:opacity-40"
            >
              {nodeIds.map(id => <option key={id} value={id}>{id}</option>)}
            </select>
          </div>
        )}

        {!algoState ? (
          <button
            onClick={() => start(startNode || nodeIds[0])}
            disabled={nodeIds.length === 0}
            aria-label="Iniciar algoritmo"
            className="w-full py-2.5 rounded-xl text-xs font-bold font-headline bg-[#004ac6] hover:bg-[#2563eb] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm shadow-[#004ac6]/20"
          >
            Iniciar
          </button>
        ) : (
          <button
            onClick={handleReset}
            aria-label="Resetar algoritmo"
            className="w-full py-2.5 rounded-xl text-xs font-bold font-headline bg-[#f2f4f6] dark:bg-slate-800 text-[#515f74] dark:text-slate-300 border border-[#c3c6d7]/50 dark:border-slate-700 hover:bg-[#e0e3e5] dark:hover:bg-slate-700 transition-colors"
          >
            Resetar
          </button>
        )}

        <div>
          <label className="text-[10px] tracking-widest uppercase text-[#737686] dark:text-slate-500 block mb-1.5">Velocidade</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={100}
              max={2000}
              step={100}
              value={2100 - speed}
              onChange={e => setSpeed(2100 - Number(e.target.value))}
              aria-label="Velocidade da execução"
              className="flex-1 h-1 accent-[#004ac6]"
            />
            <span className="text-[10px] text-[#737686] dark:text-slate-500 w-10 text-right shrink-0">{speed}ms</span>
          </div>
        </div>

        {nodeIds.length === 0 && (
          <p className="text-[10px] text-[#737686] dark:text-slate-500 italic leading-relaxed">
            Adicione nós para começar ou escolha um grafo pré-carregado.
          </p>
        )}
      </div>

      <div className="shrink-0 border-t border-[#e0e3e5] dark:border-slate-800 p-4">
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#737686] dark:text-slate-500 mb-2">Progresso</p>
        <div className="h-1 bg-[#e0e3e5] dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#004ac6] rounded-full transition-all duration-500"
            style={{ width: isDone ? '100%' : algoState ? `${Math.min(history.length * 5, 88)}%` : '0%' }}
          />
        </div>
        <p className="mt-1.5 text-xs text-[#515f74] dark:text-slate-400">
          {algoState
            ? isDone
              ? `Concluído · ${history.length + 1} passos`
              : `Passo ${history.length + 1}`
            : nodeIds.length === 0 ? 'Adicione nós' : 'Não iniciado'}
        </p>
      </div>
    </aside>
  );
}

export function PlaybackBar({ stepBackward, canBack, isPlaying, algoState, start, startNode, nodeIds, isDone, play, pause, stepForward, canStep, history }) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <div className="glass-panel px-6 py-3.5 rounded-2xl flex items-center gap-5 shadow-xl border border-white/60 dark:border-slate-700/50">
        <button
          onClick={stepBackward}
          disabled={!canBack}
          aria-label="Voltar um passo"
          className="text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          title="Voltar um passo"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }} aria-hidden="true">skip_previous</span>
        </button>

        {!isPlaying ? (
          <button
            onClick={() => { if (!algoState) start(startNode || nodeIds[0]); play(); }}
            disabled={isDone || nodeIds.length === 0}
            aria-label="Executar"
            className="w-12 h-12 rounded-full bg-[#004ac6] hover:bg-[#2563eb] text-white flex items-center justify-center shadow-lg shadow-[#004ac6]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105"
            title="Executar"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px', fontVariationSettings: "'FILL' 1" }} aria-hidden="true">play_arrow</span>
          </button>
        ) : (
          <button
            onClick={pause}
            aria-label="Pausar"
            className="w-12 h-12 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-lg shadow-[#004ac6]/30 hover:scale-105 transition-all"
            title="Pausar"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px', fontVariationSettings: "'FILL' 1" }} aria-hidden="true">pause</span>
          </button>
        )}

        <button
          onClick={stepForward}
          disabled={!canStep || isPlaying}
          aria-label="Avançar um passo"
          className="text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          title="Avançar um passo"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }} aria-hidden="true">skip_next</span>
        </button>

        <div className="w-px h-7 bg-[#c3c6d7]/60 dark:bg-slate-600" />

        <div className="text-center min-w-[52px]">
          <span className="text-[9px] font-bold tracking-[0.15em] text-[#737686] dark:text-slate-500 uppercase block">
            {isDone ? 'Fim' : 'Passo'}
          </span>
          <span className="text-sm font-mono font-bold text-[#004ac6] dark:text-blue-400">
            {algoState ? String(history.length + 1).padStart(2, '0') : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}
