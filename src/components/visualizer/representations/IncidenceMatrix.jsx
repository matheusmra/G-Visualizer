export function IncidenceMatrix({ incMatrix, isDirected }) {
  return (
    <div>
      <p className="text-[10px] text-[#737686] dark:text-slate-500 mb-2">
        {incMatrix.nodes.length}×{incMatrix.edges.length} -{' '}
        {isDirected
          ? '+1 saída, −1 entrada, 0 não incidente.'
          : '1 se o nó é incidente à aresta, 0 caso contrário.'}
      </p>
      {incMatrix.edges.length === 0 ? (
        <p className="text-xs text-[#515f74] dark:text-slate-400 italic">Nenhuma aresta no grafo.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white dark:bg-slate-900 border border-[#c3c6d7]/40 dark:border-slate-800 p-2 shadow-sm">
          <table className="text-xs font-mono border-collapse mx-auto">
            <thead>
              <tr>
                <th className="w-6 h-6 text-[#737686] dark:text-slate-500" />
                {incMatrix.edges.map((eId, j) => (
                  <th key={j} className="h-6 text-[#7a5f00] dark:text-yellow-500 font-bold text-center px-1" style={{ minWidth: 28 }}>
                    {eId}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {incMatrix.matrix.map((row, i) => (
                <tr key={incMatrix.nodes[i]}>
                  <td className="pr-2 text-[#004ac6] dark:text-blue-400 font-bold text-right">{incMatrix.nodes[i]}</td>
                  {row.map((val, j) => (
                    <td
                      key={j}
                      className={`text-center h-6 ${
                        val === 1  ? 'text-[#006242] dark:text-emerald-400 bg-[#d3efdc]/50 dark:bg-emerald-950/40' :
                        val === -1 ? 'text-[#ba1a1a] dark:text-red-400 bg-[#ffdad6]/50 dark:bg-red-950/40' :
                        'text-[#737686] dark:text-slate-500 bg-[#f7f9fb] dark:bg-slate-800/50'
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
  );
}
