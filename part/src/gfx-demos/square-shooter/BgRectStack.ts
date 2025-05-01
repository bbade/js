import { Color, scaleBrightness } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { Vec2 } from "../../math/vec2";
import { SceneState } from "./RectGameBgMain";
import { BgRect } from "./BgRect";
import { clamp } from "../../math/math";
import { colorForRect, getPerspectiveRect, projectRect } from "./DrawRects";

export class BgRectStack2 {
  public metadata = {}; // any type

  get topZ(): number {
    return this.topRect.z;
  }

  constructor(
    public topRect: BgRect,
    public zStep: number,
    public numRects: number = 10
  ) {}

  static fromObject(params: {
    topRect: BgRect;
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
      BgRect.copy(this.topRect),
      this.zStep,
      this.numRects
    );
  }

  allRects(): BgRect[] {
    console.log("topRect's v:", this.topRect.v);
    const rects: BgRect[] = [];
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
  ): BgRect[] {
    const rects: BgRect[] = [];
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
  ): BgRect {
    const z = stack.topZ + (stack.numRects - 1) * stack.zStep;
    return getPerspectiveRect(stack.topRect, z, cameraHeight, vpCenter);
  }
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
