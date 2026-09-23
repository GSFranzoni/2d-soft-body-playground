import { useState } from "react";

import { Canvas } from "@/components/canvas";
import { SoftBodyFactory } from "@/core/factory";
import { Vector2 } from "@/core/vector2";
import { World } from "@/core/world";

export function App() {
  const [debug, setDebug] = useState(false);

  const [scene] = useState(() => {
    const world = new World(8, 6, new Vector2(0, 10));

    const body = SoftBodyFactory.createBlob(world, {
      center: new Vector2(4, 1.5),
      radius: 1.5,
      count: 12,
      mass: 1,
      particleRadius: 0.01,
      stiffness: 300,
      damping: 10,
    });

    return { world, bodies: [body] };
  });

  return (
    <main className="bg-background px-edge py-page-padding text-foreground sm:p-page-padding relative grid min-h-svh place-items-center overflow-hidden">
      <div className="bg-ambient opacity-ambient pointer-events-none absolute inset-0" />
      <section className="max-w-layout gap-edge relative flex w-full flex-col items-center">
        <div className="max-w-canvas rounded-frame bg-frame shadow-simulation relative aspect-[4/3] w-full p-px">
          <div className="rounded-frame-inner border-border bg-secondary absolute inset-2 border" />
          <div className="rounded-frame-inner bg-card relative h-full w-full overflow-hidden">
            <Canvas world={scene.world} softBodies={scene.bodies} debug={debug} />
          </div>
          <span className="top-edge left-edge rounded-pill border-border bg-secondary text-label tracking-label text-muted-foreground backdrop-blur-panel absolute border px-3 py-1 font-medium uppercase">
            {scene.world.getParticles().length} particles
          </span>
          <fieldset className="top-edge right-edge rounded-pill border-border bg-secondary text-label tracking-label text-muted-foreground backdrop-blur-panel absolute border px-3 py-1 font-medium uppercase">
            <legend className="sr-only">Visualization mode</legend>
            <label
              className="hover:text-foreground inline-flex cursor-pointer items-center gap-1.5"
              onClick={(event) => {
                if (debug) {
                  event.preventDefault();
                  setDebug(false);
                }
              }}
            >
              <input
                checked={debug}
                className="peer sr-only"
                name="visualization-mode"
                onChange={() => setDebug(true)}
                type="radio"
              />
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${debug ? "bg-primary" : "bg-muted-foreground/60"}`}
              />
              <span className="peer-focus-visible:outline-ring peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                Debug
              </span>
            </label>
            <input
              aria-label="Disable debug visualization"
              checked={!debug}
              className="sr-only"
              name="visualization-mode"
              onChange={() => setDebug(false)}
              tabIndex={-1}
              type="radio"
            />
          </fieldset>
        </div>
      </section>
    </main>
  );
}
