import { Color, scaleBrightness, scaleBrightness_deprecated } from "../../Color";
import { Keys } from "../../engine/Keys";
import { Rect } from "../../math/geometry/Rect";
import { clamp, lerp } from "../../math/math";
import { scale, Vec2 } from "../../math/vec2";


const K = {
    cameraHeight: 1
}


class RectGame {

    readonly canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
    readonly context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    normalizedCanvasSize: Vec2 = new Vec2(this.canvas.width / this.canvas.height, 1); // a canvas is 1 high, by (w/h) wide
    gameState: GameState;
    viewportCenter: Vec2 = scale(this.normalizedCanvasSize, .5); 
    bottomZ = 1;
    cameraHeight = 1; 
    
    constructor() { 
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set up the canvas transform
        this.context.scale(this.canvas.height, -this.canvas.height);
        this.context.translate(0, -1);

        // Initialize game state
                const player = new GameRect(scale(this.normalizedCanvasSize, .5), 0.1, Color.RED, 0);
                const gameState = new GameState(player);
                this.gameState = gameState;
                console.log("game initialized", gameState);
        
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
        this.gameState.player.center.add(directionInput.scale(0.01));

        // draw
        this.draw();
    }

    draw() {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // this.drawGameRect(this.gameState.player);
        drawStack(this.gameState.player, 10, this.bottomZ, this.cameraHeight, this.viewportCenter, this.context);
    }

    private checkInput(): Vec2 {
        const directionInput = new Vec2(0, 0);
        if (Keys.isDown("KeyW")) {
            directionInput.y += 1;
        }
        if (Keys.isDown("KeyS")) {
            directionInput.y -= 1;
        }
        if (Keys.isDown("KeyA")) {
            directionInput.x -= 1;
        }
        if (Keys.isDown("KeyD")) {
            directionInput.x += 1;
        }
        if (Keys.isDown("Equal")) {
            this.bottomZ += 0.2;
        }
        if (Keys.isDown("Minus")) {
            this.bottomZ -= 0.2;
        }
        if (Keys.isDown("KeyQ")) {
            this.cameraHeight += 0.2;
        }
        if (Keys.isDown("KeyE")) {  
            this.cameraHeight -= 0.2;
        }


        return directionInput.normalize();
    }

    private drawGameRect(rect: GameRect) {
        this.context.fillStyle = rect.color.toHexStr();
        let r = rect.r;
        this.context.fillRect(r.x, r.y, r.w, r.h);
    }
}

 class GameState {
    constructor(
        public player: GameRect,
    ) {}

}

class GameRect {
    constructor(
        public center: Vec2,
         public size: number,
         public color: Color,
         public z: number,
        ) {
    }

get r(): Rect {
    return new Rect(
        this.center.x - this.size / 2,
        this.center.y - this.size / 2,
        this.size,
        this.size
    );
}

}

// assumes top of stack is at z=0, bottom is at a postiive z = zOfBottom
function drawStack(
    original: GameRect, 
    n: number, 
    zOfBottom: number, 
    cameraHeight: number,
    windowCenter: Vec2, 
    context: CanvasRenderingContext2D) {
    
    const zStep = (zOfBottom / (n-1));


    // draw back to front
    for (let i = 0; i < n; i++) {
        const z = zOfBottom - i * zStep;
        drawPerspectiveRect(original, n, z, cameraHeight, windowCenter, context);
    }
}

function drawPerspectiveRect(original: GameRect, n: number, rectZ: number, cameraHeight: number, vpCenter: Vec2, 
    context: CanvasRenderingContext2D)
{
    const x0 = original.r.x;
    const y0 = original.r.y;
    const w = original.r.w;
    const h = original.r.h;

    const cameraDist = cameraHeight + rectZ;
    const scale = cameraDist / (cameraDist + rectZ );

    const xt = vpCenter.x + (x0 - vpCenter.x) * scale;
    const yt = vpCenter.y + (y0 - vpCenter.y) * scale;

    const wt = w * scale;
    const ht = h * scale;

    var brightnessScale = 1 - .07*(rectZ / K.cameraHeight);
    brightnessScale = clamp(brightnessScale, .001, 1);
    const color  =  scaleBrightness(original.color, brightnessScale);
    context.fillStyle = color.toHexStr();
    context.fillRect(xt, yt, wt, ht);
    // context.strokeStyle = color.scaleBrightness(0.5).toHexStr();
    // context.lineWidth = 0.01;
    // context.strokeRect(xt, yt, wt, ht);
}

const game = new RectGame();
game.run();

