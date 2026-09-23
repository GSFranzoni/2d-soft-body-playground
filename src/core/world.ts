import { Collision } from "@/core/collision";
import type { Particle } from "@/core/particle";
import type { Spring } from "@/core/spring";
import { Vector2 } from "@/core/vector2";

export class World {
  private readonly particles: Particle[] = [];

  private readonly springs: Spring[] = [];

  constructor(
    private width: number,
    private height: number,
    private gravity = new Vector2(0, 9.81),
  ) {}

  addParticle(particle: Particle) {
    this.particles.push(particle);
  }

  addSpring(spring: Spring) {
    this.springs.push(spring);
  }

  update(dt: number) {
    for (const particle of this.particles) {
      particle.applyForce(this.gravity.scale(particle.getMass()));
    }

    for (const particle of this.particles) {
      particle.update(dt);
      Collision.resolveWorldBounds(particle, this.width, this.height);
    }

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        if (Collision.check(a, b)) {
          Collision.resolve(a, b);
        }
      }
    }
  }

  getParticles() {
    return this.particles;
  }

  getSprings() {
    return this.springs;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getGravity(): Vector2 {
    return this.gravity;
  }

  setGravity(gravity: Vector2): void {
    this.gravity = gravity;
  }
}
