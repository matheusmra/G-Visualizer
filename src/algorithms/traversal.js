/**
 * Máquinas de estado para BFS e DFS.
 *
 * Cada chamada a stepBFS / stepDFS avança o algoritmo UM passo e
 * retorna o novo estado (imutável). Isso permite pausar, voltar e
 * reproduzir passo a passo na interface.
 *
 * Campos do estado:
 *   queue / stack      : string[]     – estrutura de dados da fronteira
 *   visited            : Set<string>  – nós completamente processados
 *   inFrontier         : Set<string>  – nós na fila/pilha (para colorir)
 *   current            : string|null  – nó avaliado agora
 *   order              : string[]     – ordem de visita até aqui
 *   done               : boolean
 *   stepLog            : string       – descrição legível do passo atual
 *   pseudoLines        : number[]     – linhas ativas do pseudocódigo (1-indexed)
 *   eventType          : string       – 'init' | 'step' | 'step_skip' | 'done' | 'done_unreachable'
 *   skippedNeighbors   : string[]     – vizinhos ignorados neste passo (já visitados)
 *   stepCount          : number       – contador de passos (para detectar mudanças no useEffect)
 */

// ─── BFS ─────────────────────────────────────────────────────────────────────

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

  // Build log + determine event type
  let log, eventType, pseudoLines;

  if (newlyEnqueued.length > 0 && skippedNeighbors.length > 0) {
    log = `Processando "${current}": enfileirado(s) [${newlyEnqueued.join(', ')}] · ignorado(s) [${skippedNeighbors.join(', ')}] (já descobertos).`;
    eventType  = 'step_skip';
    pseudoLines = [5, 6, 7, 8, 9];
  } else if (newlyEnqueued.length > 0) {
    log = `Processando "${current}": enfileirado(s) [${newlyEnqueued.join(', ')}].`;
    eventType  = 'step';
    pseudoLines = [5, 6, 7, 8, 9];
  } else if (skippedNeighbors.length > 0) {
    log = `Processando "${current}": todos os vizinhos [${skippedNeighbors.join(', ')}] já foram descobertos.`;
    eventType  = 'step_skip';
    pseudoLines = [5, 6, 7];
  } else {
    log = `Processando "${current}": nenhum vizinho.`;
    eventType  = 'step';
    pseudoLines = [5, 6];
  }

  // Override if this is the last step
  if (done) {
    const unreachable = Object.keys(adjMap).filter(n => !visited.has(n));
    if (unreachable.length > 0) {
      log += ` ⚠ BFS encerrada — nó(s) [${unreachable.join(', ')}] não são alcançáveis.`;
      eventType  = 'done_unreachable';
      pseudoLines = [10];
    } else {
      eventType  = 'done';
      pseudoLines = [10];
    }
  }

  return { queue, visited, inFrontier, current, order, done, stepLog: log, pseudoLines, eventType, skippedNeighbors, stepCount: (state.stepCount ?? 0) + 1 };
}

// ─── DFS ─────────────────────────────────────────────────────────────────────

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
    eventType  = 'step_skip';
    pseudoLines = [4, 5, 6, 7, 8, 9];
  } else if (newlyPushed.length > 0) {
    log = `Processando "${current}": empilhado(s) [${[...newlyPushed].reverse().join(', ')}].`;
    eventType  = 'step';
    pseudoLines = [4, 5, 6, 7, 8, 9];
  } else if (skippedNeighbors.length > 0) {
    log = `Processando "${current}": todos os vizinhos [${skippedNeighbors.join(', ')}] já foram visitados.`;
    eventType  = 'step_skip';
    pseudoLines = [4, 5, 6, 7, 8];
  } else {
    log = `Processando "${current}": nenhum vizinho.`;
    eventType  = 'step';
    pseudoLines = [4, 5, 6];
  }

  if (done) {
    const unreachable = Object.keys(adjMap).filter(n => !visited.has(n));
    if (unreachable.length > 0) {
      log += ` ⚠ DFS encerrada — nó(s) [${unreachable.join(', ')}] não são alcançáveis.`;
      eventType  = 'done_unreachable';
      pseudoLines = [10];
    } else {
      eventType  = 'done';
      pseudoLines = [10];
    }
  }

  return { stack, visited, inFrontier, current, order, done, stepLog: log, pseudoLines, eventType, skippedNeighbors, stepCount: (state.stepCount ?? 0) + 1 };
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

