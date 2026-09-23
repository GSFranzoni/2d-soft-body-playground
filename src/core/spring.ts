import type { Particle } from "@/core/particle";

export class Spring {
  constructor(
    private readonly a: Particle,
    private readonly b: Particle,
    private readonly restLength: number,
    private readonly stiffness: number,
    private readonly damping: number,
  ) {}

  applyForce(): void {
    const difference = this.b.getPosition().subtract(this.a.getPosition());

    const length = difference.magnitude();

    if (length === 0) {
      return;
    }

    const direction = difference.scale(1 / length);

    const displacement = length - this.restLength;

    const relativeVelocity = this.b.getVelocity().subtract(this.a.getVelocity());

    const relativeSpeed = relativeVelocity.dot(direction);

    const forceMagnitude = this.stiffness * displacement + this.damping * relativeSpeed;

    const force = direction.scale(forceMagnitude);

    this.a.applyForce(force);
    this.b.applyForce(force.scale(-1));
  }

  getA() {
    return this.a;
  }

  getB() {
    return this.b;
  }

  getStiffness() {
    return this.stiffness;
  }

  getRestLength() {
    return this.restLength;
  }
}
