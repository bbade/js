// World.ts

import { Point, TileCoordinates } from "model";
import { RendererCallbacks } from "renderer-callbacks";

/**
* These take events that have been transformed into board coordinates
* and update the state of the world. 
*/
export interface WorldEventHandler {
    setHoveredTile: (x: number, y: number) => void;
    clearHoveredTile: () => void;
    changeTileElevation: (x: number, y: number, delta: number) => void;
    changeTileElevationBulk: (x: number, y: number, delta: number, isGlobal: boolean) => void;
    setTexture(texture: HTMLImageElement): void;
    clearTexture(): void;
    reset(): void;
    rotateWorld(counterClockwise: boolean): void;
}

// TODO TODO TODO: Refactor to request a redraw after it changes. 

export class World {
    board = [] as number[][];  // 2D array of numbers (elevations)
    textureCanvas = null as HTMLCanvasElement | null;
    textureCtx = null as CanvasRenderingContext2D | null;
    usingTexture = false;
    private hoveredTile = null as TileCoordinates | null;
    renderer: RendererCallbacks | null = null;
    dontRedraw: boolean = false; // enable this to do a number of operations
    currentCenter: TileCoordinates | null = null;
    
    constructor(width: number, height: number) {
        this.initBoard(width, height);
    }
    
    redraw() {
        if (this.dontRedraw) {
            return;
        }
        this.renderer?.redraw();
    }
    
    initBoard(width: number = 16, height: number = 16): void {
        this.board = [];
        for (let y = 0; y < height; y++) {
            let row: number[] = [];
            for (let x = 0; x < width; x++) {
                row.push(0); // Initialize all elevations to 0
            }
            this.board.push(row);
        }
    }
    
    getTile(boardX: number, boardY: number): number | null {
        if (boardX >= 0 && boardX < this.board[0].length && boardY >= 0 && boardY < this.board.length) {
            return this.board[boardY][boardX];
        }
        return null; // Or handle out-of-bounds differently
    }
    
    setTile(boardX: number, boardY: number, elevation: number): void {
        if (boardX >= 0 && boardX < this.board[0].length && boardY >= 0 && boardY < this.board.length) {
            this.board[boardY][boardX] = elevation;
        }
    }
    
    getHoveredTile(): TileCoordinates | null {
        return this.hoveredTile;
    }
    
    getTexel(boardX: number, boardY: number): string {
        if (!this.textureCtx) {
            return "#000000"; // Default color if no texture
        }
        
        let texX = boardX;
        let texY = boardY;
        
        // Bounds Check
        if (texX < 0 || texX >= this.textureCanvas!.width || texY < 0 || texY >= this.textureCanvas!.height) {
            return "#000000"; //Return black if out of bounds.
        }
        
        const pixelData = this.textureCtx.getImageData(texX, texY, 1, 1).data;
        return `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
    }
    
    
    
    getWidth(): number {
        return this.board[0].length;
    }
    
    getHeight(): number {
        return this.board.length;
    }
    
    getActualCenter(): TileCoordinates {
        const centerX = Math.floor(this.getWidth() / 2);
        const centerY = Math.floor(this.getHeight() / 2);
        return { boardX: centerX, boardY: centerY };
    }
    
    getCurrentCenter(): TileCoordinates {
        return this.currentCenter ?? this.getActualCenter();
    }
    
    moveCenter(deltaX: number, deltaY: number): void {
        let center: TileCoordinates;
        if (this.currentCenter == null) {
            center = this.getActualCenter();
            this.currentCenter = center;
        }
        else {
            center = this.currentCenter; 
        };
        
        const x = Math.floor(center.boardX + deltaX);
        const y = Math.floor(center.boardY + deltaY);
        this.currentCenter = { boardX: x, boardY: y };
        this.renderer?.redraw();
    }
    
    recenter() {
        this.currentCenter = this.getActualCenter();
        this.renderer?.redraw();
    }
    
    
    changeElevation(boardX: number, boardY: number, delta: number, operation: TileEditType): void {
        // if (boardX >= 0 && boardX < this.getWidth() && boardY >= 0 && boardY < this.getHeight()) {
        //     if (bulkEdit && this.usingTexture) {
        //         const targetColor = this.getTexel(boardX, boardY);
        //         for (let y = 0; y < this.getHeight(); y++) {
        //             for (let x = 0; x < this.getWidth(); x++) {
        //                 if (this.getTexel(x, y) === targetColor) {
        //                     this.setTile(x, y, Math.max(0, this.getTile(x, y)! + delta));
        //                 }
        //             }
        //         }
        //     } else {
        
        //     }
        // }
        
        this.redraw();
        
        switch (operation) {
            case TileEditType.Single:
            this.setTile(boardX, boardY, Math.max(0, this.getTile(boardX, boardY)! + delta));
            break;
            case TileEditType.Global:
            if (!this.usingTexture) { break; } else {
                const targetColor = this.getTexel(boardX, boardY);
                for (let y = 0; y < this.getHeight(); y++) {
                    for (let x = 0; x < this.getWidth(); x++) {
                        if (this.getTexel(x, y) === targetColor) {
                            this.setTile(x, y, Math.max(0, this.getTile(x, y)! + delta));
                        }
                    }
                }
            }
            break;
            case TileEditType.Flood:
            this.floodIter(boardX, boardY, (x, y) => {
                this.setTile(x, y, Math.max(0, this.getTile(x, y)! + delta));
            });
            break;
        }
        
        this.redraw();
    }
    
    floodIter(boardX: number, boardY: number, op: (x: number, y: number) => void): void {
        if (!this.textureCtx) {
            return;
        }
        
        const targetColor = this.getTexel(boardX, boardY);
        const visited = new Set<string>();
        const stack = [{ x: boardX, y: boardY }];
        
        const key = (x: number, y: number) => `${x},${y}`;
        
        while (stack.length > 0) {
            const { x, y } = stack.pop()!;
            if (visited.has(key(x, y))) {
                continue;
            }
            
            visited.add(key(x, y));
            op(x, y);
            
            const neighbors = [
                { x: x + 1, y },
                { x: x - 1, y },
                { x, y: y + 1 },
                { x, y: y - 1 }
            ];
            
            for (const neighbor of neighbors) {
                if (
                    neighbor.x >= 0 && neighbor.x < this.getWidth() &&
                    neighbor.y >= 0 && neighbor.y < this.getHeight() &&
                    !visited.has(key(neighbor.x, neighbor.y)) &&
                    this.getTexel(neighbor.x, neighbor.y) === targetColor
                ) {
                    stack.push(neighbor);
                }
            }
        }
    }
    
    rotateWorld(counterClockwise: boolean = false): void {
        // --- Rotate Texture (if using texture) ---
        if (this.usingTexture && this.textureCanvas) {
            const rotatedCanvas = document.createElement('canvas');
            rotatedCanvas.width = this.textureCanvas.height;  // Swap width/height
            rotatedCanvas.height = this.textureCanvas.width;
            const rotatedCtx = rotatedCanvas.getContext('2d')!; // Assert non-null
            
            rotatedCtx.clearRect(0, 0, rotatedCanvas.width, rotatedCanvas.height); //Clear
            if (counterClockwise) {
                rotatedCtx.rotate(-Math.PI / 2);
                rotatedCtx.drawImage(this.textureCanvas, -this.textureCanvas.width, 0);
                
            }
            else {
                rotatedCtx.rotate(Math.PI / 2);
                rotatedCtx.drawImage(this.textureCanvas, 0, -this.textureCanvas.height);
            }
            
            this.textureCanvas = rotatedCanvas; // Replace the old canvas
            this.textureCtx = rotatedCtx;
        }
        // --- Rotate Board ---
        let newBoard: number[][];
        if (!counterClockwise) {
            newBoard = this.board[0].map((val, index) => this.board.map(row => row[index]).reverse());
        }
        else {
            newBoard = this.board[0].map((val, index) => this.board.map(row => row[row.length - 1 - index]));
        }
        this.board = newBoard; // Assign the new board
        
        this.redraw();
    }
    
    private clearTexture() {
        this.usingTexture = false;
        this.textureCanvas = null;
        this.textureCtx = null;
        
        this.redraw();
    }
    
    readonly eventHandler: WorldEventHandler = {
        setHoveredTile: (x: number, y: number): void => {
            this.hoveredTile = new Point(x, y);
            this.redraw();
        },
        clearHoveredTile: (): void => {
            this.hoveredTile = null;
            this.redraw();
        },
        changeTileElevation: (x: number, y: number, delta: number): void => {
            this.changeElevation(x, y, delta, TileEditType.Single);
        },
        changeTileElevationBulk: (x: number, y: number, delta: number, isGlobal: boolean): void => {
            const op = isGlobal? TileEditType.Global : TileEditType.Flood;
            this.changeElevation(x, y, delta, op);
        },
        
        setTexture: (img: HTMLImageElement): void => {
            this.textureCanvas = document.createElement("canvas");
            this.textureCanvas.width = img.width;
            this.textureCanvas.height = img.height;
            this.textureCtx = this.textureCanvas.getContext("2d")!; // Assert non-null
            this.textureCtx.drawImage(img, 0, 0);
            this.usingTexture = true;
            this.initBoard(img.width, img.height);
            
            this.redraw();
        },
        
        clearTexture: (): void => {
            this.clearTexture();
        },
        
        reset: (): void => {
            this.dontRedraw = true;
            this.clearTexture();
            this.initBoard();
            this.dontRedraw = false;
            this.redraw();
        },
        rotateWorld: (direction: boolean): void => {
            this.rotateWorld(direction);
        }
    }
};

export enum TileEditType {
    Single,
    Global,
    Flood
}