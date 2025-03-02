import { Particle, SystemConfig, ParticleSystem, Color,  } from './interfaces';
import { randomRange } from './math';




export class RainSystem implements ParticleSystem{
  public particles: Particle[] = []; // Public, as it's accessed in main.ts
  public readonly canvas: HTMLCanvasElement;
  private palette: Color[];
  
  private readonly config = {
    numParticles: 30,
    minSpeed: .05,
    maxSpeed: .09,
  };


  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.palette = [
      new Color(157, 209, 255),
      new Color(130, 183, 245),
      new Color(103, 157, 235),
      new Color(76, 131, 210),
      new Color(85, 136, 185),
      new Color(54, 95, 160),
      new Color(58, 79, 231),
      new Color(34, 95, 190),
      new Color(66, 85, 202),
      new Color(17, 85, 252),
    ];
  }

  getPalette(): Color[] {
    return this.palette;
  }

  createParticle(): Particle {
    return Particle.fromArgs({
      x: randomRange(0, this.canvas.width),
      y: randomRange(0, this.canvas.height),
      v: {
        x: 0,
        y: randomRange(this.config.minSpeed, this.config.maxSpeed)
      },
      color: this.randomPaletteColor(),
      size: null
    });
  }

  private randomPaletteColor(): Color {
    return this.palette[Math.floor(Math.random() * this.palette.length)];
  }

    updateParticle(particle: Particle, deltaT: number): void {
        particle.y += particle.v.y * deltaT;

        if (particle.y > this.canvas.height) {
            particle.x = randomRange(0, this.canvas.width);
            particle.y = 0 - 2; // Assuming particleSize is 2, from main config
            particle.v.y = randomRange(this.config.minSpeed, this.config.maxSpeed);
            particle.color = this.randomPaletteColor();
        }
    }

  createParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.config.numParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }
  drawOverlay(context: CanvasRenderingContext2D): void {
      drawText(context, 16, 24, 116, 50, "Rain\n15C", "#e6efff");
  }
}


// ---- Text Drawing ----  (This could also be in a separate file, e.g., `text.ts`)
function drawText(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, string: string, color: string) {

  const fontSize = 11;
  context.font = `${fontSize}px monospace`;

  context.fillStyle = color;
  context.textBaseline = "top"; // Important for consistent positioning

  // Disable anti-aliasing (this is the crucial part)
//   context.imageSmoothingEnabled = false;  // Standard, modern browsers
  context.textRendering = "geometricPrecision";

  //Split lines
  const lines = string.split('\n');
  let currentY = y;

  context.filter = 'grayscale(100%) contrast(1000%)';

  for (const line of lines) {
    context.fillText(line, x, currentY, w); // Use maxWidth (w) for wrapping
    currentY += fontSize + 2; //Adjust for next line.
  }

  context.filter = 'none';

}