import { getRandomValues } from 'crypto';

/**
 * 
 * Checks if the given value is a finite number
 * @param value Check if this can be a number
 */
export function isNumber(value: unknown): boolean {
    return !isNaN(parseFloat(String(value))) && isFinite(Number(value));
}

/**
 * Random integer between min and max (inclusive)
 * @param min Minimum value
 * @param max Maximum value
 */
export function randomInt(max: number): number;
export function randomInt(min: number, max: number): number;
export function randomInt(min: number, max?: number): number {
    const randomBuffer = new Uint32Array(1);

    getRandomValues(randomBuffer);

    let randomNumber = randomBuffer[0] / (0xffffffff + 1);

    const { mx, mn } = {
        mx: max === undefined ? min : max,
        mn: max === undefined ? 0 : min
    };

    return Math.floor(randomNumber * (mx - mn + 1)) + mn;
}

/**
 * Formats number to K, M, B style
 * @param number Number to format
 */
export function formatNumber(number: number, locale: string = 'en-US'): string {
    return number.toLocaleString(locale, {
        maximumFractionDigits: 2,
        compactDisplay: 'short',
        notation: 'compact'
    });
}

/**
 * Gets an avarage of list of numbers
 * @param numbers List of numbers
 */
export function avarageNumbers(numbers: number[]): number {
    return numbers.reduce((p, c) => p + c, 0) / numbers.length;
}