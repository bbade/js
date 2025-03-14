// generator.ts
import { Tile, Room } from './model';
import { Map } from './map'; // Import Map

export class Generator {

    constructor(private gridWidth: number, private gridHeight: number) {}

    public generateLevel(map: Map, drawingFgColor: string, drawingBgColor: string): void {

        const numRooms = 3 + Math.floor(Math.random() * 3);
        const rooms: Room[] = [];

        for (let i = 0; i < numRooms; i++) {
            let width, height, x1, y1, x2, y2;
            let overlap;

            do {
                overlap = false;
                width = 4 + Math.floor(Math.random() * 6);
                height = 3 + Math.floor(Math.random() * 5);
                x1 = Math.floor(Math.random() * (this.gridWidth - width - 1));
                y1 = Math.floor(Math.random() * (this.gridHeight - height - 1));
                x2 = x1 + width;
                y2 = y1 + height;

                for (const existingRoom of rooms) {
                    if (this.doRectsOverlap(x1, y1, width, height, existingRoom.x1, existingRoom.y1, existingRoom.x2 - existingRoom.x1, existingRoom.y2 - existingRoom.y1)) {
                        overlap = true;
                        break;
                    }
                }
            } while (overlap);

            this.drawRoom(map, x1, y1, x2, y2, drawingFgColor, drawingBgColor);
            rooms.push({ x1, y1, x2, y2 });
        }

        for (let i = 0; i < rooms.length - 1; i++) {
            this.connectRooms(map, rooms[i], rooms[i + 1], drawingFgColor, drawingBgColor);
        }
        for (let y = 0; y < this.gridHeight; y++) { // Use gridHeight from parameters
            for (let x = 0; x < this.gridWidth; x++) {  // Use gridWidth from parameters
                if (map.getTile(x,y).char === ' ') {
                    map.setTile(x, y, {char: '█', fg: drawingFgColor, bg: drawingBgColor}); //set via Map
                }
            }
        }
    }
    private drawRoom(map: Map, x1: number, y1: number, x2: number, y2: number, drawingFgColor: string, drawingBgColor: string): void {
        const startX = Math.min(x1, x2);
        const startY = Math.min(y1, y2);
        const endX = Math.max(x1, x2);
        const endY = Math.max(y1, y2);

        if (startY >= 0 && startY < this.gridHeight && startX >= 0 && startX < this.gridWidth) map.setTile(startX, startY, { char: '┌', fg: drawingFgColor, bg: drawingBgColor });
        if (startY >= 0 && startY < this.gridHeight && endX >= 0 && endX < this.gridWidth)   map.setTile(endX, startY,   { char: '┐', fg: drawingFgColor, bg: drawingBgColor });
        if (endY >= 0 && endY < this.gridHeight && startX >= 0 && startX < this.gridWidth)   map.setTile(startX, endY,   { char: '└', fg: drawingFgColor, bg: drawingBgColor });
        if (endY >= 0 && endY < this.gridHeight && endX >= 0 && endX < this.gridWidth)     map.setTile(endX, endY,   { char: '┘', fg: drawingFgColor, bg: drawingBgColor });


        for (let x = startX + 1; x < endX; x++) {
            if (startY >= 0 && startY < this.gridHeight && x >= 0 && x < this.gridWidth)   map.setTile(x, startY, { char: '─', fg: drawingFgColor, bg: drawingBgColor });
            if (endY >= 0   && endY < this.gridHeight   && x >= 0 && x < this.gridWidth)     map.setTile(x, endY,   { char: '─', fg: drawingFgColor, bg: drawingBgColor });
        }
        for (let y = startY + 1; y < endY; y++) {
            if (y >= 0 && y < this.gridHeight && startX >= 0 && startX < this.gridWidth)    map.setTile(startX, y, { char: '│', fg: drawingFgColor, bg: drawingBgColor });
            if (y >= 0 && y < this.gridHeight && endX >= 0 && endX < this.gridWidth)        map.setTile(endX, y,   { char: '│', fg: drawingFgColor, bg: drawingBgColor });
        }
        for (let y = startY + 1; y < endY; y++) {
            for (let x = startX + 1; x < endX; x++) {
                if (y >= 0 && y < this.gridHeight && x >= 0 && x < this.gridWidth)      map.setTile(x,y, { char: '.', fg: drawingFgColor, bg: drawingBgColor });
            }
        }
    }

    private doRectsOverlap(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean {
        return !(x2 > x1 + w1 || x1 > x2 + w2 || y2 > y1 + h1 || y1 > y2 + h2);
    }
    private connectRooms(map: Map, room1: Room, room2: Room, drawingFgColor: string, drawingBgColor: string): void {
        const centerX1 = Math.floor((room1.x1 + room1.x2) / 2);
        const centerY1 = Math.floor((room1.y1 + room1.y2) / 2);
        const centerX2 = Math.floor((room2.x1 + room2.x2) / 2);
        const centerY2 = Math.floor((room2.y1 + room2.y2) / 2);

        let x = centerX1;
        let y = centerY1;

        while (x !== centerX2) {
            if (y >= 0 && y < this.gridHeight && x >= 0 && x < this.gridWidth) {
                if (map.getTile(x,y).char === ' ') map.setTile(x,y,{ char: '.', fg: drawingFgColor, bg: drawingBgColor });
                if (map.getTile(x,y).char === '│') map.setTile(x,y,{ char: '+', fg: drawingFgColor, bg: drawingBgColor });
                if (y + 1 >= 0 && y + 1 < this.gridHeight && map.getTile(x,y+1).char === '─') map.setTile(x,y+1,{ char: '+', fg: drawingFgColor, bg: drawingBgColor });
                if (y - 1 >= 0 && y - 1 < this.gridHeight && map.getTile(x,y-1).char === '─') map.setTile(x,y-1,{ char: '+', fg: drawingFgColor, bg: drawingBgColor });
            }
            x += (x < centerX2) ? 1 : -1;
        }
        while (y !== centerY2) {
            if (y >= 0 && y < this.gridHeight && x >= 0 && x < this.gridWidth) {
                if (map.getTile(x,y).char === ' ') map.setTile(x,y,{ char: '.', fg: drawingFgColor, bg: drawingBgColor });
                if (map.getTile(x,y).char === '─') map.setTile(x,y,{ char: '+', fg: drawingFgColor, bg: drawingBgColor });
                if (x + 1 >= 0 && x + 1 < this.gridWidth && map.getTile(x+1,y).char === '│') map.setTile(x+1,y,{ char: '+', fg: drawingFgColor, bg: drawingBgColor });
                if (x - 1 >= 0 && x - 1 < this.gridWidth && map.getTile(x-1,y).char === '│') map.setTile(x-1,y,{ char: '+', fg: drawingFgColor, bg: drawingBgColor });
            }
            y += (y < centerY2) ? 1 : -1;
        }
    }

}