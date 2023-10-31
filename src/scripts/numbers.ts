/**
 * 
 * Checks if the given value is a finite number
 * @param value Check if this can be a number
 */
export function isNumber (value: unknown): boolean {
    return !isNaN(parseFloat(String(value))) && isFinite(Number(value));
}

/**
 * Random integer between min and max (inclusive)
 * @param min Minimum value
 * @param max Maximum value
 */
export function randomInt (min: number = 0, max: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formats number to K, M, B style
 * @param number Number to format
 */
export function formatNumber(number: number): string {
    if (number >= 1000000000) return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (number >= 1000000) return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (number >= 1000) return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(number.toLocaleString('en-US'));
}