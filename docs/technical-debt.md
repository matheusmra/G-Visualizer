# Débitos Técnicos — G-Visualizer

> Auditoria completa do código-fonte. Atualizado em: Abril 2026.

---

## Sumário por Severidade

| Severidade | Total | Exemplos |
|---|---|---|
| 🔴 **Crítico** | 2 | Sem error boundary; Cytoscape sem try-catch |
| 🟠 **Alto** | 14 | eslint-disable em deps reais; botões sem ARIA; temas sem validação; God Components; ThemeToggle duplicado |
| 🟡 **Médio** | 9 | Cores inconsistentes; shapes não documentadas; lógica duplicada |
| 🟢 **Baixo** | 8+ | Dead code; strings hardcoded; CSS vazio |

---

## 🔴 Crítico

---

### CRIT-01 — Sem Error Boundary na aplicação

**Arquivo:** `src/App.jsx`, `src/pages/VisualizerPage.jsx`  
**Categoria:** Tratamento de Erros

Se qualquer componente filho lançar uma exceção (falha no Cytoscape, erro de inicialização de algoritmo, quebra de shape de dados), a **página inteira trava em tela branca** sem nenhuma UI de fallback.

```jsx
// src/App.jsx — sem nenhum <ErrorBoundary>
<Route path="/visualizar/:algorithm" element={<VisualizerPage />} />
```

**Correção sugerida:** Criar um componente `ErrorBoundary` e envolver `<VisualizerPage>` e `<GraphCanvas>` com ele.

---

### CRIT-02 — Inicialização do Cytoscape sem try-catch

**Arquivo:** `src/components/canvas/GraphCanvas.jsx`  
**Categoria:** Tratamento de Erros

A chamada `cytoscape({ container, elements, ... })` não está protegida. Se o container DOM ainda não estiver pronto, ou se os elementos tiverem um formato inválido, o `cyRef.current` ficará `null` e todos os `useEffect` seguintes quebrarão em cascata.

```jsx
// Sem proteção
cyRef.current = cytoscape({
  container: containerRef.current,
  elements: [...elements.nodes, ...elements.edges],
  style: buildStylesheet(isDirected ?? false),
  layout: currentLayoutRef.current,
});
```

**Correção sugerida:** Envolver em `try/catch` e exibir um `<div>` de erro no lugar do canvas se falhar.

---

## 🟠 Alto

---

### HIGH-01 — `eslint-disable` suprimindo warnings reais de dependências

**Arquivo:** `src/pages/VisualizerPage.jsx` (linhas ≈74, 85, 162), `src/hooks/useGraphPreset.js` (linha ≈23)  
**Categoria:** Qualidade de Código / Bugs Potenciais

Vários `useEffect` desativam a regra `react-hooks/exhaustive-deps` em vez de corrigir os arrays de dependências. Isso abre espaço para **bugs de closure desatualizada** onde funções como `pause`, `reset` e `setSearchParams` leem valores velhos do closure.

```jsx
useEffect(() => {
  pause();
  reset();
  setStartNode(nodeIds[0] ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps  ← escondendo o problema
}, [presetKey]); // pause, reset, setStartNode ausentes
```

**Correção sugerida:** Envolver `pause`, `reset` e callbacks similares em `useCallback` com deps estáveis, depois incluí-los nos arrays dos efeitos.

---

### HIGH-02 — Botões de ícone sem rótulo acessível

**Arquivos:** `src/pages/VisualizerPage.jsx`, `src/pages/HomePage.jsx`  
**Categoria:** Acessibilidade

Todos os botões de controle de reprodução (anterior, play, pausar, próximo) e o botão de tema usam apenas `<span class="material-symbols-outlined">`. Leitores de tela anunciam apenas "botão" sem nenhum contexto.

```jsx
<button onClick={stepBackward} disabled={!canBack}>
  <span className="material-symbols-outlined">skip_previous</span>
  {/* ← nenhum aria-label ou title descritivo */}
</button>
```

**Correção sugerida:** Adicionar `aria-label` em PT-BR a cada botão de ícone (ex: `aria-label="Voltar um passo"`). O atributo `title` já está em alguns lugares — garantir consistência em todos.

---

### HIGH-03 — Parâmetro `preset` da URL não validado contra `PRESETS`

**Arquivo:** `src/hooks/useGraphPreset.js`  
**Categoria:** Segurança / Robustez

`searchParams.get('preset')` é passado diretamente como chave inicial para o hook sem checar se existe em `PRESETS`. Uma URL do tipo `/visualizar/BFS?preset=__proto__` não quebrará (o fallback para `cyclic` acontece), mas a intenção nunca é documentada e pode surpreender.

```jsx
useGraphPreset(searchParams.get('preset') ?? 'cyclic', setSearchParams);
// Nenhuma validação: Object.keys(PRESETS).includes(...)
```

**Correção sugerida:**
```js
const initialPreset = Object.keys(PRESETS).includes(searchParams.get('preset'))
  ? searchParams.get('preset')
  : 'cyclic';
```

---

### HIGH-04 — Valor do tema lido do `localStorage` sem validação

**Arquivo:** `src/context/ThemeContext.jsx`  
**Categoria:** Segurança

O valor lido de `localStorage` é usado diretamente como classe CSS sem verificar se é `'dark'` ou `'light'`. Se um usuário ou extensão de navegador injetar um valor diferente, a classe inválida é aplicada ao `documentElement`.

```jsx
const [theme, setTheme] = useState(
  () => localStorage.getItem('gv-theme') ?? 'dark'
  // ← valor pode ser qualquer string
);
```

**Correção sugerida:**
```js
const stored = localStorage.getItem('gv-theme');
const initial = stored === 'light' ? 'light' : 'dark';
```

---

### HIGH-05 — Navegação duplamente gerenciada sem sincronismo

**Arquivos:** `src/pages/VisualizerPage.jsx`, `src/hooks/useGraphPreset.js`, `src/utils/urlState.js`  
**Categoria:** Estado / Roteamento

O preset é sincronizado com a URL via `setSearchParams` dentro de `useGraphPreset`, mas `urlState.js` exporta `parseUrlState` / `serializeUrlState` que nunca são usadas. Enquanto isso, a navegação de `AlgorithmsPage` e `HomePage` para `/visualizar/:alg?preset=X` funciona. Se o usuário trocar o preset pelo dropdown, a URL é corretamente atualizada — mas o botão "Voltar" do browser restaurará o parâmetro sem restaurar o estado de execução do algoritmo.

**Correção sugerida:** Decidir um único sistema de sincronização de URL. Remover `urlState.js` ou usá-lo de forma centralizada.

---

### HIGH-06 — Abas do algoritmo sem ARIA `tablist` / `tab`

**Arquivo:** `src/pages/VisualizerPage.jsx`  
**Categoria:** Acessibilidade

O `<nav>` com botões de algoritmos (BFS, DFS, FTD, FTI, TOPO) parece uma barra de abas visualmente mas não tem `role="tablist"`, `role="tab"`, nem `aria-selected`.

```jsx
<nav className="flex items-center gap-1 flex-1">
  {ALGO_IDS.map(alg => (
    <button onClick={() => setAlgorithm(alg)} ...>{alg}</button>
  ))}
</nav>
```

**Correção sugerida:** Adicionar `role="tablist"` no `<nav>` e `role="tab"` + `aria-selected={algorithm === alg}` em cada botão.

---

## 🟡 Médio

---

### MED-01 — Componentes órfãos (dead code)

**Arquivos:** `src/components/controls/ControlDeck.jsx`, `src/components/controls/GraphBuilder.jsx`, `src/components/PresetSelector.jsx`  
**Categoria:** Dead Code

Esses três componentes existem no projeto mas **não são importados em lugar nenhum**. São remanescentes do layout antigo anterior à refatoração para 3 colunas.

**Correção sugerida:** Remover os três arquivos. Se houver intenção de reintroduzi-los, mover para `src/_archive/` com comentário explicativo.

---

### MED-02 — `urlState.js` nunca usado

**Arquivo:** `src/utils/urlState.js`  
**Categoria:** Dead Code

As funções `parseUrlState` e `serializeUrlState` são exportadas mas não importadas em nenhum arquivo.

**Correção sugerida:** Remover o arquivo ou implementar a integração pretendida.

---

### MED-03 — Inconsistência de cores: tokens hex vs classes Tailwind

**Arquivos:** Todos os componentes  
**Categoria:** Estilo

O projeto mistura duas convenções de cor sem um padrão claro:

| Onde | Convenção usada |
|---|---|
| `VisualizerPage`, `DataPanel`, `PseudocodePanel` | `text-[#004ac6]`, `bg-[#f7f9fb]` |
| `ConnectivityPanel`, `GraphRepresentationPanel` | `bg-indigo-600`, `text-gray-600` |
| `GraphCanvas.jsx` (cytoscape stylesheet) | Hex diretamente no JS |

**Correção sugerida:** Definir as cores do design system no `@theme` do `index.css` (ex: `--color-primary: #004ac6`) e usar `text-primary`, `bg-surface` via Tailwind v4 em todos os locais.

---

### MED-04 — Shapes dos estados dos algoritmos não documentadas

**Arquivos:** `src/algorithms/BFS.js`, `src/algorithms/DFS.js`, `src/algorithms/FTC.js`, `src/algorithms/TopologicalSort.js`  
**Categoria:** Manutenibilidade

Cada algoritmo retorna um objeto de estado com campos como `queue`, `stack`, `visited`, `order`, `stepLog`, `pseudoLines`, `eventType`, `skippedNeighbors`, `stepCount`, `done` — mas nenhum desses shapes está documentado com JSDoc ou TypeScript.

**Correção sugerida:** Adicionar um JSDoc como:
```js
/**
 * @typedef {Object} AlgoState
 * @property {string[]} [queue]
 * @property {string[]} [stack]
 * @property {Set<string>} visited
 * @property {string[]} order
 * ...
 */
```

---

### MED-05 — Lógica de construção de grafo duplicada

**Arquivos:** `src/algorithms/BFS.js`, `src/algorithms/FTC.js`, `src/algorithms/connectivity.js`  
**Categoria:** Duplicação de Código

Cada arquivo de algoritmo constrói seu próprio mapa de adjacência a partir de `elements`, com código essencialmente igual ao que já existe em `src/utils/graphHelpers.js`.

**Correção sugerida:** Garantir que todos os algoritmos usem `buildAdjMap` / `buildDirectedAdjMap` / `buildReverseAdjMap` de `graphHelpers.js` em vez de reimplementarem.

---

### MED-06 — Estado inicial de `visited` inconsistente entre BFS e DFS

**Arquivos:** `src/algorithms/BFS.js`, `src/algorithms/DFS.js`  
**Categoria:** Consistência de Algoritmos

- BFS inicializa `visited = new Set([startNode])` (nó inicial já marcado)
- DFS inicializa `visited = new Set()` (vazio, marca ao desenfileirar)

Embora ambos gerem resultados corretos, a diferença de comportamento no **primeiro passo** pode confundir quem estuda o pseudocódigo ao lado da animação.

**Correção sugerida:** Padronizar a semântica: ou ambos marcam na enfileiração (BFS), ou ambos marcam ao visitar (DFS). Atualizar o pseudocódigo correspondente.

---

### MED-07 — `ALGO_SUBTITLES` definido localmente na página

**Arquivo:** `src/pages/VisualizerPage.jsx`  
**Categoria:** Organização

```js
const ALGO_SUBTITLES = {
  BFS: 'Travessia por nível com fila FIFO',
  ...
};
```

Esta constante está definida dentro de `VisualizerPage.jsx` mas seria melhor colocada em `src/constants/algorithms.js` ao lado de `ALGO_TITLES` e `ALGO_IDS`.

**Correção sugerida:** Mover para `src/constants/algorithms.js` e importar.

---

### MED-08 — Navegação da `HomePage` também não passava `preset` (corrigido parcialmente)

**Arquivo:** `src/pages/HomePage.jsx`  
**Categoria:** UX / Roteamento

Os cards "Visualizar →" da seção de algoritmos da homepage agora passam o preset correto por algoritmo (corrigido anteriormente). Porém, os botões da Hero Section ("Explorar Algoritmos", "Ver BFS") ainda podem não passar preset. Verificar todos os pontos de entrada para `/visualizar`.

**Correção sugerida:** Auditar todos os `navigate('/visualizar/...')` e garantir que todos passam `?preset=`.

---

### MED-09 — `ConnectivityPanel` sem validação de tipo de grafo

**Arquivo:** `src/components/panels/ConnectivityPanel.jsx`, `src/algorithms/connectivity.js`  
**Categoria:** Algoritmo

`findSCC` é projetado para grafos direcionados mas não valida isso. Chamá-lo num grafo não-direcionado retornará resultados incorretos (cada nó forma seu próprio SCC separado em vez de componentes conexos).

O componente já trata isso condicionalmente (`isDirected ? findSCC : findConnectedComponents`), mas a função `findSCC` em si não se protege internamente.

---

## 🟢 Baixo

---

### LOW-01 — `src/App.css` vazio

**Arquivo:** `src/App.css`  
**Categoria:** Limpeza

O arquivo contém apenas um comentário e não é necessário. Toda a estilização usa `index.css` + Tailwind.

**Correção sugerida:** Remover o arquivo e o `import './App.css'` em `src/App.jsx`.

---

### LOW-02 — Nomeação inconsistente: `FTC.js` implementa FTD e FTI

**Arquivo:** `src/algorithms/FTC.js`  
**Categoria:** Nomenclatura

O arquivo chama-se `FTC` (Fecho Transitivo Completo?) mas exporta `initFTD`, `stepFTD`, `initFTI`, `stepFTI`. O acrônimo do arquivo não corresponde a nenhum ID de algoritmo exposto.

**Correção sugerida:** Renomear para `src/algorithms/FT.js` ou `src/algorithms/transitivity.js`.

---

### LOW-03 — Mensagens de `stepLog` dos algoritmos sem sistema de i18n

**Arquivos:** `src/algorithms/BFS.js`, `src/algorithms/DFS.js`, `src/algorithms/FTC.js`, `src/algorithms/TopologicalSort.js`  
**Categoria:** Internacionalização

Todas as mensagens do log estão hardcoded em PT-BR dentro dos algoritmos. Se o projeto crescer para suportar outro idioma, cada função precisará ser reescrita.

**Correção sugerida:** Extrair strings para um objeto de mensagens, ex: `src/constants/messages.js`.

---

### LOW-04 — Sem validação de `algo` em `useAlgorithm`

**Arquivo:** `src/hooks/useAlgorithm.js`  
**Categoria:** Robustez

```js
const entry = ALGO_MAP[algo]; // sem checar se algo está em ALGO_IDS
if (!entry || !startNode) return;
```

Se `algo` for uma string inválida (ex: vinda de um parâmetro de URL manipulado), `entry` será `undefined` e o algoritmo não iniciará silenciosamente.

**Correção sugerida:** Adicionar `if (!ALGO_IDS.includes(algo)) return;` ou tratar como erro explícito.

---

### LOW-05 — `PresetSelector.jsx` é código morto

**Arquivo:** `src/components/PresetSelector.jsx`  
**Categoria:** Dead Code

Componente nunca importado. Possivelmente criado antes do dropdown inline em `VisualizerPage`.

**Correção sugerida:** Remover o arquivo.

---

### LOW-06 — SVGs de preview em `AlgorithmsPage` sem texto alternativo real

**Arquivo:** `src/pages/AlgorithmsPage.jsx`  
**Categoria:** Acessibilidade

Os SVGs têm `aria-hidden="true"` o que é correto para ícones decorativos, mas não há nenhum texto descritivo visível abaixo explicando o que a imagem representa estruturalmente.

**Correção sugerida:** Manter `aria-hidden`, mas garantir que o título e a descrição do card sejam suficientemente descritivos para contexto.

---

### LOW-07 — `buildStylesheet` recria objeto a cada re-render

**Arquivo:** `src/components/canvas/GraphCanvas.jsx`  
**Categoria:** Performance

```jsx
useEffect(() => {
  if (cyRef.current) cyRef.current.style(buildStylesheet(isDirected ?? false));
}, [isDirected]);
```

`buildStylesheet` retorna um array de objetos novo a cada chamada. Como o efeito já depende de `isDirected`, isso é mínimo — mas a função poderia ser memoizada com `useMemo` para clareza.

---

### LOW-08 — Sem documentação de props nos componentes de painel

**Arquivos:** Todos em `src/components/panels/`  
**Categoria:** Manutenibilidade

Nenhum componente de painel possui JSDoc nos parâmetros. Quem for contribuir precisa rastrear o código para entender o que cada prop espera.

**Correção sugerida:** Adicionar JSDoc mínimo ou migrar para TypeScript com interfaces de props.

---

---

## 🟠 Alto — Componentização

---

### COMP-01 — `VisualizerPage.jsx` é um God Component (527 linhas)

**Arquivo:** `src/pages/VisualizerPage.jsx`  
**Categoria:** Componentização / Separação de Responsabilidades

O arquivo concentra **todo** o estado, lógica de efeitos, computações memoizadas, gerenciamento de toasts e toda a renderização do layout em um único componente. Isso viola o princípio de responsabilidade única e torna testes, manutenção e leitura muito difíceis.

**Responsabilidades misturadas:**

| Bloco | Linhas aprox. | Deveria ser |
|---|---|---|
| State + hooks de algoritmo, playback, preset, toasts | 1–210 | Extrair `useVisualizerState()` ou dividir em hooks menores |
| Header com logo + abas de algoritmo | 215–250 | `<VisualizerHeader>` |
| Sidebar esquerda (ferramentas + controles) | 252–390 | `<ControlSidebar>` |
| Centro: sobreposições do canvas | 392–445 | `<CanvasOverlay>` |
| Controles flutuantes de playback | 448–505 | `<PlaybackBar>` |
| Painel direito com 4 seções | 506–530 | Já usa `<RightSection>` mas ainda inline |
| `RightSection` e `ThemeToggle` no fundo do arquivo | 540–595 | Extrair para `src/components/ui/` |

**Correção sugerida:** Dividir em ao menos:
```
src/components/visualizer/
  VisualizerHeader.jsx     ← logo + abas de algoritmo + ThemeToggle
  ControlSidebar.jsx       ← seletor de grafo, ferramentas, nó inicial, velocidade, progresso
  PlaybackBar.jsx          ← botões step/play/pause + contador de passo
  CanvasOverlay.jsx        ← título, hint de edição, badge de concluído
src/components/ui/
  ThemeToggle.jsx          ← reutilizável (hoje duplicado em cada página)
src/hooks/
  useToasts.js             ← lógica de addToast/dismissToast + toastId counter
```

---

### COMP-02 — `HomePage.jsx` tem 450 linhas sem nenhuma seção extraída

**Arquivo:** `src/pages/HomePage.jsx`  
**Categoria:** Componentização

A homepage tem 8 seções visualmente distintas, todas renderizadas inline no mesmo componente. Os dados (`ALGO_CARDS`, `FEATURES`, `ALGO_DEFAULT_PRESET`) também estão definidos dentro do arquivo da página.

**Seções sem componente próprio:**

```jsx
// Tudo isso está em um único return() de 350+ linhas:
<header>...</header>          // nav sticky
<section> Hero </section>     // headline + CTAs
<section> Bento preview </section>  // canvas SVG mock
<section> Features </section>  // 3 cards de features
<section> Algo Library </section>  // grid de 5 algoritmos
<section> CTA </section>
<section> Open Source </section>
<footer>...</footer>
```

**Correção sugerida:**
```
src/components/home/
  HomeNav.jsx
  HomeHero.jsx
  BentoPreview.jsx
  FeaturesSection.jsx
  AlgoLibrarySection.jsx
  CTASection.jsx
  OpenSourceSection.jsx
  HomeFooter.jsx
src/data/algorithms.js   ← mover ALGO_CARDS daqui e de AlgorithmsPage
```

---

### COMP-03 — `AlgorithmsPage.jsx` define 5 componentes SVG inline (447 linhas)

**Arquivo:** `src/pages/AlgorithmsPage.jsx`  
**Categoria:** Componentização

Cada algoritmo no array `ALGORITHMS` tem um campo `Preview` que é um componente de função com JSX/SVG definido diretamente dentro do array de dados. Isso mistura **dados** com **componentes de UI**:

```jsx
const ALGORITHMS = [
  {
    id: 'BFS',
    // ...dados...
    Preview: () => (          // ← componente definido dentro de dado
      <svg viewBox="0 0 160 100">
        {/* ≈20 linhas de SVG */}
      </svg>
    ),
  },
  // × 5 algoritmos
]
```

Além disso, `AlgoCard` é um componente completo definido no fundo do mesmo arquivo e nunca exportado — não pode ser reutilizado em `HomePage`.

**Correção sugerida:**
```
src/components/algorithms/
  AlgoCard.jsx                ← extrair e exportar
  previews/
    BFSPreview.jsx
    DFSPreview.jsx
    FTDPreview.jsx
    FTIPreview.jsx
    TOPOPreview.jsx
src/data/algorithms.js        ← ALGORITHMS sem o campo Preview (importar previews separadamente)
```

---

### COMP-04 — `ThemeToggle` duplicado em cada página

**Arquivos:** `src/pages/VisualizerPage.jsx`, `src/pages/HomePage.jsx`, `src/pages/AlgorithmsPage.jsx`  
**Categoria:** DRY / Componentização

Cada página define sua própria versão de `ThemeToggle` — com variações sutis de classe entre elas — em vez de compartilhar um único componente.

```jsx
// VisualizerPage.jsx
function ThemeToggle() { /* versão com rounded-xl, p-2 */ }

// HomePage.jsx — outra variação inline no JSX
<button onClick={toggleTheme} className="...diferente...">
```

**Correção sugerida:** Criar `src/components/ui/ThemeToggle.jsx` exportado e importar nas três páginas.

---

### COMP-05 — Lógica de toasts inline em `VisualizerPage`

**Arquivo:** `src/pages/VisualizerPage.jsx`  
**Categoria:** Separação de Responsabilidades

O gerenciamento de toasts (contador `let toastId`, `addToast`, `dismissToast`, o `useEffect` com toda a lógica de `eventType`) está diretamente no corpo do componente página, somando ~50 linhas. Isso oculta a lógica de negócio na camada de apresentação.

```jsx
// No topo do módulo
let toastId = 0;

// Dentro de VisualizerPage:
const addToast = useCallback(({ type, title, message, duration }) => { ... }, []);
const dismissToast = useCallback(id => { ... }, []);
useEffect(() => {
  // ~30 linhas de lógica de eventType → toast
}, [algoState?.stepCount, algoState?.done]);
```

**Correção sugerida:** Extrair para `src/hooks/useToasts.js`:
```js
// useToasts.js
export function useToasts(algorithm, algoState, skipShownRef) {
  const [toasts, setToasts] = useState([]);
  // ... toda a lógica
  return { toasts, dismissToast };
}
```

---

### COMP-06 — `GraphRepresentationPanel` renderiza 3 visualizações completamente diferentes sem subcomponentes

**Arquivo:** `src/components/panels/GraphRepresentationPanel.jsx` (198 linhas)  
**Categoria:** Componentização

O painel contém as funções de dados (`buildAdjList`, `buildAdjMatrix`, `buildIncMatrix`) e as renderizações das três visões (lista, matriz de adjacência, matriz de incidência) tudo no mesmo arquivo. Cada visão tem estrutura HTML completamente diferente e poderia evoluir de forma independente.

**Correção sugerida:**
```
src/components/representations/
  AdjacencyList.jsx
  AdjacencyMatrix.jsx
  IncidenceMatrix.jsx
src/utils/matrixBuilders.js   ← buildAdjList, buildAdjMatrix, buildIncMatrix
```

---

### COMP-07 — Padrão "label + input" repetido sem componente primitivo

**Arquivo:** `src/pages/VisualizerPage.jsx` (e futuras páginas)  
**Categoria:** Componentização / DRY

O padrão de campo com label uppercase de 10px ocorre 3 vezes na sidebar e não tem abstração:

```jsx
<div>
  <label className="text-[10px] tracking-widest uppercase text-[#737686] dark:text-slate-500 block mb-1.5">
    Grafo atual
  </label>
  <select className="w-full bg-[#f2f4f6] ...">...</select>
</div>
// ... repetido para "Nó Inicial", "Velocidade"
```

**Correção sugerida:** Criar um primitivo `<SidebarField label="...">`:
```jsx
// src/components/ui/SidebarField.jsx
export function SidebarField({ label, children }) {
  return (
    <div>
      <label className="text-[10px] tracking-widest uppercase text-[#737686] dark:text-slate-500 block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
```

---

### COMP-08 — `GraphCanvas.jsx` mistura inicialização, estilos e 3 modos de edição (231 linhas)

**Arquivo:** `src/components/canvas/GraphCanvas.jsx`  
**Categoria:** Separação de Responsabilidades

O componente acumula 5 responsabilidades distintas:
1. Inicialização e destruição do Cytoscape
2. Sincronização de elementos (nodes/edges)
3. Aplicação de stylesheet (direcionado/não-direcionado)
4. 3 modos de edição com event listeners diferentes (`addNode`, `addEdge`, `delete`)
5. Highlighting de conectividade
6. API imperativa via `useImperativeHandle` (randomize)

Os 3 modos de edição sozinhos representam ~60 linhas com lógica de estado (`pendingSrc`).

**Correção sugerida:** Extrair os modos de edição para `src/hooks/useGraphEditMode.js`:
```js
export function useGraphEditMode(cyRef, editMode, isDirected, onGraphChange) {
  // toda a lógica de tap handlers para addNode/addEdge/delete
}
```

---

## Ordem de Prioridade de Resolução

```
1.  CRIT-01  Adicionar Error Boundary
2.  CRIT-02  try-catch no Cytoscape
3.  HIGH-01  Corrigir eslint-disable de deps
4.  HIGH-03  Validar parâmetro preset da URL
5.  HIGH-04  Validar localStorage de tema
6.  HIGH-02  ARIA labels em botões de ícone
7.  HIGH-06  ARIA tablist nas abas de algoritmo
8.  COMP-04  Extrair ThemeToggle compartilhado
9.  COMP-05  Extrair useToasts hook
10. COMP-08  Extrair useGraphEditMode hook
11. COMP-01  Decompor VisualizerPage em subcomponentes
12. COMP-03  Extrair AlgoCard + previews SVG
13. COMP-06  Decompor GraphRepresentationPanel
14. COMP-07  Criar primitivo SidebarField
15. COMP-02  Decompor HomePage em seções
16. MED-01   Remover ControlDeck, GraphBuilder, PresetSelector
17. MED-02   Remover urlState.js
18. MED-03   Unificar tokens de cor no @theme
19. MED-05   Eliminar duplicação de buildAdjMap
20. MED-06   Padronizar init de visited (BFS vs DFS)
21. MED-07   Mover ALGO_SUBTITLES para constants/
```
