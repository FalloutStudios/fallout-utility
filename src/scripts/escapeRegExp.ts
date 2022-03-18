/**
 * 
 * Escape a string to be used as a regular expression
 */
export function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}