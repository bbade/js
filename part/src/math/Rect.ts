import { randomRange } from "./math";
import { Vec2 } from "./vec2";


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

    get x1(): number {
        return this.x + this.w;
    }

    get y1(): number {
        return this.y + this.h;
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
