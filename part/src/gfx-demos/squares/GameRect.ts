import { Color, scaleBrightness } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { clamp } from "../../math/math";
import { Vec2 } from "../../math/vec2";
import { SceneState } from "./RectGameIndex";

export class GameRect implements Updateable {

  public readonly r: Rect;
  rotateAnimation: ScalarAnimation | null = null;

  constructor(
     center: Vec2,
     xsize: number,
     ysize: number,
    public color: Color,
    public z: number,
    public v: Vec2 = new Vec2(0, 0),
    public ageMs: number = 0,
  ) {
    this.r = new Rect(center.x - xsize / 2, center.y - ysize / 2, xsize, ysize);
  }

  get center(): Vec2 {
    return new Vec2(this.r.x + this.r.w / 2, this.r.y + this.r.h / 2);
  }

  get p(): Vec2 {
    return new Vec2(this.r.x, this.r.y);
  } 

  set center(newCenter: Vec2) {
    this.r.x = newCenter.x - this.r.w / 2;
    this.r.y = newCenter.y - this.r.h / 2;
  }

  get xsize(): number {
    return this.r.w;
  }

  get ysize(): number {
    return this.r.h;
  }

  copy(): GameRect {
    return GameRect.copy(this);
  }

  get rotation(): number {
    const animation = this.rotateAnimation;
    if (animation) {
      return animation.getValue(this.ageMs);
    } else {
      return 0;
    }
  }

  static copy(gr: GameRect): GameRect {
    return new GameRect(
      new Vec2(gr.center.x, gr.center.y),
      gr.xsize,
      gr.ysize,
      gr.color,
      gr.z,
      gr.v.copy(),
      gr.ageMs
    );
  }

  static from(args: {
    center: Vec2;
    xsize: number;
    ysize: number;
    color: Color;
    z: number;
  }): GameRect {
    return new GameRect(
      args.center,
      args.xsize,
      args.ysize,
      args.color,
      args.z
    );
  }

  static fromRect(r: Rect, color: Color, z: number): GameRect {
    return new GameRect(
      new Vec2(r.x + r.w / 2, r.y + r.h / 2),
      r.w,
      r.h,
      color,
      z
    );
  }

  static toRect_deprecated(gr: GameRect): Rect {
    return new Rect(
      gr.center.x - gr.xsize / 2,
      gr.center.y - gr.ysize / 2,
      gr.xsize,
      gr.ysize
    );
  }

   update(deltaMs: number): void {
    this.ageMs += deltaMs;
  }

}


// // assumes top of stack is at z=0, bottom is at a postiive z = zOfBottom
// export  function drawStack(
//   stack: BgRectStack,
//   state: SceneState,
//   context: CanvasRenderingContext2D
// ) {
//   const n = stack.numRects;
//   const bottomZ = stack.bottomZ
//   const zStep = stack.bottomZ / (n - 1);
//   const windowCenter = state.viewportCenter;
//   const cameraHeight = state.cameraHeight;
//   const original = stack.topRect;

//   // draw back to front
//   for (let i = 0; i < n; i++) {
//     const z = bottomZ - i * zStep;
//     drawPerspectiveRect(original, z, cameraHeight, windowCenter, context);
//   }
// }



