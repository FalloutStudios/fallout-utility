import { randomInt } from "./randomInt.js";

/**
 * 
 * Get random key from array or properties of an object
 */
export function getRandomKey<T extends any = any>(obj: any): T {
  if (typeof obj !== "object") return obj;
  const keys = Array.isArray(obj) ? obj : Object.keys(obj);

  return keys[randomInt(0, (keys.length - 1))];
}