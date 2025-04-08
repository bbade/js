import { Color } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { isOutOfBounds } from "../../math/math";
import { Vec2 } from "../../math/vec2";
import { SceneState } from "./RectGameIndex";
import { BgRectStack, GameRect, getPerspectiveRect } from "./RectUtils";

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

        console.log("stack.v:", stack.v);
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
    return {
      stacks: [stackAtCenter(bounds)],
    };
  },
};


function stackAtCenter(bounds: Rect): BgRectStack {
  return {
    topRect: rectAtCenter(bounds),
    bottomZ: 10,
    v: new Vec2(.1, 0),
    size: 10, // Default size value
  }
}

function stackAtBottomRight(bounds: Rect): BgRectStack {
  return {
    topRect: rectAtBottomRight(bounds),
    bottomZ: 10,
    v: bounds.x1y1.pointAt(bounds.p).normalize(),
    size: 10, // Default size value
  };
}

function rectAtBottomRight(bounds: Rect): GameRect {
  return new GameRect(new Vec2(bounds.x1, bounds.y), 0.2, Color.RED, 0);
}

function rectAtCenter(bounds: Rect): GameRect {
  return new GameRect((new Vec2(.2,0).add(bounds.center)), 0.2, Color.RED, 0);
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
  return !Rect.intersects(top.r, bottom);
}
