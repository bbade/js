export function sortaEqual(a: number, b: number, wiggle: number = .001): boolean {
    return  Math.abs(a - b ) <= wiggle;
}