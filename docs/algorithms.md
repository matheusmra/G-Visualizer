# Algorithms

G-Visualizer currently implements five graph algorithms. Each algorithm resides in its own file within `src/algorithms/` and exposes pure `init*` and `step*` functions.

---

## Breadth-First Search (BFS)

**File:** `src/algorithms/BFS.js`
**Exports:** `initBFS`, `stepBFS`, `buildAdjMap`

Explores the graph level-by-level using a **queue**. Guarantees the shortest path in unweighted graphs.

| Time Complexity | Space Complexity |
|------------------|------------------|
| O(V + E)         | O(V)             |

**Ideal for:** shortest path, level/distance, unweighted graphs.

### How it works

1. Enqueue the starting node and mark it as in the frontier.
2. For each step: dequeue the current node, mark it as visited.
3. Enqueue all neighbors that are not yet visited and not in the frontier.
4. Repeat until the queue is empty.

---

## Depth-First Search (DFS)

**File:** `src/algorithms/DFS.js`
**Exports:** `initDFS`, `stepDFS`

Dives as deep as possible before backtracking, using an explicit **stack**.

| Time Complexity | Space Complexity |
|------------------|------------------|
| O(V + E)         | O(V)             |

**Ideal for:** cycle detection, topological sorting, labyrinths.

### How it works

1. Push the starting node onto the stack and mark it as in the frontier.
2. For each step: pop the current node, mark it as visited.
3. Push unvisited neighbors onto the stack (in reverse order to maintain alphabetical consistency).
4. Repeat until the stack is empty.

---

## Direct Transitive Closure (FTD)

**File:** `src/algorithms/FT.js`
**Exports:** `initFTD`, `stepFTD`, `buildDirectedAdjMap`

Finds all nodes reachable from a source by following the **outgoing edges** of a directed graph. Internally reuses `stepBFS` logic.

| Time Complexity | Space Complexity |
|------------------|------------------|
| O(V + E)         | O(V)             |

**Ideal for:** reachability, dependency mapping, directed graphs.

---

## Indirect Transitive Closure (FTI)

**File:** `src/algorithms/FT.js`
**Exports:** `initFTI`, `stepFTI`, `buildReverseAdjMap`

Finds all **predecessors** of a source node by performing a BFS on the graph with reversed edges.

| Time Complexity | Space Complexity |
|------------------|------------------|
| O(V + E)         | O(V)             |

**Ideal for:** predecessors, impact analysis, directed graphs.

---

## Topological Sort (TOPO)

**File:** `src/algorithms/TopologicalSort.js`
**Exports:** `initTopSort`, `stepTopSort`

Sorts the vertices of a Directed Acyclic Graph (DAG) such that for every directed edge $u \to v$, node $u$ comes before $v$ in the ordering. Uses **Kahn's Algorithm** (BFS-based in-degree tracking).

| Time Complexity | Space Complexity |
|------------------|------------------|
| O(V + E)         | O(V)             |

**Ideal for:** task scheduling, dependency resolution, build systems.

---

## Connectivity Analysis

**File:** `src/algorithms/connectivity.js`
**Exports:** `findSCC`, `findConnectedComponents`, `findBridgesAndAPs`, `COMPONENT_COLORS`

This is not an interactive traversal algorithm; it is executed statically over the current graph for analytical purposes.

| Function                  | Algorithm       | Graph Type    |
|---------------------------|-----------------|---------------|
| `findSCC`                 | Kosaraju        | Directed      |
| `findConnectedComponents` | Simple DFS      | Undirected    |
| `findBridgesAndAPs`       | Tarjan          | Undirected    |

---

## Algorithm State (Common Fields)

Each `step*` function returns a new immutable object containing:

| Field             | Type      | Description                                           |
|--------------------|-----------|-------------------------------------------------------|
| `queue` / `stack`  | `Array`   | Main data structure                                   |
| `visited`          | `Set`     | Nodes that have already been visited                  |
| `inFrontier`       | `Set`     | Nodes currently in the frontier (queue/stack)         |
| `current`          | `string`  | Node being processed in the current step              |
| `order`            | `Array`   | Accumulated visit sequence                            |
| `done`             | `boolean` | Whether the algorithm has finished                    |
| `pseudoLines`      | `Array`   | Indices of the active lines in the pseudocode         |
| `eventType`        | `string`  | `step`, `step_skip`, `done`, `done_unreachable`, etc. |
| `stepCount`        | `number`  | Incremental counter for reactive effects              |

---

← [Back to README](../README.md)