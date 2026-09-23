import { ChevronDown, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";

import { Canvas } from "@/components/canvas";
import { SoftBodyFactory } from "@/core/factory";
import { Vector2 } from "@/core/vector2";
import { World } from "@/core/world";

type BodyType = "blob" | "grid";

const BODY_OPTIONS: { type: BodyType; label: string }[] = [
  { type: "blob", label: "Blob" },
  { type: "grid", label: "Grid" },
];

function createWorld(bodyType: BodyType) {
  const world = new World(8, 6, new Vector2(0, 6));

  const body =
    bodyType === "blob"
      ? SoftBodyFactory.createBlob(world, {
          center: new Vector2(4, 1.5),
          radius: 1,
          count: 12,
          mass: 1,
          particleRadius: 0.02,
          stiffness: 800,
          damping: 4,
        })
      : SoftBodyFactory.createGrid(world, {
          rows: 3,
          cols: 3,
          position: new Vector2(3.2, 0.5),
          spacing: 1,
          mass: 1,
          radius: 0.02,
          stiffness: 1000,
          damping: 2,
        });

  return { world, bodies: [body] };
}

export function App() {
  const [debug, setDebug] = useState(false);

  const [bodyType, setBodyType] = useState<BodyType>("blob");

  const [scene, setScene] = useState(() => createWorld("blob"));

  const bodyPickerRef = useRef<HTMLDivElement>(null);

  const selectBody = (type: BodyType) => {
    setBodyType(type);
    setScene(createWorld(type));
    bodyPickerRef.current?.hidePopover();
  };

  return (
    <main className="bg-background px-edge py-page-padding text-foreground sm:p-page-padding relative grid min-h-svh place-items-center overflow-hidden">
      <div className="bg-ambient opacity-ambient pointer-events-none absolute inset-0" />
      <section className="max-w-layout gap-edge relative flex w-full flex-col items-center">
        <div className="max-w-canvas rounded-frame bg-frame shadow-simulation relative aspect-[4/3] w-full p-px">
          <div className="rounded-frame-inner border-border bg-secondary absolute inset-2 border" />
          <div className="rounded-frame-inner bg-card relative h-full w-full overflow-hidden">
            <Canvas world={scene.world} softBodies={scene.bodies} debug={debug} />
          </div>
          <span className="top-edge left-edge rounded-pill border-border bg-secondary text-label tracking-label text-muted-foreground backdrop-blur-panel absolute inline-flex h-7 items-center border px-3 font-medium uppercase">
            {scene.world.getParticles().length} particles
          </span>
          <div className="top-edge right-edge absolute flex items-center gap-1.5">
            <button
              aria-pressed={debug}
              className="rounded-pill border-border bg-secondary text-label tracking-label text-muted-foreground backdrop-blur-panel hover:text-foreground focus-visible:outline-ring inline-flex h-7 items-center gap-1.5 border px-3 font-medium uppercase focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={() => setDebug((current) => !current)}
              type="button"
            >
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${debug ? "bg-primary" : "bg-muted-foreground/60"}`}
              />
              Debug
            </button>
            <button
              className="rounded-pill border-border bg-secondary text-label tracking-label text-muted-foreground backdrop-blur-panel hover:text-foreground focus-visible:outline-ring inline-flex h-7 items-center gap-1 border px-3 font-medium uppercase [anchor-name:--body-picker-anchor] focus-visible:outline-2 focus-visible:outline-offset-2"
              popoverTarget="body-picker"
              type="button"
            >
              {bodyType}
              <ChevronDown aria-hidden="true" className="size-3" />
            </button>
            <div
              ref={bodyPickerRef}
              id="body-picker"
              popover="auto"
              className="border-border bg-popover text-popover-foreground shadow-popover m-0 mt-2 w-28 rounded-md border p-1 [position-anchor:--body-picker-anchor] [position-area:bottom_span-right]"
            >
              <fieldset>
                <legend className="sr-only">Body type</legend>
                {BODY_OPTIONS.map((option) => (
                  <label
                    className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5"
                    key={option.type}
                  >
                    <input
                      checked={bodyType === option.type}
                      className="accent-primary"
                      name="body-type"
                      onChange={() => selectBody(option.type)}
                      type="radio"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>
            </div>
            <button
              aria-label="Reset simulation"
              className="rounded-pill border-border bg-secondary text-muted-foreground backdrop-blur-panel hover:text-foreground focus-visible:outline-ring inline-grid size-7 place-items-center border focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={() => setScene(createWorld(bodyType))}
              title="Reset simulation"
              type="button"
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
