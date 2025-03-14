//drawing-context.ts
import { Tile } from './model';
export interface DrawingContext {
    getCellWidth(): number;
    getCellHeight(): number;
    getFontSize(): number;
    getDrawingChar(): string;
    getDrawingFgColor(): string;
    getDrawingBgColor(): string;
}