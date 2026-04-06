import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';
import { ALGORITHMS, ALGO_DEFAULT_PRESET } from '../data/algorithms.js';
import { AlgoCard } from '../components/algorithms/AlgoCard.jsx';

const ALL_CATEGORIES = ['Todos', 'Travessia', 'Fecho', 'Ordenação'];

/* ── Page component ─────────────────────────────────────────────── */
export default function AlgorithmsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = ALGORITHMS.filter(a => {
    const matchCat = activeCategory === 'Todos' || a.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.abbr.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-[#191c1e] dark:text-slate-100 antialiased">

      {/* ── Sticky Nav ── */}
      <header className="sticky top-0 w-full z-50 bg-[#f7f9fb]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <nav className="flex justify-between items-center px-6 md:px-12 h-16 max-w-7xl mx-auto gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight font-headline shrink-0"
          >
            G Visualizer
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium font-headline">
            <button
              onClick={() => navigate('/')}
              className="text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-300 transition-colors"
            >
              Explorar
            </button>
            <button
              className="text-[#004ac6] dark:text-blue-400 font-semibold border-b-2 border-[#004ac6] dark:border-blue-400 pb-0.5"
            >
              Algoritmos
            </button>
            <a
              href="https://github.com/matheusmra/G-Visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-300 transition-colors"
            >
              Docs
            </a>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs hidden md:flex items-center gap-2 bg-[#eceef0] dark:bg-slate-800 rounded-xl px-3 py-2 border border-[#c3c6d7]/40 dark:border-slate-700">
            <span className="material-symbols-outlined text-[#737686] dark:text-slate-400" aria-hidden="true" style={{ fontSize: '18px' }}>search</span>
            <input
              type="text"
              placeholder="Buscar algoritmos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-[#191c1e] dark:text-slate-200 placeholder-[#737686] dark:placeholder-slate-500 outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => navigate(`/visualizar/BFS?preset=${ALGO_DEFAULT_PRESET.BFS}`)}
              className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-5 py-2 rounded-xl font-bold text-sm transition-colors font-headline hidden sm:block"
            >
              Abrir Lab
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">

        {/* ── Page title ── */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#191c1e] dark:text-slate-50 mb-3 font-headline">
            Biblioteca de Algoritmos
          </h1>
          <p className="text-[#515f74] dark:text-slate-400 max-w-xl leading-relaxed">
            Uma coleção curada de primitivas de processamento de grafos - cada uma visualizada
            com nossa engine de lógica cinética para máxima clareza estrutural.
          </p>
        </div>

        {/* ── Filter bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Categorias de algoritmos">
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border font-headline ${
                  activeCategory === cat
                    ? 'bg-white dark:bg-slate-800 text-[#004ac6] dark:text-blue-400 border-[#004ac6]/30 dark:border-blue-700 shadow-sm'
                    : 'bg-transparent text-[#515f74] dark:text-slate-400 border-[#c3c6d7]/40 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Mobile search */}
          <div className="flex md:hidden items-center gap-2 bg-[#eceef0] dark:bg-slate-800 rounded-xl px-3 py-2 border border-[#c3c6d7]/40 dark:border-slate-700">
            <span className="material-symbols-outlined text-[#737686]" aria-hidden="true" style={{ fontSize: '18px' }}>search</span>
            <input
              type="text"
              placeholder="Buscar algoritmos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-[#191c1e] dark:text-slate-200 placeholder-[#737686] outline-none w-full"
            />
          </div>

          {/* Result count */}
          <span className="text-xs text-[#737686] dark:text-slate-500 shrink-0">
            {filtered.length} algoritmo{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Algorithm grid ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="material-symbols-outlined text-[#c3c6d7] dark:text-slate-700 mb-4" style={{ fontSize: '64px' }} aria-hidden="true">search_off</span>
            <p className="text-[#515f74] dark:text-slate-400 font-medium">
              Nenhum algoritmo encontrado para "<span className="text-[#191c1e] dark:text-slate-200">{search}</span>"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(algo => (
              <AlgoCard key={algo.id} algo={algo} onVisualize={() => navigate(`/visualizar/${algo.id}?preset=${ALGO_DEFAULT_PRESET[algo.id] ?? 'cyclic'}`)} />
            ))}
          </div>
        )}
      </main>

      {/* ── Mini Credits ── */}
      <footer className="py-8 text-center text-xs text-slate-500 border-t border-slate-200/50 dark:border-slate-800/50">
        © {new Date().getFullYear()} G Visualizer · Código Aberto
      </footer>
    </div>
  );
}

/* ── GitHub icon ────────────────────────────────────────────────── */
function GitHubIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
