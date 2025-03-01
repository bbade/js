import { World } from "world";

import { KeyHandler } from "documentKeyboardListener";
import { RendererCallbacks } from "renderer-callbacks";
import { Point, TileCoordinates } from "model";

export interface ClickInfo {
    boardX: number;
    boardY: number;
    isLeft: boolean;
    isRight: boolean;
    isCtrlPressed: boolean;
    isShiftPressed: boolean;
}

export class OrthoViewport implements KeyHandler, RendererCallbacks {

    private orthoCanvas: HTMLCanvasElement;
    private world: World;
    private lastBoardSize: TileCoordinates | null = null;
    private hoveredTile: TileCoordinates | null = null;
    private showElevation: boolean = false;

    // values that need to be measure()'d 
    private tileSizePx: number = 1;
    private tileLabelSize: number = 11; // arbitrary font size

    constructor(orthoCanvas: HTMLCanvasElement, world: World) {
        this.orthoCanvas = orthoCanvas;
        this.world = world;

        this.measure();
        this.registerClickHandlers();
        this.configureMouse();
        orthoCanvas.addEventListener('resize', () => this.measure());
    }

    handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case "ArrowUp":
                this.moveUp();
                break;
            case "ArrowDown":
                this.moveDown();
                break;
            case "ArrowLeft":
                this.moveLeft();
                break;
            case "ArrowRight":
                this.moveRight();
                break;
            case "r":
                this.recenter();
                break;
            case "e":
                this.showElevation = !this.showElevation;
                this.redraw();
                break;
            default:
                break;
        }
    }
    redraw(): void {
        this.draw();
    }
    moveUp(): void {
        throw new Error("Method not implemented.");
    }
    moveDown(): void {
        throw new Error("Method not implemented.");
    }
    moveLeft(): void {
        throw new Error("Method not implemented.");
    }
    moveRight(): void {
        throw new Error("Method not implemented.");
    }
    recenter(): void {
        throw new Error("Method not implemented.");
    }

    private measure() {
        const world = this.world;

        const canvasWidthPx = this.orthoCanvas.width;
        const canvasHeightPx = this.orthoCanvas.height;
        const worldW = world.getWidth();
        const worldH = world.getHeight();

        const smallestDimenPx = Math.min(canvasWidthPx, canvasHeightPx);
        this.tileSizePx = Math.floor(smallestDimenPx / Math.max(worldW, worldH));

        // this.tileLabelSize = fitFont(this.tileSizePx);

        console.log(`Measured canvas is ${canvasWidthPx} by ${canvasHeightPx} pixels, tilesize is ${this.tileSizePx}`);
        console.log(`Board size is ${worldW} by ${worldH} tiles`);
    }

    private draw() {
        const world = this.world;
        const worldW = world.getWidth();
        const worldH = world.getHeight();

        const lastBoardWidth = this.lastBoardSize?.boardX  ;
        const lastBoardHeight = this.lastBoardSize?.boardY;
        if (lastBoardWidth != worldW || lastBoardHeight != worldH) {
            this.measure();
        }
        this.lastBoardSize = { boardX: worldW, boardY: worldH };

        const canvasWidthPx = this.orthoCanvas.width;
        const canvasHeightPx = this.orthoCanvas.height;
        const tileSizePx = this.tileSizePx;
        const ctx2d = this.orthoCanvas.getContext("2d")!;

        ctx2d.clearRect(0, 0, canvasWidthPx, canvasHeightPx);

        for (let boardY = 0; boardY < worldH; boardY++) {
            for (let boardX = 0; boardX < worldW; boardX++) {
                const color = world.getTexel(boardX, boardY);
                ctx2d.fillStyle = color;
                ctx2d.fillRect(boardX * tileSizePx, boardY * tileSizePx, tileSizePx, tileSizePx);

                if (this.showElevation) {
                    const elevation = world.getTile(boardX, boardY)!;
                    this.drawTextInTile(elevation.toString(), { boardX, boardY });  
                }
            }
        }
    }

    private pixelToBoard(canvasX: number, canvasY: number): TileCoordinates {
        const boardX = Math.floor(canvasX / this.tileSizePx);
        const boardY = Math.floor(canvasY / this.tileSizePx);
        return { boardX: boardX, boardY: boardY };
    }

    private boardToPixel(board: TileCoordinates): Point {
        const canvasX = board.boardX * this.tileSizePx;
        const canvasY = board.boardY * this.tileSizePx;
        return new Point(canvasX, canvasY);
    }
    
    private registerClickHandlers() {
        this.orthoCanvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            const clickInfo = this.createClickInfo(event);
            this.onClick(clickInfo);
        });

        this.orthoCanvas.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            const clickInfo = this.createClickInfo(event);
            this.onClick(clickInfo);
        });
    }

    private createClickInfo(event: MouseEvent): ClickInfo {
        const { boardX, boardY } = this.pixelToBoard(event.offsetX, event.offsetY);
        return {
            boardX,
            boardY,
            isLeft: event.button === 0,
            isRight: event.button === 2,
            isCtrlPressed: event.ctrlKey,
            isShiftPressed: event.shiftKey
        };
    }

    private onClick(clickInfo: ClickInfo) {
        const handler = this.world.eventHandler;
        const delta = clickInfo.isLeft ? 1 : -1;
        if (clickInfo.isShiftPressed) {
            handler.changeTileElevationBulk(clickInfo.boardX, clickInfo.boardY, delta, !clickInfo.isCtrlPressed);
        } else {
            handler.changeTileElevation(clickInfo.boardX, clickInfo.boardY, delta);
        }
    }

    private configureMouse() {
        this.orthoCanvas.addEventListener('mousemove', (event: MouseEvent) => {
            const { boardX, boardY } = this.pixelToBoard(event.offsetX, event.offsetY);
            console.log(`Mouse over board coordinates: (${boardX}, ${boardY})`);
        });

        this.orthoCanvas.addEventListener('mouseleave', () => {
            console.log('Mouse left orthoCanvas');
        });

        this.orthoCanvas.style.cursor = 'crosshair';
    }

    private onTileClick(tile: TileCoordinates, isShift: boolean ){
        const handler = this.world.eventHandler;
        handler.changeTileElevation(tile.boardX, tile.boardY, isShift ? -1 : 1);
    }

    private drawTextInTile(text: string, tile: TileCoordinates, fontSize: number = this.tileLabelSize) {
        const ctx2d = this.orthoCanvas.getContext("2d")!;
        const { x, y } = this.boardToPixel(tile);

        const displayText = text.substring(0, 2); // Take the first two characters
        ctx2d.font = `${fontSize}px 'Roboto', monospace`;
        ctx2d.fillStyle = "black";
        ctx2d.textAlign = "center";
        ctx2d.textBaseline = "middle";

        const textX = x + this.tileSizePx / 2;
        const textY = y + this.tileSizePx / 2;

        ctx2d.fillText(displayText, textX, textY);
    }
}


// todo: might not work. 
function fitFont(squareSize: number): number {
    const padding = 8;
    const availableSize = squareSize - 2 * padding;
    const fontSize = Math.floor(availableSize / 2);
    return fontSize;
}