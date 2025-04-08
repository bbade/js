import { Color, scaleBrightness } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { clamp } from "../../math/math";
import { Vec2 } from "../../math/vec2";
import { SceneState } from "./RectGameIndex";


export class GameRect {
    constructor(
      public center: Vec2,
      public size: number,
      public color: Color,
      public z: number
    ) {}

    static from(args: {
      center: Vec2;
      size: number;
      color: Color;
      z: number;
    }): GameRect {
      return new GameRect(args.center, args.size, args.color, args.z);
    }
  
    get r(): Rect {
      return new Rect(
        this.center.x - this.size / 2,
        this.center.y - this.size / 2,
        this.size,
        this.size
      );
    }
  }

  export class BgRectStack {
    constructor(
        public topRect: GameRect,
        public bottomZ: number,
        public v: Vec2,
        public size: number = 10
    ) {}
  }
  
  // assumes top of stack is at z=0, bottom is at a postiive z = zOfBottom
  export  function drawStack(
    stack: BgRectStack,
    state: SceneState,
    context: CanvasRenderingContext2D
  ) {
    const n = stack.size;
    const bottomZ = stack.bottomZ
    const zStep = stack.bottomZ / (n - 1);
    const windowCenter = state.viewportCenter;
    const cameraHeight = state.cameraHeight;
    const original = stack.topRect;
  
    // draw back to front
    for (let i = 0; i < n; i++) {
      const z = bottomZ - i * zStep;
      drawPerspectiveRect(original, z, cameraHeight, windowCenter, context);
    }
  }

  export function getPerspectiveRect(
    original: GameRect,
    rectZ: number,
    cameraHeight: number,
    vpCenter: Vec2,
  ) {
    const x0 = original.r.x;
    const y0 = original.r.y;
    const w = original.r.w;
    const h = original.r.h;
  
    const cameraDist = cameraHeight + rectZ;
    const scale = cameraDist / (cameraDist + rectZ);
  
    const xt = vpCenter.x + (x0 - vpCenter.x) * scale;
    const yt = vpCenter.y + (y0 - vpCenter.y) * scale;
  
    const wt = w * scale;
    const ht = h * scale;

    return new Rect(xt, yt, wt, ht);
  }
  
  export function drawPerspectiveRect(
    original: GameRect,
    rectZ: number,
    cameraHeight: number,
    vpCenter: Vec2,
    context: CanvasRenderingContext2D
  ) {
    const r = getPerspectiveRect(
      original,
        rectZ,
        cameraHeight,
        vpCenter);
  
    const xt = r.x;
    const yt = r.y;
    const wt = r.w;
    const ht = r.h;
  
    var brightnessScale = 1 - 0.07 * (rectZ / cameraHeight);
    brightnessScale = clamp(brightnessScale, 0.001, 1);
    const color = scaleBrightness(original.color, brightnessScale);
    context.fillStyle = color.toHexStr();
    context.fillRect(xt, yt, wt, ht);
  
    // context.save();
    // context.setTransform(1, 0, 0, 1, 0, 0);
    // context.lineWidth = 1;
    // context.restore();
  
    context.strokeStyle = Color.BLUE.toHexStr();
    // context.lineWidth = 0.01;
    context.strokeRect(xt, yt, wt, ht);
  }