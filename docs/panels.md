# Visualizer Panels

The visualizer features four tabs in the right sidebar.

---

## Data Structures

Displays the internal state of the algorithm in real-time:

- **Queue** (BFS / FTD / FTI / TOPO) or **Stack** (DFS) — nodes currently queued or pushed onto the stack.
- **Visited** — the set of nodes that have already been processed.
- **Visit Order** — the complete accumulated sequence of visits.

---

## Pseudocode

The pseudocode for the selected algorithm. The line corresponding to the current step is highlighted in indigo. This is useful for visually correlating what happens in the graph with the theoretical code.

---

## Connectivity (Lecture 09)

Static analysis of the current graph. Trigger "Analyze" to calculate and highlight the results on the canvas.

### Undirected Graphs

| Analysis              | Algorithm | Canvas Result                                |
|-----------------------|-----------|----------------------------------------------|
| Connected Components  | DFS       | Each component receives a unique color       |
| Bridges               | Tarjan    | Bridge edges turn red                        |
| Articulation Points   | Tarjan    | Articulation nodes gain a thick orange border|

### Directed Graphs

| Analysis                    | Algorithm | Canvas Result                          |
|-----------------------------|-----------|----------------------------------------|
| Connected Components (SCCs) | Kosaraju  | Each SCC receives a unique color       |

> Bridges and Articulation Points are undirected graph concepts and are not calculated for directed graphs.

---

## Graph - Mathematical Representations (Lecture 04)

Switch between three representations of the drawn graph. These update automatically as the graph is edited.

### Adjacency List

Each node lists its neighbors (undirected) or direct successors (directed). Nodes with no connections display `∅`.

```
A - B, C
B - A, D
C - A
D - B
```

### Adjacency Matrix

An $n \times n$ matrix where the value `1` indicates an edge from the row node to the column node. In undirected graphs, the matrix is symmetric.

```
  A B C D
A 0 1 1 0
B 1 0 0 1
C 1 0 0 0
D 0 1 0 0
```

### Incidence Matrix

An $n \times m$ matrix (nodes $\times$ edges). In undirected graphs, each cell is `1` if the node is incident to the edge. In directed graphs: `+1` for outgoing edges, `-1` for incoming edges.

```
   e0 e1 e2
A   1  1  0
B   1  0  1
C   0  1  0
D   0  0  1
```

---

← [Back to README](../README.md)