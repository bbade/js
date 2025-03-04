import { SystemConfig, ParticleSystem, Color, Rect } from '../interfaces';
import { Particle } from "../Particle";
import { randomRange } from '../math';
import { Config } from '../main';
import { Vec2 } from '../vec2';

export class FireSystem implements ParticleSystem {
    config = {
        numParticles: 130,
        minSpeed: 0.0005,
        maxSpeed: 0.0011,
        spawnXVariance: 0.02,
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

    createParticle(): Particle {
        if (this.config.spawnXVariance === undefined) { // Type guard
            throw new Error("spawnXVariance must be defined in FireSystem config");
        }
        const spawnX = 0.5 + randomRange(-this.config.spawnXVariance, this.config.spawnXVariance);
        return Particle.fromArgs({
            x: spawnX,
            y: 1, // Start at the bottom
            v: new Vec2(
                0,
                -randomRange(this.config.minSpeed, this.config.maxSpeed), // Negative for upward motion
            ),
            color: this.getColor(1, null), // Initial color
            size: Config.particleSize,
        });
    }

    getColor(y: number, old: Color | null): Color {
        // Normalize y position (0 at top, 1 at bottom)
        const normalizedY = y;

        let r: number, g: number, b: number;
        const min = 0x33;
        const fade = 12;

        if (normalizedY > 0.8) {
            // whiteish-yellow
            r = 255;
            g = 255;
            b = Math.floor(180 + (1 - normalizedY) * 75 * 5); // Some blue as we go up
        } else if (normalizedY > 0.6) {
            // Yellow to orange
            r = 255;
            g = Math.floor(255 - (0.8 - normalizedY) * 255 * 5);
            b = 0;
        } else if (normalizedY > 0.4) {
            // Orange to red
            r = 255;
            g = Math.floor(150 - (0.6 - normalizedY) * 150 * 5); // Reduce green faster
            b = 0;
        } else if (old) {
            // greyish-black
            if (old.r > 0) r = Math.max(old.r - fade, min); else r = min;
            if (old.g > 0) g = Math.max(old.g - fade, min); else g = min;
            if (old.b > 0) b = Math.max(old.b - fade, min); else b = min;
        } else {
            throw new Error("shouldn't get here");
        }

        return new Color(r, g, b);
    }

    updateParticle(particle: Particle, deltaT: number): void {
        if (this.config.decay === undefined || particle.v.y === undefined) return; // Guard
        particle.y += particle.v.y * deltaT;
        particle.v.y *= this.config.decay; // Apply decay to upward speed

        // Small random horizontal movement
        particle.x += randomRange(-0.002, 0.002);

        if (particle.y < 0) {
            // Recycle particle
            if (this.config.spawnXVariance === undefined) return; // Guard

            particle.y = 1;
            particle.x = 0.5 + randomRange(-this.config.spawnXVariance, this.config.spawnXVariance);
            particle.v.y = -randomRange(this.config.minSpeed, this.config.maxSpeed);
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