import { Matrix3 } from "./Matrix";
import { Vec2 } from "./vec2";

function assertEqual(actual: any, expected: any, message: string): boolean {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        console.log(`Success: ${message}`);
        return true;
    } else {
        console.error(`Failure: ${message}`);
        console.error(`  Expected: ${JSON.stringify(expected)}`);
        console.error(`  Actual: ${JSON.stringify(actual)}`);
        return false;
    }
}

function testSet(): boolean {
    const matrix = new Matrix3();
    matrix.set(1, 2, 3, 4, 5, 6, 7, 8, 9);
    return assertEqual(matrix.elements, [1, 2, 3, 4, 5, 6, 7, 8, 9], "Matrix3.set");
}

function testIdentity(): boolean {
    const matrix = new Matrix3().identity();
    return assertEqual(matrix.elements, [1, 0, 0, 0, 1, 0, 0, 0, 1], "Matrix3.identity");
}

function testMultiply(): boolean {
    const a = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);
    const b = new Matrix3().set(9, 8, 7, 6, 5, 4, 3, 2, 1);
    const result = a.multiply(b);
    return assertEqual(result.elements, [30, 24, 18, 84, 69, 54, 138, 114, 90], "Matrix3.multiply");
}

function testMultiplyScalar(): boolean {
    const matrix = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).multiplyScalar(2);
    return assertEqual(matrix.elements, [2, 4, 6, 8, 10, 12, 14, 16, 18], "Matrix3.multiplyScalar");
}

function testCopy(): boolean {
    const a = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);
    const b = new Matrix3().copy(a);
    return assertEqual(b.elements, [1, 2, 3, 4, 5, 6, 7, 8, 9], "Matrix3.copy");
}

function testApplyToVec2(): boolean {
    const matrix = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);
    const vec = new Vec2(1, 1);
    const result = matrix.applyToVec2(vec);
    return assertEqual(result, new Vec2(6, 15), "Matrix3.applyToVec2");
}

function testFrom2dArray(): boolean {
    const array = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];
    const matrix = Matrix3.from2dArray(array);
    return assertEqual(matrix.elements, [1, 2, 3, 4, 5, 6, 7, 8, 9], "Matrix3.from2dArray");
}

function testScale(): boolean {
    const matrix = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).scale(2, 3);
    return assertEqual(matrix.elements, [2, 4, 6, 12, 15, 18, 21, 24, 27], "Matrix3.scale");
}

function testTranslate(): boolean {
    const matrix = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).translate(1, 1);
    return assertEqual(matrix.elements, [1, 2, 4, 4, 5, 7, 7, 8, 10], "Matrix3.translate");
}

function testRotate(): boolean {
    const matrix = new Matrix3().identity().rotate(Math.PI / 2);
    const expected = [
        0, 1, 0,
        -1, 0, 0,
        0, 0, 1
    ];
    return assertEqual(matrix.elements.map(e => Math.round(e * 100) / 100), expected, "Matrix3.rotate");
}

export function testMatrix() {
    let successes = 0;
    let failures = 0;

    const tests = [
        testSet,
        testIdentity,
        testMultiply,
        testMultiplyScalar,
        testCopy,
        testApplyToVec2,
        testFrom2dArray,
        testScale,
        testTranslate,
        testRotate
    ];

    for (const test of tests) {
        if (test()) {
            successes++;
        } else {
            failures++;
        }
    }

    console.log(`Tests completed. Successes: ${successes}, Failures: ${failures}`);
}
