import { Color } from "../Color";
import { Rect } from "../math/Rect";
import { Damper, Spring } from "../math/Spring";
import { divS, scale, Vec2 } from "../math/vec2";
import { ParticleSystem } from "./interfaces";
import { Particle } from "./Particle";
import {   Mouse, UsefulContext } from "./particle-system-main";


export class PhysicsSystem implements ParticleSystem {
    particles: Particle[] = [];
    bounds: Rect;

    private bouncer: Particle;
    private anchor: Particle;
    private spring: Spring;
    private gravity: Vec2 = new Vec2(0, 1);
    private isDragging: boolean = false;

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

    processFrame(deltaT: number, ctx: UsefulContext): void {
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

        if (!this.maybeHandleDrag(ctx)) {
            // Integrate
            doEuler(this.bouncer, deltaT);
            this.damper.applyDampingForce(this.bouncer.v);
        }

    }

    maybeHandleDrag(ctx:UsefulContext): boolean { 
        const mouse: Vec2 | null = this.getMouseClick(ctx);
        if (mouse == null) {
            this.isDragging = false;
            return false;
        }
        if (mouse.distanceTo(this.bouncer.p) > .2) {
            this.isDragging = false;
            return false;
        }

        this.isDragging = true;
        this.bouncer.v = new Vec2(0, 0);
        this.bouncer.p = new Vec2(mouse.x, mouse.y);
        return true
    }
    
    getMouseClick(c: UsefulContext): Vec2 | null {
        // console.log(`lastMouseEvent type: ${lastMouseEvent?.type}, button?: ${lastMouseEvent?.buttons ==1}`);
        
        if (c.lastMouseEvent && c.lastMouseEvent.buttons === 1) { // Check for left click
            const rect = c.boundingClientRect
            const screenx = (c.lastMouseEvent.clientX - rect.left) /2; // TODO: this /2 works, but why???/
            const screeny = (c.lastMouseEvent.clientY - rect.top) /2; // TODO: this /2 works, but why???/
            const screenPoint = new Vec2(screenx, screeny);
            const mp = c.screenToWorldTransform.applyToVector2(screenPoint);
            const inBounds = this.bounds.contains(mp);

            console.log("---------------------");
            console.log(`Event clientX: ${c.lastMouseEvent.clientX}, clientY: ${c.lastMouseEvent.clientY}`);
            console.log(`BoundingClientRect: left: ${rect.left}, top: ${rect.top}, width: ${rect.width}, height: ${rect.height}`);
            console.log(`Bounds: ${JSON.stringify(this.bounds)}`);
            console.log(`Mouse click at screen coordinates: (${screenx.toFixed(4)}, ${screeny.toFixed(4)})`);
            console.log(`Transformed to world coordinates: (${mp.x.toFixed(4)}, ${mp.y.toFixed(4)})`);
            console.log("Mouse click is within bounds?: " + inBounds);
            console.log(`Bounds: (${this.bounds.x.toFixed(4)}, ${this.bounds.y.toFixed(4)}, ${this.bounds.w.toFixed(4)}, ${this.bounds.h.toFixed(4)})`);
            console.log(`Bouncer position: (${this.bouncer.p.x.toFixed(4)}, ${this.bouncer.p.y.toFixed(4)})`);
            
            if (inBounds) {
                return mp;
            } else {
                return null;
            }

          
        }
        return null;
    }

    
    drawOverlay(uc: UsefulContext): void {
        const context = uc.ctx;

        // Save the current transform
        context.save();
        context.lineWidth = .002;

        // Apply the screenToWorld transform
        uc.worldToScreenTransform.applyToCanvas2d(context);

        context.beginPath();
        context.moveTo(this.bouncer.x, this.bouncer.y);
        context.lineTo(this.anchor.x, this.anchor.y);
        context.strokeStyle = 'red';
        context.stroke();

        // Restore the previous transform
        context.restore();
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