export function randomInt (min: number = 0, max: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}