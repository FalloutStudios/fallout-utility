import { normalizeArray } from './objects';
import { RestOrArray } from '../types';
import kleur from 'kleur';
import split from 'split-string';

export { kleur };

/**
 * Escape a string to be used as a regular expression
 * @param string Escape regex from this string
 */
export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Trim characters from string
 * @param string Trim characters from this string
 * @param chars Trim this characters from string
 */
export function trimChars(string: string, ...chars: RestOrArray<string>): string {
    chars = normalizeArray(chars);

    for (let char of chars) {
        string = string.replace(new RegExp(`^${char}+|${char}+$`, 'g'), '');
    }

    return string;
}

/**
 * Detects the string if has the given prefixes
 * @param string Check this string for prefixes
 * @param find Check if string starts with at least one of these strings
 */
export function startsWith(string: string, ...find: RestOrArray<string>): boolean {
    find = normalizeArray(find);

    for (const prefix of find) {
        if (string.startsWith(prefix)) return true;
    }

    return false;
}

/**
 * Limit text to a certain number of characters with a suffix
 */
export function limitString(string: string = '', limit: number = 0, endsWith: string|undefined = '...'): string {
    return string.length >= limit ? string.slice(0, limit) + (endsWith ?? '') : string;
}

/**
 * Split a string into an array of strings
 * @param string String to split
 * @param removeQuotations Whether to trim quotation marks from the string if they exist
 * @param separator Split separator
 */
export function splitString(string: string, removeQuotations: boolean = false, separator: string = ' '): string[] {
    return split(string, {
        brackets: true,
        quotes: true,
        separator,
        keep: (value, state) => value !== '\\' && (value !== '"' || state.prev() === '\\')
    });

    let regex = new RegExp(`(?<=^[^\"]*(?:\"[^\"]*\"[^\"]*)*)${escapeRegExp(separator)}(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)`);

    const text = string.toString().trim();
    const matches = text.split(regex);
    const newText: string[] = [];

    for (let word of matches) {
        word = removeQuotations && word.startsWith('"') && word.endsWith('"') ? trimChars(word, '"') : word;
        newText.push(word);
    }

    return newText;
}

/**
 * Removes extra spaces from text
 * @param text Text to remove extra spaces from
 */
export function removeUnecessarySpaces(text: string): string {
    return text.trim().split(' ').filter(Boolean).join(' ');
}

/**
 * Find and replace characters in a string
 * @param string Original string
 * @param find Strings to find
 * @param replace Replacement strings
 */
export function replaceAll(string: string, find: string[], replace: string[]): string;
export function replaceAll(string: string, find: string, replace: string): string;
export function replaceAll(string: string, find: string | string[], replace: string | string[]): string {
    if (typeof find === 'string') find = [find];
    if (typeof replace === 'string') replace = [replace];
    if (find.length !== replace.length) throw new TypeError(`${kleur.cyan('find')} and ${kleur.cyan('replace')} parameters must be of the same length.`);

    for (let i = 0; i < find.length; i++) {
        string = string.replace(new RegExp(find[i], 'g'), replace[i]);
    }

    return string;
}