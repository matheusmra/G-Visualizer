const TOOLS = [
  { id: 'addNode', label: 'Nó',     hint: 'Clique no canvas para adicionar um nó' },
  { id: 'addEdge', label: 'Aresta', hint: 'Clique no nó de origem, depois no nó de destino' },
  { id: 'delete',  label: 'Deletar',hint: 'Clique em nó ou aresta para remover' },
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
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mr-1">Editor</span>

      {/* Tool buttons */}
      {TOOLS.map(({ id, label, hint }) => (
        <button
          key={id}
          title={hint}
          onClick={() => setEditMode(editMode === id ? null : id)}
          className={`px-3 py-1 text-xs rounded-lg border font-medium transition-colors ${
            editMode === id
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-300'
          }`}
        >
          {label}
        </button>
      ))}

      {/* Directed toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Dirigido</span>
        <button
          onClick={() => setIsDirected(d => !d)}
          title={isDirected ? 'Mudar para não-dirigido' : 'Mudar para dirigido'}
          className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden ${
            isDirected ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
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
        className="px-3 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800 transition-colors"
        title="Remover todos os nós e arestas"
      >
        Limpar
      </button>

      {/* Info bar */}
      <div className="ml-auto flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 min-w-0">
        <span className="shrink-0">
          <span className="text-gray-600 dark:text-gray-400">{nodeCount}</span> nós ·{' '}
          <span className="text-gray-600 dark:text-gray-400">{edgeCount}</span> arestas
        </span>
        <span className="italic hidden sm:block truncate min-w-0">
          {HINTS[editMode] ?? HINTS.null}
        </span>
      </div>
    </div>
  );
}
