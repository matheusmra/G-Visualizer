/**
 * Busca em Profundidade — DFS
 *
 * stepDFS avança o algoritmo UM passo e retorna o novo estado (imutável).
 */

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initDFS(startNode) {
  return {
    stack: [startNode],
    visited: new Set(),
    inFrontier: new Set([startNode]),
    current: null,
    order: [],
    done: false,
    stepLog: `DFS iniciada no nó "${startNode}". Pilha P = [${startNode}].`,
    pseudoLines: [2],
    eventType: 'init',
    skippedNeighbors: [],
    stepCount: 0,
  };
}

// ─── Step ─────────────────────────────────────────────────────────────────────

export function stepDFS(state, adjMap) {
  if (state.done || state.stack.length === 0) {
    const allNodes = Object.keys(adjMap);
    const unreachable = allNodes.filter(n => !state.visited.has(n));
    const eventType = unreachable.length > 0 ? 'done_unreachable' : 'done';
    const log = unreachable.length > 0
      ? `DFS encerrada. Nó(s) [${unreachable.join(', ')}] não alcançáveis — o grafo pode ser desconexo.`
      : `DFS concluída — todos os nós foram visitados. Ordem: ${state.order.join(' → ')}.`;
    return { ...state, done: true, current: null, stepLog: log, pseudoLines: [10], eventType, skippedNeighbors: [], stepCount: (state.stepCount ?? 0) + 1 };
  }

  const stack      = [...state.stack];
  const visited    = new Set(state.visited);
  const inFrontier = new Set(state.inFrontier);
  const order      = [...state.order];

  // Desempilha e pula nós já visitados (duplicatas na pilha)
  let current;
  do {
    if (stack.length === 0) {
      const unreachable = Object.keys(adjMap).filter(n => !visited.has(n));
      const eventType = unreachable.length > 0 ? 'done_unreachable' : 'done';
      const log = unreachable.length > 0
        ? `DFS encerrada. Nó(s) [${unreachable.join(', ')}] não alcançáveis.`
        : `DFS concluída. Ordem: ${order.join(' → ')}.`;
      return { ...state, stack, visited, inFrontier, order, done: true, current: null, stepLog: log, pseudoLines: [10], eventType, skippedNeighbors: [], stepCount: (state.stepCount ?? 0) + 1 };
    }
    current = stack.pop();
    inFrontier.delete(current);
  } while (visited.has(current));

  visited.add(current);
  order.push(current);

  const neighbors        = adjMap[current] || [];
  const newlyPushed      = [];
  const skippedNeighbors = [];

  for (const neighbor of [...neighbors].reverse()) {
    if (!visited.has(neighbor)) {
      inFrontier.add(neighbor);
      stack.push(neighbor);
      newlyPushed.push(neighbor);
    } else {
      skippedNeighbors.push(neighbor);
    }
  }

  const done = stack.length === 0;

  let log, eventType, pseudoLines;

  if (newlyPushed.length > 0 && skippedNeighbors.length > 0) {
    log = `Processando "${current}": empilhado(s) [${[...newlyPushed].reverse().join(', ')}] · ignorado(s) [${skippedNeighbors.join(', ')}] (já visitados).`;
    eventType   = 'step_skip';
    pseudoLines = [4, 5, 6, 7, 8, 9];
  } else if (newlyPushed.length > 0) {
    log = `Processando "${current}": empilhado(s) [${[...newlyPushed].reverse().join(', ')}].`;
    eventType   = 'step';
    pseudoLines = [4, 5, 6, 7, 8, 9];
  } else if (skippedNeighbors.length > 0) {
    log = `Processando "${current}": todos os vizinhos [${skippedNeighbors.join(', ')}] já foram visitados.`;
    eventType   = 'step_skip';
    pseudoLines = [4, 5, 6, 7, 8];
  } else {
    log = `Processando "${current}": nenhum vizinho.`;
    eventType   = 'step';
    pseudoLines = [4, 5, 6];
  }

  if (done) {
    const unreachable = Object.keys(adjMap).filter(n => !visited.has(n));
    if (unreachable.length > 0) {
      log += ` DFS encerrada — nó(s) [${unreachable.join(', ')}] não são alcançáveis.`;
      eventType   = 'done_unreachable';
      pseudoLines = [10];
    } else {
      eventType   = 'done';
      pseudoLines = [10];
    }
  }

  return { stack, visited, inFrontier, current, order, done, stepLog: log, pseudoLines, eventType, skippedNeighbors, stepCount: (state.stepCount ?? 0) + 1 };
}
