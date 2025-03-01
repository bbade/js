// src/inputlogic.ts

import { InputState } from "./input";
import { GameState } from "./spaceinv";
import { Constants } from "./constants"; // Import constants for cooldowns and other values
import { Weapon, BasicLaser, Beam, DoubleLaser, MomentumLaser } from "./weapons"; // Import weapon classes

export function handleInput(gameState: GameState, weapons: { [key: string]: Weapon }, deltaTime:number) {
    // Player movement and update speedX
    gameState.player.player.speedX = 0;
    if (gameState.input.ArrowLeft && gameState.player.position.x > 0) {
        gameState.player.position.x -= gameState.player.player.speed * deltaTime;
        gameState.player.player.speedX = -gameState.player.player.speed;
    }
    if (gameState.input.ArrowRight && gameState.player.position.x < gameState.player.renderable.width) {
        gameState.player.position.x += gameState.player.player.speed * deltaTime;
        gameState.player.player.speedX = gameState.player.player.speed;
    }

    if (gameState.input.Space) {
        if (gameState.player.player.laserCooldown <= 0) {
            const newProjectiles = gameState.playerWeapon.fire(gameState.player.position.x, gameState.player.position.y, gameState.player.player.speedX);
            // Add new projectiles directly to the game state
            for (const projectile of newProjectiles) {
                //Make projectiles into entities
                gameState.enemies.push( //Push directly to enemies
                    {
                        position: { x: projectile.x, y: projectile.y },
                        renderable: { width: projectile.width, height: projectile.height, color: projectile.color },
                        projectile: projectile, //Store for later access
                        collision: { width: projectile.width, height: projectile.height },
                        isPlayerProjectile: true, // New component to distinguish
                    }
                )
            }

            gameState.player.player.laserCooldown = Constants.PLAYER_LASER_COOLDOWN;
        }
    }

    if (gameState.player.player.laserCooldown > 0) gameState.player.player.laserCooldown--;

    // Weapon selection.  Note: checking against current weapon is now done *inside* handleInput
    if (gameState.input.Key1) {
      gameState.playerWeapon = weapons['1'];
    } else if (gameState.input.Key2) {
      gameState.playerWeapon = weapons['2'];
    } else if (gameState.input.Key3) {
      gameState.playerWeapon = weapons['3'];
    } else if (gameState.input.Key4) {
      gameState.playerWeapon = weapons['4'];
    } else if (gameState.input.Key5) {
      gameState.playerWeapon = weapons['5'];
    }
}