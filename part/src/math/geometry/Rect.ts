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
          r1.x1 < r2.x || // r1 is left of r2
          r1.x > r2.x1 || // r1 is right of r2
          r1.y > r2.y1 || // r1 is above r2
          r1.y1 <  r2.y;   // r1 is below r2

        // console.log("Rect 1:", r1.toString());
        // console.log("Rect 2:", r2.toString());
        // console.log("r1.x1 < r2.x:", r1.x1 < r2.x);
        // console.log("r1.x > r2.x1:", r1.x > r2.x1);
        // console.log("r1.y > r2.y1:", r1.y > r2.y1);
        // console.log("r1.y1 < r2.y:", r1.y1 < r2.y);
      
        // If none of the non-overlap conditions are true, then they must intersect.
        return !noOverlap;
      }

      intersects(that: Rect): boolean {
        return Rect.intersects(this, that);
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

    toJSON() {
        return { x: this.x, y: this.y, w: this.w, h: this.h };
     }
}
