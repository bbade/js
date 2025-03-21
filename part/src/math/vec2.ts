export class Vec2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    equals(other: Vec2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    toString(): string {
        return `Vec2(${this.x}, ${this.y})`;
    }

    hash(): string {
        return `x=${this.x},y=${this.y}`;
    }

    copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    add(other: Vec2): Vec2 {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    sub(other: Vec2): Vec2 {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    scale(s: number): Vec2 {
        this.x *= s;
        this.y *= s;
        return this;
    }

    mult(other: Vec2): Vec2 {
        return new Vec2(this.x * other.x, this.y * other.y);
    }

    div(other: Vec2): Vec2 {
        this.x /= other.x;
        this.y /= other.y;
        return this;
    }

    divS(s: number): Vec2 {
        this.x /= s;
        this.y /= s;
        return this;
    }

    // copies, does not mutate
    pointAt(other: Vec2): Vec2 {
        return new Vec2(other.x - this.x, other.y - this.y);
    }

    normalize(): Vec2 {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length > 0) {
            this.x /= length;
            this.y /= length;
        }
        return this;
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lenSq(): number {
        return this.x*this.x + this.y*this.y;
    }

    dot(that: Vec2): number {
        return this.x*that.x + this.y*that.y;
    }
    
    distanceTo(that: Vec2): number {
        const dx = this.x - that.x;
        const dy = this.y - that.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}


    /**
     * Projects this vector onto another. 
     * 
     * Formula Proj P onto Q = (dot(p,q)/lenSq(q)) * q
     * 
     * @param other a vec
     */
export function projectOnto(P: Vec2, Q: Vec2): { para: Vec2, perp: Vec2} {
        const projPOntoQ: Vec2  = scale(Q, (dot(P, Q)/Q.lenSq()));
        const perp: Vec2 = sub(P, projPOntoQ);

        return {para : projPOntoQ, perp : perp};

    }

export function dot(p: Vec2, q: Vec2): number {
    return p.dot(q);
}

export function sub(v1: Vec2, v2: Vec2): Vec2 {
  return new Vec2(v1.x - v2.x, v1.y - v2.y);
}

export function scale(v: Vec2, s: number): Vec2 {
  return new Vec2(v.x * s, v.y * s);
}

export function scaleMs(v: Vec2, deltaMs: number): Vec2 {
    const t = deltaMs / 1000;
    return new Vec2(v.x * t, v.y * t);
  }
  

export function add(v1: Vec2, v2: Vec2): Vec2 {
  return new Vec2(v1.x + v2.x, v1.y + v2.y);
}

export function mult(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x * v2.x, v1.y * v2.y);
}

export function div(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x / v2.x, v1.y / v2.y);
}

export function divS(v: Vec2, s: number): Vec2 {
    return new Vec2(v.x / s, v.y / s);
}


/**
 * Spec
 * export interface IVec2 {
    x: number;
    y: number;
    equals(other: IVec2): boolean;
    toString(): string;
    hash(): string;
    copy(): IVec2;
    add(other: IVec2): IVec2;
    sub(other: IVec2): IVec2;
    scale(s: number): IVec2;
    mult(other: IVec2): IVec2;
    div(other: IVec2): IVec2;
    divS(s: number): IVec2;
    pointAt(other: IVec2): IVec2;
    normalize(): IVec2;
    length(): number;
}

 */