import { Ray2 } from "../../../math/geometry/Ray";
import { Rect } from "../../../math/geometry/Rect";
import { Vec2 } from "../../../math/vec2";
import { assertFalse, assertTrue } from "../../TestUtils";

export function runTestRay() {
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

    ///////////// TEST CASES /////////////


      /////////// Test Ray - Point Intersections ////////////
      runTest(() => {
        const ray = new Ray2(new Vec2(0, 0), new Vec2(1, 1));
        const point = new Vec2(0, 0);
        return assertTrue(
          ray.doesIntersectPoint(point),
          "Test 1: a ray at (0, 0) intersects a point at (0, 0)"
        );
      });

      runTest(() => {
        const ray = new Ray2(new Vec2(0, 0), new Vec2(1, 1));
        const point = new Vec2(1, 1);
        return assertTrue(
          ray.doesIntersectPoint(point),
          "Test 2: a ray  (0, 0)->(1,1) intersects a point at (1, 1)"
        );
      });

      runTest(() => {
        const ray = new Ray2(new Vec2(0, 0), new Vec2(1, 1));
        const point = new Vec2(2, 2);
        return assertTrue(
          ray.doesIntersectPoint(point),
          "Test 3: a ray  (0, 0)->(1,1) intersects a point at (2, 2)"
        );
      });

      runTest(() => {
        const ray = new Ray2(new Vec2(0, 0), new Vec2(1, 1));
        const point = new Vec2(4, -1);
        return assertFalse(
          ray.doesIntersectPoint(point),
          "Test 4: a ray  (0, 0)->(1,1) !intersects a point at (4, -1)"
        );
      });

      runTest(() => {
        const ray = new Ray2(new Vec2(0, 0), new Vec2(1, 1));
        const point = new Vec2(-1, -1);
        return assertFalse(
          ray.doesIntersectPoint(point),
          "Test 5: a ray  (0, 0)->(1,1) !intersects a point at (-1, -1)"
        );
      });

      runTest(() => {
        const ray = new Ray2(new Vec2(0, 0), new Vec2(0, 0));
        const point = new Vec2(0, 0);
        return assertFalse(
          ray.doesIntersectPoint(point),
          "Test 6: a ray at (0, 0)->(0,0) !intersects a point at (0, 0)"
        );
      });

      runTest(() => {
        const ray = new Ray2(new Vec2(5, 3), new Vec2(1, 7));
        const point = ray.getPoint(43)
        return assertTrue(
          ray.doesIntersectPoint(point),
          `Test 7: an arbitrary ray (${ray.p.x}, ${ray.p.y})->(${ray.v.x}, ${ray.v.y}) intersects a point (${point.x}, ${point.y})`
        );
      });


      runTest(() => {
        const ray = new Ray2(new Vec2(5, 3), new Vec2(-1, -7));
        const point = ray.getPoint(9999)
        return assertTrue(
          ray.doesIntersectPoint(point),
          `Test 8: an arbitrary ray (${ray.p.x}, ${ray.p.y})->(${ray.v.x}, ${ray.v.y}) intersects a point (${point.x}, ${point.y})`
        );
      });

      runTest(() => {
        const ray = new Ray2(new Vec2(0, 0), new Vec2(0, 1));
        const point = new Vec2(0, 1);
        return assertTrue(
          ray.doesIntersectPoint(point),
          `Test 9: a vertical ray with vx=0`
        );
      });

      runTest(() => {
        const ray = new Ray2(new Vec2(0, 0), new Vec2(1, 0));
        const point = new Vec2(1, 0);
        return assertTrue(
          ray.doesIntersectPoint(point),
          `Test 10: a horizontal ray with vy=0`
        );
      });

      runTest(() => {
        const ray = new Ray2(new Vec2(5, 5), new Vec2(0, 1));
        const point = new Vec2(6, 10);
        return assertTrue(
          ray.doesIntersectPoint(point),
          `Test 11: ai suggestion`
        );
      });

      runTest(() => {
        const ray = new Ray2(new Vec2(5, 5), new Vec2(1, 0));
        const point = new Vec2(10, 6);
        return assertTrue(
          ray.doesIntersectPoint(point),
          `Test 11b: ai suggestion`
        );
      });

      runTest(() => {
        const ray = new Ray2(new Vec2(5, 5), new Vec2(0, 1));
        const point = new Vec2(5, 5);
        return assertTrue(
          ray.doesIntersectPoint(point),
          `Test 11c: ai suggestion`
        );
      });

    /////////// Test Ray - RECT Intersections ////////////

    runTest(() => {
        const ray = new Ray2(new Vec2(0, 0), new Vec2(0, 1));
        const rect = new Rect(-10, -10, 1, 1);
        return assertFalse(
          ray.intersectsRect(rect),
          `Test Ray-Rect 1: miss`
        );
      });

      
      
      // Define an interface for the test case structure (optional, for type safety)
      interface RayRectTestCase {
          ray: Ray2;
          rect: Rect;
          expectedOutcome: boolean;
          logMessage: string;
      }
      
      // Array containing all the test cases
      const rayRectTestCases: RayRectTestCase[] = [
          {
              logMessage: "Case 1: Ray passes directly through the middle (Horizontal)",
              ray: new Ray2(new Vec2(0, 25), new Vec2(1, 0)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true,
          },
          {
              logMessage: "Case 2: Ray passes directly through the middle (Vertical)",
              ray: new Ray2(new Vec2(20, 0), new Vec2(0, 1)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true,
          },
          {
              logMessage: "Case 3: Ray passes diagonally through",
              ray: new Ray2(new Vec2(0, 0), new Vec2(1, 1)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true,
          },
          {
              logMessage: "Case 4: Ray misses completely (Left)",
              ray: new Ray2(new Vec2(5, 25), new Vec2(0, 1)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: false,
          },
          {
              logMessage: "Case 5: Ray misses completely (Right)",
              ray: new Ray2(new Vec2(35, 25), new Vec2(0, 1)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: false,
          },
          {
              logMessage: "Case 6: Ray misses completely (Above)",
              ray: new Ray2(new Vec2(20, 5), new Vec2(1, 0)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: false,
          },
          {
              logMessage: "Case 7: Ray misses completely (Below)",
              ray: new Ray2(new Vec2(20, 45), new Vec2(1, 0)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: false,
          },
          {
              logMessage: "Case 8: Ray misses diagonally",
              ray: new Ray2(new Vec2(0, 0), new Vec2(1, 0.2)), // Angled low
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: false,
          },
          {
              logMessage: "Case 9: Ray starts inside the rectangle",
              ray: new Ray2(new Vec2(15, 20), new Vec2(1, 1)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true,
          },
          {
              logMessage: "Case 10: Ray starts inside, points outwards",
              ray: new Ray2(new Vec2(15, 20), new Vec2(-1, -1)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true, // Intersects at t=0
          },
          {
              logMessage: "Case 11: Ray starts on left edge, points inwards",
              ray: new Ray2(new Vec2(10, 25), new Vec2(1, 0)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true,
          },
          {
              logMessage: "Case 12: Ray starts on left edge, points outwards",
              ray: new Ray2(new Vec2(10, 25), new Vec2(-1, 0)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true, // Intersects at t=0
          },
          {
              logMessage: "Case 13: Ray starts on top edge, parallel along edge",
              ray: new Ray2(new Vec2(15, 10), new Vec2(1, 0)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true, // Intersects along the edge
          },
          {
              logMessage: "Case 14: Ray parallel to edge, just outside (requires tolerance testing)",
              ray: new Ray2(new Vec2(9.99, 25), new Vec2(0, 1)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: false,
          },
          {
              logMessage: "Case 15: Ray hits exactly the bottom-left corner",
              ray: new Ray2(new Vec2(0, 0), new Vec2(10, 10)), // Direction vector points directly at corner
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true, // Hits at t=1
          },
          {
              logMessage: "Case 16: Ray starts at corner, points inwards diagonally",
              ray: new Ray2(new Vec2(10, 10), new Vec2(1, 1)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true,
          },
          {
              logMessage: "Case 17: Ray starts at corner, points outwards diagonally",
              ray: new Ray2(new Vec2(30, 40), new Vec2(1, 1)), // Top-right corner
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true, // Intersects at t=0
          },
          {
              logMessage: "Case 18: Ray starts at corner, points outwards along edge",
              ray: new Ray2(new Vec2(10, 40), new Vec2(-1, 0)), // Top-left corner, points left
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: true, // Intersects at t=0
          },
          {
              logMessage: "Case 19: Degenerate Ray (point) starting inside: false because its an invalid ray",
              ray: new Ray2(new Vec2(20, 20), new Vec2(0, 0)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: false, // Point intersection
          },
          {
              logMessage: "Case 20: Degenerate Ray (point) starting outside",
              ray: new Ray2(new Vec2(0, 0), new Vec2(0, 0)),
              rect: new Rect(10, 10, 20, 30), // x:10-30, y:10-40
              expectedOutcome: false,
          },
        //   {
        //       logMessage: "Case 21: Ray tangential to corner (missing)",
        //       ray: new Ray2(new Vec2(0, 0), new Vec2(1, .99)), // Points just below corner
        //       rect: new Rect(1, 1, 2, 3), // x:1-3, y:1-4
        //       expectedOutcome: false,
        //   },
      ];

      rayRectTestCases.forEach((tc, index) => {
        runTest(() => {
              const r = tc.ray;
              const result = tc.ray.intersectsRect(tc.rect);
              const testResult = result === tc.expectedOutcome ? "✅" : "❌";
              console.log(`Test ${index + 1}: ${tc.logMessage} - ${testResult}`);
              return result === tc.expectedOutcome;  
        });
      }
  ); // end massive for-each
    

  ///////////// FINISH /////////////
  console.log("\n--- testRay.ts: Test Summary ---");
  if (failures === 0) {
    console.log(`✅ All ${successes} tests passed!`);
  } else {
    console.error(
      `❌ ${failures} out of ${successes + failures} tests failed.`
    );
  }
  console.log("--------------------");
}
