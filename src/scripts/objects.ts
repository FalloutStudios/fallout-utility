import { RestOrArray } from '../types';
import { randomInt } from './numbers';

/**
 * Normalize an array given from a rest param
 * @param array Rest data
 */
export function normalizeArray<T>(array: RestOrArray<T>): T[] {
    return Array.isArray(array[0]) ? array[0] : array as T[];
}

/**
 * Get random key from array or properties of an object
 * @param obj Get random key from this object
 */
export function getRandomKey<T extends unknown[]>(obj: T): T[0];
export function getRandomKey<T extends {}>(obj: T): keyof T;
export function getRandomKey<T = unknown>(obj: any): T {
    if (typeof obj !== "object") throw new Error(`${typeof obj} is not an object`);

    const keys = Array.isArray(obj) ? obj : Object.keys(obj as unknown[]);
    return keys[randomInt(0, (keys.length - 1))];
}