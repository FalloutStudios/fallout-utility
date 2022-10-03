import { ResOrArray } from '../types.js';
import { normalizeArray } from './normalizeArray.js';

/**
 * 
 * Detects the string if has the given prefixes
 */
export function detectCommand (string: string, ...commandPrefix: ResOrArray<string>) {
    if (!string || !commandPrefix) return false;

    commandPrefix = normalizeArray(commandPrefix);
    for (let prefix of commandPrefix) {
        if (string.startsWith(prefix)) return true;
    }

    return false;
}