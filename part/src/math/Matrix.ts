import { Vec2 } from "./vec2";

export class Transform {
    constructor(
        public readonly rotateRadians: number,
        public readonly sx: number,
        public readonly sy: number,
        public readonly translation: Vec2
    ) {

    }
}

export class Matrix3 {
    public readonly numRows: number = 3;
    public readonly numCols: number = 3;

    constructor(
        private elements: number[][]
    ) {
        if (elements.length !== 3 || elements[0].length !== 3) {
            throw new Error("Matrix must be 3x3");
        }
    }

    static identity(): Matrix3 {
        const elements = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
        return new Matrix3(elements);
    }

    static multiply(m1: Matrix3, m2: Matrix3): Matrix3 {
        const resultElements: number[][] = [];

        for (let i = 0; i < 3; i++) {
            const row: number[] = [];
            for (let j = 0; j < 3; j++) {
                let sum = 0;
                for (let k = 0; k < 3; k++) {
                    sum += m1.elements[i][k] * m2.elements[k][j];
                }
                row.push(sum);
            }
            resultElements.push(row);
        }

        return new Matrix3(resultElements);
    }

    static from2dTransformation(t: Transform): Matrix3 {
        const cosTheta = Math.cos(t.rotateRadians);
        const sinTheta = Math.sin(t.rotateRadians);

        const elements = [
            [cosTheta * t.sx, -sinTheta * t.sy, t.translation.x],
            [sinTheta * t.sx, cosTheta * t.sy, t.translation.y],
            [0, 0, 1]
        ];

        return new Matrix3(elements);
    }

    applyToCanvas2d(context: CanvasRenderingContext2D): void {
        const [
            [a, b, c],
            [d, e, f],
            [, ,] // We ignore the last row because it's always [0, 0, 1] in 2D transformations
        ] = this.elements;  //Destructure for readability.

        context.transform(a, d, b, e, c, f);
    }

    applyToVector2(v: Vec2): Vec2 {
        const [
            [a, b, c],
            [d, e, f],
            [, ,]
        ] = this.elements;

        const newX = a * v.x + b * v.y + c;
        const newY = d * v.x + e * v.y + f;

        return new Vec2(newX, newY);
    }

    inverse(): Matrix3 {
        const [
            [a, b, c],
            [d, e, f],
            [g, h, i]
        ] = this.elements;

        const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

        if (det === 0) {
            throw new Error("Matrix is not invertible");
        }

        const invDet = 1 / det;

        const invElements: number[][] = [
            [
                (e * i - f * h) * invDet,
                (c * h - b * i) * invDet,
                (b * f - c * e) * invDet
            ],
            [
                (f * g - d * i) * invDet,
                (a * i - c * g) * invDet,
                (c * d - a * f) * invDet
            ],
            [
                (d * h - e * g) * invDet,
                (b * g - a * h) * invDet,
                (a * e - b * d) * invDet
            ]
        ];

        return new Matrix3(invElements);
    }
}

/**
 * alt inverse impl
 * 
 inverse3x3(): Matrix {
        const elements = this.getElements();
        const size = this.getSize();

        if (size !== 3) {
            throw new Error("inverse3x3 can only be called on 3x3 matrices");
        }

        const [
            [a, b, c],
            [d, e, f],
            [g, h, i]
        ] = elements;

        const determinant = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

        if (determinant === 0) {
            throw new Error("Matrix is not invertible (determinant is zero)");
        }

        return new Matrix([
            [(e * i - f * h) / determinant, (c * h - b * i) / determinant, (b * f - c * e) / determinant],
            [(f * g - d * i) / determinant, (a * i - c * g) / determinant, (c * d - a * f) / determinant],
            [(d * h - e * g) / determinant, (b * g - a * h) / determinant, (a * e - b * d) / determinant]
        ]);
    }
 */