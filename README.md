# G-Visualizer

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss&logoColor=white)
![Cytoscape.js](https://img.shields.io/badge/Cytoscape.js-3-f79a25)
![License](https://img.shields.io/badge/license-MIT-green)

An interactive educational tool for visualizing graph algorithms step-by-step.

> **Project under active development.** Contributions are welcome. Open an issue with suggestions or bugs!

---

## Overview

G-Visualizer allows students to **see every step of a graph algorithm happening** on the canvas, with data structures and pseudocode always in sync.

The core approach is **per-step immutable state**: every state transition is a pure function, enabling forward and backward navigation through execution like a visual debugger.

### Key Features

- Step-by-step execution with navigable history
- Real-time data structures (queue/stack, visited nodes, visit order)
- Pseudocode with active line highlighting
- Integrated graph editor
- Connectivity analysis: connected components, bridges, and articulation points
- Mathematical representations: Adjacency List, Adjacency Matrix, and Incidence Matrix
- Light and dark modes with local persistence

---

## Available Algorithms

| Algorithm | File |
|-----------|---------|
| Breadth-First Search (BFS) | `src/algorithms/BFS.js` |
| Depth-First Search (DFS) | `src/algorithms/DFS.js` |
| Direct Transitive Closure (FTD) | `src/algorithms/FT.js` |
| Indirect Transitive Closure (FTI) | `src/algorithms/FT.js` | 
| Topological Sort (TOPO) | `src/algorithms/TopologicalSort.js` |
| Connectivity (SCC / Bridges / APs) | `src/algorithms/connectivity.js` |

→ [Full algorithm documentation](docs/algorithms.md)

---

## Quick Start

**Prerequisites:** Node.js 18+ and npm 9+

```bash
git clone https://github.com/matheusmra/G-Visualizer.git
cd G-Visualizer
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**Build for production:**

```bash
npm run build
npm run preview
```

---

## Documentation

| Document | Content |
|-----------|----------|
| [docs/algorithms.md](docs/algorithms.md) | Detailed description of BFS, DFS, FTD, FTI, and Connectivity; state structure guides |
| [docs/architecture.md](docs/architecture.md) | Project structure, execution flow, canvas classes, routes, and theme system |
| [docs/panels.md](docs/panels.md) | The four visualizer panels: Structures, Pseudocode, Connectivity, and Representations |
| [docs/contributing.md](docs/contributing.md) | How to add algorithms, presets, and contribute to the project |
| [docs/technical-debt.md](docs/technical-debt.md) | Project roadmap and known issues |

---

## Stack

| Technology | Version | Usage |
|------------|--------|-----|
| React | 19 | Interface and state management |
| Vite | 5 | Build and development server |
| TailwindCSS | 4 | Styling |
| Cytoscape.js | 3 | Canvas and graph rendering |
| React Router | 7 | Page routing |

---

## Contact

- **Issues**: [GitHub Issues](https://github.com/matheusmra/G-Visualizer/issues)
- **GitHub**: [@matheusmra](https://github.com/matheusmra)

**If this project was useful, leave a star on the repository!**

---

*Made by Matheus*
