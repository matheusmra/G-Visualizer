import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { ALGO_IDS, ALGO_TITLES } from '../../constants/algorithms.js';

const DIFFICULTY_COLORS = {
  'Fácil':  'bg-[#d5e3fc] text-[#004ac6] dark:bg-blue-950/60 dark:text-blue-300 border-[#004ac6]/10 dark:border-blue-800/30',
  'Médio':  'bg-[#fff3cd] text-[#7a5f00] dark:bg-yellow-950/60 dark:text-yellow-300 border-[#7a5f00]/10 dark:border-yellow-800/30',
  'Difícil':'bg-[#ffdad6] text-[#ba1a1a] dark:bg-red-950/60 dark:text-red-300 border-[#ba1a1a]/10 dark:border-red-800/30',
};

export function VisualizerHeader({ algoDetails, currentAlgo, onAlgoChange }) {
  const navigate = useNavigate();
  return (
    <header className="h-16 border-b border-[#e0e3e5] dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-40 relative">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => navigate('/algoritmos')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f2f4f6] dark:bg-slate-800 text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-400 hover:bg-[#eceef0] dark:hover:bg-slate-700 transition-colors"
          aria-label="Voltar para biblioteca de algoritmos"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }} aria-hidden="true">arrow_back</span>
        </button>

        <div className="h-6 w-px bg-[#e0e3e5] dark:bg-slate-800 hidden sm:block" />

        {/* Algorithm Tabs - High Priority Accessibility (HIGH-06) */}
        <nav className="flex items-center gap-1 mx-2" role="tablist" aria-label="Seleção de algoritmos">
          {ALGO_IDS.map(alg => (
            <button
              key={alg}
              role="tab"
              aria-selected={currentAlgo === alg}
              aria-label={`Visualizar algoritmo ${ALGO_TITLES[alg]}`}
              onClick={() => onAlgoChange?.(alg)}
              className={`px-3 py-1.5 text-xs font-bold font-headline transition-all rounded-lg ${
                currentAlgo === alg
                  ? 'bg-[#004ac6] text-white shadow-sm shadow-[#004ac6]/30'
                  : 'text-[#515f74] dark:text-slate-400 hover:bg-[#004ac6]/10 dark:hover:bg-blue-400/10 hover:text-[#004ac6] dark:hover:text-blue-400'
              }`}
            >
              {alg}
            </button>
          ))}
        </nav>

        <div className="h-6 w-px bg-[#e0e3e5] dark:bg-slate-800 hidden lg:block" />

        <div className="flex items-center gap-3 ml-2 hidden lg:flex">
          <span
            className="w-8 h-8 rounded-lg bg-[#004ac6]/10 dark:bg-blue-500/10 text-[#004ac6] dark:text-blue-400 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{algoDetails.icon}</span>
          </span>
          <h1 className="font-bold text-[#191c1e] dark:text-slate-100 text-lg font-headline flex items-center gap-2">
            {algoDetails.name}
            <span className="text-xs font-mono text-[#737686] dark:text-slate-500 font-normal">
              [{algoDetails.abbr}]
            </span>
          </h1>
          <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${DIFFICULTY_COLORS[algoDetails.difficulty] ?? ''}`}>
            {algoDetails.difficulty}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a
          href="https://github.com/matheusmra/G-Visualizer"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl text-[#737686] dark:text-slate-400 hover:bg-[#e0e3e5] dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center justify-center"
          aria-label="Documentação no GitHub"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }} aria-hidden="true">menu_book</span>
        </a>
      </div>
    </header>
  );
}
