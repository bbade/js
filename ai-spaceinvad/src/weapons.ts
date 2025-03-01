// src/weapons.ts

import { Constants } from "./constants";

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

export interface Projectile extends Rectangle {
    speed: number;
    update(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isOffScreen(): boolean;
}

export abstract class Weapon {
    abstract fire(x: number, y: number, playerSpeedX: number): Projectile[];
    abstract updateProjectiles(): void;
    abstract drawProjectiles(ctx: CanvasRenderingContext2D): void;

    protected projectiles: Projectile[] = [];

    protected clearOffScreenProjectiles() {
        this.projectiles = this.projectiles.filter(p => !p.isOffScreen());
    }
}

// --- Basic Laser ---
export class BasicLaserProjectile implements Projectile {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;

    constructor(x: number, y: number, speed: number, color: string = Constants.PLAYER_LASER_COLOR) {
        this.x = x;
        this.y = y;
        this.width = Constants.LASER_WIDTH;
        this.height = Constants.LASER_HEIGHT;
        this.color = color;
        this.speed = speed;
    }

    update() {
        this.y += this.speed;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.y + this.height < 0;
    }
}

export class BasicLaser extends Weapon {
    fire(x: number, y: number, playerSpeedX: number): Projectile[] {
        const projectile = new BasicLaserProjectile(
            x + Constants.PLAYER_WIDTH / 2 - Constants.LASER_WIDTH / 2,
            y,
            Constants.PLAYER_LASER_SPEED
        );
        this.projectiles.push(projectile);
        return [projectile];
    }

    updateProjectiles(): void {
        for (const projectile of this.projectiles) {
            projectile.update();
        }
        this.clearOffScreenProjectiles();
    }

    drawProjectiles(ctx: CanvasRenderingContext2D): void {
        for (const projectile of this.projectiles) {
            projectile.draw(ctx);
        }
    }
}


// --- Beam ---
export class BeamProjectile implements Projectile {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number; // Not actually used for movement
    duration: number;
    timeAlive: number = 0;
    isActive: boolean;
    topY: number; // Add a topY property

    constructor(x: number, y: number, duration: number, color: string = 'cyan') {
        this.x = x;
        this.y = y;
        this.width = Constants.LASER_WIDTH;
        this.height = 0; // Initial height
        this.color = color;
        this.speed = 0; // Beam doesn't move
        this.duration = duration;
        this.isActive = true;
        this.topY = 0; // Initialize topY to 0
    }


    update() {
        this.timeAlive += 1000 / 30; // Assuming 30 FPS
        if (this.timeAlive >= this.duration) {
            this.isActive = false;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isActive) return;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.topY, this.width, this.y - this.topY); // Draw from topY to y
    }
    isOffScreen() {
      return !this.isActive;
    }

    setEndY(y: number) {
       this.topY = y;
    }
    setStartY(y:number){
        this.y = y;
    }
}

export class Beam extends Weapon {
    duration: number = 200;
    beam: BeamProjectile | null = null;

    fire(x: number, y: number, playerSpeedX: number): Projectile[] {
        if (!this.beam || !this.beam.isActive) {
          this.beam = new BeamProjectile( x + Constants.PLAYER_WIDTH / 2 - Constants.LASER_WIDTH / 2, y, this.duration);
          return [this.beam];
        }
        return [];

      }
    updateProjectiles(): void {
      if(this.beam) {
        this.beam.update();
        if(!this.beam.isActive){
          this.beam = null;
        }
      }
    }

    drawProjectiles(ctx: CanvasRenderingContext2D): void {
      if(this.beam) {
        this.beam.draw(ctx);
      }
    }
    getActiveBeam(): BeamProjectile | null {
        return this.beam;
    }
}

// --- Double Laser ---

export class DoubleLaserProjectile extends BasicLaserProjectile{
    //Identical to basic, but fired in pairs by the weapon.

}

export class DoubleLaser extends Weapon {
    fire(x: number, y: number, playerSpeedX: number): Projectile[] {
        const offset = 15; // Half the distance between lasers

        const projectile1 = new DoubleLaserProjectile(
            x + Constants.PLAYER_WIDTH / 2 - Constants.LASER_WIDTH / 2 - offset,
            y,
            Constants.PLAYER_LASER_SPEED
        );
        const projectile2 = new DoubleLaserProjectile(
            x + Constants.PLAYER_WIDTH / 2 - Constants.LASER_WIDTH / 2 + offset,
            y,
            Constants.PLAYER_LASER_SPEED
        );
        this.projectiles.push(projectile1, projectile2);
        return [projectile1, projectile2];
    }

    updateProjectiles(): void {
        for (const projectile of this.projectiles) {
            projectile.update();
        }
        this.clearOffScreenProjectiles();
    }
    drawProjectiles(ctx: CanvasRenderingContext2D): void {
        for (const projectile of this.projectiles) {
            projectile.draw(ctx);
        }
    }
}
// --- Momentum Laser ---
export class MomentumLaserProjectile implements Projectile {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;
    speedX: number;

    constructor(x: number, y: number, speed: number, speedX: number, color: string = Constants.PLAYER_LASER_COLOR) {
        this.x = x;
        this.y = y;
        this.width = Constants.LASER_WIDTH;
        this.height = Constants.LASER_HEIGHT;
        this.color = color;
        this.speed = speed;
        this.speedX = speedX;
    }

    update() {
        this.y += this.speed;
        this.x += this.speedX;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.y + this.height < 0 || this.x + this.width < 0 || this.x > Constants.CANVAS_WIDTH;
    }
}
export class MomentumLaser extends Weapon {
    fire(x: number, y: number, playerSpeedX: number): Projectile[] {
        const projectile = new MomentumLaserProjectile(
            x + Constants.PLAYER_WIDTH / 2 - Constants.LASER_WIDTH / 2,
            y,
            Constants.PLAYER_LASER_SPEED,
            playerSpeedX * 0.5
        );
        this.projectiles.push(projectile);
        return [projectile];
    }

    updateProjectiles(): void {
        for (const projectile of this.projectiles) {
            projectile.update();
        }
        this.clearOffScreenProjectiles();
    }

    drawProjectiles(ctx: CanvasRenderingContext2D): void {
        for (const projectile of this.projectiles) {
            projectile.draw(ctx);
        }
    }
}

// --- Wiggle Laser ---
export class WiggleLaserProjectile extends BasicLaserProjectile {
    offsetX: number; // Horizontal offset
    amplitude: number = 10;  //  pixels
    frequency: number = 0.05; // Adjust for speed of the wiggle

    constructor(x: number, y: number, speed: number, offsetX:number, color: string = Constants.PLAYER_LASER_COLOR) {
        super(x,y, speed, color);
        this.offsetX = offsetX;
    }

    update() {
        this.y += this.speed;
        // Update x position based on a sine wave, and offset by offsetX
        this.x += Math.sin(this.y * this.frequency + this.offsetX) * this.amplitude;    }
}

export class WiggleLaser extends Weapon {
    fire(x: number, y: number, playerSpeedX: number): Projectile[] { //playerSpeedX unused.
        const projectile1 = new WiggleLaserProjectile(
            x + Constants.PLAYER_WIDTH / 2 - Constants.LASER_WIDTH / 2,
            y,
            Constants.PLAYER_LASER_SPEED,
            0 //initial phase
        );
        const projectile2 = new WiggleLaserProjectile(
            x + Constants.PLAYER_WIDTH / 2 - Constants.LASER_WIDTH / 2,
            y,
            Constants.PLAYER_LASER_SPEED,
            Math.PI // Offset by PI for opposite phase
        );
        this.projectiles.push(projectile1, projectile2);

        return [projectile1, projectile2];
    }

    updateProjectiles(): void {
        for (const projectile of this.projectiles) {
            projectile.update();
        }
        this.clearOffScreenProjectiles();
    }

    drawProjectiles(ctx: CanvasRenderingContext2D): void {
        for (const projectile of this.projectiles) {
            projectile.draw(ctx);
        }
    }
}