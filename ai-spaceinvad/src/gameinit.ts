// src/gameinit.ts

import { Constants } from "./constants";
import { GameState,  PositionComponent, RenderableComponent, CollisionComponent, PlayerComponent, EnemyComponent, BarrierComponent} from "./model"; // Import GameState and component interfaces

export function createPlayer(): any {
    return {
        position: {
            x: Constants.CANVAS_WIDTH / 2 - Constants.PLAYER_WIDTH / 2,
            y: Constants.CANVAS_HEIGHT - Constants.PLAYER_HEIGHT - 20,
        },
        renderable: {
            width: Constants.PLAYER_WIDTH,
            height: Constants.PLAYER_HEIGHT,
            color: Constants.PLAYER_COLOR,
        },
        collision: {
            width: Constants.PLAYER_WIDTH,
            height: Constants.PLAYER_HEIGHT,
        },
        player: {
            speed: Constants.PLAYER_SPEED,
            laserCooldown: 0,
            speedX: 0,
        },
    };
}


export function createEnemy(x: number, y: number, speed: number): any {
    return {
        position: { x, y },
        renderable: {
            width: Constants.ENEMY_WIDTH,
            height: Constants.ENEMY_HEIGHT,
            color: Constants.ENEMY_COLOR,
        },
        collision: {
            width: Constants.ENEMY_WIDTH,
            height: Constants.ENEMY_HEIGHT,
        },
        enemy: {
            speed: speed,
            fireChance: Constants.ENEMY_FIRE_CHANCE,
        },
        health: { // Add health component to enemies
          health: 1,
          maxHealth: 1,
      },
        alive: true, //Keep alive, but handle removal later
    };
}

export function createBarrier(x: number, y: number): any {
  return {
    position: {x,y},
    renderable: {
      width: Constants.BARRIER_WIDTH,
      height: Constants.BARRIER_HEIGHT,
      color: Constants.BARRIER_COLOR
    },
    collision: {
        width: Constants.BARRIER_WIDTH,
        height: Constants.BARRIER_HEIGHT
    },
    barrier: {
      health: Array(Constants.BARRIER_HEALTH_ROWS).fill(null).map(() => Array(Constants.BARRIER_HEALTH_COLS).fill(1))
    }
  }
}
export function initializeEnemies(gameState: GameState) {
  gameState.enemies = []; // Clear existing enemies
  const enemySpeed = calculateEnemySpeed(gameState);
  const initialEnemyXOffset = 50;
  const initialEnemyYOffset = 50;

  for (let row = 0; row < Constants.ENEMY_ROWS; row++) {
      for (let col = 0; col < Constants.ENEMY_COLS; col++) {
          gameState.enemies.push(createEnemy(
              col * (Constants.ENEMY_WIDTH + Constants.ENEMY_SPACING_X) + initialEnemyXOffset,
              row * (Constants.ENEMY_HEIGHT + Constants.ENEMY_SPACING_Y) + initialEnemyYOffset,
              enemySpeed
          ));
      }
  }
}

export function initializeBarriers(gameState: GameState) {
    const barrierYPosition = Constants.CANVAS_HEIGHT - 100;
    if (gameState.barriers.length === 0) { // Create only if empty
        for (let i = 0; i < Constants.BARRIER_NUM; i++) {
          const barrierXPosition = i * (Constants.BARRIER_WIDTH + Constants.BARRIER_SPACING) + (Constants.CANVAS_WIDTH - (Constants.BARRIER_NUM * (Constants.BARRIER_WIDTH + Constants.BARRIER_SPACING) - Constants.BARRIER_SPACING)) / 2;
          gameState.barriers.push(createBarrier(barrierXPosition, barrierYPosition));
        }
    } else { //repair
        for (const barrier of gameState.barriers) {
          for (let row = 0; row < Constants.BARRIER_HEALTH_ROWS; row++) {
            for (let col = 0; col < Constants.BARRIER_HEALTH_COLS; col++) {
              if (barrier.barrier.health[row][col] === 0 && Math.random() < Constants.BARRIER_RESPAWN_CHANCE) {
                barrier.barrier.health[row][col] = 1;
              }
            }
          }
        }
    }
}

// These now need the gameState to get access to the levelMultiplier
export function calculateEnemySpeed(gameState: GameState): number {
  return Constants.ENEMY_HORIZONTAL_SPEED * (1 + (Constants.ENEMY_SPEED_BOOST * gameState.levelMultiplier));
}

export function calculateEnemyLaserSpeed(gameState: GameState): number {
  return Constants.ENEMY_LASER_SPEED * (1 + (Constants.ENEMY_SHOT_SPEED_BOOST * gameState.levelMultiplier));
}