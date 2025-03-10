import { ParticleConfigure, ParticleSystem, Rect } from '../interfaces'
import { Color } from "../Color";
import { Config, Mouse } from '../main';
import { isOutOfBounds } from '../math';
import { Particle } from "../Particle";
import { add, scale, Vec2 } from "../vec2";

const spec = {
   numParticles: 19,
    maxAgeMs: 39 * 1000,
    G : 1,
    mouseAccel: 3,
};

export class GravSystem implements ParticleSystem, ParticleConfigure {

    particles: Particle[] = [];

    bounds: Rect; // normalized 0,0, w, h where W and H are <= 1

    readonly gravity: Vec2 = new Vec2(0, spec.G); // 100 px/sec down, with positive being down

    projection: Vec2;
    psize: number;

    mouseForce: Vec2 | null = null;


    constructor(bounds: Rect, projection: Vec2) {
        this.bounds = bounds;
        this.projection = projection;
        this.psize = Particle.normalizedSize(Config.particleSize , projection);
    }


    initialize(): void {
        for (let i = 0; i < spec.numParticles; i++) {
            this.particles.push(this.initializeParticle(null));
        }
    }

    initializeParticle(recycled: Particle | null): Particle {
        const particle = recycled ? recycled : Particle.create();

        this.setInitialPosition(particle);
        this.setInitialVelocity(particle);
        this.setInitialColor(particle);
        particle.age = 0;
        particle.ageMs = 0;

        return particle;
    }
    setInitialColor(particle: Particle) {
        particle.color = new Color(0, 255, 0);
    }

    processFrame(deltaT: number): void {
        for (const particle of this.particles) {
            this.updateParticle(particle, deltaT);
        }
    }

    private updateParticle(particle: Particle, deltaT: number): void {
        particle.applyForce(this.gravity, deltaT);

        const lifeLeft = 1 - particle.ageMs / spec.maxAgeMs;
        particle.color.g= Math.max(100, Math.floor(255*lifeLeft));

        if(particle.color.g <= 30 || isOutOfBounds(particle.p, this.bounds) || particle.ageMs > spec.maxAgeMs ) {
            this.initializeParticle(particle);
            return;
        }

        const pos = particle.p;

        if (pos.y > this.bounds.h - this.psize && particle.v.y > 0) {
            // bounce
            particle.v = new Vec2(
                particle.v.x, 
                particle.v.y*-.8
            );

        }

        const m = Mouse;

        if (m) {
            const pToM: Vec2 = pos.pointAt(m).normalize().scale(spec.mouseAccel * deltaT/1000);
            particle.v.add(pToM);
        }

        
        particle.moveAndUpdateAge(deltaT);

        // console.log(`Position: (${particle.p.x}, ${particle.p.y}), Velocity: (${particle.v.x}, ${particle.v.y})`);
    }

    setInitialPosition(particle: Particle): void {
        const w = this.bounds.w;
        const h = this.bounds.h;

        let position: Vec2;
        do {
            const x = Math.random() * w;
            const y = Math.random() * h;
            position = new Vec2(x, y);
        } while (this.lookup(position) !== null);

        particle.p = position;
    }

    setInitialVelocity(particle: Particle): void {
        particle.v = new Vec2();
    }

    private lookup(xy: Vec2): Particle | null {
        for (const particle of this.particles) {
            if (xy.equals(particle.p)) {
                return particle;
            }
        }
        return null;
    }
}