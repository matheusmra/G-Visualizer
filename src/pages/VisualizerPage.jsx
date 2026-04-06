import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import GraphCanvas from '../components/canvas/GraphCanvas.jsx';
import DataPanel from '../components/panels/DataPanel.jsx';
import PseudocodePanel from '../components/panels/PseudocodePanel.jsx';
import ConnectivityPanel from '../components/panels/ConnectivityPanel.jsx';
import GraphRepresentationPanel from '../components/panels/GraphRepresentationPanel.jsx';
import { useAlgorithm } from '../hooks/useAlgorithm.js';
import { usePlayback } from '../hooks/usePlayback.js';
import { useGraphPreset } from '../hooks/useGraphPreset.js';
import { buildAdjMap, buildDirectedAdjMap, buildReverseAdjMap } from '../utils/graphHelpers.js';
import { ALGO_IDS, ALGO_TITLES } from '../constants/algorithms.js';
import { ALGO_DEFAULT_PRESET } from '../data/algorithms.js';
import ErrorBoundary from '../components/ui/ErrorBoundary.jsx';
import { VisualizerHeader } from '../components/visualizer/VisualizerHeader.jsx';
import { ControlSidebar, PlaybackBar } from '../components/visualizer/Panels.jsx';
import { useToasts } from '../hooks/useToasts.jsx';

export default function VisualizerPage() {
  const navigate = useNavigate();
  const { algorithm: algoParam }        = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Algorithm selector (URL as source of truth) ───────────────────────────
  const algorithm = useMemo(() => 
    ALGO_IDS.includes(algoParam) ? algoParam : 'BFS'
  , [algoParam]);
  
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

  const nodeIdsKey = nodeIds.join(',');

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
    // Pre-select first node if current startNode is gone
    if (nodeIds.length > 0 && !nodeIds.includes(startNode)) {
      setStartNode(nodeIds[0]);
    } else if (nodeIds.length === 0) {
      setStartNode('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeIdsKey, algorithm]);

  // ── UI ────────────────────────────────────────────────────────────────────
  const { toasts, addToast, ToastContainer } = useToasts();
  const [connectivityHighlight, setConnectivityHighlight] = useState(null);

  const handleReset = useCallback(() => { pause(); reset(); }, [pause, reset]);

  const handleAlgoChange = useCallback((newAlgo) => {
    const defaultPreset = ALGO_DEFAULT_PRESET[newAlgo] ?? 'cyclic';
    navigate(`/visualizar/${newAlgo}?preset=${defaultPreset}`);
  }, [navigate]);

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
        message: `Vizinho(s) "${names}" encontrado(s) mas já ${skippedNeighbors?.length === 1 ? 'havia' : 'haviam'} sido marcado(s) como visitado(s) - ignorado(s) para evitar revisita.`,
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
        message: `Ordenação topológica impossível - o grafo contém um ciclo. Apenas ${order?.length ?? 0} nó(s) foram ordenados.`,
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

      <VisualizerHeader 
        algoDetails={{ id: algorithm, name: ALGO_TITLES[algorithm], abbr: algorithm, difficulty: 'Médio', icon: 'hub' }} 
        currentAlgo={algorithm} 
        onAlgoChange={handleAlgoChange} 
      />
      {/* ── Body ── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        <ControlSidebar
            presetKey={presetKey} setPresetKey={setPresetKey}
            isCustom={isCustom} editMode={editMode} setEditMode={setEditMode}
            isDirected={currentIsDirected} setIsDirected={setIsDirected}
            handleActivatePresetEdit={handleActivatePresetEdit} handleClearGraphWithReset={handleClearGraphWithReset} handleRandomize={handleRandomize}
            nodeIds={nodeIds} startNode={startNode} setStartNode={setStartNode}
            algoState={algoState} start={start} handleReset={handleReset}
            speed={speed} setSpeed={setSpeed}
            isDone={isDone} history={history}
        />
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
          <ErrorBoundary mini>
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
          </ErrorBoundary>

          {/* Playback Controls (Componentized) */}
          <PlaybackBar 
            stepBackward={stepBackward} 
            canBack={history.length > 0} 
            isPlaying={isPlaying} 
            algoState={algoState} 
            start={start} 
            startNode={startNode} 
            nodeIds={nodeIds} 
            isDone={isDone} 
            play={play} 
            pause={pause} 
            stepForward={stepForward} 
            canStep={!isDone && !isPlaying} 
            history={history} 
          />
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

      <ToastContainer />
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
