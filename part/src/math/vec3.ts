export class Vec3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static from(v: { x: number, y: number, z: number }): Vec3 {
        return new Vec3(v.x, v.y, v.z);
    }

    equals(other: Vec3): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    toString(): string {
        return `Vec3(${this.x}, ${this.y}, ${this.z})`;
    }

    hash(): string {
        return `x=${this.x},y=${this.y},z=${this.z}`;
    }

    copy(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }

    // --- Mutating Methods ---

    add(other: Vec3): Vec3 {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    sub(other: Vec3): Vec3 {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    scale(s: number): Vec3 {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    div(other: Vec3): Vec3 {
        // Consider adding checks for division by zero if necessary
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }

    divS(s: number): Vec3 {
        // Consider adding checks for division by zero if necessary
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    }

    normalize(): Vec3 {
        const length = this.length();
        if (length > 0) {
            this.x /= length;
            this.y /= length;
            this.z /= length;
        }
        return this;
    }

    negate(): Vec3 {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    // --- Non-Mutating Methods ---

    /** Component-wise multiplication (Hadamard product) */
    mult(other: Vec3): Vec3 {
        return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
    }

    /** Returns a new vector pointing from this vector to the other vector. */
    pointAt(other: Vec3): Vec3 {
        return new Vec3(other.x - this.x, other.y - this.y, other.z - this.z);
    }

    /** Calculates the cross product between this vector and another. Returns a new Vec3. */
    cross(other: Vec3): Vec3 {
        const x = this.y * other.z - this.z * other.y;
        const y = this.z * other.x - this.x * other.z;
        const z = this.x * other.y - this.y * other.x;
        return new Vec3(x, y, z);
    }


    // --- Calculation Methods ---

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    lenSq(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    dot(other: Vec3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    distanceTo(other: Vec3): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // --- Static Methods ---
    static negate(v: Vec3): Vec3 {
        return new Vec3(-v.x, -v.y, -v.z);
    }
}


// --- Helper Functions (adapted for Vec3) ---

/**
 * Projects vector P onto vector Q.
 *
 * Formula Proj P onto Q = (dot(p,q)/lenSq(q)) * q
 *
 * @param P The vector to project.
 * @param Q The vector being projected onto.
 * @returns An object containing the parallel (projection) and perpendicular components of P relative to Q.
 */
export function projectOnto3(P: Vec3, Q: Vec3): { para: Vec3, perp: Vec3 } {
    const qLenSq = Q.lenSq();
    if (qLenSq === 0) {
        // Cannot project onto a zero vector
        return { para: new Vec3(0, 0, 0), perp: P.copy() };
    }
    const scaleFactor = dot3(P, Q) / qLenSq;
    const projPOntoQ = scale3(Q, scaleFactor);
    const perp = sub3(P, projPOntoQ);

    return { para: projPOntoQ, perp: perp };
}

export function dot3(p: Vec3, q: Vec3): number {
    return p.dot(q);
}

export function sub3(v1: Vec3, v2: Vec3): Vec3 {
    return new Vec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

export function scale3(v: Vec3, s: number): Vec3 {
    return new Vec3(v.x * s, v.y * s, v.z * s);
}

/** Scales a vector assuming its components represent velocity (units/sec) over a time delta (ms). */
export function scaleMs3(v: Vec3, deltaMs: number): Vec3 {
    const t = deltaMs / 1000; // convert ms to seconds
    return new Vec3(v.x * t, v.y * t, v.z * t);
}

export function add3(v1: Vec3, v2: Vec3): Vec3 {
    return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

/** Component-wise multiplication (Hadamard product) */
export function mult3(v1: Vec3, v2: Vec3): Vec3 {
    return new Vec3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
}

export function div3(v1: Vec3, v2: Vec3): Vec3 {
    // Consider adding checks for division by zero if necessary
    return new Vec3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
}

export function divS3(v: Vec3, s: number): Vec3 {
    // Consider adding checks for division by zero if necessary
    return new Vec3(v.x / s, v.y / s, v.z / s);
}

export function vdistance3(v1: Vec3, v2: Vec3): number {
    return v1.distanceTo(v2);
    // Or explicitly: return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2 + (v1.z - v2.z) ** 2);
}

export function cross3(v1: Vec3, v2: Vec3): Vec3 {
    return v1.cross(v2);
}


/**
 * Optional Vec3 Interface (based on the Vec2 interface provided)
 *
 * export interface IVec3 {
 * x: number;
 * y: number;
 * z: number;
 * equals(other: IVec3): boolean;
 * toString(): string;
 * hash(): string;
 * copy(): IVec3;
 * add(other: IVec3): IVec3;        // Mutating
 * sub(other: IVec3): IVec3;        // Mutating
 * scale(s: number): IVec3;       // Mutating
 * div(other: IVec3): IVec3;        // Mutating
 * divS(s: number): IVec3;        // Mutating
 * normalize(): IVec3;              // Mutating
 * negate(): IVec3;                 // Mutating
 * mult(other: IVec3): IVec3;       // Non-mutating (returns new)
 * pointAt(other: IVec3): IVec3;   // Non-mutating (returns new)
 * cross(other: IVec3): IVec3;     // Non-mutating (returns new)
 * length(): number;
 * lenSq(): number;
 * dot(other: IVec3): number;
 * distanceTo(other: IVec3): number;
 * }
 */