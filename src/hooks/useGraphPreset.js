/**
 * useGraphPreset — manages the active graph source (preset or custom).
 *
 * Centralises:
 *  - preset selection + URL ?preset= sync
 *  - custom-graph elements, directed flag, and edit mode
 *  - derived values: currentElements, currentLayout, currentIsDirected, nodeIds
 *
 * @param {string}          initialPresetKey  — from URL ?preset= (default 'cyclic')
 * @param {function}        setSearchParams   — from useSearchParams()
 */

import { useState, useCallback, useEffect } from 'react';
import { PRESETS } from '../data/presets.js';

const EMPTY_GRAPH = { nodes: [], edges: [] };

export function useGraphPreset(initialPresetKey = 'cyclic', setSearchParams) {
  const [presetKey,      setPresetKeyState] = useState(initialPresetKey);
  const [customElements, setCustomElements] = useState(EMPTY_GRAPH);
  const [isDirected,     setIsDirected]     = useState(false);
  const [editMode,       setEditMode]       = useState(null);

  // Sync URL when presetKey changes
  useEffect(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('preset', presetKey);
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetKey]);

  const setPresetKey = useCallback((key) => {
    setPresetKeyState(key);
    setEditMode(null);
  }, []);

  const handleGraphChange = useCallback((newElements) => {
    setCustomElements(newElements);
  }, []);

  const handleClearGraph = useCallback(() => {
    setCustomElements(EMPTY_GRAPH);
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────
  const isCustom          = presetKey === 'custom';
  const preset            = isCustom ? null : PRESETS[presetKey];
  const currentElements   = isCustom ? customElements : (preset?.elements ?? EMPTY_GRAPH);
  const currentLayout     = isCustom ? { name: 'preset' } : (preset?.layout ?? { name: 'preset' });
  const currentIsDirected = isCustom ? isDirected : (preset?.directed ?? false);
  const nodeIds           = currentElements.nodes.map(n => n.data.id);

  return {
    presetKey,
    setPresetKey,
    customElements,
    isDirected,
    setIsDirected,
    editMode,
    setEditMode,
    isCustom,
    currentElements,
    currentLayout,
    currentIsDirected,
    nodeIds,
    handleGraphChange,
    handleClearGraph,
  };
}
