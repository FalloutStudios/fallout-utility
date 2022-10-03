import { ResOrArray } from '../types.js';

export function normalizeArray<T>(array: ResOrArray<T>): T[] {
    return Array.isArray(array[0]) ? array[0] : array as T[];
}