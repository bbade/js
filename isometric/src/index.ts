// src/index.ts
import './buttons'; // Import buttons to ensure it runs
import Buttons from './buttons';
import { InputListener, KeyHandler } from './documentKeyboardListener';
import { IsoRenderer } from './iso-renderer';
import './world';   // Import world to ensure it runs
import { IsometricContext } from 'iso-context';
import { World } from './world';

import { IsometricEventHandler } from 'iso-event-handler';
import { IsoViewport } from 'iso-viewport';
import { RendererCallbacks } from 'renderer-callbacks';
import { OrthoViewport } from 'ortho-viewport';
import { Scene, SceneManager } from 'scene-manager';


const isoCanvas = document.getElementById("iso-canvas") as HTMLCanvasElement;
const isoCtx = new IsometricContext(isoCanvas);

const orthoCanvas = document.getElementById("ortho-canvas") as HTMLCanvasElement;

const world = new World(16, 16);
const buttonEventHandler = new Buttons(world.eventHandler);
const isoViewport = new IsoViewport(world, isoCtx);
const isoEventHandler = new IsometricEventHandler(isoCanvas, isoCtx, world.eventHandler, isoViewport); // Create IsometricEventHandler instance

const isoRenderer = new IsoRenderer(isoCtx, world, isoViewport); // Create IsoRenderer instance

const orthoViewport = new OrthoViewport(orthoCanvas, world);

const sceneManager = new SceneManager(
    new Scene(isoCanvas, isoEventHandler, isoRenderer),
    new Scene(orthoCanvas, orthoViewport, orthoViewport),
    world
);


const keyboardListener = new InputListener(
    sceneManager
);

