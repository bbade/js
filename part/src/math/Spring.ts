import { Vec2 } from "./vec2";

export class Spring {
    private k: number; // Spring constant
    private restLength: number; // Rest length of the spring
    private damper: Damper |  null;

    constructor(k: number, restLength: number, damper: Damper | null = null) {
        this.k = k;
        this.restLength = restLength;
        this.damper = damper;
    }

    calculateForce(object: Vec2, anchor: Vec2): Vec2 {
        // Calculate the vector from the object to the anchor
        const direction = object.pointAt(anchor);

        // Calculate the current length of the spring
        const magnitude = direction.length();

        // Calculate the extension/compression of the spring
        const extension = magnitude - this.restLength;

        // Normalize the force vector and scale it by the spring constant and extension
        const unitVector = direction.normalize();
        const tension = unitVector.scale(this.k * extension);

        if (this.damper) {
            this.damper.applyDampingForce(tension)
        }

        return tension;
    }
}

/**
 * This could probably be a method, not a class, but whatever
 */
export class Damper {
    private dampingCoefficient: number; // Damping coefficient

    constructor(amt: number) {
        this.dampingCoefficient = amt;
    }

    applyDampingForce(velocity: Vec2): Vec2 {
        // Calculate the damping force, which is proportional to the velocity and opposite in direction
        return velocity.scale(1-this.dampingCoefficient);
    }
}

