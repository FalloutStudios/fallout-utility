import { randomInt } from "./randomInt.js";

/**
 * 
 * Get random key from array or properties of an object
 */
export function getRandomKey<T extends unknown[]>(obj: T): T[0];
export function getRandomKey<T extends {}>(obj: T): keyof T;
export function getRandomKey<T = unknown>(obj: any): T {
    if (typeof obj !== "object") throw new Error(`${typeof obj} is not an object`);

    const keys = Array.isArray(obj) ? obj : Object.keys(obj as unknown[]);
    return keys[randomInt(0, (keys.length - 1))];
}