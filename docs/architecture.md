# Architecture

G-Visualizer uses an architecture based on **per-step immutable state**. Every transition is a pure function, making execution history trivially implementable.

---

## Project Structure

```
src/
├── algorithms/
│   ├── BFS.js                # initBFS, stepBFS, buildAdjMap
│   ├── DFS.js                # initDFS, stepDFS
│   ├── FT.js                 # initFTD, stepFTD, initFTI, stepFTI
│   ├── TopologicalSort.js    # initTopSort, stepTopSort
│   ├── connectivity.js       # findSCC, findConnectedComponents, findBridgesAndAPs
│   └── ...
│
├── components/
│   ├── canvas/
│   │   └── GraphCanvas.jsx   # Cytoscape.js Canvas
│   ├── panels/
│   │   ├── DataPanel.jsx     # Queue/Stack, visited, visit order
│   │   ├── ConnectivityPanel.jsx # Connectivity analysis
│   │   └── ...
│   ├── visualizer/
│   │   ├── Panels.jsx        # Sidebar panels (ControlSidebar, PlaybackBar)
│   │   ├── VisualizerHeader.jsx # Algorithm selector and execution controls
│   │   └── ...
│   └── ...
│
├── pages/
│   ├── HomePage.jsx          # Landing page
│   ├── AlgorithmsPage.jsx     # Algorithm library
│   └── VisualizerPage.jsx    # Main visualizer
│
├── context/
│   └── ThemeContext.jsx      # Light/dark theme (localStorage)
│
└── data/
    └── presets.js            # Pre-built graphs
```

---

## Execution Flow

```
Graph (preset or custom)
        ↓
  Initial node selected
        ↓
  Initial state created (initBFS / initDFS / initFTD / initFTI / initTopSort)
        ↓
  ┌─────────────────────┐
  │    Step executed    │  ←── user clicks "Step" or "Play"
  │  stepBFS / stepDFS  │
  │  stepFTD / stepFTI  │
  └─────────────────────┘
        ↓
  Immutable state saved in history (Array of snapshots)
        ↓
  Canvas updated (Cytoscape.js classes)
  DataPanel re-rendered
  Pseudocode highlights active line
  Toast emitted (if eventType is relevant)
```

Backward navigation ("Back") works by simply restoring the last snapshot from the `history` array.

---

## Visual Classes on the Canvas (Cytoscape.js)

| CSS Class    | Color    | Meaning                   |
|--------------|----------|---------------------------|
| *(default)*  | Gray     | Not visited               |
| `.frontier`  | Amber    | In queue/stack (frontier) |
| `.current`   | Violet   | Being processed now       |
| `.visited`   | Green    | Already visited           |
| `.comp-0..7` | Various  | Connected components      |
| `.ap`        | Orange   | Articulation point        |
| `.bridge`    | Red      | Bridge edge               |

Algorithm classes (`.frontier`, `.current`, `.visited`) and connectivity classes (`.comp-*`, `.ap`, `.bridge`) are applied in separate React effects, ensuring they don't interfere with each other.

---

## Routes

| Route                    | Component        | Description                          |
|-------------------------|-------------------|--------------------------------------|
| `/`                     | `HomePage`        | Landing page                         |
| `/algoritmos`           | `AlgorithmsPage`  | Algorithm library                    |
| `/visualizar/:algorithm`| `VisualizerPage`  | Visualizer (`BFS`, `DFS`, `FTD`, `FTI`, `TOPO`) |
| `/visualizar`           | Redirect → `/visualizar/BFS` | |
| `*`                     | Redirect → `/`   |                                      |

The `?preset=<key>` parameter defines the initial graph. `?preset=custom` activates the editor.

---

## Theme System

`ThemeContext` manages the theme via `useState` with persistence in `localStorage('gv-theme')`. The `dark` class is applied to `document.documentElement`, and TailwindCSS v4 uses `@custom-variant dark (&:where(.dark, .dark *))` for `dark:` selectors.

---

← [Back to README](../README.md)