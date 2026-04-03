/**
 * Connectivity analysis algorithms — Aula 09
 *
 * findSCC           : Kosaraju's strongly-connected components (directed graphs)
 * findConnectedComponents : simple DFS components (undirected graphs)
 * findBridgesAndAPs  : Tarjan's bridge + articulation-point detection (undirected)
 *
 * Note: designed for small educational graphs; recursive DFS is used for clarity.
 */

/** Colour palette shared with ConnectivityPanel for consistent node colouring. */
export const COMPONENT_COLORS = [
  { bg: '#1e3a5f', border: '#3b82f6', text: '#bfdbfe' }, // blue
  { bg: '#14532d', border: '#22c55e', text: '#bbf7d0' }, // green
  { bg: '#7c2d12', border: '#f97316', text: '#fed7aa' }, // orange
  { bg: '#581c87', border: '#a855f7', text: '#e9d5ff' }, // purple
  { bg: '#134e4a', border: '#14b8a6', text: '#ccfbf1' }, // teal
  { bg: '#713f12', border: '#eab308', text: '#fef08a' }, // yellow
  { bg: '#881337', border: '#f43f5e', text: '#fecdd3' }, // rose
  { bg: '#1e1b4b', border: '#818cf8', text: '#e0e7ff' }, // indigo
];

// ---------------------------------------------------------------------------
// Kosaraju's SCC — directed graphs only
// ---------------------------------------------------------------------------
export function findSCC(elements) {
  const nodes = elements.nodes.map(n => n.data.id);
  const adj = {}, radj = {};
  nodes.forEach(n => { adj[n] = []; radj[n] = []; });
  elements.edges.forEach(({ data: { source, target } }) => {
    if (adj[source])  adj[source].push(target);
    if (radj[target]) radj[target].push(source);
  });

  const visited = new Set(), order = [];
  const dfs1 = u => {
    visited.add(u);
    for (const v of adj[u]) if (!visited.has(v)) dfs1(v);
    order.push(u);
  };
  nodes.forEach(n => { if (!visited.has(n)) dfs1(n); });

  visited.clear();
  const sccs = [];
  const dfs2 = (u, scc) => {
    visited.add(u); scc.push(u);
    for (const v of radj[u]) if (!visited.has(v)) dfs2(v, scc);
  };
  for (let i = order.length - 1; i >= 0; i--) {
    if (!visited.has(order[i])) { const s = []; dfs2(order[i], s); sccs.push(s); }
  }
  return sccs;
}

// ---------------------------------------------------------------------------
// Connected components — undirected graphs
// ---------------------------------------------------------------------------
export function findConnectedComponents(elements) {
  const nodes = elements.nodes.map(n => n.data.id);
  const adj = {};
  nodes.forEach(n => { adj[n] = []; });
  elements.edges.forEach(({ data: { source, target } }) => {
    if (adj[source]) adj[source].push(target);
    if (adj[target]) adj[target].push(source);
  });

  const visited = new Set(), components = [];
  const dfs = (u, c) => { visited.add(u); c.push(u); for (const v of adj[u]) if (!visited.has(v)) dfs(v, c); };
  nodes.forEach(n => { if (!visited.has(n)) { const c = []; dfs(n, c); components.push(c); } });
  return components;
}

// ---------------------------------------------------------------------------
// Tarjan's bridges + articulation points — always treats edges as undirected
// ---------------------------------------------------------------------------
export function findBridgesAndAPs(elements) {
  const nodes = elements.nodes.map(n => n.data.id);
  const adj = {};
  nodes.forEach(n => { adj[n] = []; });
  // Build undirected adjacency from all edges
  elements.edges.forEach(({ data: { source, target, id } }) => {
    if (adj[source]) adj[source].push({ neighbor: target, edgeId: id });
    if (adj[target]) adj[target].push({ neighbor: source, edgeId: id });
  });

  const disc = {}, low = {};
  const visited = new Set();
  let timer = 0;
  const bridges = [], aps = new Set();

  const dfs = (u, parentEdgeId) => {
    visited.add(u);
    disc[u] = low[u] = ++timer;
    let childCount = 0;
    const isRoot = parentEdgeId === null;

    for (const { neighbor: v, edgeId } of adj[u]) {
      if (edgeId === parentEdgeId) continue; // skip edge we arrived on (handles multigraphs)
      if (!visited.has(v)) {
        childCount++;
        dfs(v, edgeId);
        low[u] = Math.min(low[u], low[v]);
        if (!isRoot && low[v] >= disc[u]) aps.add(u); // articulation point (non-root)
        if (low[v] > disc[u]) bridges.push(edgeId);   // bridge
      } else {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
    if (isRoot && childCount > 1) aps.add(u); // articulation point (root)
  };

  nodes.forEach(n => { if (!visited.has(n)) dfs(n, null); });
  return { bridges, articulationPoints: [...aps] };
}
