// src/spaceinv.ts

import { Constants } from "./constants";
import { Weapon, BasicLaser, Beam, DoubleLaser, MomentumLaser, Projectile, WiggleLaser } from "./weapons";
import { PositionComponent, RenderableComponent, CollisionComponent,  PlayerComponent, EnemyComponent, BarrierComponent } from "./model"; // Import from model.ts
import { createPlayer, initializeEnemies, initializeBarriers, calculateEnemyLaserSpeed, calculateEnemySpeed } from "./gameinit";
import { InputState, setupInputHandling, getCurrentInputState } from "./input";
import { renderGame, drawRect } from "./render";  //And import the render
import { handleInput } from "./inputlogic"; // Import the handleInput function


interface Rectangle {  //Still needed for checkCollision, and Projectile
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}
// --- Game State ---
interface GameState {
    player: any;
    enemies: any[];
    barriers: any[];
    enemyLasers: Projectile[];
    playerWeapon: Weapon;
    gameOver: boolean;
    stageComplete: boolean;
    stageCompleteTime: number;
    levelMultiplier: number;
    input: InputState; // Store input state directly
    enemyDirection: number;
    enemyMoveDown: boolean;
}

function main(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Could not get 2D context");
        return;
    }

    canvas.width = Constants.CANVAS_WIDTH;
    canvas.height = Constants.CANVAS_HEIGHT;

    // --- Game State Initialization ---
    const gameState: GameState = {
        player: null, // Will be set by createPlayer
        enemies: [],
        barriers: [],
        enemyLasers: [],
        playerWeapon: new BasicLaser(), // Start with the basic laser
        gameOver: false,
        stageComplete: false,
        stageCompleteTime: 0,
        levelMultiplier: 0,
        input: {  // Initialize input state
          ArrowLeft: false,
          ArrowRight: false,
          Space: false,
          Key1: false,
          Key2: false,
          Key3: false,
          Key4: false,
          Key5: false,
          //No need to init other keys, they'll default to undefined, which is falsy.
        },
        enemyDirection: 1,
        enemyMoveDown: false
    };
    // Weapon selection mapping
    const weapons: { [key: string]: Weapon } = {
      '1': new BasicLaser(),
      '2': new Beam(),
      '3': new DoubleLaser(),
      '4': new MomentumLaser(),
      '5': new WiggleLaser() // Add WiggleLaser
    };



    // --- Helper Functions ---

    function checkCollision(rect1: PositionComponent & CollisionComponent, rect2: PositionComponent & CollisionComponent): boolean {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    function fireEnemyLaser() {
      //No changes, weapon handles.
        const aliveEnemies = gameState.enemies.filter(enemy => enemy.alive);
        if (aliveEnemies.length > 0) {
            const firingEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
            gameState.enemyLasers.push({  //Use the interface directly, for the simple case
                x: firingEnemy.position.x + firingEnemy.renderable.width / 2 - Constants.LASER_WIDTH / 2,
                y: firingEnemy.position.y + firingEnemy.renderable.height,
                width: Constants.LASER_WIDTH,
                height: Constants.LASER_HEIGHT,
                color: Constants.ENEMY_LASER_COLOR,
                speed: calculateEnemyLaserSpeed(gameState),
                update: () => {}, //Dummy functions to satisfy interface, physics handles updates.
                draw: () => {},
                isOffScreen: () => {return false;}

            });
        }
    }

    function moveProjectiles(projectileArray: Projectile[], deltaTime: number) {
        for (let i = projectileArray.length - 1; i >= 0; i--) {
            projectileArray[i].y += projectileArray[i].speed * deltaTime; // Use deltaTime
            if (projectileArray[i].y < 0 || projectileArray[i].y > canvas.height) {
                projectileArray.splice(i, 1);
            }
        }
    }
  function damageBarrier(projectile: Projectile, barrier: any): boolean {

      const gridX = Math.floor((projectile.x - barrier.position.x) / (barrier.renderable.width / Constants.BARRIER_HEALTH_COLS));
      const gridY = Math.floor((projectile.y - barrier.position.y) / (barrier.renderable.height / Constants.BARRIER_HEALTH_ROWS));

      if (gridX >= 0 && gridX < Constants.BARRIER_HEALTH_COLS && gridY >= 0 && gridY < Constants.BARRIER_HEALTH_ROWS) {
          if (barrier.barrier.health[gridY][gridX] === 1) {
              barrier.barrier.health[gridY][gridX] = 0;
              return true;
          }
      }
      return false;
  }
    function handleProjectileBarrierCollisions(projectileArray: Projectile[]) {
        for (let i = projectileArray.length - 1; i >= 0; i--) {
            for (let j = 0; j < gameState.barriers.length; j++) {
                if (checkCollision(projectileArray[i], {position: gameState.barriers[j].position, collision: gameState.barriers[j].renderable})) { //Restructure for collision
                    if (damageBarrier(projectileArray[i], gameState.barriers[j])) {
                        projectileArray.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    function handleEnemyMovement(deltaTime: number) {
        let leftmost = canvas.width;
        let rightmost = 0;
        for (const enemy of gameState.enemies) {
            if (!enemy.alive) continue;
            leftmost = Math.min(leftmost, enemy.position.x);
            rightmost = Math.max(rightmost, enemy.position.x + enemy.renderable.width);
            if (Math.random() < Constants.ENEMY_FIRE_CHANCE) {
                fireEnemyLaser();
            }
        }

        if (gameState.enemyMoveDown) {
            for (const enemy of gameState.enemies) {
                enemy.position.y += (Constants.ENEMY_MOVE_DOWN_AMOUNT + (Constants.ENEMY_MOVE_DOWN_AMOUNT_INCREASE * gameState.levelMultiplier)) * deltaTime; // Use deltaTime
            }
            gameState.enemyMoveDown = false;
            gameState.enemyDirection *= -1;
        } else if (rightmost > canvas.width - Constants.RIGHT_EDGE_BUFFER && gameState.enemyDirection == 1) {
            gameState.enemyMoveDown = true;
        } else if (leftmost < Constants.LEFT_EDGE_BUFFER && gameState.enemyDirection == -1) {
            gameState.enemyMoveDown = true;
        } else {
            for (const enemy of gameState.enemies) {
                enemy.position.x += gameState.enemyDirection * enemy.enemy.speed * deltaTime; // Use deltaTime
            }
        }
    }

  function handleCollisions() {
    // Player projectiles hitting enemies
      const activePlayerProjectiles = gameState.enemies.filter(e => e.isPlayerProjectile); // Find all projectiles
      if (gameState.playerWeapon instanceof Beam) {
          const beam = gameState.playerWeapon.getActiveBeam();
          if (beam) {
              let highestEnemyY = canvas.height;
                    for (let j = gameState.enemies.length - 1; j >= 0; j--) {
                        const enemy = gameState.enemies[j];
                        if (enemy.alive && enemy.enemy && checkCollision(beam, {position: enemy.position, collision: enemy.renderable})) { //Correct
                            enemy.alive = false; // Use the alive property
                            highestEnemyY = Math.min(highestEnemyY, enemy.position.y);
                        }

                    }
                    beam.setStartY(gameState.player.position.y);
                  beam.setEndY(highestEnemyY);
              }

            } else { //Not a beam
                for (let i = activePlayerProjectiles.length - 1; i >= 0; i--) {
                  for (let j = gameState.enemies.length - 1; j >= 0; j--) {
                    if (gameState.enemies[j].alive && gameState.enemies[j].enemy && checkCollision(activePlayerProjectiles[i].projectile, {position: gameState.enemies[j].position, collision: gameState.enemies[j].renderable})) { //Correct
                        activePlayerProjectiles.splice(i, 1); // Remove projectile
                        gameState.enemies[j].alive = false;  // Use alive
                        break; // Inner loop break
                    }
                  }
                }
          }
    //Barrier Collisions
    handleProjectileBarrierCollisions(gameState.enemyLasers);

    if(!(gameState.playerWeapon instanceof Beam)){
      handleProjectileBarrierCollisions(activePlayerProjectiles);
    }

    // Enemy lasers hitting player, use the collision check
    for (let i = gameState.enemyLasers.length - 1; i >= 0; i--) {
        if (checkCollision(gameState.enemyLasers[i], {position: gameState.player.position, collision: gameState.player.renderable})) {
          gameState.gameOver = true;
            break;
        }
    }

  }

  function updatePhysics(deltaTime: number) {
    // Move enemy lasers
      moveProjectiles(gameState.enemyLasers, deltaTime);

      //Move Player Projectiles
      gameState.playerWeapon.updateProjectiles();

      //Enemy movement
      handleEnemyMovement(deltaTime);

    // Remove dead enemies.  Important to do it backwards.
      for(let i = gameState.enemies.length-1; i>=0; i--){
        if(gameState.enemies[i].enemy && !gameState.enemies[i].alive){
            gameState.enemies.splice(i,1);
        }
      }
      // Remove player projectiles.
      gameState.enemies = gameState.enemies.filter(e => !e.isPlayerProjectile || !e.projectile.isOffScreen() );
    }


    // --- Update ---
    function update(deltaTime: number) {
        if (gameState.gameOver) return;

        if (gameState.stageComplete) {
            if (Date.now() - gameState.stageCompleteTime > Constants.STAGE_COMPLETE_DURATION) {
                gameState.stageComplete = false;
                startNextLevel(); // Use the new function
            }
            return;
        }
        gameState.input = getCurrentInputState(); // Get the current input state and save to game state
        handleInput(gameState, weapons, deltaTime);  // Call the imported handleInput.  Pass weapons and deltaTime.
        updatePhysics(deltaTime);     // Pass deltaTime to updatePhysics
        handleCollisions();          // Handle collisions after movement

        // Check for stage completion
        if (gameState.enemies.every(enemy => !enemy.alive)) {
            gameState.stageComplete = true;
            gameState.stageCompleteTime = Date.now();
        }
    }

    // --- Game Loop ---
  let lastTime = 0;
  function gameLoop(currentTime: number) {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      update(deltaTime);
      renderGame(ctx, gameState); // Pass ctx to renderGame

      if (!gameState.gameOver) {
          requestAnimationFrame(gameLoop);
      }
  }
    function startNextLevel() {
        gameState.levelMultiplier++;
        initializeEnemies(gameState);
        initializeBarriers(gameState); //Re-init barriers
        gameState.enemyLasers = []; // Clear enemy lasers
        //Keep player where it is.
    }

    // --- Initialization ---
    setupInputHandling(); // Set up input listeners.  MUST BE BEFORE gameState.player
    gameState.player = createPlayer();
    initializeEnemies(gameState);
    initializeBarriers(gameState);

    lastTime = performance.now(); // Initialize lastTime for deltaTime
    gameLoop(lastTime); // Start the game loop, passing initial time

}

window.onload = () => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    main(canvas);
};