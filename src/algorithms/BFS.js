/**
 * Busca em Largura — BFS
 *
 * stepBFS avança o algoritmo UM passo e retorna o novo estado (imutável).
 * buildAdjMap constrói o mapa de adjacência não-dirigido.
 */

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initBFS(startNode) {
  return {
    queue: [startNode],
    visited: new Set([startNode]),
    inFrontier: new Set([startNode]),
    current: null,
    order: [],
    done: false,
    stepLog: `BFS iniciada no nó "${startNode}". Fila Q = [${startNode}].`,
    pseudoLines: [2, 3],
    eventType: 'init',
    skippedNeighbors: [],
    stepCount: 0,
  };
}

// ─── Step ─────────────────────────────────────────────────────────────────────

export function stepBFS(state, adjMap) {
  if (state.done || state.queue.length === 0) {
    const allNodes = Object.keys(adjMap);
    const unreachable = allNodes.filter(n => !state.visited.has(n));
    const eventType = unreachable.length > 0 ? 'done_unreachable' : 'done';
    const log = unreachable.length > 0
      ? `BFS encerrada. Nó(s) [${unreachable.join(', ')}] não alcançáveis — o grafo pode ser desconexo.`
      : `BFS concluída — todos os nós foram visitados. Ordem: ${state.order.join(' → ')}.`;
    return { ...state, done: true, current: null, stepLog: log, pseudoLines: [10], eventType, skippedNeighbors: [], stepCount: (state.stepCount ?? 0) + 1 };
  }

  const queue      = [...state.queue];
  const visited    = new Set(state.visited);
  const inFrontier = new Set(state.inFrontier);
  const order      = [...state.order];

  const current = queue.shift();
  inFrontier.delete(current);
  order.push(current);

  const neighbors        = adjMap[current] || [];
  const newlyEnqueued    = [];
  const skippedNeighbors = [];

  for (const neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      visited.add(neighbor);
      inFrontier.add(neighbor);
      queue.push(neighbor);
      newlyEnqueued.push(neighbor);
    } else {
      skippedNeighbors.push(neighbor);
    }
  }

  const done = queue.length === 0;

  let log, eventType, pseudoLines;

  if (newlyEnqueued.length > 0 && skippedNeighbors.length > 0) {
    log = `Processando "${current}": enfileirado(s) [${newlyEnqueued.join(', ')}] · ignorado(s) [${skippedNeighbors.join(', ')}] (já descobertos).`;
    eventType   = 'step_skip';
    pseudoLines = [5, 6, 7, 8, 9];
  } else if (newlyEnqueued.length > 0) {
    log = `Processando "${current}": enfileirado(s) [${newlyEnqueued.join(', ')}].`;
    eventType   = 'step';
    pseudoLines = [5, 6, 7, 8, 9];
  } else if (skippedNeighbors.length > 0) {
    log = `Processando "${current}": todos os vizinhos [${skippedNeighbors.join(', ')}] já foram descobertos.`;
    eventType   = 'step_skip';
    pseudoLines = [5, 6, 7];
  } else {
    log = `Processando "${current}": nenhum vizinho.`;
    eventType   = 'step';
    pseudoLines = [5, 6];
  }

  if (done) {
    const unreachable = Object.keys(adjMap).filter(n => !visited.has(n));
    if (unreachable.length > 0) {
      log += ` BFS encerrada — nó(s) [${unreachable.join(', ')}] não são alcançáveis.`;
      eventType   = 'done_unreachable';
      pseudoLines = [10];
    } else {
      eventType   = 'done';
      pseudoLines = [10];
    }
  }

  return { queue, visited, inFrontier, current, order, done, stepLog: log, pseudoLines, eventType, skippedNeighbors, stepCount: (state.stepCount ?? 0) + 1 };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Mapa de adjacência não-dirigido (ambas as direções). */
export function buildAdjMap(elements) {
  const adj = {};
  for (const el of elements.nodes) adj[el.data.id] = [];
  for (const el of elements.edges) {
    const { source, target } = el.data;
    if (!adj[source]) adj[source] = [];
    if (!adj[target]) adj[target] = [];
    adj[source].push(target);
    adj[target].push(source);
  }
  return adj;
}
