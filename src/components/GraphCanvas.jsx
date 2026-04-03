import { useRef, useEffect } from 'react';
import cytoscape from 'cytoscape';

const C = {
  unvisited:  { bg: '#1e293b', border: '#475569', text: '#94a3b8' },
  frontier:   { bg: '#854d0e', border: '#f59e0b', text: '#fef3c7' },
  current:    { bg: '#7c3aed', border: '#a78bfa', text: '#ede9fe' },
  visited:    { bg: '#166534', border: '#4ade80', text: '#dcfce7' },
  edgeSrc:    { bg: '#1e3a5f', border: '#60a5fa', text: '#bfdbfe' },
};

function buildStylesheet(isDirected) {
  return [
    {
      selector: 'node',
      style: {
        'background-color': C.unvisited.bg,
        'border-color': C.unvisited.border,
        'border-width': 2,
        'color': C.unvisited.text,
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': 14,
        'font-weight': 'bold',
        'width': 44,
        'height': 44,
        'transition-property': 'background-color, border-color, border-width',
        'transition-duration': '300ms',
      },
    },
    { selector: 'node.frontier', style: { 'background-color': C.frontier.bg, 'border-color': C.frontier.border, 'border-width': 3, 'color': C.frontier.text } },
    { selector: 'node.current',  style: { 'background-color': C.current.bg,  'border-color': C.current.border,  'border-width': 4, 'color': C.current.text  } },
    { selector: 'node.visited',  style: { 'background-color': C.visited.bg,  'border-color': C.visited.border,  'border-width': 2, 'color': C.visited.text  } },
    { selector: 'node.edge-src', style: { 'background-color': C.edgeSrc.bg,  'border-color': C.edgeSrc.border,  'border-width': 4, 'color': C.edgeSrc.text  } },
    {
      selector: 'edge',
      style: {
        'line-color': '#334155',
        'width': 2,
        'curve-style': 'bezier',
        'target-arrow-shape': isDirected ? 'triangle' : 'none',
        'target-arrow-color': '#334155',
        'transition-property': 'line-color, width',
        'transition-duration': '300ms',
      },
    },
    {
      selector: 'edge.traversed',
      style: {
        'line-color': '#4ade80',
        'target-arrow-color': '#4ade80',
        'width': 3,
      },
    },
  ];
}

/** Collect current cy state and push to parent (used by edit mode). */
function syncUp(cy, onGraphChange) {
  const nodes = cy.nodes().map(n => ({
    data: { id: n.id(), label: n.data('label') },
    position: { ...n.position() },
  }));
  const edges = cy.edges().map(e => ({
    data: { id: e.id(), source: e.data('source'), target: e.data('target') },
  }));
  onGraphChange({ nodes, edges });
}

/** Pick the next alphabetic label not yet used in the graph. */
function nextLabel(cy) {
  const used = new Set(cy.nodes().map(n => n.id()));
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (const l of letters) if (!used.has(l)) return l;
  let i = 1;
  while (used.has(`N${i}`)) i++;
  return `N${i}`;
}

export default function GraphCanvas({
  elements,
  layout,
  algoState,
  // edit-mode props (optional)
  editMode,
  isDirected,
  onGraphChange,
}) {
  const containerRef = useRef(null);
  const cyRef       = useRef(null);
  const editModeRef = useRef(editMode);  // read inside effects without re-triggering them
  const edgeSrcRef  = useRef(null);      // source node id during addEdge

  // Keep ref in sync with prop
  useEffect(() => { editModeRef.current = editMode; }, [editMode]);

  // ── Initialise / re-initialise canvas ──────────────────────────────────────
  // Only runs when elements or layout change AND we are NOT in an active edit mode.
  // This prevents destroying the canvas (and losing positions) while the user edits.
  useEffect(() => {
    if (!containerRef.current) return;
    if (editModeRef.current != null && cyRef.current) return; // preserve canvas in edit mode

    if (cyRef.current) cyRef.current.destroy();

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [...elements.nodes, ...elements.edges],
      style: buildStylesheet(isDirected ?? false),
      layout,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, layout]);

  // Unmount cleanup
  useEffect(() => () => { cyRef.current?.destroy(); cyRef.current = null; }, []);

  // ── Update arrow style when isDirected toggles ────────────────────────────
  useEffect(() => {
    if (cyRef.current) cyRef.current.style(buildStylesheet(isDirected ?? false));
  }, [isDirected]);

  // ── Edit mode event handlers ──────────────────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    // Clear all previous tap handlers and reset state
    cy.off('tap');
    cy.nodes().removeClass('edge-src');
    edgeSrcRef.current = null;
    cy.autoungrabify(editMode === 'delete');

    if (editMode === 'addNode') {
      cy.on('tap', evt => {
        if (evt.target !== cy) return; // only background taps
        const label = nextLabel(cy);
        cy.add({ group: 'nodes', data: { id: label, label }, position: evt.position });
        syncUp(cy, onGraphChange);
      });

    } else if (editMode === 'addEdge') {
      cy.on('tap', 'node', evt => {
        const node = evt.target;
        if (!edgeSrcRef.current) {
          edgeSrcRef.current = node.id();
          node.addClass('edge-src');
        } else {
          const src = edgeSrcRef.current;
          const tgt = node.id();
          cy.nodes().removeClass('edge-src');
          edgeSrcRef.current = null;
          if (src === tgt) return; // ignore self-loops
          const id = `e${src}${tgt}${Date.now()}`;
          cy.add({ group: 'edges', data: { id, source: src, target: tgt } });
          syncUp(cy, onGraphChange);
        }
      });

    } else if (editMode === 'delete') {
      cy.on('tap', 'node', evt => { evt.target.remove(); syncUp(cy, onGraphChange); });
      cy.on('tap', 'edge', evt => { evt.target.remove(); syncUp(cy, onGraphChange); });
    }

    return () => { cy.off('tap'); };
  }, [editMode, onGraphChange]);

  // ── Apply algorithm visual state ──────────────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    if (!algoState) {
      cy.nodes().removeClass('visited frontier current');
      cy.edges().removeClass('traversed');
      return;
    }

    const { visited, inFrontier, current } = algoState;

    cy.nodes().forEach(node => {
      const id = node.id();
      node.removeClass('visited frontier current');
      if (id === current)          node.addClass('current');
      else if (visited.has(id))    node.addClass('visited');
      else if (inFrontier.has(id)) node.addClass('frontier');
    });

    cy.edges().forEach(edge => {
      const src = edge.source().id();
      const tgt = edge.target().id();
      edge.toggleClass('traversed',
        (visited.has(src) || src === current) && (visited.has(tgt) || tgt === current)
      );
    });
  }, [algoState]);

  const cursor =
    editMode === 'addNode' ? 'crosshair' :
    editMode === 'addEdge' ? 'cell' :
    editMode === 'delete'  ? 'pointer' : 'grab';

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-xl bg-slate-900"
      style={{ minHeight: 420, cursor }}
    />
  );
}

