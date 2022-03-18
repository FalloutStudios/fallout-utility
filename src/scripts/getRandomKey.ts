import { randomInt } from "./randomInt";

/**
 * 
 * Get random key from array or properties of an object
 */
export function getRandomKey (obj: any[]|any): any {
  const keys = typeof obj !== 'object' ? Object.keys([obj]) : Object.keys(obj);
  
  return keys[randomInt(0, (keys.length - 1))];
}