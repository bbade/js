// src/model.ts

export interface PositionComponent {
    x: number;
    y: number;
}

export interface RenderableComponent {
    width: number;
    height: number;
    color: string;
}

export interface CollisionComponent { // All entities with this are collidable
    width: number;
    height: number;
}

export interface HealthComponent {
    health: number;
    maxHealth: number;
}

export interface PlayerComponent {
    speed: number;
    laserCooldown: number;
    speedX: number;
}

export interface EnemyComponent {
    speed: number;
    fireChance: number;
}

export interface BarrierComponent {
  health: number[][];
}