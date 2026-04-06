import { useState } from 'react';
import {
  findSCC,
  findConnectedComponents,
  findBridgesAndAPs,
  COMPONENT_COLORS,
} from '../../algorithms/connectivity.js';

export default function ConnectivityPanel({ elements, isDirected, onHighlight }) {
  const [result, setResult] = useState(null);

  const analyze = () => {
    if (elements.nodes.length === 0) return;

    const groups = isDirected
      ? findSCC(elements)
      : findConnectedComponents(elements);

    const { bridges, articulationPoints } = isDirected
      ? { bridges: [], articulationPoints: [] }
      : findBridgesAndAPs(elements);

    const componentMap = {};
    groups.forEach((g, i) => g.forEach(id => { componentMap[id] = i; }));

    setResult({ groups, bridges, articulationPoints });
    onHighlight({
      componentMap,
      bridgeIds: new Set(bridges),
      apIds: new Set(articulationPoints),
    });
  };

  const clear = () => {
    setResult(null);
    onHighlight(null);
  };

  const groupLabel = isDirected ? 'SCC' : 'Componente';

  return (
    <div className="flex flex-col gap-4 text-sm">

      <p className="text-xs text-gray-600 dark:text-gray-500 leading-relaxed">
        {isDirected
          ? 'Identifica Componentes Conexos (SCCs) pelo algoritmo de Kosaraju. Nós do mesmo componente são coloridos iguais no grafo.'
          : 'Identifica Componentes Conexos, Pontes e Pontos de Articulação via DFS de Tarjan. Resultados são destacados visualmente no grafo.'}
      </p>

      <div className="flex gap-2">
        <button
          onClick={analyze}
          disabled={elements.nodes.length === 0}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors"
        >
          Analisar
        </button>
        {result && (
          <button
            onClick={clear}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
          >
            Limpar
          </button>
        )}
      </div>

      {result && (
        <div className="flex flex-col gap-4">

          {/* Components / SCCs */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-500 mb-2">
              {isDirected ? 'Componentes Conexos' : 'Componentes Conexos'} ({result.groups.length})
            </h3>
            <div className="flex flex-col gap-1.5">
              {result.groups.map((group, i) => {
                const c = COMPONENT_COLORS[i % COMPONENT_COLORS.length];
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
                    style={{ backgroundColor: c.bg + '99', borderLeft: `3px solid ${c.border}` }}
                  >
                    <span style={{ color: c.border }} className="font-bold shrink-0 mr-2">
                      {groupLabel} {i + 1}
                    </span>
                    <span style={{ color: c.text }} className="font-mono">
                      {[...group].sort().join(', ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bridges — undirected only */}
          {!isDirected && (
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-500 mb-2">
                Pontes ({result.bridges.length})
              </h3>
              {result.bridges.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-500 italic">Nenhuma ponte detectada.</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {result.bridges.map(edgeId => {
                    const edge = elements.edges.find(e => e.data.id === edgeId);
                    const label = edge
                      ? `${edge.data.source} - ${edge.data.target}`
                      : edgeId;
                    return (
                      <div key={edgeId} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40">
                        <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
                        <span className="text-xs text-red-600 dark:text-red-300 font-mono">{label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Articulation Points — undirected only */}
          {!isDirected && (
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-500 mb-2">
                Pontos de Articulação ({result.articulationPoints.length})
              </h3>
              {result.articulationPoints.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-500 italic">Nenhum ponto de articulação detectado.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {result.articulationPoints.map(id => (
                    <span
                      key={id}
                      className="text-xs px-2 py-0.5 rounded-full font-bold border bg-orange-50 dark:bg-orange-950/80 border-orange-400 dark:border-orange-500 text-orange-700 dark:text-orange-300"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-500 mb-1">Legenda</p>
            {result.groups.slice(0, 3).map((_, i) => {
              const c = COMPONENT_COLORS[i % COMPONENT_COLORS.length];
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full border-2 shrink-0" style={{ backgroundColor: c.bg, borderColor: c.border }} />
                  <span className="text-gray-700 dark:text-gray-400">{groupLabel} {i + 1}</span>
                </div>
              );
            })}
            {result.groups.length > 3 && (
              <p className="text-[10px] text-gray-500">+{result.groups.length - 3} componente(s)...</p>
            )}
            {!isDirected && (
              <>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span className="w-6 h-1 rounded-full bg-red-400 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-400">Ponte</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full border-2 shrink-0 border-orange-500 bg-orange-50 dark:bg-slate-900" />
                  <span className="text-gray-700 dark:text-gray-400">Ponto de Articulação</span>
                </div>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
