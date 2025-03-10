import { scale, Vec2 } from "./vec2";


export function applyAccelleration(target: Vec2, accel: Vec2, deltaMs: number) {
    const t = deltaMs / 1000;
    const a = scale(accel, t);
    target.add(a);
}

export function applyMovement(point: Vec2, v: Vec2, deltaMs: number) {
    const d = scale(v, deltaMs / 1000);
    point.add(d);
}

export class PointForce {
    p: Vec2;
    magnitude: number

    constructor(p: Vec2, magnitude: number) {
        this.p = p;
        this.magnitude = magnitude;
    }
}