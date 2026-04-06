import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import GraphCanvas from '../components/canvas/GraphCanvas.jsx';
import DataPanel from '../components/panels/DataPanel.jsx';
import PseudocodePanel from '../components/panels/PseudocodePanel.jsx';
import { ToastContainer } from '../components/ui/ToastNotification.jsx';
import ConnectivityPanel from '../components/panels/ConnectivityPanel.jsx';
import GraphRepresentationPanel from '../components/panels/GraphRepresentationPanel.jsx';
import { useAlgorithm } from '../hooks/useAlgorithm.js';
import { usePlayback } from '../hooks/usePlayback.js';
import { useGraphPreset } from '../hooks/useGraphPreset.js';
import { buildAdjMap, buildDirectedAdjMap, buildReverseAdjMap } from '../utils/graphHelpers.js';
import { ALGO_IDS, ALGO_TITLES } from '../constants/algorithms.js';
import { PRESETS } from '../data/presets.js';

const ALGO_SUBTITLES = {
  BFS:  'Travessia por nível com fila FIFO',
  DFS:  'Exploração recursiva em profundidade',
  FTD:  'Todos os nós alcançáveis a partir da origem',
  FTI:  'Todos os predecessores da origem (arestas invertidas)',
  TOPO: 'Ordenação linear de grafos acíclicos dirigidos',
};

let toastId = 0;

export default function VisualizerPage() {
  const { algorithm: algoParam }        = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Algorithm selector ────────────────────────────────────────────────────
  const [algorithm, setAlgorithm] = useState(
    ALGO_IDS.includes(algoParam) ? algoParam : 'BFS'
  );
  const [startNode, setStartNode] = useState('');

  // ── Graph preset / custom graph ───────────────────────────────────────────
  const {
    presetKey, setPresetKey,
    customElements,
    isDirected, setIsDirected,
    editMode, setEditMode,
    isCustom, currentElements, currentLayout, currentIsDirected,
    nodeIds, handleGraphChange, handleClearGraph,
  } = useGraphPreset(searchParams.get('preset') ?? 'cyclic', setSearchParams);

  // ── Adjacency maps (derived) ──────────────────────────────────────────────
  const adjMap = useMemo(
    () => currentIsDirected ? buildDirectedAdjMap(currentElements) : buildAdjMap(currentElements),
    [currentElements, currentIsDirected],
  );
  const reverseMap     = useMemo(() => buildReverseAdjMap(currentElements),   [currentElements]);
  const directedAdjMap = useMemo(() => buildDirectedAdjMap(currentElements),  [currentElements]);

  // ── Algorithm execution ───────────────────────────────────────────────────
  const {
    algoState, history,
    start, stepForward, stepBackward, reset,
    tickForInterval, skipShownRef,
  } = useAlgorithm(algorithm, adjMap, reverseMap, directedAdjMap);

  // ── Playback ──────────────────────────────────────────────────────────────
  const { isPlaying, setIsPlaying, play, pause, speed, setSpeed, setTickFn } = usePlayback();

  // Keep the interval's tick function up to date
  useEffect(() => {
    setTickFn(() => tickForInterval(() => setIsPlaying(false)));
  }, [tickForInterval, setTickFn, setIsPlaying]);

  // ── Coordination: reset on preset or algorithm change ────────────────────
  useEffect(() => {
    pause();
    reset();
    setStartNode(nodeIds[0] ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetKey]);

  useEffect(() => {
    pause();
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  // ── UI ────────────────────────────────────────────────────────────────────
  const [rightPanel, setRightPanel] = useState('data');
  const [toasts,     setToasts]     = useState([]);
  const [connectivityHighlight, setConnectivityHighlight] = useState(null);

  const handleReset = useCallback(() => { pause(); reset(); }, [pause, reset]);

  // ── Degree-enriched elements (for canvas labels) ──────────────────────────
  const enrichedElements = useMemo(() => {
    const outDeg = {}, inDeg = {};
    currentElements.nodes.forEach(n => { outDeg[n.data.id] = 0; inDeg[n.data.id] = 0; });
    currentElements.edges.forEach(({ data: { source, target } }) => {
      if (outDeg[source] !== undefined) outDeg[source] += 1;
      if (inDeg[target]  !== undefined) inDeg[target]  += 1;
    });
    return {
      nodes: currentElements.nodes.map(n => {
        const id  = n.data.id;
        const deg = currentIsDirected
          ? `\u2191${inDeg[id]} \u2193${outDeg[id]}`
          : String(inDeg[id] + outDeg[id]);
        return { ...n, data: { ...n.data, label: `${id}\n${deg}` } };
      }),
      edges: currentElements.edges,
    };
  }, [currentElements, currentIsDirected]);

  // ── Toast helpers ─────────────────────────────────────────────────────────
  const addToast = useCallback(({ type, title, message, duration }) => {
    const id = ++toastId;
    setToasts(t => [...t, { id, type, title, message, duration }]);
  }, []);

  const dismissToast = useCallback(id => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  // ── Contextual toasts ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!algoState || algoState.eventType === 'init') return;

    const { eventType, stepLog, skippedNeighbors, visited, order } = algoState;

    if (eventType === 'step_skip' && !skipShownRef.current) {
      skipShownRef.current = true;
      const names = skippedNeighbors?.join(', ') ?? '?';
      addToast({
        type:    'info',
        title:   'Nó já descoberto',
        message: `Vizinho(s) "${names}" encontrado(s) mas já ${skippedNeighbors?.length === 1 ? 'havia' : 'haviam'} sido marcado(s) como visitado(s) — ignorado(s) para evitar revisita.`,
        duration: 6000,
      });
    }

    if (eventType === 'done_unreachable') {
      addToast({
        type:    'warning',
        title:   'Nós inalcançáveis detectados',
        message: stepLog,
        duration: 8000,
      });
    }

    if (eventType === 'done_cycle') {
      addToast({
        type:    'error',
        title:   'Ciclo detectado',
        message: `Ordenação topológica impossível — o grafo contém um ciclo. Apenas ${order?.length ?? 0} nó(s) foram ordenados.`,
        duration: 8000,
      });
    }

    if (eventType === 'done') {
      const isClosure = algorithm === 'FTD' || algorithm === 'FTI';
      addToast({
        type:    'success',
        title:   isClosure ? `${algorithm} calculado` : `${algorithm} concluída`,
        message: isClosure
          ? `Fecho calculado: ${visited?.size ?? 0} nó(s) no resultado.`
          : algorithm === 'TOPO'
            ? `Ordenação topológica concluída! Ordem: ${order?.join(' → ')}.`
            : `Travessia completa! Ordem de visita: ${order?.join(' → ')}.`,
        duration: 6000,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoState?.stepCount, algoState?.done]);

  // ── Custom graph actions (reset on change) ────────────────────────────────
  const handleGraphChangeWithReset = useCallback(newElements => {
    handleGraphChange(newElements);
    reset();
  }, [handleGraphChange, reset]);

  const handleClearGraphWithReset = useCallback(() => {
    handleClearGraph();
    reset();
  }, [handleClearGraph, reset]);

  // ── Clear connectivity highlight when graph structure changes ─────────────
  const nodeIdsKey = nodeIds.join(',');
  useEffect(() => {
    setConnectivityHighlight(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeIdsKey]);

  const isDone  = algoState?.done ?? false;
  const canStep = !!algoState && !isDone;
  const canBack = !!algoState && history.length > 0;

  // ── Canvas ref (imperative randomize) ────────────────────────────────────
  const canvasRef = useRef(null);
  const handleRandomize = useCallback(() => { canvasRef.current?.randomize(); }, []);

  // ── Activate edit mode on a preset (seeds custom graph) ──────────────────
  const handleActivatePresetEdit = useCallback(() => {
    handleGraphChange({
      nodes: currentElements.nodes.map(n => ({ data: { ...n.data }, position: n.position ? { ...n.position } : undefined })),
      edges: currentElements.edges.map(e => ({ data: { ...e.data } })),
    });
    setIsDirected(currentIsDirected);
    setPresetKey('custom');
    setEditMode('addNode');
    pause();
    reset();
  }, [currentElements, currentIsDirected, handleGraphChange, setIsDirected, setPresetKey, setEditMode, pause, reset]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-slate-950 text-[#191c1e] dark:text-slate-100">

      {/* ── Header ── */}
      <header className="h-14 shrink-0 border-b border-[#e0e3e5] dark:border-slate-800 flex items-center px-6 gap-4 bg-white dark:bg-slate-950">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight font-headline text-[#191c1e] dark:text-slate-50 shrink-0 hover:text-[#004ac6] dark:hover:text-blue-400 transition-colors"
        >
          G Visualizer
        </Link>
        <div className="w-px h-5 bg-[#e0e3e5] dark:bg-slate-700" />

        {/* ── Algorithm tabs ── */}
        <nav className="flex items-center gap-1 flex-1">
          {ALGO_IDS.map(alg => (
            <button
              key={alg}
              onClick={() => setAlgorithm(alg)}
              title={ALGO_TITLES[alg]}
              className={`px-3.5 py-1.5 text-sm font-bold font-headline transition-colors rounded-none border-b-2 ${
                algorithm === alg
                  ? 'text-[#004ac6] dark:text-blue-400 border-[#004ac6] dark:border-blue-400'
                  : 'text-[#515f74] dark:text-slate-400 border-transparent hover:text-[#004ac6] dark:hover:text-blue-300 hover:border-[#004ac6]/30'
              }`}
            >
              {alg}
            </button>
          ))}
        </nav>

        {/* ── Right actions ── */}
        <ThemeToggle />
      </header>

      {/* ── Body ── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* ── Left sidebar ── */}
        <aside className="w-52 shrink-0 border-r border-[#e0e3e5] dark:border-slate-800 flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

            {/* Section label */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#004ac6] dark:text-blue-400">Interação</p>
              <p className="text-[10px] tracking-widest uppercase text-[#737686] dark:text-slate-500 mt-0.5">Ferramentas</p>
            </div>

            {/* Graph selector */}
            <div>
              <label className="text-[10px] tracking-widest uppercase text-[#737686] dark:text-slate-500 block mb-1.5">
                Grafo atual
              </label>
              <select
                value={presetKey}
                onChange={e => setPresetKey(e.target.value)}
                className="w-full bg-[#f2f4f6] dark:bg-slate-800 border border-[#c3c6d7]/50 dark:border-slate-700 text-[#191c1e] dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#004ac6] dark:focus:border-blue-500"
              >
                {Object.entries(PRESETS).map(([key, p]) => (
                  <option key={key} value={key}>{p.name}</option>
                ))}
                <option value="custom">Grafo Customizado</option>
              </select>
            </div>

            {/* Edit tools */}
            <div className="flex flex-col gap-1.5">
              {!isCustom ? (
                <>
                  <button
                    onClick={handleActivatePresetEdit}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#c3c6d7]/50 dark:border-slate-700 text-[#515f74] dark:text-slate-400 hover:border-[#004ac6] hover:text-[#004ac6] dark:hover:text-blue-400 hover:bg-[#f0f4ff] dark:hover:bg-blue-950/30 transition-all text-xs font-medium bg-[#f7f9fb] dark:bg-slate-800/60"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>edit</span>
                    Ativar Modo Edição
                  </button>
                  <div className="flex items-center gap-2 px-3 py-2 opacity-40 cursor-not-allowed">
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>lock</span>
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
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                        editMode === t.id
                          ? 'bg-[#004ac6] text-white border-[#004ac6] shadow-sm shadow-[#004ac6]/30'
                          : 'bg-[#f7f9fb] dark:bg-slate-800/60 text-[#515f74] dark:text-slate-400 border-[#c3c6d7]/50 dark:border-slate-700 hover:border-[#004ac6] hover:text-[#004ac6] dark:hover:text-blue-400'
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                  <button
                    onClick={handleClearGraphWithReset}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border bg-[#f7f9fb] dark:bg-slate-800/60 text-[#515f74] dark:text-slate-400 border-[#c3c6d7]/50 dark:border-slate-700 hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete_sweep</span>
                    Limpar Canvas
                  </button>
                  <button
                    onClick={handleRandomize}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border bg-[#f7f9fb] dark:bg-slate-800/60 text-[#515f74] dark:text-slate-400 border-[#c3c6d7]/50 dark:border-slate-700 hover:border-[#004ac6] hover:text-[#004ac6] dark:hover:text-blue-400 transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>shuffle</span>
                    Aleatorizar
                  </button>
                </>
              )}
            </div>

            <div className="h-px bg-[#e0e3e5] dark:bg-slate-800" />

            {/* Start node */}
            {nodeIds.length > 0 && (
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#737686] dark:text-slate-500 block mb-1.5">
                  Nó Inicial
                </label>
                <select
                  value={startNode}
                  onChange={e => setStartNode(e.target.value)}
                  disabled={!!algoState}
                  className="w-full bg-[#f2f4f6] dark:bg-slate-800 border border-[#c3c6d7]/50 dark:border-slate-700 text-[#191c1e] dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#004ac6] disabled:opacity-40"
                >
                  {nodeIds.map(id => <option key={id} value={id}>{id}</option>)}
                </select>
              </div>
            )}

            {/* Start / Reset */}
            {!algoState ? (
              <button
                onClick={() => start(startNode || nodeIds[0])}
                disabled={nodeIds.length === 0}
                className="w-full py-2.5 rounded-xl text-xs font-bold font-headline bg-[#004ac6] hover:bg-[#2563eb] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm shadow-[#004ac6]/20"
              >
                Iniciar
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl text-xs font-bold font-headline bg-[#f2f4f6] dark:bg-slate-800 text-[#515f74] dark:text-slate-300 border border-[#c3c6d7]/50 dark:border-slate-700 hover:bg-[#e0e3e5] dark:hover:bg-slate-700 transition-colors"
              >
                Resetar
              </button>
            )}

            {/* Speed */}
            <div>
              <label className="text-[10px] tracking-widest uppercase text-[#737686] dark:text-slate-500 block mb-1.5">
                Velocidade
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={100}
                  value={2100 - speed}
                  onChange={e => setSpeed(2100 - Number(e.target.value))}
                  className="flex-1 h-1 accent-[#004ac6]"
                />
                <span className="text-[10px] text-[#737686] dark:text-slate-500 w-10 text-right shrink-0">{speed}ms</span>
              </div>
            </div>

            {/* Empty graph hint */}
            {nodeIds.length === 0 && (
              <p className="text-[10px] text-[#737686] dark:text-slate-500 italic leading-relaxed">
                Adicione nós para começar ou escolha um grafo pré-carregado.
              </p>
            )}
          </div>

          {/* Progress — pinned to bottom */}
          <div className="shrink-0 border-t border-[#e0e3e5] dark:border-slate-800 p-4">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#737686] dark:text-slate-500 mb-2">
              Progresso
            </p>
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

        {/* ── Center canvas ── */}
        <main className="flex-1 min-w-0 relative overflow-hidden bg-[#f2f4f6] dark:bg-slate-900">
          {/* Dot-grid background */}
          <div className="dot-grid absolute inset-0 pointer-events-none z-0" />

          {/* Algorithm label — overlaid top-left */}
          <div className="absolute top-6 left-7 z-10 pointer-events-none">
            <h2 className="text-2xl font-bold text-[#191c1e] dark:text-slate-50 font-headline leading-tight">
              {ALGO_TITLES[algorithm]}
            </h2>
            <p className="text-sm text-[#515f74] dark:text-slate-400 mt-0.5">
              {ALGO_SUBTITLES[algorithm]}
            </p>
          </div>

          {/* Edit mode hint — overlaid top-right */}
          {isCustom && editMode && (
            <div className="absolute top-6 right-6 z-10 pointer-events-none">
              <div className="bg-[#004ac6]/10 dark:bg-blue-900/40 border border-[#004ac6]/25 dark:border-blue-700/40 rounded-xl px-3 py-1.5">
                <p className="text-xs font-medium text-[#004ac6] dark:text-blue-300">
                  {editMode === 'addNode' && 'Clique no canvas para adicionar um nó'}
                  {editMode === 'addEdge' && 'Clique na origem, depois no destino'}
                  {editMode === 'delete'  && 'Clique em um nó ou aresta para remover'}
                </p>
              </div>
            </div>
          )}

          {/* Done badge */}
          {isDone && (
            <div className="absolute top-6 right-6 z-10 pointer-events-none">
              <span className="bg-[#6ffbbe]/30 dark:bg-emerald-900/50 border border-[#006242]/20 dark:border-emerald-700/50 text-[#006242] dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full">
                ✓ Concluído
              </span>
            </div>
          )}

          {/* Graph canvas */}
          <GraphCanvas
            ref={canvasRef}
            elements={enrichedElements}
            layout={currentLayout}
            algoState={algoState}
            editMode={isCustom ? editMode : null}
            isDirected={currentIsDirected}
            onGraphChange={handleGraphChangeWithReset}
            connectivityHighlight={connectivityHighlight}
          />

          {/* Floating playback controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <div className="glass-panel px-6 py-3.5 rounded-2xl flex items-center gap-5 shadow-xl border border-white/60 dark:border-slate-700/50">
              {/* Step back */}
              <button
                onClick={stepBackward}
                disabled={!canBack}
                className="text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                title="Voltar um passo"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>skip_previous</span>
              </button>

              {/* Play / Pause */}
              {!isPlaying ? (
                <button
                  onClick={() => { if (!algoState) start(startNode || nodeIds[0]); play(); }}
                  disabled={isDone || nodeIds.length === 0}
                  className="w-12 h-12 rounded-full bg-[#004ac6] hover:bg-[#2563eb] text-white flex items-center justify-center shadow-lg shadow-[#004ac6]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105"
                  title="Executar"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '26px', fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </button>
              ) : (
                <button
                  onClick={pause}
                  className="w-12 h-12 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-lg shadow-[#004ac6]/30 hover:scale-105 transition-all"
                  title="Pausar"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '26px', fontVariationSettings: "'FILL' 1" }}>pause</span>
                </button>
              )}

              {/* Step forward */}
              <button
                onClick={stepForward}
                disabled={!canStep || isPlaying}
                className="text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                title="Avançar um passo"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>skip_next</span>
              </button>

              <div className="w-px h-7 bg-[#c3c6d7]/60 dark:bg-slate-600" />

              {/* Step counter */}
              <div className="text-center min-w-[52px]">
                <span className="text-[9px] font-bold tracking-[0.15em] text-[#737686] dark:text-slate-500 uppercase block">
                  {isDone ? 'Fim' : 'Passo'}
                </span>
                <span className="text-sm font-mono font-bold text-[#004ac6] dark:text-blue-400">
                  {algoState ? String(history.length + 1).padStart(2, '0') : '—'}
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* ── Right panel ── */}
        <aside className="w-72 xl:w-80 shrink-0 border-l border-[#e0e3e5] dark:border-slate-800 overflow-y-auto bg-white dark:bg-slate-950 flex flex-col">

          <RightSection icon="code" title="Pseudocódigo">
            <PseudocodePanel algorithm={algorithm} algoState={algoState} />
          </RightSection>

          <RightSection icon="monitoring" title="Dados ao Vivo">
            <DataPanel algorithm={algorithm} algoState={algoState} />
          </RightSection>

          <RightSection icon="grid_on" title="Matriz de Adjacência">
            <GraphRepresentationPanel
              elements={currentElements}
              isDirected={currentIsDirected}
              defaultView="adj-matrix"
            />
          </RightSection>

          <RightSection icon="hub" title="Conectividade">
            <ConnectivityPanel
              key={nodeIdsKey}
              elements={currentElements}
              isDirected={currentIsDirected}
              onHighlight={setConnectivityHighlight}
            />
          </RightSection>

        </aside>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

/* ── Right panel section wrapper ────────────────────────────────────────── */
function RightSection({ icon, title, children }) {
  return (
    <div className="border-b border-[#e0e3e5] dark:border-slate-800 shrink-0">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f7f9fb] dark:bg-slate-900/60 border-b border-[#e0e3e5] dark:border-slate-800">
        <span className="material-symbols-outlined text-[#737686] dark:text-slate-500" style={{ fontSize: '14px' }}>{icon}</span>
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#737686] dark:text-slate-500">
          {title}
        </span>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

/* ── Theme toggle ────────────────────────────────────────────────────────── */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-[#f2f4f6] dark:bg-slate-800 text-[#515f74] dark:text-slate-400 hover:bg-[#e0e3e5] dark:hover:bg-slate-700 transition-colors"
      title="Alternar tema"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
