import { Particle } from "@/core/particle";
import type { SoftBody } from "@/core/renderer";
import { Spring } from "@/core/spring";
import { Vector2 } from "@/core/vector2";
import type { World } from "@/core/world";

type GridOptions = {
  rows: number;
  cols: number;
  position: Vector2;
  spacing: number;
  mass: number;
  radius: number;
  stiffness: number;
  damping: number;
};

type BlobOptions = {
  center: Vector2;
  radius: number;
  count: number;
  mass: number;
  particleRadius: number;
  stiffness: number;
  damping: number;
};

export class SoftBodyFactory {
  static createGrid(world: World, options: GridOptions): SoftBody {
    const { rows, cols, position, spacing, mass, radius, stiffness, damping } = options;

    const particles: Particle[][] = [];

    // Particles
    for (let row = 0; row < rows; row++) {
      const line: Particle[] = [];

      for (let col = 0; col < cols; col++) {
        const particle = new Particle(
          new Vector2(position.x + col * spacing, position.y + row * spacing),
          mass,
          radius,
        );

        line.push(particle);
        world.addParticle(particle);
      }

      particles.push(line);
    }

    // Springs
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const particle = particles[row][col];

        // Structural — horizontal
        if (col < cols - 1) {
          world.addSpring(
            new Spring(particle, particles[row][col + 1], spacing, stiffness, damping),
          );
        }

        // Structural — vertical
        if (row < rows - 1) {
          world.addSpring(
            new Spring(particle, particles[row + 1][col], spacing, stiffness, damping),
          );
        }

        // Shear
        if (row < rows - 1 && col < cols - 1) {
          const diagonalLength = spacing * Math.SQRT2;

          world.addSpring(
            new Spring(particle, particles[row + 1][col + 1], diagonalLength, stiffness, damping),
          );

          world.addSpring(
            new Spring(
              particles[row][col + 1],
              particles[row + 1][col],
              diagonalLength,
              stiffness,
              damping,
            ),
          );
        }
      }
    }

    return { perimeterParticles: getGridPerimeter(particles) };
  }

  static createBlob(world: World, options: BlobOptions): SoftBody {
    const { center, radius, count, mass, particleRadius, stiffness, damping } = options;

    const particles: Particle[] = [];

    // Perimeter particles
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;

      const particle = new Particle(
        new Vector2(center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius),
        mass,
        particleRadius,
      );

      particles.push(particle);
      world.addParticle(particle);
    }

    // Center particle
    const centerParticle = new Particle(center, mass, particleRadius);

    world.addParticle(centerParticle);

    // Perimeter springs
    const perimeterRestLength = 2 * radius * Math.sin(Math.PI / count);

    for (let i = 0; i < count; i++) {
      const a = particles[i];
      const b = particles[(i + 1) % count];

      world.addSpring(new Spring(a, b, perimeterRestLength, stiffness, damping));
    }

    // Radial springs
    for (const particle of particles) {
      world.addSpring(new Spring(centerParticle, particle, radius, stiffness, damping));
    }

    return { perimeterParticles: particles };
  }
}

function getGridPerimeter(particles: Particle[][]): Particle[] {
  const rows = particles.length;
  const cols = particles[0]?.length ?? 0;

  if (rows === 0 || cols === 0) {
    return [];
  }

  if (rows === 1) {
    return [...particles[0]];
  }

  if (cols === 1) {
    return particles.map(([particle]) => particle);
  }

  return [
    ...particles[0],
    ...particles.slice(1).map((row) => row[cols - 1]),
    ...particles[rows - 1].slice(0, -1).reverse(),
    ...particles
      .slice(1, -1)
      .map((row) => row[0])
      .reverse(),
  ];
}
