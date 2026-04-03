import { useState, useEffect, useRef, useCallback } from 'react';
import GraphCanvas from './components/GraphCanvas.jsx';
import GraphBuilder from './components/GraphBuilder.jsx';
import DataPanel from './components/DataPanel.jsx';
import PseudocodePanel from './components/PseudocodePanel.jsx';
import ControlDeck from './components/ControlDeck.jsx';
import PresetSelector from './components/PresetSelector.jsx';
import { ToastContainer } from './components/ToastNotification.jsx';
import { PRESETS } from './data/presets.js';
import { initBFS, stepBFS, initDFS, stepDFS, buildAdjMap } from './algorithms/traversal.js';
import {
  initFTD, stepFTD,
  initFTI, stepFTI,
  buildDirectedAdjMap,
  buildReverseAdjMap,
} from './algorithms/closure.js';

const DEFAULT_PRESET = 'cyclic';
const DEFAULT_ALGO   = 'BFS';
const DEFAULT_SPEED  = 700;
const EMPTY_GRAPH    = { nodes: [], edges: [] };
let toastId = 0;

export default function App() {
  // ── Fonte do grafo ────────────────────────────────────────────────────────
  const [presetKey,      setPresetKey]      = useState(DEFAULT_PRESET);
  const [customElements, setCustomElements] = useState(EMPTY_GRAPH);
  const [isDirected,     setIsDirected]     = useState(false);
  const [editMode,       setEditMode]       = useState(null);

  // ── Algoritmo ─────────────────────────────────────────────────────────────
  const [algorithm,  setAlgorithm]  = useState(DEFAULT_ALGO);
  const [startNode,  setStartNode]  = useState('');
  const [algoState,  setAlgoState]  = useState(null);
  const [history,    setHistory]    = useState([]);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [speed,      setSpeed]      = useState(DEFAULT_SPEED);
  const playTimerRef     = useRef(null);
  const skipShownRef     = useRef(false); // evita toast de skip repetido por travessia

  // ── UI ────────────────────────────────────────────────────────────────────
  const [rightPanel, setRightPanel] = useState('data');  // 'data' | 'pseudo'
  const [toasts,     setToasts]     = useState([]);

  // ── Derivados ─────────────────────────────────────────────────────────────
  const isCustom          = presetKey === 'custom';
  const preset            = isCustom ? null : PRESETS[presetKey];
  const currentElements   = isCustom ? customElements : preset.elements;
  const currentLayout     = isCustom ? { name: 'preset' } : preset.layout;
  const currentIsDirected = isCustom ? isDirected : (preset?.directed ?? false);
  const nodeIds           = currentElements.nodes.map(n => n.data.id);

  const adjMap     = currentIsDirected
    ? buildDirectedAdjMap(currentElements)
    : buildAdjMap(currentElements);
  const reverseMap = buildReverseAdjMap(currentElements);

  // ── Toast helpers ─────────────────────────────────────────────────────────
  const addToast = useCallback(({ type, title, message, duration }) => {
    const id = ++toastId;
    setToasts(t => [...t, { id, type, title, message, duration }]);
  }, []);

  const dismissToast = useCallback(id => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    clearInterval(playTimerRef.current);
    setIsPlaying(false);
    setAlgoState(null);
    setHistory([]);
    skipShownRef.current = false;
  }, []);

  useEffect(() => {
    const ids = preset ? preset.elements.nodes.map(n => n.data.id) : [];
    setStartNode(ids[0] ?? '');
    handleReset();
    setEditMode(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetKey]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { handleReset(); }, [algorithm]);

  // ── Avançar algoritmo ─────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    const node = startNode || nodeIds[0];
    if (!node) return;
    let state;
    if      (algorithm === 'BFS') state = initBFS(node);
    else if (algorithm === 'DFS') state = initDFS(node);
    else if (algorithm === 'FTD') state = initFTD(node);
    else if (algorithm === 'FTI') state = initFTI(node);
    setAlgoState(state);
    setHistory([]);
    skipShownRef.current = false;
  }, [startNode, nodeIds, algorithm]);

  const advanceOne = useCallback(current => {
    if (!current || current.done) return current;
    if (algorithm === 'BFS') return stepBFS(current, adjMap);
    if (algorithm === 'DFS') return stepDFS(current, adjMap);
    if (algorithm === 'FTD') return stepFTD(current, adjMap);
    if (algorithm === 'FTI') return stepFTI(current, reverseMap);
    return current;
  }, [algorithm, adjMap, reverseMap]);

  const handleStepForward = useCallback(() => {
    setHistory(h => [...h, algoState]);
    setAlgoState(prev => advanceOne(prev));
  }, [algoState, advanceOne]);

  const handleStepBackward = useCallback(() => {
    if (history.length === 0) return;
    setAlgoState(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
  }, [history]);

  // ── Auto-play ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) { clearInterval(playTimerRef.current); return; }
    clearInterval(playTimerRef.current);
    playTimerRef.current = setInterval(() => {
      setAlgoState(prev => {
        if (!prev || prev.done) { setIsPlaying(false); return prev; }
        const next = (() => {
          if (algorithm === 'BFS') return stepBFS(prev, adjMap);
          if (algorithm === 'DFS') return stepDFS(prev, adjMap);
          if (algorithm === 'FTD') return stepFTD(prev, adjMap);
          if (algorithm === 'FTI') return stepFTI(prev, reverseMap);
          return prev;
        })();
        setHistory(h => [...h, prev]);
        return next;
      });
    }, speed);
    return () => clearInterval(playTimerRef.current);
  }, [isPlaying, speed, algorithm, adjMap, reverseMap]);

  // ── Toasts contextuais ────────────────────────────────────────────────────
  useEffect(() => {
    if (!algoState || algoState.eventType === 'init') return;

    const { eventType, stepLog, skippedNeighbors, visited, order } = algoState;

    // 1) Primeira vez que um nó é ignorado por já ter sido visitado
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

    // 2) Travessia concluída com nós inalcançáveis
    if (eventType === 'done_unreachable') {
      addToast({
        type:    'warning',
        title:   'Nós inalcançáveis detectados',
        message: stepLog,
        duration: 8000,
      });
    }

    // 3) Travessia ou fecho concluído com sucesso
    if (eventType === 'done') {
      const isClosure = algorithm === 'FTD' || algorithm === 'FTI';
      addToast({
        type:    'success',
        title:   isClosure ? `${algorithm} calculado` : `${algorithm} concluída`,
        message: isClosure
          ? `Fecho calculado: ${visited?.size ?? 0} nó(s) no resultado.`
          : `Travessia completa! Ordem de visita: ${order?.join(' → ')}.`,
        duration: 6000,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoState?.stepCount, algoState?.done]);

  // ── Grafo customizado ─────────────────────────────────────────────────────
  const handleGraphChange = useCallback(newElements => {
    setCustomElements(newElements);
    handleReset();
  }, [handleReset]);

  const handleClearGraph = useCallback(() => {
    setCustomElements(EMPTY_GRAPH);
    handleReset();
  }, [handleReset]);

  const isDone = algoState?.done ?? false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      {/* ── Header ── */}
      <header className="border-b border-slate-800 px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-violet-400">G</span>
          <span className="text-lg font-bold text-slate-100">Visualizer</span>
        </div>
        <span className="text-xs text-slate-500 hidden md:block">
          BFS · DFS · Fecho Transitivo Direto · Fecho Transitivo Indireto
        </span>
        <div className="ml-auto">
          <Legend />
        </div>
      </header>

      {/* ── Barra de presets ── */}
      <div className="border-b border-slate-800 px-6 py-2.5 bg-slate-900/40">
        <PresetSelector
          current={presetKey}
          onChange={key => {
            setPresetKey(key);
            setEditMode(null);
            handleReset();
          }}
        />
      </div>

      {/* ── Barra do editor (modo customizado) ── */}
      {isCustom && (
        <GraphBuilder
          editMode={editMode}
          setEditMode={setEditMode}
          isDirected={isDirected}
          setIsDirected={setIsDirected}
          onClear={handleClearGraph}
          nodeCount={customElements.nodes.length}
          edgeCount={customElements.edges.length}
        />
      )}

      {/* ── Layout principal ── */}
      <div className="flex flex-col lg:flex-row flex-1 gap-0 overflow-hidden">

        {/* Canvas */}
        <div className="flex-1 p-4 min-h-[420px]">
          <GraphCanvas
            elements={currentElements}
            layout={currentLayout}
            algoState={algoState}
            algorithm={algorithm}
            editMode={isCustom ? editMode : null}
            isDirected={currentIsDirected}
            onGraphChange={handleGraphChange}
          />
        </div>

        {/* Painel lateral direito com abas */}
        <aside className="lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/40 flex flex-col">

          {/* Abas */}
          <div className="flex border-b border-slate-700 shrink-0">
            {[
              { id: 'data',   label: 'Estruturas de Dados' },
              { id: 'pseudo', label: 'Pseudocódigo' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRightPanel(tab.id)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                  rightPanel === tab.id
                    ? 'text-violet-300 border-b-2 border-violet-500 bg-slate-800/40'
                    : 'text-slate-500 hover:text-slate-300'
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
          </div>
        </aside>
      </div>

      {/* ── Painel de controle ── */}
      <footer className="border-t border-slate-800 bg-slate-900/60 px-4 py-3">
        <ControlDeck
          algorithm={algorithm}
          setAlgorithm={alg => { setAlgorithm(alg); }}
          startNode={startNode}
          setStartNode={setStartNode}
          nodeIds={nodeIds}
          onStart={handleStart}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onPlay={() => { if (!algoState) handleStart(); setIsPlaying(true); }}
          onPause={() => setIsPlaying(false)}
          onReset={handleReset}
          isPlaying={isPlaying}
          isDone={isDone}
          algoState={algoState}
          historyLength={history.length}
          speed={speed}
          setSpeed={setSpeed}
        />
      </footer>

      {/* ── Toasts contextuais ── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function Legend() {
  const items = [
    { color: 'bg-slate-700 border-slate-500',   label: 'Não visitado' },
    { color: 'bg-amber-900 border-amber-500',   label: 'Fronteira' },
    { color: 'bg-violet-800 border-violet-400', label: 'Atual' },
    { color: 'bg-green-900 border-green-500',   label: 'Visitado' },
  ];
  return (
    <div className="flex flex-wrap gap-3">
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-full border-2 ${color}`} />
          <span className="text-xs text-slate-400">{label}</span>
        </div>
      ))}
    </div>
  );
}

