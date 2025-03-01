import { GenericSystem, GenericSystemSpec } from "../generic";
import { Color, Particle, Rect, Vec2 } from "../interfaces";
import { clamp, sub } from "../math";

export class Fountain implements GenericSystemSpec {
    numParticles: number = 30;
    minSpeed: Vec2 = new Vec2(-.2, -0.3);
    maxSpeed: Vec2 = new Vec2(.2,-1);
    palette = [
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
    minPSizePx: number = 1;
    maxPSizePx: number = 1;
    spawnRectNorm: Rect = new Rect(.5, 1, 0, .01); // normalized

    updateParticle(particle: Particle, deltaT: number): void {
        particle.y += particle.v.y * deltaT;
        particle.x += particle.v.x * deltaT;
        particle.v.y += 0.0001 * deltaT; // down is positive
        
    }


}

export class RandomSys implements GenericSystemSpec {
    numParticles: number = 90;
    minSpeed: Vec2 = new Vec2(-1, -1);
    maxSpeed: Vec2 = new Vec2(1, 1);
    palette = [
    new Color(255, 51, 51),
    new Color(51, 255, 51),
    new Color(51, 51, 255),
    new Color(255, 255, 51),
    new Color(51, 255, 255),
    new Color(255, 51, 255),
    new Color(204, 204, 204),
    new Color(128, 128, 128),
    new Color(128, 32, 32),
    new Color(128, 128, 32),
    new Color(32, 128, 32),
    new Color(128, 32, 128),
    new Color(32, 128, 128),
    new Color(32, 32, 128),
    new Color(255, 102, 51)
      ];
    minPSizePx: number = 1;
    maxPSizePx: number = 1;
    spawnRectNorm: Rect = new Rect(.3, .3, .4, .4); // normalized

    private center =  new  Vec2(.5, .5);

    updateParticle(particle: Particle, deltaT: number, canvasBounds: Rect): void {
        particle.x += particle.v.x * deltaT;
        particle.y += particle.v.y * deltaT;

        // normalize particle
        const pxn = clamp(particle.x, 0, canvasBounds.w) / canvasBounds.w;
        const pyn = clamp(particle.y, 0, canvasBounds.h) / canvasBounds.h;
        
        const toCenter = sub(this.center, new Vec2(pxn, pyn));
        toCenter.scale(.001);
        particle.v.add(toCenter);
    }

}


// todo: fireworks. 