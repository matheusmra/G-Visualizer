/**
 * Graph helper utilities — pure functions with no algorithm-specific logic.
 * These functions build adjacency structures used by all algorithms.
 */

/** Undirected adjacency map (both directions). */
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

/** Directed adjacency map: outgoing edges only (source → target). */
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

/** Reversed adjacency map: incoming edges treated as outgoing. Used by FTI. */
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
