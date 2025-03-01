// src/input.ts

export interface InputState {
    ArrowLeft: boolean;
    ArrowRight: boolean;
    Space: boolean;  // For firing
    Key1: boolean;    // For weapon selection
    Key2: boolean;
    Key3: boolean;
    Key4: boolean;
    Key5: boolean;
    [key: string]: boolean; // Allow for other keys, if needed
}

class InputHandler {
    private keys: { [key: string]: boolean };
    private static instance: InputHandler;

    private constructor() {
        this.keys = {};
    }
    public static getInstance():InputHandler {
        if (!InputHandler.instance) {
            InputHandler.instance = new InputHandler();
        }
        return InputHandler.instance;
    }

    setup(): void {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true; // Use e.code for consistency
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    getInputState(): InputState {
        // Create a new object with the specific keys we care about.  This
        // avoids exposing the internal `this.keys` directly and gives us
        // type safety.
        return {
            ArrowLeft: !!this.keys['ArrowLeft'], // Use more descriptive names.  !! converts to boolean.
            ArrowRight: !!this.keys['ArrowRight'],
            Space: !!this.keys['Space'],
            Key1: !!this.keys['Digit1'],  // Use 'Digit1', 'Digit2', etc. for number keys.
            Key2: !!this.keys['Digit2'],
            Key3: !!this.keys['Digit3'],
            Key4: !!this.keys['Digit4'],
            Key5: !!this.keys['Digit5'],
            ...this.keys //Include all other keys.
        };
    }
}
//Make input handler a singleton, since we only ever want one.
const inputHandler = InputHandler.getInstance();

export function getCurrentInputState(): InputState {
    return inputHandler.getInputState();
}
export function setupInputHandling(): void {
    inputHandler.setup();
}