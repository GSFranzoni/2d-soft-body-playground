import { useEffect, useRef } from "react";

const MAX_DELTA_TIME = 1 / 30;

export function useAnimationFrame(callback: (deltaTime: number, time: number) => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let frameId: number;

    let previousTime: number | undefined;

    const frame = (time: number) => {
      if (previousTime !== undefined) {
        const deltaTime = Math.min((time - previousTime) / 1000, MAX_DELTA_TIME);

        callbackRef.current(deltaTime, time);
      }

      previousTime = time;

      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);
}
