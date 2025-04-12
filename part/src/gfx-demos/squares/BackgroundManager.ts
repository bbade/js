import { Color } from "../../Color";
import { Rect, RectUtils } from "../../math/geometry/Rect";
import { Vec2 } from "../../math/vec2";
import { SceneState } from "./RectGameIndex";
import { GameRect } from "./GameRect";
import { BgRectStack2, getPerspectiveRect } from "./BgRectStack";
import { RectSpawner } from "./RectSpawner";

export class BackgroundManager implements Updateable {
  sceneState: SceneState;
  private readonly rectSpawner: RectSpawner | null = null;

  constructor(
    sceneState: SceneState,
    rectSpawner: RectSpawner | null = null // not used yet
  ) {
    this.sceneState = sceneState;
    this.rectSpawner = rectSpawner;
  }

  update(deltaMs: number): void {
    // update position and age
    this.sceneState.background.stacks.forEach((stack) => {
      BackgroundManager.updateStack(deltaMs, stack);
    }); // end for-each

    // prune
    const updatedStacks = BackgroundManager.pruneStacks(
      this.sceneState.background.stacks,
      this.sceneState.bounds,
      this.sceneState.cameraHeight,
      this.sceneState.viewportCenter
    );

    this.sceneState.background.stacks = updatedStacks;

    // spawn new stacks
    const newStacks = this.rectSpawner?.update(
      deltaMs,
      this.sceneState.cameraHeight,
      this.sceneState.viewportCenter,
      this.sceneState.bounds
    )

    this.sceneState.background.stacks.push(...(newStacks || []));


  } // end update

  private static updateStack(deltaMs: number, stack: BgRectStack2) {
    const deltaPos = stack.v.copy().scale(deltaMs / 1000);
    stack.topRect.center = stack.topRect.center.copy().add(deltaPos);
    stack.ageMs += deltaMs;
  }

  private static pruneStacks(
    stacks: BgRectStack2[],
    bounds: Rect,
    cameraHeight: number,
    viewportCenter: Vec2
  ): BgRectStack2[] {
    function shouldKeep(stack: BgRectStack2): boolean {
      const shouldRemove =
        isStackOutOfBounds(bounds, stack, cameraHeight, viewportCenter) &&
        !RectUtils.willIntersect(
          GameRect.toRect(stack.topRect),
          stack.v,
          bounds
        );

      return !shouldRemove;
    }

    return stacks.filter(shouldKeep);
  }
} // end backgroundmanager

export class Background {
  constructor(public stacks: BgRectStack2[] = []) {}

  // ========= region: static methods ==========

  static pattern0(bounds: Rect): Background {
    return new Background([
      stackAt({
        percentX: 0.2,
        percentY: 0.2,
        xsize: 0.1,
        ysize: 0.1,
        v: new Vec2(0.1, 0.1),
        bounds: bounds,
        numRects: 3,
      }),
    ]);
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

function stackAt(a: {
  percentX: number;
  percentY: number;
  xsize: number;
  ysize: number;
  v: Vec2;
  bounds: Rect;
  numRects: number;
}): BgRectStack2 {
  const centerX = a.bounds.x + a.percentX * a.bounds.w;
  const centerY = a.bounds.y + a.percentY * a.bounds.h;
  return BgRectStack2.fromObject({
    topRect: new GameRect(
      new Vec2(centerX, centerY),
      a.xsize,
      a.ysize,
      Color.RED,
      0
    ),
    topZ: 0,
    zStep: 1,
    v: a.v,
    numRects: a.numRects, // Default size value
  });
}

function isStackOutOfBounds(
  bounds: Rect,
  stack: BgRectStack2,
  cameraHeight: number,
  viewportCenter: Vec2
): boolean {
  const top = stack.topRect;
  const bottom = BgRectStack2.bottomRect(stack, cameraHeight, viewportCenter);

  const topRect = GameRect.toRect(top);
  const bottomRect = GameRect.toRect(bottom);
  const eitherInBounds =
    Rect.intersects(topRect, bounds) || Rect.intersects(bottomRect, bounds);
  return !eitherInBounds;
}




export function RectSpawner1(bounds: Rect): RectSpawner {
  const numRects = 8;
  const v = new Vec2(.26, .26);
  const stacks = [0, 0.2, 0.4, 0.6, 0.8].flatMap((percent) => [
    stackAt({
      percentX: 0.1,
      percentY: percent,
      xsize: 0.1,
      ysize: 0.1,
      v: v,
      bounds: bounds,
      numRects: numRects,
    }),
    stackAt({
      percentX: 0.33,
      percentY: percent,
      xsize: 0.1,
      ysize: 0.1,
      v: v,
      bounds: bounds,
      numRects: numRects,
    }),
    stackAt({
      percentX: 0.5,
      percentY: percent,
      xsize: 0.02,
      ysize: 0.02,
      v: v,
      bounds: bounds,
      numRects: numRects,
    }),
    stackAt({
      percentX: 0.66,
      percentY: percent,
      xsize: 0.1,
      ysize: 0.1,
      v: v,
      bounds: bounds,
      numRects: numRects,
    }),
    stackAt({
      percentX: 0.99,
      percentY: percent,
      xsize: 0.1,
      ysize: 0.1,
      v: v,
      bounds: bounds,
      numRects: numRects,
    }),
  ]);

  stacks.push(    stackAt({
    percentX: -.1,
    percentY: .6,
    xsize: 0.1,
    ysize: 0.1,
    v: v,
    bounds: bounds,
    numRects: numRects,
  }),)

  stacks.forEach((stack) => {
    stack.topRect.r.translate(stack.v.copy().scale(-8));
  });

  return new RectSpawner(stacks, 1000);
}