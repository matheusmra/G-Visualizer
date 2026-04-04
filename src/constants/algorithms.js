/**
 * Algorithm IDs, metadata, and the init/step dispatch table.
 * Import from here instead of hard-coding 'BFS', 'DFS', etc. inline.
 */

import { initBFS, stepBFS } from '../algorithms/BFS.js';
import { initDFS, stepDFS } from '../algorithms/DFS.js';
import { initFTD, stepFTD, initFTI, stepFTI } from '../algorithms/FTC.js';
import { initTopSort, stepTopSort } from '../algorithms/TopologicalSort.js';

export const TRAVERSAL_ALGOS = ['BFS', 'DFS'];
export const CLOSURE_ALGOS   = ['FTD', 'FTI'];
export const SORT_ALGOS      = ['TOPO'];
export const ALGO_IDS        = [...TRAVERSAL_ALGOS, ...CLOSURE_ALGOS, ...SORT_ALGOS];

export const ALGO_TITLES = {
  BFS:  'Busca em Largura',
  DFS:  'Busca em Profundidade',
  FTD:  'Fecho Transitivo Direto',
  FTI:  'Fecho Transitivo Indireto',
  TOPO: 'Ordenação Topológica',
};

/**
 * Dispatch table: maps each algorithm ID to its init and step functions.
 * init(startNode, maps) — maps = { adjMap, reverseMap, directedAdjMap }
 * step(state, maps)     — each entry picks the map it needs.
 */
export const ALGO_MAP = {
  BFS:  { init: initBFS,     step: (state, { adjMap })          => stepBFS(state, adjMap) },
  DFS:  { init: initDFS,     step: (state, { adjMap })          => stepDFS(state, adjMap) },
  FTD:  { init: initFTD,     step: (state, { adjMap })          => stepFTD(state, adjMap) },
  FTI:  { init: initFTI,     step: (state, { reverseMap })      => stepFTI(state, reverseMap) },
  TOPO: { init: initTopSort, step: (state, { directedAdjMap })  => stepTopSort(state, directedAdjMap) },
};
