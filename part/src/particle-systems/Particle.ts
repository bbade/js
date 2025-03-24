import { Color } from "../Color";
import { Config } from "./particle-system-main";
import { applyAccelleration, applyMovement } from "../math/physics";
import { Vec2 } from "../math/vec2";

export class Particle {
    p: Vec2;
    v: Vec2;
    m: number =1; // mass, used for verlet integration / physics
    a: Vec2; // used for verlet integration
    draw_size_px: number; // if null, will use system's default. This size used only for drawing
    r: number = .01; // radius in world-space. Used for collisons. 
    color: Color;
    age: number = 0; // how many frames its lived for
    ageMs: number = 0; // how many milliseconds its lived for

    debugForces:{f: Vec2, c: Color}[] = [];

    set x(x: number) {
        this.p.x = x;
    }

    get x(): number {
        return this.p.x;
    }

    set y(y: number) {
        this.p.y = y;
    }

    get y(): number {
        return this.p.y;
    }

    // todo, need to be able to project particle size into the normalized coordinates 

    constructor(x: number, y: number, v: Vec2, color: Color, size: number = Config.particleSize, m: number = 1) {
        this.p = new Vec2(x, y);
        this.v = v;
        this.m = m;
        this.a = new Vec2();
        this.color = color;
        this.draw_size_px = size;

        this.age = 0;
        this.ageMs = 0;
    }

    static fromArgs(args: { x: number; y: number; v: Vec2; color: Color; size: number; m: number; }): Particle {
        const p =  new Particle(args.x, args.y, args.v, args.color, args.size, args.m);

        return p
    }

    static create(p: Vec2 = new Vec2(), v: Vec2 = new Vec2(), color: Color = new Color()) {
        return new Particle(p.x, p.y, v, color);
    }

    init(x: number, y: number, v: Vec2, color: Color, size: number = Config.particleSize, m: number = 1,): Particle {
        this.x = x;
        this.y = y;
        this.v = v;
        this.m = m;
        this.a = new Vec2();
        this.color = color;
        this.draw_size_px = size;

        this.age = 0;
        this.ageMs = 0;

        return this;
    }

    incAge_deprecated(deltaT: number) {
        this.ageMs += deltaT;
        this.age += 1;
    }

    moveAndUpdateAge(deltaT: number) {
        applyMovement(this.p, this.v, deltaT);
        this.ageMs += deltaT;
        this.age += 1;
    }

    applyForce(f: Vec2, deltaMs: number) {
        applyAccelleration(this.v, f, deltaMs)
    }

    normalizedSize(projection: Vec2): number {
        return this.draw_size_px * projection.x;
    }

    static normalizedSize(s: number, projection: Vec2): number {
        return s * projection.x;
    }
}


