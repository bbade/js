import { sortaEqual } from "../util";
import { Vec2 } from "../vec2";
import { Rect } from "./Rect";

export interface IRay2 {
  p: Vec2;
  v: Vec2;
}

export class Ray2 {
  constructor(public p: Vec2, public v: Vec2) {}

  static from(other: IRay2): Ray2 {
    return new Ray2(other.p.copy(), other.v.copy());
  }

  static fromPoints(p0: Vec2, p1: Vec2): Ray2 {
    return new Ray2(p0.copy(), p1.copy().sub(p0));
  }

  normalize(): Ray2 {
    this.v = this.v.normalize();
    return this;
  }

  /**
   * Returns the t at which the ray intersects the given point.
   */
  intersectsPoint(point: Vec2): number | null {
    const transform = this.p.copy().negate();
    const r = new Ray2(new Vec2(), this.v);
    const Q = point.copy().add(transform);

    if (r.v.x == 0 && r.v.y == 0) {
      console.warn("Ray has zero length, cannot intersect with point.");
      return null;
    }

    // solve for Q
    // Qx
    const tx = Q.x / r.v.x;
    const ty = Q.y / r.v.y;

    console.log("Ray2 intersects debug:", {
      thisRay: this,
      point,
      transform,
      tx,
      ty,
    });

    if (sortaEqual(r.v.x,  0) && ty >= 0) {
      return ty;
    } else if (sortaEqual(r.v.y, 0) && tx >= 0) {
      return tx;
    } else if (tx < 0 || ty < 0) {
      return null;
    } else if (sortaEqual(tx, ty)) {
      return tx;
    } else {
      return null;
    }
  }

  doesIntersectPoint(point: Vec2): boolean {
    return this.intersectsPoint(point) !== null;
  }

  intersectsRect(rectangle: Rect): boolean {
    // We want to check if the ray hits 4 lines: Xa, Xb, Yc, Yd

    if (this.v.x == 0 && this.v.y == 0) {
      console.warn("Ray has zero length, cannot intersect with rectangle.");
        return false;
    }

    if (rectangle.contains(this.p)) { 
        return true;
    }

    const transform = this.p.copy().negate();
    const r = new Ray2(new Vec2(), this.v);
    const rect = Rect.fromV2wh(
      rectangle.p.add(transform),
      rectangle.w,
      rectangle.h
    );

    const Txa = rect.x / r.v.x;
    const Txb = rect.x1 / r.v.x;
    const Tyc = rect.y / r.v.y;
    const Tyd = rect.y1 / r.v.y;

    // case: ray is horizontal
    if (sortaEqual(r.v.y, 0)) {
        if (this.v.x > 0) {
            return Txa >= 0 && Txa <= Txb;
        } else {
            return Txb >= 0 && Txb <= Txa;
        }
    }

    // case: ray is vertical

    if (sortaEqual(r.v.x, 0)) {
        if (this.v.y > 0) {
            return Tyc >= 0 && Tyc <= Tyd;
        } else {
            return Tyd >= 0 && Tyd <= Tyc;
        }
    }

    // case: general case

    let firstXHit: number;
    let secondXHit: number;

    if (this.v.x > 0) {
      firstXHit = Txa;
      secondXHit = Txb;
    } else {
      firstXHit = Txb;
      secondXHit = Txa;
    }

    if (firstXHit < 0 || secondXHit < 0 || Tyc < 0 || Tyd < 0) {
        return false;
        
    }
    
    return (firstXHit <= Tyc && secondXHit >= Tyc) || (firstXHit <= Tyd && secondXHit >= Tyd);
    
  }

  // Helper to get a point along the ray
  getPoint(t: number): Vec2 {
    return Vec2.from({
      x: this.p.x + this.v.x * t,
      y: this.p.y + this.v.y * t,
    });
  }
}
