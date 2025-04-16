import { Color } from "../../Color";
import { Rect, RectUtils } from "../../math/geometry/Rect";
import { Vec2 } from "../../math/vec2";
import { SceneState } from "./RectGameIndex";
import { GameRect } from "./GameRect";
import { BgRectStack2, getPerspectiveRect, projectRect } from "./BgRectStack";
import { RectSpawner } from "./RectSpawner";
import { slowRotateAnimation } from "./Animations";

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
    // console.log(`Managing ${this.sceneState.background.rects.length} rects.`);

    // update position and age
    this.sceneState.background.rects.forEach((rect: GameRect) => {
      // console.log(`Rect: ${rect.r.toString()}, Timestamp: ${rect.ageMs}`);
      rect.update(deltaMs);
    }); // end for-each

    // prune
    const updatedRects = BackgroundManager.pruneRects(
      this.sceneState.background.rects,
      this.sceneState.bounds,
      this.sceneState.cameraHeight,
      this.sceneState.viewportCenter
    );

    this.sceneState.background.rects = updatedRects;

    // spawn new stacks
    const spawner = this.rectSpawner;
    if (spawner != null) {
      const newRects: GameRect[] | null = spawner.update(
        deltaMs,
        this.sceneState.cameraHeight,
        this.sceneState.viewportCenter,
        this.sceneState.bounds
      );

      this.sceneState.background.rects.push(...(newRects || []));
    }
  } // end update

  private static updateRect(deltaMs: number, rect: GameRect): void {}

  private static pruneRects(
    rects: GameRect[],
    bounds: Rect,
    cameraHeight: number,
    viewportCenter: Vec2
  ): GameRect[] {
    function shouldKeep(gameRect: GameRect): boolean {
      const visible = isRectVisible(
        bounds,
        gameRect,
        cameraHeight,
        viewportCenter
      );
      const noFutureIntersection = !RectUtils.willIntersect(
        gameRect.r,
        gameRect.v,
        bounds
      );
      const shouldRemove = !visible && noFutureIntersection;

      // console.log(`Checking rect: ${gameRect.r.toString()}, Velocity: ${gameRect.v.toString()}, Age: ${gameRect.ageMs}`);
      // console.log(`Out of bounds: ${!visible}, No future intersection: ${noFutureIntersection}`);
      // console.log(`Rect JSON: ${JSON.stringify(gameRect.r)},\n Bounds JSON: ${JSON.stringify(bounds)}`);

      return !shouldRemove; // todo, this logic is buggy
    }

    return rects; // .filter(shouldKeep); // TODO TODO TODO UNCOMMENT
  }
} // end backgroundmanager

export class Background {
  constructor(public rects: GameRect[] = []) {}

  // ========= region: static methods ==========

  static pattern0(bounds: Rect): Background {
    return new Background([
      new GameRect(
        new Vec2(bounds.w / 4, bounds.h / 4),
        0.1,
        0.1,
        Color.RED,
        0,
        new Vec2()
      ),
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

    return new Background(stacks.flat());
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
  color?: Color; // Marked as optional
  zStep?: number; // Marked as optional
  topZ?: number
}): GameRect[] {
  const centerX = a.bounds.x + a.percentX * a.bounds.w;
  const centerY = a.bounds.y + a.percentY * a.bounds.h;
  return BgRectStack2.fromObject({
    topRect: new GameRect(
      new Vec2(centerX, centerY),
      a.xsize,
      a.ysize,
      a.color ?? Color.RED,
      a.topZ ?? 0,
      a.v
    ),
    zStep: a.zStep ?? 1,
    numRects: a.numRects, // Default size value
  }).allRects();
}


function isRectVisible(
  bounds: Rect,
  gameRect: GameRect,
  cameraHeight: number,
  viewportCenter: Vec2
): boolean {
  const projected = projectRect(
    gameRect.r,
    gameRect.z,
    cameraHeight,
    viewportCenter
  );

  return Rect.intersects(bounds, projected);
}

export function RectSpawner1(bounds: Rect): RectSpawner {
  const numRects = 8;
  const v = new Vec2(0.26, 0.26);
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

  stacks.push(
    stackAt({
      percentX: -0.1,
      percentY: 0.6,
      xsize: 0.1,
      ysize: 0.1,
      v: v,
      bounds: bounds,
      numRects: numRects,
    })
  );

  // stacks.forEach((gameRect: GameRect) => {
  //   gameRect: GameRect.topRect.r.translate(gameRect: GameRect.v.copy().scale(-8));
  // });

  return new RectSpawner(stacks.flat(), 1000);
}

export function RectSpawner2(bounds: Rect): RectSpawner {
  const stacks = [] as GameRect[];
  const numRects = 26;
  const zStep = 0.1;
  const v = new Vec2(0, -0.2);
  const streetLevel = zStep * numRects;

  const street = bounds.copy();
  street.scale(1.8, true);
  street.translate(new Vec2(0, street.h * 1.3));
  const xpadding = street.w * 0.2;
  const hpadding = street.h * 0.18;

  const buildingSize = Math.min(bounds.w, bounds.h) * 0.2;
  const buildingStart = new Vec2(
    street.x + xpadding,
    bounds.y + hpadding + 5 * buildingSize
  );
  const buildingRect = Rect.fromV2wh(buildingStart, buildingSize, buildingSize);

  const streetStack = BgRectStack2.fromObject({
    topRect: GameRect.fromRect(street, Color.GRAY, streetLevel, v),
    zStep: 1, // only one layer, doesn't matter
    numRects: 1,
  });

  // stacks.push(...streetStack.allRects());

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 5; x++) {
      const tx = (x - 0.5) * (buildingSize + xpadding) + buildingStart.x;
      const ty = y * (buildingSize + hpadding) + buildingStart.y;
      const offset = new Vec2(tx, ty);
      const topRect: Rect = buildingRect.copy().translate(offset);
      const buildingStack = BgRectStack2.fromObject({
      topRect: GameRect.fromRect(topRect, Color.RED, 0, v),
      zStep: zStep,
      numRects: numRects,
      });

      const middleRect = topRect.copy();
      middleRect.h = middleRect.h*1.5;
      middleRect.scale(1.5, true); // Make it rectangle-shaped
      middleRect.x -= .12;
      middleRect.y +=1
      const middleStack = BgRectStack2.fromObject({
        topRect: GameRect.fromRect(middleRect, Color.GREEN, 4 + 5* (x%2), v),
        zStep: zStep*3,
        numRects: numRects,
      });


      stacks.push(...middleStack.allRects());

      stacks.push(...buildingStack.allRects());
    }
  }

  return new RectSpawner(stacks, 9500);
}

export function RectSpawner3(bounds: Rect): RectSpawner {
  const stack = [] as GameRect[];
  const numRects = 250;
  const zStep = .2;
  const topZ = 0;
  const v = new Vec2();

  const center = new Vec2(bounds.x + bounds.w / 2, bounds.y + bounds.h / 4);
  const size = Math.min(bounds.w, bounds.h) * 0.2;

  const centerRect = Rect.fromV2wh(center, size, size);
  const topRect = GameRect.fromRect(centerRect, Color.MAGENTA, topZ, v);

  const centerStack = BgRectStack2.fromObject({
    topRect: topRect,
    zStep: zStep,
    numRects: numRects,
  });

  stack.push(...centerStack.allRects());
  stack.forEach((rect: GameRect, i: number) => {
    const  speedup =1; //1 + .04*i;
    rect.rotateAnimation = slowRotateAnimation(4* i,speedup );
    rect.r.translate(new Vec2(0, .01*i));
    rect.v = new Vec2((Math.random()-.5), (Math.random()-.5)).scale(.2);

  });

  return new RectSpawner(stack, 800000);
}
