import { Particle, SystemConfig, ParticleSystem, Color } from './interfaces';



// Helper function
function randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export class FireSystem implements ParticleSystem {
    config = {
        numParticles: 130,
        minSpeed: .05,
        maxSpeed: .11,
        spawnXVariance: 20,
        decay: 0.995
    }
    
    public particles: Particle[] = [];
    public readonly canvas: HTMLCanvasElement;
    private midX: number;
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.midX = canvas.width / 2;
    }
    getPalette(): null {
        return null; // Fire system doesn't have a fixed palette
    }
    
    drawOverlay(): void {}
    
    createParticle(): Particle {
        if (this.config.spawnXVariance === undefined) { // Type guard
            throw new Error("spawnXVariance must be defined in FireSystem config");
        }
        const spawnX = this.canvas.width / 2 + randomRange(-this.config.spawnXVariance, this.config.spawnXVariance);
        return Particle.fromArgs( {
            x: spawnX,
            y: this.canvas.height, // Start at the bottom
            v: {
                x: 0,
                y:  -randomRange(this.config.minSpeed, this.config.maxSpeed), // Negative for upward motion
            },
            color: this.getColor(this.canvas.height,null), // Initial color
            size: null
        });
    }
    
    getColor(y: number, old: Color |  null): Color {
        
        
        // Normalize y position (0 at top, 1 at bottom)
        const normalizedY = y / this.canvas.height;
        
        let r: number, g: number, b: number;
        const min = 0x33;
        const fade = 12;
        
        if (normalizedY > 0.8) {
            // whiteish-yellow
            r = 255;
            g = 255;
            b = Math.floor(180 + (1 - normalizedY) * 75 * 5); //Some blue as we go up
            
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
            
            // } else if (normalizedY > 0.2) {
            //   // Red to dark grey
            //   r = Math.floor(200 - (0.4 - normalizedY) * 200 * 5);
            //   g = 0;
            //   b = 0;
            
        }
        else if (old) {
            // greyish-black
            //   r = Math.floor(50 - normalizedY * 50 * 5);
            //   g = Math.floor(50 - normalizedY * 50 * 5);
            //   b = Math.floor(50 - normalizedY * 50 * 5);
            
            if ( old.r > 0) r = Math.max(old.r-fade, min); else r = min;
            if ( old.g > 0)g = Math.max(old.g-fade, min); else g = min;  
            if ( old.b > 0)b =  Math.max(old.b-fade, min); else b =min;
            
            // g = Math.floor(50 - normalizedY * 50 * 5);
            // b = Math.floor(50 - normalizedY * 50 * 5);
        } else {
            throw new Error("shouldn't get here");
        }
        
        return new  Color(r,g,b);
    }
    
    
    updateParticle(particle: Particle, deltaT: number): void {
        if (this.config.decay === undefined || particle.v.y === undefined) return; //Guard
        particle.y += particle.v.y * deltaT;
        particle.v.y *= this.config.decay; // Apply decay to upward speed
        
        //Small random horizontal movement
        particle.x += randomRange(-0.2, 0.2);
        
        if (particle.y < 0) {
            // Recycle particle
            if (this.config.spawnXVariance === undefined) return; //Guard
            
            particle.y = this.canvas.height;
            particle.x = this.canvas.width / 2 + randomRange(-this.config.spawnXVariance, this.config.spawnXVariance);
            particle.v.y = -randomRange(this.config.minSpeed, this.config.maxSpeed);
        }
        
        if (particle.x != this.midX) {
            // Move particle towards the middle
            const diff = this.midX - particle.x;
            let dir: number;
            if (particle.y > this.canvas.height *.8) {
                dir = -1;
            } else {
                dir = 1;
            }
            particle.x += dir * diff * 0.0015 * deltaT;
        }
        
        particle.color = this.getColor(particle.y, particle.color); //Update color
    }
    
    
    createParticles(): void {
        this.particles = [];
        for (let i = 0; i < this.config.numParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }
}