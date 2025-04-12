import { Color, scaleBrightness } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { Vec2 } from "../../math/vec2";
import { SceneState } from "./RectGameIndex";
import { GameRect } from "./GameRect";


export class BgRectStack2 {

  public metadata = {}; // any type

  constructor(
    public topRect: GameRect,
    public topZ: number,
    public zStep: number,
    public numRects: number = 10,
    public v: Vec2,
    public ageMs: number = 0,
  ) {}

  copy(): BgRectStack2 {
    return new BgRectStack2(
      GameRect.copy(this.topRect),
      this.topZ,
      this.zStep,
      this.numRects,
      this.v.copy(),
      this.ageMs,
    );
  }

  static getRects(stack: BgRectStack2, cameraHeight: number, vpCenter: Vec2): GameRect[] {
    const rects: GameRect[] = [];
    for (let i = 0; i < stack.numRects; i++) {
      const z = stack.topZ + i * stack.zStep;
      rects.push(getPerspectiveRect(stack.topRect, z, cameraHeight, vpCenter));
    }
    return rects;
  }

  static bottomRect(stack: BgRectStack2, cameraHeight: number, vpCenter: Vec2): GameRect {
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
  const originalRect = GameRect.toRect(original);
  const projectedRect: Rect = projectRect(
    originalRect,
    rectZ,
    cameraHeight,
    vpCenter
  );

  const color = colorForRect(original.color, cameraHeight, rectZ);
  return GameRect.fromRect(projectedRect, color, rectZ);
}

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

function colorForRect(
  baseColor: Color,
  cameraHeight: number,
  z: number
): Color {
  const brightnessScale = 1 - 0.07 * (z / cameraHeight);
  return scaleBrightness(baseColor, brightnessScale);
}
