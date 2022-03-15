import { escapeRegExp } from './escapeRegExp';
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