import { useRef } from "react";

import { PIXELS_PER_METER, renderDebug, renderSoftBodies, type SoftBody } from "@/core/renderer";
import { World } from "@/core/world";
import { useAnimationFrame } from "@/hooks/use-animation-frame";

type Props = {
  world: World;
  softBodies: readonly SoftBody[];
  debug: boolean;
};

export function Canvas({ world, softBodies, debug }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const width = world.getWidth() * PIXELS_PER_METER;

  const height = world.getHeight() * PIXELS_PER_METER;

  useAnimationFrame((dt) => {
    world.update(dt);

    const canvas = canvasRef.current;

    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, width, height);

    if (debug) {
      renderDebug(context, world);
      return;
    }

    renderSoftBodies(context, softBodies);
  });

  return <canvas ref={canvasRef} className="block h-auto w-full" width={width} height={height} />;
}
