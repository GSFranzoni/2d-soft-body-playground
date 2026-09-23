import { useRef } from "react";

import type { Particle } from "@/core/particle";
import { World } from "@/core/world";
import { useAnimationFrame } from "@/hooks/use-animation-frame";

const PIXELS_PER_METER = 100;

type Props = {
  world: World;
};

export function Canvas({ world }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = useRef(new Map<Particle, string>());

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

    for (const particle of world.getParticles()) {
      const position = particle.getPosition();

      context.beginPath();

      const x = position.x * PIXELS_PER_METER;
      const y = position.y * PIXELS_PER_METER;
      const radius = particle.getRadius() * PIXELS_PER_METER;

      context.arc(x, y, radius, 0, Math.PI * 2);

      context.fill();
    }
  });

  return <canvas ref={canvasRef} width={width} height={height} />;
}
