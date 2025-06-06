import { ParticleSystem, ParticleConfigure } from './interfaces';
import { Rect } from "../math/geometry/Rect";
import { Color, scaleBrightness_deprecated } from "../Color";
import { Particle } from './Particle';
import { Vec2 } from '../math/vec2';
import { lerp, randomRange, takeRandom } from '../math/math';
import { Circle, CircleUnion } from '../math/geometry/Circle';
import { Mouse } from './particle-system-main';

const spec = {
    numCloudParticles: 400,
    cloudSpeed: 0.2,
    rainProbability: 0.2,
    rainCooldown: 3000, // in milliseconds
    rainSpeed: 0.05,
    cloudSpawn: new Rect(0, 0, 1, .15),
    cloudSpawnInterval: 1000,
    g: 1,
    mouseAccel: 1, // silly
    palette : [
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
    ],
};

export class CloudSystem implements ParticleSystem {
    particles: Particle[] = [];
    cloudParticles: Particle[] = [];
    rainParticles: Particle[] = [];
    cloudV: Vec2 = new Vec2(-.7, 0);
    gravity: Vec2 = new Vec2(0, spec.g);
    rainFriction: Vec2 = new Vec2(.3, 0);
    bounds: Rect;
    rainCooldown: number = 0;
    cloudSpawnTimer: number = spec.cloudSpawnInterval; // ms

    constructor(bounds: Rect) {
        this.bounds = bounds;
    }

    initialize(): void {
        console.log(this.bounds);
        this.spawnCloud();
    }

    private spawnCloud() {
        // make a cloud
        const downscale = .75;
        let r = .1
        const baselineY = .2;
        let x = 1 + r;
        const circles = [];

        for (let i = 0; i < 5; i++) {
            const c = Circle.onBaseline(x, baselineY, r);
            circles.push(c);
            x += r * 1.2;
            r *= downscale
        }

        const cloud = new CircleUnion(circles);

        for (let i = 0; i < spec.numCloudParticles; i++) {
            this.spawnCloudParticle(cloud);
        }
    }

    private spawnCloudParticle(cloud: CircleUnion) {
        const p = cloud.randomPoint();
        const v = this.cloudV.copy();
        const clr = new Color(255, 255, 255);
        scaleBrightness_deprecated(clr, 1 - Math.random() * .2)

        const particle = Particle.create(p, v, clr);
        this.cloudParticles.push(particle);
    }

    processFrame(deltaT: number): void {

        /////// mouse silliness

        const m = Mouse;

        ///////// ^^^^^^^^^^^^^^^


        this.cloudSpawnTimer -= deltaT;
        if (this.cloudSpawnTimer <= 0) {
            this.spawnCloud();
            this.cloudSpawnTimer = spec.cloudSpawnInterval;
        }

        for (const c of this.cloudParticles) {
            if (m) { /// silly
                const mouseVec: Vec2 = c.p.pointAt(m).normalize().scale(spec.mouseAccel);
                c.applyForce(mouseVec, deltaT);
            } /// end silly

            c.moveAndUpdateAge(deltaT);

            this.maybeSpawnRain(c);
        }

        this.cloudParticles = this.cloudParticles.filter((p) => {
           return  p.p.y <= this.bounds.y1 + p.draw_size_px && 
           p.p.x >= -2 * this.bounds.w && 
           p.p.x <= 2 * this.bounds.w
           && p.ageMs < 30*1000
        });


        //////////////
        // do rain
        /////////////

        for (const r of this.rainParticles) {
            r.applyForce(this.gravity, deltaT);
            r.applyForce(this.rainFriction, deltaT);

            /// silly
            if (m) {
                const mouseVec: Vec2 = r.p.pointAt(m).normalize().scale(spec.mouseAccel);
                r.applyForce(mouseVec, deltaT);
            }/// end silly

            r.moveAndUpdateAge(deltaT);

        }

        this.rainParticles = this.rainParticles.filter((r) => {
            return r.p.y <= this.bounds.y1 + r.draw_size_px && 
               r.p.x >= -2 * this.bounds.w && 
               r.p.x <= 2 * this.bounds.w
               && r.ageMs < 30*1000
               ;
        });

        /// output //
        this.particles = this.rainParticles.concat(this.cloudParticles);

    }


    maybeSpawnRain(cloudParticle: Particle): void {
        if (Math.random() > 0.02) {
            return
        }
        const rainParticle = Particle.create();
        rainParticle.p = new Vec2(cloudParticle.p.x, cloudParticle.p.y);
        rainParticle.v = cloudParticle.v.copy();
        rainParticle.color =  takeRandom(spec.palette);
        rainParticle.draw_size_px = 1
        this.rainParticles.push(rainParticle);
    }




    /////// mouse code /////////////////

    mouseForce: Vec2 | null = null;

}
