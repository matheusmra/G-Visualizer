import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

const ALGO_DEFAULT_PRESET = {
  BFS:  'tree',
  DFS:  'tree',
  FTD:  'directed',
  FTI:  'directed',
  TOPO: 'directed',
};

const ALGO_CARDS = [
  {
    id: 'BFS',
    tag: 'ALG-001',
    abbr: 'BFS',
    name: 'Busca em Largura',
    description: 'Explora o grafo nível por nível usando uma fila. Garante o caminho mais curto em grafos não-ponderados.',
    icon: 'hub',
  },
  {
    id: 'DFS',
    tag: 'ALG-002',
    abbr: 'DFS',
    name: 'Busca em Profundidade',
    description: 'Mergulha o mais fundo possível antes de retroceder. Base para detectar ciclos e ordenação topológica.',
    icon: 'account_tree',
  },
  {
    id: 'FTD',
    tag: 'ALG-003',
    abbr: 'FTD',
    name: 'Fecho Transitivo Direto',
    description: 'Todos os nós alcançáveis a partir de uma origem seguindo as arestas do grafo direcionado.',
    icon: 'route',
  },
  {
    id: 'FTI',
    tag: 'ALG-004',
    abbr: 'FTI',
    name: 'Fecho Transitivo Indireto',
    description: 'Predecessores de um nó origem. Executa BFS no grafo com as arestas invertidas.',
    icon: 'swap_horiz',
  },
  {
    id: 'TOPO',
    tag: 'ALG-005',
    abbr: 'TOPO',
    name: 'Ordenação Topológica',
    description: 'Ordena os vértices de um DAG de forma que toda aresta (u→v) posicione u antes de v.',
    icon: 'sort',
  },
];

const FEATURES = [
  {
    icon: 'step_into',
    color: '#004ac6',
    bg: 'rgba(0,74,198,0.07)',
    title: 'Debugger Passo a Passo',
    text: 'Desconstrua algoritmos em operações lógicas únicas. Rebobine, pause e repita cada mudança de estado.',
  },
  {
    icon: 'data_object',
    color: '#006242',
    bg: 'rgba(0,98,66,0.07)',
    title: 'Estados ao Vivo',
    text: 'Observe a pilha de variáveis internas em tempo real enquanto o algoritmo navega pela hierarquia do grafo.',
  },
  {
    icon: 'draw',
    color: '#515f74',
    bg: 'rgba(81,95,116,0.07)',
    title: 'Canvas Interativo',
    text: 'Crie seus próprios casos de teste. Arraste nós, conecte arestas e defina pesos com uma interface intuitiva.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';
  const nodeStroke = isDark ? '#334155' : '#c3c6d7';
  const nodeFill   = isDark ? '#1e293b' : 'white';
  const lineGray   = isDark ? '#334155' : '#c3c6d7';

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

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl text-sm font-medium font-headline bg-[#eceef0] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#e0e3e5] dark:hover:bg-slate-700 transition-colors"
          >
            {isDark ? '☀ Claro' : '◐ Escuro'}
          </button>
        </nav>
      </header>

      <main className="relative">
        {/* Subtle dot-grid background */}
        <div className="dot-grid fixed inset-0 pointer-events-none" />

        {/* ── Hero ── */}
        <section className="relative pt-24 pb-32 px-6 md:px-12 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#d5e3fc] dark:bg-blue-950/60 text-[#57657a] dark:text-blue-300 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>terminal</span>
              V 2.0 · Visualizador Interativo
            </div>

            <h1
              className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-[#191c1e] dark:text-slate-50 font-headline"
            >
              Visualize a Lógica<br />
              <span className="text-[#004ac6] dark:text-blue-400 italic">dos Grafos</span>
            </h1>

            <p className="max-w-2xl text-lg text-[#515f74] dark:text-slate-400 mb-12 leading-relaxed">
              Um laboratório digital para explorar estruturas de dados complexas.
              Visualizações de precisão para a próxima geração de cientistas da computação.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/visualizar/BFS')}
                className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-[#004ac6]/30 flex items-center gap-3 font-headline"
              >
                Abrir o Lab
                <span className="material-symbols-outlined">rocket_launch</span>
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

        {/* ── Bento Canvas Demo ── */}
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Graph viewport */}
              <div className="lg:col-span-8 h-[520px] bg-[#e0e3e5] dark:bg-slate-900 rounded-3xl relative overflow-hidden shadow-inner border border-[#c3c6d7]/20 dark:border-slate-800">
                <div className="absolute inset-0 dot-grid opacity-10" />

                <svg className="absolute inset-0 w-full h-full p-12" aria-hidden="true">
                  <line stroke={lineGray}    strokeWidth="2" x1="20%" y1="20%" x2="50%" y2="50%" />
                  <line stroke="#004ac6"     strokeWidth="3" strokeDasharray="8,8" x1="50%" y1="50%" x2="80%" y2="30%" />
                  <line stroke={lineGray}    strokeWidth="2" x1="50%" y1="50%" x2="70%" y2="80%" />
                  <line stroke={lineGray}    strokeWidth="2" x1="20%" y1="20%" x2="30%" y2="70%" />

                  <circle cx="20%" cy="20%" r="24" fill={nodeFill} stroke={nodeStroke} strokeWidth="1" />
                  <circle cx="50%" cy="50%" r="24" fill={nodeFill} stroke="#004ac6"    strokeWidth="4" />
                  <circle cx="80%" cy="30%" r="24" fill={nodeFill} stroke={nodeStroke} strokeWidth="1" />
                  <circle cx="70%" cy="80%" r="24" fill={nodeFill} stroke={nodeStroke} strokeWidth="1" />
                  <circle cx="30%" cy="70%" r="24" fill={nodeFill} stroke={nodeStroke} strokeWidth="1" />
                </svg>

                {/* Player controls */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel px-6 py-4 rounded-2xl flex items-center gap-6 shadow-2xl border border-white/40 dark:border-slate-700/40">
                  <button className="text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>skip_previous</span>
                  </button>
                  <button className="w-14 h-14 bg-[#004ac6] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#004ac6]/40 hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined" style={{ fontSize: '30px', fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </button>
                  <button className="text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>skip_next</span>
                  </button>
                  <div className="w-px h-8 bg-[#c3c6d7]/40 dark:bg-slate-700 mx-2" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#737686] dark:text-slate-500 uppercase tracking-widest">Progresso</span>
                    <span className="text-sm font-mono font-medium text-[#004ac6] dark:text-blue-400">PASSO 04 / 12</span>
                  </div>
                </div>

                {/* Live badge */}
                <div className="absolute top-8 left-8 glass-panel px-4 py-2 rounded-xl border border-white/40 dark:border-slate-700/40 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#004ac6] active-dot" />
                  <span className="text-xs font-bold text-[#191c1e] dark:text-slate-200 uppercase tracking-wider font-headline">
                    BFS ao Vivo
                  </span>
                </div>
              </div>

              {/* Side panels */}
              <div className="lg:col-span-4 flex flex-col gap-6">

                {/* Variables panel */}
                <div className="bg-[#f2f4f6] dark:bg-slate-900 p-6 rounded-3xl flex-1 flex flex-col gap-4 border border-[#c3c6d7]/20 dark:border-slate-800">
                  <h3 className="font-bold text-lg text-[#191c1e] dark:text-slate-100 font-headline">Variáveis</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'fila',      value: '[A, C, D, E]' },
                      { key: 'nó_atual',  value: 'Nó B', highlight: true },
                      { key: 'visitados', value: '{A: 0, B: 4}' },
                    ].map(v => (
                      <div key={v.key} className="bg-white dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center">
                        <span className="font-mono text-sm text-[#191c1e] dark:text-slate-200">{v.key}</span>
                        <span
                          className={`text-xs font-mono px-2 py-1 rounded ${
                            v.highlight
                              ? 'bg-[#004ac6]/10 text-[#004ac6] dark:text-blue-400 font-bold'
                              : 'bg-[#eceef0] dark:bg-slate-700 text-[#191c1e] dark:text-slate-300'
                          }`}
                        >
                          {v.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pseudocode panel */}
                <div className="bg-[#2d3133] dark:bg-slate-900/90 p-6 rounded-3xl flex-1 border border-slate-700/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-white font-headline">Pseudocódigo</h3>
                    <span className="material-symbols-outlined text-white/40">code</span>
                  </div>
                  <pre className="font-mono text-sm leading-relaxed text-white/70 overflow-auto whitespace-pre-wrap">
                    <span style={{ color: '#4edea3' }}>function</span>{' BFS(Grafo, Origem):\n'}
                    {'  fila ← [Origem]\n'}
                    {'  visitados ← ∅\n'}
                    {'  '}
                    <span style={{ color: '#b4c5ff' }}>enquanto</span>
                    {' fila ≠ ∅:\n'}
                    {'    u ← fila.remover()\n'}
                    {'    '}
                    <span style={{ color: '#b4c5ff' }}>para cada</span>
                    {' v em adj[u]:\n'}
                    {'      fila.inserir(v)'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="px-6 md:px-12 py-24 bg-[#f2f4f6]/50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-4 text-[#191c1e] dark:text-slate-50 font-headline">
                  Instrumentação Avançada
                </h2>
                <p className="text-[#515f74] dark:text-slate-400 max-w-lg">
                  Tudo que você precisa para dissecar e entender algoritmos complexos do zero.
                </p>
              </div>
              <div className="h-px flex-1 bg-[#c3c6d7]/30 dark:bg-slate-700/30 mx-12 hidden md:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURES.map(f => (
                <div
                  key={f.title}
                  className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-[#c3c6d7]/20 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: f.bg, color: f.color }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>{f.icon}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-[#191c1e] dark:text-slate-100 font-headline">{f.title}</h3>
                  <p className="text-[#515f74] dark:text-slate-400 leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Algorithm Library ── */}
        <section id="algoritmos" className="px-6 md:px-12 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-[#191c1e] dark:text-slate-50 font-headline">
                Biblioteca Padrão
              </h2>
              <p className="text-[#515f74] dark:text-slate-400">
                Explore nosso catálogo de implementações visuais otimizadas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALGO_CARDS.map(card => (
                <div
                  key={card.id}
                  onClick={() => navigate(`/visualizar/${card.id}?preset=${ALGO_DEFAULT_PRESET[card.id] ?? 'cyclic'}`)}
                  className="bg-[#eceef0] dark:bg-slate-800/50 p-1 rounded-[2rem] group cursor-pointer overflow-hidden"
                >
                  <div className="bg-white dark:bg-slate-950 h-full w-full p-8 rounded-[1.9rem] flex flex-col group-hover:bg-[#004ac6] dark:group-hover:bg-[#004ac6] group-hover:text-white transition-all duration-300">
                    <div className="flex justify-between items-start mb-12">
                      <div className="font-mono text-xs font-bold opacity-40 text-[#191c1e] dark:text-slate-400 group-hover:text-white/60">
                        {card.tag}
                      </div>
                      <span
                        className="material-symbols-outlined text-[#191c1e] dark:text-slate-300 group-hover:text-white group-hover:translate-x-2 transition-transform"
                        style={{ fontSize: '40px' }}
                      >
                        {card.icon}
                      </span>
                    </div>
                    <h4 className="font-bold text-3xl mb-2 text-[#191c1e] dark:text-slate-100 group-hover:text-white font-headline">
                      {card.abbr}
                    </h4>
                    <p className="text-[#515f74] dark:text-slate-400 group-hover:text-white/80 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 md:px-12 py-32">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-[#004ac6] to-[#2563eb] p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-[#004ac6]/40">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <h2 className="text-5xl font-bold mb-8 relative z-10 font-headline">
              Pronto para dominar grafos?
            </h2>
            <p className="text-xl text-[#b4c5ff] mb-12 relative z-10 max-w-xl mx-auto">
              Explore algoritmos, construa seus próprios grafos e visualize cada passo da execução.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/visualizar/BFS')}
                className="bg-white text-[#004ac6] px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform font-headline"
              >
                Começar Agora
              </button>
              <a
                href="https://github.com/matheusmra/G-Visualizer"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all font-headline"
              >
                Documentação
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Powered by Open Source ── */}
      <div className="w-full max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-2xl bg-[#f2f4f6] dark:bg-slate-900 border border-[#e0e3e5] dark:border-slate-800 p-8 flex flex-col items-center text-center gap-6">
          <div>
            <h2 className="text-xl font-bold text-[#191c1e] dark:text-slate-100 mb-2 font-headline">
              Powered by Open Source
            </h2>
            <p className="max-w-lg text-sm text-[#515f74] dark:text-slate-400 leading-relaxed">
              G Visualizer é um projeto educacional de código aberto. Contribua com novos algoritmos,
              grafos ou melhorias de interface — toda ajuda é bem-vinda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {[
              { title: 'Algoritmos modulares',      text: 'Cada algoritmo vive em seu próprio arquivo e pode ser estendido independentemente.' },
              { title: 'Passo a passo verificável', text: 'Toda transição de estado é uma função pura — fácil de testar e auditar.' },
              { title: 'Interface adaptável',       text: 'Modo claro e escuro, layout responsivo, sem dependências de UI externas.' },
            ].map(f => (
              <div key={f.title} className="rounded-xl border border-[#e0e3e5] dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 text-left">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#004ac6] dark:text-blue-400 mb-1">{f.title}</h3>
                <p className="text-xs text-[#515f74] dark:text-slate-400 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <a
              href="https://github.com/matheusmra/G-Visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#191c1e] dark:bg-white text-white dark:text-[#191c1e] text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <GitHubIcon />
              Ver no GitHub
            </a>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-[#515f74] dark:text-slate-500">
              <span>React + Vite</span>
              <span>·</span>
              <span>Cytoscape.js</span>
              <span>·</span>
              <span>TailwindCSS</span>
              <span>·</span>
              <span>Código aberto</span>
            </div>
            <div className="w-full border-t border-[#e0e3e5] dark:border-slate-700 pt-4 text-center">
              <span className="text-xs text-[#515f74] dark:text-slate-500">Feito por Matheus</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-slate-100 dark:bg-slate-950 w-full py-16 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 max-w-7xl mx-auto text-xs uppercase tracking-widest">
          <div className="md:col-span-1">
            <span className="text-lg font-black text-slate-400 dark:text-slate-600 font-headline block mb-6">
              G Visualizer
            </span>
            <p className="normal-case tracking-normal text-slate-500 text-sm leading-relaxed">
              Ferramenta open-source para visualização educacional de algoritmos em grafos.
            </p>
          </div>
          {[
            { title: 'Produto',   links: ['Explorar', 'Algoritmos', 'Canvas Interativo'] },
            { title: 'Recursos',  links: ['Documentação', 'Código Aberto', 'GitHub'] },
            { title: 'Legal',     links: ['Privacidade', 'Termos de Uso'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-slate-900 dark:text-slate-100 font-bold mb-6">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-500 dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-blue-400 underline underline-offset-8 transition-colors normal-case tracking-normal"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 px-6 md:px-12 max-w-7xl mx-auto pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-slate-500 text-xs">© 2024 G Visualizer. Código Aberto.</span>
        </div>
      </footer>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

