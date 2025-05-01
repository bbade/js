import { Color } from "../../Color";
import { Rect } from "../../math/geometry/Rect";
import { Vec2 } from "../../math/vec2";
import { BgRect } from "./BgRect";
import { drawFgRect } from "./DrawRects";
import { SceneState } from "./RectGameBgMain";

export type PlayerInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  fire: boolean;
};

export type FgRect = {
  rect: Rect;
  fill: Color;
  stroke: Color;
  rotation: number;
  z: number;
};

export class RectGameFgManager {
  private player: Player;
  // private playerProjectiles: Projectile[]
  // private enemies: Enemy[];
  // private enemyProjectiles: Projectile[];

  constructor(sceneState: SceneState) {
    this.player = new Player(sceneState.bounds.center);
    // this.playerProjectiles = [];
    // this.enemies = [];
    // this.enemyProjectiles = [];

    // Initialize game state, input manager, etc.
  }

  update(deltaMs: number, input: PlayerInput) {
    this.player.update(deltaMs, input);
  }

  draw(
    context: CanvasRenderingContext2D,
    cameraHeight: number,
    viewportCenter: Vec2
  ) {
    drawFgRect(this.player.toFgRect(), cameraHeight, viewportCenter, context);
  }
}


class Player {
  center: Vec2 = new Vec2(0, 0);
  color: Color = Color.CYAN;
  static readonly speed: number = 0.5;
  static readonly size: number = 0.02;

  constructor(center: Vec2) {
    this.center = center;
  }

  bounds(): Rect {
    return Rect.fromCenter(this.center, Player.size, Player.size);
  }

  update(deltaMs: number, input: PlayerInput) {
    const delta = new Vec2(0, 0);
    if (input.left) {
      delta.x -= (Player.speed * deltaMs) / 1000;
    }
    if (input.right) {
      delta.x += (Player.speed * deltaMs) / 1000;
    }
    if (input.up) {
      delta.y += (Player.speed * deltaMs) / 1000;
    }
    if (input.down) {
      delta.y -= (Player.speed * deltaMs) / 1000;
    }

    this.center.add(delta);
  }

  toFgRect(): FgRect {
    return {
      rect: this.bounds(),
      fill: this.color,
      stroke: this.color,
      rotation: 0,
      z: 0,
    };
  }
}

// class Projectile implements Moveable, Drawable {

// }

interface Moveable {
  velocity: Vec2;

  move(deltaMs: number): void;
}

interface Drawable {}

// interface Collidable {

// }
