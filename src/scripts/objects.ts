import { replaceAll } from './strings';
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

/**
 * Slice array values into chunks
 * @param arr Array to slice
 * @param chunkSize Chunk size
 */
export function sliceIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
    const res: T[][] = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }

    return res;
}

/**
 * Replace values inside an object recursively
 * @param object Object to replace values from
 * @param find String to replace
 * @param replace Replacement string
 */
export function recursiveObjectReplaceValues<T extends string|{}|[]>(object: T, find: string[], replace: string[]): T;
export function recursiveObjectReplaceValues<T extends string|{}|[]>(object: T, find: string, replace: string): T;
export function recursiveObjectReplaceValues<T extends string|{}|[]>(object: T, _find: string|string[], _replace: string|string[]): T {
    const find = typeof _find === 'object' ? _find : [_find];
    const replace = typeof _replace === 'object' ? _replace : [_replace];

    if (typeof object !== 'object') return typeof object !== 'string' ? object : replaceAll(object, find, replace) as T;
    if (Array.isArray(object)) return object.map(v => typeof v === 'string' ? replaceAll(v, find, replace) : recursiveObjectReplaceValues(v, find, replace)) as T;

    const keys = object ? Object.keys(object) : [];
    const values = Object.values(object!);

    let newObject = {};
    let i = 0;

    for (const value of values) {
        newObject = {
            ...newObject,
            [keys[i]]: typeof value === 'string' || typeof value === 'object'
                ? recursiveObjectReplaceValues(value, find, replace)
                : value
        };

        i++;
    }

    return newObject as T;
}

/**
 * Check if an object is from a class
 * @param object Object to check
 */
function isClass<T>(object: any): object is T {
    const isClassConstructor = object.constructor && object.constructor.toString().substring(0, 5) === 'class';
    if (object.prototype === undefined) return isClassConstructor;

    const isPrototypeClassConstructor = object.prototype.constructor && object.prototype.constructor.toString && object.prototype.constructor.toString().substring(0, 5) === 'class';
    return isClassConstructor || isPrototypeClassConstructor;
}