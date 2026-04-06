/**
 * Direct Transitive Closure (FTD) and Indirect Transitive Closure (FTI).
 *
 * FTD → BFS on directed adjMap (outgoing edges u→v)
 * FTI → BFS on reversed adjMap (incoming edges treated as outgoing)
 */

import { stepBFS } from './BFS.js';

// ─── FTD ─────────────────────────────────────────────────────────────────────

export function initFTD(startNode) {
  return {
    queue: [startNode],
    visited: new Set([startNode]),
    inFrontier: new Set([startNode]),
    current: null,
    order: [],
    done: false,
    stepLog: `FTD iniciado a partir de "${startNode}". Explorando nós alcançáveis pelas arestas de saída.`,
    pseudoLines: [2, 3],
    eventType: 'init',
    skippedNeighbors: [],
    stepCount: 0,
  };
}

export function stepFTD(state, adjMap) {
  const next = stepBFS(state, adjMap);
  if (next.eventType === 'done_unreachable') {
    const count = next.visited?.size ?? 0;
    return {
      ...next,
      eventType: 'done',
      stepLog: `Fecho Transitivo Direto calculado: ${count} nó(s) alcançável(is) a partir da origem.`,
    };
  }
  return { ...next, stepLog: next.stepLog.replace(/^BFS/, 'FTD') };
}

// ─── FTI ─────────────────────────────────────────────────────────────────────

export function initFTI(startNode) {
  return {
    queue: [startNode],
    visited: new Set([startNode]),
    inFrontier: new Set([startNode]),
    current: null,
    order: [],
    done: false,
    stepLog: `FTI iniciado a partir de "${startNode}". Explorando predecessores via grafo invertido.`,
    pseudoLines: [2, 3],
    eventType: 'init',
    skippedNeighbors: [],
    stepCount: 0,
  };
}

export function stepFTI(state, reverseMap) {
  const next = stepBFS(state, reverseMap);
  if (next.eventType === 'done_unreachable') {
    const count = next.visited?.size ?? 0;
    return {
      ...next,
      eventType: 'done',
      stepLog: `Fecho Transitivo Indireto calculado: ${count} nó(s) predecessor(es) encontrado(s).`,
    };
  }
  return { ...next, stepLog: next.stepLog.replace(/^BFS/, 'FTI') };
}

