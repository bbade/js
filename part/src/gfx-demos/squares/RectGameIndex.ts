import {
  Color,
  scaleBrightness,
  scaleBrightness_deprecated,
} from "../../Color";
import { Keys } from "../../engine/Keys";
import { Rect } from "../../math/geometry/Rect";
import { clamp, lerp } from "../../math/math";
import { scale, Vec2 } from "../../math/vec2";
import { Background, BackgroundMaker, BackgroundManager } from "./BackgroundManager";
import { drawStack, GameRect } from "./RectUtils";

const K = {
  lineWidth: 0.001,
  canvasBgColor: Color.BLACK,
  initialCameraHeight: 1,
};

export interface SceneState {
  bounds: Rect;   
  cameraHeight: number;
  viewportCenter: Vec2;
  background: Background;
  normalizedCanvasSize: Vec2;

}

function makeInitialState(normalizedCanvasSize: Vec2): SceneState {
  return {
    cameraHeight: K.initialCameraHeight,
    background: BackgroundMaker.createBackground(Rect.fromV2(new Vec2(), normalizedCanvasSize)),
    viewportCenter:  scale(normalizedCanvasSize, 0.5),
    bounds: new Rect(
        0, 0,
        normalizedCanvasSize.x, normalizedCanvasSize.y
    ),
    normalizedCanvasSize: normalizedCanvasSize
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
    this.gameState = makeInitialState(  new Vec2( this.canvas.width / this.canvas.height,  1));
    this.backgroundManager = new BackgroundManager(this.gameState);

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

  draw() {
    this.context.fillStyle = K.canvasBgColor.toHexStr();
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.gameState.background.stacks.forEach((stack) => {
      drawStack(stack, this.gameState, this.context);
    });
  }

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
    if (Keys.isDown("Equal")) {
      this.gameState.bottomZ += 0.2;
      changed = true;
    }
    if (Keys.isDown("Minus")) {
      this.gameState.bottomZ -= 0.2;
      changed = true;
    }
    if (Keys.isDown("KeyQ")) {
      this.gameState.cameraHeight += 0.2;
      changed = true;
    }
    if (Keys.isDown("KeyE")) {
      this.gameState.cameraHeight -= 0.2;
      changed = true;
    }

    if (changed) {
      console.log("bottom Z:", this.gameState.bottomZ);
      console.log("camera height:", this.gameState.cameraHeight);
    }

    return directionInput.normalize();
  }

  private drawGameRect(rect: GameRect) {
    this.context.fillStyle = rect.color.toHexStr();
    let r = rect.r;
    this.context.fillRect(r.x, r.y, r.w, r.h);
  }
}



const game = new RectGame();
game.run();
