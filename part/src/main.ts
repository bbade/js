import { RainSystem } from './systems/rain';
import { FireSystem } from './systems/fire';
import { SystemConfig, ParticleSystem } from './interfaces';
import { Particle } from "./Particle";
import { GenericSystem } from './generic';
import { RandomSys, Fountain } from './systems/generic-systems';
import { GravSystem } from './systems/grav';
import { Vec2 } from './vec2';


// --- Configuration ---
export const Config = {
    particleSize: 2,
    fps: 30,


};

export var Mouse: Vec2 | null = null;


// --- Setup Canvases ---
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const mainCtx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

// --- Mouse Event Listener ---
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        Mouse = new Vec2(x, y);
    } else {
        Mouse = null;
    }
});

canvas.addEventListener('mouseleave', () => {
    Mouse = null;
});

// --- Helper Functions ---
function randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}


function inBounds(particle: Particle, canvas: HTMLCanvasElement): boolean {
    return (
        particle.x >= 0 &&
        particle.x <= canvas.width &&
        particle.y >= 0 &&
        particle.y <= canvas.height
    );
}

function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle, particleSize: number): boolean {
    if (!inBounds(particle, ctx.canvas)) {
        return false;
    }
    ctx.fillStyle = particle.color.toHexStr();
    ctx.fillRect(
        Math.floor(particle.x),
        Math.floor(particle.y),
        particleSize,
        particleSize
    );
    return true;
}

// --- Instances of Systems ---

class Renderer {

    canvas: HTMLCanvasElement;
    activeSystem: ParticleSystem; // Keep track of the currently active system

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.canvas.getContext('2d')!.fillStyle = "#000";
        this.canvas.getContext('2d')!.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const systemSelect = document.getElementById('system-select') as HTMLSelectElement;



        // Event listener for dropdown change
        systemSelect.addEventListener('change', () => {
            this.startSystem(systemSelect.value);
        });

        // Start with rain as default
        this.startSystem(systemSelect.value);
    }

    update(deltaT: number) {
        if (this.activeSystem) {
            this.activeSystem.particles.forEach(particle => this.activeSystem.updateParticle(particle, deltaT));
        }
    }

    renderParticles() {
        this.canvas.getContext('2d')!.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.activeSystem) {
            this.activeSystem.particles.forEach(p => drawParticle(this.canvas.getContext('2d')!, p, Config.particleSize));
        }
    }

    lastTimestamp: number = 0;

    doFrame = (timestamp: number) => {
        const deltaT = this.lastTimestamp ? (timestamp - this.lastTimestamp) : 0;

        this.update(deltaT);
        this.renderParticles();
        if (this.activeSystem && this.activeSystem.drawOverlay) { //check
            this.activeSystem.drawOverlay(this.canvas.getContext('2d')!);
        }

        this.lastTimestamp = timestamp;
        requestAnimationFrame(this.doFrame);
    }

    startSystem(systemType: string) {
        this.canvas.getContext('2d')!.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (systemType === 'rain') {
            this.activeSystem = new RainSystem(this.canvas);
        } else if (systemType === 'fire') {
            this.activeSystem = new FireSystem(this.canvas);
        } else if (systemType === 'fountain') {
            this.activeSystem = new GenericSystem(new Fountain(), this.canvas);
        } else if (systemType === 'random') {
            this.activeSystem = new GenericSystem(new RandomSys(), this.canvas);
        } else if (systemType === 'grav') {
            this.activeSystem = new GravSystem(this.canvas);
        }

        this.activeSystem.initialize(); // Initialize

        // Start the animation loop
        requestAnimationFrame(this.doFrame);
    }
}


new Renderer(canvas);