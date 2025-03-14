// map.ts
import { Tile, Room } from './model';
import { Generator } from './generator';

export class Map {
    private gridWidth: number = 20;
    private gridHeight: number = 20;
    private charGrid: Tile[][];
    private generator: Generator;

    constructor() {
        this.generator = new Generator(this.gridWidth, this.gridHeight); // Keep generator here
        this.charGrid = this.initCharGrid(' ', '#000000', '#ffffff'); // Initialize the grid
    }

    public getGridWidth(): number {
        return this.gridWidth;
    }

    public getGridHeight(): number {
        return this.gridHeight;
    }
    public getTile(x:number, y:number): Tile{
        return this.charGrid[y][x];
    }
    public setTile(x: number, y: number, tile: Tile): void {
       if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
            this.charGrid[y][x] = tile;
        }
    }
    public generateRandomMap(drawingFgColor: string, drawingBgColor: string): void {
        this.generator.generateLevelNoDraw(this, drawingFgColor, drawingBgColor);

    }

    private initCharGrid(defaultChar: string, defaultFgColor: string, defaultBgColor: string): Tile[][] {
        const grid: Tile[][] = [];
        for (let y = 0; y < this.gridHeight; y++) {
            grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                grid[y][x] = { char: defaultChar, fg: defaultFgColor, bg: defaultBgColor };
            }
        }
        return grid;
    }
     getCharGrid(): Tile[][] {
        return this.charGrid;
    }

}