import { Particle } from "./Particle";

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


    constructor(r: number =0, g: number = 0, b: number =0) {
        this.r = Math.floor(r);
        this.g = Math.floor(g);
        this.b = Math.floor(b);
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
    bounds: Rect; // normalize bounds
    initialize(): void;
    updateParticle_deprecated(particle: Particle, deltaT:number): void;
    processFrame(deltaT: number): void; // todo, use this to update the system for each frame? 
    drawOverlay?(context: CanvasRenderingContext2D): void; //optional

}
export interface ParticleConfigure {
    initializeParticle(recyled: Particle | null): Particle;
    setInitialPosition(particle: Particle): void;
    setInitialVelocity(particle: Particle): void;
    setInitialColor(particle: Particle): void;
}
