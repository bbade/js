import { Point, TileCoordinates, Vertices } from "model";
import {RendererCallbacks} from "iso-renderer";

interface TileSize  {tileWidth: number, tileHeight : number};

export class IsometricContext {
    readonly canvas: HTMLCanvasElement;
    private tileSizes: Point[];
    private selectedTileSizeIndex: number;
    private renderer: RendererCallbacks | null = null;

    registerOnRenderNeededListener(l: RendererCallbacks) {
        this.renderer = l;
    }

    calculateValidSizes(): Point[] {
        const sizes: Point[] = [];
        for (let width = 4, height = 2; width <= 128 && height <= 64; width += 4, height += 2) {
            sizes.push(new Point(width, height));
        }
        return sizes;
    }

    incTileSize(): void {
        if (this.selectedTileSizeIndex < this.tileSizes.length - 1) {
            this.selectedTileSizeIndex++;
        }
        
        console.log(`Selected Tile Index: ${this.selectedTileSizeIndex}, Tile Size: ${this.tileSizes[this.selectedTileSizeIndex].x}x${this.tileSizes[this.selectedTileSizeIndex].y}`);
        this.renderer?.redraw();
    }

    decTileSize(): void {
        if (this.selectedTileSizeIndex > 0) {
            this.selectedTileSizeIndex--;
        }
        console.log(`Selected Tile Index: ${this.selectedTileSizeIndex}, Tile Size: ${this.tileSizes[this.selectedTileSizeIndex].x}x${this.tileSizes[this.selectedTileSizeIndex].y}`);

        this.renderer?.redraw();
    }

    constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.tileSizes = this.calculateValidSizes();
        this.selectedTileSizeIndex = this.tileSizes.findIndex(size => size.x === 64);
    }

    tileSize(): TileSize {
        const {x, y } = this.tileSizes[this.selectedTileSizeIndex];
        return { tileWidth: x, tileHeight: y};
    }
    
    baseTranslation(): Point {
        return new Point(this.canvas.width / 2, 250)
    }

    screenToIso(screenX: number, screenY: number): TileCoordinates {
        const {tileWidth, tileHeight} = this.tileSize();

        const baseT = this.baseTranslation();
        const isoX = screenX - baseT.x;
        const isoY = screenY - baseT.y;
    
        const boardXMaybeFloat: number = (isoX / (tileWidth / 2) + isoY / (tileHeight / 2)) / 2;
        const boardYMaybeFloat: number  = (isoY / (tileHeight / 2) - isoX / (tileWidth / 2)) / 2;

        const boardX = Math.floor(boardXMaybeFloat);
        const boardY = Math.floor(boardYMaybeFloat);

        return { boardX: boardX, boardY: boardY };
    }

    tileVertices(boardX: number, boardY: number, zHeight: number): Vertices {
        const {tileWidth, tileHeight} = this.tileSize();

        const isoX = (boardX - boardY) * tileWidth / 2;
        const isoY = (boardX + boardY) * tileHeight / 2;
        const topOffsetY = -zHeight * tileHeight;
    
        return {
            v1x: isoX,
            v1y: isoY + topOffsetY,
            v2x: isoX + tileWidth / 2,
            v2y: isoY + tileHeight / 2 + topOffsetY,
            v3x: isoX,
            v3y: isoY + tileHeight + topOffsetY,
            v4x: isoX - tileWidth / 2,
            v4y: isoY + tileHeight / 2 + topOffsetY,
            v5y: isoY + tileHeight, // Used for left/right faces
            v6y: isoY + tileHeight / 2,  //bottom left
            v7y: isoY + tileHeight / 2, //bottom right
        };
    }
    
    tilePath(context: CanvasRenderingContext2D, v1x: number, v1y: number, v2x: number, v2y: number, v3x: number, v3y: number, v4x: number, v4y: number): void {
        context.beginPath();
        context.moveTo(v1x, v1y);
        context.lineTo(v2x, v2y);
        context.lineTo(v3x, v3y);
        context.lineTo(v4x, v4y);
        context.closePath();
    }
}