// src/interfaces.ts
export class Particle {
    x: number;
    y: number;
    v: Vec2;
    size: number | null; // if null, will use system's default
    color: Color;
    age: number = 0; // how many frames its lived for
    ageMs: number= 0; // how many milliseconds its lived for

    get p(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    constructor(x: number, y: number, v: Vec2, color: Color, size: number | null = null) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.color = color;
        this.size = size;

        this.age = 0;
        this.ageMs = 0;
    }

    static fromArgs(args:  {x: number, y: number, v: Vec2, color: Color, size: number | null}) {
        return new Particle(args.x, args.y, args.v, args.color, args.size);
    }

    init(x: number, y: number, v: Vec2, color: Color, size: number | null = null): Particle {
        this.x = x;
        this.y = y;
        this.v = v;
        this.color = color;
        this.size = size;

        this.age = 0;
        this.ageMs = 0;

        return this;
    }
}

export class Vec2 {
    x: number;
    y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }   

    add(other: Vec2) {
        this.x += other.x;
        this.y += other.y;
     }

     scale(s: number) {
        this.x *= s;
        this.y *= s;
     }
}

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
}

export class Color {
    r: number;
    g: number;
    b: number;
    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    static fromHex(hex: string): Color {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return new Color(r, g, b);
    }

    toHexStr(): string {
        const r = this.r.toString(16).padStart(2, '0');
        const g = this.g.toString(16).padStart(2, '0');
        const b = this.b.toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }
}

export interface SystemConfig {
    numParticles: number;
    minSpeed: number;
    maxSpeed: number;
}

export interface ParticleSystem {  //Common interface.
    particles: Particle[]; //All systems have particles
    canvas: HTMLCanvasElement;
    createParticles(): void;
    updateParticle(particle: Particle, deltaT:number): void;
    drawOverlay?(context: CanvasRenderingContext2D): void; //optional

}