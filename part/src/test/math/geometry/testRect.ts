import { Rect } from "../../../math/geometry/Rect";
import { assertFalse, assertTrue } from "../../TestUtils";

export function runTestRect() {
  console.log("--- Running Rect.intersects() Unit Tests ---");
  let successes = 0;
  let failures = 0;

  function runTest(testFn: () => boolean): void {
    try {
      if (testFn()) {
        successes++;
      } else {
        failures++;
      }
    } catch (e: any) {
      console.error(`❌ Error during test: ${e.message}`);
      failures++;
    }
  }

  // Test Case 1: Clear Overlap
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(30, 30, 50, 50); // (30,30) to (80,80)
    return assertTrue(
      r1.intersects(r2),
      "Test 1: Should intersect with clear overlap"
    );
  });

  // Test Case 2: No Overlap - r2 is strictly to the right of r1
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(70, 10, 50, 50); // (70,10) to (120,60)
    return assertFalse(
      r1.intersects(r2),
      "Test 2: Should not intersect when r2 is right of r1"
    );
  });

  // Test Case 3: No Overlap - r2 is strictly to the left of r1
  runTest(() => {
    const r1 = new Rect(70, 10, 50, 50); // (70,10) to (120,60)
    const r2 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    return assertFalse(
      r1.intersects(r2),
      "Test 3: Should not intersect when r2 is left of r1"
    );
  });

  // Test Case 4: No Overlap - r2 is strictly below r1
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(10, 70, 50, 50); // (10,70) to (60,120)
    return assertFalse(
      r1.intersects(r2),
      "Test 4: Should not intersect when r2 is below r1"
    );
  });

  // Test Case 5: No Overlap - r2 is strictly above r1
  runTest(() => {
    const r1 = new Rect(10, 70, 50, 50); // (10,70) to (60,120)
    const r2 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    return assertFalse(
      r1.intersects(r2),
      "Test 5: Should not intersect when r2 is above r1"
    );
  });

  // Test Case 6: No Overlap - Diagonal separation
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(70, 70, 50, 50); // (70,70) to (120,120)
    return assertFalse(
      r1.intersects(r2),
      "Test 6: Should not intersect when diagonally separated"
    );
  });

  // Test Case 7: Touching Edges - r2 touches right edge of r1
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(60, 10, 50, 50); // (60,10) to (110,60)
    return assertTrue(
      r1.intersects(r2),
      "Test 7: Should intersect when touching right edge"
    );
  });

  // Test Case 8: Touching Edges - r2 touches left edge of r1
  runTest(() => {
    const r1 = new Rect(60, 10, 50, 50); // (60,10) to (110,60)
    const r2 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    return assertTrue(
      r1.intersects(r2),
      "Test 8: Should intersect when touching left edge"
    );
  });

  // Test Case 9: Touching Edges - r2 touches bottom edge of r1
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(10, 60, 50, 50); // (10,60) to (60,110)
    return assertTrue(
      r1.intersects(r2),
      "Test 9: Should intersect when touching bottom edge"
    );
  });

  // Test Case 10: Touching Edges - r2 touches top edge of r1
  runTest(() => {
    const r1 = new Rect(10, 60, 50, 50); // (10,60) to (60,110)
    const r2 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    return assertTrue(
      r1.intersects(r2),
      "Test 10: Should intersect when touching top edge"
    );
  });

  // Test Case 11: Touching Corner - r2 touches bottom-right corner of r1
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(60, 60, 50, 50); // (60,60) to (110,110)
    return assertTrue(
      r1.intersects(r2),
      "Test 11: Should intersect when touching corner"
    );
  });

  // Test Case 12: Containment - r1 contains r2
  runTest(() => {
    const r1 = new Rect(0, 0, 100, 100); // (0,0) to (100,100)
    const r2 = new Rect(20, 20, 50, 50); // (20,20) to (70,70)
    return assertTrue(
      r1.intersects(r2),
      "Test 12: Should intersect when r1 contains r2"
    );
  });

  // Test Case 13: Containment - r2 contains r1
  runTest(() => {
    const r1 = new Rect(20, 20, 50, 50); // (20,20) to (70,70)
    const r2 = new Rect(0, 0, 100, 100); // (0,0) to (100,100)
    return assertTrue(
      r1.intersects(r2),
      "Test 13: Should intersect when r2 contains r1"
    );
  });

  // Test Case 14: Identical Rectangles
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50);
    const r2 = new Rect(10, 10, 50, 50);
    return assertTrue(
      r1.intersects(r2),
      "Test 14: Should intersect when rectangles are identical"
    );
  });

  // Test Case 15: Partial Overlap - Top-left corner
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(0, 0, 20, 20); // (0,0) to (20,20)
    return assertTrue(
      r1.intersects(r2),
      "Test 15: Should intersect on top-left corner overlap"
    );
  });

  // Test Case 16: Partial Overlap - Bottom-right corner
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(50, 50, 20, 20); // (50,50) to (70,70)
    return assertTrue(
      r1.intersects(r2),
      "Test 16: Should intersect on bottom-right corner overlap"
    );
  });

  // --- Zero Width/Height Cases ---

  // Test Case 17: Zero Width/Height - Point inside Rect
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(30, 30, 0, 0); // Point (30,30), x1=30, y1=30
    // Check: r1.x<=r2.x1 (10<=30 T) && r1.x1>=r2.x (60>=30 T) -> X overlaps
    //        r1.y<=r2.y1 (10<=30 T) && r1.y1>=r2.y (60>=30 T) -> Y overlaps
    return assertTrue(
      r1.intersects(r2),
      "Test 17: Should intersect when point is inside rect"
    );
  });

  // Test Case 18: Zero Width/Height - Point outside Rect
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(0, 0, 0, 0); // Point (0,0)
    // Check: r1.x<=r2.x1 (10<=0 F) -> No X overlap
    return assertFalse(
      r1.intersects(r2),
      "Test 18: Should not intersect when point is outside rect"
    );
  });

  // Test Case 19: Zero Width/Height - Point on edge (should intersect because touching is allowed)
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(60, 30, 0, 0); // Point on right edge (60,30) x1=60, y1=30
    // Check: r1.x<=r2.x1 (10<=60 T) && r1.x1>=r2.x (60>=60 T) -> X overlaps
    //        r1.y<=r2.y1 (10<=30 T) && r1.y1>=r2.y (60>=30 T) -> Y overlaps
    return assertTrue(
      r1.intersects(r2),
      "Test 19: Should intersect when point is on edge"
    );
  });

  // Test Case 20: Zero Width/Height - Point on corner (should intersect)
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(60, 60, 0, 0); // Point on bottom-right corner (60,60)
    return assertTrue(
      r1.intersects(r2),
      "Test 20: Should intersect when point is on corner"
    );
  });

  // Test Case 21: Zero Width/Height - Vertical Line intersecting Rect
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(30, 0, 0, 100); // Vertical line x=30, y=0 to 100. x1=30, y1=100.
    // Check X: r1.x<=r2.x1 (10<=30 T) && r1.x1>=r2.x (60>=30 T) -> X overlaps
    // Check Y: r1.y<=r2.y1 (10<=100 T) && r1.y1>=r2.y (60>=0 T) -> Y overlaps
    return assertTrue(
      r1.intersects(r2),
      "Test 21: Should intersect when vertical line crosses rect"
    );
  });

  // Test Case 22: Zero Width/Height - Horizontal Line intersecting Rect
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(0, 30, 100, 0); // Horizontal line y=30, x=0 to 100. x1=100, y1=30
    return assertTrue(
      r1.intersects(r2),
      "Test 22: Should intersect when horizontal line crosses rect"
    );
  });

  // Test Case 23: Zero Width/Height - Vertical Line touching edge (should intersect)
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(60, 0, 0, 100); // Vertical line on right edge x=60
    // Check X: r1.x<=r2.x1 (10<=60 T) && r1.x1>=r2.x (60>=60 T) -> X overlaps
    // Check Y: r1.y<=r2.y1 (10<=100 T) && r1.y1>=r2.y (60>=0 T) -> Y overlaps
    return assertTrue(
      r1.intersects(r2),
      "Test 23: Should intersect when vertical line touches edge"
    );
  });

  // Test Case 24: Zero Width/Height - Horizontal Line touching edge (should intersect)
  runTest(() => {
    const r1 = new Rect(10, 10, 50, 50); // (10,10) to (60,60)
    const r2 = new Rect(0, 60, 100, 0); // Horizontal line on bottom edge y=60
    return assertTrue(
      r1.intersects(r2),
      "Test 24: Should intersect when horizontal line touches edge"
    );
  });

  // Test Case 25: Two touching points (should intersect)
  runTest(() => {
    const r1 = new Rect(10, 10, 0, 0);
    const r2 = new Rect(10, 10, 0, 0);
    return assertTrue(
      r1.intersects(r2),
      "Test 25: Should intersect when two points are identical"
    );
  });

  // Test Case 26: Two separate points (should not intersect)
  runTest(() => {
    const r1 = new Rect(10, 10, 0, 0);
    const r2 = new Rect(20, 20, 0, 0);
    // Check X: r1.x<=r2.x1 (10<=20 T) && r1.x1>=r2.x (10>=20 F) -> No X overlap
    return assertFalse(
      r1.intersects(r2),
      "Test 26: Should not intersect for two separate points"
    );
  });

  // --- Test Summary ---
  console.log("\n--- Test Summary ---");
  if (failures === 0) {
    console.log(`✅ All ${successes} tests passed!`);
  } else {
    console.error(
      `❌ ${failures} out of ${successes + failures} tests failed.`
    );
  }
  console.log("--------------------");
}
