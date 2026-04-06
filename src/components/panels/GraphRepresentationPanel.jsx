import { useState, useMemo } from 'react';
import { AdjacencyList } from '../visualizer/representations/AdjacencyList.jsx';
import { AdjacencyMatrix } from '../visualizer/representations/AdjacencyMatrix.jsx';
import { IncidenceMatrix } from '../visualizer/representations/IncidenceMatrix.jsx';

const VIEWS = [
  { id: 'adj-list',   label: 'Lista de Adjacência' },
  { id: 'adj-matrix', label: 'Matriz de Adjacência' },
  { id: 'inc-matrix', label: 'Matriz de Incidência' },
];

function buildAdjList(elements, isDirected) {
  const list = {};
  elements.nodes.forEach(n => { list[n.data.id] = []; });
  elements.edges.forEach(({ data: { source, target } }) => {
    if (list[source] !== undefined) list[source].push(target);
    if (!isDirected && list[target] !== undefined) list[target].push(source);
  });
  Object.keys(list).forEach(k => list[k].sort());
  return list;
}

function buildAdjMatrix(elements, isDirected) {
  const nodes = [...elements.nodes.map(n => n.data.id)].sort();
  const idx = {};
  nodes.forEach((n, i) => { idx[n] = i; });
  const n = nodes.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  elements.edges.forEach(({ data: { source, target } }) => {
    const si = idx[source], ti = idx[target];
    if (si !== undefined && ti !== undefined) {
      matrix[si][ti] = 1;
      if (!isDirected) matrix[ti][si] = 1;
    }
  });
  return { nodes, matrix };
}

function buildIncMatrix(elements, isDirected) {
  const nodes = [...elements.nodes.map(n => n.data.id)].sort();
  const edges = elements.edges;
  const nodeIdx = {};
  nodes.forEach((n, i) => { nodeIdx[n] = i; });
  const matrix = Array.from({ length: nodes.length }, () => Array(edges.length).fill(0));
  edges.forEach(({ data: { source, target } }, j) => {
    const si = nodeIdx[source], ti = nodeIdx[target];
    if (si !== undefined) matrix[si][j] = isDirected ? 1 : 1;
    if (ti !== undefined) matrix[ti][j] = isDirected ? -1 : 1;
  });
  const edgeLabels = edges.map((e, i) => {
    const id = e.data?.id;
    return id && id.length <= 3 ? id : `e${i}`;
  });
  return { nodes, edges: edgeLabels, matrix };
}

export default function GraphRepresentationPanel({ elements, isDirected, defaultView = 'adj-list' }) {
  const [view, setView] = useState(defaultView);

  const adjList   = useMemo(() => buildAdjList(elements, isDirected),   [elements, isDirected]);
  const adjMatrix = useMemo(() => buildAdjMatrix(elements, isDirected), [elements, isDirected]);
  const incMatrix = useMemo(() => buildIncMatrix(elements, isDirected), [elements, isDirected]);

  if (elements.nodes.length === 0) {
    return (
      <p className="text-xs text-[#737686] dark:text-slate-500 italic">
        Adicione nós ao grafo para ver as representações matemáticas.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* View selector */}
      <div className="flex flex-col gap-1">
        {VIEWS.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg text-left transition-colors border ${
              view === v.id
                ? 'bg-[#004ac6] text-white border-[#004ac6]'
                : 'bg-[#f7f9fb] dark:bg-slate-800/60 text-[#515f74] dark:text-slate-400 hover:bg-[#e0e3e5] dark:hover:bg-slate-700 border-[#c3c6d7]/40 dark:border-slate-700'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'adj-list'   && <AdjacencyList adjList={adjList} isDirected={isDirected} />}
      {view === 'adj-matrix' && <AdjacencyMatrix adjMatrix={adjMatrix} isDirected={isDirected} />}
      {view === 'inc-matrix' && <IncidenceMatrix incMatrix={incMatrix} isDirected={isDirected} />}
    </div>
  );
}
