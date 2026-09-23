import { useRef } from "react";

import { World } from "@/core/world";
import { useAnimationFrame } from "@/hooks/use-animation-frame";

const PIXELS_PER_METER = 100;

type Props = {
  world: World;
};

const styles = getComputedStyle(document.documentElement);

export function Canvas({ world }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const width = world.getWidth() * PIXELS_PER_METER;

  const height = world.getHeight() * PIXELS_PER_METER;

  const colors = {
    particles: styles.getPropertyValue("--simulation-particle").trim(),
    spring: styles.getPropertyValue("--simulation-spring").trim(),
  };

  useAnimationFrame((dt) => {
    world.update(dt);

    const canvas = canvasRef.current;

    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, width, height);
    context.strokeStyle = colors.spring;
    context.lineWidth = 2;

    for (const spring of world.getSprings()) {
      const a = spring.getA().getPosition();
      const b = spring.getB().getPosition();

      context.beginPath();

      context.moveTo(a.x * PIXELS_PER_METER, a.y * PIXELS_PER_METER);
      context.lineTo(b.x * PIXELS_PER_METER, b.y * PIXELS_PER_METER);

      context.stroke();
    }

    context.fillStyle = colors.particles;
    for (const particle of world.getParticles()) {
      const position = particle.getPosition();

      const x = position.x * PIXELS_PER_METER;
      const y = position.y * PIXELS_PER_METER;
      const radius = particle.getRadius() * PIXELS_PER_METER;

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  });

  return <canvas ref={canvasRef} width={width} height={height} />;
}
