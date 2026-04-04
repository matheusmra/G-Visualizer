/**
 * usePlayback — manages automatic step-by-step playback via setInterval.
 *
 * The caller keeps the tick function up-to-date by passing it to setTickFn
 * whenever its dependencies change (avoids stale closures in the interval).
 *
 * @param {number} [initialSpeed=700] — interval delay in ms
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_SPEED = 700;

export function usePlayback(initialSpeed = DEFAULT_SPEED) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed,     setSpeed]     = useState(initialSpeed);
  const timerRef   = useRef(null);
  const tickRef    = useRef(null); // always holds the latest tick callback

  /** Update the function called on every interval tick. */
  const setTickFn = useCallback((fn) => { tickRef.current = fn; }, []);

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(timerRef.current);
      return;
    }
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => tickRef.current?.(), speed);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed]);

  const play = useCallback(() => setIsPlaying(true), []);

  const pause = useCallback(() => {
    clearInterval(timerRef.current);
    setIsPlaying(false);
  }, []);

  return { isPlaying, setIsPlaying, play, pause, speed, setSpeed, setTickFn };
}
