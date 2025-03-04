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


  export function isOutOfBounds(particle: Vec2, canvas: HTMLCanvasElement): boolean {
    return (
        particle.x < 0 ||
        particle.x > canvas.width ||
        particle.y < 0 ||
        particle.y > canvas.height
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