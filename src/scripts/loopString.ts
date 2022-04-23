/**
 * Loop string
 * @param num How many times to loop string
 * @param string String to loop
 * @deprecated
 */
export function loopString (num: number = 0, string: string = ''): string {
    let returnVal = '';

    process.emitWarning(`loopString is deprecated. Use string.repeat instead.`, 'DeprecationWarning');

    for (let i = 0; i < num; i++) { returnVal += string; }
    return returnVal;
}