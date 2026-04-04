/**
 * Ordenação Topológica — Algoritmo de Kahn (BFS por grau de entrada)
 *
 * initTopSort(startNode, { directedAdjMap }) — inicializa a partir do grafo dirigido.
 * stepTopSort(state, directedAdjMap)         — avança um passo e retorna novo estado.
 *
 * Em cada passo:
 *  1. Desenfilera o próximo nó de grau-de-entrada zero.
 *  2. Adiciona-o à ordem topológica.
 *  3. Decrementa o grau de entrada dos vizinhos; enfileira os que chegarem a zero.
 *
 * Se ao fim |ordem| < |nós| → ciclo detectado (não existe ordenação topológica).
 */

// ─── Init ──────────────────────────────────────────────────────────────────────

export function initTopSort(_startNode, { directedAdjMap }) {
  const nodes = Object.keys(directedAdjMap);

  // Calcular grau de entrada de cada nó
  const inDegree = {};
  nodes.forEach(n => { inDegree[n] = 0; });
  nodes.forEach(n => {
    for (const neighbor of directedAdjMap[n]) {
      inDegree[neighbor] = (inDegree[neighbor] ?? 0) + 1;
    }
  });

  // Fila inicial: nós com grau de entrada 0
  const queue = nodes.filter(n => inDegree[n] === 0).sort();

  return {
    queue:       [...queue],
    inDegree,
    visited:     new Set(),
    inFrontier:  new Set(queue),
    current:     null,
    order:       [],
    done:        queue.length === 0 && nodes.length === 0,
    cycleDetected: false,
    stepLog:     queue.length > 0
      ? `Ordenação topológica iniciada. Nós com grau de entrada 0: [${queue.join(', ')}].`
      : nodes.length === 0
        ? 'Grafo vazio.'
        : 'Nenhum nó com grau de entrada 0 — ciclo detectado antes do início.',
    pseudoLines:       [2, 3],
    eventType:         'init',
    skippedNeighbors:  [],
    stepCount:         0,
  };
}

// ─── Step ──────────────────────────────────────────────────────────────────────

export function stepTopSort(state, directedAdjMap) {
  const stepCount = (state.stepCount ?? 0) + 1;

  if (state.done || state.queue.length === 0) {
    const totalNodes = Object.keys(directedAdjMap).length;
    const cycleDetected = state.order.length < totalNodes;
    const log = cycleDetected
      ? `Ordenação encerrada com ciclo detectado. Apenas ${state.order.length} de ${totalNodes} nós foram ordenados — o grafo contém um ciclo.`
      : `Ordenação topológica concluída. Ordem: ${state.order.join(' → ')}.`;
    return {
      ...state,
      done: true,
      current: null,
      cycleDetected,
      stepLog:    log,
      pseudoLines: cycleDetected ? [11] : [12],
      eventType:   cycleDetected ? 'done_cycle' : 'done',
      stepCount,
    };
  }

  const queue      = [...state.queue];
  const inDegree   = { ...state.inDegree };
  const visited    = new Set(state.visited);
  const inFrontier = new Set(state.inFrontier);
  const order      = [...state.order];

  const current = queue.shift();
  inFrontier.delete(current);
  visited.add(current);
  order.push(current);

  const neighbors     = directedAdjMap[current] || [];
  const newlyEnqueued = [];

  for (const neighbor of neighbors) {
    inDegree[neighbor] -= 1;
    if (inDegree[neighbor] === 0) {
      queue.push(neighbor);
      inFrontier.add(neighbor);
      newlyEnqueued.push(neighbor);
    }
  }

  const done = queue.length === 0;
  const cycleDetected = done && order.length < Object.keys(directedAdjMap).length;

  let log, eventType, pseudoLines;

  if (cycleDetected) {
    const totalNodes = Object.keys(directedAdjMap).length;
    log = `Processando "${current}": fila vazia mas ${totalNodes - order.length} nó(s) ainda não processado(s) — ciclo detectado.`;
    eventType   = 'done_cycle';
    pseudoLines = [11];
  } else if (done) {
    log = `Processando "${current}": ordenação concluída. Ordem: ${order.join(' → ')}.`;
    eventType   = 'done';
    pseudoLines = [12];
  } else if (newlyEnqueued.length > 0) {
    log = `Processando "${current}": grau de entrada de [${newlyEnqueued.join(', ')}] chegou a 0 — enfileirado(s).`;
    eventType   = 'step';
    pseudoLines = [6, 7, 8, 9, 10];
  } else {
    log = `Processando "${current}": nenhum vizinho ficou com grau de entrada 0.`;
    eventType   = 'step';
    pseudoLines = [6, 7, 8, 9];
  }

  return {
    queue, inDegree, visited, inFrontier, current, order,
    done, cycleDetected,
    stepLog: log, pseudoLines, eventType,
    skippedNeighbors: [],
    stepCount,
  };
}
