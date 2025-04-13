import { Rect } from "../../math/geometry/Rect";
import { Vec2 } from "../../math/vec2";
import { BgRectStack2 } from "./BgRectStack";



export class RectSpawner {
    
    readonly intervalMs: number;
    readonly templateStacks: BgRectStack2[];

    // mutable state
    private timeSinceSpawn: number = 9999 *1000; // big number so we spawn right away

    
    constructor(
        templateStacks: BgRectStack2[],
        intervalMs: number,
    ) {
        this.templateStacks = templateStacks;
        this.intervalMs = intervalMs;   
    }

    update(
        deltaMs: number,
        cameraHeight: number,
        vpCenter: Vec2,
        bounds: Rect,
    ): BgRectStack2[] | null 
    {
        this.timeSinceSpawn += deltaMs;
        if (this.timeSinceSpawn > this.intervalMs) {
            this.timeSinceSpawn = 0;
            return  this.spawnStacks();
        } else {
            return null; 
        }
    }

    private spawnStacks() {
        const newStacks = [] as BgRectStack2[];
        this.templateStacks.forEach((template) => {
            const newStack = template.copy();
            newStack.topRect.center = newStack.topRect.center.copy().add(newStack.v.copy().scale(0.1));
            newStacks.push(newStack);
        });

        return newStacks
    }
}


