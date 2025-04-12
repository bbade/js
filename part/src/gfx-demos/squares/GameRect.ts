import { Color, scaleBrightness } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { clamp } from "../../math/math";
import { Vec2 } from "../../math/vec2";
import { SceneState } from "./RectGameIndex";

export class GameRect {
  constructor(
    public center: Vec2,
    public xsize: number,
    public ysize: number,
    public color: Color,
    public z: number
  ) {}

  static copy(gr: GameRect): GameRect {
    return new GameRect(
      new Vec2(gr.center.x, gr.center.y),
      gr.xsize,
      gr.ysize,
      gr.color,
      gr.z
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

  static toRect(gr: GameRect): Rect {
    return new Rect(
      gr.center.x - gr.xsize / 2,
      gr.center.y - gr.ysize / 2,
      gr.xsize,
      gr.ysize
    );
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



