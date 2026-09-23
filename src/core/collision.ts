import type { Particle } from "@/core/particle";
import { Vector2 } from "@/core/vector2";

export class Collision {
  static check(a: Particle, b: Particle): boolean {
    const distance = a.getPosition().subtract(b.getPosition()).magnitude();

    return distance <= a.getRadius() + b.getRadius();
  }

  /**
   * Resolves a 2D elastic collision between two particles.
   *
   * @see https://www.vobarian.com/collisions/2dcollisions2.pdf
   */
  static resolve(a: Particle, b: Particle): void {
    const positionDifference = b.getPosition().subtract(a.getPosition());

    const distance = positionDifference.magnitude();

    if (distance === 0) {
      return;
    }

    // Collision normal: n = (pB - pA) / |pB - pA|
    const collisionNormal = positionDifference.scale(1 / distance);

    // penetration = rA + rB - |pB - pA|
    const penetration = a.getRadius() + b.getRadius() - distance;

    if (penetration > 0) {
      const totalInverseMass = a.getInverseMass() + b.getInverseMass();

      const correctionA = collisionNormal.scale(
        penetration * (a.getInverseMass() / totalInverseMass),
      );

      const correctionB = collisionNormal.scale(
        penetration * (b.getInverseMass() / totalInverseMass),
      );

      a.setPosition(a.getPosition().subtract(correctionA));
      b.setPosition(b.getPosition().add(correctionB));
    }

    // Relative velocity: vr = vB - vA
    const relativeVelocity = b.getVelocity().subtract(a.getVelocity());

    // Relative velocity projected onto the collision normal: vr · n
    const relativeNormalVelocity = relativeVelocity.dot(collisionNormal);

    const totalMass = a.getMass() + b.getMass();

    // ΔvA = n * [2mB / (mA + mB)] * (vr · n)
    const deltaVelocityA = collisionNormal.scale(
      (2 * b.getMass() * relativeNormalVelocity) / totalMass,
    );

    // ΔvB = n * [-2mA / (mA + mB)] * (vr · n)
    const deltaVelocityB = collisionNormal.scale(
      (-2 * a.getMass() * relativeNormalVelocity) / totalMass,
    );

    // vA' = vA + ΔvA
    a.setVelocity(a.getVelocity().add(deltaVelocityA));

    // vB' = vB + ΔvB
    b.setVelocity(b.getVelocity().add(deltaVelocityB));
  }

  static resolveWorldBounds(particle: Particle, width: number, height: number): void {
    const position = particle.getPosition();

    const velocity = particle.getVelocity();

    const radius = particle.getRadius();

    let x = position.x;
    let y = position.y;

    let vx = velocity.x;
    let vy = velocity.y;

    // Left
    if (x - radius < 0) {
      x = radius;
      vx = -vx;
    }

    // Right
    if (x + radius > width) {
      x = width - radius;
      vx = -vx;
    }

    // Top
    if (y - radius < 0) {
      y = radius;
      vy = -vy;
    }

    // Bottom
    if (y + radius > height) {
      y = height - radius;
      vy = -vy;
    }

    particle.setPosition(new Vector2(x, y));
    particle.setVelocity(new Vector2(vx, vy));
  }
}
