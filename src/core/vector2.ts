export class Vector2 {
  constructor(
    public x: number,
    public y: number,
  ) {}

  static zero() {
    return new Vector2(0, 0);
  }

  add(other: Vector2) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  scale(scalar: number) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  magnitude(): number {
    return Math.hypot(this.x, this.y);
  }

  normalize() {
    const magnitude = this.magnitude();

    return this.scale(1 / magnitude);
  }
}
