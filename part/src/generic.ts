import { SystemConfig, ParticleSystem, Rect } from './interfaces';
import { Color } from "./Color";
import { Particle } from "./Particle";
import { scale, Vec2 } from "./vec2";
import { isOutOfBounds, randomPoint, randomRange } from './math';
import { PointForce } from './physics';

export interface GenericSystemSpec {
    readonly numParticles: number;
    readonly minSpeed: Vec2; // 0 to 1, represents an abstract scale of speed
    readonly maxSpeed: Vec2; // 0 to 1, represents an abstract scale of speed. X and y are independent
    // initial velocity will be randomly chosen via min and max speed
    readonly palette: Color[]; // colors will be randomly chosen
    readonly minPSizePx: number;
    readonly maxPSizePx: number;
    readonly forces: Vec2[]; // ambient forces that are applied to all particles each frame
    readonly pointForces?: PointForce[];
    // readonly pointForces: 
    spawnRectNorm: Rect; // every coordinate is 0 to 1, which is scaled against the viewport
    updateParticle(particle: Particle, deltaT: number, bounds: Rect): void;
}

const speedConstant = .5;

export class BallsGenericSystem implements ParticleSystem {
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

    private updateParticle(particle: Particle, deltaT: number): void {
        this.spec.updateParticle(particle, deltaT, this.bounds);

        if (isOutOfBounds(particle.p, this.bounds)) {
            this.initializeParticle(particle);
        }
    }

    protected applyGlobalForces(particle: Particle, deltaT: number) {
        for (const force of this.spec.forces) {
            const f = scale(force, deltaT / 1000);
            particle.v.add(f);
        }

        if (this.spec.pointForces) {
            for (const pforce of this.spec.pointForces) {
                const vec = particle.p.pointAt(pforce.p);
                vec.scale(pforce.magnitude);
                // apply
                particle.v.add(vec);
            }
        }
    }

    processFrame(deltaT: number): void {
        for (const particle of this.particles) {
            this.applyGlobalForces(particle, deltaT);
            this.updateParticle(particle, deltaT);
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
        // return randomPoint(this.spec.spawnRectNorm, this.bounds.w, this.bounds.h);
        const vpW = this.bounds.w;
        const vpH = this.bounds.h;

        const minX = this.spec.spawnRectNorm.x * vpW;
        const maxX = this.spec.spawnRectNorm.x1 * vpW;
        const minY = this.spec.spawnRectNorm.y * vpH;
        const maxY = this.spec.spawnRectNorm.y1 * vpH;

        const x = randomRange(minX, maxX);
        const y = randomRange(minY, maxY);

        return new Vec2(x, y);  
    }

    private randomPaletteColor(): Color {
        return this.spec.palette[Math.floor(Math.random() * this.spec.palette.length)];
    }
}

// todo: write me

// ideas: angry bees, shartacle system, plants (by not clearing the canvas), clouds (color varies by height),
// snowflakes (accmulation), fireworks, etc