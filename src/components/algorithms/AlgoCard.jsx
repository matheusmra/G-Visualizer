import { BFSPreview } from './previews/BFSPreview.jsx';
import { DFSPreview } from './previews/DFSPreview.jsx';
import { FTDPreview } from './previews/FTDPreview.jsx';
import { FTIPreview } from './previews/FTIPreview.jsx';
import { TOPOPreview } from './previews/TOPOPreview.jsx';

const PREVIEW_MAP = {
  BFS: BFSPreview,
  DFS: DFSPreview,
  FTD: FTDPreview,
  FTI: FTIPreview,
  TOPO: TOPOPreview,
};

const DIFFICULTY_COLORS = {
  'Fácil':  'bg-[#d5e3fc] text-[#004ac6] dark:bg-blue-950/60 dark:text-blue-300',
  'Médio':  'bg-[#fff3cd] text-[#7a5f00] dark:bg-yellow-950/60 dark:text-yellow-300',
  'Difícil':'bg-[#ffdad6] text-[#ba1a1a] dark:bg-red-950/60 dark:text-red-300',
};

const CATEGORY_COLORS = {
  'Travessia': 'bg-[#6ffbbe]/20 text-[#006242] dark:bg-emerald-950/60 dark:text-emerald-300',
  'Fecho':     'bg-[#dbe1ff] text-[#003ea8] dark:bg-blue-950/60 dark:text-blue-300',
  'Ordenação': 'bg-[#d5e3fc] text-[#004ac6] dark:bg-indigo-950/60 dark:text-indigo-300',
};

export function AlgoCard({ algo, onVisualize }) {
  const Preview = PREVIEW_MAP[algo.id] || (() => null);

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e0e3e5] dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
      {/* Visual preview */}
      <div className="relative h-44 bg-[#f2f4f6] dark:bg-slate-800/60 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full p-6">
          <Preview />
        </div>
        {/* Category badge */}
        <span
          className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${CATEGORY_COLORS[algo.category] ?? 'bg-gray-100 text-gray-600'}`}
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
            className={`shrink-0 ml-3 text-xs font-bold px-2.5 py-1 rounded-full ${DIFFICULTY_COLORS[algo.difficulty] ?? 'bg-gray-100 text-gray-600'}`}
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
            aria-label={`Visualizar algoritmo de ${algo.name}`}
            className="flex items-center gap-1.5 text-sm font-bold text-[#004ac6] dark:text-blue-400 hover:text-[#2563eb] dark:hover:text-blue-300 transition-colors group-hover:gap-2.5"
          >
            Visualizar
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  );
}
