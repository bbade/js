import { Color, scaleBrightness } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { Vec2 } from "../../math/vec2";
import { SceneState } from "./RectGameIndex";
import { GameRect } from "./GameRect";
import { clamp } from "../../math/math";

export class BgRectStack2 {
  public metadata = {}; // any type

  get topZ(): number {
    return this.topRect.z;
  }

  constructor(
    public topRect: GameRect,
    public zStep: number,
    public numRects: number = 10
  ) {}

  static fromObject(params: {
    topRect: GameRect;
    zStep: number;
    numRects?: number;
  }): BgRectStack2 {
    return new BgRectStack2(
      params.topRect,
      params.zStep,
      params.numRects ?? 10
    );
  }

  copy(): BgRectStack2 {
    return new BgRectStack2(
      GameRect.copy(this.topRect),
      this.zStep,
      this.numRects
    );
  }

  allRects(): GameRect[] {
    console.log("topRect's v:", this.topRect.v);
    const rects: GameRect[] = [];
    for (let i = 0; i < this.numRects; i++) {
      const r = this.topRect.copy();
      const z = this.topZ + i * this.zStep;
      r.z = z;
      rects.push(r);
    }

    rects.forEach((rect) => {
      console.log(JSON.stringify(rect));
    });
    return rects;
  }

  static getPerspectiveRects(
    stack: BgRectStack2,
    cameraHeight: number,
    vpCenter: Vec2
  ): GameRect[] {
    const rects: GameRect[] = [];
    for (let i = 0; i < stack.numRects; i++) {
      const z = stack.topZ + i * stack.zStep;
      rects.push(getPerspectiveRect(stack.topRect, z, cameraHeight, vpCenter));
    }
    return rects;
  }

  static bottomRect(
    stack: BgRectStack2,
    cameraHeight: number,
    vpCenter: Vec2
  ): GameRect {
    const z = stack.topZ + (stack.numRects - 1) * stack.zStep;
    return getPerspectiveRect(stack.topRect, z, cameraHeight, vpCenter);
  }
}

export function getPerspectiveRect(
  original: GameRect,
  rectZ: number,
  cameraHeight: number,
  vpCenter: Vec2
): GameRect {
  const originalRect = GameRect.toRect_deprecated(original);
  const projectedRect: Rect = projectRect(
    originalRect,
    rectZ,
    cameraHeight,
    vpCenter
  );

  const color = colorForRect(original.color, cameraHeight, rectZ);
  return GameRect.fromRect(projectedRect, color, rectZ, original.v);
}

// export function projectGameRect(
//   gameRect: GameRect,
//   cameraHeight: number,
//   vpCenter: Vec2
// ): GameRect {
//   const originalRect = gameRect.r;
//   const projectedRect: Rect = projectRect(
//     originalRect,
//     gameRect.z,
//     cameraHeight,
//     vpCenter
//   );

//   const color = colorForRect(gameRect.color, cameraHeight, gameRect.z);
//   return GameRect.fromRect(projectedRect, color, gameRect.z);
// }

export function projectRect(
  originalRect: Rect,
  rectZ: number,
  cameraHeight: number,
  vpCenter: Vec2
): Rect {
  const x0 = originalRect.x;
  const y0 = originalRect.y;
  const w = originalRect.w;
  const h = originalRect.h;

  const focalDistance = cameraHeight;
  const objectDistance = rectZ;
  const scale = focalDistance / (focalDistance + objectDistance);

  const xt = vpCenter.x + (x0 - vpCenter.x) * scale;
  const yt = vpCenter.y + (y0 - vpCenter.y) * scale;

  const wt = w * scale;
  const ht = h * scale;

  return new Rect(xt, yt, wt, ht);
}

export function colorForRect(
  baseColor: Color,
  cameraHeight: number,
  z: number
): Color {
  const brightnessScale = 1 - Math.log(z+1)/6;
  return scaleBrightness(baseColor, clamp(brightnessScale, 0.05, 1));
}
