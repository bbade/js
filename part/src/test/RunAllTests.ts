import { runTestRay } from "./math/geometry/testRay";
import { runTestRect } from "./math/geometry/testRect";
import { runMatrixTests } from "./math/testMatrix";
import { runTestBgRectStack } from "./TestBgRectStack";

export function runAllTests() {
    
    runTestRect();
    runMatrixTests();
    runTestBgRectStack();
    runTestRay();
}

runAllTests();