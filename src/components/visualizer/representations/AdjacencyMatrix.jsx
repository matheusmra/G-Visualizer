export function AdjacencyMatrix({ adjMatrix, isDirected }) {
  return (
    <div>
      <p className="text-[10px] text-[#737686] dark:text-slate-500 mb-2">
        {adjMatrix.nodes.length}×{adjMatrix.nodes.length} - 1 se existe aresta, 0 caso contrário.
        {isDirected ? ' Linha = origem, coluna = destino.' : ''}
      </p>
      <div className="overflow-x-auto rounded-xl bg-white dark:bg-slate-900 border border-[#c3c6d7]/40 dark:border-slate-800 p-2 shadow-sm">
        <table className="text-xs font-mono border-collapse mx-auto">
          <thead>
            <tr>
              <th className="w-6 h-6 text-[#737686] dark:text-slate-500" />
              {adjMatrix.nodes.map(n => (
                <th key={n} className="w-7 h-6 text-[#004ac6] dark:text-blue-400 font-bold text-center px-1">{n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adjMatrix.matrix.map((row, i) => (
              <tr key={adjMatrix.nodes[i]}>
                <td className="pr-2 text-[#004ac6] dark:text-blue-400 font-bold text-right">{adjMatrix.nodes[i]}</td>
                {row.map((val, j) => (
                  <td
                    key={j}
                    className={`w-7 h-6 text-center ${
                      val === 1
                        ? 'text-[#006242] dark:text-emerald-400 bg-[#d3efdc]/50 dark:bg-emerald-950/40'
                        : 'text-[#737686] dark:text-slate-500 bg-[#f7f9fb] dark:bg-slate-800/50'
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
  );
}
