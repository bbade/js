import { KeyHandler } from "documentKeyboardListener";
import { RendererCallbacks } from "renderer-callbacks";
import { World } from "world";

export class SceneManager {
    private visible: Scene;
    private hidden: Scene;
    private world: World;
    
    constructor(
        iso: Scene, 
        ortho: Scene,
        world: World
    ) {
        if (!iso) {
            throw new Error("Iso scene cannot be null or undefined");
        }
        if (!ortho) {
            throw new Error("Ortho scene cannot be null or undefined");
        }
        if (!world) {
            throw new Error("World cannot be null or undefined");
        }

        this.visible = iso;
        this.hidden = ortho;
        this.world = world;
    }
    
    toggleScene() {
        const temp = this.visible;
        this.visible = this.hidden;
        this.hidden = temp;
        
        this.visible.canvas.style.display = 'block';
        this.hidden.canvas.style.display = 'none';
``
        this.world.renderer = this.visible.renderer;
        this.visible.renderer.redraw();
    }
    
    getVisibleScene(): Scene {
        return this.visible;
    }
    
    getHiddenScene(): Scene {
        return this.hidden;
    }
    
}

export class Scene implements KeyHandler {

    canvas: HTMLCanvasElement;
    keyboardHandler: KeyHandler;
    renderer: RendererCallbacks;
    
    constructor(
        canvas: HTMLCanvasElement,
        keyboardCallbacks: KeyHandler,
        renderer: RendererCallbacks
    ) {
        if (!canvas) {
            throw new Error("Canvas element cannot be null or undefined");
        }
        if (!keyboardCallbacks) {
            throw new Error("Keyboard callbacks cannot be null or undefined");
        }
        if (!renderer) {
            throw new Error("Renderer callbacks cannot be null or undefined");
        }
        this.canvas = canvas;
        this.keyboardHandler = keyboardCallbacks;
        this.renderer = renderer;
    }
    
    handleKeyDown(event: KeyboardEvent): void {
        this.keyboardHandler.handleKeyDown(event);
        
    }
    
}
