import { BgRectStack2, getPerspectiveRect, projectRect } from "../gfx-demos/squares/BgRectStack";
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

  // stack params
  const x = 0;
  const y = 0;
  const w = 1;
  const h = 1;
  const topZ = 0;
  const zStep = 1;
  const numRects = 1;
  const velocity = new Vec2(0, 0);;

  const r = new Rect(x, y, w, h);
  const topRect = GameRect.fromRect(r, new Color(255, 0, 0), topZ);

  // renderer
  const cameraHeight = 1;
  const vpCenter = new Vec2(0, 0);

  // test
  const stack: BgRectStack2 = new BgRectStack2(topRect, topZ, zStep, numRects, velocity);
  const gameRects: GameRect[] = BgRectStack2.getRects(stack, cameraHeight, vpCenter);


  if (gameRects.length !== 1) {
    console.error(`❌ Test failed: Expected stack size of 1, but got ${gameRects.length}`);
    return false;
  }

  const expectedRect = topRect;

  const actualRect = GameRect.toRect(gameRects[0]);
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


function testStackSize2(): boolean {

  // stack params
  const x = 0;
  const y = 0;
  const w = 1;
  const h = 1;
  const topZ = 0;
  const zStep = 1;
  const numRects = 2;
  const velocity = new Vec2(0, 0);;

  const topR = new Rect(x, y, w, h);
  const topRect = GameRect.fromRect(topR, new Color(255, 0, 0), topZ);

  // renderer
  const cameraHeight = 1;
  const vpCenter = new Vec2(0, 0);

  // test
  const stack: BgRectStack2 = new BgRectStack2(topRect, topZ, zStep, numRects, velocity);
  const gameRects: GameRect[] = BgRectStack2.getRects(stack, cameraHeight, vpCenter);


  if (gameRects.length !== 2) {
    console.error(`❌ Test failed: Expected stack size of 1, but got ${gameRects.length}`);
    return false;
  }


  const actualTopRect = GameRect.toRect(gameRects[0]);
  const actualBottomRect = GameRect.toRect(gameRects[1]);

  const expectedTopR = topR;
  const expectedBottomRect = new Rect(0, 0, .5, .5);

  assertRectsEqual(expectedTopR, actualTopRect, "testStackSize2 top rect");
  assertRectsEqual(expectedBottomRect, actualBottomRect, "testStackSize2 bottom rect");

  console.log("✅ Test passed for testStackSize2!");
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
  runTest(testStackSize2);
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
