import { Matrix3 } from "../../math/Matrix";
import { sortaEqual } from "../../math/util";
import { Vec2 } from "../../math/vec2";
import { assertFalse, assertTrue } from "../TestUtils";



const m1 = new Matrix3([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]);
const m2 = new Matrix3([
    [-1, -2, -3],
    [-4, -5, -6],
    [-7, -8, -9]
]);
const m3 = new Matrix3([
    [9, 8, 7],
    [6, 5, 4],
    [3, 2, 1]
]);

const identity = new Matrix3([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]);

const invertable = new Matrix3([
    [4, 1, 1],     
    [1, 5, 2],      
    [1, 1, 3]  
]);

type TestFunctions = {
    [key: string]: () => boolean;
};

const tests: TestFunctions = {
    // write tests here
    
    testSortaEqualsMethodWorks(): boolean {
        const a = 1;
        const b = 1.0001;
        return assertTrue(sortaEqual(a, b, .001), "sortaEqual: asserting 1 == 1.0000001") &&
               assertFalse(sortaEqual(a, b, .0000001), "sortaEqual: asserting 1 != 1.0000001");
    }

     ,testEquals(): boolean {

        console.log("Matrix m1:", m1);
        console.log("Matrix m2:", m2);
        const r = m1.sortaEquals(m1)
        return assertTrue(r, "testEquals : asserting m1 == m 1. Result "+ r) ;
    },

    testNotEquals(): boolean {
        const result = m1.sortaEquals(m2);
        const result1 = m1.sortaEquals(m2);
        const result2 = m1.sortaEquals(m3);
        return assertFalse(result1, "testNotEquals: asserting m1.sortaEqual(m2) == false. Result: " + result1) &&
               assertFalse(result2, "testNotEquals: asserting m1.sortaEqual(m3) == false. Result: " + result2);

    }
    
    ,testCopy(): boolean {

        const b = m1.copy();
        return assertTrue(m1.equals(b), "Matrix3.copy (equal matrices after copy)");
    },

    testIdentity(): boolean {
        const identity = Matrix3.identity();
        const expected = new Matrix3([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);
        return assertTrue(identity.equals(expected), "Matrix3.identity() returns the correct identity matrix");
    },

    testMultiply(): boolean {

        // expected results (need to be converted to matrix3)
        const m1_m3_expected: number[][] = [
            [30, 24, 18],
            [84, 69, 54],
            [138, 114, 90],
          ];
          
          const m3_m1_expected: number[][] = [
            [90, 114, 138],
            [54, 69, 84],
            [18, 24, 30],
          ];

          const expected_m1_m2: number[][] = [
            [-30, -36, -42],
            [-66, -81, -96],
            [-102, -126, -150],
          ];
          
          const expected_m2_m1: number[][] = [
            [-30, -36, -42],
            [-66, -81, -96],
            [-102, -126, -150],
          ];
          

          // actual results
          const r_m1_m3 = Matrix3.multiply(m1, m3);
          const r_m3_m1 = Matrix3.multiply(m3, m1);
          const r_m1_m2 = Matrix3.multiply(m1, m2);
          const r_m2_m1 = Matrix3.multiply(m2, m1);

          return assertTrue(r_m1_m3.equals(new Matrix3(m1_m3_expected)), "Matrix3.multiply(m1, m3) returns the correct result") &&
                 assertTrue(r_m3_m1.equals(new Matrix3(m3_m1_expected)), "Matrix3.multiply(m3, m1) returns the correct result") &&
                 assertTrue(r_m1_m2.equals(new Matrix3(expected_m1_m2)), "Matrix3.multiply(m1, m2) returns the correct result") &&
                 assertTrue(r_m2_m1.equals(new Matrix3(expected_m2_m1)), "Matrix3.multiply(m2, m1) returns the correct result");
    }

    ,testApplyToVector(): boolean {
        const v0 = new Vec2(0, 0);
        const v1 = new Vec2(2, 3);
        
        const expected_m1_v1 = new Vec2(11, 29);
        const expected_m2_v1 = new Vec2(-11, -29);
        const expected_m3_v1 = new Vec2(49, 31);
        const expected_id_v1 = new Vec2(2, 3);
        const expected_m1_v0 = new Vec2(3, 6);

        const r_m1_v1 = m1.applyToVector2(v1);
        const r_m2_v1 = m2.applyToVector2(v1);
        const r_m3_v1 = m3.applyToVector2(v1);
        const r_id_v1 = identity.applyToVector2(v1);
        const r_m1_v0 = m1.applyToVector2(v0);

        return assertTrue(r_m1_v1.equals(expected_m1_v1), "Matrix3.applyToVector2(m1, v1) returns the correct result") &&
               assertTrue(r_m2_v1.equals(expected_m2_v1), "Matrix3.applyToVector2(m2, v1) returns the correct result") &&
               assertTrue(r_m3_v1.equals(expected_m3_v1), "Matrix3.applyToVector2(m3, v1) returns the correct result") &&
               assertTrue(r_id_v1.equals(expected_id_v1), "Matrix3.applyToVector2(identity, v1) returns the correct result") &&
               assertTrue(r_m1_v0.equals(expected_m1_v0), "Matrix3.applyToVector2(m1, v0) returns the correct result");
    }

    , testInvert(): boolean {
        const expected_inv = new Matrix3([
            [ 0.27659574, -0.04255319, -0.06382979],
       [-0.0212766 ,  0.23404255, -0.14893617],
       [-0.08510638, -0.06382979,  0.40425532]
        ]);
        const actualInverse = invertable.inverse();
        return assertTrue(actualInverse.sortaEquals(expected_inv), "Matrix3.invert() returns the correct inverse matrix");
    }

    ,testUninvertable(): boolean { 
        try {
            m1.inverse();
            console.error("Failure: testUninvertable: Expected an exception to be thrown for non-invertible matrix m1");
            return false;
        } catch (e) {
            console.log("Success: testUninvertable: Exception thrown as expected for non-invertible matrix m1");
            return true;
        }
    }
}

export function runMatrixTests() {
    let successCount = 0;
    let failureCount = 0;

    for (const testName in tests) {
        if (tests.hasOwnProperty(testName)) {
            const f = tests[testName] as () => boolean;
            const result = f();
            if (result) {
                successCount++;
            } else {
                failureCount++;
            }
        }
    }

    console.log(`Tests completed. Successes: ${successCount}, Failures: ${failureCount}`);
}



