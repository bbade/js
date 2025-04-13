import {
  Color,
  scaleBrightness,
  scaleBrightness_deprecated,
} from "../../Color";
import { Keys } from "../../engine/Keys";
import { Rect } from "../../math/geometry/Rect";
import { scale, Vec2 } from "../../math/vec2";
import {
  Background,
  BackgroundManager,
  RectSpawner1,
  RectSpawner2,
} from "./BackgroundManager";
import { GameRect } from "./GameRect";
import { BgRectStack2, colorForRect, projectRect } from "./BgRectStack";

const K = {
  lineWidth: 0.001,
  canvasBgColor: Color.BLACK,
  initialCameraHeight: 3,
};

export interface SceneState {
  bounds: Rect;
  cameraHeight: number;
  viewportCenter: Vec2;
  background: Background;
  normalizedCanvasSize: Vec2;
}

function makeInitialState(normalizedCanvasSize: Vec2): SceneState {
  const bounds = new Rect(0, 0, normalizedCanvasSize.x, normalizedCanvasSize.y);
  const vpCenter = scale(normalizedCanvasSize, 0.5);

  console.log("Viewport Center:", vpCenter);

  return {
    cameraHeight: K.initialCameraHeight,
    background: new Background(),
    viewportCenter: vpCenter,
    bounds: bounds,
    normalizedCanvasSize: normalizedCanvasSize,
  };
}

class RectGame {
  readonly canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  readonly context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

  gameState: SceneState;
  backgroundManager: BackgroundManager;

  constructor() {
    this.context.fillStyle = K.canvasBgColor.toHexStr();
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.lineWidth = K.lineWidth;

    // Set up the canvas transform
    this.context.scale(this.canvas.height, -this.canvas.height);
    this.context.translate(0, -1);

    // Initialize game state
    const bounds = new Vec2(this.canvas.width / this.canvas.height, 1);
    this.gameState = makeInitialState(bounds);
    this.gameState.background = Background.pattern1(this.gameState.bounds);
    this.backgroundManager = new BackgroundManager(
      this.gameState /*RectSpawner2(this.gameState.bounds)*/
    );

    Keys.init(); // Initialize key handling
  }

  run() {
    console.log("game running", this.gameState);

    var lastTime = performance.now();
    const frame = (timestamp: DOMHighResTimeStamp) => {
      const deltaMs = timestamp - lastTime;
      lastTime = timestamp;
      this.doFrame(deltaMs);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  doFrame(deltaMs: number) {
    // check input
    const directionInput = this.checkInput();

    // update state
    this.backgroundManager.update(deltaMs);

    // draw
    this.draw();
  }

  debugRect = new GameRect(new Vec2(0, 0), 0.2, 0.2, Color.MAGENTA, 0);

  draw() {
    this.context.fillStyle = K.canvasBgColor.toHexStr();
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const zOrderedRects: GameRect[] = [];
    this.gameState.background.rects.forEach((rect: GameRect) => {
      zOrderedRects.push(rect);
    });

    zOrderedRects.sort((a, b) => b.z - a.z);

    zOrderedRects.forEach((rect: GameRect) => {
      // const r = GameRect.toRect(rect);

      // drawBgRect(
      //   r.x,
      //   r.y,
      //   r.w,
      //   r.h,
      //   rect.color,
      //   rect.z,
      //   this.gameState.cameraHeight,
      //   this.gameState.viewportCenter,
      //   this.context
      // );
      drawBgRectTransformed(
        rect,
        this.gameState.cameraHeight,
        this.gameState.viewportCenter,
        this.context
      );
    }); // end for-each-zordered-rect

    const dr2 = this.debugRect.copy();
    dr2.color = Color.YELLOW;
    dr2.center = this.gameState.viewportCenter.copy();

    const dr3 = this.debugRect.copy();
    dr3.center = this.gameState.bounds.x1y1.copy();
    dr3.color = Color.GRAY;

    [this.debugRect, dr2, dr3].forEach((debugRect) => {
      drawBgRectTransformed(
        debugRect,
        this.gameState.cameraHeight,
        this.gameState.viewportCenter,
        this.context
      );

      // this.context.fillStyle = Color.CYAN.toHexStr();
      // this.context.fillRect(
      //   debugRect.r.x,
      //   debugRect.r.y,
      //   debugRect.r.w,
      //   debugRect.r.h
      // );
    });

    drawDebugCircles(this.gameState.bounds, this.context);

  } // end draw()

  private checkInput(): Vec2 {
    let changed = false;
    const directionInput = new Vec2(0, 0);
    if (Keys.isDown("KeyW")) {
      directionInput.y += 1;
      changed = true;
    }
    if (Keys.isDown("KeyS")) {
      directionInput.y -= 1;
      changed = true;
    }
    if (Keys.isDown("KeyA")) {
      directionInput.x -= 1;
      changed = true;
    }
    if (Keys.isDown("KeyD")) {
      directionInput.x += 1;
      changed = true;
    }
    // if (Keys.isDown("Equal")) {
    //   this.gameState.bottomZ += 0.2;
    //   changed = true;
    // }
    // if (Keys.isDown("Minus")) {
    //   this.gameState.bottomZ -= 0.2;
    //   changed = true;
    // }
    if (Keys.isDown("KeyQ")) {
      this.gameState.cameraHeight += 0.2;
      changed = true;
    }
    if (Keys.isDown("KeyE")) {
      this.gameState.cameraHeight -= 0.2;
      changed = true;
    }

    if (changed) {
      // console.log("bottom Z:", this.gameState.bottomZ);
      console.log("camera height:", this.gameState.cameraHeight);
    }

    return directionInput.normalize();
  }

  // private drawGameRect(rect: GameRect) {
  //   this.context.fillStyle = rect.color.toHexStr();
  //   let r = rect.r;
  //   this.context.fillRect(r.x, r.y, r.w, r.h);
  // }
}

const game = new RectGame();
game.run();

export function drawBgRect(
  x: number,
  y: number,
  w: number,
  h: number,
  color: Color,
  z: number,
  cameraHeight: number,
  vpCenter: Vec2,
  context: CanvasRenderingContext2D
) {
  //

  context.fillStyle = color.toHexStr();
  context.fillRect(x, y, w, h);
  context.strokeStyle = Color.BLUE.toHexStr();
  context.strokeRect(x, y, w, h);
}

export function drawBgRectTransformed(
  gameRect: GameRect,
  cameraHeight: number,
  vpCenter: Vec2,
  context: CanvasRenderingContext2D
) {
  const r = projectRect(gameRect.r, gameRect.z, cameraHeight, vpCenter);

  context.save();
  // context.translate(gameRect.center.x, gameRect.center.y);
  // context.rotate(gameRect.rotation);

  const color = colorForRect(gameRect.color, cameraHeight, gameRect.z);

  context.fillStyle = color.toHexStr();
  context.fillRect(r.x, r.y, r.w, r.h);
  context.strokeStyle = Color.BLUE.toHexStr();
  context.strokeRect(r.x, r.y, r.w, r.h);

  context.restore();
}

function drawDebugCircles(bounds: Rect, context: CanvasRenderingContext2D) {
  const corners = [
    { x: bounds.x, y: bounds.y },
    { x: bounds.x + bounds.w, y: bounds.y },
    { x: bounds.x, y: bounds.y + bounds.h },
    { x: bounds.x + bounds.w, y: bounds.y + bounds.h },
  ];

  context.save();
  context.fillStyle = "green";

  corners.forEach((corner) => {
    context.beginPath();
    context.arc(corner.x, corner.y, 0.1, 0, Math.PI * 2);
    context.fill();
  });

  context.restore();
}
