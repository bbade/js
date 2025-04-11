import { BgRectStack, getPerspectiveRect } from "../src/gfx-demos/squares/BgRectStack";
import { GameRect } from "../src/gfx-demos/squares/RectUtils";
import { Vec2 } from "../src/math/vec2";
import { Color } from "../src/Color";

function testGetPerspectiveRect(): boolean {
  const topRect = new GameRect(new Vec2(0, 0), 100, 100, new Color(255, 0, 0), 0);
  const bottomZ = 1000;
  const cameraHeight = 500;
  const vpCenter = new Vec2(500, 500);
  const numRects = 5;

  const stack = new BgRectStack(topRect, bottomZ, new Vec2(0, 0), numRects);
  const rects = BgRectStack.getRects(stack);

  for (let i = 0; i < numRects; i++) {
    const z = bottomZ - (i / numRects) * bottomZ;
    const expectedRect = getPerspectiveRect(topRect, z, cameraHeight, vpCenter);
    const actualRect = GameRect.toRect(rects[i]);

    if (
      actualRect.x !== expectedRect.r.x ||
      actualRect.y !== expectedRect.r.y ||
      actualRect.w !== expectedRect.r.w ||
      actualRect.h !== expectedRect.r.h
    ) {
      console.error(
        `❌ Test failed for rect at index ${i}. Expected: ${expectedRect.r.toString()}, Got: ${actualRect.toString()}`
      );
      return false;
    }
  }

  console.log("✅ All tests passed for getPerspectiveRect!");
  return true;
}

function testStackSize1(): boolean {
  const topRect = new GameRect(new Vec2(-0.25, 0.5), 0.5, 0.5, new Color(255, 0, 0), 0);
  const bottomZ = 0;
  const cameraHeight = 1;
  const vpCenter = new Vec2(0, 0);

  const stack = new BgRectStack(topRect, bottomZ, new Vec2(0, 0), 1);
  const rects = BgRectStack.getRects(stack);

  if (rects.length !== 1) {
    console.error(`❌ Test failed: Expected stack size of 1, but got ${rects.length}`);
    return false;
  }

  const expectedRect = getPerspectiveRect(topRect, bottomZ, cameraHeight, vpCenter);
  const actualRect = GameRect.toRect(rects[0]);

  if (
    actualRect.x !== expectedRect.r.x ||
    actualRect.y !== expectedRect.r.y ||
    actualRect.w !== expectedRect.r.w ||
    actualRect.h !== expectedRect.r.h
  ) {
    console.error(
      `❌ Test failed for single rect. Expected: ${expectedRect.r.toString()}, Got: ${actualRect.toString()}`
    );
    return false;
  }

  console.log("✅ Test passed for testStackSize1!");
  return true;
}

export function runTestBgRectStack() {
  console.log("--- Running BgRectStack Unit Tests ---");
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

  runTest(testGetPerspectiveRect);
  runTest(testStackSize1);

  console.log("\n--- Test Summary ---");
  if (failures === 0) {
    console.log(`✅ All ${successes} tests passed!`);
  } else {
    console.error(`❌ ${failures} out of ${successes + failures} tests failed.`);
  }
  console.log("--------------------");
}
