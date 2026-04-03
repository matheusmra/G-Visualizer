import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import GraphCanvas from '../components/GraphCanvas.jsx';
import GraphBuilder from '../components/GraphBuilder.jsx';
import DataPanel from '../components/DataPanel.jsx';
import PseudocodePanel from '../components/PseudocodePanel.jsx';
import ControlDeck from '../components/ControlDeck.jsx';
import { ToastContainer } from '../components/ToastNotification.jsx';
import ConnectivityPanel from '../components/ConnectivityPanel.jsx';
import GraphRepresentationPanel from '../components/GraphRepresentationPanel.jsx';
import { PRESETS } from '../data/presets.js';
import { initBFS, stepBFS, buildAdjMap } from '../algorithms/BFS.js';
import { initDFS, stepDFS } from '../algorithms/DFS.js';
import {
  initFTD, stepFTD,
  initFTI, stepFTI,
  buildDirectedAdjMap,
  buildReverseAdjMap,
} from '../algorithms/FTC.js';

const DEFAULT_SPEED = 700;
const EMPTY_GRAPH   = { nodes: [], edges: [] };
let toastId = 0;

export default function VisualizerPage() {
  const { algorithm: algoParam }        = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Fonte do grafo ────────────────────────────────────────────────────────
  const initialPreset = searchParams.get('preset') ?? 'cyclic';
  const [presetKey,      setPresetKey]      = useState(initialPreset);
  const [customElements, setCustomElements] = useState(EMPTY_GRAPH);
  const [isDirected,     setIsDirected]     = useState(false);
  const [editMode,       setEditMode]       = useState(null);

  // ── Algoritmo ─────────────────────────────────────────────────────────────
  const validAlgos = ['BFS', 'DFS', 'FTD', 'FTI'];
  const [algorithm,  setAlgorithm]  = useState(
    validAlgos.includes(algoParam) ? algoParam : 'BFS'
  );
  const [startNode,  setStartNode]  = useState('');
  const [algoState,  setAlgoState]  = useState(null);
  const [history,    setHistory]    = useState([]);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [speed,      setSpeed]      = useState(DEFAULT_SPEED);
  const playTimerRef = useRef(null);
  const skipShownRef = useRef(false);

  // ── UI ────────────────────────────────────────────────────────────────────
  const [rightPanel, setRightPanel] = useState('data');
  const [toasts,     setToasts]     = useState([]);  const [connectivityHighlight, setConnectivityHighlight] = useState(null);
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
    // sync URL preset param
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('preset', presetKey);
      return next;
    });
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
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">

      {/* ── Header ── */}
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm"
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
        <div className="flex-1 p-4 min-h-[420px] bg-gray-900">
          <GraphCanvas
            elements={currentElements}
            layout={currentLayout}
            algoState={algoState}
            algorithm={algorithm}
            editMode={isCustom ? editMode : null}
            isDirected={currentIsDirected}
            onGraphChange={handleGraphChange}
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
                    : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
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
          <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
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
      className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {theme === 'dark' ? 'Claro' : 'Escuro'}
    </button>
  );
}
