import { BgRectStack, getPerspectiveRect, projectRect } from "../gfx-demos/squares/BgRectStack";
import { GameRect } from "../gfx-demos/squares/GameRect";
import { Rect } from "../math/geometry/Rect";
import { Vec2 } from "../math/vec2";
import { Color } from "../Color";
import { assertRectsEqual } from "./TestUtils";

// function testGetPerspectiveRect(): boolean {
//   const topRect = new GameRect(new Vec2(0, 0), 100, 100, new Color(255, 0, 0), 0);
//   const bottomZ = 1000;
//   const cameraHeight = 500;
//   const vpCenter = new Vec2(500, 500);
//   const numRects = 5;

//   const stack = new BgRectStack(topRect, bottomZ, new Vec2(0, 0), numRects);
//   const rects = BgRectStack.getRects(stack);

//   for (let i = 0; i < numRects; i++) {
//     const z = bottomZ - (i / numRects) * bottomZ;
//     const expectedRect = getPerspectiveRect(topRect, z, cameraHeight, vpCenter);

//     if (
//       rects[i].r.x !== expectedRect.r.x ||
//       rects[i].r.y !== expectedRect.r.y ||
//       rects[i].r.w !== expectedRect.r.w ||
//       rects[i].r.h !== expectedRect.r.h
//     ) {
//       console.error(
//         `❌ Test failed for rect at index ${i}. Expected: ${expectedRect.r.toString()}, Got: ${rects[i].r.toString()}`
//       );
//       return false;
//     }
//   }

//   console.log("✅ All tests passed for getPerspectiveRect!");
//   return true;
// }

function rect(gameRect: GameRect): Rect {
  return GameRect.toRect(gameRect);
}

function testGameRect(): boolean {
  const center = new Vec2(.5, .5);
  const xsize = 1;
  const ysize = 1;
  const color = new Color(255, 0, 0);
  const z = 0;

  const gameRect = new GameRect(center, xsize, ysize, color, z);
  const actualRect = rect(gameRect);

  const expectedRect = new Rect(0, 0, 1, 1);

  if (
    actualRect.x !== expectedRect.x ||
    actualRect.y !== expectedRect.y ||
    actualRect.w !== expectedRect.w ||
    actualRect.h !== expectedRect.h
  ) {
    console.error(`❌ testGameRect failed: Expected ${expectedRect.toString()}, Got ${actualRect.toString()}`);
    return false;
  }

  console.log("✅ Test passed for GameRect!");
  return true;
}

function testStackSize1(): boolean {
  const topRect = new GameRect(new Vec2(-0.25, 0.5), 0.5, 0.5, new Color(255, 0, 0), 0);
  const bottomZ = 0;
  const cameraHeight = 1;
  const vpCenter = new Vec2(0, 0);

  const stack = new BgRectStack(topRect, bottomZ, new Vec2(0, 0), 1);
  const rectStack = BgRectStack.getRects(stack);

  console.log("rectStack contents:", rectStack);

  if (rectStack.length !== 1) {
    console.error(`❌ Test failed: Expected stack size of 1, but got ${rectStack.length}`);
    return false;
  }

  const expectedRect = getPerspectiveRect(topRect, bottomZ, cameraHeight, vpCenter);

  const actualRect = GameRect.toRect(rectStack[0]);
  const expectedR = GameRect.toRect(expectedRect);

  if (
    actualRect.x !== expectedR.x ||
    actualRect.y !== expectedR.y ||
    actualRect.w !== expectedR.w ||
    actualRect.h !== expectedR.h
  ) {
    console.error(
      `❌ Test failed for single rect. Expected: ${expectedR.toString()}, Got: ${actualRect.toString()}`
    );
    return false;
  }

  console.log("✅ Test passed for testStackSize1!");
  return true;
}

function testProjectRect_z0(): boolean {
  const r = new Rect(0, 0, 1, 1);
  const rectZ = 0;
  const cameraHeight = 1
  const vpCenter = new Vec2(0, 0);

  const rp = projectRect(r, rectZ, cameraHeight, vpCenter);

  return assertRectsEqual(r, rp, "projectRect z0");
}

function testProjectRect_z1(): boolean {
  const x = 0;
  const y = 0;
  const w = 1;
  const h = 1;
  const scale = .5

  const rectZ = 1;
  const cameraHeight = 1
  const vpCenter = new Vec2(0, 0);

  const expected = new Rect(0, 0, w*scale, h*scale);
  const actual = projectRect(new Rect(x, y, w, h), rectZ, cameraHeight, vpCenter);

  // TODO: is this correct? Shouldn't it move?

  return assertRectsEqual(expected, actual, "projectRect z1");
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

  // runTest(testGetPerspectiveRect);
  runTest(testStackSize1);
  runTest(testGameRect);
  runTest(testProjectRect_z0);
  runTest(testProjectRect_z1);


  console.log("\n--- TestBgRectStack.ts Test Summary ---");
  if (failures === 0) {
    console.log(`✅ All ${successes} tests passed!`);
  } else {
    console.error(`❌ ${failures} out of ${successes + failures} tests failed.`);
  }
  console.log("--------------------");
}
