/**
 * Keys.ts
 * Simple library for tracking currently pressed keys, designed for use with modules.
 */

// Define an interface for the structure of the Keys object
interface IKeys {
    downKeys: { [key: string]: boolean }; // Dictionary mapping event.code (string) to boolean
    preventDefaultKeys: string[];
    init: () => void; // Method signature for init
    isDown: (keyCode: string) => boolean; // Method signature for isDown
}

// Export the Keys constant so it can be imported by other modules.
export const Keys: IKeys = {
    // Dictionary to store the state of currently pressed keys.
    downKeys: {},

    // List of key codes that often cause unwanted browser behavior (e.g., scrolling)
    preventDefaultKeys: [
        "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
        "Space", "Tab" // Add other keys as needed
    ],

    /**
     * Initialize the key listeners. This should be called by the code
     * that imports this module.
     */
    init: function(): void {
        // Prevent adding listeners multiple times if init is called more than once
        // (Simple check, could be more robust if needed)
        if ((this as any)._initialized) {
             console.warn("Keys.init() called more than once.");
             return;
        }

        // Add event listener for keydown events on the window.
        // Explicitly type the event parameter as KeyboardEvent.
        // Use arrow function to ensure 'this' refers to the Keys object.
        const handleKeyDown = (event: KeyboardEvent): void => {
            this.downKeys[event.code] = true;
            if (this.preventDefaultKeys.includes(event.code)) {
                event.preventDefault();
            }
            // console.log('Key down:', event.code);
        };

        // Add event listener for keyup events on the window.
        // Use arrow function to ensure 'this' refers to the Keys object.
        const handleKeyUp = (event: KeyboardEvent): void => {
            delete this.downKeys[event.code];
            // console.log('Key up:', event.code);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Store references to listeners if you need to remove them later (e.g., in a destroy method)
        // (this as any)._keyDownListener = handleKeyDown;
        // (this as any)._keyUpListener = handleKeyUp;

        (this as any)._initialized = true; // Mark as initialized
        console.log("Keys.ts initialized.");
    },

    /**
     * Checks if a specific key is currently pressed.
     * @param {string} keyCode - The event.code of the key to check (e.g., "KeyW").
     * @returns {boolean} True if the key is currently down, false otherwise.
     */
    isDown: function(keyCode: string): boolean {
        return this.downKeys[keyCode] === true;
    }

    // Optional: Add a cleanup method if needed
    /*
    destroy: function(): void {
        if ((this as any)._keyDownListener) {
            window.removeEventListener('keydown', (this as any)._keyDownListener);
        }
        if ((this as any)._keyUpListener) {
            window.removeEventListener('keyup', (this as any)._keyUpListener);
        }
        this.downKeys = {};
        (this as any)._initialized = false;
        console.log("Keys listeners removed.");
    }
    */
};

// --- DO NOT Initialize automatically when using modules ---
// The importing script should call Keys.init()
// Keys.init();
