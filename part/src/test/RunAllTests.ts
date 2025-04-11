import { runTestRect } from "./math/geometry/testRect";
import { runMatrixTests } from "./math/testMatrix";
import { runTestBgRectStack } from "./TestBgRectStack";

export function runAllTests() {
    
    runTestRect();
    runMatrixTests();
    runTestBgRectStack();
}

runAllTests();