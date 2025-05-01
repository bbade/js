import { Rect } from "../../math/geometry/Rect";
import { Vec2 } from "../../math/vec2";
import { BgRect } from "./BgRect";



export class RectSpawner {
    
    readonly intervalMs: number;
    readonly templateRects: BgRect[];

    // mutable state
    private timeSinceSpawn: number = 9999 *1000; // big number so we spawn right away

    
    constructor(
        templateRects: BgRect[],
        intervalMs: number,
    ) {
        this.templateRects = templateRects;
        this.intervalMs = intervalMs;   
    }

    update(
        deltaMs: number,
        cameraHeight: number,
        vpCenter: Vec2,
        bounds: Rect,
    ): BgRect[] | null 
    {
        this.timeSinceSpawn += deltaMs;
        if (this.timeSinceSpawn > this.intervalMs) {
            this.timeSinceSpawn = 0;
            return  this.spawn();
        } else {
            return null; 
        }
    }

    private spawn(): BgRect[] {
        const newRects = [] as BgRect[];
        this.templateRects.forEach((templateRect: BgRect) => {
            const newRect = templateRect.copy();
            newRects.push(newRect);
        });

        return newRects
    }
}


