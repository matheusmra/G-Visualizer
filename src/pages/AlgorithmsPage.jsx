import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

const ALGO_DEFAULT_PRESET = {
  BFS:  'tree',
  DFS:  'tree',
  FTD:  'directed',
  FTI:  'directed',
  TOPO: 'directed',
};

/* ── Algorithm catalogue ───────────────────────────────────────── */
const ALGORITHMS = [
  {
    id: 'BFS',
    tag: 'ALG-001',
    name: 'Busca em Largura',
    abbr: 'BFS',
    category: 'Travessia',
    difficulty: 'Fácil',
    complexityTime: 'O(V + E)',
    complexitySpace: 'O(V)',
    description:
      'Examina todos os nós da profundidade atual antes de avançar para o próximo nível. Ideal para caminhos mínimos em grafos não-ponderados.',
    icon: 'hub',
    /* Tiny SVG preview: level-order rings */
    Preview: () => (
      <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden="true">
        <circle cx="80" cy="22" r="14" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
        <text x="80" y="27" textAnchor="middle" fontSize="11" fill="#004ac6" fontWeight="700">1</text>
        <line x1="56" y1="34" x2="44" y2="56" stroke="#c3c6d7" strokeWidth="1.5" />
        <line x1="104" y1="34" x2="116" y2="56" stroke="#c3c6d7" strokeWidth="1.5" />
        <circle cx="40" cy="66" r="12" fill="#f7f9fb" stroke="#c3c6d7" strokeWidth="1.5" />
        <text x="40" y="71" textAnchor="middle" fontSize="11" fill="#737686">2</text>
        <circle cx="120" cy="66" r="12" fill="#f7f9fb" stroke="#c3c6d7" strokeWidth="1.5" />
        <text x="120" y="71" textAnchor="middle" fontSize="11" fill="#737686">3</text>
      </svg>
    ),
  },
  {
    id: 'DFS',
    tag: 'ALG-002',
    name: 'Busca em Profundidade',
    abbr: 'DFS',
    category: 'Travessia',
    difficulty: 'Fácil',
    complexityTime: 'O(V + E)',
    complexitySpace: 'O(V)',
    description:
      'Explora o mais fundo possível antes de retroceder. Essencial para detecção de ciclos, ordenação topológica e labirintos.',
    icon: 'account_tree',
    Preview: () => (
      <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden="true">
        <line x1="80" y1="16" x2="44" y2="46" stroke="#004ac6" strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="44" y1="46" x2="28" y2="76" stroke="#004ac6" strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="80" y1="16" x2="116" y2="46" stroke="#c3c6d7" strokeWidth="1.5" />
        <circle cx="80" cy="16" r="13" fill="#004ac6" />
        <text x="80" y="21" textAnchor="middle" fontSize="11" fill="white" fontWeight="700">A</text>
        <circle cx="44" cy="46" r="12" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
        <text x="44" y="51" textAnchor="middle" fontSize="11" fill="#004ac6">B</text>
        <circle cx="116" cy="46" r="12" fill="#f7f9fb" stroke="#c3c6d7" strokeWidth="1.5" />
        <text x="116" y="51" textAnchor="middle" fontSize="11" fill="#737686">C</text>
        <circle cx="28" cy="76" r="12" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
        <text x="28" y="81" textAnchor="middle" fontSize="11" fill="#004ac6">D</text>
      </svg>
    ),
  },
  {
    id: 'FTD',
    tag: 'ALG-003',
    name: 'Fecho Transitivo Direto',
    abbr: 'FTD',
    category: 'Fecho',
    difficulty: 'Médio',
    complexityTime: 'O(V + E)',
    complexitySpace: 'O(V)',
    description:
      'Encontra todos os nós alcançáveis a partir de uma origem seguindo as arestas do grafo direcionado.',
    icon: 'route',
    Preview: () => (
      <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden="true">
        <defs>
          <marker id="arrow-ftd" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#004ac6" />
          </marker>
        </defs>
        <line x1="30" y1="50" x2="68" y2="50" stroke="#004ac6" strokeWidth="1.5" markerEnd="url(#arrow-ftd)" />
        <line x1="90" y1="50" x2="126" y2="50" stroke="#004ac6" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrow-ftd)" />
        <line x1="80" y1="38" x2="80" y2="20" stroke="#c3c6d7" strokeWidth="1.5" markerEnd="url(#arrow-ftd)" />
        <circle cx="22" cy="50" r="13" fill="#004ac6" />
        <text x="22" y="55" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">S</text>
        <circle cx="80" cy="50" r="13" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
        <text x="80" y="55" textAnchor="middle" fontSize="10" fill="#004ac6">B</text>
        <circle cx="138" cy="50" r="13" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
        <text x="138" y="55" textAnchor="middle" fontSize="10" fill="#004ac6">C</text>
        <circle cx="80" cy="14" r="11" fill="#f0f4ff" stroke="#c3c6d7" strokeWidth="1.5" />
        <text x="80" y="19" textAnchor="middle" fontSize="10" fill="#737686">D</text>
      </svg>
    ),
  },
  {
    id: 'FTI',
    tag: 'ALG-004',
    name: 'Fecho Transitivo Indireto',
    abbr: 'FTI',
    category: 'Fecho',
    difficulty: 'Médio',
    complexityTime: 'O(V + E)',
    complexitySpace: 'O(V)',
    description:
      'Encontra todos os predecessores de um nó executando BFS no grafo com as arestas invertidas.',
    icon: 'swap_horiz',
    Preview: () => (
      <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden="true">
        <defs>
          <marker id="arrow-fti" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#737686" />
          </marker>
          <marker id="arrow-fti-b" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#004ac6" />
          </marker>
        </defs>
        <line x1="68" y1="50" x2="32" y2="50" stroke="#004ac6" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrow-fti-b)" />
        <line x1="126" y1="50" x2="92" y2="50" stroke="#c3c6d7" strokeWidth="1.5" markerEnd="url(#arrow-fti)" />
        <circle cx="22" cy="50" r="13" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
        <text x="22" y="55" textAnchor="middle" fontSize="10" fill="#004ac6">A</text>
        <circle cx="80" cy="50" r="13" fill="#004ac6" />
        <text x="80" y="55" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">T</text>
        <circle cx="138" cy="50" r="13" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
        <text x="138" y="55" textAnchor="middle" fontSize="10" fill="#004ac6">C</text>
      </svg>
    ),
  },
  {
    id: 'TOPO',
    tag: 'ALG-005',
    name: 'Ordenação Topológica',
    abbr: 'TOPO',
    category: 'Ordenação',
    difficulty: 'Médio',
    complexityTime: 'O(V + E)',
    complexitySpace: 'O(V)',
    description:
      'Ordena os vértices de um DAG de modo que toda aresta (u→v) posicione u antes de v na sequência final.',
    icon: 'sort',
    Preview: () => (
      <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden="true">
        <defs>
          <marker id="arrow-topo" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#004ac6" />
          </marker>
        </defs>
        {[20, 62, 104, 146].map((cx, i) => (
          <g key={cx}>
            {i < 3 && <line x1={cx + 14} y1="50" x2={cx + 34} y2="50" stroke="#004ac6" strokeWidth="1.5" markerEnd="url(#arrow-topo)" />}
            <circle cx={cx} cy="50" r="12" fill={i === 0 ? '#004ac6' : '#dbe1ff'} stroke={i === 0 ? '#004ac6' : '#004ac6'} strokeWidth={i === 0 ? 0 : 1.5} />
            <text x={cx} y="55" textAnchor="middle" fontSize="10" fill={i === 0 ? 'white' : '#004ac6'} fontWeight="600">
              {['A', 'B', 'C', 'D'][i]}
            </text>
          </g>
        ))}
      </svg>
    ),
  },
];

/* ── Difficulty badge colours ───────────────────────────────────── */
const DIFFICULTY_COLORS = {
  'Fácil':  'bg-[#d5e3fc] text-[#004ac6] dark:bg-blue-950/60 dark:text-blue-300',
  'Médio':  'bg-[#fff3cd] text-[#7a5f00] dark:bg-yellow-950/60 dark:text-yellow-300',
  'Difícil':'bg-[#ffdad6] text-[#ba1a1a] dark:bg-red-950/60 dark:text-red-300',
};

/* ── Category colours ───────────────────────────────────────────── */
const CATEGORY_COLORS = {
  'Travessia': 'bg-[#6ffbbe]/20 text-[#006242] dark:bg-emerald-950/60 dark:text-emerald-300',
  'Fecho':     'bg-[#dbe1ff] text-[#003ea8] dark:bg-blue-950/60 dark:text-blue-300',
  'Ordenação': 'bg-[#d5e3fc] text-[#004ac6] dark:bg-indigo-950/60 dark:text-indigo-300',
};

const ALL_CATEGORIES = ['Todos', 'Travessia', 'Fecho', 'Ordenação'];

/* ── Page component ─────────────────────────────────────────────── */
export default function AlgorithmsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const isDark = theme === 'dark';

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
            <span className="material-symbols-outlined text-[#737686] dark:text-slate-400" style={{ fontSize: '18px' }}>search</span>
            <input
              type="text"
              placeholder="Buscar algoritmos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-[#191c1e] dark:text-slate-200 placeholder-[#737686] dark:placeholder-slate-500 outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-sm bg-[#eceef0] dark:bg-slate-800 text-[#737686] dark:text-slate-400 hover:bg-[#e0e3e5] dark:hover:bg-slate-700 transition-colors"
              title="Alternar tema"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button
              onClick={() => navigate('/visualizar/BFS')}
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
            Uma coleção curada de primitivas de processamento de grafos — cada uma visualizada
            com nossa engine de lógica cinética para máxima clareza estrutural.
          </p>
        </div>

        {/* ── Filter bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
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
            <span className="material-symbols-outlined text-[#737686]" style={{ fontSize: '18px' }}>search</span>
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
            <span className="material-symbols-outlined text-[#c3c6d7] dark:text-slate-700 mb-4" style={{ fontSize: '64px' }}>search_off</span>
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

      {/* ── Footer ── */}
      <footer className="mt-20 bg-white dark:bg-slate-900 border-t border-[#e0e3e5] dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <span className="text-lg font-black text-[#191c1e] dark:text-slate-100 font-headline block mb-3">
              G Visualizer
            </span>
            <p className="text-sm text-[#515f74] dark:text-slate-400 leading-relaxed">
              Capacitando a próxima geração de cientistas da computação com visualizações de alta fidelidade.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#191c1e] dark:text-slate-100 mb-5">Recursos</h4>
            <ul className="space-y-3">
              {['Documentação da API', 'Repositório GitHub', 'Status'].map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-400 transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#191c1e] dark:text-slate-100 mb-5">Legal</h4>
            <ul className="space-y-3">
              {['Política de Privacidade', 'Termos de Uso'].map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-400 transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#191c1e] dark:text-slate-100 mb-5">Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 bg-[#f2f4f6] dark:bg-slate-800 border border-[#c3c6d7]/40 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-[#191c1e] dark:text-slate-200 placeholder-[#737686] outline-none focus:border-[#004ac6] dark:focus:border-blue-500 transition-colors"
              />
              <button className="w-10 h-10 flex items-center justify-center bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl transition-colors shrink-0">
                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-[#e0e3e5] dark:border-slate-800 px-6 md:px-12 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-[#737686] dark:text-slate-500">
            © 2024 G Visualizer. Desenvolvido para Clareza Científica.
          </span>
          <div className="flex gap-4">
            <a
              href="https://github.com/matheusmra/G-Visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#737686] dark:text-slate-500 hover:text-[#004ac6] dark:hover:text-blue-400 transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Algorithm Card ─────────────────────────────────────────────── */
function AlgoCard({ algo, onVisualize }) {
  const { Preview } = algo;
  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e0e3e5] dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
      {/* Visual preview */}
      <div className="relative h-44 bg-[#f2f4f6] dark:bg-slate-800/60 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full p-6">
          <Preview />
        </div>
        {/* Category badge */}
        <span
          className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
            CATEGORY_COLORS[algo.category] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {algo.category}
        </span>
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-[#191c1e] dark:text-slate-100 text-lg leading-snug font-headline">
            {algo.name}
          </h3>
          <span
            className={`shrink-0 ml-3 text-xs font-bold px-2.5 py-1 rounded-full ${
              DIFFICULTY_COLORS[algo.difficulty] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {algo.difficulty}
          </span>
        </div>

        <p className="text-sm text-[#515f74] dark:text-slate-400 leading-relaxed mb-5 flex-1">
          {algo.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737686] dark:text-slate-500 block mb-0.5">
              Complexidade
            </span>
            <code className="text-sm font-mono font-semibold text-[#004ac6] dark:text-blue-400">
              {algo.complexityTime}
            </code>
          </div>

          <button
            onClick={onVisualize}
            className="flex items-center gap-1.5 text-sm font-bold text-[#004ac6] dark:text-blue-400 hover:text-[#2563eb] dark:hover:text-blue-300 transition-colors group-hover:gap-2.5"
          >
            Visualizar
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
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
