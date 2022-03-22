import { randomInt } from "./randomInt";

/**
 * 
 * Get random key from array or properties of an object
 */
export function getRandomKey (obj: any[]|any): any {
  if (typeof obj !== "object") return obj;
  const keys = obj instanceof Array ? obj : Object.keys(obj);
  
  return keys[randomInt(0, (keys.length - 1))];
}