import { ResOrArray } from '../types.js';
import { normalizeArray } from './normalizeArray.js';

export function trimChars(str: string, ...chars: ResOrArray<string>): string {
    chars = normalizeArray(chars);

    for (let char of chars) {
        str = str.replace(new RegExp(`^${char}+|${char}+$`, 'g'), '');
    }

    return str;
}