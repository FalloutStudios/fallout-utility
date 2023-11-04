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
export function randomInt (max: number): number;
export function randomInt (min: number, max: number): number;
export function randomInt (min: number, max?: number): number {
    const { mx, mn } = {
        mx: max === undefined ? min : max,
        mn: max === undefined ? 0 : min
    };

    return Math.floor(Math.random() * (mx - mn + 1)) + mn;
}

/**
 * Formats number to K, M, B style
 * @param number Number to format
 */
export function formatNumber(number: number, locale: string = 'en-US'): string {
    if (number >= 1000000000) return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (number >= 1000000) return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (number >= 1000) return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return number.toLocaleString(locale);
}