import { default as chalk } from 'chalk';

/**
 * Find and replace characters in a string
 * @param str Original string
 * @param find Strings to find
 * @param replace Replacement strings
 */
export function replaceAll (str: string, find: string | string[], replace: string | string[]): string {
    if (typeof find === 'string') find = [find];
    if (typeof replace === 'string') replace = [replace];
    if (find.length !== replace.length) throw new TypeError(`${chalk.yellow('find')} and ${chalk.yellow('replace')} parameters must be of the same length`);

    for (let i = 0; i < find.length; i++) {
        str = str.replace(new RegExp(find[i], 'g'), replace[i]);
    }

    return str;
}                       