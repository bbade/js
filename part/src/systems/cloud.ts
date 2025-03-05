
import { ParticleSystem, ParticleConfigure, Color, Rect } from '../interfaces';
import { Particle } from '../Particle';
import { Vec2 } from '../vec2';
import { randomRange } from '../math';


const spec = {
    numParticles: 200,
    cloudSpeed: 0.2,
    rainProbability: 0.2,
    rainCooldown: 3000, // in milliseconds
    rainSpeed: 0.05,
};

export class CloudSystem implements ParticleSystem, ParticleConfigure {
    particles: Particle[] = [];
    cloudParticles: Particle[] = [];
    rainParticles: Particle[] = [];
    bounds: Rect;
    rainCooldown: number = 0;

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

    setInitialPosition(particle: Particle): void {
        particle.p = new Vec2(randomRange(0, this.bounds.w), randomRange(0, this.bounds.h * 0.4));
    }

    setInitialVelocity(particle: Particle): void {
        particle.v = new Vec2(spec.cloudSpeed, 0);
    }

    setInitialColor(particle: Particle): void {
        particle.color = new Color(255, 255, 255);
    }

    updateParticle_deprecated(particle: Particle, deltaT: number): void {
        particle.p.x += particle.v.x * deltaT / 1000;
        if (particle.p.x > this.bounds.w) {
            particle.p.x = 0;
        }

        if (Math.random() < spec.rainProbability && this.rainCooldown <= 0) {
            this.spawnRain(particle);
            this.rainCooldown = spec.rainCooldown;
        }

        this.rainCooldown -= deltaT;
    }

    spawnRain(cloudParticle: Particle): void {
        const rainParticle = Particle.create();
        rainParticle.p = new Vec2(cloudParticle.p.x, cloudParticle.p.y);
        rainParticle.v = new Vec2(0, spec.rainSpeed);
        rainParticle.color = new Color(0, 0, 255);
        this.rainParticles.push(rainParticle);
    }
}
