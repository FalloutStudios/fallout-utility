/**
 * 
 * Checks if the given value is a finite number.
 */
export function isNumber (value: unknown): value is number {
    return !isNaN(parseFloat(value as any)) && isFinite(value as any);
}