// Biblioteca de grafos pré-construídos para o G-Visualizer

export const PRESETS = {

  // ── Clássicos ──────────────────────────────────────────────────────────────

  tree: {
    name: 'Árvore Binária',
    description: 'Árvore sem ciclos. BFS visita nível por nível; DFS mergulha em profundidade.',
    elements: {
      nodes: [
        { data: { id: '1', label: '1' } },
        { data: { id: '2', label: '2' } },
        { data: { id: '3', label: '3' } },
        { data: { id: '4', label: '4' } },
        { data: { id: '5', label: '5' } },
        { data: { id: '6', label: '6' } },
        { data: { id: '7', label: '7' } },
      ],
      edges: [
        { data: { source: '1', target: '2' } },
        { data: { source: '1', target: '3' } },
        { data: { source: '2', target: '4' } },
        { data: { source: '2', target: '5' } },
        { data: { source: '3', target: '6' } },
        { data: { source: '3', target: '7' } },
      ],
    },
    layout: { name: 'breadthfirst', directed: false, roots: ['1'], padding: 40 },
  },

  cyclic: {
    name: 'Grafo com Ciclo',
    description: 'Contém ciclos ótimo para ver o controle de nós já visitados.',
    elements: {
      nodes: [
        { data: { id: 'A', label: 'A' } },
        { data: { id: 'B', label: 'B' } },
        { data: { id: 'C', label: 'C' } },
        { data: { id: 'D', label: 'D' } },
        { data: { id: 'E', label: 'E' } },
        { data: { id: 'F', label: 'F' } },
      ],
      edges: [
        { data: { source: 'A', target: 'B' } },
        { data: { source: 'A', target: 'C' } },
        { data: { source: 'B', target: 'D' } },
        { data: { source: 'C', target: 'D' } },
        { data: { source: 'D', target: 'E' } },
        { data: { source: 'E', target: 'F' } },
        { data: { source: 'F', target: 'A' } },
        { data: { source: 'B', target: 'E' } },
      ],
    },
    layout: { name: 'circle', padding: 40 },
  },

  disconnected: {
    name: 'Grafo Desconexo',
    description: 'Dois componentes separados a travessia só cobre um deles.',
    elements: {
      nodes: [
        { data: { id: 'P', label: 'P' } },
        { data: { id: 'Q', label: 'Q' } },
        { data: { id: 'R', label: 'R' } },
        { data: { id: 'X', label: 'X' } },
        { data: { id: 'Y', label: 'Y' } },
        { data: { id: 'Z', label: 'Z' } },
      ],
      edges: [
        { data: { source: 'P', target: 'Q' } },
        { data: { source: 'Q', target: 'R' } },
        { data: { source: 'X', target: 'Y' } },
        { data: { source: 'Y', target: 'Z' } },
        { data: { source: 'Z', target: 'X' } },
      ],
    },
    layout: { name: 'grid', padding: 40 },
  },

  directed: {
    name: 'Grafo Direcionado',
    description: 'Dois ciclos direcionados ideal para FTD e FTI. Note a diferença de alcançabilidade.',
    directed: true,
    elements: {
      nodes: [
        { data: { id: 'A', label: 'A' } },
        { data: { id: 'B', label: 'B' } },
        { data: { id: 'C', label: 'C' } },
        { data: { id: 'D', label: 'D' } },
        { data: { id: 'E', label: 'E' } },
        { data: { id: 'F', label: 'F' } },
      ],
      edges: [
        { data: { source: 'A', target: 'B' } },
        { data: { source: 'B', target: 'C' } },
        { data: { source: 'C', target: 'A' } },
        { data: { source: 'B', target: 'D' } },
        { data: { source: 'D', target: 'E' } },
        { data: { source: 'E', target: 'F' } },
        { data: { source: 'F', target: 'D' } },
      ],
    },
    layout: { name: 'circle', padding: 40 },
  },

  // ── Estruturas adicionais ──────────────────────────────────────────────────

  linear: {
    name: 'Lista Linear',
    description: 'Sequência em linha como uma lista encadeada. BFS e DFS se comportam de forma idêntica.',
    elements: {
      nodes: [
        { data: { id: 'A', label: 'A' } },
        { data: { id: 'B', label: 'B' } },
        { data: { id: 'C', label: 'C' } },
        { data: { id: 'D', label: 'D' } },
        { data: { id: 'E', label: 'E' } },
        { data: { id: 'F', label: 'F' } },
      ],
      edges: [
        { data: { source: 'A', target: 'B' } },
        { data: { source: 'B', target: 'C' } },
        { data: { source: 'C', target: 'D' } },
        { data: { source: 'D', target: 'E' } },
        { data: { source: 'E', target: 'F' } },
      ],
    },
    layout: { name: 'grid', rows: 1, padding: 40 },
  },

  complete: {
    name: 'Grafo Completo K₅',
    description: 'Todos os nós conectados entre si todos os vizinhos são enfileirados de uma vez.',
    elements: {
      nodes: [
        { data: { id: 'A', label: 'A' } },
        { data: { id: 'B', label: 'B' } },
        { data: { id: 'C', label: 'C' } },
        { data: { id: 'D', label: 'D' } },
        { data: { id: 'E', label: 'E' } },
      ],
      edges: [
        { data: { source: 'A', target: 'B' } },
        { data: { source: 'A', target: 'C' } },
        { data: { source: 'A', target: 'D' } },
        { data: { source: 'A', target: 'E' } },
        { data: { source: 'B', target: 'C' } },
        { data: { source: 'B', target: 'D' } },
        { data: { source: 'B', target: 'E' } },
        { data: { source: 'C', target: 'D' } },
        { data: { source: 'C', target: 'E' } },
        { data: { source: 'D', target: 'E' } },
      ],
    },
    layout: { name: 'circle', padding: 40 },
  },

  star: {
    name: 'Grafo Estrela',
    description: 'Um nó central ligado a todos os outros. BFS visita todos em 1 etapa; DFS mergulha em cada ramo.',
    elements: {
      nodes: [
        { data: { id: 'S', label: 'S' } },
        { data: { id: 'A', label: 'A' } },
        { data: { id: 'B', label: 'B' } },
        { data: { id: 'C', label: 'C' } },
        { data: { id: 'D', label: 'D' } },
        { data: { id: 'E', label: 'E' } },
      ],
      edges: [
        { data: { source: 'S', target: 'A' } },
        { data: { source: 'S', target: 'B' } },
        { data: { source: 'S', target: 'C' } },
        { data: { source: 'S', target: 'D' } },
        { data: { source: 'S', target: 'E' } },
      ],
    },
    layout: { name: 'concentric', concentric: n => (n.id() === 'S' ? 2 : 1), levelWidth: () => 1, padding: 40 },
  },

  dag: {
    name: 'Grafo Acíclico (DAG)',
    description: 'Grafo direcionado sem ciclos, perfeito para testar ordenação topológica.',
    directed: true,
    elements: {
      nodes: [
        { data: { id: 'A', label: 'A' } },
        { data: { id: 'B', label: 'B' } },
        { data: { id: 'C', label: 'C' } },
        { data: { id: 'D', label: 'D' } },
        { data: { id: 'E', label: 'E' } },
        { data: { id: 'F', label: 'F' } },
      ],
      edges: [
        { data: { source: 'A', target: 'B' } },
        { data: { source: 'A', target: 'C' } },
        { data: { source: 'B', target: 'D' } },
        { data: { source: 'B', target: 'E' } },
        { data: { source: 'C', target: 'E' } },
        { data: { source: 'D', target: 'F' } },
        { data: { source: 'E', target: 'F' } },
      ],
    },
    layout: { name: 'breadthfirst', directed: true, roots: ['A'], padding: 40 },
  },
};

