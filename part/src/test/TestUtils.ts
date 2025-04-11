import { Rect } from "../math/geometry/Rect";
import { sortaEqual } from "../math/util";

export function assertEqual(actual: any, expected: any, message: string): boolean {
    // Use JSON.stringify for simple value/object comparison
    // Note: This won't work for complex objects with methods or circular refs
    const actualJson = JSON.stringify(actual);
    const expectedJson = JSON.stringify(expected);

    if (actualJson === expectedJson) {
        console.log(`✅ Success: ${message}`);
        return true;
    } else {
        console.error(`❌ Failure: ${message}`);
        console.error(`   Expected: ${expectedJson}`);
        console.error(`   Actual: ${actualJson}`);
        return false;
    }
}

export function assertTrue(value: boolean, message: string): boolean {
    if (value) {
        console.log(`✅ Success: ${message}`);
        return true;
    } else {
        console.error(`❌ Failure: ${message}`);
        console.error(`   Expected: true`);
        console.error(`   Actual: ${value}`);
        return false;
    }
}

export function assertFalse(value: boolean, message: string): boolean {
    if (!value) {
        console.log(`✅ Success: ${message}`);
        return true;
    } else {
        console.error(`❌ Failure: ${message}`);
        console.error(`   Expected: false`);
        console.error(`   Actual: ${value}`);
        return false;
    }
}

export function assertSortaEquals(a: number, b: number, message: string, quiet: boolean = true): boolean {
    const equals = sortaEqual(a, b);

    if (equals) {
        if (!quiet) console.log(`✅ Success: ${message}`);
        return true;
    } else {
        console.error(`❌ Failure: ${message}`);
        console.error(`   Expected: ${b}`);
        console.error(`   Actual: ${a}`);
        return false;
    }
}

export function assertRectsEqual(expected: Rect, actual: Rect, message: string, quiet: boolean = true): boolean {
    const equal = sortaEqual(expected.x, actual.x) &&
        sortaEqual(expected.y, actual.y) &&
        sortaEqual(expected.w, actual.w) &&
        sortaEqual(expected.h, actual.h);

        if (equal) {
            if (!quiet) console.log(`✅ Success: ${message}`);
            return true;
        } else {
            console.error(`❌ Failure: ${message}`);
            console.error(`   Expected: ${expected.toString()}`);
            console.error(`   Actual: ${actual.toString()}`);
            return false;
        }
        
}