/**
 * Loop string
 * @param num How many times to loop string
 * @param string String to loop
 */
export function loopString (num: number = 0, string: string = ''): string {
    let returnVal = '';
    for (let i = 0; i < num; i++) { returnVal += string; }
    return returnVal;
}