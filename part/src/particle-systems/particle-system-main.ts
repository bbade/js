import { RainSystem } from './rain';
import { FireSystem } from './fire';
import { SystemConfig, ParticleSystem } from './interfaces';
import { Rect } from "../math/Rect";
import { Particle } from "./Particle";
import { BallsGenericSystem } from './generic';
import { RandomSys, Fountain } from './generic-systems';
import { GravSystem } from './grav';
import { CloudSystem } from './cloud';
import { mult, Vec2 } from '../math/vec2';
import { normalizedRect } from '../math/math';
import { PhysicsSystem } from './physics-system';
import { runMatrixTests } from '../test/testMatrix';


runMatrixTests()

// --- Configuration ---
export const Config = {
    particleSize: 2,
    // fps: 60,
    
    
};

export var Mouse: Vec2 | null = null;

var screenToNormal: Vec2;
var normalToScreen: Vec2;
var bounds: Rect;


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
    const {x, y} = mult(particle.p, normalToScreen);

    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        return false;
    }

    ctx.fillStyle = particle.color.toHexStr();

    // console.log(`Filling particle at (${x}, ${y}) with color ${particle.color.toHexStr()}`);
    ctx.fillRect(
        Math.floor(x),
        Math.floor(y),
        particle.draw_size_px,
        particle.draw_size_px
    );
    return true;
}

// --- Instances of Systems ---

let activeSystem: ParticleSystem; // Keep track of the currently active system

function update(deltaT: number) {
    if (activeSystem) {
        activeSystem.processFrame(deltaT);
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
    
    const maxDim = Math.max(canvas.width, canvas.height);
    const normSize = Config.particleSize / maxDim; // todo pass this

    if (systemType === 'rain') {
        activeSystem = new RainSystem(bounds);
    } else if (systemType === 'fire') {
        activeSystem = new FireSystem(bounds);
    } else if (systemType === 'fountain') {
        activeSystem = new BallsGenericSystem(new Fountain(), bounds);
    } else if (systemType === 'random') {
        activeSystem = new BallsGenericSystem(new RandomSys(), bounds);
    } else if (systemType === 'grav') {
        activeSystem = new GravSystem(bounds, screenToNormal);
    } else if (systemType === 'clouds') {
        activeSystem = new CloudSystem(bounds);
    } else if (systemType === 'spring') {
        activeSystem = new PhysicsSystem(bounds);
    }
    
    activeSystem.initialize(); // Initialize

    // Start the animation loop
    requestAnimationFrame(doFrame);
}

// --- Initialization & Main Loop ---

function computeProjectedBounds(canvas: HTMLCanvasElement) {
    const m = Math.max(canvas.width, canvas.height);
    screenToNormal = new Vec2(1 / m, 1 / m);
    normalToScreen = new Vec2(m,m);

    // make rect
    bounds = new Rect(
      0,
      0,
      canvas.width / m,
      canvas.height / m
    );
}




// --- Mouse Event Listener ---
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * canvas.width * screenToNormal.x;
    const y = (event.clientY - rect.top) / rect.height * canvas.height * screenToNormal.y;


    if (x >= 0 && x <= bounds.w && y >= 0 && y <= bounds.h) {
        Mouse = new Vec2(x, y);
    } else {
        Mouse = null;
    }
});

canvas.addEventListener('mouseleave', () => {
    Mouse = null;
});

function init() {
    
    mainCtx.fillStyle = "#000";
    mainCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    computeProjectedBounds(canvas);
    
    const systemSelect = document.getElementById('system-select') as HTMLSelectElement;
    
    // Start with rain as default
    startSystem(systemSelect.value);
    
    // Event listener for dropdown change
    systemSelect.addEventListener('change', () => {
        startSystem(systemSelect.value);
    });

    
}


init();