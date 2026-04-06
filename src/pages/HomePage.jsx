import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';
import { FeaturesSection, AlgoLibrarySection, BentoPreview } from '../components/home/HomeSections.jsx';

export default function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-[#191c1e] dark:text-slate-100 antialiased">

      {/* ── Sticky Nav ── */}
      <header className="sticky top-0 w-full z-50 bg-[#f7f9fb]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <nav className="flex justify-between items-center px-6 md:px-12 h-20 max-w-7xl mx-auto">
          <span className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight font-headline">
            G Visualizer
          </span>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium font-headline">
            <a
              className="text-[#004ac6] dark:text-blue-400 font-semibold border-b-2 border-[#004ac6] dark:border-blue-400 pb-0.5"
              href="#"
            >
              Explorar
            </a>
            <button
              onClick={() => navigate('/algoritmos')}
              className="text-slate-500 dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-300 transition-colors"
            >
              Algoritmos
            </button>
            <a
              href="https://github.com/matheusmra/G-Visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-300 transition-colors"
            >
              Docs
            </a>
          </div>

          <ThemeToggle className="px-4 py-2 font-medium font-headline" />
        </nav>
      </header>

      <main className="relative">
        <div className="dot-grid fixed inset-0 pointer-events-none" />

        {/* ── Hero ── */}
        <section className="relative pt-24 pb-32 px-6 md:px-12 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#d5e3fc] dark:bg-blue-950/60 text-[#57657a] dark:text-blue-300 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }} aria-hidden="true">terminal</span>
              V 0.1 · Visualizador Interativo
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-[#191c1e] dark:text-slate-50 font-headline">
              Visualize a Lógica<br />
              <span className="text-[#004ac6] dark:text-blue-400 italic">dos Grafos</span>
            </h1>

            <p className="max-w-2xl text-lg text-[#515f74] dark:text-slate-400 mb-12 leading-relaxed">
              Um laboratório digital para explorar estruturas de dados complexas.

            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/visualizar/BFS?preset=tree')}
                className="bg-[#004ac6] hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-[#004ac6]/30 flex items-center gap-3 font-headline"
              >
                Abrir o Lab
                <span className="material-symbols-outlined" aria-hidden="true">rocket_launch</span>
              </button>
              <button
                onClick={() => navigate('/algoritmos')}
                className="bg-[#f2f4f6] dark:bg-slate-800/80 hover:bg-[#eceef0] dark:hover:bg-slate-700 text-[#191c1e] dark:text-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition-all border border-[#c3c6d7]/30 dark:border-slate-700 font-headline"
              >
                Ver Algoritmos
              </button>
            </div>
          </div>
        </section>

        <BentoPreview />
        <FeaturesSection />
        <AlgoLibrarySection />

        {/* ── Open Source Section ── */}
        <section className="px-6 md:px-12 py-32">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-[#f8fafc] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#004ac6] to-transparent opacity-50" />

            <div className="mb-8 flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                <GitHubIcon size={32} />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#191c1e] dark:text-slate-50 font-headline tracking-tight">
              Powered by <span className="text-[#004ac6] dark:text-blue-400">Open Source</span>
            </h2>

            <p className="text-lg text-[#515f74] dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              O G Visualizer é um projeto educacional totalmente aberto e gratuito.
              Explore o código-fonte, contribua com novos algoritmos ou use-o como base para seus próprios estudos.
            </p>

            <div className="flex justify-center">
              <a
                href="https://github.com/matheusmra/G-Visualizer"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#191c1e] dark:bg-white text-white dark:text-[#191c1e] px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform flex items-center gap-3 font-headline"
              >
                <GitHubIcon size={24} />
                Ver no GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Mini Credits ── */}
      <div className="py-8 text-center text-xs text-slate-500 border-t border-slate-200/50 dark:border-slate-800/50">
        © {new Date().getFullYear()} G Visualizer · Código Aberto
      </div>
    </div>
  );
}

function GitHubIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
