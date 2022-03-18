import { escapeRegExp } from './escapeRegExp';

/**
 * Split a string into an array of strings
 * @param str String to split
 * @param removeQuotations Whether to trim quotation marks from the string if they exist
 * @param separator Split separator
 */
export function splitString (str: string, removeQuotations: boolean = false, separator: string = ' '): string[] {
    let regex = new RegExp(`(?<=^[^\"]*(?:\"[^\"]*\"[^\"]*)*)${separator}(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)`);
    
    const text = escapeRegExp(str.toString().trim());
    const matches = text.split(regex);

    let newText = [];
    for (let word of matches) {
        word = word.replace(/(?:\\(.))/, '$1');
        word = removeQuotations && word.startsWith('"') && word.endsWith('"') ? word.replace(/(^\"+|\"+$)/g, '') : word;

        newText.push(word);
    }

    return newText;
}