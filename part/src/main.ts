import { RainSystem } from './rain';
import { FireSystem } from './fire';
import { Particle, SystemConfig, ParticleSystem } from './interfaces';
import { GenericSystem } from './generic';
import { RandomSys, Fountain } from './generic-systems/fountain';


// --- Configuration ---
const config = {
    particleSize: 2,
    fps: 30,
    
    
};

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

let activeSystem: ParticleSystem; // Keep track of the currently active system

function update(deltaT: number) {
    if (activeSystem) {
        activeSystem.particles.forEach(particle => activeSystem.updateParticle(particle, deltaT));
    }
}

function renderParticles() {
    mainCtx.clearRect(0, 0, canvas.width, canvas.height);
    if (activeSystem) {
        activeSystem.particles.forEach(p => drawParticle(mainCtx, p, config.particleSize));
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
    
    if (systemType === 'rain') {
        activeSystem = new RainSystem(canvas);
    } else if (systemType === 'fire') {
        activeSystem = new FireSystem(canvas);
    } else if (systemType === 'fountain') {
        activeSystem = new GenericSystem(new Fountain(), canvas);
    }else if (systemType === 'random') {
        activeSystem = new GenericSystem(new RandomSys(), canvas);
    }
    
    activeSystem.createParticles(); // Initialize

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