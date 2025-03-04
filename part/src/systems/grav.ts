import { Color, ParticleSystem, Rect } from '../interfaces'
import { Mouse } from '../main';
import { isOutOfBounds } from '../math';
import { Particle } from "../Particle";
import { add, scale, Vec2 } from "../vec2";

interface ParticleConfigure {  // additional methods that i might move into the particlesystem interface
    initializeParticle(recyled: Particle | null): Particle;
    setInitialPosition(particle: Particle): void;
    setInitialVelocity(particle: Particle): void;
    setInitialColor(particle: Particle): void;
}

const spec = {
   numParticles: 20,
    maxAgeMs: 5 * 1000,
    G : 1,
    mouseAccel: 2,
};

export class GravSystem implements ParticleSystem, ParticleConfigure {

    particles: Particle[] = [];

    bounds: Rect; // normalized 0,0, w, h where W and H are <= 1

    readonly gravity: Vec2 = new Vec2(0, spec.G); // 100 px/sec down, with positive being down



    constructor(bounds: Rect) {
        this.bounds = bounds;
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

    updateParticle(particle: Particle, deltaT: number): void {
        particle.incAge(deltaT);

        const lifeLeft = 1 - particle.ageMs / spec.maxAgeMs;
        particle.color.g= Math.max(100, Math.floor(255*lifeLeft));

        if(particle.color.g <= 30 || isOutOfBounds(particle.p, this.bounds) || particle.ageMs > spec.maxAgeMs ) {
            this.initializeParticle(particle);
            return;
        }

        const pos = particle.p;

        if (pos.y > this.bounds.h - particle.size) {
            // bounce
            particle.v = new Vec2(
                particle.v.x, 
                particle.v.y*-.5
            );

        } else { // freefall
            const down = scale(this.gravity, deltaT / 1000);
            particle.v.add(down);
        }

        const m = Mouse;

        // if (m) {
        //     const pToM: Vec2 = pos.pointAt(m).normalize().scale(spec.mouseAccel * deltaT/1000);
        //     particle.v.add(pToM);
        // }

        
        particle.p = add(pos, particle.v);
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