
export class Color {
    r: number;
    g: number;
    b: number;


    constructor(r: number = 0, g: number = 0, b: number = 0) {
        this.r = Math.floor(r);
        this.g = Math.floor(g);
        this.b = Math.floor(b);
    }

    copy(): Color {
        return new Color(this.r, this.g, this.b);
    }

    static fromHex(hex: string): Color {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return new Color(r, g, b);
    }

    toHexStr(): string {
        const r = this.r.toString(16).padStart(2, '0');
        const g = this.g.toString(16).padStart(2, '0');
        const b = this.b.toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }

    scaleBrightness( value: number): Color {
        const color = this;
        if (color.r < 0 || color.r > 255 || color.g < 0 || color.g > 255 || color.b < 0 || color.b > 255) {
            throw new Error(`RGB values must be between 0 and 255 inclusive. ${color.r}, ${color.g},${color.b}, ${value}`);
        }
        if (value < 0 || value > 1) {
            throw new Error(`Brightness value must be between 0 and 1 inclusive: ${value}`);
        }
    
        // Scale each color component by the brightness value.
        color.r = Math.round(color.r * value);
        color.g = Math.round(color.g * value);
        color.b = Math.round(color.b * value);
        return this;
    }
    

    static readonly RED = new Color(255, 0, 0);
    static readonly GREEN = new Color(0, 255, 0);
    static readonly BLUE = new Color(0, 0, 255);
    static readonly YELLOW = new Color(255, 255, 0);
    static readonly CYAN = new Color(0, 255, 255);
    static readonly MAGENTA = new Color(255, 0, 255);
    static readonly PINK = new Color(255, 192, 203);
    static readonly GRAY = new Color(128, 128, 128);
    static readonly WHITE = new Color(255, 255, 255);
    static readonly BLACK = new Color(0, 0, 0);
}

/**
 * TODO: deprecate
 * @param color 
 * @param value  0-1
 */
export function scaleBrightness_deprecated(color: Color, value: number): void {
    if (color.r < 0 || color.r > 255 || color.g < 0 || color.g > 255 || color.b < 0 || color.b > 255) {
        throw new Error(`RGB values must be between 0 and 255 inclusive. ${color.r}, ${color.g},${color.b}, ${value}`);
    }
    if (value < 0 || value > 1) {
        throw new Error(`Brightness value must be between 0 and 1 inclusive: ${value}`);
    }

    // Scale each color component by the brightness value.
    color.r = Math.round(color.r * value);
    color.g = Math.round(color.g * value);
    color.b = Math.round(color.b * value);
}

/**
 * TODO: deprecate
 * @param color 
 * @param value  0-1
 */
export function scaleBrightness(color: Color, value: number): Color {
    if (color.r < 0 || color.r > 255 || color.g < 0 || color.g > 255 || color.b < 0 || color.b > 255) {
        throw new Error(`RGB values must be between 0 and 255 inclusive. ${color.r}, ${color.g},${color.b}, ${value}`);
    }
    if (value < 0 || value > 1) {
        throw new Error(`Brightness value must be between 0 and 1 inclusive: ${value}`);
    }

    return color.copy().scaleBrightness(    value);
}
