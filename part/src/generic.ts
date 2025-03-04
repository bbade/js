import { SystemConfig, ParticleSystem, Color, Rect } from './interfaces';
import { Particle } from "./Particle";
import { Vec2 } from "./vec2";
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
    updateParticle(particle: Particle, deltaT: number, bounds: Rect): void;
}

const speedConstant = 0.13;

export class GenericSystem implements ParticleSystem {
    public particles: Particle[] = [];
    public readonly bounds: Rect;
    private spec: GenericSystemSpec;

    constructor(spec: GenericSystemSpec, bounds: Rect) {
        this.bounds = bounds;
        this.spec = spec;
    }

    initialize(): void {
        for (let i = 0; i < this.spec.numParticles; i++) {
            this.particles.push(this.initializeParticle());
        }
    }

    updateParticle(particle: Particle, deltaT: number): void {
        this.spec.updateParticle(particle, deltaT, this.bounds);

        particle.incAge(deltaT);

        if (isOutOfBounds(particle.p, this.bounds)) {
            this.initializeParticle(particle);
        }
    }

    private initializeParticle(recycle: Particle | null = null): Particle {
        const { x, y } = this.startingPoint();
        const v = this.initialVelocity();
        const c = this.randomPaletteColor();
        const size = randomRange(this.spec.minPSizePx, this.spec.maxPSizePx);

        if (recycle) {
            return recycle.init(x, y, v, c, size);
        } else {
            return new Particle(x, y, v, c, size);
        }
    }

    private initialVelocity(): Vec2 {
        const x = speedConstant * randomRange(this.spec.minSpeed.x, this.spec.maxSpeed.x);
        const y = speedConstant * randomRange(this.spec.minSpeed.y, this.spec.maxSpeed.y);

        return new Vec2(x, y);
    }

    private startingPoint(): Vec2 {
        return randomPoint(this.spec.spawnRectNorm, this.bounds.w, this.bounds.h);
    }

    private randomPaletteColor(): Color {
        return this.spec.palette[Math.floor(Math.random() * this.spec.palette.length)];
    }
}

// todo: write me

// ideas: angry bees, shartacle system, plants (by not clearing the canvas), clouds (color varies by height),
// snowflakes (accmulation), fireworks, etc