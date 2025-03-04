import { Color } from "./interfaces";
import { Config } from "./main";
import { Vec2 } from "./vec2";

// src/interfaces.ts

export class Particle {
    x: number;
    y: number;
    v: Vec2;
    size: number; // if null, will use system's default
    color: Color;
    age: number = 0; // how many frames its lived for
    ageMs: number = 0; // how many milliseconds its lived for

    get p(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    set p({ x, y }: Vec2) {
        this.x = x;
        this.y = y;
    }

    constructor(x: number, y: number, v: Vec2, color: Color, size: number = Config.particleSize) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.color = color;
        this.size = size;

        this.age = 0;
        this.ageMs = 0;
    }

    static fromArgs(args: { x: number; y: number; v: Vec2; color: Color; size: number; }) {
        return new Particle(args.x, args.y, args.v, args.color, args.size);
    }

    static create() {
        return new Particle(0, 0, new Vec2(0, 0), new Color());
    }

    init(x: number, y: number, v: Vec2, color: Color, size: number = Config.particleSize): Particle {
        this.x = x;
        this.y = y;
        this.v = v;
        this.color = color;
        this.size = size;

        this.age = 0;
        this.ageMs = 0;

        return this;
    }

    incAge(deltaT: number) {
        this.ageMs += deltaT;
        this.age += 1;
    }
}
