// src/render.ts

import { GameState } from "./spaceinv"; // Import GameState
import { PositionComponent, RenderableComponent } from "./model";
import { Constants } from "./constants";

export function drawRect(ctx: CanvasRenderingContext2D, position: PositionComponent, renderable: RenderableComponent) {
    ctx.fillStyle = renderable.color;
    ctx.fillRect(position.x, position.y, renderable.width, renderable.height);
}
export function renderGame(ctx: CanvasRenderingContext2D, gameState: GameState) {
    if (!ctx) return;
    ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

    drawRect(ctx, gameState.player.position, gameState.player.renderable); // Use components

    //Draw Player projectiles
    gameState.playerWeapon.drawProjectiles(ctx);


    for (const laser of gameState.enemyLasers) {
        drawRect(ctx, laser, laser);  //Pass same for simplicity
    }

    for (const enemy of gameState.enemies) {
        if (enemy.alive) { //Check alive here
          drawRect(ctx, enemy.position, enemy.renderable);
        }
    }

    // Draw barriers
    for (const barrier of gameState.barriers) {
        for (let row = 0; row < Constants.BARRIER_HEALTH_ROWS; row++) {
            for (let col = 0; col < Constants.BARRIER_HEALTH_COLS; col++) {
                if (barrier.barrier.health[row][col] === 1) {
                    ctx.fillStyle = barrier.renderable.color;
                    ctx.fillRect(
                        barrier.position.x + col * (barrier.renderable.width / Constants.BARRIER_HEALTH_COLS),
                        barrier.position.y + row * (barrier.renderable.height / Constants.BARRIER_HEALTH_ROWS),
                        barrier.renderable.width / Constants.BARRIER_HEALTH_COLS,
                        barrier.renderable.height / Constants.BARRIER_HEALTH_ROWS
                    );
                }
            }
        }
    }

    if (gameState.gameOver) {
        ctx.fillStyle = Constants.GAME_OVER_COLOR;
        ctx.font = Constants.GAME_OVER_FONT;
        const gameOverTextWidth = ctx.measureText('Game Over').width;
        ctx.fillText('Game Over', Constants.CANVAS_WIDTH / 2 - gameOverTextWidth / 2, Constants.CANVAS_HEIGHT / 2);
    }

    if (gameState.stageComplete) {
        ctx.fillStyle = Constants.STAGE_COMPLETE_COLOR;
        ctx.font = Constants.STAGE_COMPLETE_FONT;
        ctx.textAlign = 'center';
        ctx.fillText('Stage Complete', Constants.CANVAS_WIDTH / 2, Constants.CANVAS_HEIGHT / 2);
        ctx.textAlign = 'start';
    }
}