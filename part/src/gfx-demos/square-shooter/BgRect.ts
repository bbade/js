import { Color, scaleBrightness } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { clamp } from "../../math/math";
import { Vec2 } from "../../math/vec2";
import { ScalarAnimation } from "./Animations";
import { SceneState } from "./RectGameBgMain";

export class BgRect implements Updateable {

  public readonly r: Rect;

  constructor(
     center: Vec2,
     xsize: number,
     ysize: number,
    public color: Color,
    public z: number,
    public v: Vec2,
    public ageMs: number = 0,
    public rotateAnimation: ScalarAnimation | null = null,
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

  copy(): BgRect {
    return BgRect.copy(this);
  }

  get rotation(): number {
    if (this.rotateAnimation === undefined) {
      // can be null or defined, but not undefined. 
      throw new Error("rotateAnimation is undefined");
    }
    const animation = this.rotateAnimation;
    
    if (animation) {
      return animation.getValue(this.ageMs);
    } else {
      return 0;
    }
  }

  static copy(gr: BgRect): BgRect {
    return new BgRect(
      new Vec2(gr.center.x, gr.center.y),
      gr.xsize,
      gr.ysize,
      gr.color,
      gr.z,
      gr.v.copy(),
      gr.ageMs,
      gr.rotateAnimation,
    );
  }

  static from(args: {
    center: Vec2;
    xsize: number;
    ysize: number;
    color: Color;
    z: number;
    v: Vec2;
  }): BgRect {
    return new BgRect(
      args.center,
      args.xsize,
      args.ysize,
      args.color,
      args.z,
      args.v,
    );
  }

  static fromRect(r: Rect, color: Color, z: number, v: Vec2, ageMs: number = 0): BgRect {
    return new BgRect(
      new Vec2(r.x + r.w / 2, r.y + r.h / 2),
      r.w,
      r.h,
      color,
      z,
      v,
      ageMs,
    );
  }

  static toRect_deprecated(gr: BgRect): Rect {
    return new Rect(
      gr.center.x - gr.xsize / 2,
      gr.center.y - gr.ysize / 2,
      gr.xsize,
      gr.ysize
    );
  }

   update(deltaMs: number): void {
    const deltaPos = this.v.copy().scale(deltaMs / 1000);
    this.center = this.center.add(deltaPos);
    this.ageMs += deltaMs;
    // this.z -= .01;

    // console.log(`center: ${this.center}, v: ${this.v}, z: ${this.z}, deltaMs: ${deltaMs}`);
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



