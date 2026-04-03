const TOOLS = [
  { id: 'addNode', icon: '⊕', label: 'Nó',    hint: 'Clique no canvas para adicionar um nó' },
  { id: 'addEdge', icon: '→',  label: 'Aresta', hint: 'Clique na origem, depois no destino' },
  { id: 'delete',  icon: '✕',  label: 'Deletar',hint: 'Clique em nó ou aresta para remover' },
];

const HINTS = {
  addNode: 'Clique em qualquer ponto do canvas para adicionar um nó.',
  addEdge: 'Clique no nó de origem, depois no nó de destino.',
  delete:  'Clique em um nó ou aresta para removê-lo.',
  null:    'Arraste os nós para reposicioná-los.',
};

export default function GraphBuilder({
  editMode,
  setEditMode,
  isDirected,
  setIsDirected,
  onClear,
  nodeCount,
  edgeCount,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-indigo-950/50 border-b border-indigo-800/40">
      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider mr-1">Editor</span>

      {/* Tool buttons */}
      {TOOLS.map(({ id, icon, label, hint }) => (
        <button
          key={id}
          title={hint}
          onClick={() => setEditMode(editMode === id ? null : id)}
          className={`flex items-center gap-1.5 px-3 py-1 text-sm rounded-lg border font-medium transition-colors ${
            editMode === id
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
              : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-indigo-500 hover:text-indigo-200'
          }`}
        >
          <span className="text-base leading-none">{icon}</span>
          <span>{label}</span>
        </button>
      ))}

      {/* Directed toggle */}
      <div className="flex items-center gap-2 ml-1">
        <span className="text-xs text-slate-400">Dirigido</span>
        <button
          onClick={() => setIsDirected(d => !d)}
          title={isDirected ? 'Mudar para não-dirigido' : 'Mudar para dirigido'}
          className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isDirected ? 'bg-indigo-600' : 'bg-slate-600'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              isDirected ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Clear */}
      <button
        onClick={onClear}
        className="px-3 py-1 text-sm rounded-lg border border-red-800/60 text-red-400 hover:bg-red-900/30 transition-colors"
        title="Remover todos os nós e arestas"
      >
        Limpar
      </button>

      {/* Info bar */}
      <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
        <span>
          <span className="text-slate-400">{nodeCount}</span> nós ·{' '}
          <span className="text-slate-400">{edgeCount}</span> arestas
        </span>
        <span className="text-indigo-400 italic hidden sm:block">
          {HINTS[editMode] ?? HINTS.null}
        </span>
      </div>
    </div>
  );
}
