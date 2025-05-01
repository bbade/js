import { Color, scaleBrightness } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { clamp } from "../../math/math";
import { Vec2 } from "../../math/vec2";
import { BgRect } from "./BgRect";
import { FgRect } from "./RectGameFgMain";

export function drawBgRect(
    x: number,
    y: number,
    w: number,
    h: number,
    color: Color,
    z: number,
    cameraHeight: number,
    vpCenter: Vec2,
    context: CanvasRenderingContext2D
  ) {
    //
  
    context.fillStyle = color.toHexStr();
    context.fillRect(x, y, w, h);
    context.strokeStyle = Color.BLUE.toHexStr();
    context.strokeRect(x, y, w, h);
  }
  
  export function drawBgRectTransformed(
    gameRect: BgRect,
    cameraHeight: number,
    vpCenter: Vec2,
    context: CanvasRenderingContext2D
  ) {
    const r = projectRect(gameRect.r, gameRect.z, cameraHeight, vpCenter);
  
    context.save();
    context.translate(r.x, r.y);
    context.rotate(gameRect.rotation);
  
    const color = colorForRect(gameRect.color, cameraHeight, gameRect.z);
  
    context.fillStyle = color.toHexStr();
    context.fillRect(-r.w / 2, -r.h / 2, r.w, r.h);
    context.strokeStyle = Color.BLUE.toHexStr();
    context.strokeRect(-r.w / 2, -r.h / 2, r.w, r.h);
  
    context.restore();
  }
  
  export function drawFgRect(
    fgRect: FgRect,
    cameraHeight: number,
    vpCenter: Vec2,
    context: CanvasRenderingContext2D,
  ) {
    const r = projectRect(fgRect.rect, fgRect.z, cameraHeight, vpCenter);
  
    context.save();
    context.translate(r.x, r.y);
    context.rotate(fgRect.rotation);
  
    const color = colorForRect(fgRect.fill, cameraHeight, fgRect.z);
  
    context.fillStyle = color.toHexStr();
    context.fillRect(-r.w / 2, -r.h / 2, r.w, r.h);
    context.strokeStyle = fgRect.stroke.toHexStr();
    context.strokeRect(-r.w / 2, -r.h / 2, r.w, r.h);
  
    context.restore();
  }
  
  
  function drawDebugCircles(bounds: Rect, context: CanvasRenderingContext2D) {
    const corners = [
      { x: bounds.x, y: bounds.y },
      { x: bounds.x + bounds.w, y: bounds.y },
      { x: bounds.x, y: bounds.y + bounds.h },
      { x: bounds.x + bounds.w, y: bounds.y + bounds.h },
    ];
  
    context.save();
    context.fillStyle = "green";
  
    corners.forEach((corner) => {
      context.beginPath();
      context.arc(corner.x, corner.y, 0.1, 0, Math.PI * 2);
      context.fill();
    });
  
    context.restore();
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
  
  export function colorForRect(
    baseColor: Color,
    cameraHeight: number,
    z: number
  ): Color {
    const brightnessScale = 1 - Math.log(z+1)/6;
    return scaleBrightness(baseColor, clamp(brightnessScale, 0.05, 1));
  }
  

  
export function getPerspectiveRect(
    original: BgRect,
    rectZ: number,
    cameraHeight: number,
    vpCenter: Vec2
  ): BgRect {
    const originalRect = BgRect.toRect_deprecated(original);
    const projectedRect: Rect = projectRect(
      originalRect,
      rectZ,
      cameraHeight,
      vpCenter
    );
  
    const color = colorForRect(original.color, cameraHeight, rectZ);
    return BgRect.fromRect(projectedRect, color, rectZ, original.v);
  }

