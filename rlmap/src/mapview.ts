// mapview.ts
import { Tile } from './model';
import { DrawingState } from './drawing-state'; // Import DrawingState
import { Map } from './map';

export class MapView {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private cellWidth: number;
    private cellHeight: number;

    constructor(
        private map: Map,
        private drawingState: DrawingState, // Receive DrawingState

    ) {
        this.canvas = document.getElementById('drawingCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
        this.addEventListeners();
        this.calculateFontAspectRatio();
    }

    public draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = `bold ${this.drawingState.fontSize}px monospace`; // Use fontSize from DrawingState
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.imageSmoothingEnabled = false;

        this.ctx.fillStyle = 'black';

        for (let y = 0; y < this.map.getGridHeight(); y++) {
            for (let x = 0; x < this.map.getGridWidth(); x++) {
                const tile = this.map.getTile(x, y);

                // Draw background
                this.ctx.fillStyle = tile.bg;
                this.ctx.fillRect(
                    x * this.cellWidth,
                    y * this.cellHeight,
                    this.cellWidth,
                    this.cellHeight
                );

                // Draw character
                this.ctx.fillStyle = tile.fg;
                this.ctx.fillText(tile.char, x * this.cellWidth, y * this.cellHeight);
            }
        }
    }

    private canvasToGrid(canvasX: number, canvasY: number): { x: number, y: number } {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = canvasX - rect.left;
        const clickY = canvasY - rect.top;
        const gridX = Math.floor(clickX / this.cellWidth);
        const gridY = Math.floor(clickY / this.cellHeight);
        return { x: gridX, y: gridY };
    }

    private addEventListeners(): void {
        this.canvas.addEventListener('click', (event) => {
            const gridCoords = this.canvasToGrid(event.clientX, event.clientY);
            // Use Map's setTile method, and get tileToDraw from DrawingState:
            if (gridCoords.x >= 0 && gridCoords.x < this.map.getGridWidth() && gridCoords.y >= 0 && gridCoords.y < this.map.getGridHeight()) {
              this.map.setTile(gridCoords.x, gridCoords.y, this.drawingState.tileToDraw);
              this.draw();
            }

        });
    }

    public refresh() {
        this.calculateFontAspectRatio();
        this.draw();
    }

    public calculateFontAspectRatio() {
        this.ctx.font = `bold ${this.drawingState.fontSize}px monospace`; // Use fontSize from DrawingState
        const testChar = 'M';
        const metrics = this.ctx.measureText(testChar);
        const actualWidth = metrics.width;

        const fontBoxHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        const actualBoxHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const avgHeight = (fontBoxHeight + actualBoxHeight) / 2;

        const cellWidth = Math.round(actualWidth);
        const cellHeight = Math.round(avgHeight);

        this.canvas.width = this.map.getGridWidth() * cellWidth; // Use Map methods
        this.canvas.height = this.map.getGridHeight() * cellHeight;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
    }
}