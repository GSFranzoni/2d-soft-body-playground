import type { Particle } from "@/core/particle";
import type { World } from "@/core/world";

type SimulationColors = {
  particles: string;
  spring: string;
};

export const PIXELS_PER_METER = 100;

export type SoftBody = {
  perimeterParticles: readonly Particle[];
};

function getSimulationColors(): SimulationColors {
  const styles = getComputedStyle(document.documentElement);

  return {
    particles: styles.getPropertyValue("--simulation-particle").trim(),
    spring: styles.getPropertyValue("--simulation-spring").trim(),
  };
}

export function renderDebug(context: CanvasRenderingContext2D, world: World): void {
  const colors = getSimulationColors();

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

    context.beginPath();
    context.arc(
      position.x * PIXELS_PER_METER,
      position.y * PIXELS_PER_METER,
      particle.getRadius() * PIXELS_PER_METER,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
}

export function renderSoftBodies(
  context: CanvasRenderingContext2D,
  softBodies: readonly SoftBody[],
): void {
  const colors = getSimulationColors();

  context.fillStyle = colors.particles;

  for (const softBody of softBodies) {
    const perimeter = softBody.perimeterParticles;

    if (perimeter.length < 3) {
      continue;
    }

    const first = perimeter[0].getPosition();
    const last = perimeter[perimeter.length - 1].getPosition();

    context.beginPath();
    context.moveTo(
      (first.x + last.x) * 0.5 * PIXELS_PER_METER,
      (first.y + last.y) * 0.5 * PIXELS_PER_METER,
    );

    for (let index = 0; index < perimeter.length; index++) {
      const current = perimeter[index].getPosition();
      const next = perimeter[(index + 1) % perimeter.length].getPosition();

      context.quadraticCurveTo(
        current.x * PIXELS_PER_METER,
        current.y * PIXELS_PER_METER,
        (current.x + next.x) * 0.5 * PIXELS_PER_METER,
        (current.y + next.y) * 0.5 * PIXELS_PER_METER,
      );
    }

    context.closePath();
    context.fill();
  }
}
