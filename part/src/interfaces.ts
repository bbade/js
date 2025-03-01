// src/interfaces.ts
export interface Particle {
    x: number;
    y: number;
    v: Vec2;
    color: Color;
    age: number; // how many frames its lived for
}

export class Vec2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
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
    initializeParticles(): void;
    updateParticle(particle: Particle): void;
    getPalette?(): Color[] | null;  // Optional:  Might return a palette, might not
    drawOverlay?(context: CanvasRenderingContext2D): void; //optional

}