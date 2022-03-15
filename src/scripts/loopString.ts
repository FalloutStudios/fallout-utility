export function loopString (num: number = 0, string: string = ''): string {
    let returnVal = '';
    for (let i = 0; i < num; i++) { returnVal += string; }
    return returnVal;
}