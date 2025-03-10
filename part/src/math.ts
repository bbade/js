import { Rect } from "./interfaces";
import { Vec2 } from "./vec2";

// Helper function (moved here to keep things self-contained)
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomPoint(
  normalizedBounds: Rect, 
  canvasW: number, 
  canvasH: number): Vec2
  {
    return new Vec2(
      randomRange(normalizedBounds.x, normalizedBounds.x1) * canvasW, 
      randomRange(normalizedBounds.y, normalizedBounds.y1) * canvasH
    );
  }
  
  export function normalizedRect(canvas: HTMLCanvasElement): Rect {
    const m = Math.max(canvas.width, canvas.height);
    return new Rect(
      0,
      0,
      canvas.width / m,
      canvas.height / m
    );
  }
  
  
  export function isOutOfBounds(particle: Vec2, rect: Rect): boolean {
    return (
      particle.x < rect.x || particle.x > rect.x1 || particle.y < rect.y || particle.y > rect.y1
    );
  }
  
  export function clamp(n: number, min: number, max: number): number {
    if (n < min) {
      return min;
    } else if (n > max) {
      return max;
    } else {
      return n;
    }
  }

  export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }