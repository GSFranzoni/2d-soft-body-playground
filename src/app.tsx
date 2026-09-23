import { useState } from "react";

import { Canvas } from "@/components/canvas";
import { Particle } from "@/core/particle";
import { Spring } from "@/core/spring";
import { Vector2 } from "@/core/vector2";
import { World } from "@/core/world";

export function App() {
  const [world] = useState(() => {
    const world = new World(8, 6);

    const a = new Particle(new Vector2(3, 1), 1, 0.15);

    const b = new Particle(new Vector2(5, 2), 1, 0.15);

    world.addParticle(a);
    world.addParticle(b);

    world.addSpring(new Spring(a, b, 1, 10, 1));

    return world;
  });

  return (
    <main className="bg-background px-edge py-page-padding text-foreground sm:p-page-padding relative grid min-h-svh place-items-center overflow-hidden">
      <div className="bg-ambient opacity-ambient pointer-events-none absolute inset-0" />
      <section className="max-w-layout gap-edge relative flex w-full flex-col items-center">
        <div className="max-w-canvas rounded-frame bg-frame shadow-simulation relative aspect-square w-full p-px">
          <div className="rounded-frame-inner border-border bg-secondary absolute inset-2 border" />
          <div className="rounded-frame-inner bg-card relative h-full w-full overflow-hidden">
            <Canvas world={world} />
          </div>
          <span className="top-edge left-edge rounded-pill border-border bg-secondary text-label tracking-label text-muted-foreground backdrop-blur-panel absolute border px-3 py-1 font-medium uppercase">
            {world.getParticles().length} particles
          </span>
        </div>
        <p className="text-caption text-muted-foreground text-center">Lorem Ipsum.</p>
      </section>
    </main>
  );
}
