import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALGORITHMS, ALGO_DEFAULT_PRESET } from '../../data/algorithms.js';

const BFS_STEPS = [
  {
    label: 'Inicializar',
    queue: '[]',
    node: '-',
    visited: [],
    activeEdges: [],
    line: 1,
    description: 'Começando a busca...',
  },
  {
    label: 'Inserir A',
    queue: '[A]',
    node: '-',
    visited: [],
    activeEdges: [],
    line: 2,
    description: 'Adicionando nó inicial à fila.',
  },
  {
    label: 'Processar A',
    queue: '[]',
    node: 'A',
    visited: ['A'],
    activeEdges: [],
    line: 5,
    description: 'Retirando A da fila para visitar.',
  },
  {
    label: 'Explorar A→B',
    queue: '[B]',
    node: 'A',
    visited: ['A'],
    activeEdges: ['A-B'],
    line: 7,
    description: 'Encontrou vizinho B.',
  },
  {
    label: 'Explorar A→E',
    queue: '[B, E]',
    node: 'A',
    visited: ['A'],
    activeEdges: ['A-B', 'A-E'],
    line: 7,
    description: 'Encontrou vizinho E.',
  },
  {
    label: 'Processar B',
    queue: '[E]',
    node: 'B',
    visited: ['A', 'B'],
    activeEdges: ['A-B', 'A-E'],
    line: 5,
    description: 'Visitando B.',
  },
  {
    label: 'Explorar B→C',
    queue: '[E, C]',
    node: 'B',
    visited: ['A', 'B'],
    activeEdges: ['A-B', 'A-E', 'B-C'],
    line: 7,
    description: 'Encontrou C através de B.',
  },
  {
    label: 'Explorar B→D',
    queue: '[E, C, D]',
    node: 'B',
    visited: ['A', 'B'],
    activeEdges: ['A-B', 'A-E', 'B-C', 'B-D'],
    line: 7,
    description: 'Encontrou D através de B.',
  },
  {
    label: 'Concluir',
    queue: '[]',
    node: 'Finalizado',
    visited: ['A', 'B', 'C', 'D', 'E'],
    activeEdges: ['A-B', 'A-E', 'B-C', 'B-D'],
    line: 1,
    description: 'BFS concluída com sucesso!',
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

export function FeaturesSection() {
  return (
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
                <span className="material-symbols-outlined" style={{ fontSize: '30px' }} aria-hidden="true">{f.icon}</span>
              </div>
              <h3 className="font-bold text-xl mb-4 text-[#191c1e] dark:text-slate-100 font-headline">{f.title}</h3>
              <p className="text-[#515f74] dark:text-slate-400 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AlgoLibrarySection() {
  const navigate = useNavigate();

  return (
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
          {ALGORITHMS.map(card => (
            <div
              key={card.id}
              onClick={() => navigate(`/visualizar/${card.id}?preset=${ALGO_DEFAULT_PRESET[card.id] ?? 'cyclic'}`)}
              className="bg-[#eceef0] dark:bg-slate-800/50 p-1 rounded-[2rem] group cursor-pointer overflow-hidden"
              role="button"
              tabIndex={0}
              aria-label={`Visualizar algoritmo de ${card.name}`}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/visualizar/${card.id}?preset=${ALGO_DEFAULT_PRESET[card.id] ?? 'cyclic'}`); }}
            >
              <div className="bg-white dark:bg-slate-950 h-full w-full p-8 rounded-[1.9rem] flex flex-col group-hover:bg-[#004ac6] dark:group-hover:bg-[#004ac6] group-hover:text-white transition-all duration-300">
                <div className="flex justify-between items-start mb-12">
                  <div className="font-mono text-xs font-bold opacity-40 text-[#191c1e] dark:text-slate-400 group-hover:text-white/60">
                    {card.tag}
                  </div>
                  <span
                    className="material-symbols-outlined text-[#191c1e] dark:text-slate-300 group-hover:text-white group-hover:translate-x-2 transition-transform"
                    style={{ fontSize: '40px' }}
                    aria-hidden="true"
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
  );
}

export function BentoPreview() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);

  const nextStep = useCallback(() => {
    setStep((prev) => (prev + 1) % BFS_STEPS.length);
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => (prev - 1 + BFS_STEPS.length) % BFS_STEPS.length);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(nextStep, 2500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, nextStep]);

  const current = BFS_STEPS[step];

  // Yardımcı fonksiyon: nó visitado?
  const isVisited = (id) => current.visited.includes(id);
  const isCurrent = (id) => current.node === id;
  const isEdgeActive = (id) => current.activeEdges.includes(id);

  return (
    <section className="px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-[520px] bg-[#e0e3e5] dark:bg-slate-900 rounded-3xl relative overflow-hidden shadow-inner border border-[#c3c6d7]/20 dark:border-slate-800 transition-colors">
            <div className="absolute inset-0 dot-grid opacity-10" />

            {/* SVG Graph - Animated */}
            <svg className="absolute inset-0 w-full h-full p-24 md:p-32" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              {/* Edges */}
              <line 
                x1="20" y1="20" x2="50" y2="50" 
                stroke={isEdgeActive('A-B') ? '#004ac6' : 'currentColor'} 
                strokeWidth={isEdgeActive('A-B') ? "3" : "1.5"}
                className={`${isEdgeActive('A-B') ? 'opacity-100' : 'opacity-20 text-[#c3c6d7] dark:text-slate-700'} transition-all duration-700`} 
              />
              <line 
                x1="50" y1="50" x2="80" y2="30" 
                stroke={isEdgeActive('B-C') ? '#004ac6' : 'currentColor'} 
                strokeWidth={isEdgeActive('B-C') ? "3" : "1.5"}
                className={`${isEdgeActive('B-C') ? 'opacity-100' : 'opacity-20 text-[#c3c6d7] dark:text-slate-700'} transition-all duration-700`} 
              />
              <line 
                x1="50" y1="50" x2="70" y2="80" 
                stroke={isEdgeActive('B-D') ? '#004ac6' : 'currentColor'} 
                strokeWidth={isEdgeActive('B-D') ? "3" : "1.5"}
                className={`${isEdgeActive('B-D') ? 'opacity-100' : 'opacity-20 text-[#c3c6d7] dark:text-slate-700'} transition-all duration-700`} 
              />
              <line 
                x1="20" y1="20" x2="30" y2="70" 
                stroke={isEdgeActive('A-E') ? '#004ac6' : 'currentColor'} 
                strokeWidth={isEdgeActive('A-E') ? "3" : "1.5"}
                className={`${isEdgeActive('A-E') ? 'opacity-100' : 'opacity-20 text-[#c3c6d7] dark:text-slate-700'} transition-all duration-700`} 
              />

              {/* Nodes */}
              {[
                { id: 'A', x: 20, y: 20 },
                { id: 'B', x: 50, y: 50 },
                { id: 'C', x: 80, y: 30 },
                { id: 'D', x: 70, y: 80 },
                { id: 'E', x: 30, y: 70 },
              ].map(n => (
                <g key={n.id} className="transition-all duration-700">
                  <circle 
                    cx={n.x} cy={n.y} r="6" 
                    className={`
                      ${isCurrent(n.id) ? 'fill-[#004ac6] stroke-[#004ac6] stroke-[2]' : 
                        isVisited(n.id) ? 'fill-[#004ac6]/10 stroke-[#004ac6] stroke-[1]' : 
                        'fill-white dark:fill-slate-800 stroke-[#c3c6d7] dark:stroke-slate-700 stroke-[1]'}
                      transition-all duration-500
                    `}
                  />
                  <text 
                    x={n.x} y={n.y + 1} 
                    className={`text-[4px] font-bold text-center ${isCurrent(n.id) ? 'fill-white' : 'fill-slate-400'} transition-colors pointer-events-none`}
                    textAnchor="middle"
                  >
                    {n.id}
                  </text>
                </g>
              ))}
            </svg>

            {/* Controller */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel px-6 py-4 rounded-2xl flex items-center gap-6 shadow-2xl border border-white/40 dark:border-slate-700/40">
              <button 
                onClick={() => { setIsPlaying(false); prevStep(); }} 
                aria-label="Passo anterior" 
                className="text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '30px' }} aria-hidden="true">skip_previous</span>
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)} 
                aria-label={isPlaying ? "Pausar" : "Play"} 
                className="w-14 h-14 bg-[#004ac6] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#004ac6]/40 hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '30px', fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button 
                onClick={() => { setIsPlaying(false); nextStep(); }} 
                aria-label="Próximo passo" 
                className="text-[#515f74] dark:text-slate-400 hover:text-[#004ac6] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '30px' }} aria-hidden="true">skip_next</span>
              </button>

              <div className="w-px h-8 bg-[#c3c6d7]/40 dark:bg-slate-700 mx-2" />
              
              <div className="flex flex-col min-w-[100px]">
                <span className="text-[10px] font-bold text-[#737686] dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {current.label}
                </span>
                <span className="text-sm font-mono font-medium text-[#004ac6] dark:text-blue-400">
                  PASSO {String(step + 1).padStart(2, '0')} / {String(BFS_STEPS.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="absolute top-8 left-8 glass-panel px-4 py-2 rounded-xl border border-white/40 dark:border-slate-700/40 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full bg-[#004ac6] ${isPlaying ? 'active-dot' : ''}`} />
              <span className="text-xs font-bold text-[#191c1e] dark:text-slate-200 uppercase tracking-wider font-headline">
                BFS ao Vivo
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#f2f4f6] dark:bg-slate-900 p-6 rounded-3xl flex-1 flex flex-col gap-4 border border-[#c3c6d7]/20 dark:border-slate-800">
              <h3 className="font-bold text-lg text-[#191c1e] dark:text-slate-100 font-headline">Variáveis</h3>
              <div className="space-y-3">
                {[
                  { key: 'fila',      value: current.queue },
                  { key: 'nó_atual',  value: `Nó ${current.node}`, highlight: current.node !== '-' && current.node !== 'Finalizado' },
                  { key: 'visitados', value: `{${current.visited.join(', ')}}` },
                ].map(v => (
                   <div key={v.key} className="bg-white dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center transition-all">
                    <span className="font-mono text-sm text-[#191c1e] dark:text-slate-200">{v.key}</span>
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded transition-all duration-300 ${
                        v.highlight
                          ? 'bg-[#004ac6] text-white font-bold scale-110 shadow-md'
                          : 'bg-[#eceef0] dark:bg-slate-700 text-[#191c1e] dark:text-slate-300'
                      }`}
                    >
                      {v.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#2d3133] dark:bg-slate-900/90 p-6 rounded-3xl flex-1 border border-slate-700/50 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-white font-headline">Pseudocódigo</h3>
                <span className="material-symbols-outlined text-white/40" aria-hidden="true">code</span>
              </div>
              <pre className="font-mono text-sm leading-relaxed text-white/70 overflow-auto whitespace-pre-wrap">
                <div style={{ opacity: current.line === 1 ? 1 : 0.4 }} className="transition-opacity flex gap-2">
                  <span style={{ color: '#4edea3' }}>function</span> BFS(Grafo, Origem):
                </div>
                <div style={{ opacity: current.line === 2 ? 1 : 0.4, borderLeft: current.line === 2 ? '2px solid #004ac6' : 'none', paddingLeft: '4px' }} className="transition-all">  fila ← [Origem]</div>
                <div style={{ opacity: current.line === 3 ? 1 : 0.4 }} className="transition-opacity">  visitados ← ∅</div>
                <div style={{ opacity: current.line === 4 ? 1 : 0.4 }} className="transition-opacity flex gap-2">  <span style={{ color: '#b4c5ff' }}>enquanto</span> fila ≠ ∅:</div>
                <div style={{ opacity: current.line === 5 ? 1 : 0.4, borderLeft: current.line === 5 ? '2px solid #004ac6' : 'none', paddingLeft: '4px' }} className="transition-all">    u ← fila.remover()</div>
                <div style={{ opacity: current.line === 6 ? 1 : 0.4 }} className="transition-opacity flex gap-2">    <span style={{ color: '#b4c5ff' }}>para cada</span> v em adj[u]:</div>
                <div style={{ opacity: current.line === 7 ? 1 : 0.4, borderLeft: current.line === 7 ? '2px solid #004ac6' : 'none', paddingLeft: '4px' }} className="transition-all">      fila.inserir(v)</div>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
