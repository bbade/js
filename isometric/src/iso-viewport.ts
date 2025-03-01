import { IsometricContext } from "iso-context";
import { Point, Tile, TileCoordinates } from "model";
import { RendererCallbacks } from "renderer-callbacks";
import { World } from "world";

export class IsoViewport {
    world: World;
    context: IsometricContext;
    onChange: RendererCallbacks | null = null;

    constructor(world: World, context: IsometricContext) {
        this.world = world;
        this.context = context;

        if (!world) {
            throw new Error("World cannot be null or undefined");
        }

        if (!context) {
            throw new Error("Context cannot be null or undefined");
        }
    }


isWithinViewport(tile: TileCoordinates): boolean {
        const { tileWidth, tileHeight } = this.context.tileSize();
        const canvasWidth = this.context.canvas.width;
        const canvasHeight = this.context.canvas.height;

        const center: TileCoordinates = this.world.getCurrentCenter();
        const isoCenter = this.context.screenToIso(center.boardX, center.boardY);

        const isoX = (tile.boardX - isoCenter.boardX) * tileWidth / 2;
        const isoY = (tile.boardY - isoCenter.boardY) * tileHeight / 2;

        const screenX = isoX + canvasWidth / 2;
        const screenY = isoY + canvasHeight / 2;

        return screenX >= 0 && screenX <= canvasWidth && screenY >= 0 && screenY <= canvasHeight;
    }

    allTilesWithinViewport(): TileCoordinates[] {
        const visibleTiles: TileCoordinates[] = [];
        for (let y = 0; y < this.world.getHeight(); y++) {
            for (let x = 0; x < this.world.getWidth(); x++) {
                const tilePoint = TileCoordinates(x, y);
                if (this.isWithinViewport(tilePoint)) {
                    visibleTiles.push(tilePoint);
                }
            }
        }
        return visibleTiles;
    }
}

const IsoConstants = {
    delta: 1
};