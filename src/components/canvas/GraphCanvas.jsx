import { useRef, useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import { COMPONENT_COLORS } from '../../algorithms/connectivity.js';
import { buildStylesheet } from '../../constants/cytoscape.js';

/** Collect current cy state and push to parent (used by edit mode). */
function syncUp(cy, onGraphChange) {
  const nodes = cy.nodes().map(n => ({
    data: { id: n.id(), label: n.id() },
    position: { ...n.position() },
  }));
  const edges = cy.edges().map(e => ({
    data: { id: e.id(), source: e.data('source'), target: e.data('target') },
  }));
  onGraphChange({ nodes, edges });
}

/**
 * Animate a "draw-on" fill effect: the line appears to sweep from source to
 * target by shrinking a huge invisible gap dash down to zero offset.
 * After the animation settles the edge stays solid green.
 */
function startEdgeFill(edge, animatingRef) {
  const id = edge.id();
  if (animatingRef.current.has(id)) return;
  animatingRef.current.add(id);

  // A very large dash hides the entire gap; animating offset to 0 reveals the line
  const BIG = 9999;
  edge.style({
    'line-style': 'dashed',
    'line-dash-pattern': [BIG, 0],
    'line-dash-offset': BIG,
  });

  edge.animate(
    { style: { 'line-dash-offset': 0 } },
    {
      duration: 500,
      easing: 'ease-out',
      complete: () => {
        animatingRef.current.delete(id);
        // Lock to a clean solid line
        edge.style({ 'line-style': 'solid', 'line-dash-pattern': [1, 0], 'line-dash-offset': 0 });
      },
    }
  );
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
  connectivityHighlight, // { componentMap, bridgeIds, apIds } | null
}) {
  const containerRef    = useRef(null);
  const cyRef           = useRef(null);
  const editModeRef     = useRef(editMode);
  const edgeSrcRef      = useRef(null);
  const animatingEdges  = useRef(new Set());
  // Incremented each time the canvas is destroyed+recreated so the editMode
  // effect re-runs and re-attaches tap handlers on the new cy instance.
  const [cyGen, setCyGen] = useState(0);

  // Keep ref in sync with prop
  useEffect(() => { editModeRef.current = editMode; }, [editMode]);

  // ── Initialise / re-initialise canvas ──────────────────────────────────────
  // Only runs when elements or layout change AND we are NOT in an active edit mode.
  // This prevents destroying the canvas (and losing positions) while the user edits.
  useEffect(() => {
    if (!containerRef.current) return;
    // Preserve canvas during edit mode — UNLESS the graph was fully cleared
    if (editModeRef.current != null && cyRef.current && elements.nodes.length > 0) return;

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
    setCyGen(g => g + 1); // signal editMode effect to re-attach handlers
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
  }, [editMode, onGraphChange, cyGen]);

  // ── Sync node labels live (handles degree updates in edit mode) ──────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    elements.nodes.forEach(n => {
      const node = cy.getElementById(n.data.id);
      if (node.length) node.data('label', n.data.label);
    });
  }, [elements.nodes]);

  // ── Apply connectivity highlight ─────────────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    // Clear all connectivity classes
    cy.nodes().forEach(node => {
      for (let i = 0; i < COMPONENT_COLORS.length; i++) node.removeClass(`comp-${i}`);
      node.removeClass('ap');
    });
    cy.edges().removeClass('bridge');

    if (!connectivityHighlight) return;

    const { componentMap, bridgeIds, apIds } = connectivityHighlight;
    cy.nodes().forEach(node => {
      const id = node.id();
      const idx = componentMap[id];
      if (idx !== undefined) node.addClass(`comp-${idx % COMPONENT_COLORS.length}`);
      if (apIds.has(id)) node.addClass('ap');
    });
    cy.edges().forEach(edge => {
      if (bridgeIds.has(edge.id())) edge.addClass('bridge');
    });
  }, [connectivityHighlight]);

  // ── Apply algorithm visual state ──────────────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    if (!algoState) {
      cy.nodes().removeClass('visited frontier current');
      cy.edges().forEach(edge => {
        animatingEdges.current.delete(edge.id());
        edge.stop();
        edge.removeStyle('line-style line-dash-pattern line-dash-offset');
        edge.removeClass('traversed');
      });
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
      const shouldTraverse =
        (visited.has(src) || src === current) && (visited.has(tgt) || tgt === current);
      const wasTraversed = edge.hasClass('traversed');

      if (shouldTraverse && !wasTraversed) {
        edge.addClass('traversed');
        startEdgeFill(edge, animatingEdges);
      } else if (!shouldTraverse && wasTraversed) {
        animatingEdges.current.delete(edge.id());
        edge.stop();
        edge.removeStyle('line-style line-dash-pattern line-dash-offset');
        edge.removeClass('traversed');
      } else if (shouldTraverse && !animatingEdges.current.has(edge.id())) {
        // traversed class already set but animation was stopped (e.g. after step-back/reset)
        startEdgeFill(edge, animatingEdges);
      }
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
