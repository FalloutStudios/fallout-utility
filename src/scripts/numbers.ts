/**
 * 
 * Checks if the given value is a finite number
 * @param value Check if this can be a number
 */
export function isNumber (value: unknown): value is number {
    return !isNaN(parseFloat(value as any)) && isFinite(value as any);
}

/**
 * Random integer between min and max (inclusive)
 * @param min Minimum value
 * @param max Maximum value
 */
export function randomInt (min: number = 0, max: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}