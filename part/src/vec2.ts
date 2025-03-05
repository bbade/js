export class Vec2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    equals(other: Vec2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    toString(): string {
        return `Vec2(${this.x}, ${this.y})`;
    }

    hash(): string {
        return `x=${this.x},y=${this.y}`;
    }

    add(other: Vec2): Vec2 {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    scale(s: number): Vec2 {
        this.x *= s;
        this.y *= s;
        return this;
    }

    mult(other: Vec2): Vec2 {
        return new Vec2(this.x * other.x, this.y * other.y);
    }

    // copies, does not mutate
    pointAt(other: Vec2): Vec2 {
        return new Vec2(other.x - this.x, other.y - this.y);
    }

    normalize(): Vec2 {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length > 0) {
            this.x /= length;
            this.y /= length;
        }
        return this;
    }

}
export function sub(v1: Vec2, v2: Vec2): Vec2 {
  return new Vec2(v1.x - v2.x, v1.y - v2.y);
}

export function scale(v: Vec2, s: number): Vec2 {
  return new Vec2(v.x * s, v.y * s);
}

export function add(v1: Vec2, v2: Vec2): Vec2 {
  return new Vec2(v1.x + v2.x, v1.y + v2.y);
}

export function mult(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x * v2.x, v1.y * v2.y);
}

