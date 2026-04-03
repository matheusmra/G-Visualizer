import { useNavigate } from 'react-router-dom';
import { PRESETS } from '../data/presets.js';
import { useTheme } from '../context/ThemeContext.jsx';

const ALGO_CARDS = [
  {
    id: 'BFS',
    name: 'Busca em Largura',
    abbr: 'BFS',
    description: 'Explora o grafo nível por nível usando uma fila. Garante o caminho mais curto em grafos não-ponderados.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    bestFor: ['Menor caminho', 'Nível / distância', 'Grafos não-ponderados'],
  },
  {
    id: 'DFS',
    name: 'Busca em Profundidade',
    abbr: 'DFS',
    description: 'Mergulha o mais fundo possível antes de retroceder, usando uma pilha. Base para detectar ciclos e ordenação topológica.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    bestFor: ['Detecção de ciclos', 'Ordenação topológica', 'Labirintos'],
  },
  {
    id: 'FTD',
    name: 'Fecho Transitivo Direto',
    abbr: 'FTD',
    description: 'Encontra todos os nós alcançáveis a partir de uma origem seguindo as arestas de saída do grafo direcionado.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    bestFor: ['Alcançabilidade', 'Dependências', 'Grafos dirigidos'],
  },
  {
    id: 'FTI',
    name: 'Fecho Transitivo Indireto',
    abbr: 'FTI',
    description: 'Encontra todos os predecessores de uma origem executando BFS no grafo com as arestas invertidas.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    bestFor: ['Predecessores', 'Impacto reverso', 'Grafos dirigidos'],
  },
];

const PRESET_LIST = Object.entries(PRESETS).map(([key, p]) => ({
  key,
  name: p.name,
  description: p.description,
  directed: p.directed ?? false,
  nodeCount: p.elements.nodes.length,
  edgeCount: p.elements.edges.length,
}));

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">

      {/* Nav */}
      <nav className="border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">G</span>
          <span className="text-lg font-bold">Visualizer</span>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-5 px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl font-black text-gray-900 dark:text-gray-50 leading-tight">
          Visualize algoritmos de<br className="hidden sm:block" /> grafos passo a passo
        </h1>
        <p className="max-w-lg text-gray-500 dark:text-gray-400 text-base leading-relaxed">
          Aprenda BFS, DFS, Fecho Transitivo Direto e Indireto com execução interativa,
          estruturas de dados em tempo real e pseudocódigo destacado.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {['Execução passo a passo', 'Histórico navegável', 'Pseudocódigo', 'Editor de grafos'].map(f => (
            <span key={f} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs">
              {f}
            </span>
          ))}
        </div>
      </section>

      <div className="w-full max-w-5xl mx-auto px-6 pb-20 flex flex-col gap-14">

        {/* Algoritmos */}
        <section>
          <SectionTitle>Algoritmos</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {ALGO_CARDS.map(card => (
              <button
                key={card.id}
                onClick={() => navigate(`/visualizar/${card.id}`)}
                className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800/70 p-5 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="inline-block text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-1">
                      {card.abbr}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{card.name}</h3>
                  </div>
                  <span className="text-gray-300 dark:text-gray-700 group-hover:text-indigo-400 dark:group-hover:text-indigo-500 transition-colors text-lg leading-none mt-0.5">›</span>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{card.description}</p>

                <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500 mb-3">
                  <span>Tempo: <code className="text-gray-700 dark:text-gray-300">{card.complexity.time}</code></span>
                  <span>Espaço: <code className="text-gray-700 dark:text-gray-300">{card.complexity.space}</code></span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {card.bestFor.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 py-1.5 text-center rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 dark:group-hover:bg-indigo-600 dark:group-hover:text-white dark:group-hover:border-indigo-600 transition-all">
                  Visualizar {card.abbr}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Biblioteca de grafos */}
        <section>
          <SectionTitle>Biblioteca de Grafos</SectionTitle>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-4">
            Grafos prontos para usar. Clique em qualquer um para abrir no visualizador.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {PRESET_LIST.map(p => (
              <button
                key={p.key}
                onClick={() => navigate(`/visualizar/BFS?preset=${p.key}`)}
                className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 p-4 transition-all"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{p.name}</span>
                  {p.directed && (
                    <span className="text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded-full ml-2 shrink-0">
                      dirigido
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{p.description}</p>
                <div className="flex gap-2 mt-2 text-xs text-gray-400 dark:text-gray-600">
                  <span>{p.nodeCount} nós</span>
                  <span>·</span>
                  <span>{p.edgeCount} arestas</span>
                </div>
              </button>
            ))}

            <button
              onClick={() => navigate('/visualizar/BFS?preset=custom')}
              className="text-left rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-indigo-400 dark:hover:border-indigo-600 p-4 transition-all"
            >
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm block mb-1">Grafo Customizado</span>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                Construa seu próprio grafo: adicione nós, conecte arestas e defina se é dirigido.
              </p>
            </button>
          </div>
        </section>

        {/* Como usar */}
        <section>
          <SectionTitle>Como Usar</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {[
              { n: '1', title: 'Escolha um grafo',      text: 'Selecione um dos presets da biblioteca ou construa o seu próprio no modo customizado.' },
              { n: '2', title: 'Escolha o algoritmo',   text: 'Selecione BFS, DFS, Fecho Transitivo Direto ou Indireto no painel de controle.' },
              { n: '3', title: 'Execute passo a passo', text: 'Clique em Passo para avançar uma iteração, use Play para animação automática ou Voltar para rever.' },
            ].map(step => (
              <div key={step.n} className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
                <div className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold text-sm flex items-center justify-center mb-3">
                  {step.n}
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Código Aberto */}
        <section>
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center text-center gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Powered by Open Source
              </h2>
              <p className="max-w-lg text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                G Visualizer é um projeto educacional de código aberto. Contribua com novos algoritmos,
                grafos ou melhorias de interface, toda ajuda é bem-vinda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {[
                { title: 'Algoritmos modulares', text: 'Cada algoritmo vive em seu próprio arquivo e pode ser estendido independentemente.' },
                { title: 'Passo a passo verificável', text: 'Toda transição de estado é uma função pura fácil de testar e auditar.' },
                { title: 'Interface adaptável', text: 'Modo claro e escuro, layout responsivo, sem dependências de UI externas.' },
              ].map(f => (
                <div key={f.title} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 text-left">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 w-full">
              <a
                href="https://github.com/matheusmra/G-Visualizer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:opacity-90 transition-opacity"
              >
                <GitHubIcon />
                Ver no GitHub
              </a>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                <span>React + Vite</span>
                <span>·</span>
                <span>Cytoscape.js</span>
                <span>·</span>
                <span>TailwindCSS</span>
                <span>·</span>
                <span>Código aberto</span>
              </div>
              <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
                <span className="text-xs text-gray-400 dark:text-gray-500">Feito por Matheus</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
      {children}
    </h2>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
    </button>
  );
}
