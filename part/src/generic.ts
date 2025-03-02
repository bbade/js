import { Particle, SystemConfig, ParticleSystem, Color, Vec2, Rect } from './interfaces';
import { isOutOfBounds, randomPoint, randomRange } from './math';


export interface GenericSystemSpec {
    readonly numParticles: number;
    readonly minSpeed: Vec2; // 0 to 1, represents an abstract scale of speed
    readonly maxSpeed: Vec2; // 0 to 1, represents an abstract scale of speed. X and y are independent
    // initial velocity will be randomly chosen via min and max speed
    readonly palette: Color[]; // colors will be randomly chosen
    readonly minPSizePx: number;
    readonly maxPSizePx: number;
    spawnRectNorm: Rect; // every coordinate is 0 to 1, which is scaled against the viewport
    updateParticle(particle: Particle, deltaT: number, canvasBounds: Rect): void;
}

const speedConstant = 0.13;

export class GenericSystem implements ParticleSystem {
    public particles: Particle[] = [];
    public readonly canvas: HTMLCanvasElement;
    private spec: GenericSystemSpec;
    private canvasBoundsPx: Rect;

    constructor(spec: GenericSystemSpec, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.spec = spec;

        
        this.canvasBoundsPx = new Rect(0, 0, canvas.width, canvas.height);
    }

    createParticles(): void {
        for (let i = 0; i < this.spec.numParticles; i++) {
            this.particles.push(this.initializeParticle());
        }
    }

    updateParticle(particle: Particle, deltaT: number): void {
            this.spec.updateParticle(particle, deltaT, this.canvasBoundsPx);

        
        particle.ageMs += deltaT;
        particle.age+=1; 

        if (isOutOfBounds(particle.p, this.canvas)) {
            this.initializeParticle(particle);
        }

    }

    private initializeParticle(recycle: Particle | null = null): Particle {
        const { x, y } = this.startingPoint();
        const v = this.initialVelocity();
        const c = this.randomPaletteColor();
        const size = randomRange(this.spec.minPSizePx, this.spec.maxPSizePx);
        const ages = 0;

        if (recycle) {
            return recycle.init(x, y, v, c, size);

        } else {
            return new Particle(
                x,
                y,
                v,
                c,
                size,
            );
        } // end-else

    } //end-initializeParticle

    private initialVelocity(): Vec2 {
        const x = speedConstant * randomRange(this.spec.minSpeed.x, this.spec.maxSpeed.x);
        const y = speedConstant * randomRange(this.spec.minSpeed.y, this.spec.maxSpeed.y);

        return new Vec2(x, y);
    }

    private startingPoint(): Vec2 {
        const canvas = this.canvas;
        return randomPoint(this.spec.spawnRectNorm, canvas.width, canvas.height);
    }

    private randomPaletteColor(): Color {
        return this.spec.palette[Math.floor(Math.random() * this.spec.palette.length)];
    }
}


// todo: write me



// ideas: angry bees, shartacle system, plants (by not clearing the canvas), clouds (color varies by height),
// snowflakes (accmulation), fireworks, etc 