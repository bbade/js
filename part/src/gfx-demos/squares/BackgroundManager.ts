import { Color } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { Vec2 } from "../../math/vec2";
import { SceneState } from "./RectGameIndex";
import { GameRect } from "./GameRect";
import { BgRectStack2, getPerspectiveRect } from "./BgRectStack";
import { RectSpawner } from "./RectSpawner";

export class BackgroundManager implements Updateable 
{
  sceneState: SceneState;
  private readonly rectSpawner: RectSpawner | null = null;

  constructor(
    sceneState: SceneState,
    rectSpawner: RectSpawner| null = null // not used yet
  ) {
    this.sceneState = sceneState;
  }

  update(deltaMs: number): void {

    


    this.sceneState.background.stacks.forEach((stack) => {
      // update the stack position
      const deltaPos = stack.v.copy().scale(deltaMs / 1000);
      stack.topRect.center = stack.topRect.center.copy().add(deltaPos);
      stack.ageMs += deltaMs;

      // console.log("stack.v:", stack.v);
      // console.log("deltaMs:", deltaMs);
      // console.log("deltaPos:", deltaPos);
      // console.log("new center:", stack.topRect.center);

      if (isStackOutOfBounds(this.sceneState.bounds, stack, this.sceneState)) {
        stack.v.scale(-1);
      }
    }); // end for-each
  } // end update
} // end backgroundmanager

export class Background {
  constructor(public stacks: BgRectStack2[]= []) {}

  // ========= region: static methods ==========

  static  pattern0(bounds: Rect): Background 
      {
          return new Background([stackAt({
              percentX: 0.2,
              percentY: .2,
              xsize: 0.1,
              ysize: 0.1,
              v: new Vec2(0.1, 0.1),
              bounds: bounds,
              numRects: 3,
          })])
  
      } // end pattern0

      static pattern1(bounds: Rect): Background {
        const numRects = 8;
        const stacks = [0, 0.2, 0.4, 0.6, 0.8].flatMap((percent) => [
          stackAt({
            percentX: 0.1,
            percentY: percent,
            xsize: 0.1,
            ysize: 0.1,
            v: new Vec2(0.3, 0.3),
            bounds: bounds,
            numRects: numRects,
        }),
            stackAt({
                percentX: 0.33,
                percentY: percent,
                xsize: 0.1,
                ysize: 0.1,
                v: new Vec2(0.3, 0.3),
                bounds: bounds,
                numRects: numRects,
            }),
            stackAt({
                percentX: 0.5,
                percentY: percent,
                xsize: 0.02,
                ysize: 0.02,
                v: new Vec2(0.3, 0.3),
                bounds: bounds,
                numRects: numRects,

            }),
            stackAt({
                percentX: 0.66,
                percentY: percent,
                xsize: 0.1,
                ysize: 0.1,
                v: new Vec2(0.3, 0.3),
                bounds: bounds,
                numRects: numRects,

            }),
            stackAt({
              percentX: 0.99,
              percentY: percent,
              xsize: 0.1,
              ysize: 0.1,
              v: new Vec2(0.3, 0.3),
              bounds: bounds,
              numRects: numRects,
          }),
        ]);
    
        return new Background(stacks);
    
    } // end pattern1
} // end class Background



function stackAt(
    a: {
        percentX: number;
        percentY: number;
        xsize: number;
        ysize: number;
        v: Vec2;
        bounds: Rect;
        numRects: number;
    }
): BgRectStack2 {
    const centerX = a.bounds.x + a.percentX * a.bounds.w;
    const centerY = a.bounds.y + a.percentY * a.bounds.h;
    return {
        topRect: new GameRect(new Vec2(centerX, centerY), a.xsize, a.ysize, Color.RED, 0),
        topZ: 0,
        zStep: 1,
        v: a.v,
        numRects: a.numRects, // Default size value
    };
}


function isStackOutOfBounds(
  bounds: Rect,
  stack: BgRectStack2,
  state: SceneState
): boolean {
  const top = stack.topRect;
  const bottom = BgRectStack2.bottomRect(stack, state.cameraHeight, state.viewportCenter);

  const topRect = GameRect.toRect(top);
  const bottomRect = GameRect.toRect(bottom);
  const eitherInBounds =
    Rect.intersects(topRect, bounds) || Rect.intersects(bottomRect, bounds);
  return !eitherInBounds;
}

