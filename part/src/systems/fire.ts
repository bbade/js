import { SystemConfig, ParticleSystem, Color, Rect } from '../interfaces';
import { Particle } from "../Particle";
import { randomRange } from '../math';
import { Config } from '../main';
import { Vec2 } from '../vec2';

export class FireSystem implements ParticleSystem {
    config = {
        numParticles: 1,
        minYSpeed: 1.5,
        maxYSpeed: 2.5,
        spawnXVariance: 0.1,
        decay: 0.995
    }

    public particles: Particle[] = [];
    public readonly bounds: Rect;
    private midX: number;

    constructor(bounds: Rect) {
        this.bounds = bounds;
        this.midX = 0.5;
    }

    getPalette(): null {
        return null; // Fire system doesn't have a fixed palette
    }

    drawOverlay(): void {}

    createParticle(recycled: Particle | null = null): Particle {
        if (this.config.spawnXVariance === undefined) { // Type guard
            throw new Error("spawnXVariance must be defined in FireSystem config");
        }
        
        const particle = recycled ?? Particle.create();;

        const spawnX = 0.5 + randomRange(-this.config.spawnXVariance, this.config.spawnXVariance);
        
        particle.x= spawnX;
        particle.y= this.bounds.h;
        particle.v = new Vec2(
            0,
            -randomRange(this.config.minYSpeed, this.config.maxYSpeed), // Negative for upward motion
        )
        particle.color = this.getColor(particle.y, null),
        particle.size = Config.particleSize;

        return particle;
    }

    getColor(y: number, old: Color | null): Color {
        // Normalize y position (0 at top, 1 at bottom)
        const normalizedY = y / this.bounds.h;

        let r: number, g: number, b: number;
        const min = 0x33;
        const fade = 12;

       /* if (normalizedY > 0.8) {
            // whiteish-yellow
            r = 255;
            g = 255;
            b = Math.floor(180 + (1 - normalizedY) * 75 * 5); // Some blue as we go up
        } *//*else if (normalizedY > 0.6) {
            // Yellow to orange
            r = 255;
            g = Math.floor(255 - (0.8 - normalizedY) * 255 * 5);
            b = 0;
        } else if (normalizedY > 0.5) {
            // Orange to red
            r = 255;
            g = Math.floor(150 - (0.6 - normalizedY) * 150 * 5); // Reduce green faster
            b = 0;
            */
        // } else if (old) {
        //     // greyish-black
        //     // if (old.r > 0) r = Math.max(old.r - fade, min); else r = min;
        //     // if (old.g > 0) g = Math.max(old.g - fade, min); else g = min;
        //     // if (old.b > 0) b = Math.max(old.b - fade, min); else b = min;
        //     r = 255;
        //     g = 0;
        //     b = 255;
        // } else {
        //     throw new Error("shouldn't get here");
        // }

        r = 255*normalizedY;
        g = 255*normalizedY;
        b = 255;

        return new Color(r, g, b);
    }

    updateParticle(particle: Particle, deltaT: number): void {
        if (this.config.decay === undefined || particle.v.y === undefined) return; // Guard
        particle.y += particle.v.y * deltaT / 1000;
        particle.v.y *= this.config.decay; // Apply decay to upward speed

        // Small random horizontal movement
        particle.x += randomRange(-0.002, 0.002);

        if (particle.y < 0) {
            this.createParticle(particle);
            return;
        }

        if (particle.x != this.midX) {
            // Move particle towards the middle
            const diff = this.midX - particle.x;
            let dir: number;
            if (particle.y > 0.8) {
                dir = -1;
            } else {
                dir = 1;
            }
            particle.x += dir * diff * 0.0015 * deltaT;
        }

        particle.color = this.getColor(particle.y, particle.color); // Update color
    }

    initialize(): void {
        this.particles = [];
        for (let i = 0; i < this.config.numParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }
}