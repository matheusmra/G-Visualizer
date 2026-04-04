import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import GraphCanvas from '../components/canvas/GraphCanvas.jsx';
import GraphBuilder from '../components/controls/GraphBuilder.jsx';
import DataPanel from '../components/panels/DataPanel.jsx';
import PseudocodePanel from '../components/panels/PseudocodePanel.jsx';
import ControlDeck from '../components/controls/ControlDeck.jsx';
import { ToastContainer } from '../components/ui/ToastNotification.jsx';
import ConnectivityPanel from '../components/panels/ConnectivityPanel.jsx';
import GraphRepresentationPanel from '../components/panels/GraphRepresentationPanel.jsx';
import { useAlgorithm } from '../hooks/useAlgorithm.js';
import { usePlayback } from '../hooks/usePlayback.js';
import { useGraphPreset } from '../hooks/useGraphPreset.js';
import { buildAdjMap, buildDirectedAdjMap, buildReverseAdjMap } from '../utils/graphHelpers.js';
import { ALGO_IDS } from '../constants/algorithms.js';

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

  const isDone = algoState?.done ?? false;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">

      {/* ── Header ── */}
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
        >
          <span>←</span>
          <span className="hidden sm:inline">Início</span>
        </Link>
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">G</span>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Visualizer</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Legend />
          <ThemeToggle />
        </div>
      </header>

      {/* ── Painel de controle ── */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 px-4 py-3">
        <ControlDeck
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          startNode={startNode}
          setStartNode={setStartNode}
          nodeIds={nodeIds}
          onStart={() => start(startNode || nodeIds[0])}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onPlay={() => { if (!algoState) start(startNode || nodeIds[0]); play(); }}
          onPause={pause}
          onReset={handleReset}
          isPlaying={isPlaying}
          isDone={isDone}
          algoState={algoState}
          historyLength={history.length}
          speed={speed}
          setSpeed={setSpeed}
        />
      </div>

      {/* ── Barra do editor (modo customizado) ── */}
      {isCustom && (
        <GraphBuilder
          editMode={editMode}
          setEditMode={setEditMode}
          isDirected={isDirected}
          setIsDirected={setIsDirected}
          onClear={handleClearGraphWithReset}
          nodeCount={customElements.nodes.length}
          edgeCount={customElements.edges.length}
        />
      )}

      {/* ── Layout principal ── */}
      <div className="flex flex-col lg:flex-row flex-1 gap-0 overflow-hidden">

        {/* Canvas */}
        <div className="flex-1 p-4 min-h-[420px] bg-gray-900">
          <GraphCanvas
            elements={enrichedElements}
            layout={currentLayout}
            algoState={algoState}
            algorithm={algorithm}
            editMode={isCustom ? editMode : null}
            isDirected={currentIsDirected}
            onGraphChange={handleGraphChangeWithReset}
            connectivityHighlight={connectivityHighlight}
          />
        </div>

        {/* Painel lateral direito com abas */}
        <aside className="lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 flex flex-col">

          {/* Abas */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 shrink-0">
            {[
              { id: 'data',           label: 'Estruturas' },
              { id: 'pseudo',         label: 'Pseudocódigo' },
              { id: 'connectivity',   label: 'Conectividade' },
              { id: 'representations', label: 'Grafo' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRightPanel(tab.id)}
                className={`flex-1 py-2.5 text-[10px] font-semibold transition-colors leading-tight px-1 ${
                  rightPanel === tab.id
                    ? 'text-indigo-600 dark:text-indigo-300 border-b-2 border-indigo-500 bg-gray-100 dark:bg-gray-800/40'
                    : 'text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conteúdo da aba */}
          <div className="flex-1 p-4 overflow-y-auto">
            {rightPanel === 'data' && (
              <DataPanel algorithm={algorithm} algoState={algoState} />
            )}
            {rightPanel === 'pseudo' && (
              <PseudocodePanel algorithm={algorithm} algoState={algoState} />
            )}
            {rightPanel === 'connectivity' && (
              <ConnectivityPanel
                key={nodeIdsKey}
                elements={currentElements}
                isDirected={currentIsDirected}
                onHighlight={setConnectivityHighlight}
              />
            )}
            {rightPanel === 'representations' && (
              <GraphRepresentationPanel
                elements={currentElements}
                isDirected={currentIsDirected}
              />
            )}
          </div>
        </aside>
      </div>

      {/* ── Toasts contextuais ── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function Legend() {
  const items = [
    { color: 'bg-gray-600 border-gray-400',     label: 'Não visitado' },
    { color: 'bg-amber-900 border-amber-500',   label: 'Fronteira' },
    { color: 'bg-violet-800 border-violet-400', label: 'Atual' },
    { color: 'bg-green-900 border-green-500',   label: 'Visitado' },
  ];
  return (
    <div className="flex flex-wrap gap-3">
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-full border-2 ${color}`} />
          <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
        </div>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {theme === 'dark' ? 'Claro' : 'Escuro'}
    </button>
  );
}
