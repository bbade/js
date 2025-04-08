import { randomRange } from "../math";
import { Vec2 } from "../vec2";


/**
 * A rectangle that is axis-aligned.
 */
export class Rect {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    static Square(x: number, y: number, size: number): Rect {
        return new Rect(x, y, size, size);
    }

    static fromV2(p0: Vec2, p1: Vec2): Rect {
        return new Rect(p0.x, p0.y, p1.x - p0.x, p1.y - p0.y);
    }

    static intersects(r1: Rect, r2: Rect): boolean {
        // Check for non-intersection conditions.
        // They DON'T intersect if:
        // - r1 is entirely to the left of r2 OR
        // - r1 is entirely to the right of r2 OR
        // - r1 is entirely above r2 OR
        // - r1 is entirely below r2
        const noOverlap =
          r1.x + r1.w <= r2.x || // r1 is left of r2
          r1.x >= r2.x + r2.w || // r1 is right of r2
          r1.y + r1.h <= r2.y || // r1 is above r2
          r1.y >= r2.y + r2.h;   // r1 is below r2
      
        // If none of the non-overlap conditions are true, then they must intersect.
        return !noOverlap;
      }

    get x1(): number {
        return this.x + this.w;
    }

    get y1(): number {
        return this.y + this.h;
    }

    get x1y1(): Vec2 {
        return new Vec2(this.x1, this.y1);
    }

    get p(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    get center(): Vec2 {
        return new Vec2(this.x + this.w / 2, this.y + this.h / 2);
    }

    randomPoint(): Vec2 {
        const x = randomRange(this.x, this.x1);
        const y = randomRange(this.y, this.y1);
        return new Vec2(x, y);
    }

    contains(p: Vec2): boolean {
        return p.x >= this.x && p.x <= this.x1 && p.y >= this.y && p.y <= this.y1;
    }

    toString(): string {
        return `Rect(x: ${this.x}, y: ${this.y}, w: ${this.w}, h: ${this.h})`;
    }
}


// TODO: unused, just an idea.
// do we need this, or do we just apply transforms to rect? 
class PointRect{
    constructor(
        public p0: Vec2,
        public p1: Vec2,
        public dx: number,
        public dy: number,
    )  {}
}
