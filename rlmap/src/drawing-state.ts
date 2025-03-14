// drawing-state.ts
import { Tile } from './model';

export class DrawingState {
    public tileToDraw: Tile;
    public fontSize: number;

    constructor(defaultChar: string, defaultFgColor: string, defaultBgColor: string, defaultFontSize: number) {
        this.tileToDraw = { char: defaultChar, fg: defaultFgColor, bg: defaultBgColor };
        this.fontSize = defaultFontSize;
    }

    public setTileToDraw(tile: Tile): void {
        this.tileToDraw = tile;
    }

    public setFontSize(fontSize: number): void {
        this.fontSize = fontSize;
    }
    // No need for getters if public
}