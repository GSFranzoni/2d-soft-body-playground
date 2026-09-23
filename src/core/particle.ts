import { Vector2 } from "@/core/vector2";

export class Particle {
  private velocity: Vector2 = Vector2.zero();

  private force: Vector2 = Vector2.zero();

  constructor(
    private position: Vector2,
    private readonly mass: number,
    private readonly radius: number,
    private readonly fixed: boolean = false,
  ) {}

  applyForce(force: Vector2) {
    this.force = this.force.add(force);
  }

  update(dt: number) {
    if (this.fixed) {
      this.force = new Vector2(0, 0);
      return;
    }

    const acceleration = this.force.scale(1 / this.mass);

    this.velocity = this.velocity.add(acceleration.scale(dt));

    this.position = this.position.add(this.velocity.scale(dt));

    this.force = new Vector2(0, 0);
  }

  applyImpulse(impulse: Vector2): void {
    if (this.fixed) {
      return;
    }

    this.velocity = this.velocity.add(impulse.scale(1 / this.mass));
  }

  setVelocity(velocity: Vector2) {
    this.velocity = velocity;
  }

  setPosition(position: Vector2) {
    this.position = position;
  }

  getMass() {
    return this.mass;
  }

  getInverseMass() {
    return 1 / this.getMass();
  }

  getPosition() {
    return this.position;
  }

  getForce() {
    return this.force;
  }

  getVelocity() {
    return this.velocity;
  }

  getRadius() {
    return this.radius;
  }
}
