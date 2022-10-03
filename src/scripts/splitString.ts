import { escapeRegExp } from './escapeRegExp.js';
import { trimChars } from "./trimChar.js";

/**
 * Split a string into an array of strings
 * @param str String to split
 * @param removeQuotations Whether to trim quotation marks from the string if they exist
 * @param separator Split separator
 */
export function splitString (str: string, removeQuotations: boolean = false, separator: string = ' '): string[] {
    let regex = new RegExp(`(?<=^[^\"]*(?:\"[^\"]*\"[^\"]*)*)${escapeRegExp(separator)}(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)`);

    const text = str.toString().trim();
    const matches = text.split(regex);
    const newText: string[] = [];

    for (let word of matches) {
        word = removeQuotations && word.startsWith('"') && word.endsWith('"') ? trimChars(word, '"') : word;
        newText.push(word);
    }

    return newText;
}