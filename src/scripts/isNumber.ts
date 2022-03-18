/**
 * 
 * Checks if the given value is a finite number.
 */
export function isNumber (value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
}