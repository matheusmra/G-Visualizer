import { useState, useMemo } from 'react';

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
    if (si !== undefined) matrix[si][j] = isDirected ? 1 : 1;   // +1 outgoing / incident
    if (ti !== undefined) matrix[ti][j] = isDirected ? -1 : 1;  // -1 incoming / incident
  });
  // Edge labels: shorten auto-generated IDs for display
  const edgeLabels = edges.map((e, i) => {
    const id = e.data.id;
    return id.length <= 3 ? id : `e${i}`;
  });
  return { nodes, edges: edgeLabels, matrix };
}

export default function GraphRepresentationPanel({ elements, isDirected }) {
  const [view, setView] = useState('adj-list');

  const adjList   = useMemo(() => buildAdjList(elements, isDirected),   [elements, isDirected]);
  const adjMatrix = useMemo(() => buildAdjMatrix(elements, isDirected), [elements, isDirected]);
  const incMatrix = useMemo(() => buildIncMatrix(elements, isDirected), [elements, isDirected]);

  if (elements.nodes.length === 0) {
    return (
      <p className="text-xs text-gray-600 dark:text-gray-500 italic">
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
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg text-left transition-colors ${
              view === v.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Adjacency List */}
      {view === 'adj-list' && (
        <div>
          <p className="text-[10px] text-gray-600 dark:text-gray-500 mb-2">
            {isDirected ? 'Cada nó lista seus sucessores diretos.' : 'Cada nó lista seus vizinhos.'}
          </p>
          <div className="rounded-xl bg-gray-950 border border-gray-800 font-mono text-xs p-3 overflow-x-auto">
            {Object.entries(adjList).sort().map(([node, neighbors]) => (
              <div key={node} className="mb-1 last:mb-0 flex items-start gap-1 min-w-0">
                <span className="text-indigo-400 font-bold shrink-0">{node}</span>
                <span className="text-gray-600 shrink-0">{isDirected ? ' →' : ' —'}</span>
                <span className="flex flex-wrap gap-x-1">
                  {neighbors.length > 0
                    ? neighbors.map((n, i) => (
                        <span key={`${n}-${i}`}>
                          <span className="text-green-400">{n}</span>
                          {i < neighbors.length - 1 && <span className="text-gray-600">,</span>}
                        </span>
                      ))
                    : <span className="text-gray-600">∅</span>
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adjacency Matrix */}
      {view === 'adj-matrix' && (
        <div>
          <p className="text-[10px] text-gray-600 dark:text-gray-500 mb-2">
            {adjMatrix.nodes.length}×{adjMatrix.nodes.length} — 1 se existe aresta, 0 caso contrário.
            {isDirected ? ' Linha = origem, coluna = destino.' : ''}
          </p>
          <div className="overflow-x-auto rounded-xl bg-gray-950 border border-gray-800 p-2">
            <table className="text-xs font-mono border-collapse mx-auto">
              <thead>
                <tr>
                  <th className="w-6 h-6 text-gray-600" />
                  {adjMatrix.nodes.map(n => (
                    <th key={n} className="w-7 h-6 text-indigo-400 font-bold text-center px-1">{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adjMatrix.matrix.map((row, i) => (
                  <tr key={adjMatrix.nodes[i]}>
                    <td className="pr-2 text-indigo-400 font-bold text-right">{adjMatrix.nodes[i]}</td>
                    {row.map((val, j) => (
                      <td
                        key={j}
                        className={`w-7 h-6 text-center ${
                          val === 1
                            ? 'text-green-400 bg-green-950/40'
                            : 'text-gray-700 bg-gray-900/30'
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Incidence Matrix */}
      {view === 'inc-matrix' && (
        <div>
          <p className="text-[10px] text-gray-600 dark:text-gray-500 mb-2">
            {incMatrix.nodes.length}×{incMatrix.edges.length} —{' '}
            {isDirected
              ? '+1 saída, −1 entrada, 0 não incidente.'
              : '1 se o nó é incidente à aresta, 0 caso contrário.'}
          </p>
          {incMatrix.edges.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-600 italic">Nenhuma aresta no grafo.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-gray-950 border border-gray-800 p-2">
              <table className="text-xs font-mono border-collapse mx-auto">
                <thead>
                  <tr>
                    <th className="w-6 h-6 text-gray-600" />
                    {incMatrix.edges.map((eId, j) => (
                      <th key={j} className="h-6 text-amber-400 font-bold text-center px-1" style={{ minWidth: 28 }}>
                        {eId}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {incMatrix.matrix.map((row, i) => (
                    <tr key={incMatrix.nodes[i]}>
                      <td className="pr-2 text-indigo-400 font-bold text-right">{incMatrix.nodes[i]}</td>
                      {row.map((val, j) => (
                        <td
                          key={j}
                          className={`text-center h-6 ${
                            val === 1  ? 'text-green-400 bg-green-950/40' :
                            val === -1 ? 'text-red-400 bg-red-950/40' :
                            'text-gray-700 bg-gray-900/30'
                          }`}
                          style={{ minWidth: 28 }}
                        >
                          {val === 0 ? '0' : val === -1 ? '−1' : '1'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
