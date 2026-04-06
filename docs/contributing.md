# Contributing

Contributions are welcome! Whether it's fixing a bug, adding an algorithm, or improving the UI.

---

## Environment Setup

```bash
git clone https://github.com/matheusmra/G-Visualizer.git
cd G-Visualizer
npm install
npm run dev
```

---

## How to Add a New Algorithm

1. Create a file in `src/algorithms/MyAlgo.js`.
2. Export the `initMyAlgo(startNode)` and `stepMyAlgo(state, maps)` functions.
3. The returned state must follow the standard structure (see [docs/algorithms.md](algorithms.md#algorithm-state-common-fields)).
4. Add the algorithm metadata to `src/data/algorithms.js` and a default preset to `ALGO_DEFAULT_PRESET`.
5. Register the `init` and `step` functions in `src/constants/algorithms.js` within the `ALGO_MAP` object.
6. Add the pseudocode to `src/constants/pseudocode.js`.
7. If needed, update the logic for data displays in `src/components/panels/DataPanel.jsx`.

---

## How to Add a New Preset

Edit `src/data/presets.js` and add a new entry to the `PRESETS` object:

```js
myGraph: {
  name: 'Graph Name',
  description: 'Brief description.',
  directed: false, // or true
  elements: {
    nodes: [
      { data: { id: 'A', label: 'A' } },
      // ...
    ],
    edges: [
      { data: { source: 'A', target: 'B' } },
      // ...
    ],
  },
  layout: { name: 'cose' }, // any Cytoscape.js layout
},
```

The preset will automatically appear in the homepage library and the visualizer dropdown.

---

## Commit Structure

Use clear commit messages:

```
feat: add Dijkstra algorithm
fix: correct neighbor sorting in DFS
docs: update README with new panels
style: change button color
```

---

## Issues and Pull Requests

- Open an [issue](https://github.com/matheusmra/G-Visualizer/issues) to report bugs or propose features.
- Fork the repository, create a descriptive branch, and open a Pull Request.

---

← [Back to README](../README.md)