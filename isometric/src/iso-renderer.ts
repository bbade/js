// iso-renderer.ts
import { IsometricContext } from "iso-context";
import { World } from "./world";
import { Point, TileCoordinates } from "model";
import { IsoViewport } from "iso-viewport";
import { RendererCallbacks } from "renderer-callbacks";

function getColorByElevation(elevation: number): string {
    switch (elevation) {
        case 0: return "#0000ff"; // blue (water)
        case 1: return "#ffff00"; // yellow (sandy)
        case 2:
        case 3: return "#00c800"; // green (grass)
        case 4:
        case 5: return "#808080"; // gray (mountain)
        case 6: return "#ffffff"; // white (snow)
        default: return "#808080";
    }
}


class IsoRenderer implements RendererCallbacks {
    private isoContext: IsometricContext;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private world: World;
    private viewport: IsoViewport;

    constructor(isometricContext: IsometricContext, world: World, viewport: IsoViewport) {
        this.isoContext = isometricContext;
        this.isoContext.registerOnRenderNeededListener(this);
        this.canvas = isometricContext.canvas;
        this.ctx = this.canvas.getContext("2d")!; // Assert non-null, checked below
        this.world = world;
        world.renderer = this;
        this.viewport = viewport;
        this.viewport.onChange = this;
        // Initial setup and drawing
        const t = this.isoContext.baseTranslation();
        this.ctx.translate(t.x, t.y);
        this.drawScene();
    }

    private drawTile(
        boardX: number, 
        boardY: number, 
        zHeight: number, 
        color: string, 
        context: CanvasRenderingContext2D, 
        isHighlighted: boolean): void {
        const { v1x, v1y, v2x, v2y, v3x, v3y, v4x, v4y, v5y, v6y, v7y } = this.isoContext.tileVertices(boardX, boardY, zHeight);

        let drawColor = color;
        if (isHighlighted) {
            drawColor = adjustBrightness(color, 0.2); // Brighten for highlight
        }

        // --- Top Face ---
        context.fillStyle = drawColor;
        this.isoContext.tilePath(context, v1x, v1y, v2x, v2y, v3x, v3y, v4x, v4y);
        context.fill();

        // --- Left & Right Faces (only if zHeight > 0) ---
        if (zHeight > 0) {
            // --- Left Face ---
            context.fillStyle = adjustBrightness(drawColor, -0.2);
            context.beginPath();
            context.moveTo(v4x, v4y);
            context.lineTo(v3x, v3y);
            context.lineTo(v1x, v5y);
            context.lineTo(v4x, v6y);
            context.closePath();
            context.fill();

            // --- Right Face ---
            context.fillStyle = adjustBrightness(drawColor, -0.4);
            context.beginPath();
            context.moveTo(v2x, v2y);
            context.lineTo(v3x, v3y);
            context.lineTo(v1x, v5y);
            context.lineTo(v2x, v7y);
            context.closePath();
            context.fill();
        }
    }

    private drawScene(): void {
        const world = this.world;

        for (let boardY = 0; boardY < world.getHeight(); boardY++) {
            for (let boardX = 0; boardX < world.getWidth(); boardX++) {
                const elevation = world.getTile(boardX, boardY)!; 
                let tileColor: string;

                if (world.usingTexture) {
                    tileColor = world.getTexel(boardX, boardY);
                } else {
                    tileColor = getColorByElevation(elevation);
                }

                const highlightedTile = world.getHoveredTile();
                const isHighlighted: boolean = (highlightedTile != null &&
                    highlightedTile.x === boardX &&
                    highlightedTile.y === boardY) 

                for (let elev = 0; elev <= elevation; elev++) {
                    // todo: it would be faster to draw a single tall tile for cases where we arent' doing voxels (always),
                    // but this would limit future expansion if i ever did want to do voxels. If we want an optimized version,
                    // we could instead do a single draw command. This would require a new drawTile, adn also new vertex calculations
                    // in IsoContext.
                    this.drawTile(boardX, boardY, elev, tileColor, this.ctx, isHighlighted);
                }
            }
        }
    }
    

    // // draws with viewport checks
    // private drawScene2(center: Point | null = null): void {
    //     const world = this.world;

    //     const visibleTiles = this.viewport.allTilesWithinViewport();

    //         for (const { x, y } of visibleTiles) {
    //             const boardX = x;
    //             const boardY = y;

    //             const elevation = world.getTile(boardX, boardY)!; // Assert non-null, as we're within bounds
    //             let tileColor: string;

    //             if (world.usingTexture) {
    //                 tileColor = world.getTexel(boardX, boardY);
    //             } else {
    //                 tileColor = getColorByElevation(elevation);
    //             }

    //             const highlightedTile = world.getHoveredTile();
    //             const isHighlighted: boolean = (highlightedTile != null &&
    //                 highlightedTile.x === boardX &&
    //                 highlightedTile.y === boardY) 

    //             for (let elev = 0; elev <= elevation; elev++) {
    //                 this.drawTile(boardX, boardY, elev, tileColor, this.ctx, isHighlighted);
    //             }
    //         }
        
    // }

    public redraw(): void {
        // Store the current transformation matrix
        this.ctx.save();

        // Use the identity matrix while clearing the canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Restore the transform
        this.ctx.restore();
        this.drawScene();
    }
}

function adjustBrightness(color: string, amount: number): string {
    // Handle rgb() colors
    if (color.startsWith("rgb")) {
        let [r, g, b] = color.substring(4, color.length - 1).split(",").map(Number);

        r = Math.min(255, Math.max(0, Math.round(r + amount * 255)));
        g = Math.min(255, Math.max(0, Math.round(g + amount * 255)));
        b = Math.min(255, Math.max(0, Math.round(b + amount * 255)));

        return `rgb(${r}, ${g}, ${b})`;
    }
    //Handle hex
    let usePound = false;
    if (color[0] == "#") {
        color = color.slice(1);
        usePound = true;
    }

    let num = parseInt(color, 16);
    let r = (num >> 16) + amount * 255;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amount * 255;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amount * 255;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    let newColor = (g | (b << 8) | (r << 16)).toString(16);

    while (newColor.length < 6) {
        newColor = "0" + newColor;
    }

    return (usePound ? "#" : "") + newColor;
}

export { IsoRenderer };