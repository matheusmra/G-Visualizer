/**
 * URL state serialisation / deserialisation helpers.
 * Any component that reads or writes ?preset=…&algo=…&start=…&step=… uses this utility.
 */

/**
 * Parse the visualiser URL search params into a plain object.
 * @param {URLSearchParams} searchParams
 */
export function parseUrlState(searchParams) {
  return {
    preset: searchParams.get('preset') ?? 'cyclic',
    algo:   searchParams.get('algo')   ?? null,
    start:  searchParams.get('start')  ?? null,
    step:   searchParams.get('step') != null ? Number(searchParams.get('step')) : null,
  };
}

/**
 * Serialise a partial state object into URLSearchParams.
 * Only keys with defined values are written.
 * @param {{ preset?: string, algo?: string, start?: string, step?: number }} params
 * @returns {URLSearchParams}
 */
export function serializeUrlState({ preset, algo, start, step } = {}) {
  const sp = new URLSearchParams();
  if (preset)      sp.set('preset', preset);
  if (algo)        sp.set('algo',   algo);
  if (start)       sp.set('start',  start);
  if (step != null) sp.set('step',  String(step));
  return sp;
}
