import { RainSystem } from './rain';
import { FireSystem } from './fire';
import { Particle, SystemConfig, ParticleSystem } from './interfaces';


// --- Configuration ---
const config = {
  particleSize: 2,
  fps: 30,
  rain: {
    numParticles: 30,
    minSpeed: 2,
    maxSpeed: 4,
  },

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
let animationInterval: number | undefined;

function update() {
  if (activeSystem) {
      activeSystem.particles.forEach(particle => activeSystem.updateParticle(particle));
  }
}

function renderParticles() {
  mainCtx.clearRect(0, 0, canvas.width, canvas.height);
    if (activeSystem) {
        activeSystem.particles.forEach(p => drawParticle(mainCtx, p, config.particleSize));
    }
}

function doFrame() {
  update();
  renderParticles();
  if (activeSystem && activeSystem.drawOverlay) { //check
      activeSystem.drawOverlay(mainCtx);
  }

}

function startSystem(systemType: string) {
  // Clear any existing interval
    if (animationInterval !== undefined) {
        clearInterval(animationInterval);
    }

  mainCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (systemType === 'rain') {
        activeSystem = new RainSystem(config.rain, canvas);
        activeSystem.initializeParticles(); // Initialize

    } else if (systemType === 'fire') {
        activeSystem = new FireSystem(canvas);
        activeSystem.initializeParticles();
  }

  // Start the animation loop
  animationInterval = setInterval(doFrame, 1000 / config.fps);
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