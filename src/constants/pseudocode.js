/**
 * Pseudocode definitions for every algorithm.
 * Centralising here lets new algorithms be added without touching PseudocodePanel.
 */

export const PSEUDOCODE = {
  BFS: {
    title: 'Busca em Largura — BFS',
    lines: [
      'BFS(Grafo G, nó inicial s):',
      '  marcar s como visitado',
      '  Q ← fila vazia;  enfileirar(Q, s)',
      '  enquanto Q ≠ ∅ faça:',
      '    u ← desenfileirar(Q)',
      '    para cada vizinho v de u:',
      '      se v não foi visitado:',
      '        marcar v como visitado',
      '        enfileirar(Q, v)',
      '  fim-enquanto  {retornar visitados}',
    ],
    description:
      'Explora o grafo nível por nível. Garante o caminho mais curto em grafos não-ponderados.',
  },
  DFS: {
    title: 'Busca em Profundidade — DFS',
    lines: [
      'DFS(Grafo G, nó inicial s):',
      '  P ← pilha vazia;  empilhar(P, s)',
      '  enquanto P ≠ ∅ faça:',
      '    u ← desempilhar(P)',
      '    se u não foi visitado:',
      '      marcar u como visitado',
      '      para cada vizinho v de u:',
      '        se v não foi visitado:',
      '          empilhar(P, v)',
      '  fim-enquanto  {retornar visitados}',
    ],
    description:
      'Explora o grafo mergulhando o mais fundo possível antes de retroceder.',
  },
  FTD: {
    title: 'Fecho Transitivo Direto — FTD',
    lines: [
      'FTD(Grafo G, nó s):',
      '  alcançáveis ← {s}',
      '  Q ← fila vazia;  enfileirar(Q, s)',
      '  enquanto Q ≠ ∅ faça:',
      '    u ← desenfileirar(Q)',
      '    para cada aresta u → v em G:',
      '      se v ∉ alcançáveis:',
      '        alcançáveis ← alcançáveis ∪ {v}',
      '        enfileirar(Q, v)',
      '  retornar alcançáveis',
    ],
    description:
      'Encontra todos os nós que podem ser alcançados a partir de s seguindo arestas de saída.',
  },
  TOPO: {
    title: 'Ordenação Topológica — Kahn',
    lines: [
      'TOPO(Dígrafo G):',
      '  calcular grau_entrada de cada nó',
      '  Q ← todos os nós com grau_entrada = 0',
      '  resultado ← []',
      '  enquanto Q ≠ ∅ faça:',
      '    u ← desenfileirar(Q)',
      '    resultado ← resultado + [u]',
      '    para cada aresta u → v:',
      '      grau_entrada[v] -= 1',
      '      se grau_entrada[v] = 0: enfileirar(Q, v)',
      '  se |resultado| ≠ |V|: reportar CICLO',
      '  retornar resultado',
    ],
    description:
      'Ordena os nós de um dígrafo sem ciclos (DAG) de forma que toda aresta u→v tenha u antes de v. Usa o algoritmo de Kahn (BFS por grau de entrada).',
  },
  FTI: {
    title: 'Fecho Transitivo Indireto — FTI',
    lines: [
      'FTI(Grafo G, nó s):',
      '  predecessores ← {s}',
      "  Q ← fila; enfileirar(Q, s); G' ← inverter(G)",
      '  enquanto Q ≠ ∅ faça:',
      '    u ← desenfileirar(Q)',
      "    para cada aresta u → v em G':",
      '      se v ∉ predecessores:',
      '        predecessores ← predecessores ∪ {v}',
      '        enfileirar(Q, v)',
      '  retornar predecessores',
    ],
    description:
      'Encontra todos os nós que possuem um caminho até s (executa BFS no grafo invertido).',
  },
};
