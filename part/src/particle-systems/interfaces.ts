import { Rect } from "../math/Rect";
import { Particle } from "./Particle";

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
