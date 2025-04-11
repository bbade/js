import { Color } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { Vec2 } from "../../math/vec2";
import { SceneState } from "./RectGameIndex";
import { GameRect } from "./GameRect";
import { BgRectStack, getPerspectiveRect } from "./BgRectStack";

export class BackgroundManager implements Updateable {
  sceneState: SceneState;
  constructor(sceneState: SceneState) {
    this.sceneState = sceneState;
  }

  update(deltaMs: number): void {
    this.sceneState.background.stacks.forEach((stack) => {
      // update the stack position
      const deltaPos = stack.v.copy().scale(deltaMs / 1000);
      stack.topRect.center = stack.topRect.center.copy().add(deltaPos);

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
  constructor(public stacks: BgRectStack[]) {}
}

type BgFun = (bounds: Rect) => Background;

export const BackgroundMaker = {
  createBackground: (bounds: Rect): Background => {
    const pat =  pattern0(bounds);

    const stack = pat.stacks[0];
    BgRectStack.getRects(stack).forEach((r) => {
        console.log(JSON.stringify(r));
    });

    return pat;
  },
};

function pattern0(bounds: Rect): Background 
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

    }

function pattern1(bounds: Rect): Background {
    const stacks = [0, 0.2, 0.4, 0.6, 0.8].flatMap((percent) => [
        stackAt({
            percentX: 0.33,
            percentY: percent,
            xsize: 0.1,
            ysize: 0.1,
            v: new Vec2(0.3, 0.3),
            bounds: bounds,
            numRects: 1,
        }),
        // stackAt({
        //     percentX: 0.5,
        //     percentY: percent,
        //     xsize: 0.02,
        //     ysize: 0.02,
        //     v: new Vec2(0.3, 0.3),
        //     bounds: bounds,
        // }),
        // stackAt({
        //     percentX: 0.66,
        //     percentY: percent,
        //     xsize: 0.1,
        //     ysize: 0.1,
        //     v: new Vec2(0.3, 0.3),
        //     bounds: bounds,
        // }),
    ]);

    return new Background(stacks);

}


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
): BgRectStack {
    const centerX = a.bounds.x + a.percentX * a.bounds.w;
    const centerY = a.bounds.y + a.percentY * a.bounds.h;
    return {
        topRect: new GameRect(new Vec2(centerX, centerY), a.xsize, a.ysize, Color.RED, 0),
        bottomZ: 10,
        v: a.v,
        numRects: a.numRects, // Default size value
    };
}


function isStackOutOfBounds(
  bounds: Rect,
  stack: BgRectStack,
  state: SceneState
): boolean {
  const top = stack.topRect;
  const bottom = getPerspectiveRect(
    top,
    stack.bottomZ,
    state.cameraHeight,
    state.viewportCenter
  );

  const topRect = GameRect.toRect(top);
  const bottomRect = GameRect.toRect(bottom);
  const eitherInBounds =
    Rect.intersects(topRect, bounds) || Rect.intersects(bottomRect, bounds);
  return !eitherInBounds;
}
