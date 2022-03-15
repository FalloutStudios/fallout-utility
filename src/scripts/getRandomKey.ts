import { randomInt } from "./randomInt";

export function getRandomKey (obj: any[]|any): any {
  const keys = typeof obj !== 'object' ? Object.keys([obj]) : Object.keys(obj);
  
  return keys[randomInt(0, (keys.length - 1))];
}