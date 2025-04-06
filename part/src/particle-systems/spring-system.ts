import { Color } from "../Color";
import { Rect } from "../math/geometry/Rect";
import { Damper, Spring } from "../math/Spring";
import { add, divS, mult, scale, vdistance, Vec2 } from "../math/vec2";
import { ParticleSystem } from "./interfaces";
import { Particle } from "./Particle";
import {   Mouse, UsefulContext } from "./particle-system-main";

class AppliedSpring {
    constructor(
        public readonly p1: Particle,
        public readonly p2: Particle,
        public readonly spring: Spring,
    ) {}

    apply() {
        const force: Vec2 = this.spring.calculateForce(this.p1.p, this.p2.p);
        const oppForce = Vec2.negate(force);
        applyForce(this.p1, force);
        applyForce(this.p2, oppForce); 

        this.p1.debugForces.push({f: force, c: Color.GREEN});
        this.p2.debugForces.push({f: oppForce, c: Color.GREEN});
    }
}

export class SpringParticleSystem implements ParticleSystem {
    particles: Particle[] = [];
    bounds: Rect;

    private bouncer: Particle;
    private anchor: Particle;
    private other: Particle;
    private springs: AppliedSpring[] = [];
    private gravityStrength = .05;
    private gravityDownVector: Vec2 = new Vec2(0, this.gravityStrength);
    private gravityPoint: Vec2;
    private isDragging: boolean = false;

    private damper = new Damper(.001);

    
    constructor(bounds: Rect) {
        this.bounds = bounds;

        const centerX = this.bounds.w / 2;
        const topY = this.bounds.y;

        this.gravityPoint = new Vec2(centerX, this.bounds.y + this.bounds.h*.5);
        
        this.anchor = Particle.fromArgs({
            x: centerX,
            y: bounds.y + bounds.h*.1,
            v :  new Vec2(), 
            color : Color.RED, size : 4,
            m: 30
        })
        this.bouncer = Particle.fromArgs({
            x: centerX, 
            y: bounds.y + bounds.h*.2,
            v :  new Vec2(),
            color : Color.MAGENTA, size : 4,
            m: 1
        })


        const otherPt = this.bouncer.p.pointAt(this.anchor.p).rotateDeg(this.bouncer.p, -45);
        this.other = Particle.fromArgs({
            x: otherPt.x,
            y: otherPt.y, 
            v :  new Vec2(), 
            color : Color.GREEN, size : 4,
            m: 1
        })

        const centerPt = this.findCenter(this.bouncer.p, this.anchor.p, this.other.p);
        const c_a_restlen = vdistance(centerPt, this.anchor.p);
        const c_b_restlen = vdistance(centerPt, this.bouncer.p);
        const c_o_restlen = vdistance(centerPt, this.other.p);
        const centerParticle = Particle.fromArgs({
            x: centerPt.x,
            y: centerPt.y, 
            v :  new Vec2(), 
            color : Color.CYAN, size : 4,
            m: 1
        });

        const k = 10;
        const restlen = bounds.h *.3
        const springTemplate = new Spring(k, restlen);
        this.springs.push(new AppliedSpring(this.bouncer, this.anchor, springTemplate ));
        this.springs.push(new AppliedSpring(this.bouncer, this.other, springTemplate ));
        this.springs.push(new AppliedSpring(this.other, this.anchor, springTemplate ));

        // connect center to everything
        this.springs.push(new AppliedSpring(centerParticle, this.anchor, new Spring(k, c_a_restlen)));
        this.springs.push(new AppliedSpring(centerParticle, this.bouncer, new Spring(k, c_b_restlen)));
        this.springs.push(new AppliedSpring(centerParticle, this.other, new Spring(k, c_o_restlen)));

        this.particles = [this.bouncer, this.anchor, this.other, centerParticle];
    }

    private findCenter(p1: Vec2, p2: Vec2, p3: Vec2): Vec2 {
        const x = (p1.x + p2.x + p3.x) / 3;
        const y = (p1.y + p2.y + p3.y) / 3;
        return new Vec2(x, y);
    }

    initialize(): void {
        // setup done in constructor, make a new instance if you need to reset
    }

    processFrame(deltaT: number, ctx: UsefulContext): void {
        // setup for frame. Put bouncer in the list so that the renderer renders it
        

        for ( const particle of this.particles) {
            particle.a = new Vec2();
            particle.debugForces = [];
            const g = getPointGravityVector(particle, this.gravityPoint, this.gravityStrength);
            applyGravity(particle, g);
            particle.debugForces.push({f: g, c: Color.YELLOW});

            for (const spring of this.springs) {
                spring.apply();
            }
        }

        this.bouncer.beingDragged = this.maybeHandleDrag(ctx)


        for (const particle of this.particles) {
            if (particle.beingDragged) {
                continue;
            } else {
                this.damper.applyDampingForce(particle.v);
                doEuler(particle, deltaT);
            }
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
        this.bouncer.beingDragged = true;
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

        for (const particle of this.particles) {
            for (const pf of particle.debugForces) {
                context.beginPath();
                context.moveTo(particle.x, particle.y);
                context.lineTo(particle.x + pf.f.x, particle.y + pf.f.y);
                context.strokeStyle = pf.c.toHexStr();
                context.stroke();
            }
        }


        // Draw a yellow circle at the gravity point
        context.beginPath();
        context.arc(this.gravityPoint.x, this.gravityPoint.y, 0.005, 0, 2 * Math.PI);
        context.fillStyle = 'yellow';
        context.fill();

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

function getPointGravityVector(particle: Particle, gravityLocation: Vec2, gravityStrength: number) {
    const dir = particle.p.pointAt(gravityLocation).normalize();
    const forceToApply = scale(dir, gravityStrength);
    return forceToApply;
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

    particle.debugForces.push({f: particle.v, c: Color.BLUE});
}