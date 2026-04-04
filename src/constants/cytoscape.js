/**
 * Cytoscape colour palette and stylesheet factory.
 * Centralising here lets GraphCanvas and connectivity classes share the same tokens.
 */

import { COMPONENT_COLORS } from '../algorithms/connectivity.js';

/** Node state colours (dark-theme defaults). */
export const NODE_COLORS = {
  unvisited: { bg: '#1e293b', border: '#475569', text: '#94a3b8' },
  frontier:  { bg: '#854d0e', border: '#f59e0b', text: '#fef3c7' },
  current:   { bg: '#7c3aed', border: '#a78bfa', text: '#ede9fe' },
  visited:   { bg: '#166534', border: '#4ade80', text: '#dcfce7' },
  edgeSrc:   { bg: '#1e3a5f', border: '#60a5fa', text: '#bfdbfe' },
};

/** Builds the full Cytoscape stylesheet for a given directedness. */
export function buildStylesheet(isDirected) {
  const C = NODE_COLORS;
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
        'text-wrap': 'wrap',
        'text-max-width': '52px',
        'font-size': 11,
        'font-weight': 'bold',
        'width': 52,
        'height': 52,
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
        'line-style': 'solid',
      },
    },
    // Connectivity highlight classes
    ...COMPONENT_COLORS.map((c, i) => ({
      selector: `node.comp-${i}`,
      style: { 'background-color': c.bg, 'border-color': c.border, 'color': c.text, 'border-width': 2 },
    })),
    {
      selector: 'node.ap',
      style: { 'border-color': '#f97316', 'border-width': 5 },
    },
    {
      selector: 'edge.bridge',
      style: { 'line-color': '#ef4444', 'target-arrow-color': '#ef4444', 'width': 4 },
    },
  ];
}
