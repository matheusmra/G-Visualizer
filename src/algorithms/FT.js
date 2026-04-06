/**
 * Fecho Transitivo Direto (FTD) e Fecho Transitivo Indireto (FTI).
 *
 * FTD → BFS sobre o adjMap dirigido  (arestas de saída u→v)
 * FTI → BFS sobre o adjMap invertido (arestas de entrada como saída)
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

// ─── Helpers para grafos dirigidos ───────────────────────────────────────────

/** Adjmap dirigido: apenas arestas de saída (source → target). */
export function buildDirectedAdjMap(elements) {
  const adj = {};
  for (const el of elements.nodes) adj[el.data.id] = [];
  for (const el of elements.edges) {
    const { source, target } = el.data;
    if (!adj[source]) adj[source] = [];
    adj[source].push(target);
  }
  return adj;
}

/** Adjmap invertido: arestas de entrada viram saída. Usado pelo FTI. */
export function buildReverseAdjMap(elements) {
  const adj = {};
  for (const el of elements.nodes) adj[el.data.id] = [];
  for (const el of elements.edges) {
    const { source, target } = el.data;
    if (!adj[target]) adj[target] = [];
    adj[target].push(source);
  }
  return adj;
}
