import { Rect } from "../../math/geometry/Rect";
import { Vec2 } from "../../math/vec2";
import { GameRect } from "./GameRect";



export class RectSpawner {
    
    readonly intervalMs: number;
    readonly templateRects: GameRect[];

    // mutable state
    private timeSinceSpawn: number = 9999 *1000; // big number so we spawn right away

    
    constructor(
        templateRects: GameRect[],
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
    ): GameRect[] | null 
    {
        this.timeSinceSpawn += deltaMs;
        if (this.timeSinceSpawn > this.intervalMs) {
            this.timeSinceSpawn = 0;
            return  this.spawn();
        } else {
            return null; 
        }
    }

    private spawn(): GameRect[] {
        const newRects = [] as GameRect[];
        this.templateRects.forEach((templateRect: GameRect) => {
            const newRect = templateRect.copy();
            newRects.push(newRect);
        });

        return newRects
    }
}


