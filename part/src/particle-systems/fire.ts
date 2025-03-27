import { SystemConfig, ParticleSystem } from '../interfaces';
import { Rect } from "../math/geometry/Rect";
import { Color, scaleBrightness } from "../Color";
import { Particle } from "./Particle";
import { randomRange } from '../math/math';
import { Config, UsefulContext } from './particle-system-main';
import { Vec2 } from '../math/vec2';

export class FireSystem implements ParticleSystem {
    config = {
        numParticles: 100,
        minYSpeed: 1.5,
        maxYSpeed: 2.5,
        spawnXVariance: 0.15,
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

    drawOverlay(context: UsefulContext): void {
        // Example overlay drawing code
        context.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        context.ctx.fillRect(10, 10, 100, 50);
    }

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
        particle.draw_size_px = Config.particleSize;

        return particle;
    }

    getColor(y: number, old: Color | null): Color {
        // Normalize y position (0 at top, 1 at bottom)
        const normalizedY = y / this.bounds.h;
        const { r, g, b} = flameColor(normalizedY);
        return new Color(r, g, b);
    }

    processFrame(deltaT: number): void {
        for (const particle of this.particles) {
            this.updateParticle(particle, deltaT);
        }
    }

    private updateParticle(particle: Particle, deltaT: number): void {
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
            particle.x += dir * diff * 0.002 * deltaT;
        }

        const newColor =  this.getColor(particle.y, particle.color); // Update color
       
        // console.log(`Particle color updated to: r=${newColor.r}, g=${newColor.g}, b=${newColor.b}`);
        particle.color = newColor;
    }

    initialize(): void {
        this.particles = [];
        for (let i = 0; i < this.config.numParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }
}
function flameColor(i: number): Color {
    if (i > 1 || i < 0) {
        throw new Error("Input i must be between 0 and 1 inclusive.");
    }

    let r = 0;
    let g = 0;
    let b = 0;

    const smokeY = .4;
  
        // Smoother transition from yellow to red.

        // Yellow to Orange (i > ~0.8) - Brighter yellow
        if (i > 0.8) {
            r = 255;
            g = 255; // Keep it bright yellow longer
            b = 0;
        } else if (i > 0.5) {
            // Orange
            r = 255;
            g = Math.max(0, 255 * (1 - Math.pow((0.8 - i) * 3.33, 0.7)));  // Smoother, curved transition.
            b = 0;
        } else {
            // Red
            r = 255;
            g = Math.max(0, 150 * (0.5 - i) / 0.2);
            b = 0;
        }


        // Clamp r, g, b to be within the range 0 to 255
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        const color = new Color(r,g,b);


        if (color.r < 0 || color.r > 255 || color.g < 0 || color.g > 255 || color.b < 0 || color.b > 255) {
            throw new Error(`RGB values must be between 0 and 255 inclusive. ${color.r}, ${color.g},${color.b}, i=${i}`);
        }

        if (i < smokeY) {
            const progress = (i / smokeY) ;
            scaleBrightness(color, progress);
            setSaturation(color, progress/2);
                
         } 



    return color;
}


function setSaturation(color: Color, value: number): void {
    if (value < 0 || value > 1) {
      throw new Error("Value must be between 0 and 1");
    }
  
    // 1. Convert RGB to HSL (Hue, Saturation, Lightness)
  
    // Normalize RGB values to be between 0 and 1
    let r = color.r / 255;
    let g = color.g / 255;
    let b = color.b / 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
  
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;
  
    if (delta !== 0) {
      s = l < 0.5 ? delta / (max + min) : delta / (2 - max - min);
  
      if (max === r) {
        h = (g - b) / delta + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else { // max === b
        h = (r - g) / delta + 4;
      }
  
      h /= 6;
    }
  
    // 2. Set Saturation to the new value
    s = value;
  
  
    // 3. Convert HSL back to RGB
    if (s === 0) {
      // Achromatic (gray) - saturation is 0, so r, g, b are all equal to lightness
      color.r = Math.round(l * 255);
      color.g = Math.round(l * 255);
      color.b = Math.round(l * 255);
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
  
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
  
        color.r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
        color.g = Math.round(hue2rgb(p, q, h) * 255);
        color.b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
    }
  
    // Ensure RGB values are within the 0-255 range (clamping)
      color.r = Math.max(0, Math.min(255, color.r));
      color.g = Math.max(0, Math.min(255, color.g));
      color.b = Math.max(0, Math.min(255, color.b));
  }

