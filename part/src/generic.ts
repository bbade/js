import { Particle, SystemConfig, ParticleSystem, Color, Vec2 } from './interfaces';

export class GenericSystem implements ParticleSystem {
    public particles: Particle[] = [];
    public readonly canvas: HTMLCanvasElement;

    constructor(config: SystemConfig, canvas: HTMLCanvasElement, palette: Color[]) {
        this.canvas = canvas;
    }
    initializeParticles(): void {
        throw new Error('Method not implemented.');
    }
    updateParticle(particle: Particle): void {
        throw new Error('Method not implemented.');
    }
    getPalette?(): Color[] | null {
        throw new Error('Method not implemented.');
    }
    drawOverlay?(context: CanvasRenderingContext2D): void {
        throw new Error('Method not implemented.');
    }

}

export interface GenericSystemSpec {
    readonly numParticles: number;
    readonly minSpeed: Vec2; // 0 to 1, represents an abstract scale of speed
    readonly maxSpeed: Vec2; // 0 to 1, represents an abstract scale of speed. X and y are independent
    // initial velocity will be randomly chosen via min and max speed
    readonly palette: Color[]; // colors will be randomly chosen
    spawnRect: {x0: number, y0: number, x1: number, y1: number }; 
    updateVelocity(particle: Particle): void; 
}
