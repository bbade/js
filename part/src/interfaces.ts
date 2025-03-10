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

export interface SystemConfig {
    numParticles: number;
    minSpeed: number;
    maxSpeed: number;
}

export interface ParticleSystem {  //Common interface.
    particles: Particle[]; //All systems have particles
    bounds: Rect; // normalize bounds
    initialize(): void;
    processFrame(deltaT: number): void; // todo, use this to update the system for each frame? 
    drawOverlay?(context: CanvasRenderingContext2D): void; //optional

}
export interface ParticleConfigure {
    initializeParticle(recyled: Particle | null): Particle;
    setInitialPosition(particle: Particle): void;
    setInitialVelocity(particle: Particle): void;
    setInitialColor(particle: Particle): void;
}
