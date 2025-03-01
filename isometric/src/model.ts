

export class Point {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Tile {
    readonly point: Point;
    elevation: number;

    constructor(point: Point, elevation: number) {
        this.point = point;
        this.elevation = elevation;
    }
}

export interface TileCoordinates {
    boardX: number;
    boardY: number;
}

export function TileCoordinates(x: number, y: number): TileCoordinates {
    return { boardX: x, boardY: y };
}

export interface Vertices {
    v1x: number;
    v1y: number;
    v2x: number;
    v2y: number;
    v3x: number;
    v3y: number;
    v4x: number;
    v4y: number;
    v5y: number;
    v6y: number;
    v7y: number;
}