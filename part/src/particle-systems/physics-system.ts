import { Color } from "../Color";
import { Rect } from "../math/Rect";
import { Damper, Spring } from "../math/Spring";
import { divS, scale, Vec2 } from "../math/vec2";
import { ParticleSystem } from "./interfaces";
import { Particle } from "./Particle";


export class PhysicsSystem implements ParticleSystem {
    particles: Particle[] = [];
    bounds: Rect;

    private bouncer: Particle;
    private anchor: Particle;
    private spring: Spring;
    private gravity: Vec2 = new Vec2(0, 1);

    private damper = new Damper(.001);

    
    constructor(bounds: Rect) {
        this.bounds = bounds;

        const centerX = this.bounds.w / 2;
        const topY = this.bounds.y;
        
        this.anchor = Particle.fromArgs({
            x: centerX, y: bounds.y + bounds.h*.1,
            v :  new Vec2(), color : Color.RED, size : 2
        })
        this.bouncer = Particle.fromArgs({
            x: centerX, y: bounds.y + bounds.h*.2,
            v :  new Vec2(), color : Color.MAGENTA, size : 2
        })

        const k = 10;
        const restlen = bounds.h *.2
        this.spring = new Spring(k, restlen);
    }

    initialize(): void {
        // setup done in constructor, make a new instance if you need to reset
    }

    processFrame(deltaT: number): void {
        // setup for frame. Put bouncer in the list so that the renderer renders it
        this.particles = [this.bouncer, this.anchor];

        for ( const particle of this.particles) {
            particle.a = new Vec2();
        }

        /// Update the Accel of everything in the simulation
        // TODO: we're just going to update the bouncer first
        applyGravity(this.bouncer, this.gravity);
        const springF: Vec2 = this.spring.calculateForce(this.bouncer.p, this.anchor.p)
        applyForce(this.bouncer,  springF);

        // Integrate
        doEuler(this.bouncer, deltaT);
        this.damper.applyDampingForce(this.bouncer.v);
    }

    
    drawOverlay(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.moveTo(this.bouncer.x, this.bouncer.y);
        context.lineTo(this.anchor.x, this.anchor.y);
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.stroke();
    }
}

/**
 * 
 * @param particle the particle to update. We will update it's accel field, but leave the v update to the integrator
 * @param force a vector to add to particle.a .  
 */
function applyForce(particle: Particle, force: Vec2) {
    // f = ma
    // a = f/m
    const a = divS(force, particle.m);
    particle.a.add(a);
}

function applyGravity(particle: Particle, gravity: Vec2) {
    particle.a.add(gravity);
}

/**
 * Update a particle's position and velocity using euler
 * @param particle the particle to update
 * @param dtMs elapsed miliseconds. 
 */
function doEuler(particle: Particle, dtMs: number) {
    const timeScale = dtMs / 1000;
    const deltaV = particle.a.scale(timeScale);
    particle.v.add(deltaV);
    const deltaP = scale(particle.v, timeScale);
    particle.p.add(deltaP);
}