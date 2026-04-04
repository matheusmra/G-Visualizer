/**
 * useAlgorithm — manages algorithm execution state and history.
 *
 * Encapsulates:
 *  - init / step dispatch via ALGO_MAP (no BFS/DFS knowledge leaks out)
 *  - snapshot history for step-backward
 *  - a stable tickForInterval(onDone) for use inside setInterval
 *
 * @param {string} algo            — one of ALGO_IDS ('BFS' | 'DFS' | 'FTD' | 'FTI' | 'TOPO')
 * @param {object} adjMap           — adjacency map for the current graph
 * @param {object} reverseMap       — reverse adjacency map (used by FTI)
 * @param {object} directedAdjMap   — always-directed adjacency map (used by TOPO)
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import { ALGO_MAP } from '../constants/algorithms.js';

export function useAlgorithm(algo, adjMap, reverseMap, directedAdjMap) {
  const [algoState, setAlgoState] = useState(null);
  const [history,   setHistory]   = useState([]);
  const skipShownRef = useRef(false);

  // Memoised maps object — ALGO_MAP.step receives { adjMap, reverseMap, directedAdjMap }
  const maps = useMemo(() => ({ adjMap, reverseMap, directedAdjMap }), [adjMap, reverseMap, directedAdjMap]);

  /** Initialise the algorithm from a given start node. */
  const start = useCallback((startNode) => {
    const entry = ALGO_MAP[algo];
    if (!entry || !startNode) return;
    setAlgoState(entry.init(startNode, maps));
    setHistory([]);
    skipShownRef.current = false;
  }, [algo]);

  /** Pure single-step function — also used by tickForInterval. */
  const advanceOne = useCallback(
    (state) => (state && !state.done ? ALGO_MAP[algo].step(state, maps) : state),
    [algo, maps],
  );

  /** Advance one step (user-triggered). */
  const stepForward = useCallback(() => {
    if (!algoState || algoState.done) return;
    setHistory(h => [...h, algoState]);
    setAlgoState(prev => advanceOne(prev));
  }, [algoState, advanceOne]);

  /** Revert to the previous snapshot. */
  const stepBackward = useCallback(() => {
    if (history.length === 0) return;
    setAlgoState(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
  }, [history]);

  /** Reset all state (called on algo / preset change). */
  const reset = useCallback(() => {
    setAlgoState(null);
    setHistory([]);
    skipShownRef.current = false;
  }, []);

  /**
   * Tick function designed for use inside a setInterval.
   * Uses the functional setState updater to avoid stale-closure issues.
   * Calls onDone() when the algorithm reaches a done state.
   */
  const tickForInterval = useCallback((onDone) => {
    setAlgoState(prev => {
      if (!prev || prev.done) {
        onDone?.();
        return prev;
      }
      const next = ALGO_MAP[algo].step(prev, maps);
      setHistory(h => [...h, prev]);
      return next;
    });
  }, [algo, maps]);

  return {
    algoState,
    history,
    start,
    stepForward,
    stepBackward,
    reset,
    advanceOne,
    tickForInterval,
    skipShownRef,
  };
}
