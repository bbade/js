import { Particle, ParticleSystem } from '../interfaces'

interface ParticleSystemMoar {  // additional methods that i might move into the particlesystem interface
    initializeParticle(recyled: Particle | null): Particle;
    setInitialPosition(particle: Particle): void;
    setInitialVelocity(particle: Particle): void;
}

class GravSystem implements ParticleSystem, ParticleSystemMoar {

    particles: Particle[] = [];
    canvas: HTMLCanvasElement;

    spec = {
        numParticles: 20,
    };

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }


    createParticles(): void {
        for (let i = 0; i < this.spec.numParticles; i++) {
            this.particles.push(this.initializeParticle(null));
        }
    }

    initializeParticle(recycled: Particle | null): Particle {
        const particle = recycled ? recycled : new Particle();

        this.setInitialPosition(particle);
    }

    updateParticle(particle: Particle, deltaT: number): void {
        throw new Error('Method not implemented.');
    }
    drawOverlay?(context: CanvasRenderingContext2D): void {
        throw new Error('Method not implemented.');
    }

    setInitialPosition(particle: Particle): void {
        throw new Error('Method not implemented.');
    }
    setInitialVelocity(particle: Particle): void {
        throw new Error('Method not implemented.');
    }

}