import { SceneManager } from "scene-manager";

/**
 * These are concrete event handlers that translate events from
 * document coordinates into the coordinates of the current renderer
 */
export interface KeyHandler {
    handleKeyDown: (event: KeyboardEvent) => void;
}



export class InputListener {
    
    constructor(
        sceneManager: SceneManager
    ) {
        console.log("initializing listeners");

        if (!sceneManager) {
            throw new Error("SceneManager is required");
        }

        document.addEventListener("keydown", function (event: KeyboardEvent) {
            const keyboardEvent = event as KeyboardEvent;

            if (keyboardEvent.key === "`") {
                sceneManager.toggleScene();
                return;
            }

            sceneManager.getVisibleScene().handleKeyDown(keyboardEvent);
        });

    }
}
