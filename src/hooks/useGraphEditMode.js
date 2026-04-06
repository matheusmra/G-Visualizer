import { useEffect, useRef } from 'react';

/** Collect current cy state and push to parent (used by edit mode). */
function syncUp(cy, onGraphChange) {
  if (!onGraphChange) return;
  const nodes = cy.nodes().map(n => ({
    data: { id: n.id(), label: n.id() },
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

export function useGraphEditMode(cyRef, editMode, onGraphChange, cyGen) {
  const edgeSrcRef = useRef(null);

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
  }, [editMode, onGraphChange, cyGen, cyRef]);
}
