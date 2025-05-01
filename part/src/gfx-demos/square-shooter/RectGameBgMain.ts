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
  RectSpawner3,
} from "./BackgroundManager";
import { BgRect } from "./BgRect";
import { drawBgRectTransformed } from "./DrawRects";
import { FgRect, PlayerInput, RectGameFgManager } from "./RectGameFgMain";

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
  fgManager: RectGameFgManager;

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
    // this.gameState.background = Background.pattern1(this.gameState.bounds);
    this.backgroundManager = new BackgroundManager(
      this.gameState,
      RectSpawner2(this.gameState.bounds)
    );

    this.fgManager = new RectGameFgManager(this.gameState);

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
    this.fgManager.update(deltaMs, directionInput);

    // draw
    this.draw();
  }

  debugRect = new BgRect(
    new Vec2(0, 0),
    0.2,
    0.2,
    Color.MAGENTA,
    0,
    new Vec2()
  );

  draw() {
    this.context.fillStyle = K.canvasBgColor.toHexStr();
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const zOrderedRects: BgRect[] = [];
    this.gameState.background.rects.forEach((rect: BgRect) => {
      zOrderedRects.push(rect);
    });

    zOrderedRects.sort((a, b) => b.z - a.z);

    zOrderedRects.forEach((rect: BgRect) => {
      drawBgRectTransformed(
        rect,
        this.gameState.cameraHeight,
        this.gameState.viewportCenter,
        this.context
      );
    }); // end for-each-zordered-rect

    // drawDebugCircles(this.gameState.bounds, this.context);

    this.fgManager.draw(this.context, this.gameState.cameraHeight, this.gameState.viewportCenter);

  } // end draw()

  private checkInput(): PlayerInput {
    let changed = false;


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

    return {
      left: Keys.isDown("ArrowLeft"),
      right: Keys.isDown("ArrowRight"),
      up: Keys.isDown("ArrowUp"),
      down: Keys.isDown("ArrowDown"),
      fire: Keys.isDown("Space"),
    };
  }
}

const game = new RectGame();
game.run();
