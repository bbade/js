import { Vec2 } from "../math/vec2";

class Collision {
    constructor(
        public position: Vec2,
        public normal: Vec2,
        public timeMs: number,
    ) {
        
    }
}

// something that you can collide with, but which is not expected to interact with physics. 
interface Wall {

    testCollision(currentP: Vec2, velocity: Vec2, deltaTMs: number): boolean;

}