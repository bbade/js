import { RainSystem } from './systems/rain';
import { FireSystem } from './systems/fire';
import { SystemConfig, ParticleSystem } from './interfaces';
import { Particle } from "./Particle";
import { GenericSystem } from './generic';
import { RandomSys, Fountain } from './systems/generic-systems';
import { GravSystem } from './systems/grav';
import { Vec2 } from './vec2';
import { normalizedRect } from './math';


// --- Configuration ---
export const Config = {
    particleSize: 2,
    fps: 30,
    
    
};

export var Mouse: Vec2 | null = null;


// --- Setup Canvases ---
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const mainCtx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

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
    const canvas = ctx.canvas;
    const x = particle.x * canvas.width;
    const y = particle.y * canvas.height;

    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        return false;
    }

    ctx.fillStyle = particle.color.toHexStr();
    ctx.fillRect(
        Math.floor(x),
        Math.floor(y),
        particleSize,
        particleSize
    );
    return true;
}

// --- Instances of Systems ---

let activeSystem: ParticleSystem; // Keep track of the currently active system

function update(deltaT: number) {
    if (activeSystem) {
        activeSystem.particles.forEach(particle => activeSystem.updateParticle(particle, deltaT));
    }
}

function renderParticles() {
    mainCtx.clearRect(0, 0, canvas.width, canvas.height);
    if (activeSystem) {
        activeSystem.particles.forEach(p => drawParticle(mainCtx, p, Config.particleSize));
    }
}

let lastTimestamp: number;


function doFrame(timestamp: number) {
    const deltaT = lastTimestamp ? (timestamp - lastTimestamp) : 0;
    
    update(deltaT);
    renderParticles();
    if (activeSystem && activeSystem.drawOverlay) { //check
        activeSystem.drawOverlay(mainCtx);
    }
    
    lastTimestamp = timestamp;
    requestAnimationFrame(doFrame);
}

function startSystem(systemType: string) {
    mainCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    const bounds = normalizedRect(canvas);

    if (systemType === 'rain') {
        activeSystem = new RainSystem(bounds);
    } else if (systemType === 'fire') {
        activeSystem = new FireSystem(bounds);
    } else if (systemType === 'fountain') {
        activeSystem = new GenericSystem(new Fountain(), bounds);
    }else if (systemType === 'random') {
        activeSystem = new GenericSystem(new RandomSys(), bounds);
    }else if (systemType === 'grav') {
        activeSystem = new GravSystem(bounds);
    }
    
    activeSystem.initialize(); // Initialize

    // Start the animation loop
    requestAnimationFrame(doFrame);
}

// --- Initialization & Main Loop ---

function init() {
    
    mainCtx.fillStyle = "#000";
    mainCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    const systemSelect = document.getElementById('system-select') as HTMLSelectElement;
    
    // Start with rain as default
    startSystem(systemSelect.value);
    
    // Event listener for dropdown change
    systemSelect.addEventListener('change', () => {
        startSystem(systemSelect.value);
    });
}

init();